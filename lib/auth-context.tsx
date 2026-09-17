'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface User {
  id: string
  name: string
  email: string
  role: 'owner' | 'customer'
}

interface AuthContextType {
  user: User | null
  isOwner: boolean
  login: (email: string, role?: 'owner' | 'customer') => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'artemarco_auth_user'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Error loading auth from localStorage', e)
    }
  }, [])

  function login(email: string, role: 'owner' | 'customer' = 'customer'): boolean {
    const isOwnerRole = role === 'owner' || email.toLowerCase().includes('admin') || email.toLowerCase().includes('dueño')
    const newUser: User = {
      id: isOwnerRole ? 'owner-1' : `cust-${Date.now()}`,
      name: isOwnerRole ? 'Maestro Enmarcador (Dueño)' : email.split('@')[0],
      email,
      role: isOwnerRole ? 'owner' : 'customer',
    }
    setUser(newUser)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
    } catch (e) {
      console.error('Error saving auth to localStorage', e)
    }
    return true
  }

  function logout() {
    setUser(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error('Error removing auth from localStorage', e)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isOwner: user?.role === 'owner',
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
