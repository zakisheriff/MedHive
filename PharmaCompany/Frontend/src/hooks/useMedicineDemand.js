import { useState, useEffect } from 'react'
import { getMedicineDemand, getMedicineSummary } from '../services/api'

export const useMedicineDemand = (medicine, filters) => {
  const [data, setData] = useState({
    summary: null,
    demandByDistrict: [],
    breakdown: [],
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }))
        
        // Mock data
        const mockData = {
          summary: {
            totalDemand: 45600,
            highestDemandDistrict: 'Colombo',
            demandGrowth: 21.4
          },
          demandByDistrict: [
            { 
              district: 'Colombo', 
              diseaseDriver: 'Dengue', 
              projectedPatients: 190, 
              projectedUnits: '2280 tabs',
              changePercent: 21 
            },
            { 
              district: 'Gampaha', 
              diseaseDriver: 'Dengue', 
              projectedPatients: 158, 
              projectedUnits: '1896 tabs',
              changePercent: 18 
            },
            { 
              district: 'Kandy', 
              diseaseDriver: 'Dengue', 
              projectedPatients: 102, 
              projectedUnits: '1224 tabs',
              changePercent: 15 
            },
            { 
              district: 'Galle', 
              diseaseDriver: 'Leptospirosis', 
              projectedPatients: 68, 
              projectedUnits: '816 tabs',
              changePercent: -5 
            }
          ],
          breakdown: [
            { name: 'Dengue', value: 62 },
            { name: 'Leptospirosis', value: 24 },
            { name: 'Food Poisoning', value: 14 }
          ]
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
  }, [medicine, filters])

  return data
}
