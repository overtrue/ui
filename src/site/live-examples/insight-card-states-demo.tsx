import { useState } from "react";
import {
  InsightCard,
  type InsightStatus,
} from "@/registry/overtrue/insight-card";

const DONE =
  "p95 latency is back to normal at {{metric:p95|−182 ms|positive}} after the cache rollout {{cite:1}}. Error rate held at {{metric:5xx|0.02%|neutral}} throughout.";

export default function Demo() {
  const [retryStatus, setRetryStatus] = useState<InsightStatus>("error");

  return (
    <div className="@container">
      <div className="grid gap-4 @2xl:grid-cols-3">
        <InsightCard
          title="Anomaly scan"
          source="checkout-api"
          status="thinking"
          onStop={() => {}}
        />
        <InsightCard
          title="Cohort read-out"
          source="Sep cohort"
          status={retryStatus}
          text={
            retryStatus === "done"
              ? "Week-4 retention is {{metric:Retention|+3.1 pts}} above the August cohort."
              : ""
          }
          error="The warehouse query timed out after 30 s."
          onRegenerate={() => {
            // Alternate so the card can be retried into either outcome.
            const next = retryStatus === "error" ? "done" : "error";
            setRetryStatus("thinking");
            window.setTimeout(() => setRetryStatus(next), 1400);
          }}
        />
        <InsightCard
          title="Incident recap"
          source="INC-2041"
          status="done"
          text={DONE}
          sources={[{ id: "deploy", label: "Deploy 7d1e3fa" }]}
          defaultFeedback="up"
          onRegenerate={() => {}}
        />
      </div>
    </div>
  );
}
