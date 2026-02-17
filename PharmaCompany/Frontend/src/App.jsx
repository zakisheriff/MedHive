import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './app/layout/DashboardLayout'
import Overview from './app/routes/Overview'
import DiseaseIntelligence from './app/routes/DiseaseIntelligence'
import MedicineDemand from './app/routes/MedicineDemand'
import Alerts from './app/routes/Alerts'
import Reports from './app/routes/Reports'
import { LoginPage } from './auth/LoginPage'
import { RegistrationFlow } from './auth/RegistrationFlow'

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationFlow />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard/overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="disease-intelligence" element={<DiseaseIntelligence />} />
          <Route path="medicine-demand" element={<MedicineDemand />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* Default redirect to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
