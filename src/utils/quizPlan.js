import { PRACTICE_GROUPS, PRACTICE_QUESTIONS, QUESTIONS, topics } from "../data/index.js";
import { normalizeQuestion } from "../data/schema/questionTypes.js";
import { getQuestionId, getStatsSummary, loadQuizStats } from "./stats.js";
import { shuffleArray, shuffleQuestionOptions } from "./shuffle.js";

function getAllQuestionsWithTopics() {
  return topics.flatMap((topic) =>
    QUESTIONS[topic].map((question) => ({ ...question, topic }))
  );
}

function getQuestionText(question) {
  return question.q ?? question.prompt ?? "";
}

function defaultStats() {
  return {
    attempts: 0,
    correct: 0,
    incorrect: 0,
    lastWrongAt: null,
  };
}

function mapQuestionsToPool(questions) {
  const store = loadQuizStats();

  return questions.map((question) => {
    const id = getQuestionId(question.topic, getQuestionText(question));
    const stats = store.questions[id] ?? defaultStats();

    return {
      id,
      topic: question.topic,
      attempts: stats.attempts,
      correct: stats.correct,
      incorrect: stats.incorrect,
      lastWrongAt: stats.lastWrongAt,
      question,
    };
  });
}

function buildPayload(mode, pool, { topic, practiceLabel, size } = {}) {
  const summary = getStatsSummary(loadQuizStats());
  const recentModes = summary.sessions.slice(0, 3).map((session) => session.modeLabel);

  return {
    mode,
    topic,
    practiceLabel,
    size,
    pool: pool.map(
      ({ id, topic: entryTopic, attempts, correct, incorrect, lastWrongAt, question }) => ({
        id,
        topic: entryTopic,
        questionType: question.type,
        attempts,
        correct,
        incorrect,
        lastWrongAt,
      })
    ),
    summary: {
      totalQuizzes: summary.totalQuizzes,
      accuracy: summary.accuracy,
      recentModes,
    },
  };
}

export function buildMcqQuizQuestions(mode, topic, size) {
  let questions;
  if (mode === "topic") {
    questions = QUESTIONS[topic].map((question) => ({ ...question, topic }));
  } else {
    questions = getAllQuestionsWithTopics();
  }

  const shuffled = shuffleArray(questions);
  const selected = mode === "mini" ? shuffled.slice(0, size) : shuffled;

  return selected.map((question) => shuffleQuestionOptions(question));
}

export function buildQuestionPool(mode, topic, size) {
  const questions =
    mode === "topic"
      ? QUESTIONS[topic].map((question) => ({ ...question, topic }))
      : getAllQuestionsWithTopics();

  const pool = mapQuestionsToPool(questions);

  return {
    pool,
    payload: buildPayload(mode, pool, {
      topic: mode === "topic" ? topic : undefined,
      size: mode === "mini" ? size : undefined,
    }),
  };
}

export function buildPracticeQuestionPool(label) {
  const group = PRACTICE_GROUPS.find((entry) => entry.label === label);
  if (!group) throw new Error(`Unknown practice group: ${label}`);

  const questions = PRACTICE_QUESTIONS[label].map((question) => ({ ...question }));
  const pool = mapQuestionsToPool(questions);
  const summary = getStatsSummary(loadQuizStats());
  const recentModes = summary.sessions.slice(0, 3).map((session) => session.modeLabel);

  return {
    pool,
    questionType: group.type,
    payload: {
      practiceLabel: label,
      questionType: group.type,
      seeds: pool.map(({ id, topic: entryTopic, attempts, incorrect, question }) => ({
        sourceId: id,
        topic: entryTopic,
        attempts,
        incorrect,
        question,
      })),
      summary: {
        totalQuizzes: summary.totalQuizzes,
        accuracy: summary.accuracy,
        recentModes,
      },
    },
  };
}

export async function fetchPracticeQuiz(payload) {
  const response = await fetch("/api/practice-quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `Practice quiz request failed (${response.status})`);
  }

  return response.json();
}

export function applyPracticeQuiz(pool, quiz, questionType) {
  const seedsById = new Map(pool.map((entry) => [entry.id, entry]));

  return quiz.questions.map(({ sourceId, question }) => {
    const seed = seedsById.get(sourceId);
    const topic = seed?.topic ?? question.topic ?? null;

    return normalizeQuestion(
      {
        ...question,
        type: questionType,
        topic,
        id: question.id ?? `${sourceId}::ai-variant`,
        metadata: {
          ...(question.metadata ?? {}),
          aiGenerated: true,
          sourceId,
        },
      },
      { topic }
    );
  });
}

export function fallbackPracticeQuiz(pool) {
  const ordered = shuffleArray([...pool]).sort(
    (a, b) => b.incorrect - a.incorrect || b.attempts - a.attempts
  );

  return {
    strategy: "offline_fallback",
    rationale: "Using original practice questions — AI generation is unavailable.",
    questions: ordered.map((entry) => ({
      sourceId: entry.id,
      question: entry.question,
    })),
  };
}

export async function resolvePracticeQuiz(payload, pool, questionType) {
  try {
    const quiz = await fetchPracticeQuiz(payload);
    return {
      questions: applyPracticeQuiz(pool, quiz, questionType),
      rationale: quiz.rationale,
      usedFallback: false,
    };
  } catch {
    const quiz = fallbackPracticeQuiz(pool);
    return {
      questions: applyPracticeQuiz(pool, quiz, questionType),
      rationale: quiz.rationale,
      usedFallback: true,
    };
  }
}

export async function fetchQuizPlan(payload) {
  const response = await fetch("/api/quiz-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `Quiz plan request failed (${response.status})`);
  }

  return response.json();
}

export function fallbackQuizPlan(pool, mode, size) {
  const ordered = shuffleArray([...pool]);
  const selected = mode === "mini" ? ordered.slice(0, size) : ordered;

  return {
    strategy: "offline_fallback",
    rationale:
      mode === "practice"
        ? "Using offline mix — reordering practice questions based on your history."
        : "Using offline mix — shuffling options on questions you've practiced before.",
    questions: selected.map((entry) => ({
      id: entry.id,
      shuffleOptions: mode === "practice" ? false : entry.attempts >= 2,
    })),
  };
}

export function applyQuizPlan(pool, plan) {
  const poolById = new Map(pool.map((entry) => [entry.id, entry]));

  return plan.questions.map(({ id, shuffleOptions }) => {
    const entry = poolById.get(id);
    if (!entry) throw new Error(`Unknown question id in plan: ${id}`);

    const base = normalizeQuestion({ ...entry.question, topic: entry.topic }, { topic: entry.topic });
    return shuffleOptions && base.type === "mcq" ? shuffleQuestionOptions(base) : base;
  });
}

export async function resolveQuizPlan(payload, pool, mode, size) {
  try {
    const plan = await fetchQuizPlan(payload);
    return { plan, usedFallback: false };
  } catch {
    return {
      plan: fallbackQuizPlan(pool, mode, size),
      usedFallback: true,
    };
  }
}
