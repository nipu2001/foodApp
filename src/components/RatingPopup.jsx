import { useState } from 'react'
import { FiStar, FiX, FiSend } from 'react-icons/fi'

const RatingPopup = ({ order, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit({ rating, comment, orderId: order.id })
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full animate-scale-in shadow-soft-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <FiStar className="w-16 h-16 text-yellow-400 fill-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Rate Your Order</h2>
          <p className="text-gray-600">How was your meal experience?</p>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">Order #{order.id}</p>
          {order.items.map((item, index) => (
            <p key={index} className="text-gray-800 font-medium">
              {item.quantity}x {item.name}
            </p>
          ))}
        </div>

        {/* Star Rating */}
        <div className="flex justify-center space-x-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-all duration-200 transform hover:scale-110"
            >
              <FiStar 
                className={`w-12 h-12 ${
                  star <= (hoveredRating || rating) 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-gray-300'
                }`} 
              />
            </button>
          ))}
        </div>

        {/* Rating Labels */}
        <div className="text-center mb-6">
          {rating > 0 && (
            <p className="text-lg font-semibold text-primary-600 animate-fade-in">
              {rating === 5 && 'Excellent!'}
              {rating === 4 && 'Great!'}
              {rating === 3 && 'Good'}
              {rating === 2 && 'Could be better'}
              {rating === 1 && 'Poor'}
            </p>
          )}
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add a comment (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us more about your experience..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 resize-none"
            rows="4"
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <FiX className="w-5 h-5" />
            <span>Skip</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0}
            className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 ${
              rating === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'btn-primary'
            }`}
          >
            <FiSend className="w-5 h-5" />
            <span>Submit</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default RatingPopup
