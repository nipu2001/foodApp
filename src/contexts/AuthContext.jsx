import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
import { 
  loginUser as firebaseLogin, 
  registerUser as firebaseRegister, 
  logoutUser as firebaseLogout
} from '../services/authService'

const DEFAULT_ADMIN_EMAILS = [
  'nipuninuwanthika785@gmail.com',
  'nipuninuwanthika74@gmail.com'
]

const getAdminEmails = () => {
  const configured = import.meta.env.VITE_ADMIN_EMAILS
  if (!configured) return DEFAULT_ADMIN_EMAILS
  const parsed = configured
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
  return parsed.length > 0 ? parsed : DEFAULT_ADMIN_EMAILS
}

const isOwnerEmail = (email = '') => {
  return getAdminEmails().includes(email.trim().toLowerCase())
}

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: userData.name || firebaseUser.displayName,
              role: userData.role || (isOwnerEmail(firebaseUser.email) ? 'owner' : 'customer'),
              username: userData.name || firebaseUser.displayName
            })
          } else {
            // Fallback if no Firestore doc
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              role: isOwnerEmail(firebaseUser.email) ? 'owner' : 'customer',
              username: firebaseUser.displayName
            })
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
          // Firestore can fail due to rules, network, or missing profile docs.
          // Keep user signed in based on Firebase Auth state.
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
            role: isOwnerEmail(firebaseUser.email) ? 'owner' : 'customer',
            username: firebaseUser.displayName || firebaseUser.email?.split('@')[0]
          })
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email, password) => {
    try {
      const result = await firebaseLogin(email, password)
      
      if (result.success) {
        // User state will be updated by onAuthStateChanged listener
        return { 
          success: true, 
          user: result.user 
        }
      }
      
      return { success: false, message: result.error }
    } catch (error) {
      console.error('Login error in AuthContext:', error)
      return { success: false, message: error.message || 'Login failed. Please try again.' }
    }
  }

  const register = async (name, email, password) => {
    try {
      const result = await firebaseRegister(email, password, name)
      
      if (result.success) {
        return { 
          success: true, 
          user: result.user 
        }
      }
      
      return { success: false, message: result.error }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, message: error.message }
    }
  }

  const logout = async () => {
    try {
      await firebaseLogout()
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isOwner: user?.role === 'owner',
    isCustomer: user?.role === 'customer',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
