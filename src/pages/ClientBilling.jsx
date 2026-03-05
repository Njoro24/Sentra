import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Download, CreditCard } from 'lucide-react'
import ClientLayout from '../components/ClientLayout'

export default function ClientBilling() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [invoices] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      navigate('/login')
      return
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading billing...</p>
          </div>
        </div>
      </ClientLayout>
    )
  }

  return (
    <ClientLayout>
      {/* Current Subscription */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Your Current Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Plan</span>
                <span className="text-white font-bold">Not Selected</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Price</span>
                <span className="text-white font-bold">KES 0/month</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Status</span>
                <span className="text-slate-400 font-bold">Inactive</span>
              </div>
            </div>
          </div>
          <div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Billing Period</span>
                <span className="text-white font-bold">N/A</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Next Billing</span>
                <span className="text-white font-bold">N/A</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Usage This Month</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400">API Calls</span>
              <span className="text-white font-bold">0 / 0 (0%)</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="h-2 bg-cyan-500 rounded-full" style={{ width: '0%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400">Storage</span>
              <span className="text-white font-bold">0 GB / 0 GB (0%)</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="h-2 bg-green-500 rounded-full" style={{ width: '0%' }} />
            </div>
          </div>

          <p className="text-sm text-slate-400 mt-4">
            No usage data available yet
          </p>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Invoices & Payments</h3>
        </div>

        {invoices.length > 0 ? (
          <>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-4 py-3 text-left text-slate-300 font-medium">Invoice #</th>
                    <th className="px-4 py-3 text-left text-slate-300 font-medium">Date</th>
                    <th className="px-4 py-3 text-left text-slate-300 font-medium">Amount</th>
                    <th className="px-4 py-3 text-left text-slate-300 font-medium">Status</th>
                    <th className="px-4 py-3 text-left text-slate-300 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-white/5 transition">
                      <td className="px-4 py-3 text-slate-300 font-mono">{invoice.id}</td>
                      <td className="px-4 py-3 text-slate-300">{invoice.date}</td>
                      <td className="px-4 py-3 text-slate-300">KES {invoice.amount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300">
                          ✓ {invoice.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-cyan-400 hover:text-cyan-300 transition text-sm font-medium">
                          View PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition font-medium text-sm">
              <Download className="w-4 h-4" />
              Download All Invoices
            </button>
          </>
        ) : (
          <div className="py-8 text-center">
            <p className="text-slate-400">No invoices yet</p>
          </div>
        )}
      </div>

      {/* Plan Selection */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-6">Available Plans</h3>
        <div className="py-8 text-center">
          <p className="text-slate-400">Plan information will be available soon</p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Payment Method</h3>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-400 mb-2">Current Method</p>
            <p className="text-slate-300">No payment method added</p>
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition font-medium text-sm">
              Add Payment Method
            </button>
          </div>

          <label className="flex items-center gap-2 cursor-pointer mt-4">
            <input
              type="checkbox"
              disabled
              className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-cyan-500 disabled:opacity-50"
            />
            <span className="text-sm text-slate-400">Automatically charge on billing date</span>
          </label>
        </div>
      </div>
    </ClientLayout>
  )
}
