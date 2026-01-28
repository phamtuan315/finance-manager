import { useState, useEffect } from 'react'
import { useCategories } from '../../hooks/useCategories'

export default function BudgetForm({ budget, onSubmit, onCancel }) {
  const currentDate = new Date()
  const [formData, setFormData] = useState({
    category_id: budget?.category_id || '',
    amount: budget?.amount || '',
    period: budget?.period || 'monthly',
    month: budget?.month || currentDate.getMonth() + 1,
    year: budget?.year || currentDate.getFullYear(),
  })

  const { data: categories } = useCategories('expense')

  useEffect(() => {
    if (budget) {
      setFormData({
        category_id: budget.category_id || '',
        amount: budget.amount || '',
        period: budget.period || 'monthly',
        month: budget.month || currentDate.getMonth() + 1,
        year: budget.year || currentDate.getFullYear(),
      })
    }
  }, [budget])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      month: parseInt(formData.month),
      year: parseInt(formData.year),
    })
  }

  const months = [
    { value: 1, label: 'Tháng 1' },
    { value: 2, label: 'Tháng 2' },
    { value: 3, label: 'Tháng 3' },
    { value: 4, label: 'Tháng 4' },
    { value: 5, label: 'Tháng 5' },
    { value: 6, label: 'Tháng 6' },
    { value: 7, label: 'Tháng 7' },
    { value: 8, label: 'Tháng 8' },
    { value: 9, label: 'Tháng 9' },
    { value: 10, label: 'Tháng 10' },
    { value: 11, label: 'Tháng 11' },
    { value: 12, label: 'Tháng 12' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Danh mục chi tiêu
        </label>
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Chọn danh mục</option>
          {categories?.map(category => (
            <option key={category.id} value={category.id}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Số tiền ngân sách (VND)
        </label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          min="0"
          step="1000"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập số tiền"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Chu kỳ
        </label>
        <select
          name="period"
          value={formData.period}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="monthly">Theo tháng</option>
          <option value="yearly">Theo năm</option>
        </select>
      </div>

      {formData.period === 'monthly' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tháng
          </label>
          <select
            name="month"
            value={formData.month}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {months.map(month => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Năm
        </label>
        <input
          type="number"
          name="year"
          value={formData.year}
          onChange={handleChange}
          required
          min="2020"
          max="2100"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          {budget ? 'Cập nhật' : 'Tạo mới'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
        >
          Hủy
        </button>
      </div>
    </form>
  )
}
