import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, TrendingUp, Activity, BarChart3, Zap, CheckCircle } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { api } from '../services/api'
import ClientLayout from '../components/ClientLayout'
import FeedbackSummary from '../components/FeedbackSummary'

export default function ClientDashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [summary, setSummary] = useState(null)
  const [feed, setFeed] = useState([])
  const [clientName, setClientName] = useState('')
  const [apiMetrics, setApiMetrics] = useState({
    avgResponseTime: 0,
    lastResponseTime: 0,
    status: 'healthy'
  })

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      navigate('/login')
      return
    }
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const startTime = performance.now()
      
      const [summaryData, feedData, userData] = await Promise.all([
        api.getDashboardSummary(),
        api.getDashboardFeed(50),
        api.getCurrentUser()
      ])
      
      const endTime = performance.now()
      const responseTime = endTime - startTime
      
      setSummary(summaryData)
      setFeed(feedData)
      setClientName(userData.institution_name || 'Your Institution')
      
      // Set API metrics
      setApiMetrics({
        avgResponseTime: Math.round(responseTime),
        lastResponseTime: Math.round(responseTime),
        status: responseTime < 500 ? 'fast' : responseTime < 1000 ? 'normal' : 'slow'
      })
    } catch (err) {
      console.error('Failed to load dashboard:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const riskDistribution = [
    { name: 'Low', value: feed.filter(t => t.risk_level === 'LOW').length, color: '#10b981' },
    { name: 'Medium', value: feed.filter(t => t.risk_level === 'MEDIUM').length, color: '#f59e0b' },
    { name: 'High', value: feed.filter(t => t.risk_level === 'HIGH').length, color: '#ef4444' }
  ]

  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    frauds: 0
  }))

  const transactionTrend = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    transactions: 0,
    frauds: 0
  }))

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading dashboard...</p>
          </div>
        </div>
      </ClientLayout>
    )
  }

  return (
    <ClientLayout>
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Welcome back, <span className="text-cyan-400">{clientName}</span></h1>
        <p className="text-slate-400 mt-2">Real-time fraud detection dashboard</p>
      </div>

      {/* KPI Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/30 rounded-lg p-6 hover:border-cyan-500/50 transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Transactions Today</p>
                <p className="text-4xl font-bold text-white mt-3">{summary.total_transactions || 0}</p>
                <p className="text-xs text-cyan-400 mt-2">No activity yet</p>
              </div>
              <Activity className="w-10 h-10 text-cyan-500/30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/30 rounded-lg p-6 hover:border-red-500/50 transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Fraud Blocked</p>
                <p className="text-4xl font-bold text-red-400 mt-3">{summary.fraud_count || 0}</p>
                <p className="text-xs text-red-400 mt-2">KES 0 saved</p>
              </div>
              <AlertCircle className="w-10 h-10 text-red-500/30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/30 rounded-lg p-6 hover:border-amber-500/50 transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Block Rate</p>
                <p className="text-4xl font-bold text-amber-400 mt-3">0%</p>
                <p className="text-xs text-amber-400 mt-2">Normal: 2-5%</p>
              </div>
              <TrendingUp className="w-10 h-10 text-amber-500/30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/30 rounded-lg p-6 hover:border-green-500/50 transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">API Status</p>
                <p className="text-4xl font-bold text-green-400 mt-3">{apiMetrics.lastResponseTime}ms</p>
                <p className="text-xs text-green-400 mt-2">Uptime: 99.9%</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500/30" />
            </div>
          </div>

          <div className={`bg-gradient-to-br ${
            apiMetrics.status === 'fast' ? 'from-blue-500/10 to-blue-500/5 border-blue-500/30' :
            apiMetrics.status === 'normal' ? 'from-yellow-500/10 to-yellow-500/5 border-yellow-500/30' :
            'from-orange-500/10 to-orange-500/5 border-orange-500/30'
          } border rounded-lg p-6 hover:border-opacity-50 transition`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Performance</p>
                <p className={`text-4xl font-bold mt-3 ${
                  apiMetrics.status === 'fast' ? 'text-blue-400' :
                  apiMetrics.status === 'normal' ? 'text-yellow-400' :
                  'text-orange-400'
                }`}>
                  {apiMetrics.status === 'fast' ? 'Fast' : apiMetrics.status === 'normal' ? 'Normal' : 'Slow'}
                </p>
                <p className={`text-xs mt-2 ${
                  apiMetrics.status === 'fast' ? 'text-blue-400' :
                  apiMetrics.status === 'normal' ? 'text-yellow-400' :
                  'text-orange-400'
                }`}>
                  Avg: {apiMetrics.avgResponseTime}ms
                </p>
              </div>
              <Zap className={`w-10 h-10 ${
                apiMetrics.status === 'fast' ? 'text-blue-500/30' :
                apiMetrics.status === 'normal' ? 'text-yellow-500/30' :
                'text-orange-500/30'
              }`} />
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Transaction Volume */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Transaction Volume (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transactionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.6)" />
              <YAxis stroke="rgba(255,255,255,0.6)" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="transactions" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Risk Distribution Today</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                dataKey="value"
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hourly Fraud Pattern */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-bold text-white mb-4">Hourly Fraud Patterns (Last 24 Hours)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="hour" stroke="rgba(255,255,255,0.6)" />
            <YAxis stroke="rgba(255,255,255,0.6)" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }} />
            <Line type="monotone" dataKey="frauds" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Feedback Summary */}
      <div className="mt-8">
        <FeedbackSummary />
      </div>
    </ClientLayout>
  )
}
