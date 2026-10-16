export default {
  name: "revenue-overview",
  title: "Revenue overview",
  category: "Blocks",
  description:
    "A subscription revenue dashboard: rolling headline figures, the MRR bridge, plan mix, cohort retention and targets on one page.",
  dependencies: [],
  imports: "RevenueOverview, sampleRevenue",
  usage: "<RevenueOverview data={sampleRevenue} />",
  notes:
    "Pass one `RevenueOverviewData` object. `metrics` are the headline figures: currency amounts in whole units and rates as fractions, each with an optional fractional `change`, `invert` for lower-is-better measures such as churn, and a `history` for the sparkline; the first metric is lit as the hero. `movement` is the MRR bridge (a start step, signed changes and an end step), `planMix` feeds the treemap, `retention` the cohort grid, and `targets` the bullet chart. Figures roll to new values when the data changes, so you can push live updates into the same object. Every panel is an ordinary overtrue/ui component, so reorder or replace them in the installed file. `sampleRevenue` is fictional demo data whose figures reconcile across panels.",
  previewWidth: 1180,
  previewHeight: 1080,
  examples: [
    {
      name: "revenue-overview-demo",
      title: "Acme Studio, September",
      description:
        "New subscriptions arrive every few seconds and the headline figures roll forward. Zoom into a plan, hover the bridge, and read any cohort cell.",
    },
  ],
  api: [
    [
      "data",
      "RevenueOverviewData",
      "Title, period, currency, headline metrics, MRR movement steps, plan mix tree, retention cohorts and targets.",
    ],
    ["actions", "ReactNode", "Controls for the header, such as a period picker or an export button."],
    ["locale", "string", "Locale for currency and percentage formatting. Defaults to en-US."],
  ],
} as const;
