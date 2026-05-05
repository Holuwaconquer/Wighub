 
import React, { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { FaSearch, FaEnvelope, FaPhone, FaCalendar } from 'react-icons/fa'

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const sampleUsers = [
      {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+234 801 234 5678',
        joinDate: '2024-01-15',
        ordersCount: 5,
        totalSpent: 2450000,
        status: 'active'
      },
      {
        id: 2,
        name: 'Michael Adebayo',
        email: 'michael@example.com',
        phone: '+234 802 345 6789',
        joinDate: '2024-02-20',
        ordersCount: 3,
        totalSpent: 1890000,
        status: 'active'
      },
      {
        id: 3,
        name: 'Chioma Okonkwo',
        email: 'chioma@example.com',
        phone: '+234 803 456 7890',
        joinDate: '2024-03-10',
        ordersCount: 8,
        totalSpent: 4120000,
        status: 'active'
      }
    ]
    
    if (users.length === 0) {
      localStorage.setItem('users', JSON.stringify(sampleUsers))
      setCustomers(sampleUsers)
    } else {
      setCustomers(users)
    }
  }, [])

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
        <p className="text-gray-500 mt-1">Manage your customer base</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b83a3]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-800">{customer.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="flex items-center gap-2 text-sm text-gray-600">
                        <FaEnvelope className="text-xs" /> {customer.email}
                      </p>
                      <p className="flex items-center gap-2 text-sm text-gray-500">
                        <FaPhone className="text-xs" /> {customer.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{customer.ordersCount} orders</td>
                  <td className="px-6 py-4 font-semibold text-[#9b83a3]">{formatNaira(customer.totalSpent)}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaCalendar className="text-xs" />
                      {new Date(customer.joinDate).toLocaleDateString()}
                    </div>
                   </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                      {customer.status}
                    </span>
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

export default Customers