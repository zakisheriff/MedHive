// Format numbers with K, M, B suffixes
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Format percentage change with + or - sign
export const formatPercentage = (value) => {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

// Format date to readable format
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Get risk level class
export const getRiskClass = (level) => {
  const classes = {
    LOW: 'risk-low',
    MODERATE: 'risk-moderate',
    HIGH: 'risk-high',
    CRITICAL: 'risk-critical'
  }
  return classes[level] || 'risk-low'
}

// Get risk color for charts
export const getRiskColor = (level) => {
  const colors = {
    LOW: 'rgba(0, 0, 0, 0.3)',
    MODERATE: '#dca349',
    HIGH: '#b8873d',
    CRITICAL: '#b8573d'
  }
  return colors[level] || 'rgba(0, 0, 0, 0.3)'
}

// Format time ago
export const timeAgo = (date) => {
  const now = new Date()
  const then = new Date(date)
  const diff = Math.floor((now - then) / 1000) // seconds
  
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  return `${Math.floor(diff / 86400)} days ago`
}
