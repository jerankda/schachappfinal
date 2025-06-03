'use client'

import { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { api } from '@/lib/api'
import { useAuth } from '@/app/context/auth-context'
import { useRouter } from 'next/navigation'

export function InvitePlayer() {
  const { user } = useAuth()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<any[]>([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (query.length >= 2) {
      api.getUsers().then((all) => {
        const filtered = all.filter((u: any) =>
          u.name.toLowerCase().includes(query.toLowerCase()) && u.id !== user?.id
        )
        setUsers(filtered)
      })
    } else {
      setUsers([])
    }
  }, [query])

  const invite = async (targetName: string) => {
    if (!user?.name) return
    const res = await api.sendGameInvite(user.name, targetName)
    if (res?.success || res?.message?.includes("Invite sent")) {
      setMessage('Invite sent ✅')
      setQuery('')
      setUsers([])
    } else {
      setMessage('❌ Fehler beim Senden der Einladung')
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Invite Player</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          placeholder="Search by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white"
        />
        {users.map((u) => (
          <div key={u.id} className="flex justify-between items-center p-2 bg-gray-700 rounded text-white">
            <span>{u.name}</span>
            <Button size="sm" onClick={() => invite(u.name)} className="bg-green-600 hover:bg-green-700">
              Invite
            </Button>
          </div>
        ))}
        {message && <p className="text-green-400 text-sm">{message}</p>}
      </CardContent>
    </Card>
  )
}