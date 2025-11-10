import { useDarkMode } from '../contexts/DarkModeContext'
import { FiSun, FiMoon } from 'react-icons/fi'

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useDarkMode()

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        <FiSun className="w-6 h-6 text-yellow-500" />
      ) : (
        <FiMoon className="w-6 h-6 text-indigo-600" />
      )}
    </button>
  )
}

export default DarkModeToggle
