"use client";

import * as React from "react";
import {
  IconAlertTriangle as AlertTriangle,
  IconArrowDown as ArrowDown,
  IconArrowDownRight as ArrowDownRight,
  IconArrowUp as ArrowUp,
  IconArrowUpRight as ArrowUpRight,
  IconBulb as Bulb,
  IconCheck as Check,
  IconChevronRight as ChevronRight,
  IconCopy as Copy,
  IconDatabase as Database,
  IconEdit as NewChat,
  IconLoader2 as Loader,
  IconPlayerStopFilled as Stop,
  IconRefresh as Refresh,
  IconSearch as Search,
  IconSelector as Selector,
  IconSparkles as Sparkles,
  IconThumbDown as ThumbDown,
  IconThumbDownFilled as ThumbDownFilled,
  IconThumbUp as ThumbUp,
  IconThumbUpFilled as ThumbUpFilled,
  IconTool as Tool,
  IconX as X,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

export type AssistantRole = "user" | "assistant";
export type AssistantMessageStatus = "streaming" | "done" | "error";
export type AssistantStepKind = "search" | "query" | "tool" | "think";
export type AssistantStepStatus = "running" | "done" | "error";
export type AssistantFeedback = "up" | "down";
export type AssistantDensity = "comfortable" | "compact";
export type AssistantTone = "positive" | "negative" | "neutral";

/** One unit of work the assistant did before (or while) answering. */
export interface AssistantStep {
  id: string;
  /** What happened, e.g. "Searched incidents". Update it as the step finishes. */
  label: string;
  /** Picks the icon. Defaults to "tool". */
  kind?: AssistantStepKind;
  status: AssistantStepStatus;
  /** Query, command or raw output, shown in monospace when the step is expanded. */
  detail?: string;
  /** Milliseconds. */
  duration?: number;
}

export interface AssistantCitation {
  id: string;
  label: string;
  href?: string;
}

export interface AssistantMessage {
  id: string;
  role: AssistantRole;
  /** Markdown-lite for assistant messages; plain text for user messages. */
  content: string;
  steps?: AssistantStep[];
  /** Referenced from the content with `{{cite:1}}` (1-based) or `{{cite:id}}`. */
  citations?: AssistantCitation[];
  /** Assistant messages only. Defaults to "done". */
  status?: AssistantMessageStatus;
  createdAt?: Date | string;
}

export type AssistantModel =
  | string
  | { value: string; label?: string; disabled?: boolean };

export type AssistantSuggestion =
  | string
  | {
      label: string;
      /** Sent instead of the label. */
      prompt?: string;
      icon?: React.ReactNode;
    };

export interface AssistantSendOptions {
  model?: string;
}

/** An inline `{{kind:arg|arg|arg}}` token from assistant markdown. */
export interface AssistantToken {
  /** "metric", "cite", or your own kind. */
  kind: string;
  /** Every argument after the colon, trimmed. */
  args: string[];
  /** First argument: the metric label or citation reference. */
  label: string;
  /** Second argument: the metric value. */
  value?: string;
  /** Third argument when it is positive, negative or neutral; otherwise inferred from the value's sign. */
  tone: AssistantTone;
  direction: "up" | "down" | "flat";
  raw: string;
}

export interface AssistantMessageRenderContext {
  index: number;
  /** The newest message of its role. */
  isLast: boolean;
  /** The built-in rendering, to wrap or reuse. */
  children: React.ReactNode;
}

export interface AssistantPanelLabels {
  title: string;
  newChat: string;
  placeholder: string;
  send: string;
  stop: string;
  copy: string;
  copied: string;
  copyCode: string;
  regenerate: string;
  helpful: string;
  notHelpful: string;
  feedback: string;
  jumpToLatest: string;
  emptyTitle: string;
  emptyDescription: string;
  thinking: string;
  writing: string;
  sources: string;
  error: string;
  retry: string;
  model: string;
  conversation: string;
  you: string;
  assistant: string;
  activity: string;
  /** Summary for a finished step list, e.g. "3 steps · 1.9s". */
  steps: (count: number, duration: string | null) => string;
  /** Summary when some steps failed. */
  stepsFailed: (failed: number, count: number) => string;
}

export interface AssistantPanelProps extends Omit<
  React.ComponentProps<"div">,
  "title" | "children" | "onCopy" | "defaultValue"
> {
  /** The conversation, oldest first. Append and update messages as the answer streams. */
  messages: AssistantMessage[];
  /** "streaming" swaps Send for Stop and blocks sending. */
  status?: "idle" | "streaming";
  onSend?: (text: string, options: AssistantSendOptions) => void;
  onStop?: () => void;
  /** Shows Regenerate on the latest answer and Try again on failed ones. */
  onRegenerate?: (id: string) => void;
  /** Shows thumbs up and down on finished answers. */
  onFeedback?: (id: string, value: AssistantFeedback) => void;
  /** Feedback by message id. Leave undefined to let the panel remember it. */
  feedback?: Record<string, AssistantFeedback | undefined>;
  /** Shows the New chat action. */
  onNewChat?: () => void;
  /** Called with the plain text. Without it, Copy writes to the clipboard. */
  onCopy?: (text: string, message: AssistantMessage) => void;
  /** Prompts offered in the empty state. */
  suggestions?: AssistantSuggestion[];
  /** Adds a model picker to the composer. */
  models?: AssistantModel[];
  model?: string;
  defaultModel?: string;
  onModelChange?: (model: string) => void;
  title?: React.ReactNode;
  placeholder?: string;
  /** The composer draft. Pass with `onValueChange` to control it. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Buttons at the start of the composer toolbar, such as attach. */
  composerActions?: React.ReactNode;
  /** Buttons at the end of the header, such as close. */
  headerActions?: React.ReactNode;
  /** Small print under the composer. */
  footer?: React.ReactNode;
  /** Replaces the empty state. */
  emptyState?: React.ReactNode;
  density?: AssistantDensity;
  disabled?: boolean;
  autoFocus?: boolean;
  /** Tallest the composer grows before scrolling, in pixels. */
  maxComposerHeight?: number;
  composerRef?: React.Ref<HTMLTextAreaElement>;
  /** Draw a message yourself. Return `undefined` to keep the built-in rendering. */
  renderMessage?: (
    message: AssistantMessage,
    context: AssistantMessageRenderContext,
  ) => React.ReactNode | undefined;
  /** Draw a step row yourself. Return `undefined` to keep the built-in row. */
  renderStep?: (
    step: AssistantStep,
    message: AssistantMessage,
  ) => React.ReactNode | undefined;
  /** Draw an inline token yourself. Return `undefined` to keep the built-in chip. */
  renderToken?: (
    token: AssistantToken,
    message: AssistantMessage,
  ) => React.ReactNode | undefined;
  /** Formats step durations (milliseconds). */
  formatDuration?: (ms: number) => string;
  /** Formats message times shown next to the actions. */
  formatTime?: (date: Date) => string;
  labels?: Partial<AssistantPanelLabels>;
}

const LABELS: AssistantPanelLabels = {
  title: "Assistant",
  newChat: "New chat",
  placeholder: "Ask anything…",
  send: "Send message",
  stop: "Stop generating",
  copy: "Copy",
  copied: "Copied",
  copyCode: "Copy code",
  regenerate: "Regenerate",
  helpful: "Good response",
  notHelpful: "Bad response",
  feedback: "Feedback",
  jumpToLatest: "Jump to latest",
  emptyTitle: "How can I help?",
  emptyDescription: "Ask about metrics, incidents or anything in this workspace.",
  thinking: "Thinking…",
  writing: "Writing…",
  sources: "Sources",
  error: "Something went wrong while answering.",
  retry: "Try again",
  model: "Model",
  conversation: "Conversation",
  you: "You",
  assistant: "Assistant",
  activity: "Activity",
  steps: (count, duration) =>
    `${count} ${count === 1 ? "step" : "steps"}${duration ? ` · ${duration}` : ""}`,
  stepsFailed: (failed, count) =>
    `${failed} of ${count} ${count === 1 ? "step" : "steps"} failed`,
};

/* -------------------------------------------------------------------------------------------------
 * Shared helpers
 * -----------------------------------------------------------------------------------------------*/

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:shadow-[0_0_14px_-2px_color-mix(in_oklab,var(--color-primary)_45%,transparent)]";

const useIsoLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

const REDUCED = "(prefers-reduced-motion: reduce)";
function useReducedMotion() {
  return React.useSyncExternalStore(
    (callback) => {
      const query = window.matchMedia(REDUCED);
      query.addEventListener("change", callback);
      return () => query.removeEventListener("change", callback);
    },
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}

const subscribeNothing = () => () => {};
function useMounted() {
  return React.useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
}

async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for insecure contexts and older browsers.
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

function useCopy(timeout = 1600) {
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), timeout);
    return () => window.clearTimeout(timer);
  }, [copied, timeout]);
  const copy = React.useCallback(async (text: string, handler?: (text: string) => void) => {
    if (handler) handler(text);
    else if (!(await writeClipboard(text))) return;
    setCopied(true);
  }, []);
  return [copied, copy] as const;
}

export function formatAssistantDuration(ms: number) {
  if (!Number.isFinite(ms) || ms < 0) return "";
  if (ms < 100) return `${Math.round(ms)}ms`;
  if (ms < 10_000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 60_000) return `${Math.round(ms / 1000)}s`;
  const minutes = Math.floor(ms / 60_000);
  const seconds = Math.round((ms % 60_000) / 1000);
  return seconds ? `${minutes}m ${seconds}s` : `${minutes}m`;
}

const defaultTimeFormat = (date: Date) =>
  date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

/* -------------------------------------------------------------------------------------------------
 * Markdown-lite: a small, safe parser. Everything renders as React elements; nothing is injected
 * as HTML. Supports paragraphs, headings, emphasis, inline code, fenced code, lists (nested),
 * quotes, tables, links, and `{{kind:args}}` tokens.
 * -----------------------------------------------------------------------------------------------*/

type Inline =
  | { t: "text"; v: string }
  | { t: "br" }
  | { t: "code"; v: string }
  | { t: "strong" | "em" | "del"; c: Inline[] }
  | { t: "link"; href: string; c: Inline[] }
  | { t: "token"; token: AssistantToken };

type Align = "left" | "center" | "right" | null;

type Block =
  | { t: "p"; text: string }
  | { t: "h"; level: number; text: string }
  | { t: "code"; lang: string; code: string; open: boolean }
  | { t: "list"; ordered: boolean; start: number; items: Block[][] }
  | { t: "quote"; blocks: Block[] }
  | { t: "table"; align: Align[]; head: string[]; rows: string[][] }
  | { t: "hr" };

const FENCE = /^ {0,3}(`{3,}|~{3,})[ \t]*([^\s`]*)[^`]*$/;
const HEADING = /^ {0,3}(#{1,6})[ \t]+(.*?)(?:[ \t]+#+)?[ \t]*$/;
const QUOTE = /^ {0,3}>[ \t]?(.*)$/;
const HR = /^ {0,3}([-*_])(?:[ \t]*\1){2,}[ \t]*$/;
const LIST_ITEM = /^( *)([-*+]|\d{1,9}[.)])(?:[ \t]+(.*))?$/;
const TABLE_SEP = /^ {0,3}\|?[ \t]*:?-+:?[ \t]*(?:\|[ \t]*:?-+:?[ \t]*)*\|?[ \t]*$/;
const TOKEN_BODY = /^\s*([A-Za-z][\w-]*)\s*:([\s\S]*)$/;
const TONES = new Set(["positive", "negative", "neutral"]);

function splitRow(line: string) {
  let row = line.trim();
  if (row.startsWith("|")) row = row.slice(1);
  if (row.endsWith("|") && !row.endsWith("\\|")) row = row.slice(0, -1);
  const cells: string[] = [];
  let cell = "";
  let code = false;
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === "\\" && row[i + 1] === "|") {
      cell += "|";
      i++;
    } else if (ch === "`") {
      code = !code;
      cell += ch;
    } else if (ch === "|" && !code) {
      cells.push(cell.trim());
      cell = "";
    } else cell += ch;
  }
  cells.push(cell.trim());
  return cells;
}

function isTableStart(lines: string[], i: number) {
  return (
    lines[i].includes("|") &&
    i + 1 < lines.length &&
    TABLE_SEP.test(lines[i + 1]) &&
    lines[i + 1].includes("-") &&
    (lines[i + 1].includes("|") || lines[i].trim().startsWith("|"))
  );
}

function startsBlock(lines: string[], i: number) {
  const line = lines[i];
  return (
    FENCE.test(line) ||
    HEADING.test(line) ||
    QUOTE.test(line) ||
    HR.test(line) ||
    (LIST_ITEM.test(line) && LIST_ITEM.exec(line)![3] !== undefined) ||
    isTableStart(lines, i)
  );
}

const indentOf = (line: string) => line.length - line.trimStart().length;

function parseList(lines: string[], start: number) {
  const first = LIST_ITEM.exec(lines[start])!;
  const base = first[1].length;
  const ordered = /\d/.test(first[2]);
  const items: string[][] = [];
  let content = base + first[2].length + 1;
  let i = start;
  while (i < lines.length) {
    const line = lines[i];
    const match = LIST_ITEM.exec(line);
    if (match && match[1].length === base && /\d/.test(match[2]) === ordered) {
      items.push([match[3] ?? ""]);
      content = base + match[2].length + 1;
      i++;
      continue;
    }
    if (!line.trim()) {
      // A blank line continues the list only if more of it follows.
      let next = i + 1;
      while (next < lines.length && !lines[next].trim()) next++;
      if (next >= lines.length) break;
      const nextMatch = LIST_ITEM.exec(lines[next]);
      const continues =
        indentOf(lines[next]) > base ||
        (nextMatch && nextMatch[1].length === base && /\d/.test(nextMatch[2]) === ordered);
      if (!continues) break;
      items[items.length - 1].push("");
      i++;
      continue;
    }
    if (indentOf(line) > base) {
      items[items.length - 1].push(line.slice(Math.min(indentOf(line), content)));
      i++;
      continue;
    }
    // Lazy continuation of the item's paragraph.
    const previous = lines[i - 1];
    if (previous?.trim() && !startsBlock(lines, i)) {
      items[items.length - 1].push(line.trim());
      i++;
      continue;
    }
    break;
  }
  const block: Block = {
    t: "list",
    ordered,
    start: ordered ? Number.parseInt(first[2], 10) : 1,
    items: items.map((item) => parseBlocks(item.join("\n"))),
  };
  return { block, next: i };
}

/** Parse markdown-lite into blocks. Unclosed fences stay open so code can stream in. */
function parseBlocks(source: string): Block[] {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const fence = FENCE.exec(line);
    if (fence) {
      const marker = fence[1];
      const body: string[] = [];
      let closed = false;
      i++;
      while (i < lines.length) {
        const candidate = lines[i].trim();
        if (
          candidate.length >= marker.length &&
          candidate[0] === marker[0] &&
          new RegExp(`^\\${marker[0]}{${marker.length},}$`).test(candidate)
        ) {
          closed = true;
          i++;
          break;
        }
        body.push(lines[i]);
        i++;
      }
      blocks.push({ t: "code", lang: fence[2] ?? "", code: body.join("\n"), open: !closed });
      continue;
    }
    const heading = HEADING.exec(line);
    if (heading) {
      blocks.push({ t: "h", level: heading[1].length, text: heading[2] });
      i++;
      continue;
    }
    if (HR.test(line)) {
      blocks.push({ t: "hr" });
      i++;
      continue;
    }
    if (QUOTE.test(line)) {
      const body: string[] = [];
      while (i < lines.length && lines[i].trim() && QUOTE.test(lines[i])) {
        body.push(QUOTE.exec(lines[i])![1]);
        i++;
      }
      blocks.push({ t: "quote", blocks: parseBlocks(body.join("\n")) });
      continue;
    }
    if (LIST_ITEM.test(line) && LIST_ITEM.exec(line)![3] !== undefined) {
      const { block, next } = parseList(lines, i);
      blocks.push(block);
      i = next;
      continue;
    }
    if (isTableStart(lines, i)) {
      const head = splitRow(line);
      const align = splitRow(lines[i + 1]).map<Align>((cell) =>
        cell.startsWith(":") && cell.endsWith(":")
          ? "center"
          : cell.endsWith(":")
            ? "right"
            : cell.startsWith(":")
              ? "left"
              : null,
      );
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && lines[i].trim() && lines[i].includes("|")) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      blocks.push({ t: "table", align, head, rows });
      continue;
    }
    const body = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !startsBlock(lines, i)) {
      body.push(lines[i]);
      i++;
    }
    blocks.push({ t: "p", text: body.map((part) => part.trim()).join("\n") });
  }
  return blocks;
}

function directionOf(value: string | undefined): AssistantToken["direction"] {
  const sign = value?.trim()[0];
  if (sign === "+" || sign === "↑") return "up";
  if (sign === "-" || sign === "−" || sign === "↓") return "down";
  return "flat";
}

function makeToken(kind: string, body: string, raw: string): AssistantToken {
  const args = body.split("|").map((arg) => arg.trim());
  const [label = "", value, third] = args;
  const direction = directionOf(value);
  return {
    kind: kind.toLowerCase(),
    args,
    label,
    value,
    direction,
    tone:
      third && TONES.has(third)
        ? (third as AssistantTone)
        : direction === "up"
          ? "positive"
          : direction === "down"
            ? "negative"
            : "neutral",
    raw,
  };
}

function safeHref(href: string) {
  if (!href) return false;
  const scheme = /^([a-z][a-z\d+.-]*):/i.exec(href);
  return !scheme || /^(https?|mailto|tel)$/i.test(scheme[1]);
}

const ESCAPABLE = "\\`*_{}[]()#+-.!|~>";
const WORD = /[\p{L}\p{N}]/u;
const SPACE = /\s/;

function matchBracket(src: string, from: number) {
  let depth = 0;
  for (let i = from; i < src.length; i++) {
    const ch = src[i];
    if (ch === "\\") i++;
    else if (ch === "[") depth++;
    else if (ch === "]" && --depth === 0) return i;
  }
  return -1;
}

/** Index of a closing run for an emphasis opener of `size` characters, or -1. */
function findCloser(src: string, from: number, ch: string, size: number) {
  let i = from;
  while (i < src.length) {
    const c = src[i];
    if (c === "\\") {
      i += 2;
      continue;
    }
    if (c === "`") {
      let run = 1;
      while (src[i + run] === "`") run++;
      const end = src.indexOf("`".repeat(run), i + run);
      i = end === -1 ? i + run : end + run;
      continue;
    }
    if (c === ch) {
      let run = 1;
      while (src[i + run] === ch) run++;
      const before = src[i - 1] ?? " ";
      const after = src[i + run] ?? " ";
      const closes =
        i > from &&
        !SPACE.test(before) &&
        !(ch === "_" && WORD.test(after));
      if (closes) {
        if (run === size) return i;
        if (size === 1 && run === 3) return i + 2;
        if (size === 2 && run === 3) return i + 1;
        if (size === 3 && run > 3) return i;
      }
      i += run;
      continue;
    }
    i++;
  }
  return -1;
}

function wrapEmphasis(size: number, ch: string, children: Inline[]): Inline {
  if (ch === "~") return { t: "del", c: children };
  if (size === 1) return { t: "em", c: children };
  if (size === 2) return { t: "strong", c: children };
  return { t: "strong", c: [{ t: "em", c: children }] };
}

/**
 * Parse inline markdown. With `open`, the text is the streaming tail: unclosed emphasis and code
 * render optimistically and half-received tokens or links are held back, so nothing flickers.
 */
function parseInline(src: string, open = false): Inline[] {
  const out: Inline[] = [];
  let text = "";
  const flush = () => {
    if (text) out.push({ t: "text", v: text });
    text = "";
  };
  const push = (...nodes: Inline[]) => {
    flush();
    out.push(...nodes);
  };
  let i = 0;
  const n = src.length;
  while (i < n) {
    const ch = src[i];
    if (ch === "\\" && i + 1 < n && ESCAPABLE.includes(src[i + 1])) {
      text += src[i + 1];
      i += 2;
      continue;
    }
    if (ch === "\n") {
      push({ t: "br" });
      i++;
      continue;
    }
    if (ch === "`") {
      let run = 1;
      while (src[i + run] === "`") run++;
      const end = src.indexOf("`".repeat(run), i + run);
      if (end !== -1) {
        let value = src.slice(i + run, end);
        if (value.length > 2 && value.startsWith(" ") && value.endsWith(" ")) value = value.slice(1, -1);
        push({ t: "code", v: value });
        i = end + run;
        continue;
      }
      if (open) {
        const value = src.slice(i + run);
        if (value) push({ t: "code", v: value });
        i = n;
        continue;
      }
      text += "`".repeat(run);
      i += run;
      continue;
    }
    if (ch === "{" && src[i + 1] === "{") {
      const end = src.indexOf("}}", i + 2);
      if (end !== -1) {
        const match = TOKEN_BODY.exec(src.slice(i + 2, end));
        if (match) {
          push({ t: "token", token: makeToken(match[1], match[2], src.slice(i, end + 2)) });
          i = end + 2;
          continue;
        }
      } else if (open && /^\{\{[^{}]*$/.test(src.slice(i))) {
        i = n;
        continue;
      }
    }
    if (ch === "[") {
      const close = matchBracket(src, i);
      if (close !== -1 && src[close + 1] === "(") {
        const end = src.indexOf(")", close + 2);
        const label = src.slice(i + 1, close);
        if (end !== -1) {
          const href = src
            .slice(close + 2, end)
            .trim()
            .replace(/^<(.*)>$/, "$1")
            .split(/\s+/)[0];
          if (safeHref(href)) push({ t: "link", href, c: parseInline(label) });
          else push(...parseInline(label));
          i = end + 1;
          continue;
        }
        if (open) {
          push(...parseInline(label));
          i = n;
          continue;
        }
      }
    }
    if (ch === "*" || ch === "_" || ch === "~") {
      let run = 1;
      while (src[i + run] === ch) run++;
      if (ch === "~" && run !== 2) {
        text += ch.repeat(run);
        i += run;
        continue;
      }
      const before = src[i - 1] ?? " ";
      const after = src[i + run] ?? "";
      const canOpen = after !== "" && !SPACE.test(after) && !(ch === "_" && WORD.test(before));
      if (canOpen) {
        const size = ch === "~" ? 2 : Math.min(run, 3);
        const end = findCloser(src, i + size, ch, size);
        if (end !== -1) {
          push(wrapEmphasis(size, ch, parseInline(src.slice(i + size, end))));
          i = end + size;
          continue;
        }
        if (open) {
          const rest = src.slice(i + size);
          if (rest) push(wrapEmphasis(size, ch, parseInline(rest, true)));
          i = n;
          continue;
        }
      }
      text += ch.repeat(run);
      i += run;
      continue;
    }
    if (ch === "h" && (i === 0 || /[\s(["'<]/.test(src[i - 1]))) {
      const match = /^https?:\/\/[^\s<>"'`]+/.exec(src.slice(i, i + 2048));
      if (match) {
        const url = match[0].replace(/[.,:;!?)\]}*_~]+$/, "");
        push({ t: "link", href: url, c: [{ t: "text", v: url }] });
        i += url.length;
        continue;
      }
    }
    text += ch;
    i++;
  }
  flush();
  return out;
}

/** Plain text for copying: markdown kept, metric tokens read "Label value", citations "[1]". */
export function assistantToPlainText(content: string) {
  return content
    .replace(/\{\{\s*([A-Za-z][\w-]*)\s*:([^{}]*?)\}\}/g, (raw, kind: string, body: string) => {
      const token = makeToken(kind, body, raw);
      if (token.kind === "cite")
        return token.args
          .join(",")
          .split(",")
          .map((ref) => `[${ref.trim()}]`)
          .join("");
      return [token.label, token.value].filter(Boolean).join(" ");
    })
    .trim();
}

/* -------------------------------------------------------------------------------------------------
 * Code highlighting: a tiny tokenizer for the languages admin answers use most.
 * -----------------------------------------------------------------------------------------------*/

interface Grammar {
  pattern: RegExp;
  keywords: Set<string>;
  caseInsensitive?: boolean;
}

const words = (list: string) => new Set(list.split(" "));
const SQL: Grammar = {
  pattern:
    /(--[^\n]*|\/\*[\s\S]*?(?:\*\/|$))|('(?:[^']|'')*'?|"(?:[^"\\\n]|\\.)*"?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][\w$]*)/g,
  keywords: words(
    "select from where and or not in is null as join left right inner outer full cross on group by order having limit offset with union all distinct case when then else end insert into values update set delete create table index view drop alter asc desc between like ilike exists returning interval filter over partition count sum avg min max coalesce cast true false now date_trunc percentile_cont within extract",
  ),
  caseInsensitive: true,
};
const SCRIPT: Grammar = {
  pattern:
    /(\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$))|('(?:[^'\\\n]|\\.)*'?|"(?:[^"\\\n]|\\.)*"?|`(?:[^`\\]|\\.)*`?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)/g,
  keywords: words(
    "const let var function return if else for while do switch case break continue new class extends import export from default async await try catch finally throw typeof instanceof in of this null undefined true false yield interface type enum implements package func go defer struct map range nil",
  ),
};
const HASH: Grammar = {
  pattern:
    /(#[^\n]*)|('(?:[^'\\\n]|\\.)*'?|"(?:[^"\\\n]|\\.)*"?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][\w-]*)/g,
  keywords: words(
    "def return if elif else for while in import from as class with try except finally raise lambda None True False and or not is pass yield async await then fi do done case esac export echo function local",
  ),
};
const GRAMMARS: Record<string, Grammar> = {
  sql: SQL,
  postgres: SQL,
  postgresql: SQL,
  mysql: SQL,
  js: SCRIPT,
  jsx: SCRIPT,
  ts: SCRIPT,
  tsx: SCRIPT,
  javascript: SCRIPT,
  typescript: SCRIPT,
  json: SCRIPT,
  go: SCRIPT,
  py: HASH,
  python: HASH,
  sh: HASH,
  bash: HASH,
  shell: HASH,
  zsh: HASH,
  yaml: HASH,
  yml: HASH,
};

function highlightCode(code: string, lang: string): React.ReactNode[] {
  const grammar = GRAMMARS[lang.toLowerCase()];
  if (!grammar) return [code];
  const pattern = new RegExp(grammar.pattern.source, "g");
  const out: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(code))) {
    const [whole, comment, string, number, word] = match;
    if (!whole) {
      pattern.lastIndex++;
      continue;
    }
    if (match.index > last) out.push(code.slice(last, match.index));
    const className = comment
      ? "text-muted-foreground italic"
      : string
        ? "text-chart-2"
        : number
          ? "text-chart-1"
          : word && grammar.keywords.has(grammar.caseInsensitive ? word.toLowerCase() : word)
            ? "text-chart-4"
            : undefined;
    out.push(
      className ? (
        <span key={match.index} className={className}>
          {whole}
        </span>
      ) : (
        whole
      ),
    );
    last = match.index + whole.length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

/* -------------------------------------------------------------------------------------------------
 * Markdown rendering
 * -----------------------------------------------------------------------------------------------*/

const styles = `@keyframes assistant-caret{0%,40%{opacity:1}70%,100%{opacity:.18}}@keyframes assistant-shimmer{from{background-position:100% 0}to{background-position:-100% 0}}@keyframes assistant-check{from{stroke-dashoffset:22}to{stroke-dashoffset:0}}@keyframes assistant-pop{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.12);opacity:1}100%{transform:scale(1)}}`;

const shimmer =
  "bg-linear-to-r from-muted-foreground via-foreground to-muted-foreground bg-size-[200%_100%] bg-clip-text text-transparent motion-safe:animate-[assistant-shimmer_1.8s_linear_infinite] motion-reduce:bg-none motion-reduce:text-muted-foreground";

const caret = (
  <span
    aria-hidden="true"
    data-slot="assistant-caret"
    className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.2em] rounded-full bg-primary shadow-[0_0_6px_1px_color-mix(in_oklab,var(--color-primary)_65%,transparent),0_0_14px_2px_color-mix(in_oklab,var(--color-primary)_30%,transparent)] motion-safe:animate-[assistant-caret_1.1s_ease-in-out_infinite_alternate]"
  />
);

interface MarkdownContext {
  citations?: AssistantCitation[];
  activeCitation: string | null;
  setActiveCitation: (id: string | null) => void;
  renderToken?: (token: AssistantToken) => React.ReactNode | undefined;
  compact: boolean;
  labels: Pick<AssistantPanelLabels, "sources" | "copy" | "copied" | "copyCode">;
}

const toneClass: Record<AssistantTone, string> = {
  positive:
    "border-emerald-600/20 bg-emerald-500/[0.07] [--metric:var(--color-emerald-700)] dark:border-emerald-400/25 dark:[--metric:var(--color-emerald-400)]",
  negative:
    "border-destructive/20 bg-destructive/[0.06] [--metric:var(--color-destructive)] dark:border-destructive/30",
  neutral: "border-border bg-muted/60 [--metric:var(--color-muted-foreground)]",
};

function MetricChip({ token }: { token: AssistantToken }) {
  const Arrow =
    token.direction === "up" ? ArrowUpRight : token.direction === "down" ? ArrowDownRight : null;
  return (
    <span
      data-slot="assistant-metric"
      data-tone={token.tone}
      className={cn(
        "mx-px inline-flex -translate-y-px items-center gap-1 rounded-md border px-1.5 align-middle text-[0.86em] leading-[1.55] font-normal whitespace-nowrap",
        "transition-[opacity,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] starting:scale-95 starting:opacity-0 motion-reduce:transition-none",
        toneClass[token.tone],
      )}
    >
      {token.label && <span className="text-foreground/80">{token.label}</span>}
      {token.value && (
        <span className="inline-flex items-center gap-px font-semibold text-(--metric) tabular-nums">
          {Arrow && <Arrow className="size-3" aria-hidden="true" stroke={2.25} />}
          {token.value}
        </span>
      )}
    </span>
  );
}

function findCitation(citations: AssistantCitation[] | undefined, ref: string) {
  if (!citations?.length) return undefined;
  const index = /^\d+$/.test(ref)
    ? Number(ref) - 1
    : citations.findIndex((item) => item.id === ref);
  return index >= 0 && index < citations.length
    ? { citation: citations[index], number: index + 1 }
    : undefined;
}

function CitationMarker({ reference, context }: { reference: string; context: MarkdownContext }) {
  const found = findCitation(context.citations, reference);
  const number = found?.number ?? reference;
  const active = found && context.activeCitation === found.citation.id;
  const className = cn(
    "mx-px inline-flex h-[15px] min-w-[15px] -translate-y-[0.12em] items-center justify-center rounded-[4px] px-[3px] align-middle text-[10px] leading-none font-semibold tabular-nums no-underline transition-colors motion-reduce:transition-none",
    "starting:opacity-0",
    active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
  );
  const highlight = {
    onPointerEnter: () => found && context.setActiveCitation(found.citation.id),
    onPointerLeave: () => context.setActiveCitation(null),
    onFocus: () => found && context.setActiveCitation(found.citation.id),
    onBlur: () => context.setActiveCitation(null),
  };
  if (found?.citation.href)
    return (
      <a
        data-slot="assistant-citation-marker"
        href={found.citation.href}
        target="_blank"
        rel="noreferrer"
        aria-label={`${context.labels.sources} ${number}: ${found.citation.label}`}
        className={cn(className, "hover:bg-primary/15 hover:text-primary", focusRing)}
        {...highlight}
      >
        {number}
      </a>
    );
  return (
    <span
      data-slot="assistant-citation-marker"
      title={found?.citation.label}
      aria-label={found ? `${context.labels.sources} ${number}: ${found.citation.label}` : undefined}
      className={cn(className, found && "cursor-default hover:bg-primary/15 hover:text-primary")}
      {...highlight}
    >
      {number}
    </span>
  );
}

function renderToken(token: AssistantToken, context: MarkdownContext): React.ReactNode {
  const custom = context.renderToken?.(token);
  if (custom !== undefined) return custom;
  if (token.kind === "metric") return <MetricChip token={token} />;
  if (token.kind === "cite")
    return token.args
      .join(",")
      .split(",")
      .map((ref) => ref.trim())
      .filter(Boolean)
      .map((ref, index) => <CitationMarker key={index} reference={ref} context={context} />);
  return (
    <span data-slot="assistant-token" data-kind={token.kind} className="font-medium">
      {token.label}
    </span>
  );
}

function renderInlines(nodes: Inline[], context: MarkdownContext, key = "i"): React.ReactNode[] {
  return nodes.map((node, index) => {
    const k = `${key}.${index}`;
    switch (node.t) {
      case "text":
        return <React.Fragment key={k}>{node.v}</React.Fragment>;
      case "br":
        return <br key={k} />;
      case "code":
        return (
          <code
            key={k}
            className="rounded-[5px] border border-border/70 bg-muted/70 px-[0.3em] py-px font-mono text-[0.86em] break-words text-foreground"
          >
            {node.v}
          </code>
        );
      case "strong":
        return (
          <strong key={k} className="font-semibold text-foreground">
            {renderInlines(node.c, context, k)}
          </strong>
        );
      case "em":
        return (
          <em key={k} className="italic">
            {renderInlines(node.c, context, k)}
          </em>
        );
      case "del":
        return (
          <del key={k} className="text-muted-foreground">
            {renderInlines(node.c, context, k)}
          </del>
        );
      case "link": {
        const external = /^https?:/i.test(node.href);
        return (
          <a
            key={k}
            href={node.href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            className={cn(
              "font-medium text-primary underline decoration-primary/30 underline-offset-[3px] transition-colors hover:decoration-primary motion-reduce:transition-none",
              focusRing,
              "rounded-[2px]",
            )}
          >
            {renderInlines(node.c, context, k)}
          </a>
        );
      }
      case "token":
        return <React.Fragment key={k}>{renderToken(node.token, context)}</React.Fragment>;
    }
  });
}

function CodeBlock({
  block,
  tail,
  context,
}: {
  block: Extract<Block, { t: "code" }>;
  tail?: React.ReactNode;
  context: MarkdownContext;
}) {
  const [copied, copy] = useCopy();
  const highlighted = React.useMemo(
    () => highlightCode(block.code, block.lang),
    [block.code, block.lang],
  );
  return (
    <div
      data-slot="assistant-code"
      data-language={block.lang || undefined}
      className="overflow-hidden rounded-xl bg-muted/40 ring-1 ring-border/60 ring-inset"
    >
      <div className="flex h-8 items-center justify-between gap-2 border-b border-border/60 pr-1 pl-3">
        <span className="truncate font-mono text-[11px] text-muted-foreground">
          {block.lang || "text"}
        </span>
        <button
          type="button"
          onClick={() => copy(block.code)}
          disabled={!block.code}
          aria-label={copied ? context.labels.copied : context.labels.copyCode}
          className={cn(
            "inline-flex h-6 items-center gap-1 rounded-md px-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40 motion-reduce:transition-none",
            focusRing,
          )}
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
          ) : (
            <Copy className="size-3.5" aria-hidden="true" />
          )}
          {copied ? context.labels.copied : context.labels.copy}
        </button>
      </div>
      <pre
        className={cn(
          "overflow-x-auto px-3 py-2.5 font-mono leading-5 text-foreground/90 [font-variant-ligatures:none] [tab-size:2]",
          context.compact ? "text-[11.5px]" : "text-[12.5px]",
        )}
      >
        <code>
          {highlighted}
          {tail}
        </code>
      </pre>
    </div>
  );
}

function renderBlocks(
  blocks: Block[],
  context: MarkdownContext,
  options: { streaming: boolean; tail?: React.ReactNode; tight?: boolean },
  key = "b",
): React.ReactNode[] {
  return blocks.map((block, index) => {
    const last = index === blocks.length - 1;
    const tail = last ? options.tail : undefined;
    const open = options.streaming && last;
    const k = `${key}.${index}`;
    switch (block.t) {
      case "p": {
        const content = (
          <>
            {renderInlines(parseInline(block.text, open), context, k)}
            {tail}
          </>
        );
        return options.tight && blocks.length === 1 ? (
          <React.Fragment key={k}>{content}</React.Fragment>
        ) : (
          <p key={k} className="break-words">
            {content}
          </p>
        );
      }
      case "h": {
        const Tag = (block.level <= 2 ? "h3" : "h4") as "h3" | "h4";
        return (
          <Tag
            key={k}
            className={cn(
              "font-semibold tracking-tight text-foreground",
              block.level <= 2 ? "pt-1 text-[1.07em]" : "text-[1em]",
            )}
          >
            {renderInlines(parseInline(block.text, open), context, k)}
            {tail}
          </Tag>
        );
      }
      case "code":
        return <CodeBlock key={k} block={block} tail={tail} context={context} />;
      case "hr":
        return <hr key={k} className="border-border" />;
      case "quote":
        return (
          <blockquote
            key={k}
            className="space-y-2 border-l-2 border-border pl-3 text-muted-foreground"
          >
            {renderBlocks(block.blocks, context, { streaming: open, tail }, k)}
          </blockquote>
        );
      case "list": {
        const Tag = block.ordered ? "ol" : "ul";
        return (
          <Tag
            key={k}
            start={block.ordered && block.start !== 1 ? block.start : undefined}
            className={cn(
              "space-y-1 pl-[1.35em]",
              block.ordered
                ? "list-decimal marker:text-muted-foreground marker:tabular-nums"
                : "list-disc marker:text-muted-foreground/60",
            )}
          >
            {block.items.map((item, itemIndex) => {
              const lastItem = itemIndex === block.items.length - 1;
              return (
                <li key={itemIndex} className="pl-1 [&>ol]:mt-1 [&>p+*]:mt-1.5 [&>ul]:mt-1">
                  {renderBlocks(
                    item,
                    context,
                    {
                      streaming: open && lastItem,
                      tail: lastItem ? tail : undefined,
                      tight: true,
                    },
                    `${k}.${itemIndex}`,
                  )}
                </li>
              );
            })}
          </Tag>
        );
      }
      case "table":
        return (
          <div key={k} className="overflow-x-auto rounded-xl ring-1 ring-border/60 ring-inset">
            <table className="w-full border-collapse text-[0.93em] tabular-nums">
              <thead className="bg-muted/40">
                <tr>
                  {block.head.map((cell, cellIndex) => (
                    <th
                      key={cellIndex}
                      scope="col"
                      style={{ textAlign: block.align[cellIndex] ?? undefined }}
                      className="px-3 py-1.5 text-left font-medium whitespace-nowrap text-muted-foreground"
                    >
                      {renderInlines(parseInline(cell), context, `${k}.h${cellIndex}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-t border-border/60">
                    {block.head.map((_, cellIndex) => (
                      <td
                        key={cellIndex}
                        style={{ textAlign: block.align[cellIndex] ?? undefined }}
                        className="px-3 py-1.5 align-top"
                      >
                        {renderInlines(
                          parseInline(row[cellIndex] ?? ""),
                          context,
                          `${k}.${rowIndex}.${cellIndex}`,
                        )}
                        {rowIndex === block.rows.length - 1 &&
                          cellIndex === block.head.length - 1 &&
                          tail}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
    }
  });
}

export interface AssistantMarkdownProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Markdown-lite with `{{metric:Label|Value|tone}}` and `{{cite:n}}` tokens. */
  content: string;
  citations?: AssistantCitation[];
  /** Shows a caret and renders the unfinished tail optimistically. */
  streaming?: boolean;
  density?: AssistantDensity;
  renderToken?: (token: AssistantToken) => React.ReactNode | undefined;
  /** Citation highlighted from outside, e.g. while hovering a source. */
  activeCitation?: string | null;
  onActiveCitationChange?: (id: string | null) => void;
  labels?: Partial<AssistantPanelLabels>;
}

/** Renders assistant markdown-lite safely as React elements. Used by AssistantPanel; usable alone. */
export function AssistantMarkdown({
  content,
  citations,
  streaming = false,
  density = "comfortable",
  renderToken,
  activeCitation: activeProp,
  onActiveCitationChange,
  labels: labelsProp,
  className,
  ...props
}: AssistantMarkdownProps) {
  const [activeState, setActiveState] = React.useState<string | null>(null);
  const activeCitation = activeProp !== undefined ? activeProp : activeState;
  const labels = { ...LABELS, ...labelsProp };
  const blocks = React.useMemo(() => parseBlocks(content), [content]);
  const compact = density === "compact";
  const context: MarkdownContext = {
    citations,
    activeCitation,
    setActiveCitation: (id) => {
      if (activeProp === undefined) setActiveState(id);
      onActiveCitationChange?.(id);
    },
    renderToken,
    compact,
    labels,
  };
  const tail = streaming ? caret : undefined;
  return (
    <div
      data-slot="assistant-markdown"
      className={cn(
        "min-w-0 text-pretty text-foreground/90",
        compact ? "space-y-2.5 text-[13px] leading-[1.65]" : "space-y-3 text-sm leading-6",
        className,
      )}
      {...props}
    >
      {blocks.length ? renderBlocks(blocks, context, { streaming, tail }) : streaming ? <p>{caret}</p> : null}
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Steps
 * -----------------------------------------------------------------------------------------------*/

const stepIcon: Record<AssistantStepKind, typeof Search> = {
  search: Search,
  query: Database,
  tool: Tool,
  think: Bulb,
};

function StepRow({
  step,
  compact,
  formatDuration,
}: {
  step: AssistantStep;
  compact: boolean;
  formatDuration: (ms: number) => string;
}) {
  const [open, setOpen] = React.useState(step.status === "error");
  const detailId = React.useId();
  const Icon = stepIcon[step.kind ?? "tool"] ?? Tool;
  const duration =
    step.status !== "running" && step.duration !== undefined ? formatDuration(step.duration) : null;
  const expandable = Boolean(step.detail);
  const label = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "relative z-10 flex size-5 shrink-0 items-center justify-center rounded-full border bg-card transition-colors duration-300 motion-reduce:transition-none",
          step.status === "error" && "border-destructive/35 bg-destructive/[0.06] text-destructive",
          step.status === "running" && "border-transparent text-primary",
          step.status === "done" &&
            "border-emerald-600/25 bg-emerald-500/[0.08] text-emerald-700 dark:border-emerald-400/30 dark:text-emerald-400",
        )}
      >
        {step.status === "running" ? (
          <>
            {/* The kind icon, ringed by a turning arc. */}
            <span className="absolute inset-0 rounded-full border border-primary/20" />
            <span className="absolute inset-0 rounded-full border border-transparent border-t-primary motion-safe:animate-spin" />
            <Icon className="size-3" stroke={2} />
          </>
        ) : step.status === "error" ? (
          <X className="size-3 motion-safe:animate-[assistant-pop_400ms_cubic-bezier(0.22,1,0.36,1)]" stroke={2.5} />
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="size-3 motion-safe:animate-[assistant-pop_400ms_cubic-bezier(0.22,1,0.36,1)]"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              strokeDasharray={22}
              className="motion-safe:animate-[assistant-check_420ms_cubic-bezier(0.22,1,0.36,1)_80ms_backwards]"
            />
          </svg>
        )}
      </span>
      <span className="flex min-w-0 flex-1 items-baseline gap-1.5">
        <span
          className={cn(
            "min-w-0 truncate",
            step.status === "running"
              ? shimmer
              : step.status === "error"
                ? "text-destructive"
                : "text-foreground/80",
          )}
        >
          {step.label}
        </span>
        {duration && (
          <span className="shrink-0 text-muted-foreground tabular-nums">· {duration}</span>
        )}
        <span className="sr-only">
          {step.status === "running" ? "in progress" : step.status === "error" ? "failed" : "done"}
        </span>
      </span>
      {expandable && (
        <ChevronRight
          aria-hidden="true"
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground opacity-0 transition-[opacity,rotate] duration-200 group-hover/step:opacity-100 group-focus-visible/step:opacity-100 motion-reduce:transition-none",
            open && "rotate-90 opacity-100",
          )}
        />
      )}
    </>
  );
  const row = cn(
    "group/step flex w-full items-center gap-2.5 rounded-md text-left",
    compact ? "min-h-6 py-0.5 text-xs" : "min-h-7 py-1 text-[13px]",
  );
  return (
    <li
      data-slot="assistant-step"
      data-status={step.status}
      data-kind={step.kind ?? "tool"}
      className="relative transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] starting:-translate-y-0.5 starting:opacity-0 motion-reduce:transition-none"
    >
      {expandable ? (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={detailId}
          onClick={() => setOpen((value) => !value)}
          className={cn(row, "-mx-1 w-[calc(100%+0.5rem)] px-1 hover:bg-muted/60", focusRing)}
        >
          {label}
        </button>
      ) : (
        <div className={row}>{label}</div>
      )}
      {expandable && (
        <div
          id={detailId}
          className={cn(
            "grid transition-[grid-template-rows] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <pre
              className={cn(
                "mt-1 mb-1.5 ml-[30px] max-h-48 overflow-auto rounded-xl bg-muted/40 px-3 py-2 font-mono leading-[1.6] break-words whitespace-pre-wrap ring-1 ring-border/60 ring-inset",
                compact ? "text-[11px]" : "text-[11.5px]",
                step.status === "error" ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {step.detail}
            </pre>
          </div>
        </div>
      )}
    </li>
  );
}

function StepList({
  message,
  compact,
  labels,
  formatDuration,
  renderStep,
}: {
  message: AssistantMessage;
  compact: boolean;
  labels: AssistantPanelLabels;
  formatDuration: (ms: number) => string;
  renderStep?: AssistantPanelProps["renderStep"];
}) {
  const steps = message.steps ?? [];
  const listId = React.useId();
  const [userOpen, setUserOpen] = React.useState<boolean | null>(null);
  const running = steps.find((step) => step.status === "running");
  const failed = steps.filter((step) => step.status === "error").length;
  const streaming = message.status === "streaming";
  const autoOpen = Boolean(running) || (streaming && !message.content) || failed > 0;
  const open = userOpen ?? autoOpen;
  const total = steps.reduce((sum, step) => sum + (step.duration ?? 0), 0);
  const summary = running
    ? running.label
    : failed
      ? labels.stepsFailed(failed, steps.length)
      : labels.steps(steps.length, total > 0 ? formatDuration(total) : null);

  return (
    <div data-slot="assistant-steps" data-open={open || undefined}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setUserOpen(!open)}
        className={cn(
          "group/summary -mx-1 inline-flex max-w-full items-center gap-1.5 rounded-md px-1 text-muted-foreground transition-colors hover:text-foreground motion-reduce:transition-none",
          compact ? "h-6 text-xs" : "h-7 text-[13px]",
          focusRing,
        )}
      >
        {running ? (
          <Loader aria-hidden="true" className="size-3.5 shrink-0 text-primary motion-safe:animate-spin" stroke={2.25} />
        ) : failed ? (
          <AlertTriangle aria-hidden="true" className="size-3.5 shrink-0 text-destructive" />
        ) : (
          <Check aria-hidden="true" className="size-3.5 shrink-0" stroke={2.25} />
        )}
        <span className={cn("truncate", running && shimmer)}>{summary}</span>
        <ChevronRight
          aria-hidden="true"
          className={cn(
            "size-3.5 shrink-0 transition-transform duration-200 motion-reduce:transition-none",
            open && "rotate-90",
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <ol
            id={listId}
            aria-label={labels.activity}
            className="relative mt-1 mb-0.5 before:absolute before:top-3 before:bottom-3 before:left-[9.5px] before:w-px before:bg-border"
          >
            {steps.map((step) => {
              const custom = renderStep?.(step, message);
              return custom !== undefined ? (
                <li key={step.id} data-slot="assistant-step" data-status={step.status}>
                  {custom}
                </li>
              ) : (
                <StepRow key={step.id} step={step} compact={compact} formatDuration={formatDuration} />
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Messages
 * -----------------------------------------------------------------------------------------------*/

function IconButton({
  label,
  pressed,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & { label: string; pressed?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none",
        focusRing,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface AssistantMessageViewProps {
  message: AssistantMessage;
  isLast: boolean;
  compact: boolean;
  labels: AssistantPanelLabels;
  feedback: AssistantFeedback | undefined;
  onFeedback?: (value: AssistantFeedback) => void;
  onRegenerate?: () => void;
  onCopy?: (text: string, message: AssistantMessage) => void;
  renderStep?: AssistantPanelProps["renderStep"];
  renderToken?: AssistantPanelProps["renderToken"];
  formatDuration: (ms: number) => string;
  formatTime: (date: Date) => string;
}

function AssistantAnswer({
  message,
  isLast,
  compact,
  labels,
  feedback,
  onFeedback,
  onRegenerate,
  onCopy,
  renderStep,
  renderToken,
  formatDuration,
  formatTime,
}: AssistantMessageViewProps) {
  const status = message.status ?? "done";
  const streaming = status === "streaming";
  const mounted = useMounted();
  const [copied, copy] = useCopy();
  const [activeCitation, setActiveCitation] = React.useState<string | null>(null);
  const steps = message.steps ?? [];
  const running = steps.some((step) => step.status === "running");
  const citations = message.citations ?? [];
  const date = message.createdAt ? new Date(message.createdAt) : null;
  const time = mounted && date && !Number.isNaN(date.getTime()) ? formatTime(date) : null;

  return (
    <>
      {steps.length > 0 && (
        <StepList
          message={message}
          compact={compact}
          labels={labels}
          formatDuration={formatDuration}
          renderStep={renderStep}
        />
      )}

      {streaming && !message.content && !running && (
        <div className={cn("flex items-center gap-2", compact ? "text-xs" : "text-[13px]")}>
          <Sparkles aria-hidden="true" className="size-3.5 text-primary motion-safe:animate-pulse" />
          <span className={shimmer}>{labels.thinking}</span>
        </div>
      )}

      {message.content && (
        <AssistantMarkdown
          content={message.content}
          citations={citations}
          streaming={streaming}
          density={compact ? "compact" : "comfortable"}
          renderToken={renderToken ? (token) => renderToken(token, message) : undefined}
          activeCitation={activeCitation}
          onActiveCitationChange={setActiveCitation}
          labels={labels}
        />
      )}

      {status === "error" && (
        <div
          data-slot="assistant-error"
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-destructive/25 bg-destructive/[0.05] px-3 py-2.5"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
          <div className="min-w-0 flex-1 text-[13px] leading-5">
            <p className="font-medium text-foreground">{labels.error}</p>
            {onRegenerate && (
              <button
                type="button"
                onClick={onRegenerate}
                className={cn(
                  "mt-2 inline-flex h-7 items-center gap-1.5 rounded-md border bg-card px-2.5 text-xs font-medium shadow-xs transition-colors hover:bg-muted motion-reduce:transition-none",
                  focusRing,
                )}
              >
                <Refresh className="size-3.5" aria-hidden="true" />
                {labels.retry}
              </button>
            )}
          </div>
        </div>
      )}

      {!streaming && citations.length > 0 && (
        <div
          data-slot="assistant-sources"
          className="flex flex-wrap items-center gap-1.5 transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] starting:translate-y-1 starting:opacity-0 motion-reduce:transition-none"
        >
          <span className="mr-0.5 text-xs text-muted-foreground">{labels.sources}</span>
          {citations.map((item, index) => {
            const active = activeCitation === item.id;
            const content = (
              <>
                <span
                  className={cn(
                    "flex h-4 min-w-4 items-center justify-center rounded-[4px] px-1 text-[10px] leading-none font-semibold tabular-nums transition-colors",
                    active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                  )}
                >
                  {index + 1}
                </span>
                <span className="min-w-0 truncate">{item.label}</span>
                {item.href && (
                  <ArrowUpRight className="size-3 shrink-0 text-muted-foreground" aria-hidden="true" />
                )}
              </>
            );
            const chip = cn(
              "inline-flex h-6 max-w-full min-w-0 items-center gap-1.5 rounded-md border bg-card pr-2 pl-1 text-xs text-foreground/85 transition-colors motion-reduce:transition-none",
              active && "border-primary/35 bg-primary/[0.05]",
            );
            const hover = {
              onPointerEnter: () => setActiveCitation(item.id),
              onPointerLeave: () => setActiveCitation(null),
            };
            return item.href ? (
              <a
                key={item.id}
                data-slot="assistant-source"
                data-active={active || undefined}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={cn(chip, "hover:bg-muted", focusRing)}
                onFocus={() => setActiveCitation(item.id)}
                onBlur={() => setActiveCitation(null)}
                {...hover}
              >
                {content}
              </a>
            ) : (
              <span
                key={item.id}
                data-slot="assistant-source"
                data-active={active || undefined}
                className={chip}
                {...hover}
              >
                {content}
              </span>
            );
          })}
        </div>
      )}

      {!streaming && (message.content || status === "error") && (
        <div
          data-slot="assistant-message-actions"
          className={cn(
            "-mt-1 -ml-1.5 flex h-7 items-center gap-0.5 transition-opacity duration-150 motion-reduce:transition-none",
            !isLast &&
              "opacity-0 group-focus-within/message:opacity-100 group-hover/message:opacity-100 [@media(hover:none)]:opacity-100",
          )}
        >
          {message.content && (
            <IconButton
              label={copied ? labels.copied : labels.copy}
              onClick={() =>
                copy(
                  assistantToPlainText(message.content),
                  onCopy ? (text) => onCopy(text, message) : undefined,
                )
              }
            >
              {copied ? (
                <Check className="size-3.5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
              ) : (
                <Copy className="size-3.5" aria-hidden="true" />
              )}
            </IconButton>
          )}
          {onRegenerate && isLast && status !== "error" && (
            <IconButton label={labels.regenerate} onClick={onRegenerate}>
              <Refresh className="size-3.5" aria-hidden="true" />
            </IconButton>
          )}
          {onFeedback && status === "done" && (
            <div role="group" aria-label={labels.feedback} className="flex items-center gap-0.5">
              <IconButton
                label={labels.helpful}
                pressed={feedback === "up"}
                onClick={() => onFeedback("up")}
                className={cn(feedback === "up" && "text-primary hover:text-primary")}
              >
                {feedback === "up" ? (
                  <ThumbUpFilled className="size-3.5" aria-hidden="true" />
                ) : (
                  <ThumbUp className="size-3.5" aria-hidden="true" />
                )}
              </IconButton>
              <IconButton
                label={labels.notHelpful}
                pressed={feedback === "down"}
                onClick={() => onFeedback("down")}
                className={cn(feedback === "down" && "text-foreground")}
              >
                {feedback === "down" ? (
                  <ThumbDownFilled className="size-3.5" aria-hidden="true" />
                ) : (
                  <ThumbDown className="size-3.5" aria-hidden="true" />
                )}
              </IconButton>
            </div>
          )}
          {time && (
            <time
              dateTime={date!.toISOString()}
              className="ml-1.5 text-[11px] text-muted-foreground tabular-nums"
            >
              {time}
            </time>
          )}
        </div>
      )}
    </>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Composer pieces
 * -----------------------------------------------------------------------------------------------*/

function normalizeModel(model: AssistantModel) {
  return typeof model === "string"
    ? { value: model, label: model, disabled: false }
    : { value: model.value, label: model.label ?? model.value, disabled: model.disabled ?? false };
}

function ModelPicker({
  models,
  value,
  onChange,
  label,
  disabled,
}: {
  models: AssistantModel[];
  value: string | undefined;
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
}) {
  const options = models.map(normalizeModel);
  const current = options.find((option) => option.value === value) ?? options[0];
  return (
    <span
      data-slot="assistant-model"
      className={cn(
        "relative inline-flex h-7 min-w-0 items-center rounded-md text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground motion-reduce:transition-none",
        "has-[select:focus-visible]:ring-2 has-[select:focus-visible]:ring-ring/50",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <span aria-hidden="true" className="truncate pr-6 pl-2">
        {current?.label}
      </span>
      <Selector aria-hidden="true" className="pointer-events-none absolute right-1.5 size-3.5 opacity-70" />
      <select
        aria-label={label}
        value={current?.value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="absolute inset-0 cursor-pointer appearance-none opacity-0 outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    </span>
  );
}

/* -------------------------------------------------------------------------------------------------
 * AssistantPanel
 * -----------------------------------------------------------------------------------------------*/

/**
 * An AI copilot conversation for admin apps: tool activity, streamed markdown with metric chips
 * and citations, feedback, and a composer with a model picker. Fills its parent's height.
 */
export function AssistantPanel({
  messages,
  status = "idle",
  onSend,
  onStop,
  onRegenerate,
  onFeedback,
  feedback: feedbackProp,
  onNewChat,
  onCopy,
  suggestions,
  models,
  model: modelProp,
  defaultModel,
  onModelChange,
  title,
  placeholder,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  composerActions,
  headerActions,
  footer,
  emptyState,
  density = "comfortable",
  disabled = false,
  autoFocus = false,
  maxComposerHeight = 200,
  composerRef,
  renderMessage,
  renderStep,
  renderToken,
  formatDuration = formatAssistantDuration,
  formatTime = defaultTimeFormat,
  labels: labelsProp,
  className,
  ...props
}: AssistantPanelProps) {
  const labels = { ...LABELS, ...labelsProp };
  const compact = density === "compact";
  const reduced = useReducedMotion();
  const busy = status === "streaming";
  const id = React.useId();

  // Draft
  const [draftState, setDraftState] = React.useState(defaultValue);
  const draft = valueProp ?? draftState;
  const setDraft = (next: string) => {
    if (valueProp === undefined) setDraftState(next);
    onValueChange?.(next);
  };

  // Model
  const firstModel = models?.length ? normalizeModel(models[0]).value : undefined;
  const [modelState, setModelState] = React.useState(defaultModel ?? firstModel);
  const model = modelProp ?? modelState ?? firstModel;
  const setModel = (next: string) => {
    if (modelProp === undefined) setModelState(next);
    onModelChange?.(next);
  };

  // Feedback
  const [feedbackState, setFeedbackState] = React.useState<Record<string, AssistantFeedback>>({});
  const feedback = feedbackProp ?? feedbackState;
  const giveFeedback = (messageId: string, value: AssistantFeedback) => {
    if (feedbackProp === undefined) setFeedbackState((current) => ({ ...current, [messageId]: value }));
    onFeedback?.(messageId, value);
  };

  // Textarea
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const setTextareaRef = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      textareaRef.current = node;
      if (typeof composerRef === "function") composerRef(node);
      else if (composerRef) (composerRef as React.RefObject<HTMLTextAreaElement | null>).current = node;
    },
    [composerRef],
  );
  useIsoLayoutEffect(() => {
    const element = textareaRef.current;
    if (!element) return;
    element.style.height = "auto";
    const height = Math.min(element.scrollHeight, maxComposerHeight);
    element.style.height = `${height}px`;
    element.style.overflowY = element.scrollHeight > maxComposerHeight ? "auto" : "hidden";
  }, [draft, maxComposerHeight, density]);

  // Scrolling: follow the newest content only while the reader is at the bottom.
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const stick = React.useRef(true);
  const lastTop = React.useRef(0);
  const jumping = React.useRef(false);
  const [away, setAway] = React.useState(false);

  const pin = React.useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    element.scrollTop = element.scrollHeight;
    lastTop.current = element.scrollTop;
  }, []);

  React.useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const observer = new ResizeObserver(() => {
      if (stick.current) pin();
      else {
        const element = scrollRef.current;
        if (element) setAway(element.scrollHeight - element.scrollTop - element.clientHeight > 32);
      }
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, [pin]);

  // A new question from the reader always brings the conversation back to the bottom.
  const lastMessage = messages[messages.length - 1];
  const lastId = lastMessage?.id;
  const lastRole = lastMessage?.role;
  useIsoLayoutEffect(() => {
    if (lastRole === "user") {
      stick.current = true;
      setAway(false);
    }
    if (stick.current) pin();
  }, [lastId, lastRole, pin]);

  const handleScroll = () => {
    const element = scrollRef.current;
    if (!element) return;
    const top = element.scrollTop;
    const distance = element.scrollHeight - top - element.clientHeight;
    if (jumping.current) {
      if (distance < 4) jumping.current = false;
      lastTop.current = top;
      return;
    }
    if (top < lastTop.current - 2) stick.current = false;
    if (distance < 24) stick.current = true;
    lastTop.current = top;
    setAway(!stick.current && distance > 32);
  };

  const jumpToLatest = () => {
    const element = scrollRef.current;
    if (!element) return;
    stick.current = true;
    jumping.current = !reduced;
    setAway(false);
    element.scrollTo({ top: element.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  };

  const send = (text: string) => {
    const value = text.trim();
    if (!value || busy || disabled) return;
    onSend?.(value, { model });
    if (text === draft) setDraft("");
    stick.current = true;
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const composing = React.useRef(false);
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    // Ignore Enter that confirms an IME composition (keyCode 229 covers Safari's late events).
    if (event.nativeEvent.isComposing || composing.current || event.keyCode === 229) return;
    event.preventDefault();
    send(draft);
  };

  const lastAssistantId = [...messages].reverse().find((message) => message.role === "assistant")?.id;
  const lastUserId = [...messages].reverse().find((message) => message.role === "user")?.id;
  const latest = messages[messages.length - 1];
  const working =
    busy && latest?.role === "assistant"
      ? latest.content
        ? labels.writing
        : labels.thinking
      : busy
        ? labels.thinking
        : null;
  const canSend = draft.trim().length > 0 && !busy && !disabled;
  const toolbar = Boolean(composerActions) || Boolean(models?.length);
  const submit = busy ? (
    <button
      type="button"
      onClick={() => {
        onStop?.();
        textareaRef.current?.focus();
      }}
      disabled={!onStop}
      aria-label={labels.stop}
      title={labels.stop}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-xl bg-foreground text-background shadow-xs transition-opacity duration-150 hover:opacity-85 disabled:opacity-40 motion-reduce:transition-none",
        focusRing,
      )}
    >
      <Stop className="size-3.5" aria-hidden="true" />
    </button>
  ) : (
    <button
      type="submit"
      disabled={!canSend}
      aria-label={labels.send}
      title={labels.send}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_4px_14px_-4px_color-mix(in_oklab,var(--color-primary)_70%,transparent)] transition-[background-color,color,opacity,scale,box-shadow] duration-150 hover:opacity-90 active:scale-95 disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none motion-reduce:transition-none",
        focusRing,
      )}
    >
      <ArrowUp className="size-4" aria-hidden="true" stroke={2.25} />
    </button>
  );
  const modelBadge = !models?.length && modelProp ? modelProp : null;

  return (
    <div
      data-slot="assistant-panel"
      data-density={density}
      data-status={status}
      aria-busy={busy || undefined}
      className={cn(
        "@container/assistant relative isolate flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]",
        className,
      )}
      {...props}
    >
      <style href="overtrue-assistant-panel" precedence="default">
        {styles}
      </style>
      {/* Soft light from above; it brightens while the assistant works. */}
      <span
        aria-hidden="true"
        data-slot="assistant-light"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 -z-10 h-44 bg-[radial-gradient(120%_70%_at_50%_-10%,color-mix(in_oklab,var(--color-primary)_10%,transparent),transparent_65%)] transition-opacity duration-700 motion-reduce:transition-none",
          busy ? "opacity-100" : "opacity-70",
        )}
      />

      <div
        data-slot="assistant-header"
        className={cn(
          "flex shrink-0 items-center gap-2 border-b border-border/60",
          compact ? "h-11 pr-2 pl-3" : "h-12 pr-2.5 pl-4",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "flex shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-card text-primary shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary)_6%,transparent),0_2px_10px_-2px_color-mix(in_oklab,var(--color-primary)_35%,transparent)]",
            compact ? "size-6" : "size-7",
          )}
        >
          <Sparkles className={cn(compact ? "size-3.5" : "size-4", busy && "motion-safe:animate-pulse")} stroke={1.75} />
        </span>
        <div className="flex min-w-0 flex-1 items-baseline gap-2">
          <h2
            id={`${id}-title`}
            className="truncate text-sm leading-5 font-semibold tracking-tight"
          >
            {title ?? labels.title}
          </h2>
          {modelBadge && (
            <span className="hidden shrink-0 rounded-md border px-1.5 font-mono text-[11px] leading-[18px] text-muted-foreground @[18rem]/assistant:inline">
              {modelBadge}
            </span>
          )}
          {working && (
            <span
              className={cn("hidden shrink-0 text-xs @[20rem]/assistant:inline", shimmer)}
              aria-hidden="true"
            >
              {working}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          {onNewChat && (
            <button
              type="button"
              onClick={() => {
                onNewChat();
                requestAnimationFrame(() => textareaRef.current?.focus());
              }}
              disabled={messages.length === 0 && !draft}
              aria-label={labels.newChat}
              title={labels.newChat}
              className={cn(
                "inline-flex h-7 items-center gap-1.5 rounded-md px-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none @[26rem]/assistant:px-2",
                focusRing,
              )}
            >
              <NewChat className="size-4" aria-hidden="true" stroke={1.75} />
              <span className="hidden @[26rem]/assistant:inline">{labels.newChat}</span>
            </button>
          )}
          {headerActions}
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col">
        <div
          ref={scrollRef}
          role="log"
          aria-live="polite"
          aria-label={labels.conversation}
          onScroll={handleScroll}
          onWheel={(event) => {
            if (event.deltaY < 0) stick.current = false;
          }}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
        >
          <div
            ref={contentRef}
            className={cn(
              "flex min-h-full flex-col",
              compact ? "gap-5 px-3 pt-4 pb-5" : "gap-7 px-4 pt-5 pb-6 @lg/assistant:px-5",
            )}
          >
            {messages.length === 0
              ? (emptyState ?? (
                  <div
                    data-slot="assistant-empty"
                    className="m-auto flex w-full max-w-sm flex-col items-center py-4 text-center"
                  >
                    <span
                      aria-hidden="true"
                      className="flex size-11 items-center justify-center rounded-2xl border border-primary/20 bg-card text-primary shadow-[0_0_0_5px_color-mix(in_oklab,var(--color-primary)_5%,transparent),0_8px_24px_-8px_color-mix(in_oklab,var(--color-primary)_45%,transparent)]"
                    >
                      <Sparkles className="size-5" stroke={1.6} />
                    </span>
                    <p className="mt-3.5 text-[15px] font-semibold tracking-tight text-foreground">
                      {labels.emptyTitle}
                    </p>
                    <p className="mt-1 max-w-72 text-[13px] leading-5 text-pretty text-muted-foreground">
                      {labels.emptyDescription}
                    </p>
                    {suggestions && suggestions.length > 0 && (
                      <ul
                        data-slot="assistant-suggestions"
                        className="mt-5 flex w-full flex-col gap-1.5"
                      >
                        {suggestions.map((suggestion, index) => {
                          const item =
                            typeof suggestion === "string"
                              ? { label: suggestion, prompt: suggestion, icon: undefined }
                              : suggestion;
                          return (
                            <li
                              key={index}
                              className="transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] starting:translate-y-1 starting:opacity-0 motion-reduce:transition-none"
                              style={{ transitionDelay: `${index * 50}ms` }}
                            >
                              <button
                                type="button"
                                disabled={busy || disabled}
                                onClick={() => send(item.prompt ?? item.label)}
                                className={cn(
                                  "group/suggestion flex w-full items-center gap-2.5 rounded-xl border border-border/70 bg-card/80 px-3 py-2 text-left text-[13px] leading-5 text-foreground/85 shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-[border-color,background-color,color,box-shadow] duration-150 hover:border-primary/25 hover:bg-card hover:text-foreground hover:shadow-[0_6px_18px_-10px_color-mix(in_oklab,var(--color-primary)_55%,transparent)] disabled:opacity-50 motion-reduce:transition-none",
                                  focusRing,
                                )}
                              >
                                <span aria-hidden="true" className="shrink-0 text-muted-foreground transition-colors duration-150 group-hover/suggestion:text-primary [&_svg]:size-4">
                                  {item.icon ?? <Sparkles className="size-4" stroke={1.75} />}
                                </span>
                                <span className="min-w-0 flex-1">{item.label}</span>
                                <ArrowUp
                                  aria-hidden="true"
                                  className="size-3.5 shrink-0 rotate-45 text-muted-foreground opacity-0 transition-opacity group-hover/suggestion:opacity-100 group-focus-visible/suggestion:opacity-100"
                                />
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ))
              : messages.map((message, index) => {
                  const isLast =
                    message.id === (message.role === "assistant" ? lastAssistantId : lastUserId);
                  const status = message.status ?? "done";
                  const builtIn =
                    message.role === "user" ? (
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl rounded-br-md bg-muted px-3.5 py-2 break-words whitespace-pre-wrap text-foreground",
                          compact ? "text-[13px] leading-[1.6]" : "text-sm leading-6",
                        )}
                      >
                        <span className="sr-only">{labels.you}: </span>
                        {message.content}
                      </div>
                    ) : (
                      <AssistantAnswer
                        message={message}
                        isLast={isLast}
                        compact={compact}
                        labels={labels}
                        feedback={feedback[message.id]}
                        onFeedback={onFeedback ? (value) => giveFeedback(message.id, value) : undefined}
                        onRegenerate={onRegenerate && !busy ? () => onRegenerate(message.id) : undefined}
                        onCopy={onCopy}
                        renderStep={renderStep}
                        renderToken={renderToken}
                        formatDuration={formatDuration}
                        formatTime={formatTime}
                      />
                    );
                  const custom = renderMessage?.(message, { index, isLast, children: builtIn });
                  return (
                    <article
                      key={message.id}
                      data-slot="assistant-message"
                      data-role={message.role}
                      data-status={message.role === "assistant" ? status : undefined}
                      aria-busy={status === "streaming" || undefined}
                      aria-label={message.role === "user" ? labels.you : labels.assistant}
                      className={cn(
                        "group/message flex min-w-0 flex-col transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] starting:translate-y-1.5 starting:opacity-0 motion-reduce:transition-none",
                        message.role === "user" ? "items-end" : compact ? "gap-2.5" : "gap-3",
                      )}
                    >
                      {custom !== undefined ? custom : builtIn}
                    </article>
                  );
                })}
          </div>
        </div>

        {away && messages.length > 0 && (
          <button
            type="button"
            onClick={jumpToLatest}
            className={cn(
              "absolute bottom-3 left-1/2 inline-flex h-7 -translate-x-1/2 items-center gap-1.5 rounded-full border border-border/70 bg-popover/90 pr-3 pl-2.5 text-xs font-medium text-popover-foreground shadow-xl backdrop-blur-md transition-[opacity,translate,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-muted starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none",
              focusRing,
            )}
          >
            <ArrowDown className="size-3.5" aria-hidden="true" />
            {labels.jumpToLatest}
          </button>
        )}
      </div>

      <form
        data-slot="assistant-composer"
        data-disabled={disabled || undefined}
        onSubmit={(event) => {
          event.preventDefault();
          send(draft);
        }}
        className={cn("shrink-0", compact ? "px-2.5 pb-2.5" : "px-3 pb-3 @lg/assistant:px-4 @lg/assistant:pb-4")}
      >
        <div
          className={cn(
            "rounded-2xl border border-border/80 bg-background/70 shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-[border-color,box-shadow] duration-150 focus-within:border-primary/40 focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_10%,transparent),0_10px_30px_-12px_color-mix(in_oklab,var(--color-primary)_45%,transparent)] motion-reduce:transition-none dark:bg-background/40",
            disabled && "opacity-60",
          )}
        >
          <div className={cn(!toolbar && "flex items-end")}>
            <textarea
              ref={setTextareaRef}
              rows={1}
              value={draft}
              disabled={disabled}
              autoFocus={autoFocus}
              placeholder={placeholder ?? labels.placeholder}
              aria-label={placeholder ?? labels.placeholder}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              onCompositionStart={() => {
                composing.current = true;
              }}
              onCompositionEnd={() => {
                // Safari fires keydown after compositionend; release on the next tick.
                window.setTimeout(() => {
                  composing.current = false;
                }, 0);
              }}
              className={cn(
                "block w-full min-w-0 resize-none bg-transparent text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed",
                compact ? "px-3 text-[13px] leading-5" : "px-3.5 text-sm leading-6",
                toolbar
                  ? compact
                    ? "pt-2.5 pb-1"
                    : "pt-3 pb-1.5"
                  : compact
                    ? "flex-1 py-2.5"
                    : "flex-1 py-3",
              )}
            />
            {!toolbar && <div className={cn("shrink-0", compact ? "p-1" : "p-1.5")}>{submit}</div>}
          </div>
          {toolbar && (
            <div className={cn("flex items-center gap-1", compact ? "px-1.5 pb-1.5" : "px-2 pb-2")}>
              {composerActions && (
                <div className="flex min-w-0 items-center gap-0.5 text-muted-foreground">{composerActions}</div>
              )}
              {models && models.length > 0 && (
                <ModelPicker
                  models={models}
                  value={model}
                  onChange={setModel}
                  label={labels.model}
                  disabled={disabled}
                />
              )}
              <div className="ml-auto flex shrink-0 items-center gap-2">{submit}</div>
            </div>
          )}
        </div>
        {footer && (
          <div className="mt-2 text-center text-[11px] leading-4 text-muted-foreground">{footer}</div>
        )}
      </form>
    </div>
  );
}
