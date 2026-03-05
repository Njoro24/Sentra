import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import ClientLayout from '../components/ClientLayout'
import { api } from '../services/api'

export default function ClientAnalytics() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      navigate('/login')
      return
    }
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const data = await api.getDashboardSummary()
      setSummary(data)
    } catch (err) {
      console.error('Failed to load analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  const fraudByMerchant = [
    { name: 'Online Gambling', rate: 0, color: '#ef4444' },
    { name: 'Crypto', rate: 0, color: '#f97316' },
    { name: 'Money Transfer', rate: 0, color: '#eab308' },
    { name: 'Jewelry', rate: 0, color: '#84cc16' },
    { name: 'Gas Station', rate: 0, color: '#22c55e' },
    { name: 'Restaurant', rate: 0, color: '#10b981' }
  ]

  const fraudByCountry = [
    { name: 'Russia', rate: 0, color: '#ef4444' },
    { name: 'China', rate: 0, color: '#f97316' },
    { name: 'Nigeria', rate: 0, color: '#eab308' },
    { name: 'Pakistan', rate: 0, color: '#84cc16' },
    { name: 'Kenya', rate: 0, color: '#22c55e' },
    { name: 'USA', rate: 0, color: '#10b981' }
  ]

  const fraudByTime = [
    { hour: '2 AM', rate: 0 },
    { hour: '3 AM', rate: 0 },
    { hour: '4 AM', rate: 0 },
    { hour: '10 AM', rate: 0 },
    { hour: '2 PM', rate: 0 },
    { hour: '10 PM', rate: 0 }
  ]

  const trendData = [
    { week: 'Week 1', rate: 0 },
    { week: 'Week 2', rate: 0 },
    { week: 'Week 3', rate: 0 },
    { week: 'Week 4', rate: 0 }
  ]

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading analytics...</p>
          </div>
        </div>
      </ClientLayout>
    )
  }

  return (
    <ClientLayout>
      {/* Model Performance */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Fraud Detection Accuracy Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Accuracy</p>
            <p className="text-2xl font-bold text-slate-300 mt-2">0%</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Precision</p>
            <p className="text-2xl font-bold text-slate-300 mt-2">0%</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Recall</p>
            <p className="text-2xl font-bold text-slate-300 mt-2">0%</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm">False Alarms</p>
            <p className="text-2xl font-bold text-slate-300 mt-2">0%</p>
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-4">
          Metrics will appear once you start processing transactions
        </p>
      </div>

      {/* Overall Statistics */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Overall Fraud Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Transactions</span>
                <span className="text-white font-bold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Fraud Detected</span>
                <span className="text-slate-300 font-bold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Fraud Rate</span>
                <span className="text-slate-300 font-bold">0%</span>
              </div>
            </div>
          </div>
          <div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Avg Fraud Amount</span>
                <span className="text-white font-bold">KES 0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Largest Fraud Blocked</span>
                <span className="text-slate-300 font-bold">KES 0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Fraud Prevented</span>
                <span className="text-slate-300 font-bold">KES 0</span>
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-4">
          Start processing transactions to see analytics
        </p>
      </div>

      {/* Fraud by Merchant */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Fraud Rates by Merchant Category</h3>
        <div className="space-y-3">
          {fraudByMerchant.map((merchant) => (
            <div key={merchant.name}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-slate-300">{merchant.name}</span>
                <span className="text-sm font-bold text-slate-400">
                  {merchant.rate}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${merchant.rate * 5}%`, backgroundColor: merchant.color }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-4">
          No data available yet
        </p>
      </div>

      {/* Fraud by Country */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Fraud Rates by Location</h3>
        <div className="space-y-3">
          {fraudByCountry.map((country) => (
            <div key={country.name}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-slate-300">{country.name}</span>
                <span className="text-sm font-bold text-slate-400">
                  {country.rate}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${country.rate * 3}%`, backgroundColor: country.color }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-4">
          No data available yet
        </p>
      </div>

      {/* Fraud by Time */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Fraud by Time of Day</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={fraudByTime}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="hour" stroke="rgba(255,255,255,0.6)" />
            <YAxis stroke="rgba(255,255,255,0.6)" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }} />
            <Bar dataKey="rate" fill="#ef4444" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-slate-400 mt-4">
          No data available yet
        </p>
      </div>

      {/* Trend Analysis */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Fraud Trend (Last 30 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="week" stroke="rgba(255,255,255,0.6)" />
            <YAxis stroke="rgba(255,255,255,0.6)" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }} />
            <Line type="monotone" dataKey="rate" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-sm text-slate-400 mt-4">
          No data available yet
        </p>
      </div>
    </ClientLayout>
  )
}
