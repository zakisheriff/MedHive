import { TrendingUp, TrendingDown, Download } from 'lucide-react'
import { formatPercentage } from '../../utils/formatters'

const DemandTable = ({ data, onExport }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Demand by District</h3>
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-md text-sm font-medium transition-all"
            style={{ 
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-secondary)',
              borderRadius: 'var(--border-radius-sm)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-dark-secondary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-dimmed)', letterSpacing: '0.5px' }}>District</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-dimmed)', letterSpacing: '0.5px' }}>Disease Driver</th>
              <th className="text-right py-3 px-4 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-dimmed)', letterSpacing: '0.5px' }}>Projected Patients</th>
              <th className="text-right py-3 px-4 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-dimmed)', letterSpacing: '0.5px' }}>Projected Units</th>
              <th className="text-right py-3 px-4 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-dimmed)', letterSpacing: '0.5px' }}>Demand Change</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const isIncrease = row.changePercent >= 0
              return (
                <tr 
                  key={index}
                  className="transition-colors"
                  style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-dark-secondary)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td className="py-3 px-4 font-medium" style={{ color: 'var(--color-text-primary)' }}>{row.district}</td>
                  <td className="py-3 px-4" style={{ color: 'var(--color-text-muted)' }}>{row.diseaseDriver}</td>
                  <td className="py-3 px-4 text-right" style={{ color: 'var(--color-text-secondary)' }}>{row.projectedPatients}</td>
                  <td className="py-3 px-4 text-right" style={{ color: 'var(--color-text-secondary)' }}>{row.projectedUnits}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {isIncrease ? (
                        <TrendingUp className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                      ) : (
                        <TrendingDown className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                      )}
                      <span className="font-medium" style={{ color: isIncrease ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                        {formatPercentage(row.changePercent)}
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DemandTable
