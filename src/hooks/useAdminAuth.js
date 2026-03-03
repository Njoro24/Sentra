import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function useAdminAuth() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      navigate('/admin')
    }
  }, [navigate])

  const getToken = () => localStorage.getItem('admin_token')
  
  const logout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    navigate('/admin')
  }

  return { getToken, logout }
}
