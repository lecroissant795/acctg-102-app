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

function buildJournalEntryHint(question) {
  const questionText = getQuestionText(question);
  const lowerQ = questionText.toLowerCase();
  const tags = question.tags ?? [];

  if (lowerQ.includes("including gst") || lowerQ.includes("gst-inclusive") || tags.includes("gst")) {
    return "The total collected or paid includes tax. Separate the business portion (sale or purchase) from the tax portion—revenue and inventory are usually recorded net of GST.";
  }

  if (
    lowerQ.includes("adjusting entry") ||
    lowerQ.includes("at period-end") ||
    lowerQ.includes("at year-end") ||
    lowerQ.includes("has expired") ||
    lowerQ.includes("has been earned but not") ||
    lowerQ.includes("incurred but not") ||
    tags.includes("adjusting_entries")
  ) {
    if (lowerQ.includes("prepaid") || lowerQ.includes("paid in advance") || lowerQ.includes("insurance") || lowerQ.includes("rent prepayment")) {
      return "Cash was paid earlier, but only part of the benefit belongs to this period. Work out the expired portion from the dates or months given before moving amounts from asset to expense.";
    }
    if (lowerQ.includes("accrued") || lowerQ.includes("incurred but not") || lowerQ.includes("consumed but not")) {
      return "The cost or revenue belongs to this period even though cash has not moved yet. You need to recognise the expense or revenue now and the related payable or receivable.";
    }
    if (lowerQ.includes("unearned") || lowerQ.includes("received in advance") || lowerQ.includes("earned")) {
      return "Cash may have arrived earlier, but revenue is only recognised as performance happens. Identify how much of the liability should be released this period.";
    }
    if (lowerQ.includes("depreciation") || lowerQ.includes("amortis")) {
      return "Allocate a portion of the asset's cost to this period as an expense. The asset's accumulated cost should increase by the same amount on the contra side.";
    }
    if (lowerQ.includes("supplies") && lowerQ.includes("on hand")) {
      return "Compare the supplies balance before adjustment to what is still on hand. The difference is the amount used this period.";
    }
    return "This is a period-end adjustment: something was recorded in the wrong period or not yet recorded. Decide what belongs in the current period versus what stays on the balance sheet.";
  }

  if (
    lowerQ.includes("perpetual") ||
    (lowerQ.includes("sold") && lowerQ.includes("cost")) ||
    tags.includes("inventory_sales")
  ) {
    return "A perpetual inventory sale usually needs two economic effects: recognise the revenue side, then transfer the cost of goods sold out of inventory at the amount the goods cost the business.";
  }

  if (lowerQ.includes("purchase return") || lowerQ.includes("returned") || lowerQ.includes("sales return")) {
    return "A return reverses part of an earlier purchase or sale. Think about which original asset, liability, revenue, or cost balances need to be reduced.";
  }

  if (lowerQ.includes("allowance") || lowerQ.includes("write off") || lowerQ.includes("write-off") || lowerQ.includes("bad debt")) {
    return "Allowance-method entries adjust expected collectibility without necessarily recording new sales. Decide whether you are estimating uncollectible amounts or removing a specific receivable.";
  }

  if (lowerQ.includes("bank") && (lowerQ.includes("statement") || lowerQ.includes("reconcil") || lowerQ.includes("dishonour"))) {
    return "The bank and the cash book disagree on timing or fees. Identify whether cash, a receivable, or an expense changed from the business's point of view.";
  }

  if (lowerQ.includes("dividend") || tags.includes("equity")) {
    if (lowerQ.includes("declar")) {
      return "Declaration creates an obligation to shareholders and reduces retained earnings—it does not pay cash yet.";
    }
    if (lowerQ.includes("pay") || lowerQ.includes("paying")) {
      return "Payment settles an existing dividend liability and reduces cash.";
    }
    if (lowerQ.includes("share") && (lowerQ.includes("issu") || lowerQ.includes("invest"))) {
      return "New cash from owners increases contributed equity, not revenue from customers.";
    }
    return "Equity transactions change ownership claims, not operating revenue or expense. Identify whether cash, retained earnings, or share capital is affected.";
  }

  if (lowerQ.includes("depreciation") || lowerQ.includes("disposal") || lowerQ.includes("sold for")) {
    return "For disposals, compare carrying amount to proceeds to see whether a gain or loss arises. Remove the asset and its accumulated depreciation, then record cash and any difference.";
  }

  if (lowerQ.includes("note payable") || lowerQ.includes("bond") || lowerQ.includes("loan") || lowerQ.includes("borrow")) {
    if (lowerQ.includes("interest")) {
      return "Separate principal from interest: interest is an expense over time, while principal changes the liability balance when borrowed or repaid.";
    }
    return "Borrowing increases cash and a liability; repayment does the opposite. Principal repayment is not an expense unless interest is also involved.";
  }

  if (lowerQ.includes("credit sale") || lowerQ.includes("on account") || lowerQ.includes("on credit")) {
    return "Goods or services were provided before cash was received. Revenue is earned now, and the customer owes the business until collection.";
  }

  if (lowerQ.includes("collect") || lowerQ.includes("receipt") || lowerQ.includes("paid in cash")) {
    if (lowerQ.includes("customer") || lowerQ.includes("receivable")) {
      return "Collection clears an existing receivable and increases cash—no new revenue is earned if the sale was already recorded.";
    }
    return "Cash changed hands: identify what was received or paid for and which asset, liability, expense, or revenue account moves.";
  }

  if (lowerQ.includes("invest") || lowerQ.includes("share capital") || lowerQ.includes("ordinary shares")) {
    return "Owner contributions increase cash and equity together. This is not revenue—the cash came from shareholders, not customers.";
  }

  if (lowerQ.includes("freight-in") || lowerQ.includes("freight in")) {
    return "Freight-in is part of getting inventory ready for sale, so it increases inventory cost rather than being expensed immediately.";
  }

  if (lowerQ.includes("write down") || lowerQ.includes("net realisable") || lowerQ.includes("nrv")) {
    return "Inventory must not stay above its net realisable value. The write-down reduces inventory and recognises a loss for the difference.";
  }

  if (tags.includes("inventory_purchases") || (lowerQ.includes("purchase") && lowerQ.includes("inventory"))) {
    return "Inventory coming into the business increases an asset. If purchased on credit, a payable also increases; if paid in cash, cash decreases instead.";
  }

  if (tags.includes("receivables")) {
    return "Focus on whether this is recording a new sale, collecting cash, estimating uncollectible accounts, or correcting a receivable balance.";
  }

  return "List what the business received and what it gave up. For each effect, decide whether an asset, liability, equity, revenue, or expense changes—and in which direction—before choosing accounts.";
}

/**
 * Build a concrete, question-specific hint without revealing the answer.
 */
export function buildTeachingHint(question) {
  const questionText = getQuestionText(question);
  const lowerQ = questionText.toLowerCase();
  const tags = question.tags ?? [];

  if (question.type === QUESTION_TYPES.JOURNAL_ENTRY) {
    return buildJournalEntryHint(question);
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
