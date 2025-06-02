"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Star, UserCheck, UserX } from "lucide-react"
import { api } from "@/lib/api"
import { useAuth } from "@/app/context/auth-context"

export function FriendRequests() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const loadRequests = async () => {
    if (!user) return
    const data = await api.getFriendRequests(user.id)
    setRequests(data)
  }

  const accept = async (id: number) => {
    setLoading(true)
    await api.acceptFriendRequest(id)
    await loadRequests()
    setLoading(false)
  }

  const decline = async (id: number) => {
    setLoading(true)
    await api.declineFriendRequest(id)
    await loadRequests()
    setLoading(false)
  }

  useEffect(() => {
    if (user) loadRequests()
  }, [user])

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <UserCheck className="w-5 h-5" />
          Friend Requests ({requests.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {requests.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No pending friend requests</p>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-gray-600 text-white">
                    {(request.sender.name || request.sender.email).substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white font-semibold">{request.sender.name || request.sender.email}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Star className="w-3 h-3" />
                    <span>{request.sender.elo ?? 1200}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => accept(request.id)}
                  disabled={loading}
                >
                  <UserCheck className="w-3 h-3 mr-1" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-gray-600 border-gray-500 text-white hover:bg-gray-500"
                  onClick={() => decline(request.id)}
                  disabled={loading}
                >
                  <UserX className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
