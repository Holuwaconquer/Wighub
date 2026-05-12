import React, { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Tooltip, Legend, Title, Filler } from 'chart.js'
import { FaCalendar, FaDownload, FaShoppingCart, FaUsers, FaDollarSign, FaBox, FaChartLine, FaTag, FaArrowUp, FaArrowDown } from 'react-icons/fa'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Tooltip, Legend, Title, Filler)

const Analytics = () => {
  const [dateRange, setDateRange] = useState('month')
  const [analytics, setAnalytics] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    topProducts: [],
    salesByCategory: {}
  })

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0)
    const totalOrders = orders.length
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0
    
    setAnalytics({
      totalSales,
      totalOrders,
      averageOrderValue,
      conversionRate: 3.2,
      topProducts: [
        { name: '5x5 Closure Wig', sales: 4500000, units: 12 },
        { name: 'Bone Straight Wig', sales: 3400000, units: 8 },
        { name: 'Deep Wave Bundles', sales: 2800000, units: 15 },
        { name: 'Lace Front Wig', sales: 2100000, units: 7 },
        { name: 'Brazilian Hair', sales: 1800000, units: 9 }
      ],
      salesByCategory: {
        Wigs: 65,
        Bundles: 20,
        Accessories: 15
      }
    })
  }, [dateRange])

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const salesChartData = {
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

  const ordersChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Orders',
        data: [15, 22, 35, 58, 28, 42, 48, 56, 68, 75, 92, 108],
        backgroundColor: 'rgba(155, 131, 163, 0.8)',
        borderRadius: 8,
      }
    ]
  }

  const categoryChartData = {
    labels: Object.keys(analytics.salesByCategory),
    datasets: [
      {
        data: Object.values(analytics.salesByCategory),
        backgroundColor: ['#f59e0b', '#8b5cf6', '#10b981'],
        borderWidth: 0,
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
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
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || ''
            if (label) label += ': '
            if (context.parsed.y !== undefined) {
              label += formatNaira(context.parsed.y)
            } else {
              label += context.parsed + '%'
            }
            return label
          }
        }
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

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        grid: {
          color: '#e5e7eb',
          drawBorder: false
        },
        ticks: {
          stepSize: 20
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxWidth: 8
        }
      }
    }
  }

  const statCards = [
    { title: 'Total Revenue', value: formatNaira(analytics.totalSales), icon: <FaDollarSign />, change: '+23%', trend: 'up', bgGradient: 'from-emerald-50 to-teal-50', iconBg: 'from-emerald-500 to-teal-500' },
    { title: 'Total Orders', value: analytics.totalOrders, icon: <FaShoppingCart />, change: '+12%', trend: 'up', bgGradient: 'from-blue-50 to-indigo-50', iconBg: 'from-blue-500 to-indigo-500' },
    { title: 'Avg Order Value', value: formatNaira(analytics.averageOrderValue), icon: <FaChartLine />, change: '+8%', trend: 'up', bgGradient: 'from-purple-50 to-pink-50', iconBg: 'from-purple-500 to-pink-500' },
    { title: 'Conversion Rate', value: `${analytics.conversionRate}%`, icon: <FaUsers />, change: '+2%', trend: 'up', bgGradient: 'from-amber-50 to-orange-50', iconBg: 'from-amber-500 to-orange-500' },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl font-light tracking-tight text-gray-900">Analytics</h1>
            <p className="text-gray-500 mt-1 font-light">Track your store performance</p>
          </div>
          <div className="flex gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300">
              <FaDownload className="text-sm" />
              Export Report
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, idx) => (
            <div key={idx} className={`bg-gradient-to-br ${stat.bgGradient} rounded-xl p-5 shadow-lg border border-white/20`}>
              <div className="flex justify-between items-start mb-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.iconBg} rounded-xl flex items-center justify-center shadow-md`}>
                  <div className="text-white text-lg">{stat.icon}</div>
                </div>
                <span className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full bg-white/50 ${
                  stat.trend === 'up' ? 'text-emerald-700' : 'text-red-700'
                }`}>
                  {stat.trend === 'up' ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />}
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
              <p className="text-gray-600 text-sm mt-1">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Revenue Overview</h2>
              <FaChartLine className="text-amber-500 text-xl" />
            </div>
            <div className="h-80">
              <Line data={salesChartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Orders Overview</h2>
              <FaShoppingCart className="text-amber-500 text-xl" />
            </div>
            <div className="h-80">
              <Bar data={ordersChartData} options={barChartOptions} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FaBox className="text-amber-500" />
                Top Selling Products
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {analytics.topProducts.map((product, idx) => (
                <div key={idx} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{idx + 1}. {product.name}</p>
                      <div className="flex gap-4 mt-1">
                        <span className="text-xs text-gray-500">{product.units} units sold</span>
                      </div>
                    </div>
                    <p className="font-bold text-amber-600">{formatNaira(product.sales)}</p>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-amber-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${(product.sales / analytics.topProducts[0].sales) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sales by Category */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <FaTag className="text-amber-500" />
              Sales by Category
            </h2>
            <div className="h-64">
              <Doughnut data={categoryChartData} options={doughnutOptions} />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {Object.entries(analytics.salesByCategory).map(([category, percentage]) => (
                <div key={category} className="text-center">
                  <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{
                    backgroundColor: category === 'Wigs' ? '#f59e0b' : category === 'Bundles' ? '#8b5cf6' : '#10b981'
                  }}></div>
                  <p className="text-sm font-medium text-gray-700">{category}</p>
                  <p className="text-lg font-bold text-gray-800">{percentage}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FaChartLine className="text-amber-600" />
            Key Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Best Performing Month</p>
              <p className="text-lg font-semibold text-gray-800">December (₦9.8M)</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Most Popular Category</p>
              <p className="text-lg font-semibold text-gray-800">Wigs (65% of sales)</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Order Value</p>
              <p className="text-lg font-semibold text-gray-800">{formatNaira(analytics.averageOrderValue)}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Analytics