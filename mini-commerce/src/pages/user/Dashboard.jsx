import React, { useState, useEffect } from 'react'
import UserLayout from './UserLayout'
import { Link } from 'react-router-dom'
import { 
  FaShoppingBag, 
  FaHeart, 
  FaMapMarkerAlt, 
  FaUser, 
  FaEye, 
  FaArrowRight, 
  FaCreditCard,
  FaTruck,
  FaStar,
  FaCalendarAlt,
  FaBoxOpen,
  FaEnvelope
} from 'react-icons/fa'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { BsShieldCheck, BsGift, BsGraphUp } from 'react-icons/bs'
import api from '../../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    wishlistCount: 0,
    addressesCount: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const userData = JSON.parse(localStorage.getItem('user') || 'null')
        setUser(userData)
        
        const { data } = await api.get('/orders/myorders')
        
        const totalSpent = data.reduce((sum, order) => sum + order.totalPrice, 0)
        
        setStats({
          totalOrders: data.length,
          totalSpent: totalSpent,
          wishlistCount: JSON.parse(localStorage.getItem('wishlist') || '[]').length,
          addressesCount: JSON.parse(localStorage.getItem('addresses') || '[]').length
        })
        
        setRecentOrders(data.slice(0, 5))
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'processing': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered': return <FaBoxOpen className="text-emerald-600" />
      case 'shipped': return <FaTruck className="text-blue-600" />
      case 'processing': return <FaCreditCard className="text-amber-600" />
      default: return <FaShoppingBag className="text-gray-600" />
    }
  }

  const statCards = [
    { 
      title: 'Total Orders', 
      value: stats.totalOrders, 
      icon: <FaShoppingBag />, 
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      link: '/user/orders',
      description: 'Orders placed'
    },
    { 
      title: 'Total Spent', 
      value: formatNaira(stats.totalSpent), 
      icon: <BsGraphUp />, 
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50',
      link: '/user/orders',
      description: 'Lifetime value'
    },
    { 
      title: 'Wishlist', 
      value: stats.wishlistCount, 
      icon: <FaHeart />, 
      gradient: 'from-red-500 to-pink-500',
      bgGradient: 'from-red-50 to-pink-50',
      link: '/user/wishlist',
      description: 'Saved items'
    },
    { 
      title: 'Addresses', 
      value: stats.addressesCount, 
      icon: <HiOutlineLocationMarker />, 
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      link: '/user/addresses',
      description: 'Delivery locations'
    },
  ]

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
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FaUser className="text-2xl text-white" />
              </div>
              <div>
                <p className="text-amber-400 text-sm font-light tracking-wide">{greeting}</p>
                <h1 className="text-3xl md:text-4xl font-light">
                  {user?.name?.split(' ')[0] || 'Customer'}
                </h1>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-4 border-t border-white border-opacity-10">
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-amber-400" />
                <div>
                  <p className="text-xs text-gray-400">Member since</p>
                  <p className="text-sm font-medium">{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-amber-400" />
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm font-medium">{user?.email || 'customer@example.com'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BsShieldCheck className="text-amber-400" />
                <div>
                  <p className="text-xs text-gray-400">Account status</p>
                  <p className="text-sm font-medium text-green-400">Verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, idx) => (
            <Link to={stat.link} key={idx} className="group">
              <div className={`bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    <div className="text-white text-xl">{stat.icon}</div>
                  </div>
                  <FaArrowRight className="text-gray-300 group-hover:text-gray-400 transition-colors" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
                  <p className="text-gray-600 text-sm mt-1 font-medium">{stat.title}</p>
                  <p className="text-gray-400 text-xs mt-1">{stat.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex flex-wrap justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              <p className="text-sm text-gray-500 mt-1">Your latest purchase activity</p>
            </div>
            <Link to="/user/orders" className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1 group">
              View All
              <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaShoppingBag className="text-gray-300 text-xs" />
                        <span className="font-mono text-sm font-semibold text-amber-600">#{order.orderId?.slice(-8) || order._id?.slice(-8)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-300 text-xs" />
                        <span className="text-gray-600 text-sm">{formatDate(order.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-800">{formatNaira(order.totalPrice)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/user/orders/${order._id}`}>
                        <button className="flex items-center gap-2 text-gray-500 hover:text-amber-600 transition-colors text-sm font-medium group">
                          <FaEye className="text-xs" />
                          <span>View Details</span>
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                          <FaShoppingBag className="text-3xl text-gray-400" />
                        </div>
                        <div>
                          <p className="text-gray-500 font-medium">No orders yet</p>
                          <p className="text-gray-400 text-sm mt-1">Start shopping to see your orders here</p>
                        </div>
                        <Link to="/shop">
                          <button className="mt-2 px-6 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors text-sm">
                            Browse Collection
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BsGift className="text-amber-500" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/shop">
                <button className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 font-medium text-sm">
                  Continue Shopping
                </button>
              </Link>
              <Link to="/user/wishlist">
                <button className="w-full py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 border border-gray-200 font-medium text-sm flex items-center justify-center gap-2">
                  <FaHeart className="text-red-500" />
                  Wishlist
                </button>
              </Link>
              <Link to="/user/addresses">
                <button className="w-full py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 border border-gray-200 font-medium text-sm flex items-center justify-center gap-2">
                  <HiOutlineLocationMarker className="text-blue-500" />
                  Manage Addresses
                </button>
              </Link>
              <Link to="/user/profile">
                <button className="w-full py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 border border-gray-200 font-medium text-sm flex items-center justify-center gap-2">
                  <FaUser className="text-amber-500" />
                  Edit Profile
                </button>
              </Link>
            </div>
          </div>

          {/* Membership Benefits */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaStar className="text-amber-500" />
              Member Benefits
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaTruck className="text-amber-600 text-sm" />
                <p className="text-sm text-gray-700">Free shipping on orders over ₦500,000</p>
              </div>
              <div className="flex items-center gap-3">
                <BsShieldCheck className="text-amber-600 text-sm" />
                <p className="text-sm text-gray-700">14-day return policy on all items</p>
              </div>
              <div className="flex items-center gap-3">
                <BsGift className="text-amber-600 text-sm" />
                <p className="text-sm text-gray-700">Exclusive member-only discounts and early access</p>
              </div>
            </div>
            
            {stats.totalSpent > 100000 && (
              <div className="mt-4 pt-4 border-t border-amber-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Loyalty Status</span>
                  <span className="text-xs font-semibold text-amber-700">Gold Member</span>
                </div>
                <div className="mt-2 w-full bg-amber-200 rounded-full h-1.5">
                  <div className="bg-amber-600 h-1.5 rounded-full w-2/3"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  )
}

export default Dashboard