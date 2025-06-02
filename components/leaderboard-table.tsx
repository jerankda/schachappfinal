'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Trophy, Medal, Award } from "lucide-react"

export function LeaderboardTable() {
  const [players, setPlayers] = useState<any[]>([])

  useEffect(() => {
    api.getUsers().then((users) => {
      const sorted = users
        .filter((u) => u.elo != null)
        .sort((a, b) => b.elo - a.elo)
        .map((u, i) => ({
          rank: i + 1,
          name: u.name || u.email,
          rating: u.elo,
          gamesPlayed: 0, // Platzhalter für später
          wins: 0,
          losses: 0,
          avatar: (u.name || u.email || '?').slice(0, 2).toUpperCase(),
        }))
      setPlayers(sorted)
    })
  }, [])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return <span className="text-gray-400 font-bold">#{rank}</span>
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      const colors = {
        1: "bg-yellow-500 text-yellow-900",
        2: "bg-gray-400 text-gray-900",
        3: "bg-amber-600 text-amber-900",
      }
      return colors[rank as keyof typeof colors]
    }
    return "bg-gray-700 text-gray-300"
  }

  const getWinRate = (wins: number, losses: number) => {
    const total = wins + losses
    if (total === 0) return 0
    return Math.round((wins / total) * 100)
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Top Players
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-96 overflow-y-auto">
          <div className="space-y-3 p-6">
            {players.map((player) => (
              <div
                key={player.rank}
                className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                  player.rank <= 3 ? "bg-gray-700 border border-gray-600" : "bg-gray-750 hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8">{getRankIcon(player.rank)}</div>

                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gray-600 text-white text-sm">{player.avatar}</AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold">{player.name}</p>
                      {player.rank <= 3 && <Badge className={getRankBadge(player.rank)}>Top {player.rank}</Badge>}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        <span>{player.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{player.gamesPlayed} games</span>
                      <span>•</span>
                      <span>{getWinRate(player.wins, player.losses)}% win rate</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-white font-bold text-lg">{player.rating}</div>
                  <div className="text-sm text-gray-400">
                    {player.wins}W - {player.losses}L
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
