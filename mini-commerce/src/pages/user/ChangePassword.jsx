import React, { useState } from 'react'
import UserLayout from './UserLayout'
import { FaLock, FaEye, FaEyeSlash, FaShieldAlt, FaCheckCircle } from 'react-icons/fa'

const ChangePassword = () => {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
    
    if (name === 'newPassword') {
      calculateStrength(value)
    }
  }

  const calculateStrength = (password) => {
    let strength = 0
    if (password.length >= 6) strength++
    if (password.length >= 10) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    setPasswordStrength(Math.min(strength, 4))
  }

  const getStrengthText = () => {
    switch(passwordStrength) {
      case 1: return 'Weak'
      case 2: return 'Fair'
      case 3: return 'Good'
      case 4: return 'Strong'
      default: return ''
    }
  }

  const getStrengthColor = () => {
    switch(passwordStrength) {
      case 1: return 'bg-red-500'
      case 2: return 'bg-orange-500'
      case 3: return 'bg-yellow-500'
      case 4: return 'bg-green-500'
      default: return 'bg-gray-200'
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match')
      return
    }
    
    setLoading(true)
    
    setTimeout(() => {
      setSuccess('Password changed successfully!')
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setPasswordStrength(0)
      setLoading(false)
      setTimeout(() => setSuccess(''), 3000)
    }, 1000)
  }

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900">Change Password</h1>
          <p className="text-gray-500 mt-2 font-light">Update your account security</p>
        </div>

        {/* Security Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
          <div className="flex items-start gap-4">
            <FaShieldAlt className="text-blue-600 text-2xl mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Password Security Tips</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use at least 8 characters</li>
                <li>• Include uppercase and lowercase letters</li>
                <li>• Add numbers and special characters</li>
                <li>• Avoid common words or personal information</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm animate-fadeIn">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600 text-sm flex items-center gap-2 animate-fadeIn">
            <FaCheckCircle />
            {success}
          </div>
        )}

        {/* Password Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-w-2xl">
          <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-xl font-semibold text-gray-900">Change Your Password</h2>
            <p className="text-sm text-gray-500 mt-1">Choose a strong password to keep your account secure</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showCurrent ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showCurrent ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showNew ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showNew ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.newPassword.length > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Password strength:</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength === 1 ? 'text-red-600' :
                      passwordStrength === 2 ? 'text-orange-600' :
                      passwordStrength === 3 ? 'text-yellow-600' :
                      passwordStrength === 4 ? 'text-green-600' : ''
                    }`}>
                      {getStrengthText()}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getStrengthColor()} transition-all duration-300`}
                      style={{ width: `${(passwordStrength / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                <p className="text-xs text-red-500 mt-2">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Changing Password...</span>
                </div>
              ) : (
                'Change Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </UserLayout>
  )
}

export default ChangePassword