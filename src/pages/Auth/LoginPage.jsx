import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { FiUser, FiLock, FiMail, FiLogIn, FiUserPlus, FiAlertCircle } from 'react-icons/fi'
import { IoRestaurantOutline } from 'react-icons/io5'
import { MdAdminPanelSettings } from 'react-icons/md'
import { BiDish } from 'react-icons/bi'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Trim whitespace from email and password
      const email = formData.email.trim().toLowerCase()
      const password = formData.password.trim()
      
      console.log('Login attempt with email:', email)
      
      const result = await login(email, password)
      
      setLoading(false)

      if (result.success) {
        // Navigate based on role (automatically detected)
        if (result.user.role === 'owner') {
          navigate('/owner')
        } else {
          navigate('/')
        }
      } else {
        setError(result.message || 'Login failed. Please try again.')
      }
    } catch (err) {
      setLoading(false)
      setError('An unexpected error occurred. Please try again.')
      console.error('Login error:', err)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md">
        {/* Animated Logo */}
        <div className="mb-8 text-center animate-scale-in">
          <div className="inline-block">
            <div className="flex items-center justify-center mb-2 space-x-3">
              <div className="relative">
                <IoRestaurantOutline className="text-6xl text-primary-600 dark:text-primary-400 animate-bounce" />
              </div>
              <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text">
                Smart Meal
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Order your favorite meal</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="card animate-slide-up">
          <div className="mb-6 text-center">
            <h2 className="flex items-center justify-center mb-2 text-2xl font-bold text-gray-800 dark:text-white">
              <FiLogIn className="w-6 h-6 mr-2" />
              Welcome Back!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Sign in to continue</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 mb-4 border-l-4 border-red-500 rounded-lg bg-red-50 dark:bg-red-900/20 animate-slide-up">
              <p className="flex items-center text-sm text-red-700 dark:text-red-400">
                <FiAlertCircle className="w-4 h-4 mr-2" />
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <span className="flex items-center">
                  <FiMail className="w-4 h-4 mr-2" />
                  Email Address
                </span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                className="input-field"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <span className="flex items-center">
                  <FiLock className="w-4 h-4 mr-2" />
                  Password
                </span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                className="input-field"
                required
              />
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-700 dark:text-gray-300">
                <input type="checkbox" className="mr-2 rounded" />
                Remember me
              </label>
              <Link 
                to="/forgot-password" 
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-b-2 border-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <FiLogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
              >
                Sign up here
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="p-3 mt-4 border-l-4 border-blue-400 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <p className="flex items-center mb-2 text-xs font-semibold text-blue-800 dark:text-blue-300">
              <MdAdminPanelSettings className="w-4 h-4 mr-1" />
              Demo Credentials:
            </p>
            <div className="space-y-1">
              <p className="text-xs text-blue-700 dark:text-blue-400">
                <strong>Owner:</strong> nipuninuwanthika785@gmail.com / nipuni12
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-400">
                <strong>Customer:</strong> Any valid email / password (min 6 chars)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
