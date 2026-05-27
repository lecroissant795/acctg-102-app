export const title = "Ch 9: Liabilities";

export const questions = [
  { q: "A provision is recognised when:", options: ["A possible obligation exists but is unlikely", "A present obligation exists, it is probable that resources will flow out, and the amount can be reliably estimated", "Any future expense is anticipated", "A liability is certain but the amount is unknown"], answer: 1, explanation: "Under accounting standards, a provision requires: a present obligation from a past event, probable outflow of resources, and reliable estimation." },
  { q: "Unearned revenue is classified as a:", options: ["Non-current asset", "Current liability", "Equity item", "Revenue account"], answer: 1, explanation: "Unearned revenue is a current liability because the business has received cash but owes goods/services to the customer." },
  { q: "The times interest earned ratio is calculated as:", options: ["Profit ÷ Interest Expense", "Profit before income tax and interest expense ÷ Interest Expense", "Interest Expense ÷ Total Liabilities", "Net Cash from Operations ÷ Interest Expense"], answer: 1, explanation: "Times Interest Earned = (Profit before income tax + Interest expense) ÷ Interest expense. It measures ability to meet interest payments." },
  { q: "A contingent liability is:", options: ["A definite obligation recorded on the balance sheet", "A possible obligation whose existence depends on the outcome of a future event", "An accrued expense that has been paid", "A provision for employee benefits"], answer: 1, explanation: "A contingent liability is a possible obligation that depends on uncertain future events — it is disclosed in notes rather than recognised on the statement of financial position (unless probable and estimable)." },
  { q: "The current portion of a long-term loan is classified as:", options: ["A non-current liability", "A current liability", "Equity", "An expense"], answer: 1, explanation: "The portion of a long-term loan due within 12 months is reclassified as a current liability." },
  { q: "When a company issues a bond at a discount:", options: ["The issue price exceeds face value", "The issue price is below face value", "The coupon rate equals the market rate", "No interest expense is recorded"], answer: 1, explanation: "A bond is issued at a discount when the market interest rate exceeds the coupon rate, causing investors to pay less than face value." },
  {
    id: "ch09-journal-entry-earned-unearned-revenue",
    type: "journal_entry",
    q: "A business has previously recorded $2,400 as Unearned Revenue. At month-end, half of the service has now been provided. Record the adjustment.",
    answer: {
      lines: [
        { account: "Unearned Revenue", side: "debit", amount: 1200 },
        { account: "Service Revenue", side: "credit", amount: 1200 },
      ],
      rules: {
        requireBalancedEntry: true,
      },
    },
    explanation: "As the service is performed, the liability is reduced and revenue is recognised.",
    points: 2,
    tags: ["adjusting_entries", "debit_credit"],
  },
  {
    id: "ch09-select-multi-current-liabilities",
    type: "select_multiple",
    q: "Which of the following are typically reported as current liabilities?",
    options: ["Accounts Payable", "Unearned Revenue due within 12 months", "Current portion of a bank loan", "Revaluation Reserve"],
    answer: {
      correctIndices: [0, 1, 2],
      scoringMode: "partial",
    },
    explanation: "Current liabilities are obligations expected to be settled within 12 months. A revaluation reserve is part of equity, not a liability.",
    points: 2,
    tags: ["balance_sheet", "financial_statements"],
  },
  {
    id: "ch09-table-classification-balance-sheet",
    type: "table_classification",
    q: "Classify each item into the correct statement of financial position section.",
    columns: ["Current Asset", "Non-current Asset", "Current Liability", "Equity"],
    rows: [
      { id: "row1", text: "Accounts Receivable" },
      { id: "row2", text: "Equipment" },
      { id: "row3", text: "Unearned Revenue due next month" },
      { id: "row4", text: "Share Capital" },
    ],
    answer: {
      mapping: {
        row1: "Current Asset",
        row2: "Non-current Asset",
        row3: "Current Liability",
        row4: "Equity",
      },
    },
    explanation: "Receivables are current assets, equipment is a non-current asset, unearned revenue due soon is a current liability, and share capital belongs in equity.",
    points: 2,
    tags: ["balance_sheet", "financial_statements"],
  },
];
