import { createClient } from "@supabase/supabase-js";

let client = null;
let configPromise = null;

async function loadConfig() {
  const response = await fetch("/api/config");
  if (!response.ok) {
    throw new Error("Failed to load Supabase config");
  }

  const config = await response.json();
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    throw new Error("Supabase is not configured");
  }

  return config;
}

export function isSupabaseConfigured() {
  return configPromise != null || client != null;
}

export async function getSupabase() {
  if (client) return client;

  if (!configPromise) {
    configPromise = loadConfig();
  }

  const { supabaseUrl, supabaseAnonKey } = await configPromise;
  client = createClient(supabaseUrl, supabaseAnonKey);
  return client;
}

export function resetSupabaseClient() {
  client = null;
  configPromise = null;
}
