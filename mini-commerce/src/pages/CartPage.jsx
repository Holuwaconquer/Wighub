import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaTrash, FaMinus, FaPlus, FaShoppingBag } from 'react-icons/fa'
import { HiMinus, HiPlus } from 'react-icons/hi'

const CartPage = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartItems(cart)
  }

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const updateQuantity = (id, newQuantity, size, color) => {
    if (newQuantity < 1) return
    
    const updatedCart = cartItems.map(item => {
      if (item.id === id && item.size === size && item.color === color) {
        return { ...item, quantity: newQuantity }
      }
      return item
    })
    
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const removeItem = (id, size, color) => {
    const updatedCart = cartItems.filter(item => 
      !(item.id === id && item.size === size && item.color === color)
    )
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const applyCoupon = () => {
    if (couponCode === 'MINKA20') {
      setDiscount(subtotal * 0.2)
      alert('Coupon applied! 20% discount')
    } else if (couponCode === 'FREESHIP') {
      setDiscount(shipping)
      alert('Free shipping applied!')
    } else {
      alert('Invalid coupon code')
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 500000 ? 0 : 15000
  const tax = subtotal * 0.075 // 7.5% VAT
  const total = subtotal + shipping + tax - discount

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 flex items-center justify-center">
        <div className="text-center">
          <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any items yet</p>
          <Link to="/shop">
            <button className="px-8 py-3 bg-[#9b83a3] text-white rounded-full hover:bg-[#8c6020] transition-colors">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 font-semibold text-gray-600">
                <div className="col-span-5">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              
              {cartItems.map((item, idx) => (
                <div key={idx} className="border-t p-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Product Info */}
                    <div className="md:col-span-5 flex gap-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500">Size: {item.size || '22 inch'}</p>
                        <p className="text-sm text-gray-500">Color: {item.color || 'Natural Black'}</p>
                        <button
                          onClick={() => removeItem(item.id, item.size, item.color)}
                          className="text-red-500 text-sm hover:text-red-700 mt-1 flex items-center gap-1"
                        >
                          <FaTrash className="text-xs" /> Remove
                        </button>
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="md:col-span-2 text-center">
                      <p className="font-semibold">{formatNaira(item.price)}</p>
                    </div>
                    
                    {/* Quantity */}
                    <div className="md:col-span-3 flex justify-center">
                      <div className="flex items-center gap-3 border rounded-lg px-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
                        >
                          <HiMinus />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
                        >
                          <HiPlus />
                        </button>
                      </div>
                    </div>
                    
                    {/* Total */}
                    <div className="md:col-span-2 text-right">
                      <p className="font-bold text-[#9b83a3]">{formatNaira(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 border-b pb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">{shipping === 0 ? 'Free' : formatNaira(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (7.5% VAT)</span>
                  <span className="font-semibold">{formatNaira(tax)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatNaira(discount)}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between mt-4 pb-4 text-lg font-bold">
                <span>Total</span>
                <span className="text-[#9b83a3]">{formatNaira(total)}</span>
              </div>
              
              {/* Coupon Code */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b83a3]"
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Try: MINKA20 or FREESHIP</p>
              </div>
              
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3 bg-[#9b83a3] text-white rounded-full font-semibold hover:bg-[#8c6020] transition-colors"
              >
                Proceed to Checkout
              </button>
              
              <Link to="/shop">
                <button className="w-full mt-3 py-3 border-2 border-gray-300 rounded-full font-semibold hover:border-[#9b83a3] hover:text-[#9b83a3] transition-colors">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage