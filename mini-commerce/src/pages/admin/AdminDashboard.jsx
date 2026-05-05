 
import React, { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { 
  FaBox, FaShoppingCart, FaUsers, FaStar, 
  FaDollarSign, FaEye, FaChartLine, FaArrowUp, 
  FaArrowDown, FaRegClock
} from 'react-icons/fa'
import { Line, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    averageRating: 0
  })

  useEffect(() => {
    // Load data from localStorage
    const products = JSON.parse(localStorage.getItem('adminProducts') || '[]')
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    const customers = JSON.parse(localStorage.getItem('users') || '[]')
    
    setStats({
      totalProducts: products.length,
      totalOrders: orders.length,
      totalCustomers: customers.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
      pendingOrders: orders.filter(order => order.status === 'pending').length,
      averageRating: 4.8
    })
  }, [])

  const recentOrders = JSON.parse(localStorage.getItem('orders') || '[]').slice(0, 5)

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue (₦)',
        data: [1200000, 1900000, 3000000, 5000000, 2400000, 3800000, 4200000, 5100000, 6200000, 7100000, 8500000, 9800000],
        borderColor: '#9b83a3',
        backgroundColor: 'rgba(155, 131, 163, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      }
    }
  }

  const statCards = [
    { title: 'Total Products', value: stats.totalProducts, icon: <FaBox />, color: '#9b83a3', change: '+12%', trend: 'up' },
    { title: 'Total Orders', value: stats.totalOrders, icon: <FaShoppingCart />, color: '#8c6020', change: '+8%', trend: 'up' },
    { title: 'Total Customers', value: stats.totalCustomers, icon: <FaUsers />, color: '#9b83a3', change: '+15%', trend: 'up' },
    { title: 'Total Revenue', value: formatNaira(stats.totalRevenue), icon: <FaDollarSign />, color: '#8c6020', change: '+23%', trend: 'up' },
    { title: 'Pending Orders', value: stats.pendingOrders, icon: <FaRegClock />, color: '#e67e22', change: '-5%', trend: 'down' },
    { title: 'Avg Rating', value: `${stats.averageRating}/5`, icon: <FaStar />, color: '#f1c40f', change: '+0.2', trend: 'up' },
  ]

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, Admin! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${stat.color}10`, color: stat.color }}>
                {stat.icon}
              </div>
              <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            <p className="text-gray-500 text-sm mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Revenue Overview</h2>
          <Line data={chartData} options={chartOptions} />
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders.map((order, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#9b83a3]">{formatNaira(order.total)}</p>
                  <p className={`text-xs px-2 py-1 rounded-full inline-block ${
                    order.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <FaBox className="text-2xl text-[#9b83a3] mx-auto mb-2" />
            <p className="text-sm font-medium">Add Product</p>
          </button>
          <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <FaShoppingCart className="text-2xl text-[#9b83a3] mx-auto mb-2" />
            <p className="text-sm font-medium">View Orders</p>
          </button>
          <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <FaTags className="text-2xl text-[#9b83a3] mx-auto mb-2" />
            <p className="text-sm font-medium">Add Coupon</p>
          </button>
          <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <FaChartLine className="text-2xl text-[#9b83a3] mx-auto mb-2" />
            <p className="text-sm font-medium">Analytics</p>
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard