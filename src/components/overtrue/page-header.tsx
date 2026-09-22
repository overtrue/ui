import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  pretitle?: string;
  breadcrumb?: string[];
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  pretitle,
  breadcrumb,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-3 flex flex-wrap items-center justify-between gap-2",
        className,
      )}
      {...props}
    >
      <div>
        <div className="page-pretitle">
          {pretitle ?? breadcrumb?.[0] ?? "Overview"}
        </div>
        <h1 className="page-title">{title}</h1>
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

export interface WelcomeMetric {
  label: string;
  value: string;
  trend?: string;
  direction?: "up" | "down" | "flat";
  progress?: number;
}

/** overtrue/ui .card.card-gradient welcome block */
export function WelcomeBanner({
  title,
  subtitle,
  metrics,
  className,
  illustration,
}: {
  title: string;
  subtitle: string;
  metrics?: WelcomeMetric[];
  className?: string;
  illustration?: React.ReactNode;
}) {
  return (
    <div className={cn("card-gradient", className)}>
      <div className="card-body">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="mb-2 text-xl font-semibold text-foreground">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
            {metrics?.length ? (
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {metrics.map((m) => (
                  <div key={m.label}>
                    <div className="metric-label mb-1">{m.label}</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-semibold text-foreground">
                        {m.value}
                      </span>
                      {m.trend ? (
                        <span
                          className={cn(
                            "text-xs font-medium",
                            m.direction === "up"
                              ? "text-[#16a34a]"
                              : m.direction === "down"
                                ? "text-[#dc2626]"
                                : "text-muted-foreground",
                          )}
                        >
                          {m.direction === "up"
                            ? "↑"
                            : m.direction === "down"
                              ? "↓"
                              : "—"}{" "}
                          {m.trend}
                        </span>
                      ) : null}
                    </div>
                    {typeof m.progress === "number" ? (
                      <div className="mt-2 h-1 w-full max-w-[160px] overflow-hidden rounded-full bg-[#e5e7eb]">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            m.direction === "down"
                              ? "bg-[#dc2626]"
                              : "bg-[#16a34a]",
                          )}
                          style={{ width: `${m.progress}%` }}
                        />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <div className="hidden shrink-0 sm:block">
            {illustration ?? (
              <div className="flex h-28 w-40 items-center justify-center rounded-lg bg-blue-soft">
                <svg viewBox="0 0 120 80" className="h-20 w-28" aria-hidden>
                  <circle cx="72" cy="28" r="14" fill="#066fd1" opacity="0.9" />
                  <rect
                    x="24"
                    y="42"
                    width="34"
                    height="26"
                    rx="6"
                    fill="#066fd1"
                    opacity="0.3"
                  />
                  <path
                    d="M30 40c4-12 16-16 24-8"
                    stroke="#066fd1"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
