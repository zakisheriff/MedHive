import { useOutletContext } from 'react-router-dom'
import { useState } from 'react'
import { Clock, TrendingUp } from 'lucide-react'
import InsightCard from '../../components/cards/InsightCard'
import RiskTable from '../../components/tables/RiskTable'
import LineTrendChart from '../../components/charts/LineTrendChart'
import DateFilter from '../../components/filters/DateFilter'
import DiseaseSelector from '../../components/filters/DiseaseSelector'
import RegionSelector from '../../components/filters/RegionSelector'
import { useDiseaseForecast } from '../../hooks/useDiseaseForecast'
import { timeAgo } from '../../utils/formatters'

const DiseaseIntelligence = () => {
  const { globalFilters, onFilterChange } = useOutletContext()
  const { forecast, districts, selectedDistrict, loading, selectDistrict } = useDiseaseForecast(
    globalFilters.disease,
    globalFilters.region,
    globalFilters
  )

  const handleRowClick = (row) => {
    selectDistrict(row.id)
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
      {/* Global Filters */}
      <div className="flex items-center gap-6 justify-center mb-2">
        <DateFilter 
          value={globalFilters.dateRange} 
          onChange={(value) => onFilterChange({ dateRange: value })} 
        />
        <DiseaseSelector 
          value={globalFilters.disease} 
          onChange={(value) => onFilterChange({ disease: value })} 
        />
        <RegionSelector 
          value={globalFilters.region} 
          onChange={(value) => onFilterChange({ region: value })} 
        />
      </div>

      {/* Forecast Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              {forecast?.disease} Forecast
            </h1>
            <div className="flex items-center gap-6 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              <div>
                <span className="font-medium">Horizon:</span> {forecast?.horizon}
              </div>
              <div>
                <span className="font-medium">Confidence:</span>{' '}
                <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>{forecast?.confidence}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{timeAgo(forecast?.lastUpdate)}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md" style={{ backgroundColor: 'rgba(220, 163, 73, 0.1)', color: 'var(--color-primary)', borderRadius: 'var(--border-radius-sm)' }}>
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">Active Forecast</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: District Risk Table */}
        <div>
          <InsightCard title="District Forecast">
            <RiskTable data={districts} onRowClick={handleRowClick} />
          </InsightCard>
        </div>

        {/* Right: District Detail Panel */}
        <div>
          {selectedDistrict ? (
            <div className="space-y-6">
              {/* Trend Chart */}
              <InsightCard title={`${selectedDistrict.name} - Trend & Forecast`}>
                <LineTrendChart data={selectedDistrict.trendData} showForecast={true} />
              </InsightCard>

              {/* Weather Impact Summary */}
              <InsightCard title="Weather Impact Summary">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'var(--color-text-dimmed)' }}>Rainfall</p>
                    <p className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      {selectedDistrict.weatherImpact.rainfall.value}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-dimmed)' }}>{selectedDistrict.weatherImpact.rainfall.period}</p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'var(--color-text-dimmed)' }}>Humidity</p>
                    <p className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      {selectedDistrict.weatherImpact.humidity.value}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-dimmed)' }}>{selectedDistrict.weatherImpact.humidity.period}</p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'var(--color-text-dimmed)' }}>Temperature</p>
                    <p className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      {selectedDistrict.weatherImpact.temperature.value}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-dimmed)' }}>{selectedDistrict.weatherImpact.temperature.period}</p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'var(--color-text-dimmed)' }}>Wind</p>
                    <p className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      {selectedDistrict.weatherImpact.wind.value}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-dimmed)' }}>{selectedDistrict.weatherImpact.wind.period}</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                  <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>Lag Effect</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{selectedDistrict.weatherImpact.lagEffect}</p>
                </div>
              </InsightCard>

              {/* Key Notes */}
              <InsightCard title="Key Notes">
                <ul className="space-y-2">
                  {selectedDistrict.keyNotes.map((note, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-1" style={{ color: 'var(--color-primary)' }}>•</span>
                      <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{note}</span>
                    </li>
                  ))}
                </ul>
              </InsightCard>
            </div>
          ) : (
            <div className="card p-12">
              <div className="text-center" style={{ color: 'var(--color-text-dimmed)' }}>
                <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">Select a district</p>
                <p className="text-sm mt-2">Click on any district in the table to view detailed forecast and drivers</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DiseaseIntelligence
