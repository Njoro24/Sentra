import React, { useState } from 'react'
import { Code2, Copy, Check, ExternalLink } from 'lucide-react'

export default function Documentation() {
  const [copied, setCopied] = useState(null)
  const apiUrl = import.meta.env.VITE_API_URL || 'https://api.yourdomain.com'

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const codeExamples = [
    {
      id: 'auth',
      title: 'Authentication',
      description: 'Get your API token for authenticated requests',
      code: `curl -X POST ${apiUrl}/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "admin@yourbank.com",
    "password": "your-password"
  }'`
    },
    {
      id: 'score',
      title: 'Score a Transaction',
      description: 'Send a transaction for real-time fraud scoring',
      code: `curl -X POST ${apiUrl}/v1/score \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "transaction_id": "TXN123456",
    "amount": 50000,
    "phone_number": "+254712345678",
    "device_id": "device_001",
    "location": "Nairobi",
    "timestamp": "2024-02-22T10:30:00Z"
  }'`
    },
    {
      id: 'health',
      title: 'Health Check',
      description: 'Verify API and model status',
      code: `curl ${apiUrl}/v1/health`
    },
    {
      id: 'dashboard',
      title: 'Dashboard Summary',
      description: 'Get your account summary and statistics',
      code: `curl ${apiUrl}/dashboard/summary \\
  -H "Authorization: Bearer YOUR_TOKEN"`
    }
  ]

  const endpoints = [
    {
      method: 'POST',
      path: '/auth/register',
      description: 'Register a new institution',
      params: ['name', 'email', 'password', 'subscription_tier']
    },
    {
      method: 'POST',
      path: '/auth/login',
      description: 'Login and get JWT token',
      params: ['email', 'password']
    },
    {
      method: 'POST',
      path: '/v1/score',
      description: 'Score a transaction for fraud risk',
      params: ['transaction_id', 'amount', 'phone_number', 'device_id', 'location']
    },
    {
      method: 'GET',
      path: '/v1/health',
      description: 'Check API health status',
      params: []
    },
    {
      method: 'GET',
      path: '/dashboard/summary',
      description: 'Get dashboard summary',
      params: []
    },
    {
      method: 'GET',
      path: '/dashboard/feed',
      description: 'Get transaction feed',
      params: ['limit']
    }
  ]

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: 'linear-gradient(135deg, #071e52 0%, #0f4db5 55%, #2277ee 100%)' }}>
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2277ee]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7ab8f5]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/10 border border-white/20 rounded-full">
            <Code2 size={18} className="text-white" />
            <span className="text-sm text-white font-medium">API Documentation</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Syne' }}>
            Developer Guide
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Integrate Sentra's fraud detection API into your application in minutes
          </p>
        </div>

        {/* Quick Start */}
        <div className="bg-white/10 border border-white/20 rounded-xl p-8 mb-12 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Syne' }}>Quick Start</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-white/20 border border-white/30 rounded-full flex items-center justify-center text-white font-semibold">1</div>
              <div>
                <h3 className="text-white font-semibold mb-1">Register Your Institution</h3>
                <p className="text-white/70">Sign up on the platform and choose your plan</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-white/20 border border-white/30 rounded-full flex items-center justify-center text-white font-semibold">2</div>
              <div>
                <h3 className="text-white font-semibold mb-1">Get Your API Token</h3>
                <p className="text-white/70">Login to get your JWT token for API requests</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-white/20 border border-white/30 rounded-full flex items-center justify-center text-white font-semibold">3</div>
              <div>
                <h3 className="text-white font-semibold mb-1">Start Scoring Transactions</h3>
                <p className="text-white/70">Send transactions to the /v1/score endpoint</p>
              </div>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Syne' }}>Code Examples</h2>
          <div className="grid gap-6">
            {codeExamples.map(example => (
              <div key={example.id} className="bg-white/10 border border-white/20 rounded-xl p-6 backdrop-blur-sm">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white">{example.title}</h3>
                  <p className="text-white/70 text-sm mt-1">{example.description}</p>
                </div>
                <div className="relative">
                  <pre className="bg-white/5 border border-white/20 rounded-lg p-4 overflow-x-auto">
                    <code className="text-white/80 text-sm font-mono">{example.code}</code>
                  </pre>
                  <button
                    onClick={() => copyToClipboard(example.code, example.id)}
                    className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all"
                  >
                    {copied === example.id ? (
                      <Check size={18} className="text-green-400" />
                    ) : (
                      <Copy size={18} className="text-white/70" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Endpoints */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Syne' }}>API Endpoints</h2>
          <div className="space-y-4">
            {endpoints.map((endpoint, idx) => (
              <div key={idx} className="bg-white/10 border border-white/20 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg font-semibold text-sm ${
                      endpoint.method === 'GET' ? 'bg-blue-400/30 text-blue-200' :
                      endpoint.method === 'POST' ? 'bg-green-400/30 text-green-200' :
                      'bg-purple-400/30 text-purple-200'
                    }`}>
                      {endpoint.method}
                    </span>
                    <code className="text-[#7ab8f5] font-mono">{endpoint.path}</code>
                  </div>
                </div>
                <p className="text-white/70 mb-3">{endpoint.description}</p>
                {endpoint.params.length > 0 && (
                  <div className="text-sm">
                    <span className="text-white/60">Parameters: </span>
                    <span className="text-white/80">{endpoint.params.join(', ')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Response Format */}
        <div className="bg-white/10 border border-white/20 rounded-xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Syne' }}>Response Format</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-3">Fraud Score Response</h3>
              <pre className="bg-white/5 border border-white/20 rounded-lg p-4 overflow-x-auto">
                <code className="text-white/80 text-sm font-mono">{`{
  "transaction_id": "TXN123456",
  "risk_score": 75,
  "risk_level": "HIGH",
  "signals": {
    "velocity": 0.8,
    "amount_anomaly": 0.6,
    "device_new": 0.4,
    "location_change": 0.2
  },
  "recommendation": "BLOCK",
  "processing_time_ms": 45.23
}`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="mt-12 text-center">
          <p className="text-white/70 mb-4">Need help? Contact our support team</p>
          <a href="mailto:support@sentra.io" className="inline-flex items-center gap-2 text-[#7ab8f5] hover:text-white transition-colors">
            support@sentra.io
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  )
}
