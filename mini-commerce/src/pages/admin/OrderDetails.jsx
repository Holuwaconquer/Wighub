import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import { FaArrowLeft } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { getOrderById, updateOrderStatus } from '../../services/api'

const OrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    loadOrder()
  }, [id])

  const loadOrder = async () => {
    try {
      setLoading(true)
      const data = await getOrderById(id)
      setOrder(data)
    } catch (error) {
      console.error('Failed to load order:', error)
      navigate('/admin/orders')
    } finally {
      setLoading(false)
    }
  }

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const updateOrderStatusHandler = async (newStatus) => {
    try {
      setUpdating(true)
      await updateOrderStatus(id, newStatus)
      await loadOrder()
    } catch (error) {
      console.error('Failed to update order status:', error)
      toast.error('Failed to update order status')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b83a3] mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading order...</p>
        </div>
      </AdminLayout>
    )
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
        <h1 className="text-3xl font-bold text-gray-800">Order #{order._id?.slice(-8)}</h1>
        <p className="text-gray-500 mt-1">Order details and management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="flex gap-4 py-3 border-b last:border-0">
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
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
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
                <span>{formatNaira(order.itemsPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{order.shippingPrice === 0 ? 'Free' : formatNaira(order.shippingPrice)}</span>
              </div>
              {order.coupon && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>-{formatNaira(order.coupon.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-[#9b83a3]">{formatNaira(order.totalPrice)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Customer Information</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {order.shippingAddress?.fullName}</p>
              <p><strong>Email:</strong> {order.user?.email || order.customer?.email}</p>
              <p><strong>Phone:</strong> {order.shippingAddress?.phone}</p>
              <p><strong>Address:</strong> {order.shippingAddress?.address}</p>
              <p><strong>City:</strong> {order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
              <p><strong>ZIP:</strong> {order.shippingAddress?.zipCode || 'N/A'}</p>
              {order.shippingLocation?.name && (
                <p><strong>Shipping Method:</strong> {order.shippingLocation.name}</p>
              )}
              <p><strong>Shipping Fee:</strong> {order.shippingPrice === 0 ? 'Free' : formatNaira(order.shippingPrice)}</p>
              <p><strong>Payment:</strong> {order.paymentMethod}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Update Status</h2>
            <select
              value={order.status}
              onChange={(e) => updateOrderStatusHandler(e.target.value)}
              disabled={updating}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b83a3] mb-3"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {updating && <p className="text-sm text-gray-500">Updating status...</p>}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default OrderDetails