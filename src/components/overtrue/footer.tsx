import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("border-t border-border bg-card px-5 py-3 text-sm text-muted-foreground", className)}>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div>
            Copyright © 2026{" "}
            <Link to="/" className="font-medium text-foreground hover:text-primary">
              overtrue/ui
            </Link>
            . All rights reserved.
          </div>
          <span className="text-xs">v1.5.1</span>
        </div>
        <ul className="flex flex-wrap gap-3">
          <li>
            <a className="hover:text-primary hover:underline" href="/docs" target="_blank" rel="noreferrer">
              Documentation
            </a>
          </li>
          <li>
            <Link className="hover:text-primary hover:underline" to="/typography">
              License
            </Link>
          </li>
          <li>
            <a className="hover:text-primary hover:underline" href="/components" target="_blank" rel="noreferrer">
              Source code
            </a>
          </li>
          <li>
            <a className="hover:text-primary hover:underline" href="/components" target="_blank" rel="noreferrer">
              Sponsor
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
