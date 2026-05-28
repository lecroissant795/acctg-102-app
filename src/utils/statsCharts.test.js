import { describe, expect, test } from "bun:test";
import {
  buildModeBreakdown,
  buildScoreTrend,
  buildTopicStats,
  buildWeeklyActivity,
  computeStudyStreak,
} from "./statsCharts.js";

describe("statsCharts", () => {
  const sessions = [
    {
      completedAt: new Date(2026, 4, 28, 10).toISOString(),
      modeLabel: "Mini Quiz (10)",
      scorePercent: 80,
      answers: [
        { topic: "Ch 1", correct: true, scoreAwarded: 1, maxScore: 1 },
        { topic: "Ch 1", correct: false, scoreAwarded: 0, maxScore: 1 },
      ],
    },
    {
      completedAt: new Date(2026, 4, 27, 12).toISOString(),
      modeLabel: "Full Exam",
      scorePercent: 60,
      answers: [{ topic: "Ch 2", correct: false, scoreAwarded: 0, maxScore: 1 }],
    },
    {
      completedAt: new Date(2026, 4, 26, 9).toISOString(),
      modeLabel: "Mini Quiz (10)",
      scorePercent: 90,
      answers: [{ topic: "Ch 1", correct: true, scoreAwarded: 1, maxScore: 1 }],
    },
  ];

  test("buildScoreTrend returns chronological points", () => {
    const trend = buildScoreTrend(sessions);
    expect(trend).toHaveLength(3);
    expect(trend[0].percent).toBe(90);
    expect(trend[2].percent).toBe(80);
  });

  test("buildTopicStats aggregates answer performance", () => {
    const topics = buildTopicStats(sessions);
    const ch1 = topics.find((entry) => entry.topic === "Ch 1");
    expect(ch1?.accuracy).toBe(67);
    expect(ch1?.incorrect).toBe(1);
  });

  test("buildModeBreakdown counts quiz modes", () => {
    const modes = buildModeBreakdown(sessions);
    expect(modes[0]).toEqual({ label: "Mini Quiz (10)", count: 2 });
  });

  test("buildWeeklyActivity buckets recent weeks", () => {
    const weeks = buildWeeklyActivity(sessions, 4, new Date(2026, 4, 28, 12));
    const activeWeek = weeks.find((week) => week.count > 0);
    expect(activeWeek?.count).toBeGreaterThan(0);
  });

  test("computeStudyStreak tracks consecutive days", () => {
    const streak = computeStudyStreak(sessions, new Date(2026, 4, 28, 12));
    expect(streak.current).toBe(3);
    expect(streak.longest).toBe(3);
    expect(streak.activeDays).toBe(3);
  });
});
