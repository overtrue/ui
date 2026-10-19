import { useState } from "react";
import { IconCheck } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileUpload,
  type FileUploadContext,
  type FileUploadItem,
} from "@/registry/overtrue/file-upload";

const receiptArt = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#5d6b7a"/><rect x="18" y="8" width="28" height="50" rx="2" fill="#f7f5f0" transform="rotate(-6 32 32)"/><g transform="rotate(-6 32 32)" fill="#b9b4aa"><rect x="22" y="15" width="14" height="2.5" rx="1"/><rect x="22" y="22" width="20" height="1.6" rx=".8"/><rect x="22" y="26" width="17" height="1.6" rx=".8"/><rect x="22" y="30" width="20" height="1.6" rx=".8"/><rect x="22" y="37" width="20" height="2.4" rx="1" fill="#6f6a62"/></g></svg>`,
)}`;

const initialFiles = (): FileUploadItem[] => [
  {
    id: "receipt-1",
    name: "receipt-blue-bottle-2026-10-14.pdf",
    type: "application/pdf",
    size: 188_416,
    status: "done",
    progress: 1,
  },
  {
    id: "receipt-2",
    // Placeholder bytes: the demo shows the real size and never sends the file.
    file:
      typeof File === "undefined"
        ? undefined
        : new File(["demo"], "IMG_4021.jpg", { type: "image/jpeg" }),
    name: "IMG_4021.jpg",
    type: "image/jpeg",
    size: 2_831_155,
    previewUrl: receiptArt,
    status: "queued",
    progress: 0,
  },
];

function upload(_file: File, { onProgress, signal, item }: FileUploadContext) {
  return new Promise<void>((resolve, reject) => {
    const seconds = Math.min(6, 1.6 + item.size / 1_200_000);
    const started = performance.now();
    const timer = window.setInterval(() => {
      const progress = Math.min(1, (performance.now() - started) / 1000 / seconds);
      onProgress(progress);
      if (progress >= 1) {
        window.clearInterval(timer);
        resolve();
      }
    }, 120);
    signal.addEventListener("abort", () => {
      window.clearInterval(timer);
      reject(new DOMException("Upload canceled", "AbortError"));
    });
  });
}

export default function Demo() {
  const [files, setFiles] = useState(initialFiles);
  const [submitted, setSubmitted] = useState(false);
  const pending = files.some(
    (file) => file.status === "queued" || file.status === "uploading",
  );
  const attached = files.filter((file) => file.status === "done").length;

  return (
    <form
      aria-labelledby="expense-title"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
      className="mx-auto w-full max-w-md rounded-2xl border border-border/70 bg-card text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]"
    >
      <header className="px-5 pt-5">
        <h3 id="expense-title" className="text-sm font-semibold tracking-tight">
          New expense
        </h3>
        <p className="text-[13px] leading-5 text-muted-foreground">
          Reimbursed with the next payroll run.
        </p>
      </header>

      <div className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-[1fr_9rem]">
          <div>
            <label htmlFor="expense-merchant" className="mb-1.5 block text-xs font-medium">
              Merchant
            </label>
            <Input id="expense-merchant" defaultValue="Blue Bottle Coffee" className="h-9" />
          </div>
          <div>
            <label htmlFor="expense-amount" className="mb-1.5 block text-xs font-medium">
              Amount
            </label>
            <div className="relative">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
              >
                $
              </span>
              <Input
                id="expense-amount"
                inputMode="decimal"
                defaultValue="48.20"
                className="h-9 ps-6 tabular-nums"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <span id="expense-receipts" className="text-xs font-medium">
              Receipts
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {files.length} of 2
            </span>
          </div>
          <FileUpload
            aria-labelledby="expense-receipts"
            variant="compact"
            files={files}
            onFilesChange={(next) => {
              setFiles(next);
              setSubmitted(false);
            }}
            upload={upload}
            maxFiles={2}
            accept="image/*,.pdf"
            maxSize={5 * 1024 * 1024}
          />
        </div>
      </div>

      <footer className="flex items-center justify-between gap-3 border-t border-border/60 px-5 py-4">
        <p aria-live="polite" className="min-w-0 truncate text-xs text-muted-foreground">
          {submitted ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <IconCheck aria-hidden="true" className="size-3.5" />
              Submitted for approval
            </span>
          ) : pending ? (
            "Waiting for receipts to finish uploading"
          ) : attached ? (
            `${attached} ${attached === 1 ? "receipt" : "receipts"} attached`
          ) : (
            "Attach at least one receipt"
          )}
        </p>
        <Button type="submit" size="sm" className="h-8 text-[13px]" disabled={pending || !attached}>
          Submit expense
        </Button>
      </footer>
    </form>
  );
}
