"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import {
  IconCheck,
  IconArrowBackUp,
  IconLoader2,
  IconChecks,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ApprovalDecision = "approved" | "changes-requested";
export interface ApprovalRequest {
  id: string;
  title: string;
  description?: string;
  requestedBy: string;
  date: string;
  category?: string;
  status: "pending" | ApprovalDecision;
  detail?: ReactNode;
  href?: string;
}

function ApprovalRow({
  request,
  onDecision,
}: {
  request: ApprovalRequest;
  onDecision?: (id: string, decision: ApprovalDecision) => void | Promise<void>;
}) {
  const busy = useRef(false);
  const [pending, setPending] = useState<ApprovalDecision | null>(null);
  const [error, setError] = useState(false);
  const id = useId();
  async function decide(decision: ApprovalDecision) {
    if (!onDecision || busy.current || request.status !== "pending") return;
    busy.current = true;
    setPending(decision);
    setError(false);
    try {
      await onDecision(request.id, decision);
    } catch {
      setError(true);
    } finally {
      busy.current = false;
      setPending(null);
    }
  }
  return (
    <li
      data-slot="approval-request"
      className="flex flex-wrap items-center gap-x-5 gap-y-3 px-5 py-4"
    >
      <div className="min-w-0 flex-[1_1_220px]">
        <div className="mb-1.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span className="font-mono">{request.id}</span>
          {request.category && (
            <>
              <span aria-hidden="true">·</span>
              <span>{request.category}</span>
            </>
          )}
        </div>
        <h3 className="m-0 text-sm font-medium leading-5 [overflow-wrap:anywhere]">
          {request.href ? (
            <a
              href={request.href}
              className="rounded-sm text-inherit hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {request.title}
            </a>
          ) : (
            request.title
          )}
        </h3>
        {request.description && (
          <p className="m-0 mt-1 text-xs leading-5 text-muted-foreground">
            {request.description}
          </p>
        )}
        <p className="m-0 mt-2 text-xs text-muted-foreground">
          {request.requestedBy} <span aria-hidden="true">·</span> {request.date}
        </p>
        {request.detail && (
          <div className="mt-2 text-xs text-muted-foreground">
            {request.detail}
          </div>
        )}
        {error && (
          <p id={id} role="alert" className="m-0 mt-2 text-xs text-destructive">
            Couldn’t save your decision. Try again.
          </p>
        )}
      </div>
      {request.status === "pending" && onDecision ? (
        <div
          className="flex shrink-0 flex-wrap gap-2"
          aria-describedby={error ? id : undefined}
        >
          <Button
            size="sm"
            variant="outline"
            disabled={pending !== null}
            onClick={() => void decide("changes-requested")}
            aria-label={`Request changes to ${request.title}`}
          >
            <IconArrowBackUp size={14} aria-hidden="true" />
            Request changes
          </Button>
          <Button
            size="sm"
            disabled={pending !== null}
            onClick={() => void decide("approved")}
            aria-label={`Approve ${request.title}`}
          >
            {pending ? (
              <IconLoader2
                size={14}
                className="animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
            ) : (
              <IconCheck size={14} aria-hidden="true" />
            )}
            Approve
          </Button>
        </div>
      ) : (
        <span
          role="status"
          className={cn(
            "text-xs font-medium",
            request.status === "approved"
              ? "text-primary"
              : "text-muted-foreground",
          )}
        >
          {request.status === "approved"
            ? "Approved"
            : request.status === "changes-requested"
              ? "Changes requested"
              : "Awaiting approval"}
        </span>
      )}
    </li>
  );
}

export function ApprovalQueue({
  title = "Awaiting your approval",
  description,
  requests,
  onDecision,
  className,
}: {
  title?: string;
  description?: string;
  requests: readonly ApprovalRequest[];
  onDecision?: (id: string, decision: ApprovalDecision) => void | Promise<void>;
  className?: string;
}) {
  const id = useId();
  const pending = requests.filter(
    (request) => request.status === "pending",
  ).length;
  return (
    <section
      data-slot="approval-queue"
      aria-labelledby={id}
      className={cn(
        "min-w-0 overflow-hidden rounded-xl border border-border bg-card text-card-foreground",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
        <div>
          <h2 id={id} className="m-0 text-sm font-semibold">
            {title}
          </h2>
          {description && (
            <p className="m-0 mt-1 text-xs leading-5 text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
          {pending} pending
        </span>
      </header>
      {requests.length ? (
        <ul className="m-0 list-none divide-y divide-border p-0">
          {requests.map((request) => (
            <ApprovalRow
              key={request.id}
              request={request}
              onDecision={onDecision}
            />
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
          <IconChecks
            className="size-6 text-muted-foreground"
            aria-hidden="true"
          />
          <p className="m-0 text-sm font-medium">You’re all caught up</p>
          <p className="m-0 text-xs text-muted-foreground">
            New requests will appear here.
          </p>
        </div>
      )}
    </section>
  );
}
