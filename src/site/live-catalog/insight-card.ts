export default {
  name: "insight-card",
  title: "Insight card",
  category: "AI",
  description:
    "Stream an AI summary token by token, with inline metric chips, numbered citations, and regenerate, copy and feedback actions.",
  dependencies: [],
  imports: "InsightCard",
  usage:
    '<InsightCard\n  title="Weekly summary"\n  source="Oct 6–12"\n  text="Revenue grew {{metric:Revenue|+12.8%}} on annual upgrades {{cite:1}}, and churn fell {{metric:Churn|-0.4 pts|positive}}."\n  sources={[{ id: "billing", label: "Billing · revenue by plan" }]}\n  onRegenerate={() => console.log("regenerate")}\n  onFeedback={(value) => console.log("feedback", value)}\n/>',
  notes:
    "Pass a growing `text` with `streaming`, or hand an `AsyncIterable<string>` to `stream` and the card reads it itself, moving through thinking, streaming, done and error; pass a new iterable to regenerate. New text is revealed at `speed` characters per second (catching up if the source runs ahead), while text present on mount appears at once. Inline tokens use `{{kind:arg|arg|arg}}`: `{{metric:Revenue|+12.8%}}` becomes a delta chip toned by its sign, a third argument (`positive`, `negative`, `neutral`) overrides it for metrics where down is good, and `{{cite:1}}` links to the first entry in `sources`. Unknown kinds render their label; return JSX from `renderToken` to draw any token yourself, or replace the grammar with `parse`. Screen readers hear the finished text once through a polite live region, never each token. The moving border, shimmer and caret stop under prefers-reduced-motion and text appears without the typing reveal. Style parts through `data-slot` (`insight-token`, `insight-sources`, `insight-caret`) and recolor with `colors` or the `--insight-accent`, `--insight-positive` and `--insight-negative` variables.",
  previewWidth: 720,
  examples: [
    {
      name: "insight-card-demo",
      title: "Weekly business summary",
      description:
        "A model-style stream writes the week's summary with revenue, churn and NPS chips and three cited sources. Regenerate thinks briefly and writes a new draft.",
    },
    {
      name: "insight-card-states-demo",
      title: "Thinking, error and done",
      description:
        "Three cards side by side: an anomaly scan still thinking, a read-out that failed with a retry, and a finished recap with feedback recorded.",
    },
  ],
  api: [
    ["text?", "string", "The insight with optional {{kind:arg|arg}} tokens. Append to it while streaming."],
    ["streaming?", "boolean", 'Shorthand for status="streaming" while you append to text.'],
    ["stream?", "AsyncIterable<string>", "Read internally, driving thinking, streaming, done and error. Pass a new iterable to regenerate."],
    ["status?", '"idle" | "thinking" | "streaming" | "done" | "error"', "Override the status derived from text, streaming and stream."],
    ["title?", "React.ReactNode", 'Heading next to the sparkle. Defaults to "Insight".'],
    ["source?", "React.ReactNode", "Model, dataset or time range at the top right."],
    ["icon?", "React.ReactNode", "Replaces the sparkle."],
    ["error?", "React.ReactNode", "Detail shown under the error message."],
    ["sources?", "{ id: string; label: string; href?: string }[]", "Numbered citation chips shown when the text is done. {{cite:n}} refers to them by number or id."],
    ["onRegenerate?", "() => void", "Shows Regenerate, Generate when idle, and Try again on error."],
    ["onStop?", "() => void", "Shows Stop while thinking or streaming."],
    ["onCopy?", "(text: string) => void", "Receives the plain text. Without it, Copy writes to the clipboard."],
    ["feedback?", '"up" | "down" | null', "Control the thumbs. Pair with onFeedback."],
    ["defaultFeedback?", '"up" | "down" | null', "Initial feedback when uncontrolled."],
    ["onFeedback?", '(feedback: "up" | "down" | null) => void', "Called when a thumb is toggled; null clears it."],
    ["renderToken?", "(token: InsightToken, index: number) => React.ReactNode | undefined", "Render any token yourself; return undefined to keep the built-in chip."],
    ["parse?", "(text: string) => InsightSegment[]", "Replace the token grammar. Defaults to parseInsight."],
    ["speed?", "number", "Characters per second for revealing new text. 0 shows it at once. Defaults to 90."],
    ["onStreamEnd?", "() => void", "Called once streamed text has finished revealing."],
    ["actions?", "React.ReactNode", "Extra buttons after Copy."],
    ["colors?", "{ accent?, glow?, positive?, negative? }", "Any CSS colors for the caret and moving border, and for rising and falling chips."],
    ["labels?", "Partial<InsightCardLabels>", "Replace any visible or accessible text for translation."],
    ["...props", 'React.ComponentProps<"div">', "Forwarded to the root element, including ref."],
    ["parseInsight", "(text: string) => InsightSegment[]", "The default parser, for reuse in your own renderers."],
    ["insightToPlainText", "(text: string) => string", "Strips tokens to readable text, as used by Copy and the live region."],
  ],
} as const;
