import { describe, expect, test } from "bun:test";
import { PRACTICE_QUESTIONS } from "../data/index.js";
import { buildPracticeQuestionPool } from "./quizPlan.js";
import {
  filterJournalEntryQuestions,
  getJournalEntryChapterOptions,
  inferJournalEntrySourceChapter,
  JOURNAL_ENTRIES_LABEL,
  JOURNAL_ENTRY_ALL_CHAPTERS,
} from "./journalEntryChapters.js";

describe("journalEntryChapters", () => {
  test("maps journal entry questions to course chapters", () => {
    const options = getJournalEntryChapterOptions();

    expect(options.length).toBeGreaterThan(0);
    expect(options.every((option) => option.count > 0)).toBe(true);
    expect(options.reduce((sum, option) => sum + option.count, 0)).toBe(
      PRACTICE_QUESTIONS[JOURNAL_ENTRIES_LABEL].length
    );
  });

  test("infers chapter from embedded chapter questions and practice pack ids", () => {
    const embedded = PRACTICE_QUESTIONS[JOURNAL_ENTRIES_LABEL].find(
      (question) => question.id === "ch04-journal-entry-purchase-return"
    );
    const pack = PRACTICE_QUESTIONS[JOURNAL_ENTRIES_LABEL].find(
      (question) => question.id === "je-pack-25"
    );

    expect(inferJournalEntrySourceChapter(embedded)).toBe("Ch 4: Inventories (Perpetual System)");
    expect(inferJournalEntrySourceChapter(pack)).toBe("Ch 4: Inventories (Perpetual System)");
  });

  test("filters journal entry questions by selected chapter", () => {
    const chapter = "Ch 7: Cash & Receivables";
    const filtered = filterJournalEntryQuestions(
      PRACTICE_QUESTIONS[JOURNAL_ENTRIES_LABEL],
      chapter
    );

    expect(filtered.length).toBeGreaterThan(0);
    expect(
      filtered.every((question) => inferJournalEntrySourceChapter(question) === chapter)
    ).toBe(true);
    expect(filterJournalEntryQuestions(filtered, JOURNAL_ENTRY_ALL_CHAPTERS)).toEqual(filtered);
  });
});

describe("buildPracticeQuestionPool journal chapter filter", () => {
  test("limits journal entry pool to the selected chapter", () => {
    const chapter = "Ch 2: The Recording Process";
    const { pool, payload } = buildPracticeQuestionPool(JOURNAL_ENTRIES_LABEL, { chapter });

    expect(pool.length).toBeGreaterThan(0);
    expect(payload.chapter).toBe(chapter);
    expect(
      pool.every((entry) => inferJournalEntrySourceChapter(entry.question) === chapter)
    ).toBe(true);
  });
});
