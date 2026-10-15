import { useEffect, useRef, useState } from "react";
import { IconSparkles, IconX } from "@tabler/icons-react";
import {
  AssistantPanel,
  type AssistantFeedback,
  type AssistantMessage,
} from "@/registry/overtrue/assistant-panel";

// Fictional accounts and numbers.
const conversation: AssistantMessage[] = [
  {
    id: "q1",
    role: "user",
    content: "Which accounts had the most failed payments this week?",
    createdAt: "2026-10-15T09:12:00Z",
  },
  {
    id: "a1",
    role: "assistant",
    status: "done",
    createdAt: "2026-10-15T09:12:06Z",
    steps: [
      {
        id: "s1",
        kind: "query",
        label: "Queried billing replica",
        status: "done",
        duration: 640,
        detail: "charges · status = failed · last 7 days → 212 rows",
      },
      { id: "s2", kind: "think", label: "Grouped by account", status: "done", duration: 310 },
    ],
    content:
      "Four accounts make up most of this week's {{metric:Failed payments|212|neutral}} {{cite:1}}:\n\n1. **Northwind Labs** · 58, mostly expired cards\n2. **Blue Fern Studio** · 41, issuer declines\n3. **Kestrel Health** · 33, 3-D Secure timeouts\n4. **Orbit Freight** · 22, insufficient funds\n\nThe failure rate rose {{metric:Rate|+0.8 pts|negative}} week over week.",
    citations: [{ id: "replica", label: "billing-replica · charges" }],
  },
  {
    id: "q2",
    role: "user",
    content: "Can you give me the SQL so I can rerun it?",
    createdAt: "2026-10-15T09:13:40Z",
  },
  {
    id: "a2",
    role: "assistant",
    status: "done",
    createdAt: "2026-10-15T09:13:44Z",
    content:
      "Here's the query I ran against the billing replica {{cite:1}}:\n\n```sql\nSELECT a.name,\n       count(*) AS failures,\n       mode() WITHIN GROUP (ORDER BY c.failure_code) AS top_reason\nFROM charges c\nJOIN accounts a ON a.id = c.account_id\nWHERE c.status = 'failed'\n  AND c.created_at >= now() - interval '7 days'\nGROUP BY a.name\nORDER BY failures DESC\nLIMIT 10;\n```\n\nChange `interval '7 days'` for another window, or add `AND c.amount > 50000` to keep charges over $500.",
    citations: [{ id: "replica", label: "billing-replica · charges" }],
  },
];

const reply =
  "This side panel shows a finished conversation, so it answers every new question the same way. The **Copilot** example above streams live answers with tool steps.";

export default function Demo() {
  const [open, setOpen] = useState(true);
  const [reopened, setReopened] = useState(false);
  const [messages, setMessages] = useState(conversation);
  const [status, setStatus] = useState<"idle" | "streaming">("idle");
  const [feedback, setFeedback] = useState<Record<string, AssistantFeedback>>({ a1: "up" });
  const timer = useRef(0);
  useEffect(() => () => window.clearInterval(timer.current), []);

  const send = (text: string) => {
    const id = `r-${Date.now()}`;
    const words = reply.match(/\S+\s*/g) ?? [];
    setMessages((list) => [
      ...list,
      { id: `u-${id}`, role: "user", content: text, createdAt: new Date() },
      { id, role: "assistant", content: "", status: "streaming", createdAt: new Date() },
    ]);
    setStatus("streaming");
    let index = 0;
    window.clearInterval(timer.current);
    timer.current = window.setInterval(() => {
      if (document.hidden) return;
      index++;
      const done = index >= words.length;
      setMessages((list) =>
        list.map((message) =>
          message.id === id
            ? { ...message, content: words.slice(0, index).join(""), status: done ? "done" : "streaming" }
            : message,
        ),
      );
      if (done) {
        window.clearInterval(timer.current);
        setStatus("idle");
      }
    }, 45);
  };

  const stop = () => {
    window.clearInterval(timer.current);
    setStatus("idle");
    setMessages((list) =>
      list.map((message) => (message.status === "streaming" ? { ...message, status: "done" } : message)),
    );
  };

  if (!open)
    return (
      <div className="flex h-[620px] w-full items-end justify-end">
        <button
          type="button"
          autoFocus
          onClick={() => {
            setOpen(true);
            setReopened(true);
          }}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-border/70 bg-card pr-4 pl-3 text-sm font-medium shadow-[0_8px_24px_-12px_rgb(0_0_0/0.25)] transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <IconSparkles className="size-4 text-primary" aria-hidden="true" stroke={1.75} />
          Ask Copilot
        </button>
      </div>
    );

  return (
    <div className="mx-auto h-[620px] w-full max-w-[380px]">
      <AssistantPanel
        density="compact"
        autoFocus={reopened}
        title="Copilot"
        model="orion-2-mini"
        messages={messages}
        status={status}
        feedback={feedback}
        onFeedback={(id, value) => setFeedback((current) => ({ ...current, [id]: value }))}
        onSend={send}
        onStop={stop}
        onNewChat={() => {
          stop();
          setMessages([]);
        }}
        suggestions={["Which invoices are overdue?", "Show refunds over $1,000 this month"]}
        placeholder="Ask about billing…"
        footer="Answers use the billing replica, refreshed hourly."
        headerActions={
          <button
            type="button"
            aria-label="Close panel"
            title="Close panel"
            onClick={() => setOpen(false)}
            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <IconX className="size-4" aria-hidden="true" />
          </button>
        }
      />
    </div>
  );
}
