import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Authentication check
    if (username && password) {
      // Check if admin credentials
      const isAdmin = username === 'nipuni' && password === 'nipuni12'
      
      // Store user data
      const userData = { 
        username, 
        isAuthenticated: true,
        role: isAdmin ? 'admin' : 'customer'
      }
      
      login(userData)
      
      // Navigate based on role
      if (isAdmin) {
        navigate('/owner')
        alert('Welcome Admin! 👔')
      } else {
        navigate('/')
        alert('Welcome Customer! 🍽️')
      }
    } else {
      alert('Please enter username and password')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block">
            <div className="flex items-center space-x-3 justify-center mb-4">
              <span className="text-6xl animate-bounce">🍽️</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent animate-pulse">
              Smart Meal
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Order your favorite meals</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="card animate-slide-up bg-white dark:bg-gray-800">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            Welcome Back!
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                👤 Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🔒 Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Admin Hint */}
            <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 p-3 rounded">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                💡 <strong>Admin:</strong> username: nipuni, password: nipuni12
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                💡 <strong>Customer:</strong> Any other credentials
              </p>
            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full btn-primary">
              🚀 Login
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 dark:text-gray-400 mt-6 text-sm">
          © 2025 Smart Meal. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default Login
