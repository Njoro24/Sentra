import React from 'react'
import { Navigate } from 'react-router-dom'

export default function AdminProtectedRoute({ children }) {
  // Get admin user from localStorage (set during admin login)
  const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}')
  const adminToken = localStorage.getItem('admin_token')

  // Check if admin is authenticated
  if (!adminToken || !adminUser.admin_id) {
    return <Navigate to="/admin" replace />
  }

  return children
}
