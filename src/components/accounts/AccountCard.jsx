import { formatCurrency } from '../../utils/formatters'
import { ACCOUNT_TYPE_OPTIONS } from '../../utils/constants'

export default function AccountCard({ account, onEdit, onDelete }) {
  const accountType = ACCOUNT_TYPE_OPTIONS.find(t => t.value === account.type)

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-4xl">{accountType?.icon || '💰'}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {account.name}
            </h3>
            <p className="text-sm text-gray-500">{accountType?.label}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(account)}
            className="text-blue-600 hover:text-blue-800"
          >
            Sửa
          </button>
          <button
            onClick={() => onDelete(account.id)}
            className="text-red-600 hover:text-red-800"
          >
            Xóa
          </button>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">
          {formatCurrency(account.balance)}
        </p>
      </div>
    </div>
  )
}
