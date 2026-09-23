"use client";
import { useId, useImperativeHandle, useRef, type ComponentProps } from "react";
import { IconSearch, IconX } from "@tabler/icons-react";
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
  ref,
  containerClassName,
  className,
  placeholder = "Search…",
  ...props
}: SearchFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current!, []);
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
        ref={inputRef}
        id={inputId}
        type="search"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-9 w-full border-input bg-background ps-9 pe-9 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-search-cancel-button]:appearance-none",
          className,
        )}
      />
      {value && !props.readOnly && (
        <button
          type="button"
          aria-label={`Clear ${label.toLowerCase()}`}
          disabled={props.disabled}
          className="absolute end-1 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          onClick={() => {
            onValueChange("");
            inputRef.current?.focus();
          }}
        >
          <IconX aria-hidden="true" className="size-3.5" />
        </button>
      )}
    </div>
  );
}
