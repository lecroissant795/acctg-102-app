import { describe, expect, test } from "bun:test";
import { validatePracticeQuiz, type PracticeQuizRequest } from "./practiceQuizGenerator.ts";

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
