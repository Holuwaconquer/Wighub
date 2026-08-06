import React, { useState, useEffect } from "react";
import SEO from "../components/SEO";
import { Link, useLocation } from "react-router-dom";
import {
  BsFilter,
  BsGrid3X3,
  BsListUl,
  BsHeart,
  BsHeartFill,
} from "react-icons/bs";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { FaTimes, FaArrowRight, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/slices/productSlice";
import { addToCart, removeFromCart } from "../store/slices/cartSlice";
import {
  getSales,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../services/api";
import { getProductImageUrl } from "../utils/image";

const ShopPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { products, loading } = useSelector((state) => state.products);
  const cartItems = useSelector((state) => state.cart.items);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedHairType, setSelectedHairType] = useState("all");
  const [selectedLength, setSelectedLength] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [activeSales, setActiveSales] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const wishlistItems = await getWishlist();
        const ids = wishlistItems.map(
          (item) => item.product?._id || item.product,
        );
        setWishlist(ids);
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      }
    };

    loadWishlist();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search");
    const categoryParam = params.get("category");
    const typeParam = params.get("type");

    if (searchParam) {
      setSearchQuery(searchParam);
    } else {
      setSearchQuery("");
    }

    const normalizedCategory = normalizeCategoryValue(categoryParam);
    if (normalizedCategory === "sale") {
      setSelectedCategory("sale");
    } else if (normalizedCategory === "new") {
      setSelectedCategory("new");
    } else if (normalizedCategory && normalizedCategory !== "all") {
      setSelectedCategory(normalizedCategory);
    } else {
      setSelectedCategory("all");
    }

    const normalizedHairType = normalizeHairTypeValue(typeParam);
    if (normalizedHairType && normalizedHairType !== "all") {
      setSelectedHairType(normalizedHairType);
    } else {
      setSelectedHairType("all");
    }
  }, [location.search]);

  useEffect(() => {
    const loadActiveSales = async () => {
      if (selectedCategory !== "sale") {
        setActiveSales([]);
        return;
      }

      try {
        const sales = await getSales();
        const now = new Date();
        const visibleSales = (sales || []).filter((sale) => {
          const start = sale.startDate ? new Date(sale.startDate) : null;
          const end = sale.endDate ? new Date(sale.endDate) : null;
          // include active and upcoming sales (those that haven't ended yet)
          return sale.isActive !== false && end && end >= now;
        });
        setActiveSales(visibleSales);
      } catch (error) {
        console.error("Failed to load sales for shop page:", error);
      }
    };

    loadActiveSales();
  }, [selectedCategory]);

  useEffect(() => {
    const loadSaleProducts = async () => {
      if (selectedCategory !== "sale") {
        setSaleProducts([]);
        return;
      }

      try {
        const products = await getSaleProducts();
        setSaleProducts(products || []);
      } catch (error) {
        console.error("Failed to load sale products:", error);
      }
    };

    loadSaleProducts();
  }, [selectedCategory]);
  const categories = ["all", ...new Set(products.map((p) => p.category))];
  const hairTypes = ["all", ...new Set(products.map((p) => p.hairType))];
  const lengths = ["all", ...new Set(products.map((p) => p.length))];

  const formatNaira = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProductRating = (product) =>
    product?.ratings ?? product?.rating ?? 0;
  const getProductReviewCount = (product) =>
    product?.numReviews ?? product?.reviews ?? 0;

  const groupedSales = activeSales
    .map((sale) => {
      const filteredProducts = (sale.products || []).filter((product) => {
        if (selectedCategory === "new" && !product.isNew) return false;
        if (
          selectedCategory !== "all" &&
          selectedCategory !== "sale" &&
          selectedCategory !== "new" &&
          String(product.category || "").toLowerCase() !==
            String(selectedCategory).toLowerCase()
        )
          return false;
        if (
          selectedHairType !== "all" &&
          String(product.hairType || "").toLowerCase() !==
            String(selectedHairType).toLowerCase()
        )
          return false;
        if (
          selectedLength !== "all" &&
          String(product.length || "").toLowerCase() !==
            String(selectedLength).toLowerCase()
        )
          return false;

        const effectivePrice =
          product.salePrice ?? sale.salePrice ?? product.price;

        if (effectivePrice < priceRange[0] || effectivePrice > priceRange[1])
          return false;
        if (
          searchQuery &&
          !product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
          return false;
        return true;
      });

      return {
        ...sale,
        filteredProducts,
      };
    })
    .filter((sale) => sale.filteredProducts.length > 0);

  const totalSaleProducts = groupedSales.reduce(
    (sum, sale) => sum + sale.filteredProducts.length,
    0,
  );

  const filteredProducts = products.filter((product) => {
    if (selectedCategory === "new" && !product.isNew) return false;
    if (
      selectedCategory !== "all" &&
      selectedCategory !== "sale" &&
      selectedCategory !== "new" &&
      String(product.category || "").toLowerCase() !==
        String(selectedCategory).toLowerCase()
    )
      return false;
    if (
      selectedHairType !== "all" &&
      String(product.hairType || "").toLowerCase() !==
        String(selectedHairType).toLowerCase()
    )
      return false;
    if (selectedLength !== "all" && product.length !== selectedLength)
      return false;
    if (product.price < priceRange[0] || product.price > priceRange[1])
      return false;
    if (
      searchQuery &&
      !product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const getProductDateValue = (product) => {
    const candidates = [
      product?.createdAt,
      product?.updatedAt,
      product?.publishedAt,
      product?.dateCreated,
      product?.created_at,
      product?.updated_at,
    ];

    for (const candidate of candidates) {
      if (!candidate) continue;
      const parsed = new Date(candidate);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed.getTime();
      }
    }

    return 0;
  };

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (selectedCategory === "new" || sortBy === "newest") {
      const dateDifference = getProductDateValue(b) - getProductDateValue(a);
      if (dateDifference !== 0) return dateDifference;
      return Number(b.isNew) - Number(a.isNew);
    }

    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return getProductRating(b) - getProductRating(a);
      default:
        return 0;
    }
  });

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const normalizeCategoryValue = (value) => {
    if (!value) return "all";

    const normalized = value.toLowerCase();

    if (normalized === "sale") return "sale";
    if (normalized === "new" || normalized === "new-arrivals") return "new";
    if (normalized === "wigs") return "Wigs";
    if (normalized === "bundles") return "Bundles";
    if (normalized === "extensions") return "Extensions";
    if (normalized === "closures") return "Closures";
    if (normalized === "frontals") return "Frontals";

    return value;
  };

  const normalizeHairTypeValue = (value) => {
    if (!value) return "all";

    const normalized = value.toLowerCase();

    if (normalized === "straight" || normalized === "straight hair") {
      return "Straight Hair";
    }
    if (normalized === "curly" || normalized === "curly hair") {
      return "Curly Hair";
    }
    if (normalized === "wavy" || normalized === "wavy hair") {
      return "Wavy Hair";
    }
    if (normalized === "kinky" || normalized === "kinky hair") {
      return "Kinky Hair";
    }

    return value;
  };

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(""), 2000);
  };

  const handleAddToCart = (product) => {
    const isInCart = cartItems.some((item) => item.productId === product._id);
    if (isInCart) {
      dispatch(removeFromCart({ productId: product._id }));
      showToast("Removed from cart", "info");
    } else {
      dispatch(
        addToCart({
          productId: product._id,
          quantity: 1,
          price: product.price,
          name: product.name,
          image: product.images?.[0] || product.image || "/placeholder.jpg",
        }),
      );
      showToast("Added to cart", "success");
    }
  };

  const toggleWishlist = async (productId, event) => {
    event?.preventDefault();
    event?.stopPropagation();

    try {
      if (wishlist.includes(productId)) {
        await removeFromWishlist(productId);
        setWishlist((prev) => prev.filter((id) => id !== productId));
        showToast("Removed from wishlist", "info");
      } else {
        await addToWishlist(productId);
        setWishlist((prev) => [...prev, productId]);
        showToast("Added to wishlist", "success");
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      showToast(
        error?.response?.data?.message || "Please login to add to wishlist",
        "error",
      );
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
    }
    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt key="half" className="text-yellow-400 text-sm" />,
      );
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaStar key={`empty-${i}`} className="text-gray-300 text-sm" />,
      );
    }
    return stars;
  };

  const ProductCard = ({ product }) => {
    const isInCart = cartItems.some((item) => item.productId === product._id);
    const isInWishlist = wishlist.includes(product._id);
    const ratingValue = getProductRating(product);
    const reviewCount = getProductReviewCount(product);

    return (
      <div
        className={`group ${viewMode === "list" ? "flex gap-4" : ""} animate-fadeIn`}
      >
        <div
          className={`relative ${viewMode === "list" ? "w-44 flex-shrink-0" : ""}`}
        >
          <Link to={`/product/${product.slug || product._id}`}>
            <div
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 ${
                viewMode === "list" ? "h-44" : "h-50"
              }`}
            >
              <img
                src={getProductImageUrl(
                  product?.images?.[0] || product.image || "/placeholder.jpg",
                  {
                    width: 700,
                    height: 700,
                    crop: "fit",
                  },
                )}
                alt={product.name}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.jpg";
                }}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" /> */}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {product.isNew && (
                  <span className="bg-black text-white text-xs px-3 py-1 rounded-full font-medium tracking-wide">
                    NEW
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-medium tracking-wide">
                    BESTSELLER
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={(e) => toggleWishlist(product._id, e)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
              >
                {isInWishlist ? (
                  <BsHeartFill className="text-red-500 text-lg" />
                ) : (
                  <BsHeart className="text-gray-600 text-lg hover:text-red-500 transition-colors" />
                )}
              </button>

              {product.stock <= 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-white font-medium text-lg tracking-wide">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
          </Link>
        </div>

        <div className="mt-5 space-y-3">
          <Link to={`/product/${product.slug || product._id}`}>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="uppercase tracking-wide">
                {product.category || "Hair"}
              </span>
              {product.length && (
                <>
                  <span className="text-gray-300">•</span>
                  <span>{product.length}"</span>
                </>
              )}
            </div>

            <h3 className="font-bold text-gray-800 text-lg group-hover:text-amber-600 transition-colors line-clamp-2">
              {product.name.toUpperCase()}
            </h3>

            {ratingValue > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex gap-1">{renderStars(ratingValue)}</div>
                <span className="text-sm text-gray-500">({reviewCount})</span>
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center">
              <p className="font-extrabold text-2xl text-gray-900">
                {formatNaira(product.salePrice ?? product.price)}
              </p>
              {(product.originalPrice || product.salePrice) &&
                (product.originalPrice ?? product.salePrice) >
                  (product.salePrice ?? product.price) && (
                  <p className="text-gray-400 line-through text-sm">
                    {formatNaira(product.originalPrice ?? product.price)}
                  </p>
                )}
            </div>

            {product.stock > 0 && product.stock < 10 && (
              <p className="text-amber-600 text-xs font-medium">
                Only {product.stock} left
              </p>
            )}
          </Link>

          <button
            onClick={() => handleAddToCart(product)}
            disabled={product.stock <= 0}
            className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
              product.stock <= 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : isInCart
                  ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                  : "bg-black text-white hover:bg-gray-800 hover:shadow-lg transform hover:-translate-y-0.5"
            }`}
          >
            {isInCart ? "Remove from Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    );
  };

  const activeFiltersCount = [
    selectedCategory !== "all",
    selectedHairType !== "all",
    selectedLength !== "all",
    searchQuery !== "",
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={`Shop | Minka Luxury Hair`}
        description={`Shop premium wigs, closures, frontals and extensions. ${products.length} items available.`}
        url={`https://minkaluxury.com/shop`}
      />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-light tracking-tight text-gray-900 mb-2">
              Shop Our Collection
            </h1>
            <div className="w-20 h-px bg-amber-400 mx-auto "></div>
            <p className="text-gray-500 text-lg font-light leading-relaxed">
              Discover premium quality human hair wigs, extensions, and
              accessories
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {selectedCategory === "sale" && (
          <div className="mb-8 rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
                  On Sale
                </p>
                <h2 className="text-3xl font-semibold text-gray-900">
                  Limited-time offers
                </h2>
                <p className="mt-2 text-gray-600">
                  Fresh discounts handpicked for you.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeSales.length > 0 ? (
                  activeSales.map((sale) => (
                    <span
                      key={sale._id}
                      className="rounded-full bg-white px-4 py-2 text-sm font-medium text-amber-700 shadow-sm"
                    >
                      {sale.name}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-amber-700 shadow-sm">
                    Live promotions
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div
            className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-2xl backdrop-blur-md transition-all duration-300 ${
              toastType === "success"
                ? "bg-green-500 text-white"
                : "bg-gray-800 text-white"
            }`}
          >
            {toastMessage}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-2 border-gray-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-amber-500 absolute top-0 left-0"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full py-3 bg-white border border-gray-200 rounded-xl flex items-center justify-center gap-2 hover:border-gray-300 transition-colors"
              >
                <BsFilter className="text-lg" />
                <span className="font-medium">Filters & Sort</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <div
                className={`${showFilters ? "block" : "hidden"} lg:block lg:w-72 flex-shrink-0`}
              >
                <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-medium text-gray-900 text-lg">
                      Filters
                    </h3>
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={() => {
                          setSelectedCategory("all");
                          setSelectedHairType("all");
                          setSelectedLength("all");
                          setSearchQuery("");
                          setPriceRange([0, 2000000]);
                        }}
                        className="text-sm text-amber-600 hover:text-amber-700 transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  {/* Search */}
                  <div className="mb-8">
                    <h4 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wide">
                      Search
                    </h4>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 pl-11 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                      />
                      <HiMiniMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="mb-8">
                    <h4 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wide">
                      Category
                    </h4>
                    <div className="space-y-2">
                      {categories.map((cat) => (
                        <label
                          key={cat}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name="category"
                            checked={selectedCategory === cat}
                            onChange={() => setSelectedCategory(cat)}
                            className="w-4 h-4 accent-amber-500"
                          />
                          <span className="text-gray-600 capitalize group-hover:text-gray-900 transition-colors">
                            {cat === "all" ? "All Categories" : cat}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Hair Type */}
                  <div className="mb-8">
                    <h4 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wide">
                      Hair Type
                    </h4>
                    <div className="space-y-2">
                      {hairTypes.map((type) => (
                        <label
                          key={type}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name="hairType"
                            checked={selectedHairType === type}
                            onChange={() => setSelectedHairType(type)}
                            className="w-4 h-4 accent-amber-500"
                          />
                          <span className="text-gray-600 capitalize group-hover:text-gray-900 transition-colors">
                            {type === "all" ? "All Types" : type}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Length */}
                  <div className="mb-8">
                    <h4 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wide">
                      Length
                    </h4>
                    <div className="space-y-2">
                      {lengths.map((len) => (
                        <label
                          key={len}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name="length"
                            checked={selectedLength === len}
                            onChange={() => setSelectedLength(len)}
                            className="w-4 h-4 accent-amber-500"
                          />
                          <span className="text-gray-600 group-hover:text-gray-900 transition-colors">
                            {len === "all" ? "All Lengths" : `${len}"`}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wide">
                      Price Range
                    </h4>
                    <div className="space-y-3">
                      <input
                        type="range"
                        min="0"
                        max="2000000"
                        step="50000"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([
                            priceRange[0],
                            parseInt(e.target.value),
                          ])
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{formatNaira(priceRange[0])}</span>
                        <span>{formatNaira(priceRange[1])}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Section */}
              <div className="flex-1">
                {/* Sort and View Controls */}
                <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                  <p className="text-gray-500 text-sm">
                    Showing{" "}
                    <span className="font-medium text-gray-900">
                      {selectedCategory === "sale"
                        ? totalSaleProducts
                        : sortedProducts.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-900">
                      {selectedCategory === "sale"
                        ? totalSaleProducts
                        : products.length}
                    </span>{" "}
                    products
                  </p>

                  <div className="flex gap-3">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm cursor-pointer"
                    >
                      <option value="featured">Sort by: Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Best Rating</option>
                      <option value="newest">Newest First</option>
                    </select>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-lg transition-colors ${
                          viewMode === "grid"
                            ? "bg-amber-500 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <BsGrid3X3 />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-lg transition-colors ${
                          viewMode === "list"
                            ? "bg-amber-500 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <BsListUl />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Products Display */}
                {selectedCategory === "sale" ? (
                  groupedSales.length > 0 ? (
                    groupedSales.map((sale) => (
                      <div key={sale._id} className="mb-4">
                        <div className="mb-4 rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
                          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
                                {sale.isActive
                                  ? "Active Sale"
                                  : "Upcoming Sale"}
                              </p>
                              <h3 className="text-2xl font-semibold text-gray-900">
                                {sale.name}
                              </h3>
                              <p className="absolute top-0 right-0 text-gray-600">
                                {sale.discountPercentage
                                  ? `${sale.discountPercentage}% off`
                                  : sale.salePrice
                                    ? `${formatNaira(sale.salePrice)}`
                                    : "Special pricing"}
                              </p>
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(sale.startDate).toLocaleDateString()} -{" "}
                              {new Date(sale.endDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div
                          className={
                            viewMode === "grid"
                              ? "grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10"
                              : "space-y-4"
                          }
                        >
                          {sale.filteredProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl">
                      <div className="max-w-md mx-auto">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <BsFilter className="text-3xl text-gray-400" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-800 mb-2">
                          No sale products found
                        </h3>
                        <p className="text-gray-500 mb-6">
                          Try adjusting filters or check back later.
                        </p>
                        <button
                          onClick={() => {
                            setSelectedCategory("all");
                            setSelectedHairType("all");
                            setSelectedLength("all");
                            setSearchQuery("");
                            setPriceRange([0, 2000000]);
                          }}
                          className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
                        >
                          Clear All Filters
                        </button>
                      </div>
                    </div>
                  )
                ) : sortedProducts.length > 0 ? (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10"
                        : "space-y-6"
                    }
                  >
                    {sortedProducts.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-gray-50 rounded-2xl">
                    <div className="max-w-md mx-auto">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BsFilter className="text-3xl text-gray-400" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-800 mb-2">
                        No products found
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Try adjusting your filters or search criteria
                      </p>
                      <button
                        onClick={() => {
                          setSelectedCategory("all");
                          setSelectedHairType("all");
                          setSelectedLength("all");
                          setSearchQuery("");
                          setPriceRange([0, 2000000]);
                        }}
                        className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
