import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../config/firebase'

// Add new order
export const createOrder = async (orderData) => {
  try {
    console.log('📝 Creating order with data:', orderData) // Debug log
    const ordersRef = collection(db, 'orders')
    const docRef = await addDoc(ordersRef, {
      ...orderData,
      orderTime: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    
    console.log('✅ Order created with ID:', docRef.id) // Debug log
    return { success: true, orderId: docRef.id }
  } catch (error) {
    console.error('Create order error:', error)
    return { success: false, error: error.message }
  }
}

// Get all orders
export const getAllOrders = async () => {
  try {
    const ordersRef = collection(db, 'orders')
    const q = query(ordersRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const orders = []
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() })
    })
    
    return { success: true, orders }
  } catch (error) {
    console.error('Get orders error:', error)
    return { success: false, error: error.message }
  }
}

// Get orders by customer
export const getOrdersByCustomer = async (customerId) => {
  try {
    const ordersRef = collection(db, 'orders')
    const q = query(
      ordersRef, 
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    
    const orders = []
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() })
    })
    
    return { success: true, orders }
  } catch (error) {
    console.error('Get customer orders error:', error)
    return { success: false, error: error.message }
  }
}

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const orderRef = doc(db, 'orders', orderId)
    await updateDoc(orderRef, {
      status,
      updatedAt: serverTimestamp()
    })
    
    return { success: true }
  } catch (error) {
    console.error('Update order status error:', error)
    return { success: false, error: error.message }
  }
}

// Delete order
export const deleteOrder = async (orderId) => {
  try {
    await deleteDoc(doc(db, 'orders', orderId))
    return { success: true }
  } catch (error) {
    console.error('Delete order error:', error)
    return { success: false, error: error.message }
  }
}
