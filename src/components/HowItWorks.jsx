import React from 'react'
import { ArrowRight } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Connect Your System',
      description: 'Integrate with your core banking system via secure API. Setup takes minutes with our documentation.',
      icon: '🔗'
    },
    {
      number: '02',
      title: 'Real-Time Analysis',
      description: 'Every transaction is analyzed instantly using machine learning models trained on fraud patterns.',
      icon: '⚙️'
    },
    {
      number: '03',
      title: 'Get Risk Scores',
      description: 'Receive detailed risk scores with signal breakdown. Understand exactly why a transaction was flagged.',
      icon: '📊'
    },
    {
      number: '04',
      title: 'Take Action',
      description: 'Approve, flag, or block transactions. Your feedback continuously improves the system.',
      icon: '✓'
    },
  ]

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Simple integration, powerful protection
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Card */}
              <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg h-full">
                {/* Number */}
                <div className="text-4xl font-bold text-sky-500/30 mb-4">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="text-4xl mb-4">
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 text-sm">
                  {step.description}
                </p>
              </div>

              {/* Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="w-6 h-6 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full flex items-center justify-center">
                    <ArrowRight size={16} className="text-white" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Integration Code Example */}
        <div className="mt-16 p-6 bg-slate-900/50 border border-slate-700 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Quick Integration</h3>
            <button
              onClick={() => {
                const code = `curl -X POST https://api.skorshield.com/v1/score \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "transaction_id": "TXN123456",
    "amount": 50000,
    "phone_number": "+254712345678",
    "timestamp": "2024-01-15T10:30:00Z"
  }'`
                navigator.clipboard.writeText(code)
                alert('Code copied to clipboard!')
              }}
              className="px-4 py-2 bg-sky-500/20 border border-sky-500/50 text-sky-300 rounded hover:bg-sky-500/30 transition-all text-sm cursor-pointer"
            >
              Copy
            </button>
          </div>
          <pre className="bg-slate-950 p-4 rounded overflow-x-auto text-sm text-slate-300">
{`curl -X POST https://api.skorshield.com/v1/score \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "transaction_id": "TXN123456",
    "amount": 50000,
    "phone_number": "+254712345678",
    "timestamp": "2024-01-15T10:30:00Z"
  }'`}
          </pre>
        </div>
      </div>
    </section>
  )
}
