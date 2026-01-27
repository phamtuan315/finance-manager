import { format, parseISO } from 'date-fns'
import { vi } from 'date-fns/locale'

// Format currency to VND
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount || 0)
}

// Format currency without symbol
export const formatNumber = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount || 0)
}

// Format date to DD/MM/YYYY
export const formatDate = (date) => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'dd/MM/yyyy', { locale: vi })
}

// Format date to full format
export const formatDateLong = (date) => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'dd MMMM yyyy', { locale: vi })
}

// Format date for input (YYYY-MM-DD)
export const formatDateInput = (date) => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'yyyy-MM-dd')
}

// Get today's date in YYYY-MM-DD format
export const getTodayDate = () => {
  return format(new Date(), 'yyyy-MM-dd')
}

// Get first day of current month
export const getFirstDayOfMonth = () => {
  const now = new Date()
  return format(new Date(now.getFullYear(), now.getMonth(), 1), 'yyyy-MM-dd')
}

// Get last day of current month
export const getLastDayOfMonth = () => {
  const now = new Date()
  return format(new Date(now.getFullYear(), now.getMonth() + 1, 0), 'yyyy-MM-dd')
}

// Shorten text
export const truncate = (text, length = 50) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}
