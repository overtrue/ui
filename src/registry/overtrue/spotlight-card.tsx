"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/** A point inside a card or group, as 0–1 fractions of its width and height. */
export interface SpotlightPoint {
  x: number;
  y: number;
}

type SpotlightRegistry = {
  register: (element: HTMLElement) => () => void;
};

const SpotlightGroupContext = React.createContext<SpotlightRegistry | null>(
  null,
);

// How bright the parked light is compared with the light under the pointer.
const RESTING_OPACITY = 0.85;

/**
 * Drive the light for a set of cards from one element's pointer events. Positions
 * are written straight into CSS variables inside requestAnimationFrame, so moving
 * the pointer never re-renders React.
 */
function useSpotlight(
  target: React.RefObject<HTMLElement | null>,
  cards: () => Iterable<HTMLElement>,
  options: { enabled: boolean; rest?: SpotlightPoint },
) {
  const cardsRef = React.useRef(cards);
  cardsRef.current = cards;
  const refresh = React.useRef<() => void>(() => {});
  const restX = options.rest?.x;
  const restY = options.rest?.y;

  React.useEffect(() => {
    const element = target.current;
    if (!options.enabled || !element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const rest =
      restX != null && restY != null ? { x: restX, y: restY } : null;
    let frame = 0;
    let hovering = false;
    // Positions are relative to the tracked element so scrolling never skews them.
    let current: { x: number; y: number } | null = null;
    let goal: { x: number; y: number } | null = null;

    const restPoint = () =>
      rest
        ? {
            x: element.offsetWidth * rest.x,
            y: element.offsetHeight * rest.y,
          }
        : null;

    const paint = () => {
      if (!current) return;
      const origin = element.getBoundingClientRect();
      const level = hovering ? 1 : rest ? RESTING_OPACITY : 0;
      for (const card of cardsRef.current()) {
        const rect = card.getBoundingClientRect();
        const x = current.x - (rect.left - origin.left);
        const y = current.y - (rect.top - origin.top);
        const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
        card.style.setProperty("--spotlight-x", `${x.toFixed(1)}px`);
        card.style.setProperty("--spotlight-y", `${y.toFixed(1)}px`);
        card.style.setProperty("--spotlight-edge", String(level));
        card.style.setProperty(
          "--spotlight-fill",
          inside ? String(level) : "0",
        );
      }
    };

    const tick = () => {
      frame = 0;
      if (!goal) return;
      if (!current || reduced.matches) current = { ...goal };
      else {
        // Ease towards the goal: quick under the pointer, slower on the way back to rest.
        const ease = hovering ? 0.35 : 0.12;
        current = {
          x: current.x + (goal.x - current.x) * ease,
          y: current.y + (goal.y - current.y) * ease,
        };
        if (
          Math.abs(goal.x - current.x) < 0.5 &&
          Math.abs(goal.y - current.y) < 0.5
        )
          current = { ...goal };
      }
      paint();
      if (current.x !== goal.x || current.y !== goal.y)
        frame = requestAnimationFrame(tick);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const settle = () => {
      hovering = false;
      goal = restPoint();
      if (goal) {
        schedule();
        return;
      }
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      for (const card of cardsRef.current()) {
        card.style.setProperty("--spotlight-edge", "0");
        card.style.setProperty("--spotlight-fill", "0");
      }
    };

    const onMove = (event: PointerEvent) => {
      // Touch has no hover, and reduced motion keeps the light still.
      if (event.pointerType === "touch" || reduced.matches) return;
      const origin = element.getBoundingClientRect();
      const point = {
        x: event.clientX - origin.left,
        y: event.clientY - origin.top,
      };
      // Without a resting light there is nothing to glide from.
      if (!hovering && !rest) current = point;
      hovering = true;
      goal = point;
      schedule();
    };

    refresh.current = () => {
      if (hovering) {
        paint();
        return;
      }
      goal = restPoint();
      if (!goal) return;
      current = { ...goal };
      paint();
    };

    const observer = new ResizeObserver(() => refresh.current());
    observer.observe(element);
    element.addEventListener("pointermove", onMove, { passive: true });
    element.addEventListener("pointerleave", settle);
    element.addEventListener("pointercancel", settle);
    reduced.addEventListener("change", settle);
    refresh.current();

    return () => {
      observer.disconnect();
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", settle);
      element.removeEventListener("pointercancel", settle);
      reduced.removeEventListener("change", settle);
      if (frame) cancelAnimationFrame(frame);
      refresh.current = () => {};
    };
  }, [target, options.enabled, restX, restY]);

  return refresh;
}

export interface SpotlightCardProps extends React.ComponentProps<"div"> {
  /** Any CSS colour for the glow. Defaults to the theme's primary colour. */
  color?: string;
  /** Glow strength from 0 to 2. Defaults to 1. */
  intensity?: number;
  /** Radius of the surface glow in px. The border glow reaches 55% of it. */
  size?: number;
  /** Apply the standard p-6 padding. Turn off for full-bleed media or custom padding. */
  padding?: boolean;
  /** Keep a faint highlight along the top edge. */
  sheen?: boolean;
  /**
   * Park a softer light at this point while the pointer is away, as 0–1 fractions
   * of the card. Ignored inside a SpotlightGroup, which has its own.
   */
  restingLight?: SpotlightPoint;
}

const borderMask: React.CSSProperties = {
  padding: 1,
  WebkitMask:
    "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
};

/**
 * A card whose surface and 1px border catch a soft light that follows the pointer.
 * Wrap several in `SpotlightGroup` so neighbouring cards light up together.
 * Touch input and reduced motion keep the light still.
 */
function SpotlightCard({
  color = "var(--color-primary)",
  intensity = 1,
  size = 340,
  padding = true,
  sheen = true,
  restingLight,
  className,
  children,
  ref,
  ...props
}: SpotlightCardProps) {
  const local = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => local.current as HTMLDivElement);
  const group = React.useContext(SpotlightGroupContext);
  const strength = Math.min(2, Math.max(0, intensity));

  React.useEffect(() => {
    if (!group || !local.current) return;
    return group.register(local.current);
  }, [group]);

  useSpotlight(local, () => (local.current ? [local.current] : []), {
    enabled: !group,
    rest: restingLight,
  });

  const mix = (amount: number) =>
    `color-mix(in oklab, ${color} ${Math.round(Math.min(100, amount))}%, transparent)`;

  return (
    <div
      data-slot="spotlight-card"
      ref={local}
      className={cn(
        "relative isolate min-w-0 rounded-xl border bg-card text-card-foreground shadow-xs",
        padding && "p-6",
        className,
      )}
      {...props}
    >
      {sheen ? (
        <span
          aria-hidden="true"
          data-slot="spotlight-card-sheen"
          className="pointer-events-none absolute inset-x-[14%] -top-px -z-10 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${mix(strength * 36)}, transparent)`,
          }}
        />
      ) : null}
      <span
        aria-hidden="true"
        data-slot="spotlight-card-glow"
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] transition-opacity duration-500 ease-out motion-reduce:transition-none"
        style={{
          opacity: "var(--spotlight-fill, 0)",
          background: `radial-gradient(${size}px circle at var(--spotlight-x, 50%) var(--spotlight-y, 0px), ${mix(strength * 15)}, transparent 70%)`,
        }}
      />
      <span
        aria-hidden="true"
        data-slot="spotlight-card-edge"
        className="pointer-events-none absolute -inset-px -z-10 rounded-[inherit] transition-opacity duration-500 ease-out motion-reduce:transition-none"
        style={{
          ...borderMask,
          opacity: "var(--spotlight-edge, 0)",
          background: `radial-gradient(${Math.round(size * 0.55)}px circle at var(--spotlight-x, 50%) var(--spotlight-y, 0px), ${mix(strength * 100)}, ${mix(strength * 38)} 40%, transparent 100%)`,
        }}
      />
      {children}
    </div>
  );
}

export interface SpotlightGroupProps extends React.ComponentProps<"div"> {
  /**
   * Park a softer light at this point while the pointer is away, as 0–1 fractions
   * of the group, so the grid looks lit before anyone points at it.
   */
  restingLight?: SpotlightPoint;
}

/**
 * Shares one pointer listener between the spotlight cards inside it, so the light
 * spills onto neighbouring borders as the pointer crosses the gaps. Lay the cards
 * out with your own grid classes on this element.
 */
function SpotlightGroup({
  restingLight,
  className,
  children,
  ref,
  ...props
}: SpotlightGroupProps) {
  const local = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => local.current as HTMLDivElement);
  const cards = React.useRef(new Set<HTMLElement>());
  const refresh = useSpotlight(local, () => cards.current, {
    enabled: true,
    rest: restingLight,
  });
  const registry = React.useMemo<SpotlightRegistry>(
    () => ({
      register(element) {
        cards.current.add(element);
        refresh.current();
        return () => {
          cards.current.delete(element);
        };
      },
    }),
    [refresh],
  );

  return (
    <SpotlightGroupContext.Provider value={registry}>
      <div
        data-slot="spotlight-group"
        ref={local}
        className={cn("min-w-0", className)}
        {...props}
      >
        {children}
      </div>
    </SpotlightGroupContext.Provider>
  );
}

export { SpotlightCard, SpotlightGroup };
