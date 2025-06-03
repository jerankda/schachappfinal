"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/auth-context"
import { ChessBoard } from "@/components/chess-board"
import { GameControls } from "@/components/game-controls"
import { GameInfo } from "@/components/game-info"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function PlayPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [opponentName, setOpponentName] = useState("")
  const [status, setStatus] = useState("")

  const handleInvite = async () => {
    if (!user) return
    const res = await api.sendGameInvite(user.name, opponentName)

    if (res.error) {
      toast.error(res.error)
      setStatus("Invitation failed.")
    } else {
      toast.success("Invitation sent!")
      setStatus("Waiting for opponent to accept...")
    }
  }

  const checkGameStatus = async () => {
    if (!user) return
    const invites = await api.getGameInvites(user.id)
    const accepted = invites.find(inv => inv.game?.id)
    if (accepted) {
      router.push(`/game/${accepted.game.id}`)
    } else {
      toast.message("Noch keine Annahme", { description: "Der Gegner hat noch nicht reagiert." })
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Oben: Spielinfo und Einladung */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">
              {user ? `You are logged in as ${user.name}` : "Not logged in"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 items-center">
              <Input
                value={opponentName}
                onChange={(e) => setOpponentName(e.target.value)}
                placeholder="Enter opponent's username"
                className="bg-gray-700 text-white border-gray-600"
              />
              <Button onClick={handleInvite} className="bg-green-600 hover:bg-green-700">
                Invite
              </Button>
              <Button onClick={checkGameStatus} className="bg-blue-600 hover:bg-blue-700">
                Spielstatus prüfen
              </Button>
            </div>
            {status && <p className="text-gray-300">{status}</p>}
          </CardContent>
        </Card>

        <GameInfo />
        <GameControls />

        <div className="flex justify-center">
          <ChessBoard size="large" />
        </div>
      </div>
    </div>
  )
}