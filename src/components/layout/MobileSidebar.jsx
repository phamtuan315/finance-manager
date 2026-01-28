import { Link, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Giao dịch', href: '/transactions', icon: '💸' },
  { name: 'Tài khoản', href: '/accounts', icon: '💳' },
  { name: 'Danh mục', href: '/categories', icon: '🏷️' },
  { name: 'Ngân sách', href: '/budgets', icon: '💰' },
  { name: 'Mục tiêu', href: '/goals', icon: '🎯' },
  { name: 'Báo cáo', href: '/reports', icon: '📈' },
]

export default function MobileSidebar({ isOpen, onClose }) {
  const location = useLocation()

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-gray-500/30 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl animate-slide-in-left">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-4 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-2xl mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </>
  )
}
