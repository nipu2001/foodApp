import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

const OwnerLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 p-8 ml-0 lg:ml-64">
        <Outlet />
      </main>
    </div>
  )
}

export default OwnerLayout
