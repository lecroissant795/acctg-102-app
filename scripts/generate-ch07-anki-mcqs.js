/**
 * Generates MCQs from Chapter 7 Anki flashcards (Notion).
 * Run: bun scripts/generate-ch07-anki-mcqs.js
 */

const DISTRACTOR_POOLS = {
  cash_categories: [
    "Cash on hand",
    "Cash at bank",
    "Cash equivalents",
    "Accounts receivable",
  ],
  cash_flow_types: [
    "Operating activities",
    "Investing activities",
    "Financing activities",
    "Adjusting activities",
  ],
  internal_controls: [
    "Establishment of responsibility",
    "Segregation of duties",
    "Documentation procedures",
    "Physical/electronic controls",
    "Independent verification",
  ],
  journal_patterns: [
    "Dr Bank Charges Expense / Cr Cash at Bank",
    "Dr Accounts Receivable / Cr Cash at Bank",
    "Dr Bad Debts Expense / Cr Accounts Receivable",
    "Dr Bad Debts Expense / Cr Allowance for Doubtful Debts",
    "Dr Allowance for Doubtful Debts / Cr Accounts Receivable",
    "Dr Accounts Receivable / Cr Allowance for Doubtful Debts",
    "Dr Cash / Cr Accounts Receivable",
    "Dr Petty Cash / Cr Cash at Bank",
    "Dr individual expense accounts / Cr Cash at Bank",
  ],
  bank_rec_items: [
    "Added to the bank statement balance",
    "Subtracted from the bank statement balance",
    "Added to the cash book balance",
    "Subtracted from the cash book balance",
    "No adjustment required",
  ],
  bad_debt_methods: [
    "Direct write-off method",
    "Allowance method",
    "Percentage of net sales method",
    "Ageing of accounts receivable method",
  ],
  receivable_types: [
    "Accounts receivable",
    "Notes receivable",
    "Other receivables",
    "Allowance for doubtful debts",
  ],
  formulas: [
    "Cash ÷ Average Daily Cash Expenses",
    "Allowance for Doubtful Debts ÷ Accounts Receivable",
    "Net Credit Sales ÷ Average Net Receivables",
    "365 ÷ Receivables Turnover",
    "(Beginning Net Receivables + Ending Net Receivables) ÷ 2",
    "Accounts Receivable minus Allowance for Doubtful Debts",
  ],
  yes_no: ["Yes", "No", "Only under the direct write-off method", "Only for credit sales"],
};

/** @type {Array<{ id: string, q: string, a: string, pool?: keyof typeof DISTRACTOR_POOLS, distractors?: string[], tags?: string[] }>} */
const FLASHCARDS = [
  { id: "ch07-anki-01", q: "Why is cash considered the most desirable asset?", a: "Because it is readily convertible into any other asset and can be used immediately to settle obligations.", distractors: ["Because it earns the highest return", "Because it never loses value", "Because it is the only current asset"], tags: ["financial_statements"] },
  { id: "ch07-anki-02", q: "What are the three main categories of cash?", a: "Cash on hand, cash at bank, and cash equivalents.", pool: "cash_categories", tags: ["financial_statements"] },
  { id: "ch07-anki-03", q: "What is cash on hand?", a: "Notes and coins physically held by the business.", pool: "cash_categories", tags: ["financial_statements"] },
  { id: "ch07-anki-04", q: "What is cash at bank?", a: "Funds held in savings accounts and everyday transaction accounts.", pool: "cash_categories", tags: ["financial_statements"] },
  { id: "ch07-anki-05", q: "What are cash equivalents?", a: "Short-term highly liquid investments readily convertible to cash, such as money market deposits and 90-day bank bills.", pool: "cash_categories", tags: ["financial_statements", "cash_flow"] },
  { id: "ch07-anki-06", q: "What are the three categories of cash flows?", a: "Operating, investing, and financing activities.", pool: "cash_flow_types", tags: ["cash_flow"] },
  { id: "ch07-anki-07", q: "What are operating cash flows?", a: "Cash flows relating to day-to-day business operations such as receipts from customers and payments to suppliers.", pool: "cash_flow_types", tags: ["cash_flow"] },
  { id: "ch07-anki-08", q: "Give examples of operating cash inflows.", a: "Receipts from customers, interest received, and dividends received.", distractors: ["Borrowing cash and issuing shares", "Purchase of property, plant & equipment", "Repaying borrowings and paying dividends"], tags: ["cash_flow"] },
  { id: "ch07-anki-09", q: "Give examples of operating cash outflows.", a: "Payments to suppliers, wages, interest, and taxes.", distractors: ["Sale of property, plant & equipment", "Issuing shares for cash", "Collection of loans made to others"], tags: ["cash_flow"] },
  { id: "ch07-anki-10", q: "What are financing cash flows?", a: "Cash flows relating to borrowing, repaying debt, issuing shares, and paying dividends.", pool: "cash_flow_types", tags: ["cash_flow"] },
  { id: "ch07-anki-11", q: "Give examples of financing cash inflows.", a: "Borrowing cash and issuing shares.", distractors: ["Receipts from customers", "Sale of property, plant & equipment", "Payments to suppliers"], tags: ["cash_flow"] },
  { id: "ch07-anki-12", q: "Give examples of financing cash outflows.", a: "Repaying borrowings and paying dividends.", distractors: ["Purchase of investments", "Payments to suppliers for inventory", "Interest received from investments"], tags: ["cash_flow"] },
  { id: "ch07-anki-13", q: "What are investing cash flows?", a: "Cash flows relating to the purchase and sale of long-term assets and investments.", pool: "cash_flow_types", tags: ["cash_flow"] },
  { id: "ch07-anki-14", q: "Give examples of investing cash outflows.", a: "Purchase of property, plant & equipment and purchase of investments.", distractors: ["Payments to suppliers and wages", "Repaying borrowings", "Receipts from customers"], tags: ["cash_flow"] },
  { id: "ch07-anki-15", q: "Give examples of investing cash inflows.", a: "Sale of property, plant & equipment and collection of loans made to others.", distractors: ["Borrowing cash", "Receipts from credit sales", "Payment of dividends"], tags: ["cash_flow"] },
  { id: "ch07-anki-16", q: "What does EFT stand for?", a: "Electronic Funds Transfer.", distractors: ["Electronic Financial Transaction", "Estimated Funds Total", "External Funds Transfer"], tags: ["financial_statements"] },
  { id: "ch07-anki-17", q: "What is the main advantage of EFT?", a: "It provides fast payment processing and reduces transaction costs.", distractors: ["It eliminates the need for bank reconciliations", "It removes all fraud risk", "It replaces the need for internal controls"], tags: ["financial_statements"] },
  { id: "ch07-anki-18", q: "How do EFTPOS and credit card systems benefit businesses?", a: "They reduce staff costs and lower the risk associated with handling physical cash.", distractors: ["They eliminate service charge expenses", "They remove the need for accounts receivable", "They guarantee all customers will pay"], tags: ["financial_statements"] },
  { id: "ch07-anki-19", q: "Why are electronic banking systems important for modern businesses?", a: "They improve efficiency, security, and speed of transactions.", distractors: ["They remove the need for petty cash funds", "They eliminate bad debts entirely", "They replace the statement of cash flows"], tags: ["financial_statements"] },
  { id: "ch07-anki-20", q: "What is internal control?", a: "Methods and procedures designed to safeguard assets and ensure accurate accounting records.", distractors: ["A method for estimating bad debts", "The process of preparing a bank reconciliation", "A ratio measuring receivables collection"], tags: ["financial_statements"] },
  { id: "ch07-anki-21", q: "Why is cash particularly vulnerable to theft and fraud?", a: "Because cash is easily transferable and difficult to trace once stolen.", distractors: ["Because cash is always held at the bank", "Because cash has no value until deposited", "Because cash cannot be used to settle obligations"], tags: ["financial_statements"] },
  { id: "ch07-anki-22", q: "What are the five key internal control principles?", a: "Establishment of responsibility, segregation of duties, documentation procedures, physical/electronic controls, and independent verification.", pool: "internal_controls", tags: ["financial_statements"] },
  { id: "ch07-anki-23", q: "What is establishment of responsibility?", a: "Assigning responsibility for cash handling to specific authorised personnel only.", pool: "internal_controls", tags: ["financial_statements"] },
  { id: "ch07-anki-24", q: "What is segregation of duties?", a: "Separating responsibilities so different individuals receive cash, record transactions, and hold assets.", pool: "internal_controls", tags: ["financial_statements"] },
  { id: "ch07-anki-25", q: "Why is segregation of duties important?", a: "It reduces opportunities for fraud and errors.", distractors: ["It increases the speed of cash collection", "It eliminates the need for bank reconciliations", "It allows one person to handle all cash functions"], tags: ["financial_statements"] },
  { id: "ch07-anki-26", q: "What are examples of documentation procedures for cash receipts?", a: "Remittance advices, cash register tapes, deposit slips, and electronic receipt numbers.", distractors: ["Bank statements and dishonoured cheques only", "Petty cash vouchers only", "Ageing schedules for receivables"], tags: ["financial_statements"] },
  { id: "ch07-anki-27", q: "What are examples of physical controls over cash?", a: "Safes, bank vaults, passwords, PINs, and frequent banking.", distractors: ["Allowance for doubtful debts", "Credit risk ratios", "Factoring receivables"], tags: ["financial_statements"] },
  { id: "ch07-anki-28", q: "What is independent internal verification?", a: "Checking records by someone independent of the person performing the transaction.", pool: "internal_controls", tags: ["financial_statements"] },
  { id: "ch07-anki-29", q: "Give examples of independent internal verification for cash receipts.", a: "Daily cash counts and comparison of receipts to bank deposits.", distractors: ["Estimating doubtful debts using the ageing method", "Calculating receivables turnover", "Preparing a cash budget only"], tags: ["financial_statements"] },
  { id: "ch07-anki-30", q: "What controls should exist over EFT payments?", a: "Passwords, PIN protection, and approval by authorised personnel.", distractors: ["No controls because EFT is fully automated", "Only physical safes and vaults", "Elimination of all petty cash funds"], tags: ["financial_statements"] },
  { id: "ch07-anki-31", q: "Why do businesses use banks?", a: "To safeguard cash, minimise cash on hand, and provide a double record of transactions.", distractors: ["To eliminate accounts receivable", "To avoid preparing a statement of cash flows", "To remove the need for internal controls"], tags: ["bank_reconciliation"] },
  { id: "ch07-anki-32", q: "What is a bank reconciliation?", a: "A process used to explain differences between the bank statement balance and the Cash at Bank account balance.", distractors: ["A forecast of expected cash receipts and payments", "A method for estimating bad debts", "A ratio measuring liquidity"], tags: ["bank_reconciliation"] },
  { id: "ch07-anki-33", q: "What are the two major reasons for differences between bank records and business records?", a: "Timing differences and errors.", distractors: ["Bad debts and GST only", "Depreciation and inventory errors", "Share issues and dividends only"], tags: ["bank_reconciliation"] },
  { id: "ch07-anki-34", q: "What are timing differences?", a: "Transactions recorded in different accounting periods by the business and the bank.", distractors: ["Permanent errors that never reverse", "Differences caused only by fraud", "Adjustments for doubtful debts"], tags: ["bank_reconciliation"] },
  { id: "ch07-anki-35", q: "What are outstanding deposits?", a: "Deposits recorded by the business but not yet recorded by the bank.", distractors: ["Payments recorded by the bank but not the business", "Bank charges not yet recorded", "Dishonoured cheques"], tags: ["bank_reconciliation"] },
  { id: "ch07-anki-36", q: "What are outstanding EFTs or unpresented cheques?", a: "Payments recorded by the business but not yet processed by the bank.", distractors: ["Deposits recorded by the business but not yet by the bank", "Direct deposits from customers", "Bank service charges"], tags: ["bank_reconciliation"] },
  { id: "ch07-anki-37", q: "In a bank reconciliation, how are outstanding deposits treated?", a: "Added to the bank statement balance.", pool: "bank_rec_items", tags: ["bank_reconciliation"] },
  { id: "ch07-anki-38", q: "In a bank reconciliation, how are outstanding EFTs/unpresented cheques treated?", a: "Subtracted from the bank statement balance.", pool: "bank_rec_items", tags: ["bank_reconciliation"] },
  { id: "ch07-anki-39", q: "What is the key rule in a bank reconciliation?", a: "Adjusted bank balance must equal the adjusted Cash at Bank balance.", distractors: ["Bank balance must always exceed the cash book balance", "Outstanding cheques are added to the cash book", "Deposits in transit require no adjustment"], tags: ["bank_reconciliation"] },
  { id: "ch07-anki-40", q: "What should be done first when preparing a bank reconciliation?", a: "Compare the bank statement with the previous reconciliation and current cash journals.", distractors: ["Record all outstanding cheques as expenses", "Write off all doubtful debts", "Prepare the cash budget"], tags: ["bank_reconciliation"] },
  { id: "ch07-anki-41", q: "What does ticking items during reconciliation indicate?", a: "That the transaction appears in both the bank records and the business records.", distractors: ["That the item requires a journal entry", "That the item is an outstanding deposit", "That the bank made an error"], tags: ["bank_reconciliation"] },
  { id: "ch07-anki-42", q: "What unticked items on the bank statement often require journal entries?", a: "Direct deposits, dishonoured cheques, bank charges, and bank errors.", distractors: ["Outstanding cheques and deposits in transit", "Credit sales and purchase returns", "Depreciation and prepaid expenses"], tags: ["bank_reconciliation"] },
  { id: "ch07-anki-43", q: "What journal entry records bank charges?", a: "Dr Bank Charges Expense / Cr Cash at Bank.", pool: "journal_patterns", tags: ["bank_reconciliation", "debit_credit"] },
  { id: "ch07-anki-44", q: "What journal entry records a dishonoured cheque?", a: "Dr Accounts Receivable / Cr Cash at Bank.", pool: "journal_patterns", tags: ["bank_reconciliation", "debit_credit"] },
  { id: "ch07-anki-45", q: "What is the goal of cash management?", a: "To ensure the business has enough cash to meet obligations while maximising returns on idle cash.", distractors: ["To eliminate all accounts receivable", "To maximise inventory levels", "To avoid all borrowing"], tags: ["financial_statements"] },
  { id: "ch07-anki-46", q: "What is the first principle of cash management?", a: "Increase the speed of collection of receivables.", distractors: ["Pay all suppliers immediately", "Hold maximum inventory at all times", "Avoid all credit sales"], tags: ["receivables"] },
  { id: "ch07-anki-47", q: "Why should inventory levels be kept low?", a: "Excess inventory ties up cash unnecessarily.", distractors: ["Inventory cannot be sold for cash", "Low inventory always increases bad debts", "Inventory is not a current asset"], tags: ["financial_statements"] },
  { id: "ch07-anki-48", q: "Why should businesses avoid paying earlier than necessary?", a: "To retain cash longer for operational use or investment.", distractors: ["To increase accounts payable permanently", "To avoid recording expenses", "To eliminate GST liability"], tags: ["financial_statements"] },
  { id: "ch07-anki-49", q: "Why should major expenditures be planned carefully?", a: "To avoid unexpected cash shortages.", distractors: ["To eliminate the need for a cash budget", "To maximise accounts receivable", "To avoid bank reconciliations"], tags: ["financial_statements"] },
  { id: "ch07-anki-50", q: "What should businesses do with idle cash?", a: "Invest it to earn returns.", distractors: ["Hold it only as cash on hand", "Use it to write off bad debts immediately", "Transfer it to accounts receivable"], tags: ["financial_statements"] },
  { id: "ch07-anki-51", q: "What is a cash budget?", a: "A forecast of expected cash receipts and cash payments.", distractors: ["A list of all bank transactions for the year", "The same as a bank reconciliation", "A method for valuing receivables"], tags: ["financial_statements"] },
  { id: "ch07-anki-52", q: "Why is a cash budget important?", a: "It helps businesses plan for cash surpluses or shortages.", distractors: ["It replaces the statement of cash flows", "It eliminates the need for receivables management", "It records bad debts automatically"], tags: ["financial_statements"] },
  { id: "ch07-anki-53", q: "What is the first line in a cash budget?", a: "Beginning cash balance.", distractors: ["Total cash receipts", "Cash payments", "Ending cash balance"], tags: ["financial_statements"] },
  { id: "ch07-anki-54", q: "What is total available cash?", a: "Beginning cash balance plus cash receipts.", distractors: ["Ending cash balance minus cash payments", "Cash receipts minus cash payments only", "Beginning cash balance minus cash payments"], tags: ["financial_statements"] },
  { id: "ch07-anki-55", q: "What happens if cash payments exceed available cash?", a: "A cash deficiency occurs.", distractors: ["A cash surplus occurs", "Bad debts expense increases", "Receivables turnover increases"], tags: ["financial_statements"] },
  { id: "ch07-anki-56", q: "What may be needed if a cash deficiency occurs?", a: "Financing, such as borrowing.", distractors: ["Writing off all receivables", "Eliminating petty cash", "Stopping all credit sales permanently"], tags: ["financial_statements"] },
  { id: "ch07-anki-57", q: "What does the cash to daily cash expenses ratio measure?", a: "The number of days current cash can cover average daily cash expenses.", pool: "formulas", tags: ["financial_statements"] },
  { id: "ch07-anki-58", q: "What is the formula for cash to daily cash expenses ratio?", a: "Cash ÷ Average Daily Cash Expenses.", pool: "formulas", tags: ["financial_statements"] },
  { id: "ch07-anki-59", q: "What does a higher cash to daily cash expenses ratio generally indicate?", a: "Greater liquidity and ability to cover expenses.", distractors: ["Slow collection of receivables", "Higher bad debt risk", "Lower cash balances"], tags: ["financial_statements"] },
  { id: "ch07-anki-60", q: "What are receivables?", a: "Amounts owed to a business by customers or others.", pool: "receivable_types", tags: ["receivables"] },
  { id: "ch07-anki-61", q: "What are accounts receivable?", a: "Amounts owed by customers from credit sales.", pool: "receivable_types", tags: ["receivables"] },
  { id: "ch07-anki-62", q: "What are notes receivable?", a: "Formal written promises to pay money in the future.", pool: "receivable_types", tags: ["receivables"] },
  { id: "ch07-anki-63", q: "What are other receivables?", a: "Non-trade receivables such as interest receivable, GST receivable, and employee loans.", pool: "receivable_types", tags: ["receivables"] },
  { id: "ch07-anki-64", q: "What are bad debts?", a: "Accounts receivable that are unlikely to be collected.", distractors: ["Receivables expected to be collected within 12 months", "Formal written promises to pay", "GST receivable from the ATO"], tags: ["receivables", "allowance_method"] },
  { id: "ch07-anki-65", q: "What is the direct write-off method?", a: "A method where bad debts expense is recognised only when a specific account is identified as uncollectable.", pool: "bad_debt_methods", tags: ["receivables", "allowance_method"] },
  { id: "ch07-anki-66", q: "What is the journal entry under the direct write-off method?", a: "Dr Bad Debts Expense / Cr Accounts Receivable.", pool: "journal_patterns", tags: ["receivables", "allowance_method", "debit_credit"] },
  { id: "ch07-anki-67", q: "Why is the direct write-off method generally not preferred under GAAP?", a: "Because it may violate the matching principle and overstate receivables.", distractors: ["Because it always overstates bad debts expense", "Because it requires an allowance account", "Because it cannot be used for any bad debts"], tags: ["receivables", "allowance_method"] },
  { id: "ch07-anki-68", q: "What is the allowance method?", a: "A method where estimated bad debts are recognised before specific accounts become uncollectable.", pool: "bad_debt_methods", tags: ["receivables", "allowance_method"] },
  { id: "ch07-anki-69", q: "Under the allowance method, receivables are reported at what amount?", a: "Net Realisable Value (NRV).", pool: "formulas", tags: ["receivables", "allowance_method", "balance_sheet"] },
  { id: "ch07-anki-70", q: "What is Net Realisable Value for receivables?", a: "Accounts Receivable minus Allowance for Doubtful Debts.", pool: "formulas", tags: ["receivables", "allowance_method", "balance_sheet"] },
  { id: "ch07-anki-71", q: "What is the journal entry to estimate doubtful debts?", a: "Dr Bad Debts Expense / Cr Allowance for Doubtful Debts.", pool: "journal_patterns", tags: ["receivables", "allowance_method", "debit_credit"] },
  { id: "ch07-anki-72", q: "What is the journal entry to write off an uncollectable account under the allowance method?", a: "Dr Allowance for Doubtful Debts / Cr Accounts Receivable.", pool: "journal_patterns", tags: ["receivables", "allowance_method", "debit_credit"] },
  { id: "ch07-anki-73", q: "Does writing off an account under the allowance method affect total receivables NRV?", a: "No, because both Accounts Receivable and the Allowance account decrease.", pool: "yes_no", tags: ["receivables", "allowance_method"] },
  { id: "ch07-anki-74", q: "What is the first journal entry when recovering a previously written-off account?", a: "Dr Accounts Receivable / Cr Allowance for Doubtful Debts.", pool: "journal_patterns", tags: ["receivables", "allowance_method", "debit_credit"] },
  { id: "ch07-anki-75", q: "What is the second journal entry when cash is collected from a recovered account?", a: "Dr Cash / Cr Accounts Receivable.", pool: "journal_patterns", tags: ["receivables", "allowance_method", "debit_credit"] },
  { id: "ch07-anki-76", q: "Why does a bad debt write-off reduce GST liability?", a: "Because GST previously recognised on the sale must be reversed if the customer never pays.", distractors: ["Because GST Paid increases automatically", "Because bad debts are GST-free supplies", "Because GST is never recorded on credit sales"], tags: ["receivables", "gst"] },
  { id: "ch07-anki-77", q: "What are the two common methods of estimating doubtful debts?", a: "Percentage of net sales and ageing of accounts receivable.", pool: "bad_debt_methods", tags: ["receivables", "allowance_method"] },
  { id: "ch07-anki-78", q: "What does the percentage of net sales method focus on?", a: "Matching bad debts expense to sales revenue for the period.", distractors: ["Calculating the required ending allowance balance", "Classifying receivables as current or non-current", "Measuring receivables turnover"], tags: ["receivables", "allowance_method"] },
  { id: "ch07-anki-79", q: "What does the ageing of accounts receivable method focus on?", a: "Estimating the required ending balance in Allowance for Doubtful Debts.", distractors: ["Matching bad debts expense directly to sales revenue", "Calculating receivables turnover only", "Recording write-offs when cash is collected"], tags: ["receivables", "allowance_method"] },
  { id: "ch07-anki-80", q: "Why are older receivables assigned higher bad debt percentages?", a: "Because older accounts are less likely to be collected.", distractors: ["Because older accounts always have higher balances", "Because GST increases with age", "Because current receivables are always written off"], tags: ["receivables", "allowance_method"] },
  { id: "ch07-anki-81", q: "Under the ageing method, what usually happens to the allowance percentage as accounts become older?", a: "The percentage increases.", distractors: ["The percentage decreases", "The percentage stays the same for all ages", "The percentage is always zero for current accounts"], tags: ["receivables", "allowance_method"] },
  { id: "ch07-anki-82", q: "How are receivables classified in the statement of financial position?", a: "As current or non-current assets depending on collection timing.", distractors: ["Always as current liabilities", "Always as non-current assets", "As contra equity accounts"], tags: ["receivables", "balance_sheet"] },
  { id: "ch07-anki-83", q: "Which receivables are classified as current assets?", a: "Receivables expected to be collected within 12 months or the operating cycle.", distractors: ["All receivables regardless of collection date", "Only notes receivable", "Only amounts covered by the allowance"], tags: ["receivables", "balance_sheet"] },
  { id: "ch07-anki-84", q: "What disclosures about receivables are usually included in the notes?", a: "Accounting policy and breakdown of receivables and allowance balances.", distractors: ["Only the receivables turnover ratio", "Detailed customer names and addresses", "Bank reconciliation schedules"], tags: ["receivables", "balance_sheet"] },
  { id: "ch07-anki-85", q: "Why must businesses be careful when extending credit?", a: "Risky customers may fail to pay.", distractors: ["Credit sales never generate revenue", "Extending credit eliminates GST", "Credit sales do not create accounts receivable"], tags: ["receivables"] },
  { id: "ch07-anki-86", q: "What should a business consider when establishing a payment period?", a: "Industry and competitor practices.", distractors: ["Only the cash budget beginning balance", "Depreciation methods for non-current assets", "Inventory cost flow assumptions"], tags: ["receivables"] },
  { id: "ch07-anki-87", q: "What does the credit risk ratio measure?", a: "The proportion of receivables expected to become uncollectable.", pool: "formulas", tags: ["receivables", "allowance_method"] },
  { id: "ch07-anki-88", q: "What is the formula for the credit risk ratio?", a: "Allowance for Doubtful Debts ÷ Accounts Receivable.", pool: "formulas", tags: ["receivables", "allowance_method"] },
  { id: "ch07-anki-89", q: "What does receivables turnover measure?", a: "How many times receivables are collected during the year.", pool: "formulas", tags: ["receivables"] },
  { id: "ch07-anki-90", q: "What is the receivables turnover formula?", a: "Net Credit Sales ÷ Average Net Receivables.", pool: "formulas", tags: ["receivables"] },
  { id: "ch07-anki-91", q: "What is average net receivables?", a: "(Beginning Net Receivables + Ending Net Receivables) ÷ 2.", pool: "formulas", tags: ["receivables"] },
  { id: "ch07-anki-92", q: "What does a high receivables turnover indicate?", a: "Efficient collection of receivables.", distractors: ["Slow collection and credit problems", "High bad debt risk", "Low net credit sales"], tags: ["receivables"] },
  { id: "ch07-anki-93", q: "What does a low receivables turnover indicate?", a: "Slow collection and possible credit problems.", distractors: ["Efficient collection of receivables", "Strong liquidity", "Low allowance for doubtful debts"], tags: ["receivables"] },
  { id: "ch07-anki-94", q: "What is the average collection period formula?", a: "365 ÷ Receivables Turnover.", pool: "formulas", tags: ["receivables"] },
  { id: "ch07-anki-95", q: "What does the average collection period measure?", a: "The average number of days taken to collect receivables.", distractors: ["Days cash can cover daily expenses", "Days inventory is held before sale", "Days between purchase and payment to suppliers"], tags: ["receivables"] },
  { id: "ch07-anki-96", q: "What is factoring?", a: "Selling receivables to a third party called a factor.", distractors: ["Estimating bad debts using the ageing method", "Preparing a bank reconciliation", "Establishing a petty cash fund"], tags: ["receivables"] },
  { id: "ch07-anki-97", q: "Why do businesses factor receivables?", a: "To obtain cash quickly and reduce collection costs.", distractors: ["To increase accounts receivable balances", "To eliminate service charge expenses", "To avoid recording credit sales"], tags: ["receivables"] },
  { id: "ch07-anki-98", q: "What is a disadvantage of factoring?", a: "Service charges reduce the cash received.", distractors: ["It increases bad debt risk", "It eliminates all receivables permanently", "It requires the direct write-off method"], tags: ["receivables"] },
  { id: "ch07-anki-99", q: "Why are credit card sales beneficial to retailers?", a: "They increase sales and reduce bad debt risk.", distractors: ["They eliminate service charge expenses", "They remove the need for cash at bank", "They guarantee no bank reconciliations"], tags: ["receivables"] },
  { id: "ch07-anki-100", q: "What expense is recognised in credit card sales processing?", a: "Service Charge Expense.", distractors: ["Bad Debts Expense", "Bank Charges Expense", "Freight-out Expense"], tags: ["receivables"] },
  { id: "ch07-anki-101", q: "What is a petty cash fund?", a: "A small amount of cash used for minor expenditures.", distractors: ["A large cash reserve for major purchases", "The same as cash at bank", "A method for estimating doubtful debts"], tags: ["financial_statements"] },
  { id: "ch07-anki-102", q: "What is the journal entry to establish a petty cash fund?", a: "Dr Petty Cash / Cr Cash at Bank.", pool: "journal_patterns", tags: ["debit_credit"] },
  { id: "ch07-anki-103", q: "Are journal entries made every time petty cash is spent?", a: "No. Entries are made when the fund is replenished.", pool: "yes_no", tags: ["debit_credit"] },
  { id: "ch07-anki-104", q: "What documentation is required for petty cash payments?", a: "Petty cash vouchers and receipts.", distractors: ["Bank statements and deposit slips only", "Ageing schedules only", "Remittance advices only"], tags: ["financial_statements"] },
  { id: "ch07-anki-105", q: "What should the total of petty cash receipts plus cash remaining equal?", a: "The original petty cash fund balance.", distractors: ["Total cash receipts for the period", "The bank statement balance", "Net realisable value of receivables"], tags: ["financial_statements"] },
  { id: "ch07-anki-106", q: "What is the journal entry to replenish petty cash?", a: "Dr individual expense accounts / Cr Cash at Bank.", pool: "journal_patterns", tags: ["debit_credit"] },
  { id: "ch07-anki-107", q: "What is the Over and Short account?", a: "An account used to record petty cash shortages or surpluses.", distractors: ["A contra asset for doubtful debts", "An account for bank service charges", "A revenue account for factoring"], tags: ["debit_credit"] },
  { id: "ch07-anki-108", q: "How is a petty cash shortage recorded?", a: "Debit Over and Short.", distractors: ["Credit Over and Short", "Debit Cash at Bank", "Credit Petty Cash only"], tags: ["debit_credit"] },
  { id: "ch07-anki-109", q: "How is a petty cash surplus recorded?", a: "Credit Over and Short.", distractors: ["Debit Over and Short", "Debit Bad Debts Expense", "Credit Accounts Receivable"], tags: ["debit_credit"] },
  { id: "ch07-anki-110", q: "Formula: Cash to daily cash expenses ratio.", a: "Cash ÷ Average Daily Cash Expenses.", pool: "formulas", tags: ["financial_statements"] },
  { id: "ch07-anki-111", q: "Formula: Credit risk ratio.", a: "Allowance for Doubtful Debts ÷ Accounts Receivable.", pool: "formulas", tags: ["receivables", "allowance_method"] },
  { id: "ch07-anki-112", q: "Formula: Receivables turnover.", a: "Net Credit Sales ÷ Average Net Receivables.", pool: "formulas", tags: ["receivables"] },
  { id: "ch07-anki-113", q: "Formula: Average collection period.", a: "365 ÷ Receivables Turnover.", pool: "formulas", tags: ["receivables"] },
  { id: "ch07-anki-114", q: "What is the biggest bank reconciliation trap?", a: "Adding and subtracting outstanding items incorrectly.", distractors: ["Forgetting to estimate doubtful debts", "Using the direct write-off method", "Replenishing petty cash too frequently"], tags: ["bank_reconciliation", "error_correction"] },
  { id: "ch07-anki-115", q: "In a bank reconciliation, what happens to outstanding deposits?", a: "They are added to the bank balance.", pool: "bank_rec_items", tags: ["bank_reconciliation", "error_correction"] },
  { id: "ch07-anki-116", q: "In a bank reconciliation, what happens to unpresented cheques/outstanding EFTs?", a: "They are subtracted from the bank balance.", pool: "bank_rec_items", tags: ["bank_reconciliation", "error_correction"] },
  { id: "ch07-anki-117", q: "What is the biggest allowance method trap?", a: "Forgetting that the ageing method calculates the required ending allowance balance.", distractors: ["Debiting Allowance instead of Bad Debts Expense when estimating", "Using the direct write-off method for all write-offs", "Recording recovery before reversing the write-off"], tags: ["allowance_method", "error_correction"] },
  { id: "ch07-anki-118", q: "What is the biggest write-off trap?", a: "Debiting Bad Debts Expense instead of Allowance for Doubtful Debts under the allowance method.", distractors: ["Crediting Accounts Receivable when estimating doubtful debts", "Failing to record GST on credit sales", "Adding outstanding deposits to the cash book"], tags: ["allowance_method", "error_correction"] },
  { id: "ch07-anki-119", q: "What is the biggest recovery trap?", a: "Forgetting to reverse the write-off before recording cash collection.", distractors: ["Debiting Bad Debts Expense when cash is collected", "Crediting Allowance when the account is first written off", "Recording recovery as revenue"], tags: ["allowance_method", "error_correction"] },
  { id: "ch07-anki-120", q: "What is the biggest petty cash trap?", a: "Recording expenses when cash is spent instead of when the fund is replenished.", distractors: ["Establishing the fund with Dr Cash at Bank / Cr Petty Cash", "Using the Over and Short account for bank charges", "Replenishing petty cash before any receipts are obtained"], tags: ["error_correction", "debit_credit"] },
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
    tags: card.tags ?? ["receivables"],
  };
}

const mcqs = FLASHCARDS.map(toMcq);

const output = `// Auto-generated from Notion Anki Flashcards — Chapter 7
// Regenerate: bun scripts/generate-ch07-anki-mcqs.js

export const ankiMcqs = ${JSON.stringify(mcqs, null, 2)};
`;

await Bun.write(new URL("../src/data/chapters/ch07-anki-mcqs.js", import.meta.url), output);

console.log(`Generated ${mcqs.length} MCQs → src/data/chapters/ch07-anki-mcqs.js`);
