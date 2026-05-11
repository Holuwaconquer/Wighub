import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ProductCard from './ProductCard'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { fetchProducts } from '../store/slices/productSlice'

const FeaturedListings = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const scrollContainerRef = useRef(null)
  const { products, loading } = useSelector(state => state.products)

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: false,
      mirror: false,
      offset: 120,
    });

    // Fetch featured products
    dispatch(fetchProducts({ limit: 8, featured: true }))
  }, [dispatch])

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div data-aos="fade-up" className='w-full py-[50px] px-[20px] md:px-[7%] bg-white'>
      {/* Header Section */}
      <div className='flex flex-col md:flex-row justify-between items-center mb-8 gap-4'>
        <div>
          <h1 className='text-3xl md:text-[48px] font-extrabold' style={{ color: '#9b83a3' }}>
            FEATURED LISTINGS
          </h1>
          <p className='text-gray-500 mt-2'>Discover our most popular hair collections</p>
        </div>

        {/* Desktop Navigation Arrows */}
        {/* <div className='hidden md:flex gap-3'>
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
        </div> */}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className='flex justify-center items-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b83a3]'></div>
        </div>
      ) : (
        <>
          {/* Products Container - No visible scrollbar */}
          <div
            ref={scrollContainerRef}
            className='w-full flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.slice(0, 8).map((product) => (
              <div key={product._id} className="min-w-[280px] md:min-w-0 snap-center">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Mobile Navigation Dots */}
          <div className='flex md:hidden justify-center gap-2 mt-6'>
            {products.slice(0, 8).map((_, index) => (
              <button
                key={index}
                className='w-2 h-2 rounded-full bg-gray-300 hover:bg-[#9b83a3] transition-colors'
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
        </>
      )}

      {/* View All Button */}
      <div className='flex justify-center mt-8'>
        <button
          onClick={() => navigate('/shop')}
          className='px-8 py-3 bg-[#9b83a3] text-white rounded-lg font-semibold hover:bg-[#8c6020] transition-colors'
        >
          View All Products
        </button>
      </div>
    </div>
  )
}

export default FeaturedListings