import { describe, expect, test } from "bun:test";
import {
  DEFAULT_CLICK_SOUND_SETTINGS,
  getClickSoundGain,
} from "./mobileClickSound.js";

describe("getClickSoundGain", () => {
  test("maps volume percentage to gain", () => {
    expect(getClickSoundGain(0)).toBe(0);
    expect(getClickSoundGain(100)).toBe(0.5);
    expect(getClickSoundGain(65)).toBeCloseTo(0.325);
  });

  test("clamps invalid volume values", () => {
    expect(getClickSoundGain(-10)).toBe(0);
    expect(getClickSoundGain(150)).toBe(0.5);
    expect(getClickSoundGain("abc")).toBe(
      getClickSoundGain(DEFAULT_CLICK_SOUND_SETTINGS.volume)
    );
  });
});
