/**
 * Generates MCQs from Chapter 3 Anki flashcards (Notion).
 * Run: bun scripts/generate-ch03-anki-mcqs.js
 */

const DISTRACTOR_POOLS = {
  accrual_timing: [
    "When cash is received or paid",
    "When a contract is signed",
    "At the end of the financial year only",
    "When an invoice is sent to the customer",
  ],
  basis: [
    "Cash basis accounting",
    "Tax basis accounting",
    "Modified cash basis accounting",
    "Fair value basis accounting",
  ],
  recognition: [
    "When cash is received",
    "When cash is paid",
    "When a contract is approved",
    "At year-end regardless of activity",
  ],
  ifrs15_steps: [
    "Identify the contract with the customer",
    "Identify the performance obligations in the contract",
    "Determine the transaction price",
    "Allocate the transaction price to the performance obligations",
    "Recognise revenue when, or as, each performance obligation is satisfied",
  ],
  accounting_cycle: [
    "Analyse transactions",
    "Journalise transactions in the general journal",
    "Post to the general ledger",
    "Prepare an unadjusted trial balance",
    "Prepare and journalise adjusting entries",
    "Post adjusting entries and prepare the adjusted trial balance",
    "Prepare financial statements",
    "Journalise and post closing entries",
    "Prepare a post-closing trial balance",
  ],
  adjusting_patterns: [
    "Debit Expense; Credit Asset",
    "Debit Depreciation Expense; Credit Accumulated Depreciation",
    "Debit Liability; Credit Revenue",
    "Debit Accounts Receivable; Credit Revenue",
    "Debit Expense; Credit Payable",
    "Debit Revenue; Credit Cash",
    "Debit Cash; Credit Revenue",
    "Debit Asset; Credit Cash",
  ],
  adjusting_categories: [
    "Prepaid expenses",
    "Revenue received in advance",
    "Accrued revenues",
    "Accrued expenses",
    "Cash receipts",
    "Cash payments",
  ],
  account_types: [
    "A liability account",
    "An equity account",
    "A revenue account",
    "An expense account",
    "A contra liability account",
  ],
  statements: [
    "Statement of Profit or Loss",
    "Statement of Financial Position",
    "Statement of Cash Flows",
    "Statement of Changes in Equity",
    "Trial balance",
  ],
  closing: [
    "Debit Revenue; Credit Income Summary",
    "Debit Income Summary; Credit Expenses",
    "Debit Income Summary; Credit Retained Earnings",
    "Debit Retained Earnings; Credit Dividends",
    "Debit Cash; Credit Revenue",
  ],
  effects_understate: [
    "Assets and revenues will both be overstated",
    "Liabilities will be overstated",
    "Expenses will be overstated",
    "Equity will be overstated with no effect on profit",
    "Cash will be understated only",
  ],
  effects_overstate: [
    "Expenses will be understated, assets overstated, and profit overstated",
    "Revenue will be understated, liabilities overstated, and profit understated",
    "Assets and liabilities will both be understated",
    "Only cash will be affected",
    "No effect on financial statements",
  ],
  yes_no: ["Yes", "No", "Only for large companies", "Only under cash basis"],
  numeric_common: ["$40", "$500", "$600", "$1,000", "$1,500", "$3,800", "$4,000", "$5,000"],
};

/** @type {Array<{ id: string, q: string, a: string, pool?: keyof typeof DISTRACTOR_POOLS, distractors?: string[], tags?: string[] }>} */
const FLASHCARDS = [
  { id: "ch03-anki-01", q: "What is the main focus of Chapter 3?", a: "Timing: recognising revenues and expenses in the correct accounting period, regardless of when cash is received or paid.", pool: "accrual_timing", tags: ["adjusting_entries"] },
  { id: "ch03-anki-02", q: "What is the accrual basis of accounting?", a: "A method where revenue is recognised when earned and expenses are recognised when incurred.", pool: "recognition", tags: ["adjusting_entries"] },
  { id: "ch03-anki-03", q: "What is the cash basis of accounting?", a: "A method where revenue is recognised when cash is received and expenses are recognised when cash is paid.", pool: "recognition", tags: ["adjusting_entries"] },
  { id: "ch03-anki-04", q: "Under accrual accounting, when is revenue recognised?", a: "When goods or services are provided, not necessarily when cash is received.", pool: "recognition", tags: ["adjusting_entries"] },
  { id: "ch03-anki-05", q: "Under cash basis accounting, when is revenue recognised?", a: "When cash is received.", distractors: ["When goods or services are provided", "When the performance obligation is satisfied", "When an invoice is issued"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-06", q: "Under accrual accounting, when are expenses recognised?", a: "When assets are consumed or liabilities are incurred.", distractors: ["When cash is paid", "When an invoice is received", "At the end of the financial year only"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-07", q: "Under cash basis accounting, when are expenses recognised?", a: "When cash is paid.", distractors: ["When assets are consumed or liabilities are incurred", "When goods are delivered", "When revenue is earned"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-08", q: "Which basis of accounting is required by AASB/IFRS?", a: "Accrual basis accounting.", pool: "basis", tags: ["adjusting_entries"] },
  { id: "ch03-anki-09", q: "Why is accrual accounting preferred over cash accounting?", a: "It gives a more accurate picture of financial performance and position by matching economic activity to the correct period.", distractors: ["It is simpler and requires fewer adjusting entries", "It only records transactions when cash changes hands", "It eliminates the need for a trial balance"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-10", q: "A law firm completes $5,000 of work in June but receives cash in July. When is revenue recognised under accrual accounting?", a: "June, because the service was performed in June.", distractors: ["July, because cash was received in July", "August, when the invoice is paid", "Split equally between June and July"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-11", q: "A law firm completes $5,000 of work in June but receives cash in July. When is revenue recognised under cash accounting?", a: "July, because cash was received in July.", distractors: ["June, because the service was performed in June", "When the contract was signed", "At year-end only"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-12", q: "What is the period assumption?", a: "The assumption that a business's economic life can be divided into artificial time periods such as months, quarters, or years.", distractors: ["The assumption that a business will operate indefinitely", "The assumption that only cash transactions are recorded", "The assumption that the business is separate from its owners"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-13", q: "Why does the period assumption matter?", a: "It creates the need to decide which period revenues and expenses belong to.", distractors: ["It eliminates the need for adjusting entries", "It requires all transactions to use cash basis", "It means financial statements are prepared only once"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-14", q: "According to the Conceptual Framework, income should be recognised when what happens?", a: "When changes in assets or liabilities can be recognised and faithfully represented.", distractors: ["When cash is received from customers", "When management approves the transaction", "When the ATO receives the tax return"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-15", q: "Generally, when is revenue recognised?", a: "When a service is performed or when goods are delivered.", pool: "recognition", tags: ["adjusting_entries"] },
  { id: "ch03-anki-16", q: "What is the matching of costs and income?", a: "Recognising related revenues and expenses in the same accounting period.", distractors: ["Recording all cash receipts as revenue", "Matching assets to liabilities on the balance sheet", "Recording expenses only when cash is paid"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-17", q: "What accounting standard deals with revenue from contracts with customers?", a: "IFRS 15 / AASB 15.", distractors: ["IFRS 16 / AASB 16", "IFRS 9 / AASB 9", "IAS 2 / AASB 102"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-18", q: "Under IFRS 15 / AASB 15, when is revenue recognised?", a: "When an entity satisfies a performance obligation in a contract.", distractors: ["When cash is received from the customer", "When the contract is signed", "When the invoice is mailed"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-19", q: "What is a performance obligation?", a: "A promise in a contract to transfer goods or services to a customer.", distractors: ["A penalty clause in a contract", "An obligation to pay suppliers", "A requirement to prepare financial statements"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-20", q: "What are the five IFRS 15 conditions for a valid contract?", a: "Contract approved; rights identified; payment terms identified; commercial substance; collection is probable.", distractors: ["Cash received; invoice sent; goods delivered; profit recorded; tax paid", "Contract signed; deposit paid; delivery scheduled; warranty issued; refund policy stated", "Revenue earned; expense matched; cash collected; audit completed; report filed"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-21", q: "What is step 1 of the IFRS 15 five-step model?", a: "Identify the contract with the customer.", pool: "ifrs15_steps", tags: ["adjusting_entries"] },
  { id: "ch03-anki-22", q: "What is step 2 of the IFRS 15 five-step model?", a: "Identify the performance obligations in the contract.", pool: "ifrs15_steps", tags: ["adjusting_entries"] },
  { id: "ch03-anki-23", q: "What is step 3 of the IFRS 15 five-step model?", a: "Determine the transaction price.", pool: "ifrs15_steps", tags: ["adjusting_entries"] },
  { id: "ch03-anki-24", q: "What is step 4 of the IFRS 15 five-step model?", a: "Allocate the transaction price to the performance obligations.", pool: "ifrs15_steps", tags: ["adjusting_entries"] },
  { id: "ch03-anki-25", q: "What is step 5 of the IFRS 15 five-step model?", a: "Recognise revenue when, or as, each performance obligation is satisfied.", pool: "ifrs15_steps", tags: ["adjusting_entries"] },
  { id: "ch03-anki-26", q: "What are expenses?", a: "Decreases in assets or increases in liabilities that result in decreases in equity, excluding distributions to owners.", distractors: ["Increases in assets from ordinary business activities", "Cash payments made during the period", "Amounts owed to shareholders"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-27", q: "When should expenses be recognised under the Conceptual Framework?", a: "When decreases in assets or increases in liabilities can be faithfully represented.", distractors: ["When cash is paid to suppliers", "When revenue is collected", "Only at year-end"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-28", q: "What is the matching principle?", a: "Expenses should be recognised in the same period as the related revenues they helped generate.", distractors: ["Expenses should be recognised when cash is paid", "Expenses should always be recorded before revenue", "Expenses should be deferred until cash is collected"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-29", q: "If an expense has no direct link to revenue, when is it recognised?", a: "In the period it is incurred.", distractors: ["When cash is paid", "In the next accounting period", "Only if it exceeds $1,000"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-30", q: "Why are adjusting entries needed?", a: "To ensure revenues and expenses are recorded in the correct accounting period before financial statements are prepared.", pool: "accrual_timing", tags: ["adjusting_entries"] },
  { id: "ch03-anki-31", q: "When are adjusting entries made?", a: "At the end of the accounting period.", distractors: ["When cash is received", "Before any transactions are recorded", "After the post-closing trial balance"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-32", q: "Are adjusting entries made before or after financial statements?", a: "Before financial statements are prepared.", distractors: ["After financial statements are prepared", "At the same time as closing entries only", "Only when cash transactions occur"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-33", q: "Every adjusting entry affects what two types of accounts?", a: "At least one income statement account and at least one balance sheet account.", distractors: ["Two cash accounts only", "Two revenue accounts only", "Two liability accounts only"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-34", q: "Do adjusting entries involve cash?", a: "No, adjusting entries never involve cash.", pool: "yes_no", tags: ["adjusting_entries"] },
  { id: "ch03-anki-35", q: "What are the two major categories of adjusting entries?", a: "Prepayments and accruals.", distractors: ["Assets and liabilities", "Revenues and expenses", "Debits and credits"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-36", q: "What are the two types of prepayment adjusting entries?", a: "Prepaid expenses and revenue received in advance.", pool: "adjusting_categories", tags: ["adjusting_entries"] },
  { id: "ch03-anki-37", q: "What are the two types of accrual adjusting entries?", a: "Accrued revenues and accrued expenses.", pool: "adjusting_categories", tags: ["adjusting_entries"] },
  { id: "ch03-anki-38", q: "What is a prepaid expense?", a: "Cash paid in advance and recorded as an asset until the benefit is used.", distractors: ["An expense incurred but not yet paid", "Cash received before services are performed", "Revenue earned but not yet received"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-39", q: "What is revenue received in advance?", a: "Cash received before services are performed, recorded first as a liability.", distractors: ["Revenue earned but not yet received in cash", "An expense paid in advance", "Cash paid before goods are received"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-40", q: "What is accrued revenue?", a: "Revenue earned but not yet received or recorded.", distractors: ["Cash received before revenue is earned", "An expense incurred but not paid", "Cash paid before an expense is incurred"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-41", q: "What is an accrued expense?", a: "An expense incurred but not yet paid or recorded.", distractors: ["Cash paid before the expense is incurred", "Revenue received before it is earned", "Revenue earned but not yet received"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-42", q: "What is the adjusting entry for a prepaid expense as it is used?", a: "Debit Expense; Credit Asset.", pool: "adjusting_patterns", tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-43", q: "Supplies purchased were $2,500 and supplies remaining are $1,000. How much supplies expense is recognised?", a: "$1,500.", distractors: ["$1,000", "$2,500", "$3,500"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-44", q: "What is the adjusting entry for supplies used?", a: "Debit Supplies Expense; Credit Supplies.", pool: "adjusting_patterns", tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-45", q: "Insurance paid for one year is $600. What is one month's insurance expense?", a: "$50.", distractors: ["$600", "$100", "$500"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-46", q: "What is the adjusting entry for expired prepaid insurance?", a: "Debit Insurance Expense; Credit Prepaid Insurance.", pool: "adjusting_patterns", tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-47", q: "What is depreciation?", a: "The allocation of the cost of a long-term asset to expense over its useful life.", distractors: ["The decrease in market value of an asset each year", "Writing off an asset when it breaks down", "The cash paid to purchase a long-term asset"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-48", q: "What is the adjusting entry for depreciation?", a: "Debit Depreciation Expense; Credit Accumulated Depreciation.", pool: "adjusting_patterns", tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-49", q: "What type of account is Accumulated Depreciation?", a: "A contra asset account.", distractors: ["A liability account", "An expense account", "A revenue account"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-50", q: "What does Accumulated Depreciation do on the Statement of Financial Position?", a: "It reduces the carrying amount of the related asset.", distractors: ["It increases total assets", "It is reported as a liability", "It is added to share capital"], tags: ["adjusting_entries", "balance_sheet"] },
  { id: "ch03-anki-51", q: "Equipment cost is $5,000 and accumulated depreciation is $40. What is the carrying amount?", a: "$4,960.", distractors: ["$5,040", "$5,000", "$40"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-52", q: "What happens when revenue received in advance becomes earned?", a: "The liability decreases and revenue increases.", distractors: ["The asset decreases and expense increases", "Cash increases and revenue decreases", "Equity decreases and liability increases"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-53", q: "What is the adjusting entry for revenue received in advance that has now been earned?", a: "Debit Revenue Received in Advance; Credit Service Revenue.", pool: "adjusting_patterns", tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-54", q: "A business received $1,200 for services to be performed by December. If $400 was earned in October, what is the October adjusting entry?", a: "Debit Revenue Received in Advance $400; Credit Service Revenue $400.", distractors: ["Debit Cash $400; Credit Service Revenue $400", "Debit Service Revenue $400; Credit Revenue Received in Advance $400", "Debit Accounts Receivable $400; Credit Service Revenue $400"], tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-55", q: "What is the adjusting entry for accrued revenue?", a: "Debit Accounts Receivable; Credit Revenue.", pool: "adjusting_patterns", tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-56", q: "Why is Accounts Receivable debited for accrued revenue?", a: "Because the business has earned revenue and has a right to receive cash later.", distractors: ["Because cash was received in advance", "Because an expense was incurred", "Because the business owes a supplier"], tags: ["adjusting_entries", "receivables"] },
  { id: "ch03-anki-57", q: "Commission revenue of $200 has been earned but not received. What is the adjusting entry?", a: "Debit Accounts Receivable $200; Credit Commission Revenue $200.", distractors: ["Debit Cash $200; Credit Commission Revenue $200", "Debit Commission Revenue $200; Credit Accounts Receivable $200", "Debit Commission Expense $200; Credit Accounts Payable $200"], tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-58", q: "What is the adjusting entry for accrued expenses?", a: "Debit Expense; Credit Payable.", pool: "adjusting_patterns", tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-59", q: "Why is a payable credited for accrued expenses?", a: "Because the business has incurred an expense and now owes payment.", distractors: ["Because cash was paid in advance", "Because revenue was earned", "Because an asset was purchased for cash"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-60", q: "A $5,000 loan has 12% annual interest. What is one month's interest expense?", a: "$50.", distractors: ["$600", "$500", "$60"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-61", q: "What is the adjusting entry for accrued interest?", a: "Debit Interest Expense; Credit Interest Payable.", pool: "adjusting_patterns", tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-62", q: "Salaries outstanding are 3 days × $400 per day. How much salary expense is accrued?", a: "$1,200.", distractors: ["$400", "$800", "$1,800"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-63", q: "What is the adjusting entry for accrued salaries?", a: "Debit Salaries Expense; Credit Salaries Payable.", pool: "adjusting_patterns", tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-64", q: "What is the debit/credit pattern for prepaid expenses?", a: "Debit Expense; Credit Asset.", pool: "adjusting_patterns", tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-65", q: "What is the debit/credit pattern for depreciation?", a: "Debit Depreciation Expense; Credit Accumulated Depreciation.", pool: "adjusting_patterns", tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-66", q: "What is the debit/credit pattern for revenue received in advance?", a: "Debit Liability; Credit Revenue.", pool: "adjusting_patterns", tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-67", q: "What is the debit/credit pattern for accrued revenue?", a: "Debit Asset/Receivable; Credit Revenue.", pool: "adjusting_patterns", tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-68", q: "What is the debit/credit pattern for accrued expenses?", a: "Debit Expense; Credit Liability/Payable.", pool: "adjusting_patterns", tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-69", q: "Which adjusting entry type starts with cash already paid?", a: "Prepaid expenses.", pool: "adjusting_categories", tags: ["adjusting_entries"] },
  { id: "ch03-anki-70", q: "Which adjusting entry type starts with cash already received?", a: "Revenue received in advance.", pool: "adjusting_categories", tags: ["adjusting_entries"] },
  { id: "ch03-anki-71", q: "Which adjusting entry type involves revenue earned but cash not yet received?", a: "Accrued revenue.", pool: "adjusting_categories", tags: ["adjusting_entries"] },
  { id: "ch03-anki-72", q: "Which adjusting entry type involves expense incurred but cash not yet paid?", a: "Accrued expense.", pool: "adjusting_categories", tags: ["adjusting_entries"] },
  { id: "ch03-anki-73", q: "What is an adjusted trial balance?", a: "A trial balance prepared after all adjusting entries have been journalised and posted.", distractors: ["A trial balance prepared before any adjusting entries", "A list of only permanent accounts", "A financial statement showing profit or loss"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-74", q: "What is the purpose of the adjusted trial balance?", a: "To prove total debits equal total credits after adjustments and to provide the basis for financial statements.", distractors: ["To record closing entries", "To replace the general ledger", "To calculate tax payable only"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-75", q: "What are the steps to prepare an adjusted trial balance?", a: "Start with the unadjusted trial balance, add adjustments, calculate new balances, then use the balances for financial statements.", distractors: ["Close all revenue accounts first, then prepare the trial balance", "Record cash transactions only, then total debits and credits", "Prepare financial statements first, then adjust accounts"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-76", q: "Which statement uses revenue and expense accounts?", a: "Statement of Profit or Loss.", pool: "statements", tags: ["adjusting_entries", "income_statement"] },
  { id: "ch03-anki-77", q: "Which statement uses assets, liabilities, and equity accounts?", a: "Statement of Financial Position.", pool: "statements", tags: ["adjusting_entries", "balance_sheet"] },
  { id: "ch03-anki-78", q: "What does the Statement of Changes in Equity use?", a: "Profit or loss plus dividends to update Retained Earnings.", distractors: ["Only cash receipts and payments", "Only asset and liability balances", "Revenue and expense accounts without dividends"], tags: ["adjusting_entries", "equity"] },
  { id: "ch03-anki-79", q: "What are temporary accounts?", a: "Accounts that are reset to zero each period, such as revenue, expenses, dividends, and income summary.", distractors: ["Accounts carried forward to future periods", "Only asset and liability accounts", "Accounts that never appear on financial statements"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-80", q: "What are permanent accounts?", a: "Accounts carried forward to future periods, such as assets, liabilities, and equity accounts.", distractors: ["Accounts reset to zero each period", "Revenue and expense accounts only", "Income Summary and Dividends only"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-81", q: "What is the purpose of closing entries?", a: "To transfer temporary account balances to Retained Earnings and reset temporary accounts to zero.", distractors: ["To record adjusting entries at period-end", "To prove debits equal credits", "To record daily cash transactions"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-82", q: "What account are revenues closed to first?", a: "Income Summary.", distractors: ["Retained Earnings", "Cash", "Accounts Receivable"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-83", q: "What is the entry to close revenue accounts?", a: "Debit Revenue; Credit Income Summary.", pool: "closing", tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-84", q: "What account are expenses closed to first?", a: "Income Summary.", distractors: ["Retained Earnings", "Cash", "Accounts Payable"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-85", q: "What is the entry to close expense accounts?", a: "Debit Income Summary; Credit Expenses.", pool: "closing", tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-86", q: "If there is profit, how is Income Summary closed?", a: "Debit Income Summary; Credit Retained Earnings.", pool: "closing", tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-87", q: "How are dividends closed?", a: "Debit Retained Earnings; Credit Dividends.", pool: "closing", tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-88", q: "After closing entries, which accounts have zero balances?", a: "Revenue, expenses, dividends, and income summary.", distractors: ["Assets, liabilities, and equity", "Cash and accounts payable only", "All accounts including permanent accounts"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-89", q: "Do asset, liability, and equity accounts get closed?", a: "No, they are permanent accounts and carry forward.", pool: "yes_no", tags: ["adjusting_entries"] },
  { id: "ch03-anki-90", q: "What is a post-closing trial balance?", a: "A trial balance prepared after closing entries are journalised and posted.", distractors: ["A trial balance prepared before adjusting entries", "A trial balance of only revenue and expense accounts", "The same as an unadjusted trial balance"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-91", q: "What accounts appear on a post-closing trial balance?", a: "Only permanent accounts: assets, liabilities, and equity.", distractors: ["Revenue, expenses, and dividends", "All accounts including Income Summary", "Only cash and receivables"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-92", q: "What accounts should not appear on a post-closing trial balance?", a: "Revenue, expenses, dividends, and income summary.", distractors: ["Assets, liabilities, and equity", "Cash and accounts payable", "Retained earnings and share capital"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-93", q: "What is the purpose of the post-closing trial balance?", a: "To prove equality of permanent account balances carried forward to the next period.", distractors: ["To calculate depreciation expense", "To record adjusting entries", "To prepare the income statement only"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-94", q: "What is the accounting cycle?", a: "The repeated sequence of accounting steps followed each accounting period.", distractors: ["The process of auditing financial statements", "The tax calculation process for a business", "The procedure for issuing shares"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-95", q: "What is step 1 of the accounting cycle?", a: "Analyse transactions.", pool: "accounting_cycle", tags: ["adjusting_entries"] },
  { id: "ch03-anki-96", q: "What is step 2 of the accounting cycle?", a: "Journalise transactions in the general journal.", pool: "accounting_cycle", tags: ["adjusting_entries"] },
  { id: "ch03-anki-97", q: "What is step 3 of the accounting cycle?", a: "Post to the general ledger.", pool: "accounting_cycle", tags: ["adjusting_entries"] },
  { id: "ch03-anki-98", q: "What is step 4 of the accounting cycle?", a: "Prepare an unadjusted trial balance.", pool: "accounting_cycle", tags: ["adjusting_entries"] },
  { id: "ch03-anki-99", q: "What is step 5 of the accounting cycle?", a: "Prepare and journalise adjusting entries.", pool: "accounting_cycle", tags: ["adjusting_entries"] },
  { id: "ch03-anki-100", q: "What is step 6 of the accounting cycle?", a: "Post adjusting entries and prepare the adjusted trial balance.", pool: "accounting_cycle", tags: ["adjusting_entries"] },
  { id: "ch03-anki-101", q: "What is step 7 of the accounting cycle?", a: "Prepare financial statements.", pool: "accounting_cycle", tags: ["adjusting_entries"] },
  { id: "ch03-anki-102", q: "What is step 8 of the accounting cycle?", a: "Journalise and post closing entries.", pool: "accounting_cycle", tags: ["adjusting_entries"] },
  { id: "ch03-anki-103", q: "What is step 9 of the accounting cycle?", a: "Prepare a post-closing trial balance.", pool: "accounting_cycle", tags: ["adjusting_entries"] },
  { id: "ch03-anki-104", q: "What is an accounting worksheet?", a: "A spreadsheet used to organise data for adjustments and financial statement preparation.", distractors: ["A formal part of the accounting records required by AASB", "A financial statement issued to shareholders", "The general ledger itself"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-105", q: "Is a worksheet a formal part of the accounting records?", a: "No, it is an optional working tool.", pool: "yes_no", tags: ["adjusting_entries"] },
  { id: "ch03-anki-106", q: "Why is a worksheet useful?", a: "It helps organise data, check for errors, and show the transition from unadjusted trial balance to financial statements.", distractors: ["It replaces the need for a general ledger", "It is required for tax filing", "It eliminates adjusting entries"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-107", q: "What columns are commonly included in a worksheet?", a: "Account titles, unadjusted trial balance, adjustments, adjusted trial balance, income statement, and statement of financial position.", distractors: ["Only cash receipts and cash payments", "Only revenue and expense accounts", "Share price, dividends, and market cap only"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-108", q: "Why do adjusting entries improve the accuracy of financial statements?", a: "They ensure all earned revenues and incurred expenses are included in the correct period.", pool: "accrual_timing", tags: ["adjusting_entries"] },
  { id: "ch03-anki-109", q: "Why is cash excluded from adjusting entries?", a: "Because adjusting entries correct timing differences after cash transactions have already occurred or before cash transactions occur.", distractors: ["Because cash is never used in accrual accounting", "Because adjusting entries only affect equity", "Because cash accounts are closed first"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-110", q: "If cash was paid before an expense was incurred, what adjusting category is used?", a: "Prepaid expense.", pool: "adjusting_categories", tags: ["adjusting_entries"] },
  { id: "ch03-anki-111", q: "If cash was received before revenue was earned, what adjusting category is used?", a: "Revenue received in advance.", pool: "adjusting_categories", tags: ["adjusting_entries"] },
  { id: "ch03-anki-112", q: "If revenue was earned before cash was received, what adjusting category is used?", a: "Accrued revenue.", pool: "adjusting_categories", tags: ["adjusting_entries"] },
  { id: "ch03-anki-113", q: "If an expense was incurred before cash was paid, what adjusting category is used?", a: "Accrued expense.", pool: "adjusting_categories", tags: ["adjusting_entries"] },
  { id: "ch03-anki-114", q: "What is the key difference between revenue received in advance and accrued revenue?", a: "Revenue received in advance involves cash received before earning revenue; accrued revenue involves revenue earned before receiving cash.", distractors: ["Both involve cash received after revenue is earned", "Both are recorded as assets", "There is no difference between them"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-115", q: "What is the key difference between prepaid expenses and accrued expenses?", a: "Prepaid expenses involve cash paid before expense recognition; accrued expenses involve expense recognition before cash payment.", distractors: ["Both involve cash paid after the expense is incurred", "Both are liabilities", "Prepaid expenses are always larger than accrued expenses"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-116", q: "What happens if accrued expenses are not adjusted?", a: "Expenses and liabilities will be understated, and profit may be overstated.", pool: "effects_understate", tags: ["adjusting_entries", "error_correction"] },
  { id: "ch03-anki-117", q: "What happens if accrued revenues are not adjusted?", a: "Revenues and assets will be understated, and profit may be understated.", distractors: ["Revenues and assets will both be overstated", "Liabilities will be overstated", "Expenses will be overstated"], tags: ["adjusting_entries", "error_correction"] },
  { id: "ch03-anki-118", q: "What happens if expired prepaid expenses are not adjusted?", a: "Expenses will be understated, assets overstated, and profit overstated.", pool: "effects_overstate", tags: ["adjusting_entries", "error_correction"] },
  { id: "ch03-anki-119", q: "What happens if earned unearned revenue is not adjusted?", a: "Revenue will be understated, liabilities overstated, and profit understated.", distractors: ["Revenue will be overstated and liabilities understated", "Assets and revenue will both be overstated", "Only cash will be affected"], tags: ["adjusting_entries", "error_correction"] },
  { id: "ch03-anki-120", q: "What is the big picture sequence of Chapter 3?", a: "Record transactions → adjust accounts → prepare adjusted trial balance → prepare financial statements → close temporary accounts → prepare post-closing trial balance.", distractors: ["Close accounts → record transactions → prepare financial statements", "Prepare financial statements → record transactions → adjust accounts", "Record cash only → prepare tax return → close accounts"], tags: ["adjusting_entries"] },
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
    tags: card.tags ?? ["adjusting_entries"],
  };
}

const mcqs = FLASHCARDS.map(toMcq);

const output = `// Auto-generated from Notion Anki Flashcards — Chapter 3
// Regenerate: bun scripts/generate-ch03-anki-mcqs.js

export const ankiMcqs = ${JSON.stringify(mcqs, null, 2)};
`;

await Bun.write(new URL("../src/data/chapters/ch03-anki-mcqs.js", import.meta.url), output);

console.log(`Generated ${mcqs.length} MCQs → src/data/chapters/ch03-anki-mcqs.js`);
