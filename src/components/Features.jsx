import React from 'react'
import { Zap, Network, Lock, TrendingUp, BarChart3, AlertCircle } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Zap,
      title: 'Real-Time Scoring',
      description: 'Score transactions in under 200ms with XGBoost machine learning models trained on African financial data.',
      color: 'from-sky-500 to-blue-600'
    },
    {
      icon: Network,
      title: 'Network Analysis',
      description: 'Detect fraud rings and mule networks across multiple banks using graph database technology.',
      color: 'from-cyan-500 to-sky-600'
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'SOC 2 Type II compliant with AES-256 encryption, OAuth 2.0, and immutable audit logs.',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: TrendingUp,
      title: 'Adaptive Models',
      description: 'Models retrain automatically as fraud patterns evolve. MLflow versioning ensures instant rollback.',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      icon: BarChart3,
      title: 'Compliance Ready',
      description: 'CBK data residency, complete audit trails, and regulatory reporting built into the core.',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: AlertCircle,
      title: 'Live Alerts',
      description: 'WebSocket-powered dashboard with real-time fraud alerts and case management for your team.',
      color: 'from-pink-500 to-red-600'
    },
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
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
                className="group p-6 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-sky-500/50 hover:bg-slate-800/80 transition-all duration-300"
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} p-3 mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} className="text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
