import { FriendsList } from "@/components/friends-list"
import { FriendRequests } from "@/components/friend-requests"
import { AddFriend } from "@/components/add-friend"

export default function SocialPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Social</h1>
          <p className="text-gray-400">Connect with friends and track your chess community</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <AddFriend />
            <FriendRequests />
          </div>
          <div>
            <FriendsList />
          </div>
        </div>
      </div>
    </div>
  )
}
