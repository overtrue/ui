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
import treemap from "./live-catalog/treemap.ts";
import waterfallChart from "./live-catalog/waterfall-chart.ts";
import traceWaterfall from "./live-catalog/trace-waterfall.ts";
import latencyHistogram from "./live-catalog/latency-histogram.ts";
import geoMap from "./live-catalog/geo-map.ts";
import ganttChart from "./live-catalog/gantt-chart.ts";
import deployPipeline from "./live-catalog/deploy-pipeline.ts";
import insightCard from "./live-catalog/insight-card.ts";
import incidentReview from "./live-catalog/incident-review.ts";

export const liveCatalog = [
  numberTicker,
  liveChart,
  logStream,
  cohortGrid,
  bulletChart,
  hostMap,
  spotlightCard,
  realtimeMonitor,
  treemap,
  waterfallChart,
  traceWaterfall,
  latencyHistogram,
  geoMap,
  ganttChart,
  deployPipeline,
  insightCard,
  incidentReview,
] as const;
