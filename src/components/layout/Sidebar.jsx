import { Link, useLocation } from 'react-router-dom'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Giao dịch', href: '/transactions', icon: '💸' },
  { name: 'Tài khoản', href: '/accounts', icon: '💳' },
  { name: 'Danh mục', href: '/categories', icon: '🏷️' },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <div className="w-64 bg-white shadow-lg min-h-screen">
      <nav className="mt-8 px-4">
        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
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
  )
}
