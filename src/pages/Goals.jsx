import { useState } from 'react'
import { useGoals, useGoalStats, useCreateGoal, useUpdateGoal, useDeleteGoal, useAddContribution } from '../hooks/useGoals'
import Layout from '../components/layout/Layout'
import Modal from '../components/common/Modal'
import GoalForm from '../components/goals/GoalForm'
import GoalCard from '../components/goals/GoalCard'
import { Plus, Target, TrendingUp, CheckCircle2 } from 'lucide-react'
import { formatCurrency } from '../utils/formatters'

export default function Goals() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [statusFilter, setStatusFilter] = useState(null)

  const { data: goals, isLoading } = useGoals(statusFilter)
  const { data: stats } = useGoalStats()
  const createMutation = useCreateGoal()
  const updateMutation = useUpdateGoal()
  const deleteMutation = useDeleteGoal()
  const addContributionMutation = useAddContribution()

  const handleSubmit = async (data) => {
    try {
      if (editingGoal) {
        await updateMutation.mutateAsync({ id: editingGoal.id, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      setIsFormOpen(false)
      setEditingGoal(null)
    } catch (error) {
      console.error('Error saving goal:', error)
      alert('Có lỗi xảy ra khi lưu mục tiêu')
    }
  }

  const handleEdit = (goal) => {
    setEditingGoal(goal)
    setIsFormOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa mục tiêu này?')) return

    try {
      await deleteMutation.mutateAsync(id)
    } catch (error) {
      console.error('Error deleting goal:', error)
      alert('Có lỗi xảy ra khi xóa mục tiêu')
    }
  }

  const handleAddContribution = async (id, amount) => {
    try {
      await addContributionMutation.mutateAsync({ id, amount })
    } catch (error) {
      console.error('Error adding contribution:', error)
      alert('Có lỗi xảy ra khi thêm tiền tiết kiệm')
    }
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingGoal(null)
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mục tiêu tiết kiệm</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Đặt và theo dõi mục tiêu tài chính của bạn</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Tạo mục tiêu
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tổng mục tiêu</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalGoals}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Đang thực hiện</p>
              </div>
              <p className="text-2xl font-bold text-orange-600">{stats.activeGoals}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Đã hoàn thành</p>
              </div>
              <p className="text-2xl font-bold text-green-600">{stats.completedGoals}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tiến độ chung</p>
              <p className="text-2xl font-bold text-blue-600 mb-2">
                {stats.overallProgress.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatCurrency(stats.totalSaved)} / {formatCurrency(stats.totalTarget)}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter(null)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              statusFilter === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              statusFilter === 'active'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
            }`}
          >
            Đang thực hiện
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              statusFilter === 'completed'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
            }`}
          >
            Đã hoàn thành
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : goals && goals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddContribution={handleAddContribution}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-4xl mb-4">🎯</p>
            <p className="text-gray-600 dark:text-gray-400 mb-2">Chưa có mục tiêu nào</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tạo mục tiêu để bắt đầu tiết kiệm</p>
          </div>
        )}

        <Modal
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          title={editingGoal ? 'Chỉnh sửa mục tiêu' : 'Tạo mục tiêu mới'}
        >
          <GoalForm
            goal={editingGoal}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
          />
        </Modal>
      </div>
    </Layout>
  )
}
