import React, { useState } from 'react'
import { Lock, X } from 'lucide-react'

export default function PasswordVerificationModal({ isOpen, title, onConfirm, onCancel, isLoading }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleConfirm = async () => {
    if (!password.trim()) {
      setError('Password is required')
      return
    }
    
    setError('')
    await onConfirm(password)
    setPassword('')
  }

  const handleCancel = () => {
    setPassword('')
    setError('')
    onCancel()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-[#0f1419] to-[#1a2a4a] border border-[#7ab8f5]/30 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Lock size={24} className="text-[#7ab8f5]" />
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Syne' }}>{title}</h2>
          </div>
          <button
            onClick={handleCancel}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-white/70 text-sm mb-6">
          This is a sensitive action. Please enter your admin password to confirm.
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-white/70 text-sm mb-2 block">Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleConfirm()}
              placeholder="Enter your password"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:border-[#7ab8f5] placeholder-white/40"
              disabled={isLoading}
            />
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#7ab8f5] to-[#2277ee] hover:shadow-lg hover:shadow-blue-500/50 text-white rounded-lg transition-all disabled:opacity-50 font-semibold"
            >
              {isLoading ? 'Verifying...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
