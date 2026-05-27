import { ankiMcqs } from "./ch04-anki-mcqs.js";

export const title = "Ch 4: Inventories (Perpetual System)";

const coreMcqs = [
  { q: "Under a perpetual inventory system:", options: ["Inventory is only counted at period-end", "The inventory account is updated continuously with each purchase and sale", "Cost of sales is calculated only at year-end", "Physical counts are never performed"], answer: 1, explanation: "A perpetual system updates the inventory account in real time with every purchase and sale transaction." },
  { q: "When goods are sold under a perpetual system, which TWO entries are required?", options: ["Debit Cash, Credit Sales only", "Debit Sales Revenue, Credit Inventory; and Debit Cash, Credit Cost of Sales", "Debit Cash/Accounts Receivable, Credit Sales Revenue; and Debit Cost of Sales, Credit Inventory", "Debit Inventory, Credit Cash; and Debit Cost of Sales, Credit Revenue"], answer: 2, explanation: "Two entries are needed: (1) record the revenue (Dr Cash/AR, Cr Sales Revenue) and (2) record the cost (Dr Cost of Sales, Cr Inventory)." },
  { q: "Freight-in (delivery costs on purchases) is:", options: ["Debited to a freight expense account", "Added to the cost of inventory", "Deducted from sales revenue", "Recorded as a liability"], answer: 1, explanation: "Freight-in is included in the cost of inventory because it is a cost necessary to bring inventory to a saleable condition and location." },
  { q: "A purchase return under a perpetual system requires:", options: ["Debit Inventory, Credit Accounts Payable", "Debit Accounts Payable, Credit Inventory", "Debit Purchase Returns, Credit Cash", "Debit Cost of Sales, Credit Accounts Payable"], answer: 1, explanation: "When goods are returned, the liability decreases (Dr Accounts Payable) and inventory decreases (Cr Inventory)." },
  { q: "Gross profit is calculated as:", options: ["Net Sales − Operating Expenses", "Net Sales − Cost of Sales", "Revenue − Total Expenses", "Total Assets − Total Liabilities"], answer: 1, explanation: "Gross Profit = Net Sales − Cost of Sales. It represents the profit before operating expenses." },
  { q: "A sales discount taken by a customer under a perpetual system:", options: ["Increases sales revenue", "Decreases the amount of cash received and reduces net sales", "Is recorded as an expense", "Has no impact on net sales"], answer: 1, explanation: "Sales discounts reduce the amount collected from customers and are deducted from gross sales to arrive at net sales." },
];

const practiceQuestions = [
  {
    id: "ch04-numeric-gross-profit",
    type: "numeric_input",
    q: "Net sales are $52,000 and cost of sales is $31,400. Calculate gross profit.",
    answer: {
      value: 20600,
      tolerance: 0.01,
    },
    explanation: "Gross profit = Net sales − Cost of sales = $52,000 − $31,400 = $20,600.",
    points: 1,
    tags: ["inventory_sales", "income_statement"],
  },
  {
    id: "ch04-journal-entry-purchase-return",
    type: "journal_entry",
    q: "Inventory costing $880 including GST is returned to a supplier on account. Record the return.",
    answer: {
      lines: [
        { account: "Accounts Payable", side: "debit", amount: 880 },
        { account: "Inventory", side: "credit", amount: 800 },
        { account: "GST Receivable", side: "credit", amount: 80 },
      ],
      rules: {
        requireBalancedEntry: true,
      },
    },
    explanation: "The liability to the supplier decreases by the GST-inclusive amount, while inventory and the GST claimable amount are both reduced.",
    points: 3,
    tags: ["inventory_purchases", "gst", "debit_credit"],
  },
  {
    id: "ch04-journal-entry-credit-purchase-gst",
    type: "journal_entry",
    q: "Record the credit purchase of inventory for $6,600 including GST.",
    answer: {
      lines: [
        { account: "Inventory", side: "debit", amount: 6000 },
        { account: "GST Receivable", side: "debit", amount: 600 },
        { account: "Accounts Payable", side: "credit", amount: 6600 },
      ],
      rules: {
        requireBalancedEntry: true,
      },
    },
    explanation: "Inventory is recorded net of GST, with the GST input tax credit recorded separately.",
    points: 3,
    tags: ["inventory_purchases", "gst", "debit_credit"],
  },
  {
    id: "ch04-journal-entry-cash-sale-perpetual",
    type: "journal_entry",
    q: "Under a perpetual system, record a cash sale of inventory for $2,750 including GST. The inventory sold cost $1,400.",
    answer: {
      lines: [
        { account: "Cash", side: "debit", amount: 2750 },
        { account: "Sales Revenue", side: "credit", amount: 2500 },
        { account: "GST Payable", side: "credit", amount: 250 },
        { account: "Cost of Sales", side: "debit", amount: 1400 },
        { account: "Inventory", side: "credit", amount: 1400 },
      ],
      rules: {
        requireBalancedEntry: true,
      },
    },
    explanation: "A perpetual inventory sale requires one entry for the GST-inclusive sale and another for the cost transferred out of inventory.",
    points: 5,
    tags: ["inventory_sales", "gst", "debit_credit"],
  },
  {
    id: "ch04-journal-entry-sales-return",
    type: "journal_entry",
    q: "Under a perpetual system, a customer returns goods originally sold on credit for $550 including GST. The goods had cost $300. Record the return.",
    answer: {
      lines: [
        { account: "Sales Returns and Allowances", side: "debit", amount: 500 },
        { account: "GST Payable", side: "debit", amount: 50 },
        { account: "Accounts Receivable", side: "credit", amount: 550 },
        { account: "Inventory", side: "debit", amount: 300 },
        { account: "Cost of Sales", side: "credit", amount: 300 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: {
          "Accounts Receivable": ["Debtors"],
        },
      },
    },
    explanation: "A sales return reverses part of the sale and GST, reduces the receivable, and restores the returned inventory while reversing cost of sales.",
    points: 5,
    tags: ["inventory_sales", "gst", "debit_credit"],
  },
  {
    id: "ch04-table-gross-profit-components",
    type: "table_classification",
    q: "Classify each item according to where it contributes in the income statement for a merchandising business.",
    columns: ["Net Sales Section", "Cost of Sales Section", "Gross Profit Result"],
    rows: [
      { id: "gp1", text: "Sales Revenue" },
      { id: "gp2", text: "Sales Returns and Allowances" },
      { id: "gp3", text: "Inventory sold to customers" },
      { id: "gp4", text: "Difference between net sales and cost of sales" },
    ],
    answer: {
      mapping: {
        gp1: "Net Sales Section",
        gp2: "Net Sales Section",
        gp3: "Cost of Sales Section",
        gp4: "Gross Profit Result",
      },
    },
    explanation: "Net sales is built from sales revenue less returns/discounts, cost of sales reflects inventory consumed, and gross profit is the resulting subtotal.",
    points: 2,
    tags: ["income_statement", "financial_statements", "inventory_sales"],
  },
  {
    id: "ch04-case-perpetual-system-financial-effects",
    type: "case_set",
    q: "Use the perpetual inventory information below to answer the questions.",
    scenario: "During the month, a business records the following: (1) credit sales of $8,800 including GST, (2) cost of inventory sold $4,900, (3) customer returns of $1,100 including GST relating to goods that cost $620, and (4) sales discounts of $180 allowed to customers.",
    subquestions: [
      {
        id: "psi-1",
        type: "numeric_input",
        prompt: "What is net sales excluding GST after the return and discount?",
        points: 1,
        answer: { value: 6820, tolerance: 0.01 },
      },
      {
        id: "psi-2",
        type: "numeric_input",
        prompt: "What is final cost of sales after the return?",
        points: 1,
        answer: { value: 4280, tolerance: 0.01 },
      },
      {
        id: "psi-3",
        type: "numeric_input",
        prompt: "What is gross profit?",
        points: 1,
        answer: { value: 2540, tolerance: 0.01 },
      },
      {
        id: "psi-4",
        type: "mcq",
        prompt: "Which statement is correct?",
        options: [
          "Sales discounts increase gross profit",
          "Customer returns increase net sales",
          "Customer returns reduce both net sales and cost of sales under a perpetual system",
          "GST payable is unaffected by sales returns",
        ],
        answer: { correctIndex: 2 },
        points: 1,
      },
    ],
    explanation: "Convert the sale and return to net-of-GST amounts for income-statement reporting: sales $8,000, sales return $1,000, less discount $180, giving net sales of $6,820. Cost of sales is $4,900 − $620 = $4,280, so gross profit is $2,540.",
    points: 4,
    tags: ["financial_statements", "income_statement", "inventory_sales", "gst"],
  },
];

export const questions = [...coreMcqs, ...ankiMcqs, ...practiceQuestions];
