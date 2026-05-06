import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import UserLayout from './UserLayout'
import { FaArrowLeft, FaTruck, FaCheckCircle, FaClock } from 'react-icons/fa'

const UserOrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    const foundOrder = orders.find(o => o.id === parseInt(id) && o.customer?.email === user?.email)
    
    if (!foundOrder) {
      navigate('/user/orders')
    } else {
      setOrder(foundOrder)
    }
  }, [id, navigate])

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (!order) {
    return (
      <UserLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b83a3] mx-auto"></div>
        </div>
      </UserLayout>
    )
  }

  const timelineSteps = [
    { status: 'pending', label: 'Order Placed', icon: <FaClock /> },
    { status: 'processing', label: 'Processing', icon: <FaClock /> },
    { status: 'shipped', label: 'Shipped', icon: <FaTruck /> },
    { status: 'delivered', label: 'Delivered', icon: <FaCheckCircle /> }
  ]

  const currentStepIndex = timelineSteps.findIndex(step => step.status === order.status)

  return (
    <UserLayout>
      <div className="mb-8">
        <button
          onClick={() => navigate('/user/orders')}
          className="flex items-center gap-2 text-gray-600 hover:text-[#9b83a3] mb-4"
        >
          <FaArrowLeft /> Back to Orders
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Order #{order.id}</h1>
        <p className="text-gray-500 mt-1">Placed on {new Date(order.date).toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 py-3 border-b last:border-0">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity} | Size: {item.size} | Color: {item.color}</p>
                    <p className="text-[#9b83a3] font-semibold mt-1">{formatNaira(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatNaira(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{order.shipping === 0 ? 'Free' : formatNaira(order.shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>{formatNaira(order.tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-[#9b83a3]">{formatNaira(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
            <div className="space-y-1">
              <p><strong>{order.customer?.firstName} {order.customer?.lastName}</strong></p>
              <p>{order.customer?.address}</p>
              <p>{order.customer?.city}, {order.customer?.state}</p>
              <p>{order.customer?.zipCode}</p>
              <p>Phone: {order.customer?.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Timeline */}
      <div className="mt-6 bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-6">Order Status</h2>
        <div className="relative">
          <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200"></div>
          <div 
            className="absolute top-5 left-0 h-0.5 bg-[#9b83a3] transition-all duration-500"
            style={{ width: `${(currentStepIndex / (timelineSteps.length - 1)) * 100}%` }}
          ></div>
          <div className="relative flex justify-between">
            {timelineSteps.map((step, idx) => (
              <div key={idx} className="text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  idx <= currentStepIndex ? 'bg-[#9b83a3] text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {step.icon}
                </div>
                <p className={`text-sm font-medium ${idx <= currentStepIndex ? 'text-[#9b83a3]' : 'text-gray-400'}`}>
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UserLayout>
  )
}

export default UserOrderDetails