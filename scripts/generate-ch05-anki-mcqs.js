/**
 * Generates MCQs from Chapter 5 Anki flashcards (Notion).
 * Run: bun scripts/generate-ch05-anki-mcqs.js
 */

const DISTRACTOR_POOLS = {
  inventory_systems: [
    "Perpetual inventory system",
    "Periodic inventory system",
    "A system updated only at year-end",
    "A system that uses Purchases instead of Inventory",
  ],
  cost_flow_methods: [
    "FIFO (First-In, First-Out)",
    "LIFO (Last-In, First-Out)",
    "Weighted Average Cost",
    "Specific Identification",
  ],
  journal_patterns: [
    "Dr Purchases / Cr Accounts Payable",
    "Dr Inventory / Cr Accounts Payable",
    "Dr Accounts Payable / Cr Purchase Returns & Allowances",
    "Dr Accounts Payable / Cr Inventory",
    "Dr Freight-in / Cr Cash",
    "Dr Inventory / Cr Cash",
    "Dr Accounts Receivable / Cr Sales Revenue",
    "Dr Cost of Sales / Cr Inventory",
    "Dr Sales Returns & Allowances / Cr Accounts Receivable",
    "Dr Cash, Dr Sales Discounts / Cr Accounts Receivable",
    "Dr Loss on Write-Down of Inventory / Cr Inventory",
    "Dr Accounts Payable / Cr Purchase Discounts and Cash",
  ],
  inventory_categories: [
    "Raw materials",
    "Work in process (WIP)",
    "Finished goods",
    "Goods purchased for resale",
  ],
  fob: [
    "The buyer, once goods leave the seller's premises",
    "The seller, until goods arrive at the buyer's premises",
    "The carrier during transit",
    "Shared equally between buyer and seller",
  ],
  formulas: [
    "Beginning Inventory + Net Purchases − Ending Inventory",
    "Purchases + Freight-in − Purchase Returns & Allowances − Purchase Discounts",
    "Beginning Inventory + Net Purchases",
    "Cost of Goods Available for Sale ÷ Total Units Available for Sale",
    "Estimated Selling Price − Costs to Complete and Sell",
    "Cost of Sales ÷ Average Inventory",
    "(Beginning Inventory + Ending Inventory) ÷ 2",
    "365 ÷ Inventory Turnover",
    "Sales Revenue − Sales Returns & Allowances − Sales Discounts",
    "Net Sales Revenue − Cost of Sales",
  ],
  yes_no: ["Yes", "No", "Only under perpetual systems", "Only under periodic systems"],
  error_effects: [
    "Cost of sales is understated",
    "Cost of sales is overstated",
    "Profit is overstated",
    "Profit is understated",
    "Assets and equity are overstated",
    "Assets and equity are understated",
  ],
  principles: [
    "Consistency principle",
    "Conservatism / prudence",
    "Historical cost principle",
    "Matching principle",
  ],
};

/** @type {Array<{ id: string, q: string, a: string, pool?: keyof typeof DISTRACTOR_POOLS, distractors?: string[], tags?: string[] }>} */
const FLASHCARDS = [
  { id: "ch05-anki-01", q: "What is inventory?", a: "Inventory is goods held for sale in the ordinary course of business, or materials used to produce goods for sale.", distractors: ["Cash and accounts receivable only", "All non-current assets of a business", "Finished goods only, excluding raw materials"], tags: ["inventory"] },
  { id: "ch05-anki-02", q: "What is the main inventory category for a merchandising business?", a: "Goods purchased for resale.", pool: "inventory_categories", tags: ["inventory"] },
  { id: "ch05-anki-03", q: "What are the three inventory categories for a manufacturing business?", a: "Raw materials, work in process (WIP), and finished goods.", distractors: ["Purchases, freight-in, and cost of sales", "Beginning inventory, net purchases, and ending inventory", "FIFO, LIFO, and average cost"], tags: ["inventory"] },
  { id: "ch05-anki-04", q: "What are raw materials?", a: "Materials purchased but not yet placed into production.", pool: "inventory_categories", tags: ["inventory"] },
  { id: "ch05-anki-05", q: "What is work in process inventory?", a: "Partly manufactured goods that have been started but are not yet completed.", pool: "inventory_categories", tags: ["inventory"] },
  { id: "ch05-anki-06", q: "What are finished goods?", a: "Completed manufactured items ready for sale.", pool: "inventory_categories", tags: ["inventory"] },
  { id: "ch05-anki-07", q: "What is the key feature of the periodic inventory system?", a: "Inventory and cost of sales are not updated continuously. Cost of sales is calculated at the end of the period using a physical inventory count.", pool: "inventory_systems", tags: ["inventory"] },
  { id: "ch05-anki-08", q: "Under the periodic system, when is cost of sales recorded?", a: "At the end of the accounting period, not at the time of each sale.", distractors: ["At the time of each sale", "When cash is received from customers", "When purchase invoices are received"], tags: ["inventory"] },
  { id: "ch05-anki-09", q: "Under the periodic system, what account is debited when inventory is purchased?", a: "Purchases.", distractors: ["Inventory", "Cost of Sales", "Freight-out"], tags: ["inventory_purchases", "debit_credit"] },
  { id: "ch05-anki-10", q: "Under the perpetual system, what account is debited when inventory is purchased?", a: "Inventory.", distractors: ["Purchases", "Cost of Sales", "Freight-in only"], tags: ["inventory_purchases", "debit_credit"] },
  { id: "ch05-anki-11", q: "Under the periodic system, is inventory continuously updated?", a: "No. Inventory is updated at the end of the period after a physical count.", pool: "yes_no", tags: ["inventory"] },
  { id: "ch05-anki-12", q: "Under the periodic system, is a cost of sales entry made at the time of sale?", a: "No. Only the sales revenue entry is recorded at the time of sale.", pool: "yes_no", tags: ["inventory_sales"] },
  { id: "ch05-anki-13", q: "What type of businesses commonly use a periodic inventory system?", a: "Smaller businesses or businesses with low-cost inventory where continuous tracking is less practical.", distractors: ["Large retailers with scannable high-value goods", "Manufacturing businesses with WIP tracking", "Businesses required to use perpetual systems by law"], tags: ["inventory"] },
  { id: "ch05-anki-14", q: "What is the journal entry for purchasing inventory on credit under the periodic system?", a: "Dr Purchases / Cr Accounts Payable.", pool: "journal_patterns", tags: ["inventory_purchases", "debit_credit"] },
  { id: "ch05-anki-15", q: "What is the journal entry for returning inventory to a supplier under the periodic system?", a: "Dr Accounts Payable / Cr Purchase Returns & Allowances.", pool: "journal_patterns", tags: ["inventory_purchases", "debit_credit"] },
  { id: "ch05-anki-16", q: "What is the journal entry for paying freight on purchases under the periodic system?", a: "Dr Freight-in / Cr Cash.", pool: "journal_patterns", tags: ["inventory_purchases", "debit_credit"] },
  { id: "ch05-anki-17", q: "What is the journal entry for paying a supplier within the discount period under the periodic system?", a: "Dr Accounts Payable / Cr Purchase Discounts and Cash.", pool: "journal_patterns", tags: ["inventory_purchases", "debit_credit"] },
  { id: "ch05-anki-18", q: "What is the journal entry for a credit sale under the periodic system?", a: "Dr Accounts Receivable / Cr Sales Revenue.", pool: "journal_patterns", tags: ["inventory_sales", "debit_credit"] },
  { id: "ch05-anki-19", q: "What is missing from a sales entry under the periodic system compared with perpetual?", a: "There is no Dr Cost of Sales / Cr Inventory entry at the time of sale.", distractors: ["There is no Dr Accounts Receivable / Cr Sales Revenue entry", "There is no sales discount entry", "There is no GST entry"], tags: ["inventory_sales"] },
  { id: "ch05-anki-20", q: "What is the journal entry for a sales return under the periodic system?", a: "Dr Sales Returns & Allowances / Cr Accounts Receivable.", pool: "journal_patterns", tags: ["inventory_sales", "debit_credit"] },
  { id: "ch05-anki-21", q: "Is inventory restored at the time of a sales return under the periodic system?", a: "No. Inventory is only updated at the end of the period.", pool: "yes_no", tags: ["inventory_sales"] },
  { id: "ch05-anki-22", q: "What is the journal entry when a customer pays within the sales discount period?", a: "Dr Cash, Dr Sales Discounts / Cr Accounts Receivable.", pool: "journal_patterns", tags: ["inventory_sales", "debit_credit"] },
  { id: "ch05-anki-23", q: "Under which system is the inventory balance always current?", a: "Perpetual inventory system.", pool: "inventory_systems", tags: ["inventory"] },
  { id: "ch05-anki-24", q: "Under which system is a physical count required to calculate cost of sales?", a: "Periodic inventory system.", pool: "inventory_systems", tags: ["inventory"] },
  { id: "ch05-anki-25", q: "Under perpetual inventory, how is freight-in recorded?", a: "Dr Inventory / Cr Cash.", pool: "journal_patterns", tags: ["inventory_purchases", "debit_credit"] },
  { id: "ch05-anki-26", q: "Under periodic inventory, how is freight-in recorded?", a: "Dr Freight-in / Cr Cash.", pool: "journal_patterns", tags: ["inventory_purchases", "debit_credit"] },
  { id: "ch05-anki-27", q: "Under perpetual inventory, how is a purchase return recorded?", a: "Dr Accounts Payable / Cr Inventory.", pool: "journal_patterns", tags: ["inventory_purchases", "debit_credit"] },
  { id: "ch05-anki-28", q: "Under periodic inventory, how is a purchase return recorded?", a: "Dr Accounts Payable / Cr Purchase Returns & Allowances.", pool: "journal_patterns", tags: ["inventory_purchases", "debit_credit"] },
  { id: "ch05-anki-29", q: "Under perpetual inventory, what is the cost entry when goods are sold?", a: "Dr Cost of Sales / Cr Inventory.", pool: "journal_patterns", tags: ["inventory_sales", "debit_credit"] },
  { id: "ch05-anki-30", q: "Under periodic inventory, what is the cost entry when goods are sold?", a: "No cost entry is made at the time of sale.", distractors: ["Dr Cost of Sales / Cr Inventory", "Dr Purchases / Cr Inventory", "Dr Inventory / Cr Cost of Sales"], tags: ["inventory_sales"] },
  { id: "ch05-anki-31", q: "What is the formula for net purchases?", a: "Net Purchases = Purchases + Freight-in − Purchase Returns & Allowances − Purchase Discounts.", pool: "formulas", tags: ["inventory_purchases"] },
  { id: "ch05-anki-32", q: "What is the formula for cost of goods available for sale?", a: "Beginning Inventory + Net Purchases.", pool: "formulas", tags: ["inventory"] },
  { id: "ch05-anki-33", q: "What is the formula for cost of sales under the periodic system?", a: "Beginning Inventory + Net Purchases − Ending Inventory.", pool: "formulas", tags: ["inventory"] },
  { id: "ch05-anki-34", q: "What does ending inventory come from under the periodic system?", a: "A physical inventory count at the end of the period.", distractors: ["The perpetual inventory ledger balance", "FIFO cost flow calculations only", "The purchases account balance"], tags: ["inventory"] },
  { id: "ch05-anki-35", q: "If beginning inventory is $8,000, net purchases are $32,000, and ending inventory is $6,000, what is cost of sales?", a: "$34,000. Calculation: $8,000 + $32,000 − $6,000 = $34,000.", distractors: ["$46,000", "$26,000", "$40,000"], tags: ["inventory"] },
  { id: "ch05-anki-36", q: "What does FOB stand for?", a: "Free On Board.", distractors: ["Freight On Boarding", "Free Of Brokerage", "Forward On Balance"], tags: ["inventory_purchases"] },
  { id: "ch05-anki-37", q: "Under FOB Shipping Point, when does ownership transfer to the buyer?", a: "When goods leave the seller's premises.", distractors: ["When goods arrive at the buyer's premises", "When payment is made", "When the invoice is issued"], tags: ["inventory_purchases"] },
  { id: "ch05-anki-38", q: "Under FOB Shipping Point, who owns goods in transit?", a: "The buyer.", pool: "fob", tags: ["inventory_purchases"] },
  { id: "ch05-anki-39", q: "Under FOB Destination, when does ownership transfer to the buyer?", a: "When goods arrive at the buyer's premises.", distractors: ["When goods leave the seller's premises", "When the carrier picks up the goods", "When the purchase order is signed"], tags: ["inventory_purchases"] },
  { id: "ch05-anki-40", q: "Under FOB Destination, who owns goods in transit?", a: "The seller.", pool: "fob", tags: ["inventory_purchases"] },
  { id: "ch05-anki-41", q: "At balance date, should goods in transit under FOB Shipping Point be included in the buyer's inventory?", a: "Yes, because ownership has passed to the buyer once goods are shipped.", pool: "yes_no", tags: ["inventory_purchases", "balance_sheet"] },
  { id: "ch05-anki-42", q: "At balance date, should goods in transit under FOB Destination be included in the buyer's inventory?", a: "No, because ownership does not pass until delivery.", pool: "yes_no", tags: ["inventory_purchases", "balance_sheet"] },
  { id: "ch05-anki-43", q: "Why does the periodic system show more detail in the cost of sales section?", a: "Because cost of sales must be calculated using beginning inventory, net purchases, and ending inventory.", distractors: ["Because GST must be shown separately", "Because perpetual systems hide purchase details", "Because operating expenses are included in cost of sales"], tags: ["inventory", "income_statement"] },
  { id: "ch05-anki-44", q: "What is net sales revenue?", a: "Sales Revenue − Sales Returns & Allowances − Sales Discounts.", pool: "formulas", tags: ["inventory_sales", "income_statement"] },
  { id: "ch05-anki-45", q: "What is gross profit?", a: "Net Sales Revenue − Cost of Sales.", pool: "formulas", tags: ["inventory_sales", "income_statement"] },
  { id: "ch05-anki-46", q: "What is profit before tax?", a: "Gross Profit + Other Revenue − Operating Expenses.", distractors: ["Net Sales − Cost of Sales", "Revenue − Total Expenses including tax", "Gross Profit − Cost of Sales"], tags: ["income_statement"] },
  { id: "ch05-anki-47", q: "Why are inventory cost flow methods needed?", a: "Because identical inventory items may be purchased at different costs, so a method is needed to assign costs to cost of sales and ending inventory.", distractors: ["Because GST must be allocated to each unit", "Because physical counts are never required", "Because all inventory must use the same purchase price"], tags: ["inventory"] },
  { id: "ch05-anki-48", q: "What are the four inventory cost flow methods?", a: "Specific Identification, FIFO, LIFO, and Average Cost.", pool: "cost_flow_methods", tags: ["inventory"] },
  { id: "ch05-anki-49", q: "What is specific identification?", a: "A method that tracks the actual cost of each specific item sold.", pool: "cost_flow_methods", tags: ["inventory"] },
  { id: "ch05-anki-50", q: "What types of businesses use specific identification?", a: "Businesses selling high-value, individually identifiable goods, such as cars, jewellery, or antiques.", distractors: ["Supermarkets and discount retailers", "Businesses with identical low-cost items", "Service businesses with no inventory"], tags: ["inventory"] },
  { id: "ch05-anki-51", q: "What does FIFO stand for?", a: "First-In, First-Out.", distractors: ["First-In, Last-Out", "Fixed Inventory, Fixed Output", "Final Inventory, Final Output"], tags: ["inventory"] },
  { id: "ch05-anki-52", q: "What does FIFO assume?", a: "The first goods purchased are the first goods sold.", distractors: ["The last goods purchased are the first goods sold", "An average cost is applied to all units", "Each specific item's cost is tracked"], tags: ["inventory"] },
  { id: "ch05-anki-53", q: "Under FIFO, ending inventory is made up of which costs?", a: "The most recent costs.", distractors: ["The oldest costs", "An average of all purchase costs", "The highest-cost items only"], tags: ["inventory", "balance_sheet"] },
  { id: "ch05-anki-54", q: "What does LIFO stand for?", a: "Last-In, First-Out.", distractors: ["Last-In, Last-Out", "Lower Inventory, Fixed Output", "Latest Invoice, First Order"], tags: ["inventory"] },
  { id: "ch05-anki-55", q: "What does LIFO assume?", a: "The last goods purchased are the first goods sold.", distractors: ["The first goods purchased are the first goods sold", "Costs are assigned by specific identification", "All units use the same average cost"], tags: ["inventory"] },
  { id: "ch05-anki-56", q: "Under LIFO, ending inventory is made up of which costs?", a: "The oldest costs.", distractors: ["The most recent costs", "The average of all costs", "Replacement cost at balance date"], tags: ["inventory", "balance_sheet"] },
  { id: "ch05-anki-57", q: "Is LIFO permitted in Australia and New Zealand?", a: "No. LIFO is not permitted under AASB 102 / IAS 2.", pool: "yes_no", tags: ["inventory"] },
  { id: "ch05-anki-58", q: "What is the average cost method?", a: "A method where a weighted average unit cost is applied to units sold and units in ending inventory.", pool: "cost_flow_methods", tags: ["inventory"] },
  { id: "ch05-anki-59", q: "What is the weighted average unit cost formula?", a: "Cost of Goods Available for Sale ÷ Total Units Available for Sale.", pool: "formulas", tags: ["inventory"] },
  { id: "ch05-anki-60", q: "In a period of rising prices, which method gives the lowest cost of sales?", a: "FIFO.", pool: "cost_flow_methods", tags: ["inventory", "income_statement"] },
  { id: "ch05-anki-61", q: "In a period of rising prices, which method gives the highest gross profit?", a: "FIFO.", pool: "cost_flow_methods", tags: ["inventory", "income_statement"] },
  { id: "ch05-anki-62", q: "In a period of rising prices, which method gives the highest ending inventory?", a: "FIFO, because ending inventory is valued using recent higher costs.", distractors: ["LIFO, because ending inventory uses oldest costs", "Average cost always gives the highest ending inventory", "Specific identification always gives the lowest ending inventory"], tags: ["inventory", "balance_sheet"] },
  { id: "ch05-anki-63", q: "In a period of rising prices, which method gives the highest cost of sales?", a: "LIFO.", pool: "cost_flow_methods", tags: ["inventory", "income_statement"] },
  { id: "ch05-anki-64", q: "In a period of rising prices, which method gives the lowest gross profit?", a: "LIFO.", pool: "cost_flow_methods", tags: ["inventory", "income_statement"] },
  { id: "ch05-anki-65", q: "In a period of rising prices, why does LIFO produce lower tax?", a: "Because higher cost of sales reduces profit, which reduces taxable income.", distractors: ["Because LIFO is not permitted in Australia", "Because ending inventory is valued at highest costs", "Because LIFO increases gross profit"], tags: ["inventory", "income_statement"] },
  { id: "ch05-anki-66", q: "Why is FIFO ending inventory closest to current cost during rising prices?", a: "Because FIFO leaves the newest purchase costs in ending inventory.", distractors: ["Because FIFO uses the oldest costs for ending inventory", "Because FIFO eliminates the need for physical counts", "Because FIFO always produces the lowest ending inventory"], tags: ["inventory", "balance_sheet"] },
  { id: "ch05-anki-67", q: "What result does average cost usually produce compared with FIFO and LIFO?", a: "A middle result for cost of sales, gross profit, tax, and ending inventory.", distractors: ["Always the same as FIFO", "Always the highest gross profit", "Always the lowest ending inventory"], tags: ["inventory"] },
  { id: "ch05-anki-68", q: "What accounting principle requires a business to use the same inventory method from period to period?", a: "The consistency principle.", pool: "principles", tags: ["inventory"] },
  { id: "ch05-anki-69", q: "What must a business do if it changes inventory cost flow method?", a: "Disclose the change and its effect on profit in the notes.", distractors: ["No disclosure is required", "Restate all prior periods automatically", "Switch back after one period"], tags: ["inventory"] },
  { id: "ch05-anki-70", q: "What does LCNRV stand for?", a: "Lower of Cost and Net Realisable Value.", distractors: ["Lower of Cost and Net Revenue Value", "Latest Cost and Net Realisable Value", "Lower of Cash and Net Realisable Value"], tags: ["inventory", "balance_sheet"] },
  { id: "ch05-anki-71", q: "What is net realisable value?", a: "Estimated selling price less costs to complete and sell.", pool: "formulas", tags: ["inventory", "balance_sheet"] },
  { id: "ch05-anki-72", q: "What is the NRV formula?", a: "NRV = Estimated Selling Price − Costs to Complete and Sell.", pool: "formulas", tags: ["inventory", "balance_sheet"] },
  { id: "ch05-anki-73", q: "When must inventory be written down?", a: "When NRV is lower than cost.", distractors: ["When NRV is higher than cost", "When selling prices rise", "At every balance date regardless of NRV"], tags: ["inventory", "balance_sheet"] },
  { id: "ch05-anki-74", q: "If cost is lower than NRV, what amount is inventory reported at?", a: "Cost.", distractors: ["NRV", "Replacement cost", "The higher of cost and NRV"], tags: ["inventory", "balance_sheet"] },
  { id: "ch05-anki-75", q: "If NRV is lower than cost, what amount is inventory reported at?", a: "NRV.", distractors: ["Cost", "Original purchase price only", "Average cost"], tags: ["inventory", "balance_sheet"] },
  { id: "ch05-anki-76", q: "Which accounting principle supports LCNRV?", a: "Conservatism / prudence — assets should not be overstated.", pool: "principles", tags: ["inventory", "balance_sheet"] },
  { id: "ch05-anki-77", q: "What is the journal entry to write inventory down to NRV?", a: "Dr Loss on Write-Down of Inventory / Cr Inventory.", pool: "journal_patterns", tags: ["inventory", "debit_credit"] },
  { id: "ch05-anki-78", q: "What does inventory turnover measure?", a: "How many times inventory is sold and replaced during a period.", distractors: ["Gross profit as a percentage of sales", "Days to collect accounts receivable", "The cost of holding inventory in a warehouse"], tags: ["inventory", "financial_statements"] },
  { id: "ch05-anki-79", q: "What is the inventory turnover formula?", a: "Cost of Sales ÷ Average Inventory.", pool: "formulas", tags: ["inventory", "financial_statements"] },
  { id: "ch05-anki-80", q: "What is the average inventory formula?", a: "(Beginning Inventory + Ending Inventory) ÷ 2.", pool: "formulas", tags: ["inventory", "financial_statements"] },
  { id: "ch05-anki-81", q: "What does high inventory turnover usually indicate?", a: "Inventory is selling quickly, with lower risk of obsolescence.", distractors: ["Slow-moving inventory and high holding costs", "Overstated ending inventory", "Rising purchase costs"], tags: ["inventory", "financial_statements"] },
  { id: "ch05-anki-82", q: "What does low inventory turnover usually indicate?", a: "Slow-moving inventory, higher holding costs, or possible obsolescence.", distractors: ["Inventory is selling quickly", "Strong gross profit margins", "Efficient stock management"], tags: ["inventory", "financial_statements"] },
  { id: "ch05-anki-83", q: "What is the days in inventory formula?", a: "365 ÷ Inventory Turnover.", pool: "formulas", tags: ["inventory", "financial_statements"] },
  { id: "ch05-anki-84", q: "What does a lower days in inventory figure generally mean?", a: "Inventory is sold more quickly.", distractors: ["Inventory is held longer before sale", "Higher risk of obsolescence", "Lower gross profit"], tags: ["inventory", "financial_statements"] },
  { id: "ch05-anki-85", q: "Under the perpetual system, when are cost flow methods applied?", a: "At the time of each sale, because the inventory ledger is updated continuously.", distractors: ["Only at the end of the period after a physical count", "Only when LCNRV is calculated", "Only for FIFO and not for average cost"], tags: ["inventory"] },
  { id: "ch05-anki-86", q: "Does FIFO give the same result under periodic and perpetual systems?", a: "Yes. FIFO produces the same ending inventory and cost of sales under both systems.", pool: "yes_no", tags: ["inventory"] },
  { id: "ch05-anki-87", q: "Can LIFO produce different results under periodic and perpetual systems?", a: "Yes, because perpetual LIFO uses the most recent costs available at the time of each sale.", pool: "yes_no", tags: ["inventory"] },
  { id: "ch05-anki-88", q: "Under perpetual inventory, what is average cost called?", a: "Moving average cost.", distractors: ["Weighted average cost at period end", "Specific identification", "Periodic average cost"], tags: ["inventory"] },
  { id: "ch05-anki-89", q: "When is moving average cost recalculated?", a: "After each purchase.", distractors: ["Only at year-end", "Only when goods are sold", "Only when NRV falls below cost"], tags: ["inventory"] },
  { id: "ch05-anki-90", q: "Can periodic weighted average and perpetual moving average produce different results?", a: "Yes, because periodic average is calculated at period end, while moving average is recalculated after each purchase.", pool: "yes_no", tags: ["inventory"] },
  { id: "ch05-anki-91", q: "Why do inventory errors affect two accounting periods?", a: "Because ending inventory in one period becomes beginning inventory in the next period.", distractors: ["Because inventory errors never reverse", "Because GST must be recalculated", "Because only the income statement is affected"], tags: ["inventory", "error_correction"] },
  { id: "ch05-anki-92", q: "If ending inventory is overstated, what happens to cost of sales in the current period?", a: "Cost of sales is understated.", pool: "error_effects", tags: ["inventory", "error_correction"] },
  { id: "ch05-anki-93", q: "If ending inventory is overstated, what happens to profit in the current period?", a: "Profit is overstated.", pool: "error_effects", tags: ["inventory", "error_correction"] },
  { id: "ch05-anki-94", q: "If ending inventory is overstated, what happens to profit in the next period?", a: "Profit is understated because beginning inventory is overstated.", distractors: ["Profit is overstated again", "Profit is unaffected", "Cost of sales is understated in the next period"], tags: ["inventory", "error_correction"] },
  { id: "ch05-anki-95", q: "If ending inventory is understated, what happens to cost of sales in the current period?", a: "Cost of sales is overstated.", pool: "error_effects", tags: ["inventory", "error_correction"] },
  { id: "ch05-anki-96", q: "If ending inventory is understated, what happens to profit in the current period?", a: "Profit is understated.", pool: "error_effects", tags: ["inventory", "error_correction"] },
  { id: "ch05-anki-97", q: "If ending inventory is understated, what happens to profit in the next period?", a: "Profit is overstated because beginning inventory is understated.", distractors: ["Profit is understated again", "Profit is unaffected", "Assets and equity are overstated"], tags: ["inventory", "error_correction"] },
  { id: "ch05-anki-98", q: "Do inventory errors self-correct?", a: "Yes, over two accounting periods.", pool: "yes_no", tags: ["inventory", "error_correction"] },
  { id: "ch05-anki-99", q: "If ending inventory is overstated, what happens to assets and equity?", a: "Assets and equity are overstated.", pool: "error_effects", tags: ["inventory", "error_correction", "balance_sheet"] },
  { id: "ch05-anki-100", q: "If ending inventory is understated, what happens to assets and equity?", a: "Assets and equity are understated.", pool: "error_effects", tags: ["inventory", "error_correction", "balance_sheet"] },
  { id: "ch05-anki-101", q: "Why do merchandising entities have extra closing entries?", a: "They use additional temporary accounts such as Sales Returns, Sales Discounts, Cost of Sales, Purchases, Purchase Returns, Purchase Discounts, and Freight-in.", distractors: ["They do not use Income Summary", "They have no temporary accounts", "Only service businesses need closing entries"], tags: ["inventory"] },
  { id: "ch05-anki-102", q: "Under the perpetual system, what main accounts are closed to Income Summary?", a: "Sales Revenue, Sales Returns & Allowances, Sales Discounts, Cost of Sales, and operating expenses.", distractors: ["Purchases, Freight-in, and Purchase Returns only", "Only asset and liability accounts", "Inventory and Accounts Payable"], tags: ["inventory"] },
  { id: "ch05-anki-103", q: "Under the periodic system, what extra purchase-related accounts must be closed?", a: "Purchases, Freight-in, Purchase Returns & Allowances, and Purchase Discounts.", distractors: ["Inventory and Cost of Sales only", "Accounts Receivable and Cash", "GST Collected and GST Paid"], tags: ["inventory"] },
  { id: "ch05-anki-104", q: "How is ending inventory brought into the records during periodic closing?", a: "Dr Ending Inventory / Cr Income Summary.", distractors: ["Dr Income Summary / Cr Ending Inventory", "Dr Purchases / Cr Inventory", "Dr Cost of Sales / Cr Inventory"], tags: ["inventory", "debit_credit"] },
  { id: "ch05-anki-105", q: "How is beginning inventory removed during periodic closing?", a: "Dr Income Summary / Cr Beginning Inventory.", distractors: ["Dr Beginning Inventory / Cr Income Summary", "Dr Inventory / Cr Purchases", "Dr Cost of Sales / Cr Beginning Inventory"], tags: ["inventory", "debit_credit"] },
  { id: "ch05-anki-106", q: "After Income Summary is closed, what account is closed last?", a: "Dividends are closed to Retained Earnings.", distractors: ["Sales Revenue is closed to Cash", "Inventory is closed to Cost of Sales", "Accounts Payable is closed to Purchases"], tags: ["inventory", "equity"] },
  { id: "ch05-anki-107", q: "What is the biggest periodic inventory trap in journal entries?", a: "Recording cost of sales at the time of sale. Under periodic inventory, no cost of sales entry is made until period end.", distractors: ["Debiting Inventory instead of Purchases on purchase", "Recording freight-in to Inventory under periodic", "Including FOB Destination goods in buyer's inventory"], tags: ["inventory", "error_correction"] },
  { id: "ch05-anki-108", q: "What is the biggest freight-in trap?", a: "Under periodic inventory freight-in is debited to Freight-in, but under perpetual inventory it is debited to Inventory.", distractors: ["Freight-in is always an operating expense", "Freight-in is never included in inventory cost", "Freight-out is added to inventory cost"], tags: ["inventory_purchases", "error_correction"] },
  { id: "ch05-anki-109", q: "What is the biggest FOB trap?", a: "Including goods in the wrong business's inventory at balance date. FOB Shipping Point belongs to the buyer; FOB Destination belongs to the seller until delivery.", distractors: ["Treating FOB as a cost flow method", "Recording FOB terms in the sales discount account", "Assuming ownership always transfers at payment"], tags: ["inventory_purchases", "error_correction"] },
  { id: "ch05-anki-110", q: "What is the biggest LCNRV trap?", a: "Writing inventory up when NRV is above cost. Inventory is not written up; it stays at cost.", distractors: ["Writing inventory down when cost is below NRV", "Using replacement cost instead of NRV", "Ignoring NRV when it is lower than cost"], tags: ["inventory", "error_correction"] },
  { id: "ch05-anki-111", q: "What is the biggest inventory error trap?", a: "Forgetting that ending inventory errors reverse in the next period because ending inventory becomes beginning inventory.", distractors: ["Assuming inventory errors never self-correct", "Believing only the balance sheet is affected", "Thinking overstated inventory always increases next period profit"], tags: ["inventory", "error_correction"] },
  { id: "ch05-anki-112", q: "What is the biggest LIFO trap in Aus/NZ courses?", a: "Treating LIFO as allowed. LIFO may be shown for comparison, but it is not permitted under AASB 102 / IAS 2.", distractors: ["Using FIFO when LIFO is required", "Assuming LIFO gives the highest gross profit in rising prices", "Believing LIFO is the default method in Australia"], tags: ["inventory", "error_correction"] },
  { id: "ch05-anki-113", q: "Journalise: Bought inventory on credit under periodic system.", a: "Dr Purchases / Cr Accounts Payable.", pool: "journal_patterns", tags: ["inventory_purchases", "debit_credit"] },
  { id: "ch05-anki-114", q: "Journalise: Bought inventory on credit under perpetual system.", a: "Dr Inventory / Cr Accounts Payable.", pool: "journal_patterns", tags: ["inventory_purchases", "debit_credit"] },
  { id: "ch05-anki-115", q: "Journalise: Paid freight on purchases under periodic system.", a: "Dr Freight-in / Cr Cash.", pool: "journal_patterns", tags: ["inventory_purchases", "debit_credit"] },
  { id: "ch05-anki-116", q: "Journalise: Paid freight on purchases under perpetual system.", a: "Dr Inventory / Cr Cash.", pool: "journal_patterns", tags: ["inventory_purchases", "debit_credit"] },
  { id: "ch05-anki-117", q: "Journalise: Returned goods to supplier under periodic system.", a: "Dr Accounts Payable / Cr Purchase Returns & Allowances.", pool: "journal_patterns", tags: ["inventory_purchases", "debit_credit"] },
  { id: "ch05-anki-118", q: "Journalise: Returned goods to supplier under perpetual system.", a: "Dr Accounts Payable / Cr Inventory.", pool: "journal_patterns", tags: ["inventory_purchases", "debit_credit"] },
  { id: "ch05-anki-119", q: "Journalise: Sold goods on credit under periodic system.", a: "Dr Accounts Receivable / Cr Sales Revenue. No cost of sales entry at sale date.", distractors: ["Dr Accounts Receivable / Cr Sales Revenue; Dr Cost of Sales / Cr Inventory", "Dr Cash / Cr Sales Revenue only", "Dr Sales Revenue / Cr Accounts Receivable"], tags: ["inventory_sales", "debit_credit"] },
  { id: "ch05-anki-120", q: "Journalise: Sold goods on credit under perpetual system.", a: "Dr Accounts Receivable / Cr Sales Revenue; Dr Cost of Sales / Cr Inventory.", distractors: ["Dr Accounts Receivable / Cr Sales Revenue only", "Dr Purchases / Cr Accounts Payable", "Dr Inventory / Cr Sales Revenue"], tags: ["inventory_sales", "debit_credit"] },
  { id: "ch05-anki-121", q: "Journalise: Write inventory down to NRV.", a: "Dr Loss on Write-Down of Inventory / Cr Inventory.", pool: "journal_patterns", tags: ["inventory", "debit_credit"] },
  { id: "ch05-anki-122", q: "Journalise: Customer pays within discount period.", a: "Dr Cash; Dr Sales Discounts; Cr Accounts Receivable.", pool: "journal_patterns", tags: ["inventory_sales", "debit_credit"] },
  { id: "ch05-anki-123", q: "Formula: Net purchases.", a: "Purchases + Freight-in − Purchase Returns & Allowances − Purchase Discounts.", pool: "formulas", tags: ["inventory_purchases"] },
  { id: "ch05-anki-124", q: "Formula: Cost of goods available for sale.", a: "Beginning Inventory + Net Purchases.", pool: "formulas", tags: ["inventory"] },
  { id: "ch05-anki-125", q: "Formula: Cost of sales under periodic system.", a: "Beginning Inventory + Net Purchases − Ending Inventory.", pool: "formulas", tags: ["inventory"] },
  { id: "ch05-anki-126", q: "Formula: Weighted average unit cost.", a: "Cost of Goods Available for Sale ÷ Total Units Available for Sale.", pool: "formulas", tags: ["inventory"] },
  { id: "ch05-anki-127", q: "Formula: Net realisable value.", a: "Estimated Selling Price − Costs to Complete and Sell.", pool: "formulas", tags: ["inventory", "balance_sheet"] },
  { id: "ch05-anki-128", q: "Formula: Inventory turnover.", a: "Cost of Sales ÷ Average Inventory.", pool: "formulas", tags: ["inventory", "financial_statements"] },
  { id: "ch05-anki-129", q: "Formula: Average inventory.", a: "(Beginning Inventory + Ending Inventory) ÷ 2.", pool: "formulas", tags: ["inventory", "financial_statements"] },
  { id: "ch05-anki-130", q: "Formula: Days in inventory.", a: "365 ÷ Inventory Turnover.", pool: "formulas", tags: ["inventory", "financial_statements"] },
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
    tags: card.tags ?? ["inventory"],
  };
}

const mcqs = FLASHCARDS.map(toMcq);

const output = `// Auto-generated from Notion Anki Flashcards — Chapter 5
// Regenerate: bun scripts/generate-ch05-anki-mcqs.js

export const ankiMcqs = ${JSON.stringify(mcqs, null, 2)};
`;

await Bun.write(new URL("../src/data/chapters/ch05-anki-mcqs.js", import.meta.url), output);

console.log(`Generated ${mcqs.length} MCQs → src/data/chapters/ch05-anki-mcqs.js`);
