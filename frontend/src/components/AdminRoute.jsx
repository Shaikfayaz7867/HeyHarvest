import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute
