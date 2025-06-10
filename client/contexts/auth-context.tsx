"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { loginUser, registerUser } from "@/lib/api"

interface User {
  id: string
  name: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("auth")
    if (stored) {
      const parsed = JSON.parse(stored)
      setUser(parsed.user)
      setToken(parsed.token)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const res = await loginUser(email, password)
    setUser(res.user)
    setToken(res.token)
    localStorage.setItem("auth", JSON.stringify(res))
  }

  const register = async (name: string, email: string, password: string) => {
    const res = await registerUser(name, email, password)
    setUser(res.user)
    setToken(res.token)
    localStorage.setItem("auth", JSON.stringify(res))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("auth")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
