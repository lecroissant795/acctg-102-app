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

const DEFAULT_MAX_AI_SEEDS = 6;

function getMaxAiSeeds(): number {
  const raw = process.env.PRACTICE_AI_MAX_SEEDS;
  const parsed = raw ? Number.parseInt(raw, 10) : DEFAULT_MAX_AI_SEEDS;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_MAX_AI_SEEDS;
}

export function prioritizePracticeSeeds(seeds: PracticeSeed[]): PracticeSeed[] {
  return [...seeds].sort(
    (a, b) => b.incorrect - a.incorrect || b.attempts - a.attempts
  );
}

export function selectAiPracticeSeeds(seeds: PracticeSeed[]): {
  aiSeeds: PracticeSeed[];
  remainderSeeds: PracticeSeed[];
} {
  const ordered = prioritizePracticeSeeds(seeds);
  const maxAiSeeds = getMaxAiSeeds();

  return {
    aiSeeds: ordered.slice(0, maxAiSeeds),
    remainderSeeds: ordered.slice(maxAiSeeds),
  };
}

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

Return exactly one variant per sourceId. Order weaker/missed seeds earlier when stats show higher incorrect counts.
Return compact JSON only — do not echo seed questions or repeat large blobs.`;
}

function slimPracticeSeed(seed: PracticeSeed) {
  const question = seed.question;

  return {
    sourceId: seed.sourceId,
    topic: seed.topic,
    attempts: seed.attempts,
    incorrect: seed.incorrect,
    question: {
      type: question.type,
      q: question.q ?? question.prompt,
      answer: question.answer,
      explanation: question.explanation,
    },
  };
}

function buildUserPrompt(request: PracticeQuizRequest): string {
  return JSON.stringify(
    {
      practiceLabel: request.practiceLabel,
      questionType: request.questionType,
      expectedQuestionCount: request.seeds.length,
      summary: request.summary,
      seeds: request.seeds.map(slimPracticeSeed),
    },
    null,
    2
  );
}

export function isRetriablePracticeAiError(message: string): boolean {
  return (
    message.includes("Failed to parse JSON") ||
    message.includes("invalid JSON") ||
    message.includes("Failed to parse practice quiz JSON") ||
    message.includes("OpenAI returned empty content") ||
    message.includes("bad_response_body") ||
    message.includes("timed out")
  );
}

export function shouldUsePracticeFallback(message: string): boolean {
  return (
    message.includes("OPENAI_API_KEY") ||
    message.includes("OpenAI API") ||
    message.includes("Invalid practice quiz from LLM") ||
    isRetriablePracticeAiError(message)
  );
}

function parsePracticeQuizContent(content: string): PracticeQuizResponse {
  const trimmed = content.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/m);
  const jsonText = fenced ? fenced[1].trim() : trimmed;

  try {
    return JSON.parse(jsonText) as PracticeQuizResponse;
  } catch (error) {
    const detail = error instanceof Error ? error.message : "unknown";
    throw new Error(`Failed to parse practice quiz JSON: ${detail}`);
  }
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
  const messages = [
    { role: "system" as const, content: buildSystemPrompt(request.questionType, request.practiceLabel) },
    { role: "user" as const, content: buildUserPrompt(request) },
  ];
  const temperature = request.questionType === "journal_entry" ? 0.5 : 0.7;
  const formats: Array<"json_schema" | "json_object"> = ["json_schema", "json_schema", "json_object"];

  let lastError: Error | null = null;

  for (const format of formats) {
    try {
      const content = await chatCompletion(messages, {
        temperature,
        timeoutMs: 90_000,
        ...(format === "json_schema"
          ? {
              jsonSchema: {
                name: "practice_quiz",
                strict: false,
                schema: PRACTICE_QUIZ_SCHEMA,
              },
            }
          : { jsonObject: true }),
      });

      return parsePracticeQuizContent(content);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (!isRetriablePracticeAiError(lastError.message)) {
        throw lastError;
      }
    }
  }

  throw lastError ?? new Error("Failed to generate practice quiz");
}

async function generateAiPracticeQuiz(
  request: PracticeQuizRequest
): Promise<PracticeQuizResponse> {
  let lastError: string | null = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    const quiz = await callOpenAI(request);
    const validationError = validatePracticeQuiz(quiz, request);
    if (!validationError) return quiz;
    lastError = validationError;
  }

  throw new Error(`Invalid practice quiz from LLM: ${lastError}`);
}

function buildPartialRationale(
  aiQuiz: PracticeQuizResponse,
  aiSeedCount: number,
  remainderCount: number
): string {
  if (remainderCount === 0) return aiQuiz.rationale;

  const aiLabel = aiSeedCount === 1 ? "question" : "questions";
  const restLabel = remainderCount === 1 ? "question uses" : "questions use";

  return `${aiQuiz.rationale} Fresh AI variants were created for your ${aiSeedCount} highest-priority ${aiLabel}; the remaining ${remainderCount} ${restLabel} the original bank, ordered by your weak areas.`;
}

export async function createPracticeQuiz(request: PracticeQuizRequest): Promise<PracticeQuizResponse> {
  if (!request.seeds.length) {
    throw new Error("Practice seed pool is empty");
  }

  const { aiSeeds, remainderSeeds } = selectAiPracticeSeeds(request.seeds);

  if (!aiSeeds.length) {
    return buildFallbackPracticeQuiz(request);
  }

  const aiRequest: PracticeQuizRequest = {
    ...request,
    seeds: aiSeeds,
  };

  const aiQuiz = await generateAiPracticeQuiz(aiRequest);

  if (!remainderSeeds.length) {
    return aiQuiz;
  }

  return {
    strategy: aiQuiz.strategy,
    rationale: buildPartialRationale(aiQuiz, aiSeeds.length, remainderSeeds.length),
    questions: [
      ...aiQuiz.questions,
      ...remainderSeeds.map((seed) => ({
        sourceId: seed.sourceId,
        question: seed.question,
      })),
    ],
  };
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
