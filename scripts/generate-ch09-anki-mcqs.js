/**
 * Generates MCQs from Chapter 9 Anki flashcards (Notion).
 * Run: bun scripts/generate-ch09-anki-mcqs.js
 */

import { buildTeachingExplanation } from "../src/utils/teachingExplanation.js";

const DISTRACTOR_POOLS = {
  liability_types: [
    "Current liability",
    "Non-current liability",
    "Contingent liability",
    "Provision",
  ],
  journal_patterns: [
    "Dr Cash / Cr Notes Payable",
    "Dr Interest Expense / Cr Interest Payable",
    "Dr Cash / Cr Revenue Received in Advance",
    "Dr Revenue Received in Advance / Cr Revenue",
    "Dr Salaries & Wages Expense / Cr Salaries & Wages Payable / Cr PAYG Withholding Payable",
    "Dr Salaries & Wages Payable / Cr Cash",
    "Dr PAYG Withholding Tax Payable / Cr Cash",
    "Dr Interest Expense; Dr Loan Payable; Cr Cash",
    "Dr Lease Expense / Cr Cash",
    "Dr Right-of-use Asset / Cr Lease Liability",
    "Dr Warranty Expense / Cr Warranty Provision",
    "Dr Warranty Provision / Cr Cash or Inventory",
    "Dr Notes Payable / Cr Cash",
  ],
  lease_types: [
    "Operating lease — rental expense",
    "Finance lease — right-of-use asset and lease liability",
    "Sale and leaseback only",
    "No recognition required for lessee",
  ],
  formulas: [
    "Principal × Interest Rate × Time",
    "Current Assets − Current Liabilities",
    "Current Assets ÷ Current Liabilities",
    "(Cash + Marketable Securities + Net Receivables) ÷ Current Liabilities",
    "Total Liabilities ÷ Total Assets",
    "(Profit Before Income Tax + Interest Expense) ÷ Interest Expense",
    "Payment − Interest",
    "Beginning loan balance × periodic interest rate",
  ],
  debt_terms: [
    "Face value",
    "Issue price",
    "Premium",
    "Discount",
    "Coupon rate",
  ],
  yes_no: ["Yes", "No", "Only if probable and estimable", "Only for current liabilities"],
};

/** @type {Array<{ id: string, q: string, a: string, pool?: keyof typeof DISTRACTOR_POOLS, distractors?: string[], tags?: string[] }>} */
const FLASHCARDS = [
  { id: "ch09-anki-01", q: "What is a liability?", a: "A present obligation arising from past events that is expected to result in an outflow of economic benefits.", distractors: ["A possible future obligation dependent on uncertain events", "An asset expected to provide future economic benefits", "Revenue earned but not yet received"], tags: ["balance_sheet", "financial_statements"] },
  { id: "ch09-anki-02", q: "How are liabilities presented in the statement of financial position?", a: "In order of liquidity, based on how soon they are expected to be settled.", distractors: ["Alphabetically by account name", "By original issue date only", "Mixed with equity accounts"], tags: ["balance_sheet", "financial_statements"] },
  { id: "ch09-anki-03", q: "What is a current liability?", a: "A liability expected to be settled within 12 months or the operating cycle.", pool: "liability_types", tags: ["balance_sheet", "financial_statements"] },
  { id: "ch09-anki-04", q: "What is a non-current liability?", a: "A liability expected to be settled after 12 months or outside the operating cycle.", pool: "liability_types", tags: ["balance_sheet", "financial_statements"] },
  { id: "ch09-anki-05", q: "Why is classification between current and non-current liabilities important?", a: "It helps users assess liquidity and ability to meet obligations.", distractors: ["It determines depreciation method", "It eliminates the need for provisions", "It replaces the cash flow statement"], tags: ["balance_sheet", "financial_statements"] },
  { id: "ch09-anki-06", q: "What is notes payable?", a: "A written promise to pay a specified amount in the future.", distractors: ["Cash received before revenue is earned", "Amounts withheld from employee wages", "A possible obligation not yet probable"], tags: ["balance_sheet"] },
  { id: "ch09-anki-07", q: "Are notes payable commonly interest-bearing?", a: "Yes.", pool: "yes_no", tags: ["balance_sheet"] },
  { id: "ch09-anki-08", q: "What is the journal entry when a note payable is issued?", a: "Dr Cash / Cr Notes Payable.", pool: "journal_patterns", tags: ["debit_credit"] },
  { id: "ch09-anki-09", q: "What is the formula for interest expense?", a: "Principal × Interest Rate × Time.", pool: "formulas", tags: ["balance_sheet", "income_statement"] },
  { id: "ch09-anki-10", q: "What is the adjusting entry to accrue unpaid interest?", a: "Dr Interest Expense / Cr Interest Payable.", pool: "journal_patterns", tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch09-anki-11", q: "What is the journal entry when a note payable matures?", a: "Dr Notes Payable; Dr Interest Payable; Dr Interest Expense; Cr Cash.", distractors: ["Dr Cash / Cr Notes Payable only", "Dr Interest Expense / Cr Cash only", "Dr Notes Payable / Cr Interest Payable"], tags: ["debit_credit"] },
  { id: "ch09-anki-12", q: "What are payroll deductions payable?", a: "Amounts withheld from employee wages and owed to governments or third parties.", distractors: ["Gross wages before any deductions", "Employer contributions to share capital", "Accrued interest on notes payable"], tags: ["balance_sheet"] },
  { id: "ch09-anki-13", q: "What are examples of payroll deductions?", a: "PAYG withholding tax, superannuation, union fees, and health insurance.", distractors: ["Depreciation, amortisation, and impairment", "Freight-in and purchase discounts", "GST collected and GST paid"], tags: ["balance_sheet"] },
  { id: "ch09-anki-14", q: "What is gross pay?", a: "Total wages earned before deductions.", distractors: ["Amount employees receive after deductions", "Employer superannuation contribution only", "Net cash paid to suppliers"], tags: ["balance_sheet", "income_statement"] },
  { id: "ch09-anki-15", q: "What is net pay?", a: "Amount employees receive after deductions.", distractors: ["Total wages earned before deductions", "Total payroll expense including employer costs only", "Cash received from customers"], tags: ["balance_sheet", "income_statement"] },
  { id: "ch09-anki-16", q: "What is the journal entry on payroll date?", a: "Dr Salaries & Wages Expense / Cr Salaries & Wages Payable / Cr PAYG Withholding Payable.", pool: "journal_patterns", tags: ["debit_credit"] },
  { id: "ch09-anki-17", q: "What is the journal entry when paying employees?", a: "Dr Salaries & Wages Payable / Cr Cash.", pool: "journal_patterns", tags: ["debit_credit"] },
  { id: "ch09-anki-18", q: "What is the journal entry when remitting payroll deductions?", a: "Dr PAYG Withholding Tax Payable / Cr Cash.", pool: "journal_patterns", tags: ["debit_credit"] },
  { id: "ch09-anki-19", q: "What is revenue received in advance?", a: "Cash received before goods or services are delivered.", distractors: ["Revenue earned but not yet received in cash", "A provision for warranty claims", "Interest payable on a note"], tags: ["adjusting_entries", "balance_sheet"] },
  { id: "ch09-anki-20", q: "What is another name for revenue received in advance?", a: "Unearned revenue.", distractors: ["Accrued revenue", "Sales returns and allowances", "Commission revenue"], tags: ["adjusting_entries", "balance_sheet"] },
  { id: "ch09-anki-21", q: "Why is unearned revenue initially recorded as a liability?", a: "Because the business still owes goods or services.", distractors: ["Because cash has not been received", "Because it is always a non-current liability", "Because GST must be paid first"], tags: ["adjusting_entries", "balance_sheet"] },
  { id: "ch09-anki-22", q: "What is the journal entry when cash is received in advance?", a: "Dr Cash / Cr Revenue Received in Advance.", pool: "journal_patterns", tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch09-anki-23", q: "What is the journal entry when revenue is earned?", a: "Dr Revenue Received in Advance / Cr Revenue.", pool: "journal_patterns", tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch09-anki-24", q: "What are non-current liabilities?", a: "Obligations expected to be settled after more than one year.", pool: "liability_types", tags: ["balance_sheet"] },
  { id: "ch09-anki-25", q: "What are common examples of long-term liabilities?", a: "Bank loans, mortgages, debentures, and long-term notes.", distractors: ["Accounts payable and unearned revenue only", "Share capital and retained earnings", "Accounts receivable and inventory"], tags: ["balance_sheet"] },
  { id: "ch09-anki-26", q: "What is a debenture?", a: "A note secured by a charge over the issuer's assets.", distractors: ["An unsecured note not backed by specific assets", "A dividend payable to shareholders", "A warranty provision"], tags: ["balance_sheet"] },
  { id: "ch09-anki-27", q: "What is an unsecured note?", a: "A note not backed by specific assets.", distractors: ["A note secured by a charge over assets", "A lease liability under a finance lease", "PAYG withholding payable"], tags: ["balance_sheet"] },
  { id: "ch09-anki-28", q: "What is an advantage of debt financing?", a: "Shareholder control is unaffected.", distractors: ["No interest payments are required", "Debt never creates financial risk", "Interest is never tax deductible"], tags: ["balance_sheet", "equity"] },
  { id: "ch09-anki-29", q: "Why is interest expense attractive for businesses?", a: "It is generally tax deductible.", distractors: ["It increases share capital automatically", "It eliminates the need for provisions", "It is recorded as equity"], tags: ["balance_sheet", "income_statement"] },
  { id: "ch09-anki-30", q: "What is a disadvantage of debt financing?", a: "Interest and principal repayments are mandatory.", distractors: ["Shareholder control is always diluted", "Debt cannot be issued at a discount", "Interest is never recorded as expense"], tags: ["balance_sheet"] },
  { id: "ch09-anki-31", q: "Why can high debt create financial risk?", a: "Businesses may struggle to meet fixed payments during poor cash flow periods.", distractors: ["Debt always reduces total assets", "High debt eliminates current liabilities", "Debt financing removes interest expense"], tags: ["balance_sheet", "financial_statements"] },
  { id: "ch09-anki-32", q: "What is face value?", a: "The amount due at maturity.", pool: "debt_terms", tags: ["balance_sheet"] },
  { id: "ch09-anki-33", q: "What is issue price?", a: "The amount of cash received when debt is issued.", pool: "debt_terms", tags: ["balance_sheet"] },
  { id: "ch09-anki-34", q: "What determines periodic interest payments?", a: "Contract (coupon) interest rate.", pool: "debt_terms", tags: ["balance_sheet"] },
  { id: "ch09-anki-35", q: "Why does present value matter for debt pricing?", a: "Debt is priced based on the present value of future cash flows.", distractors: ["Debt is always issued at face value regardless of market rates", "Present value applies only to equity", "Coupon rate is irrelevant to pricing"], tags: ["balance_sheet"] },
  { id: "ch09-anki-36", q: "When are notes issued at a premium?", a: "When market interest rates are lower than contract rates.", distractors: ["When market rates are higher than contract rates", "When face value equals issue price always", "When no interest is payable"], tags: ["balance_sheet"] },
  { id: "ch09-anki-37", q: "When are notes issued at a discount?", a: "When market interest rates are higher than contract rates.", distractors: ["When market rates are lower than contract rates", "When coupon rate equals market rate", "When debt is always redeemed early"], tags: ["balance_sheet"] },
  { id: "ch09-anki-38", q: "What is the journal entry when notes are issued at face value?", a: "Dr Cash / Cr Notes Payable.", pool: "journal_patterns", tags: ["debit_credit"] },
  { id: "ch09-anki-39", q: "What is the journal entry for interest payment?", a: "Dr Interest Expense / Cr Cash.", distractors: ["Dr Cash / Cr Interest Expense", "Dr Interest Payable / Cr Notes Payable", "Dr Notes Payable / Cr Cash only"], tags: ["debit_credit"] },
  { id: "ch09-anki-40", q: "What is the journal entry when debt is redeemed at maturity?", a: "Dr Notes Payable / Cr Cash.", pool: "journal_patterns", tags: ["debit_credit"] },
  { id: "ch09-anki-41", q: "What happens if cash paid on early redemption exceeds carrying amount?", a: "A loss on redemption is recognised.", distractors: ["A gain on redemption is recognised", "No gain or loss is ever recorded", "Interest expense is reversed completely"], tags: ["balance_sheet", "income_statement"] },
  { id: "ch09-anki-42", q: "What happens if cash paid on early redemption is less than carrying amount?", a: "A gain on redemption is recognised.", distractors: ["A loss on redemption is recognised", "The note remains on the balance sheet", "Revenue is credited instead"], tags: ["balance_sheet", "income_statement"] },
  { id: "ch09-anki-43", q: "What two components make up instalment payments?", a: "Interest expense and principal reduction.", distractors: ["Principal and warranty provision", "Depreciation and amortisation", "GST collected and GST paid"], tags: ["balance_sheet"] },
  { id: "ch09-anki-44", q: "How is interest on a loan instalment calculated?", a: "Beginning loan balance × periodic interest rate.", pool: "formulas", tags: ["balance_sheet"] },
  { id: "ch09-anki-45", q: "How is principal reduction calculated?", a: "Payment − Interest.", pool: "formulas", tags: ["balance_sheet"] },
  { id: "ch09-anki-46", q: "What is the journal entry for an instalment payment?", a: "Dr Interest Expense; Dr Loan Payable; Cr Cash.", pool: "journal_patterns", tags: ["debit_credit"] },
  { id: "ch09-anki-47", q: "How is the current portion of long-term debt classified?", a: "As a current liability.", pool: "liability_types", tags: ["balance_sheet", "financial_statements"] },
  { id: "ch09-anki-48", q: "How is the remaining portion classified?", a: "As a non-current liability.", pool: "liability_types", tags: ["balance_sheet", "financial_statements"] },
  { id: "ch09-anki-49", q: "What is a lease?", a: "An agreement where a lessor grants a lessee the right to use an asset.", distractors: ["A written promise to pay a specified amount", "A provision for uncertain obligations", "Cash received before services are delivered"], tags: ["balance_sheet"] },
  { id: "ch09-anki-50", q: "Who is the lessor?", a: "The owner of the asset.", distractors: ["The party using the asset", "The bank lending cash", "The employee receiving net pay"], tags: ["balance_sheet"] },
  { id: "ch09-anki-51", q: "Who is the lessee?", a: "The party using the asset.", distractors: ["The owner of the asset", "The factor buying receivables", "The ATO receiving GST"], tags: ["balance_sheet"] },
  { id: "ch09-anki-52", q: "How are operating leases treated by the lessee?", a: "As rental expense.", pool: "lease_types", tags: ["balance_sheet", "income_statement"] },
  { id: "ch09-anki-53", q: "What is the journal entry for operating lease payments?", a: "Dr Lease/Rent Expense / Cr Cash.", pool: "journal_patterns", tags: ["debit_credit"] },
  { id: "ch09-anki-54", q: "Under an operating lease, whose balance sheet shows the asset?", a: "The lessor's.", distractors: ["The lessee's", "Both parties equally", "Neither party"], tags: ["balance_sheet"] },
  { id: "ch09-anki-55", q: "What is the lessor's entry for lease receipts?", a: "Dr Cash / Cr Lease Revenue.", distractors: ["Dr Lease Expense / Cr Cash", "Dr Right-of-use Asset / Cr Lease Liability", "Dr Cash / Cr Notes Payable"], tags: ["debit_credit"] },
  { id: "ch09-anki-56", q: "What does a lessee recognise at commencement of a finance lease?", a: "A right-of-use asset and a lease liability.", pool: "lease_types", tags: ["balance_sheet"] },
  { id: "ch09-anki-57", q: "What is the conceptual commencement entry for a finance lease?", a: "Dr Right-of-use Asset / Cr Lease Liability.", pool: "journal_patterns", tags: ["debit_credit"] },
  { id: "ch09-anki-58", q: "What happens to the lease liability over time?", a: "It decreases as principal is repaid.", distractors: ["It increases with each lease payment", "It is never recognised under finance leases", "It is transferred to equity"], tags: ["balance_sheet"] },
  { id: "ch09-anki-59", q: "What expense is recognised each period under a finance lease?", a: "Interest expense and depreciation/amortisation.", distractors: ["Only rental expense", "Only warranty expense", "No expense until lease ends"], tags: ["balance_sheet", "income_statement"] },
  { id: "ch09-anki-60", q: "What are accruals?", a: "Liabilities for goods/services received but not yet invoiced.", pool: "liability_types", tags: ["adjusting_entries", "balance_sheet"] },
  { id: "ch09-anki-61", q: "Give an example of an accrual.", a: "Utilities expense owing at period end.", distractors: ["Cash received before services are performed", "A possible lawsuit outcome", "Warranty claims already paid in cash"], tags: ["adjusting_entries", "balance_sheet"] },
  { id: "ch09-anki-62", q: "What are provisions?", a: "Liabilities with uncertain timing or amount but probable outflows.", pool: "liability_types", tags: ["balance_sheet"] },
  { id: "ch09-anki-63", q: "Give examples of provisions.", a: "Warranties and long service leave.", distractors: ["Accounts payable and notes payable only", "Share capital and dividends", "Accounts receivable and inventory"], tags: ["balance_sheet"] },
  { id: "ch09-anki-64", q: "What are contingent liabilities?", a: "Possible obligations dependent on uncertain future events.", pool: "liability_types", tags: ["balance_sheet", "financial_statements"] },
  { id: "ch09-anki-65", q: "When are contingent liabilities recognised?", a: "They are not recognised if outflow is not probable or cannot be measured reliably.", pool: "yes_no", tags: ["balance_sheet", "financial_statements"] },
  { id: "ch09-anki-66", q: "How are contingent liabilities reported?", a: "Disclosed in notes to the financial statements.", distractors: ["Recognised on the statement of financial position always", "Recorded as revenue", "Included in share capital"], tags: ["balance_sheet", "financial_statements"] },
  { id: "ch09-anki-67", q: "Why do businesses recognise warranty provisions?", a: "Because future warranty claims are probable and estimable.", distractors: ["Because all warranties are contingent liabilities only", "Because claims are always paid in cash immediately", "Because warranty expense is never recorded until payment"], tags: ["balance_sheet"] },
  { id: "ch09-anki-68", q: "What is the journal entry to recognise warranty expense?", a: "Dr Warranty Expense / Cr Warranty Provision.", pool: "journal_patterns", tags: ["debit_credit"] },
  { id: "ch09-anki-69", q: "What is the journal entry when warranty claims are fulfilled?", a: "Dr Warranty Provision / Cr Cash or Inventory.", pool: "journal_patterns", tags: ["debit_credit"] },
  { id: "ch09-anki-70", q: "What happens if warranty estimates increase?", a: "Additional warranty expense and provision are recognised.", distractors: ["No further entries are required", "Revenue is reduced instead", "The provision is reversed to equity"], tags: ["balance_sheet", "income_statement"] },
  { id: "ch09-anki-71", q: "What does liquidity measure?", a: "Ability to meet short-term obligations.", distractors: ["Long-term financial stability only", "Profitability of sales", "Efficiency of asset use"], tags: ["financial_statements"] },
  { id: "ch09-anki-72", q: "What is working capital?", a: "Current Assets − Current Liabilities.", pool: "formulas", tags: ["financial_statements"] },
  { id: "ch09-anki-73", q: "What does positive working capital indicate?", a: "Current assets exceed current liabilities.", distractors: ["Current liabilities exceed current assets", "The business has no debt", "Inventory turnover is high"], tags: ["financial_statements"] },
  { id: "ch09-anki-74", q: "What is the current ratio formula?", a: "Current Assets ÷ Current Liabilities.", pool: "formulas", tags: ["financial_statements"] },
  { id: "ch09-anki-75", q: "What does the current ratio measure?", a: "Ability to pay short-term debts.", distractors: ["Long-term solvency only", "Interest coverage ability", "Inventory efficiency only"], tags: ["financial_statements"] },
  { id: "ch09-anki-76", q: "What is the quick ratio formula?", a: "(Cash + Marketable Securities + Net Receivables) ÷ Current Liabilities.", pool: "formulas", tags: ["financial_statements"] },
  { id: "ch09-anki-77", q: "Why is the quick ratio more conservative than the current ratio?", a: "It excludes inventory and prepayments.", distractors: ["It includes inventory and prepayments", "It uses total assets instead of current assets", "It excludes cash and receivables"], tags: ["financial_statements"] },
  { id: "ch09-anki-78", q: "What does solvency measure?", a: "Long-term financial stability.", distractors: ["Ability to meet short-term obligations only", "Speed of receivables collection", "Gross profit margin"], tags: ["financial_statements"] },
  { id: "ch09-anki-79", q: "What is the debt to total assets ratio formula?", a: "Total Liabilities ÷ Total Assets.", pool: "formulas", tags: ["financial_statements"] },
  { id: "ch09-anki-80", q: "What does a higher debt to total assets ratio indicate?", a: "Greater financial risk and leverage.", distractors: ["Lower financial risk", "Higher liquidity", "Stronger interest coverage always"], tags: ["financial_statements"] },
  { id: "ch09-anki-81", q: "What is the times interest earned formula?", a: "(Profit Before Income Tax + Interest Expense) ÷ Interest Expense.", pool: "formulas", tags: ["financial_statements"] },
  { id: "ch09-anki-82", q: "What does times interest earned measure?", a: "Ability to meet interest obligations.", distractors: ["Ability to pay short-term debts only", "Speed of inventory turnover", "Proportion of receivables uncollectable"], tags: ["financial_statements"] },
  { id: "ch09-anki-83", q: "What does a low times interest earned ratio suggest?", a: "Difficulty paying interest.", distractors: ["Strong ability to meet interest payments", "Excess working capital", "Low debt levels"], tags: ["financial_statements"] },
  { id: "ch09-anki-84", q: "What is the biggest current vs non-current liability trap?", a: "Forgetting the current portion of long-term debt.", distractors: ["Recognising contingent liabilities on the balance sheet", "Treating entire loan payment as interest", "Including inventory in quick ratio"], tags: ["error_correction"] },
  { id: "ch09-anki-85", q: "What is the biggest notes payable trap?", a: "Forgetting to accrue interest at period end.", distractors: ["Recording note issue as Dr Notes Payable / Cr Cash", "Confusing gross pay with net pay", "Recognising revenue before earned"], tags: ["error_correction"] },
  { id: "ch09-anki-86", q: "What is the biggest payroll trap?", a: "Confusing gross pay with net pay.", distractors: ["Forgetting PAYG remittance entirely", "Recording payroll as Dr Cash / Cr Expense", "Treating superannuation as revenue"], tags: ["error_correction"] },
  { id: "ch09-anki-87", q: "What is the biggest unearned revenue trap?", a: "Recognising revenue before it is earned.", distractors: ["Recording cash receipt as Dr Revenue / Cr Cash", "Classifying unearned revenue as equity", "Failing to record GST on advance receipts only"], tags: ["error_correction", "adjusting_entries"] },
  { id: "ch09-anki-88", q: "What is the biggest instalment loan trap?", a: "Treating the entire payment as interest expense.", distractors: ["Splitting payment into interest and principal correctly", "Classifying all debt as non-current", "Recording Dr Cash / Cr Loan Payable for each payment"], tags: ["error_correction"] },
  { id: "ch09-anki-89", q: "What is the biggest finance lease trap?", a: "Forgetting both an asset and liability are recognised.", distractors: ["Recording only rental expense like an operating lease", "Recognising lease liability without interest expense", "Showing the asset on the lessor's books as lessee"], tags: ["error_correction"] },
  { id: "ch09-anki-90", q: "What is the biggest contingency trap?", a: "Recognising contingent liabilities instead of only disclosing them.", distractors: ["Disclosing provisions in notes only", "Estimating warranty provisions upfront", "Accruing utilities expense at period end"], tags: ["error_correction"] },
  { id: "ch09-anki-91", q: "What is the biggest warranty trap?", a: "Recording warranty expense only when claims occur instead of estimating upfront.", distractors: ["Recognising Dr Warranty Expense / Cr Warranty Provision", "Debiting Warranty Provision when claims are paid", "Increasing provision when estimates rise"], tags: ["error_correction"] },
  { id: "ch09-anki-92", q: "What is the biggest liquidity ratio trap?", a: "Including inventory in the quick ratio.", distractors: ["Excluding receivables from quick ratio", "Using total liabilities in current ratio", "Using net sales in working capital"], tags: ["error_correction", "financial_statements"] },
  { id: "ch09-anki-93", q: "Formula: Interest expense.", a: "Principal × Interest Rate × Time.", pool: "formulas", tags: ["financial_statements"] },
  { id: "ch09-anki-94", q: "Formula: Working capital.", a: "Current Assets − Current Liabilities.", pool: "formulas", tags: ["financial_statements"] },
  { id: "ch09-anki-95", q: "Formula: Current ratio.", a: "Current Assets ÷ Current Liabilities.", pool: "formulas", tags: ["financial_statements"] },
  { id: "ch09-anki-96", q: "Formula: Quick ratio.", a: "(Cash + Marketable Securities + Net Receivables) ÷ Current Liabilities.", pool: "formulas", tags: ["financial_statements"] },
  { id: "ch09-anki-97", q: "Formula: Debt to total assets ratio.", a: "Total Liabilities ÷ Total Assets.", pool: "formulas", tags: ["financial_statements"] },
  { id: "ch09-anki-98", q: "Formula: Times interest earned.", a: "(Profit Before Income Tax + Interest Expense) ÷ Interest Expense.", pool: "formulas", tags: ["financial_statements"] },
  { id: "ch09-anki-99", q: "Journalise issuing a short-term note payable.", a: "Dr Cash / Cr Notes Payable.", pool: "journal_patterns", tags: ["debit_credit"] },
  { id: "ch09-anki-100", q: "Journalise accrued interest.", a: "Dr Interest Expense / Cr Interest Payable.", pool: "journal_patterns", tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch09-anki-101", q: "Journalise receiving cash in advance.", a: "Dr Cash / Cr Revenue Received in Advance.", pool: "journal_patterns", tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch09-anki-102", q: "Journalise earning previously unearned revenue.", a: "Dr Revenue Received in Advance / Cr Revenue.", pool: "journal_patterns", tags: ["adjusting_entries", "debit_credit"] },
  { id: "ch09-anki-103", q: "Journalise payroll expense.", a: "Dr Salaries & Wages Expense / Cr Salaries & Wages Payable / Cr PAYG Withholding Payable.", pool: "journal_patterns", tags: ["debit_credit"] },
  { id: "ch09-anki-104", q: "Journalise remittance of payroll deductions.", a: "Dr PAYG Withholding Tax Payable / Cr Cash.", pool: "journal_patterns", tags: ["debit_credit"] },
  { id: "ch09-anki-105", q: "Journalise an operating lease payment.", a: "Dr Lease Expense / Cr Cash.", pool: "journal_patterns", tags: ["debit_credit"] },
  { id: "ch09-anki-106", q: "Journalise recognition of warranty expense.", a: "Dr Warranty Expense / Cr Warranty Provision.", pool: "journal_patterns", tags: ["debit_credit"] },
  { id: "ch09-anki-107", q: "Journalise payment of warranty claims.", a: "Dr Warranty Provision / Cr Cash or Inventory.", pool: "journal_patterns", tags: ["debit_credit"] },
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
    explanation: buildTeachingExplanation({ q: card.q, a: card.a, tags: card.tags }),
    tags: card.tags ?? ["balance_sheet"],
  };
}

const mcqs = FLASHCARDS.map(toMcq);

const output = `// Auto-generated from Notion Anki Flashcards — Chapter 9
// Regenerate: bun scripts/generate-ch09-anki-mcqs.js

export const ankiMcqs = ${JSON.stringify(mcqs, null, 2)};
`;

await Bun.write(new URL("../src/data/chapters/ch09-anki-mcqs.js", import.meta.url), output);

console.log(`Generated ${mcqs.length} MCQs → src/data/chapters/ch09-anki-mcqs.js`);
