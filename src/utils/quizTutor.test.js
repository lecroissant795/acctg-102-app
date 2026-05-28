import { describe, expect, test } from "bun:test";
import { QUESTION_TYPES } from "../data/schema/questionTypes.js";
import { createAnswerRecord } from "./scoring/index.js";
import {
  buildExplainPayload,
  buildFallbackExplain,
  buildHintPayload,
  requestTutorResponse,
} from "./quizTutor.js";

describe("quizTutor client", () => {
  test("requestTutorResponse falls back when API fails", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ error: "Unavailable" }), { status: 503 });

    try {
      const result = await requestTutorResponse(
        buildHintPayload({
          topic: "Ch 1: Introduction to Accounting",
          prompt: "What is accounting?",
        }),
        (payload) => ({
          message: `Fallback for ${payload.question.topic}`,
        })
      );

      expect(result.usedFallback).toBe(true);
      expect(result.message).toContain("Ch 1");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("buildFallbackExplain explains a wrong journal entry answer", () => {
    const question = {
      type: QUESTION_TYPES.JOURNAL_ENTRY,
      topic: "Journal Entries",
      q: "Record owner investing $15,000 cash.",
      answer: {
        lines: [
          { account: "Cash", side: "debit", amount: 15000 },
          { account: "Share Capital", side: "credit", amount: 15000 },
        ],
      },
      explanation: "Cash increases and equity increases through share capital.",
    };
    const currentAnswer = createAnswerRecord(question, {
      lines: [
        { account: "Cash", debit: 15000 },
        { account: "Revenue", credit: 15000 },
      ],
    });
    const payload = buildExplainPayload(
      question,
      currentAnswer,
      "Explain why my answer was wrong."
    );
    const result = buildFallbackExplain(payload);

    expect(result.message).toContain("Your answer:");
    expect(result.message).toContain("Revenue");
    expect(result.message).toContain("Share Capital");
    expect(result.message).toContain("Cash increases");
  });
});
