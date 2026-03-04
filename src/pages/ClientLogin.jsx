import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Check, X, AlertCircle, Loader } from 'lucide-react'
import { api } from '../services/api'

export default function ClientLogin() {
  const navigate = useNavigate()
  const [step, setStep] = useState('login') // login, otp
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [clientId, setClientId] = useState(null)
  const [email, setEmail] = useState('')

  // Login form
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    remember_device: false,
    device_name: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  // OTP form
  const [otp, setOtp] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpDeliveryMethods, setOtpDeliveryMethods] = useState([])

  // Rate limiting state
  const [remainingAttempts, setRemainingAttempts] = useState(5)
  const [lockoutTime, setLockoutTime] = useState(null)

  // Lockout timer
  useEffect(() => {
    if (!lockoutTime) return

    const timer = setInterval(() => {
      const now = new Date()
      const remaining = Math.ceil((lockoutTime - now) / 1000)

      if (remaining <= 0) {
        setLockoutTime(null)
        setRemainingAttempts(5)
        setError('')
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [lockoutTime])

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target
    setLoginData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    setError('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!loginData.email || !loginData.password) {
        throw new Error('Email and password are required')
      }

      // Get device name if remember device is checked
      let deviceName = loginData.device_name
      if (loginData.remember_device && !deviceName) {
        deviceName = `Device - ${new Date().toLocaleDateString()}`
      }

      const response = await api.login(
        loginData.email,
        loginData.password,
        loginData.remember_device,
        deviceName
      )

      setEmail(loginData.email)
      setClientId(response.data.client_id)
      setOtpDeliveryMethods(response.data.otp_delivery_methods || ['sms', 'email'])

      if (response.data.requires_otp) {
        setStep('otp')
        setSuccess('OTP sent to your phone and email')
      } else {
        // Device is trusted, login successful
        localStorage.setItem('access_token', response.data.access_token)
        localStorage.setItem('token_type', response.data.token_type)
        setSuccess('Login successful!')
        setTimeout(() => {
          navigate('/dashboard')
        }, 1500)
      }
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message
      setError(errorMsg)

      // Check for lockout message
      if (errorMsg.includes('locked')) {
        const match = errorMsg.match(/(\d+)\s*minutes/)
        if (match) {
          const minutes = parseInt(match[1])
          setLockoutTime(new Date(Date.now() + minutes * 60 * 1000))
        }
      } else if (errorMsg.includes('attempts')) {
        const match = errorMsg.match(/\((\d+)\/5/)
        if (match) {
          setRemainingAttempts(5 - parseInt(match[1]))
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setOtpLoading(true)
    setError('')

    try {
      if (!otp || otp.length !== 6) {
        throw new Error('Please enter a valid 6-digit code')
      }

      const response = await api.verifyOTP(clientId, otp, 'login')

      // Store tokens
      localStorage.setItem('access_token', response.data.access_token)
      localStorage.setItem('token_type', response.data.token_type)

      // Trust device if requested
      if (loginData.remember_device) {
        try {
          await api.trustDevice(clientId, loginData.device_name || `Device - ${new Date().toLocaleDateString()}`)
        } catch (err) {
          console.error('Failed to trust device:', err)
        }
      }

      setSuccess('Login successful!')
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.detail || err.message)
    } finally {
      setOtpLoading(false)
    }
  }

  const formatLockoutTime = () => {
    if (!lockoutTime) return ''
    const now = new Date()
    const remaining = Math.ceil((lockoutTime - now) / 1000)
    const minutes = Math.floor(remaining / 60)
    const seconds = remaining % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
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
          {step === 'login' ? (
            <>
              <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-300 text-sm">{error}</p>
                    {remainingAttempts < 5 && !lockoutTime && (
                      <p className="text-red-300 text-xs mt-1">
                        {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining
                      </p>
                    )}
                  </div>
                </div>
              )}

              {lockoutTime && (
                <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-300 text-sm font-medium">Account Temporarily Locked</p>
                    <p className="text-yellow-300 text-xs mt-1">
                      Try again in {formatLockoutTime()}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    placeholder="your@institution.com"
                    disabled={lockoutTime !== null}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => navigate('/forgot-password')}
                      className="text-xs text-cyan-400 hover:text-cyan-300"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder="Enter your password"
                      disabled={lockoutTime !== null}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={lockoutTime !== null}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-300 disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Device */}
                <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                  <input
                    type="checkbox"
                    id="remember_device"
                    name="remember_device"
                    checked={loginData.remember_device}
                    onChange={handleLoginChange}
                    disabled={lockoutTime !== null}
                    className="w-4 h-4 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500 cursor-pointer disabled:opacity-50"
                  />
                  <label htmlFor="remember_device" className="text-sm text-slate-300 cursor-pointer flex-1">
                    Trust this device for 30 days
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || lockoutTime !== null}
                  className="w-full mt-6 px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {loading && <Loader className="w-4 h-4 animate-spin" />}
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>

                {/* Register Link */}
                <p className="text-center text-slate-400 text-sm mt-4">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    Create one
                  </button>
                </p>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-2">Verify Your Identity</h2>
              <p className="text-slate-400 text-sm mb-6">
                Enter the 6-digit code sent to your phone and email
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

              <form onSubmit={handleVerifyOTP} className="space-y-4">
                {/* OTP Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition text-center text-3xl tracking-widest font-mono"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    Sent to {email} and your registered phone
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={otpLoading || otp.length !== 6}
                  className="w-full mt-6 px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {otpLoading && <Loader className="w-4 h-4 animate-spin" />}
                  {otpLoading ? 'Verifying...' : 'Verify'}
                </button>

                {/* Back Button */}
                <button
                  type="button"
                  onClick={() => {
                    setStep('login')
                    setOtp('')
                    setError('')
                  }}
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
