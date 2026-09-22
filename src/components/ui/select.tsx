import * as React from "react"
import { cn } from "@/lib/utils"
import { controlBase } from "@/components/ui/input"

const SelectContext = React.createContext<{
  value: string
  setValue: (v: string) => void
  open: boolean
  setOpen: (v: boolean) => void
}>({ value: "", setValue: () => {}, open: false, setOpen: () => {} })

function Select({
  value: controlled,
  defaultValue = "",
  onValueChange,
  children,
}: {
  value?: string
  defaultValue?: string
  onValueChange?: (v: string) => void
  children: React.ReactNode
}) {
  const [internal, setInternal] = React.useState(defaultValue)
  const [open, setOpen] = React.useState(false)
  const value = controlled ?? internal
  const setValue = (v: string) => {
    setInternal(v)
    onValueChange?.(v)
    setOpen(false)
  }
  return (
    <SelectContext.Provider value={{ value, setValue, open, setOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  )
}

function SelectTrigger({
  className,
  children,
  id,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  const { open, setOpen } = React.useContext(SelectContext)
  return (
    <button
      type="button"
      id={id}
      onClick={() => setOpen(!open)}
      className={cn(controlBase, "h-10 items-center justify-between", className)}
      {...props}
    >
      <span className="truncate text-left">{children}</span>
      <svg className="ml-2 h-4 w-4 shrink-0 opacity-50" viewBox="0 0 24 24" fill="none">
        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  )
}

function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value } = React.useContext(SelectContext)
  return <span className={value ? "" : "text-[#9ca3af]"}>{value || placeholder}</span>
}

function SelectContent({ className, children }: { className?: string; children: React.ReactNode }) {
  const { open } = React.useContext(SelectContext)
  if (!open) return null
  return (
    <div
      className={cn(
        "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-[#e5e7eb] bg-white p-1 text-sm shadow-md",
        className,
      )}
    >
      {children}
    </div>
  )
}

function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  const { value: current, setValue } = React.useContext(SelectContext)
  return (
    <button
      type="button"
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded px-2 py-1.5 hover:bg-[#f3f4f6]",
        current === value && "bg-[#eaf2fb] text-[#066fd1]",
      )}
      onClick={() => setValue(value)}
    >
      {children}
    </button>
  )
}

/** overtrue/ui native-styled select */
function FormSelect({
  className,
  children,
  defaultValue,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(controlBase, "h-10", className)}
      defaultValue={defaultValue}
      {...props}
    >
      {children}
    </select>
  )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, FormSelect }
