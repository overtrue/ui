export default {
  name: "tree-view",
  title: "Tree view",
  category: "Navigation",
  description:
    "A keyboard-first tree for files, permissions and navigation, with animated expansion, tri-state checkboxes, lazy children and filtering.",
  dependencies: [],
  imports: "TreeView, type TreeNode",
  exampleImports: 'import { useState } from "react"',
  usage: `function Example() {
  const nodes: TreeNode[] = [
    { id: "src", label: "src", children: [
      { id: "src/app.tsx", label: "app.tsx", badge: "M" },
      { id: "src/lib", label: "lib", children: [{ id: "src/lib/format.ts", label: "format.ts" }] },
    ] },
    { id: "package.json", label: "package.json" },
  ]
  const [selected, setSelected] = useState(["src/app.tsx"])
  return (
    <TreeView
      aria-label="Files"
      nodes={nodes}
      defaultExpanded={["src"]}
      selected={selected}
      onSelectedChange={setSelected}
    />
  )
}`,
  notes:
    "Nodes are `{ id, label, icon?, children?, badge?, disabled? }`; `icon` may be a function of the node's state, for an open folder while expanded, and string or number badges render as quiet pills. Expansion, selection and checks are each a list of ids, controlled with `expanded`, `selected` and `checked` plus their change callbacks, or left to `defaultExpanded`, `defaultSelected` and `defaultChecked`. Selection is single by default; `selectionMode=\"multiple\"` adds Cmd or Ctrl+click, Shift+click and Shift+arrow ranges, Space to toggle and Cmd or Ctrl+A, and `\"none\"` turns it off. With `checkable`, checking a parent checks every enabled descendant, parents turn mixed when only some children are on, and `onCheckedChange` receives every fully checked id, parents included; disabled nodes keep their state. Mark a node `hasChildren` without `children` and `onLoadChildren` runs the first time it opens, with a loading row, an announcement and a retry on failure; return the children or update `nodes` yourself. `filter` keeps matching nodes and their ancestors, opens those ancestors and highlights the match, and a matching parent keeps all its children. The tree follows the ARIA tree pattern with one tab stop: Up and Down move, Right opens or enters, Left closes or climbs, Home and End jump, * opens every sibling, Enter or Space selects, Space checks in a checkable tree, and typing letters jumps to the next matching label. `renderLabel` replaces the label text and receives `{ level, expanded, selected, checked, disabled, loading, match }`; return undefined to keep the default.",
  previewWidth: 640,
  examples: [
    {
      name: "tree-view-demo",
      title: "Repository files",
      description:
        "A repository with git status badges, folder icons that open with their folders, and a filter that keeps matching paths open. src/assets loads its files lazily the first time it opens.",
    },
    {
      name: "tree-view-checkbox-demo",
      title: "Role permissions",
      description:
        "Tri-state checkboxes for a Support lead role. Parents show how much of their group is granted, an owner-only permission is locked, and the summary counts what the role can do.",
    },
  ],
  api: [
    [
      "nodes",
      "TreeNode[]",
      "{ id; label; icon?; children?; hasChildren?; badge?; disabled? }. icon may be (state) => ReactNode.",
    ],
    ["selectionMode?", '"single" | "multiple" | "none"', 'Defaults to "single".'],
    ["selected? / defaultSelected? / onSelectedChange?", "string[] / (ids: string[]) => void", "Selected ids, controlled or not."],
    ["onSelect?", "(node: TreeNode) => void", "Called when a node is chosen by click, Enter or Space, for navigation."],
    ["expanded? / defaultExpanded? / onExpandedChange?", "string[] / (ids: string[]) => void", "Open parents, controlled or not."],
    ["checkable?", "boolean", "Tri-state checkboxes that propagate down to children and up to parents."],
    [
      "checked? / defaultChecked? / onCheckedChange?",
      "string[] / (ids: string[]) => void",
      "Fully checked ids, parents included. A checked parent checks its children.",
    ],
    [
      "onLoadChildren?",
      "(node: TreeNode) => Promise<TreeNode[] | void>",
      "Loads children for nodes marked hasChildren, on first open. Rejections show a retry row.",
    ],
    ["filter?", "string", "Keeps matching nodes and their ancestors, opened, with the match highlighted."],
    ["filterFn?", "(node: TreeNode, query: string) => boolean", "Custom matching. query is trimmed and lowercased."],
    [
      "renderLabel?",
      "(node: TreeNode, state: TreeNodeState) => ReactNode",
      "Replaces the label text. Return undefined to keep the default.",
    ],
    ["expandOnClick?", "boolean", "Clicking or pressing Enter on a parent also toggles it. Defaults to true."],
    ["indentGuides?", "boolean", "Vertical guides under open parents. Defaults to true."],
    ["indent?", "number", "Pixels per level. Defaults to 16."],
    ["size?", '"sm" | "default"', "Row height: 24px or 28px."],
    ["labels?", "Partial<TreeViewLabels>", "Loading, error, empty and announced text, for translation."],
    ["aria-label / aria-labelledby", "string", 'Names the tree. Defaults to "Tree".'],
    ["className", "string", "Applied to the root."],
  ],
} as const;
