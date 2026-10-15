import { useState } from "react";
import {
  IncidentReview,
  sampleIncident,
} from "@/registry/overtrue/incident-review";

export default function IncidentReviewDemo() {
  const [streaming, setStreaming] = useState(false);
  return (
    <IncidentReview
      incident={sampleIncident}
      streaming={streaming}
      onRegenerate={() => {
        setStreaming(true);
        window.setTimeout(() => setStreaming(false), 4000);
      }}
    />
  );
}
