export const title = "Ch 5: Reporting & Analysing Inventory";

export const questions = [
  { q: "Under FIFO (First-In, First-Out), cost of sales consists of:", options: ["The most recently purchased items", "The oldest (earliest purchased) items", "An average of all items", "The highest-cost items"], answer: 1, explanation: "FIFO assumes the first goods purchased are the first sold, so cost of sales reflects the oldest costs." },
  { q: "In a period of rising prices, which method results in the HIGHEST reported profit?", options: ["FIFO", "LIFO", "Weighted Average Cost", "Specific Identification"], answer: 0, explanation: "With rising prices, FIFO allocates older, lower costs to cost of sales, resulting in higher gross profit compared to other methods." },
  { q: "The lower of cost and net realisable value (LCNRV) rule requires:", options: ["Inventory to always be reported at cost", "Inventory to be written down if NRV falls below cost", "Inventory to be written up if market value exceeds cost", "Inventory to be valued at replacement cost"], answer: 1, explanation: "Under LCNRV, if net realisable value drops below cost, inventory must be written down to NRV to avoid overstating assets." },
  { q: "Net realisable value (NRV) is defined as:", options: ["The original purchase price of the inventory", "The estimated selling price less costs to complete and sell", "The current replacement cost from the supplier", "The average cost of all inventory on hand"], answer: 1, explanation: "NRV = estimated selling price − estimated costs of completion − estimated costs to make the sale." },
  { q: "The inventory turnover ratio is calculated as:", options: ["Net Sales ÷ Average Inventory", "Cost of Sales ÷ Average Inventory", "Average Inventory ÷ Cost of Sales", "Gross Profit ÷ Average Inventory"], answer: 1, explanation: "Inventory Turnover = Cost of Sales ÷ Average Inventory. It measures how many times inventory is sold and replaced during a period." },
  { q: "Weighted average cost method under a periodic system:", options: ["Uses the cost of the last purchase for all units", "Calculates a weighted average cost per unit based on total cost ÷ total units available", "Is the same as FIFO", "Assigns specific costs to specific units sold"], answer: 1, explanation: "Weighted Average Cost = Total Cost of Goods Available for Sale ÷ Total Units Available for Sale." },
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
];
