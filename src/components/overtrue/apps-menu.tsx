import { IconCommand } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface AppBrand {
  id: string
  name: string
  color: string
  href: string
}

export function AppsMenu({ apps }: { apps: AppBrand[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Quick access">
          <IconCommand className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Quick access</DropdownMenuLabel>
        <div className="flex max-h-80 flex-col gap-1 overflow-y-auto p-1">
          {apps.map((a) => (
            <DropdownMenuItem asChild key={a.id}>
            <a
              href={a.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-md p-2 hover:bg-accent"
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-white"
                style={{ background: a.color }}
              >
                {a.name.slice(0, 2)}
              </span>
              <span className="text-sm">{a.name}</span>
            </a>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
