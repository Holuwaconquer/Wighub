import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import UserLayout from './UserLayout'
import { FaArrowLeft, FaTruck, FaCheckCircle, FaClock, FaBox, FaMapMarkerAlt, FaCreditCard, FaTag, FaStar } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { createReview, getUserReviews } from '../../services/api'
import api from '../../services/api'

const UserOrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [reviewData, setReviewData] = useState({
    rating: 5,
    title: '',
    comment: ''
  })
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewedProducts, setReviewedProducts] = useState([])

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const orderResponse = await api.get(`/orders/${id}`)
        setOrder(orderResponse.data)

        try {
          const userReviews = await getUserReviews()
          const reviewedProductIds = Array.isArray(userReviews)
            ? userReviews.map((review) => getProductId(review.product))
            : []
          setReviewedProducts(reviewedProductIds)
        } catch (innerError) {
          console.warn('Failed to load user reviews:', innerError)
          setReviewedProducts([])
        }
      } catch (error) {
        console.error('Failed to fetch order:', error)
        navigate('/user/orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id, navigate])

  const getProductId = (product) => String(product?._id || product)

  const handleSubmitReview = async () => {
    if (!selectedProduct || !reviewData.title.trim() || !reviewData.comment.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setReviewLoading(true)
      const productId = getProductId(selectedProduct.product || selectedProduct._id || selectedProduct)
      await createReview({
        product: productId,
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment
      })
      
      setReviewedProducts((prev) => [...new Set([...prev, productId])])
      setShowReviewModal(false)
      setReviewData({ rating: 5, title: '', comment: '' })
      setSelectedProduct(null)
      toast.success('Review submitted successfully!')
    } catch (error) {
      console.error('Failed to submit review:', error)
      toast.error(error?.response?.data?.message || error.message || 'Failed to submit review')
    } finally {
      setReviewLoading(false)
    }
  }

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-700'
      case 'processing': return 'bg-blue-100 text-blue-700'
      case 'shipped': return 'bg-purple-100 text-purple-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-amber-100 text-amber-700'
    }
  }

  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center py-20">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-2 border-gray-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-amber-500 absolute top-0 left-0"></div>
          </div>
        </div>
      </UserLayout>
    )
  }

  if (!order) return null

  const timelineSteps = [
    { status: 'pending', label: 'Order Placed', icon: <FaClock />, date: order.createdAt },
    { status: 'processing', label: 'Processing', icon: <FaClock />, date: order.processingDate },
    { status: 'shipped', label: 'Shipped', icon: <FaTruck />, date: order.shippedDate },
    { status: 'delivered', label: 'Delivered', icon: <FaCheckCircle />, date: order.deliveredDate }
  ]

  const currentStepIndex = timelineSteps.findIndex(step => step.status === order.status)
  const progressWidth = currentStepIndex >= 0 ? (currentStepIndex / (timelineSteps.length - 1)) * 100 : 0

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <button
            onClick={() => navigate('/user/orders')}
            className="flex items-center gap-2 text-gray-500 hover:text-amber-600 transition-colors mb-6 group"
          >
            <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
            <span className="font-light">Back to Orders</span>
          </button>
          
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900">
                Order <span className="font-mono text-amber-600">{order.orderId}</span>
              </h1>
              <p className="text-gray-500 mt-2 font-light flex items-center gap-2">
                <FaClock className="text-sm" />
                Placed on {new Date(order.createdAt).toLocaleDateString('en-NG', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}>
              {order.status === 'delivered' && <FaCheckCircle />}
              {order.status === 'shipped' && <FaTruck />}
              {order.status === 'processing' && <FaClock />}
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FaBox className="text-amber-500" />
                  Order Items
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-5">
                      <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl shadow-md" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
                        <div className="flex flex-wrap gap-3 mt-2">
                          <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                          {item.size && <span className="text-sm text-gray-500">Size: {item.size}</span>}
                          {item.color && <span className="text-sm text-gray-500">Color: {item.color}</span>}
                        </div>
                        <p className="text-amber-600 font-bold text-lg mt-3">{formatNaira(item.price * item.quantity)}</p>
                        
                        {/* Review Button - Only show if order is delivered */}
                        {order.status === 'delivered' && !reviewedProducts.includes(getProductId(item.product)) && (
                          <button
                            onClick={() => {
                              setSelectedProduct(item)
                              setShowReviewModal(true)
                            }}
                            className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
                          >
                            Write a Review
                          </button>
                        )}
                        {reviewedProducts.includes(getProductId(item.product)) && order.status === 'delivered' && (
                          <div className="mt-4 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                            ✓ Review submitted
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-24">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-800">{formatNaira(order.itemsPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-800">
                    {order.shippingPrice === 0 ? 'Free' : formatNaira(order.shippingPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping Method</span>
                  <span className="font-medium text-gray-800">{order.shippingLocation?.name || 'Standard'}</span>
                </div>
                {order.coupon && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span className="flex items-center gap-1">
                      <FaTag className="text-xs" />
                      Discount ({order.coupon.code})
                    </span>
                    <span>-{formatNaira(order.coupon.discount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-4 mt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">{formatNaira(order.totalPrice)}</span>
                  </div>
                  {order.coupon && (
                    <p className="text-xs text-emerald-600 mt-1 text-right">Saved {formatNaira(order.coupon.discount)}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-amber-500" />
                  Shipping Address
                </h2>
              </div>
              <div className="p-6 space-y-2">
                <p className="font-semibold text-gray-800">{order.shippingAddress.fullName}</p>
                <p className="text-gray-600">{order.shippingAddress.address}</p>
                <p className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p className="text-gray-600">{order.shippingAddress.zipCode}</p>
                <p className="text-gray-600">Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FaCreditCard className="text-amber-500" />
                  Payment Method
                </h2>
              </div>
              <div className="p-6">
                <p className="font-medium text-gray-800 capitalize">
                  {order.paymentMethod || 'Card Payment'}
                </p>
                {order.paymentResult && (
                  <p className="text-sm text-emerald-600 mt-2">Payment confirmed</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-xl font-semibold text-gray-900">Order Status Timeline</h2>
          </div>
          <div className="p-8">
            <div className="relative">
              <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 rounded-full"></div>
              <div 
                className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                style={{ width: `${progressWidth}%` }}
              ></div>
              <div className="relative flex justify-between">
                {timelineSteps.map((step, idx) => (
                  <div key={idx} className="text-center" style={{ flex: 1 }}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-300 ${
                      idx <= currentStepIndex 
                        ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg' 
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      {step.icon}
                    </div>
                    <p className={`text-sm font-medium ${idx <= currentStepIndex ? 'text-gray-800' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    {step.date && (
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(step.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-semibold text-gray-900">Write a Review</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedProduct?.name}</p>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewData({ ...reviewData, rating: star })}
                        className={`text-3xl transition-colors ${
                          star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Review Title</label>
                  <input
                    type="text"
                    value={reviewData.title}
                    onChange={(e) => setReviewData({ ...reviewData, title: e.target.value })}
                    placeholder="e.g., Great quality product!"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                    placeholder="Share your experience with this product..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white flex gap-3">
                <button
                  onClick={() => {
                    setShowReviewModal(false)
                    setSelectedProduct(null)
                    setReviewData({ rating: 5, title: '', comment: '' })
                  }}
                  disabled={reviewLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={reviewLoading}
                  className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium disabled:opacity-50"
                >
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  )
}

export default UserOrderDetails