import { ankiMcqs } from "./ch08-anki-mcqs.js";

export const title = "Ch 8: Non-Current Assets";

const coreMcqs = [
  { q: "The cost of property, plant and equipment includes:", options: ["Only the purchase price", "Purchase price plus all costs necessary to bring the asset to its intended use", "Purchase price minus trade discounts only", "Only the installation costs"], answer: 1, explanation: "The cost of PPE includes all expenditures necessary to acquire the asset and bring it to the location and condition for its intended use." },
  { q: "Straight-line depreciation allocates:", options: ["A decreasing amount of depreciation each year", "An equal amount of depreciation each year over the asset's useful life", "Depreciation based on actual usage", "No depreciation in the first year"], answer: 1, explanation: "Straight-line: (Cost − Residual Value) ÷ Useful Life = equal annual depreciation expense." },
  { q: "The diminishing balance (reducing balance) method results in:", options: ["Equal depreciation each year", "Higher depreciation in earlier years and lower in later years", "Lower depreciation in earlier years and higher in later years", "No depreciation in the final year"], answer: 1, explanation: "Diminishing balance applies a fixed rate to the declining book value, producing higher depreciation in early years." },
  { q: "A gain on disposal of a non-current asset occurs when:", options: ["The proceeds exceed the carrying amount (book value)", "The carrying amount exceeds the proceeds", "The asset is sold for exactly its original cost", "The asset is fully depreciated"], answer: 0, explanation: "Gain = Proceeds − Carrying Amount. If proceeds exceed carrying amount, a gain is recognised." },
  { q: "An intangible asset with an indefinite useful life is:", options: ["Amortised over 10 years", "Not amortised but tested annually for impairment", "Written off immediately as an expense", "Depreciated using straight-line method"], answer: 1, explanation: "Intangible assets with indefinite useful lives are not amortised but must be tested for impairment at least annually." },
  { q: "Which of the following is a revenue expenditure (not capitalised)?", options: ["Purchase of a new delivery vehicle", "Installation costs for new machinery", "Routine maintenance and repairs", "Addition of a new wing to a building"], answer: 2, explanation: "Routine maintenance and repairs are revenue expenditures — they maintain (rather than enhance) the asset and are expensed immediately." },
];

const practiceQuestions = [
  {
    id: "ch08-journal-entry-depreciation",
    type: "journal_entry",
    q: "Record annual straight-line depreciation of $4,800 on equipment.",
    answer: {
      lines: [
        { account: "Depreciation Expense", side: "debit", amount: 4800 },
        { account: "Accumulated Depreciation - Equipment", side: "credit", amount: 4800 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: {
          "Accumulated Depreciation - Equipment": ["Accumulated Depreciation—Equipment", "Accumulated Depreciation Equipment"],
        },
      },
    },
    explanation: "Depreciation recognises the period's asset usage and increases accumulated depreciation rather than directly crediting the equipment account.",
    points: 2,
    tags: ["adjusting_entries", "debit_credit"],
  },
  {
    id: "ch08-journal-entry-ppe-purchase",
    type: "journal_entry",
    q: "A business purchases equipment for $22,000 cash and pays $1,100 for installation. Record the acquisition.",
    answer: {
      lines: [
        { account: "Equipment", side: "debit", amount: 23100 },
        { account: "Cash", side: "credit", amount: 23100 },
      ],
      rules: {
        requireBalancedEntry: true,
      },
    },
    explanation: "All costs necessary to acquire and prepare the equipment for use are capitalised as part of the asset's cost.",
    points: 2,
    tags: ["debit_credit"],
  },
  {
    id: "ch08-journal-entry-asset-disposal",
    type: "journal_entry",
    q: "Equipment with cost $18,000 and accumulated depreciation $11,500 is sold for cash of $7,200. Record the disposal.",
    answer: {
      lines: [
        { account: "Cash", side: "debit", amount: 7200 },
        { account: "Accumulated Depreciation - Equipment", side: "debit", amount: 11500 },
        { account: "Gain on Disposal of Equipment", side: "credit", amount: 700 },
        { account: "Equipment", side: "credit", amount: 18000 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: {
          "Accumulated Depreciation - Equipment": ["Accumulated Depreciation Equipment"],
          "Gain on Disposal of Equipment": ["Gain on Sale of Equipment"],
        },
      },
    },
    explanation: "The carrying amount is $6,500 ($18,000 cost less $11,500 accumulated depreciation). Selling for $7,200 results in a gain of $700.",
    points: 4,
    tags: ["debit_credit"],
  },
];

export const questions = [...coreMcqs, ...ankiMcqs, ...practiceQuestions];
