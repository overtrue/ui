import { useState, type ReactNode } from "react";
import { IconArrowsShuffle } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  NumberTicker,
  type NumberTickerProps,
} from "@/registry/overtrue/number-ticker";

interface Sample {
  id: string;
  label: string;
  code: string;
  props: Omit<NumberTickerProps, "value">;
  range: [number, number];
  /** Round shuffled values to 1/precision. */
  precision?: number;
  suffix?: ReactNode;
}

const samples: Sample[] = [
  {
    id: "seats",
    label: "Active seats",
    code: 'format="number"',
    props: { format: "number" },
    range: [800, 24000],
  },
  {
    id: "invoiced",
    label: "Invoiced this month",
    code: 'format="currency"',
    props: { format: "currency" },
    range: [9000, 128000],
    precision: 100,
  },
  {
    id: "churn",
    label: "Monthly churn",
    code: 'format="percent"',
    props: { format: "percent" },
    range: [0.008, 0.124],
    precision: 1000,
  },
  {
    id: "views",
    label: "Portfolio views",
    code: 'format="compact"',
    props: { format: "compact" },
    range: [8000, 4200000],
  },
  {
    id: "eu",
    label: "Berlin studio",
    code: 'locale="de-DE" currency="EUR"',
    props: { format: "currency", locale: "de-DE", currency: "EUR" },
    range: [4000, 96000],
    precision: 100,
  },
  {
    id: "latency",
    label: "Median preview render",
    code: "suffix={<span>ms</span>}",
    props: { formatOptions: { maximumFractionDigits: 0 } },
    range: [80, 1400],

    suffix: (
      <span className="ml-1 text-base font-medium text-muted-foreground">
        ms
      </span>
    ),
  },
];

const initial: Record<string, number> = {
  seats: 1284,
  invoiced: 36800.5,
  churn: 0.032,
  views: 184200,
  eu: 12480.9,
  latency: 312,
};

function shuffle(values: Record<string, number>) {
  const next = { ...values };
  for (const sample of samples) {
    const [low, high] = sample.range;
    const precision = sample.precision ?? 1;
    next[sample.id] =
      Math.round((low + Math.random() * (high - low)) * precision) / precision;
  }
  return next;
}

export default function NumberTickerFormatsDemo() {
  const [values, setValues] = useState(initial);
  return (
    <div className="@container w-full">
      <div className="rounded-xl border bg-card text-card-foreground shadow-xs">
        <div className="flex flex-col items-start gap-3 border-b px-5 py-4 @sm:flex-row @sm:items-center @sm:justify-between @sm:gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium">Formatting presets</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Intl.NumberFormat output, rolled digit by digit.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setValues(shuffle)}
          >
            <IconArrowsShuffle aria-hidden="true" />
            Shuffle values
          </Button>
        </div>
        <dl className="grid grid-cols-1 @sm:grid-cols-2 @2xl:grid-cols-3">
          {samples.map((sample) => (
            <div
              key={sample.id}
              className="min-w-0 border-b px-5 py-4 last:border-b-0 @sm:border-r @sm:[&:nth-child(2n)]:border-r-0 @sm:[&:nth-last-child(-n+2)]:border-b-0 @2xl:[&:nth-child(2n)]:border-r @2xl:[&:nth-child(3n)]:border-r-0 @2xl:[&:nth-last-child(-n+3)]:border-b-0"
            >
              <dt className="truncate text-xs text-muted-foreground">
                {sample.label}
              </dt>
              <dd className="mt-1.5 text-3xl font-semibold tracking-tight">
                <NumberTicker
                  value={values[sample.id]}
                  suffix={sample.suffix}
                  {...sample.props}
                />
              </dd>
              <dd className="mt-2 truncate font-mono text-[10px] text-muted-foreground">
                {sample.code}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
