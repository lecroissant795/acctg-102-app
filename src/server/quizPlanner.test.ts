import { describe, expect, test } from "bun:test";
import { validateQuizPlan, type QuizPlanRequest } from "./quizPlanner.ts";

const basePool = [
  {
    id: "Ch 1::Question one",
    topic: "Ch 1: Introduction to Accounting",
    attempts: 0,
    correct: 0,
    incorrect: 0,
    lastWrongAt: null,
  },
  {
    id: "Ch 2::Question two",
    topic: "Ch 2: The Recording Process",
    attempts: 2,
    correct: 1,
    incorrect: 1,
    lastWrongAt: "2026-05-28T12:00:00.000Z",
  },
];

describe("validateQuizPlan", () => {
  test("accepts a valid mini quiz plan", () => {
    const request: QuizPlanRequest = {
      mode: "mini",
      size: 1,
      pool: basePool,
      summary: { totalQuizzes: 1, accuracy: 50, recentModes: [] },
    };

    const plan = {
      strategy: "weak_focus",
      rationale: "Review missed questions first.",
      questions: [{ id: "Ch 2::Question two", shuffleOptions: true }],
    };

    expect(validateQuizPlan(plan, request)).toBeNull();
  });

  test("rejects unknown question ids", () => {
    const request: QuizPlanRequest = {
      mode: "all",
      pool: basePool,
      summary: { totalQuizzes: 0, accuracy: 0, recentModes: [] },
    };

    const plan = {
      strategy: "invalid",
      rationale: "Bad plan",
      questions: [
        { id: "Ch 1::Question one", shuffleOptions: false },
        { id: "Ch 99::Missing", shuffleOptions: true },
      ],
    };

    expect(validateQuizPlan(plan, request)).toContain("unknown question id");
  });

  test("requires all pool questions for full exam mode", () => {
    const request: QuizPlanRequest = {
      mode: "all",
      pool: basePool,
      summary: { totalQuizzes: 0, accuracy: 0, recentModes: [] },
    };

    const plan = {
      strategy: "partial",
      rationale: "Incomplete",
      questions: [{ id: "Ch 1::Question one", shuffleOptions: false }],
    };

    expect(validateQuizPlan(plan, request)).toContain("expected 2 questions");
  });

  test("requires all pool questions for practice mode", () => {
    const request: QuizPlanRequest = {
      mode: "practice",
      practiceLabel: "Journal Entries",
      pool: basePool,
      summary: { totalQuizzes: 0, accuracy: 0, recentModes: [] },
    };

    const plan = {
      strategy: "practice_focus",
      rationale: "Review weak practice items first.",
      questions: [
        { id: "Ch 2::Question two", shuffleOptions: false },
        { id: "Ch 1::Question one", shuffleOptions: false },
      ],
    };

    expect(validateQuizPlan(plan, request)).toBeNull();
  });
});
