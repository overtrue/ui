"use client";
import { useRef, useState, type ReactNode } from "react";
import { IconPlug, IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { SectionCard } from "./section-card";
import { StatusBadge } from "./status-badge";

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon?: ReactNode;
  connected: boolean;
  account?: string;
}

export interface IntegrationListProps {
  integrations: readonly Integration[];
  onConnectionChange?: (id: string, connected: boolean) => void | Promise<void>;
  className?: string;
}

function IntegrationRow({
  integration,
  onConnectionChange,
}: {
  integration: Integration;
  onConnectionChange: IntegrationListProps["onConnectionChange"];
}) {
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const inFlight = useRef(false);
  const { id, name, description, icon, connected, account } = integration;
  const action = connected ? "Disconnect" : "Connect";

  async function changeConnection() {
    if (!onConnectionChange || inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    setFailed(false);
    try {
      await onConnectionChange(id, !connected);
    } catch {
      setFailed(true);
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  return (
    <li className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-start gap-x-3 gap-y-3 py-5 sm:grid-cols-[2.25rem_minmax(0,1fr)_auto]">
      <span
        aria-hidden="true"
        className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-foreground [&_svg]:size-5"
      >
        {icon ?? <IconPlug />}
      </span>
      <div className="min-w-0">
        <p className="m-0 text-sm font-medium leading-5 [overflow-wrap:anywhere]">
          {name}
        </p>
        <p className="m-0 mt-1 text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
          {description}
        </p>
        <div
          aria-live="polite"
          className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"
        >
          <StatusBadge variant={connected ? "success" : "neutral"}>
            {connected ? "Connected" : "Not connected"}
          </StatusBadge>
          {connected && account && (
            <span className="min-w-0 [overflow-wrap:anywhere]">{account}</span>
          )}
        </div>
        {failed && (
          <p
            role="alert"
            className="m-0 mt-2 text-xs leading-5 text-destructive"
          >
            Could not update {name}. Please try again.
          </p>
        )}
      </div>
      {onConnectionChange && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="col-start-2 w-fit shadow-none sm:col-start-3"
          aria-label={`${action} ${name}`}
          aria-busy={pending}
          disabled={pending}
          onClick={changeConnection}
        >
          {pending && (
            <IconLoader2
              aria-hidden="true"
              className="size-4 animate-spin motion-reduce:animate-none"
            />
          )}
          {pending ? "Updating…" : action}
        </Button>
      )}
    </li>
  );
}

/** A controlled workspace integrations block; the caller owns connection state. */
export function IntegrationList({
  integrations,
  onConnectionChange,
  className,
}: IntegrationListProps) {
  const connectedCount = integrations.filter(
    (integration) => integration.connected,
  ).length;
  return (
    <SectionCard
      title={
        <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <span>Integrations</span>
          <span className="text-xs font-normal text-muted-foreground">
            {connectedCount} connected
          </span>
        </span>
      }
      description="Connect the tools your team works with."
      className={className}
      contentClassName="p-0"
    >
      {integrations.length ? (
        <ul className="m-0 list-none divide-y divide-border px-5">
          {integrations.map((integration) => (
            <IntegrationRow
              key={integration.id}
              integration={integration}
              onConnectionChange={onConnectionChange}
            />
          ))}
        </ul>
      ) : (
        <p className="m-0 px-5 py-10 text-center text-sm text-muted-foreground">
          No integrations available yet.
        </p>
      )}
    </SectionCard>
  );
}
