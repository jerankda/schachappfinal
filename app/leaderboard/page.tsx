import { LeaderboardTable } from "@/components/leaderboard-table"

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Leaderboard</h1>
          <p className="text-gray-400">Top players ranked by ELO rating</p>
        </div>

        <LeaderboardTable />
      </div>
    </div>
  )
}
