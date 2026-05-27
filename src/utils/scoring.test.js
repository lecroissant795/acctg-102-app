import { test, expect } from "bun:test";
import { QUESTION_TYPES } from "../data/schema/questionTypes.js";
import { createAnswerRecord, evaluateQuestion } from "./scoring/index.js";

test("scores select_multiple with partial credit and penalties", () => {
  const question = {
    id: "sm-1",
    type: QUESTION_TYPES.SELECT_MULTIPLE,
    points: 2,
    answer: {
      correctIndices: [0, 2, 3],
      scoringMode: "partial",
    },
  };

  const result = evaluateQuestion(question, { selectedIndices: [0, 1, 2] });

  expect(result.correct).toBe(false);
  expect(result.scoreAwarded).toBeCloseTo(0.67, 2);
  expect(result.breakdown.correctSelections).toBe(2);
  expect(result.breakdown.wrongSelections).toBe(1);
});

test("scores numeric_input with tolerance", () => {
  const question = {
    id: "num-1",
    type: QUESTION_TYPES.NUMERIC_INPUT,
    points: 1,
    answer: {
      value: 230,
      tolerance: 0.01,
    },
  };

  const result = evaluateQuestion(question, { value: "230.005" });
  expect(result.correct).toBe(true);
  expect(result.scoreAwarded).toBe(1);
});

test("scores journal entries with aliases and balancing", () => {
  const question = {
    id: "je-1",
    type: QUESTION_TYPES.JOURNAL_ENTRY,
    points: 2,
    answer: {
      lines: [
        { account: "Accounts Receivable", side: "debit", amount: 4400 },
        { account: "Sales Revenue", side: "credit", amount: 4000 },
        { account: "GST Payable", side: "credit", amount: 400 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: {
          "Accounts Receivable": ["Debtors"],
        },
      },
    },
  };

  const result = evaluateQuestion(question, {
    lines: [
      { account: "Debtors", debit: 4400 },
      { account: "Sales Revenue", credit: 4000 },
      { account: "GST Payable", credit: 400 },
    ],
  });

  expect(result.correct).toBe(true);
  expect(result.scoreAwarded).toBe(2);
  expect(result.breakdown.balanced).toBe(true);
});

test("scores matching with per-pair partial credit", () => {
  const question = {
    id: "match-1",
    type: QUESTION_TYPES.MATCHING,
    points: 2,
    answer: {
      pairs: {
        a: "x",
        b: "y",
      },
    },
  };

  const result = evaluateQuestion(question, {
    pairs: {
      a: "x",
      b: "z",
    },
  });

  expect(result.correct).toBe(false);
  expect(result.scoreAwarded).toBe(1);
  expect(result.breakdown.correctPairs).toBe(1);
});

test("scores case sets by aggregating subquestions", () => {
  const question = {
    id: "case-1",
    type: QUESTION_TYPES.CASE_SET,
    subquestions: [
      {
        id: "sub-1",
        type: QUESTION_TYPES.NUMERIC_INPUT,
        points: 1,
        answer: { value: 100, tolerance: 0.01 },
      },
      {
        id: "sub-2",
        type: QUESTION_TYPES.MCQ,
        points: 1,
        answer: { correctIndex: 1 },
      },
    ],
  };

  const result = evaluateQuestion(question, {
    subresponses: {
      "sub-1": { value: 100 },
      "sub-2": { selectedIndex: 0 },
    },
  });

  expect(result.correct).toBe(false);
  expect(result.scoreAwarded).toBe(1);
  expect(result.maxScore).toBe(2);
});

test("creates typed answer records", () => {
  const question = {
    id: "mcq-1",
    type: QUESTION_TYPES.MCQ,
    points: 1,
    answer: {
      correctIndex: 2,
    },
  };

  const record = createAnswerRecord(question, { selectedIndex: 2 });

  expect(record.questionId).toBe("mcq-1");
  expect(record.questionType).toBe(QUESTION_TYPES.MCQ);
  expect(record.evaluation.correct).toBe(true);
});
