import React, { useState, useEffect } from 'react'
import { Filter, AlertCircle } from 'lucide-react'

export default function AdminRealTimeMonitoring() {
  const [filterRisk, setFilterRisk] = useState('all')
  const [filterRecommendation, setFilterRecommendation] = useState('all')
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTx, setSelectedTx] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('admin_token')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/admin/transactions?page=1&limit=50`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions || [])
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  const markAsFalsePositive = async (txId) => {
    try {
      setActionLoading(true)
      const token = localStorage.getItem('admin_token')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/admin/transactions/${txId}/false-positive`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        alert('Marked as false positive')
        fetchTransactions()
      } else {
        alert('Failed to mark as false positive')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error marking as false positive')
    } finally {
      setActionLoading(false)
    }
  }

  const overrideRecommendation = async (txId, newRecommendation) => {
    try {
      setActionLoading(true)
      const token = localStorage.getItem('admin_token')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/admin/transactions/${txId}/override`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ recommendation: newRecommendation })
      })
      
      if (response.ok) {
        alert(`Recommendation overridden to ${newRecommendation}`)
        fetchTransactions()
      } else {
        alert('Failed to override recommendation')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error overriding recommendation')
    } finally {
      setActionLoading(false)
    }
  }

  const getRiskColor = (score) => {
    if (score >= 70) return 'text-red-400'
    if (score >= 40) return 'text-yellow-400'
    return 'text-green-400'
  }

  const getRecommendationColor = (rec) => {
    switch(rec) {
      case 'BLOCK': return 'bg-red-500/20 text-red-200'
      case 'FLAG': return 'bg-yellow-500/20 text-yellow-200'
      case 'APPROVE': return 'bg-green-500/20 text-green-200'
      default: return 'bg-gray-500/20 text-gray-200'
    }
  }

  const filteredTransactions = transactions.filter(tx => {
    const riskLevel = tx.riskScore >= 70 ? 'HIGH' : tx.riskScore >= 40 ? 'MEDIUM' : 'LOW'
    if (filterRisk !== 'all' && riskLevel !== filterRisk) return false
    if (filterRecommendation !== 'all' && tx.recommendation !== filterRecommendation) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Filters - Made More Prominent */}
      <div className="bg-gradient-to-r from-[#7ab8f5]/20 to-[#2277ee]/20 border-2 border-[#7ab8f5] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter size={20} className="text-[#7ab8f5]" />
          <span className="text-white font-bold text-lg">Transaction Filters</span>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-white/90 text-sm font-medium mb-2 block">Risk Level</label>
            <select 
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="w-full px-4 py-3 bg-[#1a2a4a] border-2 border-[#7ab8f5] text-white rounded-lg focus:outline-none focus:border-[#2277ee] focus:ring-2 focus:ring-[#7ab8f5]/50 transition-all font-medium appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237ab8f5' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                paddingRight: '36px',
                backgroundColor: '#1a2a4a',
                color: '#ffffff'
              }}
            >
              <option value="all" style={{ backgroundColor: '#1a2a4a', color: '#ffffff' }}>All Risk Levels</option>
              <option value="HIGH" style={{ backgroundColor: '#1a2a4a', color: '#ffffff' }}>High Risk (70+)</option>
              <option value="MEDIUM" style={{ backgroundColor: '#1a2a4a', color: '#ffffff' }}>Medium Risk (40-69)</option>
              <option value="LOW" style={{ backgroundColor: '#1a2a4a', color: '#ffffff' }}>&lt;40</option>
            </select>
          </div>
          <div>
            <label className="text-white/90 text-sm font-medium mb-2 block">Recommendation</label>
            <select 
              value={filterRecommendation}
              onChange={(e) => setFilterRecommendation(e.target.value)}
              className="w-full px-4 py-3 bg-[#1a2a4a] border-2 border-[#7ab8f5] text-white rounded-lg focus:outline-none focus:border-[#2277ee] focus:ring-2 focus:ring-[#7ab8f5]/50 transition-all font-medium appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237ab8f5' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                paddingRight: '36px',
                backgroundColor: '#1a2a4a',
                color: '#ffffff'
              }}
            >
              <option value="all" style={{ backgroundColor: '#1a2a4a', color: '#ffffff' }}>All Recommendations</option>
              <option value="BLOCK" style={{ backgroundColor: '#1a2a4a', color: '#ffffff' }}>Block</option>
              <option value="FLAG" style={{ backgroundColor: '#1a2a4a', color: '#ffffff' }}>Flag</option>
              <option value="APPROVE" style={{ backgroundColor: '#1a2a4a', color: '#ffffff' }}>Approve</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white/10 border border-white/20 rounded-lg p-4">
          <div className="text-white/70 text-sm mb-2">Total Transactions</div>
          <div className="text-2xl font-bold text-white">{transactions.length}</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <div className="text-red-200 text-sm mb-2">Blocked</div>
          <div className="text-2xl font-bold text-red-400">{transactions.filter(t => t.recommendation === 'BLOCK').length}</div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <div className="text-yellow-200 text-sm mb-2">Flagged</div>
          <div className="text-2xl font-bold text-yellow-400">{transactions.filter(t => t.recommendation === 'FLAG').length}</div>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="text-green-200 text-sm mb-2">Approved</div>
          <div className="text-2xl font-bold text-green-400">{transactions.filter(t => t.recommendation === 'APPROVE').length}</div>
        </div>
      </div>

      {/* Live Transaction Feed */}
      {transactions.length > 0 ? (
        <div className="bg-white/10 border border-white/20 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Syne' }}>Live Transaction Feed</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-green-400 text-sm">Live</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-left text-white/70 text-sm font-medium">Client</th>
                  <th className="px-6 py-4 text-left text-white/70 text-sm font-medium">Amount</th>
                  <th className="px-6 py-4 text-left text-white/70 text-sm font-medium">Risk Score</th>
                  <th className="px-6 py-4 text-left text-white/70 text-sm font-medium">Recommendation</th>
                  <th className="px-6 py-4 text-left text-white/70 text-sm font-medium">Processing</th>
                  <th className="px-6 py-4 text-left text-white/70 text-sm font-medium">Time</th>
                  <th className="px-6 py-4 text-left text-white/70 text-sm font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr 
                    key={tx.id} 
                    onClick={() => setSelectedTx(tx)}
                    className={`border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer ${selectedTx?.id === tx.id ? 'bg-white/10' : ''}`}
                  >
                    <td className="px-6 py-4 text-white text-sm">{tx.client_name || tx.client}</td>
                    <td className="px-6 py-4 text-white font-medium">KES {((tx.amount || 0).toLocaleString ? (tx.amount || 0).toLocaleString() : tx.amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${getRiskColor(tx.risk_score || tx.riskScore)}`}>{tx.risk_score || tx.riskScore}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRecommendationColor(tx.recommendation)}`}>
                        {tx.recommendation}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/70 text-sm">{tx.processing_time_ms || tx.processingTime}ms</td>
                    <td className="px-6 py-4 text-white/70 text-sm">{tx.created_at || tx.time}</td>
                    <td className="px-6 py-4">
                      <button className="text-white/70 hover:text-white transition-colors text-sm">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white/10 border border-white/20 rounded-lg p-12 text-center">
          <p className="text-white/70">Waiting for live transaction data from backend...</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white/10 border border-white/20 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Syne' }}>Quick Actions</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <button 
            onClick={() => selectedTx && markAsFalsePositive(selectedTx.id)}
            className="px-4 py-3 bg-white/20 hover:bg-white/30 border border-white/30 text-white rounded-lg transition-all"
          >
            {actionLoading ? 'Processing...' : 'Mark as False Positive'}
          </button>
          <button 
            onClick={() => selectedTx && overrideRecommendation(selectedTx.id, 'APPROVE')}
            className="px-4 py-3 bg-white/20 hover:bg-white/30 border border-white/30 text-white rounded-lg transition-all"
          >
            {actionLoading ? 'Processing...' : 'Override Recommendation'}
          </button>
        </div>
        {!selectedTx && <p className="text-white/60 text-sm mt-4">Select a transaction to perform actions</p>}
      </div>
    </div>
  )
}
