// Original overtrue/ui components for live, operational dashboards.
// Each entry lives in its own module so examples and documentation stay together.
import numberTicker from "./live-catalog/number-ticker.ts";
import liveChart from "./live-catalog/live-chart.ts";
import logStream from "./live-catalog/log-stream.ts";
import cohortGrid from "./live-catalog/cohort-grid.ts";
import bulletChart from "./live-catalog/bullet-chart.ts";
import hostMap from "./live-catalog/host-map.ts";
import spotlightCard from "./live-catalog/spotlight-card.ts";
import realtimeMonitor from "./live-catalog/realtime-monitor.ts";

export const liveCatalog = [
  numberTicker,
  liveChart,
  logStream,
  cohortGrid,
  bulletChart,
  hostMap,
  spotlightCard,
  realtimeMonitor,
] as const;
