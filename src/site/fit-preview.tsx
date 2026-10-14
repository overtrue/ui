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
  /** "width" scales to the available width and crops tall content with a fade. */
  fit?: "contain" | "crop-tall" | "responsive" | "width";
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
    fit === "responsive" || fit === "width"
      ? height
      : size.available
        ? Math.min(height, size.available * 0.75)
        : height;
  // "width" keeps type at its real size: content reflows to the column and crops.
  const fluid = fit === "responsive" || fit === "width";
  const scale =
    fit === "width"
      ? 1
      : fit !== "responsive" && size.available && size.height
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
      data-cropped={
        fit === "width" && size.height * scale > viewportHeight + 1
          ? ""
          : undefined
      }
      style={{ height: viewportHeight }}
    >
      <div
        className="fit-preview-stage"
        style={{
          width: fluid ? "100%" : size.width * scale,
          height: Math.min(viewportHeight, size.height * scale),
        }}
      >
        <div
          ref={content}
          className="fit-preview-content"
          style={{
            width: fluid ? "100%" : width,
            transform: `scale(${scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
