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

export const questions = [...coreMcqs, ...ankiMcqs];
