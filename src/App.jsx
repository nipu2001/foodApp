import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { DarkModeProvider } from './contexts/DarkModeContext'
import { RatingsProvider } from './contexts/RatingsContext'
import { OrdersProvider } from './contexts/OrdersContext'
import { MenuProvider } from './contexts/MenuContext'
import { ChatProvider } from './contexts/ChatContext'
import Layout from './components/Layout/Layout'
import OwnerLayout from './components/Layout/OwnerLayout'
import { IoRestaurantOutline } from 'react-icons/io5'

// Auth Pages
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage'

// Customer Pages
import HomePage from './pages/Customer/HomePage'
import MenuPage from './pages/Customer/MenuPage'
import MyOrdersPage from './pages/Customer/MyOrdersPage'
import ProfilePage from './pages/Customer/ProfilePage'
import ChatCustomer from './pages/Customer/ChatCustomer'

// Owner Pages
import Dashboard from './pages/Owner/Dashboard'
import MenuManagement from './pages/Owner/MenuManagement'
import Orders from './pages/Owner/Orders'
import Ratings from './pages/Owner/Ratings'
import ChatOwner from './pages/Owner/ChatOwner'

// Protected Route Component
const ProtectedRoute = ({ children, requireOwner = false }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <IoRestaurantOutline className="w-24 h-24 mx-auto mb-4 text-primary-600 dark:text-primary-400 animate-bounce" />
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requireOwner && user.role !== 'owner') {
    return <Navigate to="/" replace />
  }

  return children
}

// Public Route (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <IoRestaurantOutline className="w-24 h-24 mx-auto mb-4 text-primary-600 dark:text-primary-400 animate-bounce" />
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return <Navigate to={user.role === 'owner' ? '/owner' : '/'} replace />
  }

  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />

      {/* Customer Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="my-orders" element={<MyOrdersPage />} />
        <Route path="chat" element={<ChatCustomer />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Owner Routes */}
      <Route
        path="/owner"
        element={
          <ProtectedRoute requireOwner={true}>
            <OwnerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="menu" element={<MenuManagement />} />
        <Route path="orders" element={<Orders />} />
        <Route path="chat" element={<ChatOwner />} />
        <Route path="ratings" element={<Ratings />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <MenuProvider>
          <RatingsProvider>
            <OrdersProvider>
              <ChatProvider>
                <Router>
                  <AppRoutes />
                </Router>
              </ChatProvider>
            </OrdersProvider>
          </RatingsProvider>
        </MenuProvider>
      </AuthProvider>
    </DarkModeProvider>
  )
}

export default App
