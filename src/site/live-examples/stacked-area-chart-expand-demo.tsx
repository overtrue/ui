import * as React from "react";
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
} from "@tabler/icons-react";

import {
  StackedAreaChart,
  type StackedAreaSeries,
  type StackedAreaStack,
} from "@/registry/overtrue/stacked-area-chart";
import { cn } from "@/lib/utils";

const regions: StackedAreaSeries[] = [
  { key: "na", label: "North America" },
  { key: "eu", label: "Europe" },
  { key: "apac", label: "Asia Pacific" },
  { key: "latam", label: "Latin America" },
  { key: "mea", label: "Middle East and Africa" },
];

// Peak hour in UTC and baseline requests per hour for each region.
const profile: Record<string, { peak: number; base: number }> = {
  na: { peak: 18, base: 182_000 },
  eu: { peak: 13, base: 156_000 },
  apac: { peak: 5, base: 128_000 },
  latam: { peak: 19, base: 54_000 },
  mea: { peak: 11, base: 41_000 },
};

/** Deterministic noise per hour and region, so live updates are repeatable. */
function jitter(hour: number, salt: number) {
  const x = Math.sin(hour * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const START = new Date(2026, 9, 12, 0, 0, 0).getTime();
const HOUR = 3_600_000;

function rowAt(hour: number) {
  const date = new Date(START + hour * HOUR);
  const pad = (v: number) => String(v).padStart(2, "0");
  const row: Record<string, string | number> = {
    // Local date-time strings keep the axis in the hours written here.
    time: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:00`,
  };
  regions.forEach((region, i) => {
    const { peak, base } = profile[region.key];
    const h = hour % 24;
    // A soft daily bump around the regional afternoon.
    const distance = Math.min(Math.abs(h - peak), 24 - Math.abs(h - peak));
    const daylight = 0.32 + 0.68 * Math.exp(-(distance * distance) / 32);
    row[region.key] = Math.round(base * daylight * (0.94 + jitter(hour, i) * 0.12));
  });
  return row;
}

const WINDOW = 48;
const modes: { value: StackedAreaStack; label: string }[] = [
  { value: "normal", label: "Stacked" },
  { value: "expand", label: "100%" },
  { value: "stream", label: "Stream" },
];

export default function Demo() {
  const [stack, setStack] = React.useState<StackedAreaStack>("expand");
  const [offset, setOffset] = React.useState(0);
  const [live, setLive] = React.useState(false);
  const data = React.useMemo(
    () => Array.from({ length: WINDOW }, (_, i) => rowAt(offset + i)),
    [offset],
  );

  // Each tick appends the next hour and drops the oldest; the chart glides between them.
  React.useEffect(() => {
    if (!live) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setOffset((value) => value + 1);
    }, 1400);
    return () => window.clearInterval(timer);
  }, [live]);

  const control = cn(
    "outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
  );

  return (
    <StackedAreaChart
      title="Traffic share by region"
      description="API requests per hour over the last two days, UTC."
      data={data}
      index="time"
      series={regions}
      stack={stack}
      height={260}
      valueFormatter={(value) =>
        value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value)
      }
      actions={
        <>
          <button
            type="button"
            aria-pressed={live}
            onClick={() => setLive((value) => !value)}
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground aria-pressed:text-foreground",
              control,
            )}
          >
            {live ? (
              <IconPlayerPauseFilled className="size-3" aria-hidden="true" />
            ) : (
              <IconPlayerPlayFilled className="size-3" aria-hidden="true" />
            )}
            Live
          </button>
          <div
            role="radiogroup"
            aria-label="Stacking"
            className="inline-flex h-7 items-center rounded-lg bg-muted/60 p-0.5 ring-1 ring-border/60 ring-inset"
          >
            {modes.map((mode) => (
              <button
                key={mode.value}
                type="button"
                role="radio"
                aria-checked={stack === mode.value}
                onClick={() => setStack(mode.value)}
                className={cn(
                  "h-full rounded-md px-2 text-xs font-medium text-muted-foreground tabular-nums transition-colors duration-150 hover:text-foreground",
                  "aria-checked:bg-card aria-checked:text-foreground aria-checked:shadow-xs",
                  control,
                )}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </>
      }
    />
  );
}
