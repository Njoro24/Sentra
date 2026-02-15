import React from 'react'
import { ArrowRight, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/10 border border-sky-500/30 rounded-full mb-8 animate-fade-in">
          <Shield size={16} className="text-sky-400" />
          <span className="text-sm text-sky-300">Intelligent Fraud Detection Platform</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
          <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
            Intelligent Fraud Detection
          </span>
          <br />
          <span className="text-white">for Financial Institutions</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Real-time fraud detection powered by machine learning. Protect your institution with intelligent transaction scoring and network analysis.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={() => {
              const element = document.getElementById('contact')
              if (element) element.scrollIntoView({ behavior: 'smooth' })
            }}
            className="px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-sky-500/50 transition-all flex items-center justify-center gap-2 group cursor-pointer border-none"
          >
            Get Started
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => {
              const element = document.getElementById('how-it-works')
              if (element) element.scrollIntoView({ behavior: 'smooth' })
            }}
            className="px-8 py-4 border border-slate-600 text-white rounded-lg font-semibold hover:border-sky-500 hover:bg-sky-500/5 transition-all cursor-pointer bg-none"
          >
            Learn More
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="text-2xl sm:text-3xl font-bold text-sky-400">KES 1.5B</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-2">Annual Fraud Losses</div>
          </div>
          <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="text-2xl sm:text-3xl font-bold text-sky-400">340%</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-2">Mobile Fraud Growth</div>
          </div>
          <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="text-2xl sm:text-3xl font-bold text-sky-400">&lt;200ms</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-2">API Response Time</div>
          </div>
          <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="text-2xl sm:text-3xl font-bold text-sky-400">99.9%</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-2">Uptime SLA</div>
          </div>
        </div>
      </div>
    </section>
  )
}
