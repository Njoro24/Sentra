import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Menu, X, Bell, Copy, Check } from 'lucide-react'

export default function DashboardSettings() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [client, setClient] = useState(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('token')
  const clientData = JSON.parse(localStorage.getItem('client') || '{}')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    fetchSettings()
  }, [token, navigate])

  const fetchSettings = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` }
      const res = await fetch('http://localhost:8000/auth/me', { headers })
      if (res.ok) {
        setClient(await res.json())
      }
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('client')
    navigate('/login')
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* SIDEBAR */}
      <aside className={`fixed md:relative w-60 bg-slate-900 min-h-screen transition-transform duration-300 z-40 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } flex flex-col border-r border-indigo-500/10`}>
        <div className="p-7 border-b border-indigo-500/10">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Sentra" className="w-8 h-8" />
            <div>
              <div className="text-white font-bold text-sm tracking-wide">Sentra</div>
              <div className="text-xs text-white/35 tracking-widest uppercase">Fraud Intelligence</div>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 mx-3 mt-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
          <div className="text-xs font-semibold text-white">{clientData.name}</div>
          <div className="text-xs text-white/40 mt-1">{clientData.subscription_tier} Plan</div>
          <div className="inline-block mt-2 px-2 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-xs text-indigo-300 font-semibold uppercase tracking-wider">Active</div>
        </div>

        <nav className="flex-1 p-3 mt-4">
          <div className="text-xs font-semibold text-white/20 uppercase tracking-widest px-3 py-2">Main</div>
          <a href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/7 font-medium text-sm mb-1 transition">
            <span>⬛</span> Overview
          </a>
          <a href="/dashboard/feed" className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/7 font-medium text-sm mb-1 transition">
            <span>⚡</span> Live Feed
          </a>
          <a href="/dashboard/analytics" className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/7 font-medium text-sm mb-1 transition">
            <span>📊</span> Analytics
          </a>
          <a href="/dashboard/investigations" className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/7 font-medium text-sm transition">
            <span>🔍</span> Investigations
          </a>

          <div className="text-xs font-semibold text-white/20 uppercase tracking-widest px-3 py-2 mt-6">Account</div>
          <a href="/dashboard/settings" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500/15 text-white font-medium text-sm">
            <span>⚙️</span> Settings
          </a>
        </nav>

        <div className="p-4 border-t border-indigo-500/10">
          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/6 cursor-pointer transition">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">JM</div>
            <div>
              <div className="text-xs font-semibold text-white">{clientData.name}</div>
              <div className="text-xs text-white/35">Fraud Analyst</div>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full mt-2 px-3 py-2 text-pink-400 hover:bg-pink-500/10 rounded-lg text-sm font-medium transition flex items-center gap-2">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <div className="bg-slate-800/50 border-b border-indigo-500/10 px-8 h-16 flex items-center justify-between sticky top-0 z-30">
          <div>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-white">
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="hidden md:block">
              <div className="text-lg font-bold text-white">Settings</div>
              <div className="text-xs text-slate-400 mt-0.5">Account and API configuration</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative w-9 h-9 rounded-lg bg-slate-700 border border-indigo-500/20 flex items-center justify-center text-lg hover:bg-slate-600 transition">
              🔔
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">3</div>
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-auto p-8 space-y-6">
          {client && (
            <>
              {/* ACCOUNT SETTINGS */}
              <div className="bg-slate-800/50 border border-indigo-500/20 rounded-2xl p-6">
                <div className="mb-6">
                  <div className="text-sm font-bold text-white">Account Information</div>
                  <div className="text-xs text-slate-400 mt-1">Your institution details</div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Institution Name</label>
                    <div className="mt-2 px-4 py-3 bg-slate-700/30 border border-indigo-500/10 rounded-lg text-white font-medium">
                      {client.name}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                    <div className="mt-2 px-4 py-3 bg-slate-700/30 border border-indigo-500/10 rounded-lg text-white font-medium">
                      {client.email}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Subscription Tier</label>
                      <div className="mt-2 px-4 py-3 bg-slate-700/30 border border-indigo-500/10 rounded-lg text-white font-medium capitalize">
                        {client.subscription_tier}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Account Status</label>
                      <div className="mt-2 px-4 py-3 bg-slate-700/30 border border-indigo-500/10 rounded-lg text-green-400 font-medium flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        {client.is_active ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* API KEY */}
              <div className="bg-slate-800/50 border border-indigo-500/20 rounded-2xl p-6">
                <div className="mb-6">
                  <div className="text-sm font-bold text-white">API Key</div>
                  <div className="text-xs text-slate-400 mt-1">Use this key to authenticate API requests</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-4 py-3 bg-slate-700/30 border border-indigo-500/10 rounded-lg font-mono text-sm text-slate-400 break-all">
                    {client.api_key}
                  </div>
                  <button
                    onClick={() => copyToClipboard(client.api_key)}
                    className="p-3 bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-indigo-400 hover:bg-indigo-500/30 transition"
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              {/* API DOCUMENTATION */}
              <div className="bg-slate-800/50 border border-indigo-500/20 rounded-2xl p-6">
                <div className="mb-6">
                  <div className="text-sm font-bold text-white">API Documentation</div>
                  <div className="text-xs text-slate-400 mt-1">Available endpoints for integration</div>
                </div>
                <div className="space-y-3">
                  <div className="p-4 bg-slate-700/30 border border-indigo-500/10 rounded-lg">
                    <div className="text-sm font-mono text-indigo-400 font-semibold mb-1">POST /v1/score</div>
                    <p className="text-xs text-slate-400">Score a transaction for fraud risk</p>
                  </div>
                  <div className="p-4 bg-slate-700/30 border border-indigo-500/10 rounded-lg">
                    <div className="text-sm font-mono text-indigo-400 font-semibold mb-1">GET /v1/health</div>
                    <p className="text-xs text-slate-400">Check API health status</p>
                  </div>
                  <div className="p-4 bg-slate-700/30 border border-indigo-500/10 rounded-lg">
                    <div className="text-sm font-mono text-indigo-400 font-semibold mb-1">GET /dashboard/summary</div>
                    <p className="text-xs text-slate-400">Get dashboard summary statistics</p>
                  </div>
                </div>
              </div>

              {/* DANGER ZONE */}
              <div className="bg-pink-500/10 border border-pink-500/20 rounded-2xl p-6">
                <div className="mb-6">
                  <div className="text-sm font-bold text-pink-400">Danger Zone</div>
                  <div className="text-xs text-pink-400/60 mt-1">Irreversible actions</div>
                </div>
                <button className="px-6 py-2 bg-pink-500/20 border border-pink-500/30 text-pink-400 rounded-lg hover:bg-pink-500/30 transition font-medium text-sm">
                  Delete Account
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
