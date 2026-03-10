import React, { useState, useEffect } from 'react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp } from 'lucide-react'
import MetricCard from './MetricCard'

export default function AdminDailyMetrics() {
  const [metrics, setMetrics] = useState({
    transactions_today: 0,
    fraud_detected_today: 0,
    fraud_percentage: 0,
    revenue_today: 0,
    active_clients_today: 0
  })
  const [historicalData, setHistoricalData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('admin_token')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      
      // Fetch daily metrics
      const dailyResponse = await fetch(`${apiUrl}/api/admin/metrics/daily`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (dailyResponse.ok) {
        const dailyData = await dailyResponse.json()
        setMetrics({
          transactions_today: dailyData.transactions_today || 0,
          fraud_detected_today: dailyData.fraud_detected_today || 0,
          fraud_percentage: dailyData.fraud_percentage || 0,
          revenue_today: dailyData.revenue_today || 0,
          active_clients_today: dailyData.active_clients_today || 0
        })
      }
      
      // Fetch historical metrics
      const historicalResponse = await fetch(`${apiUrl}/api/admin/metrics/historical?days=30`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (historicalResponse.ok) {
        const historicalDataResponse = await historicalResponse.json()
        setHistoricalData(historicalDataResponse.metrics || [])
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
      // Keep default zero values
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Transactions Today"
          value={metrics.transactions_today}
          icon={TrendingUp}
          status="healthy"
        />
        <MetricCard
          title="Fraud Detected"
          value={metrics.fraud_detected_today}
          icon={TrendingUp}
          status="warning"
        />
        <MetricCard
          title="Fraud Rate"
          value={metrics.fraud_percentage}
          unit="%"
          status="healthy"
        />
        <MetricCard
          title="Revenue Today"
          value={`KES ${(metrics.revenue_today || 0).toLocaleString()}`}
          status="healthy"
        />
        <MetricCard
          title="Active Clients"
          value={metrics.active_clients_today}
          status="healthy"
        />
      </div>

      {/* Charts */}
      {historicalData.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Transaction Volume */}
          <div className="bg-white/10 border border-white/20 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Syne' }}>Daily Transaction Volume</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={historicalData}>
                <defs>
                  <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7ab8f5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#7ab8f5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="transactions" stroke="#7ab8f5" fillOpacity={1} fill="url(#colorTx)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Fraud Detection Rate */}
          <div className="bg-white/10 border border-white/20 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Syne' }}>Daily Fraud Detection Rate</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }} />
                <Line type="monotone" dataKey="fraud_detected" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
