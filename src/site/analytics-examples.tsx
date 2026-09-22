import { useState } from "react";
import {
  IconBolt,
  IconWorld,
  IconLink,
  IconMail,
  IconSearch,
  IconUsers,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Sparkline } from "@/registry/overtrue/sparkline";
import { RankedList } from "@/registry/overtrue/ranked-list";
import { ConversionFunnel } from "@/registry/overtrue/conversion-funnel";
import {
  AnalyticsOverview,
  analyticsReports,
} from "@/registry/overtrue/analytics-overview";
import type { ItemName } from "./catalog";

const icons = [IconSearch, IconWorld, IconLink, IconUsers, IconMail];
export function AnalyticsExample({
  name,
  expanded,
}: {
  name: ItemName;
  expanded?: boolean;
}) {
  const [empty, setEmpty] = useState(false);
  const report = analyticsReports[1];
  if (name === "analytics-overview") return <AnalyticsOverview />;
  if (name === "sparkline")
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="flex items-center gap-2 text-sm font-medium">
            <IconBolt className="size-4 text-muted-foreground" />
            Weekly sessions
          </p>
          <Sparkline
            label="Weekly sessions"
            data={report.traffic.map((point) => point.value)}
          />
          <p className="text-xs text-muted-foreground">
            8,800 sessions · September 15–21
          </p>
        </div>
        {expanded && (
          <div className="grid gap-6 border-t pt-5 sm:grid-cols-2">
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">Line only</p>
              <Sparkline
                label="Daily jobs"
                data={[10, 14, 12, 18, 15, 20]}
                filled={false}
              />
            </div>
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">Steady activity</p>
              <Sparkline label="Daily jobs, steady" data={[12, 12, 12, 12]} />
            </div>
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">One observation</p>
              <Sparkline label="Daily jobs, first observation" data={[12]} />
            </div>
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                No observations yet
              </p>
              <Sparkline label="Daily jobs, awaiting data" data={[]} />
            </div>
          </div>
        )}
      </div>
    );
  const control = expanded && (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={() => setEmpty(!empty)}
    >
      {empty ? "Restore sample data" : "Preview empty state"}
    </Button>
  );
  if (name === "ranked-list")
    return (
      <div className="space-y-4">
        <RankedList
          label="Traffic sources"
          items={
            empty
              ? []
              : report.sources.map((source, index) => {
                  const Icon = icons[index];
                  return { ...source, icon: <Icon /> };
                })
          }
        />
        {control}
      </div>
    );
  if (name === "conversion-funnel")
    return (
      <div className="space-y-5">
        <ConversionFunnel
          label="Trial conversion"
          stages={empty ? [] : report.stages}
        />
        {control}
      </div>
    );
  return null;
}
