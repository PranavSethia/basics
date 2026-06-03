import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/layout.css'

const NAV = [
  { to: '/',            icon: '▦',  label: 'Dashboard'   },
  { to: '/employees',   icon: '👥', label: 'Employees'   },
  { to: '/departments', icon: '🏢', label: 'Departments' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">⚡</span>
        <span className="brand-name">EMS</span>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="user-details">
            <span className="user-name">{user?.name}</span>
            <span className="user-email">{user?.email}</span>
          </div>
        </div>
        <button className="logout-btn" onClick={logout} title="Logout">⏻</button>
      </div>
    </aside>
  )
}
