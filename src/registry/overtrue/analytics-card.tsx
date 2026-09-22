"use client";
import type { ComponentProps } from "react";
import { Card as BaseCard } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Card sections for analytics compositions; isolated from legacy workspace card spacing.
export function Card({ className, ...props }: ComponentProps<typeof BaseCard>) {
  return (
    <BaseCard
      className={cn("flex flex-col gap-6 py-6", className)}
      {...props}
    />
  );
}
export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "relative grid grid-cols-[minmax(0,1fr)_auto] gap-2 px-6",
        className,
      )}
      {...props}
    />
  );
}
export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "font-semibold leading-none text-card-foreground",
        className,
      )}
      {...props}
    />
  );
}
export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}
export function CardAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-start-1 justify-self-end", className)}
      {...props}
    />
  );
}
export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("px-6", className)} {...props} />;
}
export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex items-center px-6", className)} {...props} />;
}
