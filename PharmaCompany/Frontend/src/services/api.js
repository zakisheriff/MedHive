// API base URL - update this to match your backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Generic fetch wrapper
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}

// Overview endpoints
export const getOverviewKPIs = async (filters) => {
  return fetchAPI(`/overview/kpis?${new URLSearchParams(filters)}`)
}

export const getDistrictRisks = async (filters) => {
  return fetchAPI(`/overview/district-risks?${new URLSearchParams(filters)}`)
}

export const getTopDrivers = async (filters) => {
  return fetchAPI(`/overview/drivers?${new URLSearchParams(filters)}`)
}

export const getTopLists = async (filters) => {
  return fetchAPI(`/overview/top-lists?${new URLSearchParams(filters)}`)
}

// Disease Intelligence endpoints
export const getDiseaseForecast = async (disease, region, filters) => {
  return fetchAPI(`/disease/${disease}/forecast?${new URLSearchParams({ region, ...filters })}`)
}

export const getDistrictDetails = async (districtId, filters) => {
  return fetchAPI(`/district/${districtId}/details?${new URLSearchParams(filters)}`)
}

export const getWeatherImpact = async (districtId, filters) => {
  return fetchAPI(`/district/${districtId}/weather-impact?${new URLSearchParams(filters)}`)
}

// Medicine Demand endpoints
export const getMedicineDemand = async (medicine, filters) => {
  return fetchAPI(`/medicine/${medicine}/demand?${new URLSearchParams(filters)}`)
}

export const getMedicineSummary = async (medicine, filters) => {
  return fetchAPI(`/medicine/${medicine}/summary?${new URLSearchParams(filters)}`)
}

export const exportDemandCSV = async (filters) => {
  return fetchAPI(`/medicine/export?${new URLSearchParams(filters)}`)
}

// Alerts endpoints
export const getAlerts = async (filters) => {
  return fetchAPI(`/alerts?${new URLSearchParams(filters)}`)
}

export const acknowledgeAlert = async (alertId) => {
  return fetchAPI(`/alerts/${alertId}/acknowledge`, {
    method: 'POST'
  })
}

// Reports endpoints
export const generateReport = async (reportConfig) => {
  return fetchAPI('/reports/generate', {
    method: 'POST',
    body: JSON.stringify(reportConfig)
  })
}

export default {
  getOverviewKPIs,
  getDistrictRisks,
  getTopDrivers,
  getTopLists,
  getDiseaseForecast,
  getDistrictDetails,
  getWeatherImpact,
  getMedicineDemand,
  getMedicineSummary,
  exportDemandCSV,
  getAlerts,
  acknowledgeAlert,
  generateReport
}
