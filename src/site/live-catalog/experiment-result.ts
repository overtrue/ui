export default {
  name: "experiment-result",
  title: "Experiment result",
  category: "Charts",
  description:
    "Read out an A/B or multivariate test in plain language, with per-variant rates, a forest plot of uplift against the minimum detectable effect, and narrowing intervals over time.",
  dependencies: [],
  imports:
    "ExperimentResult, analyzeExperiment, type ExperimentVariant",
  usage: `function Example() {
  const variants: ExperimentVariant[] = [
    { id: "control", name: "Control", users: 44812, conversions: 2778, isControl: true },
    { id: "one-page", name: "One-page checkout", users: 44690, conversions: 3005 },
  ];
  // The same numbers are available without the UI, for alerts or reports.
  const { decision } = analyzeExperiment(variants, { metricLabel: "Checkout conversion" });
  console.log(decision.title, decision.summary);

  return (
    <ExperimentResult
      name="One-page checkout"
      metricLabel="Checkout conversion"
      variants={variants}
      mde={0.03}
      targetSampleSize={88000}
      startedAt="2026-09-30"
    />
  );
}`,
  notes:
    "Give each variant its users and conversions; the first one, or the one marked isControl, is the baseline. Rates get normal-approximation intervals, uplift is relative to control with a delta-method interval, significance needs both the pooled two-proportion z-test and the drawn interval to agree, and chance to beat control comes from normal approximations of Beta posteriors. Any arm with fewer than five conversions or non-conversions returns null from every helper and shows Not enough data instead of a number. The decision reads like a sentence (wins once the target sample is reached or the test is stopped, is winning before that), names losing and inconclusive variants, and gives an ETA from dailyUsers or the pace since startedAt. With mde set, the forest plot shades the band of effects too small to matter, a result whose whole interval sits inside it reads as No meaningful difference, and targetSampleSize defaults to the users needed at 80% power. A chi-square sample ratio check against an even split, or expectedSplit, raises a warning below p = 0.001. Pass correction=\"bonferroni\" to split the error rate across several treatments. Hovering a table row highlights its whisker and the reverse; the forest plot takes Up and Down, and the history chart Left and Right. The helpers (conversionRate, relativeUplift, upliftInterval, twoProportionPValue, chanceToBeat, sampleRatioMismatch, requiredSampleSize, analyzeExperiment) are exported. The days-running count reads the clock after mount, or pass now for a fixed date.",
  previewWidth: 720,
  examples: [
    {
      name: "experiment-result-demo",
      title: "One-page checkout",
      description:
        "A two-arm test past its target sample with a clear win, and the cumulative uplift settling as its interval narrows.",
    },
    {
      name: "experiment-result-multi-demo",
      title: "Pricing page with three challengers",
      description:
        "One variant winning, one losing, and one still inconclusive, with an ETA to the target sample. Hover a row to find its interval.",
    },
  ],
  api: [
    ["name", "string", "Experiment name in the header."],
    [
      "variants",
      "{ id; name; users; conversions; isControl?; color? }[]",
      "Arms of the test. The first variant is the control unless one sets isControl.",
    ],
    [
      "metricLabel?",
      "string",
      'The conversion being measured, such as "Checkout conversion". Defaults to "Conversion".',
    ],
    ["hypothesis?", "React.ReactNode", "One or two lines under the name."],
    [
      "confidence?",
      "number",
      "Two-sided confidence for intervals and significance. Defaults to 0.95.",
    ],
    [
      "mde?",
      "number",
      "Minimum detectable effect, relative (0.03 is ±3%). Shades the forest plot and derives the target sample.",
    ],
    [
      "targetSampleSize?",
      "number",
      "Users needed across all variants. Defaults to the size for mde at 80% power.",
    ],
    [
      "dailyUsers?",
      "number",
      "Users entering per day, for the ETA. Inferred from startedAt when omitted.",
    ],
    [
      "status?",
      '"running" | "stopped"',
      "A stopped test reads as final whatever its sample. Defaults to running.",
    ],
    [
      "startedAt? / endedAt? / now?",
      "string | number | Date",
      "Dates for the duration and pace. now defaults to the client clock after mount.",
    ],
    [
      "expectedSplit?",
      "number[]",
      "Expected traffic shares in variant order for the sample ratio check. Defaults to even.",
    ],
    [
      "correction?",
      '"none" | "bonferroni"',
      "Divide the error rate across treatments. Defaults to none.",
    ],
    [
      "history?",
      "{ date: string; values: Record<string, { uplift; lower; upper }> }[]",
      "Cumulative uplift per treatment id, as fractions, drawn with its interval band.",
    ],
    ["actions?", "React.ReactNode", "Controls at the top right."],
    [
      "valueFormatter?",
      '(value: number, context: "rate" | "uplift" | "count" | "probability") => string',
      "Formats every figure. Uplifts are fractions and get a sign by default.",
    ],
    [
      "renderDecision?",
      "(decision: ExperimentDecision, analysis: ExperimentAnalysis) => React.ReactNode",
      "Replaces the banner content. decision has kind, tone, title, summary, detail, and the leading variant.",
    ],
    [
      "activeVariant? / defaultActiveVariant?",
      "string | null",
      "Highlighted variant id, shared by the table, forest plot, and history.",
    ],
    [
      "onActiveVariantChange?",
      "(id: string | null) => void",
      "Called when hover or the keyboard highlights a variant.",
    ],
    [
      "analyzeExperiment",
      "(variants, options?) => ExperimentAnalysis",
      "Every number and the decision without the UI. Takes the same options as the component.",
    ],
  ],
} as const;
