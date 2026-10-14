import { useEffect, useRef, useState } from "react";
import { LogStream, type LogEntry } from "@/registry/overtrue/log-stream";

type Line = Omit<LogEntry, "id" | "time"> & { delay?: number };

const commits = [
  { sha: "4f9c2ab", message: "Fix rounding in checkout totals", author: "mira" },
  { sha: "b81e07d", message: "Cache invoice PDFs at the edge", author: "jonas" },
  { sha: "e3a5c19", message: "Move image resizing to a worker", author: "lena" },
];

// One deploy of "web" to production, including a slow chunk warning and a retried health check.
function deploy(run: number): Line[] {
  const { sha, message, author } = commits[run % commits.length];
  const pod = (n: number) => `web-${sha.slice(0, 4)}-${n}`;
  return [
    { level: "info", source: "deploy", message: `Deployment dpl_${sha.slice(2)}${run} queued · web → production` },
    { level: "info", source: "git", message: `Checked out ${sha} “${message}” by @${author}` },
    { level: "debug", source: "build", message: "Restored build cache (412 MB) in 1.8 s" },
    { level: "info", source: "build", message: "Installing dependencies · pnpm 9.15 · 1,284 packages" },
    { level: "info", source: "build", message: "vite v6.2.0 building for production…" },
    { level: "info", source: "build", message: "✓ 2,317 modules transformed in 21.4 s" },
    {
      level: "warn",
      source: "build",
      message:
        "Chunk assets/charts-B4x9.js is 612 kB after minification (limit 500 kB). Consider splitting it with dynamic import() or build.rollupOptions.output.manualChunks.",
    },
    { level: "info", source: "build", message: "Build completed · 41 assets · 1.92 MB gzip" },
    { level: "info", source: "test", message: "Running 214 tests in 38 files" },
    { level: "info", source: "test", message: "✓ 214 passed · 0 failed · 12.6 s", delay: 1100 },
    { level: "info", source: "db", message: "Applying migration 20261014_0932_add_invoice_due_at_index" },
    { level: "debug", source: "db", message: "CREATE INDEX CONCURRENTLY invoices_due_at_idx ON invoices (due_at) · 2.4 s" },
    { level: "info", source: "db", message: "Migrations up to date · 1 applied" },
    { level: "info", source: "deploy", message: `Pushed registry.acme.internal/web:${sha} (184 MB)` },
    { level: "info", source: "deploy", message: "Rolling out 6 instances · us-east-1, eu-west-1 · max surge 2" },
    { level: "info", source: "health", message: `${pod(1)} ready · GET /healthz 200 in 34 ms` },
    { level: "info", source: "health", message: `${pod(2)} ready · GET /healthz 200 in 29 ms` },
    {
      level: "error",
      source: "health",
      message: `${pod(3)} failed health check · GET /healthz 503 after 2,000 ms · upstream redis-primary:6379 timed out (ETIMEDOUT) while warming the session cache`,
    },
    { level: "warn", source: "deploy", message: `Restarting ${pod(3)} · attempt 2 of 3 in 5 s`, delay: 1200 },
    { level: "info", source: "health", message: `${pod(3)} ready · GET /healthz 200 in 41 ms` },
    { level: "info", source: "health", message: "6 of 6 instances healthy" },
    { level: "info", source: "router", message: "Shifting traffic 10% → 50% → 100%" },
    { level: "debug", source: "cdn", message: "Purged 41 paths from the edge cache in 812 ms" },
    { level: "info", source: "deploy", message: "✓ Deployment ready · web.acme.example · 3m 12s", delay: 3200 },
  ];
}

const PREFILL = 12;

function seedEntries(): LogEntry[] {
  const now = Date.now();
  return deploy(0)
    .slice(0, PREFILL)
    .map(({ delay: _delay, ...line }, index) => ({
      ...line,
      id: `0-${index}`,
      time: now - (PREFILL - index) * 730 - ((index * 137) % 290),
    }));
}

export default function Demo() {
  const [entries, setEntries] = useState<LogEntry[]>(seedEntries);
  const position = useRef({ run: 0, line: PREFILL });

  useEffect(() => {
    let timer = 0;
    const schedule = (delay: number) => {
      timer = window.setTimeout(step, delay);
    };
    function step() {
      // Hold the stream while the tab is hidden instead of piling up lines.
      if (document.hidden) return schedule(800);
      const { run, line } = position.current;
      const lines = deploy(run);
      const { delay, ...next } = lines[line];
      setEntries((current) => [
        ...current.slice(-199),
        { ...next, id: `${run}-${line}`, time: Date.now() },
      ]);
      const done = line + 1 >= lines.length;
      position.current = done ? { run: run + 1, line: 0 } : { run, line: line + 1 };
      schedule(delay ?? 400 + Math.random() * 800);
    }
    schedule(600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <LogStream
      title="Deploy · web → production"
      entries={entries}
      height={248}
      onClear={() => setEntries([])}
    />
  );
}
