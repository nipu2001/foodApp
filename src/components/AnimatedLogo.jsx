import { IoRestaurantOutline } from 'react-icons/io5'

const AnimatedLogo = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  return (
    <div className="inline-flex items-center space-x-2 group">
      <IoRestaurantOutline 
        className={`${sizes[size]} text-primary-600 dark:text-primary-400 group-hover:animate-bounce transition-transform duration-300`}
      />
      <span 
        className={`font-bold bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent ${
          size === 'sm' ? 'text-xl' : size === 'lg' ? 'text-5xl' : 'text-3xl'
        }`}
        style={{
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
      >
        Smart Meal
      </span>
    </div>
  )
}

export default AnimatedLogo
