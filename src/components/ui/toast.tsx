import * as React from "react"
import { cn } from "@/lib/utils"

function ToastProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

type ToastItem = { id: string; title: string; description?: string }

const ToastContext = React.createContext<{ toasts: ToastItem[]; push: (t: Omit<ToastItem, "id">) => void }>({
  toasts: [],
  push: () => {},
})

function useToast() {
  return React.useContext(ToastContext)
}

function ToastViewport() {
  const { toasts } = useToast()
  if (!toasts.length) return null
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto rounded-lg border bg-card p-4 shadow-lg",
          )}
        >
          <div className="text-sm font-semibold">{t.title}</div>
          {t.description ? (
            <div className="text-sm text-muted-foreground">{t.description}</div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

function ToastProviderBridge({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])
  const push = React.useCallback((t: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { ...t, id }])
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3500)
  }, [])
  return (
    <ToastContext.Provider value={{ toasts, push }}>
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  )
}

export { ToastProvider, ToastProviderBridge, useToast, ToastViewport }
export type { ToastItem }
