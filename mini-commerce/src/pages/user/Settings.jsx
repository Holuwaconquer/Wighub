import React, { useState, useEffect } from 'react'
import UserLayout from './UserLayout'
import { FaBell, FaEnvelope, FaMobileAlt, FaSave } from 'react-icons/fa'

const UserSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    orderUpdates: true
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('userSettings') || '{}')
    setSettings(prev => ({ ...prev, ...savedSettings }))
  }, [])

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings))
    setMessage('Settings saved successfully!')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <UserLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your preferences</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-[#9b83a3] text-white rounded-lg hover:bg-[#8c6020] transition-colors"
        >
          <FaSave /> Save Settings
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-600 rounded-lg">
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-[#9b83a3] text-xl" />
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive order updates via email</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('emailNotifications')}
                className={`w-12 h-6 rounded-full transition-colors ${settings.emailNotifications ? 'bg-[#9b83a3]' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FaMobileAlt className="text-[#9b83a3] text-xl" />
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-gray-500">Receive order updates via SMS</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('smsNotifications')}
                className={`w-12 h-6 rounded-full transition-colors ${settings.smsNotifications ? 'bg-[#9b83a3]' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.smsNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FaBell className="text-[#9b83a3] text-xl" />
                <div>
                  <p className="font-medium">Marketing Emails</p>
                  <p className="text-sm text-gray-500">Receive promotions and offers</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('marketingEmails')}
                className={`w-12 h-6 rounded-full transition-colors ${settings.marketingEmails ? 'bg-[#9b83a3]' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.marketingEmails ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FaBell className="text-[#9b83a3] text-xl" />
                <div>
                  <p className="font-medium">Order Updates</p>
                  <p className="text-sm text-gray-500">Receive order status updates</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('orderUpdates')}
                className={`w-12 h-6 rounded-full transition-colors ${settings.orderUpdates ? 'bg-[#9b83a3]' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.orderUpdates ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  )
}

export default UserSettings