"use client"

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/app/context/auth-context'
import { useRouter } from 'next/navigation'

export function GameInvites() {
  const { user } = useAuth()
  const router = useRouter()
  const [invites, setInvites] = useState<any[]>([])

  useEffect(() => {
    if (!user) return
    api.getGameInvites(user.id).then(setInvites)
  }, [user])

  const handleAccept = async (inviteId: number) => {
    const res = await fetch(`http://localhost:4000/game-invite/${inviteId}/accept`, {
      method: 'POST',
    })

    const data = await res.json()
    if (res.ok && data.game?.id) {
      // ✅ Redirect ins Spiel
      router.push(`/game/${data.game.id}`)
    } else {
      console.error('Fehler beim Annehmen:', data)
    }
  }

  if (!user) return null

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg space-y-3">
      <h2 className="text-lg font-bold">Einladungen ({invites.length})</h2>
      {invites.length === 0 && <p>Keine Einladungen</p>}
      {invites.map((invite) => (
        <div key={invite.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
          <span>Einladung von: <strong>{invite.sender.name}</strong></span>
          <Button onClick={() => handleAccept(invite.id)} className="bg-green-600 hover:bg-green-700">
            Annehmen
          </Button>
        </div>
      ))}
    </div>
  )
}
