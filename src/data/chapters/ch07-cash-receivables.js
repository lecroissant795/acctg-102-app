export const title = "Ch 7: Cash & Receivables";

export const questions = [
  { q: "The allowance method for doubtful debts involves:", options: ["Writing off bad debts only when they are certain", "Estimating uncollectable amounts at period-end and recording an allowance", "Debiting Cash and crediting Bad Debts Expense", "Ignoring uncollectable debts until cash is received"], answer: 1, explanation: "The allowance method estimates uncollectable receivables at period-end and creates a contra-asset (Allowance for Doubtful Debts)." },
  { q: "When a specific account is written off using the allowance method:", options: ["Total assets decrease", "Bad debts expense increases", "The allowance account is debited and accounts receivable is credited", "Net realisable value of receivables changes"], answer: 2, explanation: "Writing off: Dr Allowance for Doubtful Debts, Cr Accounts Receivable. Total assets and net receivables are unchanged." },
  { q: "The accounts receivable turnover ratio measures:", options: ["How quickly inventory is sold", "How many times receivables are collected during the period", "The percentage of bad debts", "Total credit sales for the period"], answer: 1, explanation: "Receivables Turnover = Net Credit Sales ÷ Average Accounts Receivable. It shows how efficiently the company collects from customers." },
  { q: "A bank reconciliation is prepared to:", options: ["Determine the amount of profit for the period", "Explain differences between the bank statement balance and the cash book balance", "Record all sales transactions", "Calculate interest earned on bank deposits"], answer: 1, explanation: "A bank reconciliation identifies and explains timing differences and errors between the bank statement and the company's cash records." },
  { q: "Internal controls over cash receipts should include:", options: ["Allowing one person to handle all cash functions", "Segregation of duties between receiving, recording, and depositing cash", "Depositing cash once a month", "Keeping cash in an unlocked drawer for easy access"], answer: 1, explanation: "Segregation of duties is a key internal control: different people should handle receiving cash, recording it, and making bank deposits." },
  {
    id: "ch07-numeric-allowance-estimate",
    type: "numeric_input",
    q: "Ending accounts receivable is $84,000 and the business estimates 4% will be uncollectable. Calculate the required ending allowance balance.",
    answer: {
      value: 3360,
      tolerance: 0.01,
    },
    explanation: "Required allowance = $84,000 × 4% = $3,360.",
    points: 1,
    tags: ["receivables", "allowance_method"],
  },
  {
    id: "ch07-select-multi-bank-rec",
    type: "select_multiple",
    q: "Which items commonly explain differences between the bank statement balance and the cash book balance?",
    options: ["Outstanding cheques", "Deposits in transit", "Bank service charges", "Share capital issued last year", "A dishonoured customer cheque"],
    answer: {
      correctIndices: [0, 1, 2, 4],
      scoringMode: "partial",
    },
    explanation: "Timing differences and bank-only items such as service charges or dishonoured cheques commonly appear on bank reconciliations. A prior-year share issue does not explain a current bank rec difference by itself.",
    points: 2,
    tags: ["bank_reconciliation"],
  },
  {
    id: "ch07-journal-entry-bad-debt-writeoff",
    type: "journal_entry",
    q: "Write off a specific customer balance of $950 using the allowance method.",
    answer: {
      lines: [
        { account: "Allowance for Doubtful Debts", side: "debit", amount: 950 },
        { account: "Accounts Receivable", side: "credit", amount: 950 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: {
          "Accounts Receivable": ["Debtors"],
        },
      },
    },
    explanation: "Under the allowance method, the write-off reduces the allowance and the receivable. No new bad debts expense is recognised at the write-off date.",
    points: 2,
    tags: ["receivables", "debit_credit"],
  },
  {
    id: "ch07-case-bank-reconciliation",
    type: "case_set",
    q: "Use the bank reconciliation information below to answer the following questions.",
    scenario: "At 31 March, the bank statement shows a balance of $9,860. The cash book shows $9,420. Outstanding cheques total $640. Deposits in transit total $1,080. The bank statement includes a service charge of $20 and a dishonoured customer cheque of $180 not yet recorded in the cash book.",
    subquestions: [
      {
        id: "cs1",
        type: "numeric_input",
        prompt: "What is the adjusted bank balance?",
        points: 1,
        answer: { value: 10300, tolerance: 0.01 },
      },
      {
        id: "cs2",
        type: "numeric_input",
        prompt: "What is the adjusted cash book balance after recording the bank-only items?",
        points: 1,
        answer: { value: 9220, tolerance: 0.01 },
      },
      {
        id: "cs3",
        type: "mcq",
        prompt: "Which item requires a journal entry in the cash book?",
        options: ["Outstanding cheques", "Deposits in transit", "Bank service charge", "Adjusted bank balance"],
        answer: { correctIndex: 2 },
        points: 1,
      },
    ],
    explanation: "Adjusted bank balance = $9,860 + $1,080 − $640 = $10,300. Adjusted cash book balance = $9,420 − $20 − $180 = $9,220. Bank service charges and dishonoured cheques require cash-book entries.",
    points: 3,
    tags: ["bank_reconciliation", "financial_statements"],
  },
];
