export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelancing',
  'Business',
  'Investment',
  'Other',
];

export const EXPENSE_CATEGORIES = [
  'Food',
  'Shopping',
  'Transport',
  'Education',
  'Entertainment',
  'Healthcare',
  'Bills',
  'Travel',
  'Other',
];

export const PAYMENT_METHODS = [
  'UPI',
  'Credit Card',
  'Debit Card',
  'Cash',
  'Bank Transfer',
  'Net Banking',
  'Other',
];

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'INR (₹) - Indian Rupee' },
  { code: 'USD', symbol: '$', label: 'USD ($) - US Dollar' },
  { code: 'EUR', symbol: '€', label: 'EUR (€) - Euro' },
  { code: 'GBP', symbol: '£', label: 'GBP (£) - British Pound' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥) - Japanese Yen' },
  { code: 'CAD', symbol: 'C$', label: 'CAD (C$) - Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', label: 'AUD (A$) - Australian Dollar' },
];

export const CATEGORY_COLORS = {
  // Expenses
  Food: '#f97316',          // Orange
  Shopping: '#ec4899',      // Pink
  Transport: '#3b82f6',     // Blue
  Education: '#8b5cf6',     // Purple
  Entertainment: '#a855f7', // Violet
  Healthcare: '#ef4444',    // Red
  Bills: '#eab308',         // Amber
  Travel: '#06b6d4',        // Cyan
  // Income
  Salary: '#10b981',        // Emerald
  Freelancing: '#14b8a6',   // Teal
  Business: '#6366f1',      // Indigo
  Investment: '#059669',    // Green
  Other: '#64748b',         // Slate
};
