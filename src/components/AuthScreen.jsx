import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { Page } from "./Page.jsx";
import { theme, inputStyle, backButtonStyle, pageTitleStyle } from "../styles/theme.js";

export function AuthScreen({ onBack, onAuthenticated }) {
  const { signIn, signUp, available, error: authError } = useAuth();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === "signin") {
        await signIn(email, password);
        onAuthenticated?.();
        return;
      }

      const result = await signUp(email, password);
      if (result.session) {
        onAuthenticated?.();
        return;
      }

      setMessage("Check your email to confirm your account, then sign in.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Page padding="48px 24px 80px" centered>
      <div style={{ marginBottom: 24 }}>
        <button type="button" onClick={onBack} style={backButtonStyle}>
          ← Back
        </button>
      </div>

      <header style={{ marginBottom: 28 }}>
        <h1 className="page-title" style={{ ...pageTitleStyle, fontSize: 32 }}>
          {mode === "signin" ? "Sign In" : "Create Account"}
        </h1>
        <p style={{ color: theme.colors.textSecondary, marginTop: 8, fontSize: 14, lineHeight: 1.5 }}>
          Save your quiz history and progress across devices.
        </p>
        {!available && authError && (
          <p style={{ color: theme.colors.error, marginTop: 8, fontSize: 13 }}>
            {authError}
          </p>
        )}
      </header>

      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 24,
          padding: 3,
          background: theme.colors.bgTertiary,
          borderRadius: theme.radius.lg,
          border: `1px solid ${theme.colors.border}`,
        }}
      >
        {["signin", "signup"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setMode(tab);
              setError(null);
              setMessage(null);
            }}
            style={{
              flex: 1,
              padding: "8px 12px",
              border: "none",
              borderRadius: theme.radius.md,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
              background: mode === tab ? theme.colors.bg : "transparent",
              color: mode === tab ? theme.colors.text : theme.colors.textSecondary,
              boxShadow: mode === tab ? `0 0 0 1px ${theme.colors.border}` : "none",
            }}
          >
            {tab === "signin" ? "Sign In" : "Sign Up"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 12, color: theme.colors.textSecondary, fontWeight: 500 }}>
            Email
          </span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={inputStyle}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 12, color: theme.colors.textSecondary, fontWeight: 500 }}>
            Password
          </span>
          <input
            type="password"
            required
            minLength={6}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            style={inputStyle}
          />
        </label>

        {error && (
          <div
            style={{
              padding: "12px 14px",
              borderRadius: theme.radius.lg,
              background: theme.colors.errorBg,
              border: `1px solid ${theme.colors.errorBorder}`,
              color: theme.colors.error,
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {message && (
          <div
            style={{
              padding: "12px 14px",
              borderRadius: theme.radius.lg,
              background: theme.colors.successBg,
              border: `1px solid ${theme.colors.successBorder}`,
              color: theme.colors.success,
              fontSize: 13,
            }}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !available}
          style={{
            marginTop: 8,
            padding: "10px 16px",
            background: theme.colors.buttonPrimaryBg,
            color: theme.colors.buttonPrimaryText,
            border: "none",
            borderRadius: theme.radius.md,
            fontSize: 14,
            fontWeight: 500,
            cursor: submitting ? "not-allowed" : "pointer",
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
        </button>
      </form>
    </Page>
  );
}
