import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Download, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { api } from '../services/api'
import ClientLayout from '../components/ClientLayout'

export default function ClientTransactions() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [selectedTxn, setSelectedTxn] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    riskLevel: [],
    status: [],
    dateRange: 'today',
    amountMin: '',
    amountMax: ''
  })

  const itemsPerPage = 10

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      navigate('/login')
      return
    }
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const data = await api.getDashboardFeed(500)
      setTransactions(data)
      applyFilters(data)
    } catch (err) {
      console.error('Failed to load transactions:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = (data) => {
    let filtered = data

    if (searchTerm) {
      filtered = filtered.filter(t => t.transaction_id.includes(searchTerm))
    }

    if (filters.riskLevel.length > 0) {
      filtered = filtered.filter(t => filters.riskLevel.includes(t.risk_level))
    }

    if (filters.status.length > 0) {
      filtered = filtered.filter(t => filters.status.includes(t.recommendation))
    }

    if (filters.amountMin) {
      filtered = filtered.filter(t => t.amount >= parseInt(filters.amountMin))
    }

    if (filters.amountMax) {
      filtered = filtered.filter(t => t.amount <= parseInt(filters.amountMax))
    }

    setFilteredTransactions(filtered)
    setCurrentPage(1)
  }

  useEffect(() => {
    applyFilters(transactions)
  }, [searchTerm, filters])

  const handleFilterChange = (key, value) => {
    if (key === 'riskLevel' || key === 'status') {
      setFilters(prev => ({
        ...prev,
        [key]: prev[key].includes(value)
          ? prev[key].filter(v => v !== value)
          : [...prev[key], value]
      }))
    } else {
      setFilters(prev => ({ ...prev, [key]: value }))
    }
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setFilters({
      riskLevel: [],
      status: [],
      dateRange: 'today',
      amountMin: '',
      amountMax: ''
    })
  }

  const handleExport = () => {
    const csv = [
      ['Transaction ID', 'Amount', 'Risk Level', 'Status', 'Time'],
      ...filteredTransactions.map(t => [
        t.transaction_id,
        t.amount,
        t.risk_level,
        t.recommendation,
        new Date().toISOString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transactions.csv'
    a.click()
  }

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading transactions...</p>
          </div>
        </div>
      </ClientLayout>
    )
  }

  return (
    <ClientLayout>
      {/* Filters */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Search & Filters</h3>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Risk Level */}
            <div>
              <label className="text-sm text-slate-400 block mb-2">Risk Level</label>
              <div className="space-y-2">
                {['LOW', 'MEDIUM', 'HIGH'].map(level => (
                  <label key={level} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.riskLevel.includes(level)}
                      onChange={() => handleFilterChange('riskLevel', level)}
                      className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-cyan-500"
                    />
                    <span className="text-sm text-slate-300">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="text-sm text-slate-400 block mb-2">Status</label>
              <div className="space-y-2">
                {['APPROVE', 'FLAG', 'BLOCK'].map(status => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={() => handleFilterChange('status', status)}
                      className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-cyan-500"
                    />
                    <span className="text-sm text-slate-300">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Amount Range */}
            <div>
              <label className="text-sm text-slate-400 block mb-2">Amount From</label>
              <input
                type="number"
                placeholder="Min amount"
                value={filters.amountMin}
                onChange={(e) => handleFilterChange('amountMin', e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400 block mb-2">Amount To</label>
              <input
                type="number"
                placeholder="Max amount"
                value={filters.amountMax}
                onChange={(e) => handleFilterChange('amountMax', e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition text-sm font-medium"
            >
              Clear Filters
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30 rounded-lg transition text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-300">Transaction ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-300">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-300">Risk Level</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-300">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-300">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {paginatedTransactions.map((txn) => (
                <tr key={txn.transaction_id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4 text-sm text-slate-300 font-mono">{txn.transaction_id}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">KES {(txn.amount || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      txn.risk_level === 'HIGH' ? 'bg-red-500/20 text-red-300' :
                      txn.risk_level === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {txn.risk_level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      txn.recommendation === 'BLOCK' ? 'bg-red-500/20 text-red-300' :
                      txn.recommendation === 'FLAG' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {txn.recommendation === 'BLOCK' ? 'Blocked' : txn.recommendation === 'FLAG' ? 'Flagged' : 'Approved'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => setSelectedTxn(txn)}
                      className="text-cyan-400 hover:text-cyan-300 transition font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Page {currentPage} of {totalPages} | Showing {paginatedTransactions.length} of {filteredTransactions.length} transactions
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-300 rounded-lg transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-300 rounded-lg transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800">
              <h3 className="text-lg font-bold text-white">Transaction Details</h3>
              <button
                onClick={() => setSelectedTxn(null)}
                className="p-1 hover:bg-slate-700 rounded-lg transition"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Transaction ID</p>
                  <p className="text-white font-mono mt-1">{selectedTxn.transaction_id}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Amount</p>
                  <p className="text-white font-bold mt-1">KES {(selectedTxn.amount || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Risk Level</p>
                  <p className={`mt-1 font-bold ${
                    selectedTxn.risk_level === 'HIGH' ? 'text-red-400' :
                    selectedTxn.risk_level === 'MEDIUM' ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {selectedTxn.risk_level}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Risk Score</p>
                  <p className="text-white font-bold mt-1">{(selectedTxn.risk_score || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Status</p>
                  <p className={`mt-1 font-bold ${
                    selectedTxn.recommendation === 'BLOCK' ? 'text-red-400' :
                    selectedTxn.recommendation === 'FLAG' ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {selectedTxn.recommendation === 'BLOCK' ? 'Blocked' : selectedTxn.recommendation === 'FLAG' ? 'Flagged' : 'Approved'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Location</p>
                  <p className="text-white mt-1">{selectedTxn.location || 'N/A'}</p>
                </div>
              </div>

              {/* Risk Factors */}
              <div className="pt-4 border-t border-slate-700">
                <p className="text-sm font-bold text-white mb-3">Risk Factors</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 p-2 bg-slate-700/50 rounded">
                    <span className="text-cyan-400 mt-0.5">✓</span>
                    <span className="text-sm text-slate-300">Transaction processed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  )
}
