export default {
  name: "multi-select",
  title: "Multi-select",
  category: "Forms",
  description:
    "A combobox for picking many values: chips that fold into +3, grouped options with select all, search, async loading, and creation.",
  dependencies: [],
  imports: "MultiSelect, type MultiSelectOption",
  exampleImports: 'import { useState } from "react"',
  usage: `function Example() {
  const options: MultiSelectOption[] = [
    { value: "mia", label: "Mia Chen", description: "Design systems lead", group: "Design" },
    { value: "ava", label: "Ava Singh", description: "Product designer", group: "Design" },
    { value: "noah", label: "Noah Kim", description: "Payments API", group: "Platform" },
    { value: "priya", label: "Priya Nair", description: "Security", group: "Platform" },
  ]
  const [reviewers, setReviewers] = useState<string[]>(["mia"])
  return (
    <MultiSelect
      aria-label="Reviewers"
      options={options}
      value={reviewers}
      onValueChange={setReviewers}
      maxSelected={3}
      placeholder="Add reviewers…"
    />
  )
}`,
  notes:
    "Focus stays in the field's input, the combobox, while the list follows with aria-activedescendant: Down and Up move through options and group headings, Page Down and Page Up jump eight, Enter toggles, Escape closes and then clears the search, and typing filters by every word across label, description, value, group, and keywords. Backspace in an empty input removes the last chip; Left from the start of the input steps into the chips, where Backspace or Delete removes one and Right returns. Chips fit on one line by default and fold the rest into a +3 chip that expands them until focus leaves; pass `collapse={false}` to wrap or a number to cap them. Options with a `group` render under a heading with a count and select all, which respects `maxSelected`; at the limit, unselected options disable and the footer says so. Labels of selected values are remembered, so chips keep their names when `loadOptions` replaces the list; the loader receives an AbortSignal and is debounced while typing. With `creatable`, a query with no exact match offers Create, and `onCreate` may return the option to add. The list renders in a portal by default; `inline` keeps it in place under the field for sheets and previews. Pass `name` to submit values with a native form.",
  previewWidth: 640,
  examples: [
    {
      name: "multi-select-demo",
      title: "Assign reviewers",
      description:
        "Reviewers grouped by team with avatars, roles, and select all, shown open in place. One person is away and cannot be picked, and the list allows six reviewers.",
    },
    {
      name: "multi-select-create-demo",
      title: "Tags with creation",
      description:
        "Article tags that wrap instead of folding, limited to five. Type a new name and press Enter to create it; the new tag is slugged and joins the list.",
    },
  ],
  api: [
    [
      "options?",
      "MultiSelectOption[]",
      "{ value; label; description?; icon?; avatar?; group?; disabled?; keywords? }. Groups render in first-seen order.",
    ],
    [
      "value? / defaultValue?",
      "string[]",
      "Controlled or initial selection. Leave value undefined to let the component manage it.",
    ],
    [
      "onValueChange?",
      "(value: string[], details: { action; options }) => void",
      "Called on every change with the action (select, remove, clear, create, select-group, clear-group) and the options it touched.",
    ],
    [
      "loadOptions?",
      "(query: string, { signal }) => Promise<MultiSelectOption[]>",
      "Loads options when the list opens and as the query changes. Results replace options while it is set.",
    ],
    ["loadDelay?", "number", "Debounce for loadOptions while typing, in milliseconds. Defaults to 200."],
    ["creatable?", "boolean", "Offer to create an option from a query with no exact match."],
    [
      "onCreate?",
      "(query: string) => MultiSelectOption | string | void | Promise<…>",
      "Return the new option, its value, or nothing to use the query for both.",
    ],
    ["maxSelected?", "number", "Most values that can be selected. Further options disable at the limit."],
    [
      "collapse?",
      '"auto" | number | false',
      "Chip overflow: fit one line and fold the rest into +N, cap at a count, or wrap all. Defaults to auto.",
    ],
    ["groupSelectAll?", "boolean", "Offer select all in group headings. Defaults to true."],
    ["keepOpen?", "boolean", "Keep the list open after a pick. Defaults to true."],
    [
      "open? / defaultOpen? / onOpenChange?",
      "boolean / (open: boolean) => void",
      "Controlled or initial open state of the list.",
    ],
    [
      "inline?",
      "boolean",
      "Render the list in place under the field with no portal, for sheets and previews. Leave room below it.",
    ],
    ["onSearchChange?", "(query: string) => void", "Called as the search text changes."],
    [
      "filter?",
      "(option, query) => boolean",
      "Replaces the search match for static options. Ignored when loadOptions supplies the results.",
    ],
    [
      "renderOption?",
      "(option, { selected; active; disabled; query }) => ReactNode",
      "Replaces an option's content after its check box.",
    ],
    [
      "renderChip?",
      "(option, { disabled; remove }) => ReactNode",
      "Replaces a chip's icon and label. The remove button stays.",
    ],
    ["placeholder?", "string", "Shown when nothing is selected."],
    ["disabled? / invalid?", "boolean", "Disable the control, or mark it invalid with aria-invalid."],
    ["size?", '"sm" | "default"', "Field height: 32px or 36px, 40px or 44px on touch screens."],
    ["align?", '"start" | "end"', "List alignment against the field."],
    ["name?", "string", "Adds a hidden input per value for native form posts."],
    [
      "id? / aria-label? / aria-labelledby? / aria-describedby?",
      "string",
      "Applied to the input, so a <label htmlFor> names the control.",
    ],
    [
      "labels?",
      "Partial<MultiSelectLabels>",
      "Interface copy for translation, including create: (query) => string and more: (count) => string.",
    ],
    [
      "className? / fieldClassName? / contentClassName?",
      "string",
      "Classes for the root, the field, and the list panel.",
    ],
  ],
} as const;
