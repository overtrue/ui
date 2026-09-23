/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import * as React from "react";
import { IconRefresh as RefreshCw } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { formatNumber } from "@/registry/overtrue/metric-format";
import {
  DataTable,
  DataTableColumnHeader,
  createDataTableColumnHelper,
} from "@/registry/overtrue/advanced-data-table";
import { PeriodTabs } from "@/registry/overtrue/period-tabs";

type ChannelRow = {
  channel: string;
  enquiries: number;
  projects: number;
  booked: number;
};

type Period = "week" | "month" | "year";

const byPeriod: Record<Period, ChannelRow[]> = {
  week: [
    { channel: "Client referrals", enquiries: 8, projects: 2, booked: 8400 },
    { channel: "Returning clients", enquiries: 6, projects: 3, booked: 12600 },
    { channel: "Studio website", enquiries: 14, projects: 1, booked: 3200 },
    { channel: "Partner studios", enquiries: 5, projects: 2, booked: 7200 },
    { channel: "Events", enquiries: 4, projects: 1, booked: 2400 },
  ],
  month: [
    { channel: "Client referrals", enquiries: 26, projects: 6, booked: 24800 },
    { channel: "Returning clients", enquiries: 18, projects: 8, booked: 36800 },
    { channel: "Studio website", enquiries: 52, projects: 4, booked: 12400 },
    { channel: "Partner studios", enquiries: 16, projects: 5, booked: 18200 },
    { channel: "Events", enquiries: 12, projects: 2, booked: 6800 },
  ],
  year: [
    {
      channel: "Client referrals",
      enquiries: 182,
      projects: 38,
      booked: 168400,
    },
    {
      channel: "Returning clients",
      enquiries: 124,
      projects: 52,
      booked: 242600,
    },
    { channel: "Studio website", enquiries: 386, projects: 26, booked: 92400 },
    {
      channel: "Partner studios",
      enquiries: 108,
      projects: 31,
      booked: 118200,
    },
    { channel: "Events", enquiries: 76, projects: 14, booked: 48600 },
  ],
};

const helper = createDataTableColumnHelper<ChannelRow>();

const columns = helper.columns([
  helper.accessor("channel", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Channel" />
    ),
  }),
  helper.accessor("enquiries", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Enquiries" align="right" />
    ),
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {formatNumber(row.original.enquiries)}
      </div>
    ),
  }),
  helper.accessor("projects", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Projects" align="right" />
    ),
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {formatNumber(row.original.projects)}
      </div>
    ),
  }),
  helper.accessor("booked", {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Booked work"
        align="right"
      />
    ),
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {formatNumber(row.original.booked, {
          format: "currency",
          compact: true,
        })}
      </div>
    ),
  }),
]);

export default function DataTableLoadingDemo() {
  const [period, setPeriod] = React.useState<Period>("month");
  const [data, setData] = React.useState(byPeriod.month);
  const [loading, setLoading] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  React.useEffect(() => () => clearTimeout(timer.current), []);

  // Stand-in for a fetch. A first load has no rows to show, so it swaps in the
  // skeleton; a filter change already has rows, so it dims them instead.
  const load = (next: Period, mode: "loading" | "pending") => {
    clearTimeout(timer.current);
    setPeriod(next);
    setLoading(mode === "loading");
    setPending(mode === "pending");
    timer.current = setTimeout(() => {
      setData(byPeriod[next]);
      setLoading(false);
      setPending(false);
    }, 900);
  };

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="channel"
      searchPlaceholder="Find an enquiry source…"
      loading={loading}
      pending={pending}
      pageSize={5}
      showPagination={false}
      toolbar={
        <>
          <PeriodTabs
            value={period}
            onValueChange={(next) => load(next as Period, "pending")}
            size="sm"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 shadow-none"
            disabled={loading || pending}
            onClick={() => load(period, "loading")}
          >
            <RefreshCw
              className={
                loading || pending
                  ? "animate-spin motion-reduce:animate-none"
                  : undefined
              }
            />
            {loading || pending ? "Refreshing…" : "Reload"}
          </Button>
        </>
      }
      className="w-full"
    />
  );
}
