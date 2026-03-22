import { getRiskClass } from '../../utils/formatters'

const RiskTable = ({ data, onRowClick }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
            <th className="text-left py-4 px-4 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-dimmed)', letterSpacing: '0.5px' }}>
              District
            </th>
            <th className="text-center py-4 px-4 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-dimmed)', letterSpacing: '0.5px' }}>
              Weekly Scans
            </th>
            <th className="text-center py-4 px-4 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-dimmed)', letterSpacing: '0.5px' }}>
              Demand Level
            </th>
          </tr>
        </thead>
        <tbody>
          {(data || []).map((row, index) => (
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
              {/* District Name */}
              <td className="py-4 px-4 font-medium" style={{ color: 'var(--color-text-primary)' }}>
                {row.district}
              </td>

              {/* Scan Count */}
              <td className="py-4 px-4 text-center font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                {row.current || 0}
              </td>

              {/* Demand Badge (reusing risk-badge styles) */}
              <td className="py-4 px-4 text-center">
                <span className={`risk-badge ${getRiskClass(row.risk)}`}>
                  {row.risk || 'NORMAL'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {(!data || data.length === 0) && (
        <div className="py-8 text-center text-sm" style={{ color: 'var(--color-text-dimmed)' }}>
          No scan data available for this period.
        </div>
      )}
    </div>
  )
}

export default RiskTable