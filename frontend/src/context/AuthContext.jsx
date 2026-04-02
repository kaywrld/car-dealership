import { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext(null)

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export function AuthProvider({ children }) {
  const [dealer, setDealer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('ae_dealer')
    if (stored) setDealer(JSON.parse(stored))
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Invalid credentials')
    }

    localStorage.setItem('ae_token',  data.token)
    localStorage.setItem('ae_dealer', JSON.stringify(data.dealer))
    setDealer(data.dealer)
  }

  const logout = () => {
    localStorage.removeItem('ae_token')
    localStorage.removeItem('ae_dealer')
    setDealer(null)
  }

  return (
    <AuthContext.Provider value={{ dealer, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}