import React, { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import { FaPlus, FaEdit, FaTrash, FaMapMarkerAlt, FaTruck, FaGlobeAfrica, FaTimes, FaSave } from 'react-icons/fa'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { createShippingLocation, deleteShippingLocation, getShippingLocations, updateShippingLocation } from '../../services/api'

const ShippingLocations = () => {
  const [locations, setLocations] = useState([])
  const [form, setForm] = useState({ name: '', description: '', fee: '', estimatedDays: '' })
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const loadLocations = async () => {
    try {
      setLoading(true)
      const data = await getShippingLocations()
      setLocations(data)
    } catch (error) {
      toast.error(error?.message || 'Failed to load shipping locations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLocations()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setForm({ name: '', description: '', fee: '', estimatedDays: '' })
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || form.fee === '') {
      toast.error('Location name and fee are required')
      return
    }

    try {
      const payload = {
        name: form.name,
        description: form.description || '',
        fee: Number(form.fee),
        estimatedDays: form.estimatedDays || ''
      }

      if (editingId) {
        await updateShippingLocation(editingId, payload)
        toast.success('Shipping location updated successfully')
      } else {
        await createShippingLocation(payload)
        toast.success('Shipping location added successfully')
      }

      resetForm()
      setShowModal(false)
      loadLocations()
    } catch (error) {
      toast.error(error?.message || 'Unable to save location')
    }
  }

  const handleEdit = (location) => {
    setForm({
      name: location.name,
      description: location.description || '',
      fee: String(location.fee || 0),
      estimatedDays: location.estimatedDays || ''
    })
    setEditingId(location._id)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete shipping location?',
      text: 'This action cannot be undone. Customers will no longer see this shipping option.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280'
    })

    if (!result.isConfirmed) return

    try {
      await deleteShippingLocation(id)
      toast.success('Shipping location removed successfully')
      loadLocations()
    } catch (error) {
      toast.error(error?.message || 'Unable to delete location')
    }
  }

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
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
            <h1 className="text-4xl font-light tracking-tight text-gray-900">Shipping Locations</h1>
            <p className="text-gray-500 mt-1 font-light">Manage shipping zones and delivery fees</p>
          </div>
          <button
            onClick={() => {
              resetForm()
              setShowModal(true)
            }}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-md"
          >
            <FaPlus className="text-sm" />
            Add Location
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <FaMapMarkerAlt className="text-blue-600 text-xl mb-2" />
            <p className="text-2xl font-bold text-gray-800">{locations.length}</p>
            <p className="text-xs text-gray-600">Total Locations</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
            <FaTruck className="text-emerald-600 text-xl mb-2" />
            <p className="text-2xl font-bold text-gray-800">Nationwide</p>
            <p className="text-xs text-gray-600">Delivery Coverage</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
            <FaGlobeAfrica className="text-amber-600 text-xl mb-2" />
            <p className="text-2xl font-bold text-gray-800">{locations.filter(l => l.fee === 0).length}</p>
            <p className="text-xs text-gray-600">Free Shipping Zones</p>
          </div>
        </div>

        {/* Locations Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] divide-y divide-gray-100">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fee</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Est. Delivery</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {locations.map((location) => (
                  <tr key={location._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-3 py-4 ">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                          <FaMapMarkerAlt className="text-amber-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{location.name}</p>
                          <p className="text-xs text-gray-500">ID: {location._id?.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {location.fee === 0 ? (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Free Shipping
                        </span>
                      ) : (
                        <span className="font-bold text-amber-600">{formatNaira(location.fee)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {location.estimatedDays ? (
                        <span className="text-sm text-gray-600">
                          🚚 {location.estimatedDays} days
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {location.description || 'No description'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(location)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(location._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {locations.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                          <FaMapMarkerAlt className="text-3xl text-gray-400" />
                        </div>
                        <div>
                          <p className="text-gray-500 font-medium">No shipping locations yet</p>
                          <p className="text-gray-400 text-sm mt-1">Add your first shipping location to get started</p>
                        </div>
                        <button
                          onClick={() => {
                            resetForm()
                            setShowModal(true)
                          }}
                          className="mt-2 px-6 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
                        >
                          Add Location
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-2xl font-light text-gray-800">
                  {editingId ? 'Edit Shipping Location' : 'Add New Location'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                    placeholder="e.g., Lagos Mainland"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping Fee (₦) <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="fee"
                    value={form.fee}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                    placeholder="15000"
                  />
                  <p className="text-xs text-gray-500 mt-1">Set to 0 for free shipping</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Delivery (Days)
                  </label>
                  <input
                    name="estimatedDays"
                    value={form.estimatedDays}
                    onChange={handleChange}
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                    placeholder="e.g., 2-3 business days"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all resize-none"
                    placeholder="Additional information about this shipping location..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 font-medium flex items-center justify-center gap-2"
                  >
                    <FaSave className="text-sm" />
                    {editingId ? 'Update Location' : 'Save Location'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      resetForm()
                    }}
                    className="flex-1 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default ShippingLocations