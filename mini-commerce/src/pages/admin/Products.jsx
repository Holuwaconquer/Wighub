import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from 'react-icons/fa'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { getProducts, deleteProduct } from '../../services/api'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await getProducts({ limit: 100 })
      setProducts(response.products || [])
    } catch (error) {
      console.error('Failed to load products:', error)
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

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete product? ',
      text: 'This action will permanently remove the product from the store.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        confirmButton: 'swal2-confirm bg-red-600',
        cancelButton: 'swal2-cancel bg-gray-200 text-gray-800'
      }
    })

    if (!result.isConfirmed) return

    try {
      await deleteProduct(id)
      await loadProducts()
      toast.success('Product deleted successfully')
    } catch (error) {
      console.error('Failed to delete product:', error)
      toast.error('Failed to delete product')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...new Set(products.map(p => p.category))]

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b83a3] mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading products...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        <Link to="/admin/products/add">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#9b83a3] text-white rounded-lg hover:bg-[#8c6020] transition-colors">
            <FaPlus />
            Add Product
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b83a3]"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b83a3]"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={product.images?.[0] || 'https://via.placeholder.com/40'} 
                        alt={product.name} 
                        className="w-10 h-10 rounded-lg object-cover" 
                      />
                      <div>
                        <p className="font-medium text-gray-800">{product.name?.substring(0, 40)}</p>
                        <p className="text-xs text-gray-500">ID: {product._id?.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 font-semibold text-[#9b83a3]">{formatNaira(product.price)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.stock > 10 ? 'bg-green-100 text-green-600' :
                      product.stock > 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {product.stock > 0 ? `${product.stock} units` : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {product.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link to={`/admin/products/edit/${product.slug || product._id}`}>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <FaEdit />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FaTrash />
                      </button>
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

export default Products