import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  if (isAuthenticated) {
    // Redirect based on role
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />
    } else {
      return <Navigate to="/user/dashboard" replace />
    }
  }

  return children
}

export default PublicRoute