import { describe, expect, test } from "bun:test";
import {
  consumeTutorUse,
  createTutorUseState,
  formatTutorUsesRemaining,
  FULL_EXAM_TUTOR_USES,
  getTutorUseLimit,
} from "./tutorLimit.js";

describe("tutorLimit", () => {
  test("getTutorUseLimit scales with quiz size", () => {
    expect(getTutorUseLimit(5)).toBe(2);
    expect(getTutorUseLimit(10)).toBe(4);
    expect(getTutorUseLimit(15)).toBe(8);
    expect(getTutorUseLimit(25)).toBe(10);
    expect(getTutorUseLimit(119)).toBe(10);
    expect(getTutorUseLimit(500, { isFullExam: true })).toBe(FULL_EXAM_TUTOR_USES);
  });

  test("createTutorUseState respects custom max uses", () => {
    const state = createTutorUseState(8);
    expect(state.remaining).toBe(8);
    expect(state.max).toBe(8);
    expect(state.used).toBe(0);
  });

  test("consumes uses until depleted", () => {
    let state = createTutorUseState(4);

    for (let index = 0; index < 4; index++) {
      const result = consumeTutorUse(state);
      expect(result.consumed).toBe(true);
      state = result.state;
    }

    const exhausted = consumeTutorUse(state);
    expect(exhausted.consumed).toBe(false);
    expect(exhausted.state.remaining).toBe(0);
  });

  test("formats remaining uses", () => {
    expect(formatTutorUsesRemaining(createTutorUseState(10))).toBe("10 uses left");
    expect(formatTutorUsesRemaining({ remaining: 1, used: 4, max: 5 })).toBe("1 use left");
    expect(formatTutorUsesRemaining({ remaining: 0, used: 5, max: 5 })).toBe("No tutor uses left");
  });
});
