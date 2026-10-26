import {
  lazy,
  Suspense,
  useEffect,
  Component,
  type ReactNode,
  type ComponentType,
} from "react";
import { createRoot } from "react-dom/client";
import catalog from "./catalog.json";
import { loadStudio, themeVariables } from "../site/theme-tokens";
import { highContrast } from "../lib/theme-colors";
import "@fontsource-variable/mona-sans/wdth.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
import "./registry/preview.css";
import "./preview.css";

const modules = import.meta.glob<{ default: ComponentType }>(
  "./registry/*.tsx",
);
const params = new URLSearchParams(location.search);
const id = params.get("id") ?? "";
const item = catalog.find((card) => card.id === id);
const Card = item ? lazy(modules[`./registry/${id}.tsx`]) : null;
class PreviewBoundary extends Component<
  { children: ReactNode },
  { error: string }
> {
  state = { error: "" };
  static getDerivedStateFromError(error: Error) {
    return { error: error.message };
  }
  render() {
    return this.state.error ? (
      <p role="alert">Unable to render this card: {this.state.error}</p>
    ) : (
      this.props.children
    );
  }
}
// Card CSS has scoped defaults, so apply the shared palette at that scope too.
function applyPreviewTheme() {
  const theme = loadStudio();
  const mode = params.get("theme") === "dark" ? "dark" : "light";
  const vars = Object.entries(themeVariables(theme, mode))
    .map(([key, value]) => `${key}:${value}`)
    .join(";");
  const id = "card-preview-theme";
  let style = document.getElementById(id) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = id;
    document.head.append(style);
  }
  style.textContent = `:root:root, :root .overtrue-block.overtrue-block {${vars};--font-sans:"Mona Sans Variable",sans-serif;--font-mono:"JetBrains Mono Variable",monospace;}`;
  document.documentElement.dataset.contrast = highContrast(theme.contrast)
    ? "high"
    : "standard";
}
applyPreviewTheme();

function Preview() {
  useEffect(() => {
    const media = matchMedia("(prefers-contrast: more)");
    const storage = (event: StorageEvent) => {
      if (event.key === "overtrue-theme-studio" || event.key === null)
        applyPreviewTheme();
    };
    window.addEventListener("storage", storage);
    media.addEventListener("change", applyPreviewTheme);
    return () => {
      window.removeEventListener("storage", storage);
      media.removeEventListener("change", applyPreviewTheme);
    };
  }, []);
  useEffect(() => {
    document.title = `${item?.title ?? "Card not found"} — overtrue/ui`;
    const notify = () =>
      window.parent.postMessage(
        {
          type: "overtrue-card-size",
          id,
          height: Math.ceil(
            document.getElementById("root")!.getBoundingClientRect().height,
          ),
        },
        location.origin,
      );
    const observer = new ResizeObserver(notify);
    observer.observe(document.getElementById("root")!);
    return () => observer.disconnect();
  }, []);
  return (
    <PreviewBoundary>
      <Suspense fallback={<p role="status">Loading card…</p>}>
        {Card ? <Card /> : <p role="alert">Card not found.</p>}
      </Suspense>
    </PreviewBoundary>
  );
}
createRoot(document.getElementById("root")!).render(<Preview />);
