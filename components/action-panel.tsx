import { Card, CardContent } from "@/components/ui/card"
import { Users, Gamepad2 } from "lucide-react"

export function ActionPanel() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-6">
          Play Chess Online
          <br />
          <span className="text-green-400">on RealChess!</span>
        </h1>
      </div>

      <div className="space-y-4">
        <Card className="bg-green-600 border-green-500 hover:bg-green-700 transition-colors cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Users className="w-8 h-8 text-white" />
              <div>
                <h3 className="text-xl font-bold text-white">Play Online</h3>
                <p className="text-green-100">Play with someone at your level</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-700 border-gray-600 hover:bg-gray-600 transition-colors cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Gamepad2 className="w-8 h-8 text-white" />
              <div>
                <h3 className="text-xl font-bold text-white">Play Locally</h3>
                <p className="text-gray-300">Play with a friend on the same device</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
