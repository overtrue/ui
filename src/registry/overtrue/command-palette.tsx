/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 *
 * MIT License
 *
 * Copyright (c) 2026 dashboardcn contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * ---
 *
 * Portions of this project are derived from shadcn/ui and shadcn/registry-template
 * (https://github.com/shadcn-ui/ui), Copyright (c) 2023 shadcn, licensed under the
 * MIT License. The notice above applies to those portions as well.
 */
"use client";

import * as React from "react";
import {
  IconArrowDown as ArrowDown,
  IconArrowUp as ArrowUp,
  IconCornerDownLeft as CornerDownLeft,
  IconSearch as Search,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export interface CommandPaletteItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  keywords?: string[];
  disabled?: boolean;
  onSelect?: () => void;
}

export interface CommandPaletteGroup {
  heading?: string;
  items: CommandPaletteItem[];
}

export interface CommandPaletteProps {
  groups: CommandPaletteGroup[];
  variant?: "dialog" | "inline";
  /** Arrange results as familiar command rows or as an app-launcher grid. */
  layout?: "list" | "grid";
  /** Tighten list rows for dense navigation menus. */
  density?: "compact" | "default";
  size?: "compact" | "default" | "wide";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  emptyLabel?: React.ReactNode;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  className?: string;
  onSelect?: (item: CommandPaletteItem) => void;
}

const sizeClasses = {
  compact: "sm:max-w-md",
  default: "sm:max-w-xl",
  wide: "sm:max-w-2xl",
};

// Shared by the dialog and inline surfaces: a roomy search row and quiet group headings.
const surfaceClasses =
  "**:data-[slot=command-input-wrapper]:h-12! **:data-[slot=command-input-wrapper]:gap-2.5 **:data-[slot=command-input-wrapper]:border-border/60 **:data-[slot=command-input-wrapper]:px-4 **:data-[slot=command-input]:h-12 **:data-[slot=command-input]:text-sm [&_[cmdk-group-heading]]:px-2.5! [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground";

const useIsoLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

interface HighlightRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Follow cmdk's selected item with one shared highlight, so moving through
 * results with the keyboard or pointer glides instead of blinking.
 */
function useSelectionHighlight(
  marker: React.RefObject<HTMLSpanElement | null>,
) {
  const [{ rect, snap }, setState] = React.useState<{
    rect: HighlightRect | null;
    snap: boolean;
  }>({ rect: null, snap: true });
  // The first placement snaps into place; later moves glide.
  const [glide, setGlide] = React.useState(false);

  useIsoLayoutEffect(() => {
    const highlight = marker.current;
    const root = highlight?.closest("[cmdk-root]");
    if (!highlight || !root) return;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const item = root.querySelector<HTMLElement>(
        '[cmdk-item][data-selected="true"]',
      );
      const parent = highlight.offsetParent as HTMLElement | null;
      if (!item || !parent || !item.getClientRects().length) {
        setState((current) =>
          current.rect ? { rect: null, snap: true } : current,
        );
        return;
      }
      let next: HighlightRect;
      if (item.offsetParent === parent) {
        next = {
          left: item.offsetLeft,
          top: item.offsetTop,
          width: item.offsetWidth,
          height: item.offsetHeight,
        };
      } else {
        const box = item.getBoundingClientRect();
        const origin = parent.getBoundingClientRect();
        next = {
          left: box.left - origin.left + parent.scrollLeft,
          top: box.top - origin.top + parent.scrollTop,
          width: box.width,
          height: box.height,
        };
      }
      setState((current) =>
        current.rect &&
        current.rect.left === next.left &&
        current.rect.top === next.top &&
        current.rect.width === next.width &&
        current.rect.height === next.height
          ? current
          : // Reappearing after an empty search fades in place instead of sliding.
            { rect: next, snap: !current.rect },
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    const mutations = new MutationObserver(schedule);
    mutations.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-selected", "hidden"],
    });
    const resize = new ResizeObserver(schedule);
    if (highlight.parentElement) resize.observe(highlight.parentElement);
    const ready = requestAnimationFrame(() => setGlide(true));
    return () => {
      mutations.disconnect();
      resize.disconnect();
      cancelAnimationFrame(frame);
      cancelAnimationFrame(ready);
    };
  }, [marker]);

  return { rect, glide: glide && !snap, snap };
}

/** Bind Command/Ctrl+K to a controlled command palette without stealing input shortcuts. */
function useCommandPaletteShortcut(
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>,
  enabled = true,
) {
  React.useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k")
        return;
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      )
        return;

      event.preventDefault();
      onOpenChange((open) => !open);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [enabled, onOpenChange]);
}

function CommandPaletteHints({ dialog }: { dialog: boolean }) {
  return (
    <span
      data-slot="command-palette-hints"
      className="flex min-w-0 items-center gap-4"
    >
      <span className="flex items-center gap-1.5">
        <CommandPaletteKbd>
          <CornerDownLeft />
        </CommandPaletteKbd>
        Select
      </span>
      <span className="flex items-center gap-1.5">
        <span className="flex gap-0.5">
          <CommandPaletteKbd>
            <ArrowUp />
          </CommandPaletteKbd>
          <CommandPaletteKbd>
            <ArrowDown />
          </CommandPaletteKbd>
        </span>
        Navigate
      </span>
      {dialog ? (
        <span className="hidden items-center gap-1.5 sm:flex">
          <CommandPaletteKbd>Esc</CommandPaletteKbd>
          Close
        </span>
      ) : null}
    </span>
  );
}

function CommandPaletteContent({
  groups,
  placeholder,
  emptyLabel,
  footer,
  onSelect,
  layout,
  density,
  variant,
}: Pick<
  CommandPaletteProps,
  | "groups"
  | "placeholder"
  | "emptyLabel"
  | "footer"
  | "onSelect"
  | "layout"
  | "density"
  | "variant"
>) {
  const marker = React.useRef<HTMLSpanElement>(null);
  const { rect, glide, snap } = useSelectionHighlight(marker);
  const grid = layout === "grid";
  const compact = density === "compact";

  return (
    <>
      <CommandInput placeholder={placeholder} />
      {variant === "dialog" ? (
        <CommandPaletteKbd
          aria-hidden="true"
          className="pointer-events-none absolute top-3.5 right-4"
        >
          Esc
        </CommandPaletteKbd>
      ) : null}
      <CommandList
        data-highlight={rect ? "" : undefined}
        className="group/palette @container/palette relative max-h-[min(420px,60vh)] scroll-py-2 px-1.5 py-1.5 [&>[cmdk-list-sizer]]:relative"
      >
        <span
          ref={marker}
          aria-hidden="true"
          data-slot="command-palette-highlight"
          className={cn(
            "pointer-events-none absolute top-0 left-0",
            grid
              ? "rounded-xl bg-primary/[0.05] shadow-[0_0_0_2px_color-mix(in_oklab,var(--color-primary)_30%,transparent),0_10px_28px_-14px_color-mix(in_oklab,var(--color-primary)_60%,transparent)] dark:bg-primary/[0.09]"
              : "rounded-lg bg-primary/[0.07] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_14%,transparent),0_6px_18px_-12px_color-mix(in_oklab,var(--color-primary)_60%,transparent)] dark:bg-primary/[0.13]",
            rect ? "opacity-100" : "opacity-0",
            glide
              ? "transition-[translate,width,height,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
              : snap &&
                  "transition-opacity duration-200 motion-reduce:transition-none",
          )}
          style={
            rect
              ? {
                  width: rect.width,
                  height: rect.height,
                  translate: `${rect.left}px ${rect.top}px`,
                }
              : undefined
          }
        />
        <CommandEmpty className="px-6 py-10 text-center text-sm text-muted-foreground">
          <span
            aria-hidden="true"
            className="mx-auto mb-3 flex size-10 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground ring-1 ring-border/60 ring-inset [&>svg]:size-[18px]!"
          >
            <Search />
          </span>
          {emptyLabel}
        </CommandEmpty>
        {groups.map((group, groupIndex) => (
          <React.Fragment key={group.heading ?? groupIndex}>
            {groupIndex > 0 ? (
              <CommandSeparator className="-mx-1.5 my-1.5 bg-border/60" />
            ) : null}
            <CommandGroup
              heading={group.heading}
              className={cn(
                "overflow-visible p-0!",
                grid &&
                  "[&_[cmdk-group-items]]:grid [&_[cmdk-group-items]]:grid-cols-2 [&_[cmdk-group-items]]:gap-2 [&_[cmdk-group-items]]:p-1 @lg/palette:[&_[cmdk-group-items]]:grid-cols-3",
              )}
            >
              {group.items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  keywords={[
                    item.label,
                    item.description ?? "",
                    ...(item.keywords ?? []),
                  ]}
                  disabled={item.disabled}
                  onSelect={() => {
                    item.onSelect?.();
                    onSelect?.(item);
                  }}
                  className={cn(
                    "group/item gap-3 rounded-lg px-2.5! text-foreground transition-colors duration-150 motion-reduce:transition-none data-[selected=true]:bg-primary/[0.07] data-[selected=true]:text-foreground group-data-[highlight]/palette:data-[selected=true]:bg-transparent dark:data-[selected=true]:bg-primary/[0.13]",
                    compact ? "py-1.5!" : "py-2!",
                    grid &&
                      "h-auto min-h-28 flex-col items-start justify-between gap-4 rounded-xl border border-border/60 p-3.5! data-[selected=true]:border-primary/30 group-data-[highlight]/palette:data-[selected=true]:border-transparent",
                  )}
                >
                  {item.icon ? (
                    <span
                      data-slot="command-palette-icon"
                      className={cn(
                        "flex shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground ring-1 ring-border/60 transition-[color,background-color,box-shadow] duration-150 ring-inset motion-reduce:transition-none [&>svg]:size-4! [&>svg]:text-current!",
                        "group-data-[selected=true]/item:bg-card group-data-[selected=true]/item:text-primary group-data-[selected=true]/item:shadow-[0_1px_2px_rgb(0_0_0/0.06)] group-data-[selected=true]/item:ring-primary/25 dark:group-data-[selected=true]/item:bg-primary/15",
                        compact ? "size-7" : "size-8",
                        grid && "size-9 rounded-[10px] [&>svg]:size-[18px]!",
                      )}
                    >
                      {item.icon}
                    </span>
                  ) : null}
                  <span className={cn("min-w-0 flex-1", grid && "w-full flex-none")}>
                    <span className="block truncate text-sm leading-5 font-medium tracking-tight">
                      {item.label}
                    </span>
                    {item.description ? (
                      <span className="block truncate text-xs leading-4 text-muted-foreground">
                        {item.description}
                      </span>
                    ) : null}
                  </span>
                  {item.shortcut ? (
                    <CommandShortcut className="tracking-normal">
                      {item.shortcut}
                    </CommandShortcut>
                  ) : !grid ? (
                    <span
                      aria-hidden="true"
                      className="ms-auto shrink-0 opacity-0 transition-opacity duration-150 group-data-[selected=true]/item:opacity-100 motion-reduce:transition-none"
                    >
                      <CommandPaletteKbd>
                        <CornerDownLeft />
                      </CommandPaletteKbd>
                    </span>
                  ) : null}
                </CommandItem>
              ))}
            </CommandGroup>
          </React.Fragment>
        ))}
      </CommandList>
      {footer !== null ? (
        <div
          data-slot="command-palette-footer"
          className="flex min-h-10 items-center justify-between gap-3 border-t border-border/60 bg-muted/30 px-4 py-2 text-xs text-muted-foreground"
        >
          {footer === undefined ? (
            <CommandPaletteHints dialog={variant === "dialog"} />
          ) : (
            footer
          )}
        </div>
      ) : null}
    </>
  );
}

/** A data-driven command menu that renders as a modal palette or an embedded search surface. */
function CommandPalette({
  groups,
  variant = "dialog",
  layout = "list",
  density = "default",
  size = "default",
  open,
  onOpenChange,
  placeholder = "Type a command or search…",
  emptyLabel = "No commands found.",
  title = "Command palette",
  description = "Search for a command to run.",
  footer,
  className,
  onSelect,
}: CommandPaletteProps) {
  const content = (
    <CommandPaletteContent
      groups={groups}
      placeholder={placeholder}
      emptyLabel={emptyLabel}
      footer={footer}
      onSelect={onSelect}
      layout={layout}
      density={density}
      variant={variant}
    />
  );

  if (variant === "inline") {
    return (
      <Command
        data-slot="command-palette"
        data-variant="inline"
        className={cn(
          "relative h-auto rounded-2xl border border-border/70 bg-card text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]",
          surfaceClasses,
          className,
        )}
      >
        {content}
      </Command>
    );
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      showCloseButton={false}
      className={cn(
        "gap-0 overflow-hidden rounded-2xl border border-border/70 bg-popover/95 p-0 text-popover-foreground backdrop-blur-xl dark:bg-popover/90 **:data-[slot=command]:bg-transparent",
        "bg-[radial-gradient(90%_55%_at_50%_-10%,color-mix(in_oklab,var(--color-primary)_7%,transparent),transparent_70%)]",
        "shadow-[0_0_0_1px_rgb(0_0_0/0.02),0_24px_64px_-16px_rgb(0_0_0/0.28)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_24px_64px_-16px_rgb(0_0_0/0.7)]",
        "transition-[opacity,scale] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:starting:scale-[0.98] motion-safe:starting:opacity-0 motion-reduce:transition-none",
        "**:data-[slot=command-input]:pe-12",
        surfaceClasses,
        sizeClasses[size],
        className,
      )}
    >
      {content}
    </CommandDialog>
  );
}

function CommandPaletteKbd({
  className,
  ...props
}: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="command-palette-kbd"
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-border/70 bg-background/80 px-1 font-sans text-[11px] leading-none font-medium text-muted-foreground shadow-[inset_0_-1px_0_var(--color-border)] dark:bg-foreground/[0.06] [&_svg]:size-3!",
        className,
      )}
      {...props}
    />
  );
}

function CommandPaletteShortcutKeys({
  keys,
  label,
  className,
}: {
  keys: string[];
  label?: string;
  className?: string;
}) {
  return (
    <span
      aria-label={label ?? keys.join(" then ")}
      className={cn("flex items-center gap-1", className)}
    >
      {keys.map((key) => (
        <CommandPaletteKbd key={key}>{key}</CommandPaletteKbd>
      ))}
    </span>
  );
}

export {
  CommandPalette,
  CommandPaletteKbd,
  CommandPaletteShortcutKeys,
  useCommandPaletteShortcut,
};
