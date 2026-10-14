export default {
  name: "realtime-monitor",
  title: "Realtime monitor",
  category: "Blocks",
  description:
    "A live operations console that combines throughput, fleet health, objectives, and an event stream.",
  dependencies: [],
  imports: "RealtimeMonitor, useSimulatedTelemetry",
  exampleImports: 'import { useState } from "react"',
  usage: `function Example() {
  const [paused, setPaused] = useState(false)
  const data = useSimulatedTelemetry({ paused })
  return <RealtimeMonitor data={data} paused={paused} onPausedChange={setPaused} />
}`,
  notes:
    "The monitor renders whatever Telemetry you pass in: a rolling requests and latency window, the current error rate and sessions, hosts, events, and objectives. useSimulatedTelemetry produces sample data for prototypes; replace it with a hook that reads your metrics stream (WebSocket, SSE, or polling) and keeps the same shape. Keep the window length constant so the chart glides instead of rescaling. Pausing stops the simulation; with your own data, use onPausedChange to stop applying updates.",
  previewWidth: 1180,
  previewHeight: 760,
  examples: [
    {
      name: "realtime-monitor-demo",
      title: "Production at a glance",
      description:
        "Simulated traffic for an API across three regions. Pause the stream, hover the chart, and inspect individual hosts.",
    },
  ],
  api: [
    [
      "data",
      "Telemetry",
      "requests and latency windows, errorRate, activeSessions, hosts, events, and objectives, with optional previous values for comparisons.",
    ],
    ["title / environment", "string", "Heading and the hostname or cluster under it."],
    ["paused", "boolean", "Shows the paused state in the header."],
    [
      "onPausedChange",
      "(paused: boolean) => void",
      "Adds a Pause/Resume control. Omit it for a read-only display.",
    ],
    ["interval", "number", "Milliseconds between samples, so the chart glide matches your data rate."],
  ],
} as const;
