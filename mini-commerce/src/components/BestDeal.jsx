import React, { useRef } from 'react'
import ProductCard from './ProductCard'
import { FaArrowLeft, FaArrowRight, FaFire } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const BestDeal = () => {
  const navigate = useNavigate()
  const scrollContainerRef = useRef(null)

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const bestDealProducts = [
    {
      id: 1,
      name: 'Virgin Brazilian Hair',
      price: 199,
      originalPrice: 399,
      rating: 4.9,
      reviews: 1234,
      image: '/image1.jpg',
      discount: 50,
      isLimited: true
    },
    {
      id: 2,
      name: 'Peruvian Straight Wig',
      price: 249,
      originalPrice: 499,
      rating: 4.8,
      reviews: 892,
      image: '/image2.jpg',
      discount: 50,
      isBestSeller: true
    },
    {
      id: 3,
      name: 'Deep Wave Bundles',
      price: 179,
      originalPrice: 359,
      rating: 4.7,
      reviews: 567,
      image: '/image3.jpg',
      discount: 50
    },
    {
      id: 4,
      name: 'Lace Front Wig',
      price: 299,
      originalPrice: 599,
      rating: 4.9,
      reviews: 2100,
      image: '/image4.jpg',
      discount: 50,
      isBestSeller: true
    },
    {
      id: 5,
      name: 'Kinky Curly Bundles',
      price: 189,
      originalPrice: 379,
      rating: 4.8,
      reviews: 445,
      image: '/image2.jpg',
      discount: 50
    },
    {
      id: 6,
      name: 'Body Wave Wig',
      price: 269,
      originalPrice: 539,
      rating: 4.9,
      reviews: 1567,
      image: '/image1.jpg',
      discount: 50,
      isLimited: true
    }
  ]

  return (
    <div className='w-full py-[50px] px-[20px] md:px-[7%] bg-gradient-to-br from-orange-50 to-red-50'>
      {/* Header Section */}
      <div className='flex flex-col md:flex-row justify-between items-center mb-8 gap-4'>
        <div className='flex items-center gap-3'>
          <div className='bg-red-500 p-3 rounded-full animate-pulse'>
            <FaFire className='text-white text-2xl' />
          </div>
          <div>
            <h1 className='text-3xl md:text-[48px] font-extrabold' style={{ color: '#8c6020' }}>
              BEST DEALS 🔥
            </h1>
            <p className='text-gray-500 mt-2'>Limited time offers - Up to 50% OFF!</p>
          </div>
        </div>
        
        {/* Desktop Navigation Arrows */}
        <div className='hidden md:flex gap-3'>
          <button 
            onClick={() => scroll('left')}
            className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-[#8c6020] hover:text-white hover:border-[#8c6020] transition-all duration-300'
          >
            <FaArrowLeft />
          </button>
          <button 
            onClick={() => scroll('right')}
            className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-[#8c6020] hover:text-white hover:border-[#8c6020] transition-all duration-300'
          >
            <FaArrowRight />
          </button>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className='bg-white rounded-2xl p-4 mb-8 max-w-md mx-auto shadow-lg'>
        <div className='flex justify-between items-center'>
          <span className='text-gray-600 font-medium'>⏰ Sale Ends In:</span>
          <div className='flex gap-4'>
            <div className='text-center'>
              <div className='bg-[#8c6020] text-white rounded-lg px-3 py-1 font-bold text-2xl'>23</div>
              <span className='text-xs text-gray-500'>Hours</span>
            </div>
            <div className='text-center'>
              <div className='bg-[#8c6020] text-white rounded-lg px-3 py-1 font-bold text-2xl'>45</div>
              <span className='text-xs text-gray-500'>Mins</span>
            </div>
            <div className='text-center'>
              <div className='bg-[#8c6020] text-white rounded-lg px-3 py-1 font-bold text-2xl'>12</div>
              <span className='text-xs text-gray-500'>Secs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Container */}
      <div 
        ref={scrollContainerRef}
        className='w-full flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {bestDealProducts.map((product) => (
          <div key={product.id} className="min-w-[280px] md:min-w-0 snap-center">
            <ProductCard product={product} showDiscountBadge={true} />
          </div>
        ))}
      </div>

      {/* Mobile Navigation Dots */}
      <div className='flex md:hidden justify-center gap-2 mt-6'>
        {bestDealProducts.map((_, index) => (
          <button
            key={index}
            className='w-2 h-2 rounded-full bg-gray-300 hover:bg-[#8c6020] transition-colors'
            onClick={() => {
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTo({
                  left: index * 300,
                  behavior: 'smooth'
                })
              }
            }}
          />
        ))}
      </div>

      {/* View All Button */}
      <div className='w-full flex justify-center mt-8'>
        <button onClick={() => window.location.href='/shop'} className='group relative px-8 py-3 border-2 rounded-full overflow-hidden hover:text-white! transition-all duration-300 hover:scale-105'
          style={{ borderColor: '#8c6020', color: '#8c6020' }}>
          <span className="relative z-10 font-medium">View All Deals</span>
          <span className="absolute inset-0 bg-gradient-to-r from-[#8c6020] to-[#9b83a3] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </button>
      </div>
    </div>
  )
}

export default BestDeal