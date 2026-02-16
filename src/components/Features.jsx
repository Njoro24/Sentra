import React from 'react'
import { Zap, Network, Lock, TrendingUp, BarChart3, AlertCircle } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Zap,
      title: 'Real-Time Scoring',
      description: 'Score transactions in under 200ms with XGBoost machine learning models trained on African financial data.',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      icon: Network,
      title: 'Network Analysis',
      description: 'Detect fraud rings and mule networks across multiple banks using graph database technology.',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'SOC 2 Type II compliant with AES-256 encryption, OAuth 2.0, and immutable audit logs.',
      color: 'from-indigo-600 to-indigo-500'
    },
    {
      icon: TrendingUp,
      title: 'Adaptive Models',
      description: 'Models retrain automatically as fraud patterns evolve. MLflow versioning ensures instant rollback.',
      color: 'from-purple-600 to-indigo-500'
    },
    {
      icon: BarChart3,
      title: 'Compliance Ready',
      description: 'CBK data residency, complete audit trails, and regulatory reporting built into the core.',
      color: 'from-pink-500 to-purple-600'
    },
    {
      icon: AlertCircle,
      title: 'Live Alerts',
      description: 'WebSocket-powered dashboard with real-time fraud alerts and case management for your team.',
      color: 'from-indigo-500 to-pink-600'
    },
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-indigo-500/10 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Everything you need to detect and prevent fraud at scale
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative overflow-hidden p-6 bg-slate-800/30 border border-indigo-500/20 rounded-xl hover:border-indigo-500/50 transition-all duration-300 hover:scale-105 cursor-default"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Hover gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Content */}
                <div className="relative z-10 space-y-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} p-3 group-hover:scale-125 group-hover:shadow-lg group-hover:shadow-indigo-500/50 transition-all duration-300`}>
                    <Icon size={24} className="text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                    {feature.description}
                  </p>
                </div>

                {/* Border animation on hover */}
                <div className="absolute inset-0 rounded-xl border border-indigo-500/0 group-hover:border-indigo-500/50 transition-all duration-300"></div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
