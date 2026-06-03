import { test, expect } from "bun:test";
import { QUESTION_TYPES } from "../data/schema/questionTypes.js";
import {
  createAnswerRecord,
  evaluateQuestion,
  getJournalEntryAnswerKey,
  getJournalEntryRowFeedback,
} from "./scoring/index.js";

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

test("scores journal entries when the same account appears on both sides", () => {
  const question = {
    id: "je-dup",
    type: QUESTION_TYPES.JOURNAL_ENTRY,
    points: 4,
    answer: {
      lines: [
        { account: "Accounts Receivable", side: "debit", amount: 540 },
        { account: "Allowance for Doubtful Debts", side: "credit", amount: 540 },
        { account: "Cash", side: "debit", amount: 540 },
        { account: "Accounts Receivable", side: "credit", amount: 540 },
      ],
      rules: { requireBalancedEntry: true },
    },
  };

  const result = evaluateQuestion(question, {
    lines: [
      { account: "Accounts Receivable", debit: 540 },
      { account: "Allowance for Doubtful Debts", credit: 540 },
      { account: "Cash", debit: 540 },
      { account: "Accounts Receivable", credit: 540 },
    ],
  });

  expect(result.correct).toBe(true);
  expect(result.scoreAwarded).toBe(4);
});

test("journal entry feedback names wrong accounts", () => {
  const question = {
    id: "je-feedback",
    type: QUESTION_TYPES.JOURNAL_ENTRY,
    points: 2,
    answer: {
      lines: [
        { account: "Cash", side: "debit", amount: 15000 },
        { account: "Share Capital", side: "credit", amount: 15000 },
      ],
      rules: { requireBalancedEntry: true },
    },
  };

  const result = evaluateQuestion(question, {
    lines: [
      { account: "Cash", debit: 15000 },
      { account: "Revenue", credit: 15000 },
    ],
  });

  expect(result.correct).toBe(false);
  expect(result.feedback).toContain("Share Capital");
  expect(result.feedback).toContain("Revenue");
});

test("getJournalEntryRowFeedback marks wrong account and amount fields", () => {
  const question = {
    id: "je-ui",
    type: QUESTION_TYPES.JOURNAL_ENTRY,
    points: 2,
    answer: {
      lines: [
        { account: "Cash", side: "debit", amount: 15000 },
        { account: "Share Capital", side: "credit", amount: 15000 },
      ],
      rules: { requireBalancedEntry: true },
    },
  };

  const feedback = getJournalEntryRowFeedback(question, [
    { account: "Cash", debit: 15000, credit: null },
    { account: "Revenue", debit: null, credit: 15000 },
  ]);

  expect(feedback[0].account).toBe("correct");
  expect(feedback[0].debit).toBe("correct");
  expect(feedback[1].account).toBe("wrong");
  expect(feedback[1].credit).toBe("wrong");
  expect(getJournalEntryAnswerKey(question)).toEqual([
    { account: "Cash", debit: "15000", credit: "" },
    { account: "Share Capital", debit: "", credit: "15000" },
  ]);
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
