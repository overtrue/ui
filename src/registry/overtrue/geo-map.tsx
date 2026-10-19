"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type GeoMapStatus = "ok" | "warn" | "critical";

/** A position as `[latitude, longitude]` in decimal degrees. */
export type GeoMapCoordinates = [lat: number, lng: number];

export interface GeoMapPoint {
  id: string;
  label: string;
  /** Latitude in decimal degrees, north positive. Drawn between 84°N and 56°S. */
  lat: number;
  /** Longitude in decimal degrees, east positive. */
  lng: number;
  /** Sizes the marker by area, relative to the largest value on the map. */
  value?: number;
  /** Health of the location. Defaults to ok. */
  status?: GeoMapStatus;
  /** Any CSS color. Overrides the status color for this marker. */
  color?: string;
  /** Force the sonar pulse on or off. Critical points pulse by default. */
  pulse?: boolean;
  /** Secondary text for the readout, such as a region code. */
  description?: string;
}

export interface GeoMapArc {
  id: string;
  /** A point id, or coordinates for a location without a marker. */
  from: GeoMapCoordinates | string;
  /** A point id, or coordinates for a location without a marker. */
  to: GeoMapCoordinates | string;
  /** Weights the arc's stroke relative to the largest arc value. */
  value?: number;
  /** Any CSS color. Defaults to the arc color. */
  color?: string;
}

export interface GeoMapColors {
  /** Land dots. Defaults to a muted-foreground mix. */
  land?: string;
  /** Healthy markers and the glow they cast. Defaults to var(--color-primary). */
  marker?: string;
  /** Arcs and their travelling pulses. Defaults to var(--color-primary). */
  arc?: string;
  /** Degraded markers. Defaults to amber. */
  warn?: string;
  /** Critical markers. Defaults to var(--color-destructive). */
  critical?: string;
}

/** Map geometry passed to `overlay`, for drawing your own SVG in map units. */
export interface GeoMapProjection {
  /** viewBox width, always 1000. */
  width: number;
  /** viewBox height, about 420. */
  height: number;
  /** viewBox units per CSS pixel at the current size. Multiply pixel sizes by it. */
  unit: number;
  /** Latitude and longitude to viewBox coordinates. */
  project: (lat: number, lng: number) => [x: number, y: number];
}

export interface GeoMapProps extends Omit<
  React.ComponentProps<"div">,
  "title" | "children"
> {
  points: GeoMapPoint[];
  /** Curved connections between points or coordinates, with a travelling pulse. */
  arcs?: GeoMapArc[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Controls at the top right, such as a live badge or a metric picker. */
  actions?: React.ReactNode;
  /** Dot columns across the map, or "auto" for a steady dot pitch at any size. */
  density?: number | "auto";
  /** Dot diameter as a fraction of the dot pitch, 0.15–1. Defaults to 0.5. */
  dotSize?: number;
  colors?: GeoMapColors;
  /** Name of the value, e.g. "Requests/s". Shown in the readout and legend. */
  valueLabel?: string;
  /** Formats point values. Defaults to a compact number. */
  valueFormatter?: (value: number) => string;
  /** Names for each status in the readout, legend, and labels. */
  statusLabels?: Partial<Record<GeoMapStatus, string>>;
  /** The selected point. Pass null for none; leave undefined to let the map manage it. */
  selectedId?: string | null;
  defaultSelectedId?: string | null;
  onSelectedChange?: (id: string | null, point: GeoMapPoint | null) => void;
  /** Replaces the readout body for the hovered, focused, or selected point. */
  renderTooltip?: (point: GeoMapPoint) => React.ReactNode;
  /** Readout content when no point is active. Defaults to a count and total. */
  summary?: React.ReactNode;
  /** Draw your own SVG above the land, in viewBox units. */
  overlay?: (projection: GeoMapProjection) => React.ReactNode;
  /** Content beside the map on wide cards and below it on narrow ones, such as a synced list. */
  aside?: React.ReactNode;
  /** Fixed map height in pixels. By default the map keeps its aspect ratio. */
  height?: number;
  showLegend?: boolean;
  /** Animate arc pulses and marker sonar. Always off under reduced motion. */
  animated?: boolean;
}

/* ------------------------------------------------------------------------ */
/* Projection                                                                */
/* ------------------------------------------------------------------------ */

// Robinson projection (Snyder's table, 5° steps, linear interpolation), central
// meridian 11°E so the seam falls in the Bering Strait, cropped to 84°N–56°S. The land mask below was sampled from the same
// inverse, so projected coordinates and land dots always agree.
const ROBINSON_X = [
  1, 0.9986, 0.9954, 0.99, 0.9822, 0.973, 0.96, 0.9427, 0.9216, 0.8962, 0.8679,
  0.835, 0.7986, 0.7597, 0.7186, 0.6732, 0.6213, 0.5722, 0.5322,
];
const ROBINSON_Y = [
  0, 0.062, 0.124, 0.186, 0.248, 0.31, 0.372, 0.434, 0.4958, 0.5571, 0.6176,
  0.6769, 0.7346, 0.7903, 0.8435, 0.8936, 0.9394, 0.9761, 1,
];
const LAT_TOP = 84;
const LAT_BOTTOM = -56;
const CENTRAL_MERIDIAN = 11;
const DEG = Math.PI / 180;

function robinson(table: number[], lat: number) {
  const a = Math.min(89.9999, Math.abs(lat)) / 5;
  const i = Math.floor(a);
  return table[i] + (table[i + 1] - table[i]) * (a - i);
}

/** viewBox width of the map. */
export const GEO_MAP_WIDTH = 1000;
const SCALE = GEO_MAP_WIDTH / (2 * Math.PI * 0.8487);
const Y_TOP = 1.3523 * robinson(ROBINSON_Y, LAT_TOP);
/** viewBox height of the map, about 420.26. */
export const GEO_MAP_HEIGHT =
  (Y_TOP + 1.3523 * robinson(ROBINSON_Y, LAT_BOTTOM)) * SCALE;

/**
 * Project latitude and longitude (decimal degrees) to GeoMap viewBox coordinates:
 * x runs 0–1000 from 169°W eastwards round to 169°W again (centered on 11°E), y runs
 * 0–≈420 from 84°N to 56°S. Longitudes wrap; latitudes outside the crop are pinned.
 */
export function projectGeo(lat: number, lng: number): [x: number, y: number] {
  const la = Math.min(LAT_TOP, Math.max(LAT_BOTTOM, lat));
  const ln = ((((lng - CENTRAL_MERIDIAN + 180) % 360) + 360) % 360) - 180;
  const x =
    GEO_MAP_WIDTH / 2 + SCALE * 0.8487 * robinson(ROBINSON_X, la) * ln * DEG;
  const y = (Y_TOP - Math.sign(la) * 1.3523 * robinson(ROBINSON_Y, la)) * SCALE;
  return [x, y];
}

/* ------------------------------------------------------------------------ */
/* Land mask                                                                 */
/* ------------------------------------------------------------------------ */

// 400 × 168 land bitmap on the projection above, generated once by rasterising the
// Natural Earth-derived country outlines shipped with jsvectormap in headless Chrome
// (4×4 supersampling per cell). Run-length encoded in row-major order: runs alternate
// water and land starting with water, one base-64 digit per run, with runs over 63
// split by a zero-length opposite run.
const LAND_COLS = 400;
const LAND_ROWS = 168;
const LAND_RLE = [
  "_0_0G113HD_0_0_0_0_0ek32_0_0_0_0_0TtN212F2T4_0_0_0_0EF5XLAl511_0_0_0y152122C",
  "2cN521s3_0_0_0o3E2485bO3z2_0_0_0j313224333618ax6J21BJ2_0_0_0K8421219GTv4JJI6",
  "21_0_0_056H2RRv3LJ_0_0_0V85233132613GPw3Ib92_0_0_04G33122CFQw3A3111f88_0_0X2",
  "P22B642EDQd1J3841j1GL2_0_02D11C18C443GBPZ8T41_06_0_0EL2E2B23134348DLYFK4241_",
  "0D18_0vg5351252465CKaJ42421A141_0P_0r_0541279HdM222K1_0S_0l21_037A7GF1OH142_",
  "0x_0d_0786228CD8M8384_0-_0c_04133BBAF8L9292_0v52_0fy421276BAG4MA2_0_0791_0W_",
  "0161A5D7gA3_0_0A_0c_D551E7fB3_0y1A_0d_E7J5gB3_0u2228_0b11F3jF7L2hC333_0m6611",
  "_0f8219fE833zB5_0n2353_0n4EeE914p283256_0hG3_0m5HbEEp3D4511_0gF6_0h3LfBEo493",
  "144_0iG7_0d3Og9Fp392136_0iH6_0a2Sj4Jl11491118_0iI6_0_02j3Li33292112_0p11F5_0",
  "-12j2Mi3245_0_0111C4_0_02i3Mi3163_0_05C2_0_03j1Mi2362_0_07C2_0_01_0321n51_0_",
  "0712_0_0Dx2432s_0_0912_0_0D21s112144o_0_0C22_0_0D11X2L66l_0_0F11_0_0DY5K66m_",
  "0_0E21_0_0CX123KA1od1C1_0N31_0_0Ae2MwV323A5_0L_0_0Ea223JyD2G331A4_0M51_0_08b",
  "132D22-F2E993_0N53_0_05b141327z439342CC83_0M64_0_02b2G-C834AD74_0H2164_0_03b",
  "142A_C52243953674_0G92_0_04r_02BB42A18395_0EB1_0_03p_0498253242P3_0617C2_0_0",
  "2o_04A8261334N4_052223C2_0_01o_05AG1433N5_0374B2_0_02n_059E3623N5_0474A2_0_0",
  "2m_068812141724O3_094384_0_01m_0925BJ1222_0P6375_0_01l_0A23DQ_0P7338_0_01k_0",
  "AJM22_0P7239_0_02i_0BJQ_0QB6_0_06f_0BMO_0S94_0_09d_0CQ63C_0T92_0_0Ac_0DR4832",
  "3_0U82_0_0B12Y_0DU1_0k_0_0L12P45_0D-1_0E_0_0L21J4173_0C_2_0E_0_0L11HE3_0B_01",
  "3_0D_0_0K22FF3_09o2F3_0B_0_0L32EG2_08q2F421_06_0_0N12DH2_07r2F8_04_0_0O13CH1",
  "_08s2G41452v_0_0O13BL1_04t3F33Bt31_0_0M13A_0Qu3MAr32_0_0R9F4_06v3NAp42_0_0R9",
  "E134_03w2NAN2N_0_0a98393_02w2MCJ5H22_0_0c974A4_w3LFG6F_0o2sA64F3xx3JGF8E32_0",
  "_0d954G5vx4IHCAE32_0_0eHA24242sy3HICBEF2_0_0TE_0Gz3FJBCEF2_0_0VC_0Gz4BMAD31B",
  "E2_0_0X13B_0A-4AO7JCD2_0_0cA_0A_0128Q7JDC2_0_0d9_0A_0217S6KCD3_0_0e6_0A_07V6",
  "KCD112_0_0f4_0A_04Y6K228H1_0_0e4B211x_0281R5L137H2_0_0e2A7x_0235S4L145F211_0",
  "_0f38Gq_09S4L162H2_0_0i2223Hq_08S311K161L1_0_0g42Kq_07U122I3P4_0_0i12Mo_07X2",
  "K1O5_0_0mLq_05X2K2H173_0_0mMqE2oZ1L2F281_0_0nRmB5nq233D5_0_0uSm2Elr324B5_0_0",
  "vT_04gt323B4_0_0vU_04gu31396_0_0uW_03fw688_0_0tW_03dy66A7122_0_0gX_03c-56A25",
  "32_0_0fZ_02Q1A_569_0_0sczQ2A_01469221194_0_0ZeyP29_0346733B332_0_0VgwY_04557",
  "33C225_0_0SlsX_0656113311241132C_0_0PmsW_073F112DC81_0_0DosJ1A_092F122FA61_0",
  "_0FpqU_0A1aA2331_0_0CpqU_0B3XA91_0_0CorT_0C7SA_0_0NnrT_0G5P723_0_0NmrT_0N221",
  "42G242_0_0NlsU_0P141P3_0_0MjuU_0v1_0_0MjuU_0c1A1_0_0VhvU_0b652_0_0VhuV91_0P7",
  "62_0_0WfvV82_0P762_0_0WfuW73_0K31773_0_0WeuW64_0JC65N1_0_09cuV56_0IF45_0_0Yb",
  "uU56_0HI35_0_0aZuS76_0HQY2_0_01YuR86_0GR_0_0bYvP96_0FT_0_0aXwOA5_0EW_0_0ZXwO",
  "A5_0AaH1_0_0IWxO86_09cH1_0_0HVyO85_09e_0_0YS_01N85_08f_0_0YQ_03M95_08f_0_0YP",
  "_04LB3_09g_0_0XO_05K_0Og_0_0XO_05K_0Nh_0_0XO_05J_0Pg_0_0XO_06I_0Pg_0_0XO_07H",
  "_0Pg_0_0XN_08G_0Qf_0_0YN_09E_0Re_0_0ZM_0AD_0Se_0_0ZL_0BC_0TD4M_0_0bK_0BB_0U9",
  "AJ_0_0cK_0B9_0V9BI_0_0dJ_0D3_0Z5G21E_0_0eF_0_0_0GDN2_0_0GG_0_0_0GBP1_0_0GH_0",
  "_0_0FBP1_0_0FH_0_0_0GAP2_0_0GG_0_0_0H6S4_0_0EC_0_0_0r5_0_0FC_0_0_0s2_0_0HC_0",
  "_0_0M1R122_0_0J9_0_0_0O3O3_0_0MB_0_0_0M3N3_0_0NA_0_0_0M2N3_0_0R8_0_0_0j3_0_0",
  "S9_0_0_0h4_0_0T7_0_0_0h5_0_0U8_0_0_0h2_0_0X9_0_0_0_0_0_0D9_0_0_0_0_0_0D8_0_0",
  "61_0_0_0_078_0_061_0_0_0_086_0_0_0_0_0_0H682_0_0_0_0_0_06691_0_0_0_0_0_085_0",
  "_0_0_0_0_0I5_0_0_0_0_0_0J6_0_0_0_0_0_0J1_0_0_0_0L",
].join("");
const RLE_DIGITS =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";

let landTable: Float64Array | null = null;

/** Summed-area table of the decoded bitmap, built on first use. */
function landIntegral() {
  if (landTable) return landTable;
  const bits = new Uint8Array(LAND_COLS * LAND_ROWS);
  let k = 0;
  let land = false;
  for (const digit of LAND_RLE) {
    const run = RLE_DIGITS.indexOf(digit);
    if (land) bits.fill(1, k, k + run);
    k += run;
    land = !land;
  }
  const w = LAND_COLS + 1;
  const table = new Float64Array(w * (LAND_ROWS + 1));
  for (let j = 0; j < LAND_ROWS; j++) {
    let row = 0;
    for (let i = 0; i < LAND_COLS; i++) {
      row += bits[j * LAND_COLS + i];
      table[(j + 1) * w + i + 1] = table[j * w + i + 1] + row;
    }
  }
  landTable = table;
  return table;
}

interface LandDots {
  d: string;
  pitch: number;
  count: number;
}

const landCache = new Map<number, LandDots>();
const r2 = (value: number) => Math.round(value * 100) / 100;

/**
 * Resample the bitmap to `cols` dot columns. The summed-area table is bilinear inside
 * each cell, so any dot pitch gets an exact land fraction. All dots form one path of
 * zero-length segments that render as round caps: one DOM node for thousands of dots.
 */
function landDots(columns: number): LandDots {
  const cols = Math.min(480, Math.max(40, Math.round(columns)));
  const cached = landCache.get(cols);
  if (cached) return cached;
  const table = landIntegral();
  const w = LAND_COLS + 1;
  const source = GEO_MAP_WIDTH / LAND_COLS;
  const at = (sx: number, sy: number) => {
    const x = Math.min(LAND_COLS, Math.max(0, sx));
    const y = Math.min(LAND_ROWS, Math.max(0, sy));
    const i = Math.min(LAND_COLS - 1, Math.floor(x));
    const j = Math.min(LAND_ROWS - 1, Math.floor(y));
    const u = x - i;
    const v = y - j;
    const o = j * w + i;
    return (
      table[o] * (1 - u) * (1 - v) +
      table[o + 1] * u * (1 - v) +
      table[o + w] * (1 - u) * v +
      table[o + w + 1] * u * v
    );
  };
  const pitch = GEO_MAP_WIDTH / cols;
  const rows = Math.floor(GEO_MAP_HEIGHT / pitch);
  const top = (GEO_MAP_HEIGHT - rows * pitch) / 2;
  const span = pitch / source;
  let d = "";
  let count = 0;
  for (let j = 0; j < rows; j++) {
    const y0 = (top + j * pitch) / source;
    const y1 = y0 + span;
    let last = -1;
    for (let i = 0; i < cols; i++) {
      const x0 = i * span;
      const x1 = x0 + span;
      const cover =
        (at(x1, y1) - at(x0, y1) - at(x1, y0) + at(x0, y0)) / (span * span);
      if (cover < 0.4) continue;
      d +=
        last < 0
          ? `M${r2((i + 0.5) * pitch)} ${r2(top + (j + 0.5) * pitch)}h0`
          : `m${r2((i - last) * pitch)} 0h0`;
      last = i;
      count += 1;
    }
  }
  const result = { d, pitch, count };
  landCache.set(cols, result);
  return result;
}

/* ------------------------------------------------------------------------ */
/* Helpers                                                                   */
/* ------------------------------------------------------------------------ */

const defaultStatusLabels: Record<GeoMapStatus, string> = {
  ok: "Healthy",
  warn: "Degraded",
  critical: "Critical",
};
const statusOrder: GeoMapStatus[] = ["ok", "warn", "critical"];
const AMBER = "var(--color-amber-500, oklch(76.9% 0.188 70.08))";

const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const defaultValueFormatter = (value: number) => compact.format(value);

function formatCoordinate(value: number, positive: string, negative: string) {
  return `${Math.abs(value).toFixed(1)}°${value >= 0 ? positive : negative}`;
}

function finite(value: number | undefined): value is number {
  return value != null && Number.isFinite(value);
}

function useReducedMotion() {
  return React.useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/** Quadratic arc bowed toward the pole, like a great circle on a flat map. */
function arcPath([x0, y0]: [number, number], [x1, y1]: [number, number]) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const length = Math.hypot(dx, dy) || 1;
  let nx = -dy / length;
  let ny = dx / length;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  const lift = Math.min(150, length * 0.28);
  const cx = (x0 + x1) / 2 + nx * lift;
  const cy = (y0 + y1) / 2 + ny * lift;
  return {
    d: `M${r2(x0)} ${r2(y0)}Q${r2(cx)} ${r2(cy)} ${r2(x1)} ${r2(y1)}`,
    length,
  };
}

/* ------------------------------------------------------------------------ */
/* Marker                                                                    */
/* ------------------------------------------------------------------------ */

interface MarkerProps {
  point: GeoMapPoint;
  x: number;
  y: number;
  radius: number;
  unit: number;
  color: string;
  status: GeoMapStatus;
  label: string;
  pulse: boolean;
  halo: string;
  active: boolean;
  selected: boolean;
  dimmed: boolean;
  tabStop: boolean;
  onHover: (id: string | null) => void;
  onFocusPoint: (id: string) => void;
  onToggle: (id: string) => void;
}

const Marker = React.memo(function Marker({
  point,
  x,
  y,
  radius,
  unit,
  color,
  status,
  label,
  pulse,
  halo,
  active,
  selected,
  dimmed,
  tabStop,
  onHover,
  onFocusPoint,
  onToggle,
}: MarkerProps) {
  const ring = radius + 3.5 * unit;
  return (
    <g
      role="button"
      tabIndex={tabStop ? 0 : -1}
      aria-label={label}
      aria-pressed={selected}
      data-slot="geo-map-marker"
      data-id={point.id}
      data-status={status}
      data-active={active || undefined}
      data-selected={selected || undefined}
      transform={`translate(${r2(x)} ${r2(y)})`}
      className={cn(
        "group/marker pointer-events-auto cursor-pointer outline-none",
        "transition-opacity duration-300 motion-reduce:transition-none",
        dimmed && "opacity-45",
      )}
      style={{ color }}
      onPointerEnter={() => onHover(point.id)}
      onPointerLeave={() => onHover(null)}
      onFocus={() => onFocusPoint(point.id)}
      onClick={() => onToggle(point.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onToggle(point.id);
        }
      }}
    >
      <circle r={Math.max(9 * unit, radius + 4 * unit)} fill="transparent" />
      {pulse ? (
        <>
          <circle
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.25 * unit}
            className="geo-map-pulse motion-reduce:hidden"
          />
          <circle
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.25 * unit}
            className="geo-map-pulse motion-reduce:hidden"
            style={{ animationDelay: "-1.1s" }}
          />
          <circle
            r={radius * 2}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.45}
            strokeWidth={unit}
            className="hidden motion-reduce:inline"
          />
        </>
      ) : null}
      <circle
        r={radius * 3.2}
        fill={halo}
        className={cn(
          "transition-[opacity,r] duration-500 motion-reduce:transition-none",
          active || selected ? "opacity-100" : "opacity-60",
        )}
      />
      <circle
        r={radius}
        fill="currentColor"
        stroke="var(--color-card)"
        strokeWidth={1.25 * unit}
        className="transition-[r] duration-500 ease-out motion-reduce:transition-none"
      />
      <circle
        r={Math.max(0.9 * unit, radius * 0.36)}
        fill="white"
        opacity={0.82}
        className="transition-[r] duration-500 ease-out motion-reduce:transition-none"
      />
      <circle
        r={ring}
        fill="none"
        stroke="var(--color-foreground)"
        strokeOpacity={0.75}
        strokeWidth={1.25 * unit}
        className={cn(
          "transition-opacity duration-150 motion-reduce:transition-none",
          active || selected ? "opacity-100" : "opacity-0",
        )}
      />
      <circle
        r={ring + 2 * unit}
        fill="none"
        stroke="var(--color-ring)"
        strokeWidth={2.5 * unit}
        className="opacity-0 group-focus-visible/marker:opacity-60"
      />
    </g>
  );
});

/* ------------------------------------------------------------------------ */
/* GeoMap                                                                    */
/* ------------------------------------------------------------------------ */

/**
 * A dot-matrix world map with glowing, value-sized markers and animated arcs. Hover
 * or focus a marker to read it in a readout fixed inside the card; the map is one
 * tab stop and arrow keys move west to east.
 */
function GeoMap({
  points,
  arcs,
  title,
  description,
  actions,
  density = "auto",
  dotSize = 0.5,
  colors,
  valueLabel = "Value",
  valueFormatter = defaultValueFormatter,
  statusLabels,
  selectedId,
  defaultSelectedId = null,
  onSelectedChange,
  renderTooltip,
  summary,
  overlay,
  aside,
  height,
  showLegend = true,
  animated = true,
  className,
  style,
  ...props
}: GeoMapProps) {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const reduced = useReducedMotion();
  const motion = animated && !reduced;
  const labels = { ...defaultStatusLabels, ...statusLabels };
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [box, setBox] = React.useState<{ w: number; h: number } | null>(null);
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const [focusedId, setFocusedId] = React.useState<string | null>(null);
  const [tabStopId, setTabStopId] = React.useState<string | null>(null);
  const [innerSelected, setInnerSelected] = React.useState<string | null>(
    defaultSelectedId,
  );
  const controlled = selectedId !== undefined;
  const selected = controlled ? selectedId : innerSelected;

  React.useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      const w = Math.round(stage.clientWidth);
      const h = Math.round(stage.clientHeight);
      setBox((current) =>
        current && current.w === w && current.h === h ? current : { w, h },
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  // CSS pixels → viewBox units. Markers and strokes keep their pixel size at any width.
  const scale = box
    ? Math.min(box.w / GEO_MAP_WIDTH, box.h / GEO_MAP_HEIGHT) || 0.62
    : 0.62;
  const unit = 1 / scale;
  const mapWidth = GEO_MAP_WIDTH * scale;
  // Auto density: a finer pitch on small maps keeps coastlines legible, up to ~3.8px wide.
  const columns =
    density === "auto"
      ? Math.round(
          mapWidth / Math.min(3.8, Math.max(2.9, mapWidth / 190)) / 4,
        ) * 4
      : density;
  // Markers shrink a little on small maps so clusters stay readable.
  const markerScale = Math.min(1, Math.max(0.62, mapWidth / 620));
  const land = landDots(columns);
  const dot = land.pitch * Math.min(1, Math.max(0.15, dotSize));

  const colorOf = React.useCallback((point: GeoMapPoint) => {
    if (point.color) return point.color;
    const status = point.status ?? "ok";
    return status === "critical"
      ? "var(--geo-map-critical)"
      : status === "warn"
        ? "var(--geo-map-warn)"
        : "var(--geo-map-marker)";
  }, []);

  const byId = React.useMemo(
    () => new Map(points.map((point) => [point.id, point])),
    [points],
  );
  const maxValue = React.useMemo(
    () =>
      points.reduce(
        (max, point) =>
          finite(point.value) ? Math.max(max, point.value) : max,
        0,
      ),
    [points],
  );
  const total = React.useMemo(
    () =>
      points.reduce(
        (sum, point) => (finite(point.value) ? sum + point.value : sum),
        0,
      ),
    [points],
  );
  const counts = React.useMemo(() => {
    const result = { ok: 0, warn: 0, critical: 0 };
    for (const point of points) result[point.status ?? "ok"] += 1;
    return result;
  }, [points]);

  // West to east, then north to south: the order arrow keys follow.
  const ordered = React.useMemo(
    () => [...points].sort((a, b) => a.lng - b.lng || b.lat - a.lat),
    [points],
  );

  const sizeOf = (point: GeoMapPoint) => {
    const t =
      maxValue > 0 && finite(point.value)
        ? Math.sqrt(Math.max(0, point.value) / maxValue)
        : 0.45;
    return (3 + 4.5 * t) * markerScale;
  };

  // Hover and focus are transient and dim the rest; a selection only keeps the readout.
  const transientId = hoveredId ?? focusedId ?? null;
  const activeId = transientId ?? selected ?? null;
  const activePoint = activeId ? (byId.get(activeId) ?? null) : null;
  const stopId =
    tabStopId && byId.has(tabStopId)
      ? tabStopId
      : selected && byId.has(selected)
        ? selected
        : (ordered[0]?.id ?? null);

  const setSelected = React.useCallback(
    (id: string | null) => {
      if (!controlled) setInnerSelected(id);
      onSelectedChange?.(id, id ? (byId.get(id) ?? null) : null);
    },
    [controlled, onSelectedChange, byId],
  );
  const onToggle = React.useCallback(
    (id: string) => setSelected(selected === id ? null : id),
    [selected, setSelected],
  );
  const onFocusPoint = React.useCallback((id: string) => {
    setFocusedId(id);
    setTabStopId(id);
  }, []);

  const resolve = (end: GeoMapCoordinates | string) => {
    if (typeof end === "string") {
      const point = byId.get(end);
      return point ? projectGeo(point.lat, point.lng) : null;
    }
    return projectGeo(end[0], end[1]);
  };

  const arcMax = (arcs ?? []).reduce(
    (max, arc) => (finite(arc.value) ? Math.max(max, arc.value) : max),
    0,
  );
  const drawnArcs = (arcs ?? []).flatMap((arc, index) => {
    const a = resolve(arc.from);
    const b = resolve(arc.to);
    if (!a || !b) return [];
    const { d, length } = arcPath(a, b);
    const weight =
      arcMax > 0 && finite(arc.value)
        ? 0.45 + 0.55 * (arc.value / arcMax)
        : 0.75;
    const linked =
      activeId != null && (arc.from === activeId || arc.to === activeId);
    return [
      {
        arc,
        index,
        a,
        b,
        d,
        weight,
        linked,
        // Longer arcs travel a little longer; a fixed stagger keeps pulses out of step.
        duration: 2.2 + length / 420,
        delay: -((index * 0.73) % 2.6),
        color: arc.color ?? "var(--geo-map-arc)",
      },
    ];
  });

  // Land lit by nearby markers: one masked copy of the dots per marker color.
  const glowGroups = React.useMemo(() => {
    const groups = new Map<string, GeoMapPoint[]>();
    for (const point of points) {
      const color = colorOf(point);
      if (!groups.has(color)) groups.set(color, []);
      groups.get(color)!.push(point);
    }
    return [...groups.entries()];
  }, [points, colorOf]);

  const glowIndex = new Map(glowGroups.map(([color], g) => [color, g]));

  const project = React.useCallback(
    (lat: number, lng: number) => projectGeo(lat, lng),
    [],
  );

  const onKeyDown = (event: React.KeyboardEvent<SVGSVGElement>) => {
    const target = event.target as Element;
    const id = target.getAttribute("data-id");
    if (!id || target.getAttribute("data-slot") !== "geo-map-marker") return;
    if (event.key === "Escape") {
      if (selected != null) {
        event.preventDefault();
        setSelected(null);
      }
      return;
    }
    const index = ordered.findIndex((point) => point.id === id);
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: ordered.length - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const next =
      ordered[Math.min(ordered.length - 1, Math.max(0, moves[event.key]))];
    if (!next) return;
    setTabStopId(next.id);
    event.currentTarget
      .querySelector<SVGGElement>(
        `[data-slot="geo-map-marker"][data-id="${CSS.escape(next.id)}"]`,
      )
      ?.focus();
  };

  const describe = (point: GeoMapPoint) => {
    const parts = [point.label];
    if (point.description) parts.push(point.description);
    if (finite(point.value))
      parts.push(`${valueLabel} ${valueFormatter(point.value)}`);
    parts.push(labels[point.status ?? "ok"]);
    return parts.join(", ");
  };

  const hasHeader = title != null || description != null || actions != null;
  const mapLabel = typeof title === "string" ? title : "World map";
  const H = GEO_MAP_HEIGHT;
  const viewBox = `0 0 ${GEO_MAP_WIDTH} ${r2(H)}`;
  const activeXY = activePoint
    ? projectGeo(activePoint.lat, activePoint.lng)
    : null;
  const attention = counts.warn + counts.critical;

  const toneOf = (status: GeoMapStatus) =>
    status === "critical"
      ? "text-destructive"
      : status === "warn"
        ? "text-amber-700 dark:text-amber-400"
        : "text-foreground/80";

  let readout: React.ReactNode;
  if (activePoint && renderTooltip) {
    readout = renderTooltip(activePoint);
  } else if (activePoint) {
    const status = activePoint.status ?? "ok";
    readout = (
      <>
        <div className="flex min-w-16 flex-col">
          <span className="text-base leading-5 font-semibold tracking-tight tabular-nums">
            {finite(activePoint.value)
              ? valueFormatter(activePoint.value)
              : "—"}
          </span>
          <span className="truncate text-[10.5px] leading-4 text-muted-foreground">
            {valueLabel}
          </span>
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="flex min-w-0 items-baseline gap-1.5 text-xs leading-5">
            <span className="truncate font-medium text-foreground">
              {activePoint.label}
            </span>
            {activePoint.description ? (
              <span className="shrink-0 font-mono text-[10.5px] text-muted-foreground">
                {activePoint.description}
              </span>
            ) : null}
          </span>
          <span className="flex min-w-0 items-center gap-1.5 text-[10.5px] leading-4 text-muted-foreground">
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full"
              style={{ background: colorOf(activePoint) }}
            />
            <span className={cn("shrink-0 font-medium", toneOf(status))}>
              {labels[status]}
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate font-mono tabular-nums">
              {formatCoordinate(activePoint.lat, "N", "S")}{" "}
              {formatCoordinate(activePoint.lng, "E", "W")}
            </span>
          </span>
        </div>
      </>
    );
  } else if (summary != null) {
    readout = summary;
  } else {
    readout = (
      <>
        <div className="flex min-w-16 flex-col">
          <span className="text-base leading-5 font-semibold tracking-tight tabular-nums">
            {maxValue > 0 ? valueFormatter(total) : points.length}
          </span>
          <span className="truncate text-[10.5px] leading-4 text-muted-foreground">
            {maxValue > 0 ? `total ${valueLabel}` : "locations"}
          </span>
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-xs leading-5 text-foreground">
            <span className="tabular-nums">{points.length}</span>{" "}
            {points.length === 1 ? "location" : "locations"}
            {drawnArcs.length ? (
              <>
                {" · "}
                <span className="tabular-nums">{drawnArcs.length}</span>{" "}
                {drawnArcs.length === 1 ? "route" : "routes"}
              </>
            ) : null}
          </span>
          <span
            className={cn(
              "truncate text-[10.5px] leading-4",
              counts.critical
                ? "text-destructive"
                : attention
                  ? "text-amber-700 dark:text-amber-400"
                  : "text-muted-foreground",
            )}
          >
            {attention
              ? `${attention} need attention`
              : "All locations healthy"}
          </span>
        </div>
      </>
    );
  }

  const projection: GeoMapProjection = {
    width: GEO_MAP_WIDTH,
    height: H,
    unit,
    project,
  };

  return (
    <div
      data-slot="geo-map"
      className={cn(
        "@container/geo-map flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs",
        "[--geo-map-land:color-mix(in_oklab,var(--color-muted-foreground)_36%,transparent)] dark:[--geo-map-land:color-mix(in_oklab,var(--color-muted-foreground)_46%,transparent)]",
        "[--geo-map-marker:var(--color-primary)] [--geo-map-arc:var(--color-primary)] [--geo-map-critical:var(--color-destructive)]",
        className,
      )}
      style={
        {
          "--geo-map-warn": AMBER,
          ...(colors?.land ? { "--geo-map-land": colors.land } : null),
          ...(colors?.marker ? { "--geo-map-marker": colors.marker } : null),
          ...(colors?.arc ? { "--geo-map-arc": colors.arc } : null),
          ...(colors?.warn ? { "--geo-map-warn": colors.warn } : null),
          ...(colors?.critical
            ? { "--geo-map-critical": colors.critical }
            : null),
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {hasHeader ? (
        <div
          data-slot="geo-map-header"
          className="flex flex-col gap-1 px-5 pt-5"
        >
          <div className="flex min-h-6 items-start justify-between gap-3">
            {title != null ? (
              <h3 className="min-w-0 text-sm leading-6 font-semibold tracking-tight">
                {title}
              </h3>
            ) : (
              <span />
            )}
            {actions != null ? (
              <div className="flex shrink-0 items-center gap-2">{actions}</div>
            ) : null}
          </div>
          {description != null ? (
            <p className="text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
      ) : null}

      <div
        className={cn(
          "grid min-w-0 flex-1",
          aside != null &&
            "@2xl/geo-map:grid-cols-[minmax(0,1fr)_minmax(14rem,17rem)]",
        )}
      >
        <div className="flex min-w-0 flex-col justify-center px-4 py-4">
          <div
            ref={stageRef}
            data-slot="geo-map-stage"
            className="relative w-full"
            style={
              height != null
                ? { height }
                : { aspectRatio: `${GEO_MAP_WIDTH} / ${r2(H)}` }
            }
          >
            <svg
              data-slot="geo-map-land"
              aria-hidden="true"
              viewBox={viewBox}
              className="absolute inset-0 size-full overflow-visible"
            >
              <defs>
                <radialGradient id={`${uid}-glow`}>
                  <stop offset="0" stopColor="white" stopOpacity="1" />
                  <stop offset="0.45" stopColor="white" stopOpacity="0.55" />
                  <stop offset="1" stopColor="white" stopOpacity="0" />
                </radialGradient>
                {glowGroups.map(([color, members], g) => (
                  <mask
                    key={color}
                    id={`${uid}-lit-${g}`}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width={GEO_MAP_WIDTH}
                    height={H}
                  >
                    {members.map((point) => {
                      const [x, y] = projectGeo(point.lat, point.lng);
                      const t =
                        maxValue > 0 && finite(point.value)
                          ? Math.sqrt(Math.max(0, point.value) / maxValue)
                          : 0.45;
                      const boost = point.id === activeId ? 1.35 : 1;
                      return (
                        <circle
                          key={point.id}
                          cx={r2(x)}
                          cy={r2(y)}
                          r={r2((22 + 46 * t) * boost)}
                          fill={`url(#${uid}-glow)`}
                          className="transition-[r] duration-700 ease-out motion-reduce:transition-none"
                        />
                      );
                    })}
                  </mask>
                ))}
              </defs>
              <path
                data-slot="geo-map-dots"
                d={land.d}
                fill="none"
                stroke="var(--geo-map-land)"
                strokeWidth={r2(dot)}
                strokeLinecap="round"
              />
              {glowGroups.map(([color], g) => (
                <path
                  key={color}
                  d={land.d}
                  fill="none"
                  stroke={color}
                  strokeWidth={r2(dot * 1.08)}
                  strokeLinecap="round"
                  mask={`url(#${uid}-lit-${g})`}
                  className="opacity-75 dark:opacity-90"
                />
              ))}
            </svg>

            <svg
              data-slot="geo-map-overlay"
              role="group"
              aria-label={`${mapLabel}: ${points.length} ${points.length === 1 ? "location" : "locations"}. Use the arrow keys to move between them.`}
              viewBox={viewBox}
              className="pointer-events-none absolute inset-0 size-full overflow-visible will-change-transform"
              onKeyDown={onKeyDown}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node))
                  setFocusedId(null);
              }}
            >
              <defs>
                {glowGroups.map(([color], g) => (
                  <radialGradient key={color} id={`${uid}-halo-${g}`}>
                    <stop
                      offset="0.25"
                      style={{ stopColor: color }}
                      stopOpacity="0.5"
                    />
                    <stop
                      offset="1"
                      style={{ stopColor: color }}
                      stopOpacity="0"
                    />
                  </radialGradient>
                ))}
                {drawnArcs.map(({ arc, a, b, color }) => (
                  <linearGradient
                    key={arc.id}
                    id={`${uid}-arc-${arc.id.replace(/[^a-zA-Z0-9_-]/g, "")}`}
                    gradientUnits="userSpaceOnUse"
                    x1={r2(a[0])}
                    y1={r2(a[1])}
                    x2={r2(b[0])}
                    y2={r2(b[1])}
                  >
                    <stop
                      offset="0"
                      style={{ stopColor: color }}
                      stopOpacity="0.08"
                    />
                    <stop
                      offset="0.6"
                      style={{ stopColor: color }}
                      stopOpacity="0.5"
                    />
                    <stop
                      offset="1"
                      style={{ stopColor: color }}
                      stopOpacity="0.9"
                    />
                  </linearGradient>
                ))}
              </defs>

              {activeXY ? (
                <g
                  data-slot="geo-map-crosshair"
                  aria-hidden="true"
                  stroke="var(--color-foreground)"
                  strokeOpacity={0.2}
                  strokeWidth={unit}
                  strokeDasharray={`${r2(2 * unit)} ${r2(3 * unit)}`}
                >
                  <line
                    x1={0}
                    x2={GEO_MAP_WIDTH}
                    y1={r2(activeXY[1])}
                    y2={r2(activeXY[1])}
                  />
                  <line
                    x1={r2(activeXY[0])}
                    x2={r2(activeXY[0])}
                    y1={0}
                    y2={r2(H)}
                  />
                </g>
              ) : null}

              <g data-slot="geo-map-arcs" aria-hidden="true">
                {drawnArcs.map(
                  ({
                    arc,
                    d,
                    b,
                    a,
                    weight,
                    linked,
                    duration,
                    delay,
                    color,
                  }) => {
                    const dim = transientId != null && !linked;
                    const fromCoords = typeof arc.from !== "string";
                    return (
                      <g
                        key={arc.id}
                        data-slot="geo-map-arc"
                        data-linked={linked || undefined}
                        className={cn(
                          "transition-opacity duration-300 motion-reduce:transition-none",
                          dim ? "opacity-25" : "opacity-100",
                        )}
                      >
                        <path
                          d={d}
                          fill="none"
                          stroke={`url(#${uid}-arc-${arc.id.replace(/[^a-zA-Z0-9_-]/g, "")})`}
                          strokeWidth={r2(
                            (0.75 + 0.75 * weight) * unit * (linked ? 1.4 : 1),
                          )}
                          strokeLinecap="round"
                        />
                        {fromCoords ? (
                          <circle
                            cx={r2(a[0])}
                            cy={r2(a[1])}
                            r={r2(1.75 * unit)}
                            fill={color}
                            fillOpacity={0.7}
                          />
                        ) : null}
                        {typeof arc.to !== "string" ? (
                          <circle
                            cx={r2(b[0])}
                            cy={r2(b[1])}
                            r={r2(1.75 * unit)}
                            fill={color}
                          />
                        ) : null}
                        {motion
                          ? (
                              [
                                [0.34, 1.75, 0.4],
                                [0.12, 2.25, 0.85],
                                [0.008, 4, 1],
                              ] as const
                            ).map(([dash, width, opacity], layer) => (
                              <path
                                key={layer}
                                d={d}
                                pathLength={1}
                                fill="none"
                                stroke={
                                  layer === 2
                                    ? `color-mix(in oklab, ${color} 30%, white)`
                                    : color
                                }
                                strokeOpacity={opacity}
                                strokeWidth={r2(
                                  width * unit * (0.7 + 0.3 * weight),
                                )}
                                strokeLinecap="round"
                                // One dash of length `dash` that ends at the pattern origin, so every
                                // layer's head sits at the same point as the offset slides along.
                                strokeDasharray={`0 ${3 - dash} ${dash} 0`}
                                className="geo-map-comet"
                                style={{
                                  animationDuration: `${duration.toFixed(2)}s`,
                                  animationDelay: `${delay.toFixed(2)}s`,
                                }}
                              />
                            ))
                          : null}
                      </g>
                    );
                  },
                )}
              </g>

              {overlay ? (
                <g data-slot="geo-map-custom">{overlay(projection)}</g>
              ) : null}

              <g
                data-slot="geo-map-markers"
                onPointerLeave={() => setHoveredId(null)}
              >
                {[...points]
                  .sort((a, b) => {
                    const rank = (point: GeoMapPoint) =>
                      (point.id === activeId ? 4 : 0) +
                      (point.id === selected ? 2 : 0) +
                      (point.status === "critical" ? 1 : 0);
                    return rank(a) - rank(b) || sizeOf(b) - sizeOf(a);
                  })
                  .map((point) => {
                    const [x, y] = projectGeo(point.lat, point.lng);
                    const status = point.status ?? "ok";
                    return (
                      <Marker
                        key={point.id}
                        point={point}
                        x={x}
                        y={y}
                        radius={sizeOf(point) * unit}
                        unit={unit}
                        color={colorOf(point)}
                        status={status}
                        label={describe(point)}
                        pulse={motion && (point.pulse ?? status === "critical")}
                        halo={`url(#${uid}-halo-${glowIndex.get(colorOf(point)) ?? 0})`}
                        active={point.id === activeId}
                        selected={point.id === selected}
                        dimmed={
                          transientId != null &&
                          point.id !== activeId &&
                          !drawnArcs.some(
                            (arc) =>
                              arc.linked &&
                              (arc.arc.from === point.id ||
                                arc.arc.to === point.id),
                          )
                        }
                        tabStop={point.id === stopId}
                        onHover={setHoveredId}
                        onFocusPoint={onFocusPoint}
                        onToggle={onToggle}
                      />
                    );
                  })}
              </g>

              {activeXY ? (
                <g
                  aria-hidden="true"
                  className="font-mono"
                  fontSize={r2(9.5 * unit)}
                  fill="var(--color-muted-foreground)"
                  stroke="var(--color-card)"
                  strokeWidth={r2(3 * unit)}
                  paintOrder="stroke"
                  strokeLinejoin="round"
                >
                  <text x={r2(2 * unit)} y={r2(activeXY[1] - 4 * unit)}>
                    {formatCoordinate(activePoint!.lat, "N", "S")}
                  </text>
                  <text x={r2(activeXY[0] + 4 * unit)} y={r2(H - 2 * unit)}>
                    {formatCoordinate(activePoint!.lng, "E", "W")}
                  </text>
                </g>
              ) : null}
            </svg>
          </div>
        </div>

        {aside != null ? (
          <div
            data-slot="geo-map-aside"
            className="min-w-0 border-t @2xl/geo-map:border-t-0 @2xl/geo-map:border-l"
          >
            {aside}
          </div>
        ) : null}
      </div>

      <div
        data-slot="geo-map-footer"
        className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t px-5 py-3"
      >
        <div
          data-slot="geo-map-readout"
          aria-hidden={activePoint ? true : undefined}
          data-active={activePoint ? true : undefined}
          className="flex min-h-9 min-w-0 flex-1 basis-56 items-center gap-3"
        >
          {readout}
        </div>
        {showLegend ? (
          <div
            data-slot="geo-map-legend"
            className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[11px] text-muted-foreground"
          >
            {statusOrder
              .filter((status) => status === "ok" || counts[status] > 0)
              .map((status) => (
                <span key={status} className="inline-flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-full"
                    style={{
                      background:
                        status === "critical"
                          ? "var(--geo-map-critical)"
                          : status === "warn"
                            ? "var(--geo-map-warn)"
                            : "var(--geo-map-marker)",
                    }}
                  />
                  {labels[status]}
                  <span className="font-medium text-foreground tabular-nums">
                    {counts[status]}
                  </span>
                </span>
              ))}
            {maxValue > 0 ? (
              <span className="inline-flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="inline-flex items-center gap-0.5"
                >
                  <span className="size-1.5 rounded-full border border-muted-foreground/70" />
                  <span className="size-2.5 rounded-full border border-muted-foreground/70" />
                </span>
                {valueLabel}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <style href="overtrue-geo-map" precedence="default">
        {`@keyframes geo-map-travel{0%{stroke-dashoffset:0}72%,100%{stroke-dashoffset:-1.36}}
@keyframes geo-map-pulse{0%{transform:scale(1);opacity:.75}80%,100%{transform:scale(3.4);opacity:0}}
.geo-map-comet{stroke-dashoffset:0;animation-name:geo-map-travel;animation-iteration-count:infinite;animation-timing-function:cubic-bezier(.45,0,.3,1)}
.geo-map-pulse{transform-box:fill-box;transform-origin:center;animation:geo-map-pulse 2.2s cubic-bezier(.2,.6,.3,1) infinite}
@media (prefers-reduced-motion:reduce){.geo-map-comet,.geo-map-pulse{animation:none;display:none}}`}
      </style>
    </div>
  );
}

export { GeoMap };
