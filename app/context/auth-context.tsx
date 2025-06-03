"use client"

import { createContext, useContext, useEffect, useState } from "react"

type User = {
  id: number
  name: string
  email: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => ({ success: false }),
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch (err) {
        console.error("❌ Fehler beim Parsen des Users:", err)
        localStorage.removeItem("user")
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        return { success: false, message: data.error || "Login fehlgeschlagen" }
      }

      setUser(data)
      localStorage.setItem("user", JSON.stringify(data))
      return { success: true }
    } catch (err) {
      console.error("❌ Serverfehler beim Login:", err)
      return { success: false, message: "Serverfehler" }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}