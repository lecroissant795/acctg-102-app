import { CHAPTERS, PRACTICE_QUESTIONS } from "../data/index.js";

export const JOURNAL_ENTRIES_LABEL = "Journal Entries";
export const JOURNAL_ENTRY_ALL_CHAPTERS = "__all__";

const PRACTICE_PACK_TITLE = "Practice: Journal Entry Drills";

const chapterTitleByNumber = Object.fromEntries(
  CHAPTERS.flatMap((chapter) => {
    const match = chapter.title.match(/^Ch (\d+)/);
    return match ? [[match[1].padStart(2, "0"), chapter.title]] : [];
  })
);

function inferFromJePackNumber(packNumber) {
  if (packNumber <= 12) return chapterTitleByNumber["02"];
  if (packNumber <= 24) return chapterTitleByNumber["03"];
  if (packNumber <= 36) return chapterTitleByNumber["04"];
  if (packNumber <= 48) return chapterTitleByNumber["07"];
  if (packNumber <= 51) return chapterTitleByNumber["08"];
  if (packNumber <= 55) return chapterTitleByNumber["09"];
  return chapterTitleByNumber["10"];
}

export function inferJournalEntrySourceChapter(question) {
  if (question.chapter && question.chapter !== PRACTICE_PACK_TITLE) {
    return question.chapter;
  }

  const chapterIdMatch = question.id?.match(/^ch(\d{2})-/);
  if (chapterIdMatch) {
    return chapterTitleByNumber[chapterIdMatch[1]] ?? null;
  }

  const packMatch = question.id?.match(/^je-pack-(\d+)/);
  if (packMatch) {
    return inferFromJePackNumber(Number(packMatch[1]));
  }

  return null;
}

export function getJournalEntryChapterOptions() {
  const questions = PRACTICE_QUESTIONS[JOURNAL_ENTRIES_LABEL] ?? [];
  const counts = new Map();

  for (const question of questions) {
    const chapter = inferJournalEntrySourceChapter(question);
    if (!chapter) continue;
    counts.set(chapter, (counts.get(chapter) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort(([titleA], [titleB]) => {
      const numA = Number(titleA.match(/^Ch (\d+)/)?.[1] ?? 99);
      const numB = Number(titleB.match(/^Ch (\d+)/)?.[1] ?? 99);
      return numA - numB;
    })
    .map(([title, count]) => ({ title, count }));
}

export function filterJournalEntryQuestions(questions, chapter) {
  if (!chapter || chapter === JOURNAL_ENTRY_ALL_CHAPTERS) {
    return questions;
  }

  return questions.filter(
    (question) => inferJournalEntrySourceChapter(question) === chapter
  );
}
