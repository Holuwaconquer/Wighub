 
import React, { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { FaCalendar, FaDownload } from 'react-icons/fa'

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
        { name: 'Deep Wave Bundles', sales: 2800000, units: 15 }
      ],
      salesByCategory: {
        Wigs: 65,
        Extensions: 25,
        Accessories: 10
      }
    })
  }, [])

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const salesChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Sales (₦)',
        data: [1850000, 2420000, 3100000, 4280000],
        borderColor: '#9b83a3',
        backgroundColor: 'rgba(155, 131, 163, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }

  const categoryChartData = {
    labels: Object.keys(analytics.salesByCategory),
    datasets: [
      {
        data: Object.values(analytics.salesByCategory),
        backgroundColor: ['#9b83a3', '#8c6020', '#e67e22'],
      }
    ]
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>
          <p className="text-gray-500 mt-1">Track your store performance</p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b83a3]"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <FaDownload /> Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-gray-500 text-sm mb-2">Total Sales</p>
          <p className="text-2xl font-bold text-[#9b83a3]">{formatNaira(analytics.totalSales)}</p>
          <span className="text-green-600 text-sm">↑ 23% from last month</span>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-gray-500 text-sm mb-2">Total Orders</p>
          <p className="text-2xl font-bold text-gray-800">{analytics.totalOrders}</p>
          <span className="text-green-600 text-sm">↑ 12% from last month</span>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-gray-500 text-sm mb-2">Average Order Value</p>
          <p className="text-2xl font-bold text-gray-800">{formatNaira(analytics.averageOrderValue)}</p>
          <span className="text-green-600 text-sm">↑ 8% from last month</span>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-gray-500 text-sm mb-2">Conversion Rate</p>
          <p className="text-2xl font-bold text-gray-800">{analytics.conversionRate}%</p>
          <span className="text-green-600 text-sm">↑ 2% from last month</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Sales Overview</h2>
          <Line data={salesChartData} />
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Sales by Category</h2>
          <Doughnut data={categoryChartData} />
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-4">Top Selling Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Product</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Units Sold</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Revenue</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Performance</th>
              </tr>
            </thead>
            <tbody>
              {analytics.topProducts.map((product, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3">{product.units} units</td>
                  <td className="px-4 py-3 text-[#9b83a3] font-semibold">{formatNaira(product.sales)}</td>
                  <td className="px-4 py-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#9b83a3] h-2 rounded-full"
                        style={{ width: `${(product.sales / analytics.totalSales) * 100}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Analytics