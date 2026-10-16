import { useCallback, useEffect, useRef, useState } from "react";
import {
  IconActivity,
  IconFileText,
  IconPaperclip,
  IconRocket,
} from "@tabler/icons-react";
import {
  AssistantPanel,
  type AssistantCitation,
  type AssistantMessage,
  type AssistantStep,
} from "@/registry/overtrue/assistant-panel";

interface ScriptStep {
  kind: NonNullable<AssistantStep["kind"]>;
  running: string;
  done: string;
  detail?: string;
  duration: number;
}

interface Script {
  steps: ScriptStep[];
  answer: string;
  citations?: AssistantCitation[];
}

const LATENCY = "Why did checkout latency spike yesterday?";
const DEPLOYS = "Summarize this week's failed deploys";
const STATUS = "Draft a status update for INC-2187";

// All services, people and numbers below are fictional.
const scripts: Record<string, Script> = {
  [LATENCY]: {
    steps: [
      {
        kind: "search",
        running: "Searching incidents",
        done: "Searched incidents",
        detail: 'incidents service:checkout-api opened:>=2026-10-14 → 1 match (INC-2187 "Checkout slow")',
        duration: 420,
      },
      {
        kind: "query",
        running: "Querying traces",
        done: "Queried traces",
        detail:
          "SELECT endpoint, quantile(0.95)(duration_ms) AS p95\nFROM spans WHERE service = 'checkout-api'\n  AND ts BETWEEN '2026-10-14 13:00' AND '2026-10-14 16:00'\nGROUP BY endpoint ORDER BY p95 DESC  -- 1.2M spans",
        duration: 910,
      },
      {
        kind: "tool",
        running: "Reading the deploy log",
        done: "Read the deploy log",
        detail: "deploys list --service checkout-api --since 36h\nv2.31.0  14:05 UTC  @jonas  succeeded\nv2.30.4  14:49 UTC  @mira   rollback",
        duration: 640,
      },
    ],
    answer:
      "Checkout latency spiked right after deploy **v2.31.0** of `checkout-api` at 14:05 UTC {{cite:1}}. p95 rose from 412\u00a0ms to {{metric:p95|1.84 s|negative}} and stayed there until the rollback at 14:49 {{cite:2}}.\n\nWhat changed:\n\n- The release moved tax calculation into a *synchronous* call to `tax-svc`, adding about **1.3\u00a0s** to `POST /checkout/confirm` {{cite:3}}.\n- Errors held at {{metric:Error rate|0.4%|neutral}}, so customers waited rather than failed.\n- Conversion dipped {{metric:Checkout|-6.2%}} during the 44-minute window.\n\nAfter the rollback p95 recovered to {{metric:p95|398 ms|positive}}. Before re-shipping, cache tax quotes per cart so the call stays off the critical path.",
    citations: [
      { id: "inc", label: "INC-2187 · Checkout slow" },
      { id: "apm", label: "APM · checkout-api p95" },
      { id: "deploy", label: "Deploy log · v2.31.0" },
    ],
  },
  [DEPLOYS]: {
    steps: [
      {
        kind: "query",
        running: "Querying deploy history",
        done: "Queried deploy history",
        detail: "deploys list --status failed --since monday → 3 of 41",
        duration: 560,
      },
      {
        kind: "tool",
        running: "Reading failure logs",
        done: "Read failure logs",
        duration: 820,
      },
    ],
    answer:
      "Three of 41 deploys failed this week, and all three recovered without customer impact {{cite:1}}.\n\n| Service | Version | Failed | Cause |\n| --- | --- | --- | --- |\n| `billing-worker` | v4.12.0 | Mon 09:14 | Migration lock timeout |\n| `search-api` | v1.88.2 | Wed 16:40 | Health check 503 |\n| `web` | v7.3.1 | Thu 11:02 | Bundle over budget |\n\nThe failure rate is {{metric:Failed|7.3%|negative}}, up from {{metric:Last week|2.6%|neutral}}. Watch `billing-worker`: its migration retried twice before the lock cleared {{cite:2}}.",
    citations: [
      { id: "deploys", label: "Deploys · this week" },
      { id: "worker", label: "billing-worker · logs" },
    ],
  },
  [STATUS]: {
    steps: [
      {
        kind: "search",
        running: "Reading INC-2187",
        done: "Read INC-2187",
        duration: 380,
      },
      {
        kind: "think",
        running: "Drafting the update",
        done: "Drafted the update",
        duration: 700,
      },
    ],
    answer:
      "Here's a draft you can post to the status page {{cite:1}}:\n\n> **Resolved · Slow checkout.** Between 14:05 and 14:49 UTC on October 14, some customers saw checkout take several seconds longer than usual. No payments failed. We rolled back the change responsible and are adding safeguards before it ships again.\n\nWant a shorter version for the in-app banner?",
    citations: [{ id: "inc", label: "INC-2187 · timeline" }],
  },
};

const fallback: Script = {
  steps: [
    { kind: "search", running: "Searching the workspace", done: "Searched the workspace", duration: 520 },
  ],
  answer:
    "This preview runs on scripted, fictional data, so it can only answer the suggested questions. Try *Why did checkout latency spike yesterday?*, or start a **New chat** to see the suggestions again.",
};

const suggestions = [
  { label: LATENCY, icon: <IconActivity /> },
  { label: DEPLOYS, icon: <IconRocket /> },
  { label: STATUS, icon: <IconFileText /> },
];

const models = [
  { value: "orion-2", label: "Orion 2" },
  { value: "orion-2-mini", label: "Orion 2 mini" },
];

/** Split into word-sized chunks, keeping `{{…}}` tokens whole. */
function chunks(text: string) {
  return text.match(/\{\{[^}]*\}\}\s*|\S+\s*|\s+/g) ?? [];
}

interface Run {
  cancelled: boolean;
  timer: number;
}

/** Resolves after `ms`, holding while the tab is hidden. Never resolves once cancelled. */
function wait(ms: number, run: Run) {
  return new Promise<void>((resolve) => {
    const schedule = (delay: number) => {
      run.timer = window.setTimeout(() => {
        if (run.cancelled) return;
        if (document.hidden) return schedule(300);
        resolve();
      }, delay);
    };
    schedule(ms);
  });
}

let sequence = 0;
const nextId = (prefix: string) => `${prefix}-${++sequence}`;

export default function Demo() {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [status, setStatus] = useState<"idle" | "streaming">("idle");
  const run = useRef<Run | null>(null);
  const streamingId = useRef<string | null>(null);

  const update = useCallback((id: string, change: (message: AssistantMessage) => AssistantMessage) => {
    setMessages((current) => current.map((message) => (message.id === id ? change(message) : message)));
  }, []);

  const cancel = useCallback(() => {
    if (!run.current) return;
    run.current.cancelled = true;
    window.clearTimeout(run.current.timer);
    run.current = null;
  }, []);

  const play = useCallback(
    async (prompt: string, replaceId?: string) => {
      cancel();
      const current: Run = { cancelled: false, timer: 0 };
      run.current = current;
      const script = scripts[prompt] ?? fallback;
      const id = nextId("answer");
      streamingId.current = id;
      const answer: AssistantMessage = {
        id,
        role: "assistant",
        content: "",
        status: "streaming",
        steps: [],
        citations: script.citations,
        createdAt: new Date(),
      };
      setMessages((list) =>
        replaceId
          ? list.map((message) => (message.id === replaceId ? answer : message))
          : [...list, { id: nextId("question"), role: "user", content: prompt, createdAt: new Date() }, answer],
      );
      setStatus("streaming");

      await wait(450, current);
      for (const [index, step] of script.steps.entries()) {
        const stepId = `${id}-step-${index}`;
        update(id, (message) => ({
          ...message,
          steps: [...(message.steps ?? []), { id: stepId, kind: step.kind, label: step.running, status: "running", detail: step.detail }],
        }));
        await wait(step.duration, current);
        update(id, (message) => ({
          ...message,
          steps: message.steps?.map((item) =>
            item.id === stepId ? { ...item, label: step.done, status: "done", duration: step.duration } : item,
          ),
        }));
      }

      await wait(320, current);
      let text = "";
      for (const piece of chunks(script.answer)) {
        text += piece;
        const snapshot = text;
        update(id, (message) => ({ ...message, content: snapshot }));
        await wait(piece.includes("\n") ? 140 : 26 + Math.random() * 34, current);
      }
      update(id, (message) => ({ ...message, status: "done" }));
      if (run.current === current) run.current = null;
      streamingId.current = null;
      setStatus("idle");
    },
    [cancel, update],
  );

  // Ask the first question once on mount, so the panel is never empty for long.
  useEffect(() => {
    const timer = window.setTimeout(() => void play(LATENCY), 700);
    return () => {
      window.clearTimeout(timer);
      cancel();
    };
  }, [play, cancel]);

  const stop = () => {
    cancel();
    const id = streamingId.current;
    streamingId.current = null;
    setStatus("idle");
    if (!id) return;
    update(id, (message) => ({
      ...message,
      status: "done",
      content: message.content || "_Stopped before answering._",
      steps: message.steps?.filter((step) => step.status !== "running"),
    }));
  };

  return (
    <div className="h-[560px] w-full">
      <AssistantPanel
        title="Copilot"
        messages={messages}
        status={status}
        suggestions={suggestions}
        models={models}
        onSend={(text) => void play(text)}
        onStop={stop}
        onRegenerate={(id) => {
          const index = messages.findIndex((message) => message.id === id);
          const question = messages
            .slice(0, index)
            .reverse()
            .find((message) => message.role === "user");
          if (question) void play(question.content, id);
        }}
        onFeedback={() => {}}
        onNewChat={() => {
          cancel();
          streamingId.current = null;
          setStatus("idle");
          setMessages([]);
        }}
        placeholder="Ask about incidents or deploys…"
        composerActions={
          <button
            type="button"
            aria-label="Attach file"
            title="Attach file"
            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <IconPaperclip className="size-4" aria-hidden="true" stroke={1.75} />
          </button>
        }
      />
    </div>
  );
}
