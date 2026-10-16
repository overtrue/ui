import { useEffect, useState } from "react";
import { ModelUsage, sampleModelUsage } from "@/registry/overtrue/model-usage";

export default function ModelUsageDemo() {
  const [streaming, setStreaming] = useState(false);
  useEffect(() => {
    if (!streaming) return;
    const timer = window.setTimeout(() => setStreaming(false), 2400);
    return () => window.clearTimeout(timer);
  }, [streaming]);
  return (
    <ModelUsage
      data={sampleModelUsage}
      summaryStreaming={streaming}
      onRegenerateSummary={() => setStreaming(true)}
    />
  );
}
