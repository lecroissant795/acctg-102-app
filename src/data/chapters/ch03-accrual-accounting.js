import { ankiMcqs } from "./ch03-anki-mcqs.js";

export const title = "Ch 3: Accrual Accounting Concepts";

const coreMcqs = [
  {
    q: "Meridian Ltd delivered goods to a client on 25 June on credit. Under accrual accounting, when should revenue be recognised if control passes on delivery?",
    options: [
      "In June, when the performance obligation was satisfied on delivery",
      "In July, when cash is expected to be collected from the client",
      "In June, when the sales invoice is emailed to the client",
      "At year-end only, through a lump-sum adjusting entry",
    ],
    answer: 0,
    explanation: "Under accrual accounting, revenue is recognised when the performance obligation is satisfied (goods delivered/services performed), regardless of when cash is received.",
  },
  {
    q: "At 30 June, wages of $1,800 have been incurred but not yet paid. Which adjusting entry is required?",
    options: [
      "Debit Wages Payable; Credit Wages Expense",
      "Debit Wages Expense; Credit Wages Payable",
      "Debit Cash; Credit Wages Expense",
      "Debit Wages Expense; Credit Prepaid Wages",
    ],
    answer: 1,
    explanation: "Accrued expenses are recognised with a debit to the expense and a credit to the liability (e.g., wages payable).",
  },
  {
    q: "On 1 March, a company pays $3,600 for a 12-month insurance policy. At 30 June, what classification best describes the unused portion still on the books?",
    options: [
      "Insurance expense for the full payment made in March",
      "Unearned revenue because cash was paid in advance",
      "Prepaid insurance, a current asset representing future coverage",
      "Accrued insurance payable owed to the insurer",
    ],
    answer: 2,
    explanation: "Prepaid expenses are assets because they represent future economic benefits (services/goods not yet consumed).",
  },
  {
    q: "A publisher receives $4,800 on 1 January for a 12-month magazine subscription. No issues have been delivered by 31 January. How should the receipt be recorded initially?",
    options: [
      "Subscription revenue of $4,800 in January",
      "Unearned revenue (liability) until issues are delivered",
      "Accounts receivable until the subscriber reads the magazine",
      "Prepaid subscription expense for future printing costs",
    ],
    answer: 1,
    explanation: "Unearned revenue is a liability because the business has received cash but has not yet delivered the goods or services.",
  },
  {
    q: "A retailer pays sales commissions in the month after the related sales occur. Which principle requires the commission expense to be reported in the month of sale?",
    options: [
      "Revenue recognition principle applied to cash receipts",
      "Expense recognition (matching) principle",
      "Historical cost principle for all operating payments",
      "Full disclosure principle for related-party transactions",
    ],
    answer: 1,
    explanation: "The expense recognition (matching) principle states expenses should be recognised in the same period as the revenues they help to generate.",
  },
  {
    q: "Equipment costing $18,000 with accumulated depreciation of $6,750 has been used for another month. Which type of adjusting entry is required?",
    options: [
      "Accrued revenue for services performed on credit",
      "Accrued expense for wages not yet paid",
      "Deferral of prepaid expense as coverage expires",
      "Allocation of asset cost to depreciation expense",
    ],
    answer: 3,
    explanation: "Depreciation allocates the cost of a long-term asset to expense over its useful life, similar to expensing prepaid insurance over time.",
  },
  {
    q: "Adjusting entries for accrued wages and expired prepaid rent have been posted. What is the next major step before drafting the income statement?",
    options: [
      "Prepare the post-closing trial balance for the period",
      "Prepare the adjusted trial balance from updated ledger balances",
      "Close all revenue accounts directly to retained earnings",
      "Journalise only the cash transactions that occurred during the period",
    ],
    answer: 1,
    explanation: "The adjusted trial balance is prepared after all adjusting entries have been recorded and posted, and before financial statements are prepared.",
  },
  {
    q: "At year-end, $950 of services had been performed on credit but were never recorded. If no adjustment is made, which outcome is most likely?",
    options: [
      "Assets and revenues are both overstated; profit is overstated",
      "Assets and revenues are both understated; profit is understated",
      "Liabilities are overstated while revenue remains unchanged",
      "Expenses are overstated and profit is understated",
    ],
    answer: 1,
    explanation: "Failing to record accrued revenue understates both the asset (accounts receivable) and revenue for the period, which typically understates profit.",
  },
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
  {
    id: "ch03-journal-entry-earned-unearned-revenue",
    type: "journal_entry",
    q: "A business has a $2,700 Unearned Revenue balance. By period-end, services worth $1,200 have now been provided. Record the adjusting entry.",
    answer: {
      lines: [
        { account: "Unearned Revenue", side: "debit", amount: 1200 },
        { account: "Service Revenue", side: "credit", amount: 1200 },
      ],
      rules: {
        requireBalancedEntry: true,
      },
    },
    explanation: "As the service is earned, the liability decreases and revenue is recognised.",
    points: 2,
    tags: ["adjusting_entries", "debit_credit"],
  },
  {
    id: "ch03-journal-entry-prepaid-insurance",
    type: "journal_entry",
    q: "A company paid $2,400 for a 12-month insurance policy on 1 April. At 30 June, record the adjusting entry for the expired portion.",
    answer: {
      lines: [
        { account: "Insurance Expense", side: "debit", amount: 600 },
        { account: "Prepaid Insurance", side: "credit", amount: 600 },
      ],
      rules: {
        requireBalancedEntry: true,
      },
    },
    explanation: "Three months of insurance have expired: $2,400 × 3/12 = $600.",
    points: 2,
    tags: ["adjusting_entries", "debit_credit"],
  },
  {
    id: "ch03-journal-entry-accrued-revenue",
    type: "journal_entry",
    q: "At period-end, services worth $1,450 have been provided but not yet billed to the customer. Record the adjusting entry.",
    answer: {
      lines: [
        { account: "Accounts Receivable", side: "debit", amount: 1450 },
        { account: "Service Revenue", side: "credit", amount: 1450 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: {
          "Accounts Receivable": ["Debtors"],
        },
      },
    },
    explanation: "Accrued revenue is recognised when earned, even if billing and collection will happen later.",
    points: 2,
    tags: ["adjusting_entries", "receivables", "debit_credit"],
  },
  {
    id: "ch03-table-adjustment-statement-effects",
    type: "table_classification",
    q: "Classify the primary financial statement effect of each adjustment.",
    columns: ["Increases Asset", "Increases Liability", "Increases Expense", "Increases Revenue"],
    rows: [
      { id: "adj1", text: "Accrued revenue adjustment" },
      { id: "adj2", text: "Accrued wages adjustment" },
      { id: "adj3", text: "Unearned revenue earned adjustment" },
      { id: "adj4", text: "Prepaid insurance expired adjustment" },
    ],
    answer: {
      mapping: {
        adj1: "Increases Asset",
        adj2: "Increases Liability",
        adj3: "Increases Revenue",
        adj4: "Increases Expense",
      },
    },
    explanation: "Each adjustment affects both the statement of financial position and income statement, but the prompt asks for the primary directional effect highlighted by the adjustment.",
    points: 2,
    tags: ["financial_statements", "balance_sheet", "income_statement", "adjusting_entries"],
  },
  {
    id: "ch03-case-adjusted-statements",
    type: "case_set",
    q: "Use the following adjusting-entry information to answer the questions.",
    scenario: "Before adjustment, a business reports Accounts Receivable $9,500, Prepaid Insurance $1,200, Unearned Revenue $2,000, and no Wages Payable. At year-end: (1) accrued revenue of $800 has not been recorded, (2) insurance of $300 has expired, (3) services of $500 have been earned from the unearned revenue balance, and (4) wages of $450 are accrued.",
    subquestions: [
      {
        id: "adj-case-1",
        type: "numeric_input",
        prompt: "What should the adjusted Accounts Receivable balance be?",
        points: 1,
        answer: { value: 10300, tolerance: 0.01 },
      },
      {
        id: "adj-case-2",
        type: "numeric_input",
        prompt: "What should the adjusted Prepaid Insurance balance be?",
        points: 1,
        answer: { value: 900, tolerance: 0.01 },
      },
      {
        id: "adj-case-3",
        type: "numeric_input",
        prompt: "What should the adjusted Unearned Revenue balance be?",
        points: 1,
        answer: { value: 1500, tolerance: 0.01 },
      },
      {
        id: "adj-case-4",
        type: "numeric_input",
        prompt: "What should the Wages Payable balance be after adjustment?",
        points: 1,
        answer: { value: 450, tolerance: 0.01 },
      },
    ],
    explanation: "Adjust the balances for accrued revenue (+$800 AR), expired insurance (-$300 prepaid), earned revenue (-$500 unearned), and accrued wages (+$450 payable).",
    points: 4,
    tags: ["financial_statements", "balance_sheet", "adjusting_entries"],
  },
  {
    id: "ch03-case-multi-step-adjustments-income-balance-sheet",
    type: "case_set",
    q: "Use the following adjustment information to answer the statement questions.",
    scenario: "Before year-end adjustments, a business reports Service Revenue $24,000, Expenses $13,200, Accounts Receivable $6,400, Prepaid Insurance $1,800, Unearned Revenue $2,500, and Wages Payable $0. The following adjustments are required: (1) accrued revenue $900, (2) insurance expired $450, (3) $700 of unearned revenue has now been earned, and (4) accrued wages $600.",
    subquestions: [
      {
        id: "msa-1",
        type: "numeric_input",
        prompt: "What is adjusted Service Revenue?",
        points: 1,
        answer: { value: 25600, tolerance: 0.01 },
      },
      {
        id: "msa-2",
        type: "numeric_input",
        prompt: "What is adjusted total expenses?",
        points: 1,
        answer: { value: 14250, tolerance: 0.01 },
      },
      {
        id: "msa-3",
        type: "numeric_input",
        prompt: "What is adjusted net profit?",
        points: 1,
        answer: { value: 11350, tolerance: 0.01 },
      },
      {
        id: "msa-4",
        type: "numeric_input",
        prompt: "What is the adjusted Unearned Revenue balance?",
        points: 1,
        answer: { value: 1800, tolerance: 0.01 },
      },
      {
        id: "msa-5",
        type: "numeric_input",
        prompt: "What is the adjusted Accounts Receivable balance?",
        points: 1,
        answer: { value: 7300, tolerance: 0.01 },
      },
    ],
    explanation: "Adjusted revenue = $24,000 + $900 + $700 = $25,600. Adjusted expenses = $13,200 + $450 + $600 = $14,250. Profit and statement of financial position balances then follow from those adjustments.",
    points: 5,
    tags: ["financial_statements", "balance_sheet", "income_statement", "adjusting_entries"],
  },
];

export const questions = [...coreMcqs, ...ankiMcqs, ...practiceQuestions];
