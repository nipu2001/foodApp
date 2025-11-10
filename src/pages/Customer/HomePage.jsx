import { Link } from 'react-router-dom'
import { isOrderingClosed } from '../../utils/helpers'
import { 
  FiSun, 
  FiClock,
  FiMoon, 
  FiShoppingBag, 
  FiPackage,
  FiSmartphone,
  FiShoppingCart,
  FiTruck,
  FiAlertCircle
} from 'react-icons/fi'
import { IoRestaurantOutline } from 'react-icons/io5'
import { MdOutlineRestaurantMenu } from 'react-icons/md'
import { GiCook } from 'react-icons/gi'

const HomePage = () => {
  const orderingClosed = isOrderingClosed()

  return (
    <div className="animate-fade-in">
      {/* Ordering Alert Banner */}
      {orderingClosed && (
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-400 p-4 mb-6 mx-4 mt-4 rounded-lg animate-slide-up">
          <div className="flex items-center">
            <FiClock className="w-8 h-8 mr-3 text-red-600 dark:text-red-400" />
            <div>
              <p className="font-bold text-red-800 dark:text-red-300">Ordering Closed</p>
              <p className="text-red-700 dark:text-red-400">Orders are only accepted before 10:00 a.m.</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 dark:from-primary-700 dark:via-primary-800 dark:to-accent-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-slide-up">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Order Your Favorite Meals on Time
              </h1>
              <p className="text-xl text-primary-50 leading-relaxed">
                Fresh, delicious meals prepared daily. Choose from breakfast, lunch, 
                and dinner options. Fast delivery guaranteed!
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-3 border border-white/20">
                <div className="flex items-center space-x-3">
                  <FiSun className="w-6 h-6 text-yellow-300 flex-shrink-0" />
                  <span className="text-lg font-semibold">Breakfast: Before 8:00 AM</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiClock className="w-6 h-6 text-orange-300 flex-shrink-0" />
                  <span className="text-lg font-semibold">Lunch: Before 10:00 AM</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiMoon className="w-6 h-6 text-indigo-300 flex-shrink-0" />
                  <span className="text-lg font-semibold">Dinner: Before 6:00 PM</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/menu" className="inline-flex items-center space-x-2 bg-white text-primary-600 font-bold py-4 px-8 rounded-xl hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <MdOutlineRestaurantMenu className="w-5 h-5" />
                  <span>Browse Menu</span>
                </Link>
                <Link to="/my-orders" className="inline-flex items-center space-x-2 bg-primary-700 text-white font-bold py-4 px-8 rounded-xl hover:bg-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <FiPackage className="w-5 h-5" />
                  <span>My Orders</span>
                </Link>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="relative z-10 animate-scale-in">
                <div className="bg-white rounded-2xl shadow-soft-lg p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <img 
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600" 
                    alt="Delicious food" 
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">
          Why Choose Smart Meal?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center animate-slide-up">
            <div className="flex justify-center mb-4">
              <FiSun className="w-16 h-16 text-yellow-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Fresh Breakfast</h3>
            <p className="text-gray-600 dark:text-gray-400">Start your day right with our healthy and delicious breakfast options.</p>
          </div>
          
          <div className="card text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex justify-center mb-4">
              <FiSun className="w-16 h-16 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Tasty Lunch</h3>
            <p className="text-gray-600 dark:text-gray-400">Satisfy your midday cravings with our variety of lunch meals.</p>
          </div>
          
          <div className="card text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex justify-center mb-4">
              <FiMoon className="w-16 h-16 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Perfect Dinner</h3>
            <p className="text-gray-600 dark:text-gray-400">End your day with a comforting and delicious dinner.</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { Icon: FiSmartphone, title: 'Browse Menu', desc: 'Choose from our delicious options', color: 'text-blue-600' },
              { Icon: FiShoppingCart, title: 'Place Order', desc: 'Add items to cart before 10 AM', color: 'text-green-600' },
              { Icon: GiCook, title: 'We Prepare', desc: 'Fresh meals prepared with care', color: 'text-orange-600' },
              { Icon: FiTruck, title: 'Fast Delivery', desc: 'Get your meal delivered quickly', color: 'text-purple-600' },
            ].map((step, index) => {
              const IconComponent = step.Icon
              return (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
                    <IconComponent className={`w-10 h-10 ${step.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{step.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="card bg-gradient-to-br from-primary-500 to-accent-500 text-white text-center p-12">
          <h2 className="text-4xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-xl text-primary-50 mb-8">
            Don't miss out! Order your meals before the deadline.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <FiSun className="w-12 h-12 text-yellow-300 mx-auto mb-3" />
              <h3 className="text-2xl font-bold mb-2">Breakfast</h3>
              <p className="text-primary-100 text-lg">Before 8:00 AM</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <FiClock className="w-12 h-12 text-orange-300 mx-auto mb-3" />
              <h3 className="text-2xl font-bold mb-2">Lunch</h3>
              <p className="text-primary-100 text-lg">Before 10:00 AM</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <FiMoon className="w-12 h-12 text-indigo-300 mx-auto mb-3" />
              <h3 className="text-2xl font-bold mb-2">Dinner</h3>
              <p className="text-primary-100 text-lg">Before 6:00 PM</p>
            </div>
          </div>
          <Link 
            to="/menu" 
            className="inline-flex items-center space-x-2 bg-white text-primary-600 font-bold py-4 px-10 rounded-xl hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <IoRestaurantOutline className="w-5 h-5" />
            <span>Order Now</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
