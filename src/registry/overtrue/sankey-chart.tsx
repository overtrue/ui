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
  /** Draw the flow in from left to right on mount. Respects reduced motion. */
  animate?: boolean;
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

type Hover = { kind: "node"; index: number } | { kind: "link"; index: number };

function round(n: number) {
  return Math.round(n * 1000) / 1000;
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function useReducedMotion() {
  return React.useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
}

function percent(share: number) {
  return formatNumber(share, { format: "percent", maximumFractionDigits: 0 });
}

/**
 * A flow diagram on shadcn's chart primitives. Links blend from their source color
 * to their target color; hovering a node traces every flow through it, and hovering
 * a link isolates it.
 */
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
  animate = true,
  className,
  ...props
}: SankeyChartProps) {
  const palette = colors.length ? colors : DEFAULT_COLORS;
  const hoverOpacity = Math.min(1, linkOpacity * 2);
  const reduced = useReducedMotion();
  const motion = animate && !reduced;
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [hover, setHover] = React.useState<Hover | null>(null);

  const { data, margin, config, outgoing, total, indexByName } =
    React.useMemo(() => {
      const indexByName = new Map(
        nodes.map((node, index) => [node.name, index]),
      );
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
        const shareLabel = showShares ? ` · ${percent(share)}` : "";
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
        outgoing,
        total,
        indexByName,
      };
    }, [nodes, links, palette, showShares, labelPosition]);

  // Everything upstream and downstream of the hovered node, or just the hovered link.
  const highlight = React.useMemo(() => {
    if (!hover) return null;
    const lit = new Set<number>();
    const litNodes = new Set<number>();
    const all = data.links;
    if (hover.kind === "link") {
      const link = all[hover.index];
      if (!link) return null;
      lit.add(hover.index);
      litNodes.add(link.source).add(link.target);
      return { links: lit, nodes: litNodes };
    }
    litNodes.add(hover.index);
    const walk = (from: number, forward: boolean) => {
      const queue = [from];
      const seen = new Set([from]);
      while (queue.length) {
        const node = queue.shift()!;
        all.forEach((link, index) => {
          if ((forward ? link.source : link.target) !== node) return;
          lit.add(index);
          const next = forward ? link.target : link.source;
          litNodes.add(next);
          if (!seen.has(next)) {
            seen.add(next);
            queue.push(next);
          }
        });
      }
    };
    walk(hover.index, true);
    walk(hover.index, false);
    return { links: lit, nodes: litNodes };
  }, [hover, data.links]);

  const nodeIndexOf = React.useCallback(
    (node: { name?: unknown }) => indexByName.get(String(node.name)) ?? -1,
    [indexByName],
  );

  const linkIndexOf = React.useCallback(
    (source: number, target: number) =>
      data.links.findIndex(
        (link) => link.source === source && link.target === target,
      ),
    [data.links],
  );

  const renderNode = (nodeProps: SankeyNodeProps) => {
    const { x, y, width, height, payload } = nodeProps;
    const node = payload as unknown as RechartsSankeyNode & ResolvedNode;
    if (!(node.value > 0) || !(height > 0)) return null;
    const index = nodeIndexOf(node);
    const radius = Math.min(3, width / 2, height / 2);
    const labelX = node.side === "left" ? x - LABEL_GAP : x + width + LABEL_GAP;
    const dimmed = highlight != null && !highlight.nodes.has(index);
    const active = hover?.kind === "node" && hover.index === index;
    return (
      <g
        data-slot="sankey-node"
        data-active={active || undefined}
        onPointerEnter={() => setHover({ kind: "node", index })}
        onPointerLeave={() => setHover(null)}
        className="cursor-default transition-opacity duration-150 motion-reduce:transition-none"
        style={{ opacity: dimmed ? 0.3 : 1 }}
      >
        <rect
          x={round(x)}
          y={round(y)}
          width={round(width)}
          height={round(height)}
          rx={round(radius)}
          fill={node.color}
          className={cn(
            "[transform-box:fill-box] [transform-origin:center] dark:[filter:drop-shadow(0_0_6px_color-mix(in_oklab,var(--sankey-node)_45%,transparent))]",
            motion &&
              "motion-safe:animate-[sankey-node-in_600ms_cubic-bezier(0.22,1,0.36,1)_backwards]",
          )}
          style={{
            ["--sankey-node" as string]: node.color,
            animationDelay: motion ? `${Math.round(x * 0.9)}ms` : undefined,
          }}
        />
        {/* A soft highlight along the leading edge gives the bar a little depth. */}
        <rect
          x={round(x)}
          y={round(y)}
          width={round(Math.min(2, width / 3))}
          height={round(height)}
          rx={round(Math.min(1, radius))}
          fill="#fff"
          fillOpacity={0.18}
          pointerEvents="none"
        />
        <text
          x={round(labelX)}
          y={round(y + height / 2)}
          textAnchor={node.side === "left" ? "end" : "start"}
          dominantBaseline="middle"
          className={cn(
            "fill-foreground text-xs",
            motion &&
              "motion-safe:animate-[sankey-label-in_500ms_ease-out_backwards]",
          )}
          style={{
            animationDelay: motion
              ? `${Math.round(240 + x * 0.9)}ms`
              : undefined,
          }}
        >
          <tspan className={active ? "font-semibold" : "font-medium"}>
            {node.label}
          </tspan>
          {node.shareLabel ? (
            <tspan className="fill-muted-foreground text-[11px] tabular-nums">
              {node.shareLabel}
            </tspan>
          ) : null}
        </text>
      </g>
    );
  };

  const renderLink = (linkProps: SankeyLinkProps) => {
    const {
      sourceX,
      sourceY,
      sourceControlX,
      targetX,
      targetY,
      targetControlX,
      linkWidth,
      payload,
    } = linkProps;
    const source = payload.source as RechartsSankeyNode & ResolvedNode;
    const target = payload.target as RechartsSankeyNode & ResolvedNode;
    const index = linkIndexOf(nodeIndexOf(source), nodeIndexOf(target));
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
    const gradientId = `${uid}-link-${index}`;
    const lit = highlight?.links.has(index) ?? false;
    const opacity =
      highlight == null
        ? linkOpacity
        : lit
          ? hoverOpacity
          : Math.max(0.04, linkOpacity * 0.3);
    return (
      <g>
        <defs>
          <linearGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            x1={round(sourceX)}
            x2={round(targetX)}
            y1={0}
            y2={0}
          >
            <stop offset="0%" stopColor={source.color} />
            <stop offset="100%" stopColor={target.color} />
          </linearGradient>
        </defs>
        <path
          data-slot="sankey-link"
          data-active={lit || undefined}
          d={d}
          fill={`url(#${gradientId})`}
          fillOpacity={opacity}
          stroke="none"
          onPointerEnter={() => setHover({ kind: "link", index })}
          onPointerLeave={() => setHover(null)}
          className={cn(
            "transition-[fill-opacity] duration-150 motion-reduce:transition-none",
            // Dark surfaces swallow translucent fills, so resting links get a little more body there.
            highlight == null &&
              "dark:[fill-opacity:min(1,calc(var(--sankey-link-opacity)*1.5))] hover:[fill-opacity:var(--sankey-link-hover-opacity)]",
            motion &&
              "motion-safe:animate-[sankey-link-in_800ms_cubic-bezier(0.22,1,0.36,1)_backwards]",
          )}
          style={
            {
              "--sankey-link-hover-opacity": hoverOpacity,
              "--sankey-link-opacity": linkOpacity,
              animationDelay: motion
                ? `${Math.round(120 + sourceX * 0.9)}ms`
                : undefined,
            } as React.CSSProperties
          }
        />
      </g>
    );
  };

  return (
    <ChartContainer
      data-slot="sankey-chart"
      data-hover={hover?.kind}
      config={config}
      className={cn("aspect-auto h-72 w-full", className)}
      {...props}
    >
      <>
        <style href="overtrue-sankey-chart" precedence="default">
          {`@keyframes sankey-link-in{from{clip-path:inset(0 100% 0 0);opacity:.4}to{clip-path:inset(0 0 0 0);opacity:1}}@keyframes sankey-node-in{from{opacity:0;transform:scaleY(.3)}}@keyframes sankey-label-in{from{opacity:0}}`}
        </style>
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
              isAnimationActive={false}
              content={(tooltipProps) => {
                const item = tooltipProps.payload?.[0];
                if (!tooltipProps.active || !item) return null;
                // Links carry their source and target as node indexes (or nodes); nodes carry their own meta.
                // Recharts wraps the link or node in `{ payload, name, value }`.
                const wrapper = item.payload as
                  Record<string, unknown> | undefined;
                const raw = (wrapper?.payload ?? wrapper) as
                  Record<string, unknown> | undefined;
                const nodeAt = (ref: unknown) =>
                  (typeof ref === "number"
                    ? data.nodes[ref]
                    : typeof ref === "object" && ref !== null
                      ? (ref as ResolvedNode)
                      : undefined) as ResolvedNode | undefined;
                const source = nodeAt(raw?.source);
                const target = nodeAt(raw?.target);
                const isLink = source !== undefined && target !== undefined;
                const value = Number(item.value);
                const sourceIndex = isLink ? nodeIndexOf(source) : -1;
                const out = sourceIndex >= 0 ? outgoing[sourceIndex] : 0;
                return (
                  <div className="grid min-w-44 gap-1 rounded-xl border border-border/70 bg-popover/90 px-3 py-2.5 text-xs text-popover-foreground shadow-xl backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="h-2.5 w-3.5 shrink-0 rounded-[3px]"
                        style={{
                          background: isLink
                            ? `linear-gradient(to right, ${source.color}, ${target.color})`
                            : String(raw?.color ?? "var(--color-foreground)"),
                        }}
                      />
                      <span className="font-medium text-foreground">
                        {isLink ? (
                          <>
                            {source.name}
                            <span className="px-1 text-muted-foreground">
                              →
                            </span>
                            {target.name}
                          </>
                        ) : (
                          String(raw?.name ?? wrapper?.name ?? item.name)
                        )}
                      </span>
                      <span className="ml-auto pl-4 font-semibold text-foreground tabular-nums">
                        {valueFormatter(value)}
                      </span>
                    </div>
                    <div className="pl-[22px] text-[11px] text-muted-foreground tabular-nums">
                      {isLink
                        ? out
                          ? `${percent(value / out)} of ${source.name}`
                          : null
                        : total
                          ? `${percent(value / total)} of total flow`
                          : null}
                    </div>
                  </div>
                );
              }}
            />
          ) : null}
        </Sankey>
      </>
    </ChartContainer>
  );
}

export { SankeyChart };
