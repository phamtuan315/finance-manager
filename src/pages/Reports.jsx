import { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout'
import IncomeExpenseChart from '../components/reports/IncomeExpenseChart'
import CategoryPieChart from '../components/reports/CategoryPieChart'
import TrendLineChart from '../components/reports/TrendLineChart'
import { useCategoryStats } from '../hooks/useTransactions'
import { supabase } from '../lib/supabase'
import { Download } from 'lucide-react'
import { formatCurrency } from '../utils/formatters'

export default function Reports() {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [monthlyData, setMonthlyData] = useState([])
  const [loading, setLoading] = useState(true)

  const startDate = `${selectedYear}-01-01`
  const endDate = `${selectedYear}-12-31`

  const { data: categoryStats } = useCategoryStats(startDate, endDate)

  useEffect(() => {
    fetchMonthlyData()
  }, [selectedYear])

  const fetchMonthlyData = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      const months = [
        'T1', 'T2', 'T3', 'T4', 'T5', 'T6',
        'T7', 'T8', 'T9', 'T10', 'T11', 'T12'
      ]

      const monthlyStats = await Promise.all(
        months.map(async (month, index) => {
          const monthNum = index + 1
          const startDate = `${selectedYear}-${String(monthNum).padStart(2, '0')}-01`
          const endDate = new Date(selectedYear, monthNum, 0).toISOString().split('T')[0]

          const { data: transactions } = await supabase
            .from('transactions')
            .select('type, amount')
            .eq('user_id', user.id)
            .gte('transaction_date', startDate)
            .lte('transaction_date', endDate)

          const income = transactions
            ?.filter(t => t.type === 'income')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0

          const expense = transactions
            ?.filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0

          return {
            month,
            income,
            expense,
            balance: income - expense,
          }
        })
      )

      setMonthlyData(monthlyStats)
    } catch (error) {
      console.error('Error fetching monthly data:', error)
    } finally {
      setLoading(false)
    }
  }

  const incomeCategories = categoryStats
    ?.filter(cat => cat.type === 'income')
    .map((cat, index, arr) => {
      const total = arr.reduce((sum, c) => sum + parseFloat(c.amount), 0)
      return {
        name: cat.name,
        value: parseFloat(cat.amount),
        color: cat.color,
        percentage: total > 0 ? (parseFloat(cat.amount) / total * 100).toFixed(1) : 0,
      }
    }) || []

  const expenseCategories = categoryStats
    ?.filter(cat => cat.type === 'expense')
    .map((cat, index, arr) => {
      const total = arr.reduce((sum, c) => sum + parseFloat(c.amount), 0)
      return {
        name: cat.name,
        value: parseFloat(cat.amount),
        color: cat.color,
        percentage: total > 0 ? (parseFloat(cat.amount) / total * 100).toFixed(1) : 0,
      }
    }) || []

  const totalIncome = monthlyData.reduce((sum, m) => sum + m.income, 0)
  const totalExpense = monthlyData.reduce((sum, m) => sum + m.expense, 0)
  const totalBalance = totalIncome - totalExpense

  const handleExport = () => {
    // Tạo CSV content
    let csv = 'Tháng,Thu nhập,Chi tiêu,Số dư\n'
    monthlyData.forEach(row => {
      csv += `${row.month},${row.income},${row.expense},${row.balance}\n`
    })

    // Download file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `bao-cao-tai-chinh-${selectedYear}.csv`
    link.click()
  }

  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i)

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Báo cáo tài chính</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Phân tích chi tiết thu chi của bạn</p>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.map(year => (
                <option key={year} value={year}>
                  Năm {year}
                </option>
              ))}
            </select>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tổng thu nhập</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tổng chi tiêu</p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpense)}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Số dư</p>
            <p className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
              {formatCurrency(totalBalance)}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <IncomeExpenseChart data={monthlyData} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CategoryPieChart data={incomeCategories} type="income" />
              <CategoryPieChart data={expenseCategories} type="expense" />
            </div>

            <TrendLineChart data={monthlyData} />
          </div>
        )}
      </div>
    </Layout>
  )
}
