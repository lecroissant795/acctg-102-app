import { describe, expect, test } from "bun:test";
import {
  buildTeachingExplanation,
  getDisplayExplanation,
  isRedundantExplanation,
} from "./teachingExplanation.js";

describe("teachingExplanation", () => {
  test("buildTeachingExplanation does not only repeat the answer phrase", () => {
    const explanation = buildTeachingExplanation({
      q: "Which statement best distinguishes accrual accounting from cash accounting?",
      a: "Revenue and expenses are recognised when earned or incurred, even if cash has not yet moved.",
      tags: ["adjusting_entries"],
    });

    expect(explanation.toLowerCase()).toContain("accrual");
    expect(explanation.length).toBeGreaterThan(
      "Revenue and expenses are recognised when earned or incurred, even if cash has not yet moved.".length
    );
  });

  test("isRedundantExplanation detects answer-only explanations", () => {
    const question = {
      q: "Which basis is being applied?",
      options: ["Accrual", "Cash basis accounting.", "Tax basis", "Fair value"],
      answer: 1,
      explanation: "Cash basis accounting.",
    };

    expect(isRedundantExplanation(question)).toBe(true);
    expect(getDisplayExplanation(question)).not.toBe("Cash basis accounting.");
  });

  test("getDisplayExplanation keeps rich stored explanations", () => {
    const question = {
      q: "What is depreciation?",
      options: ["A", "B", "C", "D"],
      answer: 1,
      explanation:
        "Depreciation spreads the cost of a long-term asset over the periods it helps generate revenue, not when cash is paid.",
    };

    expect(isRedundantExplanation(question)).toBe(false);
    expect(getDisplayExplanation(question)).toBe(question.explanation);
  });
});
