import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Smartphone, LogOut as LogOutIcon, Eye, EyeOff } from 'lucide-react'
import ClientLayout from '../components/ClientLayout'

export default function ClientSecurity() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  const [loginHistory] = useState([])
  const [activeSessions] = useState([])

  const [twoFAEnabled, setTwoFAEnabled] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      navigate('/login')
      return
    }
    setLoading(false)
  }, [])

  const handlePasswordChange = () => {
    if (passwordForm.new === passwordForm.confirm) {
      alert('Password changed successfully')
      setPasswordForm({ current: '', new: '', confirm: '' })
    } else {
      alert('Passwords do not match')
    }
  }

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading security settings...</p>
          </div>
        </div>
      </ClientLayout>
    )
  }

  return (
    <ClientLayout>
      {/* Login History */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Recent Login Activity</h3>
        {loginHistory.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-4 py-3 text-left text-slate-300 font-medium">Date & Time</th>
                    <th className="px-4 py-3 text-left text-slate-300 font-medium">IP Address</th>
                    <th className="px-4 py-3 text-left text-slate-300 font-medium">Device</th>
                    <th className="px-4 py-3 text-left text-slate-300 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {loginHistory.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition">
                      <td className="px-4 py-3 text-slate-300">{entry.date}</td>
                      <td className="px-4 py-3 text-slate-300">{entry.ip}</td>
                      <td className="px-4 py-3 text-slate-300">{entry.device}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          entry.status === 'Success'
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {entry.status === 'Success' ? '✓' : '✕'} {entry.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-yellow-400 mt-4">
              Unusual login detected from unknown IP on Feb 25
            </p>
          </>
        ) : (
          <div className="py-8 text-center">
            <p className="text-slate-400">No login activity yet</p>
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Active Sessions</h3>
        {activeSessions.length > 0 ? (
          <>
            <div className="space-y-3 mb-4">
              {activeSessions.map((session, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{session.device}</p>
                    <p className="text-xs text-slate-400">Last activity: {session.lastActivity}</p>
                  </div>
                  {!session.isCurrent && (
                    <button className="text-red-400 hover:text-red-300 transition text-sm font-medium">
                      Logout
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button className="w-full px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30 rounded-lg transition font-medium text-sm">
              Logout from all devices
            </button>
          </>
        ) : (
          <div className="py-8 text-center">
            <p className="text-slate-400">No active sessions</p>
          </div>
        )}
      </div>

      {/* Password Management */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Password Management</h3>
        </div>

        <div className="mb-6 p-4 bg-slate-800/50 rounded-lg">
          <p className="text-sm text-slate-400 mb-2">Last Changed: 30 days ago</p>
          <p className="text-sm text-green-400 font-medium">Strength: Strong (at least 12 characters)</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 block mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400 block mb-2">New Password</label>
            <input
              type="password"
              value={passwordForm.new}
              onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400 block mb-2">Confirm Password</label>
            <input
              type="password"
              value={passwordForm.confirm}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-slate-400 mb-3">Password Requirements:</p>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>✓ At least 12 characters</li>
              <li>✓ Uppercase + lowercase</li>
              <li>✓ Numbers + special characters</li>
            </ul>
          </div>

          <button
            onClick={handlePasswordChange}
            className="w-full px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30 rounded-lg transition font-medium"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Smartphone className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Two-Factor Authentication</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
            <div>
              <p className="text-white font-medium">Status</p>
              <p className={`text-sm ${twoFAEnabled ? 'text-green-400' : 'text-slate-400'}`}>
                {twoFAEnabled ? '✓ Enabled' : 'Disabled'}
              </p>
            </div>
            <button
              onClick={() => setTwoFAEnabled(!twoFAEnabled)}
              className={`px-4 py-2 rounded-lg transition font-medium text-sm ${
                twoFAEnabled
                  ? 'bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30'
                  : 'bg-green-500/20 border border-green-500/50 text-green-300 hover:bg-green-500/30'
              }`}
            >
              {twoFAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </button>
          </div>

          {twoFAEnabled && (
            <>
              <div>
                <p className="text-sm text-slate-400 mb-2">Phone number</p>
                <p className="text-slate-300">Not configured</p>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition font-medium text-sm">
                  Add Phone Number
                </button>
                <button className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition font-medium text-sm">
                  Get Backup Codes
                </button>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400 mb-2">How it works:</p>
                <ol className="text-xs text-slate-400 space-y-1">
                  <li>1. Enter email/password</li>
                  <li>2. We send SMS code to your phone</li>
                  <li>3. Enter code to login</li>
                  <li>4. Blocks unauthorized access even if password leaked</li>
                </ol>
              </div>
            </>
          )}
        </div>
      </div>
    </ClientLayout>
  )
}
