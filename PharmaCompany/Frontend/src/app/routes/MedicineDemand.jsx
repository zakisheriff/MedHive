import { useOutletContext } from 'react-router-dom'
import { useState } from 'react'
import { Package, TrendingUp, MapPin } from 'lucide-react'
import KpiCard from '../../components/cards/KpiCard'
import InsightCard from '../../components/cards/InsightCard'
import DemandTable from '../../components/tables/DemandTable'
import BarBreakdown from '../../components/charts/BarBreakdown'
import { useMedicineDemand } from '../../hooks/useMedicineDemand'
import { formatNumber } from '../../utils/formatters'

const MedicineDemand = () => {
  const { globalFilters } = useOutletContext()
  const [selectedMedicine, setSelectedMedicine] = useState('paracetamol')
  const { summary, demandByDistrict, breakdown, loading } = useMedicineDemand(
    selectedMedicine,
    globalFilters
  )

  const handleExport = () => {
    console.log('Exporting demand data...')
    // In production, this would trigger CSV download
    alert('CSV export functionality would be triggered here')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div style={{ color: 'var(--color-text-dimmed)' }}>Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>Medicine Demand</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          How much stock should we push, and where?
        </p>
      </div>

      {/* Medicine Selector + Summary */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              Select Medicine
            </label>
            <select
              value={selectedMedicine}
              onChange={(e) => setSelectedMedicine(e.target.value)}
              className="px-4 py-2 bg-white border rounded-md text-sm focus:outline-none focus:ring-1 cursor-pointer min-w-[200px] transition-all"
              style={{ 
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)',
                borderRadius: 'var(--border-radius-sm)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-border-accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            >
              <option value="all">All Medicines</option>
              <option value="paracetamol">Paracetamol</option>
              <option value="ors">ORS</option>
              <option value="amoxicillin">Amoxicillin</option>
              <option value="chloroquine">Chloroquine</option>
              <option value="doxycycline">Doxycycline</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm mb-1" style={{ color: 'var(--color-text-muted)' }}>Total Projected Demand (2 weeks)</p>
            <p className="text-3xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {formatNumber(summary?.totalDemand || 0)}
            </p>
          </div>
          <div>
            <p className="text-sm mb-1" style={{ color: 'var(--color-text-muted)' }}>Highest Demand District</p>
            <p className="text-3xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>{summary?.highestDemandDistrict}</p>
          </div>
          <div>
            <p className="text-sm mb-1" style={{ color: 'var(--color-text-muted)' }}>Demand Growth</p>
            <p className="text-3xl font-semibold" style={{ color: 'var(--color-primary)' }}>
              +{summary?.demandGrowth}%
            </p>
          </div>
        </div>
      </div>

      {/* Demand by District Table */}
      <InsightCard>
        <DemandTable data={demandByDistrict} onExport={handleExport} />
      </InsightCard>

      {/* Demand Explanation */}
      <InsightCard title="Demand Breakdown by Disease">
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
          Understanding which diseases are driving medicine demand helps optimize stock allocation.
        </p>
        <BarBreakdown data={breakdown} />
      </InsightCard>
    </div>
  )
}

export default MedicineDemand
