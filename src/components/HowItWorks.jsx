import React from 'react'
import { ArrowRight } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Connect',
      description: 'Integrate our API with your transaction processing system'
    },
    {
      number: '02',
      title: 'Score',
      description: 'Every transaction gets a real-time fraud risk score'
    },
    {
      number: '03',
      title: 'Decide',
      description: 'Accept, review, or block transactions based on risk'
    },
    {
      number: '04',
      title: 'Monitor',
      description: 'Track fraud patterns and improve your rules over time'
    }
  ]

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-white" style={{ fontFamily: 'Syne' }}>
            How It Works
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Simple integration, powerful protection
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Card */}
              <div className="relative overflow-hidden p-6 bg-white/10 border border-white/20 rounded-xl h-full hover:border-white/50 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                {/* Hover gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Content */}
                <div className="relative z-10 space-y-4">
                  {/* Number */}
                  <div className="text-5xl font-bold text-white/20 group-hover:text-white/40 transition-colors" style={{ fontFamily: 'Syne' }}>
                    {step.number}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-white transition-colors" style={{ fontFamily: 'Syne' }}>
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/70 text-sm group-hover:text-white/80 transition-colors">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg shadow-white/50 group-hover:scale-125 transition-transform">
                    <ArrowRight size={16} className="text-[#0f4db5]" />
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
