import { ankiMcqs } from "./ch05-anki-mcqs.js";

export const title = "Ch 5: Reporting & Analysing Inventory";

const coreMcqs = [
  { q: "Under FIFO (First-In, First-Out), cost of sales consists of:", options: ["The most recently purchased items", "The oldest (earliest purchased) items", "An average of all items", "The highest-cost items"], answer: 1, explanation: "FIFO assumes the first goods purchased are the first sold, so cost of sales reflects the oldest costs." },
  { q: "In a period of rising prices, which method results in the HIGHEST reported profit?", options: ["FIFO", "LIFO", "Weighted Average Cost", "Specific Identification"], answer: 0, explanation: "With rising prices, FIFO allocates older, lower costs to cost of sales, resulting in higher gross profit compared to other methods." },
  { q: "The lower of cost and net realisable value (LCNRV) rule requires:", options: ["Inventory to always be reported at cost", "Inventory to be written down if NRV falls below cost", "Inventory to be written up if market value exceeds cost", "Inventory to be valued at replacement cost"], answer: 1, explanation: "Under LCNRV, if net realisable value drops below cost, inventory must be written down to NRV to avoid overstating assets." },
  { q: "Net realisable value (NRV) is defined as:", options: ["The original purchase price of the inventory", "The estimated selling price less costs to complete and sell", "The current replacement cost from the supplier", "The average cost of all inventory on hand"], answer: 1, explanation: "NRV = estimated selling price − estimated costs of completion − estimated costs to make the sale." },
  { q: "The inventory turnover ratio is calculated as:", options: ["Net Sales ÷ Average Inventory", "Cost of Sales ÷ Average Inventory", "Average Inventory ÷ Cost of Sales", "Gross Profit ÷ Average Inventory"], answer: 1, explanation: "Inventory Turnover = Cost of Sales ÷ Average Inventory. It measures how many times inventory is sold and replaced during a period." },
  { q: "Weighted average cost method under a periodic system:", options: ["Uses the cost of the last purchase for all units", "Calculates a weighted average cost per unit based on total cost ÷ total units available", "Is the same as FIFO", "Assigns specific costs to specific units sold"], answer: 1, explanation: "Weighted Average Cost = Total Cost of Goods Available for Sale ÷ Total Units Available for Sale." },
];

const practiceQuestions = [
  {
    id: "ch05-numeric-inventory-turnover",
    type: "numeric_input",
    q: "Cost of sales is $96,000 and average inventory is $24,000. Calculate the inventory turnover ratio.",
    answer: {
      value: 4,
      tolerance: 0.01,
    },
    explanation: "Inventory turnover = Cost of sales ÷ Average inventory = $96,000 ÷ $24,000 = 4 times.",
    points: 1,
    tags: ["inventory", "financial_statements"],
  },
  {
    id: "ch05-select-multi-lcnrv",
    type: "select_multiple",
    q: "Select all statements that are true about the lower of cost and net realisable value rule.",
    options: [
      "Inventory is written down when NRV falls below cost.",
      "Inventory can be written up above original cost if selling prices rise.",
      "The rule helps prevent assets from being overstated.",
      "NRV is estimated selling price less costs to complete and sell.",
    ],
    answer: {
      correctIndices: [0, 2, 3],
      scoringMode: "partial",
    },
    explanation: "LCNRV requires inventory to be measured at the lower of cost and NRV; it does not permit writing inventory above original cost simply because selling prices have increased.",
    points: 2,
    tags: ["inventory", "balance_sheet"],
  },
  {
    id: "ch05-numeric-gross-profit-comparison",
    type: "numeric_input",
    q: "Net sales are $120,000 and cost of sales under FIFO is $78,500. Calculate gross profit.",
    answer: {
      value: 41500,
      tolerance: 0.01,
    },
    explanation: "Gross profit = Net sales − Cost of sales = $120,000 − $78,500 = $41,500.",
    points: 1,
    tags: ["income_statement", "inventory", "financial_statements"],
  },
  {
    id: "ch05-table-inventory-statement-effects",
    type: "table_classification",
    q: "Classify each inventory-related measure by the financial statement where it is primarily reported or derived.",
    columns: ["Statement of Financial Position", "Income Statement", "Derived Ratio / Analysis"],
    rows: [
      { id: "inv1", text: "Ending Inventory" },
      { id: "inv2", text: "Cost of Sales" },
      { id: "inv3", text: "Gross Profit" },
      { id: "inv4", text: "Inventory Turnover" },
    ],
    answer: {
      mapping: {
        inv1: "Statement of Financial Position",
        inv2: "Income Statement",
        inv3: "Income Statement",
        inv4: "Derived Ratio / Analysis",
      },
    },
    explanation: "Ending inventory is a balance sheet amount, cost of sales and gross profit appear in the income statement, and inventory turnover is a ratio derived from reported amounts.",
    points: 2,
    tags: ["financial_statements", "balance_sheet", "income_statement", "inventory"],
  },
  {
    id: "ch05-case-inventory-valuation-statements",
    type: "case_set",
    q: "Use the inventory valuation information below to answer the questions.",
    scenario: "A business has inventory recorded at cost of $18,500 at year-end. Net realisable value is estimated at $17,200. Net sales for the year are $96,000 and cost of sales before any write-down is $61,400.",
    subquestions: [
      {
        id: "ivs-1",
        type: "numeric_input",
        prompt: "What should the inventory balance be reported at year-end?",
        points: 1,
        answer: { value: 17200, tolerance: 0.01 },
      },
      {
        id: "ivs-2",
        type: "numeric_input",
        prompt: "What is the inventory write-down amount?",
        points: 1,
        answer: { value: 1300, tolerance: 0.01 },
      },
      {
        id: "ivs-3",
        type: "numeric_input",
        prompt: "What is adjusted gross profit after recognising the write-down?",
        points: 1,
        answer: { value: 33300, tolerance: 0.01 },
      },
      {
        id: "ivs-4",
        type: "mcq",
        prompt: "Which statement is correct?",
        options: [
          "The write-down increases assets",
          "The write-down increases gross profit",
          "The write-down reduces ending inventory and profit",
          "The write-down affects only the statement of cash flows",
        ],
        answer: { correctIndex: 2 },
        points: 1,
      },
    ],
    explanation: "LCNRV requires inventory to be reported at $17,200, producing a $1,300 write-down. Adjusted cost of sales becomes $62,700, so gross profit is $96,000 − $62,700 = $33,300.",
    points: 4,
    tags: ["financial_statements", "balance_sheet", "income_statement", "inventory"],
  },
];

export const questions = [...coreMcqs, ...ankiMcqs, ...practiceQuestions];
