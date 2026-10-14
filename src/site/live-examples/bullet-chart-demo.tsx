import {
  BulletChart,
  type BulletChartItem,
} from "@/registry/overtrue/bullet-chart";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const targets: BulletChartItem[] = [
  {
    id: "revenue",
    label: "Revenue",
    sublabel: "Booked this quarter",
    value: 812000,
    target: 900000,
    ranges: [600000, 800000, 1000000],
    valueFormatter: (value) => currency.format(value),
  },
  {
    id: "clients",
    label: "New clients",
    sublabel: "Signed contracts",
    value: 14,
    target: 12,
    ranges: [6, 10, 16],
  },
  {
    id: "utilization",
    label: "Utilization",
    sublabel: "Billable hours",
    value: 74,
    target: 80,
    ranges: [60, 75, 100],
    valueFormatter: (value) => `${value}%`,
  },
  {
    id: "nps",
    label: "Client NPS",
    sublabel: "Post-delivery survey",
    value: 52,
    target: 45,
    ranges: [20, 40, 70],
  },
  {
    id: "response",
    label: "Avg. response time",
    sublabel: "Support, lower is better",
    value: 4.6,
    target: 4,
    ranges: [3, 5, 8],
    invert: true,
    valueFormatter: (value) => `${value.toFixed(1)} h`,
  },
];

export default function BulletChartDemo() {
  return (
    <BulletChart
      title="Q3 studio targets"
      description="Acme Studio, quarter to date"
      items={targets}
    />
  );
}
