import { memo } from "react"
import { useAuth } from "@/contexts/auth-context"

interface UserProfileProps {
  collapsed: boolean
}

export const UserProfile = memo(function UserProfile({ collapsed }: UserProfileProps) {
  if (collapsed) {
    return null
  }

  const { user } = useAuth()

  return (
    <div className="flex items-center space-x-3">
      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#00D4FF] to-[#00FF88] flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{user?.name ?? 'Guest'}</p>
      </div>
    </div>
  )
})
