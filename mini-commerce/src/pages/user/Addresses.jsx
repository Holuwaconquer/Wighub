import React, { useState, useEffect } from 'react'
import UserLayout from './UserLayout'
import { FaPlus, FaEdit, FaTrash, FaMapMarkerAlt, FaHome } from 'react-icons/fa'

const Addresses = () => {
  const [addresses, setAddresses] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    const savedAddresses = JSON.parse(localStorage.getItem('addresses') || '[]')
    const userAddresses = savedAddresses.filter(addr => addr.userEmail === user?.email)
    setAddresses(userAddresses)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    
    if (editingAddress) {
      const updatedAddresses = addresses.map(addr =>
        addr.id === editingAddress.id ? { ...formData, id: addr.id, userEmail: user.email } : addr
      )
      setAddresses(updatedAddresses)
      const allAddresses = JSON.parse(localStorage.getItem('addresses') || '[]')
      const updatedAll = allAddresses.map(addr =>
        addr.id === editingAddress.id ? { ...formData, id: addr.id, userEmail: user.email } : addr
      )
      localStorage.setItem('addresses', JSON.stringify(updatedAll))
    } else {
      const newAddress = {
        id: Date.now(),
        ...formData,
        userEmail: user.email
      }
      const updatedAddresses = [...addresses, newAddress]
      setAddresses(updatedAddresses)
      const allAddresses = JSON.parse(localStorage.getItem('addresses') || '[]')
      allAddresses.push(newAddress)
      localStorage.setItem('addresses', JSON.stringify(allAddresses))
    }
    
    setShowModal(false)
    setEditingAddress(null)
    setFormData({
      fullName: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      isDefault: false
    })
  }

  const handleEdit = (address) => {
    setEditingAddress(address)
    setFormData(address)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const updatedAddresses = addresses.filter(addr => addr.id !== id)
      setAddresses(updatedAddresses)
      const allAddresses = JSON.parse(localStorage.getItem('addresses') || '[]')
      const updatedAll = allAddresses.filter(addr => addr.id !== id)
      localStorage.setItem('addresses', JSON.stringify(updatedAll))
    }
  }

  const setAsDefault = (id) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }))
    setAddresses(updatedAddresses)
    const allAddresses = JSON.parse(localStorage.getItem('addresses') || '[]')
    const updatedAll = allAddresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }))
    localStorage.setItem('addresses', JSON.stringify(updatedAll))
  }

  return (
    <UserLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Addresses</h1>
          <p className="text-gray-500 mt-1">Manage your shipping addresses</p>
        </div>
        <button
          onClick={() => {
            setEditingAddress(null)
            setFormData({
              fullName: '',
              phone: '',
              address: '',
              city: '',
              state: '',
              zipCode: '',
              isDefault: false
            })
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#9b83a3] text-white rounded-lg hover:bg-[#8c6020] transition-colors"
        >
          <FaPlus /> Add New Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div key={address.id} className={`bg-white rounded-xl p-6 shadow-sm border-2 border-gray-300 ${address.isDefault ? 'border-[#9b83a3]' : 'border-transparent'}`}>
            {address.isDefault && (
              <div className="flex justify-end mb-2">
                <span className="text-xs bg-[#9b83a3] text-white px-2 py-1 rounded-full">Default</span>
              </div>
            )}
            <div className="flex items-start gap-3 mb-4">
              <FaMapMarkerAlt className="text-[#9b83a3] text-xl mt-1" />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{address.fullName}</p>
                <p className="text-gray-600">{address.address}</p>
                <p className="text-gray-600">{address.city}, {address.state} {address.zipCode}</p>
                <p className="text-gray-500 text-sm mt-1">Phone: {address.phone}</p>
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-300">
              {!address.isDefault && (
                <button
                  onClick={() => setAsDefault(address.id)}
                  className="text-sm text-[#9b83a3] hover:underline"
                >
                  Set as Default
                </button>
              )}
              <button
                onClick={() => handleEdit(address)}
                className="text-sm text-blue-600 hover:underline"
              >
                <FaEdit className="inline mr-1" /> Edit
              </button>
              <button
                onClick={() => handleDelete(address.id)}
                className="text-sm text-red-600 hover:underline"
              >
                <FaTrash className="inline mr-1" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {addresses.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center">
          <FaHome className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No addresses saved yet</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b83a3]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b83a3]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b83a3]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b83a3]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b83a3]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b83a3]"
                  />
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-4 h-4 accent-[#9b83a3]"
                  />
                  <span className="text-sm text-gray-700">Set as default address</span>
                </label>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#9b83a3] text-white rounded-lg hover:bg-[#8c6020] transition-colors"
                  >
                    {editingAddress ? 'Update' : 'Save'} Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  )
}

export default Addresses