// Check if ordering is allowed for a specific meal category
export const isOrderingClosed = (category) => {
  const now = new Date()
  const hour = now.getHours()
  
  if (!category) {
    // If no category specified, check if any ordering is allowed
    return hour >= 18 // After 6 PM, all ordering is closed
  }
  
  switch (category) {
    case 'Breakfast':
      return hour >= 8 // Breakfast ordering closes at 8 AM
    case 'Lunch':
      return hour >= 10 // Lunch ordering closes at 10 AM
    case 'Dinner':
      return hour >= 18 // Dinner ordering closes at 6 PM (18:00)
    default:
      return hour >= 18
  }
}

// Get ordering deadline message for a category
export const getOrderingDeadline = (category) => {
  switch (category) {
    case 'Breakfast':
      return 'Orders accepted before 8:00 AM'
    case 'Lunch':
      return 'Orders accepted before 10:00 AM'
    case 'Dinner':
      return 'Orders accepted before 6:00 PM'
    default:
      return 'Check ordering times'
  }
}

// Check if current time allows ordering any category
export const hasAvailableOrdering = () => {
  const now = new Date()
  const hour = now.getHours()
  return hour < 18 // Ordering available before 6 PM
}

// Get meal category icon
export const getMealIcon = (category) => {
  switch (category) {
    case 'Breakfast':
      return 'Breakfast'
    case 'Lunch':
      return 'Lunch'
    case 'Dinner':
      return 'Dinner'
    default:
      return 'Meal'
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
