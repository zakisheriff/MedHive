import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Settings, User, ChevronDown, UserCircle, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import DateFilter from '../../components/filters/DateFilter'
import DiseaseSelector from '../../components/filters/DiseaseSelector'
import RegionSelector from '../../components/filters/RegionSelector'
import logo from '../../assets/images/logo.svg'

const Topbar = ({ filters, onFilterChange }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef(null)
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
    setIsProfileOpen(false)
  }

  const handleProfile = () => {
    // Add navigate to profile logic here
    console.log('Navigating to profile...')
    setIsProfileOpen(false)
  }

  return (
    <header className="h-16 bg-white border-b fixed top-0 right-0 left-0 z-10" style={{ borderColor: 'var(--color-border)' }}>
      <div className="h-full flex items-center justify-between">
        {/* Left: Logo and Brand */}
        <div className="flex items-center gap-3 px-6">
          <img src={logo} alt="MedHive Pharma Logo" className="w-8 h-8" />
          <h1 className="text-xl font-semibold">
            <span style={{ color: 'var(--color-text-primary)' }}>MedHive</span>
            {' '}
            <span style={{ color: 'var(--color-primary)' }}>Pharma</span>
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="flex-1"></div>
        <div className="flex items-center gap-3">
          {/* Alerts */}
          <button className="relative p-2 rounded-md hover:bg-opacity-5 transition-colors" style={{ backgroundColor: 'transparent' }}>
            <Bell className="w-5 h-5" style={{ color: 'var(--color-text-dimmed)' }} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }}></span>
          </button>

          {/* Settings */}
          <button className="p-2 rounded-md hover:bg-opacity-5 transition-colors" style={{ backgroundColor: 'transparent' }}>
            <Settings className="w-5 h-5" style={{ color: 'var(--color-text-dimmed)' }} />
          </button>

          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 pl-3 border-l hover:opacity-80 transition-opacity cursor-pointer" 
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(220, 163, 73, 0.12)' }}>
                <User className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
              </div>
              <ChevronDown 
                className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} 
                style={{ color: 'var(--color-text-dimmed)' }} 
              />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-white shadow-lg border overflow-hidden"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <button
                  onClick={handleProfile}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-opacity-5 transition-colors text-left"
                  style={{ backgroundColor: 'transparent' }}
                >
                  <UserCircle className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                  <span style={{ color: 'var(--color-text-primary)' }}>Profile</span>
                </button>
                <div className="border-t" style={{ borderColor: 'var(--color-border)' }}></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-opacity-5 transition-colors text-left"
                  style={{ backgroundColor: 'transparent' }}
                >
                  <LogOut className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                  <span style={{ color: 'var(--color-text-primary)' }}>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar
