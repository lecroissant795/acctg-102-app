import { describe, expect, test } from "bun:test";
import {
  getDisplayOptionIndex,
  getOriginalOptionIndex,
  shuffleQuestionOptions,
} from "./shuffle.js";

describe("shuffleQuestionOptions", () => {
  const question = {
    q: "Sample question?",
    options: ["A", "B", "C", "D"],
    answer: 2,
    explanation: "Because C.",
    topic: "Ch 1: Introduction to Accounting",
  };

  test("preserves all options and maps the correct answer", () => {
    const shuffled = shuffleQuestionOptions(question);

    expect([...shuffled.displayOptions].sort()).toEqual([...question.options].sort());
    expect(shuffled.displayOptions[shuffled.displayAnswer]).toBe(
      question.options[question.answer]
    );
    expect(shuffled.optionsShuffled).toBe(true);
  });

  test("keeps original answer index unchanged on the base question", () => {
    const shuffled = shuffleQuestionOptions(question);
    expect(shuffled.answer).toBe(2);
    expect(shuffled.options).toEqual(question.options);
  });

  test("converts between display and original option indices", () => {
    const shuffled = {
      options: ["A", "B", "C", "D"],
      displayOptions: ["C", "A", "D", "B"],
      displayAnswer: 0,
      answer: 2,
    };

    expect(getOriginalOptionIndex(shuffled, 0)).toBe(2);
    expect(getDisplayOptionIndex(shuffled, 2)).toBe(0);
    expect(getDisplayOptionIndex(shuffled, getOriginalOptionIndex(shuffled, 1))).toBe(1);
  });
});
