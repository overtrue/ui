import { useId, type HTMLAttributes } from "react"
import {
  Area,
  Bar,
  Brush,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  LabelList,
  Line,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Treemap,
  ZAxis,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type Series = {
  name?: string
  data: unknown[]
  type?: string
  [key: string]: unknown
}
type AxisConfig = {
  seriesName?: string
  opposite?: boolean
  min?: number
  max?: number
  title?: { text?: string; [key: string]: unknown }
  [key: string]: unknown
}
type Annotation = {
  x?: string | number
  y?: number
  borderColor?: string
  strokeDashArray?: number
  label?: { text?: string; [key: string]: unknown }
  [key: string]: unknown
}
export interface WorkspaceChartConfig {
  chart?: {
    id?: string
    group?: string
    brush?: { enabled?: boolean; target?: string }
    selection?: { enabled?: boolean; xaxis?: { min?: number; max?: number }; [key: string]: unknown }
    type?: string
    height?: number | string
    sparkline?: { enabled?: boolean }
    stacked?: boolean
    [key: string]: unknown
  }
  series: Series[] | number[]
  labels?: (string | number)[]
  colors?: string[]
  stroke?: {
    width?: number | number[]
    dashArray?: number | number[]
    curve?: string
    [key: string]: unknown
  }
  xaxis?: {
    categories?: (string | number)[]
    type?: string
    [key: string]: unknown
  }
  yaxis?: AxisConfig | AxisConfig[]
  annotations?: { xaxis?: Annotation[]; yaxis?: Annotation[] }
  dataLabels?: { enabled?: boolean; [key: string]: unknown }
  legend?: { show?: boolean; [key: string]: unknown }
  plotOptions?: {
    bar?: { horizontal?: boolean; [key: string]: unknown }
    radialBar?: {
      startAngle?: number
      endAngle?: number
      [key: string]: unknown
      dataLabels?: {
        name?: { show?: boolean; [key: string]: unknown }
        value?: { show?: boolean; [key: string]: unknown }
        [key: string]: unknown
      }
    }
    [key: string]: unknown
  }
  [key: string]: unknown
}
export type ChartRange = { startIndex: number; endIndex: number }
const palette = [
  "var(--pn-primary)",
  "var(--pn-secondary)",
  "var(--pn-success)",
  "var(--pn-purple)",
  "var(--pn-orange)",
]
function numeric(value: unknown): number {
  if (typeof value === "number") return value
  if (Array.isArray(value)) return Number(value[value.length - 1]) || 0
  if (value && typeof value === "object" && "y" in value)
    return numeric(value.y)
  return Number(value) || 0
}
function label(value: string | number): string {
  if (typeof value === "number") return String(value)
  if (/^\d{4}-\d{2}-\d{2}/.test(value))
    return new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      timeZone: "UTC",
    })
  return value
}

export function WorkspaceChart({
  config,
  className,
  style,
  range,
  onRangeChange,
  ...props
}: { config: WorkspaceChartConfig; range?: ChartRange; onRangeChange?: (range: ChartRange) => void } & HTMLAttributes<HTMLDivElement>) {
  const unique = useId().replaceAll(":", "")
  const type = config.chart?.type ?? "line"
  const configuredHeight =
    typeof config.chart?.height === "number" ? config.chart.height : 240
  const height =
    type === "radialBar" && !config.chart?.sparkline?.enabled
      ? configuredHeight * 0.82
      : configuredHeight
  const spark = config.chart?.sparkline?.enabled ?? false
  const colors = config.colors?.length ? config.colors : palette
  const color = (index: number) => `color-mix(in srgb, ${colors[index % colors.length]} var(--workspace-chart-color-weight, 100%), white)`
  const numbered = config.series.filter(
    (s): s is number => typeof s === "number",
  )
  const series = config.series.filter(
    (s): s is Series => typeof s === "object" && s !== null,
  )
  const count = Math.max(...series.map((s) => s.data.length), 0)
  const data = Array.from({ length: count }, (_, index) => {
    const datum = series[0]?.data[index]
    const x =
      datum && typeof datum === "object" && "x" in datum
        ? String(datum.x)
        : (config.labels?.[index] ??
          config.xaxis?.categories?.[index] ??
          index + 1)
    return {
      label: label(x),
      ...Object.fromEntries(
        series.map((s, i) => {
          const point = s.data[index]
          const value =
            point && typeof point === "object" && "y" in point ? point.y : point
          return [
            `s${i}`,
            type === "rangeBar" && Array.isArray(value)
              ? value
              : numeric(value),
          ]
        }),
      ),
    }
  })
  const axisStyle = {
    fill: "var(--pn-secondary)",
    fontSize: 10,
    fontFamily: "inherit",
  }
  const tooltip = (
    <Tooltip
      contentStyle={{
        background: "var(--pn-bg-surface)",
        border: "1px solid var(--pn-border-color)",
        borderRadius: 4,
        fontSize: 12,
      }}
    />
  )
  let chart
  if (type === "radialBar") {
    const value = numbered[0] ?? 0
    const r = 78,
      circumference = 2 * Math.PI * r,
      arc = circumference * 0.75
    chart = (
      <svg
        viewBox="0 0 220 200"
        width="100%"
        height={height}
        role="img"
        aria-label={`${config.labels?.[0] ?? "Progress"}: ${value}%`}
      >
        <circle
          cx="110"
          cy="110"
          r={r}
          fill="none"
          stroke="var(--pn-border-color)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${arc} ${circumference}`}
          transform="rotate(135 110 110)"
        />
        <circle
          cx="110"
          cy="110"
          r={r}
          fill="none"
          stroke={color(0)}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${(arc * value) / 100} ${circumference}`}
          transform="rotate(135 110 110)"
        />
        <text
          x="110"
          y="103"
          textAnchor="middle"
          fill="var(--pn-secondary)"
          fontSize="14"
        >
          {config.labels?.[0] ?? ""}
        </text>
        <text
          x="110"
          y="138"
          textAnchor="middle"
          fill="var(--pn-body-color)"
          fontWeight="600"
          fontSize="28"
        >
          {value}%
        </text>
      </svg>
    )
  } else if (type === "polarArea") {
    const radius = Math.max(20, height / 2 - 28)
    const maximum = Math.max(...numbered, 1)
    chart = (
      <svg
        viewBox={`0 0 ${height + 120} ${height}`}
        width="100%"
        height={height}
        role="img"
        aria-label="Polar area chart"
      >
        {[0.25, 0.5, 0.75, 1].map((scale) => (
          <circle
            key={scale}
            cx={height / 2}
            cy={height / 2}
            r={radius * scale}
            fill="none"
            stroke="var(--pn-border-color)"
          />
        ))}
        {numbered.map((value, index) => (
          <g key={index}>
            <Sector
              cx={height / 2}
              cy={height / 2}
              innerRadius={0}
              outerRadius={(radius * value) / maximum}
              startAngle={90 - ((index + 1) * 360) / numbered.length}
              endAngle={90 - (index * 360) / numbered.length}
              fill={color(index)}
              fillOpacity={0.85}
              stroke="var(--pn-bg-surface)"
            >
              <title>
                {config.labels?.[index]}: {value}
              </title>
            </Sector>
            <circle
              cx={height + 4}
              cy={height / 2 - numbered.length * 10 + index * 20}
              r={4}
              fill={color(index)}
            />
            <text
              x={height + 14}
              y={height / 2 - numbered.length * 10 + index * 20 + 4}
              fontSize="11"
              fill="var(--pn-body-color)"
            >
              {config.labels?.[index]}
            </text>
          </g>
        ))}
      </svg>
    )
  } else if (["pie", "donut"].includes(type)) {
    chart = (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={numbered.map((value, i) => ({
              name: config.labels?.[i] ?? `${i + 1}`,
              value,
            }))}
            dataKey="value"
            innerRadius={type === "donut" ? "65%" : 0}
            outerRadius="85%"
            stroke="var(--pn-bg-surface)"
            isAnimationActive={false}
          >
            {numbered.map((_, i) => (
              <Cell key={i} fill={color(i)} />
            ))}
          </Pie>
          {tooltip}
          {config.legend?.show !== false && (
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12 }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    )
  } else if (type === "radar") {
    chart = (
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={data}>
          <PolarGrid stroke="var(--pn-border-color)" />
          <PolarAngleAxis dataKey="label" tick={axisStyle} />
          {series.map((s, i) => (
            <Radar
              key={i}
              name={s.name}
              dataKey={`s${i}`}
              stroke={color(i)}
              fill={color(i)}
              fillOpacity={0.15}
              isAnimationActive={false}
            />
          ))}
          {tooltip}
        </RadarChart>
      </ResponsiveContainer>
    )
  } else if (type === "scatter" || type === "bubble") {
    chart = (
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid
            stroke="var(--pn-border-color)"
            strokeDasharray="4 4"
            vertical={false}
          />
          <XAxis
            type="number"
            dataKey="x"
            tick={axisStyle}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) =>
              String(config.xaxis?.categories?.[value - 1] ?? value)
            }
          />
          <YAxis
            type="number"
            dataKey="y"
            tick={axisStyle}
            axisLine={false}
            tickLine={false}
          />
          <ZAxis
            type="number"
            dataKey="z"
            range={type === "bubble" ? [100, 1800] : [45, 45]}
          />
          {series.map((entry, index) => (
            <Scatter
              key={index}
              name={entry.name}
              fill={color(index)}
              fillOpacity={0.85}
              isAnimationActive={false}
              data={entry.data.map((point, i) =>
                typeof point === "object" && point !== null
                  ? point
                  : { x: i + 1, y: numeric(point), z: 1 },
              )}
            />
          ))}
          {tooltip}
          {config.legend?.show !== false && (
            <Legend iconSize={8} wrapperStyle={{ fontSize: 12 }} />
          )}
        </ScatterChart>
      </ResponsiveContainer>
    )
  } else if (type === "treemap") {
    chart = (
      <ResponsiveContainer width="100%" height={height}>
        <Treemap
          data={series.flatMap((entry) =>
            entry.data.map((point, index) => ({
              name:
                point && typeof point === "object" && "x" in point
                  ? String(point.x)
                  : String(index + 1),
              size: numeric(point),
            })),
          )}
          dataKey="size"
          nameKey="name"
          stroke="var(--pn-bg-surface)"
          fill={color(0)}
          isAnimationActive={false}
        >
          <Tooltip />
        </Treemap>
      </ResponsiveContainer>
    )
  } else if (type === "boxPlot") {
    const points = series
      .flatMap((entry) => entry.data)
      .filter((point): point is { x: string; y: number[] } =>
        Boolean(
          point &&
          typeof point === "object" &&
          "y" in point &&
          Array.isArray(point.y),
        ),
      )
    const min =
      Math.floor(Math.min(...points.flatMap((point) => point.y)) / 10) * 10
    const max =
      Math.ceil(Math.max(...points.flatMap((point) => point.y)) / 10) * 10
    const y = (value: number) =>
      12 + ((max - value) / Math.max(1, max - min)) * (height - 40)
    chart = (
      <svg
        viewBox={`0 0 600 ${height}`}
        width="100%"
        height={height}
        role="img"
        aria-label="Response time box plot"
      >
        {Array.from(
          { length: 5 },
          (_, index) => min + ((max - min) * index) / 4,
        ).map((value) => (
          <g key={value}>
            <line
              x1="36"
              x2="596"
              y1={y(value)}
              y2={y(value)}
              stroke="var(--pn-border-color)"
              strokeDasharray="4 4"
            />
            <text
              x="30"
              y={y(value) + 3}
              textAnchor="end"
              fontSize="10"
              fill="var(--pn-secondary)"
            >
              {value}
            </text>
          </g>
        ))}
        {points.map((point, index) => {
          const x = 36 + ((index + 0.5) * 560) / points.length
          const [low, q1, median, q3, high] = point.y
          return (
            <g key={index} stroke="var(--pn-secondary)">
              <title>
                {point.x}: {point.y.join(", ")}
              </title>
              <path
                d={`M${x} ${y(low)}V${y(high)}M${x - 12} ${y(low)}h24M${x - 12} ${y(high)}h24`}
              />
              <rect
                x={x - 22}
                y={y(q3)}
                width="44"
                height={y(median) - y(q3)}
                fill="var(--chart-box-plot-box-upper, var(--pn-primary))"
              />
              <rect
                x={x - 22}
                y={y(median)}
                width="44"
                height={y(q1) - y(median)}
                fill="var(--chart-box-plot-box-lower, var(--pn-secondary))"
              />
              <text
                x={x}
                y={height - 7}
                textAnchor="middle"
                stroke="none"
                fontSize="10"
                fill="var(--pn-secondary)"
              >
                {point.x}
              </text>
            </g>
          )
        })}
      </svg>
    )
  } else if (type === "heatmap") {
    const max = Math.max(...series.flatMap((s) => s.data.map(numeric)), 1)
    chart = (
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${Math.max(count, 1) * 20} ${Math.max(series.length, 1) * 20}`}
        role="img"
        aria-label={`${type} chart`}
      >
        {series.flatMap((s, i) =>
          s.data.map((v, j) => (
            <rect
              key={`${i}-${j}`}
              x={j * 20}
              y={i * 20}
              width="19"
              height="19"
              rx="2"
              fill={color(i)}
              fillOpacity={0.15 + (numeric(v) / max) * 0.85}
            >
              <title>
                {s.name}: {numeric(v)}
              </title>
            </rect>
          )),
        )}
      </svg>
    )
  } else {
    const horizontal = config.plotOptions?.bar?.horizontal ?? false
    const axes = Array.isArray(config.yaxis) ? config.yaxis : [config.yaxis ?? {}]
    const axisFor = (name?: string) => Math.max(0, axes.findIndex(axis => axis.seriesName === name))
    const brush = config.chart?.brush?.enabled ?? false
    const selection = config.chart?.selection?.xaxis
    const selectedIndex = (timestamp: number | undefined, fallback: number) => {
      if (timestamp === undefined) return fallback
      const index = (config.labels ?? []).findIndex(value => new Date(value).getTime() >= timestamp)
      return index < 0 ? fallback : index
    }
    chart = (
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={range && !brush ? data.slice(range.startIndex, range.endIndex + 1) : data}
          syncId={config.chart?.group}
          layout={horizontal ? "vertical" : "horizontal"}
          margin={
            spark
              ? { top: 6, right: 0, left: 0, bottom: 0 }
              : { top: config.annotations?.xaxis?.length ? 30 : 12, right: 8, left: -12, bottom: 0 }
          }
          barCategoryGap="25%"
          barGap={0}
        >
          <defs>
            {series.map((_, i) => (
              <linearGradient
                id={`${unique}-${i}`}
                key={i}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={color(i)} stopOpacity={0.18} />
                <stop offset="100%" stopColor={color(i)} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          {!spark && !brush && (
            <CartesianGrid
              stroke="var(--pn-border-color)"
              strokeDasharray="4 4"
              vertical={false}
            />
          )}
          <XAxis
            hide={spark || brush}
            type={horizontal ? "number" : "category"}
            dataKey={horizontal ? undefined : "label"}
            tickLine={false}
            axisLine={false}
            tick={axisStyle}
            minTickGap={30}
            domain={type === "rangeBar" ? ["dataMin", "dataMax"] : undefined}
            tickFormatter={
              type === "rangeBar" && config.xaxis?.type === "datetime"
                ? (value) =>
                    new Date(value).toLocaleDateString("en-GB", {
                      month: "short",
                      day: "numeric",
                      timeZone: "UTC",
                    })
                : undefined
            }
          />
          {axes.map((axis, index) => <YAxis
            key={index}
            yAxisId={index}
            orientation={axis.opposite ? "right" : "left"}
            hide={spark || brush}
            type={horizontal ? "category" : "number"}
            dataKey={horizontal ? "label" : undefined}
            tickLine={false}
            axisLine={false}
            tick={axisStyle}
            domain={horizontal ? undefined : [axis.min ?? 0, axis.max ?? "auto"]}
            width={type === "rangeBar" ? 92 : axes.length > 1 ? 48 : 60}
            tickFormatter={value => typeof value === "number" && Math.abs(value) >= 1000 ? `${value / 1000}k` : String(value)}
          />)}
          {config.annotations?.yaxis?.map((annotation, index) => <ReferenceLine
            key={`y-${index}`}
            y={annotation.y}
            yAxisId={0}
            stroke={annotation.borderColor ?? "var(--pn-secondary)"}
            strokeDasharray={String(annotation.strokeDashArray ?? 4)}
            label={{ value: annotation.label?.text, position: "insideBottomLeft", fill: annotation.borderColor ?? "var(--pn-secondary)", fontSize: 10 }}
          />)}
          {config.annotations?.xaxis?.map((annotation, index) => <ReferenceLine
            key={`x-${index}`}
            x={annotation.x === undefined ? undefined : label(annotation.x)}
            yAxisId={0}
            stroke={annotation.borderColor ?? "var(--pn-secondary)"}
            strokeDasharray={String(annotation.strokeDashArray ?? 4)}
            label={{ value: annotation.label?.text, position: "top", fill: annotation.borderColor ?? "var(--pn-secondary)", fontSize: 10 }}
          />)}
          {series.map((s, i) => {
            const kind = s.type ?? type
            const shared = {
              dataKey: `s${i}`,
              yAxisId: axisFor(s.name),
              name: s.name,
              stroke: color(i),
              isAnimationActive: false,
            }
            const labels = config.dataLabels?.enabled ? <LabelList dataKey={`s${i}`} position="top" fill="var(--pn-body-color)" fontSize={10} offset={6} /> : null
            if (["bar", "column", "rangeBar", "candlestick"].includes(kind))
              return (
                <Bar
                  key={i}
                  {...shared}
                  stroke="none"
                  fill={color(i)}
                  stackId={config.chart?.stacked ? "total" : undefined}
                >{labels}</Bar>
              )
            if (kind === "area")
              return (
                <Area
                  key={i}
                  {...shared}
                  type="monotone"
                  strokeWidth={2}
                  fill={`url(#${unique}-${i})`}
                  stackId={config.chart?.stacked ? "total" : undefined}
                >{labels}</Area>
              )
            return (
              <Line
                key={i}
                {...shared}
                type={
                  config.stroke?.curve === "straight" ? "linear" : config.stroke?.curve === "stepline" ? "stepAfter" : "monotone"
                }
                strokeWidth={
                  Array.isArray(config.stroke?.width)
                    ? config.stroke.width[i]
                    : (config.stroke?.width ?? 2)
                }
                strokeDasharray={
                  Array.isArray(config.stroke?.dashArray)
                    ? String(config.stroke.dashArray[i])
                    : undefined
                }
                dot={false}
              >{labels}</Line>
            )
          })}
          {tooltip}
          {brush && <Brush
            dataKey="label"
            height={24}
            travellerWidth={8}
            startIndex={range?.startIndex ?? selectedIndex(selection?.min, 0)}
            endIndex={range?.endIndex ?? selectedIndex(selection?.max, count - 1)}
            onChange={value => {
              if (value.startIndex !== undefined && value.endIndex !== undefined) onRangeChange?.({ startIndex: value.startIndex, endIndex: value.endIndex })
            }}
            stroke="var(--pn-primary)"
            fill="var(--pn-bg-surface)"
          />}
          {!spark && !brush && config.legend?.show !== false && (
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12 }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    )
  }
  return (
    <div
      {...props}
      className={className}
      style={{ minWidth: 0, height, ...style }}
      data-workspace-chart={type}
    >
      {chart}
    </div>
  )
}
