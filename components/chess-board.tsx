"use client"

import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

interface ChessBoardProps {
  size?: "small" | "large"
  gameId?: number
  currentUserId?: number
}

let socket: Socket

export function ChessBoard({ size = "small", gameId, currentUserId }: ChessBoardProps) {
  const [fen, setFen] = useState("")
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null)
  const [game, setGame] = useState<any>(null)

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"]
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"]

  const parseFen = (fen: string): string[][] => {
    const board = []
    const rows = fen.split(" ")[0].split("/")
    for (let row of rows) {
      const parsedRow: string[] = []
      for (let char of row) {
        if (!isNaN(Number(char))) {
          parsedRow.push(...Array(Number(char)).fill(""))
        } else {
          parsedRow.push(char)
        }
      }
      board.push(parsedRow)
    }
    return board
  }

  const board = fen ? parseFen(fen) : Array.from({ length: 8 }, () => Array(8).fill(""))

  const isWhitePlayer = game?.whitePlayer?.id === currentUserId
  const currentTurnIsWhite = fen?.split(" ")[1] === "w"
  const isMyTurn = (isWhitePlayer && currentTurnIsWhite) || (!isWhitePlayer && !currentTurnIsWhite)

  useEffect(() => {
    if (!gameId) return
    socket = io("http://localhost:4000")
    socket.emit("joinGame", gameId)

    socket.on("fenUpdate", (newFen: string) => {
      console.log("🔄 Neuer FEN:", newFen)
      setFen(newFen)
      setSelectedSquare(null)
    })

    return () => {
      socket.disconnect()
    }
  }, [gameId])

  useEffect(() => {
    if (!gameId) return
    fetch(`http://localhost:4000/games/${gameId}`)
      .then((res) => res.json())
      .then((data) => {
        setGame(data)
        if (data?.fen) setFen(data.fen)
      })
      .catch((err) => console.error("❌ Fehler beim Laden des Spiels:", err))
  }, [gameId])

  useEffect(() => {
    console.log("📃 FEN:", fen)
    console.log("👤 Weiß ID:", game?.whitePlayer?.id)
    console.log("👤 Schwarz ID:", game?.blackPlayer?.id)
    console.log("🔑 CurrentUser ID:", currentUserId)
    console.log("👀 IsWhitePlayer:", isWhitePlayer)
    console.log("🎯 CurrentTurnIsWhite:", currentTurnIsWhite)
    console.log("✅ isMyTurn:", isMyTurn)
  }, [fen, game, currentUserId])

  const makeMove = (from: string, to: string) => {
    if (!isMyTurn) return
    console.log("📤 Move senden:", from, "→", to)

    fetch(`http://localhost:4000/games/${gameId}/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, to }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.fen) {
          setFen(data.fen)
          setSelectedSquare(null)
        } else {
          console.error("❌ Fehler bei Zugausführung:", data.error)
        }
      })
      .catch((err) => console.error("❌ Fehler beim Zug senden:", err))
  }

  const canMovePiece = (piece: string) => {
    if (!piece || !isMyTurn) return false
    return isWhitePlayer ? piece === piece.toUpperCase() : piece === piece.toLowerCase()
  }

  const handleSquareClick = (row: number, col: number) => {
    console.log("🟦 Klick auf:", row, col, "Inhalt:", board[row][col])
    if (!board[row][col] && !selectedSquare) return

    if (selectedSquare === null) {
      if (!canMovePiece(board[row][col])) {
        console.log("⛔ Nicht deine Figur")
        return
      }
      setSelectedSquare([row, col])
    } else {
      const from = files[selectedSquare[1]] + ranks[selectedSquare[0]]
      const to = files[col] + ranks[row]
      makeMove(from, to)
    }
  }

  const pieceSymbols: { [key: string]: string } = {
    r: "♜", n: "♞", b: "♝", q: "♛", k: "♚", p: "♟",
    R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔", P: "♙",
  }

  const sizeConfig = {
    small: {
      boardSize: "w-96 h-96", padding: "p-4", rankHeight: "h-96", squareHeight: "h-12",
      fileWidth: "w-96", squareWidth: "w-12", pieceSize: "text-4xl",
      coordinateSize: "text-sm", coordinateSpacing: "left-1 top-4", fileSpacing: "bottom-1 left-4",
    },
    large: {
      boardSize: "w-[480px] h-[480px]", padding: "p-5", rankHeight: "h-[480px]",
      squareHeight: "h-[60px]", fileWidth: "w-[480px]", squareWidth: "w-[60px]",
      pieceSize: "text-5xl", coordinateSize: "text-base", coordinateSpacing: "left-1.5 top-5",
      fileSpacing: "bottom-1.5 left-5",
    },
  }

  const config = sizeConfig[size]

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className={`relative bg-amber-900 ${config.padding} rounded-lg shadow-2xl`}>
          <div className={`absolute ${config.coordinateSpacing} flex flex-col justify-between ${config.rankHeight} text-amber-200 font-bold ${config.coordinateSize}`}>
            {ranks.map((rank) => (
              <div key={rank} className={`${config.squareHeight} flex items-center`}>{rank}</div>
            ))}
          </div>
          <div className={`absolute ${config.fileSpacing} flex justify-between ${config.fileWidth} text-amber-200 font-bold ${config.coordinateSize}`}>
            {files.map((file) => (
              <div key={file} className={`${config.squareWidth} flex justify-center`}>{file}</div>
            ))}
          </div>
          <div className={`${config.boardSize} border-4 border-amber-800 rounded shadow-inner`}>
            <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
              {board.map((row, rowIndex) =>
                row.map((piece, colIndex) => {
                  const isLight = (rowIndex + colIndex) % 2 === 0
                  const squareColor = isLight ? "bg-amber-100" : "bg-amber-700"
                  const isSelected = selectedSquare?.[0] === rowIndex && selectedSquare?.[1] === colIndex

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`
                        ${squareColor} 
                        ${isSelected ? "ring-4 ring-yellow-400" : ""}
                        flex items-center justify-center 
                        cursor-pointer 
                        hover:bg-opacity-80 
                        transition-all duration-200
                        relative
                        group
                        aspect-square
                      `}
                      onClick={() => handleSquareClick(rowIndex, colIndex)}
                    >
                      {piece && (
                        <span
                          className={`
                            ${config.pieceSize}
                            select-none 
                            transition-transform 
                            group-hover:scale-110
                            drop-shadow-lg
                            ${piece === piece.toLowerCase() ? "text-gray-900" : "text-gray-100"}
                          `}
                          style={{ filter: "drop-shadow(1px 1px 2px rgba(0,0,0,0.5))" }}
                        >
                          {pieceSymbols[piece]}
                        </span>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}