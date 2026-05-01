import React, { useRef, useEffect, useState } from 'react'
import ReviewCard from './ReviewCard'
import { FaArrowLeft, FaArrowRight , FaStar} from 'react-icons/fa'

const CustomerReview = () => {
  const scrollContainerRef = useRef(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  const reviews = [
    {
      id: 1,
      name: "Sarah M.",
      rating: 5,
      date: "March 2025",
      verified: true,
      text: "Absolutely love my new wig! The quality is amazing and it looks so natural. The customer service was incredibly helpful in helping me choose the right texture. Best investment for my hair!",
      location: "New York, USA"
    },
    {
      id: 2,
      name: "Jessica T.",
      rating: 5,
      date: "February 2025",
      verified: true,
      text: "The extensions blend perfectly with my natural hair. No shedding, no tangling, and the shipping was super fast. I've found my go-to hair vendor!",
      location: "Los Angeles, USA"
    },
    {
      id: 3,
      name: "Amanda K.",
      rating: 4,
      date: "March 2025",
      verified: true,
      text: "Great quality hair, lasts for months with proper care. The 360 lace wig is everything I wanted. Will definitely order again!",
      location: "Miami, USA"
    },
    {
      id: 4,
      name: "Rachel P.",
      rating: 5,
      date: "January 2025",
      verified: true,
      text: "Minka Hair has transformed my look! The HD lace is invisible and the hair is so soft. I get compliments everywhere I go.",
      location: "Chicago, USA"
    },
    {
      id: 5,
      name: "Taylor R.",
      rating: 5,
      date: "February 2025",
      verified: true,
      text: "Fast shipping and beautiful packaging. The hair is soft, bouncy, and tangle-free. My new favorite hair company!",
      location: "Houston, USA"
    },
    {
      id: 6,
      name: "Nicole W.",
      rating: 5,
      date: "March 2025",
      verified: true,
      text: "The bundles are full and thick. No weird smell, and they hold curls beautifully. Definitely worth every penny!",
      location: "Atlanta, USA"
    },
    {
      id: 7,
      name: "Brittany S.",
      rating: 5,
      date: "December 2024",
      verified: true,
      text: "Best hair I've ever purchased! The customer service is top-notch and they answered all my questions. Highly recommend!",
      location: "Dallas, USA"
    },
    {
      id: 8,
      name: "Monique J.",
      rating: 4.5,
      date: "January 2025",
      verified: true,
      text: "Great quality for the price. The deep wave pattern is consistent and beautiful. Will be ordering again soon.",
      location: "Phoenix, USA"
    }
  ]

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const handleScroll = () => {
    if (scrollContainerRef.current && isMobile) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 20)
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 20)
    }
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container && isMobile) {
      container.addEventListener('scroll', handleScroll)
      handleScroll()
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [isMobile])

  return (
    <div className="w-full py-[40px] md:py-[60px] px-[20px] md:px-[7%] bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <div className='flex flex-col md:flex-row justify-between items-center mb-8 gap-4'>
        <div className='text-center md:text-left'>
          <h1 className='text-3xl md:text-[48px] font-extrabold' style={{ color: '#9b83a3' }}>
            OUR HAPPY CUSTOMERS
          </h1>
          <p className='text-gray-500 mt-2'>Join 10,000+ satisfied women who love their hair</p>
        </div>
        
        {/* Desktop Navigation Arrows */}
        {!isMobile && (
          <div className='flex gap-3'>
            <button 
              onClick={() => scroll('left')}
              className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-[#9b83a3] hover:text-white hover:border-[#9b83a3] transition-all duration-300'
            >
              <FaArrowLeft />
            </button>
            <button 
              onClick={() => scroll('right')}
              className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-[#9b83a3] hover:text-white hover:border-[#9b83a3] transition-all duration-300'
            >
              <FaArrowRight />
            </button>
          </div>
        )}
      </div>

      {/* Reviews Grid for Desktop / Carousel for Mobile */}
      <div className="relative">
        {/* Mobile Left Arrow */}
        {isMobile && showLeftArrow && (
          <button 
            onClick={() => scroll('left')}
            className='absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 border border-gray-200 hover:bg-[#9b83a3] hover:text-white transition-all duration-300'
          >
            <FaArrowLeft className='text-sm' />
          </button>
        )}

        {/* Reviews Container */}
        <div 
          ref={scrollContainerRef}
          className={`
            ${isMobile 
              ? 'flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth' 
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            }
          `}
          style={isMobile ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}
        >
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className={isMobile ? 'min-w-[280px] md:min-w-[320px] snap-center' : 'w-full'}
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>

        {/* Mobile Right Arrow */}
        {isMobile && showRightArrow && (
          <button 
            onClick={() => scroll('right')}
            className='absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 border border-gray-200 hover:bg-[#9b83a3] hover:text-white transition-all duration-300'
          >
            <FaArrowRight className='text-sm' />
          </button>
        )}
      </div>

      {/* Mobile Navigation Dots */}
      {isMobile && (
        <div className='flex justify-center gap-2 mt-6'>
          {reviews.map((_, index) => (
            <button
              key={index}
              className='w-2 h-2 rounded-full bg-gray-300 hover:bg-[#9b83a3] transition-colors'
              onClick={() => {
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollTo({
                    left: index * 320,
                    behavior: 'smooth'
                  })
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Stats Section */}
      <div className='mt-12 pt-8 border-t border-gray-200'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center'>
          <div>
            <p className='text-2xl font-bold' style={{ color: '#9b83a3' }}>4.9</p>
            <p className='text-sm text-gray-500'>Average Rating</p>
            <div className='flex justify-center gap-1 mt-1'>
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400 text-xs" />
              ))}
            </div>
          </div>
          <div>
            <p className='text-2xl font-bold' style={{ color: '#9b83a3' }}>10,000+</p>
            <p className='text-sm text-gray-500'>Happy Customers</p>
          </div>
          <div>
            <p className='text-2xl font-bold' style={{ color: '#9b83a3' }}>98%</p>
            <p className='text-sm text-gray-500'>Would Recommend</p>
          </div>
          <div>
            <p className='text-2xl font-bold' style={{ color: '#9b83a3' }}>500+</p>
            <p className='text-sm text-gray-500'>5-Star Reviews</p>
          </div>
        </div>
      </div>

      {/* Trust Badge */}
      <div className='mt-8 bg-gradient-to-r from-[#9b83a3]/10 to-[#8c6020]/10 rounded-2xl p-4 text-center max-w-2xl mx-auto'>
        <p className='text-gray-700 text-sm'>
          ⭐⭐⭐⭐⭐ "The hair quality exceeded my expectations! Will definitely be a returning customer." - <span className='font-semibold'>Verified Buyer</span>
        </p>
      </div>
    </div>
  )
}

export default CustomerReview