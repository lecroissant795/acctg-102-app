/**
 * Generates MCQs from Chapter 3 Anki flashcards (Notion).
 * Run: bun scripts/generate-ch03-anki-mcqs.js
 */

import { buildTeachingExplanation } from "../src/utils/teachingExplanation.js";

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
  { id: "ch03-anki-01", q: "A retailer pays rent on 1 January for the full year but only occupies the premises from February. Under accrual accounting, what issue does Chapter 3 primarily address?", a: "Matching economic activity to the correct reporting period, not merely to cash flows.", distractors: ["Recording only transactions that change the cash balance during the period", "Valuing all assets at current market prices at each month-end reporting date", "Eliminating the need to prepare any trial balance before issuing statements"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-02", q: "Which statement best distinguishes accrual accounting from cash accounting?", a: "Revenue and expenses are recognised when earned or incurred, even if cash has not yet moved.", distractors: ["Revenue and expenses are recognised only when cash is received or paid", "Revenue is recognised at contract signing and expenses when invoices arrive", "Only large entities must accrue; small entities always use cash accounting"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-03", q: "A sole trader records a $900 electricity bill only after paying it in cash, ignoring usage in the prior month. Which basis is being applied?", a: "Cash basis accounting.", distractors: ["Accrual basis accounting", "Tax basis accounting with AASB adjustments", "Fair value basis accounting"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-04", q: "On 28 June, Apex Ltd delivers goods to a customer on credit. Payment is expected in August. When should revenue be recognised under accrual accounting?", a: "In June, when control of the goods passes to the customer.", distractors: ["In August, when cash is collected from the customer", "In July, when the invoice is mailed to the customer", "Evenly over June, July, and August as cash is expected"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-05", q: "Using the same Apex Ltd delivery in June with cash received in August, when is revenue recognised under cash basis accounting?", a: "In August, when cash is received from the customer.", distractors: ["In June, when the goods are delivered to the customer", "In June, when the sales invoice is prepared", "In the year-end adjustment process only"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-06", q: "Staff use office supplies throughout June, but payment to the supplier occurs in July. Under accrual accounting, when is the expense recognised?", a: "In June, when the supplies are consumed in operations.", distractors: ["In July, when cash is paid to the supplier", "When the purchase order is approved by management", "Only if the amount exceeds the company's capitalization threshold"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-07", q: "For the same supplies example with payment in July, when is the expense recognised under cash basis accounting?", a: "In July, when cash is paid to the supplier.", distractors: ["In June, when the supplies are consumed in operations", "In June, when the supplier delivers the goods", "When the bank statement is reconciled at month-end"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-08", q: "A listed company prepares general purpose financial statements under AASB/IFRS. Which measurement approach to revenue and expenses is required?", a: "Accrual basis accounting.", distractors: ["Cash basis accounting for all operating items", "Modified cash basis with quarterly accruals only", "Tax basis accounting as lodged with the ATO"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-09", q: "An analyst compares two firms with identical cash receipts but different credit sales. Why is accrual information usually more useful than cash records alone?", a: "It links performance and position to the period in which goods and services are provided.", distractors: ["It is always easier to prepare because no adjusting entries are needed", "It reports only liquid assets, improving short-term decision making", "It removes the need to prepare a statement of financial position"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-10", q: "A law firm completes $5,000 of billable work in June but receives cash in July. Under accrual accounting, in which period should the revenue be reported?", a: "June, because the performance obligation was satisfied in that period.", distractors: ["July, because that is when cash was received from the client", "August, when the client pays the posted invoice in full", "Half in June and half in July to match cash collection"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-11", q: "For the same law firm example, under cash basis accounting, in which period should the revenue be reported?", a: "July, because revenue is recognised when cash is received.", distractors: ["June, because the legal services were performed then", "June, because the engagement letter was signed then", "At year-end through an adjusting entry only"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-12", q: "Management wants monthly performance reports even though the business expects to operate for many years. Which assumption makes this reporting approach possible?", a: "The time period (periodicity) assumption.", distractors: ["The going concern assumption alone, without dividing the entity's life", "The monetary unit assumption applied to cash flows only", "The economic entity assumption that separates owner and business cash"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-13", q: "Because financial statements are prepared for artificial time periods, what practical problem must accountants solve each period?", a: "Determining which revenues and expenses belong in the current period rather than another.", distractors: ["Converting all transactions to cash basis amounts before reporting results", "Removing all liability balances from the statement of financial position each period", "Reporting only permanent accounts on the statement of profit or loss"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-14", q: "Under the Conceptual Framework, income is recognised when which condition is met?", a: "Changes in assets or liabilities from the transaction can be measured reliably and represented faithfully.", distractors: ["Cash has been received from the customer or another debtor in full", "Management has approved the transaction in a signed internal memo", "The entity has lodged its income tax return for the reporting period"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-15", q: "Bright Apps sells a one-year software licence on 1 April. Support and updates are delivered continuously. When is revenue generally recognised?", a: "Over time as the software service is provided to the customer.", distractors: ["Entirely on 1 April because cash was received upfront", "Only when the customer renews the licence next year", "When the contract is signed, regardless of service delivery"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-16", q: "A retailer pays commission to sales staff based on goods sold in October, but pays the commission in November. Which principle requires the commission expense to appear in October?", a: "The matching principle (expense recognition).", distractors: ["The revenue recognition principle applied to cash receipts", "The full disclosure principle for related-party payments", "The historical cost principle for all operating payments"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-17", q: "A manufacturer enters a long-term contract to deliver customised equipment with installation. Which standard governs revenue from this customer contract?", a: "AASB 15 / IFRS 15 Revenue from Contracts with Customers.", distractors: ["AASB 16 / IFRS 16 Leases for all contract revenue", "AASB 9 / IFRS 9 Financial Instruments for product sales", "AASB 102 / IAS 2 Inventories for manufactured goods only"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-18", q: "Under AASB 15 / IFRS 15, at what point is revenue recognised for a distinct performance obligation?", a: "When (or as) the entity satisfies that performance obligation.", distractors: ["When cash is received, even if delivery is incomplete", "When the contract is signed by both parties", "When the invoice is emailed to the customer"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-19", q: "A contract promises to deliver goods, perform installation, and provide a two-year warranty service. What is each distinct promise called under IFRS 15?", a: "A performance obligation.", distractors: ["A contingent liability to be disclosed only", "A trade payable arising from the contract", "A deferred tax asset from future warranty costs"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-20", q: "Before applying the five-step revenue model, which set of conditions must a contract with a customer satisfy?", a: "Approved parties, identified rights, payment terms, commercial substance, and probable collection.", distractors: ["Cash received, invoice issued, goods shipped, profit recorded, and tax remitted", "Signed agreement, deposit paid, delivery date set, warranty issued, and refund policy stated", "Revenue earned, expense matched, bank reconciled, audit completed, and report filed"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-21", q: "A signed customer contract exists but performance obligations have not yet been analysed. Which IFRS 15 step should be performed next?", a: "Identify the performance obligations in the contract.", distractors: ["Determine the transaction price for the entire deal", "Allocate the transaction price to each obligation", "Recognise revenue when cash is collected from the customer"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-22", q: "Performance obligations are identified and the entity must decide the total amount it expects to receive. Which IFRS 15 step applies?", a: "Determine the transaction price.", distractors: ["Identify the contract with the customer again", "Recognise revenue immediately for each obligation", "Prepare closing entries for temporary accounts"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-23", q: "The transaction price is $12,000 for goods ($8,000) and installation ($4,000). Which IFRS 15 step assigns amounts to each obligation?", a: "Allocate the transaction price to the performance obligations.", distractors: ["Identify the contract with the customer", "Determine whether the contract has commercial substance", "Close revenue accounts to retained earnings"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-24", q: "After allocating the transaction price, goods are delivered but installation is unfinished at period-end. Which IFRS 15 step governs recognition now?", a: "Recognise revenue when, or as, each performance obligation is satisfied.", distractors: ["Identify the payment terms in the contract only", "Post adjusting entries before identifying obligations", "Defer all revenue until every obligation is fully complete"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-25", q: "At contract inception, no performance obligations have been identified yet. Which action belongs to step 1 of the IFRS 15 model?", a: "Identify the contract with the customer.", distractors: ["Allocate the transaction price to each performance obligation", "Recognise revenue when cash is received from the customer", "Close expense accounts to income summary"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-26", q: "Which description best fits expenses under the Conceptual Framework?", a: "Decreases in assets or increases in liabilities that reduce equity, other than distributions to owners.", distractors: ["Any cash payment made during the accounting period, regardless of benefit received", "Increases in assets from ordinary operating activities that expand capacity", "Amounts owed to shareholders for their invested capital and retained profits"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-27", q: "Under the Conceptual Framework, when should an expense be recognised if it cannot be linked directly to specific revenue?", a: "In the period when the decrease in assets or increase in liabilities occurs.", distractors: ["Only when cash is paid to the supplier or other creditor", "In the following period when related cash is collected from customers", "Only if the amount exceeds a board-approved materiality limit for disclosure"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-28", q: "A publisher earns subscription revenue in July but prints magazines in June. Which principle supports recording printing costs in June?", a: "The matching principle: recognise related expenses in the same period as the revenue they help generate.", distractors: ["Recognise expenses only when cash is paid, regardless of when revenue is earned", "Always record expenses before revenue in every journal entry to avoid overstating profit", "Defer all expenses until cash from customers is collected in a later period"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-29", q: "Office rent of $3,000 is incurred in September with payment due in October. No specific sales revenue is tied to the rent. When is the expense recognised?", a: "In September, when the rent obligation is incurred.", distractors: ["In October, when cash is paid to the landlord", "In the next financial year when the lease renews", "Only after the amount is approved in the cash budget"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-30", q: "At 30 June, some revenues have been earned and some expenses incurred without yet being recorded. Why are adjusting entries required?", a: "To assign those revenues and expenses to the correct period before statements are prepared.", distractors: ["To replace all original journal entries with cash-basis transactions only", "To convert accrual ledger balances to tax basis amounts automatically", "To eliminate every statement of financial position account at period-end"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-31", q: "When in the accounting cycle are adjusting entries normally recorded?", a: "At the end of the accounting period, before financial statements are prepared.", distractors: ["Immediately whenever cash is received or paid in the bank account", "After closing entries and preparation of the post-closing trial balance", "Only when the ATO requests a tax reconciliation for the entity"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-32", q: "A trainee proposes recording adjusting entries after publishing the income statement. What is the correct sequencing?", a: "Adjusting entries must be recorded and posted before financial statements are prepared.", distractors: ["Financial statements should be prepared first, then adjusted for errors", "Adjusting entries are optional once the unadjusted trial balance balances", "Closing entries must always precede any adjusting entries"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-33", q: "Which statement about the account types affected by a typical adjusting entry is most accurate?", a: "At least one income statement account and at least one statement of financial position account are affected.", distractors: ["Only cash and revenue accounts are ever affected together in one entry", "Only two statement of financial position accounts are affected with no profit impact", "Only expense and dividend accounts are affected at period-end with no asset change"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-34", q: "At year-end, unpaid wages and expired prepaid insurance are adjusted. Which statement about cash in these entries is correct?", a: "Adjusting entries do not involve the Cash account.", distractors: ["Every adjusting entry must include a debit or credit to Cash", "Cash is credited whenever an expense adjustment is recorded", "Cash is adjusted first before any accrual or deferral entry"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-35", q: "Which pair correctly states the two broad categories of adjusting entries?", a: "Prepayments (deferrals) and accruals.", distractors: ["Assets and liabilities only, with no income statement effect", "Revenues and expenses only, with no balance sheet effect", "Debits and credits recorded in the general journal only"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-36", q: "Cash was paid before benefits were consumed, or cash was received before revenue was earned. Which subcategory of prepayments applies to revenue?", a: "Revenue received in advance (unearned revenue).", distractors: ["Accrued revenue from services already performed", "Accrued expense for wages not yet paid", "Depreciation of a previously purchased non-current asset"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-37", q: "Services have been performed but not billed, and wages have been earned by staff but not paid. Which subcategory covers both situations?", a: "Accruals (accrued revenues and accrued expenses).", distractors: ["Prepaid expenses and deferred revenue only", "Cash receipts and cash payments awaiting posting", "Closing entries for temporary accounts"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-38", q: "On 1 May, Nova Ltd pays $6,000 for six months' insurance coverage starting immediately. Before any adjustment, how should the payment be recorded?", a: "As a prepaid expense (asset) because future economic benefits remain.", distractors: ["As insurance expense in full on the payment date", "As unearned revenue because cash left the business", "As a liability until the insurer delivers the policy document"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-39", q: "A gym collects $1,200 on 1 January for a member's annual membership starting immediately. Before services are provided, the receipt should be recorded as:", a: "A liability (unearned revenue) because the performance obligation is unsatisfied.", distractors: ["Membership revenue in full on the date the cash is received from the member", "A prepaid expense asset because the gym received cash before paying any costs", "Accounts receivable because the member still owes future visits under the contract"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-40", q: "At 30 June, consulting work worth $2,400 is complete but the client has not been invoiced. Which description fits this situation?", a: "Accrued revenue: earned but not yet recorded or received in cash.", distractors: ["Unearned revenue because cash has not been collected", "Prepaid expense because the client will pay later", "Accrued expense because staff time created a payable"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-41", q: "Employees earned $4,500 in wages during the last week of June, payable in July. Which description applies?", a: "Accrued expense: incurred in June but not yet paid or recorded.", distractors: ["Prepaid expense because cash will leave the bank later", "Unearned revenue because employees provided future service", "Accrued revenue because the business will receive cash later"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-42", q: "Three months of a 12-month insurance policy have expired. Which adjusting entry correctly records the expired portion?", a: "Debit Insurance Expense; Credit Prepaid Insurance.", distractors: ["Debit Prepaid Insurance; Credit Cash", "Debit Cash; Credit Insurance Expense", "Debit Insurance Expense; Credit Accounts Payable"], tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-43", q: "Supplies purchased during the period were $2,500 and supplies on hand at year-end are $1,000. What supplies expense should be recognised?", a: "$1,500.", distractors: ["$1,000, equal to the remaining supplies on hand", "$2,500, equal to the total purchases during the period", "$3,500, combining purchases and the remaining balance"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-44", q: "Physical count shows $800 of unused supplies remain from opening inventory and purchases. Which entry records supplies used?", a: "Debit Supplies Expense; Credit Supplies.", distractors: ["Debit Supplies; Credit Supplies Expense", "Debit Cash; Credit Supplies Expense", "Debit Supplies Expense; Credit Accounts Payable"], tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-45", q: "Annual insurance of $600 was paid on 1 January. What is one month's insurance expense?", a: "$50.", distractors: ["$600, because the full policy was prepaid", "$100, assuming a ten-month policy year", "$500, after deducting one month from the annual payment"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-46", q: "At 31 March, one quarter of a prepaid annual insurance policy has expired. Which entry is required?", a: "Debit Insurance Expense; Credit Prepaid Insurance.", distractors: ["Debit Prepaid Insurance; Credit Insurance Expense", "Debit Cash; Credit Prepaid Insurance", "Debit Insurance Expense; Credit Accounts Payable"], tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-47", q: "Equipment costing $24,000 is expected to benefit operations for eight years with no residual value. What is depreciation in accounting terms?", a: "Systematic allocation of the asset's cost to expense over its useful life.", distractors: ["The decline in the asset's fair market value each year", "Writing off the asset immediately when repairs become frequent", "The cash outflow recorded when the asset was originally purchased"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-48", q: "Year-end depreciation on office equipment must be recorded. Which adjusting entry is correct?", a: "Debit Depreciation Expense; Credit Accumulated Depreciation.", distractors: ["Debit Accumulated Depreciation; Credit Depreciation Expense", "Debit Equipment; Credit Depreciation Expense", "Debit Depreciation Expense; Credit Cash"], tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-49", q: "Accumulated Depreciation has a credit balance of $18,000. How is this account classified?", a: "A contra asset account deducted from the related non-current asset.", distractors: ["A liability for future replacement of the asset", "An expense account closed to income summary", "A revenue account reducing total income for the period"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-50", q: "On the statement of financial position, why is Accumulated Depreciation shown separately from the asset cost?", a: "It reduces the carrying amount of the related asset without altering the original cost recorded.", distractors: ["It increases total assets each year by the depreciation expense amount recorded", "It is reported as a current liability until the underlying asset is sold or scrapped", "It is added to share capital as a permanent equity adjustment each period"], tags: ["adjusting_entries", "balance_sheet"] },
  { id: "ch03-anki-51", q: "Equipment cost is $5,000 and accumulated depreciation is $40. What is the carrying amount?", a: "$4,960.", distractors: ["$5,040, adding depreciation to the original cost", "$5,000, because cost never changes on the ledger", "$40, equal to the accumulated depreciation balance only"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-52", q: "A customer paid in advance, and part of the obligation is now satisfied. What happens to the liability and revenue accounts?", a: "The liability decreases and revenue increases for the earned portion.", distractors: ["The asset decreases and an expense increases for the earned portion", "Cash increases and revenue decreases when service is performed", "Equity decreases while the unearned liability increases"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-53", q: "Unearned Revenue of $3,000 includes $900 earned by month-end. Which adjusting entry is correct?", a: "Debit Unearned Revenue $900; Credit Service Revenue $900.", distractors: ["Debit Cash $900; Credit Service Revenue $900", "Debit Service Revenue $900; Credit Unearned Revenue $900", "Debit Accounts Receivable $900; Credit Unearned Revenue $900"], tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-54", q: "A business received $1,200 for services due by December. By October, $400 of the work is complete. What is the October adjusting entry?", a: "Debit Unearned Revenue $400; Credit Service Revenue $400.", distractors: ["Debit Cash $400; Credit Service Revenue $400", "Debit Service Revenue $400; Credit Unearned Revenue $400", "Debit Accounts Receivable $400; Credit Service Revenue $400"], tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-55", q: "Consulting revenue of $750 is earned on credit at period-end with no prior entry. Which adjustment is required?", a: "Debit Accounts Receivable; Credit Service Revenue.", distractors: ["Debit Cash; Credit Service Revenue", "Debit Service Revenue; Credit Accounts Receivable", "Debit Unearned Revenue; Credit Service Revenue"], tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-56", q: "Why is Accounts Receivable debited in an accrued revenue adjustment?", a: "The entity has a right to collect cash because revenue has already been earned.", distractors: ["Cash was received from the customer before the related service was performed", "An expense was incurred during the period and must be matched against revenue", "The entity owes the customer a refund for services prepaid but not yet delivered"], tags: ["adjusting_entries", "receivables"] },
  { id: "ch03-anki-57", q: "Commission revenue of $200 is earned but not yet received at 30 June. Which entry should be recorded?", a: "Debit Accounts Receivable $200; Credit Commission Revenue $200.", distractors: ["Debit Cash $200; Credit Commission Revenue $200", "Debit Commission Revenue $200; Credit Accounts Receivable $200", "Debit Commission Expense $200; Credit Accounts Payable $200"], tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-58", q: "Interest on a loan has accrued but not been paid at balance date. Which adjusting entry pattern applies?", a: "Debit Interest Expense; Credit Interest Payable.", distractors: ["Debit Interest Payable; Credit Cash", "Debit Cash; Credit Interest Expense", "Debit Prepaid Interest; Credit Interest Expense"], tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-59", q: "Why is a payable credited when an accrued expense is adjusted?", a: "The business owes payment for an expense already incurred.", distractors: ["Cash was paid in advance and must be deferred", "Revenue was earned and collection is expected later", "An asset was purchased and must be capitalised"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-60", q: "A $5,000 loan bears 12% interest per annum. What is one month's accrued interest expense?", a: "$50.", distractors: ["$600, equal to a full year's interest on the loan", "$500, using a simple 10% monthly rate by mistake", "$60, after adding a service fee to the monthly interest"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-61", q: "At 30 June, two months' interest on a note payable has not been paid. Which entry records the accrual?", a: "Debit Interest Expense; Credit Interest Payable.", distractors: ["Debit Interest Payable; Credit Interest Expense", "Debit Cash; Credit Interest Expense", "Debit Interest Expense; Credit Notes Payable for the full loan"], tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-62", q: "Salaries of $400 per day are unpaid for the last three days of the period. How much salary expense should be accrued?", a: "$1,200.", distractors: ["$400, equal to one day's unpaid wages only", "$800, assuming only two unpaid days in the period", "$1,800, after adding a weekend not worked to the accrual"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-63", q: "Accrued salaries at period-end total $1,200. Which adjusting entry should be recorded?", a: "Debit Salaries Expense; Credit Salaries Payable.", distractors: ["Debit Salaries Payable; Credit Salaries Expense", "Debit Cash; Credit Salaries Expense", "Debit Salaries Expense; Credit Prepaid Salaries"], tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-64", q: "At year-end, $450 of prepaid rent has expired. Which debit/credit pattern applies?", a: "Debit Rent Expense; Credit Prepaid Rent.", distractors: ["Debit Prepaid Rent; Credit Rent Expense", "Debit Rent Expense; Credit Cash", "Debit Accounts Payable; Credit Rent Expense"], tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-65", q: "Equipment with a $10,000 cost is depreciated $1,250 for the year. Which debit/credit pattern applies?", a: "Debit Depreciation Expense; Credit Accumulated Depreciation.", distractors: ["Debit Accumulated Depreciation; Credit Depreciation Expense", "Debit Equipment; Credit Accumulated Depreciation", "Debit Depreciation Expense; Credit Equipment"], tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-66", q: "A magazine publisher delivers issues for which customers paid in advance. Which debit/credit pattern applies?", a: "Debit Unearned Revenue; Credit Service Revenue.", distractors: ["Debit Service Revenue; Credit Unearned Revenue", "Debit Cash; Credit Service Revenue", "Debit Accounts Receivable; Credit Unearned Revenue"], tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-67", q: "Legal services of $3,200 were performed on credit but not yet billed. Which debit/credit pattern applies?", a: "Debit Accounts Receivable; Credit Service Revenue.", distractors: ["Debit Cash; Credit Service Revenue", "Debit Service Revenue; Credit Accounts Receivable", "Debit Unearned Revenue; Credit Service Revenue"], tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-68", q: "Utilities of $680 were consumed in June with payment due in July. Which debit/credit pattern applies?", a: "Debit Utilities Expense; Credit Utilities Payable.", distractors: ["Debit Utilities Payable; Credit Cash", "Debit Prepaid Utilities; Credit Utilities Expense", "Debit Cash; Credit Utilities Expense"], tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-69", q: "Cash was paid on 1 February for advertising to run from March to May. At 31 March, which adjustment category applies?", a: "Prepaid expense adjustment for the portion consumed.", distractors: ["Accrued revenue because the ad will attract future sales", "Accrued expense because cash was already paid", "Unearned revenue because the agency owes future service"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-70", q: "A tenant pays three months' rent in advance on 1 June for occupancy from June to August. At 30 June, which adjustment category applies?", a: "Revenue received in advance (unearned revenue) for the unused portion.", distractors: ["Accrued revenue because the landlord collected cash before fully earning it", "Prepaid expense because the landlord received cash before incurring any costs", "Accrued expense because two months of future occupancy remain at month-end"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-71", q: "Advertising services were provided on credit in May; cash is expected in June. Which adjustment category applies at 31 May?", a: "Accrued revenue.", distractors: ["Revenue received in advance", "Prepaid expense for future advertising", "Accrued expense for media purchases not yet billed"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-72", q: "Employee wages for the final two days of the month will be paid next week. Which adjustment category applies?", a: "Accrued expense.", distractors: ["Prepaid expense because payroll cash will leave later", "Accrued revenue because staff provided future service", "Unearned revenue because wages are unpaid at period-end"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-73", q: "After all adjusting entries are posted, what is an adjusted trial balance?", a: "A list of account balances proving debits equal credits after adjustments.", distractors: ["The trial balance prepared before any adjusting entries are made", "A formal income statement replacing ledger account detail", "A schedule containing only permanent asset and liability accounts"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-74", q: "Why do accountants prepare an adjusted trial balance before issuing statements?", a: "To verify adjusted balances and provide the basis for financial statement preparation.", distractors: ["To record closing entries for temporary accounts before adjustments are complete", "To replace the general ledger entirely for the next accounting period", "To calculate tax payable without using any revenue or expense account balances"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-75", q: "Which sequence best describes preparing an adjusted trial balance?", a: "Start with the unadjusted trial balance, enter adjustments, recalculate balances, then prepare statements.", distractors: ["Close all revenue accounts first, then list only remaining asset account balances", "Prepare financial statements first, then adjust ledger accounts to match those totals", "Record only cash transactions for the period, then total debits and credits once"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-76", q: "Which financial statement reports the result of revenue and expense accounts for the period?", a: "Statement of Profit or Loss (income statement).", distractors: ["Statement of Financial Position at a point in time", "Statement of Cash Flows classified by operating, investing, and financing", "Post-closing trial balance listing permanent accounts only"], tags: ["adjusting_entries", "income_statement"] },
  { id: "ch03-anki-77", q: "Which financial statement presents assets, liabilities, and equity at a specific date?", a: "Statement of Financial Position (balance sheet).", distractors: ["Statement of Profit or Loss for the reporting period", "Statement of Cash Flows reconciling cash movements", "Adjusted trial balance before closing entries"], tags: ["adjusting_entries", "balance_sheet"] },
  { id: "ch03-anki-78", q: "Profit for the year and dividends declared must flow into retained earnings. Which statement captures this movement?", a: "Statement of Changes in Equity.", distractors: ["Statement of Cash Flows operating section only", "Unadjusted trial balance before adjustments are posted", "Post-closing trial balance of temporary accounts"], tags: ["adjusting_entries", "equity"] },
  { id: "ch03-anki-79", q: "Revenue, expense, dividend, and income summary accounts are reset each period. What are these called?", a: "Temporary (nominal) accounts.", distractors: ["Permanent (real) accounts carried forward indefinitely", "Contra asset accounts deducted from non-current assets", "Memorandum accounts kept only on worksheets, not in the ledger"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-80", q: "Asset, liability, and equity accounts remain open after closing. What are these called?", a: "Permanent (real) accounts.", distractors: ["Temporary accounts closed to retained earnings each period", "Nominal accounts used only on the income statement", "Contra revenue accounts reducing sales for the period"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-81", q: "After the income statement is prepared, revenue and expense balances must be cleared. What is the purpose of closing entries?", a: "To transfer temporary account balances to retained earnings and reset them to zero.", distractors: ["To record adjusting entries for accruals and deferrals at period-end", "To prove that total debits equal total credits on a worksheet", "To record daily cash receipts and payments in the general journal"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-82", q: "When closing revenue accounts at year-end, which account receives the credit side of the closing entry first?", a: "Income Summary.", distractors: ["Retained Earnings, bypassing the income summary account", "Cash, because revenue ultimately increases liquidity", "Accounts Receivable, matching credit sales still uncollected"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-83", q: "Service Revenue has a credit balance of $48,000 at year-end before closing. Which entry closes it?", a: "Debit Service Revenue $48,000; Credit Income Summary $48,000.", distractors: ["Debit Income Summary $48,000; Credit Service Revenue $48,000", "Debit Service Revenue $48,000; Credit Retained Earnings $48,000", "Debit Cash $48,000; Credit Service Revenue $48,000"], tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-84", q: "When closing expense accounts, which account is debited in the first closing step for expenses?", a: "Income Summary.", distractors: ["Retained Earnings, because expenses reduce equity directly", "Cash, because most expenses reduce the bank balance", "Accounts Payable, because expenses create liabilities"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-85", q: "Total expenses of $31,500 must be closed at year-end. Which entry is correct?", a: "Debit Income Summary $31,500; Credit each expense account $31,500 in total.", distractors: ["Debit each expense account; Credit Income Summary for the total", "Debit Retained Earnings; Credit each expense account directly", "Debit Income Summary; Credit Cash for the total expenses paid"], tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-86", q: "After revenues and expenses are closed, Income Summary has a credit balance of $7,200. How is it closed?", a: "Debit Income Summary $7,200; Credit Retained Earnings $7,200.", distractors: ["Debit Retained Earnings $7,200; Credit Income Summary $7,200", "Debit Income Summary $7,200; Credit Cash $7,200", "Debit Dividends $7,200; Credit Income Summary $7,200"], tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-87", q: "Dividends of $2,000 were declared and paid during the year. Which closing entry applies to Dividends?", a: "Debit Retained Earnings; Credit Dividends.", distractors: ["Debit Dividends; Credit Retained Earnings", "Debit Income Summary; Credit Dividends", "Debit Dividends; Credit Cash only with no closing entry"], tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch03-anki-88", q: "Immediately after closing entries are posted, which accounts should have zero balances?", a: "Revenue, expense, dividend, and income summary accounts.", distractors: ["All asset, liability, and equity accounts including cash", "Only cash and accounts payable awaiting reconciliation", "Every account in the general ledger including retained earnings"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-89", q: "Which statement about closing asset, liability, and equity accounts is correct?", a: "They are permanent accounts and are not closed at period-end.", distractors: ["They are closed to income summary each period like revenues", "They are closed to cash before the post-closing trial balance", "They are closed to dividends before retained earnings is updated"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-90", q: "What is a post-closing trial balance?", a: "A trial balance prepared after closing entries are journalised and posted.", distractors: ["The unadjusted trial balance taken before adjusting entries", "A list of revenue and expense accounts after adjustments only", "An optional worksheet column with no ledger posting requirement"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-91", q: "Which accounts should appear on a post-closing trial balance?", a: "Permanent accounts only: assets, liabilities, and equity.", distractors: ["Revenue, expense, and dividend accounts awaiting closing", "All accounts including income summary with mixed balances", "Only cash and receivable accounts used in daily operations"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-92", q: "Which accounts should NOT appear with a balance on a post-closing trial balance?", a: "Revenue, expenses, dividends, and income summary.", distractors: ["Cash, accounts receivable, and accounts payable", "Retained earnings and share capital", "Accumulated depreciation and equipment"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-93", q: "Why is a post-closing trial balance prepared?", a: "To verify that permanent account balances balance before the next period begins.", distractors: ["To calculate depreciation expense for the first month of the new period", "To replace adjusting entries when material errors are discovered after closing", "To prepare the income statement without using any ledger account balances"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-94", q: "Which description best defines the accounting cycle?", a: "The recurring process of recording, adjusting, reporting, and closing each accounting period.", distractors: ["The external audit procedures performed on annual financial reports after issue", "The ATO process for lodging business activity statements and paying GST", "The board procedure for issuing new shares and updating the share register"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-95", q: "A bookkeeper has identified a business event and determined which accounts are affected. What is the next step in the accounting cycle?", a: "Journalise the transaction in the general journal.", distractors: ["Prepare the post-closing trial balance immediately", "Close revenue accounts to retained earnings", "Publish the statement of financial position to shareholders"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-96", q: "Transactions have been journalised for the day. What is the next step in the accounting cycle?", a: "Post the entries to the general ledger.", distractors: ["Prepare closing entries for temporary accounts", "Issue dividends from retained earnings", "Prepare the post-closing trial balance for the period"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-97", q: "Ledger accounts are up to date for the period. Which step typically follows before adjustments?", a: "Prepare an unadjusted trial balance.", distractors: ["Journalise and post closing entries", "Prepare the post-closing trial balance", "Close all expense accounts to income summary"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-98", q: "The unadjusted trial balance is prepared and accruals/deferrals are identified. What comes next?", a: "Prepare and journalise adjusting entries.", distractors: ["Prepare the post-closing trial balance immediately", "Close revenue accounts before adjustments are recorded", "Issue the statement of changes in equity without adjustments"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-99", q: "Adjusting entries have been journalised but not yet reflected in a trial listing. What is the next step?", a: "Post adjusting entries and prepare the adjusted trial balance.", distractors: ["Close all temporary accounts to retained earnings", "Prepare the post-closing trial balance before statements", "Journalise only cash transactions for the next period"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-100", q: "An adjusted trial balance is complete and balances. What is the next major step in the cycle?", a: "Prepare the financial statements.", distractors: ["Prepare the post-closing trial balance before statements", "Journalise closing entries before any statements are drafted", "Record the next period's transactions in the general journal"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-101", q: "Financial statements for the period have been prepared from adjusted balances. What typically follows?", a: "Journalise and post closing entries.", distractors: ["Return to the unadjusted trial balance and restart the cycle", "Prepare adjusting entries again before any closing occurs", "Skip closing because permanent accounts already balance"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-102", q: "Closing entries have been posted successfully. What is the final step in the accounting cycle?", a: "Prepare a post-closing trial balance.", distractors: ["Prepare an unadjusted trial balance for the same period", "Journalise adjusting entries for the next period immediately", "Prepare financial statements again before verifying permanent accounts"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-103", q: "Which step immediately precedes preparing the post-closing trial balance?", a: "Journalise and post closing entries.", distractors: ["Prepare and post adjusting entries for the period", "Prepare the unadjusted trial balance again", "Analyse transactions and journalise daily events only"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-104", q: "An accountant uses a ten-column spreadsheet to extend adjusted balances into statement columns. What is this tool?", a: "An accounting worksheet.", distractors: ["The general ledger required by AASB for all entities", "The published statement of profit or loss sent to shareholders", "The bank reconciliation replacing ledger account balances"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-105", q: "Is an accounting worksheet part of the formal accounting records under AASB?", a: "No, it is an optional internal working document.", distractors: ["Yes, it must be filed with the general ledger each period", "Yes, it replaces the adjusted trial balance for small entities", "Yes, auditors require it instead of source documents"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-106", q: "Why might an accountant prepare a worksheet even though it is not mandatory?", a: "It organises adjustments and helps trace balances into financial statements.", distractors: ["It permanently replaces ledger postings for revenue accounts", "It is required to lodge company tax returns with the ATO", "It eliminates the need for adjusting and closing entries"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-107", q: "Which set of columns is commonly found on a ten-column worksheet?", a: "Unadjusted trial balance, adjustments, adjusted trial balance, income statement, and statement of financial position.", distractors: ["Cash receipts, cash payments, bank balance, and petty cash columns only", "Share price, dividends, market capitalisation, and earnings per share only", "Revenue and expense account columns without any statement of financial position section"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-108", q: "A company earned consulting fees on credit and used prepaid insurance during the year but recorded only cash transactions initially. Why do adjusting entries improve the statements?", a: "They include earned revenues and incurred expenses in the correct period.", distractors: ["They convert all accounting to cash basis at year-end only", "They remove every liability from the statement of financial position", "They close permanent accounts before the adjusted trial balance"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-109", q: "Why is the Cash account normally excluded from adjusting entries?", a: "Cash was already updated when the original cash transaction was recorded.", distractors: ["Cash is never used under accrual accounting in any transaction", "Adjusting entries affect equity accounts only at period-end", "Cash accounts must be closed before accruals can be recorded"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-110", q: "Office rent for the next quarter was paid in cash on the first day of the current month. Which adjustment category will be needed later?", a: "Prepaid expense (deferral).", distractors: ["Accrued revenue because rent benefits future periods", "Accrued expense because cash has already been paid", "Unearned revenue because the landlord received cash early"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-111", q: "A customer paid a deposit in cash for goods to be delivered next month. Which adjustment category applies before delivery?", a: "Revenue received in advance (unearned revenue).", distractors: ["Accrued revenue because the seller will earn revenue later", "Prepaid expense because the seller received cash", "Accrued expense because delivery has not occurred"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-112", q: "Services were performed on account in April, but billing and collection will occur in May. Which adjustment category applies at 30 April?", a: "Accrued revenue.", distractors: ["Revenue received in advance", "Prepaid expense for future services", "Accrued expense for wages paid in May"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-113", q: "Electricity used in March will be billed and paid in April. Which adjustment category applies at 31 March?", a: "Accrued expense.", distractors: ["Prepaid expense because payment occurs later", "Unearned revenue because cash has not changed hands", "Accrued revenue because the utility provided service"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-114", q: "Which statement best contrasts unearned revenue with accrued revenue?", a: "Unearned revenue arises when cash is received before earning; accrued revenue when earning occurs before cash is received.", distractors: ["Both arise only after cash has been collected in full from the customer", "Both are recorded initially as assets on the statement of financial position", "There is no practical difference between the two categories in accrual accounting"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-115", q: "Which statement best contrasts prepaid expenses with accrued expenses?", a: "Prepaid expenses begin with cash paid before recognition; accrued expenses begin with recognition before cash payment.", distractors: ["Both involve cash being paid after the expense has already been recognised", "Both are reported as liabilities on the statement of financial position until paid", "Prepaid expenses always exceed accrued expenses in amount at every balance date"], tags: ["adjusting_entries"] },
  { id: "ch03-anki-116", q: "Year-end wages of $900 are earned but not recorded. If no adjustment is made, what is the most likely effect?", a: "Expenses and liabilities are understated, so profit may be overstated.", distractors: ["Expenses and liabilities are overstated, so profit is understated", "Assets and revenue are understated with no effect on profit", "Only the cash account is understated at balance date"], tags: ["adjusting_entries", "error_correction"] },
  { id: "ch03-anki-117", q: "Accrued consulting revenue of $1,100 is omitted at year-end. What is the most likely effect?", a: "Revenue and assets are understated, so profit may be understated.", distractors: ["Revenue and assets are overstated, so profit is overstated", "Liabilities are overstated while revenue remains unchanged", "Expenses are overstated with no effect on assets"], tags: ["adjusting_entries", "error_correction"] },
  { id: "ch03-anki-118", q: "Expired prepaid insurance of $300 is not adjusted at year-end. What is the most likely effect?", a: "Expenses are understated, assets overstated, and profit overstated.", distractors: ["Expenses are overstated, assets understated, and profit understated", "Revenue is understated and liabilities overstated with no asset effect", "Only cash is overstated while profit remains unchanged"], tags: ["adjusting_entries", "error_correction"] },
  { id: "ch03-anki-119", q: "Services worth $500 were earned from an unearned revenue balance but not adjusted. What is the most likely effect?", a: "Revenue is understated, the liability is overstated, and profit is understated.", distractors: ["Revenue is overstated for the period and the liability is understated", "Assets and revenue are both overstated with no effect on the liability balance", "Only the cash account balance is affected at period-end with no profit impact"], tags: ["adjusting_entries", "error_correction"] },
  { id: "ch03-anki-120", q: "Which sequence correctly summarises the end-of-period process taught in Chapter 3?", a: "Record transactions, adjust accounts, prepare adjusted trial balance, prepare statements, close temporary accounts, prepare post-closing trial balance.", distractors: ["Close temporary accounts, record transactions, prepare statements, then post adjusting entries", "Prepare statements first, record transactions later, and adjust accounts only if errors appear", "Record cash transactions only, lodge tax returns, then close permanent asset accounts"], tags: ["adjusting_entries"] },
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

function buildBalancedAnswerPositions(count) {
  const positions = [];
  const base = Math.floor(count / 4);
  const remainder = count % 4;
  for (let slot = 0; slot < 4; slot += 1) {
    for (let i = 0; i < base + (slot < remainder ? 1 : 0); i += 1) {
      positions.push(slot);
    }
  }

  let seed = 903_571;
  for (let i = positions.length - 1; i > 0; i -= 1) {
    seed = (seed * 1_103_515_245 + 12_345) >>> 0;
    const j = seed % (i + 1);
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  return positions;
}

function buildOptions(answer, distractors, answerPosition) {
  const options = new Array(4);
  options[answerPosition] = answer;
  let distractorIndex = 0;
  for (let i = 0; i < 4; i += 1) {
    if (i === answerPosition) continue;
    options[i] = distractors[distractorIndex];
    distractorIndex += 1;
  }
  return options;
}

function toMcq(card, answerPosition) {
  const distractors = pickDistractors(card);
  const options = buildOptions(card.a, distractors, answerPosition);
  return {
    id: card.id,
    q: card.q,
    options,
    answer: answerPosition,
    explanation: buildTeachingExplanation({ q: card.q, a: card.a, tags: card.tags }),
    tags: card.tags ?? ["adjusting_entries"],
  };
}

const answerPositions = buildBalancedAnswerPositions(FLASHCARDS.length);
const mcqs = FLASHCARDS.map((card, index) => toMcq(card, answerPositions[index]));

const output = `// Auto-generated from Notion Anki Flashcards — Chapter 3
// Regenerate: bun scripts/generate-ch03-anki-mcqs.js

export const ankiMcqs = ${JSON.stringify(mcqs, null, 2)};
`;

await Bun.write(new URL("../src/data/chapters/ch03-anki-mcqs.js", import.meta.url), output);

const distribution = [0, 0, 0, 0];
for (const mcq of mcqs) distribution[mcq.answer] += 1;
console.log(`Generated ${mcqs.length} MCQs → src/data/chapters/ch03-anki-mcqs.js`);
console.log("Answer distribution (A/B/C/D):", distribution.join(" / "));
