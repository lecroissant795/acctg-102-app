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
  performanceContext?: Record<string, unknown> | null;
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

function buildHintPrompt(question?: Record<string, unknown>): string {
  const baseRules = `- Do NOT reveal the correct answer, option letter, numeric result, or journal entry solution.
- Do NOT name specific account titles (for example: Cash, Accounts Receivable, GST Payable, Share Capital).
- Do NOT state debit/credit sides, dollar amounts, or how many journal lines are required.
- Do NOT write journal lines or say "debit X / credit Y".
- ONLY nudge toward the underlying rule, formula, or concept in general terms.
- If they already received hints, go slightly deeper without giving away the answer.`;

  if (question?.type === "journal_entry") {
    return `${baseRules}
- For journal entries: ask what kind of transaction occurred and which category of the accounting equation is affected (asset, liability, equity, revenue, expense) — never map to specific ledger accounts.`;
  }

  return baseRules;
}

function buildPerformanceGuidance(context?: Record<string, unknown> | null): string {
  if (!context || typeof context !== "object") return "";

  const chapter = context.chapter as Record<string, unknown> | undefined;
  const question = context.question as Record<string, unknown> | undefined;
  const revisionAreas = Array.isArray(context.recommendedRevisionAreas)
    ? context.recommendedRevisionAreas
    : [];
  const weakest = Array.isArray(context.weakestTopics) ? context.weakestTopics : [];

  const lines: string[] = [];

  if (chapter && typeof chapter.averageScore === "number" && (chapter.totalQuizzes as number) > 0) {
    lines.push(
      `Chapter performance: ${chapter.averageScore}% average across ${chapter.totalQuizzes} quiz${(chapter.totalQuizzes as number) === 1 ? "" : "zes"}.`
    );
  }

  if (question && (question.attempts as number) > 0) {
    lines.push(
      `This question: ${question.accuracy}% accuracy over ${question.attempts} attempt${(question.attempts as number) === 1 ? "" : "s"}.`
    );
  }

  if (weakest.length > 0) {
    const labels = weakest
      .slice(0, 3)
      .map((entry) => {
        const item = entry as Record<string, unknown>;
        const text = String(item.question ?? "Unknown question");
        return `"${text.slice(0, 60)}${text.length > 60 ? "..." : ""}" (${item.accuracy ?? "?"}%)`;
      })
      .join("; ");
    lines.push(`Weakest areas in this chapter: ${labels}.`);
  }

  if (revisionAreas.length > 0) {
    const tags = revisionAreas
      .slice(0, 3)
      .map((entry) => {
        const item = entry as Record<string, unknown>;
        return String(item.label ?? item.tag ?? "concept");
      })
      .join(", ");
    lines.push(`Recommend revisiting: ${tags}.`);
  }

  if (lines.length === 0) return "";

  return `

Use this student performance context to personalize your response:
${lines.map((line) => `- ${line}`).join("\n")}
- Emphasize weak areas with extra clarity and targeted practice suggestions.
- Reference chapter performance when explaining why a concept matters.`;
}

function buildSystemPrompt(
  intent: TutorIntent,
  question?: Record<string, unknown>,
  performanceContext?: Record<string, unknown> | null
): string {
  const base =
    "You are a friendly ACCTG 102 accounting tutor. Use clear, exam-focused language. Keep responses concise (2-4 short paragraphs max unless the student asks for more).";
  const performanceGuidance = buildPerformanceGuidance(performanceContext);

  switch (intent) {
    case "hint":
      return `${base}

Give a helpful hint for the current question.
${buildHintPrompt(question)}${performanceGuidance}`;
    case "explain":
      return `${base}

Explain the accounting concept behind this question.
- Use the provided official explanation as ground truth when available.
- If the student was wrong, compare their submitted answer to the correct approach line by line.
- Name what is incorrect in their answer, then explain the correct reasoning.
- Teach the concept so they can apply it to similar questions.${performanceGuidance}`;
    case "ask":
      return `${base}

Answer the student's follow-up question in the context of the current quiz question.
- Stay focused on accounting concepts relevant to ACCTG 102.
- If they ask for the direct answer before attempting the question, give guidance instead of the final answer.${performanceGuidance}`;
    default:
      return base;
  }
}

function buildUserPrompt(request: TutorRequest): string {
  const questionForPrompt =
    request.intent === "hint" ? stripAnswers(request.question) : request.question;
  const isWhyWrong = request.userMessage?.toLowerCase().includes("wrong") ?? false;

  const payload = {
    intent: request.intent,
    question: questionForPrompt,
    currentAnswer: request.currentAnswer ?? null,
    userMessage: request.userMessage ?? null,
    priorMessages: request.messages ?? [],
    performanceContext: request.performanceContext ?? null,
    ...(isWhyWrong ? { task: "Explain why the submitted answer is wrong and how to fix it." } : {}),
  };

  return JSON.stringify(payload, null, 2);
}

export function isRetriableTutorAiError(message: string): boolean {
  return (
    message.includes("Failed to parse JSON") ||
    message.includes("invalid JSON") ||
    message.includes("OpenAI returned empty content") ||
    message.includes("bad_response_body") ||
    message.includes("timed out")
  );
}

export function shouldUseTutorFallback(message: string): boolean {
  return message.includes("OPENAI_API_KEY") || message.includes("OpenAI API") || isRetriableTutorAiError(message);
}

async function callTutorModel(request: TutorRequest): Promise<string> {
  const history = (request.messages ?? []).flatMap((entry) => [
    { role: entry.role, content: entry.content } as const,
  ]);

  const content = await chatCompletion(
    [
      { role: "system", content: buildSystemPrompt(request.intent, request.question, request.performanceContext) },
      ...history,
      { role: "user", content: buildUserPrompt(request) },
    ],
    { temperature: request.intent === "hint" ? 0.3 : 0.4, timeoutMs: 60_000 }
  );

  return content.trim();
}

export async function createTutorResponse(request: TutorRequest): Promise<TutorResponse> {
  if (!request.question || typeof request.question !== "object") {
    throw new Error("Question context is required");
  }

  if (request.intent === "ask" && !request.userMessage?.trim()) {
    throw new Error("userMessage is required for ask intent");
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return { message: await callTutorModel(request) };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (!isRetriableTutorAiError(lastError.message)) {
        throw lastError;
      }
    }
  }

  throw lastError ?? new Error("Failed to generate tutor response");
}

export function buildFallbackTutorResponse(request: TutorRequest): TutorResponse {
  const prompt = getPromptText(request.question);
  const topic = String(request.question.topic ?? "this topic");
  const tags = Array.isArray(request.question.tags) ? request.question.tags.join(", ") : "";
  const explanation = String(request.question.explanation ?? "");

  if (request.intent === "hint") {
    if (request.question.type === "journal_entry") {
      return {
        message: tags
          ? `Review the ${tags.replaceAll("_", " ")} concept for ${topic}. What type of transaction is described, and which part of the accounting equation does it affect?`
          : `Identify the transaction type in this question, then decide which elements of the accounting equation increase or decrease — without writing specific account names yet.`,
      };
    }

    return {
      message: tags
        ? `Review the ${tags.replaceAll("_", " ")} rules for ${topic}. What is the question really asking you to apply?`
        : `Focus on the core concept in "${prompt.slice(0, 80)}${prompt.length > 80 ? "..." : ""}" and recall the related chapter notes for ${topic}.`,
    };
  }

  if (request.intent === "explain") {
    const feedback = String(
      (request.currentAnswer as { evaluation?: { feedback?: string } } | null)?.evaluation?.feedback ?? ""
    );
    const isWhyWrong = request.userMessage?.toLowerCase().includes("wrong") ?? false;

    if (isWhyWrong) {
      const parts = [feedback, explanation].filter(Boolean);
      if (parts.length > 0) {
        return { message: parts.join("\n\n") };
      }
    }

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
