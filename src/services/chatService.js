import { 
  collection, 
  addDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
  getDocs
} from 'firebase/firestore'
import { db } from '../config/firebase'

// Create or get a conversation between customer and owner
export const getOrCreateConversation = async (customerEmail, customerName) => {
  try {
    const conversationsRef = collection(db, 'conversations')
    const q = query(conversationsRef, where('customerEmail', '==', customerEmail))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      // Conversation exists
      const doc = querySnapshot.docs[0]
      return { success: true, conversationId: doc.id, data: doc.data() }
    } else {
      // Create new conversation
      const docRef = await addDoc(conversationsRef, {
        customerEmail,
        customerName,
        createdAt: serverTimestamp(),
        lastMessage: null,
        lastMessageTime: serverTimestamp(),
        unreadOwner: 0,
        unreadCustomer: 0
      })
      
      return { success: true, conversationId: docRef.id }
    }
  } catch (error) {
    console.error('Get/Create conversation error:', error)
    return { success: false, error: error.message }
  }
}

// Send a message
export const sendMessage = async (conversationId, messageData) => {
  try {
    const messagesRef = collection(db, 'conversations', conversationId, 'messages')
    const docRef = await addDoc(messagesRef, {
      ...messageData,
      timestamp: serverTimestamp(),
      createdAt: serverTimestamp()
    })
    
    // Update conversation's last message
    const conversationRef = doc(db, 'conversations', conversationId)
    const updateData = {
      lastMessage: messageData.text,
      lastMessageTime: serverTimestamp()
    }
    
    // Increment unread count for recipient
    if (messageData.sender === 'customer') {
      updateData.unreadOwner = (await getDocs(query(collection(db, 'conversations')))).docs[0]?.data()?.unreadOwner || 0 + 1
    } else {
      updateData.unreadCustomer = (await getDocs(query(collection(db, 'conversations')))).docs[0]?.data()?.unreadCustomer || 0 + 1
    }
    
    await updateDoc(conversationRef, updateData)
    
    return { success: true, messageId: docRef.id }
  } catch (error) {
    console.error('Send message error:', error)
    return { success: false, error: error.message }
  }
}

// Mark messages as read
export const markAsRead = async (conversationId, isOwner) => {
  try {
    const conversationRef = doc(db, 'conversations', conversationId)
    const updateData = isOwner 
      ? { unreadOwner: 0 }
      : { unreadCustomer: 0 }
    
    await updateDoc(conversationRef, updateData)
    return { success: true }
  } catch (error) {
    console.error('Mark as read error:', error)
    return { success: false, error: error.message }
  }
}
