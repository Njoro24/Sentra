import React, { useState, useEffect } from 'react'
import { MoreVertical, Edit, Lock, Unlock } from 'lucide-react'
import PasswordVerificationModal from './PasswordVerificationModal'

export default function AdminClientManagement() {
  const [clients, setClients] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)
  const [modalType, setModalType] = useState(null) // 'upgrade', 'suspend', 'reset'
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [newTier, setNewTier] = useState('')
  const [showTierSelection, setShowTierSelection] = useState(false)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('http://localhost:8000/api/admin/clients?page=1&limit=20', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setClients(data.clients || [])
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error)
      setClients([])
    }
  }

  const handleUpgradeTier = (client) => {
    setSelectedClient(client)
    setModalType('upgrade')
    setShowTierSelection(true)
    setShowPasswordModal(false)
  }

  const handleSuspendClient = (client) => {
    setSelectedClient(client)
    setModalType('suspend')
    setShowPasswordModal(true)
    setShowTierSelection(false)
  }

  const handleResetApiKey = (client) => {
    setSelectedClient(client)
    setModalType('reset')
    setShowPasswordModal(true)
    setShowTierSelection(false)
  }

  const performAction = async (password) => {
    try {
      setActionLoading(true)
      const token = localStorage.getItem('admin_token')
      let endpoint = ''
      let method = 'POST'
      let body = { password }

      if (modalType === 'upgrade') {
        if (!newTier) {
          alert('Please select a tier')
          setActionLoading(false)
          return
        }
        endpoint = `http://localhost:8000/api/admin/clients/${selectedClient.id}/tier`
        method = 'PUT'
        body.tier = newTier
      } else if (modalType === 'suspend') {
        endpoint = `http://localhost:8000/api/admin/clients/${selectedClient.id}/suspend`
        body.reason = 'Suspended by admin'
      } else if (modalType === 'reset') {
        endpoint = `http://localhost:8000/api/admin/clients/${selectedClient.id}/reset-key`
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Success: ${result.message || 'Action completed'}`)
        setShowPasswordModal(false)
        setShowTierSelection(false)
        setSelectedClient(null)
        setModalType(null)
        setNewTier('')
        fetchClients()
      } else {
        const error = await response.json()
        alert(`Error: ${error.detail || 'Action failed'}`)
      }
    } catch (error) {
      console.error('Action failed:', error)
      alert('Action failed. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleTierSelected = (tier) => {
    setNewTier(tier)
    setShowTierSelection(false)
    setShowPasswordModal(true)
  }

  const getTierColor = (tier) => {
    switch(tier) {
      case 'starter': return 'bg-blue-500/20 text-blue-200'
      case 'growth': return 'bg-purple-500/20 text-purple-200'
      case 'enterprise': return 'bg-green-500/20 text-green-200'
      default: return 'bg-gray-500/20 text-gray-200'
    }
  }

  const getStatusColor = (status) => {
    return status === 'active' ? 'text-green-400' : status === 'suspended' ? 'text-red-400' : 'text-yellow-400'
  }

  const getPaymentColor = (status) => {
    return status === 'paid' ? 'bg-green-500/20 text-green-200' : status === 'overdue' ? 'bg-red-500/20 text-red-200' : 'bg-gray-500/20 text-gray-200'
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white/10 border border-white/20 rounded-lg p-4">
          <div className="text-white/70 text-sm">Total Clients</div>
          <div className="text-2xl font-bold text-white mt-1">{clients.length}</div>
        </div>
        <div className="bg-white/10 border border-white/20 rounded-lg p-4">
          <div className="text-white/70 text-sm">Active</div>
          <div className="text-2xl font-bold text-green-400 mt-1">{clients.filter(c => c.status === 'active').length}</div>
        </div>
        <div className="bg-white/10 border border-white/20 rounded-lg p-4">
          <div className="text-white/70 text-sm">Overdue Payments</div>
          <div className="text-2xl font-bold text-red-400 mt-1">{clients.filter(c => c.payment_status === 'overdue').length}</div>
        </div>
        <div className="bg-white/10 border border-white/20 rounded-lg p-4">
          <div className="text-white/70 text-sm">Suspended</div>
          <div className="text-2xl font-bold text-yellow-400 mt-1">{clients.filter(c => c.status === 'suspended').length}</div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white/10 border border-white/20 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-left text-white/70 text-sm font-medium">Client Name</th>
                <th className="px-6 py-4 text-left text-white/70 text-sm font-medium">Tier</th>
                <th className="px-6 py-4 text-left text-white/70 text-sm font-medium">Status</th>
                <th className="px-6 py-4 text-left text-white/70 text-sm font-medium">Payment</th>
                <th className="px-6 py-4 text-left text-white/70 text-sm font-medium">Transactions</th>
                <th className="px-6 py-4 text-left text-white/70 text-sm font-medium">Usage</th>
                <th className="px-6 py-4 text-left text-white/70 text-sm font-medium">Last Activity</th>
                <th className="px-6 py-4 text-left text-white/70 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.length > 0 ? (
                clients.map((client) => (
                  <tr key={client.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white">{client.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTierColor(client.subscription_tier)}`}>
                        {client.subscription_tier.charAt(0).toUpperCase() + client.subscription_tier.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${getStatusColor(client.status)}`}>
                        {client.status === 'active' ? '● Active' : client.status === 'suspended' ? '● Suspended' : '● Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentColor(client.payment_status)}`}>
                        {client.payment_status.charAt(0).toUpperCase() + client.payment_status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white text-sm">{client.transactions_this_month}</td>
                    <td className="px-6 py-4">
                      <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#7ab8f5] to-[#2277ee]" style={{ width: `${client.usage_percentage}%` }}></div>
                      </div>
                      <span className="text-white/60 text-xs mt-1">{client.usage_percentage}%</span>
                    </td>
                    <td className="px-6 py-4 text-white/70 text-sm">-</td>
                    <td className="px-6 py-4">
                      <button className="text-white/70 hover:text-white transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-white/70">
                    No clients yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/10 border border-white/20 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Syne' }}>Quick Actions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <button 
            onClick={() => handleUpgradeTier(clients[0] || { id: 1, name: 'Sample Client' })}
            className="px-4 py-3 bg-white/20 hover:bg-white/30 border border-white/30 text-white rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <Edit size={18} />
            Upgrade/Downgrade Tier
          </button>
          <button 
            onClick={() => handleSuspendClient(clients[0] || { id: 1, name: 'Sample Client' })}
            className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-200 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <Lock size={18} />
            Suspend Client
          </button>
          <button 
            onClick={() => handleResetApiKey(clients[0] || { id: 1, name: 'Sample Client' })}
            className="px-4 py-3 bg-white/20 hover:bg-white/30 border border-white/30 text-white rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <Unlock size={18} />
            Reset API Key
          </button>
        </div>
      </div>

      {/* Password Verification Modal */}
      <PasswordVerificationModal
        isOpen={showPasswordModal}
        title={
          modalType === 'upgrade' ? 'Upgrade/Downgrade Tier' :
          modalType === 'suspend' ? 'Suspend Client' :
          'Reset API Key'
        }
        onConfirm={performAction}
        onCancel={() => {
          setShowPasswordModal(false)
          setSelectedClient(null)
          setModalType(null)
          setNewTier('')
        }}
        isLoading={actionLoading}
      />

      {/* Tier Selection Modal */}
      {showTierSelection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-[#0f1419] to-[#1a2a4a] border border-[#7ab8f5]/30 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Syne' }}>Select New Tier</h3>
            <p className="text-white/70 text-sm mb-6">Choose the new subscription tier for {selectedClient?.name || 'this client'}</p>
            <div className="space-y-3">
              {['starter', 'growth', 'enterprise'].map(tier => (
                <button
                  key={tier}
                  onClick={() => handleTierSelected(tier)}
                  className="w-full px-4 py-3 rounded-lg border transition-all bg-white/10 border-white/20 text-white/70 hover:bg-white/20 hover:border-white/30"
                >
                  {tier.charAt(0).toUpperCase() + tier.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setShowTierSelection(false)
                setSelectedClient(null)
                setModalType(null)
              }}
              className="w-full mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
