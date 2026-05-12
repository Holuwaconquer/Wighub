import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FaStar, FaStarHalfAlt, FaRegStar, FaTruck, FaShieldAlt, FaUndo, FaHeart, FaRegHeart, FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { HiMinus, HiPlus } from 'react-icons/hi'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import api, { getProductReviews, getUserReviews } from '../services/api'

const ProductDetails = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [userReview, setUserReview] = useState(null)

  // Fetch product data
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/products/slug/${slug}`)
        setProduct(response.data)
        setError(null)
      } catch (err) {
        setError('Product not found')
        console.error('Failed to load product:', err)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      loadProduct()
    }
  }, [slug])

  // Set default selections when product loads
  useEffect(() => {
    if (product) {
      setSelectedSize(product.availableSizes?.[0] || '')
      setSelectedColor(product.availableColors?.[0] || '')
      // Get related products (same category, limit 4)
      const related = product.relatedProducts || []
      setRelatedProducts(related.slice(0, 4))
      
      // Load reviews for this product
      loadReviews(product._id)
    }
  }, [product])

  // Load reviews for the product and optionally include the current user's review
  const loadReviews = async (productId) => {
    try {
      setReviewsLoading(true)
      const reviewsData = await getProductReviews(productId)
      const approvedReviews = Array.isArray(reviewsData) ? reviewsData : reviewsData.reviews || []

      let currentUserReview = null
      try {
        const userReviews = await getUserReviews()
        if (Array.isArray(userReviews)) {
          currentUserReview = userReviews.find(
            (review) => String(review.product?._id || review.product) === String(productId)
          )
        }
      } catch (err) {
        currentUserReview = null
      }

      if (currentUserReview) {
        if (!currentUserReview.user?.name) {
          currentUserReview.user = { name: 'You' }
        }
        setUserReview(currentUserReview)
        if (!approvedReviews.some((review) => review._id === currentUserReview._id)) {
          setReviews([currentUserReview, ...approvedReviews])
          return
        }
      }

      setUserReview(currentUserReview)
      setReviews(approvedReviews)
    } catch (err) {
      console.error('Failed to load reviews:', err)
      setReviews([])
      setUserReview(null)
    } finally {
      setReviewsLoading(false)
    }
  }

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

  const handleAddToCart = () => {
    if (!product) return

    dispatch(addToCart({
      productId: product._id,
      quantity: quantity,
      price: product.price,
      name: product.name,
      size: selectedSize,
      color: selectedColor,
      image: product.images?.[0] || product.image
    }))

    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  const buyNow = () => {
    handleAddToCart()
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
    return (
      <div className="min-h-screen bg-gray-50 pt-32 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Product not found</p>
          <Link to="/shop" className="mt-4 inline-block px-6 py-2 bg-[#9b83a3] text-white rounded-lg">
            Back to Shop
          </Link>
        </div>
      </div>
    )
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
                src={product.images?.[activeImage] || product.image || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-[400px] object-cover"
              />
              {/* Navigation Arrows */}
              {product.images && product.images.length > 1 && (
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
            {product.images && product.images.length > 1 && (
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
            )}
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
              <div className="flex gap-1">{renderStars(product.rating || 0)}</div>
              <span className="text-gray-500">({product.reviews || 0} reviews)</span>
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
                onClick={handleAddToCart}
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
              <p className="text-xs text-gray-400">SKU: {product.sku || product._id}</p>
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
        {product.features && product.features.length > 0 && (
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
        )}

        {/* Specifications */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
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
        )}

        {/* Care Instructions */}
        {product.careInstructions && product.careInstructions.length > 0 && (
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
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map(relatedProduct => (
                <Link to={`/product/${relatedProduct.slug || relatedProduct._id}`} key={relatedProduct._id}>
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    <img
                      src={relatedProduct.images?.[0] || relatedProduct.image || '/placeholder.jpg'}
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

        {/* Customer Reviews */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          {reviewsLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading reviews...</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review._id} className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{review.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex gap-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-600">({review.rating}/5)</span>
                      </div>
                    </div>
                    {review.status && (
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-700'}`}>
                        <span>{review.status === 'pending' ? '⌛' : '✓'}</span>
                        <span>{review.status === 'pending' ? 'Pending Approval' : 'Verified Purchase'}</span>
                      </div>
                    )}
                    {!review.status && review.isVerified && (
                      <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full text-sm text-green-700">
                        <span>✓</span>
                        <span>Verified Purchase</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 mb-3">{review.comment}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">by {review.user?.name || 'Anonymous'}</span>
                    <span className="text-xs text-gray-400">
                      {review.createdAt && new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <p className="text-gray-500 mb-2">No reviews yet</p>
              <p className="text-sm text-gray-400">Be the first to review this product after your purchase!</p>
            </div>
          )}
        </div>
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
      