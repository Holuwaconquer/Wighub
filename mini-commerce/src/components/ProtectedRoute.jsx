import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />
    } else {
      return <Navigate to="/user/dashboard" replace />
    }
  }

  return children
}

export default ProtectedRoute