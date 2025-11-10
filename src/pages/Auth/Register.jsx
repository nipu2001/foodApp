import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (username && email && password && confirmPassword) {
      if (password !== confirmPassword) {
        alert('Passwords do not match!')
        return
      }
      
      if (password.length < 6) {
        alert('Password must be at least 6 characters!')
        return
      }
      
      // New users are customers by default
      const userData = { 
        username, 
        email, 
        isAuthenticated: true,
        role: 'customer'
      }
      
      login(userData)
      
      // Navigate to customer dashboard
      navigate('/')
      
      alert('Registration successful! Welcome Customer 🎉')
    } else {
      alert('Please fill all fields')
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
            <p className="text-gray-600 dark:text-gray-400 mt-2">Join us today!</p>
          </div>
        </div>

        {/* Register Card */}
        <div className="card animate-slide-up bg-white dark:bg-gray-800">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                👤 Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                📧 Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
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
                  placeholder="Minimum 6 characters"
                  className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  required
                  minLength={6}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🔐 Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="input-field dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>

            {/* Info */}
            <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-400 p-3 rounded">
              <p className="text-sm text-green-700 dark:text-green-300">
                ✅ New accounts are registered as <strong>Customers</strong>
              </p>
            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full btn-primary">
              🎉 Create Account
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
              >
                Login here
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

export default Register
