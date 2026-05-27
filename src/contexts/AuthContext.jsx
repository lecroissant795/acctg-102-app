import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSupabase } from "../lib/supabase.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let active = true;
    let unsubscribe = null;

    async function initAuth() {
      try {
        const supabase = await getSupabase();
        if (!active) return;

        setAvailable(true);
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        setUser(data.session?.user ?? null);

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
          if (active) setUser(session?.user ?? null);
        });
        unsubscribe = () => listener.subscription.unsubscribe();
      } catch (initError) {
        if (active) {
          setAvailable(false);
          setError(initError instanceof Error ? initError.message : "Auth unavailable");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    initAuth();

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      available,
      async signUp(email, password) {
        if (!available) throw new Error("Sign in is unavailable. Add Supabase env vars first.");
        setError(null);
        const supabase = await getSupabase();
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        return data;
      },
      async signIn(email, password) {
        if (!available) throw new Error("Sign in is unavailable. Add Supabase env vars first.");
        setError(null);
        const supabase = await getSupabase();
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        return data;
      },
      async signOut() {
        if (!available) return;
        setError(null);
        const supabase = await getSupabase();
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) throw signOutError;
      },
    }),
    [user, loading, error, available]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
