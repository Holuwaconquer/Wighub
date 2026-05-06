import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import UserLayout from './UserLayout'
import { FaEye, FaSearch } from 'react-icons/fa'

const UserOrders = () => {
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    const userOrders = allOrders.filter(order => order.customer?.email === user?.email)
    setOrders(userOrders)
  }, [])

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-600'
      case 'processing': return 'bg-blue-100 text-blue-600'
      case 'shipped': return 'bg-purple-100 text-purple-600'
      case 'cancelled': return 'bg-red-100 text-red-600'
      default: return 'bg-yellow-100 text-yellow-600'
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toString().includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <UserLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
        <p className="text-gray-500 mt-1">Track and manage your orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b83a3]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b83a3]"
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

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <p className="text-sm text-gray-500">Order #{order.id}</p>
                <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-4 mt-2 md:mt-0">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <Link to={`/user/orders/${order.id}`}>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-[#9b83a3] hover:text-[#9b83a3] transition-colors">
                    <FaEye /> View Details
                  </button>
                </Link>
              </div>
            </div>
            
            <div className="border-t border-gray-300 pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600">{order.items?.length} item(s)</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-xl font-bold text-[#9b83a3]">{formatNaira(order.total)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center">
            <p className="text-gray-500">No orders found</p>
            <Link to="/shop">
              <button className="mt-4 px-6 py-2 bg-[#9b83a3] text-white rounded-lg hover:bg-[#8c6020] transition-colors">
                Start Shopping
              </button>
            </Link>
          </div>
        )}
      </div>
    </UserLayout>
  )
}

export default UserOrders