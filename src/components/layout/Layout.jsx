import { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import MobileSidebar from './MobileSidebar'

export default function Layout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-700 dark:bg-gray-900">
      <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />
      <div className="flex">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <MobileSidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
