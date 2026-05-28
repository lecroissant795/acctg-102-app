export const title = "Practice: Journal Entry Drills";

export const questions = [
  {
    id: "ch02-journal-entry-credit-sale",
    type: "journal_entry",
    q: "Record a credit sale of $4,400 including GST.",
    answer: {
      lines: [
        { account: "Accounts Receivable", side: "debit", amount: 4400 },
        { account: "Sales Revenue", side: "credit", amount: 4000 },
        { account: "GST Payable", side: "credit", amount: 400 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: {
          "Accounts Receivable": ["Debtors"],
        },
      },
    },
    explanation: "The customer owes the full GST-inclusive amount, while sales revenue is recorded net of GST and the GST liability is credited separately.",
    points: 3,
    tags: ["gst", "debit_credit"],
  },
  {
    id: "ch02-journal-entry-share-issue",
    type: "journal_entry",
    q: "Record the issue of ordinary shares for cash of $12,000.",
    answer: {
      lines: [
        { account: "Cash", side: "debit", amount: 12000 },
        { account: "Share Capital", side: "credit", amount: 12000 },
      ],
      rules: {
        requireBalancedEntry: true,
      },
    },
    explanation: "Issuing shares increases cash and increases contributed equity.",
    points: 2,
    tags: ["equity", "debit_credit"],
  },
  {
    id: "ch02-journal-entry-supplies-on-account",
    type: "journal_entry",
    q: "Record the purchase of office supplies on account for $1,450.",
    answer: {
      lines: [
        { account: "Supplies", side: "debit", amount: 1450 },
        { account: "Accounts Payable", side: "credit", amount: 1450 },
      ],
      rules: {
        requireBalancedEntry: true,
      },
    },
    explanation: "The supplies asset increases and the payable to the supplier increases.",
    points: 2,
    tags: ["debit_credit"],
  },
  {
    id: "ch02-journal-entry-cash-rent-expense",
    type: "journal_entry",
    q: "Record payment of rent expense in cash of $980.",
    answer: {
      lines: [
        { account: "Rent Expense", side: "debit", amount: 980 },
        { account: "Cash", side: "credit", amount: 980 },
      ],
      rules: {
        requireBalancedEntry: true,
      },
    },
    explanation: "Paying an expense decreases cash and decreases equity through the expense account.",
    points: 2,
    tags: ["expense_recognition", "debit_credit"],
  },
  {
    id: "ch02-journal-entry-loan-repayment",
    type: "journal_entry",
    q: "Record repayment of a bank loan principal of $2,500 in cash.",
    answer: {
      lines: [
        { account: "Bank Loan Payable", side: "debit", amount: 2500 },
        { account: "Cash", side: "credit", amount: 2500 },
      ],
      rules: {
        requireBalancedEntry: true,
      },
    },
    explanation: "Repaying principal reduces the liability and reduces cash. It does not create an expense unless interest is also paid.",
    points: 2,
    tags: ["asset_liability_changes", "debit_credit"],
  },
  {
    id: "je-pack-01",
    type: "journal_entry",
    q: "Record the owner investing cash of $15,000 into the business.",
    answer: {
      lines: [
        { account: "Cash", side: "debit", amount: 15000 },
        { account: "Share Capital", side: "credit", amount: 15000 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "Cash increases and owner contribution increases equity.",
    points: 2,
    tags: ["debit_credit", "equity"],
  },
  {
    id: "je-pack-02",
    type: "journal_entry",
    q: "Record borrowing $9,000 cash from the bank.",
    answer: {
      lines: [
        { account: "Cash", side: "debit", amount: 9000 },
        { account: "Bank Loan Payable", side: "credit", amount: 9000 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "Borrowing increases cash and creates a liability.",
    points: 2,
    tags: ["debit_credit", "asset_liability_changes"],
  },
  {
    id: "je-pack-03",
    type: "journal_entry",
    q: "Record the cash purchase of office equipment for $4,800.",
    answer: {
      lines: [
        { account: "Office Equipment", side: "debit", amount: 4800 },
        { account: "Cash", side: "credit", amount: 4800 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "One asset increases and another asset decreases.",
    points: 2,
    tags: ["debit_credit", "asset_liability_changes"],
  },
  {
    id: "je-pack-04",
    type: "journal_entry",
    q: "Record the purchase of supplies on account for $2,350.",
    answer: {
      lines: [
        { account: "Supplies", side: "debit", amount: 2350 },
        { account: "Accounts Payable", side: "credit", amount: 2350 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "Supplies increase and the supplier payable increases.",
    points: 2,
    tags: ["debit_credit", "asset_liability_changes"],
  },
  {
    id: "je-pack-05",
    type: "journal_entry",
    q: "Record providing services on credit for $3,200.",
    answer: {
      lines: [
        { account: "Accounts Receivable", side: "debit", amount: 3200 },
        { account: "Service Revenue", side: "credit", amount: 3200 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: { "Accounts Receivable": ["Debtors"] },
      },
    },
    explanation: "A receivable is recognised when revenue is earned on credit.",
    points: 2,
    tags: ["debit_credit", "receivables"],
  },
  {
    id: "je-pack-06",
    type: "journal_entry",
    q: "Record receiving $1,850 cash from a customer for services provided immediately.",
    answer: {
      lines: [
        { account: "Cash", side: "debit", amount: 1850 },
        { account: "Service Revenue", side: "credit", amount: 1850 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "Cash is received and revenue is earned at the same time.",
    points: 2,
    tags: ["debit_credit"],
  },
  {
    id: "je-pack-07",
    type: "journal_entry",
    q: "Record paying wages expense in cash of $1,240.",
    answer: {
      lines: [
        { account: "Wages Expense", side: "debit", amount: 1240 },
        { account: "Cash", side: "credit", amount: 1240 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "Paying an expense reduces cash and equity through the expense.",
    points: 2,
    tags: ["debit_credit", "expense_recognition"],
  },
  {
    id: "je-pack-08",
    type: "journal_entry",
    q: "Record paying $900 to a supplier on account.",
    answer: {
      lines: [
        { account: "Accounts Payable", side: "debit", amount: 900 },
        { account: "Cash", side: "credit", amount: 900 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "A liability is settled with cash.",
    points: 2,
    tags: ["debit_credit", "asset_liability_changes"],
  },
  {
    id: "je-pack-09",
    type: "journal_entry",
    q: "Record collecting $2,100 cash from a customer who owed the business money.",
    answer: {
      lines: [
        { account: "Cash", side: "debit", amount: 2100 },
        { account: "Accounts Receivable", side: "credit", amount: 2100 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: { "Accounts Receivable": ["Debtors"] },
      },
    },
    explanation: "Collection reduces the receivable and increases cash.",
    points: 2,
    tags: ["debit_credit", "receivables"],
  },
  {
    id: "je-pack-10",
    type: "journal_entry",
    q: "Record receiving $1,600 cash in advance from a customer for services to be performed next month.",
    answer: {
      lines: [
        { account: "Cash", side: "debit", amount: 1600 },
        { account: "Unearned Revenue", side: "credit", amount: 1600 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "Cash received before earning revenue creates a liability.",
    points: 2,
    tags: ["debit_credit", "asset_liability_changes"],
  },
  {
    id: "je-pack-11",
    type: "journal_entry",
    q: "Record purchasing a 6-month insurance policy for $1,200 cash.",
    answer: {
      lines: [
        { account: "Prepaid Insurance", side: "debit", amount: 1200 },
        { account: "Cash", side: "credit", amount: 1200 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "The cost is initially recorded as an asset because the benefit is future.",
    points: 2,
    tags: ["debit_credit", "expense_recognition"],
  },
  {
    id: "je-pack-12",
    type: "journal_entry",
    q: "Record paying utility expense in cash of $420.",
    answer: {
      lines: [
        { account: "Utilities Expense", side: "debit", amount: 420 },
        { account: "Cash", side: "credit", amount: 420 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "Expense recognition reduces equity and cash.",
    points: 2,
    tags: ["debit_credit", "expense_recognition"],
  },
  {
    id: "je-pack-13",
    type: "journal_entry",
    q: "At period-end, salaries of $2,200 have been incurred but not yet paid. Record the adjusting entry.",
    answer: {
      lines: [
        { account: "Salaries Expense", side: "debit", amount: 2200 },
        { account: "Salaries Payable", side: "credit", amount: 2200 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "Accrued expenses require an expense and a payable.",
    points: 2,
    tags: ["adjusting_entries", "expense_recognition"],
  },
  {
    id: "je-pack-14",
    type: "journal_entry",
    q: "At year-end, services worth $1,350 have been performed but not yet billed. Record the adjusting entry.",
    answer: {
      lines: [
        { account: "Accounts Receivable", side: "debit", amount: 1350 },
        { account: "Service Revenue", side: "credit", amount: 1350 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: { "Accounts Receivable": ["Debtors"] },
      },
    },
    explanation: "Accrued revenue is recognised when earned.",
    points: 2,
    tags: ["adjusting_entries", "receivables"],
  },
  {
    id: "je-pack-15",
    type: "journal_entry",
    q: "A 12-month rent prepayment of $4,800 was made on 1 October. At 31 December, record the adjusting entry.",
    answer: {
      lines: [
        { account: "Rent Expense", side: "debit", amount: 1200 },
        { account: "Prepaid Rent", side: "credit", amount: 1200 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "Three months have expired: $4,800 x 3/12 = $1,200.",
    points: 2,
    tags: ["adjusting_entries", "expense_recognition"],
  },
  {
    id: "je-pack-16",
    type: "journal_entry",
    q: "Depreciation on office equipment for the year is $3,100. Record the adjusting entry.",
    answer: {
      lines: [
        { account: "Depreciation Expense", side: "debit", amount: 3100 },
        { account: "Accumulated Depreciation - Office Equipment", side: "credit", amount: 3100 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: {
          "Accumulated Depreciation - Office Equipment": ["Accumulated Depreciation Office Equipment"],
        },
      },
    },
    explanation: "Depreciation allocates asset cost over time.",
    points: 2,
    tags: ["adjusting_entries", "expense_recognition"],
  },
  {
    id: "je-pack-17",
    type: "journal_entry",
    q: "A business has Unearned Revenue of $5,400. By period-end, $1,800 has been earned. Record the adjusting entry.",
    answer: {
      lines: [
        { account: "Unearned Revenue", side: "debit", amount: 1800 },
        { account: "Service Revenue", side: "credit", amount: 1800 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "As services are provided, the liability is reduced and revenue is recognised.",
    points: 2,
    tags: ["adjusting_entries", "asset_liability_changes"],
  },
  {
    id: "je-pack-18",
    type: "journal_entry",
    q: "Interest of $260 has accrued on a bank loan at period-end. Record the adjusting entry.",
    answer: {
      lines: [
        { account: "Interest Expense", side: "debit", amount: 260 },
        { account: "Interest Payable", side: "credit", amount: 260 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "Accrued interest creates an expense and a payable.",
    points: 2,
    tags: ["adjusting_entries", "expense_recognition"],
  },
  {
    id: "je-pack-19",
    type: "journal_entry",
    q: "Office supplies on hand at year-end are $340. The Supplies account before adjustment is $980. Record the adjusting entry.",
    answer: {
      lines: [
        { account: "Supplies Expense", side: "debit", amount: 640 },
        { account: "Supplies", side: "credit", amount: 640 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "Supplies used = $980 - $340 = $640.",
    points: 2,
    tags: ["adjusting_entries", "expense_recognition"],
  },
  {
    id: "je-pack-20",
    type: "journal_entry",
    q: "A business paid $3,600 for a 12-month advertising contract on 1 September. At 31 December, record the adjusting entry.",
    answer: {
      lines: [
        { account: "Advertising Expense", side: "debit", amount: 1200 },
        { account: "Prepaid Advertising", side: "credit", amount: 1200 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "Four months have expired: $3,600 x 4/12 = $1,200.",
    points: 2,
    tags: ["adjusting_entries", "expense_recognition"],
  },
  {
    id: "je-pack-21",
    type: "journal_entry",
    q: "At year-end, utilities of $190 have been consumed but not yet paid. Record the adjusting entry.",
    answer: {
      lines: [
        { account: "Utilities Expense", side: "debit", amount: 190 },
        { account: "Utilities Payable", side: "credit", amount: 190 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "Accrued utilities create an expense and a payable.",
    points: 2,
    tags: ["adjusting_entries", "expense_recognition"],
  },
  {
    id: "je-pack-22",
    type: "journal_entry",
    q: "Insurance of $250 has expired this month. Record the adjusting entry.",
    answer: {
      lines: [
        { account: "Insurance Expense", side: "debit", amount: 250 },
        { account: "Prepaid Insurance", side: "credit", amount: 250 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "Expired insurance is transferred from an asset to an expense.",
    points: 2,
    tags: ["adjusting_entries", "expense_recognition"],
  },
  {
    id: "je-pack-23",
    type: "journal_entry",
    q: "Commission revenue of $640 has been earned but not yet received or recorded. Record the adjusting entry.",
    answer: {
      lines: [
        { account: "Commission Receivable", side: "debit", amount: 640 },
        { account: "Commission Revenue", side: "credit", amount: 640 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "The earned commission creates a receivable and revenue.",
    points: 2,
    tags: ["adjusting_entries", "receivables"],
  },
  {
    id: "je-pack-24",
    type: "journal_entry",
    q: "A customer advance of $2,100 has now been fully earned. Record the adjusting entry.",
    answer: {
      lines: [
        { account: "Unearned Revenue", side: "debit", amount: 2100 },
        { account: "Service Revenue", side: "credit", amount: 2100 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "Once earned, the liability is removed and revenue is recognised.",
    points: 2,
    tags: ["adjusting_entries", "asset_liability_changes"],
  },
  {
    id: "je-pack-25",
    type: "journal_entry",
    q: "Record the credit purchase of inventory for $4,950 including GST.",
    answer: {
      lines: [
        { account: "Inventory", side: "debit", amount: 4500 },
        { account: "GST Receivable", side: "debit", amount: 450 },
        { account: "Accounts Payable", side: "credit", amount: 4950 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "Inventory is recorded net of GST with a separate GST receivable.",
    points: 3,
    tags: ["inventory_purchases", "gst", "debit_credit"],
  },
  {
    id: "je-pack-26",
    type: "journal_entry",
    q: "Record the cash purchase of inventory for $2,200 including GST.",
    answer: {
      lines: [
        { account: "Inventory", side: "debit", amount: 2000 },
        { account: "GST Receivable", side: "debit", amount: 200 },
        { account: "Cash", side: "credit", amount: 2200 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "Cash purchases follow the same GST split as credit purchases.",
    points: 3,
    tags: ["inventory_purchases", "gst", "debit_credit"],
  },
  {
    id: "je-pack-27",
    type: "journal_entry",
    q: "Record a credit sale of inventory for $6,600 including GST. The goods sold cost $3,900.",
    answer: {
      lines: [
        { account: "Accounts Receivable", side: "debit", amount: 6600 },
        { account: "Sales Revenue", side: "credit", amount: 6000 },
        { account: "GST Payable", side: "credit", amount: 600 },
        { account: "Cost of Sales", side: "debit", amount: 3900 },
        { account: "Inventory", side: "credit", amount: 3900 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: { "Accounts Receivable": ["Debtors"] },
      },
    },
    explanation: "Perpetual sales require both the revenue entry and the cost transfer.",
    points: 5,
    tags: ["inventory_sales", "gst", "debit_credit"],
  },
  {
    id: "je-pack-28",
    type: "journal_entry",
    q: "Record a cash sale of inventory for $3,300 including GST. The goods sold cost $1,950.",
    answer: {
      lines: [
        { account: "Cash", side: "debit", amount: 3300 },
        { account: "Sales Revenue", side: "credit", amount: 3000 },
        { account: "GST Payable", side: "credit", amount: 300 },
        { account: "Cost of Sales", side: "debit", amount: 1950 },
        { account: "Inventory", side: "credit", amount: 1950 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "The sale and the reduction of inventory are recorded separately.",
    points: 5,
    tags: ["inventory_sales", "gst", "debit_credit"],
  },
  {
    id: "je-pack-29",
    type: "journal_entry",
    q: "Inventory costing $1,100 including GST is returned to a supplier on account. Record the return.",
    answer: {
      lines: [
        { account: "Accounts Payable", side: "debit", amount: 1100 },
        { account: "Inventory", side: "credit", amount: 1000 },
        { account: "GST Receivable", side: "credit", amount: 100 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "The payable is reduced and the inventory plus GST claim are reversed.",
    points: 3,
    tags: ["inventory_purchases", "gst", "debit_credit"],
  },
  {
    id: "je-pack-30",
    type: "journal_entry",
    q: "A customer returns goods originally sold on credit for $880 including GST. The goods had cost $520. Record the return under a perpetual system.",
    answer: {
      lines: [
        { account: "Sales Returns and Allowances", side: "debit", amount: 800 },
        { account: "GST Payable", side: "debit", amount: 80 },
        { account: "Accounts Receivable", side: "credit", amount: 880 },
        { account: "Inventory", side: "debit", amount: 520 },
        { account: "Cost of Sales", side: "credit", amount: 520 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: { "Accounts Receivable": ["Debtors"] },
      },
    },
    explanation: "The sale is partially reversed and the inventory is restored.",
    points: 5,
    tags: ["inventory_sales", "gst", "debit_credit"],
  },
  {
    id: "je-pack-31",
    type: "journal_entry",
    q: "A customer takes a $120 sales discount on an account receivable. Record the cash collection.",
    answer: {
      lines: [
        { account: "Cash", side: "debit", amount: 2880 },
        { account: "Sales Discounts", side: "debit", amount: 120 },
        { account: "Accounts Receivable", side: "credit", amount: 3000 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: { "Accounts Receivable": ["Debtors"] },
      },
    },
    explanation: "The receivable is cleared, cash is collected, and the discount is recorded separately.",
    points: 3,
    tags: ["inventory_sales", "receivables", "debit_credit"],
  },
  {
    id: "je-pack-32",
    type: "journal_entry",
    q: "Record freight-in paid in cash of $260 on an inventory purchase.",
    answer: {
      lines: [
        { account: "Inventory", side: "debit", amount: 260 },
        { account: "Cash", side: "credit", amount: 260 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "Freight-in is capitalised as part of inventory cost.",
    points: 2,
    tags: ["inventory_purchases", "debit_credit"],
  },
  {
    id: "je-pack-33",
    type: "journal_entry",
    q: "Record writing down inventory from cost of $9,400 to net realisable value of $8,700.",
    answer: {
      lines: [
        { account: "Loss on Inventory Write-Down", side: "debit", amount: 700 },
        { account: "Inventory", side: "credit", amount: 700 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: {
          "Loss on Inventory Write-Down": ["Inventory Write-Down Expense"],
        },
      },
    },
    explanation: "The inventory balance is reduced to NRV and the loss is recognised.",
    points: 2,
    tags: ["inventory", "balance_sheet", "income_statement"],
  },
  {
    id: "je-pack-34",
    type: "journal_entry",
    q: "Record the credit purchase of inventory for $7,700 including GST, followed by immediate payment of the supplier in cash.",
    answer: {
      lines: [
        { account: "Inventory", side: "debit", amount: 7000 },
        { account: "GST Receivable", side: "debit", amount: 700 },
        { account: "Accounts Payable", side: "credit", amount: 7700 },
        { account: "Accounts Payable", side: "debit", amount: 7700 },
        { account: "Cash", side: "credit", amount: 7700 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "The purchase and later settlement are recorded as separate steps.",
    points: 5,
    tags: ["inventory_purchases", "gst", "debit_credit"],
  },
  {
    id: "je-pack-35",
    type: "journal_entry",
    q: "Record a credit sale of inventory for $9,900 including GST. The goods sold cost $5,750. The customer later pays in full, less a $150 sales discount. Record both the sale and collection.",
    answer: {
      lines: [
        { account: "Accounts Receivable", side: "debit", amount: 9900 },
        { account: "Sales Revenue", side: "credit", amount: 9000 },
        { account: "GST Payable", side: "credit", amount: 900 },
        { account: "Cost of Sales", side: "debit", amount: 5750 },
        { account: "Inventory", side: "credit", amount: 5750 },
        { account: "Cash", side: "debit", amount: 9750 },
        { account: "Sales Discounts", side: "debit", amount: 150 },
        { account: "Accounts Receivable", side: "credit", amount: 9900 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: { "Accounts Receivable": ["Debtors"] },
      },
    },
    explanation: "This combines the original sale, cost transfer, and discounted collection.",
    points: 8,
    tags: ["inventory_sales", "receivables", "gst", "debit_credit"],
  },
  {
    id: "je-pack-36",
    type: "journal_entry",
    q: "Record returning damaged inventory purchased for cash for $550 including GST, with the supplier refunding the cash immediately.",
    answer: {
      lines: [
        { account: "Cash", side: "debit", amount: 550 },
        { account: "Inventory", side: "credit", amount: 500 },
        { account: "GST Receivable", side: "credit", amount: 50 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "The inventory and GST claim are reversed when the cash refund is received.",
    points: 3,
    tags: ["inventory_purchases", "gst", "debit_credit"],
  },
  {
    id: "je-pack-37",
    type: "journal_entry",
    q: "Write off a specific customer's account of $1,260 using the allowance method.",
    answer: {
      lines: [
        { account: "Allowance for Doubtful Debts", side: "debit", amount: 1260 },
        { account: "Accounts Receivable", side: "credit", amount: 1260 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: { "Accounts Receivable": ["Debtors"] },
      },
    },
    explanation: "The write-off reduces both the receivable and the allowance.",
    points: 2,
    tags: ["receivables", "allowance_method", "debit_credit"],
  },
  {
    id: "je-pack-38",
    type: "journal_entry",
    q: "The required ending allowance balance is $2,400 credit. Before adjustment, Allowance for Doubtful Debts has a $300 credit balance. Record the adjusting entry.",
    answer: {
      lines: [
        { account: "Bad Debts Expense", side: "debit", amount: 2100 },
        { account: "Allowance for Doubtful Debts", side: "credit", amount: 2100 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "The allowance must be increased by $2,100 to reach the required ending balance.",
    points: 2,
    tags: ["receivables", "allowance_method", "debit_credit"],
  },
  {
    id: "je-pack-39",
    type: "journal_entry",
    q: "The required ending allowance balance is $3,100 credit. Before adjustment, Allowance for Doubtful Debts has a $250 debit balance. Record the adjusting entry.",
    answer: {
      lines: [
        { account: "Bad Debts Expense", side: "debit", amount: 3350 },
        { account: "Allowance for Doubtful Debts", side: "credit", amount: 3350 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "A debit balance must first be eliminated before building the required credit balance.",
    points: 2,
    tags: ["receivables", "allowance_method", "debit_credit"],
  },
  {
    id: "je-pack-40",
    type: "journal_entry",
    q: "A $540 account previously written off is recovered in cash under the allowance method. Record the recovery using two entries.",
    answer: {
      lines: [
        { account: "Accounts Receivable", side: "debit", amount: 540 },
        { account: "Allowance for Doubtful Debts", side: "credit", amount: 540 },
        { account: "Cash", side: "debit", amount: 540 },
        { account: "Accounts Receivable", side: "credit", amount: 540 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: { "Accounts Receivable": ["Debtors"] },
      },
    },
    explanation: "First reinstate the receivable, then collect the cash.",
    points: 4,
    tags: ["receivables", "allowance_method", "debit_credit"],
  },
  {
    id: "je-pack-41",
    type: "journal_entry",
    q: "A customer's cheque of $330 is dishonoured by the bank. Record the cash-book adjustment.",
    answer: {
      lines: [
        { account: "Accounts Receivable", side: "debit", amount: 330 },
        { account: "Cash", side: "credit", amount: 330 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: { "Accounts Receivable": ["Debtors"] },
      },
    },
    explanation: "The dishonoured cheque reverses the earlier receipt and restores the receivable.",
    points: 2,
    tags: ["bank_reconciliation", "receivables", "debit_credit"],
  },
  {
    id: "je-pack-42",
    type: "journal_entry",
    q: "The bank statement shows bank charges of $48 not yet recorded. Record the entry.",
    answer: {
      lines: [
        { account: "Bank Charges Expense", side: "debit", amount: 48 },
        { account: "Cash", side: "credit", amount: 48 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "Bank charges reduce the cash balance and create an expense.",
    points: 2,
    tags: ["bank_reconciliation", "expense_recognition"],
  },
  {
    id: "je-pack-43",
    type: "journal_entry",
    q: "A customer pays by credit card $2,420 including GST. The card company charges a 2.5% fee and remits the balance immediately. Record the entry.",
    answer: {
      lines: [
        { account: "Cash", side: "debit", amount: 2359.5 },
        { account: "Credit Card Service Charge Expense", side: "debit", amount: 60.5 },
        { account: "Sales Revenue", side: "credit", amount: 2200 },
        { account: "GST Payable", side: "credit", amount: 220 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: {
          "Credit Card Service Charge Expense": ["Service Charge Expense", "Bank Charges Expense"],
        },
      },
    },
    explanation: "Record the full sale, then recognise the merchant fee and net cash received.",
    points: 4,
    tags: ["receivables", "gst", "debit_credit"],
  },
  {
    id: "je-pack-44",
    type: "journal_entry",
    q: "Accounts receivable of $10,000 are sold to a factor without recourse. The factor charges a 4% fee and remits the balance in cash. Record the entry.",
    answer: {
      lines: [
        { account: "Cash", side: "debit", amount: 9600 },
        { account: "Loss on Sale of Accounts Receivable", side: "debit", amount: 400 },
        { account: "Accounts Receivable", side: "credit", amount: 10000 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: {
          "Accounts Receivable": ["Debtors"],
          "Loss on Sale of Accounts Receivable": ["Factoring Expense"],
        },
      },
    },
    explanation: "Factoring removes the receivables and recognises the factor's fee as a loss or expense.",
    points: 3,
    tags: ["receivables", "debit_credit"],
  },
  {
    id: "je-pack-45",
    type: "journal_entry",
    q: "Record a bank's direct deposit of interest earned of $55 shown on the bank statement but not yet recorded.",
    answer: {
      lines: [
        { account: "Cash", side: "debit", amount: 55 },
        { account: "Interest Revenue", side: "credit", amount: 55 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "The bank statement identifies cash received and revenue earned.",
    points: 2,
    tags: ["bank_reconciliation", "debit_credit"],
  },
  {
    id: "je-pack-46",
    type: "journal_entry",
    q: "A note receivable of $2,000 plus accrued interest of $80 is collected in cash. Record the receipt.",
    answer: {
      lines: [
        { account: "Cash", side: "debit", amount: 2080 },
        { account: "Notes Receivable", side: "credit", amount: 2000 },
        { account: "Interest Revenue", side: "credit", amount: 80 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "Collection clears the receivable and recognises interest revenue.",
    points: 3,
    tags: ["receivables", "debit_credit"],
  },
  {
    id: "je-pack-47",
    type: "journal_entry",
    q: "A customer owing $1,500 pays $1,470 within the discount period and is entitled to a $30 discount. Record the collection.",
    answer: {
      lines: [
        { account: "Cash", side: "debit", amount: 1470 },
        { account: "Sales Discounts", side: "debit", amount: 30 },
        { account: "Accounts Receivable", side: "credit", amount: 1500 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: { "Accounts Receivable": ["Debtors"] },
      },
    },
    explanation: "Discounts allowed reduce net sales when the receivable is settled.",
    points: 3,
    tags: ["receivables", "debit_credit"],
  },
  {
    id: "je-pack-48",
    type: "journal_entry",
    q: "The bank has collected $1,200 from a customer on the business's behalf and credited the account. Record the entry.",
    answer: {
      lines: [
        { account: "Cash", side: "debit", amount: 1200 },
        { account: "Accounts Receivable", side: "credit", amount: 1200 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: { "Accounts Receivable": ["Debtors"] },
      },
    },
    explanation: "A bank collection increases cash and clears the customer balance.",
    points: 2,
    tags: ["bank_reconciliation", "receivables"],
  },
  {
    id: "je-pack-49",
    type: "journal_entry",
    q: "Record purchasing machinery for $25,000 cash and paying installation costs of $1,500 cash in the same entry.",
    answer: {
      lines: [
        { account: "Machinery", side: "debit", amount: 26500 },
        { account: "Cash", side: "credit", amount: 26500 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "All costs to acquire and prepare the asset for use are capitalised.",
    points: 2,
    tags: ["debit_credit"],
  },
  {
    id: "je-pack-50",
    type: "journal_entry",
    q: "Annual depreciation on machinery is $5,600. Record the adjusting entry.",
    answer: {
      lines: [
        { account: "Depreciation Expense", side: "debit", amount: 5600 },
        { account: "Accumulated Depreciation - Machinery", side: "credit", amount: 5600 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: {
          "Accumulated Depreciation - Machinery": ["Accumulated Depreciation Machinery"],
        },
      },
    },
    explanation: "Depreciation records the period cost of using the machinery.",
    points: 2,
    tags: ["adjusting_entries", "expense_recognition"],
  },
  {
    id: "je-pack-51",
    type: "journal_entry",
    q: "Equipment costing $12,000 with accumulated depreciation of $7,000 is sold for $4,200 cash. Record the disposal.",
    answer: {
      lines: [
        { account: "Cash", side: "debit", amount: 4200 },
        { account: "Accumulated Depreciation - Equipment", side: "debit", amount: 7000 },
        { account: "Loss on Disposal of Equipment", side: "debit", amount: 800 },
        { account: "Equipment", side: "credit", amount: 12000 },
      ],
      rules: {
        requireBalancedEntry: true,
        acceptedAccountAliases: {
          "Accumulated Depreciation - Equipment": ["Accumulated Depreciation Equipment"],
          "Loss on Disposal of Equipment": ["Loss on Sale of Equipment"],
        },
      },
    },
    explanation: "The carrying amount is $5,000, so selling for $4,200 creates an $800 loss.",
    points: 4,
    tags: ["debit_credit"],
  },
  {
    id: "je-pack-52",
    type: "journal_entry",
    q: "Record a bond issue at a discount: cash proceeds $19,200 for a bond payable of $20,000.",
    answer: {
      lines: [
        { account: "Cash", side: "debit", amount: 19200 },
        { account: "Discount on Bonds Payable", side: "debit", amount: 800 },
        { account: "Bonds Payable", side: "credit", amount: 20000 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "A discount is recorded when cash proceeds are less than face value.",
    points: 3,
    tags: ["debit_credit"],
  },
  {
    id: "je-pack-53",
    type: "journal_entry",
    q: "Record the current year's amortisation of bond discount of $120.",
    answer: {
      lines: [
        { account: "Interest Expense", side: "debit", amount: 120 },
        { account: "Discount on Bonds Payable", side: "credit", amount: 120 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "Amortising a bond discount increases interest expense and reduces the discount balance.",
    points: 2,
    tags: ["adjusting_entries", "expense_recognition"],
  },
  {
    id: "je-pack-54",
    type: "journal_entry",
    q: "Record the issue of a 3-year note payable for $6,500 cash.",
    answer: {
      lines: [
        { account: "Cash", side: "debit", amount: 6500 },
        { account: "Notes Payable", side: "credit", amount: 6500 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "Issuing a note increases cash and creates a liability.",
    points: 2,
    tags: ["asset_liability_changes", "debit_credit"],
  },
  {
    id: "je-pack-55",
    type: "journal_entry",
    q: "Record repayment of note principal of $1,800 in cash.",
    answer: {
      lines: [
        { account: "Notes Payable", side: "debit", amount: 1800 },
        { account: "Cash", side: "credit", amount: 1800 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "Repaying principal reduces the note liability and cash.",
    points: 2,
    tags: ["asset_liability_changes", "debit_credit"],
  },
  {
    id: "je-pack-56",
    type: "journal_entry",
    q: "Record declaring cash dividends of $4,400.",
    answer: {
      lines: [
        { account: "Retained Earnings", side: "debit", amount: 4400 },
        { account: "Dividends Payable", side: "credit", amount: 4400 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "Declaration creates a liability and reduces retained earnings.",
    points: 2,
    tags: ["equity", "debit_credit"],
  },
  {
    id: "je-pack-57",
    type: "journal_entry",
    q: "Record paying previously declared cash dividends of $4,400.",
    answer: {
      lines: [
        { account: "Dividends Payable", side: "debit", amount: 4400 },
        { account: "Cash", side: "credit", amount: 4400 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "Payment settles the dividend liability and reduces cash.",
    points: 2,
    tags: ["equity", "debit_credit"],
  },
  {
    id: "je-pack-58",
    type: "journal_entry",
    q: "Record issuing ordinary shares for cash of $28,000.",
    answer: {
      lines: [
        { account: "Cash", side: "debit", amount: 28000 },
        { account: "Share Capital", side: "credit", amount: 28000 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "Cash increases and contributed equity increases.",
    points: 2,
    tags: ["equity", "debit_credit"],
  },
  {
    id: "je-pack-59",
    type: "journal_entry",
    q: "Record transferring current-year profit of $9,600 to retained earnings at period-end.",
    answer: {
      lines: [
        { account: "Income Summary", side: "debit", amount: 9600 },
        { account: "Retained Earnings", side: "credit", amount: 9600 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "Closing entries transfer the period result to retained earnings.",
    points: 2,
    tags: ["equity", "debit_credit"],
  },
  {
    id: "je-pack-60",
    type: "journal_entry",
    q: "Record closing dividends of $2,300 to retained earnings.",
    answer: {
      lines: [
        { account: "Retained Earnings", side: "debit", amount: 2300 },
        { account: "Dividends", side: "credit", amount: 2300 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "Closing dividends reduces retained earnings at period-end.",
    points: 2,
    tags: ["equity", "debit_credit"],
  },
  {
    id: "je-pack-61",
    type: "journal_entry",
    q: "Record reissuing ordinary shares for cash at $11,500.",
    answer: {
      lines: [
        { account: "Cash", side: "debit", amount: 11500 },
        { account: "Share Capital", side: "credit", amount: 11500 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "Cash from issuing shares increases contributed equity.",
    points: 2,
    tags: ["equity", "debit_credit"],
  },
  {
    id: "je-pack-62",
    type: "journal_entry",
    q: "Record an upward revaluation of land of $18,000 to a revaluation reserve.",
    answer: {
      lines: [
        { account: "Land", side: "debit", amount: 18000 },
        { account: "Revaluation Reserve", side: "credit", amount: 18000 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "An upward revaluation increases the asset and equity reserve.",
    points: 2,
    tags: ["equity", "balance_sheet", "debit_credit"],
  },
  {
    id: "je-pack-63",
    type: "journal_entry",
    q: "Record declaring a share dividend of $3,000 from retained earnings.",
    answer: {
      lines: [
        { account: "Retained Earnings", side: "debit", amount: 3000 },
        { account: "Share Capital", side: "credit", amount: 3000 },
      ],
      rules: { requireBalancedEntry: true },
    },
    explanation: "A share dividend transfers part of retained earnings into share capital.",
    points: 2,
    tags: ["equity", "debit_credit"],
  },
];
