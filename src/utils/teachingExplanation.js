function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.!?]+$/g, "");
}

function stripTrailingPeriod(value) {
  return String(value ?? "").trim().replace(/[.!?]+$/g, "");
}

function decapitalize(value) {
  const text = String(value ?? "").trim();
  if (!text) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function buildContrastClause(lowerQ) {
  if (lowerQ.includes("accrual") && (lowerQ.includes("cash") || lowerQ.includes("basis"))) {
    return "Accrual accounting recognises revenue and expenses when they are earned or incurred; cash accounting waits for cash movement. Distractors often describe the other basis or the wrong period.";
  }
  if (lowerQ.includes("cash basis")) {
    return "Under cash basis, recognition follows cash receipts and payments. Accrual would recognise the same event when the underlying activity occurs, even if cash moves later.";
  }
  if (lowerQ.includes("adjusting") || lowerQ.includes("accrued") || lowerQ.includes("prepaid")) {
    return "Adjusting entries align revenues and expenses with the reporting period before statements are issued. Wrong options usually skip the adjustment, use the wrong account type, or apply the entry in the wrong period.";
  }
  if (
    lowerQ.includes("ifrs 15") ||
    lowerQ.includes("aasb 15") ||
    lowerQ.includes("performance obligation")
  ) {
    return "IFRS 15 focuses on distinct performance obligations and recognising revenue as each is satisfied — not simply when cash is received or an invoice is issued.";
  }
  if (lowerQ.includes("debit") || lowerQ.includes("credit") || lowerQ.includes("journal")) {
    return "Work through which accounts change and whether they have normal debit or credit balances. Distractors often swap sides, use the wrong account class, or omit part of the entry.";
  }
  if (
    lowerQ.includes("overstate") ||
    lowerQ.includes("understate") ||
    lowerQ.includes("effect on")
  ) {
    return "Trace each misstatement through the accounting equation and into profit or loss and the statement of financial position. Other options often flip the direction of the error or affect only one statement.";
  }
  if (lowerQ.includes("depreciat") || lowerQ.includes("amortis")) {
    return "Depreciation and amortisation allocate cost over useful life. Wrong options may expense the full cost immediately, use the wrong base amount, or post to the wrong accounts.";
  }
  return "The other options are related ideas or common mistakes, but they do not meet the specific requirement in the question stem.";
}

/**
 * Build a short teaching explanation from flashcard fields (not a verbatim answer repeat).
 */
export function buildTeachingExplanation({ q, a, tags = [] }) {
  const question = String(q ?? "").trim();
  const answer = stripTrailingPeriod(a);
  const lowerQ = question.toLowerCase();
  const topic = tags.map((tag) => tag.replaceAll("_", " ")).join(", ");
  const tagClause = topic ? ` (${topic})` : "";

  let frame = "The concept being tested";
  if (lowerQ.includes("when ") || lowerQ.includes("which period") || lowerQ.includes("in which period")) {
    frame = "Timing is the key idea";
  } else if (lowerQ.includes("why ") || lowerQ.includes("reason")) {
    frame = "The reasoning to apply";
  } else if (
    lowerQ.includes("which of the following") ||
    lowerQ.includes("which statement") ||
    lowerQ.includes("best describes") ||
    lowerQ.includes("best distinguishes")
  ) {
    frame = "Apply the relevant accounting rule";
  } else if (lowerQ.includes("calculate") || lowerQ.includes("how much") || /\$\d/.test(question)) {
    frame = "The calculation rests on";
  } else if (lowerQ.includes("journal") || lowerQ.includes("debit") || lowerQ.includes("credit")) {
    frame = "Account analysis";
  } else if (lowerQ.includes("effect") || lowerQ.includes("overstate") || lowerQ.includes("understate")) {
    frame = "Statement impact";
  }

  const core = decapitalize(answer);
  const contrast = buildContrastClause(lowerQ);

  return `${frame}${tagClause}: ${core}. ${contrast}`;
}

export function getCorrectAnswerText(question) {
  if (!question) return null;

  const answer = question.answer;
  if (typeof answer === "number") {
    return question.options?.[answer] ?? null;
  }

  const correctIndex = answer?.correctIndex;
  if (typeof correctIndex === "number") {
    return question.options?.[correctIndex] ?? null;
  }

  const correctIndices = answer?.correctIndices;
  if (Array.isArray(correctIndices) && correctIndices.length > 0) {
    return correctIndices
      .map((index) => question.options?.[index])
      .filter(Boolean)
      .join(", ");
  }

  if (answer?.value != null) {
    return String(answer.value);
  }

  return null;
}

export function isRedundantExplanation(question) {
  const explanation = String(question?.explanation ?? "").trim();
  const correct = getCorrectAnswerText(question);
  if (!explanation || !correct) return false;

  const normalizedExplanation = normalizeText(explanation);
  const normalizedCorrect = normalizeText(correct);

  if (normalizedExplanation === normalizedCorrect) return true;

  // Explanation is mostly just the correct option with light punctuation
  if (
    normalizedExplanation.includes(normalizedCorrect) &&
    normalizedExplanation.length <= normalizedCorrect.length + 20
  ) {
    return true;
  }

  return false;
}

/**
 * Prefer stored explanations when they teach; otherwise enrich answer-only text.
 */
export function getDisplayExplanation(question) {
  const stored = question?.explanation;
  if (!stored) return stored;

  if (!isRedundantExplanation(question)) {
    return stored;
  }

  return buildTeachingExplanation({
    q: question.q ?? question.prompt ?? "",
    a: getCorrectAnswerText(question) ?? stored,
    tags: question.tags ?? [],
  });
}
