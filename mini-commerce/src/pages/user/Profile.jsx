import React, { useState, useEffect } from 'react'
import UserLayout from './UserLayout'
import { FaUser, FaEnvelope, FaPhone, FaSave, FaEdit, FaCamera, FaShieldAlt, FaCalendarAlt } from 'react-icons/fa'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null')
    if (userData) {
      setUser(userData)
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || ''
      })
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const updatedUser = { ...user, ...formData }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    setUser(updatedUser)
    setIsEditing(false)
    setMessageType('success')
    setMessage('Profile updated successfully!')
    setTimeout(() => setMessage(''), 3000)
  }

  const getInitials = (name) => {
    return name?.charAt(0).toUpperCase() || 'U'
  }

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900">My Profile</h1>
            <p className="text-gray-500 mt-2 font-light">Manage your personal information</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-md"
            >
              <FaEdit className="text-sm" />
              Edit Profile
            </button>
          )}
        </div>

        {/* Message Toast */}
        {message && (
          <div className={`p-4 rounded-xl ${
            messageType === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
          } animate-fadeIn`}>
            {message}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-12 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                <div className="w-28 h-28 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-white text-5xl font-light">{getInitials(user?.name)}</span>
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors">
                  <FaCamera className="text-gray-600 text-sm" />
                </button>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-light text-white">{user?.name}</h2>
                <p className="text-gray-300 mt-1 flex items-center gap-2 justify-center md:justify-start">
                  <FaShieldAlt className="text-emerald-400 text-sm" />
                  Verified Account
                </p>
                <p className="text-gray-400 text-sm mt-2 flex items-center gap-2 justify-center md:justify-start">
                  <FaCalendarAlt className="text-sm" />
                  Member since {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                        placeholder="+234 XXX XXX XXXX"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 flex items-center gap-2"
                  >
                    <FaSave /> Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-8 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-5 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-2">Full Name</p>
                    <p className="text-lg font-medium text-gray-800">{user?.name}</p>
                  </div>
                  <div className="p-5 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-2">Email Address</p>
                    <p className="text-lg font-medium text-gray-800">{user?.email}</p>
                  </div>
                  <div className="p-5 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-2">Phone Number</p>
                    <p className="text-lg font-medium text-gray-800">{user?.phone || 'Not provided'}</p>
                  </div>
                  <div className="p-5 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-2">Account Status</p>
                    <p className="text-lg font-medium text-emerald-600 flex items-center gap-2">
                      <FaShieldAlt className="text-emerald-500" />
                      Active
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-start gap-4">
            <FaShieldAlt className="text-blue-600 text-2xl mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Account Security</h3>
              <p className="text-sm text-gray-600">
                Your personal information is protected. We never share your data with third parties.
                For security reasons, we recommend keeping your contact information up to date.
              </p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  )
}

export default Profile