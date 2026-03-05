import React from 'react'
import { PricingTable } from '@/components/ui/pricing-table'

export default function Pricing() {
  const features = [
    { name: "Real-time fraud scoring", included: "starter" },
    { name: "Up to 10,000 transactions/month", included: "starter" },
    { name: "Basic dashboard", included: "starter" },
    { name: "Email support", included: "starter" },
    { name: "API access", included: "starter" },
    { name: "Advanced analytics", included: "pro" },
    { name: "Up to 100,000 transactions/month", included: "pro" },
    { name: "Priority support", included: "pro" },
    { name: "Custom rules engine", included: "pro" },
    { name: "Network analysis", included: "pro" },
    { name: "Dedicated account manager", included: "pro" },
    { name: "Custom ML models", included: "all" },
    { name: "Unlimited transactions", included: "all" },
    { name: "24/7 phone support", included: "all" },
    { name: "On-premise deployment", included: "all" },
    { name: "SLA guarantee", included: "all" },
    { name: "Custom integrations", included: "all" },
  ]

  const plans = [
    {
      name: "Starter",
      description: "For small institutions",
      level: "starter",
      price: { monthly: 50000, yearly: 600000 },
      features: [
        "Up to 10,000 transactions/month",
        "Real-time fraud scoring",
        "Basic dashboard",
        "Email support",
        "API access"
      ]
    },
    {
      name: "Professional",
      description: "For growing banks",
      level: "pro",
      price: { monthly: 150000, yearly: 1800000 },
      popular: true,
      features: [
        "Up to 100,000 transactions/month",
        "Real-time fraud scoring",
        "Advanced analytics",
        "Priority support",
        "Custom rules engine",
        "Network analysis",
        "Dedicated account manager"
      ]
    },
    {
      name: "Enterprise",
      description: "For large institutions",
      level: "all",
      price: { monthly: 300000, yearly: 3600000 },
      features: [
        "Unlimited transactions",
        "Real-time fraud scoring",
        "Custom ML models",
        "24/7 phone support",
        "On-premise deployment",
        "SLA guarantee",
        "Custom integrations"
      ]
    }
  ]

  const handlePlanSelect = (plan) => {
    console.log("Selected plan:", plan)
    // Add your plan selection logic here
  }

  return (
    <section id="pricing" className="relative py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent pointer-events-none" />
      <PricingTable
        features={features}
        plans={plans}
        defaultPlan="pro"
        defaultInterval="monthly"
        onPlanSelect={handlePlanSelect}
        containerClassName="py-12"
      />
    </section>
  )
}

