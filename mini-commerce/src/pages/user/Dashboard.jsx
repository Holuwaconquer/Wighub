import React, { useState, useEffect } from 'react'
import UserLayout from './UserLayout'
import { Link } from 'react-router-dom'
import { FaShoppingBag, FaHeart, FaMapMarkerAlt, FaUser, FaEye } from 'react-icons/fa'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    wishlistCount: 0,
    addressesCount: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null')
    setUser(userData)
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    const userOrders = orders.filter(order => order.customer?.email === userData?.email)
    
    setStats({
      totalOrders: userOrders.length,
      totalSpent: userOrders.reduce((sum, order) => sum + order.total, 0),
      wishlistCount: JSON.parse(localStorage.getItem('wishlist') || '[]').length,
      addressesCount: JSON.parse(localStorage.getItem('addresses') || '[]').length
    })
    
    setRecentOrders(userOrders.slice(0, 5))
  }, [])

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const statCards = [
    { title: 'Total Orders', value: stats.totalOrders, icon: <FaShoppingBag />, color: '#9b83a3', link: '/user/orders' },
    { title: 'Total Spent', value: formatNaira(stats.totalSpent), icon: <FaUser />, color: '#8c6020', link: '/user/orders' },
    { title: 'Wishlist', value: stats.wishlistCount, icon: <FaHeart />, color: '#e74c3c', link: '/user/wishlist' },
    { title: 'Addresses', value: stats.addressesCount, icon: <FaMapMarkerAlt />, color: '#3498db', link: '/user/addresses' },
  ]

  return (
    <UserLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name?.split(' ')[0] || 'Customer'}!</h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your account</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <Link to={stat.link} key={idx}>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${stat.color}10`, color: stat.color }}>
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
              <p className="text-gray-500 text-sm mt-1">{stat.title}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-300 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
          <Link to="/user/orders" className="text-[#9b83a3] hover:underline text-sm">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm">#{order.id}</td>
                  <td className="px-6 py-4 text-gray-600">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-semibold text-[#9b83a3]">{formatNaira(order.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/user/orders/${order.id}`}>
                      <button className="text-[#9b83a3] hover:underline text-sm flex items-center gap-1">
                        <FaEye /> View
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No orders yet. Start shopping!
                  </td>
                </tr>
              )}
            </tbody>
           </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/shop">
          <button className="w-full p-4 bg-[#9b83a3] text-white rounded-xl hover:bg-[#8c6020] transition-colors">
            Continue Shopping
          </button>
        </Link>
        <Link to="/user/wishlist">
          <button className="w-full p-4 border-2 border-[#9b83a3] text-[#9b83a3] rounded-xl hover:bg-[#9b83a3] hover:text-white transition-colors">
            View Wishlist
          </button>
        </Link>
      </div>
    </UserLayout>
  )
}

export default Dashboard