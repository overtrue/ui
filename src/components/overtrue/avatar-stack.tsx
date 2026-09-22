import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"

export interface AvatarStackProps extends React.HTMLAttributes<HTMLDivElement> {
  users: { name: string; src?: string }[]
  max?: number
  size?: "xs" | "sm" | "md"
}

export function AvatarStack({ users, max = 4, size = "sm", className, ...props }: AvatarStackProps) {
  const shown = users.slice(0, max)
  const extra = users.length - shown.length
  return (
    <div className={cn("flex -space-x-2", className)} {...props}>
      {shown.map((u) => (
        <Avatar
          key={u.name}
          size={size}
          src={u.src}
          fallback={u.name
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
          className="ring-2 ring-background"
          title={u.name}
        />
      ))}
      {extra > 0 ? (
        <span className="inline-flex items-center justify-center rounded-full bg-muted text-xs font-medium ring-2 ring-background">
          +{extra}
        </span>
      ) : null}
    </div>
  )
}
