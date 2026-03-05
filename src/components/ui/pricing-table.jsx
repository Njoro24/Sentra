"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CheckIcon, ArrowRightIcon } from "@radix-ui/react-icons"

export function PricingTable({
  features,
  plans,
  onPlanSelect,
  defaultPlan = "pro",
  defaultInterval = "monthly",
  className,
  containerClassName,
  buttonClassName,
  ...props
}) {
  const [isYearly, setIsYearly] = React.useState(defaultInterval === "yearly")
  const [selectedPlan, setSelectedPlan] = React.useState(defaultPlan)

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan)
    onPlanSelect?.(plan)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <section
      className={cn(
        "bg-background text-foreground",
        "py-12 sm:py-24 md:py-32 px-4",
        "fade-bottom overflow-hidden pb-0",
      )}
    >
      <div
        className={cn("w-full max-w-6xl mx-auto px-4", containerClassName)}
        {...props}
      >
        {/* Toggle Monthly/Yearly */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm bg-white/10 border border-white/20 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setIsYearly(false)}
              className={cn(
                "px-4 py-2 rounded-md transition-all font-medium",
                !isYearly
                  ? "bg-white/20 text-white shadow-lg"
                  : "text-white/60 hover:text-white",
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setIsYearly(true)}
              className={cn(
                "px-4 py-2 rounded-md transition-all font-medium",
                isYearly
                  ? "bg-white/20 text-white shadow-lg"
                  : "text-white/60 hover:text-white",
              )}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <button
              key={plan.name}
              type="button"
              onClick={() => handlePlanSelect(plan.level)}
              className={cn(
                "relative p-6 rounded-2xl text-left transition-all duration-300",
                "border backdrop-blur-sm",
                selectedPlan === plan.level
                  ? "border-white/50 bg-white/15 ring-2 ring-blue-400 shadow-2xl shadow-blue-500/20"
                  : "border-white/20 bg-white/10 hover:border-white/30 hover:bg-white/15",
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="inline-block px-4 py-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white text-xs font-bold rounded-full shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-1">
                  {plan.name}
                </h3>
                <p className="text-white/60 text-sm">{plan.description}</p>
              </div>

              <div className="mb-6 pb-6 border-b border-white/10">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">
                    {formatPrice(isYearly ? plan.price.yearly : plan.price.monthly)}
                  </span>
                  <span className="text-white/60 text-sm">
                    /{isYearly ? "year" : "month"}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                className={cn(
                  "w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-all",
                  buttonClassName,
                )}
              >
                Get Started
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Button>
            </button>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mt-16 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Features
                  </th>
                  {plans.map((plan) => (
                    <th
                      key={plan.level}
                      className="px-6 py-4 text-center text-sm font-semibold text-white"
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature, idx) => (
                  <tr
                    key={idx}
                    className={cn(
                      "border-b border-white/10 transition-colors",
                      idx % 2 === 0 ? "bg-white/5" : "bg-transparent",
                    )}
                  >
                    <td className="px-6 py-4 text-sm text-white/80">
                      {feature.name}
                    </td>
                    {plans.map((plan) => (
                      <td
                        key={plan.level}
                        className="px-6 py-4 text-center"
                      >
                        {shouldShowCheck(feature.included, plan.level) ? (
                          <CheckIcon className="w-5 h-5 text-green-400 mx-auto" />
                        ) : (
                          <span className="text-white/30">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center space-y-3">
          <p className="text-white/70">
            All plans include 30-day free trial. No credit card required.
          </p>
          <p className="text-sm text-white/60">
            Need a custom plan?{" "}
            <button className="text-blue-400 hover:text-blue-300 transition-colors font-semibold">
              Contact our sales team
            </button>
          </p>
        </div>
      </div>
    </section>
  )
}

function shouldShowCheck(included, level) {
  if (included === "all") return true
  if (included === "pro" && (level === "pro" || level === "all")) return true
  if (
    included === "starter" &&
    (level === "starter" || level === "pro" || level === "all")
  )
    return true
  return false
}
