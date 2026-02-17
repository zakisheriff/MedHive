import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Activity, Pill, Bell, FileText } from 'lucide-react'
import logo from '../../assets/images/logo.svg'

const Sidebar = () => {
  const navItems = [
    { to: '/dashboard/overview', icon: LayoutDashboard, label: 'Overview' },
    { to: '/dashboard/disease-intelligence', icon: Activity, label: 'Disease Intelligence' },
    { to: '/dashboard/medicine-demand', icon: Pill, label: 'Medicine Demand' },
    { to: '/dashboard/alerts', icon: Bell, label: 'Alerts' },
    { to: '/dashboard/reports', icon: FileText, label: 'Reports / Downloads' },
  ]

  return (
    <aside className="w-64 bg-white border-r h-screen fixed left-0 top-0 flex flex-col" style={{ borderColor: 'var(--color-border)' }}>
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b gap-3" style={{ borderColor: 'var(--color-border)' }}>
        <img src={logo} alt="MedHive Pharma Logo" className="w-8 h-8" />
        <h1 className="text-xl font-semibold">
          <span style={{ color: 'var(--color-text-primary)' }}>MedHive</span>
          {' '}
          <span style={{ color: 'var(--color-primary)' }}>Pharma</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-opacity-10'
                  : 'hover:bg-opacity-5'
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'rgba(220, 163, 73, 0.08)' : 'transparent',
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)'
            })}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
