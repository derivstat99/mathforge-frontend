import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import {
  Sigma, LayoutDashboard, Grid2x2, FunctionSquare,
  BarChart3, ImageUp, History, LogOut, ChevronRight
} from 'lucide-react'
import clsx from 'clsx'

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/dashboard/linear-algebra', icon: Grid2x2, label: 'Linear Algebra' },
  { to: '/dashboard/calculus', icon: FunctionSquare, label: 'Calculus' },
  { to: '/dashboard/statistics', icon: BarChart3, label: 'Statistics' },
  { to: '/dashboard/image', icon: ImageUp, label: 'Image Parser' },
  { to: '/dashboard/history', icon: History, label: 'History' },
]

export default function AppLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-forge-bg">
      <aside className="w-60 shrink-0 bg-forge-surface border-r border-forge-border flex flex-col">
        <div className="px-5 py-6 border-b border-forge-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-forge-accent/20 border border-forge-accent/30 flex items-center justify-center shrink-0">
              <Sigma className="text-forge-accent" size={18} />
            </div>
            <span className="text-xl text-forge-text" style={{ fontFamily: 'DM Serif Display, serif' }}>MathForge</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150',
                  isActive
                    ? 'bg-forge-accent/15 text-forge-accent border border-forge-accent/25'
                    : 'text-forge-text-dim hover:text-forge-text hover:bg-forge-muted/30'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={16} className={isActive ? 'text-forge-accent' : ''} />
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight size={12} className="text-forge-accent" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-forge-border">
          <div className="px-3 py-2 mb-2">
            <p className="text-forge-text text-sm font-medium truncate">
              {user?.displayName || user?.username}
            </p>
            <p className="text-forge-text-dim text-xs truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-forge-text-dim hover:text-red-400 hover:bg-red-400/10 transition-all duration-150"
          >
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
