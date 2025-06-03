"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, Star } from "lucide-react"
import { api } from "@/lib/api"
import { useAuth } from "@/app/context/auth-context"

export function GameInfo({ gameId }: { gameId: number }) {
  const { user } = useAuth()
  const [white, setWhite] = useState<{ name: string; elo: number } | null>(null)
  const [black, setBlack] = useState<{ name: string; elo: number } | null>(null)

  useEffect(() => {
    if (!gameId) return
    api.getGameById(gameId).then((game) => {
      if (game?.whitePlayer && game?.blackPlayer) {
        setWhite({ name: game.whitePlayer.name, elo: game.whitePlayer.elo })
        setBlack({ name: game.blackPlayer.name, elo: game.blackPlayer.elo })
      }
    })
  }, [gameId])

  const isUserWhite = white?.name === user?.name
  const me = isUserWhite ? white : black
  const opponent = isUserWhite ? black : white

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Opponent */}
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-gray-600 text-white">
                {opponent?.name?.slice(0, 2).toUpperCase() || "OP"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-semibold">
                {opponent?.name || "Opponent"}{" "}
                <span className="text-sm text-gray-400">({isUserWhite ? "Schwarz" : "Weiß"})</span>
              </p>
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Star className="w-3 h-3" />
                <span>{opponent?.elo ?? "..."}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-300 ml-2">
              <Clock className="w-4 h-4" />
              <span className="font-mono text-lg">10:00</span>
            </div>
          </div>

          <div className="mx-4 h-10 w-px bg-gray-700"></div>

          {/* You */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-gray-300 mr-2">
              <span className="font-mono text-lg">10:00</span>
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">
                {me?.name || "You"}{" "}
                <span className="text-sm text-gray-400">({isUserWhite ? "Weiß" : "Schwarz"})</span>
              </p>
              <div className="flex items-center gap-1 text-gray-400 text-sm justify-end">
                <Star className="w-3 h-3" />
                <span>{me?.elo ?? "..."}</span>
              </div>
            </div>
            <Avatar>
              <AvatarFallback className="bg-green-600 text-white">
                {me?.name?.slice(0, 2).toUpperCase() || "YU"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}