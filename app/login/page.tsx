"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { login, user } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async () => {
    const result = await login(email, password)

    if (!result.success) {
      setError(result.message || "Login fehlgeschlagen")
    }
    // ❌ Kein result.user mehr notwendig!
  }

  useEffect(() => {
    if (user) {
      // user ist automatisch gesetzt durch den Context
      localStorage.setItem("currentUser", JSON.stringify(user))
      router.push("/")
    }
  }, [user])

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
          <Input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button onClick={handleLogin} className="w-full bg-green-600 hover:bg-green-700">
            Log In
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}