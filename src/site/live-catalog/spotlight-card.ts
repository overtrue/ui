export default {
  name: "spotlight-card",
  title: "Spotlight card",
  category: "Layout",
  description:
    "A card surface whose border and background catch a soft light that follows the pointer, shared across a bento grid.",
  dependencies: [],
  imports: "SpotlightCard, SpotlightGroup",
  usage: `<SpotlightGroup restingLight={{ x: 0.75, y: 0 }} className="grid gap-3 sm:grid-cols-2">
  <SpotlightCard>
    <p className="text-sm text-muted-foreground">Monthly recurring revenue</p>
    <p className="mt-2 text-2xl font-semibold tabular-nums">$48,290</p>
  </SpotlightCard>
  <SpotlightCard color="var(--color-chart-2)">
    <p className="text-sm text-muted-foreground">API uptime</p>
    <p className="mt-2 text-2xl font-semibold tabular-nums">99.98%</p>
  </SpotlightCard>
</SpotlightGroup>`,
  notes:
    "Use one SpotlightCard for a feature panel, or wrap a grid of them in SpotlightGroup so a single pointer listener lights every border near the pointer as it crosses the gaps. The position is written to CSS variables inside requestAnimationFrame, so moving the pointer never re-renders React. Set `restingLight` to park a softer light somewhere while nobody is pointing, which keeps screenshots and touch screens looking lit; the light glides back to it when the pointer leaves. Touch input and prefers-reduced-motion never move the light. Style the group with your own grid classes, use `padding={false}` for full-bleed charts or media, and clip media inside the card rather than adding overflow-hidden to it, which would also clip the border glow.",
  previewWidth: 640,
  previewHeight: 360,
  examples: [
    {
      name: "spotlight-card-demo",
      title: "Operations bento",
      description:
        "Two metric cards and a wide capacity card in one group, with a resting light on the uptime card. Move the pointer across the gaps to see neighboring borders pick up the light.",
    },
  ],
  api: [
    [
      "color?",
      "string",
      "Any CSS color for the glow. Defaults to var(--color-primary).",
    ],
    ["intensity?", "number", "Glow strength from 0 to 2. Defaults to 1."],
    [
      "size?",
      "number",
      "Radius of the surface glow in px; the border glow reaches 55% of it. Defaults to 340.",
    ],
    [
      "padding?",
      "boolean",
      "Apply the standard p-6 padding. Turn off for full-bleed content. Defaults to true.",
    ],
    [
      "sheen?",
      "boolean",
      "Keep a faint highlight along the top edge. Defaults to true.",
    ],
    [
      "restingLight?",
      "{ x: number; y: number }",
      "Where a softer light rests while the pointer is away, as 0–1 fractions of the card. Ignored inside a group.",
    ],
    ["...props", 'React.ComponentProps<"div">', "Forwarded to the card element, including ref."],
    [
      "SpotlightGroup",
      'React.ComponentProps<"div"> & { restingLight?: { x: number; y: number } }',
      "Shares one pointer listener between the cards inside it. Style it as your grid; restingLight is relative to the group.",
    ],
  ],
} as const;
