import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useRatings } from '../../contexts/RatingsContext'
import { useOrders } from '../../contexts/OrdersContext'
import OrderCard from '../../components/OrderCard'
import RatingPopup from '../../components/RatingPopup'
import { FiStar, FiPackage, FiCheck } from 'react-icons/fi'

const MyOrdersPage = () => {
  const { user } = useAuth()
  const { addRating, getRatingByOrderId } = useRatings()
  const { orders, getOrdersByCustomer } = useOrders()
  
  // Get orders for current user
  const userOrders = user?.email ? getOrdersByCustomer(user.email) : orders

  const [showRating, setShowRating] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filter, setFilter] = useState('all')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleRateOrder = (order) => {
    setSelectedOrder(order)
    setShowRating(true)
  }

  const handleSubmitRating = async (ratingData) => {
    // Extract food item names from the order
    const foodItems = selectedOrder.items.map(item => item.name)
    
    const result = await addRating({
      orderId: ratingData.orderId,
      foodItems: foodItems,
      customer: user?.name || 'Guest',
      customerEmail: user?.email || '',
      rating: ratingData.rating,
      comment: ratingData.comment,
    })
    
    if (result.success) {
      setShowRating(false)
      setSelectedOrder(null)
      setShowSuccess(true)
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    } else {
      alert('Failed to submit rating: ' + result.message)
    }
  }

  const filteredOrders =
    filter === 'all'
      ? userOrders
      : userOrders.filter((order) => order.status === filter)

  return (
    <div className="max-w-5xl px-4 py-8 mx-auto sm:px-6 lg:px-8 animate-fade-in">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-24 right-6 z-50 animate-slide-up">
          <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-soft-lg flex items-center space-x-3">
            <FiCheck className="w-6 h-6" />
            <div>
              <p className="font-bold">Rating Submitted!</p>
              <p className="text-sm text-green-100">Thank you for your feedback</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-gray-800 dark:text-white">My Orders</h1>
        <p className="text-gray-600 dark:text-gray-400">Track and manage your orders</p>
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
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const existingRating = getRatingByOrderId(order.id)
          
          return (
            <div key={order.id} className="relative">
              <OrderCard order={order} />
              {order.status === 'completed' && (
                <>
                  {existingRating ? (
                    <div className="absolute flex items-center px-4 py-2 space-x-2 font-semibold text-white transition-all duration-200 bg-green-500 rounded-lg top-6 right-6">
                      <FiCheck className="w-5 h-5" />
                      <span>Rated {existingRating.rating} ★</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRateOrder(order)}
                      className="absolute flex items-center px-4 py-2 space-x-2 font-semibold text-white transition-all duration-200 bg-yellow-400 rounded-lg top-6 right-6 hover:bg-yellow-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <FiStar className="w-5 h-5" />
                      <span>Rate Order</span>
                    </button>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="py-20 text-center card">
          <FiPackage className="w-24 h-24 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
          <p className="mb-2 text-xl text-gray-600 dark:text-gray-400">No orders found</p>
          <p className="text-gray-500">
            {filter === 'all'
              ? 'Start ordering delicious meals!'
              : `No ${filter} orders at the moment`}
          </p>
        </div>
      )}

      {/* Rating Popup */}
      {showRating && selectedOrder && (
        <RatingPopup
          order={selectedOrder}
          onClose={() => setShowRating(false)}
          onSubmit={handleSubmitRating}
        />
      )}
    </div>
  )
}

export default MyOrdersPage
