import { Page } from "./Page.jsx";
import { AiTutorPanel } from "./AiTutorPanel.jsx";
import { theme, sectionLabelStyle } from "../styles/theme.js";

function getGrade(scorePercent) {
  if (scorePercent >= 85) return { label: "A+", emoji: "🏆" };
  if (scorePercent >= 75) return { label: "A", emoji: "🌟" };
  if (scorePercent >= 65) return { label: "B", emoji: "👍" };
  if (scorePercent >= 50) return { label: "C", emoji: "📚" };
  return { label: "Needs Work", emoji: "💪" };
}

function formatScore(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function getAnswerLines(entry, question) {
  const responseSummary = entry.evaluation?.responseSummary ?? entry.responseSummary ?? entry.response ?? {};
  const evaluation = entry.evaluation ?? {};
  const type = entry.questionType ?? question.type;

  switch (type) {
    case "select_multiple":
      return {
        yourAnswer: (responseSummary.selectedIndices ?? [])
          .map((index) => question.options?.[index])
          .filter(Boolean)
          .join(", "),
        correctAnswer: (question.answer?.correctIndices ?? [])
          .map((index) => question.options?.[index])
          .filter(Boolean)
          .join(", "),
      };
    case "numeric_input":
      return {
        yourAnswer: responseSummary.value ?? "No answer",
        correctAnswer: question.answer?.value ?? "N/A",
      };
    case "journal_entry":
      return {
        yourAnswer: (responseSummary.lines ?? [])
          .map((line) => `${line.account} ${line.debit != null ? `Dr ${line.debit}` : `Cr ${line.credit}`}`)
          .join(" · "),
        correctAnswer: (question.answer?.lines ?? [])
          .map((line) => `${line.account} ${line.side === "debit" ? `Dr ${line.amount}` : `Cr ${line.amount}`}`)
          .join(" · "),
      };
    default:
      return {
        yourAnswer: question.options?.[responseSummary.selectedIndex] ?? entry.selectedText ?? "No answer",
        correctAnswer:
          question.options?.[question.answer?.correctIndex ?? question.answer] ??
          entry.correctText ??
          "N/A",
      };
  }
}

function IncorrectReview({ answers, questions, tutorUses, onConsumeTutorUse }) {
  const incorrect = answers.filter((entry) => entry.evaluation && !entry.evaluation.correct);
  if (incorrect.length === 0) return null;

  return (
    <section style={{ textAlign: "left", marginBottom: 24 }}>
      <div style={sectionLabelStyle}>Review Incorrect</div>
      {incorrect.map((entry, index) => {
        const question = questions[entry.questionIndex];
        const { yourAnswer, correctAnswer } = getAnswerLines(entry, question);

        return (
          <div
            key={index}
            style={{
              background: theme.colors.errorBg,
              border: `1px solid ${theme.colors.errorBorder}`,
              borderRadius: theme.radius.lg,
              padding: "14px 16px",
              marginBottom: 8,
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            {question.topic && (
              <div style={{ fontSize: 11, color: theme.colors.textSecondary, marginBottom: 4 }}>
                {question.topic}
              </div>
            )}
            <p style={{ margin: 0, fontWeight: 500, color: theme.colors.text }}>{question.q ?? question.prompt}</p>
            <p style={{ margin: "6px 0 0", color: theme.colors.error }}>
              Your answer: {yourAnswer}
            </p>
            <p style={{ margin: "4px 0 0", color: theme.colors.success }}>
              Correct: {correctAnswer}
            </p>
            {entry.evaluation?.maxScore > 0 && (
              <p style={{ margin: "4px 0 0", color: theme.colors.textSecondary, fontSize: 12 }}>
                Score: {formatScore(entry.evaluation.scoreAwarded)}/{formatScore(entry.evaluation.maxScore)}
              </p>
            )}
            <p style={{ margin: "6px 0 0", color: theme.colors.textSecondary, fontSize: 12 }}>
              {question.explanation}
            </p>
            <AiTutorPanel
              question={question}
              currentAnswer={entry}
              compact
              tutorUses={tutorUses}
              onConsumeTutorUse={onConsumeTutorUse}
            />
          </div>
        );
      })}
    </section>
  );
}

function ChapterBreakdown({ mode, topics, answers, questions }) {
  if (mode !== "mini" && mode !== "all") return null;

  return (
    <section style={{ textAlign: "left", marginBottom: 20 }}>
      <div style={sectionLabelStyle}>By Chapter</div>
      {topics.map((topic) => {
        const chapterAnswers = answers.filter(
          (entry) => questions[entry.questionIndex]?.topic === topic
        );
        if (chapterAnswers.length === 0) return null;

        const chapterScore = chapterAnswers.reduce(
          (sum, entry) => sum + (entry.evaluation?.scoreAwarded ?? 0),
          0
        );
        const chapterMax = chapterAnswers.reduce(
          (sum, entry) => sum + (entry.evaluation?.maxScore ?? 0),
          0
        );
        const chapterPercent = chapterMax > 0 ? Math.round((chapterScore / chapterMax) * 100) : 100;
        const color =
          chapterPercent >= 75
            ? theme.colors.success
            : chapterPercent >= 50
              ? theme.colors.warning
              : theme.colors.error;

        return (
          <div
            key={topic}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              marginBottom: 4,
              background: theme.colors.bg,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.md,
              fontSize: 13,
            }}
          >
            <span style={{ color: theme.colors.text }}>{topic}</span>
            <span style={{ color, fontWeight: 600, fontSize: 12 }}>
              {formatScore(chapterScore)}/{formatScore(chapterMax)} ({chapterPercent}%)
            </span>
          </div>
        );
      })}
    </section>
  );
}

export function ResultsScreen({
  mode,
  topics,
  selectedTopicIndex,
  questions,
  score,
  maxScore,
  answers,
  onRetry,
  onHome,
  tutorUses,
  onConsumeTutorUse,
}) {
  const scorePercent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 100;
  const { label, emoji } = getGrade(scorePercent);
  const modeLabel =
    mode === "mini"
      ? `Mini Quiz (${questions.length} Qs)`
      : mode === "all"
        ? "Full Exam"
        : topics[selectedTopicIndex];

  return (
    <Page padding="48px 24px 80px" centered>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>{emoji}</div>
        <h2
          className="results-grade-title"
          style={{
            fontSize: 32,
            fontWeight: 700,
            margin: 0,
            color: theme.colors.text,
            letterSpacing: "-0.02em",
          }}
        >
          {label}
        </h2>
        <p style={{ color: theme.colors.textSecondary, marginTop: 4, fontSize: 14 }}>{modeLabel}</p>
        {mode === "mini" && (
          <span
            style={{
              display: "inline-block",
              marginTop: 6,
              fontSize: 11,
              color: theme.colors.warning,
              background: theme.colors.warningBg,
              padding: "3px 10px",
              borderRadius: theme.radius.sm,
              fontWeight: 600,
            }}
          >
            Mini Quiz
          </span>
        )}

        <div
          className="results-stats-row"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 32,
            margin: "28px 0",
            padding: "20px",
            background: theme.colors.bgTertiary,
            borderRadius: theme.radius.lg,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <div>
            <div style={{ fontSize: 28, fontWeight: 700, color: theme.colors.success }}>{formatScore(score)}</div>
            <div style={{ fontSize: 11, color: theme.colors.textSecondary, marginTop: 4 }}>Points</div>
          </div>
          <div className="results-stats-divider" style={{ width: 1, background: theme.colors.border }} />
          <div>
            <div style={{ fontSize: 28, fontWeight: 700, color: theme.colors.error }}>
              {formatScore(Math.max(maxScore - score, 0))}
            </div>
            <div style={{ fontSize: 11, color: theme.colors.textSecondary, marginTop: 4 }}>Remaining</div>
          </div>
          <div className="results-stats-divider" style={{ width: 1, background: theme.colors.border }} />
          <div>
            <div style={{ fontSize: 28, fontWeight: 700, color: theme.colors.text }}>
              {scorePercent}%
            </div>
            <div style={{ fontSize: 11, color: theme.colors.textSecondary, marginTop: 4 }}>Score</div>
          </div>
        </div>

        <ChapterBreakdown mode={mode} topics={topics} answers={answers} questions={questions} />
        <IncorrectReview
          answers={answers}
          questions={questions}
          tutorUses={tutorUses}
          onConsumeTutorUse={onConsumeTutorUse}
        />

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={onRetry}
            style={{
              flex: 1,
              minWidth: 120,
              padding: "10px 16px",
              background: theme.colors.buttonPrimaryBg,
              color: theme.colors.buttonPrimaryText,
              border: "none",
              borderRadius: theme.radius.md,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {mode === "mini" ? "New Mini Quiz" : "Retry"}
          </button>
          <button
            type="button"
            onClick={onHome}
            style={{
              flex: 1,
              minWidth: 120,
              padding: "10px 16px",
              background: theme.colors.bg,
              color: theme.colors.text,
              border: `1px solid ${theme.colors.borderStrong}`,
              borderRadius: theme.radius.md,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            All Topics
          </button>
        </div>
      </div>
    </Page>
  );
}
