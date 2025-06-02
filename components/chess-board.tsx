"use client"

import { useEffect, useState } from "react"

interface ChessBoardProps {
  size?: "small" | "large"
  gameId?: string
}

export function ChessBoard({ size = "small", gameId }: ChessBoardProps) {
  const [fen, setFen] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!gameId) return

    setLoading(true)
    fetch(`http://localhost:4000/games/${gameId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.fen) {
          setFen(data.fen)
        }
      })
      .catch((err) => console.error("Fehler beim Laden des Spiels:", err))
      .finally(() => setLoading(false))
  }, [gameId])

  const initialBoard = [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ]

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

  const board = fen ? parseFen(fen) : initialBoard

  const pieceSymbols: { [key: string]: string } = {
    r: "♜",
    n: "♞",
    b: "♝",
    q: "♛",
    k: "♚",
    p: "♟",
    R: "♖",
    N: "♘",
    B: "♗",
    Q: "♕",
    K: "♔",
    P: "♙",
  }

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"]
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"]

  const sizeConfig = {
    small: {
      boardSize: "w-96 h-96",
      padding: "p-4",
      rankHeight: "h-96",
      squareHeight: "h-12",
      fileWidth: "w-96",
      squareWidth: "w-12",
      pieceSize: "text-4xl",
      coordinateSize: "text-sm",
      coordinateSpacing: "left-1 top-4",
      fileSpacing: "bottom-1 left-4",
    },
    large: {
      boardSize: "w-[480px] h-[480px]",
      padding: "p-5",
      rankHeight: "h-[480px]",
      squareHeight: "h-[60px]",
      fileWidth: "w-[480px]",
      squareWidth: "w-[60px]",
      pieceSize: "text-5xl",
      coordinateSize: "text-base",
      coordinateSpacing: "left-1.5 top-5",
      fileSpacing: "bottom-1.5 left-5",
    },
  }

  const config = sizeConfig[size]

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className={`relative bg-amber-900 ${config.padding} rounded-lg shadow-2xl`}>
          {/* Rank numbers */}
          <div
            className={`absolute ${config.coordinateSpacing} flex flex-col justify-between ${config.rankHeight} text-amber-200 font-bold ${config.coordinateSize}`}
          >
            {ranks.map((rank) => (
              <div key={rank} className={`${config.squareHeight} flex items-center`}>
                {rank}
              </div>
            ))}
          </div>

          {/* File letters */}
          <div
            className={`absolute ${config.fileSpacing} flex justify-between ${config.fileWidth} text-amber-200 font-bold ${config.coordinateSize}`}
          >
            {files.map((file) => (
              <div key={file} className={`${config.squareWidth} flex justify-center`}>
                {file}
              </div>
            ))}
          </div>

          {/* Board */}
          <div className={`${config.boardSize} border-4 border-amber-800 rounded shadow-inner`}>
            <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
              {board.map((row, rowIndex) =>
                row.map((piece, colIndex) => {
                  const isLight = (rowIndex + colIndex) % 2 === 0
                  const squareColor = isLight ? "bg-amber-100" : "bg-amber-700"

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`
                        ${squareColor} 
                        flex items-center justify-center 
                        cursor-pointer 
                        hover:bg-opacity-80 
                        transition-all duration-200
                        relative
                        group
                        aspect-square
                      `}
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
                          style={{
                            filter: "drop-shadow(1px 1px 2px rgba(0,0,0,0.5))",
                          }}
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
