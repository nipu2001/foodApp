import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXnni1Sp6aLBqsEUN3mVJtrEdDHb7raxA",
  authDomain: "smart-meal-9a501.firebaseapp.com",
  projectId: "smart-meal-9a501",
  storageBucket: "smart-meal-9a501.firebasestorage.app",
  messagingSenderId: "818835823103",
  appId: "1:818835823103:web:c6543ac9a8cf2973886fca",
  measurementId: "G-YQ77G3X9YE"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const analytics = getAnalytics(app)

export default app
