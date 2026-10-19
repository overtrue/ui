export default {
  name: "range-slider",
  title: "Range slider",
  category: "Forms",
  description:
    "A one- or two-thumb slider for filters and settings, with a distribution histogram that lights up inside the selection, marks, value tooltips and linked inputs.",
  dependencies: [],
  imports: "RangeSlider, countInRange",
  exampleImports: 'import { useState } from "react"',
  usage: `function Example() {
  const prices = [24, 89, 129, 149, 210, 340, 365, 420, 610, 980, 1240, 1890];
  const [range, setRange] = useState<[number, number]>([100, 900]);
  return (
    <div className="grid gap-2">
      <RangeSlider
        label="Price"
        min={0}
        max={2000}
        step={10}
        minDistance={50}
        values={prices}
        bins={20}
        value={range}
        onValueChange={setRange}
        onValueCommit={(next) => console.log("Fetch results for", next)}
        formatValue={(value) => "$" + value.toLocaleString("en-US")}
        showInputs
        inputPrefix="$"
      />
      <p className="text-sm text-muted-foreground">
        {countInRange(prices, range)} products
      </p>
    </div>
  );
}`,
  notes:
    "A number draws one thumb and a `[low, high]` pair draws two; callbacks hand back the same shape. `onValueChange` fires on every movement and `onValueCommit` once the value is final (pointer release, each key press, an input commit, or a mark click), so fetch results there. Clicking the track or histogram jumps the nearest thumb with a short glide, then dragging follows the pointer exactly; grabbing a thumb never jumps it, and when two thumbs are stacked the first drag direction decides which one moves. Thumbs never cross and keep `minDistance` apart. Arrow keys move one step, Page Up and Page Down or Shift with an arrow move `largeStep` (10 steps by default), and Home and End go to the limits. Each thumb is a `slider` with its `aria-valuetext` from `formatValue`, and its bounds follow the other thumb. Pass `histogram` counts, or raw `values` and let it bucket them: bars inside the selection light up in the primary color, and a bar the edge cuts through lights up only in proportion, so its edge meets the thumb exactly. Thumb centers stay inside the component, so the knobs line up with the edges of the content around them; the hover halo and tooltips need about 8px beside the slider and 32px above it, so avoid clipping ancestors or set `tooltip=\"never\"`. Tooltips also stay inside the slider at its ends and merge into one label when two thumbs get close.",
  previewWidth: 640,
  examples: [
    {
      name: "range-slider-demo",
      title: "Price filter",
      description:
        "Two thumbs over a histogram of 400 fictional products. Drag a thumb, click the histogram or type a price; the count follows live and is announced when you let go.",
    },
    {
      name: "range-slider-single-demo",
      title: "Sampling rate",
      description:
        "One thumb with labelled marks and a compact linked input. Each committed change saves, and the estimates under the slider follow while you drag.",
    },
  ],
  api: [
    [
      "value? / defaultValue?",
      "number | [number, number]",
      "Controlled or initial value. A pair draws two thumbs. Defaults to min.",
    ],
    [
      "onValueChange?",
      "(value, details: { thumb: 0 | 1; source }) => void",
      'Called on every change. source is "pointer", "keyboard", "input" or "mark".',
    ],
    [
      "onValueCommit?",
      "(value, details) => void",
      "Called when a change is final: on release, after each key press, and when an input or mark commits.",
    ],
    ["min? / max?", "number", "Limits. Default to 0 and 100."],
    ["step?", "number", "Granularity of values. Defaults to 1."],
    [
      "largeStep?",
      "number",
      "Distance for Page Up, Page Down and Shift with an arrow. Defaults to 10 steps.",
    ],
    [
      "minDistance?",
      "number",
      "Smallest gap between the two thumbs, in value units. Use a multiple of step.",
    ],
    [
      "marks?",
      "(number | { value; label? })[]",
      "Ticks on the track with labels under it. Labels default to formatValue; null draws a bare tick. Clicking a label moves the nearest thumb there.",
    ],
    [
      "snapToMarks?",
      "boolean",
      "Only allow mark values. Arrow keys jump from mark to mark.",
    ],
    [
      "histogram?",
      "number[]",
      "Counts for equal-width buckets from min to max, drawn above the track.",
    ],
    [
      "values? / bins?",
      "number[] / number",
      "Raw samples to bucket instead. bins defaults to 40, or one per step when fewer. Samples outside the limits count in the edge buckets.",
    ],
    ["histogramHeight?", "number", "Histogram height in pixels. Defaults to 56."],
    [
      "formatValue?",
      "(value: number, thumb: 0 | 1) => string",
      "Formats tooltips, aria-valuetext and default mark labels. Inputs keep plain numbers.",
    ],
    [
      "tooltip?",
      '"auto" | "always" | "never"',
      "auto shows a thumb's value while it is dragged or keyboard focused. Defaults to auto.",
    ],
    [
      "showInputs? / inputPlacement?",
      'boolean / "below" | "end"',
      "Linked number inputs that commit on Enter or blur, revert on Escape and step with the arrow keys. Below by default for two thumbs, at the end of the track for one.",
    ],
    [
      "inputPrefix? / inputSuffix?",
      "ReactNode",
      'Quiet text around the input numbers, such as "$" or "%".',
    ],
    [
      "label? / thumbLabels?",
      "string / string | [string, string]",
      'Names the group and thumbs ("Price minimum", "Price maximum"). thumbLabels sets exact names.',
    ],
    [
      "labels?",
      "Partial<{ minimum; maximum; value }>",
      "Interface copy for translation.",
    ],
    ["locale?", "string", "Locale for the default number format."],
    [
      "size?",
      '"sm" | "default"',
      "sm is a 16px thumb on a 4px track for tables and toolbars.",
    ],
    ["disabled?", "boolean", "Dims the slider and removes it from the tab order."],
    [
      "name?",
      "string",
      "Adds hidden inputs for forms: name, or name[min] and name[max].",
    ],
    [
      "className? / trackClassName? / thumbClassName?",
      "string",
      "Classes for the root, track and thumbs. Parts also expose data-slot and data-state.",
    ],
    [
      "bucketValues(values, { min, max, bins })",
      "number[]",
      "The bucketing the histogram uses, for building your own.",
    ],
    [
      "countInRange(values, value)",
      "number",
      "Samples inside a [low, high] pair, or at or below a single value. Handy for result counts.",
    ],
  ],
} as const;
