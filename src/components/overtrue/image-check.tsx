import { IconCheck } from "@tabler/icons-react"
import * as React from "react"
import { cn } from "@/lib/utils"

export interface ImageCheckProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  src?: string
  alt?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  /** Use a color block when no image is provided */
  color?: string
  title?: string
  description?: string
}

/**
 * overtrue/ui-style image check: selectable visual card used in galleries,
 * patterns, and option pickers. Follows shadcn composition style.
 */
export const ImageCheck = React.forwardRef<HTMLDivElement, ImageCheckProps>(
  (
    {
      src,
      alt,
      checked = false,
      onCheckedChange,
      disabled,
      color,
      title,
      description,
      className,
      onClick,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        role="checkbox"
        aria-checked={checked}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        className={cn(
          "relative cursor-pointer overflow-hidden rounded-md border-2 bg-card transition-all",
          checked ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/40",
          disabled && "pointer-events-none opacity-50",
          className,
        )}
        onClick={(e) => {
          onClick?.(e)
          if (!disabled) onCheckedChange?.(!checked)
        }}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault()
            if (!disabled) onCheckedChange?.(!checked)
          }
        }}
        {...props}
      >
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {src ? (
            <img src={src} alt={alt ?? title ?? ""} className="h-full w-full object-cover" />
          ) : (
            <div
              className="h-full w-full"
              style={{ background: color ?? "var(--pn-blue)" }}
              aria-hidden
            />
          )}
          <span
            className={cn(
              "absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-card text-primary shadow-sm transition-opacity",
              checked ? "border-primary opacity-100" : "border-border opacity-70",
            )}
          >
            {checked ? <IconCheck className="h-3.5 w-3.5" /> : null}
          </span>
        </div>
        {(title || description) && (
          <div className="space-y-0.5 p-3">
            {title ? <div className="text-sm font-medium leading-tight">{title}</div> : null}
            {description ? (
              <div className="text-xs text-muted-foreground">{description}</div>
            ) : null}
          </div>
        )}
      </div>
    )
  },
)
ImageCheck.displayName = "ImageCheck"
