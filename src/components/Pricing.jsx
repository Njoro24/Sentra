import React from 'react'
import { Check } from 'lucide-react'

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
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Choose the plan that fits your institution
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-lg border transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/20 ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-sky-500/10 to-blue-600/10 border-sky-500/50 shadow-lg shadow-sky-500/20 transform md:scale-105 hover:scale-110'
                  : 'bg-slate-800/50 border-slate-700 hover:border-sky-500/50 hover:bg-slate-800/80 hover:shadow-lg hover:shadow-sky-500/20'
              }`}
            >
              {/* Badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="px-4 py-1 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-semibold rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-white mb-2">
                {plan.name}
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">
                  {plan.price}
                </span>
                <span className="text-slate-400 text-sm ml-2">
                  {plan.period}
                </span>
              </div>



              {/* Features */}
              <div className="space-y-4">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check size={20} className="text-sky-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Note */}
        <div className="mt-16 text-center">
          <p className="text-slate-400">
            All plans include 30-day free trial. No credit card required.
          </p>
        </div>

        {/* Get Started Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              const element = document.getElementById('contact')
              if (element) element.scrollIntoView({ behavior: 'smooth' })
            }}
            className="px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-sky-500/50 transition-all cursor-pointer border-none"
          >
            Get Started
          </button>
        </div>
      </div>
    </section>
  )
}
