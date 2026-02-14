import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AlertCard from '../../components/alerts/AlertCard'

const Alerts = () => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    severity: 'all',
    type: 'all'
  })

  // Mock alerts data
  const alerts = [
    {
      id: 1,
      severity: 'CRITICAL',
      type: 'Disease surge',
      title: 'CRITICAL Dengue risk: Colombo',
      reason: 'Rainfall anomaly +32%, cases rising for 4 consecutive weeks',
      forecast: 'Expected +29% increase next week',
      action: 'Increase Paracetamol + ORS stock by 30%',
      districtId: 1
    },
    {
      id: 2,
      severity: 'HIGH',
      type: 'Climate risk',
      title: 'HIGH Climate risk: Gampaha',
      reason: 'Heavy rainfall recorded, humidity levels above 85%',
      forecast: 'Disease outbreak likely within 2 weeks',
      action: 'Pre-position emergency medicine stock',
      districtId: 2
    },
    {
      id: 3,
      severity: 'MODERATE',
      type: 'Medicine demand',
      title: 'MODERATE Medicine shortage risk: Kandy',
      reason: 'Current stock below projected 2-week demand',
      forecast: 'Stockout possible by next week',
      action: 'Initiate stock transfer from Central Province',
      districtId: 3
    }
  ]

  const handleAcknowledge = (alertId) => {
    console.log('Acknowledging alert:', alertId)
    // In production, this would call the API
    alert(`Alert ${alertId} acknowledged`)
  }

  const handleViewDistrict = (districtId) => {
    navigate('/disease-intelligence')
    // In production, this would also select the district
  }

  const filteredAlerts = alerts.filter(alert => {
    if (filters.severity !== 'all' && alert.severity.toLowerCase() !== filters.severity) {
      return false
    }
    if (filters.type !== 'all' && alert.type.toLowerCase() !== filters.type.toLowerCase()) {
      return false
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>Alerts</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Tell me only what matters
        </p>
      </div>

      {/* Alert Filters */}
      <div className="card p-6">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              Severity
            </label>
            <select
              value={filters.severity}
              onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
              className="px-4 py-2 bg-white border rounded-md text-sm focus:outline-none focus:ring-1 cursor-pointer transition-all"
              style={{ 
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)',
                borderRadius: 'var(--border-radius-sm)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-border-accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="moderate">Moderate</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-4 py-2 bg-white border rounded-md text-sm focus:outline-none focus:ring-1 cursor-pointer transition-all"
              style={{ 
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)',
                borderRadius: 'var(--border-radius-sm)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-border-accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            >
              <option value="all">All Types</option>
              <option value="disease surge">Disease Surge</option>
              <option value="climate risk">Climate Risk</option>
              <option value="medicine demand">Medicine Demand</option>
            </select>
          </div>

          <div className="ml-auto">
            <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>&nbsp;</p>
            <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
              {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={handleAcknowledge}
              onViewDistrict={handleViewDistrict}
            />
          ))
        ) : (
          <div className="card p-12 text-center">
            <p style={{ color: 'var(--color-text-dimmed)' }}>No alerts matching the current filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Alerts
