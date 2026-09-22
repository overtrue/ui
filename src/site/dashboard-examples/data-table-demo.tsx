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

type PageRow = {
  path: string;
  views: number;
  visitors: number;
  bounceRate: number;
  status: "indexed" | "noindex" | "redirect";
};

const pages: PageRow[] = [
  {
    path: "/",
    views: 48_210,
    visitors: 31_400,
    bounceRate: 0.42,
    status: "indexed",
  },
  {
    path: "/projects",
    views: 21_480,
    visitors: 16_200,
    bounceRate: 0.38,
    status: "indexed",
  },
  {
    path: "/resources",
    views: 18_930,
    visitors: 9_800,
    bounceRate: 0.21,
    status: "indexed",
  },
  {
    path: "/resources/handbook",
    views: 12_310,
    visitors: 7_900,
    bounceRate: 0.19,
    status: "indexed",
  },
  {
    path: "/projects/visitor-experience",
    views: 9_120,
    visitors: 8_400,
    bounceRate: 0.61,
    status: "indexed",
  },
  {
    path: "/activity",
    views: 4_305,
    visitors: 2_900,
    bounceRate: 0.33,
    status: "indexed",
  },
  {
    path: "/people",
    views: 1_870,
    visitors: 1_600,
    bounceRate: 0.55,
    status: "indexed",
  },
  {
    path: "/archive/intake",
    views: 940,
    visitors: 910,
    bounceRate: 0.9,
    status: "redirect",
  },
  {
    path: "/operations/status",
    views: 610,
    visitors: 40,
    bounceRate: 0.12,
    status: "noindex",
  },
  {
    path: "/people/roles",
    views: 430,
    visitors: 400,
    bounceRate: 0.7,
    status: "indexed",
  },
  {
    path: "/resources/terms",
    views: 220,
    visitors: 210,
    bounceRate: 0.81,
    status: "indexed",
  },
  {
    path: "/resources/privacy",
    views: 190,
    visitors: 185,
    bounceRate: 0.84,
    status: "indexed",
  },
];

const helper = createDataTableColumnHelper<PageRow>();

const columns = helper.columns([
  helper.accessor("path", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Page" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.path}</span>
    ),
  }),
  helper.accessor("status", {
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "indexed" ? "secondary" : "outline"}
      >
        {row.original.status}
      </Badge>
    ),
  }),
  helper.accessor("views", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Views" align="right" />
    ),
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {formatNumber(row.original.views)}
      </div>
    ),
  }),
  helper.accessor("visitors", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Visitors" align="right" />
    ),
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {formatNumber(row.original.visitors)}
      </div>
    ),
  }),
  helper.accessor("bounceRate", {
    id: "bounce",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bounce" align="right" />
    ),
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {formatNumber(row.original.bounceRate, {
          format: "percent",
          maximumFractionDigits: 0,
        })}
      </div>
    ),
  }),
]);

export default function DataTableDemo() {
  return (
    <DataTable
      columns={columns}
      data={pages}
      searchKey="path"
      searchPlaceholder="Search workspace pages…"
      pageSize={8}
      className="w-full"
    />
  );
}
