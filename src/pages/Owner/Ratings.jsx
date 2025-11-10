import { useState } from 'react'
import { useRatings } from '../../contexts/RatingsContext'
import { FiStar, FiSmile, FiTrendingUp, FiFilter } from 'react-icons/fi'

const Ratings = () => {
  const { 
    ratings, 
    getAverageRating, 
    getRatingsByFoodItem, 
    getPositiveRatingsCount, 
    getSatisfactionRate,
    getRatingDistribution 
  } = useRatings()
  
  const [filterRating, setFilterRating] = useState('all')

  const averageRatings = getRatingsByFoodItem()
  const overallRating = getAverageRating()
  const positiveRatings = getPositiveRatingsCount()
  const satisfactionRate = getSatisfactionRate()
  const ratingDistribution = getRatingDistribution()

  // Filter ratings based on selected filter
  const filteredRatings = filterRating === 'all' 
    ? ratings 
    : ratings.filter(r => r.rating === parseInt(filterRating))

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FiStar 
        key={index} 
        className={`w-6 h-6 inline ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
      />
    ))
  }

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 3.5) return 'text-yellow-600'
    return 'text-orange-600'
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-gray-800">Ratings & Reviews</h1>
        <p className="text-gray-600">See what customers think about your food</p>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-6 mb-8 md:grid-cols-3">
        <div className="text-center card bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30">
          <FiStar className="w-24 h-24 mx-auto mb-2 text-yellow-600 dark:text-yellow-400" />
          <p className="mb-1 text-4xl font-bold text-yellow-600 dark:text-yellow-400">{overallRating}</p>
          <p className="text-gray-700 dark:text-gray-300">Overall Rating</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{ratings.length} total reviews</p>
        </div>

        <div className="text-center card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30">
          <FiSmile className="w-24 h-24 mx-auto mb-2 text-green-600 dark:text-green-400" />
          <p className="mb-1 text-4xl font-bold text-green-600 dark:text-green-400">
            {positiveRatings}
          </p>
          <p className="text-gray-700 dark:text-gray-300">Positive Reviews</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">4+ stars</p>
        </div>

        <div className="text-center card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
          <FiTrendingUp className="w-24 h-24 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
          <p className="mb-1 text-4xl font-bold text-blue-600 dark:text-blue-400">
            {satisfactionRate}%
          </p>
          <p className="text-gray-700 dark:text-gray-300">Satisfaction Rate</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Happy customers</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Average Ratings by Food */}
        <div className="card dark:bg-gray-800">
          <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Average Rating by Food</h2>
          <div className="space-y-4">
            {averageRatings.length > 0 ? (
              averageRatings
                .sort((a, b) => parseFloat(b.average) - parseFloat(a.average))
                .map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex-1">
                      <p className="mb-1 font-bold text-gray-800 dark:text-white">{item.foodName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.count} reviews</p>
                    </div>
                    <div className="flex items-center space-x-2 text-right">
                      <p className={`text-3xl font-bold ${getRatingColor(parseFloat(item.average))}`}>
                        {item.average}
                      </p>
                      <FiStar className={`w-8 h-8 ${getRatingColor(parseFloat(item.average))}`} />
                    </div>
                  </div>
                ))
            ) : (
              <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                <FiStar className="w-16 h-16 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">No ratings yet</p>
                <p className="text-sm">Ratings will appear here once customers rate their orders</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="card dark:bg-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Recent Reviews</h2>
            <div className="flex items-center space-x-2">
              <FiFilter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="px-3 py-1 text-sm text-gray-800 bg-white border-2 border-gray-200 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-primary-500"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {filteredRatings.length > 0 ? (
              filteredRatings
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((review) => (
                  <div key={review.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl animate-slide-up">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-gray-800 dark:text-white">{review.customer}</p>
                        <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                          Order: {review.orderId}
                        </p>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                          {review.foodItems.join(', ')}
                        </p>
                      </div>
                      <div className="flex">{renderStars(review.rating)}</div>
                    </div>
                    {review.comment && (
                      <p className="mb-2 italic text-gray-700 dark:text-gray-300">"{review.comment}"</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(review.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))
            ) : (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                <FiStar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No reviews match this filter</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="mt-8 card dark:bg-gray-800">
        <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Rating Distribution</h2>
        <div className="space-y-3">
          {ratingDistribution.map((item) => (
            <div key={item.star} className="flex items-center space-x-4">
              <span className="flex items-center w-16 space-x-1 text-lg font-semibold text-gray-700 dark:text-gray-300">
                <span>{item.star}</span>
                <FiStar className="w-5 h-5 text-yellow-500" />
              </span>
              <div className="flex-1 h-6 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                <div
                  className="h-full transition-all duration-500 bg-gradient-to-r from-yellow-400 to-yellow-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="w-20 font-medium text-gray-700 dark:text-gray-300">
                {item.count} ({Math.round(item.percentage)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Ratings
