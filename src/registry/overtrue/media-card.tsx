import type { ComponentProps } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MediaCard({
  layout = "stacked",
  className,
  ...props
}: ComponentProps<typeof Card> & { layout?: "stacked" | "split" }) {
  return (
    <Card
      data-slot="media-card"
      className={cn(
        "group/media min-w-0 gap-0 overflow-hidden rounded-lg border bg-card py-0 text-card-foreground shadow-none",
        layout === "split" ? "grid md:grid-cols-2" : "flex flex-col",
        className,
      )}
      {...props}
    />
  );
}

export function MediaCardImage({
  alt,
  className,
  ...props
}: ComponentProps<"img"> & { alt: string }) {
  return (
    <img
      data-slot="media-card-image"
      loading="lazy"
      {...props}
      alt={alt}
      className={cn("aspect-[16/9] w-full object-cover", className)}
    />
  );
}

/** Wrap content and footer together when using the split layout. */
export function MediaCardBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="media-card-body"
      className={cn("flex min-w-0 flex-1 flex-col", className)}
      {...props}
    />
  );
}
export function MediaCardContent({
  className,
  ...props
}: ComponentProps<typeof CardContent>) {
  return (
    <CardContent
      className={cn("flex flex-1 flex-col gap-3 p-5", className)}
      {...props}
    />
  );
}
export function MediaCardFooter({
  className,
  ...props
}: ComponentProps<typeof CardFooter>) {
  return (
    <CardFooter
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-t p-5",
        className,
      )}
      {...props}
    />
  );
}
