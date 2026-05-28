import { useEffect, useState } from "react";
import { Page } from "./Page.jsx";
import { ProgressBar } from "./ProgressBar.jsx";
import { QUESTION_TYPES } from "../data/schema/questionTypes.js";
import { theme, backButtonStyle, cardStyle, inputStyle } from "../styles/theme.js";
import { getDisplayOptionIndex } from "../utils/shuffle.js";
import { JOURNAL_ACCOUNT_SUGGESTIONS } from "../data/index.js";
import {
  getJournalEntryAnswerKey,
  getJournalEntryRowFeedback,
} from "../utils/scoring/index.js";

const JOURNAL_ACCOUNT_LIST_ID = "journal-account-suggestions";
import { AiTutorModal } from "./AiTutorModal.jsx";

function getStoredResponse(currentAnswer) {
  if (!currentAnswer) return null;
  return currentAnswer.evaluation?.responseSummary ?? currentAnswer.response ?? null;
}

function AnswerResultBanner({ correct }) {
  return (
    <div
      style={{
        padding: "10px 14px",
        borderRadius: theme.radius.lg,
        background: correct ? theme.colors.successBg : theme.colors.errorBg,
        border: `1px solid ${correct ? theme.colors.successBorder : theme.colors.errorBorder}`,
        color: correct ? theme.colors.success : theme.colors.error,
        fontWeight: 600,
        fontSize: 14,
        marginBottom: 10,
      }}
    >
      {correct ? "✓ Correct!" : "✗ Incorrect — your answer is highlighted in red"}
    </div>
  );
}

function OptionButton({ index, text, isSelected, isAnswered, isCorrect, isWrongChoice, onSelect }) {
  let bg = theme.colors.bg;
  let border = `1px solid ${theme.colors.borderStrong}`;
  let color = theme.colors.text;

  if (isAnswered) {
    if (isCorrect) {
      bg = theme.colors.successBg;
      border = `1px solid ${theme.colors.successBorder}`;
      color = theme.colors.success;
    } else if (isWrongChoice) {
      bg = theme.colors.errorBg;
      border = `2px solid ${theme.colors.errorBorder}`;
      color = theme.colors.error;
    } else {
      bg = theme.colors.bgTertiary;
      color = theme.colors.textTertiary;
    }
  } else if (isSelected) {
    bg = theme.colors.accentBg;
    border = `1px solid ${theme.colors.accentBorder}`;
  }

  const letterColor = isAnswered && isCorrect
    ? theme.colors.success
    : isAnswered && isWrongChoice
      ? theme.colors.error
      : isSelected
        ? theme.colors.accent
        : theme.colors.textTertiary;

  const letterBorder = isAnswered && isCorrect
    ? theme.colors.success
    : isAnswered && isWrongChoice
      ? theme.colors.errorBorder
      : isSelected
        ? theme.colors.accent
        : theme.colors.borderStrong;

  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      disabled={isAnswered}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        textAlign: "left",
        padding: "12px 14px",
        background: bg,
        border,
        borderRadius: theme.radius.lg,
        color,
        cursor: isAnswered ? "default" : "pointer",
        fontSize: 14,
        lineHeight: 1.5,
        transition: "all 0.2s",
        fontWeight: isAnswered && (isCorrect || isWrongChoice) ? 600 : 400,
      }}
    >
      <span
        style={{
          minWidth: 24,
          height: 24,
          borderRadius: theme.radius.sm,
          border: `2px solid ${letterBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: isAnswered && isWrongChoice ? 13 : 11,
          fontWeight: 700,
          marginTop: 1,
          color: letterColor,
          background:
            isAnswered && isCorrect
              ? theme.colors.successBg
              : isAnswered && isWrongChoice
                ? theme.colors.errorBg
                : "transparent",
        }}
      >
        {isAnswered && isWrongChoice ? "✗" : String.fromCharCode(65 + index)}
      </span>
      <span>{text}</span>
    </button>
  );
}

function cardStyles() {
  return { ...cardStyle, marginBottom: 16 };
}

function ActionButton({ children, disabled = false, onClick, variant = "primary", style = {} }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        width: "100%",
        padding: "10px 16px",
        background: variant === "secondary" ? theme.colors.bg : theme.colors.buttonPrimaryBg,
        color: variant === "secondary" ? theme.colors.text : theme.colors.buttonPrimaryText,
        border: variant === "secondary" ? `1px solid ${theme.colors.borderStrong}` : "none",
        borderRadius: theme.radius.md,
        fontSize: 14,
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "opacity 0.15s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function QuestionNavigation({ questionIndex, isLastQuestion, onPrevious, onNext }) {
  return (
    <div className="quiz-question-nav" style={{ display: "flex", gap: 12, marginTop: 16 }}>
      {questionIndex > 0 && (
        <ActionButton variant="secondary" onClick={onPrevious} style={{ flex: 1 }}>
          ← Previous Question
        </ActionButton>
      )}
      <ActionButton onClick={onNext} style={{ flex: 1 }}>
        {isLastQuestion ? "See Results" : "Next Question →"}
      </ActionButton>
    </div>
  );
}

function ExplanationBlock({ text, feedback }) {
  if (!text && !feedback) return null;

  return (
    <div
      style={{
        marginTop: 16,
        padding: "14px 16px",
        background: theme.colors.calloutBlue,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.lg,
        color: theme.colors.text,
        fontSize: 14,
        lineHeight: 1.6,
      }}
    >
      <span
        style={{
          display: "block",
          marginBottom: 6,
          color: theme.colors.textSecondary,
          fontWeight: 500,
          fontSize: 12,
        }}
      >
        Explanation
      </span>
      {feedback && <p style={{ margin: 0, color: theme.colors.warning }}>{feedback}</p>}
      {text && <p style={{ margin: feedback ? "8px 0 0" : 0 }}>{text}</p>}
    </div>
  );
}

function McqQuestion({ question, currentAnswer, onSubmitAnswer }) {
  const displayOptions = question.displayOptions ?? question.options ?? [];
  const correctAnswer = question.displayAnswer ?? question.answer?.correctIndex ?? question.answer;
  const selectedIndex = getStoredResponse(currentAnswer)?.selectedIndex;
  const displaySelectedIndex = getDisplayOptionIndex(question, selectedIndex);
  const isAnswered = Boolean(currentAnswer);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {isAnswered && (
        <AnswerResultBanner correct={currentAnswer.evaluation?.correct} />
      )}
      {displayOptions.map((option, index) => (
        <OptionButton
          key={index}
          index={index}
          text={option}
          isSelected={displaySelectedIndex === index}
          isAnswered={isAnswered}
          isCorrect={index === correctAnswer}
          isWrongChoice={displaySelectedIndex === index && index !== correctAnswer}
          onSelect={(choiceIndex) => onSubmitAnswer({ selectedIndex: choiceIndex })}
        />
      ))}
    </div>
  );
}

function SelectMultipleQuestion({ question, currentAnswer, onSubmitAnswer }) {
  const [selectedIndices, setSelectedIndices] = useState([]);
  const isAnswered = Boolean(currentAnswer);
  const correctIndices = question.answer?.correctIndices ?? [];

  useEffect(() => {
    setSelectedIndices(getStoredResponse(currentAnswer)?.selectedIndices ?? []);
  }, [question.id, currentAnswer]);

  return (
    <>
      <div style={{ ...cardStyles(), marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: theme.colors.textSecondary }}>Select all that apply.</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {(question.options ?? []).map((option, index) => {
          const isSelected = selectedIndices.includes(index);
          return (
            <OptionButton
              key={index}
              index={index}
              text={option}
              isSelected={isSelected}
              isAnswered={isAnswered}
              isCorrect={correctIndices.includes(index)}
              isWrongChoice={isSelected && !correctIndices.includes(index)}
              onSelect={(choiceIndex) => {
                if (isAnswered) return;
                setSelectedIndices((current) =>
                  current.includes(choiceIndex)
                    ? current.filter((value) => value !== choiceIndex)
                    : [...current, choiceIndex].sort((a, b) => a - b)
                );
              }}
            />
          );
        })}
      </div>
      {!isAnswered && (
        <div style={{ marginTop: 16 }}>
          <ActionButton
            disabled={selectedIndices.length === 0}
            onClick={() => onSubmitAnswer({ selectedIndices })}
          >
            Check Answer
          </ActionButton>
        </div>
      )}
    </>
  );
}

function NumericInputQuestion({ currentAnswer, onSubmitAnswer }) {
  const [value, setValue] = useState("");
  const isAnswered = Boolean(currentAnswer);

  useEffect(() => {
    const responseValue = getStoredResponse(currentAnswer)?.value;
    setValue(responseValue == null ? "" : String(responseValue));
  }, [currentAnswer]);

  return (
    <>
      <div style={cardStyles()}>
        <label style={{ display: "block", color: theme.colors.textSecondary, fontSize: 12, marginBottom: 8 }}>
          Enter your answer
        </label>
        <input
          type="text"
          value={value}
          disabled={isAnswered}
          onChange={(event) => setValue(event.target.value)}
          style={inputStyle}
        />
      </div>
      {!isAnswered && (
        <ActionButton disabled={String(value).trim() === ""} onClick={() => onSubmitAnswer({ value })}>
          Check Answer
        </ActionButton>
      )}
    </>
  );
}

function normalizeJournalLine(line) {
  return {
    account: line.account ?? "",
    debit: line.debit == null ? "" : String(line.debit),
    credit: line.credit == null ? "" : String(line.credit),
  };
}

function journalFieldStyle(status) {
  if (status === "correct") {
    return {
      ...inputStyle,
      background: theme.colors.successBg,
      border: `1px solid ${theme.colors.successBorder}`,
      color: theme.colors.success,
      fontWeight: 600,
    };
  }

  if (status === "wrong") {
    return {
      ...inputStyle,
      background: theme.colors.errorBg,
      border: `2px solid ${theme.colors.errorBorder}`,
      color: theme.colors.error,
      fontWeight: 600,
    };
  }

  return inputStyle;
}

function JournalEntryGrid({
  lines,
  fieldFeedback,
  readOnly = false,
  onUpdateLine,
  showAccountSuggestions = false,
}) {
  return (
    <>
      {showAccountSuggestions && (
        <datalist id={JOURNAL_ACCOUNT_LIST_ID}>
          {JOURNAL_ACCOUNT_SUGGESTIONS.map((account) => (
            <option key={account} value={account} />
          ))}
        </datalist>
      )}
      <div
        className="journal-entry-header"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(96px, 1fr) minmax(96px, 1fr)",
          gap: 10,
          marginBottom: 10,
          fontSize: 11,
          color: theme.colors.textSecondary,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        <span>Account</span>
        <span>Debit</span>
        <span>Credit</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {lines.map((line, index) => {
          const feedback = fieldFeedback?.[index];
          const accountStyle = readOnly
            ? journalFieldStyle("correct")
            : journalFieldStyle(feedback?.account ?? "neutral");
          const debitStyle = readOnly
            ? journalFieldStyle(line.debit ? "correct" : "neutral")
            : journalFieldStyle(feedback?.debit ?? "neutral");
          const creditStyle = readOnly
            ? journalFieldStyle(line.credit ? "correct" : "neutral")
            : journalFieldStyle(feedback?.credit ?? "neutral");

          return (
            <div
              key={index}
              className="journal-entry-row"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 2fr) minmax(96px, 1fr) minmax(96px, 1fr)",
                gap: 10,
              }}
            >
              <input
                type="text"
                value={line.account}
                list={showAccountSuggestions ? JOURNAL_ACCOUNT_LIST_ID : undefined}
                readOnly={readOnly || !onUpdateLine}
                onChange={(event) => onUpdateLine?.(index, "account", event.target.value)}
                placeholder="Account"
                aria-label={`Line ${index + 1} account`}
                autoComplete="off"
                style={accountStyle}
              />
              <input
                type="number"
                inputMode="decimal"
                value={line.debit}
                readOnly={readOnly || !onUpdateLine}
                onChange={(event) => onUpdateLine?.(index, "debit", event.target.value)}
                placeholder="Debit"
                aria-label={`Line ${index + 1} debit`}
                style={debitStyle}
              />
              <input
                type="number"
                inputMode="decimal"
                value={line.credit}
                readOnly={readOnly || !onUpdateLine}
                onChange={(event) => onUpdateLine?.(index, "credit", event.target.value)}
                placeholder="Credit"
                aria-label={`Line ${index + 1} credit`}
                style={creditStyle}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}

function JournalEntryQuestion({ question, currentAnswer, onSubmitAnswer }) {
  const expectedLength = Math.max(question.answer?.lines?.length ?? 2, 2);
  const [lines, setLines] = useState([]);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);
  const isAnswered = Boolean(currentAnswer);

  useEffect(() => {
    const storedLines = getStoredResponse(currentAnswer)?.lines;
    const initialLines = storedLines
      ? storedLines.map(normalizeJournalLine)
      : Array.from({ length: expectedLength }, () => ({
          account: "",
          debit: "",
          credit: "",
        }));
    setLines(initialLines);
    setShowCorrectAnswers(false);
  }, [currentAnswer, expectedLength, question.id]);

  const totalDebits = lines.reduce((sum, line) => sum + Number(line.debit || 0), 0);
  const totalCredits = lines.reduce((sum, line) => sum + Number(line.credit || 0), 0);
  const canSubmit = lines.some((line) => line.account.trim() || line.debit || line.credit);
  const submittedLines = getStoredResponse(currentAnswer)?.lines ?? [];
  const rowFeedback = isAnswered ? getJournalEntryRowFeedback(question, submittedLines) : null;
  const answerKey = getJournalEntryAnswerKey(question);
  const isBalanced = currentAnswer?.evaluation?.breakdown?.balanced ?? true;

  const updateLine = (index, field, value) => {
    if (isAnswered) return;
    setLines((current) =>
      current.map((line, currentIndex) =>
        currentIndex === index
          ? {
              ...line,
              [field]: value,
              ...(field === "debit" && value !== "" ? { credit: "" } : {}),
              ...(field === "credit" && value !== "" ? { debit: "" } : {}),
            }
          : line
      )
    );
  };

  return (
    <>
      {isAnswered && (
        <AnswerResultBanner correct={currentAnswer.evaluation?.correct} />
      )}
      <div style={cardStyles()}>
        {!isAnswered && (
          <div style={{ fontSize: 12, color: theme.colors.textSecondary, marginBottom: 10 }}>
            Type in Account to see suggestions ({JOURNAL_ACCOUNT_SUGGESTIONS.length} accounts).
          </div>
        )}
        {isAnswered && (
          <div style={{ fontSize: 12, color: theme.colors.textSecondary, marginBottom: 10 }}>
            Green = correct field · Red = incorrect field
            {!isBalanced && (
              <span style={{ color: theme.colors.error, marginLeft: 8 }}>
                Entry is not balanced.
              </span>
            )}
          </div>
        )}
        <JournalEntryGrid
          lines={lines}
          fieldFeedback={rowFeedback}
          onUpdateLine={isAnswered ? undefined : updateLine}
          showAccountSuggestions={!isAnswered}
        />
        <div
          className="journal-entry-totals"
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: theme.colors.textSecondary,
            fontSize: 12,
            marginTop: 12,
          }}
        >
          <span>Total debits: {totalDebits.toFixed(2)}</span>
          <span>Total credits: {totalCredits.toFixed(2)}</span>
        </div>
      </div>
      {!isAnswered && (
        <ActionButton
          disabled={!canSubmit}
          onClick={() =>
            onSubmitAnswer({
              lines: lines
                .filter((line) => line.account.trim() || line.debit || line.credit)
                .map((line) => ({
                  account: line.account.trim(),
                  debit: line.debit === "" ? null : Number(line.debit),
                  credit: line.credit === "" ? null : Number(line.credit),
                })),
            })
          }
        >
          Check Entry
        </ActionButton>
      )}
      {isAnswered && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 4 }}>
          <ActionButton
            variant="secondary"
            onClick={() => setShowCorrectAnswers((current) => !current)}
          >
            {showCorrectAnswers ? "Hide correct answers" : "Show correct answers"}
          </ActionButton>
          {showCorrectAnswers && (
            <div
              style={{
                ...cardStyles(),
                marginBottom: 0,
                background: theme.colors.successBg,
                border: `1px solid ${theme.colors.successBorder}`,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: theme.colors.success,
                  marginBottom: 10,
                }}
              >
                Correct entry
              </div>
              <JournalEntryGrid lines={answerKey} readOnly />
            </div>
          )}
        </div>
      )}
    </>
  );
}

function MatchingQuestion({ question, currentAnswer, onSubmitAnswer }) {
  const [pairs, setPairs] = useState({});
  const isAnswered = Boolean(currentAnswer);

  useEffect(() => {
    setPairs(getStoredResponse(currentAnswer)?.pairs ?? {});
  }, [question.id, currentAnswer]);

  const leftItems = question.leftItems ?? [];
  const rightItems = question.rightItems ?? [];
  const canSubmit = leftItems.length > 0 && leftItems.every((item) => pairs[item.id]);

  return (
    <>
      <div style={cardStyles()}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {leftItems.map((item) => (
            <div key={item.id} className="matching-row" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(180px, 1fr)", gap: 12, alignItems: "center" }}>
              <div style={{ color: theme.colors.text, fontSize: 14 }}>{item.text}</div>
              <select
                value={pairs[item.id] ?? ""}
                disabled={isAnswered}
                onChange={(event) =>
                  setPairs((current) => ({ ...current, [item.id]: event.target.value }))
                }
                style={inputStyle}
              >
                <option value="">Select match</option>
                {rightItems.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.text}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
      {!isAnswered && (
        <ActionButton disabled={!canSubmit} onClick={() => onSubmitAnswer({ pairs })}>
          Check Matches
        </ActionButton>
      )}
    </>
  );
}

function OrderingQuestion({ question, currentAnswer, onSubmitAnswer }) {
  const [orderedItems, setOrderedItems] = useState([]);
  const isAnswered = Boolean(currentAnswer);

  useEffect(() => {
    const sourceItems = question.items ?? [];
    const orderedIds = getStoredResponse(currentAnswer)?.orderedIds;
    if (orderedIds?.length) {
      const itemMap = new Map(sourceItems.map((item) => [item.id, item]));
      setOrderedItems(orderedIds.map((id) => itemMap.get(id)).filter(Boolean));
      return;
    }
    setOrderedItems(sourceItems);
  }, [question.id, question.items, currentAnswer]);

  const moveItem = (index, direction) => {
    if (isAnswered) return;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= orderedItems.length) return;
    setOrderedItems((current) => {
      const copy = [...current];
      [copy[index], copy[nextIndex]] = [copy[nextIndex], copy[index]];
      return copy;
    });
  };

  return (
    <>
      <div style={cardStyles()}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {orderedItems.map((item, index) => (
            <div
              key={item.id}
              className="ordering-row"
              style={{
                display: "grid",
                gridTemplateColumns: "32px minmax(0, 1fr) auto",
                gap: 12,
                alignItems: "center",
                padding: "12px 14px",
                borderRadius: theme.radius.lg,
                background: theme.colors.bgTertiary,
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <div style={{ color: theme.colors.textSecondary, fontWeight: 700 }}>{index + 1}</div>
              <div style={{ color: theme.colors.text }}>{item.text}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" disabled={isAnswered || index === 0} onClick={() => moveItem(index, -1)} style={miniControlStyle(isAnswered || index === 0)}>
                  ↑
                </button>
                <button type="button" disabled={isAnswered || index === orderedItems.length - 1} onClick={() => moveItem(index, 1)} style={miniControlStyle(isAnswered || index === orderedItems.length - 1)}>
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {!isAnswered && (
        <ActionButton onClick={() => onSubmitAnswer({ orderedIds: orderedItems.map((item) => item.id) })}>
          Check Order
        </ActionButton>
      )}
    </>
  );
}

function TableClassificationQuestion({ question, currentAnswer, onSubmitAnswer }) {
  const [mapping, setMapping] = useState({});
  const isAnswered = Boolean(currentAnswer);
  const rows = question.rows ?? [];
  const columns = question.columns ?? [];

  useEffect(() => {
    setMapping(getStoredResponse(currentAnswer)?.mapping ?? {});
  }, [question.id, currentAnswer]);

  const canSubmit = rows.length > 0 && rows.every((row) => mapping[row.id]);

  return (
    <>
      <div style={cardStyles()}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {rows.map((row) => (
            <div key={row.id} className="classification-row" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(180px, 1fr)", gap: 12, alignItems: "center" }}>
              <div style={{ color: theme.colors.text, fontSize: 14 }}>{row.text}</div>
              <select
                value={mapping[row.id] ?? ""}
                disabled={isAnswered}
                onChange={(event) =>
                  setMapping((current) => ({ ...current, [row.id]: event.target.value }))
                }
                style={inputStyle}
              >
                <option value="">Select category</option>
                {columns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
      {!isAnswered && (
        <ActionButton disabled={!canSubmit} onClick={() => onSubmitAnswer({ mapping })}>
          Check Classification
        </ActionButton>
      )}
    </>
  );
}

function CaseSetQuestion({ question, currentAnswer, onSubmitAnswer }) {
  const [subresponses, setSubresponses] = useState({});
  const isAnswered = Boolean(currentAnswer);
  const subquestions = question.subquestions ?? [];

  useEffect(() => {
    setSubresponses(getStoredResponse(currentAnswer)?.subresponses ?? {});
  }, [question.id, currentAnswer]);

  const updateSubresponse = (subquestionId, nextResponse) => {
    if (isAnswered) return;
    setSubresponses((current) => ({ ...current, [subquestionId]: nextResponse }));
  };

  const canSubmit = subquestions.length > 0 && subquestions.every((subquestion) => {
    const response = subresponses[subquestion.id];
    switch (subquestion.type) {
      case QUESTION_TYPES.MCQ:
        return typeof response?.selectedIndex === "number";
      case QUESTION_TYPES.NUMERIC_INPUT:
        return String(response?.value ?? "").trim() !== "";
      case QUESTION_TYPES.SELECT_MULTIPLE:
        return Array.isArray(response?.selectedIndices) && response.selectedIndices.length > 0;
      default:
        return response != null;
    }
  });

  return (
    <>
      {question.scenario && (
        <div style={cardStyles()}>
          <div style={{ color: theme.colors.textSecondary, fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
            Scenario
          </div>
          <div style={{ color: theme.colors.text, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{question.scenario}</div>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {subquestions.map((subquestion, index) => (
          <div key={subquestion.id} style={cardStyles()}>
            <div style={{ color: theme.colors.textSecondary, fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
              Part {index + 1}
            </div>
            <p style={{ margin: "0 0 12px 0", color: theme.colors.text }}>{subquestion.prompt ?? subquestion.q}</p>
            <CaseSetSubquestion
              subquestion={subquestion}
              response={subresponses[subquestion.id]}
              disabled={isAnswered}
              onChange={(nextResponse) => updateSubresponse(subquestion.id, nextResponse)}
            />
          </div>
        ))}
      </div>
      {!isAnswered && (
        <div style={{ marginTop: 16 }}>
          <ActionButton disabled={!canSubmit} onClick={() => onSubmitAnswer({ subresponses })}>
            Check Case Set
          </ActionButton>
        </div>
      )}
    </>
  );
}

function CaseSetSubquestion({ subquestion, response, disabled, onChange }) {
  switch (subquestion.type) {
    case QUESTION_TYPES.MCQ:
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(subquestion.options ?? []).map((option, index) => (
            <button
              key={index}
              type="button"
              disabled={disabled}
              onClick={() => onChange({ selectedIndex: index })}
              style={subOptionStyle(response?.selectedIndex === index, disabled)}
            >
              {option}
            </button>
          ))}
        </div>
      );
    case QUESTION_TYPES.SELECT_MULTIPLE:
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(subquestion.options ?? []).map((option, index) => {
            const selectedIndices = response?.selectedIndices ?? [];
            const isSelected = selectedIndices.includes(index);
            return (
              <button
                key={index}
                type="button"
                disabled={disabled}
                onClick={() =>
                  onChange({
                    selectedIndices: isSelected
                      ? selectedIndices.filter((value) => value !== index)
                      : [...selectedIndices, index].sort((a, b) => a - b),
                  })
                }
                style={subOptionStyle(isSelected, disabled)}
              >
                {option}
              </button>
            );
          })}
        </div>
      );
    case QUESTION_TYPES.NUMERIC_INPUT:
      return (
        <input
          type="text"
          value={response?.value ?? ""}
          disabled={disabled}
          onChange={(event) => onChange({ value: event.target.value })}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: theme.radius.lg,
            border: `1px solid ${theme.colors.borderStrong}`,
            background: theme.colors.bg,
            color: theme.colors.text,
          }}
        />
      );
    default:
      return <div style={{ color: theme.colors.textSecondary, fontSize: 13 }}>This case-set part type is not editable yet.</div>;
  }
}

function QuestionInteraction({ question, currentAnswer, onSubmitAnswer }) {
  switch (question.type) {
    case QUESTION_TYPES.MATCHING:
      return (
        <MatchingQuestion
          question={question}
          currentAnswer={currentAnswer}
          onSubmitAnswer={onSubmitAnswer}
        />
      );
    case QUESTION_TYPES.ORDERING:
      return (
        <OrderingQuestion
          question={question}
          currentAnswer={currentAnswer}
          onSubmitAnswer={onSubmitAnswer}
        />
      );
    case QUESTION_TYPES.SELECT_MULTIPLE:
      return (
        <SelectMultipleQuestion
          question={question}
          currentAnswer={currentAnswer}
          onSubmitAnswer={onSubmitAnswer}
        />
      );
    case QUESTION_TYPES.NUMERIC_INPUT:
      return (
        <NumericInputQuestion
          currentAnswer={currentAnswer}
          onSubmitAnswer={onSubmitAnswer}
        />
      );
    case QUESTION_TYPES.JOURNAL_ENTRY:
      return (
        <JournalEntryQuestion
          question={question}
          currentAnswer={currentAnswer}
          onSubmitAnswer={onSubmitAnswer}
        />
      );
    case QUESTION_TYPES.TABLE_CLASSIFICATION:
      return (
        <TableClassificationQuestion
          question={question}
          currentAnswer={currentAnswer}
          onSubmitAnswer={onSubmitAnswer}
        />
      );
    case QUESTION_TYPES.CASE_SET:
      return (
        <CaseSetQuestion
          question={question}
          currentAnswer={currentAnswer}
          onSubmitAnswer={onSubmitAnswer}
        />
      );
    case QUESTION_TYPES.WRITTEN:
      return null;
    default:
      return (
        <McqQuestion
          question={question}
          currentAnswer={currentAnswer}
          onSubmitAnswer={onSubmitAnswer}
        />
      );
  }
}

export function QuizScreen({
  mode,
  topics,
  selectedTopicIndex,
  questions,
  questionIndex,
  currentAnswer,
  showExplanation,
  score,
  onBack,
  onSubmitAnswer,
  onNext,
  onPrevious,
  tutorUses,
  onConsumeTutorUse,
}) {
  const currentQuestion = questions[questionIndex];
  const isWritten = currentQuestion.type === QUESTION_TYPES.WRITTEN;
  const topicLabel = currentQuestion.topic || topics[selectedTopicIndex];
  const accentColor = mode === "mini" ? theme.colors.warning : theme.colors.accent;
  const isLastQuestion = questionIndex + 1 >= questions.length;
  const headerLabel = currentQuestion.type === QUESTION_TYPES.WRITTEN ? "Completed" : "Points";

  return (
    <Page padding="32px 24px 64px" centered>
      <div>
        <div
          className="quiz-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <button type="button" onClick={onBack} style={backButtonStyle}>
            ← Back
          </button>
          <div className="quiz-header-actions" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {mode === "mini" && (
              <span
                style={{
                  fontSize: 11,
                  color: theme.colors.warning,
                  background: theme.colors.warningBg,
                  padding: "2px 8px",
                  borderRadius: theme.radius.sm,
                  fontWeight: 600,
                }}
              >
                Mini
              </span>
            )}
            <span style={{ fontSize: 13, color: accentColor, fontWeight: 500 }}>
              {score.toFixed(score % 1 === 0 ? 0 : 2)} {headerLabel.toLowerCase()}
            </span>
          </div>
        </div>

        <ProgressBar current={questionIndex + 1} total={questions.length} />

        <div
          className="quiz-meta-row"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 12,
            marginBottom: 24,
            fontSize: 13,
            color: theme.colors.textSecondary,
          }}
        >
          <span>
            Q {questionIndex + 1} of {questions.length}
          </span>
          {topicLabel && (
            <span
              className="quiz-topic-badge"
              style={{
                color: theme.colors.textSecondary,
                background: theme.colors.bgTertiary,
                padding: "2px 8px",
                borderRadius: theme.radius.sm,
                fontSize: 12,
              }}
            >
              {topicLabel}
            </span>
          )}
        </div>

        <div
          style={{
            background: theme.colors.bg,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.lg,
            padding: "20px 18px",
            marginBottom: 24,
            color: theme.colors.text,
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
            fontSize: 15,
          }}
        >
          {currentQuestion.parts?.length ? (
            <div>
              <p style={{ margin: "0 0 12px 0" }}>{(currentQuestion.q ?? currentQuestion.prompt).split('\n\n')[0]}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
                {currentQuestion.parts.map((part) => (
                  <div key={`${part.label}-${part.text}`}>
                    <strong>{part.label}</strong> {part.text}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p style={{ margin: 0 }}>{currentQuestion.q ?? currentQuestion.prompt}</p>
          )}
        </div>

        {isWritten ? (
          <div>
            <div style={cardStyles()}>
              <div
                style={{
                  fontSize: 11,
                  color: theme.colors.textSecondary,
                  marginBottom: 8,
                  fontWeight: 600,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                Sample Answer
              </div>
              <div style={{ color: theme.colors.text, fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {currentQuestion.sampleAnswer ?? currentQuestion.answer?.sampleAnswer}
              </div>
            </div>
            <QuestionNavigation
              questionIndex={questionIndex}
              isLastQuestion={isLastQuestion}
              onPrevious={onPrevious}
              onNext={onNext}
            />
            <AiTutorModal
              question={currentQuestion}
              currentAnswer={null}
              tutorUses={tutorUses}
              onConsumeTutorUse={onConsumeTutorUse}
            />
          </div>
        ) : (
          <>
            <QuestionInteraction
              question={currentQuestion}
              currentAnswer={currentAnswer}
              onSubmitAnswer={onSubmitAnswer}
            />

            <QuestionNavigation
              questionIndex={questionIndex}
              isLastQuestion={isLastQuestion}
              onPrevious={onPrevious}
              onNext={onNext}
            />

            <AiTutorModal
              question={currentQuestion}
              currentAnswer={currentAnswer}
              tutorUses={tutorUses}
              onConsumeTutorUse={onConsumeTutorUse}
            />

            {showExplanation && currentAnswer && (
              <ExplanationBlock
                text={currentQuestion.explanation}
                feedback={currentAnswer?.evaluation?.feedback}
              />
            )}
          </>
        )}
      </div>
    </Page>
  );
}

function miniControlStyle(disabled) {
  return {
    width: 32,
    height: 32,
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.borderStrong}`,
    background: theme.colors.bg,
    color: theme.colors.text,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
  };
}

function subOptionStyle(selected, disabled) {
  return {
    width: "100%",
    textAlign: "left",
    padding: "12px 14px",
    borderRadius: theme.radius.lg,
    border: selected ? `1px solid ${theme.colors.accentBorder}` : `1px solid ${theme.colors.border}`,
    background: selected ? theme.colors.accentBg : theme.colors.bg,
    color: theme.colors.text,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.65 : 1,
  };
}
