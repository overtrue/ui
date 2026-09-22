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
        "relative isolate flex min-w-0 flex-col gap-0 overflow-hidden rounded-lg border bg-card py-0 text-card-foreground shadow-sm",
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
      className="pointer-events-none absolute inset-0 -z-10"
    >
      <img
        {...props}
        alt=""
        className={cn("size-full object-cover", className)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />
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
      className={cn(
        "pointer-events-none absolute -right-10 -top-10 -z-10 flex size-52 rotate-12 items-center justify-center rounded-full bg-primary/10 text-primary/20 [&>svg]:size-32",
        className,
      )}
    >
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
