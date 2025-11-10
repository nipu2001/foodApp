import { getMealIcon, formatCurrency, isOrderingClosed } from '../utils/helpers'
import { FiStar, FiShoppingCart, FiClock } from 'react-icons/fi'

const FoodCard = ({ food, onOrder }) => {
  const categoryOrderingClosed = isOrderingClosed(food.category)

  return (
    <div className="card hover:transform hover:scale-105 animate-fade-in">
      {/* Food Image */}
      <div className="relative overflow-hidden rounded-xl mb-4 h-48">
        <img
          src={food.image || 'https://via.placeholder.com/400x300?text=Food+Item'}
          alt={food.name}
          className="w-full h-full object-cover"
        />
        {/* Category Badge */}
        <div className={`absolute top-3 left-3 badge badge-${food.category.toLowerCase()}`}>
          <span>{getMealIcon(food.category)}</span>
          <span>{food.category}</span>
        </div>
        
        {/* Closed Badge */}
        {categoryOrderingClosed && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
            <FiClock className="w-3 h-3" />
            <span>Closed</span>
          </div>
        )}
      </div>

      {/* Food Details */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{food.name}</h3>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {formatCurrency(food.price)}
          </span>
          
          {food.rating && (
            <div className="flex items-center space-x-1">
              <FiStar className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">{food.rating}</span>
            </div>
          )}
        </div>

        {/* Description if available */}
        {food.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{food.description}</p>
        )}

        {/* Order Button */}
        <button
          onClick={() => !categoryOrderingClosed && onOrder(food)}
          disabled={categoryOrderingClosed}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
            categoryOrderingClosed
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'btn-primary'
          }`}
        >
          {categoryOrderingClosed ? (
            <>
              <FiClock className="w-4 h-4" />
              <span>Ordering Closed</span>
            </>
          ) : (
            <>
              <FiShoppingCart className="w-4 h-4" />
              <span>Order Now</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default FoodCard
