 
import React, { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { FaSave, FaStore, FaShippingFast, FaCreditCard, FaBell } from 'react-icons/fa'

const Settings = () => {
  const [settings, setSettings] = useState({
    store: {
      name: 'Minka Luxury Hair',
      email: 'hello@minka.com',
      phone: '+234 800 000 0000',
      address: 'Lagos, Nigeria',
      currency: 'NGN',
      timezone: 'Africa/Lagos'
    },
    shipping: {
      freeShippingThreshold: 500000,
      shippingCost: 15000,
      processingTime: '1-3 days',
      deliveryEstimate: '3-7 days'
    },
    payment: {
      methods: ['card', 'bank', 'cod'],
      codEnabled: true,
      bankTransferEnabled: true
    },
    notifications: {
      orderEmail: true,
      orderSMS: false,
      marketingEmails: true,
      lowStockAlert: true
    }
  })

  const [saved, setSaved] = useState(false)

  const handleStoreChange = (e) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      store: { ...prev.store, [name]: value }
    }))
  }

  const handleShippingChange = (e) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      shipping: { ...prev.shipping, [name]: value }
    }))
  }

  const handleSave = () => {
    localStorage.setItem('storeSettings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your store configuration</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-[#8a0fb3] text-white rounded-lg hover:bg-[#b98800] transition-colors"
        >
          <FaSave /> Save Changes
        </button>
      </div>

      {saved && (
        <div className="mb-4 p-3 bg-green-100 text-green-600 rounded-lg">
          Settings saved successfully!
        </div>
      )}

      <div className="space-y-6">
        {/* Store Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FaStore className="text-2xl text-[#8a0fb3]" />
            <h2 className="text-xl font-bold">Store Settings</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
              <input
                type="text"
                name="name"
                value={settings.store.name}
                onChange={handleStoreChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a0fb3]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Email</label>
              <input
                type="email"
                name="email"
                value={settings.store.email}
                onChange={handleStoreChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a0fb3]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={settings.store.phone}
                onChange={handleStoreChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a0fb3]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Address</label>
              <input
                type="text"
                name="address"
                value={settings.store.address}
                onChange={handleStoreChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a0fb3]"
              />
            </div>
          </div>
        </div>

        {/* Shipping Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FaShippingFast className="text-2xl text-[#8a0fb3]" />
            <h2 className="text-xl font-bold">Shipping Settings</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Threshold (₦)</label>
              <input
                type="number"
                name="freeShippingThreshold"
                value={settings.shipping.freeShippingThreshold}
                onChange={handleShippingChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a0fb3]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Standard Shipping Cost (₦)</label>
              <input
                type="number"
                name="shippingCost"
                value={settings.shipping.shippingCost}
                onChange={handleShippingChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a0fb3]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Processing Time</label>
              <input
                type="text"
                name="processingTime"
                value={settings.shipping.processingTime}
                onChange={handleShippingChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a0fb3]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Estimate</label>
              <input
                type="text"
                name="deliveryEstimate"
                value={settings.shipping.deliveryEstimate}
                onChange={handleShippingChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a0fb3]"
              />
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FaCreditCard className="text-2xl text-[#8a0fb3]" />
            <h2 className="text-xl font-bold">Payment Settings</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.payment.codEnabled}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  payment: { ...prev.payment, codEnabled: e.target.checked }
                }))}
                className="w-4 h-4 accent-[#8a0fb3]"
              />
              <span>Enable Cash on Delivery</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.payment.bankTransferEnabled}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  payment: { ...prev.payment, bankTransferEnabled: e.target.checked }
                }))}
                className="w-4 h-4 accent-[#8a0fb3]"
              />
              <span>Enable Bank Transfer</span>
            </label>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FaBell className="text-2xl text-[#8a0fb3]" />
            <h2 className="text-xl font-bold">Notification Settings</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.notifications.orderEmail}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, orderEmail: e.target.checked }
                }))}
                className="w-4 h-4 accent-[#8a0fb3]"
              />
              <span>Send order confirmation emails</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.notifications.lowStockAlert}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, lowStockAlert: e.target.checked }
                }))}
                className="w-4 h-4 accent-[#8a0fb3]"
              />
              <span>Low stock alerts</span>
            </label>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Settings