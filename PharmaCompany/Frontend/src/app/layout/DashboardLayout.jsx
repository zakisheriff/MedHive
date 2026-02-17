import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import FloatingSidebar from './FloatingSidebar'
import Topbar from './Topbar'

const DashboardLayout = () => {
  const [globalFilters, setGlobalFilters] = useState({
    dateRange: 'last_4_weeks',
    disease: 'dengue',
    region: 'all'
  })

  const handleFilterChange = (newFilters) => {
    setGlobalFilters(prev => ({ ...prev, ...newFilters }))
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-dark-secondary)' }}>
      <FloatingSidebar />
      <Topbar filters={globalFilters} onFilterChange={handleFilterChange} />
      
      <main className="pt-16" style={{ paddingLeft: '120px' }}>
        <div className="p-6">
          <Outlet context={{ globalFilters, onFilterChange: handleFilterChange }} />
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout
