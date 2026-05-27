import { describe, expect, test } from "bun:test";
import {
  buildContributionGrid,
  getContributionLevel,
  toLocalDateKey,
} from "./contributions.js";

describe("contributions", () => {
  test("toLocalDateKey uses local calendar date", () => {
    const date = new Date(2026, 4, 28, 23, 30);
    expect(toLocalDateKey(date)).toBe("2026-05-28");
  });

  test("getContributionLevel maps counts to levels", () => {
    expect(getContributionLevel(0)).toBe(0);
    expect(getContributionLevel(1)).toBe(1);
    expect(getContributionLevel(3)).toBe(3);
    expect(getContributionLevel(10)).toBe(4);
  });

  test("buildContributionGrid aggregates sessions by day", () => {
    const sessions = [
      { completedAt: new Date(2026, 4, 28, 10).toISOString() },
      { completedAt: new Date(2026, 4, 28, 18).toISOString() },
      { completedAt: new Date(2026, 4, 27, 12).toISOString() },
    ];

    const grid = buildContributionGrid(sessions, new Date(2026, 4, 28, 12));
    const allDays = grid.weeks.flatMap((week) => week.days);
    const may28 = allDays.find((day) => day.dateKey === "2026-05-28");
    const may27 = allDays.find((day) => day.dateKey === "2026-05-27");

    expect(may28?.count).toBe(2);
    expect(may28?.level).toBe(2);
    expect(may27?.count).toBe(1);
    expect(grid.totalInRange).toBe(3);
    expect(grid.weeks).toHaveLength(53);
  });
});
