/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/registry/overtrue/metric-format";
import {
  DataTable,
  DataTableColumnHeader,
  createDataTableColumnHelper,
} from "@/registry/overtrue/advanced-data-table";

type PracticeRow = {
  practice: string;
  engagement: "ongoing" | "project" | "advisory";
  projects: number;
  hours: number;
  booked: number;
  rework: number;
};

const practices: PracticeRow[] = [
  {
    practice: "Brand identity",
    engagement: "project",
    projects: 6,
    hours: 420,
    booked: 36800,
    rework: 0.032,
  },
  {
    practice: "Digital products",
    engagement: "ongoing",
    projects: 4,
    hours: 680,
    booked: 56400,
    rework: 0.048,
  },
  {
    practice: "Visitor experience",
    engagement: "project",
    projects: 3,
    hours: 360,
    booked: 28400,
    rework: 0.026,
  },
  {
    practice: "Editorial",
    engagement: "ongoing",
    projects: 5,
    hours: 240,
    booked: 18200,
    rework: 0.041,
  },
  {
    practice: "Research",
    engagement: "advisory",
    projects: 2,
    hours: 160,
    booked: 12400,
    rework: 0.019,
  },
  {
    practice: "Design systems",
    engagement: "project",
    projects: 3,
    hours: 320,
    booked: 24800,
    rework: 0.035,
  },
  {
    practice: "Workshops",
    engagement: "advisory",
    projects: 4,
    hours: 96,
    booked: 8400,
    rework: 0.012,
  },
];

const helper = createDataTableColumnHelper<PracticeRow>();

const columns = helper.columns([
  helper.accessor("practice", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Practice" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.original.practice}</span>
    ),
  }),
  helper.accessor("engagement", {
    header: "Engagement",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.engagement === "ongoing" ? "secondary" : "outline"
        }
      >
        {row.original.engagement}
      </Badge>
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
  helper.accessor("hours", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hours" align="right" />
    ),
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {formatNumber(row.original.hours)}
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
  helper.accessor("rework", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rework" align="right" />
    ),
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {formatNumber(row.original.rework, {
          format: "percent",
          maximumFractionDigits: 1,
        })}
      </div>
    ),
  }),
]);

export default function DataTableReorderDemo() {
  return (
    <DataTable
      columns={columns}
      data={practices}
      searchKey="practice"
      searchPlaceholder="Find a studio practice…"
      reorderable
      pageSize={0}
      showPagination={false}
      className="w-full"
    />
  );
}
