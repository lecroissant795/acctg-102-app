export const title = "Ch 10: Equity";

export const questions = [
  { q: "Share capital represents:", options: ["The total profits retained by the company", "The amount contributed by shareholders in exchange for shares", "The market value of all outstanding shares", "The total dividends paid to shareholders"], answer: 1, explanation: "Share capital (also called contributed equity or paid-up capital) is the amount shareholders have invested by purchasing shares." },
  { q: "A share split:", options: ["Increases total share capital", "Reduces the number of shares outstanding", "Increases the number of shares while reducing the par/issue price proportionally", "Requires a journal entry to equity accounts"], answer: 2, explanation: "A share split increases the number of shares and reduces the price per share proportionally — total equity is unchanged." },
  { q: "Retained earnings is increased by:", options: ["Issuing new shares", "Declaring dividends", "Recording profit for the period", "Purchasing treasury shares"], answer: 2, explanation: "Retained earnings increases when the company earns a profit and decreases when dividends are declared." },
  { q: "When dividends are declared by the board of directors:", options: ["Cash immediately decreases", "A liability (Dividends Payable) is created", "Retained earnings increases", "Share capital decreases"], answer: 1, explanation: "Declaration creates a liability: Dr Retained Earnings (or Dividends Declared), Cr Dividends Payable. Cash decreases only on the payment date." },
  { q: "Earnings per share (EPS) is calculated as:", options: ["Total Revenue ÷ Number of Shares", "Profit ÷ Weighted Average Number of Ordinary Shares Outstanding", "Dividends ÷ Number of Shares", "Total Equity ÷ Number of Shares"], answer: 1, explanation: "EPS = Profit attributable to ordinary shareholders ÷ Weighted average number of ordinary shares outstanding." },
  { q: "A revaluation reserve arises when:", options: ["An asset is sold at a gain", "A non-current asset is revalued upward above its carrying amount", "Dividends are reinvested", "Shares are issued at a premium"], answer: 1, explanation: "When PPE is revalued upward, the increase above carrying amount is credited to a revaluation reserve in equity (not through profit or loss)." },
  {
    id: "ch10-numeric-eps",
    type: "numeric_input",
    q: "Profit attributable to ordinary shareholders is $180,000 and the weighted average number of ordinary shares is 60,000. Calculate earnings per share.",
    answer: {
      value: 3,
      tolerance: 0.01,
    },
    explanation: "EPS = $180,000 ÷ 60,000 = $3.00 per share.",
    points: 1,
    tags: ["equity", "income_statement"],
  },
  {
    id: "ch10-select-multi-equity-section",
    type: "select_multiple",
    q: "Which items are commonly presented within the equity section of the statement of financial position?",
    options: ["Share Capital", "Retained Earnings", "Revaluation Reserve", "Accounts Payable", "Dividends Payable"],
    answer: {
      correctIndices: [0, 1, 2],
      scoringMode: "partial",
    },
    explanation: "Share capital, retained earnings, and reserves are equity items. Accounts payable and dividends payable are liabilities.",
    points: 2,
    tags: ["equity", "balance_sheet", "financial_statements"],
  },
];
