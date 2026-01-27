// Transaction types
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
  TRANSFER: 'transfer',
}

export const TRANSACTION_TYPE_OPTIONS = [
  { value: 'income', label: 'Thu nhập', color: 'green' },
  { value: 'expense', label: 'Chi tiêu', color: 'red' },
]

// Account types
export const ACCOUNT_TYPES = {
  CASH: 'cash',
  BANK: 'bank',
  CARD: 'card',
  INVESTMENT: 'investment',
}

export const ACCOUNT_TYPE_OPTIONS = [
  { value: 'cash', label: 'Tiền mặt', icon: '💵' },
  { value: 'bank', label: 'Ngân hàng', icon: '🏦' },
  { value: 'card', label: 'Thẻ tín dụng', icon: '💳' },
  { value: 'investment', label: 'Đầu tư', icon: '📈' },
]

// Category types
export const CATEGORY_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
}

// Currency
export const DEFAULT_CURRENCY = 'VND'

// Date ranges
export const DATE_RANGES = {
  TODAY: 'today',
  THIS_WEEK: 'this_week',
  THIS_MONTH: 'this_month',
  THIS_YEAR: 'this_year',
  LAST_MONTH: 'last_month',
  LAST_YEAR: 'last_year',
  CUSTOM: 'custom',
}

// Pagination
export const DEFAULT_PAGE_SIZE = 20

// Colors for charts
export const CHART_COLORS = [
  '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
]
