'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: 'ADMIN' | 'USER'
  createdAt: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, role: 'ADMIN' | 'USER') => Promise<void>
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>
  logout: () => void
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch (err) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string, role: 'ADMIN' | 'USER') => {
    setLoading(true)
    setError(null)
    try {
      const mockUser: User = {
        id: '1',
        name: email.split('@')[0],
        email,
        role,
        createdAt: new Date().toISOString(),
      }

      const mockToken = 'mock-token-' + Date.now()

      if (role === 'ADMIN') {
        localStorage.setItem('adminToken', mockToken)
        localStorage.setItem('adminUser', JSON.stringify(mockUser))
        localStorage.setItem('adminRole', role)
        document.cookie = `adminToken=${mockToken}; path=/; max-age=86400`
        document.cookie = `adminRole=${role}; path=/; max-age=86400`
      } else {
        setUser(mockUser)
        setToken(mockToken)
        localStorage.setItem('token', mockToken)
        localStorage.setItem('user', JSON.stringify(mockUser))
        localStorage.setItem('userRole', role)
        document.cookie = `token=${mockToken}; path=/; max-age=86400`
        document.cookie = `userRole=${role}; path=/; max-age=86400`
        document.cookie = `userEmail=${email}; path=/; max-age=86400`
      }

      if (role === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push('/user/dashboard')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ) => {
    setLoading(true)
    setError(null)
    try {
      const mockUser: User = {
        id: Date.now().toString(),
        name,
        email,
        phone,
        role: 'USER',
        createdAt: new Date().toISOString(),
      }

      const mockToken = 'mock-token-' + Date.now()

      setUser(mockUser)
      setToken(mockToken)
      localStorage.setItem('token', mockToken)
      localStorage.setItem('user', JSON.stringify(mockUser))
      localStorage.setItem('userRole', 'USER')

      document.cookie = `token=${mockToken}; path=/; max-age=86400`
      document.cookie = `userRole=USER; path=/; max-age=86400`
      document.cookie = `userEmail=${email}; path=/; max-age=86400`

      router.push('/user/dashboard')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
    
    document.cookie = 'token=; path=/; max-age=0'
    document.cookie = 'userRole=; path=/; max-age=0'
    document.cookie = 'userEmail=; path=/; max-age=0'
    
    router.push('/')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
