import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { getSupabase } from "../lib/supabase.js";
import {
  clearQuizStats,
  getStatsSummary,
  initStatsStore,
  mergeStores,
  normalizeStore,
  resetStatsStore,
  saveQuizSession,
  setStatsPersist,
} from "../utils/stats.js";
import { fetchRemoteStore, saveRemoteStore } from "../utils/statsSync.js";

const StatsContext = createContext(null);

function readLocalStoreForMerge() {
  try {
    const raw = localStorage.getItem("acctg102-quiz-stats");
    if (!raw) return { sessions: [], questions: {} };
    return normalizeStore(JSON.parse(raw));
  } catch {
    return { sessions: [], questions: {} };
  }
}

export function StatsProvider({ children }) {
  const { user } = useAuth();
  const [version, setVersion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState(null);

  const refresh = useCallback(() => {
    setVersion((current) => current + 1);
  }, []);

  useEffect(() => {
    let active = true;

    async function syncStats() {
      setLoading(true);
      setSyncError(null);

      try {
        if (!user) {
          resetStatsStore();
          refresh();
          return;
        }

        const supabase = await getSupabase();
        const localStore = readLocalStoreForMerge();
        const remoteStore = await fetchRemoteStore(supabase, user.id);
        const mergedStore = mergeStores(localStore, remoteStore);

        initStatsStore(mergedStore);
        setStatsPersist(async (store) => {
          await saveRemoteStore(supabase, user.id, store);
        });

        await saveRemoteStore(supabase, user.id, mergedStore);
        refresh();
      } catch (error) {
        if (active) {
          setSyncError(error instanceof Error ? error.message : "Failed to sync stats");
          resetStatsStore();
          refresh();
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    syncStats();

    return () => {
      active = false;
    };
  }, [user, refresh]);

  const value = useMemo(() => {
    const summary = getStatsSummary();

    return {
      summary,
      loading,
      syncError,
      isCloudSynced: Boolean(user),
      refresh,
      async saveSession(payload) {
        const session = await saveQuizSession(payload);
        refresh();
        return session;
      },
      async clearStats() {
        await clearQuizStats();
        refresh();
      },
    };
  }, [user, loading, syncError, version, refresh]);

  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>;
}

export function useStats() {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error("useStats must be used within StatsProvider");
  }
  return context;
}
