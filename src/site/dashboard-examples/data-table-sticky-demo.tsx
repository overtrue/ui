/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
"use client";

import { IconDots as MoreHorizontal } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatNumber } from "@/registry/overtrue/metric-format";
import {
  DataTable,
  DataTableColumnHeader,
  createDataTableColumnHelper,
  type DataTableRow,
} from "@/registry/overtrue/advanced-data-table";

type CampaignRow = {
  campaign: string;
  channel: string;
  status: "live" | "paused" | "draft";
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  spend: number;
  conversions: number;
  cpa: number;
  roas: number;
};

const campaigns: CampaignRow[] = [
  {
    campaign: "Spring launch — brand",
    channel: "Search",
    status: "live",
    impressions: 1_284_000,
    clicks: 38_400,
    ctr: 0.0299,
    cpc: 1.42,
    spend: 54_528,
    conversions: 1_842,
    cpa: 29.6,
    roas: 4.1,
  },
  {
    campaign: "Spring launch — retarget",
    channel: "Display",
    status: "live",
    impressions: 2_940_000,
    clicks: 21_600,
    ctr: 0.0073,
    cpc: 0.68,
    spend: 14_688,
    conversions: 612,
    cpa: 24,
    roas: 3.4,
  },
  {
    campaign: "Always-on — competitor",
    channel: "Search",
    status: "live",
    impressions: 486_000,
    clicks: 19_200,
    ctr: 0.0395,
    cpc: 2.86,
    spend: 54_912,
    conversions: 908,
    cpa: 60.5,
    roas: 2.2,
  },
  {
    campaign: "Lifecycle — winback",
    channel: "Email",
    status: "live",
    impressions: 312_000,
    clicks: 41_800,
    ctr: 0.134,
    cpc: 0.04,
    spend: 1_672,
    conversions: 1_204,
    cpa: 1.4,
    roas: 18.9,
  },
  {
    campaign: "Creator program",
    channel: "Social",
    status: "paused",
    impressions: 1_820_000,
    clicks: 47_300,
    ctr: 0.026,
    cpc: 0.91,
    spend: 43_043,
    conversions: 1_390,
    cpa: 31,
    roas: 3.8,
  },
  {
    campaign: "Podcast — Q1 flight",
    channel: "Audio",
    status: "paused",
    impressions: 940_000,
    clicks: 8_200,
    ctr: 0.0087,
    cpc: 3.4,
    spend: 27_880,
    conversions: 318,
    cpa: 87.7,
    roas: 1.6,
  },
  {
    campaign: "Marketplace listings",
    channel: "Partner",
    status: "live",
    impressions: 128_000,
    clicks: 6_400,
    ctr: 0.05,
    cpc: 1.15,
    spend: 7_360,
    conversions: 486,
    cpa: 15.1,
    roas: 6.7,
  },
  {
    campaign: "Docs — long tail",
    channel: "Search",
    status: "live",
    impressions: 74_000,
    clicks: 9_100,
    ctr: 0.123,
    cpc: 0.52,
    spend: 4_732,
    conversions: 402,
    cpa: 11.8,
    roas: 8.4,
  },
  {
    campaign: "Enterprise ABM",
    channel: "Display",
    status: "draft",
    impressions: 0,
    clicks: 0,
    ctr: 0,
    cpc: 0,
    spend: 0,
    conversions: 0,
    cpa: 0,
    roas: 0,
  },
  {
    campaign: "Conference — booth QR",
    channel: "Offline",
    status: "paused",
    impressions: 12_000,
    clicks: 1_900,
    ctr: 0.158,
    cpc: 0,
    spend: 18_000,
    conversions: 96,
    cpa: 187.5,
    roas: 0.9,
  },
  {
    campaign: "Newsletter sponsorships",
    channel: "Email",
    status: "live",
    impressions: 620_000,
    clicks: 14_400,
    ctr: 0.0232,
    cpc: 1.04,
    spend: 14_976,
    conversions: 508,
    cpa: 29.5,
    roas: 4.6,
  },
  {
    campaign: "App install — iOS",
    channel: "Social",
    status: "live",
    impressions: 3_410_000,
    clicks: 88_200,
    ctr: 0.0259,
    cpc: 0.47,
    spend: 41_454,
    conversions: 3_120,
    cpa: 13.3,
    roas: 5.2,
  },
];

/** One list of actions, rendered by whichever menu asked for it. */
const actions = [
  { label: "Open report" },
  { label: "Duplicate" },
  { label: "Archive", destructive: true },
];

function RowActions({ row }: { row: DataTableRow<CampaignRow> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-7">
          <MoreHorizontal />
          <span className="sr-only">Open menu for {row.original.campaign}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.label}
            variant={action.destructive ? "destructive" : "default"}
          >
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const helper = createDataTableColumnHelper<CampaignRow>();

const number = (
  value: number,
  options?: Parameters<typeof formatNumber>[1],
) => (
  <div className="text-right tabular-nums">{formatNumber(value, options)}</div>
);

const columns = helper.columns([
  helper.accessor("campaign", {
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Campaign" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.original.campaign}</span>
    ),
  }),
  helper.accessor("channel", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Channel" />
    ),
  }),
  helper.accessor("status", {
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "live" ? "secondary" : "outline"}>
        {row.original.status}
      </Badge>
    ),
  }),
  helper.accessor("impressions", {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Impressions"
        align="right"
      />
    ),
    cell: ({ row }) => number(row.original.impressions, { compact: true }),
  }),
  helper.accessor("clicks", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Clicks" align="right" />
    ),
    cell: ({ row }) => number(row.original.clicks),
  }),
  helper.accessor("ctr", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CTR" align="right" />
    ),
    cell: ({ row }) =>
      number(row.original.ctr, { format: "percent", maximumFractionDigits: 2 }),
  }),
  helper.accessor("cpc", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CPC" align="right" />
    ),
    cell: ({ row }) => number(row.original.cpc, { format: "currency" }),
  }),
  helper.accessor("spend", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Spend" align="right" />
    ),
    cell: ({ row }) =>
      number(row.original.spend, { format: "currency", compact: true }),
  }),
  helper.accessor("conversions", {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Conversions"
        align="right"
      />
    ),
    cell: ({ row }) => number(row.original.conversions),
  }),
  helper.accessor("cpa", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CPA" align="right" />
    ),
    cell: ({ row }) => number(row.original.cpa, { format: "currency" }),
  }),
  helper.accessor("roas", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ROAS" align="right" />
    ),
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {row.original.roas.toFixed(1)}×
      </div>
    ),
  }),
  helper.display({
    id: "actions",
    // Pinned columns need a size: the sticky offsets are measured from it.
    size: 48,
    enableHiding: false,
    header: () => <span className="sr-only"> Start something </span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <RowActions row={row} />
      </div>
    ),
  }),
]);

export default function DataTableStickyDemo() {
  return (
    <DataTable
      columns={columns}
      data={campaigns}
      searchKey="campaign"
      searchPlaceholder="Find a studio campaign…"
      pinnedColumns={{ end: ["actions"] }}
      stickyHeader
      maxHeight={340}
      pageSize={0}
      showPagination={false}
      renderRow={(_row, element) => (
        <ContextMenu>
          <ContextMenuTrigger asChild>{element}</ContextMenuTrigger>
          <ContextMenuContent className="w-40">
            {actions.map((action) => (
              <ContextMenuItem
                key={action.label}
                variant={action.destructive ? "destructive" : "default"}
              >
                {action.label}
              </ContextMenuItem>
            ))}
          </ContextMenuContent>
        </ContextMenu>
      )}
      className="w-full"
    />
  );
}
