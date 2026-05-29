import { useEffect, useId, useRef } from "react";
import { CHAPTER_QUIZ_ALL, CHAPTER_QUIZ_SIZES, isChapterQuizAll } from "../constants/chapterQuiz.js";
import { NAV_CLICK_SOUND_PROPS } from "../constants/clickSound.js";
import { theme } from "../styles/theme.js";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ChapterQuizSetupModal({
  topic,
  availableCount,
  selectedSize,
  onSelectSize,
  onStart,
  onCancel,
}) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef(null);
  const startButtonRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = [...panelRef.current.querySelectorAll(FOCUSABLE)];
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    startButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancel]);

  const cappedNotice =
    !isChapterQuizAll(selectedSize) && availableCount < selectedSize
      ? `This chapter has ${availableCount} question${availableCount === 1 ? "" : "s"}. All available questions will be used.`
      : null;

  const sizeOptions = [
    ...CHAPTER_QUIZ_SIZES.map((size) => ({ key: size, value: size, label: "questions" })),
    { key: CHAPTER_QUIZ_ALL, value: CHAPTER_QUIZ_ALL, label: `${availableCount} questions` },
  ];

  return (
    <>
      <button
        type="button"
        className="quiz-setup-modal-backdrop"
        aria-label="Close quiz setup"
        onClick={onCancel}
      />
      <div
        ref={panelRef}
        className="quiz-setup-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <div className="quiz-setup-modal__header">
          <div>
            <div id={titleId} style={{ fontSize: 18, fontWeight: 600, color: theme.colors.text }}>
              Chapter MCQ Quiz
            </div>
            <div
              id={descriptionId}
              style={{ fontSize: 13, color: theme.colors.textSecondary, marginTop: 4, lineHeight: 1.5 }}
            >
              {topic}
              <span style={{ display: "block", marginTop: 2 }}>
                {availableCount} question{availableCount === 1 ? "" : "s"} in bank
              </span>
            </div>
          </div>
          <button
            type="button"
            className="quiz-setup-modal__close"
            aria-label="Close quiz setup"
            onClick={onCancel}
          >
            ×
          </button>
        </div>

        <div className="quiz-setup-modal__content">
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.colors.text, marginBottom: 10 }}>
            How many questions?
          </div>
          <div className="quiz-setup-modal__sizes" role="radiogroup" aria-label="Quiz length">
            {sizeOptions.map((option) => {
              const selected = selectedSize === option.value;

              return (
                <button
                  key={option.key}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={`quiz-setup-modal__size${selected ? " quiz-setup-modal__size--selected" : ""}`}
                  onClick={() => onSelectSize(option.value)}
                >
                  <span className="quiz-setup-modal__size-value">
                    {isChapterQuizAll(option.value) ? "All" : option.value}
                  </span>
                  <span className="quiz-setup-modal__size-label">{option.label}</span>
                </button>
              );
            })}
          </div>

          {cappedNotice && (
            <div className="quiz-setup-modal__notice" role="status">
              {cappedNotice}
            </div>
          )}
        </div>

        <div className="quiz-setup-modal__actions">
          <button type="button" className="quiz-setup-modal__button quiz-setup-modal__button--secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            ref={startButtonRef}
            type="button"
            className="quiz-setup-modal__button quiz-setup-modal__button--primary"
            onClick={onStart}
            {...NAV_CLICK_SOUND_PROPS}
          >
            Start Quiz
          </button>
        </div>
      </div>
    </>
  );
}
