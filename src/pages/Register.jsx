import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, AlertCircle, Check } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    subscription_tier: 'starter'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const plans = [
    { id: 'starter', name: 'Starter', price: 'KES 50,000', transactions: '50,000' },
    { id: 'growth', name: 'Growth', price: 'KES 200,000', transactions: '500,000' },
    { id: 'enterprise', name: 'Enterprise', price: 'Custom', transactions: 'Unlimited' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Registration failed')
      }

      const data = await response.json()
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('client', JSON.stringify({
        id: data.client_id,
        name: data.name,
        email: data.email,
        subscription_tier: data.subscription_tier
      }))

      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <img src="/logo.svg" alt="Sentra" className="w-10 h-10" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Sentra</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Get Started</h1>
          <p className="text-slate-400">Join leading African banks protecting against fraud</p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800/50 border border-indigo-500/20 rounded-xl p-8 backdrop-blur-sm mb-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Bank Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Institution Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Bank Ltd"
                className="w-full px-4 py-3 bg-slate-900/50 border border-indigo-500/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@yourbank.com"
                className="w-full px-4 py-3 bg-slate-900/50 border border-indigo-500/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-900/50 border border-indigo-500/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                required
              />
            </div>

            {/* Plan Selection */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">Choose Your Plan</label>
              <div className="grid grid-cols-3 gap-3">
                {plans.map(plan => (
                  <label
                    key={plan.id}
                    className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.subscription_tier === plan.id
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-indigo-500/20 bg-slate-900/50 hover:border-indigo-500/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="subscription_tier"
                      value={plan.id}
                      checked={formData.subscription_tier === plan.id}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="text-sm font-semibold text-white">{plan.name}</div>
                    <div className="text-xs text-indigo-300 mt-1">{plan.price}/mo</div>
                    <div className="text-xs text-slate-400 mt-2">{plan.transactions} txns</div>
                    {formData.subscription_tier === plan.id && (
                      <Check size={16} className="absolute top-2 right-2 text-indigo-400" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-indigo-500/10"></div>
            <span className="text-xs text-slate-500">Already have an account?</span>
            <div className="flex-1 h-px bg-indigo-500/10"></div>
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            className="block w-full py-3 border-2 border-indigo-500/30 text-indigo-300 rounded-lg font-semibold hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-center"
          >
            Sign In
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm">
          <Link to="/" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
