"use client"
import { Button } from "@/components/ui/button"
import { Play, Home, Users, Crown, Trophy } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/app/context/auth-context"

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const getNavItems = () => {
    if (pathname === "/social") {
      return [
        { icon: Home, label: "Home", href: "/" },
        { icon: Play, label: "Play", href: "/play" },
        { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
      ]
    } else if (pathname === "/play") {
      return [
        { icon: Home, label: "Home", href: "/" },
        { icon: Users, label: "Social", href: "/social" },
        { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
      ]
    } else if (pathname === "/leaderboard") {
      return [
        { icon: Home, label: "Home", href: "/" },
        { icon: Play, label: "Play", href: "/play" },
        { icon: Users, label: "Social", href: "/social" },
      ]
    } else {
      return [
        { icon: Play, label: "Play", href: "/play" },
        { icon: Users, label: "Social", href: "/social" },
        { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
      ]
    }
  }

  const navItems = getNavItems()

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-green-400">
          <Crown className="w-6 h-6" />
          RealChess
        </Link>
      </div>

      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 space-y-3 text-sm text-gray-300">
        {user ? (
          <>
            <div className="text-white font-semibold text-center">
              Logged in as:<br />
              <span className="text-green-400">{user.name}</span>
            </div>
            <Button onClick={logout} className="w-full bg-red-600 hover:bg-red-700 mt-2">
              Log Out
            </Button>
          </>
        ) : (
          <div className="space-y-2">
            <Link href="/register">
              <Button className="w-full bg-green-600 hover:bg-green-700">Sign Up</Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                Log In
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
