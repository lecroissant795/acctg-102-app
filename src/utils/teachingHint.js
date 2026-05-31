import { QUESTION_TYPES } from "../data/schema/questionTypes.js";

function getQuestionText(question) {
  return String(question?.q ?? question?.prompt ?? "").trim();
}

function getPrimaryTag(tags) {
  if (!Array.isArray(tags) || tags.length === 0) return null;
  return tags[0];
}

function extractScenarioHook(questionText) {
  const match = questionText.match(
    /(?:On |In |A |An |The )([^.?!]{12,90}?)(?:\.|,|\?| under | when | which )/i
  );
  if (match?.[1]) {
    return match[1].trim().replace(/\s+/g, " ");
  }
  return questionText.length > 90 ? `${questionText.slice(0, 87)}...` : questionText;
}

function hintFromQuestionPatterns(lowerQ, questionText) {
  if (
    (lowerQ.includes("when ") || lowerQ.includes("which period") || lowerQ.includes("in which period")) &&
    (lowerQ.includes("recognised") || lowerQ.includes("recognized") || lowerQ.includes("reported"))
  ) {
    return "List the key dates in the scenario: when the goods/services were provided or consumed, and when cash moved. Match your choice to the recognition rule for the basis named in the question (earned/incurred vs cash received/paid).";
  }

  if (lowerQ.includes("accrual") && lowerQ.includes("cash")) {
    return "Separate the economic event from the cash flow. Accrual ties revenue/expenses to when they are earned or incurred; cash basis waits for receipts and payments. Which date in the stem matters for the basis being tested?";
  }

  if (lowerQ.includes("cash basis")) {
    return "Under cash basis, only cash receipts and payments trigger recognition. Ignore delivery or usage dates unless cash actually moved in that period.";
  }

  if (lowerQ.includes("adjusting entr")) {
    return "Ask whether something was recorded in the wrong period or not yet recorded at all. Adjusting entries fix timing before statements are prepared—identify whether you need to defer, accrue, or allocate.";
  }

  if (lowerQ.includes("prepaid") || lowerQ.includes("paid in advance") || lowerQ.includes("insurance for")) {
    return "Cash may already be paid, but the benefit belongs to future periods. Think about which portion of the payment relates to the current period only.";
  }

  if (lowerQ.includes("accrued") || lowerQ.includes("incurred but not") || lowerQ.includes("earned but not")) {
    return "The activity happened in this period, but cash has not moved yet (or cash moved earlier). You need to record the revenue or expense now and the related receivable or payable.";
  }

  if (lowerQ.includes("unearned") || lowerQ.includes("received in advance") || lowerQ.includes("deferred revenue")) {
    return "Cash was collected before the performance obligation is satisfied. Part of the liability should be released as revenue when the service is delivered.";
  }

  if (lowerQ.includes("ifrs 15") || lowerQ.includes("aasb 15") || lowerQ.includes("performance obligation")) {
    return "Break the contract into distinct promises to the customer. Revenue is recognised as each promise is satisfied—focus on delivery or service transfer, not billing or cash dates alone.";
  }

  if (lowerQ.includes("closing entr")) {
    return "Closing clears temporary accounts into equity. Ask whether the account is revenue, expense, dividend, or summary—and whether the balance should be zeroed through Income Summary or Retained Earnings.";
  }

  if (lowerQ.includes("trial balance") && lowerQ.includes("adjusted")) {
    return "Compare unadjusted vs adjusted balances: adjusting entries only affect accounts that need period-end alignment. Look for prepayments, accruals, depreciation, and unearned revenue.";
  }

  if (lowerQ.includes("depreciat") || lowerQ.includes("amortis")) {
    return "Spread cost over useful life, not when cash was paid. Check whether the question wants the formula (cost − residual) ÷ life/units, or the statement/account impact.";
  }

  if (lowerQ.includes("impair")) {
    return "Compare carrying amount to recoverable amount. If carrying amount is higher, an impairment loss is needed—trace which statement line decreases.";
  }

  if (lowerQ.includes("bank reconcil")) {
    return "List items on the bank statement but not in the cash book (and vice versa). Timing differences and bank-only charges are the usual reconciling items—not revenue recognition rules.";
  }

  if (lowerQ.includes("bad debt") || lowerQ.includes("allowance") || lowerQ.includes("receivable")) {
    return "Separate recording the sale (revenue + receivable) from estimating uncollectible amounts. Allowance methods adjust expected collectibility without waiting for each default.";
  }

  if (lowerQ.includes("inventory") || lowerQ.includes("cogs") || lowerQ.includes("cost of goods")) {
    return "Track goods flow: purchases add inventory, sales remove it at cost. If quantities or costs differ between systems, identify which method (periodic vs perpetual) the stem assumes.";
  }

  if (
    lowerQ.includes("overstate") ||
    lowerQ.includes("understate") ||
    lowerQ.includes("effect on") ||
    lowerQ.includes("impact on")
  ) {
    return "Walk the error through the accounting equation: if an expense is missed, profit and equity are usually overstated; if revenue is missed, they are understated. Check both profit or loss and the statement of financial position.";
  }

  if (lowerQ.includes("debit") || lowerQ.includes("credit") || lowerQ.includes("normal balance")) {
    return "Recall which category the account belongs to (asset, liability, equity, revenue, expense). Increases follow the normal balance side for that category.";
  }

  if (lowerQ.includes("which of the following") || lowerQ.includes("which statement")) {
    return `Read each option against the exact wording of the question. For "${extractScenarioHook(questionText)}", eliminate choices that describe the wrong timing, wrong statement, or a different concept.`;
  }

  if (lowerQ.includes("calculate") || lowerQ.includes("how much") || /\$\d/.test(questionText)) {
    return "Write down the given numbers and the formula implied by the stem (e.g. cost − residual, units × rate, or percentage × base). Solve step by step before looking at the options.";
  }

  return null;
}

const TAG_HINT_BUILDERS = {
  adjusting_entries: (lowerQ) => {
    if (lowerQ.includes("matching principle") || lowerQ.includes("expense recognition")) {
      return "Expenses should align with the revenues they help generate in the same period—even if cash is paid later.";
    }
    if (lowerQ.includes("time period") || lowerQ.includes("periodicity")) {
      return "Because the business life is divided into artificial periods, you must decide which period owns each revenue and expense.";
    }
    return null;
  },
  debit_credit: () =>
    "Use T-accounts or the accounting equation: increases on the normal side for that account type, decreases on the opposite side.",
  gst: () =>
    "Split the tax-inclusive amount: the GST portion is a liability to the tax authority, not part of revenue.",
  journal_entries: () =>
    "Start with what increased and what decreased economically, then map to account types—without writing full journal lines yet.",
};

/**
 * Build a concrete, question-specific hint without revealing the answer.
 */
export function buildTeachingHint(question) {
  const questionText = getQuestionText(question);
  const lowerQ = questionText.toLowerCase();
  const tags = question.tags ?? [];

  if (question.type === QUESTION_TYPES.JOURNAL_ENTRY) {
    return "List what was received and what was given up in the transaction. Decide which elements of the accounting equation increase or decrease (asset, liability, equity, revenue, expense) before choosing accounts.";
  }

  const patternHint = hintFromQuestionPatterns(lowerQ, questionText);
  if (patternHint) return patternHint;

  for (const tag of tags) {
    const builder = TAG_HINT_BUILDERS[tag];
    const tagHint = builder?.(lowerQ);
    if (tagHint) return tagHint;
  }

  const primaryTag = getPrimaryTag(tags);
  if (primaryTag) {
    const label = primaryTag.replaceAll("_", " ");
    return `This question tests ${label}. Pull the key fact from the stem (dates, amounts, or parties) and decide which accounting rule that fact triggers—then eliminate options that use the wrong period or wrong statement.`;
  }

  return `Focus on the scenario: "${extractScenarioHook(questionText)}". What is the question asking you to classify, time, or measure? Rule out options that do not match that specific requirement.`;
}
