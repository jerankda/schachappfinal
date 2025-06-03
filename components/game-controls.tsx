import { Button } from "@/components/ui/button"
import { Flag, Handshake, RotateCcw } from "lucide-react"

interface GameControlsProps {
  gameId: number
}

export function GameControls({ gameId }: GameControlsProps) {
  // Du kannst gameId jetzt verwenden, z. B. für API-Aufrufe oder Socket-Aktionen
  // console.log("Aktuelles Spiel:", gameId)

  return (
    <div className="flex gap-2 justify-center">
      <Button size="sm" variant="outline" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
        <Handshake className="w-4 h-4 mr-1" />
        Draw
      </Button>
      <Button size="sm" variant="outline" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
        <Flag className="w-4 h-4 mr-1" />
        Resign
      </Button>
      <Button size="sm" variant="outline" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
        <RotateCcw className="w-4 h-4 mr-1" />
        Takeback
      </Button>
    </div>
  )
}