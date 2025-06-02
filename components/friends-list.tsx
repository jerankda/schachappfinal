'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/app/context/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Star, Clock, Play, MessageCircle } from "lucide-react"

export function FriendsList() {
  const [friends, setFriends] = useState<any[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      api.getFriends(user.id).then(setFriends)
    }
  }, [user])

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span>Friends ({friends.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {friends.map((friend) => {
          const avatar = (friend.name || friend.email || '?').slice(0, 2).toUpperCase()
          const rating = friend.elo || 1000
          const lastSeen = 'now'

          return (
            <div
              key={friend.id}
              className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar>
                    <AvatarFallback className="bg-gray-600 text-white">{avatar}</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <p className="text-white font-semibold">{friend.name || friend.email}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Star className="w-3 h-3" />
                    <span>{rating}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{lastSeen}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Play className="w-3 h-3 mr-1" />
                  Play
                </Button>
                <Button size="sm" variant="outline" className="bg-gray-600 border-gray-500 text-white hover:bg-gray-500">
                  <MessageCircle className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
