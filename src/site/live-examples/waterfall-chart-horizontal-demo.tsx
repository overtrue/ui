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

const percent = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

// Q3 operating income, from revenue down to operating profit.
const steps: WaterfallStep[] = [
  { id: "revenue", label: "Revenue", value: 1284000, kind: "start" },
  { id: "hosting", label: "Hosting & infra", value: -238000 },
  { id: "contractors", label: "Contractors", value: -146000 },
  { id: "gross", label: "Gross profit", value: 0, kind: "subtotal" },
  { id: "payroll", label: "Payroll", value: -512000 },
  { id: "marketing", label: "Marketing", value: -94000 },
  { id: "tools", label: "Software & tools", value: -41000 },
  { id: "credits", label: "R&D tax credit", value: 36000 },
  { id: "operating", label: "Operating income", value: 0, kind: "end" },
];

export default function WaterfallChartHorizontalDemo() {
  return (
    <WaterfallChart
      title="Operating income bridge"
      description="Q3 2026, revenue to operating income"
      orientation="horizontal"
      steps={steps}
      baseline="zero"
      renderSummary={({ opening, closing, format }) => (
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-2xl leading-none font-semibold tracking-tight">
            {format(closing, "detail")}
          </span>
          {opening ? (
            <span className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground tabular-nums">
                {percent.format(closing / opening)}
              </span>{" "}
              operating margin
            </span>
          ) : null}
        </p>
      )}
      valueFormatter={(value, context) =>
        context === "detail" ? usd.format(value) : usdCompact.format(value)
      }
    />
  );
}
