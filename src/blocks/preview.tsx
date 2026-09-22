import {
  lazy,
  Suspense,
  useEffect,
  Component,
  type ReactNode,
  type ComponentType,
} from "react";
import { createRoot } from "react-dom/client";
import { BlockFrame } from "./frame";
import catalog from "./catalog.json";
import "../index.css";
import "../styles/workspace-base.css";
import "../styles/workspace-theme.css";
import "../styles/scenes.css";
import "../styles/showcase.css";
import "./preview.css";

const modules = import.meta.glob<{ default: ComponentType }>(
  "./generated/*.tsx",
);
const params = new URLSearchParams(location.search);
const id = params.get("id") ?? "";
const item = catalog.find((card) => card.id === id);
const Card = item ? lazy(modules[`./generated/${id}.tsx`]) : null;
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
          <BlockFrame>
            <Card />
          </BlockFrame>
        ) : (
          <p role="alert">Card not found.</p>
        )}
      </Suspense>
    </PreviewBoundary>
  );
}
createRoot(document.getElementById("root")!).render(<Preview />);
