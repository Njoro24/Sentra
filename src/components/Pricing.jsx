import React from 'react'
import { Check, ArrowRight } from 'lucide-react'

export default function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: 'KES 50K',
      period: '/month',
      description: 'Perfect for SACCOs and small banks',
      features: [
        'Up to 10,000 transactions/month',
        'Basic fraud scoring',
        'Email support',
        'Monthly reports',
        'Single user dashboard',
      ],
      cta: 'Get Started',
      highlighted: false
    },
    {
      name: 'Professional',
      price: 'KES 200K',
      period: '/month',
      description: 'For growing financial institutions',
      features: [
        'Up to 100,000 transactions/month',
        'Advanced ML models',
        'Network fraud detection',
        'Priority support',
        'Team dashboard (5 users)',
        'Custom integrations',
        'API documentation',
      ],
      cta: 'Get Started',
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'For large-scale operations',
      features: [
        'Unlimited transactions',
        'All Professional features',
        'Dedicated account manager',
        'Custom ML models',
        'SLA guarantee (99.9%)',
        'On-premise deployment',
        'Compliance consulting',
      ],
      cta: 'Contact Sales',
      highlighted: false
    },
  ]

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-indigo-500/10 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Choose the plan that fits your institution
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 auto-rows-max pt-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`group relative overflow-visible rounded-xl border transition-all duration-300 hover:scale-105 flex flex-col ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border-indigo-500/50 shadow-2xl shadow-indigo-500/30 md:scale-105 pt-8'
                  : 'bg-slate-800/30 border-indigo-500/20 hover:border-indigo-500/50 hover:bg-slate-800/50'
              }`}
            >
              {/* Hover gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

              {/* Badge */}
              {plan.highlighted && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
                  <span className="px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-full shadow-lg shadow-indigo-500/50 whitespace-nowrap">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Content */}
              <div className="relative z-10 p-8 flex flex-col h-full">
                {/* Plan Name */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {plan.name}
                  </h3>
                  <p className="text-slate-400 text-sm mt-2">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="py-6 border-y border-indigo-500/20 mb-6">
                  <span className="text-5xl font-bold text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text">
                    {plan.price}
                  </span>
                  <span className="text-slate-400 text-sm ml-2">
                    {plan.period}
                  </span>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 group/item">
                      <Check size={20} className="text-indigo-400 flex-shrink-0 mt-0.5 group-hover/item:scale-125 transition-transform" />
                      <span className="text-slate-300 text-sm group-hover/item:text-slate-200 transition-colors">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all flex items-center justify-center gap-2 group/btn border-none cursor-pointer mt-auto">
                  {plan.cta}
                  <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center space-y-4">
          <p className="text-slate-400">
            All plans include 30-day free trial. No credit card required.
          </p>
          <p className="text-sm text-slate-500">
            Need a custom plan? <span className="text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors">Contact our sales team</span>
          </p>
        </div>
      </div>
    </section>
  )
}
