import { useState, useEffect } from 'react'
import { useAccounts } from '../../hooks/useAccounts'
import { useCategories } from '../../hooks/useCategories'
import { getTodayDate } from '../../utils/formatters'
import { TRANSACTION_TYPE_OPTIONS } from '../../utils/constants'
import Modal from '../common/Modal'

export default function TransactionForm({ isOpen, onClose, onSubmit, transaction, loading }) {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category_id: '',
    account_id: '',
    description: '',
    transaction_date: getTodayDate(),
  })

  const { data: accounts } = useAccounts()
  const { data: categories } = useCategories(formData.type)

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount?.toString() || '',
        category_id: transaction.category_id || '',
        account_id: transaction.account_id || '',
        description: transaction.description || '',
        transaction_date: transaction.transaction_date || getTodayDate(),
      })
    } else {
      setFormData({
        type: 'expense',
        amount: '',
        category_id: '',
        account_id: '',
        description: '',
        transaction_date: getTodayDate(),
      })
    }
  }, [transaction, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const newData = { ...prev, [name]: value }
      // Reset category when type changes
      if (name === 'type') {
        newData.category_id = ''
      }
      return newData
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount) || 0,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={transaction ? 'Sửa giao dịch' : 'Thêm giao dịch'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Loại giao dịch *
          </label>
          <select
            name="type"
            required
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {TRANSACTION_TYPE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Số tiền *
          </label>
          <input
            type="number"
            name="amount"
            required
            value={formData.amount}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="50000"
            step="1000"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Danh mục
          </label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Không có</option>
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
            name="account_id"
            value={formData.account_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Không có</option>
            {accounts?.map(account => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ngày giao dịch *
          </label>
          <input
            type="date"
            name="transaction_date"
            required
            value={formData.transaction_date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ghi chú
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Ghi chú về giao dịch..."
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : transaction ? 'Cập nhật' : 'Thêm'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
