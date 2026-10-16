import { RevenueOverview, sampleRevenue } from "@/registry/overtrue/revenue-overview";
import { ModelUsage, sampleModelUsage } from "@/registry/overtrue/model-usage";
import { useEffect, useState } from "react";
import { Go, Scene } from "./shared";

export function Revenue() {
  return (
    <Scene
      id="revenue"
      title="Revenue"
      description="Subscriptions, expansion, and churn for the month, against plan."
      actions={<Go to="/invoice">Open invoices</Go>}
    >
      <RevenueOverview
        className="scene-embed"
        data={{ ...sampleRevenue, title: "Subscriptions" }}
      />
    </Scene>
  );
}

export function AiUsage() {
  const [streaming, setStreaming] = useState(false);
  useEffect(() => {
    if (!streaming) return;
    const timer = window.setTimeout(() => setStreaming(false), 2400);
    return () => window.clearTimeout(timer);
  }, [streaming]);
  return (
    <Scene
      id="ai-usage"
      title="AI usage"
      description="Requests, tokens, and spend across the models behind the studio's assistant."
      actions={<Go to="/operations-overview">Open operations</Go>}
    >
      <ModelUsage
        className="scene-embed"
        data={sampleModelUsage}
        summaryStreaming={streaming}
        onRegenerateSummary={() => setStreaming(true)}
      />
    </Scene>
  );
}
