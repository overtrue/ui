"use client";

import * as React from "react";
import {
  IconAlertTriangleFilled,
  IconArrowDownRight,
  IconArrowUpRight,
  IconCircleCheckFilled,
  IconEqual,
  IconHourglassHigh,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------------ */
/* Types                                                                     */
/* ------------------------------------------------------------------------ */

/** Users exposed and users who converted, for one arm of a test. */
export interface ExperimentArm {
  users: number;
  conversions: number;
}

export interface ExperimentVariant extends ExperimentArm {
  id: string;
  name: string;
  /** Marks the baseline. Defaults to the first variant. */
  isControl?: boolean;
  /** Any CSS color for the variant's dot and history line. */
  color?: string;
}

/** Cumulative relative uplift on one day, keyed by variant id. Values are fractions: 0.084 is +8.4%. */
export interface ExperimentHistoryPoint {
  date: string;
  values: Record<string, { uplift: number; lower: number; upper: number }>;
}

export type ExperimentSignificance = "positive" | "negative" | "inconclusive";
export type ExperimentValueContext = "rate" | "uplift" | "count" | "probability";

export interface ExperimentVariantResult extends ExperimentVariant {
  isControl: boolean;
  color: string;
  /** Conversion rate, or null without users. */
  rate: number | null;
  /** Confidence interval of the rate itself. */
  rateLower: number | null;
  rateUpper: number | null;
  /** Relative uplift against control and its interval, or null when either arm lacks data. */
  uplift: number | null;
  lower: number | null;
  upper: number | null;
  pValue: number | null;
  chanceToBeat: number | null;
  /** Null for the control. */
  significance: ExperimentSignificance | null;
  enoughData: boolean;
}

export interface ExperimentSrm {
  chiSquare: number;
  pValue: number;
  /** Observed and expected shares of users, in variant order. */
  observed: number[];
  expected: number[];
  /** True when p < 0.001. */
  mismatch: boolean;
}

export interface ExperimentDecision {
  kind: "winner" | "loser" | "flat" | "inconclusive" | "insufficient";
  tone: "positive" | "negative" | "neutral";
  /** Lead phrase, e.g. "Treatment wins". */
  title: string;
  /** The rest of the sentence, e.g. "+8.4% checkout conversion (95% CI +3.1% to +13.9%)". */
  summary: string;
  /** Supporting sentences about other variants and timing. */
  detail?: string;
  variant?: ExperimentVariantResult;
}

export interface ExperimentAnalysis {
  control: ExperimentVariantResult;
  /** Every variant in input order, control included. */
  variants: ExperimentVariantResult[];
  treatments: ExperimentVariantResult[];
  /** Confidence used for intervals and significance, after any correction. */
  confidence: number;
  totalUsers: number;
  /** Target across all variants, given or derived from `mde`. */
  targetSampleSize: number | null;
  /** Share of the target reached, 0–1+. */
  progress: number | null;
  remainingUsers: number | null;
  daysRunning: number | null;
  daysRemaining: number | null;
  /** True once stopped or past the target sample. */
  complete: boolean;
  srm: ExperimentSrm | null;
  decision: ExperimentDecision;
}

export interface ExperimentAnalysisOptions {
  metricLabel?: string;
  /** Two-sided confidence level. Defaults to 0.95. */
  confidence?: number;
  /** Minimum detectable effect, relative: 0.02 is ±2%. */
  mde?: number;
  /** Users needed across all variants. Derived from `mde` and the control rate at 80% power when omitted. */
  targetSampleSize?: number;
  /** Users entering the test per day, for the ETA. Inferred from `startedAt` when omitted. */
  dailyUsers?: number;
  status?: "running" | "stopped";
  startedAt?: string | number | Date;
  endedAt?: string | number | Date;
  now?: string | number | Date;
  /** Expected traffic split in variant order, e.g. [0.5, 0.5]. Defaults to even. */
  expectedSplit?: number[];
  /** Bonferroni divides the error rate across treatments. Defaults to none. */
  correction?: "none" | "bonferroni";
  format?: (value: number, context: ExperimentValueContext) => string;
}

export interface ExperimentResultProps
  extends Omit<React.ComponentProps<"div">, "title" | "children">,
    Omit<ExperimentAnalysisOptions, "format"> {
  /** Experiment name. */
  name: string;
  variants: ExperimentVariant[];
  hypothesis?: React.ReactNode;
  /** Cumulative uplift over time per treatment, drawn as narrowing intervals. */
  history?: ExperimentHistoryPoint[];
  /** Controls placed at the top right. */
  actions?: React.ReactNode;
  /** Formats rates, uplifts, counts and probabilities. */
  valueFormatter?: (value: number, context: ExperimentValueContext) => string;
  /** Replaces the decision banner's content. */
  renderDecision?: (
    decision: ExperimentDecision,
    analysis: ExperimentAnalysis,
  ) => React.ReactNode;
  /** Highlighted variant id. Pass with `onActiveVariantChange` to control it. */
  activeVariant?: string | null;
  defaultActiveVariant?: string | null;
  onActiveVariantChange?: (id: string | null) => void;
}

/* ------------------------------------------------------------------------ */
/* Statistics                                                                */
/* ------------------------------------------------------------------------ */

/** Below this many conversions (or non-conversions) the normal approximation is not trustworthy. */
export const MIN_CONVERSIONS = 5;

/** Complementary error function (Numerical Recipes erfcc), relative error under 1.2e-7. */
function erfc(x: number) {
  const z = Math.abs(x);
  const t = 1 / (1 + 0.5 * z);
  const r =
    t *
    Math.exp(
      -z * z -
        1.26551223 +
        t *
          (1.00002368 +
            t *
              (0.37409196 +
                t *
                  (0.09678418 +
                    t *
                      (-0.18628806 +
                        t *
                          (0.27886807 +
                            t *
                              (-1.13520398 +
                                t *
                                  (1.48851587 +
                                    t * (-0.82215223 + t * 0.17087277)))))))),
    );
  return x >= 0 ? r : 2 - r;
}

/** Standard normal CDF. */
export function normalCdf(z: number) {
  return 0.5 * erfc(-z / Math.SQRT2);
}

/** Inverse standard normal CDF (Acklam), relative error under 1.2e-9. */
export function normalQuantile(p: number): number {
  if (!(p > 0 && p < 1)) return p <= 0 ? -Infinity : Infinity;
  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2,
    1.38357751867269e2, -3.066479806614716e1, 2.506628277459239,
  ];
  const b = [
    -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2,
    6.680131188771972e1, -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838,
    -2.549732539343734, 4.374664141464968, 2.938163982698783,
  ];
  const d = [
    7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996,
    3.754408661907416,
  ];
  const low = 0.02425;
  if (p < low) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }
  if (p > 1 - low) return -normalQuantile(1 - p);
  const q = p - 0.5;
  const r = q * q;
  return (
    ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) *
      q) /
    (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
  );
}

function logGamma(x: number): number {
  // Lanczos approximation, g = 7.
  const g = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (x < 0.5)
    return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x);
  x -= 1;
  let sum = g[0];
  for (let i = 1; i < 9; i++) sum += g[i] / (x + i);
  const t = x + 7.5;
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(sum);
}

/** Regularized upper incomplete gamma Q(a, x). */
function gammaQ(a: number, x: number) {
  if (!(x > 0)) return 1;
  const lead = -x + a * Math.log(x) - logGamma(a);
  if (x < a + 1) {
    let term = 1 / a;
    let sum = term;
    for (let n = 1; n < 500; n++) {
      term *= x / (a + n);
      sum += term;
      if (Math.abs(term) < Math.abs(sum) * 1e-14) break;
    }
    return Math.max(0, 1 - sum * Math.exp(lead));
  }
  // Lentz's continued fraction.
  const tiny = 1e-300;
  let b = x + 1 - a;
  let c = 1 / tiny;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i < 500; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < tiny) d = tiny;
    c = b + an / c;
    if (Math.abs(c) < tiny) c = tiny;
    d = 1 / d;
    const delta = d * c;
    h *= delta;
    if (Math.abs(delta - 1) < 1e-14) break;
  }
  return Math.min(1, Math.exp(lead) * h);
}

const valid = (arm: ExperimentArm) =>
  Number.isFinite(arm.users) &&
  Number.isFinite(arm.conversions) &&
  arm.users > 0 &&
  arm.conversions >= 0 &&
  arm.conversions <= arm.users;

/** At least `MIN_CONVERSIONS` conversions and as many non-conversions. */
export function hasEnoughData(arm: ExperimentArm, min = MIN_CONVERSIONS) {
  return (
    valid(arm) && arm.conversions >= min && arm.users - arm.conversions >= min
  );
}

/** Conversions over users, or null without users. */
export function conversionRate(arm: ExperimentArm): number | null {
  return valid(arm) ? arm.conversions / arm.users : null;
}

/** Normal-approximation interval for one arm's rate. */
export function rateInterval(arm: ExperimentArm, confidence = 0.95) {
  if (!hasEnoughData(arm)) return null;
  const p = arm.conversions / arm.users;
  const z = normalQuantile(1 - (1 - confidence) / 2);
  const se = Math.sqrt((p * (1 - p)) / arm.users);
  return { rate: p, lower: Math.max(0, p - z * se), upper: Math.min(1, p + z * se) };
}

/** Relative uplift of `variant` over `control`: 0.084 is +8.4%. Null when either arm lacks data. */
export function relativeUplift(control: ExperimentArm, variant: ExperimentArm) {
  if (!hasEnoughData(control) || !hasEnoughData(variant)) return null;
  return (
    variant.conversions / variant.users / (control.conversions / control.users) -
    1
  );
}

/** Interval for the relative uplift, by the delta method on the ratio of rates. */
export function upliftInterval(
  control: ExperimentArm,
  variant: ExperimentArm,
  confidence = 0.95,
) {
  if (!hasEnoughData(control) || !hasEnoughData(variant)) return null;
  const pa = control.conversions / control.users;
  const pb = variant.conversions / variant.users;
  const ratio = pb / pa;
  const se =
    ratio *
    Math.sqrt(
      (1 - pb) / (variant.users * pb) + (1 - pa) / (control.users * pa),
    );
  const z = normalQuantile(1 - (1 - confidence) / 2);
  return { uplift: ratio - 1, lower: ratio - 1 - z * se, upper: ratio - 1 + z * se };
}

/** Two-sided p-value of a pooled two-proportion z-test. */
export function twoProportionPValue(
  control: ExperimentArm,
  variant: ExperimentArm,
) {
  if (!hasEnoughData(control) || !hasEnoughData(variant)) return null;
  const pa = control.conversions / control.users;
  const pb = variant.conversions / variant.users;
  const pooled =
    (control.conversions + variant.conversions) / (control.users + variant.users);
  const se = Math.sqrt(
    pooled * (1 - pooled) * (1 / control.users + 1 / variant.users),
  );
  if (!(se > 0)) return null;
  return Math.min(1, erfc(Math.abs(pb - pa) / se / Math.SQRT2));
}

/**
 * Probability that the variant's true rate beats control's, from Beta(1 + conversions,
 * 1 + misses) posteriors approximated as normals.
 */
export function chanceToBeat(control: ExperimentArm, variant: ExperimentArm) {
  if (!hasEnoughData(control) || !hasEnoughData(variant)) return null;
  const posterior = (arm: ExperimentArm) => {
    const a = arm.conversions + 1;
    const b = arm.users - arm.conversions + 1;
    return { mean: a / (a + b), variance: (a * b) / ((a + b) ** 2 * (a + b + 1)) };
  };
  const pa = posterior(control);
  const pb = posterior(variant);
  return normalCdf((pb.mean - pa.mean) / Math.sqrt(pa.variance + pb.variance));
}

/** Chi-square goodness of fit of users against the expected split. A tiny p-value means broken assignment. */
export function sampleRatioMismatch(
  users: number[],
  expectedSplit?: number[],
): ExperimentSrm | null {
  if (users.length < 2 || users.some((u) => !Number.isFinite(u) || u < 0))
    return null;
  const total = users.reduce((sum, u) => sum + u, 0);
  if (!(total > 0)) return null;
  const weights =
    expectedSplit && expectedSplit.length === users.length
      ? expectedSplit.map((w) => Math.max(0, w))
      : users.map(() => 1);
  const weightTotal = weights.reduce((sum, w) => sum + w, 0);
  if (!(weightTotal > 0)) return null;
  const expected = weights.map((w) => w / weightTotal);
  let chiSquare = 0;
  users.forEach((u, i) => {
    const e = expected[i] * total;
    if (e > 0) chiSquare += (u - e) ** 2 / e;
  });
  const pValue = gammaQ((users.length - 1) / 2, chiSquare / 2);
  return {
    chiSquare,
    pValue,
    observed: users.map((u) => u / total),
    expected,
    mismatch: pValue < 0.001,
  };
}

/** Users needed per variant to detect a relative `mde` from `baselineRate`. */
export function requiredSampleSize(
  baselineRate: number,
  mde: number,
  { confidence = 0.95, power = 0.8 }: { confidence?: number; power?: number } = {},
) {
  if (!(baselineRate > 0 && baselineRate < 1) || !(mde > 0)) return null;
  const p1 = baselineRate;
  const p2 = Math.min(0.9999, baselineRate * (1 + mde));
  const mean = (p1 + p2) / 2;
  const za = normalQuantile(1 - (1 - confidence) / 2);
  const zb = normalQuantile(power);
  const n =
    (za * Math.sqrt(2 * mean * (1 - mean)) +
      zb * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2))) **
      2 /
    (p2 - p1) ** 2;
  return Math.ceil(n);
}

/* ------------------------------------------------------------------------ */
/* Formatting                                                                */
/* ------------------------------------------------------------------------ */

const MINUS = "−";
const whole = new Intl.NumberFormat("en-US");

function trimPercent(value: number, digits: number) {
  return (value * 100).toFixed(digits).replace("-", MINUS);
}

function defaultFormat(value: number, context: ExperimentValueContext) {
  if (!Number.isFinite(value)) return "—";
  switch (context) {
    case "count":
      return whole.format(Math.round(value));
    case "rate":
      return `${trimPercent(value, Math.abs(value) < 0.1 ? 2 : 1)}%`;
    case "uplift": {
      const text = trimPercent(Math.abs(value), 1);
      if (text === "0.0") return "0.0%";
      return `${value > 0 ? "+" : MINUS}${text}%`;
    }
    case "probability":
      if (value > 0.999) return ">99.9%";
      if (value < 0.001) return "<0.1%";
      return `${trimPercent(value, 1)}%`;
  }
}

function formatP(p: number) {
  if (p < 0.001) return "p < 0.001";
  return `p = ${p < 0.01 ? p.toFixed(3) : p.toFixed(2)}`;
}

// "Checkout conversion" reads as "checkout conversion" mid-sentence; acronyms keep their case.
const inline = (text: string) =>
  /^[A-Z0-9]{2,}/.test(text) ? text : text.charAt(0).toLowerCase() + text.slice(1);

function listNames(names: string[]) {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

const confidenceLabel = (confidence: number) =>
  `${+(confidence * 100).toFixed(2)}%`;

function toTime(value: string | number | Date | undefined) {
  if (value == null) return null;
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return value;
  const day = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (day) return new Date(+day[1], +day[2] - 1, +day[3]).getTime();
  const t = Date.parse(value);
  return Number.isNaN(t) ? null : t;
}

/* ------------------------------------------------------------------------ */
/* Analysis                                                                  */
/* ------------------------------------------------------------------------ */

const DAY = 86_400_000;
const controlColor = "var(--color-muted-foreground)";
// Green is skipped so a variant's own color never reads as "winning".
const treatmentColors = [1, 4, 3, 5, 2].map((n) => `var(--color-chart-${n})`);

/** Every number the readout shows, plus the plain-language decision. */
export function analyzeExperiment(
  variants: ExperimentVariant[],
  {
    metricLabel = "Conversion",
    confidence: baseConfidence = 0.95,
    mde,
    targetSampleSize,
    dailyUsers,
    status = "running",
    startedAt,
    endedAt,
    now,
    expectedSplit,
    correction = "none",
    format = defaultFormat,
  }: ExperimentAnalysisOptions = {},
): ExperimentAnalysis {
  const controlIndex = Math.max(
    0,
    variants.findIndex((v) => v.isControl),
  );
  const treatmentCount = Math.max(1, variants.length - 1);
  const confidence =
    correction === "bonferroni"
      ? 1 - (1 - baseConfidence) / treatmentCount
      : baseConfidence;
  const control = variants[controlIndex];
  let colorIndex = 0;
  const results: ExperimentVariantResult[] = variants.map((variant, i) => {
    const isControl = i === controlIndex;
    const color =
      variant.color ??
      (isControl ? controlColor : treatmentColors[colorIndex++ % treatmentColors.length]);
    const rate = conversionRate(variant);
    const rateCi = rateInterval(variant, confidence);
    const enoughData = hasEnoughData(variant);
    if (isControl || !control)
      return {
        ...variant,
        isControl,
        color,
        rate,
        rateLower: rateCi?.lower ?? null,
        rateUpper: rateCi?.upper ?? null,
        uplift: null,
        lower: null,
        upper: null,
        pValue: null,
        chanceToBeat: null,
        significance: null,
        enoughData,
      };
    const ci = upliftInterval(control, variant, confidence);
    const pValue = twoProportionPValue(control, variant);
    // Significant only when the test and the drawn interval agree.
    const significance: ExperimentSignificance | null = !ci || pValue == null
      ? null
      : pValue < 1 - confidence && ci.lower > 0
        ? "positive"
        : pValue < 1 - confidence && ci.upper < 0
          ? "negative"
          : "inconclusive";
    return {
      ...variant,
      isControl,
      color,
      rate,
      rateLower: rateCi?.lower ?? null,
      rateUpper: rateCi?.upper ?? null,
      uplift: ci?.uplift ?? null,
      lower: ci?.lower ?? null,
      upper: ci?.upper ?? null,
      pValue,
      chanceToBeat: chanceToBeat(control, variant),
      significance,
      enoughData,
    };
  });
  const controlResult = results[controlIndex];
  const treatments = results.filter((r) => !r.isControl);

  const totalUsers = variants.reduce(
    (sum, v) => sum + (Number.isFinite(v.users) ? Math.max(0, v.users) : 0),
    0,
  );
  const derived =
    targetSampleSize ??
    (mde && controlResult?.rate
      ? (() => {
          const perVariant = requiredSampleSize(controlResult.rate!, mde, {
            confidence,
          });
          return perVariant ? perVariant * variants.length : null;
        })()
      : null);
  const target = derived && derived > 0 ? derived : null;
  const progress = target ? totalUsers / target : null;
  const remainingUsers = target ? Math.max(0, target - totalUsers) : null;

  const start = toTime(startedAt);
  const end = toTime(status === "stopped" ? (endedAt ?? now) : now);
  const daysRunning =
    start != null && end != null ? Math.max(0, Math.floor((end - start) / DAY)) : null;
  const pace =
    dailyUsers ??
    (daysRunning && daysRunning > 0 ? totalUsers / daysRunning : null);
  const complete = status === "stopped" || (progress != null && progress >= 1);
  const daysRemaining =
    !complete && remainingUsers && pace && pace > 0
      ? Math.max(1, Math.ceil(remainingUsers / pace))
      : null;

  const srm = sampleRatioMismatch(
    variants.map((v) => v.users),
    expectedSplit,
  );

  /* ------------------------------------------------------- decision */

  const metric = inline(metricLabel);
  const ciText = (r: ExperimentVariantResult) =>
    `${confidenceLabel(confidence)} CI ${format(r.lower!, "uplift")} to ${format(r.upper!, "uplift")}`;
  const headline = (r: ExperimentVariantResult) =>
    `${format(r.uplift!, "uplift")} ${metric} (${ciText(r)})`;
  const eta =
    daysRemaining != null
      ? `about ${daysRemaining} more ${daysRemaining === 1 ? "day" : "days"} to reach the target sample`
      : !complete && remainingUsers
        ? `${format(remainingUsers, "count")} more users to reach the target sample`
        : null;
  const capital = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

  const ready = treatments.filter((t) => t.significance != null);
  const winners = ready.filter((t) => t.significance === "positive");
  const losers = ready.filter((t) => t.significance === "negative");
  const open = ready.filter((t) => t.significance === "inconclusive");

  const others = (exclude: ExperimentVariantResult) => {
    const parts: string[] = [];
    const lost = losers.filter((t) => t !== exclude);
    const unsure = open.filter((t) => t !== exclude);
    if (lost.length)
      parts.push(
        `${listNames(lost.map((t) => t.name))} ${lost.length > 1 ? "are" : "is"} losing at ${listNames(lost.map((t) => format(t.uplift!, "uplift")))}.`,
      );
    if (unsure.length)
      parts.push(
        `${listNames(unsure.map((t) => t.name))} ${unsure.length > 1 ? "are" : "is"} inconclusive${eta ? `, ${eta}` : ""}.`,
      );
    else if (eta) parts.push(`${capital(eta)} before calling it final.`);
    const thin = treatments.filter((t) => t.significance == null);
    if (thin.length)
      parts.push(`${listNames(thin.map((t) => t.name))} ${thin.length > 1 ? "need" : "needs"} more data.`);
    return parts.join(" ") || undefined;
  };

  let decision: ExperimentDecision;
  if (!controlResult?.enoughData || !ready.length) {
    decision = {
      kind: "insufficient",
      tone: "neutral",
      title: "Not enough data",
      summary: `each variant needs at least ${MIN_CONVERSIONS} conversions and ${MIN_CONVERSIONS} non-conversions`,
      detail: eta ? `${capital(eta)}.` : undefined,
    };
  } else if (winners.length) {
    const best = winners.reduce((a, b) => (b.uplift! > a.uplift! ? b : a));
    decision = {
      kind: "winner",
      tone: "positive",
      title: `${best.name} ${complete ? "wins" : "is winning"}`,
      summary: headline(best),
      detail: others(best),
      variant: best,
    };
  } else if (losers.length) {
    const worst = losers.reduce((a, b) => (b.uplift! < a.uplift! ? b : a));
    decision = {
      kind: "loser",
      tone: "negative",
      title: `${worst.name} ${complete ? "loses" : "is losing"}`,
      summary: headline(worst),
      detail: others(worst),
      variant: worst,
    };
  } else {
    const best = open.reduce((a, b) => (b.uplift! > a.uplift! ? b : a));
    const flat =
      mde != null &&
      open.every((t) => t.lower! >= -mde && t.upper! <= mde);
    const mdeText = format(mde ?? 0, "uplift").replace("+", "±");
    decision = flat
      ? {
          kind: "flat",
          tone: "neutral",
          title: "No meaningful difference",
          summary:
            open.length > 1
              ? `every variant is within the ${mdeText} minimum detectable effect`
              : `${best.name} is within the ${mdeText} minimum detectable effect`,
          detail: `Best estimate: ${best.name} at ${headline(best)}.`,
          variant: best,
        }
      : {
          kind: "inconclusive",
          tone: "neutral",
          title: "Inconclusive",
          summary: eta ?? `no variant moved ${metric} beyond the noise`,
          detail: `Best estimate: ${best.name} at ${headline(best)}.`,
          variant: best,
        };
  }

  return {
    control: controlResult,
    variants: results,
    treatments,
    confidence,
    totalUsers,
    targetSampleSize: target,
    progress,
    remainingUsers,
    daysRunning,
    daysRemaining,
    complete,
    srm,
    decision,
  };
}

/* ------------------------------------------------------------------------ */
/* Hooks and shared bits                                                     */
/* ------------------------------------------------------------------------ */

function useControllable<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
) {
  const [inner, setInner] = React.useState(defaultValue);
  const controlled = value !== undefined;
  const set = React.useCallback(
    (next: T) => {
      if (!controlled) setInner(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [controlled ? value : inner, set] as const;
}

function niceStep(raw: number) {
  if (!(raw > 0)) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const r = raw / magnitude;
  return (
    (r <= 1 ? 1 : r <= 2 ? 2 : r <= 2.5 ? 2.5 : r <= 5 ? 5 : 10) * magnitude
  );
}

const tidy = (value: number) => +value.toPrecision(12);

/** A domain around zero that holds every interval and the MDE band, on round percent ticks. */
function upliftDomain(values: number[], mde?: number) {
  let lo = Math.min(0, ...values, mde ? -mde : 0);
  let hi = Math.max(0, ...values, mde ? mde : 0);
  if (hi - lo < 0.02) {
    lo -= 0.01;
    hi += 0.01;
  }
  const step = niceStep((hi - lo) / 4);
  lo = Math.floor(lo / step - 1e-9) * step;
  hi = Math.ceil(hi / step - 1e-9) * step;
  const ticks: number[] = [];
  for (let v = lo; v <= hi + step * 1e-6; v += step) ticks.push(tidy(v));
  return { lo, hi, ticks, pos: (v: number) => ((v - lo) / (hi - lo || 1)) * 100 };
}

const toneColor: Record<ExperimentSignificance, string> = {
  positive: "var(--experiment-positive)",
  negative: "var(--color-destructive)",
  inconclusive: "var(--color-muted-foreground)",
};

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-primary/30";

function axisPercent(value: number) {
  if (Math.abs(value) < 1e-9) return "0%";
  const text = `${tidy(Math.abs(value) * 100)}%`;
  return value > 0 ? `+${text}` : `${MINUS}${text}`;
}

/* ------------------------------------------------------------------------ */
/* ExperimentResult                                                          */
/* ------------------------------------------------------------------------ */

/**
 * An A/B or multivariate test readout: a plain-language decision, per-variant rates with
 * intervals, a forest plot of uplift against an MDE band, and the cumulative uplift over time.
 */
export function ExperimentResult({
  name,
  variants,
  metricLabel = "Conversion",
  confidence = 0.95,
  mde,
  targetSampleSize,
  dailyUsers,
  status = "running",
  startedAt,
  endedAt,
  now: nowProp,
  expectedSplit,
  correction = "none",
  hypothesis,
  history,
  actions,
  valueFormatter,
  renderDecision,
  activeVariant,
  defaultActiveVariant = null,
  onActiveVariantChange,
  className,
  style,
  ...props
}: ExperimentResultProps) {
  const id = React.useId().replace(/:/g, "");
  const format = valueFormatter ?? defaultFormat;

  // The clock is read after mount, so server and client render the same markup.
  const [clock, setClock] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (nowProp == null) setClock(Date.now());
  }, [nowProp]);
  const now = nowProp ?? clock ?? undefined;

  const analysis = React.useMemo(
    () =>
      analyzeExperiment(variants, {
        metricLabel,
        confidence,
        mde,
        targetSampleSize,
        dailyUsers,
        status,
        startedAt,
        endedAt,
        now,
        expectedSplit,
        correction,
        format,
      }),
    [
      variants,
      metricLabel,
      confidence,
      mde,
      targetSampleSize,
      dailyUsers,
      status,
      startedAt,
      endedAt,
      now,
      expectedSplit,
      correction,
      format,
    ],
  );
  const { decision, srm } = analysis;

  const [active, setActive] = useControllable<string | null>(
    activeVariant,
    defaultActiveVariant,
    onActiveVariantChange,
  );

  const start = toTime(startedAt);
  const startLabel =
    start != null
      ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
          new Date(start),
        )
      : null;

  const conf = confidenceLabel(analysis.confidence);
  const DecisionIcon =
    decision.kind === "winner"
      ? IconCircleCheckFilled
      : decision.kind === "loser"
        ? IconArrowDownRight
        : decision.kind === "flat"
          ? IconEqual
          : IconHourglassHigh;

  return (
    <div
      data-slot="experiment-result"
      data-status={status}
      data-decision={decision.kind}
      className={cn(
        "@container/experiment flex min-w-0 flex-col rounded-2xl border border-border/70 bg-card text-card-foreground",
        "shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]",
        "[--experiment-positive:var(--color-emerald-600)] dark:[--experiment-positive:var(--color-emerald-400)]",
        className,
      )}
      style={style}
      {...props}
    >
      {/* Header */}
      <div className="flex flex-col gap-3 px-5 pt-5">
        <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
          <div className="min-w-[min(100%,14rem)] flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <h3 className="text-sm font-semibold tracking-tight">{name}</h3>
              <StatusPill status={status} days={analysis.daysRunning} />
            </div>
            {hypothesis != null && (
              <p
                id={`${id}-hypothesis`}
                className="line-clamp-2 text-[13px] leading-5 text-muted-foreground"
              >
                {hypothesis}
              </p>
            )}
          </div>
          {actions != null && (
            <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
          )}
        </div>

        <dl className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <div className="hidden items-center gap-1.5 @md/experiment:flex">
            <dt>Metric</dt>
            <dd className="font-medium text-foreground">{metricLabel}</dd>
          </div>
          {startLabel && (
            <div className="hidden items-center gap-1.5 @lg/experiment:flex">
              <dt>Started</dt>
              <dd className="font-medium text-foreground tabular-nums">{startLabel}</dd>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <dt className="shrink-0">Sample</dt>
            <dd className="flex min-w-0 items-center gap-2">
              {analysis.targetSampleSize ? (
                <>
                  <span
                    role="progressbar"
                    aria-label="Sample toward target"
                    aria-valuemin={0}
                    aria-valuemax={analysis.targetSampleSize}
                    aria-valuenow={Math.min(analysis.totalUsers, analysis.targetSampleSize)}
                    className="relative h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-foreground/[0.08] @md/experiment:w-24"
                  >
                    <span
                      className="absolute inset-y-0 left-0 origin-left rounded-full bg-primary shadow-[0_0_8px_color-mix(in_oklab,var(--color-primary)_50%,transparent)] motion-safe:animate-[experiment-fill_900ms_cubic-bezier(0.22,1,0.36,1)_both]"
                      style={{ width: `${Math.min(1, analysis.progress ?? 0) * 100}%` }}
                    />
                  </span>
                  <span className="shrink-0 tabular-nums">
                    <span className="font-medium text-foreground">
                      {format(analysis.totalUsers, "count")}
                    </span>{" "}
                    of {format(analysis.targetSampleSize, "count")}
                    {analysis.progress != null && analysis.progress < 1 && (
                      <span> · {Math.floor(analysis.progress * 100)}%</span>
                    )}
                  </span>
                </>
              ) : (
                <span className="font-medium text-foreground tabular-nums">
                  {format(analysis.totalUsers, "count")} users
                </span>
              )}
            </dd>
          </div>
        </dl>
      </div>

      {/* Sample ratio mismatch */}
      {srm?.mismatch && (
        <div
          role="alert"
          data-slot="experiment-srm"
          className="mx-5 mt-4 flex gap-3 rounded-xl bg-destructive/10 px-3.5 py-3 text-[13px] leading-5 ring-1 ring-destructive/20 ring-inset"
        >
          <IconAlertTriangleFilled
            className="mt-0.5 size-4 shrink-0 text-destructive"
            aria-hidden="true"
          />
          <p>
            <span className="font-semibold text-destructive">Sample ratio mismatch: </span>
            users split{" "}
            <span className="tabular-nums">
              {srm.observed.map((share) => format(share, "rate")).join(" / ")}
            </span>{" "}
            where{" "}
            <span className="tabular-nums">
              {srm.expected.map((share) => format(share, "rate")).join(" / ")}
            </span>{" "}
            was expected ({formatP(srm.pValue)}). Check assignment and logging before trusting
            these results.
          </p>
        </div>
      )}

      {/* Decision */}
      <div
        data-slot="experiment-decision"
        data-tone={decision.tone}
        role="status"
        className={cn(
          "relative mx-5 mt-4 flex items-start gap-3 overflow-hidden rounded-xl px-4 py-3.5 ring-1 ring-inset",
          decision.tone === "positive" &&
            "bg-[linear-gradient(110deg,color-mix(in_oklab,var(--experiment-positive)_14%,transparent),color-mix(in_oklab,var(--experiment-positive)_4%,transparent)_70%)] ring-[color-mix(in_oklab,var(--experiment-positive)_24%,transparent)]",
          decision.tone === "negative" &&
            "bg-[linear-gradient(110deg,color-mix(in_oklab,var(--color-destructive)_13%,transparent),color-mix(in_oklab,var(--color-destructive)_4%,transparent)_70%)] ring-destructive/20",
          decision.tone === "neutral" && "bg-muted/40 ring-border/60",
        )}
      >
        {renderDecision ? (
          renderDecision(decision, analysis)
        ) : (
          <>
            <span
              aria-hidden="true"
              className={cn(
                "grid size-8 shrink-0 place-items-center rounded-full",
                decision.tone === "positive" &&
                  "bg-[color-mix(in_oklab,var(--experiment-positive)_16%,transparent)] text-(--experiment-positive) shadow-[0_0_16px_-2px_color-mix(in_oklab,var(--experiment-positive)_45%,transparent)]",
                decision.tone === "negative" &&
                  "bg-destructive/15 text-destructive shadow-[0_0_16px_-2px_color-mix(in_oklab,var(--color-destructive)_40%,transparent)]",
                decision.tone === "neutral" && "bg-muted text-muted-foreground",
              )}
            >
              <DecisionIcon className="size-[18px]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-6 text-foreground">
                <span
                  className={cn(
                    "font-semibold",
                    decision.tone === "positive" && "text-(--experiment-positive)",
                    decision.tone === "negative" && "text-destructive",
                  )}
                >
                  {decision.title}:
                </span>{" "}
                <span className="font-medium tabular-nums">{decision.summary}</span>
              </p>
              {decision.detail && (
                <p className="mt-0.5 text-[13px] leading-5 text-muted-foreground tabular-nums">
                  {decision.detail}
                </p>
              )}
            </div>
            {decision.variant?.chanceToBeat != null && decision.kind !== "insufficient" && (
              <div className="hidden shrink-0 border-l border-border/60 pl-4 text-right @xl/experiment:block">
                <p
                  className={cn(
                    "text-xl leading-7 font-semibold tracking-[-0.02em] tabular-nums",
                    decision.tone === "positive" && "text-(--experiment-positive)",
                    decision.tone === "negative" && "text-destructive",
                  )}
                >
                  {format(
                    decision.tone === "negative"
                      ? 1 - decision.variant.chanceToBeat
                      : decision.variant.chanceToBeat,
                    "probability",
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {decision.tone === "negative" ? "chance it is worse" : "chance to beat control"}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Variants */}
      <VariantTable
        analysis={analysis}
        format={format}
        active={active}
        setActive={setActive}
        caption={`${name}: ${decision.title}. ${decision.summary}.`}
      />

      {/* Forest plot */}
      {analysis.treatments.length > 0 && (
        <ForestPlot
          analysis={analysis}
          mde={mde}
          format={format}
          active={active}
          setActive={setActive}
          conf={conf}
        />
      )}

      {history && history.length > 1 && (
        <HistoryChart
          history={history}
          analysis={analysis}
          mde={mde}
          format={format}
          active={active}
          conf={conf}
        />
      )}

      <div className="h-5" />

      <style href="overtrue-experiment-result" precedence="default">
        {`@keyframes experiment-fill{from{transform:scaleX(0)}to{transform:scaleX(1)}}@keyframes experiment-grow{from{transform:scaleX(0);opacity:0}to{transform:scaleX(1);opacity:1}}@keyframes experiment-pop{from{transform:translate(-50%,-50%) scale(0)}to{transform:translate(-50%,-50%) scale(1)}}@keyframes experiment-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}@keyframes experiment-fade{from{opacity:0}to{opacity:1}}`}
      </style>
    </div>
  );
}

function StatusPill({
  status,
  days,
}: {
  status: "running" | "stopped";
  days: number | null;
}) {
  return (
    <span
      data-slot="experiment-status"
      className={cn(
        "inline-flex h-5 items-center gap-1.5 rounded-full px-2 text-[11px] font-medium",
        status === "running"
          ? "bg-primary/10 text-primary"
          : "bg-muted text-muted-foreground",
      )}
    >
      <span className="relative flex size-1.5">
        {status === "running" && (
          <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-60 [animation-duration:2.2s] motion-reduce:hidden" />
        )}
        <span className="relative size-1.5 rounded-full bg-current" />
      </span>
      {status === "running" ? "Running" : "Stopped"}
      {days != null && (
        <span className="font-normal opacity-80 tabular-nums">
          {status === "running" ? ` · day ${days}` : ` after ${days} ${days === 1 ? "day" : "days"}`}
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------------ */
/* Variant table                                                             */
/* ------------------------------------------------------------------------ */

function VariantTable({
  analysis,
  format,
  active,
  setActive,
  caption,
}: {
  analysis: ExperimentAnalysis;
  format: (value: number, context: ExperimentValueContext) => string;
  active: string | null;
  setActive: (id: string | null) => void;
  caption: string;
}) {
  // Rate intervals share one scale so overlap is visible at a glance.
  const bounds = analysis.variants.flatMap((v) =>
    v.rateLower != null && v.rateUpper != null ? [v.rateLower, v.rateUpper] : [],
  );
  const lo = bounds.length ? Math.min(...bounds) : 0;
  const hi = bounds.length ? Math.max(...bounds) : 1;
  const pad = (hi - lo) * 0.18 || 0.01;
  const pos = (v: number) => ((v - (lo - pad)) / (hi - lo + 2 * pad)) * 100;
  const head = "px-2 pb-2 text-xs font-medium whitespace-nowrap text-muted-foreground";

  return (
    <div className="mt-4 overflow-x-auto px-3">
      <table className="w-full min-w-0 border-separate border-spacing-0 text-[13px]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th scope="col" className={cn(head, "w-full text-left")}>
              Variant
            </th>
            <th scope="col" className={cn(head, "hidden text-right @lg/experiment:table-cell")}>
              Users
            </th>
            <th scope="col" className={cn(head, "hidden text-right @2xl/experiment:table-cell")}>
              Conversions
            </th>
            <th scope="col" className={cn(head, "hidden text-right @md/experiment:table-cell")}>
              Rate
            </th>
            <th scope="col" className={cn(head, "text-right")}>
              Uplift
            </th>
            <th scope="col" className={cn(head, "text-right")}>
              <span className="hidden @md/experiment:inline">Chance to beat</span>
              <span className="@md/experiment:hidden">To beat</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {analysis.variants.map((v) => {
            const sig = v.significance;
            const isActive = active === v.id;
            const cell = cn(
              "border-t border-border/60 px-2 py-2.5 align-middle transition-colors duration-150",
              isActive && "bg-muted/50",
            );
            return (
              <tr
                key={v.id}
                data-slot="experiment-variant"
                data-significance={sig ?? undefined}
                data-control={v.isControl || undefined}
                data-active={isActive || undefined}
                onPointerEnter={() => setActive(v.id)}
                onPointerLeave={() => setActive(null)}
                className="group/row"
              >
                <th scope="row" className={cn(cell, "max-w-0 text-left font-normal")}>
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="size-2 shrink-0 rounded-full"
                      style={{
                        background: v.color,
                        boxShadow: `0 0 0 3px color-mix(in oklab, ${v.color} 18%, transparent)`,
                      }}
                    />
                    <span className="truncate font-medium text-foreground">{v.name}</span>
                    {v.isControl && (
                      <span className="hidden shrink-0 rounded-full bg-muted px-1.5 text-[11px] leading-[18px] text-muted-foreground @md/experiment:inline">
                        Control
                      </span>
                    )}
                  </span>
                  {/* Narrow cards fold the hidden columns into one line under the name. */}
                  <span className="mt-0.5 block truncate pl-4 text-xs text-muted-foreground tabular-nums @lg/experiment:hidden">
                    <span className="@md/experiment:hidden">
                      {v.rate != null ? format(v.rate, "rate") : "—"}
                      {" · "}
                    </span>
                    {format(v.users, "count")} users
                  </span>
                </th>
                <td className={cn(cell, "hidden text-right tabular-nums @lg/experiment:table-cell")}>
                  {format(v.users, "count")}
                </td>
                <td className={cn(cell, "hidden text-right text-muted-foreground tabular-nums @2xl/experiment:table-cell")}>
                  {format(v.conversions, "count")}
                </td>
                <td className={cn(cell, "hidden text-right @md/experiment:table-cell")}>
                  <span className="inline-flex items-center justify-end gap-2.5">
                    <span className="font-medium tabular-nums">
                      {v.rate != null ? format(v.rate, "rate") : "—"}
                    </span>
                    {v.rateLower != null && v.rateUpper != null && v.rate != null && (
                      <span
                        aria-hidden="true"
                        className="relative hidden h-3 w-16 @md/experiment:block"
                        title={`${format(v.rateLower, "rate")} to ${format(v.rateUpper, "rate")}`}
                      >
                        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
                        <span
                          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full"
                          style={{
                            left: `${pos(v.rateLower)}%`,
                            width: `${pos(v.rateUpper) - pos(v.rateLower)}%`,
                            background: `color-mix(in oklab, ${v.color} 45%, transparent)`,
                          }}
                        />
                        <span
                          className="absolute top-1/2 h-2.5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                          style={{ left: `${pos(v.rate)}%`, background: v.color }}
                        />
                      </span>
                    )}
                  </span>
                </td>
                <td className={cn(cell, "text-right")}>
                  {v.isControl ? (
                    <span className="text-xs text-muted-foreground">Baseline</span>
                  ) : v.uplift == null ? (
                    <span className="text-xs text-muted-foreground">Not enough data</span>
                  ) : (
                    <>
                      <span
                        className={cn(
                          "inline-flex items-center gap-0.5 font-semibold tabular-nums",
                          sig === "positive" && "text-(--experiment-positive)",
                          sig === "negative" && "text-destructive",
                        )}
                      >
                        {sig === "positive" && (
                          <IconArrowUpRight className="size-3.5" aria-hidden="true" />
                        )}
                        {sig === "negative" && (
                          <IconArrowDownRight className="size-3.5" aria-hidden="true" />
                        )}
                        {format(v.uplift, "uplift")}
                      </span>
                      <span className="hidden text-[11px] leading-4 whitespace-nowrap text-muted-foreground tabular-nums @md/experiment:block">
                        {format(v.lower!, "uplift")} to {format(v.upper!, "uplift")}
                      </span>
                    </>
                  )}
                </td>
                <td className={cn(cell, "text-right")}>
                  {v.isControl ? (
                    <span className="text-muted-foreground">—</span>
                  ) : v.chanceToBeat == null ? (
                    <span className="text-muted-foreground">—</span>
                  ) : (
                    <span className="font-medium tabular-nums">
                      {format(v.chanceToBeat, "probability")}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Forest plot                                                               */
/* ------------------------------------------------------------------------ */

function ForestPlot({
  analysis,
  mde,
  format,
  active,
  setActive,
  conf,
}: {
  analysis: ExperimentAnalysis;
  mde?: number;
  format: (value: number, context: ExperimentValueContext) => string;
  active: string | null;
  setActive: (id: string | null) => void;
  conf: string;
}) {
  const rows = analysis.treatments;
  const domain = upliftDomain(
    rows.flatMap((r) => (r.lower != null && r.upper != null ? [r.lower, r.upper] : [])),
    mde,
  );
  const [announcement, setAnnouncement] = React.useState("");
  const describe = (r: ExperimentVariantResult) =>
    r.uplift == null
      ? `${r.name}: not enough data.`
      : `${r.name}: ${format(r.uplift, "uplift")}, ${conf} CI ${format(r.lower!, "uplift")} to ${format(r.upper!, "uplift")}, ${r.significance === "positive" ? "significant gain" : r.significance === "negative" ? "significant loss" : "inconclusive"}.`;

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      if (event.key === "Escape") setActive(null);
      return;
    }
    event.preventDefault();
    const index = rows.findIndex((r) => r.id === active);
    const next =
      event.key === "ArrowDown"
        ? index < 0
          ? 0
          : Math.min(rows.length - 1, index + 1)
        : index < 0
          ? rows.length - 1
          : Math.max(0, index - 1);
    setActive(rows[next].id);
    setAnnouncement(describe(rows[next]));
  };

  return (
    <section
      data-slot="experiment-forest"
      aria-label={`Relative uplift against control, ${conf} intervals`}
      className="mx-5 mt-4 border-t border-border/60 pt-4"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <h4 className="text-xs font-medium text-foreground">
          Uplift vs control
          <span className="font-normal text-muted-foreground"> · {conf} intervals</span>
        </h4>
        {mde != null && mde > 0 && (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              aria-hidden="true"
              className="h-2.5 w-3.5 rounded-[3px] bg-foreground/[0.06] ring-1 ring-foreground/10 ring-inset"
            />
            Minimum detectable effect{" "}
            <span className="tabular-nums">{format(mde, "uplift").replace("+", "±")}</span>
          </span>
        )}
      </div>

      <div
        role="img"
        tabIndex={0}
        aria-label={rows.map(describe).join(" ") + " Use the up and down arrow keys to step through variants."}
        onKeyDown={onKeyDown}
        onBlur={() => setActive(null)}
        className={cn(
          // Narrow cards put the name and value on one line and the interval full width below.
          "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 rounded-lg @md/experiment:grid-cols-[minmax(0,9rem)_minmax(0,1fr)_auto]",
          focusRing,
        )}
      >
        {rows.map((r, i) => {
          const sig = r.significance ?? "inconclusive";
          const color = toneColor[sig];
          const dim = active != null && active !== r.id;
          const isActive = active === r.id;
          return (
            <div
              key={r.id}
              data-slot="experiment-whisker"
              data-significance={r.significance ?? undefined}
              data-active={isActive || undefined}
              onPointerEnter={() => setActive(r.id)}
              onPointerLeave={() => setActive(null)}
              className="col-span-2 grid grid-cols-subgrid items-center transition-opacity duration-150 @md/experiment:col-span-3"
              style={{ opacity: dim ? 0.4 : 1 }}
            >
              <span className="col-start-1 row-start-1 flex min-w-0 items-center gap-2 pt-2 text-[13px] @md/experiment:py-2.5">
                <span
                  aria-hidden="true"
                  className="size-2 shrink-0 rounded-full"
                  style={{ background: r.color }}
                />
                <span className="truncate font-medium">{r.name}</span>
              </span>
              <span className="relative col-span-2 row-start-2 h-8 @md/experiment:col-span-1 @md/experiment:col-start-2 @md/experiment:row-start-1 @md/experiment:h-auto @md/experiment:min-h-10 @md/experiment:self-stretch">
                {/* Grid, MDE band and zero line repeat per row so rows line up exactly. */}
                {mde != null && mde > 0 && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -inset-y-px bg-foreground/[0.045]",
                      i === 0 && "rounded-t-[3px]",
                      i === rows.length - 1 && "rounded-b-[3px]",
                    )}
                    style={{
                      left: `${domain.pos(-mde)}%`,
                      width: `${domain.pos(mde) - domain.pos(-mde)}%`,
                    }}
                  />
                )}
                {domain.ticks.map((tick) => (
                  <span
                    key={tick}
                    aria-hidden="true"
                    className={cn(
                      "absolute -inset-y-px w-px",
                      tick === 0 ? "bg-foreground/30" : "bg-foreground/[0.07]",
                    )}
                    style={{ left: `${domain.pos(tick)}%` }}
                  />
                ))}
                {r.uplift != null && r.lower != null && r.upper != null ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-y-0 transition-[filter] duration-150",
                      sig === "positive" &&
                        "[filter:drop-shadow(0_0_5px_color-mix(in_oklab,var(--experiment-positive)_45%,transparent))] dark:[filter:drop-shadow(0_0_8px_color-mix(in_oklab,var(--experiment-positive)_60%,transparent))]",
                    )}
                    style={{
                      left: `${domain.pos(r.lower)}%`,
                      width: `${domain.pos(r.upper) - domain.pos(r.lower)}%`,
                    }}
                  >
                    <span
                      className="absolute inset-0 origin-[var(--origin)] motion-safe:animate-[experiment-grow_720ms_cubic-bezier(0.22,1,0.36,1)_both]"
                      style={
                        {
                          "--origin": `${((r.uplift - r.lower) / (r.upper - r.lower || 1)) * 100}% 50%`,
                          animationDelay: `${120 + i * 40}ms`,
                        } as React.CSSProperties
                      }
                    >
                      <span
                        className={cn(
                          "absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-full transition-[height] duration-150",
                          isActive ? "h-2.5" : "h-2",
                        )}
                        style={{
                          background: `color-mix(in oklab, ${color} ${sig === "inconclusive" ? 16 : 22}%, transparent)`,
                          boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${color} ${sig === "inconclusive" ? 35 : 50}%, transparent)`,
                        }}
                      />
                      <span
                        className="absolute top-1/2 left-0 h-3.5 w-0.5 -translate-y-1/2 rounded-full"
                        style={{ background: color }}
                      />
                      <span
                        className="absolute top-1/2 right-0 h-3.5 w-0.5 -translate-y-1/2 rounded-full"
                        style={{ background: color }}
                      />
                    </span>
                    <span
                      className="absolute top-1/2 size-3 rounded-full motion-safe:animate-[experiment-pop_420ms_cubic-bezier(0.22,1,0.36,1)_both]"
                      style={{
                        left: `${((r.uplift - r.lower) / (r.upper - r.lower || 1)) * 100}%`,
                        transform: "translate(-50%, -50%)",
                        background: color,
                        boxShadow: `0 0 0 2px var(--color-card), 0 0 0 ${isActive ? 6 : 5}px color-mix(in oklab, ${color} 22%, transparent)`,
                        animationDelay: `${60 + i * 40}ms`,
                      }}
                    />
                  </span>
                ) : (
                  <span className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">
                    Not enough data
                  </span>
                )}
              </span>
              <span
                className={cn(
                  "col-start-2 row-start-1 min-w-14 pt-2 text-right text-[13px] font-semibold tabular-nums @md/experiment:col-start-3 @md/experiment:pt-0",
                  sig === "positive" && "text-(--experiment-positive)",
                  sig === "negative" && "text-destructive",
                  sig === "inconclusive" && "text-muted-foreground",
                )}
              >
                {r.uplift != null ? format(r.uplift, "uplift") : "—"}
              </span>
            </div>
          );
        })}

        {/* Axis */}
        <span aria-hidden="true" className="hidden @md/experiment:block" />
        <span aria-hidden="true" className="relative col-span-2 mt-1.5 h-4 text-[11px] leading-4 text-muted-foreground tabular-nums @md/experiment:col-span-1">
          {domain.ticks.map((tick, i) => (
            <span
              key={tick}
              className={cn(
                "absolute top-0 whitespace-nowrap",
                i === 0 ? "" : i === domain.ticks.length - 1 ? "-translate-x-full" : "-translate-x-1/2",
                tick === 0 && "font-medium text-foreground",
              )}
              style={{ left: `${domain.pos(tick)}%` }}
            >
              {axisPercent(tick)}
            </span>
          ))}
        </span>
        <span aria-hidden="true" className="hidden @md/experiment:block" />
      </div>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* Cumulative uplift                                                         */
/* ------------------------------------------------------------------------ */

function HistoryChart({
  history,
  analysis,
  mde,
  format,
  active,
  conf,
}: {
  history: ExperimentHistoryPoint[];
  analysis: ExperimentAnalysis;
  mde?: number;
  format: (value: number, context: ExperimentValueContext) => string;
  active: string | null;
  conf: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWidth(Math.round(el.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const W = width || 560;
  const H = 132;
  const padTop = 8;
  const padBottom = 8;

  const series = analysis.treatments.filter((t) =>
    history.some((point) => point.values[t.id]),
  );
  const all = history.flatMap((point) =>
    series.flatMap((t) => {
      const v = point.values[t.id];
      return v ? [v.lower, v.upper] : [];
    }),
  );
  const domain = upliftDomain(all, mde);
  const n = history.length;
  const X = (i: number) => (n > 1 ? (i / (n - 1)) * W : W / 2);
  const Y = (v: number) =>
    padTop + ((domain.hi - v) / (domain.hi - domain.lo || 1)) * (H - padTop - padBottom);
  const yTicks = domain.ticks.length > 5 ? domain.ticks.filter((_, i) => i % 2 === 0) : domain.ticks;

  const paths = series.map((t) => {
    const points = history
      .map((point, i) => ({ i, v: point.values[t.id] }))
      .filter((p): p is { i: number; v: { uplift: number; lower: number; upper: number } } => !!p.v);
    const line = points
      .map((p, k) => `${k ? "L" : "M"}${X(p.i).toFixed(2)} ${Y(p.v.uplift).toFixed(2)}`)
      .join("");
    const band =
      points.map((p, k) => `${k ? "L" : "M"}${X(p.i).toFixed(2)} ${Y(p.v.upper).toFixed(2)}`).join("") +
      [...points]
        .reverse()
        .map((p) => `L${X(p.i).toFixed(2)} ${Y(p.v.lower).toFixed(2)}`)
        .join("") +
      "Z";
    return { t, line, band, last: points[points.length - 1] };
  });

  const [hover, setHover] = React.useState<number | null>(null);
  const [focused, setFocused] = React.useState(false);
  const indexAt = (clientX: number) => {
    const rect = ref.current!.getBoundingClientRect();
    return Math.max(0, Math.min(n - 1, Math.round(((clientX - rect.left) / (rect.width || 1)) * (n - 1))));
  };
  const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
  const dateOf = (i: number) => {
    const t = toTime(history[i].date);
    return t != null ? dateFormat.format(new Date(t)) : history[i].date;
  };
  const describe = (i: number) =>
    `${dateOf(i)}: ${series
      .map((t) => {
        const v = history[i].values[t.id];
        return v
          ? `${t.name} ${format(v.uplift, "uplift")} (${format(v.lower, "uplift")} to ${format(v.upper, "uplift")})`
          : `${t.name} no data`;
      })
      .join("; ")}.`;
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let next: number | null = null;
    if (event.key === "ArrowRight") next = hover == null ? 0 : Math.min(n - 1, hover + 1);
    else if (event.key === "ArrowLeft") next = hover == null ? n - 1 : Math.max(0, hover - 1);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = n - 1;
    else if (event.key === "Escape") setHover(null);
    if (next == null) return;
    event.preventDefault();
    setHover(next);
  };

  const xLabels = n > 2 ? [0, Math.round((n - 1) / 2), n - 1] : [0, n - 1];

  return (
    <section
      data-slot="experiment-history"
      className="mx-5 mt-4 border-t border-border/60 pt-4"
      aria-label="Cumulative uplift over time"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <h4 className="text-xs font-medium text-foreground">
          Cumulative uplift
          <span className="font-normal text-muted-foreground"> · intervals narrow as data arrives</span>
        </h4>
        {series.length > 1 && (
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {series.map((t) => (
              <span key={t.id} className="flex items-center gap-1.5">
                <span aria-hidden="true" className="h-0.5 w-3 rounded-full" style={{ background: t.color }} />
                {t.name}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex">
        <div
          aria-hidden="true"
          className="relative shrink-0 pr-2 text-[11px] leading-none text-muted-foreground tabular-nums"
          style={{ height: H }}
        >
          <div className="invisible h-0 overflow-hidden">
            {yTicks.map((tick) => (
              <div key={tick}>{axisPercent(tick)}</div>
            ))}
          </div>
          {yTicks.map((tick) => (
            <span
              key={tick}
              className="absolute top-0 right-2 whitespace-nowrap"
              style={{ transform: `translateY(calc(${Y(tick).toFixed(2)}px - 50%))` }}
            >
              {axisPercent(tick)}
            </span>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <div
            ref={ref}
            role="img"
            tabIndex={0}
            aria-label={`Cumulative uplift with ${conf} intervals from ${dateOf(0)} to ${dateOf(n - 1)}. ${describe(n - 1)} Use the arrow keys to read each day.`}
            onPointerMove={(event) => setHover(indexAt(event.clientX))}
            onPointerDown={(event) => setHover(indexAt(event.clientX))}
            onPointerLeave={() => !focused && setHover(null)}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              setHover(null);
            }}
            onKeyDown={onKeyDown}
            className={cn(
              "relative cursor-crosshair touch-pan-y rounded-sm select-none focus-visible:ring-offset-4 focus-visible:ring-offset-card",
              focusRing,
            )}
            style={{ height: H }}
          >
            <svg
              aria-hidden="true"
              width="100%"
              height={H}
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="none"
              className="absolute inset-0 overflow-visible"
            >
              {mde != null && mde > 0 && (
                <rect
                  x={0}
                  width={W}
                  y={Y(mde)}
                  height={Math.max(0, Y(-mde) - Y(mde))}
                  className="fill-foreground/[0.045]"
                />
              )}
              {yTicks.map((tick) => (
                <line
                  key={tick}
                  x1={0}
                  x2={W}
                  y1={Y(tick)}
                  y2={Y(tick)}
                  stroke={tick === 0 ? "color-mix(in oklab, var(--color-foreground) 28%, transparent)" : "color-mix(in oklab, var(--color-foreground) 7%, transparent)"}
                  strokeDasharray={tick === 0 ? "3 3" : undefined}
                  shapeRendering="crispEdges"
                />
              ))}
              {paths.map(({ t, band }) => (
                <path
                  key={`${t.id}-band`}
                  d={band}
                  fill={t.color}
                  className="transition-opacity duration-150 motion-safe:animate-[experiment-fade_700ms_200ms_cubic-bezier(0.22,1,0.36,1)_both]"
                  style={{ opacity: active != null && active !== t.id ? 0.04 : 0.13 }}
                />
              ))}
              {paths.map(({ t, line }, i) => (
                <path
                  key={`${t.id}-line`}
                  d={line}
                  fill="none"
                  stroke={t.color}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                  strokeDasharray="1 1"
                  className={cn(
                    "transition-opacity duration-150 motion-safe:animate-[experiment-draw_800ms_cubic-bezier(0.22,1,0.36,1)_both]",
                    "dark:[filter:drop-shadow(0_0_6px_color-mix(in_oklab,var(--experiment-line)_50%,transparent))]",
                  )}
                  style={
                    {
                      "--experiment-line": t.color,
                      opacity: active != null && active !== t.id ? 0.3 : 1,
                      animationDelay: `${i * 40}ms`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </svg>
            {hover == null &&
              paths.map(({ t, last }) =>
                last ? (
                  <span
                    key={t.id}
                    aria-hidden="true"
                    className="pointer-events-none absolute -mt-1 -ml-1 size-2 rounded-full motion-safe:animate-[experiment-fade_360ms_720ms_both]"
                    style={{
                      left: X(last.i),
                      top: Y(last.v.uplift),
                      background: t.color,
                      boxShadow: `0 0 0 1.5px var(--color-card), 0 0 0 5px color-mix(in oklab, ${t.color} 18%, transparent)`,
                      opacity: active != null && active !== t.id ? 0.3 : 1,
                    }}
                  />
                ) : null,
              )}
            {hover != null && (
              <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute inset-y-0 w-px bg-foreground/25" style={{ left: X(hover) }} />
                {series.map((t) => {
                  const v = history[hover].values[t.id];
                  if (!v) return null;
                  return (
                    <span
                      key={t.id}
                      className="absolute -mt-1 -ml-1 size-2 rounded-full"
                      style={{
                        left: X(hover),
                        top: Y(v.uplift),
                        background: t.color,
                        boxShadow: `0 0 0 1.5px var(--color-card), 0 0 0 5px color-mix(in oklab, ${t.color} 18%, transparent)`,
                      }}
                    />
                  );
                })}
                <div
                  className={cn(
                    "absolute top-0 z-10 min-w-44 rounded-xl border border-border/70 bg-popover/90 px-3 py-2 text-xs text-popover-foreground shadow-xl backdrop-blur-md",
                    X(hover) > W * 0.55 && "-translate-x-full",
                  )}
                  style={{ left: X(hover) + (X(hover) > W * 0.55 ? -12 : 12) }}
                >
                  <div className="grid grid-cols-[auto_auto_auto_auto] items-center gap-x-2 gap-y-1 whitespace-nowrap">
                    <p className="col-span-4 mb-0.5 font-medium">{dateOf(hover)}</p>
                    {series.map((t) => {
                      const v = history[hover].values[t.id];
                      return (
                        <React.Fragment key={t.id}>
                          <span className="h-2.5 w-[3px] rounded-full" style={{ background: t.color }} />
                          <span className="text-muted-foreground">{t.name}</span>
                          <span className="pl-2 text-right font-medium tabular-nums">
                            {v ? format(v.uplift, "uplift") : "—"}
                          </span>
                          <span className="text-[11px] text-muted-foreground tabular-nums">
                            {v ? `${format(v.lower, "uplift")} to ${format(v.upper, "uplift")}` : ""}
                          </span>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div
            aria-hidden="true"
            className="relative mt-2 h-4 text-[11px] leading-4 text-muted-foreground tabular-nums"
          >
            {xLabels.map((i, k) => (
              <span
                key={i}
                className={cn(
                  "absolute top-0 whitespace-nowrap",
                  k === 0 ? "" : k === xLabels.length - 1 ? "-translate-x-full" : "-translate-x-1/2",
                )}
                style={{ left: X(i) }}
              >
                {dateOf(i)}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {focused && hover != null ? describe(hover) : ""}
      </p>
    </section>
  );
}
