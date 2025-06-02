'use client'

import { ChessBoard } from "@/components/chess-board"
import { ActionPanel } from "@/components/action-panel"
import { GameInvites } from "@/components/game-invites"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex">
        <div className="flex-1 grid lg:grid-cols-2 gap-8 p-6">
          <div className="flex items-center justify-center">
            <ChessBoard size="small" />
          </div>
          <div className="space-y-6">
            <ActionPanel />
            
            {/* 👇 Klein gehaltene Game-Invites-Anzeige */}
            <div className="bg-gray-800 border border-gray-700 rounded p-4 text-sm text-white">
              <GameInvites />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
