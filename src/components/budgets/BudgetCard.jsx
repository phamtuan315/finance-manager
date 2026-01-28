import { formatCurrency } from '../../utils/formatters'
import { Pencil, Trash2, AlertTriangle } from 'lucide-react'

export default function BudgetCard({ budget, onEdit, onDelete }) {
  const percentage = parseFloat(budget.percentage) || 0
  const isOverBudget = budget.isOverBudget || false
  const isWarning = percentage >= 80 && percentage < 100

  const getProgressColor = () => {
    if (isOverBudget) return 'bg-red-600'
    if (isWarning) return 'bg-yellow-500'
    return 'bg-green-600'
  }

  const getTextColor = () => {
    if (isOverBudget) return 'text-red-600'
    if (isWarning) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{budget.category?.icon}</span>
          <div>
            <h3 className="font-semibold text-gray-900">
              {budget.category?.name || 'Không phân loại'}
            </h3>
            <p className="text-sm text-gray-500">
              {budget.period === 'monthly' ? `Tháng ${budget.month}` : 'Cả năm'} {budget.year}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(budget)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(budget.id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isOverBudget && (
        <div className="mb-3 flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-medium">Đã vượt ngân sách!</span>
        </div>
      )}

      {isWarning && !isOverBudget && (
        <div className="mb-3 flex items-center gap-2 text-yellow-600 text-sm bg-yellow-50 px-3 py-2 rounded">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-medium">Sắp hết ngân sách</span>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Đã chi</span>
          <span className={`font-semibold ${getTextColor()}`}>
            {formatCurrency(budget.spent || 0)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Ngân sách</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(budget.amount)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Còn lại</span>
          <span className={`font-semibold ${getTextColor()}`}>
            {formatCurrency(budget.remaining || 0)}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Tiến độ</span>
          <span className={`font-medium ${getTextColor()}`}>
            {percentage.toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full ${getProgressColor()} transition-all duration-300`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
