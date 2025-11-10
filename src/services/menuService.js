import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../config/firebase'

// Add menu item
export const addMenuItem = async (menuItemData) => {
  try {
    const menuRef = collection(db, 'menuItems')
    const docRef = await addDoc(menuRef, {
      ...menuItemData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    
    return { success: true, menuItemId: docRef.id }
  } catch (error) {
    console.error('Add menu item error:', error)
    return { success: false, error: error.message }
  }
}

// Get all menu items
export const getAllMenuItems = async () => {
  try {
    const menuRef = collection(db, 'menuItems')
    const q = query(menuRef, orderBy('name'))
    const querySnapshot = await getDocs(q)
    
    const menuItems = []
    querySnapshot.forEach((doc) => {
      menuItems.push({ id: doc.id, ...doc.data() })
    })
    
    return { success: true, menuItems }
  } catch (error) {
    console.error('Get menu items error:', error)
    return { success: false, error: error.message }
  }
}

// Update menu item
export const updateMenuItem = async (itemId, updateData) => {
  try {
    const itemRef = doc(db, 'menuItems', itemId)
    await updateDoc(itemRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    })
    
    return { success: true }
  } catch (error) {
    console.error('Update menu item error:', error)
    return { success: false, error: error.message }
  }
}

// Delete menu item
export const deleteMenuItem = async (itemId) => {
  try {
    await deleteDoc(doc(db, 'menuItems', itemId))
    return { success: true }
  } catch (error) {
    console.error('Delete menu item error:', error)
    return { success: false, error: error.message }
  }
}
