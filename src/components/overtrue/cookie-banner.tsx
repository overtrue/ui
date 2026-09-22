import * as React from "react"
import { cn } from "@/lib/utils"

export interface CookieBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string
  onAccept?: () => void
  onDecline?: () => void
}

export function CookieBanner({
  message = "We use cookies to ensure you get the best experience on our website.",
  onAccept,
  onDecline,
  className,
  ...props
}: CookieBannerProps) {
  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 right-4 z-40 mx-auto flex max-w-3xl flex-col gap-3 rounded-lg border bg-card p-4 shadow-lg sm:flex-row sm:items-center",
        className,
      )}
      {...props}
    >
      <p className="flex-1 text-sm">{message}</p>
      <div className="flex shrink-0 gap-2">
        <button type="button" className="text-sm text-muted-foreground hover:text-foreground" onClick={onDecline}>
          Decline
        </button>
        <button
          type="button"
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          onClick={onAccept}
        >
          Accept
        </button>
      </div>
    </div>
  )
}
