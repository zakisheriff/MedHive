import { TrendingUp, TrendingDown } from 'lucide-react'
import Sparkline from '../charts/Sparkline'
import { formatNumber, formatPercentage } from '../../utils/formatters'

const KpiCard = ({ title, value, change, data, icon: Icon }) => {
  const isPositive = change >= 0
  
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm mb-1" style={{ color: 'var(--color-text-muted)' }}>{title}</p>
          <h3 className="text-3xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>{formatNumber(value)}</h3>
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ backgroundColor: 'rgba(220, 163, 73, 0.1)' }}>
            <Icon className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {isPositive ? (
            <TrendingUp className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
          ) : (
            <TrendingDown className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
          )}
          <span className="text-sm font-medium" style={{ color: isPositive ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
            {formatPercentage(change)}
          </span>
          <span className="text-sm ml-1" style={{ color: 'var(--color-text-dimmed)' }}>vs last period</span>
        </div>
      </div>
      
      {data && (
        <div className="mt-4 h-12">
          <Sparkline data={data} />
        </div>
      )}
    </div>
  )
}

export default KpiCard
