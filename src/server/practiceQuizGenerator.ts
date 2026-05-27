import { chatCompletion } from "./openaiClient.ts";

export type PracticeSeed = {
  sourceId: string;
  topic: string;
  attempts: number;
  incorrect: number;
  question: Record<string, unknown>;
};

export type PracticeQuizRequest = {
  practiceLabel: string;
  questionType: string;
  seeds: PracticeSeed[];
  summary: {
    totalQuizzes: number;
    accuracy: number;
    recentModes: string[];
  };
};

export type PracticeQuizItem = {
  sourceId: string;
  question: Record<string, unknown>;
};

export type PracticeQuizResponse = {
  strategy: string;
  rationale: string;
  questions: PracticeQuizItem[];
};

const PRACTICE_QUIZ_SCHEMA = {
  type: "object",
  properties: {
    strategy: { type: "string" },
    rationale: { type: "string" },
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          sourceId: { type: "string" },
          question: {
            type: "object",
            properties: {
              type: { type: "string" },
              q: { type: "string" },
              prompt: { type: "string" },
              explanation: { type: "string" },
            },
            required: ["type", "explanation"],
            additionalProperties: true,
          },
        },
        required: ["sourceId", "question"],
        additionalProperties: false,
      },
    },
  },
  required: ["strategy", "rationale", "questions"],
  additionalProperties: false,
} as const;

function buildSystemPrompt(questionType: string, practiceLabel: string): string {
  return `You are an ACCTG 102 exam question writer. Generate fresh practice questions for "${practiceLabel}".

Every generated question MUST:
- use type "${questionType}" exactly
- stay within the same skill category as its seed question
- change the scenario, wording, names, and numbers so it is not a copy
- include a correct "answer" object matching the seed question's answer shape
- include a clear "explanation"
- use "q" or "prompt" for the question stem
- preserve required fields for the type (options, leftItems/rightItems, items, rows/columns, subquestions, sampleAnswer, etc.)

Rules by type:
- written: provide answer.sampleAnswer and optional answer.keyPoints
- select_multiple: provide options array and answer.correctIndices
- numeric_input: provide answer.value and answer.tolerance
- matching: provide leftItems, rightItems, answer.pairs
- ordering: provide items and answer.correctOrder
- journal_entry: provide balanced answer.lines with account, side, amount
- table_classification: provide rows, columns, answer.mapping
- case_set: provide scenario and subquestions array with valid nested questions

Return exactly one variant per sourceId. Order weaker/missed seeds earlier when stats show higher incorrect counts.`;
}

function buildUserPrompt(request: PracticeQuizRequest): string {
  return JSON.stringify(
    {
      practiceLabel: request.practiceLabel,
      questionType: request.questionType,
      expectedQuestionCount: request.seeds.length,
      summary: request.summary,
      seeds: request.seeds,
    },
    null,
    2
  );
}

export function validatePracticeQuiz(
  quiz: PracticeQuizResponse,
  request: PracticeQuizRequest
): string | null {
  const seedIds = new Set(request.seeds.map((seed) => seed.sourceId));

  if (!Array.isArray(quiz.questions)) return "questions must be an array";
  if (quiz.questions.length !== request.seeds.length) {
    return `expected ${request.seeds.length} questions, got ${quiz.questions.length}`;
  }

  const seen = new Set<string>();

  for (const item of quiz.questions) {
    if (!seedIds.has(item.sourceId)) return `unknown sourceId: ${item.sourceId}`;
    if (seen.has(item.sourceId)) return `duplicate sourceId: ${item.sourceId}`;
    seen.add(item.sourceId);

    const question = item.question;
    if (!question || typeof question !== "object") return `invalid question for ${item.sourceId}`;
    if (question.type !== request.questionType) {
      return `question ${item.sourceId} has wrong type`;
    }

    const stem = question.q ?? question.prompt;
    if (!stem || typeof stem !== "string") {
      return `question ${item.sourceId} is missing a stem`;
    }

    if (!question.explanation || typeof question.explanation !== "string") {
      return `question ${item.sourceId} is missing an explanation`;
    }

    if (question.answer == null) {
      return `question ${item.sourceId} is missing an answer`;
    }
  }

  for (const id of seedIds) {
    if (!seen.has(id)) return `missing sourceId: ${id}`;
  }

  return null;
}

async function callOpenAI(request: PracticeQuizRequest): Promise<PracticeQuizResponse> {
  const content = await chatCompletion(
    [
      { role: "system", content: buildSystemPrompt(request.questionType, request.practiceLabel) },
      { role: "user", content: buildUserPrompt(request) },
    ],
    {
      temperature: 0.7,
      jsonSchema: {
        name: "practice_quiz",
        strict: false,
        schema: PRACTICE_QUIZ_SCHEMA,
      },
    }
  );

  return JSON.parse(content) as PracticeQuizResponse;
}

export async function createPracticeQuiz(request: PracticeQuizRequest): Promise<PracticeQuizResponse> {
  if (!request.seeds.length) {
    throw new Error("Practice seed pool is empty");
  }

  let lastError: string | null = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    const quiz = await callOpenAI(request);
    const validationError = validatePracticeQuiz(quiz, request);
    if (!validationError) return quiz;
    lastError = validationError;
  }

  throw new Error(`Invalid practice quiz from LLM: ${lastError}`);
}

export function buildFallbackPracticeQuiz(request: PracticeQuizRequest): PracticeQuizResponse {
  const ordered = [...request.seeds].sort(
    (a, b) => b.incorrect - a.incorrect || b.attempts - a.attempts
  );

  return {
    strategy: "offline_fallback",
    rationale: "Using original practice questions — AI generation is unavailable.",
    questions: ordered.map((seed) => ({
      sourceId: seed.sourceId,
      question: seed.question,
    })),
  };
}
