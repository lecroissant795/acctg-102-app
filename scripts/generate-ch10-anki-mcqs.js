/**
 * Generates MCQs from Chapter 10 Anki flashcards (Notion).
 * Run: bun scripts/generate-ch10-anki-mcqs.js
 */

const DISTRACTOR_POOLS = {
  equity_components: [
    "Share capital",
    "Retained earnings",
    "Reserves",
    "Treasury shares",
    "Accounts payable",
  ],
  journal_patterns: [
    "Dr Cash / Cr Share Capital",
    "Dr Retained Earnings / Cr Dividends Payable",
    "Dr Dividends Payable / Cr Cash",
    "Dr Retained Earnings / Cr General Reserve",
    "Dr Asset / Cr Share Capital",
    "Dr Treasury Shares / Cr Cash",
    "Dr Asset / Cr Revaluation Surplus",
    "Dr Cash / Cr Revenue",
  ],
  dividend_dates: [
    "Declaration date",
    "Record date",
    "Payment date",
    "Issue date",
  ],
  share_types: [
    "Ordinary shares",
    "Preference shares",
    "Cumulative preference shares",
    "Treasury shares",
  ],
  formulas: [
    "Opening Retained Earnings + Profit − Dividends = Closing Retained Earnings",
    "Profit available to ordinary shareholders ÷ Average ordinary shareholders' equity",
    "Profit available to ordinary shareholders ÷ Weighted average ordinary shares outstanding",
    "Market Price per Share ÷ Earnings per Share",
    "Dividend per Share ÷ Market Price per Share",
    "Dividends ÷ Profit",
    "Assets = Liabilities + Equity",
  ],
  yes_no: ["Yes", "No", "Only on payment date", "Only for preference shares"],
};

/** @type {Array<{ id: string, q: string, a: string, pool?: keyof typeof DISTRACTOR_POOLS, distractors?: string[], tags?: string[] }>} */
const FLASHCARDS = [
  { id: "ch10-anki-01", q: "What is equity?", a: "The residual interest in the assets of an entity after deducting liabilities.", distractors: ["The total amount of cash and receivables", "Amounts owed to suppliers and lenders", "Revenue earned during the period"], tags: ["equity", "balance_sheet"] },
  { id: "ch10-anki-02", q: "What is the basic accounting equation?", a: "Assets = Liabilities + Equity.", pool: "formulas", tags: ["equity", "balance_sheet"] },
  { id: "ch10-anki-03", q: "What does equity represent for a company?", a: "The owners' claim on company assets after all liabilities are paid.", distractors: ["The company's total revenue for the year", "Amounts owed to creditors only", "Cash held in bank accounts"], tags: ["equity", "balance_sheet"] },
  { id: "ch10-anki-04", q: "What are the main components of shareholders' equity?", a: "Share capital, retained earnings, reserves, and sometimes treasury shares or other equity components.", pool: "equity_components", tags: ["equity", "balance_sheet"] },
  { id: "ch10-anki-05", q: "What is share capital?", a: "Amounts contributed by shareholders in exchange for shares.", pool: "equity_components", tags: ["equity"] },
  { id: "ch10-anki-06", q: "What are retained earnings?", a: "Accumulated profits kept in the company rather than distributed as dividends.", pool: "equity_components", tags: ["equity"] },
  { id: "ch10-anki-07", q: "What are reserves?", a: "Separate equity accounts used for specific purposes, such as revaluation surplus or general reserves.", pool: "equity_components", tags: ["equity"] },
  { id: "ch10-anki-08", q: "What is a share?", a: "A unit of ownership in a company.", distractors: ["A loan from a bank", "A dividend payable liability", "An expense of issuing debt"], tags: ["equity"] },
  { id: "ch10-anki-09", q: "What is a shareholder?", a: "A person or entity that owns shares in a company.", distractors: ["A company director who never owns shares", "A creditor with a secured loan", "An employee receiving wages only"], tags: ["equity"] },
  { id: "ch10-anki-10", q: "What is limited liability?", a: "Shareholders are generally liable only up to the amount unpaid on their shares.", distractors: ["Shareholders are personally liable for all company debts", "Directors have unlimited liability for all losses", "Creditors have no claim on company assets"], tags: ["equity"] },
  { id: "ch10-anki-11", q: "Why is limited liability important?", a: "It protects shareholders' personal assets from company debts.", distractors: ["It guarantees dividends each year", "It eliminates the need for share capital", "It allows companies to avoid all liabilities"], tags: ["equity"] },
  { id: "ch10-anki-12", q: "What is a public company?", a: "A company that may offer shares to the public and is usually subject to greater regulation.", distractors: ["A privately held company with no public share offers", "A sole trader with one owner", "A partnership with unlimited liability"], tags: ["equity"] },
  { id: "ch10-anki-13", q: "What is a proprietary company?", a: "A privately held company with restrictions on public fundraising and usually fewer reporting requirements.", distractors: ["A company listed on the ASX", "A government-owned enterprise only", "A cooperative with mandatory 5 members"], tags: ["equity"] },
  { id: "ch10-anki-14", q: "What is the separation of ownership and management?", a: "Shareholders own the company, while directors and managers run it.", distractors: ["Owners and managers must always be the same people", "Directors own all shares automatically", "Shareholders manage daily operations"], tags: ["equity"] },
  { id: "ch10-anki-15", q: "What are ordinary shares?", a: "Basic ownership shares that carry voting rights and residual claims on profits and assets.", pool: "share_types", tags: ["equity"] },
  { id: "ch10-anki-16", q: "What rights do ordinary shareholders usually have?", a: "Voting rights, dividends if declared, and residual claim on assets after liabilities and preference shareholders.", distractors: ["Guaranteed fixed dividends every year", "Priority over all creditors at liquidation", "No claim on remaining assets"], tags: ["equity"] },
  { id: "ch10-anki-17", q: "Are ordinary dividends guaranteed?", a: "No. Dividends are paid only if declared by directors.", pool: "yes_no", tags: ["equity"] },
  { id: "ch10-anki-18", q: "What does residual claim mean?", a: "Ordinary shareholders receive what remains after all debts and prior claims are paid.", distractors: ["Shareholders are paid before all creditors", "Dividends are paid before interest expense", "Ordinary shares have fixed returns"], tags: ["equity"] },
  { id: "ch10-anki-19", q: "What is the journal entry for issuing ordinary shares for cash?", a: "Dr Cash / Cr Share Capital.", pool: "journal_patterns", tags: ["equity", "debit_credit"] },
  { id: "ch10-anki-20", q: "What is the effect of issuing shares on the accounting equation?", a: "Assets increase and equity increases.", distractors: ["Liabilities increase and equity decreases", "Assets decrease and liabilities increase", "Only revenue increases"], tags: ["equity", "balance_sheet"] },
  { id: "ch10-anki-21", q: "What are preference shares?", a: "Shares that have preferential rights over ordinary shares, usually for dividends or asset distribution.", pool: "share_types", tags: ["equity"] },
  { id: "ch10-anki-22", q: "What is a preference dividend?", a: "A dividend paid to preference shareholders before ordinary shareholders receive dividends.", distractors: ["A dividend paid only to ordinary shareholders", "Interest paid on debentures", "A mandatory expense in the income statement"], tags: ["equity"] },
  { id: "ch10-anki-23", q: "Do preference shareholders usually have voting rights?", a: "Often no, or voting rights are limited.", pool: "yes_no", tags: ["equity"] },
  { id: "ch10-anki-24", q: "What does cumulative preference share mean?", a: "Unpaid preference dividends accumulate and must be paid before ordinary dividends.", distractors: ["Preference dividends are never paid if missed", "Ordinary dividends are paid first", "Cumulative shares have no dividend rights"], tags: ["equity"] },
  { id: "ch10-anki-25", q: "What are dividends in arrears?", a: "Unpaid cumulative preference dividends from prior periods.", distractors: ["Cash dividends already paid to ordinary shareholders", "Interest payable on long-term debt", "Declared but unpaid ordinary dividends only"], tags: ["equity"] },
  { id: "ch10-anki-26", q: "Are dividends in arrears recorded as a liability before declaration?", a: "No. They are usually disclosed but not recorded as a liability until declared.", pool: "yes_no", tags: ["equity"] },
  { id: "ch10-anki-27", q: "What is a dividend?", a: "A distribution of company profits to shareholders.", distractors: ["An expense that reduces profit before tax", "Interest paid to debenture holders", "Cash received from issuing shares"], tags: ["equity"] },
  { id: "ch10-anki-28", q: "Who decides whether dividends are paid?", a: "The board of directors.", distractors: ["All shareholders at every meeting automatically", "The ATO", "External auditors only"], tags: ["equity"] },
  { id: "ch10-anki-29", q: "Are dividends an expense?", a: "No. Dividends are distributions of profit and reduce equity.", pool: "yes_no", tags: ["equity", "income_statement"] },
  { id: "ch10-anki-30", q: "What account do dividends reduce?", a: "Retained earnings.", pool: "equity_components", tags: ["equity"] },
  { id: "ch10-anki-31", q: "What is the declaration date?", a: "The date directors formally approve a dividend.", pool: "dividend_dates", tags: ["equity"] },
  { id: "ch10-anki-32", q: "What is the record date?", a: "The date used to determine which shareholders are entitled to the dividend.", pool: "dividend_dates", tags: ["equity"] },
  { id: "ch10-anki-33", q: "What is the payment date?", a: "The date the dividend is paid to shareholders.", pool: "dividend_dates", tags: ["equity"] },
  { id: "ch10-anki-34", q: "What is the journal entry on dividend declaration date?", a: "Dr Retained Earnings / Cr Dividends Payable.", pool: "journal_patterns", tags: ["equity", "debit_credit"] },
  { id: "ch10-anki-35", q: "Is there a journal entry on the record date?", a: "Usually no journal entry.", pool: "yes_no", tags: ["equity", "debit_credit"] },
  { id: "ch10-anki-36", q: "What is the journal entry on dividend payment date?", a: "Dr Dividends Payable / Cr Cash.", pool: "journal_patterns", tags: ["equity", "debit_credit"] },
  { id: "ch10-anki-37", q: "What is a cash dividend?", a: "A dividend paid in cash.", distractors: ["A dividend paid in additional shares", "Interest on a bank loan", "Share capital issued for cash"], tags: ["equity"] },
  { id: "ch10-anki-38", q: "What is a share dividend?", a: "A dividend paid in additional shares instead of cash.", distractors: ["A cash payment to shareholders", "A buy-back of treasury shares", "A transfer to general reserve"], tags: ["equity"] },
  { id: "ch10-anki-39", q: "What increases retained earnings?", a: "Profit.", distractors: ["Dividends declared", "Losses for the period", "Share buy-backs only"], tags: ["equity"] },
  { id: "ch10-anki-40", q: "What decreases retained earnings?", a: "Losses and dividends.", distractors: ["Profit and share issues", "Revaluation surplus only", "Issuing ordinary shares for cash"], tags: ["equity"] },
  { id: "ch10-anki-41", q: "What is the retained earnings formula?", a: "Opening Retained Earnings + Profit − Dividends = Closing Retained Earnings.", pool: "formulas", tags: ["equity"] },
  { id: "ch10-anki-42", q: "What does a debit balance in retained earnings indicate?", a: "Accumulated losses, also called a deficit.", distractors: ["Excess profits available for dividends", "Share capital issued at a premium", "A revaluation surplus"], tags: ["equity"] },
  { id: "ch10-anki-43", q: "Can a company pay dividends if retained earnings are low?", a: "It may be restricted legally or financially, depending on solvency and company law requirements.", distractors: ["Yes, always without restriction", "No, dividends are never allowed if RE is low", "Only preference shareholders can receive dividends"], tags: ["equity"] },
  { id: "ch10-anki-44", q: "Why do companies issue shares?", a: "To raise capital without creating debt obligations.", distractors: ["To record dividends as expense", "To reduce total equity deliberately", "To avoid issuing financial statements"], tags: ["equity"] },
  { id: "ch10-anki-45", q: "What is the journal entry for issuing shares for cash?", a: "Dr Cash / Cr Share Capital.", pool: "journal_patterns", tags: ["equity", "debit_credit"] },
  { id: "ch10-anki-46", q: "What is the journal entry for issuing shares for non-cash assets?", a: "Dr Asset / Cr Share Capital, measured at fair value.", pool: "journal_patterns", tags: ["equity", "debit_credit"] },
  { id: "ch10-anki-47", q: "What are share issue costs?", a: "Costs incurred to issue shares, such as legal, underwriting, or registration fees.", distractors: ["Dividends paid to shareholders", "Depreciation on PPE", "Interest on debentures"], tags: ["equity"] },
  { id: "ch10-anki-48", q: "How are share issue costs usually treated?", a: "Deducted from equity rather than expensed.", distractors: ["Recorded as operating expense", "Added to retained earnings as revenue", "Capitalised as an intangible asset"], tags: ["equity"] },
  { id: "ch10-anki-49", q: "What are treasury shares or reacquired shares?", a: "A company's own shares that have been bought back from shareholders.", pool: "share_types", tags: ["equity"] },
  { id: "ch10-anki-50", q: "Why might a company buy back shares?", a: "To return cash to shareholders, improve ratios, or signal undervaluation.", distractors: ["To increase share capital automatically", "To create a mandatory debt obligation", "To record a gain in profit or loss"], tags: ["equity"] },
  { id: "ch10-anki-51", q: "What is the effect of a share buy-back on equity?", a: "Equity decreases.", distractors: ["Equity increases", "Total assets increase with no equity effect", "Liabilities decrease only"], tags: ["equity"] },
  { id: "ch10-anki-52", q: "What is the journal entry for reacquiring shares for cash?", a: "Dr Treasury Shares / Cr Cash, or reduce Share Capital depending on course treatment.", pool: "journal_patterns", tags: ["equity", "debit_credit"] },
  { id: "ch10-anki-53", q: "Are gains or losses recognised on transactions in a company's own shares?", a: "No. Own-share transactions are equity transactions, not profit or loss transactions.", pool: "yes_no", tags: ["equity", "income_statement"] },
  { id: "ch10-anki-54", q: "What is a reserve in equity?", a: "An amount set aside within equity for a particular purpose.", pool: "equity_components", tags: ["equity"] },
  { id: "ch10-anki-55", q: "What is a revaluation surplus?", a: "An equity reserve arising when non-current assets are revalued upward.", distractors: ["Revenue from selling inventory", "A liability for warranty claims", "Dividends payable to shareholders"], tags: ["equity", "balance_sheet"] },
  { id: "ch10-anki-56", q: "What is a general reserve?", a: "An appropriation of retained earnings for internal purposes.", distractors: ["A liability for bank loans", "GST collected from customers", "Share capital issued at par"], tags: ["equity"] },
  { id: "ch10-anki-57", q: "Does transferring retained earnings to a general reserve change total equity?", a: "No. It only reallocates amounts within equity.", pool: "yes_no", tags: ["equity"] },
  { id: "ch10-anki-58", q: "What is the journal entry to transfer retained earnings to a general reserve?", a: "Dr Retained Earnings / Cr General Reserve.", pool: "journal_patterns", tags: ["equity", "debit_credit"] },
  { id: "ch10-anki-59", q: "What does the statement of changes in equity show?", a: "Movements in each equity account during the period.", distractors: ["Only cash receipts and payments", "Revenue and expenses for the period only", "Assets and liabilities at one date"], tags: ["equity", "financial_statements"] },
  { id: "ch10-anki-60", q: "What items commonly appear in the statement of changes in equity?", a: "Opening balances, profit, dividends, share issues, transfers to reserves, revaluations, and closing balances.", distractors: ["Only share capital and cash", "Inventory purchases and sales only", "Bank reconciliation adjustments"], tags: ["equity", "financial_statements"] },
  { id: "ch10-anki-61", q: "How does profit affect equity?", a: "It increases retained earnings and total equity.", distractors: ["It decreases retained earnings", "It is recorded as a liability", "It has no effect on equity"], tags: ["equity", "financial_statements"] },
  { id: "ch10-anki-62", q: "How do dividends affect equity?", a: "They decrease retained earnings and total equity.", distractors: ["They increase retained earnings", "They are recorded as expenses only", "They increase share capital"], tags: ["equity", "financial_statements"] },
  { id: "ch10-anki-63", q: "How does issuing shares affect equity?", a: "It increases share capital and total equity.", distractors: ["It decreases total equity", "It creates a liability for repayment", "It reduces retained earnings automatically"], tags: ["equity", "financial_statements"] },
  { id: "ch10-anki-64", q: "How does a transfer to general reserve affect total equity?", a: "It has no effect on total equity.", distractors: ["It increases total equity", "It decreases total equity", "It increases liabilities"], tags: ["equity", "financial_statements"] },
  { id: "ch10-anki-65", q: "What does return on ordinary shareholders' equity measure?", a: "Profitability from the ordinary shareholders' perspective.", pool: "formulas", tags: ["equity", "financial_statements"] },
  { id: "ch10-anki-66", q: "What is the return on ordinary shareholders' equity formula?", a: "Profit available to ordinary shareholders ÷ Average ordinary shareholders' equity.", pool: "formulas", tags: ["equity", "financial_statements"] },
  { id: "ch10-anki-67", q: "What is earnings per share (EPS)?", a: "Profit available to ordinary shareholders per ordinary share.", pool: "formulas", tags: ["equity", "income_statement"] },
  { id: "ch10-anki-68", q: "What is the EPS formula?", a: "Profit available to ordinary shareholders ÷ Weighted average ordinary shares outstanding.", pool: "formulas", tags: ["equity", "income_statement"] },
  { id: "ch10-anki-69", q: "Why is EPS useful?", a: "It helps investors assess profit earned per share.", distractors: ["It measures liquidity of current assets", "It replaces the statement of cash flows", "It calculates interest coverage only"], tags: ["equity", "income_statement"] },
  { id: "ch10-anki-70", q: "What is price-earnings ratio?", a: "A market ratio comparing share price to earnings per share.", pool: "formulas", tags: ["equity", "financial_statements"] },
  { id: "ch10-anki-71", q: "What is the PE ratio formula?", a: "Market Price per Share ÷ Earnings per Share.", pool: "formulas", tags: ["equity", "financial_statements"] },
  { id: "ch10-anki-72", q: "What does a high PE ratio suggest?", a: "Investors expect higher future growth, or the share may be overvalued.", distractors: ["The company has no profit", "Dividends exceed earnings always", "The share is definitely undervalued"], tags: ["equity", "financial_statements"] },
  { id: "ch10-anki-73", q: "What is dividend yield?", a: "Dividend per share as a percentage of market price per share.", pool: "formulas", tags: ["equity", "financial_statements"] },
  { id: "ch10-anki-74", q: "What is the dividend yield formula?", a: "Dividend per Share ÷ Market Price per Share.", pool: "formulas", tags: ["equity", "financial_statements"] },
  { id: "ch10-anki-75", q: "What is payout ratio?", a: "The proportion of earnings distributed as dividends.", pool: "formulas", tags: ["equity", "financial_statements"] },
  { id: "ch10-anki-76", q: "What is the payout ratio formula?", a: "Dividends ÷ Profit.", pool: "formulas", tags: ["equity", "financial_statements"] },
  { id: "ch10-anki-77", q: "How is equity financing different from debt financing?", a: "Equity financing raises capital from owners and does not require repayment, while debt financing creates repayment and interest obligations.", distractors: ["Both require fixed interest payments", "Debt never creates financial risk", "Equity always dilutes control with no benefit"], tags: ["equity"] },
  { id: "ch10-anki-78", q: "What is an advantage of equity financing?", a: "No mandatory interest or principal repayments.", distractors: ["Interest is tax deductible", "Ownership is never diluted", "Fixed repayments improve liquidity"], tags: ["equity"] },
  { id: "ch10-anki-79", q: "What is a disadvantage of equity financing?", a: "Existing ownership and control may be diluted.", distractors: ["Mandatory interest payments increase", "Shareholders have unlimited liability", "Equity must always be repaid at maturity"], tags: ["equity"] },
  { id: "ch10-anki-80", q: "What is an advantage of debt financing?", a: "Interest is usually tax deductible and ownership is not diluted.", distractors: ["No repayment is ever required", "Debt eliminates financial risk", "Shareholders lose no control because debt is equity"], tags: ["equity"] },
  { id: "ch10-anki-81", q: "What is a disadvantage of debt financing?", a: "Fixed repayments increase financial risk.", distractors: ["Ownership is always diluted", "Interest is never tax deductible", "Debt cannot be issued at a discount"], tags: ["equity"] },
  { id: "ch10-anki-82", q: "What is the biggest dividend trap?", a: "Treating dividends as an expense instead of an equity distribution.", distractors: ["Recording Dr Retained Earnings / Cr Dividends Payable on declaration", "Paying cash on the payment date", "Disclosing dividends in notes only"], tags: ["error_correction", "equity"] },
  { id: "ch10-anki-83", q: "What is the biggest record date trap?", a: "Recording a journal entry on the record date when usually none is required.", distractors: ["Failing to record declaration entry", "Paying dividend before declaration", "Crediting share capital for dividends"], tags: ["error_correction", "equity"] },
  { id: "ch10-anki-84", q: "What is the biggest retained earnings trap?", a: "Forgetting dividends reduce retained earnings.", distractors: ["Adding dividends to profit when calculating closing RE", "Treating profit as a liability", "Recording share issues as Dr Share Capital / Cr Cash"], tags: ["error_correction", "equity"] },
  { id: "ch10-anki-85", q: "What is the biggest reserve trap?", a: "Thinking transfers between retained earnings and reserves change total equity.", distractors: ["Recording revaluation surplus in profit or loss", "Failing to disclose reserves in notes", "Issuing shares at fair value"], tags: ["error_correction", "equity"] },
  { id: "ch10-anki-86", q: "What is the biggest share issue trap?", a: "Crediting revenue instead of share capital.", distractors: ["Debiting cash when shares are issued", "Measuring non-cash issues at fair value", "Deducting issue costs from equity"], tags: ["error_correction", "equity"] },
  { id: "ch10-anki-87", q: "What is the biggest share buy-back trap?", a: "Recognising gains or losses on transactions involving the company's own shares.", distractors: ["Reducing equity when shares are reacquired", "Debiting treasury shares or share capital", "Paying cash to shareholders via buy-back"], tags: ["error_correction", "equity"] },
  { id: "ch10-anki-88", q: "What is the biggest EPS trap?", a: "Using ending shares instead of weighted average shares outstanding.", distractors: ["Using profit available to ordinary shareholders", "Excluding preference dividends when required", "Calculating EPS from total revenue"], tags: ["error_correction", "equity", "income_statement"] },
  { id: "ch10-anki-89", q: "What is the biggest PE ratio trap?", a: "Confusing EPS with dividends per share.", distractors: ["Using market price in the numerator", "Using zero or negative EPS without caution", "Confusing PE with payout ratio"], tags: ["error_correction", "equity", "financial_statements"] },
  { id: "ch10-anki-90", q: "Formula: Closing retained earnings.", a: "Opening Retained Earnings + Profit − Dividends = Closing Retained Earnings.", pool: "formulas", tags: ["equity"] },
  { id: "ch10-anki-91", q: "Formula: Return on ordinary shareholders' equity.", a: "Profit available to ordinary shareholders ÷ Average ordinary shareholders' equity.", pool: "formulas", tags: ["equity", "financial_statements"] },
  { id: "ch10-anki-92", q: "Formula: Earnings per share.", a: "Profit available to ordinary shareholders ÷ Weighted average ordinary shares outstanding.", pool: "formulas", tags: ["equity", "income_statement"] },
  { id: "ch10-anki-93", q: "Formula: Price-earnings ratio.", a: "Market Price per Share ÷ Earnings per Share.", pool: "formulas", tags: ["equity", "financial_statements"] },
  { id: "ch10-anki-94", q: "Formula: Dividend yield.", a: "Dividend per Share ÷ Market Price per Share.", pool: "formulas", tags: ["equity", "financial_statements"] },
  { id: "ch10-anki-95", q: "Formula: Payout ratio.", a: "Dividends ÷ Profit.", pool: "formulas", tags: ["equity", "financial_statements"] },
  { id: "ch10-anki-96", q: "Journalise issuing ordinary shares for cash.", a: "Dr Cash / Cr Share Capital.", pool: "journal_patterns", tags: ["equity", "debit_credit"] },
  { id: "ch10-anki-97", q: "Journalise declaring a cash dividend.", a: "Dr Retained Earnings / Cr Dividends Payable.", pool: "journal_patterns", tags: ["equity", "debit_credit"] },
  { id: "ch10-anki-98", q: "Journalise paying a cash dividend.", a: "Dr Dividends Payable / Cr Cash.", pool: "journal_patterns", tags: ["equity", "debit_credit"] },
  { id: "ch10-anki-99", q: "Journalise transferring retained earnings to a general reserve.", a: "Dr Retained Earnings / Cr General Reserve.", pool: "journal_patterns", tags: ["equity", "debit_credit"] },
  { id: "ch10-anki-100", q: "Journalise issuing shares for a non-cash asset.", a: "Dr Asset / Cr Share Capital.", pool: "journal_patterns", tags: ["equity", "debit_credit"] },
  { id: "ch10-anki-101", q: "Journalise reacquiring shares for cash.", a: "Dr Treasury Shares or Share Capital / Cr Cash, depending on course treatment.", pool: "journal_patterns", tags: ["equity", "debit_credit"] },
  { id: "ch10-anki-102", q: "Journalise a revaluation surplus.", a: "Dr Asset / Cr Revaluation Surplus.", pool: "journal_patterns", tags: ["equity", "debit_credit", "balance_sheet"] },
];

function pickDistractors(card) {
  if (card.distractors?.length >= 3) {
    return card.distractors.slice(0, 3);
  }

  const pool = card.pool ? DISTRACTOR_POOLS[card.pool] ?? [] : [];
  const normalizedAnswer = card.a.trim().toLowerCase();
  const candidates = pool.filter((option) => option.trim().toLowerCase() !== normalizedAnswer);

  if (candidates.length >= 3) {
    return candidates.slice(0, 3);
  }

  const fallback = [
    ...candidates,
    ...Object.values(DISTRACTOR_POOLS)
      .flat()
      .filter((option) => option.trim().toLowerCase() !== normalizedAnswer),
  ];

  const unique = [];
  for (const option of fallback) {
    const key = option.trim().toLowerCase();
    if (key === normalizedAnswer) continue;
    if (unique.some((existing) => existing.trim().toLowerCase() === key)) continue;
    unique.push(option);
    if (unique.length === 3) break;
  }

  while (unique.length < 3) {
    unique.push(`None of the above (variant ${unique.length + 1})`);
  }

  return unique.slice(0, 3);
}

function toMcq(card) {
  const distractors = pickDistractors(card);
  const options = [card.a, ...distractors];
  return {
    id: card.id,
    q: card.q,
    options,
    answer: 0,
    explanation: card.a,
    tags: card.tags ?? ["equity"],
  };
}

const mcqs = FLASHCARDS.map(toMcq);

const output = `// Auto-generated from Notion Anki Flashcards — Chapter 10
// Regenerate: bun scripts/generate-ch10-anki-mcqs.js

export const ankiMcqs = ${JSON.stringify(mcqs, null, 2)};
`;

await Bun.write(new URL("../src/data/chapters/ch10-anki-mcqs.js", import.meta.url), output);

console.log(`Generated ${mcqs.length} MCQs → src/data/chapters/ch10-anki-mcqs.js`);
