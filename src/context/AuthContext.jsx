import { createContext, useContext, useState, useCallback } from 'react'
import { authApi } from '../api/auth.js'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('mathforge_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const { data } = await authApi.login({ email, password })
      const userData = data.data
      localStorage.setItem('mathforge_token', userData.token)
      localStorage.setItem('mathforge_user', JSON.stringify(userData))
      setUser(userData)
      toast.success('Welcome back!')
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      toast.error(msg)
      return { success: false, message: msg }
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (username, email, password, displayName) => {
    setLoading(true)
    try {
      const { data } = await authApi.register({ username, email, password, displayName })
      const userData = data.data
      localStorage.setItem('mathforge_token', userData.token)
      localStorage.setItem('mathforge_user', JSON.stringify(userData))
      setUser(userData)
      toast.success('Account created! Welcome to MathForge.')
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      toast.error(msg)
      return { success: false, message: msg }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('mathforge_token')
    localStorage.removeItem('mathforge_user')
    setUser(null)
    toast.success('Logged out')
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
