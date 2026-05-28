import { afterEach, describe, expect, test } from "bun:test";
import { getOpenAiEnv, getServerEnvStatus } from "./env.ts";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("getOpenAiEnv", () => {
  test("reports configured when OPENAI_API_KEY is set", () => {
    process.env.OPENAI_API_KEY = "test-key";
    process.env.OPENAI_MODEL = "gpt-4o-mini";
    process.env.OPENAI_BASE_URL = "https://api.example.com/v1/";

    expect(getOpenAiEnv()).toEqual({
      configured: true,
      model: "gpt-4o-mini",
      baseUrl: "https://api.example.com/v1",
    });
  });

  test("reports not configured for blank key", () => {
    process.env.OPENAI_API_KEY = "   ";

    expect(getOpenAiEnv().configured).toBe(false);
  });
});

describe("getServerEnvStatus", () => {
  test("includes supabase and ai status", () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_ANON_KEY = "anon";
    process.env.OPENAI_API_KEY = "key";

    expect(getServerEnvStatus()).toMatchObject({
      supabaseUrl: "https://example.supabase.co",
      supabaseAnonKey: "anon",
      ai: { configured: true },
    });
  });
});
