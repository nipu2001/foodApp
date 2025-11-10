import { useState } from 'react'
import { useOrders } from '../../contexts/OrdersContext'
import { formatCurrency, formatDateTime } from '../../utils/helpers'
import { FiPackage, FiClock, FiCheckCircle, FiCheck } from 'react-icons/fi'
import { GiCook } from 'react-icons/gi'

const Orders = () => {
  const { orders, updateOrderStatus, getOrderStats } = useOrders()
  const [filter, setFilter] = useState('all')
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleStatusChange = async (orderId, newStatus) => {
    const result = await updateOrderStatus(orderId, newStatus)
    if (result.success) {
      setSuccessMessage(`Order ${orderId} updated to ${newStatus}`)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } else {
      alert('Failed to update order status: ' + result.message)
    }
  }

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((order) => order.status === filter)

  const statusCounts = getOrderStats()

  return (
    <div className="animate-fade-in">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed z-50 top-24 right-6 animate-slide-up">
          <div className="flex items-center px-6 py-4 space-x-3 text-white bg-green-500 rounded-xl shadow-soft-lg">
            <FiCheck className="w-6 h-6" />
            <div>
              <p className="font-bold">Status Updated!</p>
              <p className="text-sm text-green-100">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-gray-800">Orders Management</h1>
        <p className="text-gray-600">View and manage all customer orders</p>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-3 mb-8">
        {['all', 'pending', 'preparing', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              filter === status
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-soft'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden card dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-left text-gray-700 dark:text-gray-300">Order ID</th>
                <th className="px-6 py-4 text-sm font-bold text-left text-gray-700 dark:text-gray-300">Customer</th>
                <th className="px-6 py-4 text-sm font-bold text-left text-gray-700 dark:text-gray-300">Items</th>
                <th className="px-6 py-4 text-sm font-bold text-left text-gray-700 dark:text-gray-300">Total</th>
                <th className="px-6 py-4 text-sm font-bold text-left text-gray-700 dark:text-gray-300">Time</th>
                <th className="px-6 py-4 text-sm font-bold text-left text-gray-700 dark:text-gray-300">Status</th>
                <th className="px-6 py-4 text-sm font-bold text-left text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-800 dark:text-white">{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{order.customer}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{order.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="object-cover w-12 h-12 rounded-lg"
                          />
                          <div className="text-sm">
                            <p className="font-medium text-gray-800 dark:text-white">
                              {item.quantity}x {item.name}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              {formatCurrency(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-primary-600 dark:text-primary-400">
                      {formatCurrency(order.total)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDateTime(new Date(order.orderTime))}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge badge-${order.status}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="px-3 py-2 text-sm font-medium text-gray-800 bg-white border-2 border-gray-200 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-primary-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="py-16 text-center">
            <FiPackage className="w-24 h-24 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
            <p className="mb-2 text-xl text-gray-600 dark:text-gray-400">No orders found</p>
            <p className="text-gray-500">
              {filter === 'all'
                ? 'No orders have been placed yet'
                : `No ${filter} orders at the moment`}
            </p>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 mt-8 sm:grid-cols-3">
        <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-gray-700 dark:text-gray-300">Pending Orders</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{statusCounts.pending}</p>
            </div>
            <FiClock className="w-16 h-16 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-gray-700 dark:text-gray-300">Preparing</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{statusCounts.preparing}</p>
            </div>
            <GiCook className="w-16 h-16 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-gray-700 dark:text-gray-300">Completed</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{statusCounts.completed}</p>
            </div>
            <FiCheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Orders
