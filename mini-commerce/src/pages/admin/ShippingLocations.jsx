import React, { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import { createShippingLocation, deleteShippingLocation, getShippingLocations, updateShippingLocation } from '../../services/api'

const ShippingLocations = () => {
  const [locations, setLocations] = useState([])
  const [form, setForm] = useState({ name: '', description: '', fee: '' })
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')

  const loadLocations = async () => {
    try {
      const data = await getShippingLocations()
      setLocations(data)
    } catch (error) {
      setMessage(error?.message || 'Failed to load shipping locations')
    }
  }

  useEffect(() => {
    loadLocations()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || form.fee === '') {
      setMessage('Name and fee are required')
      return
    }

    try {
      const payload = {
        name: form.name,
        description: form.description,
        fee: Number(form.fee)
      }

      if (editingId) {
        await updateShippingLocation(editingId, payload)
        setMessage('Shipping location updated.')
      } else {
        await createShippingLocation(payload)
        setMessage('Shipping location added.')
      }

      setForm({ name: '', description: '', fee: '' })
      setEditingId(null)
      loadLocations()
    } catch (error) {
      setMessage(error?.message || 'Unable to save location')
    }
  }

  const handleEdit = (location) => {
    setForm({
      name: location.name,
      description: location.description || '',
      fee: String(location.fee || 0)
    })
    setEditingId(location._id)
    setMessage('Editing shipping location. Save to update.')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this shipping location?')) return
    try {
      await deleteShippingLocation(id)
      setMessage('Shipping location removed.')
      loadLocations()
    } catch (error) {
      setMessage(error?.message || 'Unable to delete location')
    }
  }

  return (
    <AdminLayout>
      <div className="bg-white shadow rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shipping Locations</h1>
            <p className="text-sm text-gray-500 mt-2">Create shipping zones and assign a shipping fee to each location.</p>
          </div>
        </div>

        {message && (
          <div className="mb-6 rounded-lg bg-indigo-50 border border-indigo-200 p-4 text-sm text-indigo-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9b83a3]"
              placeholder="e.g. Lagos Mainland"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Fee</label>
            <input
              name="fee"
              value={form.fee}
              onChange={handleChange}
              type="number"
              min="0"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9b83a3]"
              placeholder="15000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9b83a3]"
              placeholder="e.g. City center delivery"
            />
          </div>
          <div className="lg:col-span-3 flex gap-3">
            <button className="px-6 py-3 bg-[#9b83a3] text-white rounded-xl hover:bg-[#8c6020] transition-all">
              {editingId ? 'Update Location' : 'Add Location'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null)
                  setForm({ name: '', description: '', fee: '' })
                  setMessage('')
                }}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full text-left divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Location</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Fee</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Description</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {locations.map((location) => (
                <tr key={location._id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{location.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">₦{location.fee.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{location.description || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(location)}
                      className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(location._id)}
                      className="px-3 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {locations.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500">
                    No shipping locations available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default ShippingLocations
