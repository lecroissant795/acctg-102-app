import { describe, expect, test } from "bun:test";
import {
  buildTeachingExplanation,
  getDisplayExplanation,
  getDisplayExplanationBullets,
  isRedundantExplanation,
} from "./teachingExplanation.js";

describe("teachingExplanation", () => {
  test("buildTeachingExplanation uses question-specific reasoning and wrong-option contrasts", () => {
    const bullets = buildTeachingExplanation({
      q: "On 28 June, Apex Ltd delivers goods to a customer on credit. Payment is expected in August. When should revenue be recognised under accrual accounting?",
      a: "In June, when control of the goods passes to the customer.",
      tags: ["adjusting_entries"],
      options: [
        "In June, when control of the goods passes to the customer.",
        "In August, when cash is collected from the customer",
        "In July, when the invoice is mailed to the customer",
        "Evenly over June, July, and August as cash is expected",
      ],
      answer: 0,
    });

    const combined = bullets.join(" ").toLowerCase();

    expect(Array.isArray(bullets)).toBe(true);
    expect(bullets.length).toBeGreaterThanOrEqual(2);
    expect(combined).toContain("june");
    expect(combined).toContain("august");
    expect(combined).not.toContain("the other options are related ideas");
    expect(combined).not.toContain("distractors often");
  });

  test("isRedundantExplanation detects answer-only explanations", () => {
    const question = {
      q: "Which basis is being applied?",
      options: ["Accrual", "Cash basis accounting.", "Tax basis", "Fair value"],
      answer: 1,
      explanation: "Cash basis accounting.",
    };

    expect(isRedundantExplanation(question)).toBe(true);
    expect(getDisplayExplanation(question)).toContain("•");
    expect(getDisplayExplanation(question)).not.toBe("Cash basis accounting.");
  });

  test("getDisplayExplanationBullets splits rich stored explanations", () => {
    const question = {
      q: "What is depreciation?",
      options: ["A", "B", "C", "D"],
      answer: 1,
      explanation:
        "Depreciation spreads the cost of a long-term asset over the periods it helps generate revenue, not when cash is paid.",
    };

    const bullets = getDisplayExplanationBullets(question);
    expect(bullets).toHaveLength(1);
    expect(bullets[0]).toBe(question.explanation);
  });

  test("getDisplayExplanationBullets replaces generic stored explanations", () => {
    const question = {
      q: "A retailer pays rent on 1 January for the full year but only occupies the premises from February. Under accrual accounting, what issue does Chapter 3 primarily address?",
      options: [
        "Recording only transactions that change the cash balance during the period",
        "Valuing all assets at current market prices at each month-end reporting date",
        "Eliminating the need to prepare any trial balance before issuing statements",
        "Matching economic activity to the correct reporting period, not merely to cash flows.",
      ],
      answer: 3,
      explanation:
        "The concept being tested (adjusting entries): matching economic activity to the correct reporting period, not merely to cash flows. The other options are related ideas or common mistakes, but they do not meet the specific requirement in the question stem.",
    };

    const bullets = getDisplayExplanationBullets(question);
    const combined = bullets.join(" ").toLowerCase();

    expect(bullets.length).toBeGreaterThanOrEqual(2);
    expect(combined).not.toContain("the other options are related ideas");
    expect(combined).toMatch(/cash balance|fair value|trial balance/);
  });

  test("getDisplayExplanationBullets enriches vague journal entry explanations", () => {
    const question = {
      type: "journal_entry",
      q: "Record the owner investing cash of $15,000 into the business.",
      answer: {
        lines: [
          { account: "Cash", side: "debit", amount: 15000 },
          { account: "Share Capital", side: "credit", amount: 15000 },
        ],
      },
      explanation: "Cash increases and owner contribution increases equity.",
      tags: ["equity", "debit_credit"],
    };

    const bullets = getDisplayExplanationBullets(question);
    expect(bullets.length).toBeGreaterThan(2);
    expect(bullets.join(" ").toLowerCase()).toMatch(/equity|owner|contribution/);
    expect(bullets.some((item) => item.includes("Cash — Debit"))).toBe(true);
    expect(bullets.some((item) => item.toLowerCase().includes("common mistake"))).toBe(true);
  });
});
