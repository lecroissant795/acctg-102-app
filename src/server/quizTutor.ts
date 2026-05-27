import { chatCompletion } from "./openaiClient.ts";

export type TutorIntent = "hint" | "explain" | "ask";

export type TutorMessage = {
  role: "user" | "assistant";
  content: string;
};

export type TutorRequest = {
  intent: TutorIntent;
  question: Record<string, unknown>;
  currentAnswer?: Record<string, unknown> | null;
  userMessage?: string;
  messages?: TutorMessage[];
};

export type TutorResponse = {
  message: string;
};

const ANSWER_KEYS = new Set([
  "answer",
  "displayAnswer",
  "sampleAnswer",
  "correctIndex",
  "correctIndices",
  "correctOrder",
  "pairs",
  "mapping",
  "lines",
  "rules",
  "value",
  "tolerance",
]);

function stripAnswers(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stripAnswers);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const input = value as Record<string, unknown>;
  const output: Record<string, unknown> = {};

  for (const [key, nestedValue] of Object.entries(input)) {
    if (ANSWER_KEYS.has(key)) continue;
    if (key === "subquestions" && Array.isArray(nestedValue)) {
      output[key] = nestedValue.map((subquestion) => stripAnswers(subquestion));
      continue;
    }
    output[key] = stripAnswers(nestedValue);
  }

  return output;
}

function getPromptText(question: Record<string, unknown>) {
  return String(question.prompt ?? question.q ?? "");
}

function buildSystemPrompt(intent: TutorIntent): string {
  const base =
    "You are a friendly ACCTG 102 accounting tutor. Use clear, exam-focused language. Keep responses concise (2-4 short paragraphs max unless the student asks for more).";

  switch (intent) {
    case "hint":
      return `${base}

Give a helpful hint for the current question.
- Do NOT reveal the correct answer, option letter, numeric result, or journal entry solution.
- Nudge the student toward the relevant rule, formula, or concept.
- If they already received hints, go slightly deeper without giving away the answer.`;
    case "explain":
      return `${base}

Explain the accounting concept behind this question.
- Use the provided official explanation as ground truth when available.
- If the student was wrong, clarify their mistake and why the correct approach works.
- Teach the concept so they can apply it to similar questions.`;
    case "ask":
      return `${base}

Answer the student's follow-up question in the context of the current quiz question.
- Stay focused on accounting concepts relevant to ACCTG 102.
- If they ask for the direct answer before attempting the question, give guidance instead of the final answer.`;
    default:
      return base;
  }
}

function buildUserPrompt(request: TutorRequest): string {
  const questionForPrompt =
    request.intent === "hint" ? stripAnswers(request.question) : request.question;

  const payload = {
    intent: request.intent,
    question: questionForPrompt,
    currentAnswer: request.currentAnswer ?? null,
    userMessage: request.userMessage ?? null,
    priorMessages: request.messages ?? [],
  };

  return JSON.stringify(payload, null, 2);
}

export async function createTutorResponse(request: TutorRequest): Promise<TutorResponse> {
  if (!request.question || typeof request.question !== "object") {
    throw new Error("Question context is required");
  }

  if (request.intent === "ask" && !request.userMessage?.trim()) {
    throw new Error("userMessage is required for ask intent");
  }

  const history = (request.messages ?? []).flatMap((entry) => [
    { role: entry.role, content: entry.content } as const,
  ]);

  const content = await chatCompletion(
    [
      { role: "system", content: buildSystemPrompt(request.intent) },
      ...history,
      { role: "user", content: buildUserPrompt(request) },
    ],
    { temperature: request.intent === "hint" ? 0.5 : 0.4 }
  );

  return { message: content.trim() };
}

export function buildFallbackTutorResponse(request: TutorRequest): TutorResponse {
  const prompt = getPromptText(request.question);
  const topic = String(request.question.topic ?? "this topic");
  const tags = Array.isArray(request.question.tags) ? request.question.tags.join(", ") : "";
  const explanation = String(request.question.explanation ?? "");

  if (request.intent === "hint") {
    return {
      message: tags
        ? `Think about the ${tags.replaceAll("_", " ")} rules for ${topic}. Break the question into what is being asked and which accounts or statements are involved.`
        : `Focus on the core concept in "${prompt.slice(0, 80)}${prompt.length > 80 ? "..." : ""}" and recall the related chapter notes for ${topic}.`,
    };
  }

  if (request.intent === "explain") {
    return {
      message:
        explanation ||
        `Review the core concept for ${topic}. Identify the accounts affected, whether they increase or decrease, and how this appears on the financial statements.`,
    };
  }

  return {
    message:
      "AI tutoring is offline right now. Review the chapter explanation above and try relating it to debits, credits, and the relevant financial statement impact.",
  };
}
