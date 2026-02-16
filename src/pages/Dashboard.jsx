import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Chart } from 'react-chartjs-2'
import { LogOut, Menu, X, Bell, Download, Plus } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement)

export default function Dashboard() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [summary, setSummary] = useState(null)
  const [feed, setFeed] = useState([])
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('token')
  const clientData = JSON.parse(localStorage.getItem('client') || '{}')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 3000)
    return () => clearInterval(interval)
  }, [token, navigate])

  const fetchDashboardData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` }
      const [summaryRes, feedRes] = await Promise.all([
        fetch('http://localhost:8000/dashboard/summary', { headers }),
        fetch('http://localhost:8000/dashboard/feed?limit=8', { headers })
      ])

      if (summaryRes.ok) setSummary(await summaryRes.json())
      if (feedRes.ok) setFeed(await feedRes.json())
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

  const volumeChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Total Scored',
        data: [6200, 7800, 8100, 7400, 9200, 5600, summary?.transactions_scored_today || 0],
        backgroundColor: 'rgba(99,102,241,0.15)',
        borderColor: '#6366f1',
        borderWidth: 2,
        borderRadius: 6,
        order: 2
      },
      {
        label: 'Fraud Detected',
        data: [82, 110, 94, 88, 130, 70, summary?.flagged_count || 0],
        type: 'line',
        borderColor: '#ec4899',
        backgroundColor: 'rgba(236,72,153,0.08)',
        borderWidth: 2.5,
        pointBackgroundColor: '#ec4899',
        pointRadius: 4,
        tension: 0.4,
        fill: true,
        order: 1,
        yAxisID: 'y1'
      }
    ]
  }

  const riskData = {
    labels: ['Approved', 'Flagged', 'Blocked'],
    datasets: [{
      data: [
        summary?.transactions_scored_today ? Math.floor(summary.transactions_scored_today * 0.96) : 0,
        summary?.flagged_count || 0,
        Math.floor((summary?.transactions_scored_today || 0) * 0.01)
      ],
      backgroundColor: ['#10b981', '#f59e0b', '#ec4899'],
      borderWidth: 0
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
          <a href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500/15 text-white font-medium text-sm mb-1">
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
              <div className="text-lg font-bold text-white">Dashboard Overview</div>
              <div className="text-xs text-slate-400 mt-0.5">Monday, 16 February 2026 — Last updated 2 seconds ago</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              API Online
            </div>
            <button className="relative w-9 h-9 rounded-lg bg-slate-700 border border-indigo-500/20 flex items-center justify-center text-lg hover:bg-slate-600 transition">
              🔔
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">3</div>
            </button>
            <button className="px-4 py-2 border border-indigo-500/20 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-800 transition flex items-center gap-2">
              <Download size={14} /> Export Report
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-xs font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition flex items-center gap-2">
              <Plus size={14} /> Score Transaction
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-auto p-8">
          {summary && (
            <>
              {/* SUBSCRIPTION BAR */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-7 flex items-center justify-between text-white">
                <div>
                  <div className="text-sm font-bold">Growth Plan — 500,000 transactions/month</div>
                  <div className="text-xs text-white/50 mt-1">Renews March 16, 2026 · KES 7,200/month</div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold font-mono">168K</div>
                    <div className="text-xs text-white/40 uppercase tracking-wider mt-1">Used</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold font-mono">332K</div>
                    <div className="text-xs text-white/40 uppercase tracking-wider mt-1">Remaining</div>
                  </div>
                  <div className="w-48">
                    <div className="flex justify-between text-xs text-white/50 mb-1">
                      <span>Monthly Usage</span>
                      <span>34%</span>
                    </div>
                    <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-300 to-pink-300" style={{ width: '34%' }}></div>
                    </div>
                  </div>
                  <button className="px-5 py-2 bg-pink-500 text-white rounded-lg text-xs font-semibold hover:bg-pink-600 transition">Upgrade Plan</button>
                </div>
              </div>

              {/* STATS ROW */}
              <div className="grid grid-cols-4 gap-5 mb-7">
                <div className="bg-slate-800/50 border border-indigo-500/20 rounded-2xl p-6 hover:border-indigo-500/50 transition relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500"></div>
                  <div className="absolute top-6 right-6 text-xs font-semibold text-green-400 bg-green-500/10 px-2 py-1 rounded-full">↑ 12%</div>
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-lg mb-3">📡</div>
                  <div className="text-3xl font-bold font-mono text-white mb-1">{summary.transactions_scored_today}</div>
                  <div className="text-xs text-slate-400 font-medium">Transactions Scored Today</div>
                </div>

                <div className="bg-slate-800/50 border border-indigo-500/20 rounded-2xl p-6 hover:border-indigo-500/50 transition relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-green-500"></div>
                  <div className="absolute top-6 right-6 text-xs font-semibold text-green-400 bg-green-500/10 px-2 py-1 rounded-full">↑ 8%</div>
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-lg mb-3">🛡️</div>
                  <div className="text-3xl font-bold font-mono text-white mb-1">KES {(summary.fraud_blocked_value / 1000000).toFixed(1)}M</div>
                  <div className="text-xs text-slate-400 font-medium">Fraud Blocked Today</div>
                </div>

                <div className="bg-slate-800/50 border border-indigo-500/20 rounded-2xl p-6 hover:border-indigo-500/50 transition relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-pink-500"></div>
                  <div className="absolute top-6 right-6 text-xs font-semibold text-pink-400 bg-pink-500/10 px-2 py-1 rounded-full">↑ 3%</div>
                  <div className="w-10 h-10 bg-pink-500/10 rounded-xl flex items-center justify-center text-lg mb-3">🚨</div>
                  <div className="text-3xl font-bold font-mono text-white mb-1">{summary.flagged_count}</div>
                  <div className="text-xs text-slate-400 font-medium">Flagged This Week</div>
                </div>

                <div className="bg-slate-800/50 border border-indigo-500/20 rounded-2xl p-6 hover:border-indigo-500/50 transition relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500"></div>
                  <div className="absolute top-6 right-6 text-xs font-semibold text-green-400 bg-green-500/10 px-2 py-1 rounded-full">↑ 2%</div>
                  <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-lg mb-3">⚡</div>
                  <div className="text-3xl font-bold font-mono text-white mb-1">{summary.avg_response_time_ms.toFixed(0)}ms</div>
                  <div className="text-xs text-slate-400 font-medium">Avg API Response Time</div>
                </div>
              </div>

              {/* CHARTS ROW */}
              <div className="grid grid-cols-3 gap-5 mb-7">
                <div className="col-span-2 bg-slate-800/50 border border-indigo-500/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <div className="text-sm font-bold text-white">Transaction Volume & Fraud Rate</div>
                      <div className="text-xs text-slate-400 mt-1">Scored transactions vs fraud detected</div>
                    </div>
                    <div className="flex gap-1">
                      <button className="px-3 py-1 text-xs font-medium rounded-lg border border-indigo-500/20 text-slate-400 hover:bg-slate-700">24h</button>
                      <button className="px-3 py-1 text-xs font-medium rounded-lg bg-indigo-500/20 text-indigo-300">7d</button>
                      <button className="px-3 py-1 text-xs font-medium rounded-lg border border-indigo-500/20 text-slate-400 hover:bg-slate-700">30d</button>
                    </div>
                  </div>
                  <Chart type="bar" data={volumeChartData} options={{
                    responsive: true,
                    interaction: { mode: 'index', intersect: false },
                    plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, usePointStyle: true, color: '#94a3b8' } } },
                    scales: {
                      x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#94a3b8' } },
                      y: { grid: { color: 'rgba(99,102,241,0.1)' }, ticks: { font: { size: 11 }, color: '#94a3b8' } },
                      y1: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#94a3b8' }, position: 'right' }
                    }
                  }} />
                </div>

                <div className="bg-slate-800/50 border border-indigo-500/20 rounded-2xl p-6">
                  <div className="mb-5">
                    <div className="text-sm font-bold text-white">Risk Distribution</div>
                    <div className="text-xs text-slate-400 mt-1">Today's breakdown</div>
                  </div>
                  <Chart type="doughnut" data={riskData} options={{
                    cutout: '72%',
                    plugins: { legend: { position: 'bottom', labels: { font: { size: 10 }, usePointStyle: true, padding: 12, color: '#94a3b8' } } }
                  }} />
                </div>
              </div>

              {/* BOTTOM ROW */}
              <div className="grid grid-cols-3 gap-5">
                <div className="col-span-2 bg-slate-800/50 border border-indigo-500/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <div className="text-sm font-bold text-white">Live Transaction Feed</div>
                      <div className="text-xs text-slate-400 mt-1">Real-time scored transactions</div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-green-400">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                      Live
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-indigo-500/10">
                          <th className="text-left px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Transaction ID</th>
                          <th className="text-left px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                          <th className="text-left px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Score</th>
                          <th className="text-left px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Risk</th>
                          <th className="text-left px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Action</th>
                          <th className="text-left px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feed.map((t, i) => (
                          <tr key={i} className="border-b border-indigo-500/5 hover:bg-indigo-500/5">
                            <td className="px-3 py-3 font-mono text-xs text-slate-400">{t.transaction_id}</td>
                            <td className="px-3 py-3 font-mono font-semibold text-white">KES {Math.floor(Math.random() * 200000)}</td>
                            <td className="px-3 py-3">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-semibold text-xs" style={{ color: t.risk_score >= 70 ? '#ec4899' : t.risk_score >= 40 ? '#f59e0b' : '#10b981' }}>
                                  {t.risk_score}
                                </span>
                                <div className="w-12 h-1 bg-slate-700 rounded-full overflow-hidden">
                                  <div className="h-full rounded-full" style={{
                                    width: `${t.risk_score}%`,
                                    background: t.risk_score >= 70 ? '#ec4899' : t.risk_score >= 40 ? '#f59e0b' : '#10b981'
                                  }}></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                t.risk_level === 'HIGH' ? 'bg-pink-500/20 text-pink-300' :
                                t.risk_level === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-green-500/20 text-green-300'
                              }`}>
                                {t.risk_level}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                                t.recommendation === 'BLOCK' ? 'bg-pink-500/20 text-pink-300 border-pink-500/30' :
                                t.recommendation === 'FLAG' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                                'bg-green-500/20 text-green-300 border-green-500/30'
                              }`}>
                                {t.recommendation}
                              </span>
                            </td>
                            <td className="px-3 py-3 font-mono text-xs text-slate-400">{new Date(t.created_at).toLocaleTimeString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-indigo-500/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <div className="text-sm font-bold text-white">API Health</div>
                      <div className="text-xs text-slate-400 mt-1">Live system status</div>
                    </div>
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs font-semibold rounded-full">All Systems Go</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: 'Scoring Engine', detail: 'XGBoost model loaded', status: 'Online', color: '#10b981' },
                      { name: 'Database', detail: 'PostgreSQL connected', status: 'Online', color: '#10b981' },
                      { name: 'Response Time', detail: 'Last 100 requests avg', status: '18ms', color: '#6366f1' },
                      { name: 'Uptime', detail: 'Last 30 days', status: '99.98%', color: '#10b981' },
                      { name: 'M-Pesa Integration', detail: 'Daraja API connected', status: 'Online', color: '#10b981' },
                      { name: 'SIM Swap API', detail: 'Safaricom — degraded', status: 'Slow', color: '#f59e0b' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-700/30 border border-indigo-500/10 rounded-xl">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: item.color }}></div>
                          <div>
                            <div className="text-xs font-semibold text-white">{item.name}</div>
                            <div className="text-xs text-slate-400">{item.detail}</div>
                          </div>
                        </div>
                        <div className="font-mono text-xs font-semibold" style={{ color: item.color }}>{item.status}</div>
                      </div>
                    ))}
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
