/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 *
 * MIT License
 *
 * Copyright (c) 2026 dashboardcn contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * ---
 *
 * Portions of this project are derived from shadcn/ui and shadcn/registry-template
 * (https://github.com/shadcn-ui/ui), Copyright (c) 2023 shadcn, licensed under the
 * MIT License. The notice above applies to those portions as well.
 */
"use client";

import * as React from "react";
import {
  Sankey,
  type SankeyLinkProps,
  type SankeyNode as RechartsSankeyNode,
  type SankeyNodeProps,
} from "recharts-analytics";

import { cn } from "@/lib/utils";
import { formatNumber } from "./metric-format";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./analytics-chart";

export interface SankeyChartNode {
  name: string;
  /** Any CSS color. Sources default to the palette in order; targets inherit the color of their largest incoming link. */
  color?: string;
}

export interface SankeyChartLink {
  /** Node name or index into `nodes`. */
  source: number | string;
  /** Node name or index into `nodes`. */
  target: number | string;
  value: number;
}

export interface SankeyChartProps extends Omit<
  React.ComponentProps<typeof ChartContainer>,
  "config" | "children"
> {
  nodes: SankeyChartNode[];
  links: SankeyChartLink[];
  valueFormatter?: (value: number) => string;
  /** Append each node's share of the total flow to its label, e.g. "Writing · 18%". */
  showShares?: boolean;
  showTooltip?: boolean;
  nodeWidth?: number;
  /** Vertical gap between nodes in the same column. */
  nodePadding?: number;
  /** Fill opacity of the links. Hovered links are drawn at double this, up to 1. */
  linkOpacity?: number;
  /** "outside" reserves a margin and puts labels left of sources and right of targets; "inside" draws them over the flow. */
  labelPosition?: "outside" | "inside";
  /** Palette cycled through source nodes without a color. Defaults to chart-1 through chart-5. */
  colors?: string[];
}

const DEFAULT_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

/** Approximate rendered width of a text-xs string, for reserving label margins. */
const CHAR_WIDTH = 6.4;
const LABEL_GAP = 8;

interface ResolvedNode {
  name: string;
  color: string;
  /** Share of the total flow, as a fraction. */
  share: number;
  /** Which side of the node bar the label is drawn on. */
  side: "left" | "right";
  /** Label text next to the node, share included. */
  label: string;
  shareLabel: string;
}

interface ResolvedLink {
  source: number;
  target: number;
  value: number;
}

function round(n: number) {
  return Math.round(n * 1000) / 1000;
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function SankeyChart({
  nodes,
  links,
  valueFormatter = (value) => formatNumber(value),
  showShares = true,
  showTooltip = true,
  nodeWidth = 12,
  nodePadding = 16,
  linkOpacity = 0.25,
  labelPosition = "outside",
  colors = DEFAULT_COLORS,
  className,
  ...props
}: SankeyChartProps) {
  const palette = colors.length ? colors : DEFAULT_COLORS;
  const hoverOpacity = Math.min(1, linkOpacity * 2);

  const { data, margin, config } = React.useMemo(() => {
    const indexByName = new Map(nodes.map((node, index) => [node.name, index]));
    const resolveIndex = (ref: number | string) =>
      typeof ref === "number"
        ? Number.isInteger(ref) && ref >= 0 && ref < nodes.length
          ? ref
          : -1
        : (indexByName.get(ref) ?? -1);

    const resolvedLinks: ResolvedLink[] = links
      .map((link) => ({
        source: resolveIndex(link.source),
        target: resolveIndex(link.target),
        value: link.value,
      }))
      .filter(
        (link) =>
          link.source >= 0 &&
          link.target >= 0 &&
          link.source !== link.target &&
          Number.isFinite(link.value) &&
          link.value > 0,
      );

    const incoming = nodes.map(() => 0);
    const outgoing = nodes.map(() => 0);
    const strongestSource = nodes.map<number | null>(() => null);
    const strongestValue = nodes.map(() => 0);
    for (const link of resolvedLinks) {
      outgoing[link.source]! += link.value;
      incoming[link.target]! += link.value;
      if (link.value > strongestValue[link.target]!) {
        strongestValue[link.target] = link.value;
        strongestSource[link.target] = link.source;
      }
    }

    const isRoot = nodes.map((_, index) => incoming[index] === 0);
    const isLeaf = nodes.map((_, index) => outgoing[index] === 0);
    const values = nodes.map((_, index) =>
      Math.max(incoming[index]!, outgoing[index]!),
    );
    const total = values.reduce(
      (sum, value, index) => (isRoot[index] ? sum + value : sum),
      0,
    );

    // Roots cycle through the palette; everything else inherits its strongest source.
    const resolvedColors: (string | undefined)[] = nodes.map(() => undefined);
    let paletteIndex = 0;
    nodes.forEach((node, index) => {
      if (node.color) resolvedColors[index] = node.color;
      else if (isRoot[index])
        resolvedColors[index] = palette[paletteIndex++ % palette.length];
    });
    const colorOf = (index: number, seen: Set<number>): string => {
      const known = resolvedColors[index];
      if (known) return known;
      const source = strongestSource[index] ?? null;
      if (source !== null && !seen.has(index)) {
        seen.add(index);
        const inherited = colorOf(source, seen);
        resolvedColors[index] = inherited;
        return inherited;
      }
      const fallback = palette[paletteIndex++ % palette.length]!;
      resolvedColors[index] = fallback;
      return fallback;
    };

    const resolvedNodes: ResolvedNode[] = nodes.map((node, index) => {
      const share = total > 0 ? values[index]! / total : 0;
      const shareLabel = showShares
        ? ` · ${formatNumber(share, { format: "percent", maximumFractionDigits: 0 })}`
        : "";
      const side: ResolvedNode["side"] =
        labelPosition === "outside"
          ? isRoot[index] && !isLeaf[index]
            ? "left"
            : "right"
          : isLeaf[index] && !isRoot[index]
            ? "left"
            : "right";
      return {
        name: node.name,
        color: colorOf(index, new Set()),
        share,
        side,
        label: node.name,
        shareLabel,
      };
    });

    const labelWidth = (node: ResolvedNode) =>
      Math.ceil((node.label.length + node.shareLabel.length) * CHAR_WIDTH) +
      LABEL_GAP;
    const widest = (predicate: (index: number) => boolean) =>
      resolvedNodes.reduce(
        (max, node, index) =>
          predicate(index) && values[index]! > 0
            ? Math.max(max, labelWidth(node))
            : max,
        0,
      );
    const margin =
      labelPosition === "outside"
        ? {
            top: 4,
            bottom: 4,
            left: widest((index) => resolvedNodes[index]!.side === "left"),
            right: widest((index) => resolvedNodes[index]!.side === "right"),
          }
        : { top: 4, bottom: 4, left: 4, right: 4 };

    const config = Object.fromEntries(
      resolvedNodes.map((node) => [
        slugify(node.name),
        { label: node.name, color: node.color },
      ]),
    ) satisfies ChartConfig;

    return {
      data: { nodes: resolvedNodes, links: resolvedLinks },
      margin,
      config,
    };
  }, [nodes, links, palette, showShares, labelPosition]);

  const renderNode = React.useCallback((props: SankeyNodeProps) => {
    const { x, y, width, height, payload } = props;
    const node = payload as unknown as RechartsSankeyNode & ResolvedNode;
    if (!(node.value > 0) || !(height > 0)) return null;
    const radius = Math.min(3, width / 2, height / 2);
    const labelX = node.side === "left" ? x - LABEL_GAP : x + width + LABEL_GAP;
    return (
      <g data-slot="sankey-node">
        <rect
          x={round(x)}
          y={round(y)}
          width={round(width)}
          height={round(height)}
          rx={round(radius)}
          fill={node.color}
        />
        <text
          x={round(labelX)}
          y={round(y + height / 2)}
          textAnchor={node.side === "left" ? "end" : "start"}
          dominantBaseline="middle"
          className="fill-foreground text-xs"
        >
          <tspan className="font-medium">{node.label}</tspan>
          {node.shareLabel ? (
            <tspan className="fill-muted-foreground tabular-nums">
              {node.shareLabel}
            </tspan>
          ) : null}
        </text>
      </g>
    );
  }, []);

  const renderLink = React.useCallback(
    (props: SankeyLinkProps) => {
      const {
        sourceX,
        sourceY,
        sourceControlX,
        targetX,
        targetY,
        targetControlX,
        linkWidth,
        payload,
      } = props;
      const source = payload.source as RechartsSankeyNode & ResolvedNode;
      const half = Math.max(linkWidth, 0.5) / 2;
      const top = (yValue: number) => round(yValue - half);
      const bottom = (yValue: number) => round(yValue + half);
      const d = [
        `M${round(sourceX)},${top(sourceY)}`,
        `C${round(sourceControlX)},${top(sourceY)} ${round(targetControlX)},${top(targetY)} ${round(targetX)},${top(targetY)}`,
        `L${round(targetX)},${bottom(targetY)}`,
        `C${round(targetControlX)},${bottom(targetY)} ${round(sourceControlX)},${bottom(sourceY)} ${round(sourceX)},${bottom(sourceY)}`,
        "Z",
      ].join(" ");
      return (
        <path
          data-slot="sankey-link"
          d={d}
          fill={source.color}
          fillOpacity={linkOpacity}
          stroke="none"
          className="transition-[fill-opacity] duration-150 hover:[fill-opacity:var(--sankey-link-hover-opacity)]"
          style={
            {
              "--sankey-link-hover-opacity": hoverOpacity,
            } as React.CSSProperties
          }
        />
      );
    },
    [linkOpacity, hoverOpacity],
  );

  return (
    <ChartContainer
      data-slot="sankey-chart"
      config={config}
      className={cn("aspect-auto h-72 w-full", className)}
      {...props}
    >
      <Sankey
        data={data}
        nodeWidth={nodeWidth}
        nodePadding={nodePadding}
        linkCurvature={0.5}
        margin={margin}
        node={renderNode}
        link={renderLink}
      >
        {showTooltip ? (
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value, name, item) => {
                  // Links carry resolved source/target nodes; nodes carry their own meta.
                  const raw = item.payload as
                    Record<string, unknown> | undefined;
                  const source = raw?.source as
                    (RechartsSankeyNode & ResolvedNode) | undefined;
                  const target = raw?.target as
                    (RechartsSankeyNode & ResolvedNode) | undefined;
                  const isLink =
                    typeof source === "object" && typeof target === "object";
                  const label = isLink
                    ? `${source.name} → ${target.name}`
                    : String(raw?.name ?? name);
                  const color = isLink
                    ? source.color
                    : (raw?.color as string | undefined);
                  return (
                    <div className="flex w-full items-center gap-2">
                      <span
                        className="size-2 shrink-0 rounded-[2px]"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-muted-foreground flex-1">
                        {label}
                      </span>
                      <span className="font-mono font-medium tabular-nums">
                        {valueFormatter(Number(value))}
                      </span>
                    </div>
                  );
                }}
              />
            }
          />
        ) : null}
      </Sankey>
    </ChartContainer>
  );
}

export { SankeyChart };
