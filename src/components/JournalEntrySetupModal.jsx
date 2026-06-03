import { useEffect, useId, useRef } from "react";
import { JOURNAL_ENTRY_ALL_CHAPTERS } from "../utils/journalEntryChapters.js";
import { NAV_CLICK_SOUND_PROPS } from "../constants/clickSound.js";
import { theme } from "../styles/theme.js";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function JournalEntrySetupModal({
  chapterOptions,
  totalCount,
  selectedChapter,
  onSelectChapter,
  onStart,
  onCancel,
}) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef(null);
  const startButtonRef = useRef(null);

  const selectedCount =
    selectedChapter === JOURNAL_ENTRY_ALL_CHAPTERS
      ? totalCount
      : chapterOptions.find((option) => option.title === selectedChapter)?.count ?? 0;

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

  const options = [
    { value: JOURNAL_ENTRY_ALL_CHAPTERS, label: "All chapters", count: totalCount },
    ...chapterOptions.map((option) => ({
      value: option.title,
      label: option.title,
      count: option.count,
    })),
  ];

  return (
    <>
      <button
        type="button"
        className="quiz-setup-modal-backdrop"
        aria-label="Close journal entry setup"
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
              Journal Entry Practice
            </div>
            <div
              id={descriptionId}
              style={{ fontSize: 13, color: theme.colors.textSecondary, marginTop: 4, lineHeight: 1.5 }}
            >
              Choose a chapter to focus your practice
              <span style={{ display: "block", marginTop: 2 }}>
                {totalCount} question{totalCount === 1 ? "" : "s"} across {chapterOptions.length} chapters
              </span>
            </div>
          </div>
          <button
            type="button"
            className="quiz-setup-modal__close"
            aria-label="Close journal entry setup"
            onClick={onCancel}
          >
            ×
          </button>
        </div>

        <div className="quiz-setup-modal__content">
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.colors.text, marginBottom: 10 }}>
            Which chapter?
          </div>
          <div
            className="quiz-setup-modal__sizes quiz-setup-modal__sizes--stacked"
            role="radiogroup"
            aria-label="Journal entry chapter"
          >
            {options.map((option) => {
              const selected = selectedChapter === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={`quiz-setup-modal__size quiz-setup-modal__size--chapter${selected ? " quiz-setup-modal__size--selected" : ""}`}
                  onClick={() => onSelectChapter(option.value)}
                >
                  <span className="quiz-setup-modal__size-value">{option.label}</span>
                  <span className="quiz-setup-modal__size-label">
                    {option.count} question{option.count === 1 ? "" : "s"}
                  </span>
                </button>
              );
            })}
          </div>
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
            disabled={selectedCount === 0}
            {...NAV_CLICK_SOUND_PROPS}
          >
            Start Practice — {selectedCount} question{selectedCount === 1 ? "" : "s"}
          </button>
        </div>
      </div>
    </>
  );
}
