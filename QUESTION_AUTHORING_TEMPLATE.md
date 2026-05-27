# Question Authoring Template

Use this when converting guided self-study PDFs into app questions.

## Workflow

1. Copy the problem text from the `Problems` PDF.
2. Copy the matching worked answer from the `Solutions` PDF.
3. Choose the best `type`.
4. Fill one of the templates below.
5. Paste the finished object into the relevant chapter file in `src/data/chapters/`.

## Type Picker

- Use `written` for explain, discuss, comment, justify.
- Use `numeric_input` for calculate one number.
- Use `journal_entry` for record the entry.
- Use `table_classification` for classify items into sections.
- Use `matching` for term-to-definition or item-to-category pairs.
- Use `ordering` for process steps or sequence questions.
- Use `select_multiple` for "select all that apply".
- Use `case_set` for one scenario with multiple dependent parts.

## Authoring Rules

- Keep one core skill per question unless it is a `case_set`.
- Use stable `id` values like `ch01-gss-01`.
- Keep `q` short when possible.
- Put long shared facts into `scenario` for `case_set`.
- Keep `explanation` concise and exam-focused.
- Add `tags` for topic targeting later.
- For money values, use numbers not strings in `answer`.

## Templates

### `written`

```js
{
  id: "ch01-gss-01",
  type: "written",
  q: "Explain why the accounting entity concept matters when preparing financial statements.",
  sampleAnswer: "The accounting entity concept requires the business to be treated separately from its owners...",
  explanation: "Focus on separating owner transactions from business transactions.",
  points: 2,
  tags: ["financial_statements"],
}
```

### `numeric_input`

```js
{
  id: "ch01-gss-02",
  type: "numeric_input",
  q: "Calculate the current ratio if current assets are $84,000 and current liabilities are $42,000.",
  answer: {
    value: 2,
    tolerance: 0.01,
  },
  explanation: "Current ratio = current assets ÷ current liabilities = 2.0.",
  points: 1,
  tags: ["balance_sheet", "financial_statements"],
}
```

### `journal_entry`

```js
{
  id: "ch02-gss-03",
  type: "journal_entry",
  q: "Record the credit purchase of inventory for $5,500 including GST.",
  answer: {
    lines: [
      { account: "Inventory", side: "debit", amount: 5000 },
      { account: "GST Receivable", side: "debit", amount: 500 },
      { account: "Accounts Payable", side: "credit", amount: 5500 },
    ],
    rules: {
      requireBalancedEntry: true,
    },
  },
  explanation: "Inventory is recorded net of GST, with GST receivable separated.",
  points: 3,
  tags: ["inventory_purchases", "gst", "debit_credit"],
}
```

### `table_classification`

```js
{
  id: "ch01-gss-04",
  type: "table_classification",
  q: "Classify each item into the correct statement of financial position section.",
  columns: ["Current Asset", "Non-current Asset", "Current Liability", "Equity"],
  rows: [
    { id: "r1", text: "Accounts Receivable" },
    { id: "r2", text: "Equipment" },
    { id: "r3", text: "Accounts Payable" },
    { id: "r4", text: "Share Capital" },
  ],
  answer: {
    mapping: {
      r1: "Current Asset",
      r2: "Non-current Asset",
      r3: "Current Liability",
      r4: "Equity",
    },
  },
  explanation: "Each item is classified by where it is reported in the statement of financial position.",
  points: 2,
  tags: ["balance_sheet", "financial_statements"],
}
```

### `matching`

```js
{
  id: "ch01-gss-05",
  type: "matching",
  q: "Match each item to the financial statement where it is commonly reported.",
  leftItems: [
    { id: "l1", text: "Inventory" },
    { id: "l2", text: "Sales Revenue" },
    { id: "l3", text: "Dividends Paid" },
  ],
  rightItems: [
    { id: "r1", text: "Statement of Financial Position" },
    { id: "r2", text: "Income Statement" },
    { id: "r3", text: "Statement of Cash Flows" },
  ],
  answer: {
    pairs: {
      l1: "r1",
      l2: "r2",
      l3: "r3",
    },
  },
  explanation: "Match each item to its usual reporting location.",
  points: 2,
  tags: ["financial_statements"],
}
```

### `ordering`

```js
{
  id: "ch01-gss-06",
  type: "ordering",
  q: "Put the accounting cycle steps in order.",
  items: [
    { id: "s3", text: "Prepare adjusted trial balance" },
    { id: "s1", text: "Journalise transactions" },
    { id: "s4", text: "Prepare financial statements" },
    { id: "s2", text: "Post to ledger" },
  ],
  answer: {
    correctOrder: ["s1", "s2", "s3", "s4"],
  },
  explanation: "Transactions are journalised, posted, adjusted, then reported.",
  points: 2,
  tags: ["financial_statements"],
}
```

### `select_multiple`

```js
{
  id: "ch03-gss-07",
  type: "select_multiple",
  q: "Which of the following commonly require adjusting entries at period-end?",
  options: [
    "Accrued wages",
    "Depreciation",
    "Share issue for cash",
    "Prepaid insurance used up",
  ],
  answer: {
    correctIndices: [0, 1, 3],
    scoringMode: "partial",
  },
  explanation: "Accruals, deferrals, and estimates usually require adjustments.",
  points: 2,
  tags: ["adjusting_entries"],
}
```

### `case_set`

```js
{
  id: "ch07-gss-08",
  type: "case_set",
  q: "Use the scenario below to answer the following questions.",
  scenario: "At 31 March, the bank statement shows a balance of $9,860. The cash book shows $9,420...",
  subquestions: [
    {
      id: "part-a",
      type: "numeric_input",
      prompt: "What is the adjusted bank balance?",
      points: 1,
      answer: {
        value: 10300,
        tolerance: 0.01,
      },
    },
    {
      id: "part-b",
      type: "mcq",
      prompt: "Which item requires a journal entry in the cash book?",
      options: ["Outstanding cheques", "Deposits in transit", "Bank service charge", "Adjusted bank balance"],
      answer: {
        correctIndex: 2,
      },
      points: 1,
    },
  ],
  explanation: "Use one shared scenario and split the tasks into separate typed parts.",
  points: 2,
  tags: ["bank_reconciliation"],
}
```

## Best Practice For Guided Self-Study PDFs

- If the PDF has one scenario with parts `(a)`, `(b)`, `(c)`, prefer `case_set`.
- If each part is independent, split them into separate questions.
- If the solutions show full workings, put the final method in `explanation`.
- If the solutions include a full paragraph answer, use `sampleAnswer`.
- If one problem mixes calculation and explanation, split it into:
  - one `numeric_input`
  - one `written`
  - or one `case_set`

## Where To Paste Questions

- Intro / concepts: `src/data/chapters/ch01-introduction.js`
- Recording / journal entries: `src/data/chapters/ch02-recording-process.js`
- Adjustments: `src/data/chapters/ch03-accrual-accounting.js`
- Inventory: `src/data/chapters/ch04-inventories.js`
- Inventory analysis: `src/data/chapters/ch05-reporting-inventory.js`
- Cash / receivables / bank rec: `src/data/chapters/ch07-cash-receivables.js`
- Liabilities: `src/data/chapters/ch09-liabilities.js`
- Equity / statements: `src/data/chapters/ch10-equity.js`

## Fast Manual Conversion Checklist

- Problem copied
- Solution copied
- Type chosen
- `id` added
- `answer` completed
- `explanation` added
- `tags` added
- Object pasted into chapter file
