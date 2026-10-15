import { useState } from "react";
import { IconCheck, IconCopy, IconSortAZ } from "@tabler/icons-react";
import { JsonViewer, toJsonString } from "@/registry/overtrue/json-viewer";

// A webhook delivery log. Event ids, orders and warehouses are fictional.
const events = [
  {
    id: "evt_1Q8xKp",
    type: "order.created",
    created: "2026-10-15T08:41:09Z",
    data: {
      object: {
        id: "ord_7731",
        total: 12950,
        currency: "eur",
        items: [
          { sku: "SKU-1042", qty: 2 },
          { sku: "SKU-3318", qty: 1 },
        ],
      },
    },
    delivery: { attempts: 1, status: 200, endpoint: "https://hooks.acme.example/orders" },
  },
  {
    id: "evt_1Q8xLz",
    type: "order.updated",
    created: "2026-10-15T08:44:52Z",
    data: {
      object: { id: "ord_7731", items: [{ sku: "SKU-1042", qty: 3 }] },
      previous: { items: [{ sku: "SKU-1042", qty: 2 }] },
    },
    delivery: { attempts: 1, status: 200, endpoint: "https://hooks.acme.example/orders" },
  },
  {
    id: "evt_1Q8xNb",
    type: "inventory.low",
    created: "2026-10-15T08:45:03Z",
    data: { object: { sku: "SKU-1042", warehouse: "AMS-2", onHand: 4, threshold: 10 } },
    delivery: {
      attempts: 3,
      status: 503,
      endpoint: "https://hooks.acme.example/inventory",
      nextRetry: "2026-10-15T09:05:03Z",
    },
  },
  {
    id: "evt_1Q8xQe",
    type: "refund.created",
    created: "2026-10-15T09:02:17Z",
    data: { object: { id: "re_2290", order: "ord_7702", amount: 4800, reason: null } },
    delivery: { attempts: 1, status: 200, endpoint: "https://hooks.acme.example/payments" },
  },
];

const INITIAL = "events[2].data.object.sku";

export default function Demo() {
  const [selection, setSelection] = useState<{ path: string; value: unknown }>({
    path: INITIAL,
    value: events[2].data.object.sku,
  });
  const [sorted, setSorted] = useState(false);
  const [copied, setCopied] = useState(false);

  const preview = toJsonString(selection.value, 0);

  return (
    <div className="flex flex-col gap-3">
      <JsonViewer
        title="Webhook deliveries"
        description="4 events · last hour"
        rootName="events"
        data={events}
        defaultSearch="sku"
        defaultExpandDepth={1}
        defaultSelectedPath={INITIAL}
        sortKeys={sorted}
        showStatusBar={false}
        maxHeight={380}
        onSelect={(path, value) => setSelection({ path, value })}
        actions={
          <button
            type="button"
            aria-pressed={sorted}
            title="Sort keys"
            onClick={() => setSorted((value) => !value)}
            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/30 aria-pressed:bg-primary/10 aria-pressed:text-primary"
          >
            <IconSortAZ className="size-4" aria-hidden="true" stroke={1.75} />
            <span className="sr-only">Sort keys</span>
          </button>
        }
      />
      <div
        aria-live="polite"
        className="flex items-center gap-3 rounded-xl bg-muted/40 py-2 pr-2 pl-3.5 ring-1 ring-border/60 ring-inset"
      >
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">Selected · onSelect(path, value)</p>
          <p className="truncate font-mono text-[13px] leading-6 text-foreground">{selection.path || "events"}</p>
        </div>
        <code className="hidden max-w-[38%] truncate rounded-md bg-card px-2 py-1 font-mono text-xs text-muted-foreground ring-1 ring-border/60 sm:block">
          {preview}
        </code>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(selection.path);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1400);
            } catch {
              // Clipboard unavailable: nothing to confirm.
            }
          }}
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-card px-2.5 text-xs font-medium shadow-[0_1px_2px_rgb(0_0_0/0.06)] ring-1 ring-border/70 transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          {copied ? (
            <IconCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          ) : (
            <IconCopy className="size-3.5" aria-hidden="true" />
          )}
          {copied ? "Copied" : "Copy path"}
        </button>
      </div>
    </div>
  );
}
