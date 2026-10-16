import { useEffect, useState } from "react";
import { IconArrowUpRight } from "@tabler/icons-react";
import { NumberTicker } from "@/registry/overtrue/number-ticker";
import { cn } from "@/lib/utils";

interface Pulse {
  id: number;
  amount: number;
}

interface LiveRevenue {
  revenue: number;
  orders: number;
  sessions: number;
  latest: number;
  latestOrders: number;
  pulses: Pulse[];
}

// A fixed opening history keeps the first render identical on server and client.
const seed = [
  64, 112, 38, 95, 141, 72, 58, 126, 84, 47, 168, 91, 63, 132, 77, 104, 55, 149,
  88, 69, 117, 42, 98, 156, 81, 61, 137, 93, 74, 121, 52, 108, 143, 86, 97, 184,
];

const initial: LiveRevenue = {
  revenue: 48213.07,
  orders: 1284,
  sessions: 37912,
  latest: 184.2,
  latestOrders: 2,
  pulses: seed.map((amount, id) => ({ id, amount })),
};

function advance(state: LiveRevenue): LiveRevenue {
  const count = 1 + Math.floor(Math.random() * 3);
  let amount = 0;
  for (let i = 0; i < count; i++) amount += 18 + Math.random() * 118;
  amount = Math.round(amount * 100) / 100;
  const last = state.pulses[state.pulses.length - 1];
  return {
    revenue: Math.round((state.revenue + amount) * 100) / 100,
    orders: state.orders + count,
    sessions: state.sessions + 24 + Math.floor(Math.random() * 72),
    latest: amount,
    latestOrders: count,
    pulses: [...state.pulses.slice(1), { id: last.id + 1, amount }],
  };
}

export default function NumberTickerDemo() {
  const [live, setLive] = useState(initial);

  // Tick every 1.8s while the tab is visible; pause in the background.
  useEffect(() => {
    let timer: number | undefined;
    const start = () => {
      if (timer === undefined && !document.hidden)
        timer = window.setInterval(() => setLive(advance), 1800);
    };
    const stop = () => {
      window.clearInterval(timer);
      timer = undefined;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const peak = Math.max(...live.pulses.map((pulse) => pulse.amount));

  return (
    <div className="@container w-full">
      <section
        aria-label="Live revenue"
        className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs"
      >
        <div className="p-5 @md:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Gross revenue</span>
              <span aria-hidden="true" className="mx-1.5 opacity-50">
                /
              </span>
              Today
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/60 px-2 py-0.5 font-mono text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
              <span aria-hidden="true" className="relative flex size-1.5">
                <span className="absolute inline-flex size-full rounded-full bg-emerald-500 opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
              </span>
              Live
            </span>
          </div>

          <NumberTicker
            value={live.revenue}
            format="currency"
            highlightChanges
            className="mt-3 text-5xl leading-none font-semibold tracking-tight @md:text-6xl"
          />

          <p className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-0.5 font-medium text-emerald-700 dark:text-emerald-400">
              <IconArrowUpRight aria-hidden="true" className="size-4" />
              <NumberTicker
                value={live.latest}
                format="currency"
                prefix="+"
                duration={600}
              />
            </span>
            <span>
              from the latest {live.latestOrders === 1 ? "order" : "orders"}
            </span>
          </p>

          <div className="mt-5">
            <div aria-hidden="true" className="flex h-10 items-end gap-[3px]">
              {live.pulses.map((pulse, index) => {
                const latest = index === live.pulses.length - 1;
                return (
                  <span
                    key={pulse.id}
                    className={cn(
                      "min-w-0 flex-1 origin-bottom rounded-[2px] transition-[transform,height,background-color] duration-500 ease-out starting:[transform:scaleY(0)] motion-reduce:transition-none",
                      latest ? "bg-primary" : "bg-primary/20",
                    )}
                    style={{
                      height: `${Math.max(8, (pulse.amount / peak) * 100)}%`,
                    }}
                  />
                );
              })}
            </div>
            <div className="mt-1.5 flex justify-between font-mono text-[10px] text-muted-foreground">
              <span>−60s</span>
              <span>order value per update</span>
              <span>now</span>
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-3 divide-x border-t">
          <div className="min-w-0 px-5 py-4 @md:px-6">
            <dt className="text-xs text-muted-foreground">Orders</dt>
            <dd className="mt-1 text-xl font-semibold tracking-tight @md:text-2xl">
              <NumberTicker value={live.orders} highlightChanges />
            </dd>
          </div>
          <div className="min-w-0 px-5 py-4 @md:px-6">
            <dt className="text-xs text-muted-foreground">Conversion</dt>
            <dd className="mt-1 text-xl font-semibold tracking-tight @md:text-2xl">
              <NumberTicker
                value={live.orders / live.sessions}
                format="percent"
                formatOptions={{
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }}
                highlightChanges
              />
            </dd>
          </div>
          <div className="min-w-0 px-5 py-4 @md:px-6">
            <dt className="text-xs text-muted-foreground">Avg. order</dt>
            <dd className="mt-1 text-xl font-semibold tracking-tight @md:text-2xl">
              <NumberTicker
                value={live.revenue / live.orders}
                format="currency"
                highlightChanges
              />
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
