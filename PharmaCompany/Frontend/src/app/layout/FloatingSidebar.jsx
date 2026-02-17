import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Activity, Pill, Bell, FileText } from 'lucide-react'
import { useState, useEffect } from 'react'

const FloatingSidebar = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { to: '/dashboard/overview', icon: LayoutDashboard, label: 'Overview' },
    { to: '/dashboard/disease-intelligence', icon: Activity, label: 'Disease Intelligence' },
    { to: '/dashboard/medicine-demand', icon: Pill, label: 'Medicine Demand' },
    { to: '/dashboard/alerts', icon: Bell, label: 'Alerts' },
    { to: '/dashboard/reports', icon: FileText, label: 'Reports' },
  ]

  return (
    <>
      <aside 
        className="fixed z-50 transition-all duration-500 ease-out"
        style={{
          left: '24px',
          top: '50%',
          transform: mounted ? 'translateY(-50%)' : 'translate(-100px, -50%)',
          opacity: mounted ? 1 : 0,
        }}
      >
        <div 
          className="flex flex-col gap-3 p-3 backdrop-blur-sm"
          style={{
            backgroundColor: 'var(--color-bg-dark)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--border-radius-full)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06), 0 0 1px rgba(0, 0, 0, 0.08)',
          }}
        >
          {navItems.map((item, index) => (
            <NavButton key={item.to} item={item} index={index} mounted={mounted} />
          ))}
        </div>
      </aside>

      <style>{`
        .floating-nav-button {
          display: block;
          position: relative;
          text-decoration: none;
        }

        .floating-nav-button-inner {
          will-change: transform;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .floating-nav-button:hover .floating-nav-button-inner {
          transform: scale(1.05);
        }

        .floating-nav-button:active .floating-nav-button-inner {
          transform: scale(0.98);
          transition-duration: 0.1s;
        }

        .floating-nav-button:hover .floating-nav-button-inner {
          background-color: rgba(220, 163, 73, 0.08) !important;
          box-shadow: 0 4px 12px rgba(220, 163, 73, 0.12) !important;
        }

        .floating-nav-button:hover svg {
          color: var(--color-primary) !important;
        }

        .floating-nav-button.active .floating-nav-button-inner {
          background-color: rgba(220, 163, 73, 0.12) !important;
          box-shadow: 0 2px 8px rgba(220, 163, 73, 0.15) !important;
        }

        .floating-nav-button.active svg {
          color: var(--color-primary) !important;
          stroke-width: 2.5 !important;
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  )
}

const NavButton = ({ item, index, mounted }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <NavLink
      to={item.to}
      className={({ isActive }) => 
        `floating-nav-button ${isActive ? 'active' : ''}`
      }
      title={item.label}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animation: mounted ? `fadeInScale 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s both` : 'none',
      }}
    >
      {({ isActive }) => (
        <div 
          className="floating-nav-button-inner w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: isActive 
              ? 'rgba(220, 163, 73, 0.12)' 
              : 'rgba(0, 0, 0, 0.03)',
            boxShadow: isActive 
              ? '0 2px 8px rgba(220, 163, 73, 0.15)' 
              : '0 1px 3px rgba(0, 0, 0, 0.04)',
          }}
        >
          <item.icon 
            className="transition-colors duration-200"
            size={20}
            style={{
              color: isActive 
                ? 'var(--color-primary)' 
                : 'var(--color-text-dimmed)',
              strokeWidth: isActive ? 2.5 : 2,
            }}
          />
        </div>
      )}
    </NavLink>
  )
}

export default FloatingSidebar
