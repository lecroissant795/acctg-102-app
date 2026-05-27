import { describe, expect, test } from "bun:test";
import {
  consumeTutorUse,
  createTutorUseState,
  formatTutorUsesRemaining,
  MAX_TUTOR_USES_PER_QUIZ,
} from "./tutorLimit.js";

describe("tutorLimit", () => {
  test("starts with 5 uses per quiz", () => {
    const state = createTutorUseState();
    expect(state.remaining).toBe(MAX_TUTOR_USES_PER_QUIZ);
    expect(state.used).toBe(0);
  });

  test("consumes uses until depleted", () => {
    let state = createTutorUseState();

    for (let index = 0; index < MAX_TUTOR_USES_PER_QUIZ; index++) {
      const result = consumeTutorUse(state);
      expect(result.consumed).toBe(true);
      state = result.state;
    }

    const exhausted = consumeTutorUse(state);
    expect(exhausted.consumed).toBe(false);
    expect(exhausted.state.remaining).toBe(0);
  });

  test("formats remaining uses", () => {
    expect(formatTutorUsesRemaining(createTutorUseState())).toBe("5 uses left");
    expect(formatTutorUsesRemaining({ remaining: 1, used: 4, max: 5 })).toBe("1 use left");
    expect(formatTutorUsesRemaining({ remaining: 0, used: 5, max: 5 })).toBe("No AI tutor uses left");
  });
});
