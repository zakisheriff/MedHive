import { useOutletContext } from 'react-router-dom'
import { Activity, AlertTriangle } from 'lucide-react'
import KpiCard from '../../components/cards/KpiCard'
import InsightCard from '../../components/cards/InsightCard'
import RiskTable from '../../components/tables/RiskTable'
import { useOverview } from '../../hooks/useOverview'

const Overview = () => {
  const { globalFilters } = useOutletContext()
  const { kpis, districtRisks, topLists, loading } = useOverview(globalFilters)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div style={{ color: 'var(--color-text-dimmed)' }}>Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>Overview</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Real-time diagnostics and priority actions.
        </p>
      </div>

      {/* 2. KPI Row - Set to 2 columns so they fill the width */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KpiCard
          title="Total Scans (This Week)"
          value={kpis?.totalCases.value || 0}
          change={kpis?.totalCases.change || 0}
          data={kpis?.totalCases.sparkline}
          icon={Activity}
        />
        <KpiCard
          title="High-Risk Districts"
          value={kpis?.highRiskDistricts.value || 0}
          change={kpis?.highRiskDistricts.change || 0}
          data={kpis?.highRiskDistricts.sparkline}
          icon={AlertTriangle}
        />
      </div>

      {/* 3. Main Content Row - Split 2/3 and 1/3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Risk Table (Fills 2/3 of the row) */}
        <div className="lg:col-span-2">
          <InsightCard title="District Risk Analysis">
            <div className="min-h-[350px]">
              <RiskTable data={districtRisks} />
            </div>
          </InsightCard>
        </div>

        {/* Right: Top Medicines (Fills 1/3 of the row) */}
        <div className="lg:col-span-1">
          <InsightCard title="Top 5 Medicines Needed">
            <div className="space-y-5 pt-2">
              {topLists?.medicinesNeeded.map((medicine, index) => (
                <div key={index} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded text-slate-500">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                      {medicine.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
                      {medicine.units}
                    </span>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400">Units</p>
                  </div>
                </div>
              ))}
            </div>
          </InsightCard>
        </div>

      </div>
    </div>
  )
}

export default Overview