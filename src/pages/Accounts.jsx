import { useState } from 'react'
import { useAccounts, useCreateAccount, useUpdateAccount, useDeleteAccount } from '../hooks/useAccounts'
import Layout from '../components/layout/Layout'
import AccountCard from '../components/accounts/AccountCard'
import AccountForm from '../components/accounts/AccountForm'

export default function Accounts() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)

  const { data: accounts, isLoading } = useAccounts()
  const createMutation = useCreateAccount()
  const updateMutation = useUpdateAccount()
  const deleteMutation = useDeleteAccount()

  const handleCreate = () => {
    setEditingAccount(null)
    setIsFormOpen(true)
  }

  const handleEdit = (account) => {
    setEditingAccount(account)
    setIsFormOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa tài khoản này?')) {
      await deleteMutation.mutateAsync(id)
    }
  }

  const handleSubmit = async (data) => {
    try {
      if (editingAccount) {
        await updateMutation.mutateAsync({ id: editingAccount.id, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      setIsFormOpen(false)
      setEditingAccount(null)
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
          <h1 className="text-3xl font-bold text-gray-900">Tài khoản</h1>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            + Thêm tài khoản
          </button>
        </div>

        {accounts && accounts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">💳</p>
            <p className="text-gray-600 mb-4">Chưa có tài khoản nào</p>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Tạo tài khoản đầu tiên
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts?.map(account => (
              <AccountCard
                key={account.id}
                account={account}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <AccountForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false)
            setEditingAccount(null)
          }}
          onSubmit={handleSubmit}
          account={editingAccount}
          loading={createMutation.isPending || updateMutation.isPending}
        />
      </div>
    </Layout>
  )
}
