import { useEffect, type RefObject } from "react";

const REACH = 240;

/**
 * Light the borders of the cells nearest the pointer, the way the Spotlight card
 * does inside one component. One listener per grid; reads all rects, then writes.
 */
export function usePointerGlow(
  root: RefObject<HTMLElement | null>,
  selector: string,
) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const quiet = window.matchMedia(
      "(prefers-reduced-motion: reduce), (hover: none), (pointer: coarse)",
    );
    if (quiet.matches) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      frame = 0;
      const cells = Array.from(element.querySelectorAll<HTMLElement>(selector));
      const rects = cells.map((cell) => cell.getBoundingClientRect());
      cells.forEach((cell, index) => {
        const rect = rects[index];
        const dx = Math.max(rect.left - x, 0, x - rect.right);
        const dy = Math.max(rect.top - y, 0, y - rect.bottom);
        const glow = Math.max(0, 1 - Math.hypot(dx, dy) / REACH);
        cell.style.setProperty("--glow-x", `${x - rect.left}px`);
        cell.style.setProperty("--glow-y", `${y - rect.top}px`);
        cell.style.setProperty("--glow", glow.toFixed(3));
      });
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const leave = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      element
        .querySelectorAll<HTMLElement>(selector)
        .forEach((cell) => cell.style.setProperty("--glow", "0"));
    };
    element.addEventListener("pointermove", move, { passive: true });
    element.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
    };
  }, [root, selector]);
}
