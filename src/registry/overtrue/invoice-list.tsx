"use client";
import { useState } from "react";
import { IconArrowDown, IconFileInvoice } from "@tabler/icons-react";
import { SectionCard } from "./section-card";
import { StatusBadge } from "./status-badge";
import { cn } from "@/lib/utils";

export interface Invoice {
  id: string;
  description: string;
  date: string;
  amount: string;
  status: "Paid" | "Open" | "Overdue";
  href?: string;
}
const filters = ["All", "Paid", "Open", "Overdue"] as const;
export function InvoiceList({
  invoices,
  className,
}: {
  invoices: readonly Invoice[];
  className?: string;
}) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const visible = invoices.filter(
    (invoice) => filter === "All" || invoice.status === filter,
  );
  return (
    <SectionCard
      title="Billing history"
      description="Invoices and receipts for your workspace."
      className={cn("shadow-none", className)}
      contentClassName="p-0"
    >
      <div
        aria-label="Filter invoices"
        className="flex flex-wrap gap-1 border-b border-border px-5 py-3"
      >
        {filters.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              filter === value
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            {value}
          </button>
        ))}
      </div>
      <ul
        aria-label="Invoices"
        className="m-0 list-none divide-y divide-border p-0"
      >
        {visible.map((invoice) => (
          <li
            key={invoice.id}
            className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4"
          >
            <span className="hidden size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground sm:flex">
              <IconFileInvoice aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0 flex-1 basis-36">
              <p className="m-0 text-sm font-medium [overflow-wrap:anywhere]">
                {invoice.id}
              </p>
              <p className="m-0 mt-1 text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
                {invoice.description} · {invoice.date}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium tabular-nums">
                {invoice.amount}
              </span>
              <StatusBadge
                variant={
                  invoice.status === "Paid"
                    ? "success"
                    : invoice.status === "Overdue"
                      ? "error"
                      : "neutral"
                }
              >
                {invoice.status}
              </StatusBadge>
              {invoice.href && (
                <a
                  href={invoice.href}
                  aria-label={`Download invoice ${invoice.id}`}
                  className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <IconArrowDown aria-hidden="true" className="size-4" />
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
      {!visible.length && (
        <p
          role="status"
          className="m-0 px-5 py-10 text-center text-sm text-muted-foreground"
        >
          {invoices.length
            ? "No invoices with this status."
            : "Your invoices will appear here."}
        </p>
      )}
      <p
        aria-live="polite"
        className="m-0 border-t border-border px-5 py-3 text-xs tabular-nums text-muted-foreground"
      >
        {visible.length} {visible.length === 1 ? "invoice" : "invoices"}
        {filter !== "All" && ` · ${filter.toLowerCase()}`}
      </p>
    </SectionCard>
  );
}
