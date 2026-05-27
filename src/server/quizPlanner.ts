import { chatCompletion } from "./openaiClient.ts";

export type QuizMode = "topic" | "mini" | "all" | "practice";

export type PoolEntry = {
  id: string;
  topic: string;
  questionType?: string;
  attempts: number;
  correct: number;
  incorrect: number;
  lastWrongAt: string | null;
};

export type QuizPlanRequest = {
  mode: QuizMode;
  topic?: string;
  practiceLabel?: string;
  size?: number;
  pool: PoolEntry[];
  summary: {
    totalQuizzes: number;
    accuracy: number;
    recentModes: string[];
  };
};

export type QuizPlanQuestion = {
  id: string;
  shuffleOptions: boolean;
};

export type QuizPlan = {
  strategy: string;
  rationale: string;
  questions: QuizPlanQuestion[];
};

const QUIZ_PLAN_SCHEMA = {
  type: "object",
  properties: {
    strategy: { type: "string" },
    rationale: { type: "string" },
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          shuffleOptions: { type: "boolean" },
        },
        required: ["id", "shuffleOptions"],
        additionalProperties: false,
      },
    },
  },
  required: ["strategy", "rationale", "questions"],
  additionalProperties: false,
} as const;

function expectedQuestionCount(request: QuizPlanRequest): number {
  if (request.mode === "mini") return request.size ?? 0;
  return request.pool.length;
}

export function validateQuizPlan(plan: QuizPlan, request: QuizPlanRequest): string | null {
  const poolIds = new Set(request.pool.map((entry) => entry.id));
  const expected = expectedQuestionCount(request);

  if (!Array.isArray(plan.questions)) return "questions must be an array";
  if (plan.questions.length !== expected) {
    return `expected ${expected} questions, got ${plan.questions.length}`;
  }

  const seen = new Set<string>();
  for (const item of plan.questions) {
    if (!poolIds.has(item.id)) return `unknown question id: ${item.id}`;
    if (seen.has(item.id)) return `duplicate question id: ${item.id}`;
    seen.add(item.id);
    if (typeof item.shuffleOptions !== "boolean") {
      return `shuffleOptions must be boolean for ${item.id}`;
    }
  }

  if (request.mode === "all" || request.mode === "topic" || request.mode === "practice") {
    for (const id of poolIds) {
      if (!seen.has(id)) return `missing question id: ${id}`;
    }
  }

  return null;
}

function buildSystemPrompt(): string {
  return `You are a quiz planner for an accounting exam prep app. Given a question pool with per-question stats, return a JSON quiz plan that decides question order and when to shuffle multiple-choice answer options.

Rules:
- mode "practice" (Practice by Type): include every pool question; reorder based on weak areas, attempts, and recency; set shuffleOptions false for all practice questions; prioritize missed or unfamiliar items earlier.
- mode "all": include every pool question; interleave chapters when possible.
- mode "topic": include every pool question for that chapter.
- mode "mini": select exactly the requested size; include at least 2 chapters when pool allows.
- Weak areas (incorrect >= 2): prioritize those questions early.
- accuracy < 60%: weight weak questions heavily.
- rationale: 1-2 friendly sentences explaining the mix strategy.

Return only valid JSON matching the schema.`;
}

function buildUserPrompt(request: QuizPlanRequest): string {
  const expected = expectedQuestionCount(request);
  return JSON.stringify(
    {
      mode: request.mode,
      topic: request.topic ?? null,
      practiceLabel: request.practiceLabel ?? null,
      size: request.size ?? null,
      expectedQuestionCount: expected,
      summary: request.summary,
      pool: request.pool,
    },
    null,
    2
  );
}

async function callOpenAI(request: QuizPlanRequest): Promise<QuizPlan> {
  const content = await chatCompletion(
    [
      { role: "system", content: buildSystemPrompt() },
      { role: "user", content: buildUserPrompt(request) },
    ],
    {
      temperature: 0.4,
      jsonSchema: {
        name: "quiz_plan",
        strict: true,
        schema: QUIZ_PLAN_SCHEMA,
      },
    }
  );

  return JSON.parse(content) as QuizPlan;
}

export async function createQuizPlan(request: QuizPlanRequest): Promise<QuizPlan> {
  if (!request.pool.length) {
    throw new Error("Question pool is empty");
  }

  if (request.mode === "mini" && (!request.size || request.size < 1)) {
    throw new Error("Mini quiz requires a positive size");
  }

  let lastError: string | null = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    const plan = await callOpenAI(request);
    const validationError = validateQuizPlan(plan, request);
    if (!validationError) return plan;
    lastError = validationError;
  }

  throw new Error(`Invalid quiz plan from LLM: ${lastError}`);
}
