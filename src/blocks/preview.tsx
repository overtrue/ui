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
import "../index.css";
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
function Preview() {
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
        {Card ? (
          <Card />
        ) : (
          <p role="alert">Card not found.</p>
        )}
      </Suspense>
    </PreviewBoundary>
  );
}
createRoot(document.getElementById("root")!).render(<Preview />);
