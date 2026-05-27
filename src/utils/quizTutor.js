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

export function buildHintPayload(question) {
  return {
    intent: "hint",
    question,
    messages: [],
  };
}

export function buildExplainPayload(question, currentAnswer, userMessage = null) {
  return {
    intent: "explain",
    question,
    currentAnswer,
    userMessage,
    messages: [],
  };
}

export function buildAskPayload(question, currentAnswer, userMessage, messages = []) {
  return {
    intent: "ask",
    question,
    currentAnswer,
    userMessage,
    messages,
  };
}

export function buildFallbackHint(question) {
  const topic = question.topic ?? "this topic";
  const tags = Array.isArray(question.tags) ? question.tags.join(", ") : "";

  if (question.type === "journal_entry") {
    return {
      message: tags
        ? `Review the ${tags.replaceAll("_", " ")} concept for ${topic}. What type of transaction is described, and which part of the accounting equation does it affect?`
        : `Identify the transaction type, then decide which elements of the accounting equation increase or decrease — without naming specific accounts yet.`,
    };
  }

  return {
    message: tags
      ? `Review the ${tags.replaceAll("_", " ")} rules for ${topic}. What is the question really asking you to apply?`
      : `Re-read the question and identify which accounting rule from ${topic} applies before choosing an answer.`,
  };
}

export function buildFallbackExplain(question) {
  return {
    message:
      question.explanation ??
      `Review the notes for ${question.topic ?? "this chapter"} and focus on the underlying accounting rule.`,
  };
}

export function buildFallbackAsk() {
  return {
    message:
      "AI tutoring is offline. Use the explanation above and your chapter notes to work through this concept.",
  };
}
