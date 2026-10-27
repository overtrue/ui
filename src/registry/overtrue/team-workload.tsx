import { useId } from "react";
import { IconAlertCircle } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export interface WorkloadMember {
  id: string;
  name: string;
  role?: string;
  image?: string;
  allocated: number;
  capacity: number;
  href?: string;
}

export function TeamWorkload({
  title = "Team workload",
  period = "This week",
  members,
  unit = "h",
  className,
}: {
  title?: string;
  period?: string;
  members: readonly WorkloadMember[];
  unit?: string;
  className?: string;
}) {
  const id = useId();
  return (
    <section
      data-slot="team-workload"
      aria-labelledby={id}
      className={cn(
        "min-w-0 rounded-xl border border-border bg-card text-card-foreground",
        className,
      )}
    >
      <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <h2 id={id} className="m-0 text-sm font-semibold">
          {title}
        </h2>
        <span className="text-xs text-muted-foreground">{period}</span>
      </header>
      <ul className="m-0 list-none divide-y divide-border px-5">
        {members.map((member) => {
          const allocated = Number.isFinite(member.allocated)
            ? Math.max(0, member.allocated)
            : 0;
          const capacity = Number.isFinite(member.capacity)
            ? Math.max(0, member.capacity)
            : 0;
          const over = allocated > capacity;
          return (
            <li key={member.id} data-slot="workload-member" className="py-4">
              <div className="mb-2.5 flex items-center gap-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    member.name
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((word) => word[0])
                      .join("")
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="m-0 text-xs font-medium">
                    {member.href ? (
                      <a
                        href={member.href}
                        className="rounded-sm text-inherit hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                      >
                        {member.name}
                      </a>
                    ) : (
                      member.name
                    )}
                  </p>
                  {member.role && (
                    <p className="m-0 mt-0.5 text-[11px] text-muted-foreground">
                      {member.role}
                    </p>
                  )}
                </div>
                <span
                  className={cn(
                    "shrink-0 text-xs tabular-nums",
                    over ? "text-destructive" : "text-muted-foreground",
                  )}
                >
                  {allocated}
                  <span className="text-muted-foreground">
                    {" "}
                    / {capacity}
                    {unit}
                  </span>
                </span>
              </div>
              <div
                role="meter"
                aria-label={`${member.name} workload`}
                aria-valuenow={allocated}
                aria-valuemin={0}
                aria-valuemax={Math.max(capacity, allocated, 1)}
                aria-valuetext={`${allocated} of ${capacity} ${unit}${over ? ", over capacity" : ""}`}
                className="h-1.5 overflow-hidden rounded-full bg-muted"
              >
                <div
                  className={cn(
                    "h-full rounded-full",
                    over ? "bg-destructive/75" : "bg-primary/70",
                  )}
                  style={{
                    width: `${capacity ? Math.min(100, (allocated / capacity) * 100) : allocated ? 100 : 0}%`,
                  }}
                />
              </div>
              {over && (
                <p className="mb-0 mt-2 flex items-center gap-1 text-[11px] text-destructive">
                  <IconAlertCircle size={12} aria-hidden="true" />
                  {allocated - capacity}
                  {unit} over capacity
                </p>
              )}
            </li>
          );
        })}
      </ul>
      {!members.length && (
        <p className="m-0 px-5 py-8 text-center text-sm text-muted-foreground">
          No workload assigned.
        </p>
      )}
    </section>
  );
}
