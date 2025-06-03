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
  const [game, setGame] = useState<any>(null)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  const gameIdParam = params.id
  const gameId = typeof gameIdParam === "string" ? parseInt(gameIdParam) : parseInt(gameIdParam[0])

  useEffect(() => {
    if (!gameId || isNaN(gameId)) {
      setGameExists(false)
      return
    }

    api.getGameById(gameId).then((res) => {
      if (res && !res.error) {
        setGame(res)
        setGameExists(true)
      } else {
        setGameExists(false)
      }
    })

    // Aktuellen User aus localStorage lesen
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        console.log("📦 Aktueller Nutzer aus localStorage:", parsed)
        if (parsed?.id) setCurrentUserId(parsed.id)
        else setCurrentUserId(-1)
      } catch (err) {
        console.error("❌ Fehler beim Parsen von localStorage:", err)
        setCurrentUserId(-1)
      }
    } else {
      console.warn("⚠️ Kein currentUser im localStorage gefunden")
      setCurrentUserId(-1)
    }
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

  if (gameExists === null || !game) {
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

        {/* Spieleranzeige mit Weiß/Schwarz */}
        <div className="flex justify-between items-center px-4 py-2 bg-gray-800 rounded text-white font-medium">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">(Weiß)</span>
            <span className="font-bold">{game?.whitePlayer?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">{game?.blackPlayer?.name}</span>
            <span className="text-sm text-gray-400">(Schwarz)</span>
          </div>
        </div>

        <GameInfo gameId={gameId} />
        <GameControls gameId={gameId} />

        <div className="flex justify-center">
          <ChessBoard
            gameId={gameId}
            currentUserId={currentUserId ?? -1}
            size="large"
          />
        </div>
      </div>
    </div>
  )
}