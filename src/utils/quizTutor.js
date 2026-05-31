import { buildTeachingExplanation, getDisplayExplanation } from "./teachingExplanation.js";
import { buildTeachingHint } from "./teachingHint.js";

export async function fetchTutorResponse(payload) {
  const response = await fetch("/api/quiz-tutor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `Tutor request failed (${response.status})`);
  }

  return response.json();
}

export async function requestTutorResponse(payload, fallback) {
  try {
    const result = await fetchTutorResponse(payload);
    return { ...result, usedFallback: false };
  } catch {
    return { ...fallback(payload), usedFallback: true };
  }
}

function getPayloadQuestion(payload) {
  return payload?.question ?? payload;
}

function getPayloadCurrentAnswer(payload) {
  return payload?.currentAnswer ?? null;
}

function isWhyWrongRequest(payload) {
  return String(payload?.userMessage ?? "")
    .toLowerCase()
    .includes("wrong");
}

export function formatStudentAnswer(question, currentAnswer) {
  const responseSummary =
    currentAnswer?.evaluation?.responseSummary ?? currentAnswer?.response ?? {};
  const type = currentAnswer?.questionType ?? question?.type;

  switch (type) {
    case "select_multiple":
      return (responseSummary.selectedIndices ?? [])
        .map((index) => question.options?.[index])
        .filter(Boolean)
        .join(", ");
    case "numeric_input":
      return responseSummary.value == null ? null : String(responseSummary.value);
    case "journal_entry":
      return (responseSummary.lines ?? [])
        .map((line) => {
          const amount =
            line.debit != null ? `Dr ${line.debit}` : line.credit != null ? `Cr ${line.credit}` : "";
          return `${line.account} ${amount}`.trim();
        })
        .filter(Boolean)
        .join(" · ");
    case "matching":
      return Object.entries(responseSummary.pairs ?? {})
        .map(([leftId, rightId]) => `${leftId} → ${rightId}`)
        .join(", ");
    case "ordering":
      return (responseSummary.orderedIds ?? []).join(" → ");
    case "table_classification":
      return Object.entries(responseSummary.mapping ?? {})
        .map(([rowId, column]) => `${rowId}: ${column}`)
        .join(", ");
    default:
      return question.options?.[responseSummary.selectedIndex] ?? null;
  }
}

export function formatCorrectAnswer(question) {
  switch (question?.type) {
    case "select_multiple":
      return (question.answer?.correctIndices ?? [])
        .map((index) => question.options?.[index])
        .filter(Boolean)
        .join(", ");
    case "numeric_input":
      return question.answer?.value == null ? null : String(question.answer.value);
    case "journal_entry":
      return (question.answer?.lines ?? [])
        .map((line) => {
          const amount = line.side === "debit" ? `Dr ${line.amount}` : `Cr ${line.amount}`;
          return `${line.account} ${amount}`;
        })
        .join(" · ");
    default:
      return (
        question.options?.[question.answer?.correctIndex ?? question.answer] ??
        question.answer?.sampleAnswer ??
        null
      );
  }
}

export function buildHintPayload(question, performanceContext = null) {
  return {
    intent: "hint",
    question,
    performanceContext,
    messages: [],
  };
}

export function buildExplainPayload(question, currentAnswer, userMessage = null, performanceContext = null) {
  return {
    intent: "explain",
    question,
    currentAnswer,
    userMessage,
    performanceContext,
    messages: [],
  };
}

export function buildAskPayload(question, currentAnswer, userMessage, messages = [], performanceContext = null) {
  return {
    intent: "ask",
    question,
    currentAnswer,
    userMessage,
    performanceContext,
    messages,
  };
}

export function buildFallbackHint(payload) {
  const question = getPayloadQuestion(payload);
  return { message: buildTeachingHint(question) };
}

export function buildFallbackExplain(payload) {
  const question = getPayloadQuestion(payload);
  const currentAnswer = getPayloadCurrentAnswer(payload);
  const feedback = currentAnswer?.evaluation?.feedback;
  const explanation = getDisplayExplanation(question);
  const yourAnswer = formatStudentAnswer(question, currentAnswer);
  const correctAnswer = formatCorrectAnswer(question);
  const teaching =
    explanation ??
    buildTeachingExplanation({
      q: question.q ?? question.prompt ?? "",
      a: correctAnswer ?? "",
      tags: question.tags ?? [],
    });

  if (isWhyWrongRequest(payload)) {
    const parts = [];

    if (yourAnswer) {
      parts.push(`Your answer: ${yourAnswer}`);
    }

    if (feedback) {
      parts.push(feedback);
    }

    if (correctAnswer) {
      parts.push(`Correct approach: ${correctAnswer}`);
    }

    if (teaching) {
      parts.push(`Why this is right: ${teaching}`);
    }

    if (parts.length > 0) {
      return { message: parts.join("\n\n") };
    }
  }

  return {
    message:
      teaching ||
      `Review the notes for ${question.topic ?? "this chapter"} and focus on the underlying accounting rule.`,
  };
}

export function buildFallbackAsk() {
  return {
    message:
      "AI tutoring is offline. Use the explanation above and your chapter notes to work through this concept.",
  };
}
