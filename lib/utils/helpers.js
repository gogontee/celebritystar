// helpers// Utility function for conditional class names
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Export other helper functions
export const formatVotes = (votes) => {
  if (votes >= 1000000) {
    return (votes / 1000000).toFixed(1) + 'M'
  }
  if (votes >= 1000) {
    return (votes / 1000).toFixed(1) + 'K'
  }
  return votes.toString()
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount)
}

export const isValidUrl = (string) => {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}