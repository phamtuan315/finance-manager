import { useState } from 'react'
import { useBudgetProgress, useCreateBudget, useUpdateBudget, useDeleteBudget } from '../hooks/useBudgets'
import Layout from '../components/layout/Layout'
import Modal from '../components/common/Modal'
import BudgetForm from '../components/budgets/BudgetForm'
import BudgetCard from '../components/budgets/BudgetCard'
import { Plus } from 'lucide-react'

export default function Budgets() {
  const currentDate = new Date()
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)

  const { data: budgets, isLoading } = useBudgetProgress(selectedYear, selectedMonth)
  const createMutation = useCreateBudget()
  const updateMutation = useUpdateBudget()
  const deleteMutation = useDeleteBudget()

  const handleSubmit = async (data) => {
    try {
      if (editingBudget) {
        await updateMutation.mutateAsync({ id: editingBudget.id, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      setIsFormOpen(false)
      setEditingBudget(null)
    } catch (error) {
      console.error('Error saving budget:', error)
      alert('Có lỗi xảy ra khi lưu ngân sách')
    }
  }

  const handleEdit = (budget) => {
    setEditingBudget(budget)
    setIsFormOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa ngân sách này?')) return

    try {
      await deleteMutation.mutateAsync(id)
    } catch (error) {
      console.error('Error deleting budget:', error)
      alert('Có lỗi xảy ra khi xóa ngân sách')
    }
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingBudget(null)
  }

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `Tháng ${i + 1}`,
  }))

  const years = Array.from({ length: 10 }, (_, i) => currentDate.getFullYear() - 5 + i)

  const totalBudget = budgets?.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0) || 0
  const totalSpent = budgets?.reduce((sum, b) => sum + parseFloat(b.spent || 0), 0) || 0
  const totalRemaining = totalBudget - totalSpent

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Ngân sách</h1>
            <p className="text-gray-600 mt-1">Theo dõi và kiểm soát chi tiêu của bạn</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Thêm ngân sách
          </button>
        </div>

        <div className="flex gap-4 items-center">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {months.map(month => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {years.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Tổng ngân sách</p>
            <p className="text-2xl font-bold text-gray-900">
              {totalBudget.toLocaleString('vi-VN')} ₫
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Đã chi tiêu</p>
            <p className="text-2xl font-bold text-orange-600">
              {totalSpent.toLocaleString('vi-VN')} ₫
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Còn lại</p>
            <p className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalRemaining.toLocaleString('vi-VN')} ₫
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : budgets && budgets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-4xl mb-4">💰</p>
            <p className="text-gray-600 mb-2">Chưa có ngân sách nào</p>
            <p className="text-sm text-gray-500">Tạo ngân sách để theo dõi chi tiêu của bạn</p>
          </div>
        )}

        <Modal
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          title={editingBudget ? 'Chỉnh sửa ngân sách' : 'Thêm ngân sách mới'}
        >
          <BudgetForm
            budget={editingBudget}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
          />
        </Modal>
      </div>
    </Layout>
  )
}
