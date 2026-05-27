export const title = "Ch 2: The Recording Process";

export const questions = [
  { q: "A debit entry to an asset account will:", options: ["Decrease the account balance", "Increase the account balance", "Have no effect on the account balance", "Close the account"], answer: 1, explanation: "Assets have a normal debit balance, so a debit increases the balance." },
  { q: "Which of the following accounts has a normal credit balance?", options: ["Cash", "Accounts Receivable", "Revenue", "Equipment"], answer: 2, explanation: "Revenue accounts have a normal credit balance. Credits increase revenue, and debits decrease it." },
  { q: "The purpose of a trial balance is to:", options: ["Prove that all transactions have been recorded correctly", "Prove that the total debits equal total credits", "Prepare financial statements", "Detect all types of errors in the accounting records"], answer: 1, explanation: "A trial balance proves that total debits equal total credits. However, it does not guarantee all transactions are recorded correctly." },
  { q: "When a business purchases supplies on account, the entry is:", options: ["Debit Cash, Credit Supplies", "Debit Supplies, Credit Accounts Payable", "Debit Accounts Payable, Credit Supplies", "Debit Supplies, Credit Revenue"], answer: 1, explanation: "Purchasing on account increases the asset (Supplies — debit) and increases the liability (Accounts Payable — credit)." },
  { q: "A journal entry that involves more than two accounts is called a:", options: ["Simple entry", "Compound entry", "Adjusting entry", "Closing entry"], answer: 1, explanation: "A compound journal entry involves more than two accounts (but debits must still equal credits)." },
  { q: "Which of the following is NOT a step in the recording process?", options: ["Analyse each transaction", "Enter the transaction in a journal", "Transfer journal information to ledger accounts", "Prepare a tax return"], answer: 3, explanation: "The recording process involves analysing transactions, journalising them, and posting to the ledger. Tax returns are separate." },
  { q: "The general ledger contains:", options: ["A chronological record of all transactions", "All accounts used by the business grouped by account type", "Only revenue and expense accounts", "Only balance sheet accounts"], answer: 1, explanation: "The general ledger is the collection of all accounts used by the business, organised by type (assets, liabilities, equity, revenue, expenses)." },
  { q: "If total debits in a trial balance exceed total credits, the error could be:", options: ["A credit was posted as a debit", "An expense was understated", "A liability was overstated", "A revenue amount was posted twice as a credit"], answer: 0, explanation: "If a credit was accidentally posted as a debit, total debits would be overstated and total credits understated." },
  {
    id: "ch02-select-multi-normal-balances",
    type: "select_multiple",
    q: "Select all accounts that normally carry a debit balance.",
    options: ["Cash", "Accounts Payable", "Inventory", "Sales Revenue", "Accounts Receivable"],
    answer: {
      correctIndices: [0, 2, 4],
      scoringMode: "partial",
    },
    explanation: "Assets such as cash, inventory, and accounts receivable normally have debit balances.",
    points: 2,
    tags: ["debit_credit"],
  },
  {
    id: "ch02-numeric-gst-purchase",
    type: "numeric_input",
    q: "A business purchases inventory for $3,300 GST-inclusive. How much GST input tax credit is included?",
    answer: {
      value: 300,
      tolerance: 0.01,
    },
    explanation: "For GST-inclusive amounts, GST is 1/11 of the total. $3,300 ÷ 11 = $300.",
    points: 1,
    tags: ["gst", "inventory_purchases"],
  },
  {
    id: "ch02-journal-entry-credit-sale",
    type: "journal_entry",
    q: "Record a credit sale of $4,400 including GST.",
    answer: {
      lines: [
        { account: "Accounts Receivable", side: "debit", amount: 4400 },
        { account: "Sales Revenue", side: "credit", amount: 4000 },
        { account: "GST Payable", side: "credit", amount: 400 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: {
          "Accounts Receivable": ["Debtors"],
        },
      },
    },
    explanation: "The customer owes the full GST-inclusive amount, while sales revenue is recorded net of GST and the GST liability is credited separately.",
    points: 3,
    tags: ["gst", "debit_credit"],
  },
];
