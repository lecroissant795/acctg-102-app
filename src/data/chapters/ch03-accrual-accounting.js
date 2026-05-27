import { ankiMcqs } from "./ch03-anki-mcqs.js";

export const title = "Ch 3: Accrual Accounting Concepts";

const coreMcqs = [
  { q: "Under accrual accounting, revenue is recognised when:", options: ["Cash is received", "A contract is signed", "The performance obligation is satisfied (goods/services delivered)", "An invoice is sent to the customer"], answer: 2, explanation: "Under accrual accounting, revenue is recognised when the performance obligation is satisfied, regardless of when cash is received." },
  { q: "An adjusting entry for accrued expenses involves:", options: ["A debit to an asset and a credit to revenue", "A debit to an expense and a credit to a liability", "A debit to a liability and a credit to cash", "A debit to revenue and a credit to an expense"], answer: 1, explanation: "Accrued expenses are expenses incurred but not yet paid, requiring a debit to the expense and credit to the liability (e.g., wages payable)." },
  { q: "Prepaid expenses are classified as:", options: ["Liabilities", "Equity", "Assets", "Expenses"], answer: 2, explanation: "Prepaid expenses are assets because they represent future economic benefits (services/goods not yet consumed)." },
  { q: "Unearned revenue is:", options: ["Revenue earned but not yet received in cash", "A liability representing cash received before services are delivered", "An asset from future sales", "An expense that has been prepaid"], answer: 1, explanation: "Unearned revenue is a liability because the business has received cash but has not yet delivered the goods or services." },
  { q: "Which principle requires that expenses be matched with the revenues they help generate?", options: ["Revenue recognition principle", "Expense recognition (matching) principle", "Full disclosure principle", "Historical cost principle"], answer: 1, explanation: "The expense recognition (matching) principle states expenses should be recognised in the same period as the revenues they help to generate." },
  { q: "Depreciation is an example of which type of adjusting entry?", options: ["Accrued revenue", "Accrued expense", "Prepaid expense (deferred expense)", "Unearned revenue"], answer: 2, explanation: "Depreciation allocates the cost of a prepaid (deferred) asset over its useful life, similar to how prepaid insurance is expensed over time." },
  { q: "An adjusted trial balance is prepared:", options: ["Before any adjusting entries", "After adjusting entries but before financial statements", "After financial statements are prepared", "Only at the end of the financial year"], answer: 1, explanation: "The adjusted trial balance is prepared after all adjusting entries have been recorded and posted, and before financial statements are prepared." },
  { q: "If a company fails to record accrued revenue at year-end:", options: ["Assets and revenues will both be overstated", "Assets and revenues will both be understated", "Liabilities will be overstated", "Expenses will be overstated"], answer: 1, explanation: "Failing to record accrued revenue understates both the asset (accounts receivable) and revenue for the period." },
];

const practiceQuestions = [
  {
    id: "ch03-select-multi-adjusting-entries",
    type: "select_multiple",
    q: "Which of the following commonly require adjusting entries at period-end?",
    options: ["Accrued wages", "Depreciation", "Share issue for cash", "Prepaid insurance used up", "Unearned revenue now earned"],
    answer: {
      correctIndices: [0, 1, 3, 4],
      scoringMode: "partial",
    },
    explanation: "Adjusting entries are used for accruals, deferrals, and estimates such as accrued wages, depreciation, prepaid expenses, and revenue earned from previously unearned revenue.",
    points: 2,
    tags: ["adjusting_entries"],
  },
  {
    id: "ch03-journal-entry-accrued-wages",
    type: "journal_entry",
    q: "At 30 June, wages of $1,800 have been incurred but not yet paid. Record the adjusting entry.",
    answer: {
      lines: [
        { account: "Wages Expense", side: "debit", amount: 1800 },
        { account: "Wages Payable", side: "credit", amount: 1800 },
      ],
      rules: {
        requireBalancedEntry: true,
      },
    },
    explanation: "An accrued expense is recognised with a debit to the expense and a credit to the liability.",
    points: 2,
    tags: ["adjusting_entries", "debit_credit"],
  },
];

export const questions = [...coreMcqs, ...ankiMcqs, ...practiceQuestions];
