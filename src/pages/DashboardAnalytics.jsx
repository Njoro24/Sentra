import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Chart } from 'react-chartjs-2'
import { LogOut, Menu, X, Bell } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function DashboardAnalytics() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('token')
  const clientData = JSON.parse(localStorage.getItem('client') || '{}')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    fetchAnalytics()
  }, [token, navigate])

  const fetchAnalytics = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` }
      const res = await fetch('http://localhost:8000/dashboard/summary', { headers })
      if (res.ok) {
        setSummary(await res.json())
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

  const responseTimeData = {
    labels: Array.from({length: 24}, (_,i) => `${i}:00`),
    datasets: [{
      data: Array.from({length: 24}, () => Math.floor(Math.random() * 30) + 10),
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.06)',
      borderWidth: 1.5,
      pointRadius: 0,
      tension: 0.4,
      fill: true
    }]
  }

  const accuracyData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Detection Accuracy',
      data: [92.1, 93.5, 94.2, 94.8],
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.1)',
      borderWidth: 2,
      pointBackgroundColor: '#6366f1',
      pointRadius: 4,
      tension: 0.4,
      fill: true
    }]
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
          <a href="/dashboard/analytics" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500/15 text-white font-medium text-sm mb-1">
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
              <div className="text-lg font-bold text-white">Analytics</div>
              <div className="text-xs text-slate-400 mt-0.5">Detailed fraud detection metrics</div>
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
        <div className="flex-1 overflow-auto p-8">
          {summary && (
            <>
              {/* STATS ROW */}
              <div className="grid grid-cols-4 gap-5 mb-7">
                <div className="bg-slate-800/50 border border-indigo-500/20 rounded-2xl p-6 hover:border-indigo-500/50 transition relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500"></div>
                  <div className="absolute top-6 right-6 text-xs font-semibold text-green-400 bg-green-500/10 px-2 py-1 rounded-full">↑ 12%</div>
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-lg mb-3">📡</div>
                  <div className="text-3xl font-bold font-mono text-white mb-1">{summary.transactions_scored_today.toLocaleString()}</div>
                  <div className="text-xs text-slate-400 font-medium">Total Transactions</div>
                </div>

                <div className="bg-slate-800/50 border border-indigo-500/20 rounded-2xl p-6 hover:border-indigo-500/50 transition relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-green-500"></div>
                  <div className="absolute top-6 right-6 text-xs font-semibold text-green-400 bg-green-500/10 px-2 py-1 rounded-full">↑ 8%</div>
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-lg mb-3">🛡️</div>
                  <div className="text-3xl font-bold font-mono text-white mb-1">KES {(summary.fraud_blocked_value / 1000000).toFixed(1)}M</div>
                  <div className="text-xs text-slate-400 font-medium">Fraud Blocked</div>
                </div>

                <div className="bg-slate-800/50 border border-indigo-500/20 rounded-2xl p-6 hover:border-indigo-500/50 transition relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-pink-500"></div>
                  <div className="absolute top-6 right-6 text-xs font-semibold text-pink-400 bg-pink-500/10 px-2 py-1 rounded-full">↑ 3%</div>
                  <div className="w-10 h-10 bg-pink-500/10 rounded-xl flex items-center justify-center text-lg mb-3">🚨</div>
                  <div className="text-3xl font-bold font-mono text-white mb-1">{summary.flagged_count}</div>
                  <div className="text-xs text-slate-400 font-medium">Flagged Transactions</div>
                </div>

                <div className="bg-slate-800/50 border border-indigo-500/20 rounded-2xl p-6 hover:border-indigo-500/50 transition relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500"></div>
                  <div className="absolute top-6 right-6 text-xs font-semibold text-green-400 bg-green-500/10 px-2 py-1 rounded-full">↑ 2%</div>
                  <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-lg mb-3">⚡</div>
                  <div className="text-3xl font-bold font-mono text-white mb-1">{summary.avg_response_time_ms.toFixed(0)}ms</div>
                  <div className="text-xs text-slate-400 font-medium">Avg Response Time</div>
                </div>
              </div>

              {/* CHARTS */}
              <div className="grid grid-cols-2 gap-5 mb-7">
                <div className="bg-slate-800/50 border border-indigo-500/20 rounded-2xl p-6">
                  <div className="mb-5">
                    <div className="text-sm font-bold text-white">Detection Accuracy Trend</div>
                    <div className="text-xs text-slate-400 mt-1">Weekly accuracy metrics</div>
                  </div>
                  <Chart type="line" data={accuracyData} options={{
                    responsive: true,
                    plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, usePointStyle: true, color: '#94a3b8' } } },
                    scales: {
                      x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#94a3b8' } },
                      y: { grid: { color: 'rgba(99,102,241,0.1)' }, ticks: { font: { size: 11 }, color: '#94a3b8', callback: v => v + '%' } }
                    }
                  }} />
                </div>

                <div className="bg-slate-800/50 border border-indigo-500/20 rounded-2xl p-6">
                  <div className="mb-5">
                    <div className="text-sm font-bold text-white">Response Time — Last 24H</div>
                    <div className="text-xs text-slate-400 mt-1">API performance metrics</div>
                  </div>
                  <Chart type="line" data={responseTimeData} options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { display: false },
                      y: { grid: { color: 'rgba(99,102,241,0.1)' }, ticks: { font: { size: 11 }, color: '#94a3b8', callback: v => v + 'ms' } }
                    }
                  }} />
                </div>
              </div>

              {/* PERFORMANCE METRICS */}
              <div className="bg-slate-800/50 border border-indigo-500/20 rounded-2xl p-6">
                <div className="mb-6">
                  <div className="text-sm font-bold text-white">Performance Metrics</div>
                  <div className="text-xs text-slate-400 mt-1">System health and efficiency</div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-medium text-white">System Uptime</span>
                      <span className="text-xs font-semibold text-green-400">{summary.uptime_percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${summary.uptime_percentage}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-medium text-white">Detection Accuracy</span>
                      <span className="text-xs font-semibold text-indigo-400">94.2%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '94.2%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-medium text-white">False Positive Rate</span>
                      <span className="text-xs font-semibold text-yellow-400">2.1%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: '2.1%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
