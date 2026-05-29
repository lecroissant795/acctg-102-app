import { useState } from "react";
import { ContributionGraph } from "./ContributionGraph.jsx";
import { StatsCharts } from "./StatsCharts.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useStats } from "../contexts/StatsContext.jsx";
import { formatDateTime, formatDuration } from "../utils/stats.js";
import {
  AppShell,
  SidebarCollapseButton,
  SidebarDivider,
  SidebarItem,
  SidebarSection,
} from "./AppShell.jsx";
import { theme, backButtonStyle, pageTitleStyle, sectionLabelStyle } from "../styles/theme.js";
import { NAV_CLICK_SOUND_PROPS } from "../constants/clickSound.js";

function formatScore(value) {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return "0";
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

function SummaryCard({ label, value, color = theme.colors.text }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 100,
        padding: "14px 12px",
        background: theme.colors.bg,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.lg,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 700, color }}>{value}</div>
      <div
        style={{
          fontSize: 11,
          color: theme.colors.textSecondary,
          marginTop: 4,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function SessionCard({ session }) {
  const [expanded, setExpanded] = useState(false);
  const wrongAnswers = session.answers.filter((answer) => !answer.correct);

  const scoreColor =
    session.scorePercent >= 75
      ? theme.colors.success
      : session.scorePercent >= 50
        ? theme.colors.warning
        : theme.colors.error;

  return (
    <div
      style={{
        background: theme.colors.bg,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.lg,
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "14px 16px",
          background: "transparent",
          border: "none",
          color: theme.colors.text,
          cursor: "pointer",
          textAlign: "left",
        }}
        className="session-card-header"
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{session.modeLabel}</div>
          <div style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 4 }}>
            {formatDateTime(session.completedAt)}
            {session.durationMs != null && ` · ${formatDuration(session.durationMs)}`}
          </div>
        </div>
        <div className="session-card-score" style={{ textAlign: "right" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: scoreColor }}>
            {formatScore(session.scorePoints ?? session.correct)}/{formatScore(session.maxScore ?? session.totalQuestions)} ({session.scorePercent}%)
          </div>
          <div style={{ fontSize: 11, color: theme.colors.textTertiary, marginTop: 2 }}>
            {expanded ? "Hide details" : "Show details"}
          </div>
        </div>
      </button>

      {expanded && (
        <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${theme.colors.border}` }}>
          <div style={{ display: "flex", gap: 16, margin: "12px 0", fontSize: 12 }}>
            <span style={{ color: theme.colors.success }}>{formatScore(session.scorePoints ?? session.correct)} points</span>
            <span style={{ color: theme.colors.error }}>{formatScore((session.maxScore ?? session.totalQuestions) - (session.scorePoints ?? session.correct))} remaining</span>
          </div>

          {wrongAnswers.length === 0 ? (
            <p style={{ margin: 0, fontSize: 13, color: theme.colors.textSecondary }}>Perfect score — no mistakes.</p>
          ) : (
            wrongAnswers.map((answer) => (
              <div
                key={`${session.id}-${answer.questionId}`}
                style={{
                  background: theme.colors.errorBg,
                  border: `1px solid ${theme.colors.errorBorder}`,
                  borderRadius: theme.radius.lg,
                  padding: "12px 14px",
                  marginBottom: 8,
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                <div style={{ fontSize: 11, color: theme.colors.textSecondary, marginBottom: 4 }}>
                  {answer.topic}
                </div>
                <p style={{ margin: 0, fontWeight: 500, color: theme.colors.text }}>{answer.question}</p>
                {answer.responseText && (
                  <p style={{ margin: "6px 0 0", color: theme.colors.error }}>You picked: {answer.responseText}</p>
                )}
                {answer.correctText && (
                  <p style={{ margin: "4px 0 0", color: theme.colors.success }}>Correct: {answer.correctText}</p>
                )}
                <p style={{ margin: "4px 0 0", color: theme.colors.textSecondary }}>
                  Score: {formatScore(answer.scoreAwarded ?? 0)}/{formatScore(answer.maxScore ?? 0)}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function StatsSidebar({ summary, onBack }) {
  return (
    <>
      <div style={{ padding: "12px 14px 8px" }}>
        <button type="button" onClick={onBack} style={{ ...backButtonStyle, marginBottom: 8 }} {...NAV_CLICK_SOUND_PROPS}>
          ← Back
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            padding: "4px 6px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <span style={{ fontSize: 20 }}>📊</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Quiz Stats</span>
          </div>
          <SidebarCollapseButton />
        </div>
      </div>
      <SidebarDivider />
      <SidebarSection label="Summary">
        <SidebarItem label="Quizzes" badge={summary.totalQuizzes} />
        <SidebarItem label="Accuracy" badge={`${summary.accuracy}%`} />
      </SidebarSection>
      <SidebarDivider />
    </>
  );
}

export function StatsScreen({ onBack }) {
  const { user } = useAuth();
  const { summary, loading, syncError, isCloudSynced, clearStats } = useStats();

  const handleClear = async () => {
    if (!window.confirm("Clear all saved quiz stats? This cannot be undone.")) return;
    await clearStats();
    onBack();
  };

  const sidebar = (
    <StatsSidebar summary={summary} onBack={onBack} />
  );

  if (loading) {
    return (
      <AppShell sidebar={sidebar}>
        <div style={{ color: theme.colors.textSecondary }}>Loading stats...</div>
      </AppShell>
    );
  }

  return (
    <AppShell sidebar={sidebar}>
      <header className="screen-header" style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
        <div>
          <button type="button" onClick={onBack} className="mobile-only" style={{ ...backButtonStyle, marginBottom: 12 }} {...NAV_CLICK_SOUND_PROPS}>
            ← Back
          </button>
          <h1 className="page-title" style={pageTitleStyle}>Quiz Stats</h1>
          <p className="page-subtitle" style={{ color: theme.colors.textSecondary, marginTop: 8, fontSize: 14, lineHeight: 1.5 }}>
            {isCloudSynced
              ? `Synced to your account (${user?.email}).`
              : "Saved locally in your browser. Sign in to sync across devices."}
          </p>
          {syncError && (
            <p style={{ color: theme.colors.error, marginTop: 8, fontSize: 13 }}>
              Cloud sync unavailable: {syncError}
            </p>
          )}
        </div>
      </header>

      {summary.totalQuizzes === 0 ? (
        <div
          style={{
            padding: "28px 20px",
            textAlign: "center",
            background: theme.colors.bgTertiary,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.lg,
            color: theme.colors.textSecondary,
          }}
        >
          No quiz history yet. Complete a quiz and your results will show up here.
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
            <SummaryCard label="Quizzes" value={summary.totalQuizzes} color={theme.colors.accent} />
            <SummaryCard label="Points" value={formatScore(summary.totalCorrect)} color={theme.colors.success} />
            <SummaryCard label="Remaining" value={formatScore(summary.totalIncorrect)} color={theme.colors.error} />
            <SummaryCard label="Accuracy" value={`${summary.accuracy}%`} />
          </div>

          <StatsCharts summary={summary} />

          <ContributionGraph sessions={summary.sessions} />

          {summary.weakQuestions.length > 0 && (
            <section style={{ marginBottom: 28 }}>
              <div style={sectionLabelStyle}>Most Missed Questions</div>
              {summary.weakQuestions.slice(0, 8).map((entry) => (
                <div
                  key={entry.question}
                  className="weak-question-row"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "flex-start",
                    padding: "12px 14px",
                    marginBottom: 6,
                    background: theme.colors.bg,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.radius.lg,
                    fontSize: 13,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 11, color: theme.colors.textSecondary, marginBottom: 4 }}>{entry.topic}</div>
                    <div style={{ color: theme.colors.text, lineHeight: 1.4 }}>{entry.question}</div>
                    {entry.lastResponseText && (
                      <div style={{ fontSize: 12, color: theme.colors.textTertiary, marginTop: 6 }}>
                        Last wrong answer: {entry.lastResponseText}
                      </div>
                    )}
                  </div>
                  <div className="weak-question-stats" style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <div style={{ color: theme.colors.error, fontWeight: 600 }}>
                      {entry.incorrect} wrong
                    </div>
                    <div style={{ color: theme.colors.textSecondary, fontSize: 11, marginTop: 2 }}>
                      {formatScore(entry.scoreAwarded ?? 0)}/{formatScore(entry.maxScoreAwarded ?? 0)} points
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}

          <section>
            <div style={sectionLabelStyle}>Quiz History</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {summary.sessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          </section>

          <button
            type="button"
            onClick={handleClear}
            style={{
              marginTop: 28,
              width: "100%",
              padding: "10px 16px",
              background: theme.colors.errorBg,
              color: theme.colors.error,
              border: `1px solid ${theme.colors.errorBorder}`,
              borderRadius: theme.radius.md,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Clear All Stats
          </button>
        </>
      )}
    </AppShell>
  );
}
