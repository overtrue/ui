import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/** Scale full layouts; let individual components reflow at their real size. */
export function FitPreview({
  children,
  width = 400,
  height = 300,
  fit = "contain",
}: {
  children: ReactNode;
  width?: number;
  height?: number;
  fit?: "contain" | "crop-tall" | "responsive";
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ available: 0, width, height: 0 });

  useLayoutEffect(() => {
    const outer = viewport.current!;
    const inner = content.current!;
    const measure = () => {
      const next = {
        available: outer.clientWidth,
        width: Math.max(width, inner.scrollWidth),
        height: inner.offsetHeight,
      };
      setSize((current) =>
        current.available === next.available &&
        current.width === next.width &&
        current.height === next.height
          ? current
          : next,
      );
    };
    const observer = new ResizeObserver(measure);
    observer.observe(outer);
    observer.observe(inner);
    measure();
    return () => observer.disconnect();
  }, [width]);

  // Keep narrow thumbnails proportional instead of leaving desktop-sized gaps.
  const viewportHeight =
    fit === "responsive"
      ? height
      : size.available
        ? Math.min(height, size.available * 0.75)
        : height;
  const scale =
    fit !== "responsive" && size.available && size.height
      ? Math.min(
          1,
          size.available / size.width,
          fit === "contain" || size.height <= size.width * 1.5
            ? viewportHeight / size.height
            : 1,
        )
      : 1;

  return (
    <div
      ref={viewport}
      className="fit-preview"
      style={{ height: viewportHeight }}
    >
      <div
        className="fit-preview-stage"
        style={{
          width: fit === "responsive" ? "100%" : size.width * scale,
          height: Math.min(viewportHeight, size.height * scale),
        }}
      >
        <div
          ref={content}
          className="fit-preview-content"
          style={{
            width: fit === "responsive" ? "100%" : width,
            transform: `scale(${scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
