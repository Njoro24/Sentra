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
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-indigo-500/10 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
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
            <div key={index} className="relative group">
              {/* Card */}
              <div className="relative overflow-hidden p-6 bg-slate-800/30 border border-indigo-500/20 rounded-xl h-full hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105">
                {/* Hover gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Content */}
                <div className="relative z-10 space-y-4">
                  {/* Number */}
                  <div className="text-5xl font-bold text-indigo-500/30 group-hover:text-indigo-500/50 transition-colors">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="text-4xl group-hover:scale-125 transition-transform">
                    {step.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/50 group-hover:scale-125 transition-transform">
                    <ArrowRight size={16} className="text-white" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
