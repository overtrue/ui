import { useState } from "react";
import { IconArrowBackUp } from "@tabler/icons-react";
import { RangeSlider, countInRange } from "@/registry/overtrue/range-slider";
import { cn } from "@/lib/utils";

/** Repeatable pseudo-random numbers, so the catalog looks the same on every visit. */
function random(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 400 fictional products in an outdoor gear shop: lots of everyday kit around
// $400 and a second hump of tents and bikes past $1,000.
const prices = (() => {
  const next = random(27);
  const gauss = () =>
    Math.sqrt(-2 * Math.log(1 - next())) * Math.cos(2 * Math.PI * next());
  return Array.from({ length: 400 }, () => {
    const price =
      next() < 0.74 ? Math.exp(Math.log(380) + gauss() * 0.62) : 1240 + gauss() * 230;
    return Math.round(Math.min(1995, Math.max(19, price)) / 5) * 5 - 1;
  });
})();

const INITIAL: [number, number] = [400, 950];
const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const formatPrice = (value: number) =>
  value >= 2000 ? "$2,000+" : usd.format(value);

export default function RangeSliderDemo() {
  const [range, setRange] = useState<[number, number]>(INITIAL);
  const [announced, setAnnounced] = useState(() => countInRange(prices, INITIAL));
  const count = countInRange(prices, range);
  const changed = range[0] !== INITIAL[0] || range[1] !== INITIAL[1];

  return (
    <section
      aria-labelledby="price-filter-title"
      className="rounded-2xl border border-border/70 bg-card p-5 text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]"
    >
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 id="price-filter-title" className="text-sm font-semibold tracking-tight">
            Price
          </h3>
          <p className="text-[13px] leading-5 text-muted-foreground">
            Before shipping and taxes
          </p>
        </div>
        <p className="shrink-0 text-end">
          <span className="text-xl font-semibold tracking-[-0.02em] tabular-nums">
            {count}
          </span>
          <span className="ms-1.5 text-sm font-medium text-muted-foreground">
            {count === 1 ? "product" : "products"}
          </span>
        </p>
      </header>

      <RangeSlider
        className="mt-4"
        label="Price"
        min={0}
        max={2000}
        step={10}
        minDistance={50}
        values={prices}
        bins={40}
        histogramHeight={72}
        value={range}
        onValueChange={setRange}
        onValueCommit={(next) => setAnnounced(countInRange(prices, next))}
        formatValue={formatPrice}
        showInputs
        inputPrefix="$"
      />

      <footer className="mt-5 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
        <button
          type="button"
          disabled={!changed}
          onClick={() => {
            setRange(INITIAL);
            setAnnounced(countInRange(prices, INITIAL));
          }}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium text-muted-foreground transition-colors duration-150 outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
        >
          <IconArrowBackUp aria-hidden="true" className="size-4" />
          Reset
        </button>
        <button
          type="button"
          className={cn(
            "inline-flex h-8 items-center rounded-lg bg-primary px-3 text-[13px] font-medium text-primary-foreground shadow-xs transition-colors duration-150 outline-none hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "tabular-nums",
          )}
        >
          Show {count} {count === 1 ? "product" : "products"}
        </button>
      </footer>
      <p role="status" className="sr-only">
        {announced} {announced === 1 ? "product" : "products"} in range
      </p>
    </section>
  );
}
