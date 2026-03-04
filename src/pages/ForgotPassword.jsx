import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Check, X, AlertCircle, Loader, ArrowLeft } from 'lucide-react'
import { api } from '../services/api'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState('email') // email, otp, reset
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Email step
  const [email, setEmail] = useState('')

  // OTP step
  const [otp, setOtp] = useState('')
  const [clientId, setClientId] = useState(null)

  // Reset password step
  const [passwordData, setPasswordData] = useState({
    new_password: '',
    confirm_password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    strength: 'weak',
    requirements: {
      min_length: false,
      has_uppercase: false,
      has_lowercase: false,
      has_number: false,
      has_special: false
    }
  })

  const checkPasswordStrength = async (password) => {
    try {
      const response = await api.checkPasswordStrength(password)
      setPasswordStrength(response)
    } catch (err) {
      console.error('Password strength check failed:', err)
    }
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!email) {
        throw new Error('Email is required')
      }

      await api.forgotPassword(email)
      setSuccess('Password reset link sent to your email')
      setStep('otp')
    } catch (err) {
      setError(err.response?.data?.detail || err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!otp || otp.length !== 6) {
        throw new Error('Please enter a valid 6-digit code')
      }

      // Verify OTP - we'll use a temporary client_id lookup
      // In production, you'd get this from the email link or session
      setClientId(1) // Placeholder - should come from email link
      setStep('reset')
      setSuccess('')
    } catch (err) {
      setError(err.response?.data?.detail || err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')

    if (name === 'new_password') {
      checkPasswordStrength(value)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (passwordData.new_password !== passwordData.confirm_password) {
        throw new Error('Passwords do not match')
      }

      if (passwordStrength.score < 60) {
        throw new Error('Password does not meet strength requirements')
      }

      await api.resetPassword(
        clientId,
        otp,
        passwordData.new_password,
        passwordData.confirm_password
      )

      setSuccess('Password reset successfully! Redirecting to login...')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.detail || err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStrengthColor = () => {
    switch (passwordStrength.strength) {
      case 'very_strong':
        return 'bg-green-500'
      case 'strong':
        return 'bg-blue-500'
      case 'fair':
        return 'bg-yellow-500'
      default:
        return 'bg-red-500'
    }
  }

  const getStrengthText = () => {
    switch (passwordStrength.strength) {
      case 'very_strong':
        return 'Very Strong'
      case 'strong':
        return 'Strong'
      case 'fair':
        return 'Fair'
      default:
        return 'Weak'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sentra</h1>
          <p className="text-slate-400">Fraud Detection Platform</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 shadow-2xl">
          {step === 'email' ? (
            <>
              <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
              <p className="text-slate-400 text-sm mb-6">
                Enter your email address and we'll send you a reset code
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError('')
                    }}
                    placeholder="your@institution.com"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full mt-6 px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {loading && <Loader className="w-4 h-4 animate-spin" />}
                  {loading ? 'Sending...' : 'Send Reset Code'}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full px-4 py-2 border border-slate-600 text-slate-300 font-medium rounded-lg hover:border-slate-500 hover:text-slate-200 transition flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </button>
              </form>
            </>
          ) : step === 'otp' ? (
            <>
              <h2 className="text-2xl font-bold text-white mb-2">Enter Reset Code</h2>
              <p className="text-slate-400 text-sm mb-6">
                We've sent a 6-digit code to {email}
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Reset Code
                  </label>
                  <input
                    type="text"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition text-center text-3xl tracking-widest font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full mt-6 px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {loading && <Loader className="w-4 h-4 animate-spin" />}
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="w-full px-4 py-2 border border-slate-600 text-slate-300 font-medium rounded-lg hover:border-slate-500 hover:text-slate-200 transition"
                >
                  Back
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-2">Create New Password</h2>
              <p className="text-slate-400 text-sm mb-6">
                Enter a strong password for your account
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-green-300 text-sm">{success}</p>
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4">
                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="new_password"
                      value={passwordData.new_password}
                      onChange={handlePasswordChange}
                      placeholder="Min 12 chars, uppercase, lowercase, number, special"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Password Strength */}
                  {passwordData.new_password && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Strength</span>
                        <span className={`text-xs font-medium ${
                          passwordStrength.strength === 'very_strong' ? 'text-green-400' :
                          passwordStrength.strength === 'strong' ? 'text-blue-400' :
                          passwordStrength.strength === 'fair' ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {getStrengthText()}
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${getStrengthColor()}`}
                          style={{ width: `${passwordStrength.score}%` }}
                        />
                      </div>

                      {/* Requirements */}
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {[
                          { key: 'min_length', label: '12+ characters' },
                          { key: 'has_uppercase', label: 'Uppercase' },
                          { key: 'has_lowercase', label: 'Lowercase' },
                          { key: 'has_number', label: 'Number' },
                          { key: 'has_special', label: 'Special char' }
                        ].map(req => (
                          <div key={req.key} className="flex items-center gap-2">
                            {passwordStrength.requirements[req.key] ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <X className="w-4 h-4 text-slate-500" />
                            )}
                            <span className={`text-xs ${
                              passwordStrength.requirements[req.key] ? 'text-green-400' : 'text-slate-500'
                            }`}>
                              {req.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      name="confirm_password"
                      value={passwordData.confirm_password}
                      onChange={handlePasswordChange}
                      placeholder="Confirm your password"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-300"
                    >
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Match indicator */}
                  {passwordData.confirm_password && (
                    <div className="flex items-center gap-2 mt-2">
                      {passwordData.new_password === passwordData.confirm_password ? (
                        <>
                          <Check className="w-4 h-4 text-green-400" />
                          <span className="text-xs text-green-400">Passwords match</span>
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 text-red-400" />
                          <span className="text-xs text-red-400">Passwords don't match</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || passwordStrength.score < 60 || passwordData.new_password !== passwordData.confirm_password}
                  className="w-full mt-6 px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {loading && <Loader className="w-4 h-4 animate-spin" />}
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full px-4 py-2 border border-slate-600 text-slate-300 font-medium rounded-lg hover:border-slate-500 hover:text-slate-200 transition"
                >
                  Back to Login
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-6">
          Your security is our priority. All data is encrypted.
        </p>
      </div>
    </div>
  )
}
