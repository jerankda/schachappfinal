const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export const api = {
  async getUsers() {
    const res = await fetch(`${API_BASE_URL}/users`)
    return res.json()
  },

  async getUser(id: number) {
    const res = await fetch(`${API_BASE_URL}/users/${id}`)
    return res.json()
  },

  async sendFriendRequest(senderId: number, receiverId: number) {
    const res = await fetch(`${API_BASE_URL}/friend-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId, receiverId }),
    })
    return res.json()
  },

  async getFriends(userId: number) {
    const res = await fetch(`${API_BASE_URL}/friends/${userId}`)
    return res.json()
  },

  async getFriendRequests(userId: number) {
    // ✅ FIXED endpoint here
    const res = await fetch(`${API_BASE_URL}/friends/requests/${userId}`)
    return res.json()
  },

  async acceptFriendRequest(requestId: number) {
    const res = await fetch(`${API_BASE_URL}/friend-request/${requestId}/accept`, {
      method: 'POST',
    })
    return res.json()
  },

  async declineFriendRequest(requestId: number) {
    const res = await fetch(`${API_BASE_URL}/friend-request/${requestId}/decline`, {
      method: 'POST',
    })
    return res.json()
  },

  async createGame(whitePlayerId: number, blackPlayerId: number) {
    const res = await fetch(`${API_BASE_URL}/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ whitePlayerId, blackPlayerId }),
    })
    return res.json()
  },

  async sendGameInvite(senderName: string, receiverName: string) {
    const res = await fetch(`${API_BASE_URL}/game-invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderName, receiverName }),
    })
    return res.json()
  },

  async getGameById(gameId: number) {
    try {
      const res = await fetch(`${API_BASE_URL}/games/${gameId}`)
      if (!res.ok) throw new Error("Fehler beim Abrufen des Spiels")
      return res.json()
    } catch (err) {
      console.error("❌ API getGameById Fehler:", err)
      return null
    }
  },

  async getGameInvites(userId: number) {
    const res = await fetch(`${API_BASE_URL}/game-invites/${userId}`)
    return res.json()
  }
}