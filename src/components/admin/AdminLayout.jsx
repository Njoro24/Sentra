import React, { useState } from 'react'
import { Menu, X, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function AdminLayout({ children, activeTab, setActiveTab }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()

  const tabs = [
    { id: 'health', label: 'System Health' },
    { id: 'metrics', label: 'Daily Metrics' },
    { id: 'clients', label: 'Clients' },
    { id: 'revenue', label: 'Revenue' },
    { id: 'fraud', label: 'Fraud Analytics' },
    { id: 'monitoring', label: 'Real-time' },
    { id: 'support', label: 'Support' },
    { id: 'settings', label: 'Settings' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    navigate('/admin')
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #071e52 0%, #0f4db5 55%, #2277ee 100%)' }}>
      {/* Header */}
      <div className="bg-white/10 border-b border-white/20 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-all"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="Sentra" className="w-8 h-8" />
              <span className="text-xl font-bold text-white" style={{ fontFamily: 'Syne' }}>Sentra Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/70 text-sm">{new Date().toLocaleString()}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-200 rounded-lg transition-all"
            >
              <LogOut size={18} />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-64 bg-white/10 border-r border-white/20 backdrop-blur-md min-h-screen p-4 space-y-2">
            {tabs.map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left relative group ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white border border-white/50'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {/* Creative indicator */}
                <div className={`w-2 h-8 rounded-full transition-all ${
                  activeTab === tab.id ? 'bg-gradient-to-b from-[#7ab8f5] to-[#2277ee]' : 'bg-white/20'
                }`}></div>
                <span className="font-medium">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute right-2 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-8 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
