import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '../../utils/formatters'

export default function IncomeExpenseChart({ data }) {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{payload[0].payload.month}</p>
          <p className="text-sm text-green-600">
            Thu: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-sm text-red-600">
            Chi: {formatCurrency(payload[1].value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Thu chi theo tháng
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="income" name="Thu nhập" fill="#10b981" />
          <Bar dataKey="expense" name="Chi tiêu" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
