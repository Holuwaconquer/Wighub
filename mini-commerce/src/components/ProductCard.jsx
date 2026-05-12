import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, removeFromCart } from '../store/slices/cartSlice'
import { FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa'
import { BsLightningCharge } from 'react-icons/bs'
import { addToWishlist, removeFromWishlist } from '../services/api'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const cartItems = useSelector(state => state.cart.items)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const isInCart = product && cartItems.some(item => item.productId === product._id)

  useEffect(() => {
    if (!toastMessage) return
    const timer = setTimeout(() => setToastMessage(''), 1800)
    return () => clearTimeout(timer)
  }, [toastMessage])

  const addOrRemoveFromCart = (e) => {
    e.stopPropagation()
    if (!product) return

    if (isInCart) {
      dispatch(removeFromCart({ productId: product._id }))
      setToastMessage('Removed from cart')
    } else {
      dispatch(addToCart({
        productId: product._id,
        quantity: 1,
        price: product.price,
        name: product.name,
        image: product.images?.[0] || product.image
      }))
      setToastMessage('Added to cart')
    }
  }

  const toggleWishlist = async (e) => {
    e.stopPropagation()
    if (!product || loading) return

    try {
      setLoading(true)
      if (isWishlisted) {
        await removeFromWishlist(product._id)
        setIsWishlisted(false)
        setToastMessage('Removed from wishlist')
      } else {
        await addToWishlist(product._id)
        setIsWishlisted(true)
        setToastMessage('Added to wishlist')
      }
    } catch (error) {
      console.error('Wishlist error:', error)
      setToastMessage('Please login to add to wishlist')
    } finally {
      setLoading(false)
    }
  }

  const defaultProduct = {
    name: 'Premium Brazilian Hair',
    price: 180,
    originalPrice: 250,
    rating: 4.5,
    reviews: 120,
    images: ['/product1.png'],
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
      onClick={() => window.location.href = `/product/${product?.slug || product?._id}`}
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
        onClick={toggleWishlist}
        disabled={loading}
        className='absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform duration-300 disabled:opacity-50'
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
          src={data.images?.[0] || data.image || '/placeholder.jpg'} 
          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' 
          alt={data.name} 
          onError={(e) => { e.currentTarget.src = '/placeholder.jpg' }}
        />
        
        {/* Overlay on hover */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button 
              type='button'
              className='bg-white rounded-full px-4 py-3 flex items-center gap-2 transform transition-all duration-300 hover:scale-110 shadow-lg'
              style={{ color: '#9b83a3' }}
              onClick={addOrRemoveFromCart}
            >
              <FaShoppingCart className='text-2xl' />
              <span className='text-sm font-semibold'>{isInCart ? 'Remove' : 'Add'}</span>
            </button>
          </div>
        </div>

      {/* Product Info */}
      <div className='w-full flex flex-col gap-2 mt-4'>
        <h2 className='font-bold text-lg md:text-xl line-clamp-2 hover:text-[#8c6020] transition-colors cursor-pointer'>
          {data.name}
        </h2>

        {/* <div className='flex items-center gap-2'>
          <div className='flex items-center'>
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-sm ${i < Math.floor(data.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                ★
              </span>
            ))}
          </div>
          <span className='text-gray-500 text-sm'>({data.reviews})</span>
        </div> */}
        
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
          type='button'
          className={`md:hidden w-full py-2 rounded-full transition-all duration-300 flex items-center justify-center gap-2 mt-2 ${isInCart ? 'bg-red-500 text-white border-transparent' : 'border-2 border-[#9b83a3] text-[#9b83a3]'}`}
          style={{ borderColor: isInCart ? 'transparent' : '#9b83a3' }}
          onClick={addOrRemoveFromCart}
        >
          <FaShoppingCart />
          <span>{isInCart ? 'Remove from Cart' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  )
}

export default ProductCard