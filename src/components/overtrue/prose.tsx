import { cn } from "@/lib/utils"

export function Prose({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "prose-overtrue max-w-none space-y-4 text-sm leading-relaxed text-foreground",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function ProseH1({ children }: { children: React.ReactNode }) {
  return <h1 className="h1">{children}</h1>
}
export function ProseH2({ children }: { children: React.ReactNode }) {
  return <h2 className="h2">{children}</h2>
}
export function ProseH3({ children }: { children: React.ReactNode }) {
  return <h3 className="h3">{children}</h3>
}
export function ProseP({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>
}
export function ProseMuted({ children }: { children: React.ReactNode }) {
  return <p className="text-muted-foreground">{children}</p>
}
export function ProseLead({ children }: { children: React.ReactNode }) {
  return <p className="text-base">{children}</p>
}
