"use client";

import * as React from "react";
import {
  IconAlertCircle,
  IconCircleCheckFilled,
  IconClock,
  IconCloudUpload,
  IconFile,
  IconFileCode,
  IconFileMusic,
  IconFileSpreadsheet,
  IconFileText,
  IconFileTypeDoc,
  IconFileTypePdf,
  IconFileZip,
  IconMovie,
  IconPhoto,
  IconPresentation,
  IconRefresh,
  IconTrash,
  IconX,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------------ */
/* Types                                                                     */
/* ------------------------------------------------------------------------ */

/**
 * idle: picked, with no `upload` function. queued: waiting for a free upload
 * slot. uploading, done, error, and canceled follow the request.
 */
export type FileUploadStatus =
  | "idle"
  | "queued"
  | "uploading"
  | "done"
  | "error"
  | "canceled";

export interface FileUploadItem {
  id: string;
  /** The picked file. Items restored from a server can leave it out. */
  file?: File;
  name: string;
  /** Size in bytes. */
  size: number;
  /** MIME type, such as "image/png". */
  type: string;
  status: FileUploadStatus;
  /** Upload progress from 0 to 1. */
  progress: number;
  /** Why the upload failed, shown under the name. */
  error?: string;
  /** Thumbnail source. Image files get an object URL automatically. */
  previewUrl?: string;
  /** Whatever `upload` resolved with, such as the stored file's URL. */
  response?: unknown;
}

export type FileRejectionReason = "type" | "size" | "count" | "duplicate" | "custom";

export interface FileRejection {
  file: File;
  reason: FileRejectionReason;
  message: string;
}

export interface FileUploadContext {
  /** Report progress as a fraction from 0 to 1. */
  onProgress: (progress: number) => void;
  /** Aborts when the upload is canceled or removed, or the component unmounts. */
  signal: AbortSignal;
  item: FileUploadItem;
}

export interface FileUploadLabels {
  title: string;
  titleSingle: string;
  or: string;
  browse: string;
  dropActive: (count: number) => string;
  dropReject: string;
  limitReached: string;
  limitHint: string;
  keyboardHint: string;
  status: Record<FileUploadStatus, string>;
  of: string;
  cancel: (name: string) => string;
  retry: (name: string) => string;
  remove: (name: string) => string;
  retryFailed: string;
  clearDone: string;
  dismiss: string;
  files: string;
  uploadFailed: string;
  timeLeft: (seconds: number) => string;
  summary: (done: number, total: number) => string;
  count: (count: number, size: string) => string;
  added: (count: number) => string;
  uploaded: (name: string) => string;
  failed: (name: string, reason: string) => string;
  canceled: (name: string) => string;
  removed: (name: string) => string;
  upTo: (size: string, each: boolean) => string;
  maxFiles: (count: number) => string;
  rejectType: (name: string, accepted: string) => string;
  rejectSize: (name: string, max: string) => string;
  rejectCount: (count: number, max: number) => string;
  rejectDuplicate: (name: string) => string;
}

export interface FileUploadProps extends Omit<
  React.ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> {
  /** Controlled files. Leave undefined to let the component manage them. */
  files?: FileUploadItem[];
  defaultFiles?: FileUploadItem[];
  onFilesChange?: (files: FileUploadItem[]) => void;
  /**
   * Uploads one file. Report progress, honour the signal, and resolve when the
   * file is stored or reject with an Error whose message explains why. Without
   * it the component is a picker.
   */
  upload?: (file: File, context: FileUploadContext) => Promise<unknown>;
  /** Uploads running at once. Defaults to 3. */
  concurrency?: number;
  /** Same syntax as the input's accept attribute: ".pdf,image/*". */
  accept?: string;
  /** Largest file in bytes. */
  maxSize?: number;
  /** Most files in the list. */
  maxFiles?: number;
  /** Allow several files. When false, a new pick replaces the current file. */
  multiple?: boolean;
  disabled?: boolean;
  variant?: "default" | "compact";
  /** Add files pasted while focus is inside the component. Defaults to true. */
  paste?: boolean;
  /** Mirrors picked files into a hidden file input so a native form post includes them. */
  name?: string;
  /** Extra validation. Return a message to reject the file. */
  validate?: (file: File, files: FileUploadItem[]) => string | null | undefined | false;
  onReject?: (rejections: FileRejection[]) => void;
  onUploadComplete?: (item: FileUploadItem, response: unknown) => void;
  onUploadError?: (item: FileUploadItem, error: unknown) => void;
  /** Called when a file leaves the list through its remove button. */
  onRemove?: (item: FileUploadItem) => void;
  /** Replaces the generated dropzone hint, such as "PDF up to 10 MB". */
  hint?: React.ReactNode;
  /** Show the count and bulk actions above the list. Defaults to true in the default variant. */
  showSummary?: boolean;
  locale?: string;
  formatSize?: (bytes: number) => string;
  /** Replaces the type icon or thumbnail for a file. */
  renderIcon?: (item: FileUploadItem) => React.ReactNode;
  labels?: Partial<FileUploadLabels>;
}

/* ------------------------------------------------------------------------ */
/* Helpers                                                                   */
/* ------------------------------------------------------------------------ */

/** Binary units, so 10 * 1024 * 1024 reads as "10 MB". */
export function formatBytes(bytes: number, locale?: string) {
  if (!Number.isFinite(bytes) || bytes < 0) return "";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const digits = unit === 0 ? 0 : value < 10 ? 1 : 0;
  // A non-breaking space keeps "50 MB" together when hints wrap.
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: digits }).format(value)}\u00a0${units[unit]}`;
}

const plural = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? "" : "s"}`;

const defaultLabels: FileUploadLabels = {
  title: "Drop files here",
  titleSingle: "Drop a file here",
  or: "or",
  browse: "browse",
  dropActive: (count) =>
    count > 1 ? `Release to add ${count} files` : "Release to add the file",
  dropReject: "These files can't be added",
  limitReached: "File limit reached",
  limitHint: "Remove a file to add another.",
  keyboardHint: "Press Enter to browse, or paste a file.",
  status: {
    idle: "Ready",
    queued: "Waiting",
    uploading: "Uploading",
    done: "Uploaded",
    error: "Failed",
    canceled: "Canceled",
  },
  of: "of",
  cancel: (name) => `Cancel upload of ${name}`,
  retry: (name) => `Retry ${name}`,
  remove: (name) => `Remove ${name}`,
  retryFailed: "Retry failed",
  clearDone: "Clear uploaded",
  dismiss: "Dismiss",
  files: "Files",
  uploadFailed: "Upload failed",
  timeLeft: (seconds) =>
    seconds < 60
      ? `${Math.max(1, Math.round(seconds))}s left`
      : `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s left`,
  summary: (done, total) => `${done} of ${total} uploaded`,
  count: (count, size) => `${plural(count, "file")} · ${size}`,
  added: (count) => `${plural(count, "file")} added`,
  uploaded: (name) => `${name} uploaded`,
  failed: (name, reason) => `${name} failed: ${reason}`,
  canceled: (name) => `${name} canceled`,
  removed: (name) => `${name} removed`,
  upTo: (size, each) => `up to ${size}${each ? " each" : ""}`,
  maxFiles: (count) => `${count} files max`,
  rejectType: (name, accepted) =>
    accepted ? `${name} isn't supported. Use ${accepted}.` : `${name} isn't supported.`,
  rejectSize: (name, max) => `${name} is larger than ${max}.`,
  rejectCount: (count, max) =>
    max === 1
      ? "Only one file can be added."
      : `${plural(count, "file")} not added: the limit is ${max}.`,
  rejectDuplicate: (name) => `${name} is already in the list.`,
};

const EXTENSION_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  csv: "text/csv",
  txt: "text/plain",
  json: "application/json",
  zip: "application/zip",
  mp4: "video/mp4",
  mov: "video/quicktime",
  mp3: "audio/mpeg",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  xls: "application/vnd.ms-excel",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  doc: "application/msword",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  heic: "image/heic",
  webm: "video/webm",
  wav: "audio/wav",
  md: "text/markdown",
};

const TYPE_NAMES: Record<string, string> = {
  "image/*": "images",
  "video/*": "videos",
  "audio/*": "audio",
  "text/*": "text files",
  "application/pdf": "PDF",
  "image/png": "PNG",
  "image/jpeg": "JPG",
  "image/gif": "GIF",
  "image/webp": "WebP",
  "image/svg+xml": "SVG",
  "text/csv": "CSV",
  "text/plain": "TXT",
  "application/json": "JSON",
  "application/zip": "ZIP",
  "video/mp4": "MP4",
  "video/quicktime": "MOV",
  "audio/mpeg": "MP3",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
  "application/vnd.ms-excel": "XLS",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PPTX",
};

function parseAccept(accept?: string) {
  return (accept ?? "")
    .split(",")
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean);
}

function extensionOf(name: string) {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : "";
}

function matchesType(type: string, rule: string) {
  const mime = type.toLowerCase();
  if (rule.endsWith("/*")) return mime.startsWith(rule.slice(0, -1));
  return mime === rule;
}

function isAccepted(file: { name: string; type: string }, rules: string[]) {
  if (!rules.length) return true;
  const ext = extensionOf(file.name);
  return rules.some((rule) =>
    rule.startsWith(".") ? ext === rule.slice(1) : matchesType(file.type, rule),
  );
}

/** While dragging, browsers expose types but not names. True only for a certain mismatch. */
function isCertainlyRejected(type: string, rules: string[]) {
  if (!rules.length || !type) return false;
  return !rules.some((rule) => {
    if (!rule.startsWith(".")) return matchesType(type, rule);
    const known = EXTENSION_TYPES[rule.slice(1)];
    return known ? known === type.toLowerCase() : true;
  });
}

function describeAccept(rules: string[], locale?: string) {
  const names = Array.from(
    new Set(
      rules.map((rule) => {
        if (rule.startsWith(".")) {
          const known = EXTENSION_TYPES[rule.slice(1)];
          return (known && TYPE_NAMES[known]) ?? rule.slice(1).toUpperCase();
        }
        return TYPE_NAMES[rule] ?? rule.split("/").pop()!.toUpperCase();
      }),
    ),
  );
  if (!names.length) return "";
  try {
    return new Intl.ListFormat(locale ?? "en", {
      style: "long",
      type: "disjunction",
    }).format(names);
  } catch {
    return names.join(", ");
  }
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

type Kind = "image" | "video" | "audio" | "pdf" | "archive" | "sheet" | "doc" | "slides" | "code" | "text" | "file";

function kindOf(name: string, type: string): Kind {
  const ext = extensionOf(name);
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  if (type === "application/pdf" || ext === "pdf") return "pdf";
  if (["zip", "rar", "7z", "gz", "tar", "tgz"].includes(ext)) return "archive";
  if (["xls", "xlsx", "csv", "tsv", "numbers", "ods"].includes(ext)) return "sheet";
  if (["doc", "docx", "pages", "rtf", "odt"].includes(ext)) return "doc";
  if (["ppt", "pptx", "key", "odp"].includes(ext)) return "slides";
  if (
    ["js", "ts", "tsx", "jsx", "json", "html", "css", "py", "go", "rs", "rb", "sh", "yml", "yaml", "xml", "sql"].includes(ext)
  )
    return "code";
  if (type.startsWith("text/") || ["txt", "md"].includes(ext)) return "text";
  return "file";
}

const KIND_ICONS: Record<Kind, typeof IconFile> = {
  image: IconPhoto,
  video: IconMovie,
  audio: IconFileMusic,
  pdf: IconFileTypePdf,
  archive: IconFileZip,
  sheet: IconFileSpreadsheet,
  doc: IconFileTypeDoc,
  slides: IconPresentation,
  code: IconFileCode,
  text: IconFileText,
  file: IconFile,
};

let counter = 0;
function createId() {
  counter += 1;
  return `file-${Date.now().toString(36)}-${counter}-${Math.random().toString(36).slice(2, 6)}`;
}

/** Screenshots arrive as "image.png"; give them a name that survives a list of several. */
function namePasted(file: File) {
  if (!/^image\.\w+$/i.test(file.name)) return file;
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  try {
    return new File([file], `pasted-image-${stamp}.${extensionOf(file.name)}`, {
      type: file.type,
      lastModified: file.lastModified,
    });
  } catch {
    return file;
  }
}

const keyframes = `@keyframes file-upload-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}@keyframes file-upload-pop{0%{transform:scale(.4);opacity:0}70%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}@keyframes file-upload-sheen{from{transform:translateX(-100%)}to{transform:translateX(250%)}}`;

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-0";

/* ------------------------------------------------------------------------ */
/* Pieces                                                                    */
/* ------------------------------------------------------------------------ */

/** Keeps the extension and the end of the name, eliding the middle. */
function MiddleTruncate({ text, className }: { text: string; className?: string }) {
  const dot = text.lastIndexOf(".");
  const ext = dot > 0 ? text.slice(dot) : "";
  const base = dot > 0 ? text.slice(0, dot) : text;
  // Keep the last word ("-final.pdf", "_v2.png") whole when it is short; otherwise 8 characters.
  const separator = Math.max(base.lastIndexOf("-"), base.lastIndexOf("_"), base.lastIndexOf(" "));
  const keep =
    separator > 3 && base.length - separator <= 12
      ? base.length - separator - 1
      : Math.min(8, Math.max(0, base.length - 4));
  const head = base.slice(0, base.length - keep);
  const tail = base.slice(base.length - keep) + ext;
  return (
    <span className={cn("flex min-w-0", className)} title={text}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="flex min-w-0">
        <span className="overflow-hidden text-ellipsis whitespace-pre">{head}</span>
        <span className="shrink-0 whitespace-pre">{tail}</span>
      </span>
    </span>
  );
}

function ActionButton({
  label,
  onClick,
  children,
  disabled,
  tone = "default",
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  tone?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50 sm:size-7 motion-reduce:transition-none [&_svg]:size-4",
        tone === "danger" && "hover:text-rose-700 dark:hover:text-rose-400",
        focusRing,
      )}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------------ */
/* File upload                                                               */
/* ------------------------------------------------------------------------ */

/** A dropzone and upload queue with progress, cancellation, retry, and validation. */
export function FileUpload({
  files: filesProp,
  defaultFiles,
  onFilesChange,
  upload,
  concurrency = 3,
  accept,
  maxSize,
  maxFiles,
  multiple = true,
  disabled = false,
  variant = "default",
  paste = true,
  name,
  validate,
  onReject,
  onUploadComplete,
  onUploadError,
  onRemove,
  hint,
  showSummary,
  locale,
  formatSize,
  renderIcon,
  labels: labelsProp,
  className,
  onPaste,
  ...props
}: FileUploadProps) {
  const labels: FileUploadLabels = {
    ...defaultLabels,
    ...labelsProp,
    status: { ...defaultLabels.status, ...labelsProp?.status },
  };
  const compact = variant === "compact";
  const size = (bytes: number) => (formatSize ? formatSize(bytes) : formatBytes(bytes, locale));
  const rules = React.useMemo(() => parseAccept(accept), [accept]);
  const limit = multiple ? maxFiles : 1;

  const id = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const zoneRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const formInputRef = React.useRef<HTMLInputElement>(null);

  /* ---- Files ---- */
  const [filesState, setFilesState] = React.useState<FileUploadItem[]>(
    () => defaultFiles ?? [],
  );
  const files = filesProp ?? filesState;
  const filesRef = React.useRef(files);
  filesRef.current = files;
  const commit = (next: FileUploadItem[]) => {
    filesRef.current = next;
    if (filesProp === undefined) setFilesState(next);
    onFilesChange?.(next);
  };
  const patch = (itemId: string, change: Partial<FileUploadItem>) => {
    const list = filesRef.current;
    const index = list.findIndex((item) => item.id === itemId);
    if (index < 0) return null;
    const item = { ...list[index], ...change };
    const next = list.slice();
    next[index] = item;
    commit(next);
    return item;
  };

  // The latest callbacks, so in-flight uploads never call stale props.
  const latest = React.useRef({ upload, onUploadComplete, onUploadError, labels });
  latest.current = { upload, onUploadComplete, onUploadError, labels };

  /* ---- Announcements ---- */
  const [announcement, setAnnouncement] = React.useState("");
  const pendingAnnouncements = React.useRef<string[]>([]);
  const announceTimer = React.useRef<number | undefined>(undefined);
  const announce = (message: string) => {
    pendingAnnouncements.current.push(message);
    window.clearTimeout(announceTimer.current);
    announceTimer.current = window.setTimeout(() => {
      setAnnouncement(pendingAnnouncements.current.join(". "));
      pendingAnnouncements.current = [];
    }, 120);
  };

  /* ---- Rejections ---- */
  const [rejections, setRejections] = React.useState<FileRejection[]>([]);

  /* ---- Uploads ---- */
  const controllers = React.useRef(new Map<string, AbortController>());
  const timing = React.useRef(new Map<string, { start: number; eta?: number }>());
  const pendingProgress = React.useRef(new Map<string, number>());
  const frame = React.useRef<number | null>(null);

  const flushProgress = () => {
    frame.current = null;
    const pending = pendingProgress.current;
    if (!pending.size) return;
    const now = performance.now();
    let changed = false;
    const next = filesRef.current.map((item) => {
      const value = pending.get(item.id);
      if (value === undefined || item.status !== "uploading" || value === item.progress)
        return item;
      changed = true;
      const time = timing.current.get(item.id);
      if (time) {
        const elapsed = (now - time.start) / 1000;
        if (elapsed > 0.8 && value > 0.04) {
          const remaining = (elapsed / value) * (1 - value);
          // Smooth the estimate so the countdown never jitters.
          time.eta = time.eta === undefined ? remaining : time.eta * 0.7 + remaining * 0.3;
        }
      }
      return { ...item, progress: value };
    });
    pending.clear();
    if (changed) commit(next);
  };

  const reportProgress = (itemId: string, value: number) => {
    pendingProgress.current.set(
      itemId,
      Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0)),
    );
    if (frame.current === null)
      frame.current = requestAnimationFrame(flushProgress);
  };

  const start = (item: FileUploadItem) => {
    const run = latest.current.upload;
    if (!run || !item.file) return;
    const controller = new AbortController();
    controllers.current.set(item.id, controller);
    timing.current.set(item.id, { start: performance.now() });
    patch(item.id, { status: "uploading", progress: 0, error: undefined });
    const current = () => controllers.current.get(item.id) === controller && !controller.signal.aborted;
    let request: Promise<unknown>;
    try {
      request = Promise.resolve(
        run(item.file, {
          signal: controller.signal,
          item,
          onProgress: (value) => {
            if (current()) reportProgress(item.id, value);
          },
        }),
      );
    } catch (error) {
      request = Promise.reject(error);
    }
    request.then(
      (response) => {
        if (!current()) return;
        controllers.current.delete(item.id);
        pendingProgress.current.delete(item.id);
        const done = patch(item.id, { status: "done", progress: 1, response, error: undefined });
        if (done) {
          announce(latest.current.labels.uploaded(done.name));
          latest.current.onUploadComplete?.(done, response);
        }
      },
      (error: unknown) => {
        if (!current()) return;
        controllers.current.delete(item.id);
        pendingProgress.current.delete(item.id);
        const reason =
          error instanceof Error && error.message
            ? error.message
            : typeof error === "string" && error
              ? error
              : latest.current.labels.uploadFailed;
        const failed = patch(item.id, { status: "error", error: reason });
        if (failed) {
          announce(latest.current.labels.failed(failed.name, reason));
          latest.current.onUploadError?.(failed, error);
        }
      },
    );
  };

  const hasUpload = !!upload;
  const slots = Math.max(1, Math.floor(concurrency));
  React.useEffect(() => {
    // Stop requests whose items left the list or stopped uploading elsewhere.
    for (const [itemId, controller] of controllers.current) {
      const item = files.find((entry) => entry.id === itemId);
      if (!item || item.status !== "uploading") {
        controller.abort();
        controllers.current.delete(itemId);
      }
    }
    if (!hasUpload) return;
    let active = controllers.current.size;
    for (const item of files) {
      if (active >= slots) break;
      // An uploading item with no request lost it to a remount; start it again.
      const orphan = item.status === "uploading" && !controllers.current.has(item.id);
      if ((item.status === "queued" || orphan) && item.file) {
        start(item);
        active += 1;
      }
    }
  }, [files, hasUpload, slots]);

  React.useEffect(() => {
    const live = controllers.current;
    return () => {
      for (const controller of live.values()) controller.abort();
      live.clear();
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
      window.clearTimeout(announceTimer.current);
    };
  }, []);

  /* ---- Previews ---- */
  const previews = React.useRef(new Map<string, string>());
  const [, refreshPreviews] = React.useReducer((n: number) => n + 1, 0);
  const [broken, setBroken] = React.useState<ReadonlySet<string>>(() => new Set());
  React.useEffect(() => {
    let changed = false;
    const ids = new Set(files.map((item) => item.id));
    for (const [itemId, url] of previews.current) {
      if (!ids.has(itemId)) {
        URL.revokeObjectURL(url);
        previews.current.delete(itemId);
        changed = true;
      }
    }
    for (const item of files) {
      if (
        item.file &&
        !item.previewUrl &&
        item.type.startsWith("image/") &&
        item.size < 20 * 1024 * 1024 &&
        !previews.current.has(item.id)
      ) {
        previews.current.set(item.id, URL.createObjectURL(item.file));
        changed = true;
      }
    }
    if (changed) refreshPreviews();
  }, [files]);
  React.useEffect(() => {
    const urls = previews.current;
    return () => {
      for (const url of urls.values()) URL.revokeObjectURL(url);
      urls.clear();
    };
  }, []);

  /* ---- Form mirror ---- */
  React.useEffect(() => {
    const input = formInputRef.current;
    if (!name || !input || typeof DataTransfer === "undefined") return;
    try {
      const transfer = new DataTransfer();
      for (const item of files)
        if (item.file && item.status !== "error" && item.status !== "canceled")
          transfer.items.add(item.file);
      input.files = transfer.files;
    } catch {
      // Older browsers cannot construct DataTransfer; the form simply omits files.
    }
  }, [files, name]);

  /* ---- Adding ---- */
  const full = limit !== undefined && multiple && files.length >= limit;
  const acceptText = describeAccept(rules, locale);

  const addFiles = (incoming: File[]) => {
    if (disabled || !incoming.length) return;
    const current = filesRef.current;
    const rejected: FileRejection[] = [];
    const accepted: File[] = [];
    for (const file of incoming) {
      if (!isAccepted(file, rules)) {
        rejected.push({ file, reason: "type", message: labels.rejectType(file.name, acceptText) });
      } else if (maxSize !== undefined && file.size > maxSize) {
        rejected.push({ file, reason: "size", message: labels.rejectSize(file.name, size(maxSize)) });
      } else if (
        multiple &&
        [...current.map((item) => item.file), ...accepted].some(
          (other) =>
            other &&
            other.name === file.name &&
            other.size === file.size &&
            other.lastModified === file.lastModified,
        )
      ) {
        rejected.push({ file, reason: "duplicate", message: labels.rejectDuplicate(file.name) });
      } else {
        const custom = validate?.(file, current);
        if (custom) rejected.push({ file, reason: "custom", message: custom });
        else accepted.push(file);
      }
    }
    let base = current;
    if (!multiple) {
      // A single-file picker replaces its file.
      const extra = accepted.splice(1);
      if (extra.length)
        rejected.push(...extra.map((file) => ({ file, reason: "count" as const, message: labels.rejectCount(extra.length, 1) })));
      if (accepted.length) {
        for (const item of base) controllers.current.get(item.id)?.abort();
        base = [];
      }
    } else if (limit !== undefined) {
      const room = Math.max(0, limit - current.length);
      const extra = accepted.splice(room);
      if (extra.length)
        rejected.push(...extra.map((file) => ({ file, reason: "count" as const, message: labels.rejectCount(extra.length, limit) })));
    }
    if (accepted.length) {
      const added: FileUploadItem[] = accepted.map((file) => ({
        id: createId(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: upload ? "queued" : "idle",
        progress: 0,
      }));
      commit([...base, ...added]);
      announce(labels.added(added.length));
    }
    setRejections(rejected);
    if (rejected.length) onReject?.(rejected);
  };

  const browse = () => {
    if (disabled || full) return;
    inputRef.current?.click();
  };

  /* ---- Row actions ---- */
  const focusAfter = (index: number) => {
    requestAnimationFrame(() => {
      const rows = rootRef.current?.querySelectorAll<HTMLElement>("[data-slot=file-upload-item]");
      const row = rows?.[Math.min(index, (rows?.length ?? 1) - 1)];
      (row?.querySelector<HTMLElement>("button") ?? zoneRef.current)?.focus();
    });
  };
  const remove = (item: FileUploadItem) => {
    const index = filesRef.current.findIndex((entry) => entry.id === item.id);
    controllers.current.get(item.id)?.abort();
    controllers.current.delete(item.id);
    commit(filesRef.current.filter((entry) => entry.id !== item.id));
    announce(labels.removed(item.name));
    onRemove?.(item);
    focusAfter(index);
  };
  const cancel = (item: FileUploadItem) => {
    controllers.current.get(item.id)?.abort();
    controllers.current.delete(item.id);
    pendingProgress.current.delete(item.id);
    patch(item.id, { status: "canceled" });
    announce(labels.canceled(item.name));
    requestAnimationFrame(() =>
      rootRef.current
        ?.querySelector<HTMLElement>(`[data-file-id="${CSS.escape(item.id)}"] button`)
        ?.focus(),
    );
  };
  const retry = (itemIds: string[]) => {
    const ids = new Set(itemIds);
    commit(
      filesRef.current.map((item) =>
        ids.has(item.id)
          ? { ...item, status: upload ? "queued" : "idle", progress: 0, error: undefined }
          : item,
      ),
    );
  };
  const clearDone = () => {
    const leaving = filesRef.current.filter((item) => item.status === "done");
    commit(filesRef.current.filter((item) => item.status !== "done"));
    for (const item of leaving) onRemove?.(item);
    requestAnimationFrame(() => zoneRef.current?.focus());
  };

  /* ---- Drag and drop ---- */
  const [dragState, setDragState] = React.useState<"idle" | "page" | "over" | "reject">("idle");
  const [dragCount, setDragCount] = React.useState(0);
  const zoneDepth = React.useRef(0);

  React.useEffect(() => {
    if (disabled) return;
    let depth = 0;
    const hasFiles = (event: DragEvent) =>
      Array.from(event.dataTransfer?.types ?? []).includes("Files");
    const enter = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      depth += 1;
      setDragState((state) => (state === "idle" ? "page" : state));
    };
    const leave = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      depth = Math.max(0, depth - 1);
      if (depth === 0) setDragState("idle");
    };
    const reset = () => {
      depth = 0;
      zoneDepth.current = 0;
      setDragState("idle");
    };
    window.addEventListener("dragenter", enter);
    window.addEventListener("dragleave", leave);
    window.addEventListener("drop", reset);
    window.addEventListener("dragend", reset);
    return () => {
      window.removeEventListener("dragenter", enter);
      window.removeEventListener("dragleave", leave);
      window.removeEventListener("drop", reset);
      window.removeEventListener("dragend", reset);
    };
  }, [disabled]);

  const assessDrag = (event: React.DragEvent) => {
    const items = Array.from(event.dataTransfer.items ?? []).filter((item) => item.kind === "file");
    const count = items.length || event.dataTransfer.files.length || 1;
    const room = limit === undefined ? Infinity : multiple ? limit - filesRef.current.length : 1;
    const allRejected = items.length > 0 && items.every((item) => isCertainlyRejected(item.type, rules));
    return { count: Math.min(count, Math.max(room, 0)), reject: disabled || room <= 0 || allRejected };
  };

  const zoneHandlers = {
    onDragEnter: (event: React.DragEvent) => {
      if (!Array.from(event.dataTransfer.types).includes("Files")) return;
      event.preventDefault();
      zoneDepth.current += 1;
      const { count, reject } = assessDrag(event);
      setDragCount(count);
      setDragState(reject ? "reject" : "over");
    },
    onDragOver: (event: React.DragEvent) => {
      if (!Array.from(event.dataTransfer.types).includes("Files")) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = dragState === "reject" ? "none" : "copy";
    },
    onDragLeave: () => {
      zoneDepth.current = Math.max(0, zoneDepth.current - 1);
      if (zoneDepth.current === 0) setDragState("page");
    },
    onDrop: (event: React.DragEvent) => {
      event.preventDefault();
      zoneDepth.current = 0;
      setDragState("idle");
      if (disabled) return;
      addFiles(Array.from(event.dataTransfer.files));
    },
  };

  /* ---- Derived ---- */
  const uploadable = files.filter((item) => item.status !== "idle");
  const doneCount = files.filter((item) => item.status === "done").length;
  const failedIds = files.filter((item) => item.status === "error" || item.status === "canceled").map((item) => item.id);
  const totalSize = files.reduce((sum, item) => sum + item.size, 0);
  const summaryVisible = (showSummary ?? !compact) && files.length > 1;

  const hintText =
    hint ??
    (() => {
      const parts: string[] = [];
      const typePart = acceptText ? capitalize(acceptText) : "";
      const sizePart = maxSize !== undefined ? labels.upTo(size(maxSize), multiple) : "";
      const first = [typePart, sizePart].filter(Boolean).join(", ");
      if (first) parts.push(capitalize(first));
      if (multiple && limit !== undefined) parts.push(capitalize(labels.maxFiles(limit)));
      return parts.join(" · ");
    })();

  const titleId = `${id}-title`;
  const hintId = `${id}-hint`;
  const keyboardId = `${id}-keyboard`;
  const zoneDisabled = disabled || full;
  const zoneState = disabled ? "disabled" : full && dragState === "idle" ? "full" : dragState;

  const title =
    zoneState === "over" ? (
      labels.dropActive(dragCount)
    ) : zoneState === "reject" ? (
      labels.dropReject
    ) : zoneState === "full" ? (
      labels.limitReached
    ) : (
      <>
        {multiple ? labels.title : labels.titleSingle}
        {/* The compact zone shows a Browse button once there is room, so the phrase steps aside. */}
        <span className={cn(compact && "@xs/file-upload:hidden")}>
          {` ${labels.or} `}
          <span className="text-primary underline-offset-4 decoration-primary/40 group-hover/zone:underline">
            {labels.browse}
          </span>
        </span>
      </>
    );
  const subtitle = zoneState === "full" ? labels.limitHint : hintText;

  const ZoneIcon = zoneState === "reject" ? IconAlertCircle : IconCloudUpload;
  // The empty state invites with a tall zone; once a queue exists it steps back to one row.
  const layout = compact ? "compact" : files.length > 0 ? "row" : "stacked";

  return (
    <div
      ref={rootRef}
      role="group"
      data-slot="file-upload"
      data-variant={variant}
      data-disabled={disabled ? "" : undefined}
      data-drag-state={dragState}
      className={cn("@container/file-upload flex w-full min-w-0 flex-col", compact ? "gap-2" : "gap-3", className)}
      onPaste={(event) => {
        onPaste?.(event);
        if (event.defaultPrevented || !paste || disabled) return;
        const pasted = Array.from(event.clipboardData?.files ?? []);
        if (!pasted.length) return;
        event.preventDefault();
        addFiles(pasted.map(namePasted));
      }}
      {...props}
    >
      <style>{keyframes}</style>
      <input
        ref={inputRef}
        type="file"
        hidden
        tabIndex={-1}
        aria-hidden="true"
        accept={accept}
        multiple={multiple}
        disabled={zoneDisabled}
        onChange={(event) => {
          addFiles(Array.from(event.target.files ?? []));
          event.target.value = "";
        }}
      />
      {name && (
        <input ref={formInputRef} type="file" name={name} multiple={multiple} hidden tabIndex={-1} aria-hidden="true" />
      )}

      {/* Dropzone */}
      <div
        ref={zoneRef}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={zoneDisabled || undefined}
        aria-labelledby={titleId}
        aria-describedby={paste ? `${hintId} ${keyboardId}` : hintId}
        data-slot="file-upload-dropzone"
        data-state={zoneState}
        data-layout={layout}
        onClick={browse}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            browse();
          }
        }}
        {...zoneHandlers}
        className={cn(
          "group/zone relative isolate flex cursor-pointer overflow-hidden border border-dashed border-border bg-card text-card-foreground transition-[border-color,background-color,box-shadow] duration-150 motion-reduce:transition-none",
          "outline-none hover:border-foreground/25 hover:bg-[color-mix(in_oklab,var(--color-muted)_45%,var(--color-card))] focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-ring/50",
          "data-[state=page]:border-primary/45 data-[state=page]:bg-[color-mix(in_oklab,var(--color-primary)_3%,var(--color-card))]",
          "data-[state=over]:border-primary data-[state=over]:bg-[color-mix(in_oklab,var(--color-primary)_6%,var(--color-card))] data-[state=over]:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_12%,transparent),0_12px_32px_-16px_color-mix(in_oklab,var(--color-primary)_45%,transparent)]",
          "data-[state=reject]:cursor-no-drop data-[state=reject]:border-destructive/70 data-[state=reject]:bg-[color-mix(in_oklab,var(--color-destructive)_5%,var(--color-card))]",
          "data-[state=full]:cursor-default data-[state=full]:border-border/70 data-[state=full]:bg-[color-mix(in_oklab,var(--color-muted)_45%,var(--color-card))] data-[state=full]:hover:bg-[color-mix(in_oklab,var(--color-muted)_45%,var(--color-card))]",
          "data-[state=disabled]:cursor-not-allowed data-[state=disabled]:opacity-60 data-[state=disabled]:hover:border-border data-[state=disabled]:hover:bg-card",
          layout === "compact" && "min-h-14 items-center gap-3 rounded-xl px-3 py-2.5 sm:min-h-13",
          layout === "row" && "items-center justify-center gap-3.5 rounded-2xl px-5 py-4",
          layout === "stacked" && "flex-col items-center justify-center gap-3 rounded-2xl px-6 py-7 text-center",
        )}
      >
        {/* The lit drop state: a soft primary glow rising from the bottom edge. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_120%_at_50%_120%,color-mix(in_oklab,var(--color-primary)_16%,transparent),transparent_70%)] opacity-0 transition-opacity duration-200 group-data-[state=over]/zone:opacity-100 motion-reduce:transition-none"
        />
        <span
          aria-hidden="true"
          className={cn(
            "relative flex shrink-0 items-center justify-center bg-card text-muted-foreground ring-1 ring-border/70 transition-[transform,color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ring-inset motion-reduce:transition-none",
            "shadow-[0_1px_2px_rgb(0_0_0/0.05),0_4px_12px_-6px_rgb(0_0_0/0.12)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]",
            "group-hover/zone:text-foreground group-data-[state=over]/zone:-translate-y-0.5 group-data-[state=over]/zone:text-primary group-data-[state=over]/zone:shadow-[0_8px_20px_-8px_color-mix(in_oklab,var(--color-primary)_55%,transparent)] group-data-[state=reject]/zone:text-rose-700 dark:group-data-[state=reject]/zone:text-rose-400 group-data-[state=full]/zone:text-muted-foreground",
            layout === "compact" && "size-9 rounded-lg [&_svg]:size-[18px]",
            layout === "row" && "size-10 rounded-xl [&_svg]:size-5",
            layout === "stacked" && "size-11 rounded-xl [&_svg]:size-[22px]",
          )}
        >
          <span className="pointer-events-none absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
          <ZoneIcon stroke={1.75} />
        </span>
        <span
          className={cn(
            "flex min-w-0 flex-col",
            layout === "compact" && "flex-1 gap-0.5",
            layout === "row" && "items-start gap-0.5 text-start",
            layout === "stacked" && "items-center gap-1",
          )}
        >
          <span
            id={titleId}
            className={cn(
              "font-medium tracking-tight text-foreground group-data-[state=reject]/zone:text-rose-700 dark:group-data-[state=reject]/zone:text-rose-400",
              compact ? "truncate text-[13px] leading-5" : "text-sm",
            )}
          >
            {title}
          </span>
          <span
            id={hintId}
            className={cn(
              "text-xs leading-4 text-muted-foreground tabular-nums",
              compact && "truncate",
            )}
          >
            {subtitle}
          </span>
          {paste && (
            <span
              id={keyboardId}
              className={cn(
                "hidden text-xs leading-4 text-muted-foreground",
                layout === "stacked" && "group-focus-visible/zone:block",
              )}
            >
              {labels.keyboardHint}
            </span>
          )}
        </span>
        {compact && (
          <span
            aria-hidden="true"
            className="hidden h-7 shrink-0 items-center rounded-md border border-input bg-card px-2.5 text-xs font-medium text-foreground shadow-xs transition-colors duration-150 group-hover/zone:bg-muted group-data-[state=full]/zone:hidden group-data-[state=disabled]/zone:hidden @xs/file-upload:flex"
          >
            {labels.browse.charAt(0).toUpperCase() + labels.browse.slice(1)}
          </span>
        )}
      </div>

      {/* Validation */}
      <div aria-live="assertive" aria-atomic="true" data-slot="file-upload-rejections" className="empty:hidden">
        {rejections.length > 0 && (
          <div className="flex items-start gap-2.5 rounded-xl bg-[color-mix(in_oklab,var(--color-destructive)_4%,var(--color-card))] py-2.5 ps-3 pe-1.5 ring-1 ring-destructive/20 ring-inset motion-safe:animate-[file-upload-in_200ms_cubic-bezier(0.22,1,0.36,1)]">
            <IconAlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-rose-700 dark:text-rose-400" />
            <ul className="m-0 min-w-0 flex-1 list-none space-y-0.5 p-0 text-[13px] leading-5 text-rose-700 dark:text-rose-400">
              {(() => {
                const counted = rejections.filter((r) => r.reason === "count");
                const rest = rejections.filter((r) => r.reason !== "count");
                return [
                  ...rest.map((rejection, index) => (
                    <li key={`${rejection.file.name}-${index}`} className="break-words">
                      {rejection.message}
                    </li>
                  )),
                  counted.length > 0 && <li key="count">{counted[0].message}</li>,
                ];
              })()}
            </ul>
            <button
              type="button"
              aria-label={labels.dismiss}
              onClick={() => setRejections([])}
              className={cn(
                "-my-1 flex size-7 shrink-0 items-center justify-center rounded-md text-rose-700/80 transition-colors hover:bg-destructive/10 hover:text-rose-700 dark:text-rose-400/80 dark:hover:text-rose-400",
                focusRing,
              )}
            >
              <IconX aria-hidden="true" className="size-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Queue */}
      {files.length > 0 && (
        <div className={cn("flex min-w-0 flex-col", compact ? "gap-1.5" : "gap-2")}>
          {summaryVisible && (
            <div
              data-slot="file-upload-summary"
              className="flex min-h-7 flex-wrap items-center justify-between gap-x-3 ps-1 text-xs text-muted-foreground tabular-nums"
            >
              <span className="whitespace-nowrap">
                {uploadable.length
                  ? labels.summary(doneCount, files.length)
                  : labels.count(files.length, size(totalSize))}
              </span>
              <span className="-me-1 ms-auto flex shrink-0 items-center gap-0.5">
                {failedIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => retry(failedIds)}
                    disabled={disabled}
                    className={cn(
                      "inline-flex h-7 items-center gap-1.5 rounded-md px-1.5 font-medium text-foreground transition-colors duration-150 hover:bg-muted disabled:opacity-50",
                      focusRing,
                    )}
                  >
                    <IconRefresh aria-hidden="true" className="size-3.5" />
                    {labels.retryFailed}
                  </button>
                )}
                {doneCount > 0 && (
                  <button
                    type="button"
                    onClick={clearDone}
                    disabled={disabled}
                    className={cn(
                      "inline-flex h-7 items-center rounded-md px-1.5 transition-colors duration-150 hover:bg-muted hover:text-foreground disabled:opacity-50",
                      focusRing,
                    )}
                  >
                    {labels.clearDone}
                  </button>
                )}
              </span>
            </div>
          )}
          <ul
            aria-label={labels.files}
            data-slot="file-upload-list"
            className={cn("m-0 flex list-none flex-col p-0", compact ? "gap-1.5" : "gap-2")}
          >
            {files.map((item) => (
              <FileRow
                key={item.id}
                item={item}
                compact={compact}
                disabled={disabled}
                labels={labels}
                size={size}
                eta={item.status === "uploading" ? timing.current.get(item.id)?.eta : undefined}
                preview={broken.has(item.id) ? undefined : (item.previewUrl ?? previews.current.get(item.id))}
                onPreviewError={() => setBroken((set) => new Set(set).add(item.id))}
                icon={renderIcon?.(item)}
                onCancel={() => cancel(item)}
                onRetry={() => retry([item.id])}
                onRemove={() => remove(item)}
                canRetry={hasUpload && !!item.file}
              />
            ))}
          </ul>
        </div>
      )}

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Row                                                                       */
/* ------------------------------------------------------------------------ */

function FileRow({
  item,
  compact,
  disabled,
  labels,
  size,
  eta,
  preview,
  onPreviewError,
  icon,
  onCancel,
  onRetry,
  onRemove,
  canRetry,
}: {
  item: FileUploadItem;
  compact: boolean;
  disabled: boolean;
  labels: FileUploadLabels;
  size: (bytes: number) => string;
  eta?: number;
  preview?: string;
  onPreviewError: () => void;
  icon?: React.ReactNode;
  onCancel: () => void;
  onRetry: () => void;
  onRemove: () => void;
  canRetry: boolean;
}) {
  const { status } = item;
  const active = status === "queued" || status === "uploading";
  const percent = Math.round(item.progress * 100);
  const Icon = KIND_ICONS[kindOf(item.name, item.type)];

  const meta = (() => {
    switch (status) {
      case "uploading":
        return (
          <>
            <span className="font-medium text-foreground">{percent}%</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">
              {size(item.size * item.progress)} {labels.of} {size(item.size)}
            </span>
            {eta !== undefined && eta > 0.5 && (
              <>
                <span aria-hidden="true" className="@max-xs/file-upload:hidden">·</span>
                <span className="shrink-0 @max-xs/file-upload:hidden">{labels.timeLeft(eta)}</span>
              </>
            )}
          </>
        );
      case "queued":
        return (
          <>
            <IconClock aria-hidden="true" className="size-3.5 shrink-0" />
            <span>{labels.status.queued}</span>
            <span aria-hidden="true">·</span>
            <span>{size(item.size)}</span>
          </>
        );
      case "done":
        return (
          <>
            <IconCircleCheckFilled
              aria-hidden="true"
              className="size-3.5 shrink-0 text-emerald-600 motion-safe:animate-[file-upload-pop_360ms_cubic-bezier(0.22,1,0.36,1)] dark:text-emerald-400"
            />
            <span className="text-emerald-700 dark:text-emerald-400">{labels.status.done}</span>
            <span aria-hidden="true">·</span>
            <span>{size(item.size)}</span>
          </>
        );
      case "error":
        return (
          <>
            <IconAlertCircle aria-hidden="true" className="size-3.5 shrink-0 text-rose-700 dark:text-rose-400" />
            <span className="truncate text-rose-700 dark:text-rose-400" title={item.error}>
              {item.error || labels.status.error}
            </span>
          </>
        );
      case "canceled":
        return (
          <>
            <span>{labels.status.canceled}</span>
            <span aria-hidden="true">·</span>
            <span>{size(item.size)}</span>
          </>
        );
      default:
        return <span>{size(item.size)}</span>;
    }
  })();

  return (
    <li
      data-slot="file-upload-item"
      data-file-id={item.id}
      data-status={status}
      className={cn(
        "group/item relative flex min-w-0 items-center bg-card ring-1 ring-border/60 transition-[box-shadow,background-color] duration-200 ring-inset motion-safe:animate-[file-upload-in_240ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        "shadow-[0_1px_2px_rgb(0_0_0/0.03)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]",
        "data-[status=error]:bg-[color-mix(in_oklab,var(--color-destructive)_3%,var(--color-card))] data-[status=error]:ring-destructive/25",
        compact ? "gap-2.5 rounded-lg py-1.5 ps-1.5 pe-1" : "gap-3 rounded-xl py-2.5 ps-2.5 pe-2",
      )}
    >
      <span
        aria-hidden="true"
        data-slot="file-upload-thumbnail"
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden bg-muted/50 text-muted-foreground ring-1 ring-border/60 ring-inset",
          compact ? "size-8 rounded-md [&_svg]:size-4" : "size-10 rounded-lg [&_svg]:size-5",
          "[&_svg]:stroke-[1.75]",
        )}
      >
        {icon ??
          (preview ? (
            <>
              <img
                src={preview}
                alt=""
                draggable={false}
                onError={onPreviewError}
                className="size-full object-cover"
              />
              <span className="absolute inset-0 rounded-[inherit] ring-1 ring-foreground/10 ring-inset" />
            </>
          ) : (
            <>
              <span className="pointer-events-none absolute inset-x-1.5 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
              <Icon />
            </>
          ))}
      </span>

      <div className="min-w-0 flex-1">
        <MiddleTruncate
          text={item.name}
          className={cn(
            "font-medium tracking-tight text-foreground",
            compact ? "text-[13px] leading-5" : "text-sm leading-5",
            status === "canceled" && "text-muted-foreground",
          )}
        />
        <div
          className={cn(
            "flex min-w-0 items-center gap-1.5 text-xs leading-4 whitespace-nowrap text-muted-foreground tabular-nums",
            compact ? "mt-px" : "mt-0.5",
          )}
        >
          {meta}
        </div>
        {/* The bar collapses away once the upload settles. */}
        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="overflow-hidden">
            <div
              role="progressbar"
              aria-label={`${labels.status[status]} ${item.name}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              aria-hidden={!active || undefined}
              data-slot="file-upload-progress"
              className={cn(
                "relative overflow-hidden rounded-full bg-foreground/[0.07]",
                compact ? "mt-1.5 mb-0.5 h-1" : "mt-2 mb-0.5 h-1.5",
              )}
            >
              <div
                className="relative h-full overflow-hidden rounded-full bg-[linear-gradient(90deg,color-mix(in_oklab,var(--color-primary)_70%,transparent),var(--color-primary))] transition-[width] duration-300 ease-out motion-reduce:transition-none"
                style={{ width: `${status === "queued" ? 0 : Math.max(2, percent)}%` }}
              >
                {status === "uploading" && (
                  <span className="absolute inset-y-0 start-0 w-1/2 bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.45),transparent)] motion-safe:animate-[file-upload-sheen_1.6s_ease-in-out_infinite] motion-reduce:hidden dark:bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.25),transparent)]" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div data-slot="file-upload-actions" className="flex shrink-0 items-center gap-0.5 self-center">
        {active ? (
          <ActionButton label={labels.cancel(item.name)} onClick={onCancel} disabled={disabled}>
            <IconX />
          </ActionButton>
        ) : (
          <>
            {(status === "error" || status === "canceled") && canRetry && (
              <ActionButton label={labels.retry(item.name)} onClick={onRetry} disabled={disabled}>
                <IconRefresh />
              </ActionButton>
            )}
            <ActionButton label={labels.remove(item.name)} onClick={onRemove} disabled={disabled} tone="danger">
              {status === "idle" ? <IconX /> : <IconTrash />}
            </ActionButton>
          </>
        )}
      </div>
    </li>
  );
}
