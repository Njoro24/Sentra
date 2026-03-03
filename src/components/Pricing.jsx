import React from 'react'
import { Check, ArrowRight } from 'lucide-react'

export default function Pricing() {
  const plans = [
    {
      name: 'Starter',
      description: 'For small institutions',
      price: 'KES 50K',
      period: '/month',
      highlighted: false,
      cta: 'Get Started',
      features: [
        'Up to 10,000 transactions/month',
        'Real-time fraud scoring',
        'Basic dashboard',
        'Email support',
        'API access'
      ]
    },
    {
      name: 'Professional',
      description: 'For growing banks',
      price: 'KES 150K',
      period: '/month',
      highlighted: true,
      cta: 'Start Free Trial',
      features: [
        'Up to 100,000 transactions/month',
        'Real-time fraud scoring',
        'Advanced analytics',
        'Priority support',
        'Custom rules engine',
        'Network analysis',
        'Dedicated account manager'
      ]
    },
    {
      name: 'Enterprise',
      description: 'For large institutions',
      price: 'Custom',
      period: 'pricing',
      highlighted: false,
      cta: 'Contact Sales',
      features: [
        'Unlimited transactions',
        'Real-time fraud scoring',
        'Custom ML models',
        '24/7 phone support',
        'On-premise deployment',
        'SLA guarantee',
        'Custom integrations'
      ]
    }
  ]

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-white" style={{ fontFamily: 'Syne' }}>
            Simple, Transparent Pricing
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
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
                  ? 'bg-white/20 border-white/50 shadow-2xl shadow-white/30 md:scale-105 pt-8'
                  : 'bg-white/10 border-white/20 hover:border-white/50 hover:bg-white/20'
              }`}
            >
              {/* Badge */}
              {plan.highlighted && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
                  <span className="px-4 py-1 bg-white text-[#0f4db5] text-sm font-semibold rounded-full shadow-lg whitespace-nowrap">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Content */}
              <div className="relative z-10 p-8 flex flex-col h-full">
                {/* Plan Name */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white group-hover:text-white transition-colors" style={{ fontFamily: 'Syne' }}>
                    {plan.name}
                  </h3>
                  <p className="text-white/70 text-sm mt-2">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="py-6 border-y border-white/20 mb-6">
                  <span className="text-5xl font-bold text-white" style={{ fontFamily: 'Syne' }}>
                    {plan.price}
                  </span>
                  <span className="text-white/70 text-sm ml-2">
                    {plan.period}
                  </span>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 group/item">
                      <Check size={20} className="text-white flex-shrink-0 mt-0.5 group-hover/item:scale-125 transition-transform" />
                      <span className="text-white/80 text-sm group-hover/item:text-white transition-colors">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button className="w-full py-3 px-4 bg-white text-[#0f4db5] rounded-lg font-semibold hover:bg-white/90 transition-all hover:shadow-lg hover:shadow-white/30">
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center space-y-4">
          <p className="text-white/70">
            All plans include 30-day free trial. No credit card required.
          </p>
          <p className="text-sm text-white/60">
            Need a custom plan? <span className="text-white cursor-pointer hover:text-white/80 transition-colors">Contact our sales team</span>
          </p>
        </div>
      </div>
    </section>
  )
}
