import { useEffect, useState } from "react";
import {
  RevenueOverview,
  sampleRevenue,
  type RevenueOverviewData,
} from "@/registry/overtrue/revenue-overview";

// Deterministic "new subscription" amounts, so the demo is the same every visit.
const deals = [290, 49, 990, 149, 490, 49, 290, 149, 1490, 99];

function addDeal(data: RevenueOverviewData, amount: number): RevenueOverviewData {
  return {
    ...data,
    metrics: data.metrics.map((metric) =>
      metric.id === "mrr" || metric.id === "new"
        ? {
            ...metric,
            value: metric.value + amount,
            history: metric.history && [
              ...metric.history.slice(0, -1),
              metric.history[metric.history.length - 1] + amount / 1000,
            ],
          }
        : metric,
    ),
    movement: data.movement.map((step) =>
      step.id === "new" ? { ...step, value: step.value + amount } : step,
    ),
  };
}

export default function RevenueOverviewDemo() {
  const [data, setData] = useState(sampleRevenue);
  useEffect(() => {
    let index = 0;
    const timer = window.setInterval(() => {
      if (document.hidden || index >= deals.length) return;
      setData((current) => addDeal(current, deals[index++]));
    }, 3200);
    return () => window.clearInterval(timer);
  }, []);
  return <RevenueOverview data={data} />;
}
