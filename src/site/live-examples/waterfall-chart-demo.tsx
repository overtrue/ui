import {
  WaterfallChart,
  type WaterfallStep,
} from "@/registry/overtrue/waterfall-chart";

const usdCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});
const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

// Acme Studio's subscription revenue movement for September.
const steps: WaterfallStep[] = [
  { id: "open", label: "Aug 31 MRR", value: 412300, kind: "start" },
  { id: "new", label: "New business", value: 38400 },
  { id: "expansion", label: "Expansion", value: 21750 },
  { id: "reactivation", label: "Reactivation", value: 4120 },
  { id: "contraction", label: "Contraction", value: -9260 },
  { id: "churn", label: "Churn", value: -24880 },
  { id: "close", label: "Sep 30 MRR", value: 0, kind: "end" },
];

export default function WaterfallChartDemo() {
  return (
    <WaterfallChart
      title="MRR bridge"
      description="Acme Studio subscriptions, September"
      steps={steps}
      valueFormatter={(value, context) =>
        context === "detail" ? usd.format(value) : usdCompact.format(value)
      }
    />
  );
}
