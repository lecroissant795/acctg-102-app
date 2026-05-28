import { describe, expect, test } from "bun:test";
import {
  isRetriablePracticeAiError,
  prioritizePracticeSeeds,
  selectAiPracticeSeeds,
  shouldUsePracticeFallback,
  validatePracticeQuiz,
  type PracticeQuizRequest,
} from "./practiceQuizGenerator.ts";

const journalSeed = {
  sourceId: "seed-1",
  topic: "Ch 2: The Recording Process",
  attempts: 2,
  incorrect: 1,
  question: {
    id: "seed-1",
    type: "journal_entry",
    q: "Record a credit sale of $4,400 including GST.",
    answer: {
      lines: [
        { account: "Accounts Receivable", side: "debit", amount: 4400 },
        { account: "Sales Revenue", side: "credit", amount: 4000 },
        { account: "GST Payable", side: "credit", amount: 400 },
      ],
    },
    explanation: "Debit receivable for the full amount and split revenue and GST payable.",
  },
};

describe("selectAiPracticeSeeds", () => {
  test("limits AI generation to the weakest seeds", () => {
    const seeds = Array.from({ length: 12 }, (_, index) => ({
      sourceId: `seed-${index}`,
      topic: "Ch 2",
      attempts: index,
      incorrect: 12 - index,
      question: journalSeed.question,
    }));

    const { aiSeeds, remainderSeeds } = selectAiPracticeSeeds(seeds);

    expect(aiSeeds).toHaveLength(6);
    expect(remainderSeeds).toHaveLength(6);
    expect(aiSeeds[0]?.sourceId).toBe("seed-0");
    expect(aiSeeds.at(-1)?.sourceId).toBe("seed-5");
    expect(remainderSeeds[0]?.sourceId).toBe("seed-6");
  });

  test("prioritizes higher incorrect counts first", () => {
    const seeds = [
      { ...journalSeed, sourceId: "low", incorrect: 0, attempts: 1 },
      { ...journalSeed, sourceId: "high", incorrect: 5, attempts: 2 },
    ];

    expect(prioritizePracticeSeeds(seeds).map((seed) => seed.sourceId)).toEqual([
      "high",
      "low",
    ]);
  });
});

describe("practice AI error handling", () => {
  test("treats malformed API JSON as retriable", () => {
    expect(isRetriablePracticeAiError("Failed to parse JSON")).toBe(true);
    expect(isRetriablePracticeAiError("OpenAI API returned invalid JSON (1200 bytes)")).toBe(true);
  });

  test("falls back when practice AI output cannot be parsed", () => {
    expect(shouldUsePracticeFallback("Failed to parse JSON")).toBe(true);
    expect(shouldUsePracticeFallback("Invalid practice quiz from LLM: missing sourceId")).toBe(true);
    expect(shouldUsePracticeFallback("Something else")).toBe(false);
  });
});

describe("validatePracticeQuiz", () => {
  const request: PracticeQuizRequest = {
    practiceLabel: "Journal Entries",
    questionType: "journal_entry",
    seeds: [journalSeed],
    summary: { totalQuizzes: 1, accuracy: 70, recentModes: [] },
  };

  test("accepts a valid generated practice quiz", () => {
    const quiz = {
      strategy: "variant_focus",
      rationale: "Fresh journal scenarios based on your weak areas.",
      questions: [
        {
          sourceId: "seed-1",
          question: {
            type: "journal_entry",
            q: "Record a credit sale of $2,200 including GST.",
            answer: {
              lines: [
                { account: "Accounts Receivable", side: "debit", amount: 2200 },
                { account: "Sales Revenue", side: "credit", amount: 2000 },
                { account: "GST Payable", side: "credit", amount: 200 },
              ],
            },
            explanation: "Same GST split pattern with new amounts.",
          },
        },
      ],
    };

    expect(validatePracticeQuiz(quiz, request)).toBeNull();
  });

  test("rejects wrong question type", () => {
    const quiz = {
      strategy: "bad",
      rationale: "Bad",
      questions: [
        {
          sourceId: "seed-1",
          question: {
            type: "numeric_input",
            q: "How much GST?",
            answer: { value: 100 },
            explanation: "Wrong type",
          },
        },
      ],
    };

    expect(validatePracticeQuiz(quiz, request)).toContain("wrong type");
  });
});
