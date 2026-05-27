import { ankiMcqs } from "./ch07-anki-mcqs.js";

export const title = "Ch 7: Cash & Receivables";

const coreMcqs = [
  { q: "The allowance method for doubtful debts involves:", options: ["Writing off bad debts only when they are certain", "Estimating uncollectable amounts at period-end and recording an allowance", "Debiting Cash and crediting Bad Debts Expense", "Ignoring uncollectable debts until cash is received"], answer: 1, explanation: "The allowance method estimates uncollectable receivables at period-end and creates a contra-asset (Allowance for Doubtful Debts)." },
  { q: "When a specific account is written off using the allowance method:", options: ["Total assets decrease", "Bad debts expense increases", "The allowance account is debited and accounts receivable is credited", "Net realisable value of receivables changes"], answer: 2, explanation: "Writing off: Dr Allowance for Doubtful Debts, Cr Accounts Receivable. Total assets and net receivables are unchanged." },
  { q: "The accounts receivable turnover ratio measures:", options: ["How quickly inventory is sold", "How many times receivables are collected during the period", "The percentage of bad debts", "Total credit sales for the period"], answer: 1, explanation: "Receivables Turnover = Net Credit Sales ÷ Average Accounts Receivable. It shows how efficiently the company collects from customers." },
  { q: "A bank reconciliation is prepared to:", options: ["Determine the amount of profit for the period", "Explain differences between the bank statement balance and the cash book balance", "Record all sales transactions", "Calculate interest earned on bank deposits"], answer: 1, explanation: "A bank reconciliation identifies and explains timing differences and errors between the bank statement and the company's cash records." },
  { q: "Internal controls over cash receipts should include:", options: ["Allowing one person to handle all cash functions", "Segregation of duties between receiving, recording, and depositing cash", "Depositing cash once a month", "Keeping cash in an unlocked drawer for easy access"], answer: 1, explanation: "Segregation of duties is a key internal control: different people should handle receiving cash, recording it, and making bank deposits." },
];

const practiceQuestions = [
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
    id: "ch07-numeric-ageing-allowance-total",
    type: "numeric_input",
    q: "Using an ageing schedule, receivables are estimated as follows: Current $50,000 at 2%, 1-30 days overdue $12,000 at 8%, and over 30 days overdue $6,000 at 25%. Calculate the required ending allowance balance.",
    answer: {
      value: 3460,
      tolerance: 0.01,
    },
    explanation: "Required allowance = ($50,000 × 2%) + ($12,000 × 8%) + ($6,000 × 25%) = $1,000 + $960 + $1,500 = $3,460.",
    points: 1,
    tags: ["receivables", "allowance_method"],
  },
  {
    id: "ch07-numeric-ageing-adjustment-amount",
    type: "numeric_input",
    q: "An ageing analysis shows a required ending Allowance for Doubtful Debts balance of $4,200 credit. The current allowance balance before adjustment is $900 credit. How much bad debts expense adjustment is required?",
    answer: {
      value: 3300,
      tolerance: 0.01,
    },
    explanation: "The allowance must be increased from $900 credit to $4,200 credit, so the adjustment required is $3,300.",
    points: 1,
    tags: ["receivables", "allowance_method"],
  },
  {
    id: "ch07-numeric-ageing-debit-balance-adjustment",
    type: "numeric_input",
    q: "An ageing analysis shows a required ending Allowance for Doubtful Debts balance of $3,600 credit. Before adjustment, the allowance account has a $400 debit balance. Calculate the bad debts expense adjustment required.",
    answer: {
      value: 4000,
      tolerance: 0.01,
    },
    explanation: "A $400 debit balance must first be eliminated, then the allowance increased to a $3,600 credit balance. Total adjustment = $4,000.",
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
    id: "ch07-journal-entry-allowance-adjustment",
    type: "journal_entry",
    q: "At year-end, the Allowance for Doubtful Debts has a $400 credit balance. The required ending balance is $1,250 credit. Record the adjusting entry.",
    answer: {
      lines: [
        { account: "Bad Debts Expense", side: "debit", amount: 850 },
        { account: "Allowance for Doubtful Debts", side: "credit", amount: 850 },
      ],
      rules: {
        requireBalancedEntry: true,
      },
    },
    explanation: "The allowance must be increased from $400 credit to $1,250 credit, requiring an additional $850 credit.",
    points: 2,
    tags: ["receivables", "allowance_method", "debit_credit"],
  },
  {
    id: "ch07-journal-entry-bank-service-charge",
    type: "journal_entry",
    q: "The bank statement shows a service charge of $35 not yet recorded in the cash book. Record the entry.",
    answer: {
      lines: [
        { account: "Bank Charges Expense", side: "debit", amount: 35 },
        { account: "Cash", side: "credit", amount: 35 },
      ],
      rules: {
        requireBalancedEntry: true,
      },
    },
    explanation: "Bank service charges reduce cash and are recognised as an expense when identified on the bank statement.",
    points: 2,
    tags: ["bank_reconciliation", "debit_credit"],
  },
  {
    id: "ch07-journal-entry-dishonoured-cheque",
    type: "journal_entry",
    q: "A customer's cheque for $420 is returned by the bank marked dishonoured. Record the cash-book adjustment.",
    answer: {
      lines: [
        { account: "Accounts Receivable", side: "debit", amount: 420 },
        { account: "Cash", side: "credit", amount: 420 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: {
          "Accounts Receivable": ["Debtors"],
        },
      },
    },
    explanation: "A dishonoured cheque reverses the earlier receipt of cash and reinstates the customer's receivable.",
    points: 2,
    tags: ["bank_reconciliation", "receivables", "debit_credit"],
  },
  {
    id: "ch07-journal-entry-recovery-written-off-account",
    type: "journal_entry",
    q: "A $700 account previously written off is recovered in cash under the allowance method. Record the recovery using two entries.",
    answer: {
      lines: [
        { account: "Accounts Receivable", side: "debit", amount: 700 },
        { account: "Allowance for Doubtful Debts", side: "credit", amount: 700 },
        { account: "Cash", side: "debit", amount: 700 },
        { account: "Accounts Receivable", side: "credit", amount: 700 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: {
          "Accounts Receivable": ["Debtors"],
        },
      },
    },
    explanation: "First reinstate the receivable, then record collection of the cash. Under the allowance method, bad debts expense is not recognised on recovery.",
    points: 4,
    tags: ["receivables", "allowance_method", "debit_credit"],
  },
  {
    id: "ch07-journal-entry-credit-card-sale",
    type: "journal_entry",
    q: "A business makes a credit card sale for $1,650 including GST. The credit card company charges a 3% service fee and remits the balance immediately. Record the entry.",
    answer: {
      lines: [
        { account: "Cash", side: "debit", amount: 1600.5 },
        { account: "Credit Card Service Charge Expense", side: "debit", amount: 49.5 },
        { account: "Sales Revenue", side: "credit", amount: 1500 },
        { account: "GST Payable", side: "credit", amount: 150 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: {
          "Credit Card Service Charge Expense": ["Service Charge Expense", "Bank Charges Expense"],
        },
      },
    },
    explanation: "The business recognises the full GST-inclusive sale, records the merchant fee as an expense, and debits cash for the net remittance received.",
    points: 4,
    tags: ["receivables", "gst", "debit_credit"],
  },
  {
    id: "ch07-journal-entry-factoring-receivables",
    type: "journal_entry",
    q: "Accounts receivable of $8,000 are sold to a factor without recourse. The factor charges a 5% fee and remits the balance in cash immediately. Record the entry.",
    answer: {
      lines: [
        { account: "Cash", side: "debit", amount: 7600 },
        { account: "Loss on Sale of Accounts Receivable", side: "debit", amount: 400 },
        { account: "Accounts Receivable", side: "credit", amount: 8000 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: {
          "Accounts Receivable": ["Debtors"],
          "Loss on Sale of Accounts Receivable": ["Factoring Expense", "Service Charge Expense"],
        },
      },
    },
    explanation: "Without recourse, the receivables are removed from the books, cash is recognised for the proceeds, and the factor's fee is recognised as a loss/expense.",
    points: 3,
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
  {
    id: "ch07-case-bank-reconciliation-deposits-cheques",
    type: "case_set",
    q: "Use the following bank reconciliation information to answer the questions.",
    scenario: "At 30 April, the bank statement shows a balance of $14,250. The cash book shows $13,910. Deposits in transit total $1,340 and unpresented cheques total $980. No bank-only errors exist.",
    subquestions: [
      {
        id: "cs1",
        type: "numeric_input",
        prompt: "What is the adjusted bank balance?",
        points: 1,
        answer: { value: 14610, tolerance: 0.01 },
      },
      {
        id: "cs2",
        type: "mcq",
        prompt: "Do deposits in transit require an adjusting journal entry in the cash book?",
        options: ["Yes", "No"],
        answer: { correctIndex: 1 },
        points: 1,
      },
      {
        id: "cs3",
        type: "mcq",
        prompt: "Do unpresented cheques require an adjusting journal entry in the cash book?",
        options: ["Yes", "No"],
        answer: { correctIndex: 1 },
        points: 1,
      },
    ],
    explanation: "Adjusted bank balance = $14,250 + $1,340 − $980 = $14,610. Deposits in transit and unpresented cheques are timing differences only, so they do not require cash-book journal entries.",
    points: 3,
    tags: ["bank_reconciliation"],
  },
  {
    id: "ch07-case-bank-reconciliation-adjustments",
    type: "case_set",
    q: "Use the bank statement and cash book information below to answer the following questions.",
    scenario: "At 31 May, the bank statement shows a balance of $7,880. The cash book shows $8,460. Outstanding deposits total $520 and unpresented cheques total $760. The bank statement also shows bank charges of $30 and a dishonoured cheque of $210 not yet recorded in the cash book.",
    subquestions: [
      {
        id: "cs1",
        type: "numeric_input",
        prompt: "What is the adjusted bank balance?",
        points: 1,
        answer: { value: 7640, tolerance: 0.01 },
      },
      {
        id: "cs2",
        type: "numeric_input",
        prompt: "What is the adjusted cash book balance after recording bank charges and the dishonoured cheque?",
        points: 1,
        answer: { value: 8220, tolerance: 0.01 },
      },
      {
        id: "cs3",
        type: "select_multiple",
        prompt: "Which bank statement items require adjusting journal entries in the cash book?",
        options: ["Outstanding deposits", "Unpresented cheques", "Bank charges", "Dishonoured cheque"],
        answer: {
          correctIndices: [2, 3],
          scoringMode: "partial",
        },
        points: 2,
      },
    ],
    explanation: "Adjusted bank balance = $7,880 + $520 − $760 = $7,640. Adjusted cash book balance = $8,460 − $30 − $210 = $8,220. Only bank charges and the dishonoured cheque require cash-book entries.",
    points: 4,
    tags: ["bank_reconciliation"],
  },
];

export const questions = [...coreMcqs, ...ankiMcqs, ...practiceQuestions];
