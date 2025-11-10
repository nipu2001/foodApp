import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import DarkModeToggle from '../DarkModeToggle'
import { 
  MdDashboard, 
  MdRestaurantMenu, 
  MdOutlineRateReview,
  MdLogout 
} from 'react-icons/md'
import { 
  FiPackage, 
  FiMessageSquare, 
  FiUser, 
  FiMenu 
} from 'react-icons/fi'
import { IoRestaurantOutline } from 'react-icons/io5'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { name: 'Dashboard', path: '/owner', Icon: MdDashboard },
    { name: 'Menu Management', path: '/owner/menu', Icon: MdRestaurantMenu },
    { name: 'Orders', path: '/owner/orders', Icon: FiPackage },
    { name: 'Chat', path: '/owner/chat', Icon: FiMessageSquare },
    { name: 'Ratings', path: '/owner/ratings', Icon: MdOutlineRateReview },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-soft"
      >
        <FiMenu className="w-6 h-6 text-gray-800 dark:text-white" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-soft-lg dark:shadow-dark-soft-lg z-40 transform transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-8 group">
            <IoRestaurantOutline className="text-4xl text-primary-600 dark:text-primary-400 group-hover:animate-bounce" />
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">
                Smart Meal
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Owner Dashboard</p>
            </div>
          </div>

          {/* Owner Profile */}
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/30 dark:to-accent-900/30 rounded-xl mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {user?.name?.charAt(0).toUpperCase() || 'N'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 dark:text-white truncate">{user?.name || 'Nipuni'}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{user?.email || 'owner@smartmeal.com'}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {navLinks.map((link) => {
              const IconComponent = link.Icon
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Bottom Section */}
          <div className="mt-auto space-y-2">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
              <DarkModeToggle />
            </div>
            
            {/* Customer View Link */}
            <Link
              to="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <FiUser className="w-5 h-5" />
              <span className="font-medium">Customer View</span>
            </Link>
            
            {/* Logout Button */}
            <button
              onClick={() => {
                logout()
                navigate('/login')
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <MdLogout className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
