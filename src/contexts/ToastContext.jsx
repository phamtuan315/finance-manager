import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react'

const ToastContext = createContext({})

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
}

const bgColors = {
  success: 'bg-green-50 dark:bg-green-900/20 border-green-500',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-500',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500',
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-500',
}

const textColors = {
  success: 'text-green-800 dark:text-green-200',
  error: 'text-red-800 dark:text-red-200',
  warning: 'text-yellow-800 dark:text-yellow-200',
  info: 'text-blue-800 dark:text-blue-200',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
      }, duration)
    }
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const value = {
    success: (message, duration) => showToast(message, 'success', duration),
    error: (message, duration) => showToast(message, 'error', duration),
    warning: (message, duration) => showToast(message, 'warning', duration),
    info: (message, duration) => showToast(message, 'info', duration),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map(toast => {
          const Icon = icons[toast.type]
          return (
            <div
              key={toast.id}
              className={`flex items-center gap-3 min-w-[300px] max-w-[500px] p-4 rounded-lg border-l-4 shadow-lg ${bgColors[toast.type]} animate-slide-in`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${textColors[toast.type]}`} />
              <p className={`flex-1 text-sm font-medium ${textColors[toast.type]}`}>
                {toast.message}
              </p>
              <button
                onClick={() => removeToast(toast.id)}
                className={`flex-shrink-0 hover:opacity-70 transition-opacity ${textColors[toast.type]}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
