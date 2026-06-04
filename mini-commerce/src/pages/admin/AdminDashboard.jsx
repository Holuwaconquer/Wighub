import React, { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { 
  FaBox, FaShoppingCart, FaUsers, FaStar, 
  FaDollarSign, FaChartLine, FaArrowUp, 
  FaArrowDown, FaRegClock, FaTags, FaEye,
  FaTruck, FaCheckCircle, FaHourglassHalf
} from 'react-icons/fa'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { useNavigate } from 'react-router-dom'
import { getDashboardStats, getAllOrders, getProducts } from '../../services/api'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    averageRating: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const dashboardStats = await getDashboardStats()
      const ordersRes = await getAllOrders('all', 1)
      const productsRes = await getProducts({ limit: 1 })
      
      setStats({
        totalProducts: dashboardStats.stats.totalProducts,
        totalOrders: dashboardStats.stats.totalOrders,
        totalCustomers: dashboardStats.stats.totalUsers,
        totalRevenue: dashboardStats.stats.totalRevenue,
        pendingOrders: dashboardStats.stats.pendingOrders,
        averageRating: 4.8
      })
      setRecentOrders(ordersRes.orders?.slice(0, 5) || [])
    } catch (error) {
      console.error('Failed to load dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: [1200000, 1900000, 3000000, 5000000, 2400000, 3800000, 4200000, 5100000, 6200000, 7100000, 8500000, 9800000],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 8
        }
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#f59e0b',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        grid: {
          color: '#e5e7eb',
          drawBorder: false
        },
        ticks: {
          callback: (value) => formatNaira(value)
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  }

  const statCards = [
    { title: 'Total Revenue', value: formatNaira(stats.totalRevenue), icon: <FaDollarSign />, gradient: 'from-emerald-500 to-teal-500', change: '+23%', trend: 'up', bgGradient: 'from-emerald-50 to-teal-50' },
    { title: 'Total Orders', value: stats.totalOrders, icon: <FaShoppingCart />, gradient: 'from-blue-500 to-indigo-500', change: '+12%', trend: 'up', bgGradient: 'from-blue-50 to-indigo-50' },
    { title: 'Total Products', value: stats.totalProducts, icon: <FaBox />, gradient: 'from-purple-500 to-pink-500', change: '+8%', trend: 'up', bgGradient: 'from-purple-50 to-pink-50' },
    { title: 'Customers', value: stats.totalCustomers, icon: <FaUsers />, gradient: 'from-cyan-500 to-blue-500', change: '+15%', trend: 'up', bgGradient: 'from-cyan-50 to-blue-50' },
    { title: 'Pending Orders', value: stats.pendingOrders, icon: <FaHourglassHalf />, gradient: 'from-orange-500 to-red-500', change: '-5%', trend: 'down', bgGradient: 'from-orange-50 to-red-50' },
    { title: 'Avg Rating', value: `${stats.averageRating}/5`, icon: <FaStar />, gradient: 'from-yellow-500 to-amber-500', change: '+0.2', trend: 'up', bgGradient: 'from-yellow-50 to-amber-50' },
  ]

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered': return <FaCheckCircle className="text-emerald-500" />
      case 'shipped': return <FaTruck className="text-blue-500" />
      case 'processing': return <FaRegClock className="text-amber-500" />
      default: return <FaEye className="text-gray-400" />
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-2 border-gray-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-amber-500 absolute top-0 left-0"></div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start">
            <div>
              <h1 className="text-3xl font-light mb-2">Dashboard</h1>
              <p className="text-gray-300">Welcome back! Here's your store performance overview</p>
            </div>
            <div className="bg-amber-500/20 rounded-xl px-4 py-2 border border-amber-500/30">
              <p className="text-sm">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, idx) => (
            <div key={idx} className={`bg-gradient-to-br ${stat.bgGradient} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer border border-white/20`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <div className="text-white text-xl">{stat.icon}</div>
                </div>
                <span className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full bg-white/50 ${
                  stat.trend === 'up' ? 'text-emerald-700' : 'text-red-700'
                }`}>
                  {stat.trend === 'up' ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />}
                  {stat.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
              <p className="text-gray-600 text-sm mt-1">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Revenue Overview</h2>
              <FaChartLine className="text-amber-500 text-xl" />
            </div>
            <div className="h-80">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
                <button 
                  onClick={() => navigate('/admin/orders')}
                  className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                >
                  View All →
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentOrders.map((order, idx) => (
                <div key={idx} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/admin/orders/${order._id}`)}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <p className="font-mono text-sm font-semibold text-gray-800">#{order._id?.slice(-8)}</p>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">{formatNaira(order.totalPrice)}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'processing' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {recentOrders.length === 0 && (
                <div className="p-8 text-center text-gray-500">No recent orders</div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button onClick={() => navigate('/admin/products/add')} className="group p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-all duration-300">
              <FaBox className="text-2xl text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700">Add Product</p>
            </button>
            <button onClick={() => navigate('/admin/orders')} className="group p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl hover:shadow-md transition-all duration-300">
              <FaShoppingCart className="text-2xl text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700">View Orders</p>
            </button>
            <button onClick={() => navigate('/admin/coupons')} className="group p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-all duration-300">
              <FaTags className="text-2xl text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700">Manage Coupons</p>
            </button>
            <button onClick={() => navigate('/admin/analytics')} className="group p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl hover:shadow-md transition-all duration-300">
              <FaChartLine className="text-2xl text-amber-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700">Analytics</p>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard