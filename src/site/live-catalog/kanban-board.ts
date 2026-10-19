export default {
  name: "kanban-board",
  title: "Kanban board",
  category: "Tables & lists",
  description:
    "Columns of cards with native pointer and keyboard drag and drop, WIP limits, auto-scroll and live announcements.",
  dependencies: [],
  imports: "KanbanBoard, type KanbanCard, type KanbanColumn",
  exampleImports: 'import { useState } from "react"',
  usage: `function Example() {
  const columns: KanbanColumn[] = [
    { id: "todo", title: "To do" },
    { id: "doing", title: "In progress", limit: 2 },
    { id: "done", title: "Done" },
  ]
  const [cards, setCards] = useState<KanbanCard[]>([
    { id: "ATL-12", column: "todo", title: "Saved filters", labels: ["Web"], priority: "medium" },
    { id: "ATL-14", column: "doing", title: "Usage alerts", priority: "urgent", due: "2026-10-21",
      assignees: [{ name: "Maya Chen" }] },
    { id: "ATL-9", column: "done", title: "SSO setup guide", labels: ["Docs"] },
  ])
  return (
    <KanbanBoard
      columns={columns}
      cards={cards}
      onCardsChange={setCards}
      onMove={(card, from, to, index) => console.log(card.id, from, "→", to, index)}
    />
  )
}`,
  notes:
    "Cards are one flat array in display order, each naming its `column`; the board groups them by column and `onCardsChange` hands back the whole array after a drop, while `onMove(card, from, to, index)` reports just the change for a server call (`index` counts the other cards in the destination column). `moveKanbanCard(cards, id, column, index)` is the same pure move, for optimistic updates. Drag a card with a mouse or pen after 4px of travel, or with touch after a short press so the board still scrolls; the lifted card follows the pointer, a dashed placeholder shows where it will land, other cards glide out of the way, the board, the column and the page scroll near their edges, and the card settles into its slot on release. Escape cancels. From the keyboard, Space or Enter picks a card up, the arrow keys move it between positions and columns, Space or Enter drops it and Escape puts it back, with each step announced to screen readers. A column over its `limit` turns amber with a warning, counted live while you drag; `enforceLimits` and `canMove` refuse columns instead. Set `onCardClick` to open cards: Enter then opens and Space picks up. `renderCard` replaces the inside of a card and receives `{ column, dragging, overlay }`; compose it with `KanbanCardContent` to keep the built-in body. Buttons and links inside a card never start a drag. Columns are at least `columnWidth` wide and scroll sideways on narrow screens, with room for card shadows and focus rings.",
  previewWidth: 760,
  examples: [
    {
      name: "kanban-board-demo",
      title: "Sprint board",
      description:
        "A product team's sprint with twelve issues across four columns, with labels, priorities, due dates, comment counts and assignees. Drag cards, or use Space and the arrow keys; the plus buttons add issues.",
    },
    {
      name: "kanban-board-wip-demo",
      title: "WIP limits",
      description:
        "Doing holds four cards against a limit of three, so it warns. The readout below shows the last move from onMove, and Enforce limits refuses drops into full columns.",
    },
  ],
  api: [
    ["columns", "KanbanColumn[]", "{ id; title; limit?; color? }, in display order. color tints the header dot."],
    [
      "cards? / defaultCards?",
      "KanbanCard[]",
      "{ id; column; title; description?; labels?; assignees?; due?; priority?; meta? }, in display order. Pass cards with onCardsChange to control them.",
    ],
    ["onCardsChange?", "(cards: KanbanCard[]) => void", "Receives the reordered array after every drop that moved a card."],
    [
      "onMove?",
      "(card, from: string, to: string, index: number) => void",
      "The moved card (already in its new column), the column ids, and its index among the other cards there.",
    ],
    ["canMove?", "(card, from: KanbanColumn, to: KanbanColumn) => boolean", "Return false to refuse a column. It dims while dragging."],
    ["enforceLimits?", "boolean", "Refuse drops into columns already at their limit. Defaults to false: limits only warn."],
    ["onCardClick?", "(card) => void", "Click handler. When set, Enter opens the card and Space picks it up."],
    ["onAddCard?", "(column: KanbanColumn) => void", "Shows a plus button in every column header."],
    [
      "renderCard?",
      "(card, state: { column; dragging; overlay }) => ReactNode",
      "Draws the inside of a card. Use KanbanCardContent for the built-in body.",
    ],
    ["columnWidth?", "number", "Minimum column width in pixels; columns grow to fill wide boards. Defaults to 272."],
    ["maxHeight?", "number | string", "Height limit per column. Cards scroll inside it and auto-scroll while dragging."],
    ["formatDue? / locale?", "(date: Date) => string / string", "Due date text. Defaults to a short month and day."],
    ["now?", "Date", "Today, for overdue and due soon colors. Defaults to the client's date after mount."],
    ["labels?", "Partial<KanbanBoardLabels>", "Every visible and announced string, for translation."],
    ["className", "string", "Applied to the root."],
    [
      "moveKanbanCard(cards, id, column, index)",
      "(cards: T[], id: string, column: string, index: number) => T[]",
      "Pure move used by the board, for optimistic updates.",
    ],
  ],
} as const;
