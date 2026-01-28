import { useState, useEffect } from 'react'
import { useCategories } from '../../hooks/useCategories'
import { useAccounts } from '../../hooks/useAccounts'
import { getFirstDayOfMonth, getTodayDate } from '../../utils/formatters'
import { TRANSACTION_TYPE_OPTIONS } from '../../utils/constants'

export default function TransactionFilter({ filters, onFilterChange }) {
  const [localFilters, setLocalFilters] = useState({
    startDate: filters.startDate || getFirstDayOfMonth(),
    endDate: filters.endDate || getTodayDate(),
    type: filters.type || '',
    categoryId: filters.categoryId || '',
    accountId: filters.accountId || '',
  })

  const { data: categories } = useCategories(localFilters.type || undefined)
  const { data: accounts } = useAccounts()

  const handleChange = (e) => {
    const { name, value } = e.target
    setLocalFilters(prev => {
      const newFilters = { ...prev, [name]: value }
      // Reset category when type changes
      if (name === 'type') {
        newFilters.categoryId = ''
      }
      return newFilters
    })
  }

  const handleApply = () => {
    onFilterChange(localFilters)
  }

  const handleReset = () => {
    const resetFilters = {
      startDate: getFirstDayOfMonth(),
      endDate: getTodayDate(),
      type: '',
      categoryId: '',
      accountId: '',
    }
    setLocalFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Bộ lọc</h3>
        <button
          onClick={handleReset}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900"
        >
          Đặt lại
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Từ ngày
          </label>
          <input
            type="date"
            name="startDate"
            value={localFilters.startDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Đến ngày
          </label>
          <input
            type="date"
            name="endDate"
            value={localFilters.endDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Loại
          </label>
          <select
            name="type"
            value={localFilters.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            <option value="">Tất cả</option>
            {TRANSACTION_TYPE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Danh mục
          </label>
          <select
            name="categoryId"
            value={localFilters.categoryId}
            onChange={handleChange}
            disabled={!localFilters.type}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm disabled:bg-gray-100"
          >
            <option value="">Tất cả</option>
            {categories?.map(category => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tài khoản
          </label>
          <select
            name="accountId"
            value={localFilters.accountId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            <option value="">Tất cả</option>
            {accounts?.map(account => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium"
        >
          Áp dụng
        </button>
      </div>
    </div>
  )
}
