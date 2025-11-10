import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { FiPhone, FiMapPin, FiStar } from 'react-icons/fi'

const ProfilePage = () => {
  const { user } = useAuth()
  
  const [profile, setProfile] = useState({
    name: user?.name || 'User',
    email: user?.email || 'user@example.com',
    phone: '+1 234 567 8900',
    address: '123 Main Street, Apt 4B\nNew York, NY 10001',
  })

  // Update profile when user changes
  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.name || user.username || 'User',
        email: user.email || 'user@example.com',
      }))
      setFormData(prev => ({
        ...prev,
        name: user.name || user.username || 'User',
        email: user.email || 'user@example.com',
      }))
    }
  }, [user])

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(profile)

  const handleSave = () => {
    setProfile(formData)
    setIsEditing(false)
    alert('Profile updated successfully!')
  }

  const handleCancel = () => {
    setFormData(profile)
    setIsEditing(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white font-bold text-5xl mx-auto mb-4">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">{profile.name}</h2>
            <p className="text-gray-600 mb-4">{profile.email}</p>
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2 text-gray-700 dark:text-gray-300">
                <FiPhone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-start justify-center space-x-2 text-gray-700 dark:text-gray-300">
                <FiMapPin className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-left">{profile.address.split('\n').join(', ')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Personal Information</h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input-field resize-none"
                    rows="3"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Full Name
                  </label>
                  <p className="text-lg text-gray-800">{profile.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Email Address
                  </label>
                  <p className="text-lg text-gray-800">{profile.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Phone Number
                  </label>
                  <p className="text-lg text-gray-800">{profile.phone}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Delivery Address
                  </label>
                  <p className="text-lg text-gray-800 whitespace-pre-line">{profile.address}</p>
                </div>
              </div>
            )}
          </div>

          {/* Order Statistics */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="card text-center bg-gradient-to-br from-primary-50 to-primary-100">
              <div className="text-3xl font-bold text-primary-600 mb-1">24</div>
              <div className="text-sm text-gray-700">Total Orders</div>
            </div>
            <div className="card text-center bg-gradient-to-br from-accent-50 to-accent-100">
              <div className="text-3xl font-bold text-accent-600 mb-1">$342</div>
              <div className="text-sm text-gray-700">Total Spent</div>
            </div>
            <div className="card text-center bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30">
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1 flex items-center justify-center">
                4.8 <FiStar className="w-7 h-7 ml-1" />
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">Avg Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
