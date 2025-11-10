import { createContext, useContext, useState, useEffect } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../config/firebase'
import { 
  addMenuItem, 
  updateMenuItem, 
  deleteMenuItem 
} from '../services/menuService'

const MenuContext = createContext()

export const useMenu = () => {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error('useMenu must be used within MenuProvider')
  }
  return context
}

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)

  // Real-time listener for menu items
  useEffect(() => {
    const menuRef = collection(db, 'menuItems')
    const q = query(menuRef, orderBy('name'))
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = []
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() })
      })
      setMenuItems(items)
      setLoading(false)
    }, (error) => {
      console.error('Error fetching menu items:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Add new menu item
  const addMenu = async (menuData) => {
    try {
      const result = await addMenuItem(menuData)
      if (result.success) {
        return { success: true, menuItemId: result.menuItemId }
      }
      return { success: false, message: result.error }
    } catch (error) {
      console.error('Error adding menu item:', error)
      return { success: false, message: error.message }
    }
  }

  // Update existing menu item
  const updateMenu = async (itemId, updateData) => {
    try {
      const result = await updateMenuItem(itemId, updateData)
      if (result.success) {
        return { success: true }
      }
      return { success: false, message: result.error }
    } catch (error) {
      console.error('Error updating menu item:', error)
      return { success: false, message: error.message }
    }
  }

  // Delete menu item
  const deleteMenu = async (itemId) => {
    try {
      const result = await deleteMenuItem(itemId)
      if (result.success) {
        return { success: true }
      }
      return { success: false, message: result.error }
    } catch (error) {
      console.error('Error deleting menu item:', error)
      return { success: false, message: error.message }
    }
  }

  // Get menu items by category
  const getMenuByCategory = (category) => {
    if (category === 'all' || !category) return menuItems
    return menuItems.filter(item => 
      item.category.toLowerCase() === category.toLowerCase()
    )
  }

  const value = {
    menuItems,
    loading,
    addMenu,
    updateMenu,
    deleteMenu,
    getMenuByCategory
  }

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}
