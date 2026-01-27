import { useState, useEffect } from 'react'
import Modal from '../common/Modal'

const ICONS = ['💰', '🎁', '📈', '💵', '🍔', '🚗', '🛍️', '🎮', '🏥', '📚', '🏠', '💡', '💸', '⚡', '🎯']
const COLORS = [
  '#10b981', '#059669', '#047857', '#065f46',
  '#ef4444', '#dc2626', '#b91c1c', '#991b1b',
  '#f59e0b', '#d97706', '#b45309', '#92400e',
  '#0ea5e9', '#0284c7', '#0369a1'
]

export default function CategoryForm({ isOpen, onClose, onSubmit, category, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    icon: '💰',
    color: '#10b981',
  })

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        type: category.type,
        icon: category.icon || '💰',
        color: category.color || '#10b981',
      })
    } else {
      setFormData({
        name: '',
        type: 'expense',
        icon: '💰',
        color: '#10b981',
      })
    }
  }, [category, isOpen])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={category ? 'Sửa danh mục' : 'Thêm danh mục'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên danh mục *
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Ăn uống"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loại *
          </label>
          <select
            name="type"
            required
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="income">Thu nhập</option>
            <option value="expense">Chi tiêu</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icon
          </label>
          <div className="grid grid-cols-10 gap-2">
            {ICONS.map(icon => (
              <button
                key={icon}
                type="button"
                onClick={() => setFormData({ ...formData, icon })}
                className={`p-2 text-2xl rounded hover:bg-gray-100 ${formData.icon === icon ? 'bg-primary-100 ring-2 ring-primary-500' : ''}`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Màu sắc
          </label>
          <div className="grid grid-cols-10 gap-2">
            {COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, color })}
                className={`w-8 h-8 rounded ${formData.color === color ? 'ring-2 ring-offset-2 ring-gray-900' : ''}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : category ? 'Cập nhật' : 'Thêm'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
