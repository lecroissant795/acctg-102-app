import { describe, expect, test } from "bun:test";
import { buildHintPayload, requestTutorResponse } from "./quizTutor.js";

describe("quizTutor client", () => {
  test("requestTutorResponse falls back when API fails", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ error: "Unavailable" }), { status: 503 });

    try {
      const result = await requestTutorResponse(
        buildHintPayload({
          topic: "Ch 1: Introduction to Accounting",
          prompt: "What is accounting?",
        }),
        (payload) => ({
          message: `Fallback for ${payload.question.topic}`,
        })
      );

      expect(result.usedFallback).toBe(true);
      expect(result.message).toContain("Ch 1");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
