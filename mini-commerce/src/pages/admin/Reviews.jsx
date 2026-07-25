import React, { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { FaStar, FaCheck, FaTimes, FaTrash, FaSpinner } from 'react-icons/fa'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { getAllReviews, approveReview, deleteReview } from '../../services/api'

const Reviews = () => {
  const [reviews, setReviews] = useState([])
  const [filteredReviews, setFilteredReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState({})
  const [filter, setFilter] = useState('all') // all, pending, approved, rejected
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadReviews()
  }, [])

  useEffect(() => {
    filterReviews()
  }, [reviews, filter, searchTerm])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const data = await getAllReviews()
      setReviews(Array.isArray(data) ? data : data.reviews || [])
    } catch (error) {
      console.error('Failed to load reviews:', error)
      toast.error(error?.message || 'Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const filterReviews = () => {
    let filtered = reviews

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(review => review.status === filter)
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(review =>
        review.product?.name?.toLowerCase().includes(term) ||
        review.user?.name?.toLowerCase().includes(term) ||
        review.title?.toLowerCase().includes(term) ||
        review.comment?.toLowerCase().includes(term)
      )
    }

    setFilteredReviews(filtered)
  }

  const handleApproveReview = async (reviewId) => {
    const result = await Swal.fire({
      title: 'Approve review? ',
      text: 'This will publish the review on the product page.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve it',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        confirmButton: 'swal2-confirm bg-emerald-600',
        cancelButton: 'swal2-cancel bg-gray-200 text-gray-800'
      }
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      setActionLoading({ ...actionLoading, [reviewId]: true })
      await approveReview(reviewId)
      
      setReviews(reviews.map(review =>
        review._id === reviewId ? { ...review, status: 'approved' } : review
      ))
      toast.success('Review approved successfully!')
    } catch (error) {
      console.error('Failed to approve review:', error)
      toast.error(error?.message || 'Failed to approve review')
    } finally {
      setActionLoading({ ...actionLoading, [reviewId]: false })
    }
  }

  const handleDeleteReview = async (reviewId) => {
    const result = await Swal.fire({
      title: 'Delete review? ',
      text: 'This action cannot be undone. The review will be removed permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        confirmButton: 'swal2-confirm bg-red-600',
        cancelButton: 'swal2-cancel bg-gray-200 text-gray-800'
      }
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      setActionLoading({ ...actionLoading, [reviewId]: true })
      await deleteReview(reviewId)
      
      setReviews(reviews.filter(review => review._id !== reviewId))
      toast.success('Review deleted successfully!')
    } catch (error) {
      console.error('Failed to delete review:', error)
      toast.error(error?.message || 'Failed to delete review')
    } finally {
      setActionLoading({ ...actionLoading, [reviewId]: false })
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'} />
    ))
  }

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    }
    return statusColors[status] || statusColors.pending
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <FaSpinner className="text-4xl text-[#8a0fb3] animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading reviews...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Customer Reviews</h1>
            <p className="text-gray-600 mt-1">Manage and approve customer reviews</p>
          </div>
          <button
            onClick={loadReviews}
            className="px-4 py-2 bg-[#8a0fb3] text-white rounded-lg hover:bg-opacity-90 transition-all"
          >
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search reviews by product, customer, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a0fb3]"
            />

            {/* Status Filter */}
            <div className="flex gap-2">
              {['all', 'pending', 'approved', 'rejected'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === status
                      ? 'bg-[#8a0fb3] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  {status === 'all' && ` (${reviews.length})`}
                  {status === 'pending' && ` (${reviews.filter(r => r.status === 'pending').length})`}
                  {status === 'approved' && ` (${reviews.filter(r => r.status === 'approved').length})`}
                  {status === 'rejected' && ` (${reviews.filter(r => r.status === 'rejected').length})`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map(review => (
              <div key={review._id} className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#8a0fb3]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Product Info */}
                  <div>
                    <h3 className="font-semibold text-gray-800">Product</h3>
                    <p className="text-gray-700">{review.product?.name || 'Unknown Product'}</p>
                  </div>

                  {/* Customer Info */}
                  <div>
                    <h3 className="font-semibold text-gray-800">Customer</h3>
                    <p className="text-gray-700">{review.user?.name || 'Anonymous'}</p>
                    <p className="text-sm text-gray-500">{review.user?.email}</p>
                  </div>
                </div>

                {/* Review Content */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex gap-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="font-semibold">{review.title}</span>
                    {review.isVerified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        ✓ Verified Purchase
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>

                {/* Status and Date */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadge(review.status)}`}>
                      {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {review.createdAt && new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Actions */}
                {review.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveReview(review._id)}
                      disabled={actionLoading[review._id]}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-all"
                    >
                      {actionLoading[review._id] ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <>
                          <FaCheck /> Approve
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      disabled={actionLoading[review._id]}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 transition-all"
                    >
                      {actionLoading[review._id] ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <>
                          <FaTimes /> Reject
                        </>
                      )}
                    </button>
                  </div>
                )}

                {review.status === 'approved' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      disabled={actionLoading[review._id]}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 transition-all"
                    >
                      {actionLoading[review._id] ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <>
                          <FaTrash /> Delete
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <p className="text-gray-500 text-lg">No reviews found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default Reviews