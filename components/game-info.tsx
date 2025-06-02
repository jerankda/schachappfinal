import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, Star } from "lucide-react"

export function GameInfo() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Opponent Info */}
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-gray-600 text-white">OP</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-semibold">Opponent</p>
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Star className="w-3 h-3" />
                <span>1200</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-300 ml-2">
              <Clock className="w-4 h-4" />
              <span className="font-mono text-lg">10:00</span>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-4 h-10 w-px bg-gray-700"></div>

          {/* Your Info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-gray-300 mr-2">
              <span className="font-mono text-lg">10:00</span>
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">You</p>
              <div className="flex items-center gap-1 text-gray-400 text-sm justify-end">
                <Star className="w-3 h-3" />
                <span>1150</span>
              </div>
            </div>
            <Avatar>
              <AvatarFallback className="bg-green-600 text-white">YU</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
