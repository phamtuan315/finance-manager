import { useState } from 'react'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { Pencil, Trash2, PlusCircle, CheckCircle2, Target } from 'lucide-react'

export default function GoalCard({ goal, onEdit, onDelete, onAddContribution }) {
  const [showContribution, setShowContribution] = useState(false)
  const [contributionAmount, setContributionAmount] = useState('')

  const progress = goal.target_amount > 0
    ? (goal.current_amount / goal.target_amount) * 100
    : 0

  const isCompleted = goal.status === 'completed'
  const remaining = goal.target_amount - goal.current_amount

  const handleAddContribution = () => {
    if (contributionAmount && parseFloat(contributionAmount) > 0) {
      onAddContribution(goal.id, parseFloat(contributionAmount))
      setContributionAmount('')
      setShowContribution(false)
    }
  }

  const getDaysRemaining = () => {
    if (!goal.deadline) return null
    const today = new Date()
    const deadline = new Date(goal.deadline)
    const diff = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
    return diff
  }

  const daysRemaining = getDaysRemaining()

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full ${isCompleted ? 'bg-green-100' : 'bg-blue-100'}`}>
            {isCompleted ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : (
              <Target className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{goal.name}</h3>
            {goal.deadline && (
              <p className="text-sm text-gray-500">
                {daysRemaining !== null && daysRemaining >= 0
                  ? `Còn ${daysRemaining} ngày`
                  : daysRemaining !== null && daysRemaining < 0
                  ? `Quá hạn ${Math.abs(daysRemaining)} ngày`
                  : formatDate(goal.deadline)}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {!isCompleted && (
            <button
              onClick={() => onEdit(goal)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(goal.id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isCompleted && (
        <div className="mb-4 flex items-center gap-2 text-green-600 text-sm bg-green-50 px-3 py-2 rounded">
          <CheckCircle2 className="w-4 h-4" />
          <span className="font-medium">Đã hoàn thành mục tiêu!</span>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Đã tiết kiệm</span>
          <span className="font-semibold text-green-600">
            {formatCurrency(goal.current_amount)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Mục tiêu</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(goal.target_amount)}
          </span>
        </div>
        {!isCompleted && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Còn thiếu</span>
            <span className="font-semibold text-orange-600">
              {formatCurrency(remaining)}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Tiến độ</span>
          <span className="font-medium text-blue-600">
            {progress.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full ${isCompleted ? 'bg-green-600' : 'bg-blue-600'} transition-all duration-300`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {!isCompleted && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {!showContribution ? (
            <button
              onClick={() => setShowContribution(true)}
              className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Thêm tiền tiết kiệm
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                type="number"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                placeholder="Số tiền"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="10000"
              />
              <button
                onClick={handleAddContribution}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
              >
                Thêm
              </button>
              <button
                onClick={() => {
                  setShowContribution(false)
                  setContributionAmount('')
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors"
              >
                Hủy
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
