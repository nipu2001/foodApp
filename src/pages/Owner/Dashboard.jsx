import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useRatings } from '../../contexts/RatingsContext'
import { useOrders } from '../../contexts/OrdersContext'
import { useMenu } from '../../contexts/MenuContext'
import { formatCurrency } from '../../utils/helpers'
import { 
  FiShoppingCart, 
  FiDollarSign, 
  FiStar, 
  FiClock,
  FiTrendingUp,
  FiTrendingDown,
  FiUsers,
  FiMessageSquare,
  FiGrid,
  FiPackage,
  FiBarChart2,
  FiEdit,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi'
import { 
  MdRestaurantMenu, 
  MdOutlineRateReview,
  MdDashboard 
} from 'react-icons/md'
import { IoRestaurantOutline } from 'react-icons/io5'

const Dashboard = () => {
  const { user } = useAuth()
  const { getAverageRating, ratings } = useRatings()
  const { orders, getOrderStats } = useOrders()
  const { menuItems } = useMenu()
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const overallRating = getAverageRating()
  const orderStats = getOrderStats()

  // Calculate real-time statistics
  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const completedOrders = orders.filter(o => o.status === 'completed').length
  
  // Calculate today's revenue
  const today = new Date().toDateString()
  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.orderTime).toDateString()
    return orderDate === today
  })
  const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.total || 0), 0)
  
  // Calculate total revenue
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
  
  // Calculate item popularity
  const itemStats = {}
  orders.forEach(order => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach(item => {
        if (!itemStats[item.name]) {
          itemStats[item.name] = { count: 0, revenue: 0, name: item.name }
        }
        itemStats[item.name].count += item.quantity || 1
        itemStats[item.name].revenue += (item.price || 0) * (item.quantity || 1)
      })
    }
  })
  
  // Get top selling items
  const topItems = Object.values(itemStats)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)

  // Get recent orders (last 3)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime))
    .slice(0, 3)

  // Get unique customers count
  const uniqueCustomers = new Set(orders.map(o => o.customerEmail)).size

  const stats = [
    { 
      title: 'Total Orders', 
      value: totalOrders.toString(), 
      Icon: FiShoppingCart, 
      color: 'from-blue-400 to-blue-600', 
      trend: completedOrders > 0 ? `${completedOrders} completed` : 'No orders yet',
      trendUp: completedOrders > 0 
    },
    { 
      title: 'Revenue Today', 
      value: formatCurrency(todayRevenue), 
      Icon: FiDollarSign, 
      color: 'from-green-400 to-green-600', 
      trend: `${formatCurrency(totalRevenue)} total`,
      trendUp: todayRevenue > 0 
    },
    { 
      title: 'Menu Items', 
      value: menuItems.length.toString(), 
      Icon: MdRestaurantMenu, 
      color: 'from-orange-400 to-orange-600', 
      trend: menuItems.length > 0 ? 'Active items' : 'Add items',
      trendUp: menuItems.length > 0 
    },
    { 
      title: 'Avg Rating', 
      value: overallRating, 
      Icon: FiStar, 
      color: 'from-yellow-400 to-yellow-600', 
      trend: `${ratings.length} reviews`,
      trendUp: parseFloat(overallRating) >= 4.0 
    },
  ]

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="flex items-center mb-2 text-4xl font-bold text-gray-800 dark:text-white">
              <MdDashboard className="w-10 h-10 mr-3 text-primary-600 dark:text-primary-400" />
              Welcome back, {user?.name || 'Admin'}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Here's what's happening with your restaurant today.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="px-6 py-3 text-white shadow-md bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl">
              <div className="flex items-center text-sm font-medium">
                <FiClock className="w-4 h-4 mr-2" />
                Current Time
              </div>
              <div className="text-2xl font-bold">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-xs opacity-90">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.Icon
          return (
            <div
              key={index}
              className="overflow-hidden transition-transform duration-300 bg-white card dark:bg-gray-800 animate-slide-up hover:transform hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.trendUp ? (
                        <FiTrendingUp className="w-4 h-4 mr-1 text-green-600 dark:text-green-400" />
                      ) : (
                        <FiTrendingDown className="w-4 h-4 mr-1 text-gray-600 dark:text-gray-400" />
                      )}
                      <span className={`text-sm font-semibold ${stat.trendUp ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="card dark:bg-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Recent Orders</h2>
            <Link 
              to="/owner/orders" 
              className="flex items-center text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => {
                const getOrderIcon = (status) => {
                  switch(status) {
                    case 'completed': return FiCheckCircle
                    case 'preparing': return IoRestaurantOutline
                    default: return FiClock
                  }
                }
                const OrderIcon = getOrderIcon(order.status)
                const itemsText = order.items && order.items.length > 0
                  ? order.items.map(item => `${item.name} x${item.quantity}`).join(', ')
                  : 'No items'
                
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 transition-all duration-200 cursor-pointer bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <div className="flex items-center flex-1 space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        order.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30' :
                        order.status === 'preparing' ? 'bg-blue-100 dark:bg-blue-900/30' :
                        'bg-yellow-100 dark:bg-yellow-900/30'
                      }`}>
                        <OrderIcon className={`w-5 h-5 ${
                          order.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                          order.status === 'preparing' ? 'text-blue-600 dark:text-blue-400' :
                          'text-yellow-600 dark:text-yellow-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-1 space-x-2">
                          <span className="font-bold text-gray-800 dark:text-white">#{order.id.substring(0, 8)}</span>
                          <span className={`badge badge-${order.status}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">{order.customer}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">{itemsText}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary-600 dark:text-primary-400">{formatCurrency(order.total)}</p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="py-12 text-center">
                <FiShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                <p className="text-gray-600 dark:text-gray-400">No orders yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Orders will appear here when customers place them</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="card dark:bg-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Top Selling Items</h2>
            <Link 
              to="/owner/menu" 
              className="flex items-center text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              Manage Menu →
            </Link>
          </div>
          <div className="space-y-4">
            {topItems.length > 0 ? (
              topItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 transition-all duration-200 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ${
                      index === 0 ? 'ring-4 ring-yellow-400' : ''
                    }`}>
                      {index === 0 ? (
                        <FiStar className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 dark:text-white">{item.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.count} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600 dark:text-primary-400">{formatCurrency(item.revenue)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">revenue</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <MdRestaurantMenu className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                <p className="text-gray-600 dark:text-gray-400">No sales data yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Top selling items will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="flex items-center mb-6 text-2xl font-bold text-gray-800 dark:text-white">
          <FiGrid className="w-6 h-6 mr-2" />
          Quick Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link 
            to="/owner/menu"
            className="py-8 text-center text-white transition-all duration-300 transform card hover:shadow-soft-lg bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 hover:-translate-y-1"
          >
            <div className="flex justify-center mb-3">
              <MdRestaurantMenu className="w-12 h-12" />
            </div>
            <p className="text-lg font-bold">Manage Menu</p>
            <p className="mt-1 text-sm opacity-90">Add & edit items</p>
          </Link>
          <Link 
            to="/owner/orders"
            className="py-8 text-center text-white transition-all duration-300 transform card hover:shadow-soft-lg bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 hover:-translate-y-1"
          >
            <div className="flex justify-center mb-3">
              <FiPackage className="w-12 h-12" />
            </div>
            <p className="text-lg font-bold">View Orders</p>
            <p className="mt-1 text-sm opacity-90">Manage all orders</p>
          </Link>
          <Link 
            to="/owner/chat"
            className="py-8 text-center text-white transition-all duration-300 transform card hover:shadow-soft-lg bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 hover:-translate-y-1"
          >
            <div className="flex justify-center mb-3">
              <FiMessageSquare className="w-12 h-12" />
            </div>
            <p className="text-lg font-bold">Customer Chat</p>
            <p className="mt-1 text-sm opacity-90">Reply to messages</p>
          </Link>
          <Link 
            to="/owner/ratings"
            className="py-8 text-center text-white transition-all duration-300 transform card hover:shadow-soft-lg bg-gradient-to-br from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700 hover:-translate-y-1"
          >
            <div className="flex justify-center mb-3">
              <MdOutlineRateReview className="w-12 h-12" />
            </div>
            <p className="text-lg font-bold">View Ratings</p>
            <p className="mt-1 text-sm opacity-90">Check feedback</p>
          </Link>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-6 mt-8 md:grid-cols-3">
        <div className="border-l-4 border-green-500 card dark:bg-gray-800 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 font-medium text-gray-700 dark:text-gray-300">Total Customers</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{uniqueCustomers}</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Unique customers</p>
            </div>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20">
              <FiUsers className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="border-l-4 border-purple-500 card dark:bg-gray-800 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 font-medium text-gray-700 dark:text-gray-300">Pending Orders</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{pendingOrders}</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{pendingOrders > 0 ? 'Needs attention' : 'All clear!'}</p>
            </div>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20">
              <FiAlertCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="border-l-4 border-orange-500 card dark:bg-gray-800 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 font-medium text-gray-700 dark:text-gray-300">Total Reviews</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{ratings.length}</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Customer feedback</p>
            </div>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/20">
              <MdOutlineRateReview className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
