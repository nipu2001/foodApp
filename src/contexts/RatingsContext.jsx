import { createContext, useContext, useState, useEffect } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../config/firebase'
import { addRating as addRatingService } from '../services/ratingsService'

const RatingsContext = createContext()

export const useRatings = () => {
  const context = useContext(RatingsContext)
  if (!context) {
    throw new Error('useRatings must be used within a RatingsProvider')
  }
  return context
}

export const RatingsProvider = ({ children }) => {
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)

  // Real-time listener for ratings
  useEffect(() => {
    const ratingsRef = collection(db, 'ratings')
    const q = query(ratingsRef, orderBy('createdAt', 'desc'))
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ratingsData = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        ratingsData.push({ 
          id: doc.id, 
          ...data,
          date: data.createdAt?.toDate?.()?.toISOString() || data.date
        })
      })
      setRatings(ratingsData)
      setLoading(false)
    }, (error) => {
      console.error('Error fetching ratings:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const addRating = async (ratingData) => {
    try {
      const result = await addRatingService(ratingData)
      if (result.success) {
        return { success: true, ratingId: result.ratingId }
      }
      return { success: false, message: result.error }
    } catch (error) {
      console.error('Error adding rating:', error)
      return { success: false, message: error.message }
    }
  }

  const getRatingByOrderId = (orderId) => {
    return ratings.find(rating => rating.orderId === orderId)
  }

  const getAverageRating = () => {
    if (ratings.length === 0) return '0.0'
    const total = ratings.reduce((sum, r) => sum + r.rating, 0)
    return (total / ratings.length).toFixed(1)
  }

  const getRatingsByFoodItem = () => {
    const foodRatings = {}
    
    ratings.forEach(rating => {
      rating.foodItems.forEach(foodName => {
        if (!foodRatings[foodName]) {
          foodRatings[foodName] = { total: 0, count: 0, ratings: [] }
        }
        foodRatings[foodName].total += rating.rating
        foodRatings[foodName].count += 1
        foodRatings[foodName].ratings.push(rating)
      })
    })

    return Object.entries(foodRatings).map(([foodName, data]) => ({
      foodName,
      average: (data.total / data.count).toFixed(1),
      count: data.count,
    }))
  }

  const getPositiveRatingsCount = () => {
    return ratings.filter(r => r.rating >= 4).length
  }

  const getSatisfactionRate = () => {
    if (ratings.length === 0) return 0
    return Math.round((getPositiveRatingsCount() / ratings.length) * 100)
  }

  const getRatingDistribution = () => {
    return [5, 4, 3, 2, 1].map(star => ({
      star,
      count: ratings.filter(r => r.rating === star).length,
      percentage: ratings.length > 0 
        ? (ratings.filter(r => r.rating === star).length / ratings.length) * 100 
        : 0
    }))
  }

  const value = {
    ratings,
    addRating,
    getRatingByOrderId,
    getAverageRating,
    getRatingsByFoodItem,
    getPositiveRatingsCount,
    getSatisfactionRate,
    getRatingDistribution,
  }

  return (
    <RatingsContext.Provider value={value}>
      {children}
    </RatingsContext.Provider>
  )
}
