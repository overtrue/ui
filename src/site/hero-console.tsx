import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IconScan } from "@tabler/icons-react";
import {
  RealtimeMonitor,
  useSimulatedTelemetry,
} from "@/registry/overtrue/realtime-monitor";
import { catalog, catalogPath } from "./catalog";

type Box = {
  key: string;
  compact: boolean;
  title: string;
  href: string;
  x: number;
  y: number;
  width: number;
  height: number;
  /** 0–1 position down the stage, so outlines appear as the scan passes. */
  depth: number;
};

const components = new Map(
  catalog
    .filter((item) => item.category !== "Blocks")
    .map((item) => [item.name as string, item]),
);

/** Outline each installable component inside the console and link to its page. */
function useInspectBoxes(
  root: React.RefObject<HTMLDivElement | null>,
  active: boolean,
) {
  const [boxes, setBoxes] = useState<Box[]>([]);
  useLayoutEffect(() => {
    const element = root.current;
    if (!active || !element) {
      setBoxes([]);
      return;
    }
    const measure = () => {
      const base = element.getBoundingClientRect();
      const found = Array.from(
        element.querySelectorAll<HTMLElement>("[data-slot]"),
      ).filter((node) => components.has(node.dataset.slot ?? ""));
      const outermost = found.filter(
        (node) => !found.some((other) => other !== node && other.contains(node)),
      );
      setBoxes(
        outermost.map((node, index) => {
          const rect = node.getBoundingClientRect();
          const item = components.get(node.dataset.slot!)!;
          return {
            key: `${item.name}-${index}`,
            compact: rect.height < 72,
            title: item.title,
            href: catalogPath(item),
            x: rect.left - base.left,
            y: rect.top - base.top,
            width: rect.width,
            height: rect.height,
            depth: Math.max(0, (rect.top - base.top) / base.height),
          };
        }),
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [root, active]);
  return boxes;
}

export function HeroConsole() {
  const stage = useRef<HTMLDivElement>(null);
  const [inspecting, setInspecting] = useState(false);
  const [paused, setPaused] = useState(false);
  const data = useSimulatedTelemetry({ paused: paused || inspecting });
  const boxes = useInspectBoxes(stage, inspecting);
  const names = new Set(boxes.map((box) => box.title));

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (event.key === "Escape") {
        setInspecting(false);
        return;
      }
      if (
        event.key.toLowerCase() !== "i" ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        target.closest("input, textarea, select, [contenteditable]")
      )
        return;
      setInspecting((value) => !value);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="hero-console" data-inspecting={inspecting}>
      <div className="hero-console-bar">
        <p>
          {inspecting ? (
            <>
              <strong>{names.size} components</strong> in this view. Select one
              to open its page.
            </>
          ) : (
            <>
              Live sample data. Everything inside is an installable component.
            </>
          )}
        </p>
        <button
          type="button"
          className="inspect-toggle"
          aria-pressed={inspecting}
          onClick={() => setInspecting((value) => !value)}
        >
          <IconScan size={16} aria-hidden="true" />
          Inspect
          <kbd aria-hidden="true">I</kbd>
        </button>
      </div>
      <div className="hero-console-stage" ref={stage}>
        <div className="hero-console-content" inert={inspecting}>
          <RealtimeMonitor
            data={data}
            paused={paused}
            onPausedChange={setPaused}
            className="rounded-none border-0"
          />
        </div>
        {inspecting && (
          <div className="inspect-layer">
            <div className="inspect-scan" aria-hidden="true" />
            {boxes.map((box) => (
              <Link
                key={box.key}
                to={box.href}
                className="inspect-box"
                data-compact={box.compact || undefined}
                style={{
                  left: box.x,
                  top: box.y,
                  width: box.width,
                  height: box.height,
                  animationDelay: `${Math.round(box.depth * 560)}ms`,
                }}
              >
                <span>{box.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
