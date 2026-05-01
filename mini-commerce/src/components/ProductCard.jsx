import React, { useState } from 'react'
import { FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa'
import { BsLightningCharge } from 'react-icons/bs'

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const defaultProduct = {
    name: 'Premium Brazilian Hair',
    price: 180,
    originalPrice: 250,
    rating: 4.5,
    reviews: 120,
    image: '/product1.png',
    isBestSeller: false,
    isNew: false,
    isLimited: false
  }

  const data = product || defaultProduct

  return (
    <div 
      className='w-full group relative'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className='absolute top-3 left-3 z-10 flex gap-2'>
        {data.isBestSeller && (
          <span className='bg-[#8c6020] text-white text-xs px-2 py-1 rounded-full font-medium'>
            Bestseller
          </span>
        )}
        {data.isNew && (
          <span className='bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium'>
            New
          </span>
        )}
        {data.isLimited && (
          <span className='bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium'>
            Limited
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button 
        onClick={() => setIsWishlisted(!isWishlisted)}
        className='absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform duration-300'
      >
        {isWishlisted ? (
          <FaHeart className='text-red-500 text-lg' />
        ) : (
          <FaRegHeart className='text-gray-400 text-lg hover:text-red-500 transition-colors' />
        )}
      </button>

      {/* Product Image */}
      <div className='relative w-full h-[250px] md:h-[300px] rounded-[20px] overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100'>
        <img 
          src={data.image} 
          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' 
          alt={data.name} 
        />
        
        {/* Overlay on hover */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            className='bg-white rounded-full p-3 transform transition-all duration-300 hover:scale-110 shadow-lg'
            style={{ color: '#9b83a3' }}
            onClick={() => console.log('Added to cart:', data.id)}
          >
            <FaShoppingCart className='text-2xl' />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className='w-full flex flex-col gap-2 mt-4'>
        <h2 className='font-bold text-lg md:text-xl line-clamp-2 hover:text-[#8c6020] transition-colors cursor-pointer'>
          {data.name}
        </h2>
        
        {/* Rating */}
        <div className='flex items-center gap-2'>
          <div className='flex items-center'>
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-sm ${i < Math.floor(data.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                ★
              </span>
            ))}
          </div>
          <span className='text-gray-500 text-sm'>({data.reviews})</span>
        </div>
        
        {/* Price */}
        <div className='flex items-center gap-2'>
          <p className='font-bold text-2xl' style={{ color: '#9b83a3' }}>
            ₦{data.price.toLocaleString()}
          </p>
          {data.originalPrice && (
            <>
              <p className='text-gray-400 line-through text-sm'>
                ₦{data.originalPrice.toLocaleString()}
              </p>
              <span className='text-red-500 text-sm font-medium'>
                -{Math.round(((data.originalPrice - data.price) / data.originalPrice) * 100)}%
              </span>
            </>
          )}
        </div>

        {/* Add to Cart Button for Mobile */}
        <button 
          className='md:hidden w-full py-2 rounded-full border-2 transition-all duration-300 flex items-center justify-center gap-2 mt-2'
          style={{ borderColor: '#9b83a3', color: '#9b83a3' }}
          onClick={() => console.log('Added to cart:', data.id)}
        >
          <FaShoppingCart />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  )
}

export default ProductCard