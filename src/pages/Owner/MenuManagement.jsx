import { useState } from 'react'
import { useMenu } from '../../contexts/MenuContext'
import { getMealIcon, formatCurrency } from '../../utils/helpers'
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiX, 
  FiSave,
  FiImage,
  FiDollarSign,
  FiTag,
  FiUpload,
  FiLink,
  FiLoader
} from 'react-icons/fi'
import { MdRestaurantMenu } from 'react-icons/md'
import { IoRestaurantOutline } from 'react-icons/io5'

const MenuManagement = () => {
  const { menuItems, loading, addMenu, updateMenu, deleteMenu } = useMenu()
  
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Breakfast',
    price: '',
    image: '',
    description: ''
  })
  const [editingId, setEditingId] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [uploadMethod, setUploadMethod] = useState('url') // 'file' or 'url'
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    const menuData = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      image: formData.image || imagePreview,
      description: formData.description || `Delicious ${formData.name}`
    }
    
    if (editingId) {
      const result = await updateMenu(editingId, menuData)
      if (result.success) {
        alert('Menu item updated successfully!')
        handleCancel()
      } else {
        alert('Failed to update menu item: ' + result.message)
      }
    } else {
      const result = await addMenu(menuData)
      if (result.success) {
        alert('Menu item added successfully!')
        handleCancel()
      } else {
        alert('Failed to add menu item: ' + result.message)
      }
    }
    
    setSubmitting(false)
  }

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      image: item.image,
      description: item.description || ''
    })
    setImagePreview(item.image)
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      const result = await deleteMenu(id)
      if (result.success) {
        alert('Menu item deleted successfully!')
      } else {
        alert('Failed to delete menu item: ' + result.message)
      }
    }
  }

  const handleCancel = () => {
    setFormData({ name: '', category: 'Breakfast', price: '', image: '', description: '' })
    setImagePreview('')
    setEditingId(null)
    setShowForm(false)
    setUploadMethod('url')
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file')
        return
      }

      // Create a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setFormData({ ...formData, image: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiLoader className="w-12 h-12 text-primary-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2 flex items-center">
              <MdRestaurantMenu className="w-10 h-10 mr-3 text-primary-600 dark:text-primary-400" />
              Menu Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Add, edit, or remove menu items</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              showForm 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'btn-primary'
            }`}
          >
            {showForm ? (
              <>
                <FiX className="w-5 h-5" />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <FiPlus className="w-5 h-5" />
                <span>Add Menu Item</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card dark:bg-gray-800 mb-8 animate-slide-up border-2 border-primary-500 dark:border-primary-400">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
              {editingId ? (
                <>
                  <FiEdit2 className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
                  Edit Menu Item
                </>
              ) : (
                <>
                  <FiPlus className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
                  Add New Menu Item
                </>
              )}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <IoRestaurantOutline className="w-4 h-4 mr-2" />
                Food Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Classic Pancakes"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FiTag className="w-4 h-4 mr-2" />
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field"
                required
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
              </select>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FiDollarSign className="w-4 h-4 mr-2" />
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="9.99"
                className="input-field"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <FiImage className="w-4 h-4 mr-2" />
                Food Image
              </label>

              {/* Upload Method Toggle */}
              <div className="flex space-x-2 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setUploadMethod('file')
                    setFormData({ ...formData, image: '' })
                    setImagePreview('')
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    uploadMethod === 'file'
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <FiUpload className="w-4 h-4" />
                  <span>Upload Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUploadMethod('url')
                    setFormData({ ...formData, image: '' })
                    setImagePreview('')
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    uploadMethod === 'url'
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <FiLink className="w-4 h-4" />
                  <span>Image URL</span>
                </button>
              </div>

              {/* File Upload */}
              {uploadMethod === 'file' && (
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-colors duration-200 bg-gray-50 dark:bg-gray-700"
                    >
                      <div className="text-center">
                        <FiImage className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Click to upload image
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative rounded-xl overflow-hidden border-2 border-primary-500 dark:border-primary-400">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('')
                          setFormData({ ...formData, image: '' })
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* URL Input */}
              {uploadMethod === 'url' && (
                <div className="space-y-3">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({ ...formData, image: e.target.value })
                      setImagePreview(e.target.value)
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="input-field"
                  />
                  
                  {/* URL Image Preview */}
                  {formData.image && (
                    <div className="relative rounded-xl overflow-hidden border-2 border-primary-500 dark:border-primary-400">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+URL'
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex space-x-3">
              <button 
                type="button" 
                onClick={handleCancel} 
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <FiX className="w-5 h-5" />
                <span>Cancel</span>
              </button>
              <button 
                type="submit" 
                className="flex-1 btn-primary flex items-center justify-center space-x-2"
              >
                <FiSave className="w-5 h-5" />
                <span>{editingId ? 'Update Item' : 'Add Item'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Menu Items Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div key={item.id} className="card dark:bg-gray-800 animate-fade-in hover:shadow-soft-lg transition-shadow duration-300">
            {/* Image */}
            <div className="relative overflow-hidden rounded-xl mb-4 h-48">
              <img
                src={item.image || 'https://via.placeholder.com/400x300?text=Food+Item'}
                alt={item.name}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
              <div className={`absolute top-3 left-3 badge badge-${item.category.toLowerCase()}`}>
                <span>{getMealIcon(item.category)}</span>
                <span>{item.category}</span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">{item.name}</h3>
              <div className="flex items-center text-2xl font-bold text-primary-600 dark:text-primary-400">
                <FiDollarSign className="w-5 h-5 mr-1" />
                {item.price.toFixed(2)}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <FiEdit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <FiTrash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {menuItems.length === 0 && (
        <div className="text-center py-20 card dark:bg-gray-800">
          <div className="flex justify-center mb-4">
            <IoRestaurantOutline className="w-24 h-24 text-gray-400 dark:text-gray-600" />
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">No menu items yet</p>
          <p className="text-gray-500 dark:text-gray-500 mb-6">Add your first menu item to get started</p>
          <button 
            onClick={() => setShowForm(true)} 
            className="btn-primary inline-flex items-center space-x-2"
          >
            <FiPlus className="w-5 h-5" />
            <span>Add Menu Item</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default MenuManagement
