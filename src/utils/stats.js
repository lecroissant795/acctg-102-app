const STORAGE_KEY = "acctg102-quiz-stats";

let memoryStore = null;
let persistHandler = null;

export function normalizeStore(data) {
  if (!data || typeof data !== "object") {
    return { sessions: [], questions: {}, chapters: {} };
  }

  return {
    sessions: Array.isArray(data.sessions) ? data.sessions : [],
    questions: data.questions && typeof data.questions === "object" ? data.questions : {},
    chapters: data.chapters && typeof data.chapters === "object" ? data.chapters : {},
  };
}

function readLocalStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { sessions: [], questions: {}, chapters: {} };
    return normalizeStore(JSON.parse(raw));
  } catch {
    return { sessions: [], questions: {}, chapters: {} };
  }
}

function writeLocalStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function getStore() {
  if (!memoryStore) {
    memoryStore = readLocalStore();
  }
  return memoryStore;
}

export function initStatsStore(store) {
  memoryStore = normalizeStore(store);
}

export function resetStatsStore() {
  memoryStore = readLocalStore();
  persistHandler = null;
}

export function setStatsPersist(handler) {
  persistHandler = handler;
}

async function persistStore(store) {
  memoryStore = normalizeStore(store);

  if (persistHandler) {
    await persistHandler(memoryStore);
    return;
  }

  writeLocalStore(memoryStore);
}

export function getQuestionId(topic, questionText, explicitId = null) {
  if (explicitId) return explicitId;
  return `${topic}::${questionText}`;
}

export function resolveQuestionId(question) {
  if (!question) return null;
  return getQuestionId(
    question.topic,
    question.q ?? question.prompt ?? "",
    question.id ?? null
  );
}

function computeAccuracy(correct, attempts) {
  return attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
}

function formatScore(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function describeAnswer(question, answer) {
  const type = answer.questionType ?? question.type;
  const response = answer.responseSummary ?? answer.response ?? {};

  switch (type) {
    case "matching":
      return {
        responseText: Object.entries(response.pairs ?? {})
          .map(([leftId, rightId]) => {
            const left = question.leftItems?.find((item) => item.id === leftId)?.text ?? leftId;
            const right = question.rightItems?.find((item) => item.id === rightId)?.text ?? rightId;
            return `${left} → ${right}`;
          })
          .join(" · "),
        correctText: Object.entries(question.answer?.pairs ?? {})
          .map(([leftId, rightId]) => {
            const left = question.leftItems?.find((item) => item.id === leftId)?.text ?? leftId;
            const right = question.rightItems?.find((item) => item.id === rightId)?.text ?? rightId;
            return `${left} → ${right}`;
          })
          .join(" · "),
      };
    case "ordering":
      return {
        responseText: (response.orderedIds ?? [])
          .map((id) => question.items?.find((item) => item.id === id)?.text ?? id)
          .join(" → "),
        correctText: (question.answer?.correctOrder ?? [])
          .map((id) => question.items?.find((item) => item.id === id)?.text ?? id)
          .join(" → "),
      };
    case "select_multiple":
      return {
        responseText: (response.selectedIndices ?? [])
          .map((index) => question.options?.[index])
          .filter(Boolean)
          .join(", "),
        correctText: (question.answer?.correctIndices ?? [])
          .map((index) => question.options?.[index])
          .filter(Boolean)
          .join(", "),
      };
    case "numeric_input":
      return {
        responseText: response.value == null ? "No answer" : String(response.value),
        correctText: question.answer?.value == null ? null : String(question.answer.value),
      };
    case "journal_entry":
      return {
        responseText: (response.lines ?? [])
          .map((line) => `${line.account} ${line.debit != null ? `Dr ${line.debit}` : `Cr ${line.credit}`}`)
          .join(" · "),
        correctText: (question.answer?.lines ?? [])
          .map((line) => `${line.account} ${line.side === "debit" ? `Dr ${line.amount}` : `Cr ${line.amount}`}`)
          .join(" · "),
      };
    case "table_classification":
      return {
        responseText: Object.entries(response.mapping ?? {})
          .map(([rowId, column]) => {
            const row = question.rows?.find((item) => item.id === rowId)?.text ?? rowId;
            return `${row} → ${column}`;
          })
          .join(" · "),
        correctText: Object.entries(question.answer?.mapping ?? {})
          .map(([rowId, column]) => {
            const row = question.rows?.find((item) => item.id === rowId)?.text ?? rowId;
            return `${row} → ${column}`;
          })
          .join(" · "),
      };
    case "case_set":
      return {
        responseText: "Case set completed",
        correctText: `Scored ${formatScore(answer.evaluation?.scoreAwarded ?? 0)}/${formatScore(answer.evaluation?.maxScore ?? 0)}`,
      };
    default:
      return {
        responseText:
          question.options?.[response.selectedIndex] ??
          answer.selectedText ??
          "No answer",
        correctText:
          question.options?.[question.answer?.correctIndex ?? question.answer] ??
          answer.correctText ??
          null,
      };
  }
}

function buildAnswerRecord(question, answer) {
  const description = describeAnswer(question, answer);
  const scoreAwarded = answer.evaluation?.scoreAwarded ?? (answer.correct ? 1 : 0);
  const maxScore = answer.evaluation?.maxScore ?? (question.type === "written" ? 0 : question.points ?? 1);
  const correct = answer.evaluation?.correct ?? answer.correct ?? false;

  return {
    questionId: answer.questionId ?? resolveQuestionId(question),
    questionType: answer.questionType ?? question.type,
    topic: question.topic,
    question: question.q ?? question.prompt,
    tags: Array.isArray(question.tags) ? question.tags : [],
    response: answer.response ?? null,
    responseSummary: answer.evaluation?.responseSummary ?? answer.responseSummary ?? null,
    responseText: description.responseText,
    correct,
    correctText: description.correctText,
    scoreAwarded,
    maxScore,
    feedback: answer.evaluation?.feedback ?? null,
  };
}

function updateQuestionStats(store, answer) {
  const existing = store.questions[answer.questionId] ?? {
    topic: answer.topic,
    question: answer.question,
    tags: answer.tags ?? [],
    attempts: 0,
    correct: 0,
    incorrect: 0,
    accuracy: 0,
    scoreAwarded: 0,
    maxScoreAwarded: 0,
    lastAttemptAt: null,
    lastWrongAt: null,
    lastResponseText: null,
  };

  existing.attempts += 1;
  if (answer.correct) existing.correct += 1;
  else existing.incorrect += 1;
  existing.accuracy = computeAccuracy(existing.correct, existing.attempts);
  existing.scoreAwarded += answer.scoreAwarded ?? 0;
  existing.maxScoreAwarded += answer.maxScore ?? 0;

  if (answer.tags?.length) {
    existing.tags = answer.tags;
  }

  existing.lastAttemptAt = new Date().toISOString();
  if (!answer.correct) {
    existing.lastWrongAt = existing.lastAttemptAt;
    existing.lastResponseText = answer.responseText;
  }

  store.questions[answer.questionId] = existing;
}

function buildQuestionSummary(questionId, entry) {
  return {
    questionId,
    topic: entry.topic,
    question: entry.question,
    tags: entry.tags ?? [],
    attempts: entry.attempts,
    correct: entry.correct,
    incorrect: entry.incorrect,
    accuracy: entry.accuracy ?? computeAccuracy(entry.correct, entry.attempts),
    lastAttemptAt: entry.lastAttemptAt,
  };
}

function rankTopicQuestions(store, topic) {
  return Object.entries(store.questions)
    .filter(([, entry]) => entry.topic === topic && entry.attempts > 0)
    .map(([questionId, entry]) => buildQuestionSummary(questionId, entry));
}

function buildChapterRankings(store, topic) {
  const entries = rankTopicQuestions(store, topic);

  const strongest = [...entries]
    .filter((entry) => entry.attempts >= 2)
    .sort((a, b) => b.accuracy - a.accuracy || b.correct - a.correct)
    .slice(0, 5);

  const weakest = [...entries]
    .filter((entry) => entry.incorrect > 0)
    .sort((a, b) => a.accuracy - b.accuracy || b.incorrect - a.incorrect)
    .slice(0, 5);

  return { strongest, weakest };
}

function updateChapterStats(store, session) {
  if (!session.topic) return;

  const chapter =
    store.chapters[session.topic] ?? {
      totalQuizzes: 0,
      averageScore: 0,
      questionsAnswered: 0,
      strongestQuestions: [],
      weakestQuestions: [],
      lastQuizAt: null,
      scorePercentTotal: 0,
    };

  chapter.totalQuizzes += 1;
  chapter.questionsAnswered += session.totalQuestions ?? 0;
  chapter.scorePercentTotal = (chapter.scorePercentTotal ?? chapter.averageScore * (chapter.totalQuizzes - 1)) + (session.scorePercent ?? 0);
  chapter.averageScore = Math.round(chapter.scorePercentTotal / chapter.totalQuizzes);
  chapter.lastQuizAt = session.completedAt;

  const rankings = buildChapterRankings(store, session.topic);
  chapter.strongestQuestions = rankings.strongest;
  chapter.weakestQuestions = rankings.weakest;

  store.chapters[session.topic] = chapter;
}

function recomputeChaptersFromSessions(sessions, questions) {
  const store = { questions, chapters: {} };
  const chronological = [...sessions].reverse();

  for (const session of chronological) {
    updateChapterStats(store, session);
  }

  for (const topic of Object.keys(store.chapters)) {
    const rankings = buildChapterRankings({ questions }, topic);
    store.chapters[topic].strongestQuestions = rankings.strongest;
    store.chapters[topic].weakestQuestions = rankings.weakest;
  }

  return store.chapters;
}

function recomputeQuestionsFromSessions(sessions) {
  const store = { questions: {} };
  const chronological = [...sessions].reverse();

  for (const session of chronological) {
    for (const answer of session.answers ?? []) {
      updateQuestionStats(store, answer);
    }
  }

  return store.questions;
}

export function mergeStores(local, remote) {
  const sessionMap = new Map();

  for (const session of [...remote.sessions, ...local.sessions]) {
    sessionMap.set(session.id, session);
  }

  const sessions = [...sessionMap.values()].sort(
    (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
  );

  const questions = recomputeQuestionsFromSessions(sessions);

  return {
    sessions,
    questions,
    chapters: recomputeChaptersFromSessions(sessions, questions),
  };
}

export async function saveQuizSession({
  mode,
  modeLabel,
  topic,
  questions,
  answers,
  score,
  maxScore,
  startedAt,
}) {
  const store = getStore();
  const answerRecords = answers
    .map((entry) => {
      const question = questions[entry.questionIndex];
      if (!question || question.type === "written") {
        return null;
      }
      return buildAnswerRecord(question, entry);
    })
    .filter(Boolean);
  const questionCount = questions.length;
  const earnedScore = score ?? answerRecords.reduce((sum, answer) => sum + (answer.scoreAwarded ?? 0), 0);
  const totalMaxScore =
    maxScore ??
    questions.reduce(
      (sum, question) => sum + (question.type === "written" ? 0 : question.points ?? 1),
      0
    );

  const session = {
    id: crypto.randomUUID(),
    completedAt: new Date().toISOString(),
    startedAt: startedAt ?? null,
    durationMs: startedAt ? Date.now() - startedAt : null,
    mode,
    modeLabel,
    topic,
    totalQuestions: questionCount,
    correct: answerRecords.filter((answer) => answer.correct).length,
    incorrect: answerRecords.filter((answer) => !answer.correct).length,
    scorePoints: earnedScore,
    maxScore: totalMaxScore,
    scorePercent: totalMaxScore > 0 ? Math.round((earnedScore / totalMaxScore) * 100) : 100,
    answers: answerRecords,
  };

  store.sessions.unshift(session);
  for (const answer of answerRecords) updateQuestionStats(store, answer);
  updateChapterStats(store, session);
  await persistStore(store);

  return session;
}

export function loadQuizStats() {
  return getStore();
}

export async function clearQuizStats() {
  await persistStore({ sessions: [], questions: {}, chapters: {} });
}

export function getChapterPerformance(topic, store = getStore()) {
  const chapter = store.chapters[topic];
  if (!chapter) {
    return {
      topic,
      totalQuizzes: 0,
      averageScore: 0,
      questionsAnswered: 0,
      strongestQuestions: [],
      weakestQuestions: [],
      lastQuizAt: null,
    };
  }

  return {
    topic,
    totalQuizzes: chapter.totalQuizzes,
    averageScore: chapter.averageScore,
    questionsAnswered: chapter.questionsAnswered,
    strongestQuestions: chapter.strongestQuestions ?? [],
    weakestQuestions: chapter.weakestQuestions ?? [],
    lastQuizAt: chapter.lastQuizAt ?? null,
  };
}

function summarizeMissedConcepts(entries) {
  const tagCounts = new Map();

  for (const entry of entries) {
    for (const tag of entry.tags ?? []) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + entry.incorrect);
    }
  }

  return [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag, missCount]) => ({
      tag,
      label: tag.replaceAll("_", " "),
      missCount,
    }));
}

export function getTutorPerformanceContext(question, store = getStore()) {
  const questionId = resolveQuestionId(question);
  const questionStats = questionId ? store.questions[questionId] : null;
  const topic = question?.topic ?? null;
  const chapterPerformance = topic ? getChapterPerformance(topic, store) : null;

  const frequentlyMissed = topic
    ? rankTopicQuestions(store, topic)
        .filter((entry) => entry.incorrect >= 2)
        .sort((a, b) => b.incorrect - a.incorrect || a.accuracy - b.accuracy)
        .slice(0, 5)
    : [];

  const recommendedRevisionAreas = summarizeMissedConcepts(
    topic ? rankTopicQuestions(store, topic).filter((entry) => entry.incorrect > 0) : []
  );

  return {
    question: questionStats
      ? {
          questionId,
          attempts: questionStats.attempts,
          correct: questionStats.correct,
          incorrect: questionStats.incorrect,
          accuracy: questionStats.accuracy ?? computeAccuracy(questionStats.correct, questionStats.attempts),
          lastAttemptAt: questionStats.lastAttemptAt,
          lastWrongAt: questionStats.lastWrongAt,
        }
      : null,
    chapter: chapterPerformance,
    strongestTopics: chapterPerformance?.strongestQuestions?.slice(0, 3) ?? [],
    weakestTopics: chapterPerformance?.weakestQuestions?.slice(0, 3) ?? [],
    frequentlyMissedConcepts: frequentlyMissed,
    recommendedRevisionAreas,
  };
}

export function getStatsSummary(store = getStore()) {
  const totalQuizzes = store.sessions.length;
  const totalPossible = store.sessions.reduce(
    (sum, session) => sum + (session.maxScore ?? session.totalQuestions),
    0
  );
  const totalCorrect = store.sessions.reduce(
    (sum, session) => sum + (session.scorePoints ?? session.correct),
    0
  );
  const totalIncorrect = Math.max(totalPossible - totalCorrect, 0);
  const accuracy = totalPossible > 0 ? Math.round((totalCorrect / totalPossible) * 100) : 0;

  const weakQuestions = Object.values(store.questions)
    .filter((entry) => entry.incorrect > 0)
    .sort((a, b) => b.incorrect - a.incorrect || b.attempts - a.attempts);

  return {
    totalQuizzes,
    totalAnswered: totalPossible,
    totalCorrect,
    totalIncorrect,
    accuracy,
    weakQuestions,
    chapters: store.chapters,
    sessions: store.sessions,
  };
}

export function formatDateTime(isoString) {
  return new Date(isoString).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatDuration(durationMs) {
  if (durationMs == null) return null;
  const totalSeconds = Math.round(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}
