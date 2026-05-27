export const title = "Ch 1: Written Response";

export const questions = [
  {
    type: "written",
    q: "Situation analysis: Holding all other factors constant, indicate whether each of the following signals generally good or bad news about an entity.",
    parts: [
      { label: "(a)", text: "Increase in the profit margin." },
      { label: "(b)", text: "Increase in the current ratio." },
      { label: "(c)", text: "Decrease in the debt to total assets ratio." },
      { label: "(d)", text: "Increase in the current cash debt coverage." }
    ],
    sampleAnswer: "(a) Good news — a larger percentage of profit is generated for each dollar of net sales.\n(b) Good news — the company improved its liquidity.\n(c) Good news — the company has decreased the proportion of assets funded by creditors, thus reducing risk.\n(d) Good news — the company has increased its ability to meet short-term obligations."
  },
  {
    type: "written",
    q: "Ultimo Travel Goods Pty Limited was formed on 1 July 2021. At 30 June 2022, Mark Austin, the managing director and major shareholder, prepared a statement of financial position. Mark admits he is not an accountant. He has provided the following information:\n\n1. The villa is on the Gold Coast and actually belongs to Mark, not Ultimo Travel Goods Pty Limited. However, because he thinks he might allow executives to use it sometimes, he decided to list it as an asset of the company. To be consistent he also listed as a liability of the company his personal loan that he took out at the bank to buy the villa.\n\n2. The inventory was originally purchased for $10,000, but due to a surge in demand Mark now thinks he could sell it for $30,000. He thought it would be best to record it at $30,000.\n\n3. Included in the accounts payable balance is $5,000 that Mark owes for his personal telephone account. Mark included this in the accounts payable of Ultimo Travel Goods Pty Limited because he will probably use company funds to pay for it.\n\nRequired:\n(a) Comment on the proper accounting treatment of the three items above.\n(b) Provide a corrected statement of financial position for Ultimo Travel Goods Pty Limited.",
    sampleAnswer: "(a)\n1. The accounting entity concept states that economic events can be identified with a particular unit of accountability. Since the Gold Coast villa is Mark Austin's personal property, it should not be reported on the company's statement of financial position. The loan is also Mark's personal liability, not the company's.\n\n2. The historical cost principle dictates that assets are recorded at their original cost. Reporting the inventory at $30,000 violates the cost principle. The inventory should be reported at $10,000.\n\n3. Including the personal telephone account payable violates the accounting entity concept. The $5,000 payable is not a liability of Ultimo Travel Goods Pty Limited.\n\n(b) Corrected Statement of Financial Position:\nAssets: Cash $20,000, Accounts receivable $55,000, Inventory $10,000. Total assets $85,000.\nLiabilities: Accounts payable $35,000, Notes payable $15,000. Total liabilities $50,000.\nNet Assets/Equity: $35,000."
  },
  {
    id: "ch01-gss-q2-ultimo-case",
    type: "case_set",
    q: "Use the Ultimo Travel Goods Pty Limited scenario to answer the following questions.",
    scenario: "Ultimo Travel Goods Pty Limited was formed on 1 July 2021. At 30 June 2022, Mark Austin prepared a statement of financial position showing: Cash $20,000, Accounts Receivable $55,000, Inventory $30,000, Villa $300,000, Accounts Payable $40,000, Notes Payable $15,000, Bank Loan $160,000, Equity $55,000.\n\nAdditional information:\n1. The villa belongs personally to Mark, not the company. The bank loan was taken out personally by Mark to buy the villa.\n2. The inventory originally cost $10,000, but Mark believes it could now sell for $30,000.\n3. Included in accounts payable is $5,000 for Mark's personal telephone account.",
    subquestions: [
      {
        id: "part-a",
        type: "select_multiple",
        prompt: "Which items should be removed from the company's statement of financial position because they belong to Mark personally?",
        options: [
          "Villa",
          "Bank loan",
          "Inventory",
          "Accounts receivable",
          "Personal telephone payable",
        ],
        answer: {
          correctIndices: [0, 1, 4],
          scoringMode: "partial",
        },
        points: 2,
      },
      {
        id: "part-b",
        type: "numeric_input",
        prompt: "What should the corrected inventory balance be?",
        answer: {
          value: 10000,
          tolerance: 0.01,
        },
        points: 1,
      },
      {
        id: "part-c",
        type: "numeric_input",
        prompt: "What should corrected total assets be?",
        answer: {
          value: 85000,
          tolerance: 0.01,
        },
        points: 1,
      },
      {
        id: "part-d",
        type: "numeric_input",
        prompt: "What should corrected total liabilities be?",
        answer: {
          value: 50000,
          tolerance: 0.01,
        },
        points: 1,
      },
      {
        id: "part-e",
        type: "numeric_input",
        prompt: "What should corrected equity be after fixing the statement?",
        answer: {
          value: 35000,
          tolerance: 0.01,
        },
        points: 1,
      },
    ],
    explanation: "Remove the villa and related personal bank loan, reduce inventory to historical cost of $10,000, and remove the $5,000 personal telephone payable. Corrected amounts are: assets $85,000, liabilities $50,000, equity $35,000.",
    points: 6,
    tags: ["financial_statements", "balance_sheet", "error_correction"],
    metadata: {
      source: "Week 01 Chapter 01 Guided Self-Study Problems",
      sourceQuestion: 2,
    },
  }
];
