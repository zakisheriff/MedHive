import { ArrowUp, ArrowDown, Droplets, Wind, Thermometer } from 'lucide-react'
import { getRiskClass } from '../../utils/formatters'

const RiskTable = ({ data, onRowClick }) => {
  const getDriverIcon = (driver) => {
    const icons = {
      rain: Droplets,
      humidity: Droplets,
      temp: Thermometer,
      wind: Wind
    }
    return icons[driver] || ArrowUp
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
            <th className="text-left py-3 px-4 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-dimmed)', letterSpacing: '0.5px' }}>District</th>
            <th className="text-right py-3 px-4 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-dimmed)', letterSpacing: '0.5px' }}>Current</th>
            <th className="text-right py-3 px-4 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-dimmed)', letterSpacing: '0.5px' }}>Pred W+1</th>
            <th className="text-right py-3 px-4 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-dimmed)', letterSpacing: '0.5px' }}>Pred W+2</th>
            <th className="text-center py-3 px-4 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-dimmed)', letterSpacing: '0.5px' }}>Risk</th>
            <th className="text-center py-3 px-4 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-dimmed)', letterSpacing: '0.5px' }}>Confidence</th>
            <th className="text-left py-3 px-4 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-dimmed)', letterSpacing: '0.5px' }}>Drivers</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr 
              key={index}
              onClick={() => onRowClick && onRowClick(row)}
              className="cursor-pointer transition-colors"
              style={{ 
                borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-dark-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <td className="py-3 px-4 font-medium" style={{ color: 'var(--color-text-primary)' }}>{row.district}</td>
              <td className="py-3 px-4 text-right" style={{ color: 'var(--color-text-secondary)' }}>{row.current}</td>
              <td className="py-3 px-4 text-right" style={{ color: 'var(--color-text-secondary)' }}>{row.predWeek1}</td>
              <td className="py-3 px-4 text-right" style={{ color: 'var(--color-text-secondary)' }}>{row.predWeek2}</td>
              <td className="py-3 px-4 text-center">
                <span className={`risk-badge ${getRiskClass(row.risk)}`}>
                  {row.risk}
                </span>
              </td>
              <td className="py-3 px-4 text-center" style={{ color: 'var(--color-text-muted)' }}>{row.confidence}</td>
              <td className="py-3 px-4">
                <div className="flex gap-2 flex-wrap">
                  {row.drivers.map((driver, idx) => {
                    const Icon = getDriverIcon(driver.type)
                    return (
                      <span 
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.04)', color: 'var(--color-text-secondary)' }}
                      >
                        <Icon className="w-3 h-3" />
                        {driver.label}
                        {driver.trend === 'up' && <ArrowUp className="w-3 h-3" style={{ color: 'var(--color-primary)' }} />}
                        {driver.trend === 'down' && <ArrowDown className="w-3 h-3" style={{ color: 'var(--color-text-muted)' }} />}
                      </span>
                    )
                  })}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RiskTable
