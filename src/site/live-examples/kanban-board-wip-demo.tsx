import { useState } from "react";
import { IconArrowRight } from "@tabler/icons-react";
import { Switch } from "@/components/ui/switch";
import {
  KanbanBoard,
  type KanbanCard,
  type KanbanColumn,
} from "@/registry/overtrue/kanban-board";

// A fictional platform team's flow board with WIP limits.
const columns: KanbanColumn[] = [
  { id: "ready", title: "Ready", color: "var(--color-muted-foreground)" },
  { id: "doing", title: "Doing", limit: 3, color: "var(--color-chart-1)" },
  { id: "verify", title: "Verify", limit: 2, color: "var(--color-chart-3)" },
  { id: "shipped", title: "Shipped", color: "var(--color-chart-2)" },
];

const nina = { id: "nina", name: "Nina Duarte" };
const omar = { id: "omar", name: "Omar Haddad" };
const kai = { id: "kai", name: "Kai Lindqvist" };
const rosa = { id: "rosa", name: "Rosa Ibáñez" };

const key = (value: string) => <span className="font-mono">{value}</span>;

const initial: KanbanCard[] = [
  { id: "PLT-88", column: "ready", title: "Pin base images by digest", labels: ["Build"], priority: "medium", assignees: [kai], meta: key("PLT-88") },
  { id: "PLT-91", column: "ready", title: "Alert on certificate expiry", labels: ["Observability"], priority: "high", assignees: [rosa], meta: key("PLT-91") },
  { id: "PLT-74", column: "doing", title: "Rotate signing keys", labels: ["Security"], priority: "urgent", assignees: [nina], meta: key("PLT-74") },
  { id: "PLT-79", column: "doing", title: "Cache test dependencies in CI", labels: ["Build"], priority: "medium", assignees: [kai, omar], meta: key("PLT-79") },
  { id: "PLT-81", column: "doing", title: "Split the deploy queue by region", labels: ["Deploys"], priority: "high", assignees: [omar], meta: key("PLT-81") },
  { id: "PLT-83", column: "doing", title: "Retire the legacy log shipper", labels: ["Observability"], priority: "low", assignees: [rosa], meta: key("PLT-83") },
  { id: "PLT-70", column: "verify", title: "Postgres 17 on staging", labels: ["Data"], priority: "high", assignees: [nina, kai], meta: key("PLT-70") },
  { id: "PLT-72", column: "verify", title: "Canary analysis for API pods", labels: ["Deploys"], priority: "medium", assignees: [omar], meta: key("PLT-72") },
  { id: "PLT-65", column: "shipped", title: "Read replicas in eu-west", labels: ["Data"], priority: "medium", assignees: [nina], meta: key("PLT-65") },
];

interface Move {
  title: string;
  from: string;
  to: string;
  position: number;
  at: string;
}

const titleOf = (id: string) => columns.find((column) => column.id === id)?.title ?? id;

export default function Demo() {
  const [cards, setCards] = useState(initial);
  const [enforce, setEnforce] = useState(false);
  const [last, setLast] = useState<Move | null>(null);
  const over = columns.filter(
    (column) => column.limit !== undefined && cards.filter((card) => card.column === column.id).length > column.limit,
  );

  return (
    <div className="space-y-4">
      <KanbanBoard
        aria-label="Platform flow board"
        columns={columns}
        cards={cards}
        onCardsChange={setCards}
        locale="en-US"
        enforceLimits={enforce}
        onMove={(card, from, to, index) =>
          setLast({
            title: card.title,
            from: titleOf(from),
            to: titleOf(to),
            position: index + 1,
            at: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          })
        }
      />
      <div className="flex flex-col gap-3 rounded-xl bg-[color-mix(in_oklab,var(--color-muted)_42%,var(--color-background))] px-4 py-3 ring-1 ring-border/60 ring-inset dark:bg-[color-mix(in_oklab,var(--color-muted)_30%,var(--color-background))] sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1" aria-live="polite">
          <p className="text-xs text-muted-foreground">Last move</p>
          {last ? (
            <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[13px] leading-5">
              <span className="font-medium text-foreground">{last.title}</span>
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                {last.from}
                <IconArrowRight className="size-3.5" stroke={1.75} aria-label="to" />
                {last.to}, position {last.position}
              </span>
              <span className="font-mono text-xs text-muted-foreground tabular-nums">{last.at}</span>
            </p>
          ) : (
            <p className="mt-0.5 text-[13px] leading-5 text-muted-foreground">
              Drag a card, or focus one and press Space.
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-4 sm:border-l sm:border-border/60 sm:pl-4">
          <p className="text-xs tabular-nums">
            {over.length ? (
              <span className="text-amber-700 dark:text-amber-400">
                {over.map((column) => column.title).join(" and ")} over limit
              </span>
            ) : (
              <span className="text-emerald-700 dark:text-emerald-400">All columns within limits</span>
            )}
          </p>
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium whitespace-nowrap text-foreground">
            <Switch checked={enforce} onCheckedChange={setEnforce} aria-label="Enforce limits" />
            Enforce limits
          </label>
        </div>
      </div>
    </div>
  );
}
