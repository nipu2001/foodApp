import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IoRestaurantOutline } from 'react-icons/io5'

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <IoRestaurantOutline className="w-24 h-24 mx-auto mb-4 text-primary-600 dark:text-primary-400 animate-bounce" />
          <p className="text-xl text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
