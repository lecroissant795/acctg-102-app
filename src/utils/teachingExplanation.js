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

function capitalize(value) {
  const text = String(value ?? "").trim();
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function splitProseToBullets(text) {
  const trimmed = String(text ?? "").trim();
  if (!trimmed) return [];

  if (/^[\s]*[-•*]\s/m.test(trimmed)) {
    return trimmed
      .split(/\n+/)
      .map((line) => line.replace(/^[\s]*[-•*]\s+/, "").trim())
      .filter(Boolean);
  }

  const sentences = trimmed
    .split(/(?<=[.!?])\s+(?=[A-Z("(])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  return sentences.length > 0 ? sentences : [trimmed];
}

function decapitalize(value) {
  const text = String(value ?? "").trim();
  if (!text) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function formatJournalEntrySummary(lines = []) {
  return lines
    .map((line) => {
      const side = line.side === "debit" ? "Dr" : line.side === "credit" ? "Cr" : "";
      const amount = line.amount ?? "";
      return side ? `${line.account} ${side} ${amount}` : line.account;
    })
    .join("; ");
}

const VAGUE_EXPLANATION_PATTERNS = [
  /^one asset increases and another asset decreases\.?$/i,
  /^cash increases and .* increases/i,
  /^the .* increases and .* increases/i,
  /^a liability is settled with cash\.?$/i,
  /^record the (entry|journal entry)\.?$/i,
  /^debit .* credit .*\.?$/i,
  /^this is the correct journal entry\.?$/i,
  /^paying an expense decreases cash/i,
  /^collection reduces the receivable/i,
];

function buildJournalEntryContrast(lowerQ, tags) {
  if (lowerQ.includes("including gst") || tags.includes("gst")) {
    return "A common mistake is putting the full tax-inclusive amount into revenue or inventory, or forgetting the separate GST receivable or payable.";
  }
  if (tags.includes("adjusting_entries") || lowerQ.includes("adjusting")) {
    return "Adjusting entries fix timing, not new day-to-day transactions—watch for prepayments, accruals, and unearned revenue that belong partly to another period.";
  }
  if (tags.includes("inventory_sales")) {
    return "For perpetual sales, omitting the cost-of-goods-sold transfer leaves inventory and cost of sales misstated even if the revenue side is correct.";
  }
  if (tags.includes("equity")) {
    return "Owner contributions and dividends change equity, not operating revenue; dividends declared create a liability before cash is paid.";
  }
  if (tags.includes("allowance_method") || lowerQ.includes("allowance")) {
    return "Under the allowance method, writing off a customer does not create bad debt expense again—the allowance balance is used instead.";
  }
  return "Check each line for the correct account type, debit/credit side, and amount; unbalanced entries cannot be correct even if the accounts look plausible.";
}

export function buildJournalEntryTeachingExplanation(question) {
  const questionText = String(question?.q ?? question?.prompt ?? "").trim();
  const lowerQ = questionText.toLowerCase();
  const tags = question.tags ?? [];
  const stored = stripTrailingPeriod(question?.explanation ?? "");
  const answerLines = question.answer?.lines ?? [];

  let frame = "Economic effect";
  if (lowerQ.includes("adjusting entry") || tags.includes("adjusting_entries")) {
    frame = "Adjusting entry logic";
  } else if (tags.includes("inventory_sales") || (lowerQ.includes("sold") && lowerQ.includes("cost"))) {
    frame = "Perpetual sale entry";
  } else if (tags.includes("gst") || lowerQ.includes("gst")) {
    frame = "GST-inclusive transaction";
  } else if (tags.includes("equity")) {
    frame = "Equity transaction";
  }

  const core =
    stored && !isVagueExplanation(question, stored)
      ? capitalize(stored)
      : answerLines.length > 0
        ? capitalize(`the entry records ${formatJournalEntrySummary(answerLines).toLowerCase()}`)
        : "Each account reflects an increase or decrease from the transaction described";

  const contrast = buildJournalEntryContrast(lowerQ, tags);

  const bullets = [`${frame}: ${core}`];

  if (answerLines.length > 0 && answerLines.length <= 6) {
    bullets.push(
      ...answerLines.map((line) => {
        const side = line.side === "debit" ? "Debit" : "Credit";
        const amount =
          typeof line.amount === "number" ? line.amount.toLocaleString() : line.amount;
        return `${line.account} — ${side} $${amount}`;
      })
    );
  }

  bullets.push(`Common mistake: ${decapitalize(contrast)}`);

  return bullets;
}

export function isVagueExplanation(question, explanation) {
  const text = String(explanation ?? "").trim();
  if (!text) return true;

  if (question?.type !== "journal_entry") {
    return false;
  }

  if (text.length < 35) return true;
  if (VAGUE_EXPLANATION_PATTERNS.some((pattern) => pattern.test(text))) return true;

  const correctSummary = formatJournalEntrySummary(question.answer?.lines ?? []);
  if (correctSummary && normalizeText(text) === normalizeText(correctSummary)) return true;

  return false;
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

  const core = capitalize(decapitalize(answer));
  const contrast = buildContrastClause(lowerQ);

  return [`${frame}${tagClause}: ${core}`, contrast];
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

function resolveExplanationBullets(question) {
  const stored = question?.explanation;

  if (question?.type === "journal_entry") {
    if (stored && !isRedundantExplanation(question) && !isVagueExplanation(question, stored)) {
      const bullets = splitProseToBullets(stored);
      const lines = question.answer?.lines ?? [];
      if (lines.length > 0 && lines.length <= 6) {
        return [
          ...bullets,
          ...lines.map((line) => {
            const side = line.side === "debit" ? "Debit" : "Credit";
            const amount =
              typeof line.amount === "number" ? line.amount.toLocaleString() : line.amount;
            return `${line.account} — ${side} $${amount}`;
          }),
        ];
      }
      return bullets;
    }
    return buildJournalEntryTeachingExplanation(question);
  }

  if (!stored) return [];

  if (!isRedundantExplanation(question) && !isVagueExplanation(question, stored)) {
    return splitProseToBullets(stored);
  }

  return buildTeachingExplanation({
    q: question.q ?? question.prompt ?? "",
    a: getCorrectAnswerText(question) ?? stored,
    tags: question.tags ?? [],
  });
}

export function getDisplayExplanationBullets(question) {
  return resolveExplanationBullets(question);
}

/**
 * Prefer stored explanations when they teach; otherwise enrich answer-only text.
 * Returns bullet-formatted text for contexts that expect a string (e.g. AI tutor).
 */
export function getDisplayExplanation(question) {
  const bullets = getDisplayExplanationBullets(question);
  if (bullets.length === 0) return question?.explanation ?? null;
  return bullets.map((item) => `• ${item}`).join("\n");
}
