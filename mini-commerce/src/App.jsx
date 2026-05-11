import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { validateToken, logoutUser } from './store/slices/authSlice'
import { loadCart } from './store/slices/cartSlice'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import ScrollToTop from './ScrollToTop'
// Public Pages
import HomePage from './pages/HomePage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ShopPage from './pages/ShopPage'
import ProductDetails from './pages/ProductDetails'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'

// User Dashboard Pages
import Dashboard from './pages/user/Dashboard'
import Profile from './pages/user/Profile'
import UserOrders from './pages/user/Orders'
import OrderDetails from './pages/user/OrderDetails'
import Wishlist from './pages/user/Wishlist'
import Addresses from './pages/user/Addresses'
import ChangePassword from './pages/user/ChangePassword'
import UserSettings from './pages/user/Settings'

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import Products from './pages/admin/Products'
import AddProduct from './pages/admin/AddProduct'
import EditProduct from './pages/admin/EditProduct'
import Orders from './pages/admin/Orders'
import OrderDetailsAdmin from './pages/admin/OrderDetails'
import Customers from './pages/admin/Customers'
import Reviews from './pages/admin/Reviews'
import Coupons from './pages/admin/Coupons'
import Analytics from './pages/admin/Analytics'
import Settings from './pages/admin/Settings'
import ShippingLocations from './pages/admin/ShippingLocations'

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 120,
    });

    // Load cart from localStorage
    dispatch(loadCart());

    // Validate token on app load
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      dispatch(validateToken());
    }

    // Listen for auth errors from API interceptor
    const handleAuthError = () => {
      dispatch(logoutUser());
    };

    window.addEventListener('auth-error', handleAuthError);

    return () => {
      window.removeEventListener('auth-error', handleAuthError);
    };
  }, [dispatch, isAuthenticated]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes - Accessible to everyone */}
        <Route path="/" element={<HomePage />}>
          <Route index element={<LandingPage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="product/:slug" element={<ProductDetails />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="order-confirmation/:orderId" element={
            <ProtectedRoute>
              <OrderConfirmationPage />
            </ProtectedRoute>
          } />
        </Route>

        {/* Auth Routes - Redirect to dashboard if already logged in */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* User Dashboard Routes - Protected for regular users */}
        <Route path="/user/dashboard" element={
          <ProtectedRoute requiredRole="user">
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/user/profile" element={
          <ProtectedRoute requiredRole="user">
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/user/orders" element={
          <ProtectedRoute requiredRole="user">
            <UserOrders />
          </ProtectedRoute>
        } />
        <Route path="/user/orders/:id" element={
          <ProtectedRoute requiredRole="user">
            <OrderDetails />
          </ProtectedRoute>
        } />
        <Route path="/user/wishlist" element={
          <ProtectedRoute requiredRole="user">
            <Wishlist />
          </ProtectedRoute>
        } />
        <Route path="/user/addresses" element={
          <ProtectedRoute requiredRole="user">
            <Addresses />
          </ProtectedRoute>
        } />
        <Route path="/user/change-password" element={
          <ProtectedRoute requiredRole="user">
            <ChangePassword />
          </ProtectedRoute>
        } />
        <Route path="/user/settings" element={
          <ProtectedRoute requiredRole="user">
            <UserSettings />
          </ProtectedRoute>
        } />

        {/* Admin Routes - Protected for admin users */}
        <Route path="/admin/login" element={
          <PublicRoute>
            <AdminLogin />
          </PublicRoute>
        } />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/products" element={
          <ProtectedRoute requiredRole="admin">
            <Products />
          </ProtectedRoute>
        } />
        <Route path="/admin/products/add" element={
          <ProtectedRoute requiredRole="admin">
            <AddProduct />
          </ProtectedRoute>
        } />
        <Route path="/admin/products/edit/:slug" element={
          <ProtectedRoute requiredRole="admin">
            <EditProduct />
          </ProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedRoute requiredRole="admin">
            <Orders />
          </ProtectedRoute>
        } />
        <Route path="/admin/orders/:id" element={
          <ProtectedRoute requiredRole="admin">
            <OrderDetailsAdmin />
          </ProtectedRoute>
        } />
        <Route path="/admin/customers" element={
          <ProtectedRoute requiredRole="admin">
            <Customers />
          </ProtectedRoute>
        } />
        <Route path="/admin/reviews" element={
          <ProtectedRoute requiredRole="admin">
            <Reviews />
          </ProtectedRoute>
        } />
        <Route path="/admin/coupons" element={
          <ProtectedRoute requiredRole="admin">
            <Coupons />
          </ProtectedRoute>
        } />
        <Route path="/admin/shipping-locations" element={
          <ProtectedRoute requiredRole="admin">
            <ShippingLocations />
          </ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute requiredRole="admin">
            <Analytics />
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute requiredRole="admin">
            <Settings />
          </ProtectedRoute>
        } />

        {/* Catch all - 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <a
        href='https://wa.me/message/DSAULOSKOI4XG1'
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-4 left-7 z-100 bg-[#25D366] hover:bg-[#1ebe5d] mr-2 text-white p-4 rounded-full shadow-lg transition-colors"
        title="Contact us on WhatsApp"
      >
        <span className="sr-only">WhatsApp</span>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.1-.472-.149-.672.15-.199.297-.768.967-.94 1.165-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.133-.132.297-.347.446-.52.149-.173.198-.298.298-.497.1-.199.05-.373-.025-.522-.075-.148-.672-1.612-.921-2.209-.242-.579-.487-.5-.672-.51l-.573-.01c-.199 0-.522.074-.795.373s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.414.248-.694.248-1.289.173-1.414-.074-.124-.273-.198-.57-.347z" />
          <path d="M12.001 2.003c-5.523 0-10 4.477-10 10 0 1.767.462 3.498 1.337 5.02l-1.38 5.032 5.16-1.356c1.4.764 2.985 1.171 4.882 1.171 5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 18.17c-1.53 0-2.992-.406-4.224-1.16l-.302-.18-3.062.805.817-2.986-.196-.307c-.863-1.345-1.318-2.886-1.318-4.372 0-4.524 3.677-8.2 8.2-8.2 4.523 0 8.2 3.676 8.2 8.2 0 4.523-3.677 8.2-8.2 8.2z" />
        </svg>
      </a>
    </>
  )
}

export default App