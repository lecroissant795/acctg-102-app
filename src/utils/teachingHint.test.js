import { describe, expect, test } from "bun:test";
import { buildTeachingHint } from "./teachingHint.js";

describe("teachingHint", () => {
  test("gives a timing hint for accrual vs cash recognition questions", () => {
    const hint = buildTeachingHint({
      q: "On 28 June, Apex Ltd delivers goods on credit. Payment is expected in August. When should revenue be recognised under accrual accounting?",
      tags: ["adjusting_entries"],
      options: ["A", "B", "C", "D"],
    });

    expect(hint.toLowerCase()).toContain("date");
    expect(hint.toLowerCase()).not.toContain("notion");
    expect(hint.toLowerCase()).not.toContain("review the");
    expect(hint.toLowerCase()).not.toContain("chapter notes");
  });

  test("gives journal-entry guidance without account names", () => {
    const hint = buildTeachingHint({
      type: "journal_entry",
      q: "Record a credit sale of $4,400 including GST.",
      tags: ["gst", "debit_credit"],
    });

    expect(hint.toLowerCase()).toMatch(/tax|gst|revenue/);
    expect(hint.toLowerCase()).not.toContain("accounts receivable");
  });

  test("gives scenario-specific journal hints for adjusting entries", () => {
    const hint = buildTeachingHint({
      type: "journal_entry",
      q: "A 12-month rent prepayment of $4,800 was made on 1 October. At 31 December, record the adjusting entry.",
      tags: ["adjusting_entries"],
    });

    expect(hint.toLowerCase()).toMatch(/expired|period|months|benefit/);
    expect(hint.toLowerCase()).not.toContain("review the");
  });

  test("does not tell the student to review external materials", () => {
    const hint = buildTeachingHint({
      q: "Which statement best describes depreciation?",
      topic: "Ch 8: PPE",
      options: ["A", "B", "C", "D"],
    });

    expect(hint.toLowerCase()).not.toContain("notion");
    expect(hint.toLowerCase()).not.toContain("textbook");
    expect(hint.length).toBeGreaterThan(40);
  });
});
