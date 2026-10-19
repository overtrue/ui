import { useRef, useState } from "react";
import {
  FileUpload,
  type FileUploadContext,
  type FileUploadItem,
} from "@/registry/overtrue/file-upload";

/** A painted thumbnail, standing in for a real photo. */
function art(svg: string) {
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">${svg}</svg>`,
  )}`;
}

const heroArt = art(
  `<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b2d6e"/><stop offset=".55" stop-color="#d9637a"/><stop offset="1" stop-color="#f6b26b"/></linearGradient></defs><rect width="80" height="80" fill="url(#s)"/><circle cx="52" cy="50" r="13" fill="#ffd9a0" opacity=".95"/><path d="M0 60 L18 48 L30 56 L46 42 L62 54 L80 46 L80 80 L0 80Z" fill="#3a2550"/><path d="M0 68 L22 60 L40 66 L58 58 L80 64 L80 80 L0 80Z" fill="#24183a"/>`,
);
const productArt = art(
  `<defs><radialGradient id="b" cx=".5" cy=".35" r=".8"><stop offset="0" stop-color="#f3efe9"/><stop offset="1" stop-color="#d6cfc4"/></radialGradient><linearGradient id="p" x1="0" x2="1"><stop offset="0" stop-color="#2f6f5e"/><stop offset=".45" stop-color="#4f9c84"/><stop offset="1" stop-color="#2a5f51"/></linearGradient></defs><rect width="80" height="80" fill="url(#b)"/><ellipse cx="40" cy="66" rx="17" ry="3.5" fill="#000" opacity=".14"/><rect x="31" y="14" width="18" height="8" rx="2" fill="#c9a86a"/><rect x="27" y="21" width="26" height="45" rx="7" fill="url(#p)"/><rect x="31" y="36" width="18" height="14" rx="2" fill="#f3efe9" opacity=".85"/><rect x="30" y="24" width="3" height="36" rx="1.5" fill="#fff" opacity=".25"/>`,
);

// Upload speeds in seconds for each sample file; the product shot drops its first attempt.
const plans: Record<string, { seconds: number; failAt?: number }> = {
  "storefront-hero.jpg": { seconds: 1.8 },
  "lookbook-autumn-2026-final-selects.pdf": { seconds: 14 },
  "product-shot-07.png": { seconds: 3.2, failAt: 0.38 },
  "pricing-q4.xlsx": { seconds: 1.4 },
};

function sample(
  id: string,
  name: string,
  type: string,
  size: number,
  previewUrl?: string,
): FileUploadItem {
  return {
    id,
    // Placeholder bytes: the demo shows the real size below and never sends the file.
    file: typeof File === "undefined" ? undefined : new File(["demo"], name, { type }),
    name,
    type,
    size,
    previewUrl,
    status: "queued",
    progress: 0,
  };
}

const initialFiles = () => [
  sample("hero", "storefront-hero.jpg", "image/jpeg", 2_516_582, heroArt),
  sample("lookbook", "lookbook-autumn-2026-final-selects.pdf", "application/pdf", 19_503_513),
  sample("product", "product-shot-07.png", "image/png", 3_250_585, productArt),
  sample("pricing", "pricing-q4.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 225_280),
];

export default function Demo() {
  const [defaultFiles] = useState(initialFiles);
  // Files that already dropped once; their retry goes through.
  const failed = useRef(new Set<string>());

  const upload = (file: File, { onProgress, signal, item }: FileUploadContext) =>
    new Promise<{ url: string }>((resolve, reject) => {
      // Files you add yourself upload at a size-based pace.
      const plan = plans[file.name] ?? {
        seconds: Math.min(9, 1.2 + item.size / 2_500_000),
      };
      const failAt = failed.current.has(item.id) ? undefined : plan.failAt;
      let progress = 0;
      let last = performance.now();
      let timer = 0;
      const stop = () => {
        window.clearTimeout(timer);
        signal.removeEventListener("abort", abort);
      };
      const abort = () => {
        stop();
        reject(new DOMException("Upload canceled", "AbortError"));
      };
      const tick = () => {
        const now = performance.now();
        // Uneven chunks, the way real networks deliver them.
        progress = Math.min(1, progress + ((now - last) / 1000 / plan.seconds) * (0.55 + Math.random() * 0.9));
        last = now;
        if (failAt !== undefined && progress >= failAt) {
          stop();
          failed.current.add(item.id);
          reject(new Error(`Connection reset at ${Math.round(failAt * 100)}%`));
          return;
        }
        onProgress(progress);
        if (progress >= 1) {
          stop();
          resolve({ url: `https://cdn.acme.example/assets/${encodeURIComponent(file.name)}` });
          return;
        }
        timer = window.setTimeout(tick, 90 + Math.random() * 140);
      };
      signal.addEventListener("abort", abort);
      timer = window.setTimeout(tick, 120);
    });

  return (
    <FileUpload
      aria-label="Campaign assets"
      defaultFiles={defaultFiles}
      upload={upload}
      concurrency={3}
      accept="image/*,.pdf,.xlsx,.csv,.zip"
      maxSize={50 * 1024 * 1024}
      maxFiles={8}
      hint={"Images, PDF, sheets, or ZIP · 50\u00a0MB\u00a0max"}
    />
  );
}
