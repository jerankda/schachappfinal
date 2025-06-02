"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UserPlus, Search } from "lucide-react"
import { useAuth } from "@/app/context/auth-context"

export function AddFriend() {
  const { user } = useAuth()
  const [search, setSearch] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAddFriend = async () => {
    setMessage("")
    setLoading(true)

    try {
      const resUser = await fetch(`http://localhost:4000/users`)
      const users = await resUser.json()

      const receiver = users.find((u: any) => u.name.toLowerCase() === search.toLowerCase())

      if (!receiver) {
        setMessage("User not found ❌")
        setLoading(false)
        return
      }

      const res = await fetch(`http://localhost:4000/friend-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: user?.id,
          receiverId: receiver.id,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setMessage("Request sent ✅")
      } else {
        setMessage(data.error || "Something went wrong")
      }
    } catch (err) {
      console.error(err)
      setMessage("Server error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Add Friend
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
          <Button
            onClick={handleAddFriend}
            disabled={!search || loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? "Sending..." : "Send"}
          </Button>
        </div>
        {message && <p className="text-sm text-gray-300">{message}</p>}
      </CardContent>
    </Card>
  )
}
