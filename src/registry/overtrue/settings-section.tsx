import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A responsive form section: explanation first, related fields beside it. */
export function SettingsSection({
  title,
  description,
  children,
  footer,
  className,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <section
      data-slot="settings-section"
      aria-labelledby={id}
      className={cn(
        "@container min-w-0 border-b border-border py-6 first:pt-0 last:border-0",
        className,
      )}
    >
      <div className="grid min-w-0 gap-5 @xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] @xl:gap-10">
        <div>
          <h2 id={id} className="m-0 text-sm font-semibold text-foreground">
            {title}
          </h2>
          {description && (
            <div className="mt-2 max-w-sm text-xs leading-5 text-muted-foreground">
              {description}
            </div>
          )}
        </div>
        <div data-slot="settings-section-fields" className="min-w-0 space-y-4">
          {children}
          {footer && (
            <div
              data-slot="settings-section-footer"
              className="flex flex-wrap items-center justify-end gap-3 pt-2 text-xs text-muted-foreground"
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
