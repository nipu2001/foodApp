import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import DarkModeToggle from '../DarkModeToggle'
import { 
  FiHome, 
  FiUser, 
  FiPackage, 
  FiMessageSquare, 
  FiMenu, 
  FiX,
  FiLogOut
} from 'react-icons/fi'
import { MdRestaurantMenu } from 'react-icons/md'
import { IoRestaurantOutline } from 'react-icons/io5'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Home', path: '/', Icon: FiHome },
    { name: 'Menu', path: '/menu', Icon: MdRestaurantMenu },
    { name: 'My Orders', path: '/my-orders', Icon: FiPackage },
    { name: 'Chat', path: '/chat', Icon: FiMessageSquare },
    { name: 'Profile', path: '/profile', Icon: FiUser },
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 transition-colors duration-300 bg-white dark:bg-gray-800 shadow-soft dark:shadow-dark-soft">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <IoRestaurantOutline className="text-3xl text-primary-600 dark:text-primary-400 group-hover:animate-bounce" />
            <span className="text-xl font-bold text-transparent bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text">
              Smart Meal
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-2 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Dark Mode Toggle */}
            <DarkModeToggle />
            
            {/* User Info & Logout */}
            {user && (
              <div className="flex items-center ml-2 space-x-2">
                <span className="items-center hidden space-x-1 text-sm text-gray-700 dark:text-gray-300 lg:flex">
                  <FiUser className="w-4 h-4" />
                  <span>{user.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 space-x-2 font-medium text-white transition-all duration-200 bg-red-500 rounded-lg hover:bg-red-600"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg md:hidden hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="py-4 border-t border-gray-200 md:hidden animate-slide-up dark:border-gray-700">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 mb-1 ${
                  isActive(link.path)
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Mobile Dark Mode & Logout */}
            <div className="flex items-center px-4 py-3 space-x-2">
              <DarkModeToggle />
              {user && (
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center flex-1 px-4 py-2 space-x-2 font-medium text-white transition-all duration-200 bg-red-500 rounded-lg hover:bg-red-600"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
