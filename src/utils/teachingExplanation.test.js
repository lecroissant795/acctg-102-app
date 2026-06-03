import { describe, expect, test } from "bun:test";
import {
  buildTeachingExplanation,
  getDisplayExplanation,
  getDisplayExplanationBullets,
  isRedundantExplanation,
} from "./teachingExplanation.js";

describe("teachingExplanation", () => {
  test("buildTeachingExplanation does not only repeat the answer phrase", () => {
    const bullets = buildTeachingExplanation({
      q: "Which statement best distinguishes accrual accounting from cash accounting?",
      a: "Revenue and expenses are recognised when earned or incurred, even if cash has not yet moved.",
      tags: ["adjusting_entries"],
    });

    expect(Array.isArray(bullets)).toBe(true);
    expect(bullets.length).toBeGreaterThanOrEqual(2);
    expect(bullets.join(" ").toLowerCase()).toContain("accrual");
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
