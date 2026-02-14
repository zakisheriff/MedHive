import { useState, useEffect } from 'react'
import { getOverviewKPIs, getDistrictRisks, getTopDrivers, getTopLists } from '../services/api'

export const useOverview = (filters) => {
  const [data, setData] = useState({
    kpis: null,
    districtRisks: [],
    drivers: null,
    topLists: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }))
        
        // In production, these would be real API calls
        // For now, using mock data
        const mockData = {
          kpis: {
            totalCases: { value: 1842, change: 12.3, sparkline: generateSparkline() },
            predictedCases: { value: 2156, change: 17.1, sparkline: generateSparkline() },
            highRiskDistricts: { value: 8, change: 2.5, sparkline: generateSparkline() },
            medicineDemand: { value: 45600, change: 21.4, sparkline: generateSparkline() }
          },
          districtRisks: [
            { district: 'Colombo', current: 184, predWeek1: 238, predWeek2: 261, risk: 'HIGH', confidence: '0.82', drivers: [{ type: 'rain', label: 'Rain', trend: 'up' }, { type: 'humidity', label: 'Humidity', trend: 'up' }] },
            { district: 'Gampaha', current: 156, predWeek1: 189, predWeek2: 194, risk: 'MODERATE', confidence: '0.76', drivers: [{ type: 'temp', label: 'Temp', trend: 'up' }] },
            { district: 'Kandy', current: 98, predWeek1: 124, predWeek2: 142, risk: 'MODERATE', confidence: '0.71', drivers: [{ type: 'rain', label: 'Rain', trend: 'up' }] },
            { district: 'Galle', current: 72, predWeek1: 68, predWeek2: 64, risk: 'LOW', confidence: '0.68', drivers: [] },
            { district: 'Jaffna', current: 45, predWeek1: 52, predWeek2: 58, risk: 'LOW', confidence: '0.65', drivers: [] },
          ],
          drivers: {
            rainfall: { value: '+32%', period: '2-week lag' },
            humidity: { value: '84%', period: 'average' },
            trend: '4-week rising',
            confidence: '0.78'
          },
          topLists: {
            risingDiseases: [
              { name: 'Dengue', change: 32.4 },
              { name: 'Leptospirosis', change: 21.8 },
              { name: 'Food Poisoning', change: 15.2 },
              { name: 'Typhoid', change: 12.1 },
              { name: 'Chickenpox', change: 8.7 }
            ],
            highRiskDistricts: [
              { name: 'Colombo', score: 8.9 },
              { name: 'Gampaha', score: 7.2 },
              { name: 'Kalutara', score: 6.8 },
              { name: 'Kandy', score: 6.5 },
              { name: 'Kurunegala', score: 5.9 }
            ],
            medicinesNeeded: [
              { name: 'Paracetamol', units: '12.4K' },
              { name: 'ORS', units: '8.9K' },
              { name: 'Amoxicillin', units: '6.2K' },
              { name: 'Chloroquine', units: '4.8K' },
              { name: 'Doxycycline', units: '3.5K' }
            ]
          }
        }
        
        setData({
          ...mockData,
          loading: false,
          error: null
        })
      } catch (error) {
        setData(prev => ({ ...prev, loading: false, error: error.message }))
      }
    }

    fetchData()
  }, [filters])

  return data
}

// Helper function to generate sparkline data
function generateSparkline() {
  return Array.from({ length: 12 }, (_, i) => ({
    value: Math.floor(Math.random() * 100) + 50
  }))
}
