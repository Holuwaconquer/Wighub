import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 300000,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token and user data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Instead of redirecting immediately, let Redux handle the logout
      // This prevents the blank page issue
      window.dispatchEvent(new CustomEvent("auth-error"));
    }
    return Promise.reject(error);
  },
);

// Function to validate token
export const validateToken = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await api.get("/auth/profile");
    return response.data;
  } catch (error) {
    // Clear invalid token
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    throw error.response?.data || error.message;
  }
};

// ==================== AUTH SERVICES ====================

export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    if (response.data.token) {
      const { token, ...user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.token) {
      const { token, ...user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

export const getProfile = async () => {
  try {
    const response = await api.get("/auth/profile");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await api.put("/auth/profile", userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await api.put(`/auth/reset-password/${token}`, {
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ==================== PRODUCT SERVICES ====================

export const getProducts = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.category && filters.category !== "all")
      params.append("category", filters.category);
    if (filters.hairType && filters.hairType !== "all")
      params.append("hairType", filters.hairType);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
    if (filters.sort) params.append("sort", filters.sort);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);

    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getProductBySlug = async (slug) => {
  try {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getFeaturedProducts = async () => {
  try {
    const response = await api.get("/products/featured");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getNewArrivals = async () => {
  try {
    const response = await api.get("/products/new-arrivals");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getBestSellers = async () => {
  try {
    const response = await api.get("/products/best-sellers");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getSaleProducts = async () => {
  try {
    const response = await api.get("/products/sale-products");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getProductsByCategory = async (category) => {
  try {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getRelatedProducts = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}/related`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ==================== CART SERVICES ====================

export const getCart = async () => {
  try {
    const response = await api.get("/cart");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const addToCart = async (
  productId,
  quantity = 1,
  size = null,
  color = null,
) => {
  try {
    const response = await api.post("/cart", {
      productId,
      quantity,
      size,
      color,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateCartItem = async (itemId, quantity) => {
  try {
    const response = await api.put(`/cart/${itemId}`, { quantity });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const removeFromCart = async (itemId) => {
  try {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const clearCart = async () => {
  try {
    const response = await api.delete("/cart");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ==================== ORDER SERVICES ====================

export const createOrder = async (orderData) => {
  try {
    const response = await api.post("/orders", orderData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getMyOrders = async () => {
  try {
    const response = await api.get("/orders");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await api.put(`/orders/${orderId}/cancel`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ==================== REVIEW SERVICES ====================

export const createReview = async (reviewData) => {
  try {
    const response = await api.post("/reviews", reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getProductReviews = async (productId) => {
  try {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUserReviews = async () => {
  try {
    const response = await api.get("/reviews/user");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const markReviewHelpful = async (reviewId) => {
  try {
    const response = await api.put(`/reviews/${reviewId}/helpful`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ==================== USER SERVICES ====================

export const getWishlist = async () => {
  try {
    const response = await api.get("/users/wishlist");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const addToWishlist = async (productId) => {
  try {
    const response = await api.post(`/users/wishlist/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const removeFromWishlist = async (productId) => {
  try {
    const response = await api.delete(`/users/wishlist/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAddresses = async () => {
  try {
    const response = await api.get("/users/addresses");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const addAddress = async (addressData) => {
  try {
    const response = await api.post("/users/addresses", addressData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateAddress = async (addressId, addressData) => {
  try {
    const response = await api.put(
      `/users/addresses/${addressId}`,
      addressData,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteAddress = async (addressId) => {
  try {
    const response = await api.delete(`/users/addresses/${addressId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const setDefaultAddress = async (addressId) => {
  try {
    const response = await api.put(`/users/addresses/${addressId}/default`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ==================== COUPON SERVICES ====================

export const validateCoupon = async (code, total) => {
  try {
    const response = await api.post("/coupons/validate", { code, total });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getShippingLocations = async () => {
  try {
    const response = await api.get("/shipping-locations");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createShippingLocation = async (locationData) => {
  try {
    const response = await api.post("/shipping-locations", locationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateShippingLocation = async (id, locationData) => {
  try {
    const response = await api.put(`/shipping-locations/${id}`, locationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteShippingLocation = async (id) => {
  try {
    const response = await api.delete(`/shipping-locations/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ==================== PAYMENT SERVICES ====================

export const initializePayment = async (
  orderData,
  amount,
  email,
  name,
  channels = ["card", "bank_transfer", "pay_with_bank"],
  defaultChannel = "card",
) => {
  try {
    const response = await api.post("/payments/initialize", {
      ...orderData,
      amount,
      email,
      name,
      channels,
      defaultChannel,
      currency: "NGN",
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const verifyPayment = async (orderId) => {
  try {
    const response = await api.post("/payments/verify", { orderId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ==================== ADMIN SERVICES ====================

// Dashboard
export const getDashboardStats = async () => {
  try {
    const response = await api.get("/admin/stats");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// User Management (Admin)
export const getAllUsers = async () => {
  try {
    const response = await api.get("/admin/users");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Product Management (Admin)
export const createProduct = async (productData) => {
  try {
    const response = await api.post("/admin/products", productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const response = await api.put(`/admin/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/admin/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Order Management (Admin)
export const getAllOrders = async (status = "all", page = 1) => {
  try {
    const response = await api.get(
      `/admin/orders?status=${status}&page=${page}`,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateOrderStatus = async (
  orderId,
  status,
  trackingNumber = null,
) => {
  try {
    const response = await api.put(`/admin/orders/${orderId}/status`, {
      status,
      trackingNumber,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Coupon Management (Admin)
export const getCoupons = async () => {
  try {
    const response = await api.get("/coupons");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createCoupon = async (couponData) => {
  try {
    const response = await api.post("/coupons", couponData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateCoupon = async (couponId, couponData) => {
  try {
    const response = await api.put(`/coupons/${couponId}`, couponData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteCoupon = async (couponId) => {
  try {
    const response = await api.delete(`/coupons/${couponId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Sale Management (Admin)
export const getSales = async () => {
  try {
    const response = await api.get("/sales");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createSale = async (saleData) => {
  try {
    const response = await api.post("/sales", saleData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateSale = async (saleId, saleData) => {
  try {
    const response = await api.put(`/sales/${saleId}`, saleData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteSale = async (saleId) => {
  try {
    const response = await api.delete(`/sales/${saleId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Review Management (Admin)
export const getAllReviews = async () => {
  try {
    const response = await api.get("/reviews/admin/all");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const approveReview = async (reviewId) => {
  try {
    const response = await api.put(`/reviews/admin/${reviewId}/approve`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const response = await api.delete(`/reviews/admin/${reviewId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ==================== HELPER FUNCTIONS ====================

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === "admin";
};

export const getToken = () => {
  return localStorage.getItem("token");
};

// Export the api instance for custom requests
export default api;
