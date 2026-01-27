// Validate email
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Validate amount
export const isValidAmount = (amount) => {
  const num = parseFloat(amount)
  return !isNaN(num) && num > 0
}

// Validate required field
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  return value !== null && value !== undefined
}

// Validate date
export const isValidDate = (date) => {
  const d = new Date(date)
  return d instanceof Date && !isNaN(d)
}

// Validate password strength
export const validatePassword = (password) => {
  if (password.length < 6) {
    return { valid: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
  }
  return { valid: true, message: '' }
}

// Validate transaction form
export const validateTransaction = (data) => {
  const errors = {}

  if (!isRequired(data.amount)) {
    errors.amount = 'Số tiền là bắt buộc'
  } else if (!isValidAmount(data.amount)) {
    errors.amount = 'Số tiền không hợp lệ'
  }

  if (!isRequired(data.type)) {
    errors.type = 'Loại giao dịch là bắt buộc'
  }

  if (!isRequired(data.transaction_date)) {
    errors.transaction_date = 'Ngày giao dịch là bắt buộc'
  }

  return { isValid: Object.keys(errors).length === 0, errors }
}

// Validate account form
export const validateAccount = (data) => {
  const errors = {}

  if (!isRequired(data.name)) {
    errors.name = 'Tên tài khoản là bắt buộc'
  }

  if (!isRequired(data.type)) {
    errors.type = 'Loại tài khoản là bắt buộc'
  }

  return { isValid: Object.keys(errors).length === 0, errors }
}

// Validate category form
export const validateCategory = (data) => {
  const errors = {}

  if (!isRequired(data.name)) {
    errors.name = 'Tên danh mục là bắt buộc'
  }

  if (!isRequired(data.type)) {
    errors.type = 'Loại danh mục là bắt buộc'
  }

  return { isValid: Object.keys(errors).length === 0, errors }
}
