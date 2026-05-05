 
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import { FaArrowLeft } from 'react-icons/fa'

const OrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    const foundOrder = orders.find(o => o.id === parseInt(id))
    setOrder(foundOrder)
  }, [id])

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const updateOrderStatus = (newStatus) => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    const updatedOrders = orders.map(o => 
      o.id === parseInt(id) ? { ...o, status: newStatus } : o
    )
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
    setOrder({ ...order, status: newStatus })
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p>Order not found</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/orders')}
          className="flex items-center gap-2 text-gray-600 hover:text-[#9b83a3] mb-4"
        >
          <FaArrowLeft /> Back to Orders
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Order #{order.id}</h1>
        <p className="text-gray-500 mt-1">Order details and management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 py-3 border-b border-gray-300 last:border-0">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity} | Size: {item.size} | Color: {item.color}</p>
                  </div>
                  <p className="font-semibold text-[#9b83a3]">{formatNaira(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Order Timeline</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <p className="font-semibold">Order Placed</p>
                  <p className="text-sm text-gray-500">{new Date(order.date).toLocaleString()}</p>
                </div>
              </div>
              {order.status === 'processing' && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-semibold">Processing</p>
                    <p className="text-sm text-gray-500">Order is being processed</p>
                  </div>
                </div>
              )}
              {order.status === 'shipped' && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-semibold">Shipped</p>
                    <p className="text-sm text-gray-500">Order has been shipped</p>
                  </div>
                </div>
              )}
              {order.status === 'delivered' && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-semibold">Delivered</p>
                    <p className="text-sm text-gray-500">Order delivered successfully</p>
                  </div>
                </div>
              )}
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
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
                <span>Total</span>
                <span className="text-[#9b83a3]">{formatNaira(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Customer Information</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {order.customer?.firstName} {order.customer?.lastName}</p>
              <p><strong>Email:</strong> {order.customer?.email}</p>
              <p><strong>Phone:</strong> {order.customer?.phone}</p>
              <p><strong>Address:</strong> {order.customer?.address}</p>
              <p><strong>City:</strong> {order.customer?.city}, {order.customer?.state}</p>
              <p><strong>ZIP:</strong> {order.customer?.zipCode}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Update Status</h2>
            <select
              value={order.status}
              onChange={(e) => updateOrderStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b83a3] mb-3"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default OrderDetails