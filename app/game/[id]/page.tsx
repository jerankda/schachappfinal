"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ChessBoard } from "@/components/chess-board"
import { GameControls } from "@/components/game-controls"
import { GameInfo } from "@/components/game-info"
import { api } from "@/lib/api"

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const [gameExists, setGameExists] = useState<boolean | null>(null)

  const gameIdParam = params.id
  const gameId = typeof gameIdParam === "string" ? parseInt(gameIdParam) : parseInt(gameIdParam[0])

  useEffect(() => {
    if (!gameId || isNaN(gameId)) {
      setGameExists(false)
      return
    }

    // Prüfen, ob Spiel existiert
    api.getGameById(gameId).then((res) => {
      if (res && !res.error) {
        setGameExists(true)
      } else {
        setGameExists(false)
      }
    })
  }, [gameId])

  if (gameExists === false) {
    return (
      <div className="min-h-screen bg-gray-900 p-4 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Spiel nicht gefunden ❌</h1>
          <p>Bitte überprüfe die URL oder starte ein neues Spiel.</p>
        </div>
      </div>
    )
  }

  if (gameExists === null) {
    return (
      <div className="min-h-screen bg-gray-900 p-4 text-white flex items-center justify-center">
        <p>Lade Spiel...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white">
      <div className="max-w-6xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Game #{gameId}</h1>

        <GameInfo gameId={gameId} />
        <GameControls gameId={gameId} />

        <div className="flex justify-center">
          <ChessBoard gameId={gameId} size="large" />
        </div>
      </div>
    </div>
  )
}
