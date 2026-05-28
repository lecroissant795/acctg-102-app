import { describe, expect, test } from "bun:test";
import {
  buildFallbackTutorResponse,
  createTutorResponse,
  shouldUseTutorFallback,
} from "./quizTutor.ts";

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

  test("buildFallbackTutorResponse avoids naming accounts for journal entries", () => {
    const response = buildFallbackTutorResponse({
      intent: "hint",
      question: {
        type: "journal_entry",
        prompt: "Record a credit sale of $4,400 including GST.",
        topic: "Ch 2: The Recording Process",
        tags: ["gst", "debit_credit"],
      },
    });

    expect(response.message.toLowerCase()).not.toContain("accounts receivable");
    expect(response.message.toLowerCase()).not.toContain("gst payable");
    expect(response.message.toLowerCase()).toContain("accounting equation");
  });

  test("falls back when tutor AI response cannot be parsed", () => {
    expect(shouldUseTutorFallback("Failed to parse JSON")).toBe(true);
    expect(shouldUseTutorFallback("OpenAI API returned invalid JSON (1200 bytes)")).toBe(true);
  });

  test("buildFallbackTutorResponse explains wrong answers using feedback", () => {
    const response = buildFallbackTutorResponse({
      intent: "explain",
      userMessage: "Explain why my answer was wrong.",
      question: {
        explanation: "Debit receivable and split GST from revenue.",
      },
      currentAnswer: {
        evaluation: {
          feedback: "Journal entry is partially correct.",
        },
      },
    });

    expect(response.message).toContain("partially correct");
    expect(response.message).toContain("Debit receivable");
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
