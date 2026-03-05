import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Users, Key, Webhook, Copy, Check } from 'lucide-react'
import ClientLayout from '../components/ClientLayout'
import { api } from '../services/api'

export default function ClientSettings() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [notifications, setNotifications] = useState({
    highRisk: true,
    dailySummary: true,
    weeklyReport: true,
    smsAlerts: false
  })
  const [teamMembers, setTeamMembers] = useState([])
  const [newMember, setNewMember] = useState({ name: '', email: '' })
  const [webhookUrl, setWebhookUrl] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      navigate('/login')
      return
    }
    setLoading(false)
  }, [])

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleAddMember = () => {
    if (newMember.name && newMember.email) {
      setTeamMembers([...teamMembers, { id: Date.now(), ...newMember }])
      setNewMember({ name: '', email: '' })
    }
  }

  const handleRemoveMember = (id) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id))
  }

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText('sk_live_abc123...xyz')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading settings...</p>
          </div>
        </div>
      </ClientLayout>
    )
  }

  return (
    <ClientLayout>
      {/* Notification Preferences */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Notification Preferences</h3>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.highRisk}
              onChange={() => handleNotificationChange('highRisk')}
              className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-cyan-500"
            />
            <div>
              <p className="text-white font-medium">Alert me on HIGH-risk transaction</p>
              <p className="text-xs text-slate-400">Immediately</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.dailySummary}
              onChange={() => handleNotificationChange('dailySummary')}
              className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-cyan-500"
            />
            <div>
              <p className="text-white font-medium">Daily summary email</p>
              <p className="text-xs text-slate-400">8 AM</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.weeklyReport}
              onChange={() => handleNotificationChange('weeklyReport')}
              className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-cyan-500"
            />
            <div>
              <p className="text-white font-medium">Weekly report</p>
              <p className="text-xs text-slate-400">Monday 9 AM</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.smsAlerts}
              onChange={() => handleNotificationChange('smsAlerts')}
              className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-cyan-500"
            />
            <div>
              <p className="text-white font-medium">SMS alerts</p>
              <p className="text-xs text-slate-400">Extra cost</p>
            </div>
          </label>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <label className="block text-sm text-slate-400 mb-2">Email address</label>
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button className="mt-3 px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30 rounded-lg transition font-medium text-sm">
            Save Preferences
          </button>
        </div>
      </div>

      {/* Team Management */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Team Management</h3>
        </div>

        <div className="mb-6">
          <p className="text-sm text-slate-400 mb-4">Current Members</p>
          {teamMembers.length > 0 ? (
            <div className="space-y-2">
              {teamMembers.map(member => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{member.name}</p>
                    <p className="text-xs text-slate-400">{member.email}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-red-400 hover:text-red-300 transition text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">No team members added yet</p>
          )}
        </div>

        <div className="pt-6 border-t border-white/10">
          <p className="text-sm text-slate-400 mb-4">Add New Team Member</p>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Name"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={newMember.email}
              onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleAddMember}
              className="w-full px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30 rounded-lg transition font-medium"
            >
              Send Invite
            </button>
          </div>
        </div>
      </div>

      {/* API Configuration */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">API Configuration</h3>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-400 mb-2">API Key (keep secret!)</p>
            <div className="flex gap-2">
              <input
                type="password"
                value="sk_live_abc123...xyz"
                readOnly
                className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
              />
              <button
                onClick={handleCopyApiKey}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm text-slate-400 mb-2">API Usage This Month</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Calls Used: 0 / 0 (0%)</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="h-2 bg-cyan-500 rounded-full" style={{ width: '0%' }} />
              </div>
              <p className="text-xs text-slate-400">No usage data available yet</p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="text-sm text-slate-400 mb-3">Next Billing Date: N/A</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition font-medium text-sm">
                Regenerate Key
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Webhook Configuration */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Webhook className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Webhook Configuration</h3>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-400 mb-2">Webhook URL</p>
            <input
              type="url"
              placeholder="https://your-domain.com/webhooks/fraud"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {webhookUrl && (
            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-sm text-slate-400 mb-3">When HIGH-risk detected, we send:</p>
              <pre className="text-xs text-slate-300 overflow-x-auto">
{`POST ${webhookUrl}
{
  "transaction_id": "TXN_00520",
  "risk_level": "HIGH",
  "action": "BLOCK"
}`}
              </pre>
            </div>
          )}

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30 rounded-lg transition font-medium text-sm">
              Save Webhook
            </button>
            <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition font-medium text-sm">
              Test Webhook
            </button>
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}
