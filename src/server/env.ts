export type AiEnvStatus = {
  configured: boolean;
  model: string;
  baseUrl: string;
};

export type ServerEnvStatus = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  ai: AiEnvStatus;
};

export function getOpenAiEnv(): AiEnvStatus {
  const apiKey = process.env.OPENAI_API_KEY?.trim() ?? "";
  return {
    configured: apiKey.length > 0,
    model: process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini",
    baseUrl: (process.env.OPENAI_BASE_URL?.trim() || "https://api.shopaikey.com/v1").replace(/\/$/, ""),
  };
}

export function getServerEnvStatus(): ServerEnvStatus {
  return {
    supabaseUrl: process.env.SUPABASE_URL?.trim() ?? "",
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY?.trim() ?? "",
    ai: getOpenAiEnv(),
  };
}

export function logServerEnvWarnings(): void {
  const env = getServerEnvStatus();

  if (!env.ai.configured) {
    console.warn(
      "[env] OPENAI_API_KEY is missing — AI quiz planning, practice quizzes, and the tutor will use offline fallbacks."
    );
  }

  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    console.warn("[env] SUPABASE_URL or SUPABASE_ANON_KEY is missing — auth and cloud stats are disabled.");
  }
}
