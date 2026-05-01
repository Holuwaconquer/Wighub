import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BsFilter, BsGrid3X3, BsListUl } from 'react-icons/bs'
import { HiMiniMagnifyingGlass } from 'react-icons/hi2'

const ShopPage = () => {
  const location = useLocation()
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState([0, 2000000])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedHairType, setSelectedHairType] = useState('all')
  const [selectedLength, setSelectedLength] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const products = [
    {
      id: 1,
      name: '5x5 Closure Wig',
      price: 888000,
      originalPrice: 890000,
      rating: 4.8,
      reviews: 124,
      image: '/image1.jpg',
      category: 'human hair',
      hairType: 'spanish',
      length: '19 inch',
      isNew: true,
      isBestSeller: true,
      inStock: true
    },
    {
      id: 2,
      name: '28 inches Bone Straight 300grams 5x5 closure',
      price: 850000,
      originalPrice: 950000,
      rating: 4.7,
      reviews: 89,
      image: '/image2.jpg',
      category: 'wigs',
      hairType: 'brazilian',
      length: '28 inch',
      isNew: true,
      isBestSeller: true,
      inStock: true
    },
    {
      id: 3,
      name: '22" 20" 18" inches 300grams 5x5 closure',
      price: 519000,
      originalPrice: 600000,
      rating: 4.9,
      reviews: 203,
      image: '/image3.jpg',
      category: 'human hair',
      hairType: 'italian',
      length: '22 inch',
      isNew: true,
      isBestSeller: true,
      inStock: true
    },
    {
      id: 4,
      name: 'Donor 100% virgin hair extensions Dark brown bone straight 16 inches 300gram',
      price: 920000,
      originalPrice: 1100000,
      rating: 4.9,
      reviews: 312,
      category: 'wigs',
      image: '/image4.jpg',
      hairType: 'brazilian',
      length: '16 inch',
      isNew: true,
      isBestSeller: true,
      inStock: true
    },
    {
      id: 5,
      name: 'Donor 100% virgin hair extensions Light brown bone straight 14 inches 200gram Closure 5x5',
      price: 315000,
      originalPrice: 375000,
      rating: 4.6,
      reviews: 67,
      category: 'wigs',
      hairType: 'brazilian',
      image: '/image2.jpg',
      length: '14 inch',
      isNew: true,
      inStock: true
    },
    {
      id: 6,
      name: 'Burn orange 🍊 luxury hair 14 inches 229gram Closure 5x5',
      price: 380000,
      originalPrice: 450000,
      rating: 4.8,
      reviews: 156,
      category: 'wigs',
      hairType: 'brazilian',
      length: '14 inch',
      image: '/image1.jpg',
      isNew: true,
      isBestSeller: true,
      inStock: true
    }
  ]

  // Get URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const searchParam = params.get('search')
    if (searchParam) {
      setSearchQuery(searchParam)
    }
  }, [location.search])

  // Get unique categories and hair types for filters
  const categories = ['all', ...new Set(products.map(p => p.category))]
  const hairTypes = ['all', ...new Set(products.map(p => p.hairType))]
  const lengths = ['all', ...new Set(products.map(p => p.length))]

  // Format currency to Naira
  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Filter products
  const filteredProducts = products.filter(product => {
    // Category filter
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false
    
    // Hair type filter
    if (selectedHairType !== 'all' && product.hairType !== selectedHairType) return false
    
    // Length filter
    if (selectedLength !== 'all' && product.length !== selectedLength) return false
    
    // Price range filter
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false
    
    // Search query
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    
    return true
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'newest':
        return b.isNew ? 1 : -1
      default:
        return 0
    }
  })

  // Product Card Component
  const ProductCard = ({ product }) => (
    <div className={`group cursor-pointer ${viewMode === 'list' ? 'flex gap-6' : ''}`}>
      <Link to={`/product/${product.id}`}>
        <div className={`relative overflow-hidden rounded-[20px] ${viewMode === 'list' ? 'w-48 h-48' : 'w-full h-[250px] md:h-[298px]'} bg-gradient-to-br from-purple-100 to-pink-100`}>
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.isNew && (
            <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">NEW</span>
          )}
          {product.isBestSeller && (
            <span className="absolute top-3 right-3 bg-[#8c6020] text-white text-xs px-2 py-1 rounded-full">Bestseller</span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold">Out of Stock</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 space-y-2">
          <h3 className="font-bold text-lg group-hover:text-[#8c6020] transition-colors line-clamp-2">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span className="text-gray-500 text-sm">({product.reviews})</span>
          </div>
          
          <div className="flex items-center gap-2">
            <p className="font-bold text-2xl" style={{ color: '#9b83a3' }}>
              {formatNaira(product.price)}
            </p>
            {product.originalPrice && (
              <p className="text-gray-400 line-through text-sm">
                {formatNaira(product.originalPrice)}
              </p>
            )}
          </div>
          
          {product.inStock ? (
            <p className="text-green-600 text-sm">In Stock</p>
          ) : (
            <p className="text-red-600 text-sm">Out of Stock</p>
          )}
        </div>
      </Link>
      
      <button 
        className={`mt-4 w-full py-2 rounded-full border-2 transition-all hover:bg-[#9b83a3] hover:text-white hover:border-[#9b83a3] ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!product.inStock}
        style={{ borderColor: '#9b83a3', color: '#9b83a3' }}
        onClick={() => console.log('Add to cart:', product.id)}
      >
        Add to Cart
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="w-full bg-gradient-to-r from-purple-50 to-pink-50 py-12 px-[20px] md:px-[7%]">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#9b83a3' }}>
            Shop Our Collection
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover premium quality human hair wigs, extensions, and accessories
          </p>
        </div>
      </div>

      <div className="w-full px-[20px] md:px-[7%] py-8">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="w-full py-3 border rounded-xl flex items-center justify-center gap-2"
          >
            <BsFilter className="text-xl" />
            Filters & Sort
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block md:w-1/4 lg:w-1/5 space-y-6`}>
            {/* Search */}
            <div className="border-b pb-4">
              <h3 className="font-bold mb-3">Search</h3>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b83a3]"
                />
                <HiMiniMagnifyingGlass className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            {/* Category Filter */}
            <div className="border-b pb-4">
              <h3 className="font-bold mb-3">Category</h3>
              <div className="space-y-2">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
                      className="w-4 h-4 accent-[#9b83a3]"
                    />
                    <span className="capitalize">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Hair Type Filter */}
            <div className="border-b pb-4">
              <h3 className="font-bold mb-3">Hair Type</h3>
              <div className="space-y-2">
                {hairTypes.map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio"
                      name="hairType"
                      checked={selectedHairType === type}
                      onChange={() => setSelectedHairType(type)}
                      className="w-4 h-4 accent-[#9b83a3]"
                    />
                    <span className="capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Length Filter */}
            <div className="border-b pb-4">
              <h3 className="font-bold mb-3">Length</h3>
              <div className="space-y-2">
                {lengths.map(len => (
                  <label key={len} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio"
                      name="length"
                      checked={selectedLength === len}
                      onChange={() => setSelectedLength(len)}
                      className="w-4 h-4 accent-[#9b83a3]"
                    />
                    <span>{len === 'all' ? 'All Lengths' : len}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedCategory !== 'all' || selectedHairType !== 'all' || selectedLength !== 'all' || searchQuery) && (
              <button 
                onClick={() => {
                  setSelectedCategory('all')
                  setSelectedHairType('all')
                  setSelectedLength('all')
                  setSearchQuery('')
                }}
                className="text-[#8c6020] text-sm hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Sort and View Controls */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <p className="text-gray-600">
                Showing {sortedProducts.length} of {products.length} products
              </p>
              
              <div className="flex gap-4">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b83a3]"
                >
                  <option value="featured">Sort by: Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Best Rating</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Products Grid/List */}
            {sortedProducts.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-6"
              }>
                {sortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria</p>
                <button 
                  onClick={() => {
                    setSelectedCategory('all')
                    setSelectedHairType('all')
                    setSelectedLength('all')
                    setSearchQuery('')
                  }}
                  className="mt-4 px-6 py-2 rounded-full text-white"
                  style={{ backgroundColor: '#9b83a3' }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopPage