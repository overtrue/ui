/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import * as React from "react";

import { formatNumber } from "@/registry/overtrue/metric-format";
import { DeltaBadge } from "@/registry/overtrue/delta-badge";
import {
  DataTable,
  createDataTableColumnHelper,
} from "@/registry/overtrue/advanced-data-table";

type QueryRow = {
  query: string;
  clicks: number;
  position: number;
  delta: number;
};

const queries: QueryRow[] = [
  { query: "dashboard components", clicks: 4_120, position: 1.4, delta: 0.18 },
  { query: "shadcn kpi card", clicks: 3_480, position: 2.1, delta: 0.32 },
  { query: "react data table", clicks: 2_910, position: 4.8, delta: -0.06 },
  {
    query: "brand identity studio",
    clicks: 2_140,
    position: 3.2,
    delta: 0.09,
  },
  {
    query: "visitor experience design",
    clicks: 1_880,
    position: 5.6,
    delta: 0.21,
  },
  {
    query: "product design partner",
    clicks: 1_240,
    position: 8.1,
    delta: -0.14,
  },
  { query: "editorial design studio", clicks: 960, position: 6.4, delta: 0.04 },
  { query: "member portal design", clicks: 720, position: 9.2, delta: 0.41 },
];

const helper = createDataTableColumnHelper<QueryRow>();

const columns = helper.columns([
  helper.accessor("query", {
    header: "Query",
    cell: ({ row }) => <span className="truncate">{row.original.query}</span>,
  }),
  helper.accessor("clicks", {
    header: () => <div className="text-right">Clicks</div>,
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {formatNumber(row.original.clicks)}
      </div>
    ),
  }),
  helper.accessor("position", {
    header: () => <div className="text-right">Position</div>,
    cell: ({ row }) => (
      <div className="text-muted-foreground text-right tabular-nums">
        {row.original.position.toFixed(1)}
      </div>
    ),
  }),
  helper.accessor("delta", {
    header: () => <div className="text-right">Change</div>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <DeltaBadge delta={row.original.delta} variant="text" />
      </div>
    ),
  }),
]);

export default function DataTableCompactDemo() {
  const [active, setActive] = React.useState<string | null>(null);

  return (
    <DataTable
      columns={columns}
      data={queries}
      density="compact"
      pageSize={0}
      showViewOptions={false}
      showPagination={false}
      onRowClick={(row) => setActive(row.original.query)}
      rowClassName={(row) =>
        row.original.query === active ? "bg-muted/60" : undefined
      }
      className="w-full"
    />
  );
}
