import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import UserLayout from './UserLayout'
import { FaTrash, FaShoppingCart, FaHeart, FaEye } from 'react-icons/fa'
import api from '../../services/api'

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    loadWishlist()
  }, [])

  const loadWishlist = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/users/wishlist')
      setWishlist(data)
    } catch (error) {
      console.error('Failed to load wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/users/wishlist/${productId}`)
      setWishlist(wishlist.filter(item => item.product._id !== productId))
      showToast('Removed from wishlist', 'info')
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
    }
  }

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existing = cart.find(item => item.id === product._id)
    
    if (existing) {
      existing.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    showToast('Added to cart!', 'success')
  }

  const showToast = (message, type = 'success') => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(''), 2000)
  }

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
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

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 px-6 py-3 bg-gray-900 text-white rounded-xl shadow-2xl animate-fadeIn">
            {toastMessage}
          </div>
        )}

        {/* Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900">My Wishlist</h1>
          <p className="text-gray-500 mt-2 font-light">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-red-50 to-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaHeart className="text-4xl text-red-400" />
            </div>
            <h2 className="text-2xl font-light text-gray-800 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8">Save your favorite items here for easy access</p>
            <Link to="/shop">
              <button className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300">
                Explore Collection
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div key={item._id} className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden">
                  <img 
                    src={item.product?.images?.[0] || '/placeholder.jpg'} 
                    alt={item.product?.name} 
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 hover:bg-black/40 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  <button
                    onClick={() => removeFromWishlist(item.product._id)}
                    className="absolute top-3 right-3 p-2.5 bg-white rounded-full shadow-md hover:bg-red-50 hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <FaTrash className="text-red-500 text-sm" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link to={`/product/${item.product?.slug || item.product?._id}`}>
                      <button className="w-full py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                        <FaEye className="text-sm" />
                        Quick View
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="p-5">
                  <Link to={`/product/${item.product?.slug || item.product?._id}`}>
                    <h3 className="font-semibold text-gray-800 text-lg hover:text-amber-600 transition-colors line-clamp-2">
                      {item.product?.name}
                    </h3>
                  </Link>
                  <div className="mt-2">
                    <p className="text-2xl font-bold text-gray-900">{formatNaira(item.product?.price)}</p>
                    {item.product?.originalPrice && (
                      <p className="text-sm text-gray-400 line-through">{formatNaira(item.product.originalPrice)}</p>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(item.product)}
                    className="w-full mt-5 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                  >
                    <FaShoppingCart className="text-sm" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  )
}

export default Wishlist