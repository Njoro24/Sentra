import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Menu, X, Bell } from 'lucide-react'

export default function DashboardLiveFeed() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [feed, setFeed] = useState([])
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('token')
  const clientData = JSON.parse(localStorage.getItem('client') || '{}')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    fetchFeed()
    const interval = setInterval(fetchFeed, 2000)
    return () => clearInterval(interval)
  }, [token, navigate])

  const fetchFeed = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` }
      const res = await fetch('http://localhost:8000/dashboard/feed?limit=100', { headers })
      if (res.ok) {
        setFeed(await res.json())
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
          <a href="/dashboard/feed" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500/15 text-white font-medium text-sm mb-1">
            <span>⚡</span> Live Feed
          </a>
          <a href="/dashboard/analytics" className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/7 font-medium text-sm mb-1 transition">
            <span>📊</span> Analytics
          </a>
          <a href="/dashboard/investigations" className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/7 font-medium text-sm transition">
            <span>🔍</span> Investigations
          </a>

          <div className="text-xs font-semibold text-white/20 uppercase tracking-widest px-3 py-2 mt-6">Account</div>
          <a href="/dashboard/settings" className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/7 font-medium text-sm transition">
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
              <div className="text-lg font-bold text-white">Live Transaction Feed</div>
              <div className="text-xs text-slate-400 mt-0.5">Real-time fraud detection stream</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Live
            </div>
            <button className="relative w-9 h-9 rounded-lg bg-slate-700 border border-indigo-500/20 flex items-center justify-center text-lg hover:bg-slate-600 transition">
              🔔
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">3</div>
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-auto p-8">
          <div className="bg-slate-800/50 border border-indigo-500/20 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-indigo-500/10 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white">All Transactions</div>
                <div className="text-xs text-slate-400 mt-1">Complete transaction history</div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-green-400">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                Live
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-indigo-500/10">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Risk Score</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Risk Level</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Response Time</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {feed.length > 0 ? (
                    feed.map((transaction, idx) => (
                      <tr key={idx} className="border-b border-indigo-500/5 hover:bg-indigo-500/5">
                        <td className="px-6 py-4 text-sm font-mono text-slate-400">{transaction.transaction_id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${transaction.risk_score}%`,
                                  background: transaction.risk_score >= 70 ? '#ec4899' : transaction.risk_score >= 40 ? '#f59e0b' : '#10b981'
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold font-mono text-white">{transaction.risk_score}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            transaction.risk_level === 'HIGH' ? 'bg-pink-500/20 text-pink-300' :
                            transaction.risk_level === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-green-500/20 text-green-300'
                          }`}>
                            {transaction.risk_level}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                            transaction.recommendation === 'BLOCK' ? 'bg-pink-500/20 text-pink-300 border-pink-500/30' :
                            transaction.recommendation === 'FLAG' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                            'bg-green-500/20 text-green-300 border-green-500/30'
                          }`}>
                            {transaction.recommendation}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-mono text-slate-400">{transaction.processing_time_ms.toFixed(1)}ms</td>
                        <td className="px-6 py-4 text-sm text-slate-400">{new Date(transaction.created_at).toLocaleTimeString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                        No transactions yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
