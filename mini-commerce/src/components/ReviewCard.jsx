import React from 'react'
import { FaStar, FaStarHalfAlt, FaRegStar, FaCheckCircle } from 'react-icons/fa'

const ReviewCard = ({ review }) => {
  const defaultReview = {
    name: "Sarah M.",
    rating: 5,
    date: "March 2025",
    verified: true,
    text: "I'm blown away by the quality of the hair I received from Minka Luxury Hair. The bundles are soft, tangle-free, and blend perfectly with my natural hair. Best investment I've made for my hair!",
    location: "New York, USA"
  }

  const data = review || defaultReview

  // Render stars function
  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />)
      } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 text-sm" />)
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400 text-sm" />)
      }
    }
    return stars
  }

  return (
    <div className='bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col'>
      {/* Rating Stars */}
      <div className='flex gap-1 mb-3'>
        {renderStars(data.rating)}
      </div>
      
      {/* Customer Info */}
      <div className='flex items-center gap-2 mb-3 flex-wrap'>
        <h3 className='font-bold text-lg text-gray-800'>{data.name}</h3>
        {data.verified && (
          <div className='flex items-center gap-1'>
            <FaCheckCircle className='text-green-500 text-sm' />
            <span className='text-green-600 text-xs font-medium'>Verified Buyer</span>
          </div>
        )}
      </div>
      
      {/* Review Text */}
      <p className='text-gray-600 text-sm leading-relaxed mb-3 flex-grow'>
        "{data.text}"
      </p>
      
      {/* Location & Date */}
      <div className='flex justify-between items-center text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100'>
        <span>{data.location}</span>
        <span>{data.date}</span>
      </div>
    </div>
  )
}

export default ReviewCard