import React, { useState, useEffect } from 'react'
import UserLayout from './UserLayout'
import { FaPlus, FaEdit, FaTrash, FaMapMarkerAlt, FaHome, FaCheckCircle, FaTimes } from 'react-icons/fa'
import { HiOutlineLocationMarker } from 'react-icons/hi'

const Addresses = () => {
  const [addresses, setAddresses] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [toastMessage, setToastMessage] = useState('')
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

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type })
    setTimeout(() => setToastMessage(null), 3000)
  }

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
      showToast('Address updated successfully!')
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
      showToast('Address added successfully!')
    }
    
    setShowModal(false)
    setEditingAddress(null)
    resetForm()
  }

  const resetForm = () => {
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
    const updatedAddresses = addresses.filter(addr => addr.id !== id)
    setAddresses(updatedAddresses)
    const allAddresses = JSON.parse(localStorage.getItem('addresses') || '[]')
    const updatedAll = allAddresses.filter(addr => addr.id !== id)
    localStorage.setItem('addresses', JSON.stringify(updatedAll))
    showToast('Address deleted successfully!', 'info')
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
    showToast('Default address updated!')
  }

  const defaultAddress = addresses.find(addr => addr.isDefault)

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Toast Notification */}
        {toastMessage && (
          <div className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-xl shadow-2xl backdrop-blur-md animate-slideUp ${
            toastMessage.type === 'success' ? 'bg-green-500 text-white' : 'bg-gray-800 text-white'
          }`}>
            {toastMessage.message}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900">My Addresses</h1>
            <p className="text-gray-500 mt-2 font-light">Manage your shipping locations</p>
          </div>
          <button
            onClick={() => {
              setEditingAddress(null)
              resetForm()
              setShowModal(true)
            }}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-md"
          >
            <FaPlus className="text-sm" />
            Add New Address
          </button>
        </div>

        {/* Default Address Highlight */}
        {defaultAddress && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                <FaHome className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded-full">DEFAULT ADDRESS</span>
                </div>
                <p className="font-semibold text-gray-800">{defaultAddress.fullName}</p>
                <p className="text-gray-600 text-sm">{defaultAddress.address}</p>
                <p className="text-gray-600 text-sm">{defaultAddress.city}, {defaultAddress.state} {defaultAddress.zipCode}</p>
                <p className="text-gray-500 text-sm mt-1">Phone: {defaultAddress.phone}</p>
              </div>
            </div>
          </div>
        )}

        {/* Addresses Grid */}
        {addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div 
                key={address.id} 
                className={`group bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                  address.isDefault ? 'border-amber-400' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="p-6">
                  {address.isDefault && (
                    <div className="flex justify-end mb-3">
                      <span className="text-xs bg-amber-500 text-white px-3 py-1 rounded-full flex items-center gap-1">
                        <FaCheckCircle className="text-xs" />
                        Default
                      </span>
                    </div>
                  )}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      address.isDefault ? 'bg-amber-500' : 'bg-gray-100'
                    }`}>
                      <HiOutlineLocationMarker className={`text-xl ${address.isDefault ? 'text-white' : 'text-gray-500'}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-lg">{address.fullName}</p>
                      <p className="text-gray-600 mt-1">{address.address}</p>
                      <p className="text-gray-600">{address.city}, {address.state} {address.zipCode}</p>
                      <p className="text-gray-500 text-sm mt-2">📞 {address.phone}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    {!address.isDefault && (
                      <button
                        onClick={() => setAsDefault(address.id)}
                        className="text-sm text-amber-600 hover:text-amber-700 transition-colors font-medium"
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(address)}
                      className="text-sm text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                    >
                      <FaEdit className="text-xs" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="text-sm text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
                    >
                      <FaTrash className="text-xs" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaMapMarkerAlt className="text-4xl text-gray-400" />
            </div>
            <h2 className="text-2xl font-light text-gray-800 mb-2">No Addresses Saved</h2>
            <p className="text-gray-500 mb-6">Add your first shipping address to get started</p>
            <button
              onClick={() => {
                setEditingAddress(null)
                resetForm()
                setShowModal(true)
              }}
              className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300"
            >
              Add New Address
            </button>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 flex justify-between items-center">
                <h2 className="text-2xl font-light text-gray-800">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                    placeholder="+234 XXX XXX XXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                    placeholder="House number and street name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                      placeholder="Lagos"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                      placeholder="Lagos"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code (Optional)</label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                    placeholder="100001"
                  />
                </div>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-400"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                    Set as default address
                  </span>
                </label>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 font-medium"
                  >
                    {editingAddress ? 'Update Address' : 'Save Address'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  )
}

export default Addresses