import { useOutletContext } from 'react-router-dom'
import { Activity, TrendingUp, AlertTriangle, Package } from 'lucide-react'
import KpiCard from '../../components/cards/KpiCard'
import InsightCard from '../../components/cards/InsightCard'
import RiskTable from '../../components/tables/RiskTable'
import { useOverview } from '../../hooks/useOverview'
import { formatNumber } from '../../utils/formatters'

const Overview = () => {
  const { globalFilters } = useOutletContext()
  const { kpis, districtRisks, drivers, topLists, loading } = useOverview(globalFilters)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div style={{ color: 'var(--color-text-dimmed)' }}>Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>Overview</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          What's happening right now, and where should we act?
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Cases (This Week)"
          value={kpis?.totalCases.value || 0}
          change={kpis?.totalCases.change || 0}
          data={kpis?.totalCases.sparkline}
          icon={Activity}
        />
        <KpiCard
          title="Predicted Cases (Next 2 Weeks)"
          value={kpis?.predictedCases.value || 0}
          change={kpis?.predictedCases.change || 0}
          data={kpis?.predictedCases.sparkline}
          icon={TrendingUp}
        />
        <KpiCard
          title="High-Risk Districts"
          value={kpis?.highRiskDistricts.value || 0}
          change={kpis?.highRiskDistricts.change || 0}
          data={kpis?.highRiskDistricts.sparkline}
          icon={AlertTriangle}
        />
        <KpiCard
          title="Projected Medicine Demand (Units)"
          value={kpis?.medicineDemand.value || 0}
          change={kpis?.medicineDemand.change || 0}
          data={kpis?.medicineDemand.sparkline}
          icon={Package}
        />
      </div>

      {/* National Risk Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* District Heat List */}
        <div className="lg:col-span-2">
          <InsightCard title="District Risk List">
            <RiskTable data={districtRisks} />
          </InsightCard>
        </div>

        {/* Top Drivers Panel */}
        <div>
          <InsightCard title="Top Drivers">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Rainfall Anomaly</span>
                  <span className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>{drivers?.rainfall.value}</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--color-text-dimmed)' }}>{drivers?.rainfall.period}</p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Humidity</span>
                  <span className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>{drivers?.humidity.value}</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--color-text-dimmed)' }}>{drivers?.humidity.period}</p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Trend</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>{drivers?.trend}</span>
                </div>
              </div>
              
              <div className="pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Model Confidence</span>
                  <span className="text-lg font-semibold" style={{ color: 'var(--color-primary)' }}>{drivers?.confidence}</span>
                </div>
              </div>
            </div>
          </InsightCard>
        </div>
      </div>

      {/* Top Lists */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Rising Diseases */}
        <InsightCard title="Top 5 Rising Diseases">
          <div className="space-y-3">
            {topLists?.risingDiseases.map((disease, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text-dimmed)' }}>#{index + 1}</span>
                  <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{disease.name}</span>
                </div>
                <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>+{disease.change}%</span>
              </div>
            ))}
          </div>
        </InsightCard>

        {/* Top High-Risk Districts */}
        <InsightCard title="Top 5 High-Risk Districts">
          <div className="space-y-3">
            {topLists?.highRiskDistricts.map((district, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text-dimmed)' }}>#{index + 1}</span>
                  <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{district.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 rounded-full h-2" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${(district.score / 10) * 100}%`,
                        backgroundColor: 'var(--color-primary)'
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold w-8" style={{ color: 'var(--color-text-primary)' }}>{district.score}</span>
                </div>
              </div>
            ))}
          </div>
        </InsightCard>

        {/* Top Medicines Needed */}
        <InsightCard title="Top 5 Medicines Likely Needed">
          <div className="space-y-3">
            {topLists?.medicinesNeeded.map((medicine, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text-dimmed)' }}>#{index + 1}</span>
                  <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{medicine.name}</span>
                </div>
                <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>{medicine.units}</span>
              </div>
            ))}
          </div>
        </InsightCard>
      </div>
    </div>
  )
}

export default Overview
