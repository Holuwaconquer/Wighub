import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../../store/slices/authSlice'
import DashboardTopBar from '../../components/DashboardTopBar'
import { 
  FaTachometerAlt, FaUser, FaShoppingBag, FaHeart, 
  FaMapMarkerAlt, FaKey, FaCog, FaSignOutAlt, FaBars, 
  FaTimes, FaUserCircle
} from 'react-icons/fa'

const UserLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, user: authUser } = useSelector(state => state.auth)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setUser(authUser)
  }, [isAuthenticated, authUser, navigate])

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/login')
  }

  const menuItems = [
    { path: '/user/dashboard', name: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/user/profile', name: 'Profile', icon: <FaUser /> },
    { path: '/user/orders', name: 'My Orders', icon: <FaShoppingBag /> },
    { path: '/user/wishlist', name: 'Wishlist', icon: <FaHeart /> },
    { path: '/user/addresses', name: 'Addresses', icon: <FaMapMarkerAlt /> },
    { path: '/user/change-password', name: 'Change Password', icon: <FaKey /> },
    { path: '/user/settings', name: 'Settings', icon: <FaCog /> },
  ]

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8a0fb3]"></div>
      </div>
    )
  }

  const pageTitles = {
    '/user/dashboard': 'My Dashboard',
    '/user/profile': 'Profile',
    '/user/orders': 'My Orders',
    '/user/wishlist': 'Wishlist',
    '/user/addresses': 'Addresses',
    '/user/change-password': 'Change Password',
    '/user/settings': 'Settings'
  }

  const pageTitle = pageTitles[location.pathname] || 'Dashboard'

  return (
    <div className="min-h-screen bg-gray-100 pt-5">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        <FaBars />
      </button>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 pt-5
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* User Info */}
        <div className="p-6 border-b border-gray-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#8a0fb3] rounded-full flex items-center justify-center">
              <FaUserCircle className="text-white text-2xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{user.name || 'Customer'}</h3>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200
                ${location.pathname === item.path
                  ? 'bg-[#8a0fb3] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 mt-4"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <DashboardTopBar
            title={pageTitle}
            subtitle="User Dashboard"
            userName={user?.name || 'Customer'}
            userRole={user?.role || 'customer'}
          />
          {children}
        </div>
      </div>
    </div>
  )
}

export default UserLayout