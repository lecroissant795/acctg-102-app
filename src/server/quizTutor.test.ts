import { describe, expect, test } from "bun:test";
import { buildFallbackTutorResponse, createTutorResponse } from "./quizTutor.ts";

describe("quizTutor", () => {
  test("buildFallbackTutorResponse returns a hint without revealing answers", () => {
    const response = buildFallbackTutorResponse({
      intent: "hint",
      question: {
        prompt: "Which account has a normal debit balance?",
        topic: "Ch 2: The Recording Process",
        tags: ["debit_credit"],
      },
    });

    expect(response.message.toLowerCase()).toContain("debit");
    expect(response.message.toLowerCase()).not.toContain("correct answer");
  });

  test("createTutorResponse requires userMessage for ask intent", async () => {
    await expect(
      createTutorResponse({
        intent: "ask",
        question: { prompt: "Test question" },
      })
    ).rejects.toThrow("userMessage is required");
  });
});
