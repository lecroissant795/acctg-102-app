export const title = "Ch 4: Inventories (Perpetual System)";

export const questions = [
  { q: "Under a perpetual inventory system:", options: ["Inventory is only counted at period-end", "The inventory account is updated continuously with each purchase and sale", "Cost of sales is calculated only at year-end", "Physical counts are never performed"], answer: 1, explanation: "A perpetual system updates the inventory account in real time with every purchase and sale transaction." },
  { q: "When goods are sold under a perpetual system, which TWO entries are required?", options: ["Debit Cash, Credit Sales only", "Debit Sales Revenue, Credit Inventory; and Debit Cash, Credit Cost of Sales", "Debit Cash/Accounts Receivable, Credit Sales Revenue; and Debit Cost of Sales, Credit Inventory", "Debit Inventory, Credit Cash; and Debit Cost of Sales, Credit Revenue"], answer: 2, explanation: "Two entries are needed: (1) record the revenue (Dr Cash/AR, Cr Sales Revenue) and (2) record the cost (Dr Cost of Sales, Cr Inventory)." },
  { q: "Freight-in (delivery costs on purchases) is:", options: ["Debited to a freight expense account", "Added to the cost of inventory", "Deducted from sales revenue", "Recorded as a liability"], answer: 1, explanation: "Freight-in is included in the cost of inventory because it is a cost necessary to bring inventory to a saleable condition and location." },
  { q: "A purchase return under a perpetual system requires:", options: ["Debit Inventory, Credit Accounts Payable", "Debit Accounts Payable, Credit Inventory", "Debit Purchase Returns, Credit Cash", "Debit Cost of Sales, Credit Accounts Payable"], answer: 1, explanation: "When goods are returned, the liability decreases (Dr Accounts Payable) and inventory decreases (Cr Inventory)." },
  { q: "Gross profit is calculated as:", options: ["Net Sales − Operating Expenses", "Net Sales − Cost of Sales", "Revenue − Total Expenses", "Total Assets − Total Liabilities"], answer: 1, explanation: "Gross Profit = Net Sales − Cost of Sales. It represents the profit before operating expenses." },
  { q: "A sales discount taken by a customer under a perpetual system:", options: ["Increases sales revenue", "Decreases the amount of cash received and reduces net sales", "Is recorded as an expense", "Has no impact on net sales"], answer: 1, explanation: "Sales discounts reduce the amount collected from customers and are deducted from gross sales to arrive at net sales." },
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
];
