import * as React from "react"
import { cn } from "@/lib/utils"

const AccordionContext = React.createContext<{
  value: string[]
  toggle: (v: string) => void
  type: "single" | "multiple"
}>({ value: [], toggle: () => {}, type: "single" })

function Accordion({
  type = "single",
  defaultValue = [],
  value: controlled,
  onValueChange,
  className,
  children,
}: {
  type?: "single" | "multiple"
  defaultValue?: string[]
  value?: string[]
  onValueChange?: (v: string[]) => void
  className?: string
  children: React.ReactNode
}) {
  const [internal, setInternal] = React.useState<string[]>(defaultValue)
  const value = controlled ?? internal
  const toggle = (v: string) => {
    let next: string[]
    if (type === "single") {
      next = value.includes(v) ? [] : [v]
    } else {
      next = value.includes(v) ? value.filter((x) => x !== v) : [...value, v]
    }
    setInternal(next)
    onValueChange?.(next)
  }
  return (
    <AccordionContext.Provider value={{ value, toggle, type }}>
      <div className={cn("rounded-lg border", className)}>{children}</div>
    </AccordionContext.Provider>
  )
}

function AccordionItem({
  value,
  className,
  children,
}: {
  value: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div data-value={value} className={cn("border-b last:border-b-0", className)}>
      {children}
    </div>
  )
}

function AccordionTrigger({
  value,
  className,
  children,
  inverted = false,
  icon = "chevron",
}: {
  value?: string
  className?: string
  children: React.ReactNode
  inverted?: boolean
  icon?: "chevron" | "plus"
}) {
  const itemRef = React.useRef<HTMLDivElement>(null)
  const ctx = React.useContext(AccordionContext)
  const parentValue = value ?? ""
  const open = ctx.value.includes(parentValue)
  return (
    <button
      type="button"
      data-open={open}
      className={cn(
        "accordion-trigger flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-[#374151] transition-all hover:text-[#066fd1]",
        className,
      )}
      onClick={() => ctx.toggle(parentValue)}
    >
      {inverted ? (
        <span className="shrink-0 text-muted-foreground">
          {icon === "plus" ? (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
              <path
                d={open ? "M5 12h14" : "M12 5v14M5 12h14"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </span>
      ) : null}
      <span className="flex-1">{children}</span>
      {!inverted ? (
        <svg
          className={cn("h-4 w-4 shrink-0 transition-transform text-muted-foreground", open && "rotate-180")}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : null}
      <span ref={itemRef} className="sr-only">
        {open ? "open" : "closed"}
      </span>
    </button>
  )
}

function AccordionContent({
  value,
  className,
  children,
}: {
  value: string
  className?: string
  children: React.ReactNode
}) {
  const ctx = React.useContext(AccordionContext)
  if (!ctx.value.includes(value)) return null
  return <div className={cn("px-4 pb-4 pt-0 text-sm text-muted-foreground", className)}>{children}</div>
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
