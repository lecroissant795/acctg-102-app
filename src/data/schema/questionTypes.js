export const QUESTION_TYPES = {
  MCQ: "mcq",
  WRITTEN: "written",
  SELECT_MULTIPLE: "select_multiple",
  NUMERIC_INPUT: "numeric_input",
  MATCHING: "matching",
  ORDERING: "ordering",
  JOURNAL_ENTRY: "journal_entry",
  TABLE_CLASSIFICATION: "table_classification",
  CASE_SET: "case_set",
};

export const QUESTION_DIFFICULTIES = ["easy", "medium", "hard"];

export const ACCOUNTING_TAGS = [
  "debit_credit",
  "adjusting_entries",
  "error_correction",
  "inventory",
  "inventory_sales",
  "inventory_purchases",
  "gst",
  "receivables",
  "allowance_method",
  "bank_reconciliation",
  "financial_statements",
  "balance_sheet",
  "income_statement",
  "cash_flow",
  "equity",
];

export const TYPE_SPECIFICATIONS = {
  [QUESTION_TYPES.MCQ]: {
    responseShape: { selectedIndex: "number" },
    answerShape: { correctIndex: "number" },
  },
  [QUESTION_TYPES.WRITTEN]: {
    responseShape: { text: "string" },
    answerShape: { sampleAnswer: "string", keyPoints: "string[]" },
  },
  [QUESTION_TYPES.SELECT_MULTIPLE]: {
    responseShape: { selectedIndices: "number[]" },
    answerShape: { correctIndices: "number[]", scoringMode: "exact|partial" },
  },
  [QUESTION_TYPES.NUMERIC_INPUT]: {
    responseShape: { value: "number|string" },
    answerShape: { value: "number", tolerance: "number" },
  },
  [QUESTION_TYPES.MATCHING]: {
    responseShape: { pairs: "{ [leftId]: rightId }" },
    answerShape: { pairs: "{ [leftId]: rightId }" },
  },
  [QUESTION_TYPES.ORDERING]: {
    responseShape: { orderedIds: "string[]" },
    answerShape: { correctOrder: "string[]" },
  },
  [QUESTION_TYPES.JOURNAL_ENTRY]: {
    responseShape: { lines: "JournalResponseLine[]" },
    answerShape: { lines: "JournalAnswerLine[]", rules: "JournalRules" },
  },
  [QUESTION_TYPES.TABLE_CLASSIFICATION]: {
    responseShape: { mapping: "{ [rowId]: column }" },
    answerShape: { mapping: "{ [rowId]: column }" },
  },
  [QUESTION_TYPES.CASE_SET]: {
    responseShape: { subresponses: "{ [subquestionId]: unknown }" },
    answerShape: { subquestions: "Question[]" },
  },
};

function inferLegacyType(question) {
  if (question?.type) return question.type;
  if (question?.options && typeof question?.answer === "number") {
    return QUESTION_TYPES.MCQ;
  }
  return QUESTION_TYPES.WRITTEN;
}

export function normalizeQuestion(rawQuestion, defaults = {}) {
  const type = inferLegacyType(rawQuestion);

  return {
    id: rawQuestion.id ?? `${defaults.chapter ?? "legacy"}::${rawQuestion.q ?? rawQuestion.prompt ?? "question"}`,
    type,
    topic: rawQuestion.topic ?? defaults.topic ?? null,
    chapter: rawQuestion.chapter ?? defaults.chapter ?? null,
    prompt: rawQuestion.prompt ?? rawQuestion.q ?? "",
    scenario: rawQuestion.scenario ?? null,
    difficulty: rawQuestion.difficulty ?? "medium",
    tags: rawQuestion.tags ?? [],
    skills: rawQuestion.skills ?? [],
    points: rawQuestion.points ?? 1,
    explanation: rawQuestion.explanation ?? null,
    rubric: rawQuestion.rubric ?? null,
    metadata: rawQuestion.metadata ?? {},
    ...rawQuestion,
  };
}

export function isSupportedQuestionType(type) {
  return Object.values(QUESTION_TYPES).includes(type);
}

export function getQuestionTypeLabel(type) {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
