import { describe, expect, test } from "bun:test";
import { QUESTIONS } from "../data/index.js";
import {
  applyQuizPlan,
  applyPracticeQuiz,
  buildMcqQuizQuestions,
  buildPracticePlanNotice,
  buildPracticeQuestionPool,
  fallbackPracticeQuiz,
  fallbackQuizPlan,
  getPracticeLoadingMessage,
  resolveChapterQuizQuestions,
  resolvePracticeQuiz,
  resolveQuizPlan,
} from "./quizPlan.js";

const sampleQuestion = {
  q: "What is a debit?",
  options: ["Increase asset", "Decrease asset", "Increase liability", "Close account"],
  answer: 0,
  explanation: "Debits increase assets.",
};

function makePoolEntry(id, topic, attempts = 0) {
  return {
    id,
    topic,
    attempts,
    correct: 0,
    incorrect: 0,
    lastWrongAt: null,
    question: { ...sampleQuestion, q: `${sampleQuestion.q} (${id})`, topic },
  };
}

describe("applyQuizPlan", () => {
  test("orders questions and shuffles options when flagged", () => {
    const pool = [
      makePoolEntry("topic::q1", "Ch 1: Introduction to Accounting"),
      makePoolEntry("topic::q2", "Ch 2: The Recording Process", 3),
    ];

    const plan = {
      strategy: "test",
      rationale: "Test plan",
      questions: [
        { id: "topic::q2", shuffleOptions: true },
        { id: "topic::q1", shuffleOptions: false },
      ],
    };

    const result = applyQuizPlan(pool, plan);

    expect(result).toHaveLength(2);
    expect(result[0].q).toContain("q2");
    expect(result[0].displayOptions).toBeDefined();
    expect(result[1].displayOptions).toBeUndefined();
  });
});

describe("buildMcqQuizQuestions", () => {
  test("shuffles MCQ order and answer options", () => {
    const topic = "Ch 2: The Recording Process";
    const result = buildMcqQuizQuestions("topic", topic);

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((question) => question.displayOptions)).toBe(true);
    expect(result.every((question) => typeof question.displayAnswer === "number")).toBe(true);
  });

  test("limits mini quizzes to requested size", () => {
    const result = buildMcqQuizQuestions("mini", null, 5);
    expect(result).toHaveLength(5);
  });

  test("limits chapter quizzes to requested size without duplicates", () => {
    const topic = "Ch 2: The Recording Process";
    const result = resolveChapterQuizQuestions(topic, 5);

    expect(result.actualSize).toBe(5);
    expect(result.questions).toHaveLength(5);
    expect(new Set(result.questions.map((question) => question.id)).size).toBe(5);
  });

  test("includes all chapter questions when all is selected", () => {
    const topic = "Ch 2: The Recording Process";
    const available = QUESTIONS[topic].length;
    const result = resolveChapterQuizQuestions(topic, "all");

    expect(result.actualSize).toBe(available);
    expect(result.questions).toHaveLength(available);
    expect(result.notice).toBeNull();
  });
});

describe("buildPracticeQuestionPool", () => {
  test("builds a practice payload for AI content generation", () => {
    const { pool, payload, questionType } = buildPracticeQuestionPool("Journal Entries");

    expect(pool.length).toBeGreaterThan(0);
    expect(payload.practiceLabel).toBe("Journal Entries");
    expect(questionType).toBe("journal_entry");
    expect(payload.seeds.length).toBe(pool.length);
    expect(pool.every((entry) => entry.question.type === "journal_entry")).toBe(true);
  });
});

describe("applyPracticeQuiz", () => {
  test("normalizes AI-generated practice questions", () => {
    const pool = [
      {
        id: "seed-1",
        topic: "Ch 2: The Recording Process",
        attempts: 0,
        correct: 0,
        incorrect: 0,
        lastWrongAt: null,
        question: {
          type: "journal_entry",
          q: "Original question",
          answer: { lines: [] },
          explanation: "Original",
        },
      },
    ];

    const quiz = {
      strategy: "test",
      rationale: "Test",
      questions: [
        {
          sourceId: "seed-1",
          question: {
            type: "journal_entry",
            q: "AI variant question",
            answer: { lines: [{ account: "Cash", side: "debit", amount: 100 }] },
            explanation: "Variant",
          },
        },
      ],
    };

    const result = applyPracticeQuiz(pool, quiz, "journal_entry");
    expect(result[0].prompt).toBe("AI variant question");
    expect(result[0].metadata.aiGenerated).toBe(true);
  });
});

describe("fallbackPracticeQuiz", () => {
  test("returns original practice questions when AI is unavailable", () => {
    const pool = [
      makePoolEntry("seed-1", "Ch 1: Introduction to Accounting"),
      makePoolEntry("seed-2", "Ch 2: The Recording Process", 2),
    ];

    const quiz = fallbackPracticeQuiz(pool);
    expect(quiz.questions).toHaveLength(2);
    expect(quiz.rationale).toContain("original practice questions");
  });
});

describe("practice helpers", () => {
  test("builds a short practice loading message", () => {
    expect(getPracticeLoadingMessage()).toBe(
      "This usually takes 10–20 seconds — please keep this tab open."
    );
  });

  test("builds warning notice when AI fallback is used", () => {
    const notice = buildPracticePlanNotice({
      usedFallback: true,
      label: "Journal Entries",
      errorMessage: "Practice quiz request failed (503)",
    });

    expect(notice.variant).toBe("warning");
    expect(notice.title).toContain("original questions");
    expect(notice.message).toContain("503");
  });

  test("builds info notice when AI generation succeeds", () => {
    const notice = buildPracticePlanNotice({
      usedFallback: false,
      label: "Journal Entries",
      rationale: "Fresh journal scenarios based on your weak areas.",
    });

    expect(notice.variant).toBe("info");
    expect(notice.message).toContain("Fresh journal scenarios");
  });
});

describe("resolvePracticeQuiz", () => {
  test("falls back when practice API fails", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ error: "Unavailable" }), { status: 503 });

    try {
      const { pool, payload, questionType } = buildPracticeQuestionPool("Numeric Input");
      const result = await resolvePracticeQuiz(payload, pool, questionType);

      expect(result.usedFallback).toBe(true);
      expect(result.questions.length).toBe(pool.length);
      expect(result.errorMessage).toContain("Unavailable");
      expect(result.questions.every((question) => !question.metadata?.aiGenerated)).toBe(true);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("treats server offline fallback as non-AI questions", async () => {
    const originalFetch = globalThis.fetch;

    try {
      const { pool, payload, questionType } = buildPracticeQuestionPool("Numeric Input");
      globalThis.fetch = async () =>
        new Response(
          JSON.stringify({
            strategy: "offline_fallback",
            rationale: "Using original practice questions — AI generation is unavailable.",
            questions: pool.map((entry) => ({
              sourceId: entry.id,
              question: entry.question,
            })),
          }),
          { status: 200 }
        );

      const result = await resolvePracticeQuiz(payload, pool, questionType);

      expect(result.usedFallback).toBe(true);
      expect(result.questions.every((question) => !question.metadata?.aiGenerated)).toBe(true);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});

describe("fallbackQuizPlan", () => {
  test("returns mini quiz with expected size", () => {
    const pool = Array.from({ length: 8 }, (_, index) =>
      makePoolEntry(`topic::q${index}`, "Ch 1: Introduction to Accounting", index % 3)
    );

    const plan = fallbackQuizPlan(pool, "mini", 5);

    expect(plan.questions).toHaveLength(5);
    expect(plan.strategy).toBe("offline_fallback");
    expect(plan.rationale).toContain("offline mix");
  });

  test("enables option shuffle for practiced questions", () => {
    const pool = [
      makePoolEntry("topic::new", "Ch 1: Introduction to Accounting", 0),
      makePoolEntry("topic::seen", "Ch 1: Introduction to Accounting", 2),
    ];

    const plan = fallbackQuizPlan(pool, "all");

    const shuffleById = Object.fromEntries(
      plan.questions.map((entry) => [entry.id, entry.shuffleOptions])
    );

    expect(shuffleById["topic::new"]).toBe(false);
    expect(shuffleById["topic::seen"]).toBe(true);
  });

  test("does not shuffle options for practice mode", () => {
    const pool = [
      makePoolEntry("topic::seen", "Ch 1: Introduction to Accounting", 3),
      makePoolEntry("topic::new", "Ch 1: Introduction to Accounting", 0),
    ];

    const plan = fallbackQuizPlan(pool, "practice");

    expect(plan.rationale).toContain("practice questions");
    expect(plan.questions.every((entry) => entry.shuffleOptions === false)).toBe(true);
  });
});

describe("resolveQuizPlan", () => {
  test("falls back when API request fails", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ error: "OPENAI_API_KEY is not configured" }), {
        status: 503,
      });

    try {
      const pool = [
        makePoolEntry("topic::q1", "Ch 1: Introduction to Accounting"),
        makePoolEntry("topic::q2", "Ch 2: The Recording Process", 2),
      ];

      const payload = {
        mode: "mini",
        size: 2,
        pool: pool.map(({ id, topic, attempts, correct, incorrect, lastWrongAt }) => ({
          id,
          topic,
          attempts,
          correct,
          incorrect,
          lastWrongAt,
        })),
        summary: { totalQuizzes: 0, accuracy: 0, recentModes: [] },
      };

      const { plan, usedFallback } = await resolveQuizPlan(payload, pool, "mini", 2);

      expect(usedFallback).toBe(true);
      expect(plan.strategy).toBe("offline_fallback");
      expect(plan.questions).toHaveLength(2);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
