// Check if ordering is allowed for a specific meal category
export const isOrderingClosed = (category) => {
  const now = new Date()
  const hour = now.getHours()
  
  if (!category) {
    // If no category specified, check if any ordering is allowed
    return hour >= 23 // After 11 PM, all ordering is closed
  }

  const cat = String(category).toLowerCase()

  switch (cat) {
    case 'breakfast':
      return hour >= 11 // Breakfast ordering closes at 11 AM
    case 'lunch':
      return hour >= 16 // Lunch ordering closes at 4 PM (16:00)
    case 'dinner':
      return hour >= 23 // Dinner ordering closes at 11 PM (23:00)
    default:
      return hour >= 23
  }
}

// Get ordering deadline message for a category
export const getOrderingDeadline = (category) => {
  const cat = String(category || '').toLowerCase()
  switch (cat) {
    case 'breakfast':
      return 'Orders accepted before 11:00 AM'
    case 'lunch':
      return 'Orders accepted before 4:00 PM'
    case 'dinner':
      return 'Orders accepted before 11:00 PM'
    default:
      return 'Check ordering times'
  }
}

// Check if current time allows ordering any category
export const hasAvailableOrdering = () => {
  // ordering is available if any category is still open
  return !isOrderingClosed('breakfast') || !isOrderingClosed('lunch') || !isOrderingClosed('dinner')
}

// Get meal category icon
export const getMealIcon = (category) => {
  const cat = String(category || '').toLowerCase()
  switch (cat) {
    case 'breakfast':
      return '🌅'
    case 'lunch':
      return '🍱'
    case 'dinner':
      return '🍽️'
    default:
      return '🍽️'
  }
}

// Format currency
export const formatCurrency = (amount) => {
  return `$${amount.toFixed(2)}`
}

// Format date and time
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Get order status color
export const getOrderStatusBadge = (status) => {
  const badges = {
    pending: 'badge-pending',
    preparing: 'badge-preparing',
    completed: 'badge-completed',
    cancelled: 'badge-cancelled',
  }
  return badges[status.toLowerCase()] || 'badge-pending'
}

// Calculate order total
export const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}
