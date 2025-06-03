const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { Chess } = require('chess.js')
const bcrypt = require('bcrypt')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const prisma = new PrismaClient()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

console.log("Backend vollständig geladen ✅")

io.on('connection', (socket) => {
  console.log('✅ Client verbunden:', socket.id)

  socket.on('joinGame', (gameId) => {
    socket.join(`game-${gameId}`)
    console.log(`🎮 Client ist Game ${gameId} beigetreten`)
  })
})

app.post('/register', async (req, res) => {
  const { email, name, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email und Passwort erforderlich' })

  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ error: 'E-Mail bereits vergeben' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, name, password: hashedPassword },
    })

    res.status(201).json({ id: user.id, email: user.email, name: user.name })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Registrierung fehlgeschlagen' })
  }
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email und Passwort erforderlich' })

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: 'Ungültige Zugangsdaten' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ error: 'Ungültige Zugangsdaten' })

    res.json({ id: user.id, email: user.email, name: user.name })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Login fehlgeschlagen' })
  }
})

app.get('/', (req, res) => {
  res.send('API läuft ✅')
})

app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Abrufen der Nutzer' })
  }
})

app.get('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id)
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return res.status(404).json({ error: 'User nicht gefunden' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Abrufen des Nutzers' })
  }
})
app.post('/friend-request', async (req, res) => {
  const { senderId, receiverId } = req.body
  try {
    const existing = await prisma.friendRequest.findFirst({
      where: { senderId, receiverId, status: 'pending' },
    })
    if (existing) return res.status(400).json({ error: 'Anfrage bereits vorhanden' })

    const request = await prisma.friendRequest.create({
      data: { senderId, receiverId, status: 'pending' },
    })

    res.status(201).json(request)
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Erstellen der Anfrage' })
  }
})

app.get('/friends/:id', async (req, res) => {
  const userId = parseInt(req.params.id)
  try {
    const sent = await prisma.friendRequest.findMany({
      where: { senderId: userId, status: 'accepted' },
      include: { receiver: true },
    })
    const received = await prisma.friendRequest.findMany({
      where: { receiverId: userId, status: 'accepted' },
      include: { sender: true },
    })
    const friends = [...sent.map(r => r.receiver), ...received.map(r => r.sender)]
    res.json(friends)
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Abrufen der Freunde' })
  }
})

app.get('/friends/requests/:id', async (req, res) => {
  const userId = parseInt(req.params.id)
  try {
    const requests = await prisma.friendRequest.findMany({
      where: { receiverId: userId, status: 'pending' },
      include: { sender: true },
    })
    res.json(requests)
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Abrufen der Anfragen' })
  }
})

app.post('/friend-request/:id/accept', async (req, res) => {
  const requestId = parseInt(req.params.id)
  try {
    const updated = await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'accepted' },
    })
    res.json({ message: 'Anfrage akzeptiert ✅', request: updated })
  } catch (err) {
    res.status(404).json({ error: 'Anfrage nicht gefunden' })
  }
})

app.post('/friend-request/:id/decline', async (req, res) => {
  const requestId = parseInt(req.params.id)
  try {
    const updated = await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'declined' },
    })
    res.json({ message: 'Anfrage abgelehnt ❌', request: updated })
  } catch (err) {
    res.status(404).json({ error: 'Anfrage nicht gefunden' })
  }
})

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

app.post('/games', async (req, res) => {
  const { whitePlayerId, blackPlayerId } = req.body
  try {
    const game = await prisma.game.create({
      data: { whitePlayerId, blackPlayerId, fen: START_FEN },
    })
    res.status(201).json(game)
  } catch (err) {
    res.status(400).json({ error: 'Fehler beim Erstellen des Spiels' })
  }
})

app.get('/games/:id', async (req, res) => {
  const gameId = parseInt(req.params.id)
  try {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        whitePlayer: true,
        blackPlayer: true,
        moves: { orderBy: { createdAt: 'asc' } },
      },
    })

    if (!game) return res.status(404).json({ error: 'Spiel nicht gefunden' })

    res.json(game)
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Laden des Spiels' })
  }
})

app.post('/games/:id/move', async (req, res) => {
  const gameId = parseInt(req.params.id)
  const { from, to } = req.body

  try {
    const game = await prisma.game.findUnique({ where: { id: gameId } })
    if (!game || game.isFinished) {
      return res.status(400).json({ error: 'Ungültiges oder beendetes Spiel' })
    }

    const chess = new Chess()
    chess.load(game.fen)
    console.log("Aktueller FEN vor load:", game.fen)

    console.log("Versuchter Zug:", from, "→", to)
    console.log("FEN vor Zug:", game.fen)

    const result = chess.move({ from, to }, { sloppy: true })
    if (!result) {
      console.log("❌ Illegaler Zug:", { from, to })
      return res.status(400).json({ error: 'Illegaler Zug' })
    }

    await prisma.move.create({ data: { gameId, move: `${from}-${to}`, fen: chess.fen() } })
    const updated = await prisma.game.update({
      where: { id: gameId },
      data: { fen: chess.fen() },
    })

    io.to(`game-${gameId}`).emit('moveMade', {
      fen: updated.fen,
      move: `${from}-${to}`,
    })

    res.json({ message: 'Zug gespeichert ✅', fen: updated.fen, move: `${from}-${to}` })
  } catch (err) {
    console.error("Fehler beim Speichern des Zugs:", err)
    res.status(500).json({ error: 'Fehler beim Speichern des Zugs' })
  }
})
app.post('/games/:id/finish', async (req, res) => {
  const gameId = parseInt(req.params.id)
  const { winnerId } = req.body
  try {
    const game = await prisma.game.findUnique({ where: { id: gameId } })
    if (!game || game.isFinished) return res.status(400).json({ error: 'Ungültiges Spiel' })

    const white = await prisma.user.findUnique({ where: { id: game.whitePlayerId } })
    const black = await prisma.user.findUnique({ where: { id: game.blackPlayerId } })

    if (!white || !black) {
      return res.status(404).json({ error: 'Einer der Spieler wurde nicht gefunden.' })
    }

    const winner = winnerId === white.id ? white : black
    const loser = winnerId === white.id ? black : white

    const expected = 1 / (1 + 10 ** ((loser.elo - winner.elo) / 400))
    const change = Math.round(32 * (1 - expected))

    await prisma.user.update({ where: { id: winner.id }, data: { elo: winner.elo + change } })
    await prisma.user.update({ where: { id: loser.id }, data: { elo: loser.elo - change } })

    const updated = await prisma.game.update({
      where: { id: gameId },
      data: { winnerId, isFinished: true },
    })

    res.json({ message: 'Spiel beendet', updated, winnerElo: winner.elo + change, loserElo: loser.elo - change })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Fehler beim Beenden des Spiels' })
  }
})

// 🎯 Game Invites
app.post('/game-invite', async (req, res) => {
  const { senderName, receiverName } = req.body

  try {
    const sender = await prisma.user.findUnique({ where: { name: senderName } })
    const receiver = await prisma.user.findUnique({ where: { name: receiverName } })

    if (!sender || !receiver) {
      return res.status(404).json({ error: 'Sender oder Empfänger nicht gefunden' })
    }

    const invite = await prisma.gameInvite.create({
      data: {
        senderId: sender.id,
        receiverId: receiver.id,
        status: 'pending',
      },
    })

    res.status(201).json(invite)
  } catch (err) {
    console.error("❌ Fehler beim Invite:", err)
    res.status(500).json({ error: 'Fehler beim Senden der Einladung' })
  }
})

app.get('/game-invites/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId)

  try {
    const invites = await prisma.gameInvite.findMany({
      where: {
        receiverId: userId,
        status: 'pending',
      },
      include: { sender: true },
    })
    res.json(invites)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Fehler beim Abrufen der Einladungen' })
  }
})

app.post('/game-invite/:id/accept', async (req, res) => {
  const inviteId = parseInt(req.params.id)

  try {
    const invite = await prisma.gameInvite.findUnique({ where: { id: inviteId } });
    if (!invite || invite.status !== 'pending') {
      return res.status(400).json({ error: 'Ungültige oder bereits bearbeitete Einladung' });
    }

    await prisma.gameInvite.update({
      where: { id: inviteId },
      data: { status: 'accepted' },
    })

    const game = await prisma.game.create({
      data: {
        whitePlayerId: invite.receiverId,
        blackPlayerId: invite.senderId,
        fen: START_FEN,
      },
    })

    res.json({ message: 'Spiel gestartet', game })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Fehler beim Annehmen der Einladung' })
  }
})

app.post('/game-invite/:id/decline', async (req, res) => {
  const inviteId = parseInt(req.params.id)

  try {
    const invite = await prisma.gameInvite.findUnique({ where: { id: inviteId } });
    if (!invite || invite.status !== 'pending') {
      return res.status(400).json({ error: 'Ungültige oder bereits bearbeitete Einladung' });
    }

    const declinedInvite = await prisma.gameInvite.update({
      where: { id: inviteId },
      data: { status: 'declined' },
    });

    res.json({ message: 'Einladung abgelehnt', invite: declinedInvite });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fehler beim Ablehnen der Einladung' });
  }
})

// 🚀 Server starten
server.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`)
})