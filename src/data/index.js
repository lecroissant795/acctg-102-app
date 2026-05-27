import { normalizeQuestion, QUESTION_TYPES } from "./schema/questionTypes.js";
import * as ch01 from "./chapters/ch01-introduction.js";
import * as ch01Written from "./chapters/ch01-written.js";
import * as ch02 from "./chapters/ch02-recording-process.js";
import * as ch03 from "./chapters/ch03-accrual-accounting.js";
import * as ch04 from "./chapters/ch04-inventories.js";
import * as ch05 from "./chapters/ch05-reporting-inventory.js";
import * as ch07 from "./chapters/ch07-cash-receivables.js";
import * as ch08 from "./chapters/ch08-non-current-assets.js";
import * as ch09 from "./chapters/ch09-liabilities.js";
import * as ch10 from "./chapters/ch10-equity.js";

export const CHAPTERS = [ch01, ch02, ch03, ch04, ch05, ch07, ch08, ch09, ch10];
export const WRITTEN_CHAPTERS = [ch01Written];
export const ALL_CATEGORIES = [...CHAPTERS, ...WRITTEN_CHAPTERS];

export const QUESTION_BANK = Object.fromEntries(
  ALL_CATEGORIES.map((chapter) => [
    chapter.title,
    chapter.questions.map((question) =>
      normalizeQuestion(
        { ...question, topic: chapter.title, chapter: chapter.title },
        { topic: chapter.title, chapter: chapter.title }
      )
    ),
  ])
);

export const QUESTIONS = Object.fromEntries(
  CHAPTERS.map((chapter) => [
    chapter.title,
    QUESTION_BANK[chapter.title].filter((question) => question.type === QUESTION_TYPES.MCQ),
  ])
);

export const topics = CHAPTERS
  .filter((chapter) =>
    QUESTION_BANK[chapter.title].some((question) => question.type === QUESTION_TYPES.MCQ)
  )
  .map((chapter) => chapter.title);

export const PRACTICE_GROUPS = [
  {
    type: QUESTION_TYPES.WRITTEN,
    label: "Written Practice",
    accent: "rgba(144, 101, 176, 0.08)",
    border: "rgba(144, 101, 176, 0.2)",
    textColor: "#9065b0",
  },
  {
    type: QUESTION_TYPES.SELECT_MULTIPLE,
    label: "Select Multiple",
    accent: "rgba(15, 123, 108, 0.08)",
    border: "rgba(15, 123, 108, 0.2)",
    textColor: "#0f7b6c",
  },
  {
    type: QUESTION_TYPES.NUMERIC_INPUT,
    label: "Numeric Input",
    accent: "rgba(35, 131, 226, 0.08)",
    border: "rgba(35, 131, 226, 0.2)",
    textColor: "#2383e2",
  },
  {
    type: QUESTION_TYPES.MATCHING,
    label: "Matching",
    accent: "rgba(217, 115, 13, 0.08)",
    border: "rgba(217, 115, 13, 0.2)",
    textColor: "#d9730d",
  },
  {
    type: QUESTION_TYPES.ORDERING,
    label: "Ordering",
    accent: "rgba(212, 76, 71, 0.08)",
    border: "rgba(212, 76, 71, 0.2)",
    textColor: "#d44c47",
  },
  {
    type: QUESTION_TYPES.JOURNAL_ENTRY,
    label: "Journal Entries",
    accent: "rgba(196, 145, 59, 0.08)",
    border: "rgba(196, 145, 59, 0.2)",
    textColor: "#c4913b",
  },
  {
    type: QUESTION_TYPES.TABLE_CLASSIFICATION,
    label: "Table Classification",
    accent: "rgba(68, 131, 97, 0.08)",
    border: "rgba(68, 131, 97, 0.2)",
    textColor: "#448361",
  },
  {
    type: QUESTION_TYPES.CASE_SET,
    label: "Case Sets",
    accent: "rgba(51, 126, 169, 0.08)",
    border: "rgba(51, 126, 169, 0.2)",
    textColor: "#337ea9",
  },
];

export const PRACTICE_QUESTIONS = Object.fromEntries(
  PRACTICE_GROUPS.map((group) => [
    group.label,
    Object.values(QUESTION_BANK)
      .flat()
      .filter((question) => question.type === group.type),
  ])
);

export const practiceGroups = PRACTICE_GROUPS.filter(
  (group) => PRACTICE_QUESTIONS[group.label].length > 0
);

export const allTopics = ALL_CATEGORIES.map((chapter) => chapter.title);

export const totalQuestionCount = topics.reduce(
  (sum, topic) => sum + QUESTIONS[topic].length,
  0
);

export const totalWrittenQuestionCount = PRACTICE_QUESTIONS["Written Practice"]?.length ?? 0;

export const totalPracticeQuestionCount = practiceGroups.reduce(
  (sum, group) => sum + PRACTICE_QUESTIONS[group.label].length,
  0
);

export function getQuestionById(id) {
  for (const chapterTitle of Object.keys(QUESTION_BANK)) {
    for (const question of QUESTION_BANK[chapterTitle]) {
      if (`${chapterTitle}::${question.q ?? question.prompt}` === id || question.id === id) {
        return { ...question, topic: chapterTitle };
      }
    }
  }
  return null;
}
