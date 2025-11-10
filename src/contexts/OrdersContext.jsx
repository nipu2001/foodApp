import { createContext, useContext, useState, useEffect } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../config/firebase'
import {
  createOrder,
  updateOrderStatus as updateOrderStatusService
} from '../services/ordersService'

const OrdersContext = createContext()

export const useOrders = () => {
  const context = useContext(OrdersContext)
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider')
  }
  return context
}

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Real-time listener for orders
  useEffect(() => {
    const ordersRef = collection(db, 'orders')
    const q = query(ordersRef, orderBy('orderTime', 'desc'))
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        console.log('📦 Order from Firestore:', doc.id, data) // Debug log
        ordersData.push({ 
          id: doc.id, 
          ...data,
          orderTime: data.orderTime?.toDate?.()?.toISOString() || data.orderTime
        })
      })
      console.log('📦 Total orders loaded:', ordersData.length) // Debug log
      setOrders(ordersData)
      setLoading(false)
    }, (error) => {
      console.error('Error fetching orders:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const addOrder = async (orderData) => {
    try {
      const result = await createOrder(orderData)
      if (result.success) {
        return { success: true, orderId: result.orderId }
      }
      return { success: false, message: result.error }
    } catch (error) {
      console.error('Error adding order:', error)
      return { success: false, message: error.message }
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const result = await updateOrderStatusService(orderId, newStatus)
      if (!result.success) {
        console.error('Error updating order status:', result.error)
      }
      return result
    } catch (error) {
      console.error('Error updating order status:', error)
      return { success: false, message: error.message }
    }
  }

  const getOrdersByCustomer = (customerEmail) => {
    return orders.filter(order => order.customerEmail === customerEmail)
  }

  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId)
  }

  const getOrderStats = () => {
    return {
      all: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      completed: orders.filter(o => o.status === 'completed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    }
  }

  const value = {
    orders,
    loading,
    addOrder,
    updateOrderStatus,
    getOrdersByCustomer,
    getOrderById,
    getOrderStats,
  }

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  )
}
