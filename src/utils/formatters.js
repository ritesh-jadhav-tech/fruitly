/**
 * Format a number as Indian currency (₹)
 */
export const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format a date string to readable format
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateStr))
}

/**
 * Format a date with time
 */
export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—'
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}

/**
 * Truncate text to a given length
 */
export const truncate = (str, length = 60) => {
  if (!str) return ''
  return str.length > length ? str.slice(0, length) + '…' : str
}

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Get initials from a name
 */
export const getInitials = (name = '') => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Calculate discount percentage
 */
export const discountPercent = (original, sale) => {
  if (!original || !sale) return 0
  return Math.round(((original - sale) / original) * 100)
}
