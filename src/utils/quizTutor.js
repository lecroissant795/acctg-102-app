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

  return {
    message: tags
      ? `Review ${tags.replaceAll("_", " ")} for ${topic}. What accounts change, and do they increase or decrease?`
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
