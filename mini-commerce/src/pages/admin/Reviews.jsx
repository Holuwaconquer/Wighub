 
import React, { useState } from 'react'
import AdminLayout from './AdminLayout'
import { FaStar, FaTrash, FaCheck, FaTimes, FaSearch } from 'react-icons/fa'

const Reviews = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      customer: 'Sarah Johnson',
      product: '5x5 Closure Wig - Brazilian Straight',
      rating: 5,
      comment: 'Absolutely love this wig! The quality is amazing and it looks so natural.',
      date: '2024-03-15',
      status: 'approved'
    },
    {
      id: 2,
      customer: 'Michael Adebayo',
      product: '28 inches Bone Straight 300grams',
      rating: 4,
      comment: 'Great quality hair, but shipping took a bit longer than expected.',
      date: '2024-03-10',
      status: 'pending'
    },
    {
      id: 3,
      customer: 'Chioma Okonkwo',
      product: '22" 20" 18" inches 300grams Bundle',
      rating: 5,
      comment: 'Best hair I\'ve ever purchased! Will definitely order again.',
      date: '2024-03-05',
      status: 'approved'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const handleApprove = (id) => {
    setReviews(reviews.map(review =>
      review.id === id ? { ...review, status: 'approved' } : review
    ))
  }

  const handleReject = (id) => {
    setReviews(reviews.filter(review => review.id !== id))
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setReviews(reviews.filter(review => review.id !== id))
    }
  }

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.product.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || review.status === filter
    return matchesSearch && matchesFilter
  })

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'} />
    ))
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Product Reviews</h1>
        <p className="text-gray-500 mt-1">Manage customer reviews and ratings</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b83a3]"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b83a3]"
          >
            <option value="all">All Reviews</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-1">{renderStars(review.rating)}</div>
                  <span className="text-gray-500 text-sm">({review.rating}/5)</span>
                </div>
                <h3 className="font-semibold text-gray-800">{review.product}</h3>
                <p className="text-sm text-gray-500">By {review.customer} • {new Date(review.date).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                {review.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(review.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => handleReject(review.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(review.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <p className="text-gray-600">{review.comment}</p>
            <div className="mt-3">
              {review.status === 'approved' ? (
                <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">Published</span>
              ) : (
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full">Pending Review</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}

export default Reviews