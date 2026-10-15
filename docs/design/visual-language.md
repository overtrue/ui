# Instrument: the overtrue/ui visual language

Dashboards are precision instruments. Data is the light source; surfaces stay calm so it can glow. Depth comes from light and layering, not from heavy borders. Motion explains change and never decorates.

Every registry component carries this language in its own source, so an installed component looks exactly like its preview. Colors always come from shadcn semantic tokens, so any theme still applies.

In arbitrary CSS values (`color-mix()`, gradients, SVG fills, inline styles), use the Tailwind theme variables: `var(--color-primary)`, `var(--color-foreground)`, `var(--color-border)`, `var(--color-chart-1)` to `var(--color-chart-5)`. They always hold a complete color. The raw `--primary` and `--chart-1` tokens are complete colors in current shadcn projects but bare HSL triplets in older ones, including this site's workspace, so they break inside `color-mix()`.

## Surfaces

| Layer | Recipe |
| --- | --- |
| Card | `rounded-2xl border border-border/70 bg-card text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]` |
| Lit card (hero panels) | Card plus `bg-[radial-gradient(120%_70%_at_50%_-10%,color-mix(in_oklab,var(--color-primary)_9%,transparent),transparent_65%)]` |
| Inset panel | `rounded-xl bg-muted/40 ring-1 ring-inset ring-border/60` |
| Divider | `border-border/60` |
| Popover and tooltip | `rounded-xl border border-border/70 bg-popover/90 text-popover-foreground shadow-xl backdrop-blur-md` |

Card padding is 20px (`p-5`) with 16px between header and body. Dense variants use 16px.

## Type

| Role | Recipe |
| --- | --- |
| Card title | `text-sm font-semibold tracking-tight` |
| Description | `text-[13px] leading-5 text-muted-foreground` |
| Hero figure | `text-3xl font-semibold tracking-[-0.035em] tabular-nums`, unit in `text-base font-medium text-muted-foreground` |
| Figure | `text-xl font-semibold tracking-[-0.02em] tabular-nums` |
| Label | `text-xs text-muted-foreground`, sentence case |
| Axis tick | `text-[11px] fill-muted-foreground tabular-nums` |
| Identifier, timestamp, code | `font-mono text-xs` |

Numbers are always tabular. Units and currency symbols are quieter than the digits they qualify.

## Data marks

- **Lines** are 2px with round caps and joins. In dark mode they glow: `filter: drop-shadow(0 0 6px color-mix(in oklab, <series color> 50%, transparent))`.
- **Areas** use a vertical gradient from about 32% opacity at the line to 0% at the baseline.
- **Bars** have 4px rounded ends and a gentle gradient from the full color to 72%. Hovering one dims the others to 40%.
- **Points** are small solid dots with a halo ring at 18% opacity. Live endpoints pulse once per update.
- **Gridlines** use `color-mix(in oklab, var(--color-foreground) 7%, transparent)`, horizontal only by default.
- **Crosshairs** are 1px at 25% foreground, with a tooltip that lists a swatch, label, and right-aligned value per series.
- **Status colors** mean status only: emerald for good, amber for attention, rose or destructive for failure. Tinted pills use the color at 10% with a 6px dot.

## Motion

- Entrance: lines draw in, bars and areas rise from the baseline, and numbers roll. 600 to 800ms on `cubic-bezier(0.22, 1, 0.36, 1)`, staggered 20 to 40ms.
- Updates tween between values in 300 to 500ms, so live data glides.
- Hover and focus changes take 150ms.
- Under `prefers-reduced-motion`, everything renders in its final state immediately.

## Interaction

- Every chart has a hover readout and the same readout from the keyboard.
- Selected and focused items get `ring-2 ring-primary/30` with a faint primary glow.
- Header actions are 28px ghost icon buttons with accessible names.
- Root and key parts expose `data-slot` and state attributes so applications can restyle them.
