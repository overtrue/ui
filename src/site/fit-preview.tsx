import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/** Fit a live preview into a thumbnail without changing its layout width. */
export function FitPreview({
  children,
  width = 400,
  height = 300,
}: {
  children: ReactNode;
  width?: number;
  height?: number;
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

  const scale =
    size.available && size.height
      ? Math.min(1, size.available / size.width, height / size.height)
      : 1;

  return (
    <div ref={viewport} className="fit-preview" style={{ height }}>
      <div
        className="fit-preview-stage"
        style={{ width: size.width * scale, height: size.height * scale }}
      >
        <div
          ref={content}
          className="fit-preview-content"
          style={{ width, transform: `scale(${scale})` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
