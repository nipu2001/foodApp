import { 
  collection, 
  addDoc, 
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../config/firebase'

// Add rating
export const addRating = async (ratingData) => {
  try {
    const ratingsRef = collection(db, 'ratings')
    const docRef = await addDoc(ratingsRef, {
      ...ratingData,
      createdAt: serverTimestamp()
    })
    
    return { success: true, ratingId: docRef.id }
  } catch (error) {
    console.error('Add rating error:', error)
    return { success: false, error: error.message }
  }
}

// Get all ratings
export const getAllRatings = async () => {
  try {
    const ratingsRef = collection(db, 'ratings')
    const q = query(ratingsRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const ratings = []
    querySnapshot.forEach((doc) => {
      ratings.push({ id: doc.id, ...doc.data() })
    })
    
    return { success: true, ratings }
  } catch (error) {
    console.error('Get ratings error:', error)
    return { success: false, error: error.message }
  }
}

// Get ratings by order
export const getRatingsByOrder = async (orderId) => {
  try {
    const ratingsRef = collection(db, 'ratings')
    const q = query(ratingsRef, where('orderId', '==', orderId))
    const querySnapshot = await getDocs(q)
    
    const ratings = []
    querySnapshot.forEach((doc) => {
      ratings.push({ id: doc.id, ...doc.data() })
    })
    
    return { success: true, ratings }
  } catch (error) {
    console.error('Get order ratings error:', error)
    return { success: false, error: error.message }
  }
}
