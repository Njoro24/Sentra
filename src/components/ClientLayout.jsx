import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LogOut, Menu, X, Home, CreditCard, BarChart3, Settings, Lock, HelpCircle, FileText } from 'lucide-react'
import { api } from '../services/api'

export default function ClientLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await api.logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/transactions', label: 'Transactions', icon: CreditCard },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/billing', label: 'Billing', icon: FileText },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/security', label: 'Security', icon: Lock },
    { path: '/support', label: 'Support', icon: HelpCircle }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-screen w-64 bg-slate-800 border-r border-slate-700 transition-transform duration-300 z-40 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Syne' }}>Sentra</h1>
          <p className="text-xs text-slate-400 mt-1">Fraud Detection</p>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <button
              key={path}
              onClick={() => {
                navigate(path)
                setMobileMenuOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive(path)
                  ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="hidden lg:block">
              <h2 className="text-lg font-semibold text-white">Sentra Fraud Detection</h2>
              <p className="text-xs text-slate-400">Real-time transaction monitoring</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-300">Welcome back</p>
                <p className="text-xs text-slate-500">Your account is secure</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  )
}
