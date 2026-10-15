import { useState } from "react";
import {
  RealtimeMonitor,
  useSimulatedTelemetry,
} from "@/registry/overtrue/realtime-monitor";

export default function RealtimeMonitorDemo() {
  const [paused, setPaused] = useState(false);
  const data = useSimulatedTelemetry({ paused });
  return (
    <RealtimeMonitor data={data} paused={paused} onPausedChange={setPaused} />
  );
}
