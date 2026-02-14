import { useState, useEffect } from 'react'
import { getDiseaseForecast, getDistrictDetails, getWeatherImpact } from '../services/api'

export const useDiseaseForecast = (disease, region, filters) => {
  const [data, setData] = useState({
    forecast: null,
    districts: [],
    selectedDistrict: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }))
        
        // Mock data for demonstration
        const mockData = {
          forecast: {
            disease: 'Dengue',
            horizon: 'Next 2 weeks',
            confidence: '0.78',
            lastUpdate: new Date().toISOString()
          },
          districts: [
            { 
              id: 1,
              district: 'Colombo', 
              current: 184, 
              predWeek1: 238, 
              predWeek2: 261, 
              risk: 'HIGH', 
              confidence: '0.82',
              drivers: [
                { type: 'rain', label: 'Rain', trend: 'up' },
                { type: 'humidity', label: 'Humidity', trend: 'up' },
                { type: 'trend', label: 'Trend', trend: 'up' }
              ]
            },
            { 
              id: 2,
              district: 'Gampaha', 
              current: 156, 
              predWeek1: 189, 
              predWeek2: 194, 
              risk: 'MODERATE', 
              confidence: '0.76',
              drivers: [
                { type: 'temp', label: 'Temp', trend: 'up' }
              ]
            },
            { 
              id: 3,
              district: 'Kandy', 
              current: 98, 
              predWeek1: 124, 
              predWeek2: 142, 
              risk: 'MODERATE', 
              confidence: '0.71',
              drivers: [
                { type: 'rain', label: 'Rain', trend: 'up' }
              ]
            }
          ]
        }
        
        setData({
          ...mockData,
          selectedDistrict: null,
          loading: false,
          error: null
        })
      } catch (error) {
        setData(prev => ({ ...prev, loading: false, error: error.message }))
      }
    }

    fetchData()
  }, [disease, region, filters])

  const selectDistrict = async (districtId) => {
    try {
      // Mock district details
      const mockDistrictDetails = {
        id: districtId,
        name: 'Colombo',
        trendData: generateTrendData(),
        weatherImpact: {
          rainfall: { value: '+32%', period: 'Last 2 weeks' },
          humidity: { value: '84%', period: 'Average' },
          temperature: { value: '28°C', period: 'Average' },
          wind: { value: '12 km/h', period: 'Average' },
          lagEffect: 'Risk rising due to rainfall spike two weeks ago'
        },
        keyNotes: [
          'Risk rising due to rainfall spike two weeks ago',
          'Humidity levels consistently above 80%',
          'Temperature favorable for mosquito breeding'
        ]
      }
      
      setData(prev => ({
        ...prev,
        selectedDistrict: mockDistrictDetails
      }))
    } catch (error) {
      console.error('Failed to load district details:', error)
    }
  }

  return { ...data, selectDistrict }
}

// Helper to generate trend data
function generateTrendData() {
  const weeks = 14 // 12 weeks historical + 2 weeks forecast
  return Array.from({ length: weeks }, (_, i) => {
    const isForecast = i >= 12
    return {
      week: `W${i + 1}`,
      actual: isForecast ? null : Math.floor(Math.random() * 100) + 100,
      forecast: isForecast ? Math.floor(Math.random() * 100) + 150 : null,
      forecastUpper: isForecast ? Math.floor(Math.random() * 50) + 200 : null,
      forecastLower: isForecast ? Math.floor(Math.random() * 50) + 100 : null
    }
  })
}
