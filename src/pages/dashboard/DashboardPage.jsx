import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { userApi } from '../../api/user.js'
import { Grid2x2, FunctionSquare, BarChart3, History, ImageUp } from 'lucide-react'
import { Link } from 'react-router-dom'

const MODULE_CARDS = [
  {
    to: '/dashboard/linear-algebra',
    icon: Grid2x2,
    title: 'Linear Algebra',
    desc: 'Matrix ops, eigenvalues, decompositions, dynamic sizing',
    borderColor: 'rgba(168,85,247,0.2)',
    iconColor: '#c084fc',
  },
  {
    to: '/dashboard/calculus',
    icon: FunctionSquare,
    title: 'Calculus I',
    desc: 'Differentiation, integration, series and sequences',
    borderColor: 'rgba(59,130,246,0.2)',
    iconColor: '#60a5fa',
  },
  {
    to: '/dashboard/statistics',
    icon: BarChart3,
    title: 'Statistics',
    desc: 'Distributions, regression, hypothesis testing, graphs',
    borderColor: 'rgba(16,185,129,0.2)',
    iconColor: '#34d399',
  },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    userApi.getProfile().then((res) => setProfile(res.data.data)).catch(() => {})
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl mb-1" style={{ fontFamily: 'DM Serif Display, serif', color: '#e2e0ff' }}>
          {greeting}, {user?.displayName || user?.username}
        </h1>
        <p style={{ color: '#8884aa', fontSize: '14px' }}>What would you like to compute today?</p>
      </div>

      {profile && (
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total calculations', value: profile.totalCalculations },
            { label: 'Saved graphs', value: profile.savedGraphs },
            { label: 'Member since', value: new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) },
          ].map(({ label, value }) => (
            <div key={label} className="forge-card">
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#8884aa' }}>{label}</p>
              <p className="text-2xl" style={{ fontFamily: 'DM Serif Display, serif', color: '#e2e0ff' }}>{value}</p>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs uppercase tracking-wider mb-4" style={{ color: '#8884aa' }}>Modules</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {MODULE_CARDS.map(({ to, icon: Icon, title, desc, borderColor, iconColor }) => (
          <Link
            key={to}
            to={to}
            className="forge-card hover:scale-[1.02] transition-all duration-200 block"
            style={{ borderColor }}
          >
            <Icon style={{ color: iconColor, marginBottom: '12px' }} size={22} />
            <h3 className="font-medium mb-1" style={{ color: '#e2e0ff' }}>{title}</h3>
            <p className="text-xs leading-relaxed" style={{ color: '#8884aa' }}>{desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link to="/dashboard/image" className="forge-card hover:scale-[1.02] transition-all duration-200 flex items-start gap-4 block">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <ImageUp style={{ color: '#fbbf24' }} size={18} />
          </div>
          <div>
            <h3 className="font-medium mb-1" style={{ color: '#e2e0ff' }}>Image Parser</h3>
            <p className="text-xs leading-relaxed" style={{ color: '#8884aa' }}>Upload a photo of any math problem — AI reads and formulates it automatically</p>
          </div>
        </Link>

        <Link to="/dashboard/history" className="forge-card hover:scale-[1.02] transition-all duration-200 flex items-start gap-4 block">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.25)' }}>
            <History style={{ color: '#6c63ff' }} size={18} />
          </div>
          <div>
            <h3 className="font-medium mb-1" style={{ color: '#e2e0ff' }}>History</h3>
            <p className="text-xs leading-relaxed" style={{ color: '#8884aa' }}>Review past calculations, re-run, and access saved graphs</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
