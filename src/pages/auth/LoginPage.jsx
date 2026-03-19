import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { Eye, EyeOff, Sigma } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(email, password)
    if (result.success) navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0a0a0f' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ backgroundColor: 'rgba(108,99,255,0.2)', border: '1px solid rgba(108,99,255,0.3)' }}>
            <Sigma style={{ color: '#6c63ff' }} size={28} />
          </div>
          <h1 className="text-4xl mb-2" style={{ fontFamily: 'DM Serif Display, serif', color: '#e2e0ff' }}>MathForge</h1>
          <p style={{ color: '#8884aa', fontSize: '14px' }}>Sign in to your workspace</p>
        </div>

        <div className="forge-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="forge-label">Email</label>
              <input
                type="email"
                className="forge-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div>
              <label className="forge-label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="forge-input"
                  style={{ paddingRight: '44px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#8884aa' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="forge-btn-primary" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: '#8884aa' }}>
            No account?{' '}
            <Link to="/register" style={{ color: '#6c63ff' }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
