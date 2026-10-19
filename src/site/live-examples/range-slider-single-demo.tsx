import { useEffect, useRef, useState } from "react";
import { IconCheck, IconLoader2 } from "@tabler/icons-react";
import { RangeSlider } from "@/registry/overtrue/range-slider";

// checkout-api handles about 7.4 million requests a day (fictional).
const REQUESTS_PER_DAY = 7_360_000;
const COST_PER_MILLION = 2.6;
const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const marks = [
  { value: 0, label: "Off" },
  { value: 10, label: "10%" },
  { value: 25, label: "25%" },
  { value: 50, label: "50%" },
  { value: 75, label: "75%" },
  { value: 100, label: "100%" },
];

export default function RangeSliderSingleDemo() {
  const [rate, setRate] = useState(25);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const traces = (REQUESTS_PER_DAY * rate) / 100;
  const stats = [
    { label: "Traces kept a day", value: rate ? compact.format(traces) : "None" },
    {
      label: "Ingest cost a month",
      value: usd.format((traces * 30 * COST_PER_MILLION) / 1_000_000),
    },
    { label: "Errors kept", value: "100%" },
  ];

  return (
    <section
      aria-labelledby="sampling-title"
      className="@container rounded-2xl border border-border/70 bg-card p-5 text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]"
    >
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 id="sampling-title" className="text-sm font-semibold tracking-tight">
            Trace sampling
          </h3>
          <p className="text-[13px] leading-5 text-muted-foreground">
            Share of <span className="font-mono text-xs">checkout-api</span>{" "}
            requests that keep a full trace.
          </p>
        </div>
        <p
          role="status"
          className="flex h-5 shrink-0 items-center gap-1.5 text-xs text-muted-foreground"
        >
          {status === "saving" && (
            <>
              <IconLoader2
                aria-hidden="true"
                className="size-3.5 motion-safe:animate-spin"
              />
              Saving…
            </>
          )}
          {status === "saved" && (
            <>
              <IconCheck
                aria-hidden="true"
                className="size-3.5 text-emerald-700 dark:text-emerald-400"
              />
              Saved
            </>
          )}
        </p>
      </header>

      <RangeSlider
        className="mt-6"
        label="Sampling rate"
        value={rate}
        onValueChange={setRate}
        onValueCommit={() => {
          setStatus("saving");
          window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => setStatus("saved"), 700);
        }}
        min={0}
        max={100}
        step={1}
        marks={marks}
        formatValue={(value) => (value === 0 ? "Off" : `${value}%`)}
        showInputs
        inputSuffix="%"
      />

      <dl className="mt-5 grid gap-2 @md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex min-w-0 items-baseline justify-between gap-3 rounded-xl bg-muted/40 px-3 py-2.5 ring-1 ring-border/60 ring-inset @md:block"
          >
            <dt className="truncate text-xs text-muted-foreground">{stat.label}</dt>
            <dd className="text-base font-semibold tracking-[-0.02em] tabular-nums @md:mt-0.5">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
