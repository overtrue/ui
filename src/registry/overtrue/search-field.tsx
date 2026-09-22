"use client";
import { useId, type ComponentProps } from "react";
import { IconSearch } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface SearchFieldProps extends Omit<
  ComponentProps<typeof Input>,
  "type" | "value" | "defaultValue" | "onChange"
> {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  containerClassName?: string;
}
/** Controlled search input. Filtering and debouncing belong to the caller. */
export function SearchField({
  label,
  value,
  onValueChange,
  id,
  containerClassName,
  className,
  placeholder = "Search…",
  ...props
}: SearchFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div
      data-slot="search-field"
      className={cn("relative min-w-0", containerClassName)}
    >
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <IconSearch
        aria-hidden="true"
        className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        {...props}
        id={inputId}
        type="search"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-9 w-full border-input bg-background ps-9 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring",
          className,
        )}
      />
    </div>
  );
}
