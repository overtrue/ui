import { useMemo, useState } from "react";
import { IconArrowDownRight, IconArrowUpRight } from "@tabler/icons-react";
import {
  DateRangePicker,
  formatDateRange,
  presetRanges,
  previousPeriod,
  type DateRange,
} from "@/registry/overtrue/date-range-picker";
import { cn } from "@/lib/utils";

// Acme Studio's storefront, seen on Thursday 15 October 2026.
const TODAY = new Date(2026, 9, 15);
const lastMonth = presetRanges(TODAY).find((preset) => preset.id === "last-month")!;

/** Repeatable noise in [0, 1) for a day number. */
function noise(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function day(date: Date) {
  const n = Math.round(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000,
  );
  const weekend = date.getDay() === 0 || date.getDay() === 6 ? 0.76 : 1;
  const trend = 1 + (n - 20_200) * 0.0011;
  const revenue = 4_150 * weekend * trend * (0.82 + noise(n) * 0.36);
  const orders = revenue / (78 + noise(n + 7) * 22);
  const sessions = orders / (0.024 + noise(n + 13) * 0.009);
  return { date, revenue, orders, sessions };
}

function days(range: DateRange) {
  const out = [];
  for (
    let d = new Date(range.from);
    d <= range.to;
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
  )
    out.push(day(d));
  return out;
}

function totals(range: DateRange) {
  const list = days(range);
  const revenue = list.reduce((sum, d) => sum + d.revenue, 0);
  const orders = list.reduce((sum, d) => sum + d.orders, 0);
  const sessions = list.reduce((sum, d) => sum + d.sessions, 0);
  return { revenue, orders, aov: revenue / orders, conversion: orders / sessions };
}

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const cents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});
const count = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const percent = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 2,
});
const axis = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

function Delta({ value }: { value: number }) {
  const up = value >= 0;
  const Icon = up ? IconArrowUpRight : IconArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-px text-[11px] font-medium tabular-nums",
        up
          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
          : "bg-rose-500/10 text-rose-700 dark:text-rose-400",
      )}
    >
      <Icon aria-hidden="true" className="size-3" />
      {Math.abs(value * 100).toFixed(1)}%
    </span>
  );
}

export default function Demo() {
  const [open, setOpen] = useState(true);
  const [range, setRange] = useState<DateRange>({
    from: lastMonth.from,
    to: lastMonth.to,
  });
  const current = useMemo(() => totals(range), [range]);
  const previous = useMemo(() => totals(previousPeriod(range)), [range]);
  const bars = useMemo(() => {
    const list = days(range);
    // Long ranges read better as weekly buckets.
    const size = list.length > 62 ? 7 : 1;
    const buckets = [];
    for (let i = 0; i < list.length; i += size) {
      const slice = list.slice(i, i + size);
      buckets.push({
        date: slice[0].date,
        revenue: slice.reduce((sum, d) => sum + d.revenue, 0) / slice.length,
      });
    }
    return buckets;
  }, [range]);
  const peak = Math.max(...bars.map((bar) => bar.revenue));

  const kpis = [
    { label: "Revenue", value: money.format(current.revenue), delta: current.revenue / previous.revenue - 1 },
    { label: "Orders", value: count.format(current.orders), delta: current.orders / previous.orders - 1 },
    { label: "Average order", value: cents.format(current.aov), delta: current.aov / previous.aov - 1 },
    { label: "Conversion", value: percent.format(current.conversion), delta: current.conversion / previous.conversion - 1 },
  ];

  return (
    <div className="pb-6">
      <section
        aria-label="Revenue"
        className={cn(
          "@container relative min-h-[30rem] rounded-2xl border border-border/70 bg-card bg-[radial-gradient(120%_70%_at_50%_-10%,color-mix(in_oklab,var(--color-primary)_9%,transparent),transparent_65%)] p-5 text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]",
          // Leave room for the open panel on phones, where its rows are taller.
          open && "max-sm:min-h-[39rem]",
        )}
      >
        <header className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold tracking-tight">Revenue</h3>
            <p className="truncate text-[13px] leading-5 text-muted-foreground">
              Storefront orders, net of refunds
            </p>
          </div>
          <DateRangePicker
            inline
            open={open}
            onOpenChange={setOpen}
            align="end"
            locale="en-US"
            today={TODAY}
            maxDate={TODAY}
            value={range}
            onChange={setRange}
            aria-label={`Reporting period, ${formatDateRange(range, "en-US")}`}
            className="min-w-0 shrink-0"
          />
        </header>

        <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-border/60 ring-1 ring-border/60 @xl:grid-cols-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="min-w-0 bg-card px-4 py-3">
              <dt className="text-xs text-muted-foreground">{kpi.label}</dt>
              <dd className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-xl font-semibold tracking-[-0.02em] tabular-nums">
                  {kpi.value}
                </span>
                <Delta value={kpi.delta} />
              </dd>
            </div>
          ))}
        </dl>

        <figure className="mt-5">
          <figcaption className="flex items-baseline justify-between text-xs text-muted-foreground">
            <span>Daily revenue</span>
            <span className="tabular-nums">vs {formatDateRange(previousPeriod(range), "en-US")}</span>
          </figcaption>
          <div
            aria-hidden="true"
            className="relative mt-3 flex h-44 items-end gap-[3px] border-b border-border/60"
          >
            {[0.25, 0.5, 0.75].map((line) => (
              <span
                key={line}
                className="absolute inset-x-0 border-t border-dashed border-[color-mix(in_oklab,var(--color-foreground)_7%,transparent)]"
                style={{ bottom: `${line * 100}%` }}
              />
            ))}
            {bars.map((bar) => (
              <span
                key={bar.date.getTime()}
                className="relative min-w-0 flex-1 rounded-t-[4px] bg-linear-to-t from-primary/70 to-primary transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                style={{ height: `${(bar.revenue / peak) * 100}%` }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-muted-foreground tabular-nums">
            <span>{axis.format(range.from)}</span>
            <span>{axis.format(range.to)}</span>
          </div>
        </figure>
      </section>
    </div>
  );
}
