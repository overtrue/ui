"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { IconArrowLeft } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

/** Keep the collection and its selected record together; mobile opens one pane at a time. */
export function SplitView({
  list,
  children,
  selected,
  onBack,
  listLabel = "Items",
  detailLabel = "Details",
  className,
}: {
  list: ReactNode;
  children: ReactNode;
  selected: boolean;
  onBack: () => void;
  listLabel?: string;
  detailLabel?: string;
  className?: string;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const previous = useRef(selected);
  useEffect(() => {
    if (
      selected &&
      !previous.current &&
      listRef.current &&
      getComputedStyle(listRef.current).display === "none"
    )
      detailRef.current?.focus();
    if (!selected && previous.current) {
      if (trigger.current?.isConnected) trigger.current.focus();
      else listRef.current?.focus();
    }
    previous.current = selected;
  }, [selected]);
  return (
    <section
      data-slot="split-view"
      className={cn(
        "@container min-w-0 overflow-hidden rounded-xl border border-border bg-card text-card-foreground",
        className,
      )}
    >
      <div className="grid min-w-0 @2xl:grid-cols-[minmax(230px,1fr)_minmax(0,2fr)]">
        <div
          ref={listRef}
          tabIndex={-1}
          data-slot="split-view-list"
          aria-label={listLabel}
          onClickCapture={(event) => {
            const target = (event.target as HTMLElement).closest<HTMLElement>(
              "button,a",
            );
            if (target) trigger.current = target;
          }}
          className={cn(
            "min-w-0 @2xl:border-e @2xl:border-border",
            selected && "hidden @2xl:block",
          )}
        >
          {list}
        </div>
        <div
          ref={detailRef}
          data-slot="split-view-detail"
          tabIndex={-1}
          aria-label={detailLabel}
          className={cn(
            "min-w-0 outline-none",
            !selected && "hidden @2xl:block",
          )}
        >
          {selected && (
            <button
              type="button"
              onClick={onBack}
              className="flex min-h-11 w-full items-center gap-2 border-b border-border px-4 text-xs font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring @2xl:hidden"
            >
              <IconArrowLeft size={15} aria-hidden="true" />
              Back to {listLabel.toLowerCase()}
            </button>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
