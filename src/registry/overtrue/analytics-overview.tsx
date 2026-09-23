"use client";
import { useId, useState } from "react";
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconDownload,
  IconChevronDown,
  IconEye,
  IconTarget,
  IconUserPlus,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "./page-header";
import { StatCard } from "./stat-card";
import { MetricChart, type MetricPoint } from "./metric-chart";
import { RankedList, type RankedListItem } from "./ranked-list";
import { ConversionFunnel, type FunnelStage } from "./conversion-funnel";
import { cn } from "@/lib/utils";

export interface AnalyticsReport {
  id: string;
  label: string;
  description: string;
  traffic: MetricPoint[];
  sources: RankedListItem[];
  /** Ordered from sessions to conversions; the first stage should match traffic. */
  stages: FunnelStage[];
  previousConversions: number;
}

export const analyticsReports: AnalyticsReport[] = [
  {
    id: "30-days",
    label: "Last 30 days",
    description: "August 23 – September 21, 2026",
    traffic: [
      { label: "Aug 23", value: 4280, previous: 3840 },
      { label: "Aug 28", value: 5120, previous: 4480 },
      { label: "Sep 2", value: 4680, previous: 4120 },
      { label: "Sep 7", value: 5640, previous: 4920 },
      { label: "Sep 12", value: 6240, previous: 5280 },
      { label: "Sep 17", value: 6840, previous: 5860 },
    ],
    sources: [
      { id: "search", label: "Organic search", value: 14432 },
      { id: "direct", label: "Direct", value: 8200 },
      { id: "referral", label: "Referrals", value: 5576 },
      { id: "social", label: "Social", value: 3280 },
      { id: "email", label: "Email", value: 1312 },
    ],
    stages: [
      { id: "sessions", label: "Sessions", value: 32800 },
      { id: "pricing", label: "Viewed pricing", value: 8200 },
      { id: "trial", label: "Started a trial", value: 1640 },
      { id: "subscribed", label: "Subscribed", value: 492 },
    ],
    previousConversions: 342,
  },
  {
    id: "7-days",
    label: "Last 7 days",
    description: "September 15 – 21, 2026",
    traffic: [
      { label: "Tue", value: 980, previous: 860 },
      { label: "Wed", value: 1120, previous: 940 },
      { label: "Thu", value: 1050, previous: 1080 },
      { label: "Fri", value: 1360, previous: 1120 },
      { label: "Sat", value: 1240, previous: 1060 },
      { label: "Sun", value: 1480, previous: 1260 },
      { label: "Mon", value: 1570, previous: 1380 },
    ],
    sources: [
      { id: "search", label: "Organic search", value: 3784 },
      { id: "direct", label: "Direct", value: 2200 },
      { id: "referral", label: "Referrals", value: 1584 },
      { id: "social", label: "Social", value: 880 },
      { id: "email", label: "Email", value: 352 },
    ],
    stages: [
      { id: "sessions", label: "Sessions", value: 8800 },
      { id: "pricing", label: "Viewed pricing", value: 2376 },
      { id: "trial", label: "Started a trial", value: 528 },
      { id: "subscribed", label: "Subscribed", value: 176 },
    ],
    previousConversions: 139,
  },
];

const sum = (values: number[]) =>
  values.reduce(
    (total, value) => total + (Number.isFinite(value) ? Math.max(0, value) : 0),
    0,
  );
function comparison(current: number, previous: number) {
  const delta =
    previous > 0 ? ((current - previous) / previous) * 100 : undefined;
  return {
    change: delta === undefined ? undefined : `${Math.abs(delta).toFixed(1)}%`,
    trend:
      delta === undefined || delta === 0
        ? ("neutral" as const)
        : delta > 0
          ? ("up" as const)
          : ("down" as const),
  };
}

/** A complete demo by default; pass reports from your own analytics endpoint. */
export function AnalyticsOverview({
  reports = analyticsReports,
  className,
}: {
  reports?: AnalyticsReport[];
  className?: string;
}) {
  const periodId = useId();
  const [selected, setSelected] = useState(reports[0]?.id);
  const report = reports.find((item) => item.id === selected) ?? reports[0];
  const sessions = sum(report?.traffic.map((point) => point.value) ?? []);
  const previousSessions = sum(
    report?.traffic.map((point) => point.previous ?? 0) ?? [],
  );
  const conversions = sum([report?.stages.at(-1)?.value ?? 0]);
  const previousConversions = sum([report?.previousConversions ?? 0]);
  const conversion = sessions ? (conversions / sessions) * 100 : 0;
  const previousConversion = previousSessions
    ? (previousConversions / previousSessions) * 100
    : 0;
  const hasComparison = Boolean(
    report?.traffic.length &&
    report.traffic.every((point) => Number.isFinite(point.previous)),
  );
  const improved = conversion >= previousConversion;
  const TrendIcon = improved ? IconArrowUpRight : IconArrowDownRight;

  function exportReport() {
    if (!report) return;
    const rows = [
      ["Section", "Label", "Current", "Previous"],
      ...report.traffic.map((point) => [
        "Traffic",
        point.label,
        point.value,
        point.previous ?? "",
      ]),
      ...report.sources.map((source) => [
        "Source",
        source.label,
        source.value,
        "",
      ]),
      ...report.stages.map((stage) => ["Funnel", stage.label, stage.value, ""]),
    ];
    const csv = rows
      .map((row) =>
        row
          .map((value) => {
            const text = String(value);
            return `"${(/^[=+\-@\t\r]/.test(text) ? "'" + text : text).replaceAll('"', '""')}"`;
          })
          .join(","),
      )
      .join("\r\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "analytics-report.csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <section
      data-slot="analytics-overview"
      aria-label="Acquisition analytics"
      className={cn(
        "@container min-w-0 space-y-5 rounded-xl border bg-background p-4 text-foreground sm:p-6",
        className,
      )}
    >
      <PageHeader
        eyebrow="Analytics"
        title="Acquisition overview"
        description={
          report?.description ?? "Connect your analytics to get started."
        }
        actions={
          <>
            <label className="sr-only" htmlFor={periodId}>
              Analytics period
            </label>
            <div className="relative">
              <select
                id={periodId}
                value={report?.id ?? ""}
                disabled={!reports.length}
                onChange={(event) => setSelected(event.target.value)}
                className="h-8 max-w-full appearance-none rounded-md border bg-card py-0 pl-3 pr-8 text-xs font-medium leading-8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {!reports.length && <option value="">No reports</option>}
                {reports.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <IconChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
                stroke={1.7}
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-3 text-xs font-medium shadow-none"
              disabled={!report}
              onClick={exportReport}
            >
              <IconDownload aria-hidden="true" className="size-3.5" />
              Export
            </Button>
          </>
        }
      />
      <div className="grid gap-4 @min-[36rem]:grid-cols-3">
        <StatCard
          title="Sessions"
          value={sessions}
          icon={<IconEye />}
          {...comparison(sessions, hasComparison ? previousSessions : 0)}
          description={
            hasComparison && previousSessions
              ? "vs. previous period"
              : "No previous comparison"
          }
        />
        <StatCard
          title="New subscriptions"
          value={conversions}
          icon={<IconUserPlus />}
          {...comparison(conversions, hasComparison ? previousConversions : 0)}
          description={
            hasComparison && previousConversions
              ? "vs. previous period"
              : "No previous comparison"
          }
        />
        <StatCard
          title="Conversion rate"
          value={sessions ? `${conversion.toFixed(2)}%` : "—"}
          icon={<IconTarget />}
          {...comparison(conversion, hasComparison ? previousConversion : 0)}
          description={
            hasComparison && previousConversion
              ? "vs. previous period"
              : "Subscriptions / sessions"
          }
        />
      </div>
      <MetricChart
        title="Traffic over time"
        seriesLabel="Sessions"
        comparisonLabel="Previous period"
        description={
          report?.label === "Last 30 days"
            ? "Sessions grouped into five-day intervals"
            : report?.label
        }
        data={report?.traffic ?? []}
        height={250}
      />
      <div className="grid gap-4 @min-[42rem]:grid-cols-2">
        <Card className="min-w-0 gap-0 rounded-lg bg-card py-0 shadow-none">
          <CardHeader className="flex flex-col items-start gap-1 border-b px-5 py-4 [.border-b]:pb-4">
            <CardTitle className="text-sm font-semibold">
              Acquisition sources
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Sessions and share of tracked traffic
            </p>
          </CardHeader>
          <CardContent className="p-5">
            <RankedList
              label="Acquisition sources"
              items={report?.sources ?? []}
            />
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              {report?.sources.length
                ? `Tracked across ${report.sources.length} acquisition channels.`
                : "Sources will appear when traffic is recorded."}
            </p>
          </CardContent>
        </Card>
        <Card className="min-w-0 gap-0 rounded-lg bg-card py-0 shadow-none">
          <CardHeader className="flex flex-col items-start gap-1 border-b px-5 py-4 [.border-b]:pb-4">
            <CardTitle className="text-sm font-semibold">
              From visit to subscription
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Follow the journey through each step
            </p>
          </CardHeader>
          <CardContent className="p-5">
            <ConversionFunnel
              label="Subscription conversion"
              stages={report?.stages ?? []}
            />
          </CardContent>
        </Card>
      </div>
      {sessions > 0 && hasComparison && previousSessions > 0 && (
        <div className="flex items-start gap-3 rounded-lg border bg-card px-4 py-3 text-sm">
          <TrendIcon
            aria-hidden="true"
            className={cn(
              "mt-0.5 size-4 shrink-0",
              improved
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-destructive",
            )}
          />
          <p className="m-0 leading-6 text-muted-foreground">
            <span className="font-medium text-foreground">
              {conversion === previousConversion
                ? "Conversion is steady."
                : improved
                  ? "Conversion is improving."
                  : "Conversion needs attention."}
            </span>{" "}
            {conversions.toLocaleString("en-US")} sessions became subscriptions,
            a {conversion.toFixed(2)}% conversion rate
            {conversion === previousConversion
              ? "."
              : ` — ${Math.abs(conversion - previousConversion).toFixed(2)} percentage points ${improved ? "above" : "below"} the previous period.`}
          </p>
        </div>
      )}
    </section>
  );
}
