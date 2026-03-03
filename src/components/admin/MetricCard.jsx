import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function MetricCard({ title, value, unit, icon: Icon, status = 'healthy', trend, onClick }) {
  const statusColors = {
    healthy: 'bg-green-500/20 border-green-500/30',
    warning: 'bg-yellow-500/20 border-yellow-500/30',
    critical: 'bg-red-500/20 border-red-500/30',
  }

  const statusTextColors = {
    healthy: 'text-green-400',
    warning: 'text-yellow-400',
    critical: 'text-red-400',
  }

  return (
    <div
      onClick={onClick}
      className={`bg-white/10 border border-white/20 rounded-lg p-6 cursor-pointer hover:bg-white/20 transition-all ${statusColors[status]}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-white/70 text-sm mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{value}</span>
            {unit && <span className="text-white/60 text-sm">{unit}</span>}
          </div>
        </div>
        {Icon && <Icon size={24} className={statusTextColors[status]} />}
      </div>

      {trend && (
        <div className="flex items-center gap-1 text-sm">
          {trend.direction === 'up' ? (
            <TrendingUp size={16} className="text-green-400" />
          ) : (
            <TrendingDown size={16} className="text-red-400" />
          )}
          <span className={trend.direction === 'up' ? 'text-green-400' : 'text-red-400'}>
            {trend.percentage}% vs yesterday
          </span>
        </div>
      )}
    </div>
  )
}
