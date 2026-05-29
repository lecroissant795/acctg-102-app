import { describe, expect, test } from "bun:test";
import {
  getChapterPerformance,
  getTutorPerformanceContext,
  initStatsStore,
  mergeStores,
  normalizeStore,
  saveQuizSession,
  setStatsPersist,
} from "./stats.js";

describe("stats performance tracking", () => {
  test("normalizeStore includes chapters bucket", () => {
    expect(normalizeStore(null)).toEqual({ sessions: [], questions: {}, chapters: {} });
  });

  test("saveQuizSession tracks question accuracy and chapter aggregates", async () => {
    initStatsStore({ sessions: [], questions: {}, chapters: {} });
    setStatsPersist(async () => {});
    const session = await saveQuizSession({
      mode: "topic",
      modeLabel: "Chapter Quiz (2 Qs)",
      topic: "Ch 2: The Recording Process",
      questions: [
        { id: "q1", type: "mcq", topic: "Ch 2: The Recording Process", q: "Question 1", options: ["A", "B"], answer: 0 },
        { id: "q2", type: "mcq", topic: "Ch 2: The Recording Process", q: "Question 2", options: ["A", "B"], answer: 1 },
      ],
      answers: [
        {
          questionIndex: 0,
          questionId: "q1",
          questionType: "mcq",
          evaluation: { correct: true, scoreAwarded: 1, maxScore: 1 },
          response: { selectedIndex: 0 },
        },
        {
          questionIndex: 1,
          questionId: "q2",
          questionType: "mcq",
          evaluation: { correct: false, scoreAwarded: 0, maxScore: 1 },
          response: { selectedIndex: 0 },
        },
      ],
      score: 1,
      maxScore: 2,
      startedAt: Date.now() - 1000,
    });

    expect(session.scorePercent).toBe(50);

    const chapter = getChapterPerformance("Ch 2: The Recording Process");
    expect(chapter.totalQuizzes).toBe(1);
    expect(chapter.averageScore).toBe(50);
    expect(chapter.questionsAnswered).toBe(2);

    const context = getTutorPerformanceContext({
      id: "q2",
      topic: "Ch 2: The Recording Process",
      q: "Question 2",
      type: "mcq",
    });

    expect(context.question?.attempts).toBe(1);
    expect(context.question?.incorrect).toBe(1);
    expect(context.chapter?.averageScore).toBe(50);
  });

  test("mergeStores recomputes chapter stats from sessions", () => {
    const merged = mergeStores(
      {
        sessions: [
          {
            id: "a",
            completedAt: "2026-01-02T00:00:00.000Z",
            topic: "Ch 1: Introduction to Accounting",
            totalQuestions: 1,
            scorePercent: 100,
            answers: [
              {
                questionId: "ch1-q1",
                topic: "Ch 1: Introduction to Accounting",
                question: "Q1",
                correct: true,
                scoreAwarded: 1,
                maxScore: 1,
              },
            ],
          },
        ],
        questions: {},
        chapters: {},
      },
      { sessions: [], questions: {}, chapters: {} }
    );

    expect(merged.chapters["Ch 1: Introduction to Accounting"].totalQuizzes).toBe(1);
    expect(merged.chapters["Ch 1: Introduction to Accounting"].averageScore).toBe(100);
  });
});
