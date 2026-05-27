const STORAGE_KEY = "acctg102-quiz-stats";

let memoryStore = null;
let persistHandler = null;

export function normalizeStore(data) {
  if (!data || typeof data !== "object") {
    return { sessions: [], questions: {} };
  }

  return {
    sessions: Array.isArray(data.sessions) ? data.sessions : [],
    questions: data.questions && typeof data.questions === "object" ? data.questions : {},
  };
}

function readLocalStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { sessions: [], questions: {} };
    return normalizeStore(JSON.parse(raw));
  } catch {
    return { sessions: [], questions: {} };
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

export function getQuestionId(topic, questionText) {
  return `${topic}::${questionText}`;
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
    questionId: answer.questionId ?? getQuestionId(question.topic, question.q ?? question.prompt),
    questionType: answer.questionType ?? question.type,
    topic: question.topic,
    question: question.q ?? question.prompt,
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
    attempts: 0,
    correct: 0,
    incorrect: 0,
    scoreAwarded: 0,
    maxScoreAwarded: 0,
    lastAttemptAt: null,
    lastWrongAt: null,
    lastResponseText: null,
  };

  existing.attempts += 1;
  if (answer.correct) existing.correct += 1;
  else existing.incorrect += 1;
  existing.scoreAwarded += answer.scoreAwarded ?? 0;
  existing.maxScoreAwarded += answer.maxScore ?? 0;

  existing.lastAttemptAt = new Date().toISOString();
  if (!answer.correct) {
    existing.lastWrongAt = existing.lastAttemptAt;
    existing.lastResponseText = answer.responseText;
  }

  store.questions[answer.questionId] = existing;
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

  return {
    sessions,
    questions: recomputeQuestionsFromSessions(sessions),
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
  await persistStore(store);

  return session;
}

export function loadQuizStats() {
  return getStore();
}

export async function clearQuizStats() {
  await persistStore({ sessions: [], questions: {} });
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
