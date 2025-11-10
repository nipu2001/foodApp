import { formatCurrency, formatDateTime } from '../utils/helpers'
import { FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import { GiCook } from 'react-icons/gi'

const OrderCard = ({ order }) => {
  const statusColors = {
    pending: 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
    preparing: 'border-blue-400 bg-blue-50 dark:bg-blue-900/20',
    completed: 'border-green-400 bg-green-50 dark:bg-green-900/20',
    cancelled: 'border-red-400 bg-red-50 dark:bg-red-900/20',
  }

  const StatusIcon = ({ status }) => {
    const iconClass = "w-6 h-6"
    switch(status) {
      case 'pending': return <FiClock className={`${iconClass} text-yellow-600 dark:text-yellow-400`} />
      case 'preparing': return <GiCook className={`${iconClass} text-blue-600 dark:text-blue-400`} />
      case 'completed': return <FiCheckCircle className={`${iconClass} text-green-600 dark:text-green-400`} />
      case 'cancelled': return <FiXCircle className={`${iconClass} text-red-600 dark:text-red-400`} />
      default: return null
    }
  }

  return (
    <div className={`card border-l-4 ${statusColors[order.status]} animate-slide-up`}>
      <div className="flex flex-col space-y-4">
        {/* Order Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <StatusIcon status={order.status} />
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Order #{order.id}</h3>
            <span className={`badge badge-${order.status}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {formatCurrency(order.total)}
            </p>
          </div>
        </div>

        {/* Order Items with Images */}
        <div className="space-y-3">
          {order.items && order.items.length > 0 ? (
            order.items.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                {/* Item Image */}
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                
                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                    {item.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Quantity: <span className="font-medium">{item.quantity}</span>
                  </p>
                  <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                    {formatCurrency(item.price)}
                  </p>
                </div>

                {/* Item Subtotal */}
                <div className="text-right flex-shrink-0">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Subtotal</p>
                  <p className="font-bold text-gray-800 dark:text-gray-200">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                No items in this order
              </p>
            </div>
          )}
        </div>

        {/* Order Time */}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formatDateTime(order.orderTime)}
        </p>

        {/* Progress Bar */}
        {order.status !== 'cancelled' && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
              <span className={order.status === 'pending' ? 'font-bold text-yellow-600 dark:text-yellow-400' : ''}>
                Pending
              </span>
              <span className={order.status === 'preparing' ? 'font-bold text-blue-600 dark:text-blue-400' : ''}>
                Preparing
              </span>
              <span className={order.status === 'completed' ? 'font-bold text-green-600 dark:text-green-400' : ''}>
                Completed
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  order.status === 'pending'
                    ? 'w-1/3 bg-yellow-400'
                    : order.status === 'preparing'
                    ? 'w-2/3 bg-blue-400'
                    : 'w-full bg-green-400'
                }`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderCard
