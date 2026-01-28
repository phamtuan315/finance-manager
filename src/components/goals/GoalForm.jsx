import { useState, useEffect } from 'react'

export default function GoalForm({ goal, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: goal?.name || '',
    target_amount: goal?.target_amount || '',
    deadline: goal?.deadline || '',
  })

  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name || '',
        target_amount: goal.target_amount || '',
        deadline: goal.deadline || '',
      })
    }
  }, [goal])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      target_amount: parseFloat(formData.target_amount),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tên mục tiêu
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ví dụ: Mua xe máy, Du lịch Đà Lạt..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Số tiền mục tiêu (VND)
        </label>
        <input
          type="number"
          name="target_amount"
          value={formData.target_amount}
          onChange={handleChange}
          required
          min="0"
          step="100000"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập số tiền mục tiêu"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Thời hạn (Tùy chọn)
        </label>
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          {goal ? 'Cập nhật' : 'Tạo mục tiêu'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
        >
          Hủy
        </button>
      </div>
    </form>
  )
}
