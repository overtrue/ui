import { Link, useNavigate } from "react-router-dom"
import { Avatar } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface UserMenuProps {
  name: string
  role: string
  avatar?: string
  onSignOut?: () => void
}

export function UserMenu({ name, role, avatar, onSignOut }: UserMenuProps) {
  const navigate = useNavigate()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label={`Account menu for ${name}`} className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-accent">
          <Avatar
            size="sm"
            src={avatar}
            fallback={name
              .split(" ")
              .map((p) => p[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          />
          <span className="hidden text-left md:block">
            <span className="block text-sm font-medium leading-tight">{name}</span>
            <span className="block text-xs text-muted-foreground">{role}</span>
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs font-normal text-muted-foreground">{role}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link to="/profile">Profile</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/">Analytics</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/settings">Settings & Privacy</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/faq">Help</Link></DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onSignOut ?? (() => navigate("/sign-in"))}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
