import { useState } from 'react'
import { useTransactions, useCreateTransaction, useUpdateTransaction, useDeleteTransaction } from '../hooks/useTransactions'
import Layout from '../components/layout/Layout'
import TransactionForm from '../components/transactions/TransactionForm'
import TransactionFilter from '../components/transactions/TransactionFilter'
import { formatCurrency, formatDate } from '../utils/formatters'
import { getFirstDayOfMonth, getTodayDate } from '../utils/formatters'

export default function Transactions() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [filters, setFilters] = useState({
    startDate: getFirstDayOfMonth(),
    endDate: getTodayDate(),
  })

  const { data: transactions, isLoading } = useTransactions(filters)
  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()
  const deleteMutation = useDeleteTransaction()

  const handleCreate = () => {
    setEditingTransaction(null)
    setIsFormOpen(true)
  }

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction)
    setIsFormOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa giao dịch này?')) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch (error) {
        console.error('Error:', error)
        alert('Có lỗi xảy ra: ' + error.message)
      }
    }
  }

  const handleSubmit = async (data) => {
    try {
      if (editingTransaction) {
        await updateMutation.mutateAsync({ id: editingTransaction.id, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      setIsFormOpen(false)
      setEditingTransaction(null)
    } catch (error) {
      console.error('Error:', error)
      alert('Có lỗi xảy ra: ' + error.message)
    }
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Giao dịch</h1>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            + Thêm giao dịch
          </button>
        </div>

        <TransactionFilter filters={filters} onFilterChange={setFilters} />

        {transactions && transactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">📝</p>
            <p className="text-gray-600 mb-4">Chưa có giao dịch nào</p>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Thêm giao dịch đầu tiên
            </button>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô tả
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tài khoản
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions?.map(transaction => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(transaction.transaction_date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                        {transaction.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.category ? (
                        <span>
                          {transaction.category.icon} {transaction.category.name}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.account?.name || '-'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <TransactionForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false)
            setEditingTransaction(null)
          }}
          onSubmit={handleSubmit}
          transaction={editingTransaction}
          loading={createMutation.isPending || updateMutation.isPending}
        />
      </div>
    </Layout>
  )
}
