import { useEffect, useMemo, useState } from "react";
import { QUESTION_TYPES } from "../data/schema/questionTypes.js";
import { theme } from "../styles/theme.js";
import { getTutorPerformanceContext } from "../utils/stats.js";
import { canUseTutor, formatTutorUsesRemaining } from "../utils/tutorLimit.js";
import {
  buildAskPayload,
  buildExplainPayload,
  buildFallbackAsk,
  buildFallbackExplain,
  buildFallbackHint,
  buildHintPayload,
  requestTutorResponse,
} from "../utils/quizTutor.js";

function TutorMessage({ role, content }) {
  const isAssistant = role === "assistant";

  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: theme.radius.lg,
        background: isAssistant ? theme.colors.calloutBlue : theme.colors.bgTertiary,
        border: `1px solid ${theme.colors.border}`,
        color: theme.colors.text,
        fontSize: 14,
        lineHeight: 1.6,
        whiteSpace: "pre-wrap",
      }}
    >
      {isAssistant && (
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: theme.colors.textSecondary,
            marginBottom: 6,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          AI Tutor
        </div>
      )}
      {content}
    </div>
  );
}

function TutorButton({ children, onClick, disabled = false, variant = "secondary" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "8px 12px",
        borderRadius: theme.radius.md,
        border: `1px solid ${theme.colors.borderStrong}`,
        background: variant === "primary" ? theme.colors.buttonPrimaryBg : theme.colors.bg,
        color: variant === "primary" ? theme.colors.buttonPrimaryText : theme.colors.text,
        fontSize: 13,
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
}

export function AiTutorPanel({
  question,
  currentAnswer,
  compact = false,
  tutorUses,
  onConsumeTutorUse,
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isWritten = question.type === QUESTION_TYPES.WRITTEN;
  const isAnswered = Boolean(currentAnswer);
  const showHint = !isAnswered && !isWritten;
  const showExplain = isAnswered || isWritten;
  const wasWrong = isAnswered && currentAnswer?.evaluation && !currentAnswer.evaluation.correct;
  const showWhyWrong = wasWrong && !isWritten;
  const hasUsesRemaining = tutorUses ? canUseTutor(tutorUses) : true;
  const isDisabled = loading || !hasUsesRemaining;
  const performanceContext = useMemo(
    () => getTutorPerformanceContext(question),
    [question.id, question.q, question.prompt, question.topic]
  );

  useEffect(() => {
    setMessages([]);
    setInput("");
    setError(null);
    setLoading(false);
  }, [question.id, question.q, question.prompt, isAnswered]);

  const appendAssistantMessage = (message, usedFallback = false) => {
    setMessages((current) => [
      ...current,
      {
        role: "assistant",
        content: usedFallback ? `${message}\n\n(Offline tutor response)` : message,
      },
    ]);
  };

  const reserveTutorUse = () => {
    if (!hasUsesRemaining) {
      setError("You have used all 5 AI tutor requests for this quiz.");
      return false;
    }

    if (onConsumeTutorUse && !onConsumeTutorUse()) {
      setError("You have used all 5 AI tutor requests for this quiz.");
      return false;
    }

    return true;
  };

  const runTutorRequest = async (payload, fallback) => {
    if (!reserveTutorUse()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await requestTutorResponse(payload, fallback);
      appendAssistantMessage(result.message, result.usedFallback);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not reach AI tutor.");
    } finally {
      setLoading(false);
    }
  };

  const handleHint = () => runTutorRequest(buildHintPayload(question, performanceContext), buildFallbackHint);

  const handleExplain = () =>
    runTutorRequest(buildExplainPayload(question, currentAnswer, null, performanceContext), buildFallbackExplain);

  const handleWhyWrong = () =>
    runTutorRequest(
      buildExplainPayload(
        question,
        currentAnswer,
        "Explain why my answer was wrong and how to think about this correctly.",
        performanceContext
      ),
      buildFallbackExplain
    );

  const handleAsk = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading || !hasUsesRemaining) return;
    if (!reserveTutorUse()) return;

    const nextMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");

    setLoading(true);
    setError(null);

    try {
      const result = await requestTutorResponse(
        buildAskPayload(
          question,
          currentAnswer,
          trimmed,
          nextMessages.slice(0, -1).map(({ role, content }) => ({ role, content })),
          performanceContext
        ),
        buildFallbackAsk
      );

      appendAssistantMessage(result.message, result.usedFallback);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not reach AI tutor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      style={{
        marginTop: compact ? 12 : 16,
        padding: compact ? "12px 14px" : "16px",
        background: theme.colors.bgSecondary,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.lg,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.colors.text }}>AI Tutor</div>
          <div style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 }}>
            {hasUsesRemaining
              ? showHint
                ? "Get hints before you answer."
                : "Ask for explanations or follow-up questions."
              : "You have used all 5 AI tutor requests for this quiz."}
          </div>
          {tutorUses && (
            <div
              style={{
                fontSize: 11,
                color: hasUsesRemaining ? theme.colors.textSecondary : theme.colors.warning,
                marginTop: 4,
                fontWeight: 500,
              }}
            >
              {formatTutorUsesRemaining(tutorUses)}
            </div>
          )}
        </div>
        <div className="tutor-actions" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {showHint && (
            <TutorButton onClick={handleHint} disabled={isDisabled}>
              {loading ? "Thinking..." : "Get hint"}
            </TutorButton>
          )}
          {showExplain && (
            <>
              <TutorButton onClick={handleExplain} disabled={isDisabled}>
                Explain concept
              </TutorButton>
              {showWhyWrong && (
                <TutorButton onClick={handleWhyWrong} disabled={isDisabled}>
                  Why was I wrong?
                </TutorButton>
              )}
            </>
          )}
        </div>
      </div>

      {messages.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
          {messages.map((message, index) => (
            <TutorMessage key={`${message.role}-${index}`} role={message.role} content={message.content} />
          ))}
        </div>
      )}

      <div className="tutor-input-row" style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleAsk();
          }}
          placeholder={
            hasUsesRemaining
              ? isAnswered
                ? "Ask a follow-up question..."
                : "Ask about this concept..."
              : "No AI tutor uses remaining"
          }
          disabled={isDisabled}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: theme.radius.md,
            border: `1px solid ${theme.colors.borderStrong}`,
            background: theme.colors.bg,
            color: theme.colors.text,
            fontSize: 14,
            opacity: isDisabled ? 0.6 : 1,
          }}
        />
        <TutorButton variant="primary" onClick={handleAsk} disabled={isDisabled || !input.trim()}>
          Ask
        </TutorButton>
      </div>

      {error && (
        <p style={{ margin: "10px 0 0", fontSize: 12, color: theme.colors.error }}>{error}</p>
      )}
    </section>
  );
}
