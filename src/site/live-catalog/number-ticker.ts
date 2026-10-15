export default {
  name: "number-ticker",
  title: "Number ticker",
  category: "Metrics",
  description:
    "An odometer-style number for live metrics: each digit rolls on its own wheel when the value changes.",
  dependencies: [],
  imports: "NumberTicker",
  exampleImports: 'import { useEffect, useState } from "react"',
  usage: `function Example() {
  const [revenue, setRevenue] = useState(48213.07)
  useEffect(() => {
    const timer = setInterval(() => {
      setRevenue(value => Math.round((value + 20 + Math.random() * 180) * 100) / 100)
    }, 1800)
    return () => clearInterval(timer)
  }, [])
  return (
    <NumberTicker
      value={revenue}
      format="currency"
      highlightChanges
      className="text-5xl font-semibold tracking-tight"
    />
  )
}`,
  notes:
    "Values are formatted with Intl.NumberFormat and split into parts: digits roll, while currency symbols, separators, signs and compact suffixes stay static. Integer digits are matched by place value, so 999 → 1,000 keeps the existing wheels and opens a new column. Rising values roll forward and falling values roll back, wrapping through 9 → 0 like a mechanical counter. Pass percent values as fractions (0.124 → 12.4%). Fix the fraction digits with `formatOptions` when a value updates often, so the width stays steady. Screen readers get the formatted value once; the wheels are hidden from assistive technology. With reduced motion the value updates in place. The first render shows the value directly, so it is safe to server-render; set `animateOnMount` to roll up from zero instead.",
  previewWidth: 560,
  examples: [
    {
      name: "number-ticker-demo",
      title: "Live revenue",
      description:
        "Revenue, orders, conversion and average order value tick up as orders arrive. Rises tint green and dips tint red for a moment; updates pause while the tab is hidden.",
    },
    {
      name: "number-ticker-formats-demo",
      title: "Formats and locales",
      description:
        "Number, currency, percent and compact presets, a German euro amount, and a unit suffix. Shuffle to watch columns appear and disappear.",
    },
  ],
  api: [
    [
      "value",
      "number",
      "The number to display. Non-finite values render an em dash.",
    ],
    [
      "format?",
      '"number" | "currency" | "percent" | "compact"',
      'Intl preset. Percent expects a fraction and keeps one decimal; compact keeps three significant digits. Defaults to "number".',
    ],
    [
      "formatOptions?",
      "Intl.NumberFormatOptions",
      "Merged over the preset, e.g. { maximumFractionDigits: 0 }.",
    ],
    ["locale?", "string", 'BCP 47 locale. Defaults to "en-US".'],
    [
      "currency?",
      "string",
      'ISO 4217 code for the currency preset. Defaults to "USD".',
    ],
    [
      "prefix?",
      "React.ReactNode",
      "Rendered before the number, e.g. a sign or icon.",
    ],
    ["suffix?", "React.ReactNode", "Rendered after the number, e.g. a unit."],
    [
      "duration?",
      "number",
      "Roll duration in milliseconds. Columns are staggered slightly from right to left. Defaults to 800.",
    ],
    [
      "highlightChanges?",
      "boolean",
      "Briefly tint the number emerald when it rises and red when it falls.",
    ],
    [
      "animateOnMount?",
      "boolean",
      "Roll up from zero after the first paint instead of rendering the value directly.",
    ],
    ["className?", "string", "Set the type size, weight and tracking here."],
  ],
} as const;
