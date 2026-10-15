import type { ComponentProps } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** Compose with CardTitle, CardDescription and your own actions. */
export function FeatureCard({
  className,
  ...props
}: ComponentProps<typeof Card>) {
  return (
    <Card
      data-slot="feature-card"
      className={cn(
        "group/feature relative isolate flex min-w-0 flex-col gap-0 overflow-hidden rounded-2xl border border-border/70 bg-card py-0 text-card-foreground ring-0",
        "bg-[radial-gradient(120%_70%_at_50%_-10%,color-mix(in_oklab,var(--color-primary)_9%,transparent),transparent_65%)]",
        "shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]",
        className,
      )}
      {...props}
    />
  );
}

/** Decorative only: keep meaningful illustrations in MediaCard instead. */
export function FeatureCardBackground({
  className,
  ...props
}: Omit<ComponentProps<"img">, "alt" | "children">) {
  return (
    <div
      aria-hidden="true"
      data-slot="feature-card-background"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <img
        {...props}
        alt=""
        className={cn(
          "size-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/feature:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/feature:scale-100",
          className,
        )}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/15" />
      <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgb(255_255_255/0.12)]" />
    </div>
  );
}

/** Pass a decorative icon or illustration as children; no interactive content. */
export function FeatureCardDecoration({
  className,
  children,
}: Pick<ComponentProps<"div">, "className" | "children">) {
  return (
    <div
      aria-hidden="true"
      data-slot="feature-card-decoration"
      className={cn(
        "pointer-events-none absolute -top-10 -right-10 -z-10 flex size-52 rotate-12 items-center justify-center rounded-full text-primary/25 [&>svg]:size-32",
        "bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--color-primary)_15%,transparent),color-mix(in_oklab,var(--color-primary)_6%,transparent)_55%,transparent_71%)]",
        className,
      )}
    >
      <span className="absolute inset-0 rounded-full border border-current opacity-30" />
      <span className="absolute inset-7 rounded-full border border-current opacity-40" />
      <span className="absolute inset-14 rounded-full bg-current opacity-10 blur-xl" />
      {children}
    </div>
  );
}

export function FeatureCardContent({
  className,
  ...props
}: ComponentProps<typeof CardContent>) {
  return (
    <CardContent
      className={cn("flex flex-col items-start gap-4 p-6 sm:p-8", className)}
      {...props}
    />
  );
}
