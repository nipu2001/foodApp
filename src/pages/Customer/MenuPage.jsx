import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useOrders } from '../../contexts/OrdersContext'
import { useMenu } from '../../contexts/MenuContext'
import FoodCard from '../../components/FoodCard'
import CheckoutModal from '../../components/CheckoutModal'
import { isOrderingClosed, getOrderingDeadline, hasAvailableOrdering } from '../../utils/helpers'
import { FiShoppingCart, FiClock, FiAlertCircle, FiLoader } from 'react-icons/fi'
import { MdRestaurantMenu } from 'react-icons/md'

const MenuPage = () => {
  const { user } = useAuth()
  const { addOrder } = useOrders()
  const { menuItems, loading, getMenuByCategory } = useMenu()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [cart, setCart] = useState([])
  const [showCheckout, setShowCheckout] = useState(false)

  const categories = ['all', 'breakfast', 'lunch', 'dinner']

  const filteredItems = getMenuByCategory(selectedCategory)

  const handleOrder = (food) => {
    // Check if ordering is closed for this category
    if (isOrderingClosed(food.category)) {
      alert(`Sorry, ${food.category} ordering is closed. ${getOrderingDeadline(food.category)}`)
      return
    }
    
    const existingItem = cart.find((item) => item.id === food.id)
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      )
    } else {
      setCart([...cart, { ...food, quantity: 1 }])
    }
    setShowCheckout(true)
  }

  const handleConfirmOrder = async (orderDetails) => {
    try {
      // Create order first
      const orderData = {
        customer: user?.name || orderDetails.customerName,
        customerEmail: user?.email || 'guest@example.com',
        phone: orderDetails.phone,
        address: orderDetails.address,
        items: orderDetails.items,
        total: orderDetails.total,
        status: 'pending',
        paymentMethod: orderDetails.paymentMethod,
        paymentStatus: orderDetails.paymentMethod === 'cash' ? 'pending' : 'processing',
      }
      
      const orderResult = await addOrder(orderData)
      
      if (!orderResult.success) {
        alert('Failed to place order: ' + orderResult.message)
        return
      }

      // Process payment based on method
      let paymentResult = { success: true }
      
      if (orderDetails.paymentMethod === 'card') {
        // Process REAL payment with Stripe
        try {
          // Validate card details first
          await paymentService.processCardPayment(
            orderDetails.paymentDetails,
            orderDetails.total
          )

          // Process Stripe payment
          const stripeResult = await paymentService.processStripePayment({
            orderId: orderResult.orderId,
            amount: orderDetails.total,
            customerName: orderDetails.customerName,
            customerEmail: user?.email || 'guest@example.com',
            items: orderDetails.items,
          })

          if (!stripeResult.success) {
            alert(stripeResult.message || 'Payment failed')
            return
          }

          // Update payment status to completed
          await paymentService.updatePaymentStatus(
            orderResult.orderId,
            'completed',
            stripeResult.paymentIntentId
          )

          alert('✅ ' + stripeResult.message)
        } catch (error) {
          alert('Payment failed: ' + (error.message || 'Please try again'))
          return
        }
      } else if (orderDetails.paymentMethod === 'mobile_money') {
        // Mobile money payment
        try {
          const mmResult = await paymentService.processMobileMoneyPayment(
            orderDetails.paymentDetails.phoneNumber,
            orderDetails.total,
            orderDetails.paymentDetails.provider
          )
          alert(mmResult.message)
        } catch (error) {
          alert('Payment failed: ' + (error.message || 'Please try again'))
          return
        }
      }

      // Record payment in Firestore
      paymentResult = await paymentService.processPayment(
        orderResult.orderId,
        orderDetails.paymentMethod,
        {
          amount: orderDetails.total,
          customerEmail: user?.email || 'guest@example.com',
          customerName: user?.name || orderDetails.customerName,
          ...orderDetails.paymentDetails,
        }
      )

      if (paymentResult.success) {
        alert(paymentResult.message || 'Order placed successfully!')
        setCart([])
        setShowCheckout(false)
      } else {
        alert('Payment processing failed. Please contact support.')
      }
    } catch (error) {
      console.error('Order error:', error)
      alert('Failed to place order. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiLoader className="w-12 h-12 text-primary-600 dark:text-primary-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Ordering Information Banner */}
      {!hasAvailableOrdering() ? (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 mb-6 rounded-lg animate-slide-up">
          <div className="flex items-center">
            <FiClock className="w-8 h-8 mr-3 text-red-600 dark:text-red-400" />
            <div>
              <p className="font-bold text-red-800 dark:text-red-300">All Ordering Closed</p>
              <p className="text-red-700 dark:text-red-400">All meal ordering has closed for today. Please come back tomorrow!</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 mb-6 rounded-lg animate-slide-up">
          <div className="flex items-start">
            <FiAlertCircle className="w-6 h-6 mr-3 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div>
              <p className="font-bold text-blue-800 dark:text-blue-300 mb-2">Ordering Times</p>
              <div className="text-blue-700 dark:text-blue-400 text-sm space-y-1">
                <p className={isOrderingClosed('Breakfast') ? 'line-through opacity-60' : 'font-medium'}>
                  🌅 Breakfast: Before 8:00 AM {isOrderingClosed('Breakfast') ? '(Closed)' : '(Open)'}
                </p>
                <p className={isOrderingClosed('Lunch') ? 'line-through opacity-60' : 'font-medium'}>
                  🍱 Lunch: Before 10:00 AM {isOrderingClosed('Lunch') ? '(Closed)' : '(Open)'}
                </p>
                <p className={isOrderingClosed('Dinner') ? 'line-through opacity-60' : 'font-medium'}>
                  🍽️ Dinner: Before 6:00 PM {isOrderingClosed('Dinner') ? '(Closed)' : '(Open)'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Our Menu</h1>
        <p className="text-gray-600">Choose from our delicious selection of meals</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-soft'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-400 p-4 mb-6 rounded-lg animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiShoppingCart className="w-6 h-6 mr-3 text-primary-600 dark:text-primary-400" />
              <div>
                <p className="font-bold text-primary-800 dark:text-primary-300">
                  {cart.length} item(s) in cart
                </p>
                <p className="text-primary-700 dark:text-primary-400">Ready to checkout?</p>
              </div>
            </div>
            <button
              onClick={() => setShowCheckout(true)}
              className="btn-primary"
            >
              View Cart
            </button>
          </div>
        </div>
      )}

      {/* Menu Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((food) => (
          <FoodCard key={food.id} food={food} onOrder={handleOrder} />
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-20">
          <MdRestaurantMenu className="w-24 h-24 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
          <p className="text-xl text-gray-600 dark:text-gray-400">No items found in this category</p>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          cartItems={cart}
          onClose={() => setShowCheckout(false)}
          onConfirm={handleConfirmOrder}
        />
      )}
    </div>
  )
}

export default MenuPage
