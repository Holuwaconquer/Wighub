import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FaStar, FaStarHalfAlt, FaRegStar, FaTruck, FaShieldAlt, FaUndo, FaHeart, FaRegHeart, FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { HiMinus, HiPlus } from 'react-icons/hi'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState([])

  // All products data (in real app, this would come from an API)
  const productsDatabase = {
    1: {
      id: 1,
      name: '5x5 Closure Wig - Brazilian Straight',
      price: 888000,
      originalPrice: 890000,
      rating: 4.8,
      reviews: 124,
      description: 'Experience luxury with our 100% virgin human hair 5x5 closure wig. This premium wig features a natural hairline, tangle-free texture, and long-lasting durability. Perfect for everyday wear or special occasions.',
      features: [
        '100% Virgin Human Hair',
        '5x5 Silk Base Closure',
        'Pre-plucked with baby hair',
        'Bleached knots',
        'Swiss lace material',
        'Can be dyed and styled'
      ],
      specifications: {
        'Hair Type': 'Brazilian',
        'Texture': 'Straight',
        'Length': '22 inches',
        'Weight': '300 grams',
        'Cap Size': 'Medium (22.5")',
        'Lace Color': 'Transparent'
      },
      careInstructions: [
        'Wash with sulfate-free shampoo',
        'Condition regularly',
        'Air dry or low heat',
        'Store on mannequin head'
      ],
      images: [
        '/image1.jpg',
      ],
      availableSizes: ['18 inch', '20 inch', '22 inch', '24 inch'],
      availableColors: ['Natural Black', 'Dark Brown', 'Auburn', 'Bleached Blonde'],
      inStock: true,
      sku: 'MLH-WIG-001',
      category: 'Wigs',
      tags: ['wig', 'brazilian', 'straight', 'luxury'],
      isBestSeller: true,
      isNew: false
    },
    2: {
      id: 2,
      name: '28 inches Bone Straight 300grams 5x5 closure',
      price: 850000,
      originalPrice: 950000,
      rating: 4.7,
      reviews: 89,
      description: 'Premium 28-inch bone straight wig made from 100% virgin human hair. Features a 5x5 closure for a natural look.',
      features: ['100% Virgin Hair', '5x5 Closure', 'Bone Straight', 'Pre-plucked'],
      specifications: {
        'Hair Type': 'Peruvian',
        'Texture': 'Bone Straight',
        'Length': '28 inches',
        'Weight': '300 grams'
      },
      careInstructions: ['Gentle wash', 'Air dry', 'Avoid heat'],
      images: [
        '/image2.jpg',
      ],
      availableSizes: ['26 inch', '28 inch', '30 inch'],
      availableColors: ['Natural Black', '#1a1a1a'],
      inStock: true,
      sku: 'MLH-WIG-002',
      category: 'Wigs',
      isBestSeller: false,
      isNew: true
    },
    3: {
      id: 3,
      name: '22" 20" 18" inches 300grams 5x5 closure',
      price: 519000,
      originalPrice: 600000,
      rating: 4.9,
      reviews: 203,
      description: 'Multi-length bundle deal with 5x5 closure. Perfect for creating volume and length.',
      features: ['3 Bundle Deal', '5x5 Closure', 'Multi-length', '300 grams total'],
      specifications: {
        'Hair Type': 'Brazilian',
        'Texture': 'Body Wave',
        'Lengths': '18", 20", 22"',
        'Weight': '300 grams'
      },
      careInstructions: ['Brush gently', 'Moisturize regularly'],
      images: [
        '/image3.jpg',
      ],
      availableSizes: ['Bundle Deal'],
      availableColors: ['Natural Black', 'Dark Brown'],
      inStock: true,
      sku: 'MLH-BND-003',
      category: 'Bundles',
      isBestSeller: true,
      isNew: false
    },
    4: {
      id: 4,
      name: 'Donor 100% virgin hair extensions Dark brown bone straight 16 inches',
      price: 920000,
      originalPrice: 1100000,
      rating: 4.9,
      reviews: 312,
      description: 'High-quality donor hair extensions, 100% virgin human hair, bone straight texture.',
      features: ['Donor Quality', '100% Virgin', 'Bone Straight', '16 inches'],
      specifications: {
        'Hair Type': 'Brazilian',
        'Texture': 'Bone Straight',
        'Length': '16 inches',
        'Weight': '300 grams'
      },
      careInstructions: ['Use sulfate-free products', 'Deep condition weekly'],
      images: [
        '/image4.jpg',
      ],
      availableSizes: ['14 inch', '16 inch', '18 inch'],
      availableColors: ['Dark Brown', 'Natural Black'],
      inStock: true,
      sku: 'MLH-EXT-004',
      category: 'Extensions',
      isBestSeller: true,
      isNew: false
    },
    5: {
      id: 5,
      name: 'Donor 100% virgin hair extensions Light brown bone straight 14 inches',
      price: 315000,
      originalPrice: 375000,
      rating: 4.6,
      reviews: 67,
      description: 'Light brown donor quality hair extensions. Perfect for highlights and dimension.',
      features: ['Light Brown Color', 'Donor Quality', '14 inches'],
      specifications: {
        'Hair Type': 'Peruvian',
        'Texture': 'Bone Straight',
        'Length': '14 inches',
        'Weight': '200 grams'
      },
      careInstructions: ['Color safe products', 'Avoid over-washing'],
      images: [
        '/image1.jpg', 
      ],
      availableSizes: ['14 inch'],
      availableColors: ['Light Brown'],
      inStock: true,
      sku: 'MLH-EXT-005',
      category: 'Extensions',
      isBestSeller: false,
      isNew: true
    },
    6: {
      id: 6,
      name: 'Burn orange 🍊 luxury hair 14 inches 229gram Closure 5x5',
      price: 380000,
      originalPrice: 450000,
      rating: 4.8,
      reviews: 156,
      description: 'Unique burn orange color luxury hair with 5x5 closure. Stand out with this vibrant color.',
      features: ['Custom Color', '5x5 Closure', 'Vibrant Orange'],
      specifications: {
        'Hair Type': 'Brazilian',
        'Texture': 'Straight',
        'Length': '14 inches',
        'Weight': '229 grams'
    },
      careInstructions: ['Color protectant products', 'Cold water wash'],
      images: [
        '/image1.jpg', 
      ],
      availableSizes: ['14 inch'],
      availableColors: ['Burn Orange'],
      inStock: true,
      sku: 'MLH-WIG-006',
      category: 'Wigs',
      isBestSeller: false,
      isNew: true
    }
  }

  // Get related products
  const getRelatedProducts = (currentProduct) => {
    if (!currentProduct) return []
    return Object.values(productsDatabase)
      .filter(p => p.id !== currentProduct.id && p.category === currentProduct.category)
      .slice(0, 4)
  }

  // Fetch product data
  useEffect(() => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const productData = productsDatabase[id]
      if (productData) {
        setProduct(productData)
        setSelectedSize(productData.availableSizes[0] || '')
        setSelectedColor(productData.availableColors[0] || '')
        setRelatedProducts(getRelatedProducts(productData))
      } else {
        // Product not found
        navigate('/shop')
      }
      setLoading(false)
    }, 500)
  }, [id, navigate])

  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-400" />)
      } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />)
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />)
      }
    }
    return stars
  }

  const addToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor,
      image: product.images[0]
    }
    
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingIndex = existingCart.findIndex(item => 
      item.id === cartItem.id && item.size === cartItem.size && item.color === cartItem.color
    )
    
    if (existingIndex > -1) {
      existingCart[existingIndex].quantity += quantity
    } else {
      existingCart.push(cartItem)
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart))
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  const buyNow = () => {
    addToCart()
    setTimeout(() => navigate('/checkout'), 500)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#9b83a3] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 md:pt-20">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slideIn">
          ✓ Added to cart successfully!
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex text-sm text-gray-500">
            <Link to="/" className="hover:text-[#9b83a3]">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-[#9b83a3]">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name.substring(0, 30)}...</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-4 relative group">
              <img 
                src={product.images[activeImage]} 
                alt={product.name}
                className="w-full h-[400px] object-cover"
              />
              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage(prev => (prev === 0 ? product.images.length - 1 : prev - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={() => setActiveImage(prev => (prev === product.images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`bg-white rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    activeImage === idx ? 'border-[#9b83a3] shadow-lg' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-24 object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Badges */}
            <div className="flex gap-2 mb-3">
              {product.isBestSeller && (
                <span className="bg-[#8c6020] text-white text-xs px-2 py-1 rounded-full">Bestseller</span>
              )}
              {product.isNew && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">New Arrival</span>
              )}
              {product.originalPrice && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  Save {formatNaira(product.originalPrice - product.price)}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-1">{renderStars(product.rating)}</div>
              <span className="text-gray-500">({product.reviews} reviews)</span>
              <span className="text-green-600 text-sm">✓ In Stock</span>
            </div>

            {/* Price */}
            <div className="mb-4">
              <span className="text-3xl font-bold text-[#9b83a3]">{formatNaira(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-gray-400 line-through text-xl ml-3">{formatNaira(product.originalPrice)}</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

            {/* Size Selection */}
            {product.availableSizes && product.availableSizes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Select Length:</h3>
                <div className="flex flex-wrap gap-3">
                  {product.availableSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg transition-all duration-300 ${
                        selectedSize === size 
                          ? 'border-[#9b83a3] bg-[#9b83a3] text-white' 
                          : 'border-gray-300 hover:border-[#9b83a3]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.availableColors && product.availableColors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Select Color:</h3>
                <div className="flex flex-wrap gap-3">
                  {product.availableColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg transition-all duration-300 ${
                        selectedColor === color 
                          ? 'border-[#9b83a3] bg-[#9b83a3] text-white' 
                          : 'border-gray-300 hover:border-[#9b83a3]'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Quantity:</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  <HiMinus />
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  <HiPlus />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={addToCart}
                className="flex-1 py-3 rounded-full border-2 border-[#9b83a3] text-[#9b83a3] font-semibold hover:bg-[#9b83a3] hover:text-white transition-all duration-300"
              >
                Add to Cart
              </button>
              <button
                onClick={buyNow}
                className="flex-1 py-3 rounded-full bg-[#9b83a3] text-white font-semibold hover:bg-[#8c6020] transition-all duration-300"
              >
                Buy Now
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:border-red-500 transition-all duration-300"
              >
                {isWishlisted ? <FaHeart className="text-red-500 text-xl" /> : <FaRegHeart className="text-gray-400 text-xl" />}
              </button>
            </div>

            {/* Shipping Info */}
            <div className="border-t border-gray-300 pt-6 space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <FaTruck className="text-xl" />
                <span>Free shipping on orders over ₦500,000</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <FaUndo className="text-xl" />
                <span>30-day returns policy</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <FaShieldAlt className="text-xl" />
                <span>Secure payment guaranteed</span>
              </div>
            </div>

            {/* SKU */}
            <div className="mt-4 pt-4 border-t border-gray-300">
              <p className="text-xs text-gray-400">SKU: {product.sku}</p>
            </div>

            {/* Share */}
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-3">Share this product:</p>
              <div className="flex gap-3">
                <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-[#1877f2] hover:text-white transition-colors">
                  <FaFacebook />
                </a>
                <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-[#E4405F] hover:text-white transition-colors">
                  <FaInstagram />
                </a>
                <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-[#25D366] hover:text-white transition-colors">
                  <FaWhatsapp />
                </a>
                <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-[#1DA1F2] hover:text-white transition-colors">
                  <FaTwitter />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-amber-50">
            <div className="flex gap-8 overflow-x-auto">
              <button className="pb-4 px-2 border-b-2 border-[#9b83a3] text-[#9b83a3] font-semibold whitespace-nowrap">
                Features
              </button>
            </div>
          </div>
          <div className="pt-6">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-600">
                  <span className="text-green-500">✓</span> {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Specifications</h2>
          <div className="bg-white rounded-xl p-6 overflow-x-auto">
            <table className="w-full">
              <tbody>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <tr key={key} className="border-b border-gray-300 last:border-0">
                    <td className="py-3 font-semibold text-gray-800 w-1/3">{key}</td>
                    <td className="py-3 text-gray-600">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Care Instructions */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Care Instructions</h2>
          <div className="bg-white rounded-xl p-6">
            <ul className="space-y-2">
              {product.careInstructions.map((instruction, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-600">
                  <span className="text-[#9b83a3] text-lg">•</span> {instruction}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map(relatedProduct => (
                <Link to={`/product/${relatedProduct.id}`} key={relatedProduct.id}>
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    <img 
                      src={relatedProduct.images[0]} 
                      alt={relatedProduct.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-3">
                      <h3 className="font-semibold text-sm line-clamp-2">{relatedProduct.name}</h3>
                      <p className="text-[#9b83a3] font-bold mt-1">{formatNaira(relatedProduct.price)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default ProductDetails