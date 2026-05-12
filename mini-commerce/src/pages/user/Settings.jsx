import React, { useState, useEffect } from 'react'
import UserLayout from './UserLayout'
import { FaBell, FaEnvelope, FaMobileAlt, FaSave, FaCheckCircle, FaGlobe, FaMoon, FaLanguage } from 'react-icons/fa'

const UserSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    orderUpdates: true,
    darkMode: false,
    language: 'en'
  })
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('userSettings') || '{}')
    setSettings(prev => ({ ...prev, ...savedSettings }))
  }, [])

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleLanguageChange = (e) => {
    setSettings(prev => ({ ...prev, language: e.target.value }))
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      localStorage.setItem('userSettings', JSON.stringify(settings))
      setMessage('Settings saved successfully!')
      setSaving(false)
      setTimeout(() => setMessage(''), 3000)
    }, 500)
  }

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900">Settings</h1>
            <p className="text-gray-500 mt-2 font-light">Customize your experience</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-md disabled:opacity-50"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <FaSave className="text-sm" />
            )}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {/* Success Message */}
        {message && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600 text-sm flex items-center gap-2 animate-fadeIn">
            <FaCheckCircle />
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notification Preferences */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FaBell className="text-amber-500" />
                Notification Preferences
              </h2>
              <p className="text-sm text-gray-500 mt-1">Choose how you want to be notified</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <FaEnvelope className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive order updates via email</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('emailNotifications')}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                    settings.emailNotifications ? 'bg-amber-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                    settings.emailNotifications ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <FaMobileAlt className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">SMS Notifications</p>
                    <p className="text-sm text-gray-500">Receive order updates via SMS</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('smsNotifications')}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                    settings.smsNotifications ? 'bg-amber-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                    settings.smsNotifications ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <FaBell className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Marketing Emails</p>
                    <p className="text-sm text-gray-500">Receive promotions and special offers</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('marketingEmails')}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                    settings.marketingEmails ? 'bg-amber-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                    settings.marketingEmails ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <FaBell className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Order Updates</p>
                    <p className="text-sm text-gray-500">Receive order status notifications</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('orderUpdates')}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                    settings.orderUpdates ? 'bg-amber-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                    settings.orderUpdates ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Appearance & Language */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FaGlobe className="text-amber-500" />
                  Appearance & Language
                </h2>
                <p className="text-sm text-gray-500 mt-1">Customize your viewing experience</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
                      <FaMoon className="text-white text-sm" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Dark Mode</p>
                      <p className="text-sm text-gray-500">Switch between light and dark theme</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('darkMode')}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                      settings.darkMode ? 'bg-amber-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                      settings.darkMode ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <FaLanguage className="text-white text-sm" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Language</p>
                      <p className="text-sm text-gray-500">Choose your preferred language</p>
                    </div>
                  </div>
                  <select
                    value={settings.language}
                    onChange={handleLanguageChange}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Account Summary */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-semibold text-gray-800 mb-3">Notification Summary</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  • Email notifications are {settings.emailNotifications ? 'enabled' : 'disabled'}
                </p>
                <p className="text-gray-600">
                  • SMS notifications are {settings.smsNotifications ? 'enabled' : 'disabled'}
                </p>
                <p className="text-gray-600">
                  • Marketing emails are {settings.marketingEmails ? 'enabled' : 'disabled'}
                </p>
                <p className="text-gray-600">
                  • Order updates are {settings.orderUpdates ? 'enabled' : 'disabled'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  )
}

export default UserSettings