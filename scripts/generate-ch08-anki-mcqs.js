/**
 * Generates MCQs from Chapter 8 Anki flashcards (Notion).
 * Run: bun scripts/generate-ch08-anki-mcqs.js
 */

const DISTRACTOR_POOLS = {
  depreciation_methods: [
    "Straight-line depreciation",
    "Diminishing-balance depreciation",
    "Units-of-production depreciation",
    "Specific identification",
  ],
  journal_patterns: [
    "Dr Depreciation Expense / Cr Accumulated Depreciation",
    "Dr Amortisation Expense / Cr Accumulated Amortisation",
    "Dr Impairment Loss / Cr Accumulated Impairment Loss",
    "Dr Asset / Cr Revaluation Surplus",
    "Dr Revaluation Expense / Cr Asset",
    "Dr Cash; Dr Accumulated Depreciation; Cr Asset; Cr Gain on Disposal",
    "Dr Cash; Dr Accumulated Depreciation; Dr Loss on Disposal; Cr Asset",
    "Dr Inventory / Cr Accumulated Depletion",
  ],
  standards: [
    "AASB 116 / IAS 16",
    "AASB 136 / IAS 36",
    "AASB 138",
    "AASB 141 / IAS 41",
    "AASB 102 / IAS 2",
  ],
  intangible_types: [
    "Patents",
    "Copyrights",
    "Trademarks and brand names",
    "Goodwill",
    "Franchises and licences",
  ],
  formulas: [
    "(Cost − Residual Value) ÷ Useful Life",
    "(Cost − Residual Value) ÷ Total Estimated Units",
    "Cost minus accumulated depreciation",
    "Carrying Amount − Recoverable Amount",
    "Proceeds − Carrying Amount",
    "Depletable Cost ÷ Total Estimated Production",
    "Net Sales ÷ Average Total Assets",
    "Average Cost of PPE ÷ Depreciation Expense",
    "Accumulated Depreciation ÷ Depreciation Expense",
    "Higher of fair value less costs to sell or value in use",
  ],
  expenditure_types: [
    "Ordinary repairs — expensed immediately",
    "Additions and improvements — capitalised",
    "Purchase price only",
    "Routine maintenance — capitalised",
  ],
  yes_no: ["Yes", "No", "Only under revaluation basis", "Only for intangible assets"],
};

/** @type {Array<{ id: string, q: string, a: string, pool?: keyof typeof DISTRACTOR_POOLS, distractors?: string[], tags?: string[] }>} */
const FLASHCARDS = [
  { id: "ch08-anki-01", q: "What are non-current assets?", a: "Long-term assets used in business operations that provide future economic benefits over more than one accounting period.", distractors: ["Assets expected to be converted to cash within 12 months", "Expenses incurred to generate revenue", "Liabilities due after one year"], tags: ["balance_sheet"] },
  { id: "ch08-anki-02", q: "What does PPE stand for?", a: "Property, Plant and Equipment.", distractors: ["Profit, Performance and Equity", "Purchase Price Expense", "Property, Payroll and Expenses"], tags: ["balance_sheet"] },
  { id: "ch08-anki-03", q: "What are examples of property assets?", a: "Land and buildings.", distractors: ["Machinery, motor vehicles, and computers", "Patents, copyrights, and goodwill", "Inventory and accounts receivable"], tags: ["balance_sheet"] },
  { id: "ch08-anki-04", q: "What are examples of plant and equipment?", a: "Machinery, motor vehicles, office furniture, computers, and cash registers.", distractors: ["Land and buildings only", "Patents and trademarks", "Cash and receivables"], tags: ["balance_sheet"] },
  { id: "ch08-anki-05", q: "Why are PPE assets depreciated?", a: "Because their economic benefits are consumed over time.", distractors: ["Because market value always decreases", "Because they are current assets", "Because they must be written off immediately"], tags: ["balance_sheet"] },
  { id: "ch08-anki-06", q: "Which accounting standard governs PPE?", a: "AASB 116 / IAS 16.", pool: "standards", tags: ["balance_sheet"] },
  { id: "ch08-anki-07", q: "How are PPE assets initially recorded?", a: "At cost.", distractors: ["At fair value always", "At net realisable value", "At replacement cost"], tags: ["balance_sheet"] },
  { id: "ch08-anki-08", q: "What is cost under AASB 116?", a: "The cash or cash equivalents paid, or fair value of consideration given to acquire the asset.", distractors: ["Only the invoice price before any additional costs", "Market value at balance date", "Carrying amount minus accumulated depreciation"], tags: ["balance_sheet"] },
  { id: "ch08-anki-09", q: "What is fair value?", a: "The amount for which an asset could be exchanged between knowledgeable, willing parties in an arm's-length transaction.", distractors: ["The original purchase price only", "Net realisable value less costs to sell", "Book value after depreciation"], tags: ["balance_sheet"] },
  { id: "ch08-anki-10", q: "What costs are included in the cost of land?", a: "Purchase price, legal fees, stamp duty, demolition/removal costs, and assumed property taxes.", distractors: ["Only the purchase price", "Depreciation and amortisation", "Routine maintenance and repairs"], tags: ["balance_sheet"] },
  { id: "ch08-anki-11", q: "What costs are included in plant and equipment cost?", a: "Purchase price, freight, insurance during transit, and installation costs.", distractors: ["Only the purchase price", "Ordinary repairs and maintenance", "Depreciation expense for prior years"], tags: ["balance_sheet"] },
  { id: "ch08-anki-12", q: "Are ordinary repairs included in the cost of PPE?", a: "No. Ordinary repairs are expensed immediately.", pool: "yes_no", tags: ["balance_sheet"] },
  { id: "ch08-anki-13", q: "What is the key rule for capitalising costs?", a: "Costs must be necessary to acquire the asset and prepare it for intended use.", distractors: ["All costs related to the business must be capitalised", "Only repair costs are capitalised", "Costs are capitalised only when cash is paid"], tags: ["balance_sheet"] },
  { id: "ch08-anki-14", q: "What is depreciation?", a: "The systematic allocation of the cost of a PPE asset over its useful life.", pool: "depreciation_methods", tags: ["balance_sheet"] },
  { id: "ch08-anki-15", q: "What is carrying amount?", a: "Cost minus accumulated depreciation.", pool: "formulas", tags: ["balance_sheet"] },
  { id: "ch08-anki-16", q: "What four factors cause assets to decline in value?", a: "Usage, wear and tear, obsolescence, and legal life.", distractors: ["Inflation, interest rates, and tax", "GST, freight, and installation only", "Revaluation, impairment, and disposal only"], tags: ["balance_sheet"] },
  { id: "ch08-anki-17", q: "What are the three inputs required to calculate depreciation?", a: "Cost, useful life, and residual value.", distractors: ["Proceeds, carrying amount, and gain", "Fair value, value in use, and CGU", "Net sales, average assets, and turnover"], tags: ["balance_sheet"] },
  { id: "ch08-anki-18", q: "What is residual value?", a: "The estimated value of an asset at the end of its useful life.", distractors: ["The original purchase price", "Carrying amount at disposal date", "Fair value less costs to sell"], tags: ["balance_sheet"] },
  { id: "ch08-anki-19", q: "What is depreciable amount?", a: "Cost minus residual value.", pool: "formulas", tags: ["balance_sheet"] },
  { id: "ch08-anki-20", q: "What is the journal entry for depreciation?", a: "Dr Depreciation Expense / Cr Accumulated Depreciation.", pool: "journal_patterns", tags: ["balance_sheet", "debit_credit"] },
  { id: "ch08-anki-21", q: "What is the straight-line depreciation formula?", a: "(Cost − Residual Value) ÷ Useful Life.", pool: "formulas", tags: ["balance_sheet"] },
  { id: "ch08-anki-22", q: "What assumption does straight-line depreciation make?", a: "Asset benefits are consumed evenly over time.", distractors: ["Benefits are consumed more in early years", "Benefits depend only on units produced", "Benefits never decline"], tags: ["balance_sheet"] },
  { id: "ch08-anki-23", q: "Under straight-line depreciation, is annual depreciation expense constant?", a: "Yes.", pool: "yes_no", tags: ["balance_sheet"] },
  { id: "ch08-anki-24", q: "If cost is $20,000, residual value is $2,000, and useful life is 6 years, what is annual depreciation?", a: "$3,000. Calculation: ($20,000 − $2,000) ÷ 6.", distractors: ["$3,333", "$2,000", "$18,000"], tags: ["balance_sheet"] },
  { id: "ch08-anki-25", q: "What is the key feature of diminishing-balance depreciation?", a: "Higher depreciation expense in early years and lower expense later.", distractors: ["Equal depreciation each year", "Depreciation based only on units produced", "No depreciation in the first year"], tags: ["balance_sheet"] },
  { id: "ch08-anki-26", q: "Under diminishing-balance depreciation, what amount is the rate applied to?", a: "Carrying amount at the beginning of the year.", distractors: ["Original cost only", "Residual value only", "Proceeds on disposal"], tags: ["balance_sheet"] },
  { id: "ch08-anki-27", q: "Why is diminishing-balance suitable for some assets?", a: "Some assets generate greater benefits in early years.", distractors: ["All assets must use diminishing-balance under AASB 116", "It eliminates the need for residual value", "It produces equal expense each year"], tags: ["balance_sheet"] },
  { id: "ch08-anki-28", q: "What happens to carrying amount under diminishing-balance depreciation?", a: "It decreases more rapidly in early years.", distractors: ["It decreases by the same amount each year", "It increases when revalued downward", "It stays constant until disposal"], tags: ["balance_sheet"] },
  { id: "ch08-anki-29", q: "What is the units-of-production depreciation formula?", a: "(Cost − Residual Value) ÷ Total Estimated Units.", pool: "formulas", tags: ["balance_sheet"] },
  { id: "ch08-anki-30", q: "What determines depreciation expense under units-of-production?", a: "Actual usage of the asset.", distractors: ["Equal allocation over useful life", "A fixed percentage of carrying amount", "Market value at balance date"], tags: ["balance_sheet"] },
  { id: "ch08-anki-31", q: "Why is units-of-production considered usage-based depreciation?", a: "Because depreciation depends on actual activity or output.", distractors: ["Because it uses a fixed rate on cost", "Because it ignores residual value", "Because it is required for all PPE"], tags: ["balance_sheet"] },
  { id: "ch08-anki-32", q: "What types of assets commonly use units-of-production?", a: "Vehicles and machinery where usage can be measured.", distractors: ["Land and buildings only", "Patents and copyrights", "Cash and receivables"], tags: ["balance_sheet"] },
  { id: "ch08-anki-33", q: "Do all depreciation methods depreciate the same total amount?", a: "Yes. They differ only in timing of expense recognition.", pool: "yes_no", tags: ["balance_sheet"] },
  { id: "ch08-anki-34", q: "Which depreciation method produces highest expense in early years?", a: "Diminishing-balance.", pool: "depreciation_methods", tags: ["balance_sheet"] },
  { id: "ch08-anki-35", q: "Which depreciation method produces equal annual expense?", a: "Straight-line.", pool: "depreciation_methods", tags: ["balance_sheet"] },
  { id: "ch08-anki-36", q: "Which depreciation method links expense directly to usage?", a: "Units-of-production.", pool: "depreciation_methods", tags: ["balance_sheet"] },
  { id: "ch08-anki-37", q: "What are ordinary repairs?", a: "Expenditures that maintain normal operating efficiency.", pool: "expenditure_types", tags: ["balance_sheet"] },
  { id: "ch08-anki-38", q: "How are ordinary repairs treated?", a: "Expensed immediately.", pool: "expenditure_types", tags: ["balance_sheet"] },
  { id: "ch08-anki-39", q: "What are additions and improvements?", a: "Expenditures that increase operating efficiency or useful life.", pool: "expenditure_types", tags: ["balance_sheet"] },
  { id: "ch08-anki-40", q: "How are additions and improvements treated?", a: "Capitalised and depreciated over remaining useful life.", pool: "expenditure_types", tags: ["balance_sheet"] },
  { id: "ch08-anki-41", q: "Which accounting standard governs impairment?", a: "AASB 136 / IAS 36.", pool: "standards", tags: ["balance_sheet"] },
  { id: "ch08-anki-42", q: "What is an impairment loss?", a: "The amount by which carrying amount exceeds recoverable amount.", pool: "formulas", tags: ["balance_sheet"] },
  { id: "ch08-anki-43", q: "What is recoverable amount?", a: "The higher of fair value less costs to sell and value in use.", pool: "formulas", tags: ["balance_sheet"] },
  { id: "ch08-anki-44", q: "What is value in use?", a: "Present value of future cash flows expected from using the asset.", distractors: ["Fair value less costs to sell", "Original purchase price", "Net realisable value of inventory"], tags: ["balance_sheet"] },
  { id: "ch08-anki-45", q: "What is a cash-generating unit (CGU)?", a: "The smallest identifiable group of assets generating cash inflows.", distractors: ["A single cash transaction", "The entire statement of cash flows", "A division that only holds inventory"], tags: ["balance_sheet"] },
  { id: "ch08-anki-46", q: "When is an impairment loss recognised?", a: "When recoverable amount is less than carrying amount.", distractors: ["When fair value exceeds cost", "At every balance date regardless of value", "Only when an asset is disposed"], tags: ["balance_sheet"] },
  { id: "ch08-anki-47", q: "What is the journal entry for impairment?", a: "Dr Impairment Loss / Cr Accumulated Impairment Loss.", pool: "journal_patterns", tags: ["balance_sheet", "debit_credit"] },
  { id: "ch08-anki-48", q: "Can impairment losses be reversed?", a: "Yes, but carrying amount cannot exceed what it would have been without impairment.", pool: "yes_no", tags: ["balance_sheet"] },
  { id: "ch08-anki-49", q: "What is revaluation?", a: "Reassessment of an asset to fair value.", distractors: ["Allocation of cost over useful life", "Writing off an asset on disposal", "Recording ordinary repairs as capital expenditure"], tags: ["balance_sheet"] },
  { id: "ch08-anki-50", q: "Under AASB 116, how must classes of PPE be measured?", a: "Either on a cost basis or revaluation basis.", distractors: ["Always at net realisable value", "Only at historical cost with no revaluation allowed", "At replacement cost each period"], tags: ["balance_sheet"] },
  { id: "ch08-anki-51", q: "What is the first step before recording a revaluation?", a: "Record depreciation up to the revaluation date.", distractors: ["Write off accumulated depreciation completely", "Record disposal gain or loss first", "Reverse all prior impairment losses automatically"], tags: ["balance_sheet"] },
  { id: "ch08-anki-52", q: "How is a revaluation increment recorded?", a: "Dr Asset / Cr Revaluation Surplus.", pool: "journal_patterns", tags: ["balance_sheet", "debit_credit", "equity"] },
  { id: "ch08-anki-53", q: "Where is revaluation surplus reported?", a: "Equity.", distractors: ["Revenue in the income statement", "A liability account", "Accumulated depreciation"], tags: ["balance_sheet", "equity"] },
  { id: "ch08-anki-54", q: "How is a revaluation decrement recorded?", a: "Dr Revaluation Expense / Cr Asset.", pool: "journal_patterns", tags: ["balance_sheet", "debit_credit"] },
  { id: "ch08-anki-55", q: "What happens if a decrement reverses a previous increment?", a: "Decrease first reduces Revaluation Surplus before recognising expense.", distractors: ["Full amount is always expensed immediately", "Increment and decrement net to zero in cash", "Asset is written off completely"], tags: ["balance_sheet", "equity"] },
  { id: "ch08-anki-56", q: "What is gain or loss on disposal?", a: "Proceeds minus carrying amount.", pool: "formulas", tags: ["balance_sheet", "income_statement"] },
  { id: "ch08-anki-57", q: "What must be done before recording disposal?", a: "Record depreciation up to disposal date.", distractors: ["Revalue the asset to fair value", "Write off all accumulated depreciation", "Record impairment loss only"], tags: ["balance_sheet"] },
  { id: "ch08-anki-58", q: "If proceeds exceed carrying amount, what results?", a: "Gain on disposal.", distractors: ["Loss on disposal", "Impairment loss", "Revaluation surplus"], tags: ["balance_sheet", "income_statement"] },
  { id: "ch08-anki-59", q: "If proceeds are less than carrying amount, what results?", a: "Loss on disposal.", distractors: ["Gain on disposal", "Revaluation increment", "Amortisation expense"], tags: ["balance_sheet", "income_statement"] },
  { id: "ch08-anki-60", q: "What is the journal entry for a gain on disposal?", a: "Dr Cash; Dr Accumulated Depreciation; Cr Asset; Cr Gain on Disposal.", pool: "journal_patterns", tags: ["balance_sheet", "debit_credit"] },
  { id: "ch08-anki-61", q: "What is the journal entry for a loss on disposal?", a: "Dr Cash; Dr Accumulated Depreciation; Dr Loss on Disposal; Cr Asset.", pool: "journal_patterns", tags: ["balance_sheet", "debit_credit"] },
  { id: "ch08-anki-62", q: "What is an asset register?", a: "A detailed record of all non-current assets owned by the business.", distractors: ["The general ledger for all accounts", "A bank reconciliation schedule", "The statement of cash flows"], tags: ["balance_sheet"] },
  { id: "ch08-anki-63", q: "What information is kept in an asset register?", a: "Cost, depreciation, carrying amount, location, condition, and disposal details.", distractors: ["Only cash receipts and payments", "Customer credit limits only", "GST collected and paid"], tags: ["balance_sheet"] },
  { id: "ch08-anki-64", q: "Why is an asset register important?", a: "It supports internal control and asset tracking.", distractors: ["It replaces the need for depreciation", "It eliminates impairment testing", "It is required only for intangible assets"], tags: ["balance_sheet"] },
  { id: "ch08-anki-65", q: "What are intangible assets?", a: "Identifiable non-monetary assets without physical substance.", distractors: ["All non-current assets with physical form", "Cash equivalents and receivables", "Inventory held for resale"], tags: ["balance_sheet"] },
  { id: "ch08-anki-66", q: "Which accounting standard governs intangible assets?", a: "AASB 138.", pool: "standards", tags: ["balance_sheet"] },
  { id: "ch08-anki-67", q: "What is amortisation?", a: "Allocation of the cost of an intangible asset over its useful life.", distractors: ["Depreciation of PPE only", "Writing off goodwill immediately", "Depletion of natural resources only"], tags: ["balance_sheet"] },
  { id: "ch08-anki-68", q: "What is the journal entry for amortisation?", a: "Dr Amortisation Expense / Cr Accumulated Amortisation.", pool: "journal_patterns", tags: ["balance_sheet", "debit_credit"] },
  { id: "ch08-anki-69", q: "What is the difference between identifiable and unidentifiable intangibles?", a: "Identifiable intangibles can be separated or sold; unidentifiable intangibles cannot.", distractors: ["Identifiable intangibles are always expensed immediately", "Unidentifiable intangibles include patents only", "There is no difference under AASB 138"], tags: ["balance_sheet"] },
  { id: "ch08-anki-70", q: "What is goodwill?", a: "Future benefits from unidentifiable assets acquired in a business acquisition.", pool: "intangible_types", tags: ["balance_sheet"] },
  { id: "ch08-anki-71", q: "Can internally generated goodwill be recognised?", a: "No.", pool: "yes_no", tags: ["balance_sheet"] },
  { id: "ch08-anki-72", q: "What is a patent?", a: "Exclusive right to manufacture or sell an invention.", pool: "intangible_types", tags: ["balance_sheet"] },
  { id: "ch08-anki-73", q: "Over what period are patents amortised?", a: "Shorter of legal life or useful life.", distractors: ["Always over 10 years", "Only over legal life with no useful life consideration", "Never amortised under any circumstances"], tags: ["balance_sheet"] },
  { id: "ch08-anki-74", q: "What are copyrights?", a: "Exclusive rights to reproduce and sell artistic or published works.", pool: "intangible_types", tags: ["balance_sheet"] },
  { id: "ch08-anki-75", q: "What are trademarks and brand names?", a: "Words, phrases, or symbols identifying products or businesses.", pool: "intangible_types", tags: ["balance_sheet"] },
  { id: "ch08-anki-76", q: "What are franchises and licences?", a: "Contractual rights granted to another party.", pool: "intangible_types", tags: ["balance_sheet"] },
  { id: "ch08-anki-77", q: "What are R&D costs?", a: "Expenditures related to developing new products or processes.", distractors: ["Costs of purchasing PPE", "Depreciation on buildings", "Freight-in on inventory"], tags: ["balance_sheet"] },
  { id: "ch08-anki-78", q: "Which accounting standard governs agricultural assets?", a: "AASB 141 / IAS 41.", pool: "standards", tags: ["balance_sheet"] },
  { id: "ch08-anki-79", q: "What is a biological asset?", a: "A living animal or plant.", distractors: ["Harvested agricultural produce only", "Minerals extracted from the earth", "Patents and copyrights"], tags: ["balance_sheet"] },
  { id: "ch08-anki-80", q: "What is agricultural activity?", a: "Management of biological transformation for sale or production.", distractors: ["Purchase of inventory for resale", "Depreciation of farm machinery only", "Recording cash receipts from customers"], tags: ["balance_sheet"] },
  { id: "ch08-anki-81", q: "What happens to biological assets once harvested?", a: "They become agricultural produce and are treated as inventory.", distractors: ["They remain biological assets indefinitely", "They are written off as expense immediately", "They are reclassified as PPE"], tags: ["balance_sheet", "inventory"] },
  { id: "ch08-anki-82", q: "What criteria must biological assets meet for recognition?", a: "Future economic benefits probable and fair value/cost measurable reliably.", distractors: ["Must be sold within 12 months only", "Must have indefinite useful life", "Must be measured only at historical cost"], tags: ["balance_sheet"] },
  { id: "ch08-anki-83", q: "What are natural resources?", a: "Assets such as minerals, oil, gas, and timber extracted from the earth.", distractors: ["Land and buildings only", "Patents and licences", "Accounts receivable and cash"], tags: ["balance_sheet"] },
  { id: "ch08-anki-84", q: "What is depletion?", a: "Allocation of natural resource cost over extraction.", distractors: ["Depreciation of PPE over time", "Amortisation of intangible assets", "Writing down inventory to NRV"], tags: ["balance_sheet"] },
  { id: "ch08-anki-85", q: "What is depletable amount?", a: "Cost minus residual value.", pool: "formulas", tags: ["balance_sheet"] },
  { id: "ch08-anki-86", q: "What is the depletion rate formula?", a: "Depletable Cost ÷ Total Estimated Production.", pool: "formulas", tags: ["balance_sheet"] },
  { id: "ch08-anki-87", q: "How is depletion expense calculated?", a: "Depletion rate × units extracted.", distractors: ["Cost ÷ useful life in years", "Proceeds minus carrying amount", "Net sales ÷ average total assets"], tags: ["balance_sheet"] },
  { id: "ch08-anki-88", q: "What is the journal entry for depletion?", a: "Dr Inventory / Cr Accumulated Depletion.", pool: "journal_patterns", tags: ["balance_sheet", "debit_credit"] },
  { id: "ch08-anki-89", q: "How are non-current assets presented in the statement of financial position?", a: "As separate categories such as PPE and Intangibles.", distractors: ["Combined with current assets only", "As expenses in the income statement", "Only as a single line with no breakdown"], tags: ["balance_sheet", "financial_statements"] },
  { id: "ch08-anki-90", q: "What disclosures are required for PPE?", a: "Accounting policies and category breakdowns.", distractors: ["Only total asset turnover ratio", "Detailed disposal proceeds for every asset", "Customer names for all receivables"], tags: ["balance_sheet", "financial_statements"] },
  { id: "ch08-anki-91", q: "What does asset turnover measure?", a: "How efficiently assets generate revenue.", pool: "formulas", tags: ["financial_statements"] },
  { id: "ch08-anki-92", q: "What is the asset turnover formula?", a: "Net Sales ÷ Average Total Assets.", pool: "formulas", tags: ["financial_statements"] },
  { id: "ch08-anki-93", q: "What does average useful life of PPE estimate?", a: "Expected lifespan of the asset base.", distractors: ["How old the asset base is", "Gain or loss on disposal", "Impairment loss amount"], tags: ["financial_statements"] },
  { id: "ch08-anki-94", q: "What is the formula for average useful life of PPE?", a: "Average Cost of PPE ÷ Depreciation Expense.", pool: "formulas", tags: ["financial_statements"] },
  { id: "ch08-anki-95", q: "What does average age of PPE estimate?", a: "How old the asset base is.", distractors: ["Expected remaining lifespan", "Total cost of all PPE", "Proceeds from disposal"], tags: ["financial_statements"] },
  { id: "ch08-anki-96", q: "What is the formula for average age of PPE?", a: "Accumulated Depreciation ÷ Depreciation Expense.", pool: "formulas", tags: ["financial_statements"] },
  { id: "ch08-anki-97", q: "What is the biggest depreciation trap?", a: "Forgetting to subtract residual value before calculating depreciation.", distractors: ["Using market value instead of cost", "Recording revaluation in profit", "Treating depletion as time-based"], tags: ["error_correction"] },
  { id: "ch08-anki-98", q: "What is the biggest carrying amount trap?", a: "Using market value instead of cost minus accumulated depreciation.", distractors: ["Forgetting residual value in depreciation", "Using lower of recoverable amount components", "Recording disposal before updating depreciation"], tags: ["error_correction"] },
  { id: "ch08-anki-99", q: "What is the biggest impairment trap?", a: "Using the lower instead of higher amount when calculating recoverable amount.", distractors: ["Reversing impairment without limit", "Testing impairment only on disposal", "Recording impairment as revaluation surplus"], tags: ["error_correction"] },
  { id: "ch08-anki-100", q: "What is the biggest disposal trap?", a: "Forgetting to update depreciation before calculating gain/loss.", distractors: ["Recording gain in equity instead of income statement", "Debiting asset instead of accumulated depreciation", "Using proceeds minus original cost only"], tags: ["error_correction"] },
  { id: "ch08-anki-101", q: "What is the biggest revaluation trap?", a: "Recording revaluation increments in profit instead of equity.", distractors: ["Failing to depreciate before revaluation", "Using cost basis when revaluation is elected", "Writing off biological assets on harvest"], tags: ["error_correction"] },
  { id: "ch08-anki-102", q: "What is the biggest amortisation trap?", a: "Treating amortisation differently from depreciation conceptually.", distractors: ["Amortising goodwill that was internally generated", "Using units-of-production for all intangibles", "Recording amortisation as a liability"], tags: ["error_correction"] },
  { id: "ch08-anki-103", q: "What is the biggest depletion trap?", a: "Forgetting depletion is based on extraction, not time.", distractors: ["Using straight-line for all natural resources", "Crediting inventory instead of accumulated depletion", "Expensing all R&D immediately"], tags: ["error_correction"] },
  { id: "ch08-anki-104", q: "Formula: Straight-line depreciation.", a: "(Cost − Residual Value) ÷ Useful Life.", pool: "formulas", tags: ["balance_sheet"] },
  { id: "ch08-anki-105", q: "Formula: Diminishing-balance depreciation rate.", a: "1 − (Residual Value ÷ Cost)^(1/n).", distractors: ["(Cost − Residual Value) ÷ Useful Life", "Carrying Amount × Fixed Percentage only with no formula", "Proceeds ÷ Carrying Amount"], tags: ["balance_sheet"] },
  { id: "ch08-anki-106", q: "Formula: Units-of-production depreciation rate.", a: "(Cost − Residual Value) ÷ Total Estimated Units.", pool: "formulas", tags: ["balance_sheet"] },
  { id: "ch08-anki-107", q: "Formula: Impairment loss.", a: "Carrying Amount − Recoverable Amount.", pool: "formulas", tags: ["balance_sheet"] },
  { id: "ch08-anki-108", q: "Formula: Recoverable amount.", a: "Higher of fair value less costs to sell or value in use.", pool: "formulas", tags: ["balance_sheet"] },
  { id: "ch08-anki-109", q: "Formula: Gain/loss on disposal.", a: "Proceeds − Carrying Amount.", pool: "formulas", tags: ["balance_sheet", "income_statement"] },
  { id: "ch08-anki-110", q: "Formula: Depletion rate.", a: "Depletable Cost ÷ Total Estimated Production.", pool: "formulas", tags: ["balance_sheet"] },
  { id: "ch08-anki-111", q: "Formula: Asset turnover.", a: "Net Sales ÷ Average Total Assets.", pool: "formulas", tags: ["financial_statements"] },
  { id: "ch08-anki-112", q: "Formula: Average useful life of PPE.", a: "Average Cost of PPE ÷ Depreciation Expense.", pool: "formulas", tags: ["financial_statements"] },
  { id: "ch08-anki-113", q: "Formula: Average age of PPE.", a: "Accumulated Depreciation ÷ Depreciation Expense.", pool: "formulas", tags: ["financial_statements"] },
];

function pickDistractors(card) {
  if (card.distractors?.length >= 3) {
    return card.distractors.slice(0, 3);
  }

  const pool = card.pool ? DISTRACTOR_POOLS[card.pool] ?? [] : [];
  const normalizedAnswer = card.a.trim().toLowerCase();
  const candidates = pool.filter((option) => option.trim().toLowerCase() !== normalizedAnswer);

  if (candidates.length >= 3) {
    return candidates.slice(0, 3);
  }

  const fallback = [
    ...candidates,
    ...Object.values(DISTRACTOR_POOLS)
      .flat()
      .filter((option) => option.trim().toLowerCase() !== normalizedAnswer),
  ];

  const unique = [];
  for (const option of fallback) {
    const key = option.trim().toLowerCase();
    if (key === normalizedAnswer) continue;
    if (unique.some((existing) => existing.trim().toLowerCase() === key)) continue;
    unique.push(option);
    if (unique.length === 3) break;
  }

  while (unique.length < 3) {
    unique.push(`None of the above (variant ${unique.length + 1})`);
  }

  return unique.slice(0, 3);
}

function toMcq(card) {
  const distractors = pickDistractors(card);
  const options = [card.a, ...distractors];
  return {
    id: card.id,
    q: card.q,
    options,
    answer: 0,
    explanation: card.a,
    tags: card.tags ?? ["balance_sheet"],
  };
}

const mcqs = FLASHCARDS.map(toMcq);

const output = `// Auto-generated from Notion Anki Flashcards — Chapter 8
// Regenerate: bun scripts/generate-ch08-anki-mcqs.js

export const ankiMcqs = ${JSON.stringify(mcqs, null, 2)};
`;

await Bun.write(new URL("../src/data/chapters/ch08-anki-mcqs.js", import.meta.url), output);

console.log(`Generated ${mcqs.length} MCQs → src/data/chapters/ch08-anki-mcqs.js`);
