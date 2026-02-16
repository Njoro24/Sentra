import React from 'react'
import { ArrowRight, Shield, Zap, Lock } from 'lucide-react'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full animate-fade-in hover:bg-indigo-500/20 transition-all cursor-default group">
              <Shield size={16} className="text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-indigo-300">Real-time Fraud Detection</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-slide-up">
                  Detect Fraud
                </span>
                <br />
                <span className="text-white animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  Before It Happens
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 max-w-xl leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
                Sentra uses advanced machine learning to identify fraudulent transactions in real-time. Protect your institution with intelligent, adaptive detection.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <button
                onClick={() => {
                  const element = document.getElementById('contact')
                  if (element) element.scrollIntoView({ behavior: 'smooth' })
                }}
                className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 transition-all flex items-center justify-center gap-2 border-none cursor-pointer"
              >
                Start Free Trial
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => {
                  const element = document.getElementById('how-it-works')
                  if (element) element.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-8 py-4 border-2 border-indigo-500/50 text-white rounded-lg font-semibold hover:border-indigo-400 hover:bg-indigo-500/10 hover:scale-105 transition-all cursor-pointer bg-transparent"
              >
                See How It Works
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="group p-4 bg-slate-800/30 border border-indigo-500/20 rounded-lg hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all cursor-default">
                <div className="text-2xl font-bold text-indigo-400 group-hover:scale-110 transition-transform origin-left">99.9%</div>
                <div className="text-xs text-slate-400 mt-2">Uptime SLA</div>
              </div>
              <div className="group p-4 bg-slate-800/30 border border-indigo-500/20 rounded-lg hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all cursor-default">
                <div className="text-2xl font-bold text-indigo-400 group-hover:scale-110 transition-transform origin-left">&lt;200ms</div>
                <div className="text-xs text-slate-400 mt-2">Response Time</div>
              </div>
              <div className="group p-4 bg-slate-800/30 border border-indigo-500/20 rounded-lg hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all cursor-default">
                <div className="text-2xl font-bold text-indigo-400 group-hover:scale-110 transition-transform origin-left">340%</div>
                <div className="text-xs text-slate-400 mt-2">Fraud Growth</div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative h-96 lg:h-full min-h-96 flex items-center justify-center">
            {/* Animated card with gradient border */}
            <div className="relative w-full h-full max-w-md">
              {/* Gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
              
              {/* Card content */}
              <div className="relative w-full h-full bg-slate-900 rounded-2xl p-8 flex flex-col justify-between overflow-hidden group hover:scale-105 transition-transform duration-300">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Content */}
                <div className="relative z-10 space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-indigo-400">TRANSACTION ANALYSIS</div>
                    <Lock size={20} className="text-green-400" />
                  </div>

                  {/* Transaction items */}
                  <div className="space-y-4">
                    {[
                      { amount: 'KES 150,000', status: 'HIGH RISK', color: 'text-red-400', icon: '⚠️' },
                      { amount: 'KES 5,000', status: 'LOW RISK', color: 'text-green-400', icon: '✓' },
                      { amount: 'KES 45,000', status: 'FLAGGED', color: 'text-yellow-400', icon: '!' },
                    ].map((item, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-800 transition-all group/item cursor-default"
                        style={{ animationDelay: `${0.5 + idx * 0.1}s` }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg group-hover/item:scale-125 transition-transform">{item.icon}</span>
                          <div>
                            <div className="text-sm font-semibold text-white">{item.amount}</div>
                            <div className={`text-xs ${item.color}`}>{item.status}</div>
                          </div>
                        </div>
                        <Zap size={16} className="text-indigo-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
                    <span>Real-time Processing</span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
