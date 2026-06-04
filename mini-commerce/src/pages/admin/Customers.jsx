import React, { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { FaSearch, FaEnvelope, FaPhone, FaCalendar, FaUser, FaUsers, FaMapMarkerAlt, FaShoppingBag, FaDollarSign } from 'react-icons/fa'
import { getAllUsers } from '../../services/api'

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const users = await getAllUsers()
      const regularUsers = users.filter(user => user.role !== 'admin')
      setCustomers(regularUsers)
    } catch (error) {
      console.error('Failed to load customers:', error)
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

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status !== 'disabled').length,
    newThisMonth: customers.filter(c => {
      const date = new Date(c.createdAt)
      const now = new Date()
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    }).length
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
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl font-light tracking-tight text-gray-900">Customers</h1>
            <p className="text-gray-500 mt-1 font-light">Manage your customer base</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <FaUsers className="text-blue-600 text-xl mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            <p className="text-xs text-gray-600">Total Customers</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <FaUser className="text-green-600 text-xl mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.active}</p>
            <p className="text-xs text-gray-600">Active Customers</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
            <FaCalendar className="text-purple-600 text-xl mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.newThisMonth}</p>
            <p className="text-xs text-gray-600">New This Month</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Spent</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                          <FaUser className="text-white text-sm" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{customer.name}</p>
                          <p className="text-xs text-gray-500">ID: {customer._id?.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="flex items-center gap-2 text-sm text-gray-600">
                          <FaEnvelope className="text-xs text-gray-400" /> {customer.email}
                        </p>
                        <p className="flex items-center gap-2 text-sm text-gray-500">
                          <FaPhone className="text-xs text-gray-400" /> {customer.phone || 'Not provided'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaCalendar className="text-xs text-gray-400" />
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaShoppingBag className="text-xs text-gray-400" />
                        <span className="font-semibold text-gray-800">{customer.orderCount || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaDollarSign className="text-xs text-emerald-500" />
                        <span className="font-semibold text-emerald-600">{formatNaira(customer.totalSpent || 0)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUsers className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-xl font-light text-gray-800 mb-2">No customers found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Customer Details Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                      <FaUser className="text-white text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{selectedCustomer.name}</h2>
                      <p className="text-sm text-gray-500">Member since {new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-800">{selectedCustomer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-gray-800">{selectedCustomer.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm text-gray-800">{selectedCustomer.address?.address || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaShoppingBag className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Total Orders</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedCustomer.orderCount || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaDollarSign className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Total Spent</p>
                    <p className="text-sm font-semibold text-emerald-600">{formatNaira(selectedCustomer.totalSpent || 0)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default Customers