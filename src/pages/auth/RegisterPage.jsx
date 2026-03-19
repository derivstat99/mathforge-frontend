import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { Eye, EyeOff, Sigma } from 'lucide-react'

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', displayName: '' })
  const [showPassword, setShowPassword] = useState(false)
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await register(form.username, form.email, form.password, form.displayName)
    if (result.success) navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ backgroundColor: '#0a0a0f' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ backgroundColor: 'rgba(108,99,255,0.2)', border: '1px solid rgba(108,99,255,0.3)' }}>
            <Sigma style={{ color: '#6c63ff' }} size={28} />
          </div>
          <h1 className="text-4xl mb-2" style={{ fontFamily: 'DM Serif Display, serif', color: '#e2e0ff' }}>MathForge</h1>
          <p style={{ color: '#8884aa', fontSize: '14px' }}>Create your account</p>
        </div>

        <div className="forge-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="forge-label">Username</label>
                <input name="username" className="forge-input" placeholder="mathwiz" value={form.username} onChange={handleChange} required minLength={3} />
              </div>
              <div>
                <label className="forge-label">Display Name</label>
                <input name="displayName" className="forge-input" placeholder="Optional" value={form.displayName} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="forge-label">Email</label>
              <input name="email" type="email" className="forge-input" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>

            <div>
              <label className="forge-label">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="forge-input"
                  style={{ paddingRight: '44px' }}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
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

            <button type="submit" className="forge-btn-primary mt-2" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: '#8884aa' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#6c63ff' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
