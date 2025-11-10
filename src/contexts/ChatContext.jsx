import { createContext, useContext, useState, useEffect } from 'react'
import { collection, query, where, orderBy, onSnapshot, doc } from 'firebase/firestore'
import { db } from '../config/firebase'
import {
  getOrCreateConversation,
  sendMessage as sendMessageService,
  markAsRead as markAsReadService
} from '../services/chatService'

const ChatContext = createContext()

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState({})
  const [loading, setLoading] = useState(true)
  const [activeConversationId, setActiveConversationId] = useState(null)

  // Listen to all conversations (for owner)
  useEffect(() => {
    const conversationsRef = collection(db, 'conversations')
    const q = query(conversationsRef, orderBy('lastMessageTime', 'desc'))
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const conversationsData = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        conversationsData.push({ 
          id: doc.id, 
          ...data,
          lastMessageTime: data.lastMessageTime?.toDate?.()?.toISOString() || data.lastMessageTime,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt
        })
      })
      console.log('💬 Conversations loaded:', conversationsData.length)
      setConversations(conversationsData)
      setLoading(false)
    }, (error) => {
      console.error('Error fetching conversations:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Listen to messages for active conversation
  useEffect(() => {
    if (!activeConversationId) return

    const messagesRef = collection(db, 'conversations', activeConversationId, 'messages')
    const q = query(messagesRef, orderBy('timestamp', 'asc'))
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        messagesData.push({ 
          id: doc.id, 
          ...data,
          timestamp: data.timestamp?.toDate?.()?.toISOString() || data.timestamp,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt
        })
      })
      console.log('💬 Messages loaded for conversation:', activeConversationId, messagesData.length)
      setMessages(prev => ({ ...prev, [activeConversationId]: messagesData }))
    }, (error) => {
      console.error('Error fetching messages:', error)
    })

    return () => unsubscribe()
  }, [activeConversationId])

  // Get or create conversation for customer
  const initializeConversation = async (customerEmail, customerName) => {
    try {
      const result = await getOrCreateConversation(customerEmail, customerName)
      if (result.success) {
        setActiveConversationId(result.conversationId)
        return { success: true, conversationId: result.conversationId }
      }
      return result
    } catch (error) {
      console.error('Error initializing conversation:', error)
      return { success: false, message: error.message }
    }
  }

  // Send a message
  const sendMessage = async (conversationId, text, sender, senderName) => {
    try {
      const messageData = {
        text,
        sender, // 'customer' or 'owner'
        senderName,
        read: false
      }
      
      const result = await sendMessageService(conversationId, messageData)
      return result
    } catch (error) {
      console.error('Error sending message:', error)
      return { success: false, message: error.message }
    }
  }

  // Mark conversation as read
  const markAsRead = async (conversationId, isOwner) => {
    try {
      const result = await markAsReadService(conversationId, isOwner)
      return result
    } catch (error) {
      console.error('Error marking as read:', error)
      return { success: false, message: error.message }
    }
  }

  // Get conversation by customer email
  const getConversationByCustomer = (customerEmail) => {
    return conversations.find(conv => conv.customerEmail === customerEmail)
  }

  // Get messages for a conversation
  const getMessages = (conversationId) => {
    return messages[conversationId] || []
  }

  // Get unread count for owner
  const getOwnerUnreadCount = () => {
    return conversations.reduce((sum, conv) => sum + (conv.unreadOwner || 0), 0)
  }

  // Get unread count for customer
  const getCustomerUnreadCount = (customerEmail) => {
    const conv = conversations.find(c => c.customerEmail === customerEmail)
    return conv?.unreadCustomer || 0
  }

  const value = {
    conversations,
    messages,
    loading,
    activeConversationId,
    setActiveConversationId,
    initializeConversation,
    sendMessage,
    markAsRead,
    getConversationByCustomer,
    getMessages,
    getOwnerUnreadCount,
    getCustomerUnreadCount
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
