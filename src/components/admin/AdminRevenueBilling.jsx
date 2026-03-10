import React, { useState, useEffect } from 'react'
import { Download, Send, CheckCircle } from 'lucide-react'

export default function AdminRevenueBilling() {
  const [revenue, setRevenue] = useState({
    total_revenue: 0,
    paid_invoices: 0,
    overdue_payments: 0,
    cancelled: 0
  })
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRevenueData()
  }, [])

  const fetchRevenueData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('admin_token')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      
      // Fetch revenue summary
      const summaryResponse = await fetch(`${apiUrl}/api/admin/revenue/summary`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json()
        setRevenue({
          total_revenue: summaryData.total_revenue || 0,
          paid_invoices: summaryData.paid_invoices || 0,
          overdue_payments: summaryData.overdue_payments || 0,
          cancelled: summaryData.cancelled || 0
        })
      }
      
      // Fetch invoices
      const invoicesResponse = await fetch(`${apiUrl}/api/admin/revenue/invoices?page=1&limit=20`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (invoicesResponse.ok) {
        const invoicesData = await invoicesResponse.json()
        setInvoices(invoicesData.invoices || [])
      }
    } catch (error) {
      console.error('Failed to fetch revenue data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'bg-green-500/20 text-green-200'
      case 'overdue': return 'bg-red-500/20 text-red-200'
      case 'cancelled': return 'bg-gray-500/20 text-gray-200'
      default: return 'bg-blue-500/20 text-blue-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* MRR Overview */}
      <div className="bg-white/10 border border-white/20 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-6" style={{ fontFamily: 'Syne' }}>Monthly Recurring Revenue</h3>
        <div className="text-center py-8">
          <div className="text-4xl font-bold text-white">KES {(revenue.total_revenue || 0).toLocaleString()}</div>
          <p className="text-white/60 text-sm mt-2">Total revenue this month</p>
        </div>
      </div>

      {/* Payment Status */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
          <div className="text-green-200 text-sm mb-2">Paid Invoices</div>
          <div className="text-3xl font-bold text-white">KES {(revenue.paid_invoices || 0).toLocaleString()}</div>
          <p className="text-green-200/70 text-xs mt-2">{invoices.filter(i => i.status === 'paid').length} invoices</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
          <div className="text-red-200 text-sm mb-2">Overdue Payments</div>
          <div className="text-3xl font-bold text-white">KES {(revenue.overdue_payments || 0).toLocaleString()}</div>
          <p className="text-red-200/70 text-xs mt-2">{invoices.filter(i => i.status === 'overdue').length} invoices</p>
        </div>
        <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-6">
          <div className="text-gray-200 text-sm mb-2">Cancelled</div>
          <div className="text-3xl font-bold text-white">KES {(revenue.cancelled || 0).toLocaleString()}</div>
          <p className="text-gray-200/70 text-xs mt-2">{invoices.filter(i => i.status === 'cancelled').length} invoices</p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white/10 border border-white/20 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Syne' }}>Recent Invoices</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-left text-white/70 text-sm font-medium">Client</th>
                <th className="px-6 py-4 text-left text-white/70 text-sm font-medium">Amount</th>
                <th className="px-6 py-4 text-left text-white/70 text-sm font-medium">Status</th>
                <th className="px-6 py-4 text-left text-white/70 text-sm font-medium">Issue Date</th>
                <th className="px-6 py-4 text-left text-white/70 text-sm font-medium">Due Date</th>
                <th className="px-6 py-4 text-left text-white/70 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white">{invoice.client_name || 'N/A'}</td>
                    <td className="px-6 py-4 text-white font-medium">KES {(invoice.amount || 0).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/70 text-sm">{invoice.issue_date || '-'}</td>
                    <td className="px-6 py-4 text-white/70 text-sm">{invoice.due_date || '-'}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white">
                        <Download size={16} />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white">
                        <Send size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-white/70">
                    No invoices yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Churn Tracking */}
      <div className="bg-white/10 border border-white/20 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Syne' }}>Churn Tracking</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="text-white/70 text-sm mb-2">Cancelled This Month</div>
            <div className="text-2xl font-bold text-red-400">0</div>
            <p className="text-white/60 text-xs mt-2">No cancellations</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="text-white/70 text-sm mb-2">At Risk (Low Usage)</div>
            <div className="text-2xl font-bold text-yellow-400">0</div>
            <p className="text-white/60 text-xs mt-2">All clients active</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="text-white/70 text-sm mb-2">Retention Rate</div>
            <div className="text-2xl font-bold text-green-400">100%</div>
            <p className="text-white/60 text-xs mt-2">Excellent retention</p>
          </div>
        </div>
      </div>
    </div>
  )
}
