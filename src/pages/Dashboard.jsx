import { useAuth } from '../contexts/AuthContext'
import { useTotalBalance } from '../hooks/useAccounts'
import { useTransactions, useTransactionStats } from '../hooks/useTransactions'
import { getFirstDayOfMonth, getLastDayOfMonth, formatCurrency, formatDate } from '../utils/formatters'
import Layout from '../components/layout/Layout'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useAuth()
  const { data: totalBalance } = useTotalBalance()
  const { data: transactions } = useTransactions({})
  const { data: stats } = useTransactionStats(getFirstDayOfMonth(), getLastDayOfMonth())

  const recentTransactions = transactions?.slice(0, 5) || []

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Xin chào, {user?.user_metadata?.full_name || 'User'}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Chào mừng bạn đến với Finance Manager
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-3xl">💰</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Tổng thu nhập (tháng này)
                    </dt>
                    <dd className="text-lg font-semibold text-green-600">
                      {formatCurrency(stats?.income || 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-3xl">💸</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Tổng chi tiêu (tháng này)
                    </dt>
                    <dd className="text-lg font-semibold text-red-600">
                      {formatCurrency(stats?.expense || 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-3xl">💳</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Tổng số dư
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(totalBalance || 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-3xl">📊</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Giao dịch
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                      {transactions?.length || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Giao dịch gần đây
            </h2>
            <Link to="/transactions" className="text-primary-600 hover:text-primary-700 text-sm">
              Xem tất cả →
            </Link>
          </div>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="text-4xl mb-2">📝</p>
              <p>Chưa có giao dịch nào</p>
              <p className="text-sm mt-2">
                <Link to="/transactions" className="text-primary-600 hover:text-primary-700">
                  Bắt đầu thêm giao dịch đầu tiên của bạn
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map(transaction => (
                <div key={transaction.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className={`text-2xl`}>
                      {transaction.category?.icon || '💰'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.description || transaction.category?.name || 'Giao dịch'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(transaction.transaction_date)} • {transaction.account?.name || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className={`text-sm font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
