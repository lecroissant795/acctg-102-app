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

const GENERIC_EXPLANATION_PATTERNS = [
  /the other options are related ideas or common mistakes/i,
  /distractors often describe/i,
  /wrong options usually/i,
  /do not meet the specific requirement in the question stem/i,
  /^the concept being tested/i,
  /^timing is the key idea/i,
  /^apply the relevant accounting rule/i,
  /^the calculation rests on/i,
];

export function isGenericExplanation(explanation) {
  const text = String(explanation ?? "").trim();
  if (!text) return false;
  return GENERIC_EXPLANATION_PATTERNS.some((pattern) => pattern.test(text));
}

function shortOptionText(option, maxLength = 72) {
  const text = stripTrailingPeriod(option);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

function extractScenarioClause(questionText) {
  const trimmed = String(questionText ?? "").trim();
  const withoutPrompt = trimmed.replace(/^(which of the following|what is|which statement|when should|under .+?,)\s+/i, "");
  const firstSentence = withoutPrompt.split(/(?<=[.!?])\s+/)[0] ?? withoutPrompt;
  if (firstSentence.length <= 140) return firstSentence;
  return `${firstSentence.slice(0, 137)}...`;
}

function inferQuestionFocus(lowerQ) {
  if (lowerQ.includes("which basis")) return "which accounting basis applies to the facts";
  if (lowerQ.includes("when ") && (lowerQ.includes("recognised") || lowerQ.includes("recognized") || lowerQ.includes("reported"))) {
    return "when recognition should occur under the named basis";
  }
  if (lowerQ.includes("adjusting entr")) return "which adjusting entry is required";
  if (lowerQ.includes("closing entr")) return "which closing entry is appropriate";
  if (lowerQ.includes("ifrs 15") || lowerQ.includes("aasb 15") || lowerQ.includes("performance obligation")) {
    return "how IFRS 15 applies to this contract";
  }
  if (lowerQ.includes("depreciat") || lowerQ.includes("amortis")) return "how depreciation or amortisation applies";
  if (lowerQ.includes("bank reconcil")) return "what belongs on a bank reconciliation";
  if (lowerQ.includes("bad debt") || lowerQ.includes("allowance")) return "how uncollectible receivables are accounted for";
  if (lowerQ.includes("overstate") || lowerQ.includes("understate") || lowerQ.includes("effect on")) {
    return "the financial statement impact of the error";
  }
  if (lowerQ.includes("calculate") || lowerQ.includes("how much") || /\$\d/.test(lowerQ)) return "the required calculation";
  return "the specific requirement in the question";
}

function buildWhyCorrectSentence(questionText, correctText, lowerQ) {
  const correct = stripTrailingPeriod(correctText);
  const scenario = extractScenarioClause(questionText);

  if (lowerQ.includes("what issue") || lowerQ.includes("primarily address")) {
    return `${scenario} The issue is ${decapitalize(correct)}.`;
  }

  if (lowerQ.includes("which basis")) {
    return `${scenario} That pattern matches ${decapitalize(correct)}.`;
  }

  if (
    lowerQ.includes("when ") &&
    (lowerQ.includes("recognised") || lowerQ.includes("recognized") || lowerQ.includes("reported"))
  ) {
    const basis = lowerQ.includes("cash basis")
      ? "cash basis accounting"
      : lowerQ.includes("accrual")
        ? "accrual accounting"
        : "the applicable recognition rule";
    return `Under ${basis}, ${decapitalize(correct)}. The dates in the scenario show why that period is the right recognition point.`;
  }

  if (lowerQ.includes("which statement") || lowerQ.includes("best distinguishes") || lowerQ.includes("best describes")) {
    return `${capitalize(decapitalize(correct))}. That is what the question is asking you to identify.`;
  }

  if (lowerQ.includes("calculate") || lowerQ.includes("how much") || /\$\d/.test(questionText)) {
    return `Using the figures in the question, ${decapitalize(correct)}`;
  }

  if (lowerQ.includes("which of the following")) {
    return `${scenario} ${capitalize(decapitalize(correct))}`;
  }

  return `${scenario} ${capitalize(decapitalize(correct))}`;
}

function scoreWrongOption(option, correctText, lowerQ) {
  const lowerOption = option.toLowerCase();
  const lowerCorrect = correctText.toLowerCase();
  let score = 0;

  if (lowerQ.includes("accrual") && /cash (is )?(received|collected|paid)/i.test(lowerOption)) score += 4;
  if (lowerQ.includes("cash basis") && /(deliver|control|earned|incurred|june|supplies|consumed)/i.test(lowerOption)) score += 4;
  if (lowerQ.includes("when ") && /(january|february|june|july|august|period)/i.test(lowerOption)) score += 3;
  if (/cash basis/i.test(lowerOption) && lowerQ.includes("accrual")) score += 3;
  if (/accrual/i.test(lowerOption) && lowerQ.includes("cash basis")) score += 3;
  if (/invoice|contract signing|evenly/i.test(lowerOption)) score += 2;
  if (lowerOption.split(" ").filter((word) => lowerCorrect.includes(word)).length >= 2) score += 1;

  return score;
}

function explainWrongOption(option, context) {
  const lowerOption = option.toLowerCase();
  const { lowerQ, correctText } = context;

  if (lowerQ.includes("accrual") && /cash (is )?(received|collected|paid)/i.test(lowerOption)) {
    return `"${shortOptionText(option)}" uses cash-basis timing, but the question asks what happens under accrual accounting.`;
  }

  if (lowerQ.includes("cash basis") && /(deliver|control|passes|consumed|incurred|earned)/i.test(lowerOption)) {
    return `"${shortOptionText(option)}" follows when the activity occurred, which is accrual thinking—not cash basis.`;
  }

  if (/cash basis/i.test(lowerOption) && (lowerQ.includes("accrual") || lowerQ.includes("earned") || lowerQ.includes("incurred"))) {
    return `"${shortOptionText(option)}" describes cash-basis recognition, which conflicts with the accrual requirement in the stem.`;
  }

  if (/accrual basis/i.test(lowerOption) && lowerQ.includes("cash basis")) {
    return `"${shortOptionText(option)}" is accrual recognition, but the facts show recognition only when cash moved.`;
  }

  if (/invoice/i.test(lowerOption) && (lowerQ.includes("deliver") || lowerQ.includes("control"))) {
    return `"${shortOptionText(option)}" treats billing as the trigger, but revenue was already earned when control passed on delivery.`;
  }

  if (/contract signing|contract is signed/i.test(lowerOption)) {
    return `"${shortOptionText(option)}" recognises too early—signing alone does not satisfy the performance obligation in this scenario.`;
  }

  if (/evenly over|spread over/i.test(lowerOption)) {
    return `"${shortOptionText(option)}" spreads recognition across months without a matching basis; recognition follows a specific event or pattern, not expected cash timing alone.`;
  }

  if (/fair value|market price/i.test(lowerOption)) {
    return `"${shortOptionText(option)}" raises a measurement issue, not the period-matching or recognition issue described in the question.`;
  }

  if (/trial balance/i.test(lowerOption)) {
    return `"${shortOptionText(option)}" refers to a working schedule, not the underlying accounting concept the stem is testing.`;
  }

  if (/only.*cash balance|only when cash/i.test(lowerOption)) {
    return `"${shortOptionText(option)}" limits reporting to cash movements, which does not address the accrual period-matching problem here.`;
  }

  if (/large entities|small entities/i.test(lowerOption)) {
    return `"${shortOptionText(option)}" makes a blanket rule about entity size, but the stem turns on the transaction facts given.`;
  }

  if (/tax basis|ato/i.test(lowerOption)) {
    return `"${shortOptionText(option)}" mixes in tax reporting rules rather than the financial reporting treatment asked for.`;
  }

  if (lowerQ.includes("adjusting") && /(cash receipt|cash payment)/i.test(lowerOption) && !/prepaid|unearned|accrued/i.test(lowerOption)) {
    return `"${shortOptionText(option)}" records only the cash movement and skips the period-end adjustment needed here.`;
  }

  if (lowerQ.includes("depreciat") && /(full cost|immediately|purchase price only)/i.test(lowerOption)) {
    return `"${shortOptionText(option)}" expenses the asset too quickly instead of allocating cost over useful life.`;
  }

  if (lowerQ.includes("overstate") || lowerQ.includes("understate")) {
    return `"${shortOptionText(option)}" misstates the direction or location of the error relative to what the omitted or duplicated entry would cause.`;
  }

  if (normalizeText(option) === normalizeText(correctText)) {
    return null;
  }

  const focus = inferQuestionFocus(lowerQ);
  return `"${shortOptionText(option)}" does not answer ${focus}.`;
}

function buildWrongOptionExplanations(options, answerIndex, correctText, lowerQ, questionText) {
  if (!Array.isArray(options) || options.length === 0 || answerIndex == null) return [];

  const context = { lowerQ, correctText, questionText };
  const wrongOptions = options
    .map((option, index) => ({ option, index }))
    .filter(({ index }) => index !== answerIndex)
    .sort((left, right) => scoreWrongOption(right.option, correctText, lowerQ) - scoreWrongOption(left.option, correctText, lowerQ));

  const explanations = [];
  const seen = new Set();

  for (const { option } of wrongOptions) {
    const explanation = explainWrongOption(option, context);
    if (!explanation || seen.has(explanation)) continue;
    seen.add(explanation);
    explanations.push(explanation);
    if (explanations.length >= 2) break;
  }

  return explanations;
}

/**
 * Build question-specific teaching bullets from the stem, correct answer, and options.
 */
export function buildTeachingExplanation({ q, a, tags = [], options = [], answer = null }) {
  const questionText = String(q ?? "").trim();
  const correctText = stripTrailingPeriod(a);
  const lowerQ = questionText.toLowerCase();
  const answerIndex =
    typeof answer === "number"
      ? answer
      : Array.isArray(options) && options.length > 0
        ? options.findIndex((option) => normalizeText(option) === normalizeText(correctText))
        : -1;

  const bullets = [buildWhyCorrectSentence(questionText, correctText, lowerQ)];
  bullets.push(
    ...buildWrongOptionExplanations(
      options,
      answerIndex >= 0 ? answerIndex : null,
      correctText,
      lowerQ,
      questionText
    )
  );

  return bullets.filter(Boolean).map((bullet) => {
    const trimmed = String(bullet).trim();
    return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
  });
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

function storedExplanationNeedsEnrichment(question, stored) {
  if (!stored) return true;
  if (Array.isArray(stored)) {
    return stored.length === 0 || stored.some((item) => isGenericExplanation(item));
  }
  return isRedundantExplanation(question) || isGenericExplanation(stored) || isVagueExplanation(question, stored);
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

  if (Array.isArray(stored) && stored.length > 0 && !storedExplanationNeedsEnrichment(question, stored)) {
    return stored.map((item) => String(item).trim()).filter(Boolean);
  }

  if (!stored) return buildMcqTeachingExplanation(question);

  if (!storedExplanationNeedsEnrichment(question, stored)) {
    return splitProseToBullets(stored);
  }

  return buildMcqTeachingExplanation(question);
}

function buildMcqTeachingExplanation(question) {
  const answerIndex =
    typeof question.answer === "number"
      ? question.answer
      : typeof question.answer?.correctIndex === "number"
        ? question.answer.correctIndex
        : null;

  return buildTeachingExplanation({
    q: question.q ?? question.prompt ?? "",
    a: getCorrectAnswerText(question) ?? "",
    tags: question.tags ?? [],
    options: question.options ?? [],
    answer: answerIndex,
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
