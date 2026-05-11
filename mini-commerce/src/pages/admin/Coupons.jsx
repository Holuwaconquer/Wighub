import React, { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { FaPlus, FaEdit, FaTrash, FaCopy } from 'react-icons/fa'
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '../../services/api'

const Coupons = () => {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minPurchase: '',
    maxDiscount: '',
    expiryDate: '',
    usageLimit: ''
  })

  useEffect(() => {
    loadCoupons()
  }, [])

  const loadCoupons = async () => {
    try {
      setLoading(true)
      const data = await getCoupons()
      setCoupons(data)
    } catch (error) {
      console.error('Failed to load coupons:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const couponData = {
        ...formData,
        value: parseFloat(formData.value),
        minPurchase: formData.minPurchase ? parseFloat(formData.minPurchase) : 0,
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : 1
      }

      if (editingCoupon) {
        await updateCoupon(editingCoupon._id, couponData)
      } else {
        await createCoupon(couponData)
      }
      
      await loadCoupons()
      setShowModal(false)
      setEditingCoupon(null)
      resetForm()
    } catch (error) {
      console.error('Failed to save coupon:', error)
      alert('Failed to save coupon')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteCoupon(id)
        await loadCoupons()
      } catch (error) {
        console.error('Failed to delete coupon:', error)
        alert('Failed to delete coupon')
      }
    }
  }

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minPurchase: coupon.minPurchase || '',
      maxDiscount: coupon.maxDiscount || '',
      expiryDate: coupon.expiryDate?.split('T')[0] || '',
      usageLimit: coupon.usageLimit || ''
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: '',
      minPurchase: '',
      maxDiscount: '',
      expiryDate: '',
      usageLimit: ''
    })
  }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    alert('Coupon code copied!')
  }

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b83a3] mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading coupons...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Coupons</h1>
          <p className="text-gray-500 mt-1">Manage discount coupons and promo codes</p>
        </div>
        <button
          onClick={() => {
            setEditingCoupon(null)
            resetForm()
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#9b83a3] text-white rounded-lg hover:bg-[#8c6020] transition-colors"
        >
          <FaPlus /> Add Coupon
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div key={coupon._id} className="bg-white rounded-xl p-6 shadow-sm border-2 border-[#9b83a3]/20">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-[#9b83a3]">{coupon.code}</span>
                  <button
                    onClick={() => copyCode(coupon.code)}
                    className="p-1 text-gray-400 hover:text-[#9b83a3]"
                  >
                    <FaCopy />
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `${formatNaira(coupon.value)} OFF`}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(coupon)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(coupon._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {coupon.minPurchase > 0 && (
                <p className="text-gray-600">Min Purchase: {formatNaira(coupon.minPurchase)}</p>
              )}
              {coupon.maxDiscount && (
                <p className="text-gray-600">Max Discount: {formatNaira(coupon.maxDiscount)}</p>
              )}
              <p className="text-gray-600">Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</p>
              <p className="text-gray-600">Used: {coupon.usedCount} / {coupon.usageLimit}</p>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  coupon.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {coupon.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b83a3]"
                    placeholder="e.g., SUMMER20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b83a3]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₦)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formData.type === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount (₦)'}
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b83a3]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Purchase Amount</label>
                  <input
                    type="number"
                    value={formData.minPurchase}
                    onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b83a3]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Discount</label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b83a3]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b83a3]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b83a3]"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#9b83a3] text-white rounded-lg hover:bg-[#8c6020] transition-colors"
                  >
                    {editingCoupon ? 'Update' : 'Create'} Coupon
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
    </AdminLayout>
  )
}

export default Coupons