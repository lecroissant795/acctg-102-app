import { normalizeStore } from "./stats.js";

export async function fetchRemoteStore(supabase, userId) {
  const { data, error } = await supabase
    .from("quiz_stats")
    .select("data")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return normalizeStore(data?.data);
}

export async function saveRemoteStore(supabase, userId, store) {
  const { error } = await supabase.from("quiz_stats").upsert({
    user_id: userId,
    data: store,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
}
