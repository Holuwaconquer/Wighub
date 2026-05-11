import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import UserLayout from './UserLayout'
import { FaTrash, FaShoppingCart, FaHeart } from 'react-icons/fa'

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    loadWishlist()
  }, [])

  const loadWishlist = () => {
    const items = JSON.parse(localStorage.getItem('wishlist') || '[]')
    setWishlist(items)
  }

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(item => item.id !== id)
    setWishlist(updated)
    localStorage.setItem('wishlist', JSON.stringify(updated))
  }

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existing = cart.find(item => item.id === product.id)
    
    if (existing) {
      existing.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    alert('Added to cart!')
  }

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <UserLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
        <p className="text-gray-500 mt-1">Your saved items</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Your wishlist is empty</p>
          <Link to="/shop">
            <button className="px-6 py-2 bg-[#9b83a3] text-white rounded-lg hover:bg-[#8c6020] transition-colors">
              Start Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item._id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative">
                <img src={item.images?.[0] || '/placeholder.jpg'} alt={item.name} className="w-full h-48 object-cover" />
                <button
                  onClick={() => removeFromWishlist(item._id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                >
                  <FaTrash className="text-red-500" />
                </button>
              </div>
              <div className="p-4">
                <Link to={`/product/${item.slug || item._id}`}>
                  <h3 className="font-semibold text-gray-800 hover:text-[#9b83a3] transition-colors line-clamp-2">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-[#9b83a3] font-bold text-xl mt-2">{formatNaira(item.price)}</p>
                <button
                  onClick={() => addToCart(item)}
                  className="w-full mt-4 py-2 bg-[#9b83a3] text-white rounded-lg hover:bg-[#8c6020] transition-colors flex items-center justify-center gap-2"
                >
                  <FaShoppingCart /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </UserLayout>
  )
}

export default Wishlist