import { AlertTriangle, Check, Eye } from 'lucide-react'
import { getRiskClass } from '../../utils/formatters'

const AlertCard = ({ alert, onAcknowledge, onViewDistrict }) => {
  const severityConfig = {
    CRITICAL: { icon: AlertTriangle, bgColor: 'rgba(184, 87, 61, 0.08)', borderColor: 'rgba(184, 87, 61, 0.3)' },
    HIGH: { icon: AlertTriangle, bgColor: 'rgba(220, 163, 73, 0.1)', borderColor: 'rgba(220, 163, 73, 0.4)' },
    MEDIUM: { icon: AlertTriangle, bgColor: 'rgba(220, 163, 73, 0.06)', borderColor: 'rgba(220, 163, 73, 0.25)' },
    LOW: { icon: AlertTriangle, bgColor: 'rgba(0, 0, 0, 0.03)', borderColor: 'rgba(0, 0, 0, 0.1)' },
  }

  const config = severityConfig[alert.severity] || severityConfig.MEDIUM
  const Icon = config.icon

  return (
    <div 
      className="card p-6" 
      style={{ 
        borderLeft: `4px solid ${config.borderColor}`,
        backgroundColor: config.bgColor
      }}
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-md" style={{ backgroundColor: config.bgColor }}>
          <Icon className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
        </div>
        
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`risk-badge ${getRiskClass(alert.severity)}`}>
                  {alert.severity}
                </span>
                <span className="text-xs" style={{ color: 'var(--color-text-dimmed)' }}>{alert.type}</span>
              </div>
              <h4 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>{alert.title}</h4>
            </div>
          </div>

          {/* Why */}
          <div className="mb-3">
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Why:</p>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{alert.reason}</p>
          </div>

          {/* Forecast */}
          {alert.forecast && (
            <div className="mb-3">
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Forecast:</p>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{alert.forecast}</p>
            </div>
          )}

          {/* Recommended Action */}
          {alert.action && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Recommended Action:</p>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{alert.action}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onAcknowledge(alert.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all"
              style={{ 
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                borderRadius: 'var(--border-radius-sm)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
            >
              <Check className="w-4 h-4" />
              Acknowledge
            </button>
            <button
              onClick={() => onViewDistrict(alert.districtId)}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-md text-sm font-medium transition-all"
              style={{ 
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)',
                borderRadius: 'var(--border-radius-sm)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-dark-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <Eye className="w-4 h-4" />
              View District
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlertCard
