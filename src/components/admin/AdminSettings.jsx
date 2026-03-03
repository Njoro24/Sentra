import React, { useState, useEffect } from 'react'
import { Save, Lock, Key, Bell } from 'lucide-react'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    highRiskThreshold: 70,
    mediumRiskThreshold: 40,
    modelRetrainingSchedule: 'weekly',
    webhookRetries: 3,
    maxApiCallsPerClient: 100000,
    emailNotifications: true,
    slackIntegration: false,
    twoFactorAuth: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('admin_token')
      const response = await fetch('http://localhost:8000/api/admin/settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setSettings({
          highRiskThreshold: data.fraud_threshold_high || 70,
          mediumRiskThreshold: data.fraud_threshold_medium || 40,
          modelRetrainingSchedule: data.model_retrain_schedule || 'weekly',
          webhookRetries: data.webhook_retries || 3,
          maxApiCallsPerClient: data.rate_limit_per_client || 100000,
          emailNotifications: data.email_alerts_enabled || true,
          slackIntegration: data.slack_enabled || false,
          twoFactorAuth: false
        })
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('http://localhost:8000/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          high_risk_threshold: settings.highRiskThreshold,
          medium_risk_threshold: settings.mediumRiskThreshold,
          model_retraining_schedule: settings.modelRetrainingSchedule,
          webhook_retries: settings.webhookRetries,
          max_api_calls_per_client: settings.maxApiCallsPerClient,
          email_notifications: settings.emailNotifications,
          slack_integration: settings.slackIntegration,
          two_factor_auth: settings.twoFactorAuth
        })
      })
      
      if (response.ok) {
        alert('Settings saved successfully')
      } else {
        alert('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings')
    }
  }

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className="space-y-6">
      {/* Fraud Thresholds */}
      <div className="bg-white/10 border border-white/20 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-6" style={{ fontFamily: 'Syne' }}>Fraud Detection Thresholds</h3>
        <div className="space-y-6">
          <div>
            <label className="text-white/70 text-sm mb-3 block">High Risk Threshold</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={settings.highRiskThreshold}
                onChange={(e) => setSettings(prev => ({ ...prev, highRiskThreshold: parseInt(e.target.value) }))}
                className="flex-1"
              />
              <span className="text-white font-bold text-lg w-12">{settings.highRiskThreshold}</span>
            </div>
            <p className="text-white/60 text-xs mt-2">Transactions with score ≥ {settings.highRiskThreshold} will be blocked</p>
          </div>

          <div>
            <label className="text-white/70 text-sm mb-3 block">Medium Risk Threshold</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={settings.mediumRiskThreshold}
                onChange={(e) => setSettings(prev => ({ ...prev, mediumRiskThreshold: parseInt(e.target.value) }))}
                className="flex-1"
              />
              <span className="text-white font-bold text-lg w-12">{settings.mediumRiskThreshold}</span>
            </div>
            <p className="text-white/60 text-xs mt-2">Transactions with score ≥ {settings.mediumRiskThreshold} will be flagged for review</p>
          </div>
        </div>
      </div>

      {/* Model Configuration */}
      <div className="bg-white/10 border border-white/20 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-6" style={{ fontFamily: 'Syne' }}>Model Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="text-white/70 text-sm mb-2 block">Model Retraining Schedule</label>
            <select 
              value={settings.modelRetrainingSchedule}
              onChange={(e) => setSettings(prev => ({ ...prev, modelRetrainingSchedule: e.target.value }))}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:border-white/50"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="manual">Manual Only</option>
            </select>
            <p className="text-white/60 text-xs mt-2">How often the fraud detection model should be retrained</p>
          </div>
        </div>
      </div>

      {/* API Configuration */}
      <div className="bg-white/10 border border-white/20 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-6" style={{ fontFamily: 'Syne' }}>API Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="text-white/70 text-sm mb-2 block">Webhook Retry Attempts</label>
            <input 
              type="number" 
              min="1" 
              max="10"
              value={settings.webhookRetries}
              onChange={(e) => setSettings(prev => ({ ...prev, webhookRetries: parseInt(e.target.value) }))}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:border-white/50"
            />
            <p className="text-white/60 text-xs mt-2">Number of times to retry failed webhook deliveries</p>
          </div>

          <div>
            <label className="text-white/70 text-sm mb-2 block">Max API Calls Per Client (Monthly)</label>
            <input 
              type="number" 
              value={settings.maxApiCallsPerClient}
              onChange={(e) => setSettings(prev => ({ ...prev, maxApiCallsPerClient: parseInt(e.target.value) }))}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:border-white/50"
            />
            <p className="text-white/60 text-xs mt-2">Rate limit for API calls per client per month</p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white/10 border border-white/20 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-6" style={{ fontFamily: 'Syne' }}>Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-white/70" />
              <div>
                <div className="text-white font-medium">Email Notifications</div>
                <div className="text-white/60 text-sm">Get alerts via email</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.emailNotifications}
                onChange={(e) => setSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7ab8f5]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-white/70" />
              <div>
                <div className="text-white font-medium">Slack Integration</div>
                <div className="text-white/60 text-sm">Send alerts to Slack</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.slackIntegration}
                onChange={(e) => setSettings(prev => ({ ...prev, slackIntegration: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7ab8f5]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white/10 border border-white/20 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-6" style={{ fontFamily: 'Syne' }}>Security</h3>
        <div className="space-y-4">
          <div>
            <label className="text-white/70 text-sm mb-2 block">Change Admin Password</label>
            <div className="flex gap-2">
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:border-white/50 placeholder-white/40"
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white rounded-lg transition-all"
              >
                <Lock size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-3">
              <Key size={20} className="text-white/70" />
              <div>
                <div className="text-white font-medium">Two-Factor Authentication</div>
                <div className="text-white/60 text-sm">Require 2FA for admin login</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.twoFactorAuth}
                onChange={(e) => setSettings(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7ab8f5]"></div>
            </label>
          </div>

          <button className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white rounded-lg transition-all">
            View Login History
          </button>
        </div>
      </div>

      {/* Save Button */}
      <button 
        onClick={handleSaveSettings}
        className="w-full px-6 py-3 bg-gradient-to-r from-[#7ab8f5] to-[#2277ee] hover:shadow-lg hover:shadow-blue-500/50 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
      >
        <Save size={20} />
        Save Settings
      </button>
    </div>
  )
}
