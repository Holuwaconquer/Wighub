import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaCheckCircle } from 'react-icons/fa'

const OrderConfirmationPage = () => {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    const foundOrder = orders.find(o => o.id === parseInt(orderId))
    setOrder(foundOrder)
  }, [orderId])

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p>Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-6">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your purchase</p>
          <p className="text-sm text-gray-500 mt-2">Order #{order.id}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          
          {order.items.map((item, idx) => (
            <div key={idx} className="flex gap-4 py-3 border-b">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold">{formatNaira(item.price * item.quantity)}</p>
            </div>
          ))}
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatNaira(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatNaira(order.shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatNaira(order.tax)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total</span>
              <span className="text-[#9b83a3]">{formatNaira(order.total)}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
          <div className="space-y-2">
            <p><strong>Name:</strong> {order.customer.firstName} {order.customer.lastName}</p>
            <p><strong>Email:</strong> {order.customer.email}</p>
            <p><strong>Phone:</strong> {order.customer.phone}</p>
            <p><strong>Address:</strong> {order.customer.address}</p>
            <p><strong>City:</strong> {order.customer.city}, {order.customer.state} {order.customer.zipCode}</p>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <Link to="/shop">
            <button className="px-8 py-3 bg-[#9b83a3] text-white rounded-full hover:bg-[#8c6020] transition-colors">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmationPage