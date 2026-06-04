import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import UserLayout from './UserLayout'
import { FaEye, FaSearch, FaShoppingBag, FaCalendarAlt, FaTruck, FaCheckCircle, FaTimesCircle, FaFilter } from 'react-icons/fa'
import { getMyOrders } from '../../services/api'

const UserOrders = () => {
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const data = await getMyOrders()
        setOrders(data)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-emerald-100 text-emerald-700'
      case 'processing': return 'bg-blue-100 text-blue-700'
      case 'shipped': return 'bg-purple-100 text-purple-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-amber-100 text-amber-700'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered': return <FaCheckCircle />
      case 'shipped': return <FaTruck />
      case 'cancelled': return <FaTimesCircle />
      default: return <FaShoppingBag />
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order?.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: orders.length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
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
        {/* Header */}
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900">My Orders</h1>
            <p className="text-gray-500 mt-2 font-light">Track and manage your purchase history</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600">
              Total Orders: <span className="font-semibold text-gray-900">{stats.total}</span>
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
            <FaCheckCircle className="text-emerald-600 text-xl mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.delivered}</p>
            <p className="text-xs text-gray-600">Delivered</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <FaTruck className="text-blue-600 text-xl mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.shipped}</p>
            <p className="text-xs text-gray-600">In Transit</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-100">
            <FaShoppingBag className="text-amber-600 text-xl mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.processing}</p>
            <p className="text-xs text-gray-600">Processing</p>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-100">
            <FaShoppingBag className="text-gray-600 text-xl mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            <p className="text-xs text-gray-600">Total Orders</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors"
            >
              <FaFilter className="text-sm" />
              <span className="font-medium">Filter Orders</span>
            </button>
          </div>
          
          {(showFilters || searchTerm || statusFilter !== 'all') && (
            <div className="p-5 bg-gray-50 border-b border-gray-100">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by order ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-5 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                      <FaShoppingBag className="text-amber-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-mono font-semibold text-gray-800">{order.orderId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 md:mt-0">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-400 text-sm" />
                      <span className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-5">
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Items</p>
                      <p className="font-medium text-gray-800">{order.orderItems?.length} {order.orderItems?.length === 1 ? 'item' : 'items'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-gray-900">{formatNaira(order.totalPrice)}</p>
                    </div>
                    <Link to={`/user/orders/${order._id}`}>
                      <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-300">
                        <FaEye className="text-sm" />
                        <span>View Details</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredOrders.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShoppingBag className="text-4xl text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg mb-2">No orders found</p>
              <p className="text-gray-400 text-sm mb-6">Try adjusting your search or filter criteria</p>
              <Link to="/shop">
                <button className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300">
                  Start Shopping
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  )
}

export default UserOrders