import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Check, X, AlertCircle } from 'lucide-react'
import { api } from '../services/api'

export default function ClientRegister() {
  const navigate = useNavigate()
  const [step, setStep] = useState('register') // register, verify
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [clientId, setClientId] = useState(null)
  const [userEmail, setUserEmail] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    institution_name: '',
    email: '',
    password: '',
    confirm_password: ''
  })

  // Password strength state
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

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // OTP state - only email OTP
  const [emailOtp, setEmailOtp] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)

  // Check password strength
  useEffect(() => {
    if (formData.password) {
      checkPasswordStrength(formData.password)
    }
  }, [formData.password])

  const checkPasswordStrength = async (password) => {
    try {
      const response = await api.checkPasswordStrength(password)
      setPasswordStrength(response)
    } catch (err) {
      console.error('Password strength check failed:', err)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validate all fields
      if (!formData.institution_name.trim()) {
        throw new Error('Institution name is required')
      }
      if (!formData.email.trim()) {
        throw new Error('Email is required')
      }
      if (formData.password !== formData.confirm_password) {
        throw new Error('Passwords do not match')
      }
      if (passwordStrength.score < 60) {
        throw new Error('Password does not meet strength requirements')
      }

      const response = await api.register(
        formData.institution_name,
        formData.email,
        formData.password,
        formData.confirm_password
      )
      
      setClientId(response.client_id)
      setUserEmail(formData.email)
      setStep('verify')
      setSuccess('Registration successful! Check your email for the verification code.')
    } catch (err) {
      const message = err.response?.data?.detail || err.message
      
      // If already registered, redirect to login
      if (message.toLowerCase().includes('already registered')) {
        setError('This email is already registered. Redirecting to login...')
        setTimeout(() => navigate('/login'), 2000)
        return
      }
      
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setOtpLoading(true)
    setError('')

    try {
      if (!emailOtp) {
        throw new Error('Please enter the OTP code')
      }

      // Verify email OTP
      const response = await api.verifyOTP(clientId, emailOtp, 'registration')

      // Store the access token from registration
      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token)
        localStorage.setItem('token_type', response.token_type)
      }

      setSuccess('Email verified successfully! Redirecting to dashboard...')
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.detail || err.message)
    } finally {
      setOtpLoading(false)
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
          {step === 'register' ? (
            <>
              <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Institution Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    name="institution_name"
                    value={formData.institution_name}
                    onChange={handleInputChange}
                    placeholder="Your institution name"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Work Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@institution.com"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onCopy={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
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

                  {/* Password Strength Indicator */}
                  {formData.password && (
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
                      value={formData.confirm_password}
                      onChange={handleInputChange}
                      onCopy={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
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
                  {formData.confirm_password && (
                    <div className="flex items-center gap-2 mt-2">
                      {formData.password === formData.confirm_password ? (
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>

                {/* Login Link */}
                <p className="text-center text-slate-400 text-sm mt-4">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
              <p className="text-slate-400 text-sm mb-6">
                We've sent a verification code to <strong className="text-white">{userEmail}</strong>
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
                {/* Email OTP */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength="6"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition text-center text-2xl tracking-widest"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={otpLoading || emailOtp.length !== 6}
                  className="w-full mt-6 px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {otpLoading ? 'Verifying...' : 'Verify Email'}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-6">
          By registering, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
