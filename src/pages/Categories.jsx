import { useState } from 'react'
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../hooks/useCategories'
import Layout from '../components/layout/Layout'
import CategoryForm from '../components/categories/CategoryForm'

export default function Categories() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [filterType, setFilterType] = useState(null)

  const { data: categories, isLoading } = useCategories(filterType)
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const deleteMutation = useDeleteCategory()

  const handleCreate = () => {
    setEditingCategory(null)
    setIsFormOpen(true)
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setIsFormOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      await deleteMutation.mutateAsync(id)
    }
  }

  const handleSubmit = async (data) => {
    try {
      if (editingCategory) {
        await updateMutation.mutateAsync({ id: editingCategory.id, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      setIsFormOpen(false)
      setEditingCategory(null)
    } catch (error) {
      console.error('Error:', error)
      alert('Có lỗi xảy ra: ' + error.message)
    }
  }

  const incomeCategories = categories?.filter(c => c.type === 'income') || []
  const expenseCategories = categories?.filter(c => c.type === 'expense') || []

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Danh mục</h1>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            + Thêm danh mục
          </button>
        </div>

        <div className="mb-6 flex space-x-2">
          <button
            onClick={() => setFilterType(null)}
            className={`px-4 py-2 rounded-md ${!filterType ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border'}`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilterType('income')}
            className={`px-4 py-2 rounded-md ${filterType === 'income' ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border'}`}
          >
            Thu nhập
          </button>
          <button
            onClick={() => setFilterType('expense')}
            className={`px-4 py-2 rounded-md ${filterType === 'expense' ? 'bg-red-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border'}`}
          >
            Chi tiêu
          </button>
        </div>

        {!filterType || filterType === 'income' ? (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Thu nhập</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {incomeCategories.map(category => (
                <div
                  key={category.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
                  style={{ borderLeft: `4px solid ${category.color}` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{category.icon}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">{category.name}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {!filterType || filterType === 'expense' ? (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Chi tiêu</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {expenseCategories.map(category => (
                <div
                  key={category.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
                  style={{ borderLeft: `4px solid ${category.color}` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{category.icon}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">{category.name}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <CategoryForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false)
            setEditingCategory(null)
          }}
          onSubmit={handleSubmit}
          category={editingCategory}
          loading={createMutation.isPending || updateMutation.isPending}
        />
      </div>
    </Layout>
  )
}
