export default {
  name: "incident-review",
  title: "Incident review",
  category: "Blocks",
  description:
    "A post-incident review that puts the summary, the release, latency, the slowest trace, and the timeline on one page.",
  dependencies: [],
  imports: "IncidentReview, sampleIncident",
  usage: "<IncidentReview incident={sampleIncident} />",
  notes:
    "Pass one `IncidentReviewData` object: the summary text (with `{{metric:…}}` and `{{cite:n}}` tokens rendered as chips and citations), latency samples from before and during the incident, the slowest trace's spans, the release pipeline, and timeline events. Each panel is an ordinary overtrue/ui component, so you can reorder or replace them in the installed file. `onRegenerate` connects the summary to your own model; set `streaming` while new text arrives. `sampleIncident` is fictional demo data.",
  previewWidth: 1180,
  previewHeight: 980,
  examples: [
    {
      name: "incident-review-demo",
      title: "Checkout regression",
      description:
        "A release slowed checkout until it was rolled back. Select spans in the trace, brush the histogram, and filter the timeline.",
    },
  ],
  api: [
    [
      "incident",
      "IncidentReviewData",
      "ID, title, service, severity, state, duration, summary and sources, latency samples, trace spans, release stages, and timeline events.",
    ],
    ["onRegenerate", "() => void", "Adds a Regenerate action to the summary."],
    ["streaming", "boolean", "Shows the summary as it streams in."],
  ],
} as const;
