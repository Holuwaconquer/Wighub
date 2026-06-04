import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaTrash, FaShoppingBag, FaMinus, FaPlus, FaTag, FaLock, FaArrowLeft } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, updateCartItem } from '../store/slices/cartSlice'

const CartPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items: cartItems } = useSelector(state => state.cart)

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      dispatch(removeFromCart({ productId }))
    } else {
      dispatch(updateCartItem({ productId, quantity: newQuantity }))
    }
  }

  const removeItem = (productId) => {
    dispatch(removeFromCart({ productId }))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  // const shipping = subtotal > 500000 ? 0 : 15000
  const total = subtotal

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:pt-20 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-white w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FaShoppingBag className="text-5xl text-gray-400" />
          </div>
          <h2 className="text-3xl font-light text-gray-800 mb-3">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-8 font-light">Discover our exclusive collection and add something extraordinary to your cart</p>
          <Link to="/shop">
            <button className="px-10 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Explore Collection
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <button 
            onClick={() => navigate('/shop')}
            className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-6"
          >
            <FaArrowLeft className="text-sm" />
            <span className="text-sm font-light">Continue Shopping</span>
          </button>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900">Shopping Cart</h1>
          <p className="text-gray-500 mt-2 font-light">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Luxury Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              {/* Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-5 bg-gray-50 border-b border-gray-100">
                <div className="col-span-5 text-xs uppercase tracking-wider text-gray-500 font-semibold">Product</div>
                <div className="col-span-2 text-center text-xs uppercase tracking-wider text-gray-500 font-semibold">Price</div>
                <div className="col-span-3 text-center text-xs uppercase tracking-wider text-gray-500 font-semibold">Quantity</div>
                <div className="col-span-2 text-right text-xs uppercase tracking-wider text-gray-500 font-semibold">Total</div>
              </div>
              
              {/* Cart Items */}
              {cartItems.map((item) => (
                <div key={item.productId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="px-4 md:px-6 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {/* Product Info */}
                      <div className="md:col-span-5">
                        <div className="flex gap-4">
                          <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <span className="text-xs text-gray-500">Size: {item.size || '22 inch'}</span>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-500">Color: {item.color || 'Natural Black'}</span>
                            </div>
                            <button
                              onClick={() => removeItem(item.productId)}
                              className="text-gray-400 hover:text-red-500 text-sm mt-2 flex items-center gap-1 transition-colors"
                            >
                              <FaTrash className="text-xs" /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="md:col-span-2">
                        <p className="text-gray-600 font-medium text-center md:text-left">
                          {formatNaira(item.price)}
                        </p>
                      </div>
                      
                      {/* Quantity */}
                      <div className="md:col-span-3">
                        <div className="flex justify-center md:justify-start">
                          <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-2 py-1 bg-white">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
                            >
                              <FaMinus className="text-xs text-gray-600" />
                            </button>
                            <span className="w-10 text-center font-medium text-gray-800">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
                            >
                              <FaPlus className="text-xs text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Total */}
                      <div className="md:col-span-2">
                        <p className="font-bold text-gray-900 text-right md:text-left">
                          {formatNaira(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
                <FaLock className="mx-auto text-gray-400 mb-2" />
                <p className="text-xs text-gray-500">Secure Payment</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
                <FaTag className="mx-auto text-gray-400 mb-2" />
                <p className="text-xs text-gray-500">Authentic Products</p>
              </div>
            </div>
          </div>
          
          {/* Order Summary - Luxury Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h2 className="text-2xl font-light tracking-tight mb-6">Order Summary</h2>
                
                <div className="space-y-4 border-b border-gray-100 pb-6">
                  <div className="flex justify-between text-gray-600">
                    <span className="font-light">Subtotal</span>
                    <span className="font-medium">{formatNaira(subtotal)}</span>
                  </div>
                  {/* <div className="flex justify-between text-gray-600">
                    <span className="font-light">Shipping</span>
                    <span className="font-medium">{shipping === 0 ? 'Free' : formatNaira(shipping)}</span>
                  </div> */}
                </div>
                
                <div className="flex justify-between mt-6 pb-6 text-2xl font-light">
                  <span>Total</span>
                  <span className="font-semibold text-gray-900">{formatNaira(total)}</span>
                </div>
                
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.02] shadow-lg mb-3"
                >
                  Proceed to Checkout
                </button>
                
                <p className="text-center text-xs text-gray-400 mt-4">
                  Free returns within 14 days • Secure checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage