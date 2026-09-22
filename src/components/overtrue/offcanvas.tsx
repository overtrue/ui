import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"

const offcanvasVariants = cva(
  "fixed z-50 h-full w-full max-w-sm border-l bg-card p-4 shadow-xl transition-transform",
  {
    variants: {
      side: {
        end: "right-0 top-0",
        start: "left-0 top-0 border-r border-l-0",
        top: "top-0 left-0 right-0 h-auto max-h-[80%] w-full max-w-none border-b border-l-0",
        bottom: "bottom-0 left-0 right-0 h-auto max-h-[80%] w-full max-w-none border-t border-l-0",
      },
    },
    defaultVariants: { side: "end" },
  },
)

export interface OffcanvasProps extends VariantProps<typeof offcanvasVariants> {
  open: boolean
  onOpenChange: (v: boolean) => void
  title?: string
  children: React.ReactNode
  className?: string
}

export function Offcanvas({ open, onOpenChange, side = "end", title, children, className }: OffcanvasProps) {
  const returnFocus = React.useRef<HTMLElement | null>(null)
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          onOpenAutoFocus={() => { returnFocus.current = document.activeElement as HTMLElement }}
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            if (returnFocus.current?.isConnected) returnFocus.current.focus()
          }}
          className={cn(offcanvasVariants({ side }), "overflow-y-auto border-border text-card-foreground", className)}
        >
          <div className="mb-3 flex items-center justify-between">
            <DialogPrimitive.Title className={title ? "h2" : "sr-only"}>{title || "Details"}</DialogPrimitive.Title>
            <DialogPrimitive.Close className="ml-auto flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Close">
              ×
            </DialogPrimitive.Close>
          </div>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
