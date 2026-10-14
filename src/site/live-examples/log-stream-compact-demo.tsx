import { LogStream, type LogEntry } from "@/registry/overtrue/log-stream";

// A finished incident window: no timer, just history to filter and search.
const start = Date.UTC(2026, 9, 13, 14, 2, 7, 120);
const at = (seconds: number) => start + Math.round(seconds * 1000);

const entries: LogEntry[] = [
  { id: "b1", time: at(0), level: "info", source: "worker", message: "billing-worker started · concurrency 8 · queue invoices.render" },
  { id: "b2", time: at(1.4), level: "debug", source: "queue", message: "Leased 8 jobs (visibility 30 s)" },
  { id: "b3", time: at(2.9), level: "info", source: "render", message: "INV-20481 rendered · 2 pages · 184 ms" },
  { id: "b4", time: at(3.3), level: "info", source: "render", message: "INV-20482 rendered · 1 page · 121 ms" },
  { id: "b5", time: at(6.8), level: "warn", source: "pdf", message: "Font “Inter Display” missing from the render image; falling back to the system sans" },
  { id: "b6", time: at(9.2), level: "info", source: "render", message: "INV-20483 rendered · 3 pages · 266 ms" },
  { id: "b7", time: at(14.6), level: "error", source: "storage", message: "PUT s3://acme-invoices/2026/10/INV-20484.pdf failed · 503 SlowDown · retrying in 400 ms" },
  { id: "b8", time: at(15.1), level: "info", source: "storage", message: "PUT INV-20484.pdf succeeded on retry 1 · 212 ms" },
  { id: "b9", time: at(21.7), level: "debug", source: "queue", message: "Heartbeat · 6 in flight · 1,204 waiting" },
  { id: "b10", time: at(28.3), level: "warn", source: "queue", message: "Lag 42 s on invoices.render exceeds the 30 s target" },
  { id: "b11", time: at(31.0), level: "info", source: "scaler", message: "Scaled billing-worker 2 → 4 replicas" },
  { id: "b12", time: at(44.9), level: "error", source: "mailer", message: "Delivery to ap@northwind.example deferred · 421 4.7.0 try again later" },
  { id: "b13", time: at(52.2), level: "info", source: "mailer", message: "Delivered INV-20484 to ap@northwind.example on retry" },
  { id: "b14", time: at(63.5), level: "info", source: "queue", message: "Lag back under target · 8 s" },
  { id: "b15", time: at(70.1), level: "debug", source: "worker", message: "GC pause 14 ms · heap 212 MB" },
];

export default function Demo() {
  return (
    <LogStream
      title="billing-worker"
      description="13 Oct, 14:02–14:03 UTC"
      entries={entries}
      live={false}
      height={200}
      timeZone="utc"
      defaultLevels={["info", "warn", "error"]}
      defaultQuery="INV-2048"
    />
  );
}
