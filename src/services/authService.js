import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../config/firebase'

// Register new user
export const registerUser = async (email, password, name) => {
  try {
    // Admin email - gets owner role automatically
    const ADMIN_EMAIL = 'nipuninuwanthika785@gmail.com'
    const userRole = email.toLowerCase().trim() === ADMIN_EMAIL ? 'owner' : 'customer'
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update display name
    await updateProfile(user, { displayName: name })

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: email,
      name: name,
      role: userRole,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    return { 
      success: true, 
      user: {
        uid: user.uid,
        email: user.email,
        name: name,
        role: userRole
      }
    }
  } catch (error) {
    console.error('Registration error:', error)
    let errorMessage = 'Registration failed. Please try again.'
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'This email is already registered.'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address.'
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password should be at least 6 characters.'
    }
    
    return { success: false, error: errorMessage }
  }
}

// Login user
export const loginUser = async (email, password) => {
  try {
    console.log('Attempting login for:', email)
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    console.log('Firebase auth successful, user UID:', user.uid)

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    console.log('Firestore doc exists:', userDoc.exists())
    
    if (userDoc.exists()) {
      const userData = userDoc.data()
      console.log('User data from Firestore:', userData)
      return { 
        success: true, 
        user: {
          uid: user.uid,
          email: user.email,
          name: userData.name,
          role: userData.role
        }
      }
    } else {
      console.warn('User document not found in Firestore')
      // User exists in Auth but not in Firestore
      return { 
        success: true, 
        user: {
          uid: user.uid,
          email: user.email,
          name: user.displayName || email.split('@')[0],
          role: 'customer' // Default role
        }
      }
    }
  } catch (error) {
    console.error('Login error in authService:', error)
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    
    let errorMessage = 'Login failed. Please try again.'
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email.'
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password.'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address.'
    } else if (error.code === 'auth/invalid-credential') {
      errorMessage = 'Invalid email or password.'
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed login attempts. Please try again later.'
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your internet connection.'
    }
    
    return { success: false, error: errorMessage }
  }
}

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    return { success: false, error: error.message }
  }
}

// Send password reset email
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email)
    return { success: true }
  } catch (error) {
    console.error('Password reset error:', error)
    let errorMessage = 'Failed to send reset email.'
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email.'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address.'
    }
    
    return { success: false, error: errorMessage }
  }
}

// Get current user data
export const getCurrentUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() }
    }
    
    return { success: false, error: 'User not found' }
  } catch (error) {
    console.error('Get user data error:', error)
    return { success: false, error: error.message }
  }
}
