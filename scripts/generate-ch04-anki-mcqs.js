/**
 * Generates MCQs from Chapter 4 Anki flashcards (Notion).
 * Run: bun scripts/generate-ch04-anki-mcqs.js
 */

const DISTRACTOR_POOLS = {
  inventory_systems: [
    "A system where inventory records are updated continuously with every purchase and sale",
    "A system where inventory records are not continuously updated",
    "A system that records inventory only at year-end",
    "A system that uses cost of sales calculated after a physical stocktake",
  ],
  journal_patterns: [
    "Debit Inventory; Credit Accounts Payable",
    "Debit Accounts Payable; Credit Inventory",
    "Debit Cash; Credit Sales Revenue",
    "Debit Cost of Sales; Credit Inventory",
    "Debit Accounts Receivable; Credit Sales Revenue",
    "Debit Cash; Debit Sales Discounts; Credit Accounts Receivable",
    "Debit Inventory; Credit Cost of Sales",
    "Debit Delivery Expense; Credit Cash",
    "Debit Inventory; Debit GST Paid; Credit Accounts Payable",
    "Debit Accounts Receivable; Credit Sales Revenue; Credit GST Collected",
  ],
  account_types: [
    "An asset",
    "A liability",
    "An expense",
    "Revenue",
    "Equity",
  ],
  expense_categories: [
    "Cost of sales",
    "Selling expenses",
    "Administration expenses",
    "Financial expenses",
    "Other revenue",
  ],
  gst_rates: ["5%", "10%", "12%", "15%", "20%"],
  gst_classification: [
    "An asset",
    "A liability",
    "Revenue",
    "An expense",
  ],
  discount_types: [
    "Settlement discount",
    "Trade discount",
    "Sales discount",
    "Purchase allowance",
  ],
  yes_no: ["Yes", "No", "Only for periodic systems", "Only for service businesses"],
  freight: [
    "Added to the cost of inventory",
    "Recorded as an operating expense",
    "Deducted from sales revenue",
    "Recorded as a liability",
  ],
  ratios: [
    "Gross Profit ÷ Net Sales × 100",
    "Operating Expenses ÷ Net Sales × 100",
    "Net Sales ÷ Cost of Sales × 100",
    "Profit ÷ Total Assets × 100",
  ],
};

/** @type {Array<{ id: string, q: string, a: string, pool?: keyof typeof DISTRACTOR_POOLS, distractors?: string[], tags?: string[] }>} */
const FLASHCARDS = [
  { id: "ch04-anki-01", q: "What is the main difference between a service business and a merchandising business?", a: "A service business provides services, while a merchandising business buys and resells goods.", distractors: ["A service business sells inventory; a merchandising business provides services", "Both business types earn revenue only from selling goods", "A merchandising business has no cost of sales"], tags: ["inventory"] },
  { id: "ch04-anki-02", q: "What is the primary activity of a merchandising business?", a: "Purchasing inventory and reselling it to customers.", distractors: ["Providing professional services to clients", "Manufacturing goods from raw materials", "Lending money and earning interest"], tags: ["inventory"] },
  { id: "ch04-anki-03", q: "What is the main revenue source for a merchandising business?", a: "Sales revenue.", distractors: ["Service revenue", "Interest revenue", "Commission revenue"], tags: ["inventory_sales"] },
  { id: "ch04-anki-04", q: "What additional major expense exists in merchandising businesses?", a: "Cost of sales (cost of goods sold).", pool: "expense_categories", tags: ["inventory", "income_statement"] },
  { id: "ch04-anki-05", q: "Do merchandising businesses have inventory?", a: "Yes.", pool: "yes_no", tags: ["inventory"] },
  { id: "ch04-anki-06", q: "Give examples of merchandising businesses.", a: "Supermarkets, clothing stores, furniture stores, and department stores.", distractors: ["Law firms, accounting firms, and consulting agencies", "Banks, insurance companies, and investment funds", "Construction contractors and engineering consultancies"], tags: ["inventory"] },
  { id: "ch04-anki-07", q: "What is gross profit?", a: "Sales revenue minus cost of sales.", distractors: ["Net sales minus operating expenses", "Total revenue minus total expenses", "Cash received minus cash paid"], tags: ["inventory_sales", "income_statement"] },
  { id: "ch04-anki-08", q: "State the gross profit formula.", a: "Gross Profit = Sales Revenue − Cost of Sales.", distractors: ["Gross Profit = Net Sales − Operating Expenses", "Gross Profit = Revenue − Total Expenses", "Gross Profit = Cash Received − Cost of Sales"], tags: ["inventory_sales", "income_statement"] },
  { id: "ch04-anki-09", q: "State the profit formula for merchandising businesses.", a: "Profit = Gross Profit + Other Revenue − Operating Expenses.", distractors: ["Profit = Sales Revenue − Cost of Sales", "Profit = Net Sales − Cost of Sales − GST", "Profit = Gross Profit − Cost of Sales"], tags: ["income_statement"] },
  { id: "ch04-anki-10", q: "What are the two main categories of expenses in a merchandising business?", a: "Cost of sales and operating expenses.", pool: "expense_categories", tags: ["income_statement"] },
  { id: "ch04-anki-11", q: "What does cost of sales represent?", a: "The direct cost of inventory sold to customers.", distractors: ["All expenses incurred in running the business", "Delivery costs paid by the seller", "Advertising and marketing costs"], tags: ["inventory_sales", "income_statement"] },
  { id: "ch04-anki-12", q: "What are operating expenses?", a: "All other expenses incurred in running the business.", distractors: ["The direct cost of inventory sold", "GST paid to suppliers", "Purchase discounts received"], tags: ["income_statement"] },
  { id: "ch04-anki-13", q: "What is the operating cycle of a merchandising business?", a: "Cash → Purchase Inventory → Sell Inventory → Collect Cash → Repeat.", distractors: ["Cash → Pay Expenses → Record Revenue → Close Accounts", "Inventory → Revenue → Expense → Dividends", "Purchase → Manufacture → Distribute → Advertise"], tags: ["inventory"] },
  { id: "ch04-anki-14", q: "What is a perpetual inventory system?", a: "A system where inventory records are updated continuously with every purchase and sale.", pool: "inventory_systems", tags: ["inventory"] },
  { id: "ch04-anki-15", q: "Under the perpetual inventory system, when is cost of sales recorded?", a: "At the time of each sale.", distractors: ["At the end of the accounting period after a stocktake", "Only when cash is received", "At year-end only"], tags: ["inventory", "inventory_sales"] },
  { id: "ch04-anki-16", q: "What type of businesses commonly use perpetual inventory systems?", a: "Businesses with high-value or scannable goods.", distractors: ["Small businesses with low transaction volume only", "Service businesses with no inventory", "Businesses using periodic systems exclusively"], tags: ["inventory"] },
  { id: "ch04-anki-17", q: "What is a periodic inventory system?", a: "A system where inventory records are not continuously updated.", pool: "inventory_systems", tags: ["inventory"] },
  { id: "ch04-anki-18", q: "Under the periodic inventory system, when is cost of sales calculated?", a: "At the end of the accounting period after a physical stocktake.", distractors: ["At the time of each sale", "When cash is collected from customers", "When purchase invoices are received"], tags: ["inventory"] },
  { id: "ch04-anki-19", q: "Which inventory system always requires a physical stocktake to determine cost of sales?", a: "Periodic inventory system.", pool: "inventory_systems", tags: ["inventory"] },
  { id: "ch04-anki-20", q: "Which inventory system continuously tracks inventory balances?", a: "Perpetual inventory system.", pool: "inventory_systems", tags: ["inventory"] },
  { id: "ch04-anki-21", q: "Which inventory system is better suited for small businesses?", a: "Periodic inventory system.", pool: "inventory_systems", tags: ["inventory"] },
  { id: "ch04-anki-22", q: "Which inventory system provides a continuously updated inventory balance?", a: "Perpetual inventory system.", pool: "inventory_systems", tags: ["inventory"] },
  { id: "ch04-anki-23", q: "Under the perpetual inventory system, where are inventory purchases recorded?", a: "Directly in the Inventory account.", distractors: ["In a Purchases expense account", "In Cost of Sales immediately", "In Accounts Payable only"], tags: ["inventory_purchases", "debit_credit"] },
  { id: "ch04-anki-24", q: "What is the journal entry to purchase inventory on credit?", a: "Debit Inventory; Credit Accounts Payable.", pool: "journal_patterns", tags: ["inventory_purchases", "debit_credit"] },
  { id: "ch04-anki-25", q: "Inventory costing $3,800 is purchased on credit. What is the journal entry?", a: "Debit Inventory $3,800; Credit Accounts Payable $3,800.", distractors: ["Debit Purchases $3,800; Credit Cash $3,800", "Debit Accounts Payable $3,800; Credit Inventory $3,800", "Debit Cost of Sales $3,800; Credit Accounts Payable $3,800"], tags: ["inventory_purchases", "debit_credit"] },
  { id: "ch04-anki-26", q: "What is a purchase return?", a: "Returning purchased goods to the supplier.", distractors: ["Keeping goods but receiving a price reduction", "Returning sold goods from a customer", "Writing off faulty inventory"], tags: ["inventory_purchases"] },
  { id: "ch04-anki-27", q: "What is a purchase allowance?", a: "Keeping goods but receiving a reduction in price from the supplier.", distractors: ["Returning purchased goods to the supplier", "A discount for prompt payment", "A reduction in list price before invoicing"], tags: ["inventory_purchases"] },
  { id: "ch04-anki-28", q: "What happens to inventory when purchase returns occur?", a: "Inventory decreases.", distractors: ["Inventory increases", "Inventory is unchanged", "Cost of sales increases"], tags: ["inventory_purchases"] },
  { id: "ch04-anki-29", q: "What is the journal entry for purchase returns?", a: "Debit Accounts Payable; Credit Inventory.", pool: "journal_patterns", tags: ["inventory_purchases", "debit_credit"] },
  { id: "ch04-anki-30", q: "Goods costing $300 are returned to the supplier. What is the journal entry?", a: "Debit Accounts Payable $300; Credit Inventory $300.", distractors: ["Debit Inventory $300; Credit Accounts Payable $300", "Debit Purchase Returns $300; Credit Cash $300", "Debit Cost of Sales $300; Credit Inventory $300"], tags: ["inventory_purchases", "debit_credit"] },
  { id: "ch04-anki-31", q: "What is freight-in?", a: "Freight costs paid by the buyer to transport inventory.", distractors: ["Delivery costs paid by the seller", "Insurance on sold goods", "Packaging costs charged to customers"], tags: ["inventory_purchases"] },
  { id: "ch04-anki-32", q: "How is freight-in treated under the perpetual system?", a: "Added to the cost of inventory.", pool: "freight", tags: ["inventory_purchases"] },
  { id: "ch04-anki-33", q: "What is the journal entry for freight-in paid in cash?", a: "Debit Inventory (or Freight-in); Credit Cash.", pool: "journal_patterns", tags: ["inventory_purchases", "debit_credit"] },
  { id: "ch04-anki-34", q: "What is freight-out?", a: "Delivery costs paid by the seller.", distractors: ["Freight costs paid by the buyer", "Insurance on inventory in transit to the buyer", "Import duties on purchased goods"], tags: ["inventory_sales"] },
  { id: "ch04-anki-35", q: "Is freight-out part of inventory cost?", a: "No.", pool: "yes_no", tags: ["inventory_sales"] },
  { id: "ch04-anki-36", q: "How is freight-out classified?", a: "Operating expense.", pool: "expense_categories", tags: ["inventory_sales", "income_statement"] },
  { id: "ch04-anki-37", q: "What is the journal entry for freight-out?", a: "Debit Delivery Expense (Freight-out); Credit Cash.", pool: "journal_patterns", tags: ["inventory_sales", "debit_credit"] },
  { id: "ch04-anki-38", q: "Buyer pays freight — where does it go?", a: "Inventory / Cost of Sales.", pool: "freight", tags: ["inventory_purchases"] },
  { id: "ch04-anki-39", q: "Seller pays freight — where does it go?", a: "Operating expenses.", pool: "expense_categories", tags: ["inventory_sales"] },
  { id: "ch04-anki-40", q: "What is a settlement discount?", a: "A discount offered for prompt payment of an account.", pool: "discount_types", tags: ["inventory_purchases"] },
  { id: "ch04-anki-41", q: "What does 2/10, n/30 mean?", a: "A 2% discount is available if payment is made within 10 days; otherwise full payment is due in 30 days.", distractors: ["A 10% discount if paid within 2 days; full payment in 30 days", "2% interest charged after 10 days; net 30 days credit", "Payment of 2/10 of the invoice within 30 days"], tags: ["inventory_purchases"] },
  { id: "ch04-anki-42", q: "How do purchase discounts affect inventory?", a: "They reduce the cost of inventory.", distractors: ["They increase sales revenue", "They are recorded as operating expenses", "They have no effect on inventory cost"], tags: ["inventory_purchases"] },
  { id: "ch04-anki-43", q: "What is the journal entry when paying an account payable within the discount period?", a: "Debit Accounts Payable; Credit Inventory; Credit Cash.", distractors: ["Debit Cash; Credit Accounts Payable", "Debit Purchase Discounts; Credit Accounts Payable", "Debit Inventory; Credit Accounts Payable"], tags: ["inventory_purchases", "debit_credit"] },
  { id: "ch04-anki-44", q: "An account payable of $3,500 is paid with a $70 discount. How much cash is paid?", a: "$3,430.", distractors: ["$3,500", "$3,570", "$70"], tags: ["inventory_purchases"] },
  { id: "ch04-anki-45", q: "What is a trade discount?", a: "A reduction in list price before the invoice is issued.", pool: "discount_types", tags: ["inventory_purchases"] },
  { id: "ch04-anki-46", q: "Are trade discounts recorded in accounting records?", a: "No.", pool: "yes_no", tags: ["inventory_purchases"] },
  { id: "ch04-anki-47", q: "List price is $5,000 with a 10% trade discount. What amount is recorded?", a: "$4,500.", distractors: ["$5,000", "$5,500", "$500"], tags: ["inventory_purchases"] },
  { id: "ch04-anki-48", q: "Under the perpetual system, how many journal entries are required for each sale?", a: "Two.", distractors: ["One", "Three", "Four"], tags: ["inventory_sales", "debit_credit"] },
  { id: "ch04-anki-49", q: "What is the first journal entry when recording a sale?", a: "Record the sale at selling price.", distractors: ["Record cost of sales and reduce inventory", "Record freight-out expense", "Record GST paid to suppliers"], tags: ["inventory_sales", "debit_credit"] },
  { id: "ch04-anki-50", q: "What is the second journal entry when recording a sale?", a: "Record cost of sales and reduce inventory.", distractors: ["Record the sale at selling price", "Record purchase returns", "Record settlement discounts on purchases"], tags: ["inventory_sales", "debit_credit"] },
  { id: "ch04-anki-51", q: "What is the journal entry to record a cash sale?", a: "Debit Cash; Credit Sales Revenue.", pool: "journal_patterns", tags: ["inventory_sales", "debit_credit"] },
  { id: "ch04-anki-52", q: "What is the journal entry to record cost of inventory sold?", a: "Debit Cost of Sales; Credit Inventory.", pool: "journal_patterns", tags: ["inventory_sales", "debit_credit"] },
  { id: "ch04-anki-53", q: "Cash sales total $2,200 and cost of inventory sold is $1,400. What are the entries?", a: "Dr Cash $2,200 Cr Sales Revenue $2,200; Dr Cost of Sales $1,400 Cr Inventory $1,400.", distractors: ["Dr Cash $2,200 Cr Sales Revenue $2,200 only", "Dr Sales Revenue $2,200 Cr Cash $2,200; Dr Inventory $1,400 Cr Cost of Sales $1,400", "Dr Cash $800 Cr Sales Revenue $800"], tags: ["inventory_sales", "debit_credit"] },
  { id: "ch04-anki-54", q: "What is the journal entry for a credit sale?", a: "Debit Accounts Receivable; Credit Sales Revenue.", pool: "journal_patterns", tags: ["inventory_sales", "debit_credit"] },
  { id: "ch04-anki-55", q: "What is the journal entry for the cost side of a credit sale?", a: "Debit Cost of Sales; Credit Inventory.", pool: "journal_patterns", tags: ["inventory_sales", "debit_credit"] },
  { id: "ch04-anki-56", q: "Credit sales total $3,800 and cost of sales is $2,400. What are the entries?", a: "Dr Accounts Receivable $3,800 Cr Sales Revenue $3,800; Dr Cost of Sales $2,400 Cr Inventory $2,400.", distractors: ["Dr Cash $3,800 Cr Sales Revenue $3,800 only", "Dr Accounts Receivable $1,400 Cr Sales Revenue $1,400", "Dr Sales Revenue $3,800 Cr Accounts Receivable $3,800"], tags: ["inventory_sales", "debit_credit"] },
  { id: "ch04-anki-57", q: "What are the two entries required for sales returns under the perpetual system?", a: "Reverse the sale and restore/reduce inventory.", distractors: ["Record revenue and cost of sales only", "Debit Cash and credit Sales Revenue", "Record freight-in and purchase returns"], tags: ["inventory_sales"] },
  { id: "ch04-anki-58", q: "What account is debited when reversing a sales return?", a: "Sales Returns & Allowances.", distractors: ["Sales Revenue", "Accounts Receivable", "Cost of Sales"], tags: ["inventory_sales", "debit_credit"] },
  { id: "ch04-anki-59", q: "What happens when returned inventory is in good condition?", a: "Inventory is restored.", distractors: ["It is written off as an expense", "It is recorded as freight-out", "Sales revenue is increased"], tags: ["inventory_sales"] },
  { id: "ch04-anki-60", q: "What is the journal entry for a return in good condition?", a: "Debit Inventory; Credit Cost of Sales.", pool: "journal_patterns", tags: ["inventory_sales", "debit_credit"] },
  { id: "ch04-anki-61", q: "Returned goods sold for $300 had cost of $140 and were restocked. What are the entries?", a: "Dr Sales Returns & Allowances $300 Cr Accounts Receivable $300; Dr Inventory $140 Cr Cost of Sales $140.", distractors: ["Dr Sales Revenue $300 Cr Cash $300 only", "Dr Inventory $300 Cr Accounts Receivable $300", "Dr Loss on Faulty Inventory $140 Cr Inventory $140 only"], tags: ["inventory_sales", "debit_credit"] },
  { id: "ch04-anki-62", q: "What happens when returned inventory is faulty and cannot be resold?", a: "It is written off as an expense.", distractors: ["Inventory is restored at original cost", "It is added back to cost of sales", "It is recorded as unearned revenue"], tags: ["inventory_sales"] },
  { id: "ch04-anki-63", q: "What account is debited when faulty inventory is written off?", a: "Loss on Faulty Inventory.", distractors: ["Cost of Sales", "Sales Returns & Allowances", "Inventory"], tags: ["inventory_sales", "debit_credit"] },
  { id: "ch04-anki-64", q: "Returned goods sold for $300 had cost of $140 and were faulty. What is the second entry?", a: "Debit Loss on Faulty Inventory $140; Credit Inventory $140.", distractors: ["Debit Inventory $140; Credit Cost of Sales $140", "Debit Sales Returns $300; Credit Cash $300", "Debit Cost of Sales $140; Credit Accounts Payable $140"], tags: ["inventory_sales", "debit_credit"] },
  { id: "ch04-anki-65", q: "What is a sales discount?", a: "A discount given to customers for prompt payment.", pool: "discount_types", tags: ["inventory_sales"] },
  { id: "ch04-anki-66", q: "How do sales discounts affect revenue?", a: "They reduce net sales revenue.", distractors: ["They increase gross sales", "They are recorded as operating expenses", "They have no effect on net sales"], tags: ["inventory_sales", "income_statement"] },
  { id: "ch04-anki-67", q: "What is the journal entry for a customer paying within the discount period?", a: "Debit Cash; Debit Sales Discounts; Credit Accounts Receivable.", pool: "journal_patterns", tags: ["inventory_sales", "debit_credit"] },
  { id: "ch04-anki-68", q: "A customer pays $3,724 on a $3,800 account after receiving a discount. What is the discount amount?", a: "$76.", distractors: ["$3,724", "$3,800", "$24"], tags: ["inventory_sales"] },
  { id: "ch04-anki-69", q: "What is net sales revenue?", a: "Gross sales revenue minus sales returns & allowances and sales discounts.", distractors: ["Sales revenue minus cost of sales only", "Gross sales plus sales discounts", "Total cash collected from customers"], tags: ["inventory_sales", "income_statement"] },
  { id: "ch04-anki-70", q: "State the formula for net sales revenue.", a: "Sales Revenue − Sales Returns & Allowances − Sales Discounts.", distractors: ["Sales Revenue − Cost of Sales", "Gross Sales + Sales Discounts", "Net Sales − Operating Expenses"], tags: ["inventory_sales", "income_statement"] },
  { id: "ch04-anki-71", q: "What is gross profit (in the statement of profit or loss context)?", a: "Net sales revenue minus cost of sales.", distractors: ["Sales revenue minus operating expenses", "Net sales minus sales discounts only", "Cash received minus inventory purchases"], tags: ["inventory_sales", "income_statement"] },
  { id: "ch04-anki-72", q: "What comes after gross profit in the statement of profit or loss?", a: "Other revenue.", distractors: ["Cost of sales", "Operating expenses", "Income tax expense"], tags: ["income_statement"] },
  { id: "ch04-anki-73", q: "What are the three categories of operating expenses?", a: "Selling expenses, administration expenses, and financial expenses.", pool: "expense_categories", tags: ["income_statement"] },
  { id: "ch04-anki-74", q: "Give examples of selling expenses.", a: "Advertising, freight-out, sales salaries.", distractors: ["Office salaries, rent, insurance", "Interest expense and bank fees", "Cost of sales and purchase discounts"], tags: ["income_statement"] },
  { id: "ch04-anki-75", q: "Give examples of administration expenses.", a: "Office salaries, rent, insurance, depreciation.", distractors: ["Advertising, freight-out, sales salaries", "Interest expense and discounts allowed", "Cost of sales and freight-in"], tags: ["income_statement"] },
  { id: "ch04-anki-76", q: "Give examples of financial expenses.", a: "Interest expense and discounts allowed.", distractors: ["Advertising and freight-out", "Office rent and insurance", "Cost of sales and inventory write-downs"], tags: ["income_statement"] },
  { id: "ch04-anki-77", q: "What does the gross profit rate measure?", a: "Gross profit as a percentage of net sales.", distractors: ["Operating expenses as a percentage of net sales", "Net profit as a percentage of total assets", "Cost of sales as a percentage of gross sales"], tags: ["inventory_sales", "income_statement"] },
  { id: "ch04-anki-78", q: "State the formula for gross profit rate.", a: "Gross Profit ÷ Net Sales × 100.", pool: "ratios", tags: ["inventory_sales", "income_statement"] },
  { id: "ch04-anki-79", q: "What does a higher gross profit rate indicate?", a: "Better profit margin on sales.", distractors: ["Higher operating expenses", "Lower net sales", "More efficient administration"], tags: ["inventory_sales", "income_statement"] },
  { id: "ch04-anki-80", q: "What does the operating expenses to sales ratio measure?", a: "The percentage of sales consumed by operating expenses.", distractors: ["Gross profit as a percentage of net sales", "Cost of sales as a percentage of inventory", "Net GST payable to the ATO"], tags: ["income_statement"] },
  { id: "ch04-anki-81", q: "State the formula for operating expenses to sales ratio.", a: "Operating Expenses ÷ Net Sales × 100.", pool: "ratios", tags: ["income_statement"] },
  { id: "ch04-anki-82", q: "What does a lower operating expenses ratio indicate?", a: "More efficient operations.", distractors: ["Higher gross profit margins only", "Rising inventory costs", "Increased competition"], tags: ["income_statement"] },
  { id: "ch04-anki-83", q: "What is GST?", a: "A value-added tax levied on goods and services.", distractors: ["A tax on business profits only", "An import duty on all goods", "A payroll tax on employee wages"], tags: ["gst"] },
  { id: "ch04-anki-84", q: "What is the GST rate in Australia?", a: "10%.", pool: "gst_rates", tags: ["gst"] },
  { id: "ch04-anki-85", q: "What is the GST rate in New Zealand?", a: "15%.", pool: "gst_rates", tags: ["gst"] },
  { id: "ch04-anki-86", q: "What is a taxable supply?", a: "Goods or services subject to GST.", distractors: ["Supplies exempt from all tax", "Only imported goods", "Financial services only"], tags: ["gst"] },
  { id: "ch04-anki-87", q: "What role does a business play in the GST system?", a: "It collects GST on behalf of the government.", distractors: ["It keeps all GST collected as revenue", "It pays GST only on exports", "It records GST as equity"], tags: ["gst"] },
  { id: "ch04-anki-88", q: "GST collected from customers is recorded as what?", a: "A liability.", pool: "gst_classification", tags: ["gst"] },
  { id: "ch04-anki-89", q: "GST paid to suppliers is recorded as what?", a: "An asset.", pool: "gst_classification", tags: ["gst"] },
  { id: "ch04-anki-90", q: "What does the ATO receive from businesses?", a: "Net GST (GST Collected − GST Paid).", distractors: ["All GST collected with no offset", "Only GST paid on purchases", "GST on exports only"], tags: ["gst"] },
  { id: "ch04-anki-91", q: "What are GST-free supplies?", a: "Supplies with no GST charged, but input tax credits can still be claimed.", distractors: ["Supplies with no GST and no input tax credits", "All exported goods only", "Financial services and residential rents"], tags: ["gst"] },
  { id: "ch04-anki-92", q: "Give examples of GST-free supplies.", a: "Basic food, education, health services, exports.", distractors: ["Financial services and residential rents", "Luxury cars and alcohol only", "All imported goods"], tags: ["gst"] },
  { id: "ch04-anki-93", q: "What are input taxed supplies?", a: "Supplies with no GST charged and no input tax credits claimable.", distractors: ["Supplies with GST charged at 10%", "GST-free supplies with credits claimable", "Exports with full GST refund"], tags: ["gst"] },
  { id: "ch04-anki-94", q: "Give examples of input taxed supplies.", a: "Financial services and residential rents.", distractors: ["Basic food, education, and health services", "Supermarket groceries and clothing", "All business-to-business sales"], tags: ["gst"] },
  { id: "ch04-anki-95", q: "Inventory purchased for $440 GST-inclusive includes how much GST?", a: "$40.", distractors: ["$44", "$400", "$4"], tags: ["gst", "inventory_purchases"] },
  { id: "ch04-anki-96", q: "If inventory purchased is $440 GST-inclusive, what is the inventory cost excluding GST?", a: "$400.", distractors: ["$440", "$484", "$36"], tags: ["gst", "inventory_purchases"] },
  { id: "ch04-anki-97", q: "What is the GST-inclusive purchase journal entry?", a: "Debit Inventory; Debit GST Paid; Credit Accounts Payable.", pool: "journal_patterns", tags: ["gst", "inventory_purchases", "debit_credit"] },
  { id: "ch04-anki-98", q: "What is the journal entry for purchase returns with GST?", a: "Debit Accounts Payable; Credit Inventory; Credit GST Paid.", distractors: ["Debit Inventory; Credit Accounts Payable", "Debit GST Collected; Credit Cash", "Debit Accounts Payable; Credit Cost of Sales"], tags: ["gst", "inventory_purchases", "debit_credit"] },
  { id: "ch04-anki-99", q: "Sales total $2,750 GST-inclusive. How much GST is collected?", a: "$250.", distractors: ["$275", "$2,500", "$25"], tags: ["gst", "inventory_sales"] },
  { id: "ch04-anki-100", q: "Sales total $2,750 GST-inclusive. What is the sales revenue excluding GST?", a: "$2,500.", distractors: ["$2,750", "$3,025", "$275"], tags: ["gst", "inventory_sales"] },
  { id: "ch04-anki-101", q: "What is the GST-inclusive sales journal entry?", a: "Debit Accounts Receivable; Credit Sales Revenue; Credit GST Collected.", pool: "journal_patterns", tags: ["gst", "inventory_sales", "debit_credit"] },
  { id: "ch04-anki-102", q: "Why is cost of sales recorded excluding GST?", a: "GST is recoverable and not part of inventory cost.", distractors: ["GST is always an expense", "GST increases gross profit", "GST is recorded as revenue"], tags: ["gst", "inventory_sales"] },
  { id: "ch04-anki-103", q: "A customer returns goods worth $550 GST-inclusive. How much GST is reversed?", a: "$50.", distractors: ["$55", "$500", "$5"], tags: ["gst", "inventory_sales"] },
  { id: "ch04-anki-104", q: "What is the journal entry for GST-inclusive sales returns?", a: "Debit Sales Returns & Allowances; Debit GST Collected; Credit Accounts Receivable.", distractors: ["Debit Accounts Receivable; Credit Sales Revenue", "Debit Inventory; Credit Cost of Sales", "Debit GST Paid; Credit Cash"], tags: ["gst", "inventory_sales", "debit_credit"] },
  { id: "ch04-anki-105", q: "Why does GST Collected decrease during sales returns?", a: "Because the business no longer owes GST on the returned sale.", distractors: ["Because GST Paid increases automatically", "Because inventory cost includes GST", "Because sales discounts reduce GST Paid"], tags: ["gst", "inventory_sales"] },
  { id: "ch04-anki-106", q: "How are settlement discounts treated for GST purposes?", a: "GST is adjusted because the discount applies to the ex-GST amount.", distractors: ["GST is never adjusted for discounts", "GST is recorded as an expense", "GST Collected is always unchanged"], tags: ["gst"] },
  { id: "ch04-anki-107", q: "If GST Collected exceeds GST Paid, what happens?", a: "The business pays the net GST to the ATO.", distractors: ["The business receives a refund from the ATO", "No GST is payable or refundable", "GST Paid is written off as an expense"], tags: ["gst"] },
  { id: "ch04-anki-108", q: "If GST Paid exceeds GST Collected, what happens?", a: "The business receives a refund from the ATO.", distractors: ["The business pays additional GST to the ATO", "GST Paid is transferred to revenue", "No action is required"], tags: ["gst"] },
  { id: "ch04-anki-109", q: "Why does the perpetual inventory system improve inventory control?", a: "Inventory balances are continuously updated, allowing businesses to monitor stock levels in real time.", distractors: ["It eliminates the need for any physical counts", "It records cost of sales only at year-end", "It removes the need for GST accounting"], tags: ["inventory"] },
  { id: "ch04-anki-110", q: "Why are two entries required under the perpetual system for each sale?", a: "One records revenue and the other records the reduction in inventory and recognition of cost of sales.", distractors: ["One entry is for GST and one for revenue", "Two entries are required only for credit sales", "One entry records freight-in and one records freight-out"], tags: ["inventory_sales", "debit_credit"] },
  { id: "ch04-anki-111", q: "Why is freight-in included in inventory cost?", a: "Because it is part of the cost of getting inventory ready for sale.", distractors: ["Because it is a selling expense after the sale", "Because it reduces sales revenue", "Because it is recorded as a liability"], tags: ["inventory_purchases"] },
  { id: "ch04-anki-112", q: "Why is freight-out not included in inventory cost?", a: "Because it is a selling expense incurred after the sale.", distractors: ["Because it is part of the cost of getting inventory ready for sale", "Because it is added to the Inventory account", "Because it reduces cost of sales"], tags: ["inventory_sales"] },
  { id: "ch04-anki-113", q: "Why are trade discounts not recorded?", a: "Because the invoice is issued at the discounted amount only.", distractors: ["Because they reduce cash paid at settlement", "Because they are operating expenses", "Because they affect GST Collected"], tags: ["inventory_purchases"] },
  { id: "ch04-anki-114", q: "What is the key difference between settlement discounts and trade discounts?", a: "Settlement discounts reward prompt payment; trade discounts reduce list price before invoicing.", distractors: ["Both reduce list price before invoicing", "Trade discounts reward prompt payment only", "Settlement discounts are never recorded in accounts"], tags: ["inventory_purchases", "inventory_sales"] },
  { id: "ch04-anki-115", q: "What happens if sales returns are not recorded correctly?", a: "Revenue and accounts receivable will be overstated.", distractors: ["Cost of sales and inventory will be understated only", "GST Paid will be overstated", "Operating expenses will be understated"], tags: ["inventory_sales", "error_correction"] },
  { id: "ch04-anki-116", q: "Why is gross profit important?", a: "It measures how much profit remains after covering inventory costs.", distractors: ["It measures total cash collected from customers", "It equals net profit after tax", "It replaces the need for an income statement"], tags: ["inventory_sales", "income_statement"] },
  { id: "ch04-anki-117", q: "What does a declining gross profit rate potentially indicate?", a: "Rising inventory costs, falling selling prices, or increased competition.", distractors: ["More efficient operations and lower expenses", "Higher net GST refunds from the ATO", "Improved inventory control under perpetual systems"], tags: ["inventory_sales", "income_statement"] },
  { id: "ch04-anki-118", q: "Why is GST Collected a liability?", a: "Because the business owes that amount to the government.", distractors: ["Because it can be claimed back from suppliers", "Because it is part of sales revenue", "Because it reduces inventory cost"], tags: ["gst"] },
  { id: "ch04-anki-119", q: "Why is GST Paid an asset?", a: "Because it can be claimed back from the tax authority.", distractors: ["Because the business owes it to the government", "Because it is recorded as revenue", "Because it is part of cost of sales"], tags: ["gst"] },
  { id: "ch04-anki-120", q: "What is the overall focus of Chapter 4?", a: "Recording inventory transactions, understanding merchandising operations, preparing merchandising financial statements, and accounting for GST.", distractors: ["Adjusting entries, closing entries, and the accounting cycle", "Cost flow assumptions such as FIFO and LIFO", "Reporting non-current assets and depreciation methods"], tags: ["inventory"] },
];

function normalizeOptionText(option) {
  return String(option)
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, "\"")
    .replace(/[.,;:!?]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function pickDistractors(card) {
  const normalizedAnswer = normalizeOptionText(card.a);
  const unique = [];
  const seen = new Set([normalizedAnswer]);
  const appendUnique = (option) => {
    const key = normalizeOptionText(option);
    if (!key || seen.has(key)) return;
    seen.add(key);
    unique.push(option);
  };

  for (const option of card.distractors ?? []) {
    appendUnique(option);
    if (unique.length === 3) return unique;
  }

  const pool = card.pool ? DISTRACTOR_POOLS[card.pool] ?? [] : [];
  for (const option of pool) {
    appendUnique(option);
    if (unique.length === 3) return unique;
  }

  for (const option of Object.values(DISTRACTOR_POOLS).flat()) {
    appendUnique(option);
    if (unique.length === 3) return unique;
  }

  let variant = 1;
  while (unique.length < 3) {
    appendUnique(`None of the above (variant ${variant})`);
    variant += 1;
  }

  return unique;
}

function ensureUniqueOptions(answer, distractors) {
  const options = [answer];
  const seen = new Set([normalizeOptionText(answer)]);

  const pushUnique = (option) => {
    const key = normalizeOptionText(option);
    if (!key || seen.has(key)) return;
    seen.add(key);
    options.push(option);
  };

  for (const option of distractors) {
    pushUnique(option);
    if (options.length === 4) return options;
  }

  for (const option of Object.values(DISTRACTOR_POOLS).flat()) {
    pushUnique(option);
    if (options.length === 4) return options;
  }

  const fillers = [
    "None of the above.",
    "All of the above.",
    "Not enough information to determine.",
  ];
  for (const option of fillers) {
    pushUnique(option);
    if (options.length === 4) return options;
  }

  let variant = 1;
  while (options.length < 4) {
    pushUnique(`Fallback option ${variant}`);
    variant += 1;
  }

  return options;
}

function toMcq(card) {
  const distractors = pickDistractors(card);
  const options = ensureUniqueOptions(card.a, distractors);
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

const output = `// Auto-generated from Notion Anki Flashcards — Chapter 4
// Regenerate: bun scripts/generate-ch04-anki-mcqs.js

export const ankiMcqs = ${JSON.stringify(mcqs, null, 2)};
`;

await Bun.write(new URL("../src/data/chapters/ch04-anki-mcqs.js", import.meta.url), output);

console.log(`Generated ${mcqs.length} MCQs → src/data/chapters/ch04-anki-mcqs.js`);
