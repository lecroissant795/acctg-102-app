import { useEffect, useId, useState } from "react";
import { AiTutorPanel } from "./AiTutorPanel.jsx";
import { theme } from "../styles/theme.js";
import { canUseTutor, formatTutorUsesRemaining } from "../utils/tutorLimit.js";

export function AiTutorModal({
  question,
  currentAnswer,
  compact = false,
  tutorUses,
  onConsumeTutorUse,
}) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const hasUsesRemaining = tutorUses ? canUseTutor(tutorUses) : true;

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const closeModal = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        className={compact ? "ai-tutor-trigger ai-tutor-trigger--compact" : "ai-tutor-trigger"}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        <span className="ai-tutor-trigger__label">
          {compact ? "Ask AI Tutor" : "Open AI Tutor"}
        </span>
        {tutorUses && (
          <span
            className="ai-tutor-trigger__meta"
            style={{ color: hasUsesRemaining ? theme.colors.textSecondary : theme.colors.warning }}
          >
            {formatTutorUsesRemaining(tutorUses)}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="ai-tutor-modal-backdrop"
            aria-label="Close AI Tutor"
            onClick={closeModal}
          />
          <div
            className="ai-tutor-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <div className="ai-tutor-modal__header">
              <div id={titleId}>
                <div style={{ fontSize: 16, fontWeight: 600, color: theme.colors.text }}>AI Tutor</div>
                <div style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 }}>
                  Get hints, explanations, and follow-up help for this question.
                </div>
              </div>
              <button
                type="button"
                className="ai-tutor-modal__close"
                aria-label="Close AI Tutor"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <div className="ai-tutor-modal__content">
              <AiTutorPanel
                question={question}
                currentAnswer={currentAnswer}
                compact={compact}
                tutorUses={tutorUses}
                onConsumeTutorUse={onConsumeTutorUse}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
