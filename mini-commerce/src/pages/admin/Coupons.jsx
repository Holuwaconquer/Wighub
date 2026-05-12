import React, { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { FaPlus, FaEdit, FaTrash, FaCopy, FaTag, FaPercentage, FaCalendarAlt, FaUsers } from 'react-icons/fa'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
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
        toast.success('Coupon updated successfully')
      } else {
        await createCoupon(couponData)
        toast.success('Coupon created successfully')
      }
      
      await loadCoupons()
      setShowModal(false)
      setEditingCoupon(null)
      resetForm()
    } catch (error) {
      console.error('Failed to save coupon:', error)
      toast.error('Failed to save coupon')
    }
  }

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete coupon?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'bg-red-600 text-white px-4 py-2 rounded-lg',
        cancelButton: 'bg-gray-200 text-gray-800 px-4 py-2 rounded-lg'
      }
    })

    if (!result.isConfirmed) return

    try {
      await deleteCoupon(id)
      await loadCoupons()
      toast.success('Coupon deleted successfully')
    } catch (error) {
      console.error('Failed to delete coupon:', error)
      toast.error('Failed to delete coupon')
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
    toast.success('Coupon code copied!')
  }

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date()
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-2 border-gray-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-amber-500 absolute top-0 left-0"></div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl font-light tracking-tight text-gray-900">Coupons</h1>
            <p className="text-gray-500 mt-1 font-light">Manage discount codes and promotions</p>
          </div>
          <button
            onClick={() => {
              setEditingCoupon(null)
              resetForm()
              setShowModal(true)
            }}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-md"
          >
            <FaPlus className="text-sm" />
            Create Coupon
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
            <FaTag className="text-purple-600 text-xl mb-2" />
            <p className="text-2xl font-bold text-gray-800">{coupons.length}</p>
            <p className="text-xs text-gray-600">Total Coupons</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <FaPercentage className="text-green-600 text-xl mb-2" />
            <p className="text-2xl font-bold text-gray-800">{coupons.filter(c => c.type === 'percentage').length}</p>
            <p className="text-xs text-gray-600">Percentage Discounts</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <FaCalendarAlt className="text-blue-600 text-xl mb-2" />
            <p className="text-2xl font-bold text-gray-800">{coupons.filter(c => !isExpired(c.expiryDate)).length}</p>
            <p className="text-xs text-gray-600">Active Coupons</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
            <FaUsers className="text-amber-600 text-xl mb-2" />
            <p className="text-2xl font-bold text-gray-800">{coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0)}</p>
            <p className="text-xs text-gray-600">Total Uses</p>
          </div>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => {
            const expired = isExpired(coupon.expiryDate)
            const usagePercent = (coupon.usedCount / coupon.usageLimit) * 100
            
            return (
              <div key={coupon._id} className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                expired ? 'border-gray-200 opacity-60' : 'border-amber-200'
              }`}>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-mono font-bold text-amber-600">{coupon.code}</span>
                        <button
                          onClick={() => copyCode(coupon.code)}
                          className="p-1.5 text-gray-400 hover:text-amber-600 transition-colors rounded-lg hover:bg-amber-50"
                        >
                          <FaCopy />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-800">
                          {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `${formatNaira(coupon.value)} OFF`}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                    {coupon.minPurchase > 0 && (
                      <p className="text-gray-600">Min Purchase: {formatNaira(coupon.minPurchase)}</p>
                    )}
                    {coupon.maxDiscount && (
                      <p className="text-gray-600">Max Discount: {formatNaira(coupon.maxDiscount)}</p>
                    )}
                    <p className="text-gray-600 flex items-center gap-2">
                      <FaCalendarAlt className="text-xs" />
                      Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                    </p>
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Usage</span>
                        <span>{coupon.usedCount} / {coupon.usageLimit}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-amber-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${Math.min(usagePercent, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      expired ? 'bg-gray-100 text-gray-600' : 
                      coupon.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {expired ? 'Expired' : coupon.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {coupons.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTag className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-xl font-light text-gray-800 mb-2">No coupons yet</h3>
            <p className="text-gray-500 mb-6">Create your first coupon to start offering discounts</p>
            <button
              onClick={() => {
                setEditingCoupon(null)
                resetForm()
                setShowModal(true)
              }}
              className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all"
            >
              Create Coupon
            </button>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5">
                <h2 className="text-2xl font-light text-gray-800">
                  {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all font-mono"
                    placeholder="e.g., SUMMER20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₦)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.type === 'percentage' ? 'Discount Percentage' : 'Discount Amount (₦)'}
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Purchase (₦)</label>
                  <input
                    type="number"
                    value={formData.minPurchase}
                    onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Discount (₦)</label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="Unlimited"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="1"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 font-medium"
                  >
                    {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
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
    </AdminLayout>
  )
}

export default Coupons  