export default {
  name: "model-usage",
  title: "Model usage",
  category: "Blocks",
  description:
    "An AI gateway dashboard: requests, tokens and spend, tokens by model over time, latency, a written summary, and a model table that focuses the chart.",
  dependencies: [],
  imports: "ModelUsage, sampleModelUsage",
  usage: "<ModelUsage data={sampleModelUsage} />",
  notes:
    "Pass one `ModelUsageData` object. `metrics` are the headline figures (formats: number, compact, currency or milliseconds) with an optional fractional `change`, `invert` for lower-is-better measures such as spend and latency, and a `history` for the sparkline. `usage` has one row per day with a `date` and a token count per model id; `models` lists each model's totals for the table, and selecting a model there shows it alone on the chart. `annotations` mark changes such as a routing rule. `latency` feeds the histogram and `summary` the insight card, whose `{{metric:…}}` and `{{cite:n}}` tokens render as chips and citations; connect `onRegenerateSummary` to your own model. `sampleModelUsage` is fictional, generated deterministically, and reconciles across panels.",
  previewWidth: 1180,
  previewHeight: 1180,
  examples: [
    {
      name: "model-usage-demo",
      title: "Acme Studio AI gateway",
      description:
        "Thirty days across five models. Summaries moved to the small model on Sep 30, and spend fell while traffic grew. Select a model in the table to isolate it on the chart.",
    },
  ],
  api: [
    [
      "data",
      "ModelUsageData",
      "Title, period, currency, headline metrics, daily usage rows, per-model totals, annotations, latency samples and an optional summary.",
    ],
    ["actions", "ReactNode", "Controls for the header, such as a date range picker."],
    ["onRegenerateSummary", "() => void", "Adds a Regenerate action to the summary."],
    ["summaryStreaming", "boolean", "Shows the summary as it streams in."],
    ["locale", "string", "Locale for numbers, currency and dates. Defaults to en-US."],
  ],
} as const;
