"use client";
import { useEffect, useId, useRef, useState } from "react";
import { IconChevronDown, IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { SectionCard } from "./section-card";
import { AvatarStack, type TeamMember } from "./avatar-stack";
import { SearchField } from "./search-field";
import { cn } from "@/lib/utils";

export type TeamRole = "Owner" | "Admin" | "Member";
export interface AccessMember extends TeamMember {
  email: string;
  role: TeamRole;
}

/** Controlled permissions. The caller handles authorization and persistence. */
export function TeamAccess({
  members,
  onRoleChange,
  className,
}: {
  members: readonly AccessMember[];
  onRoleChange?: (
    id: string,
    role: Exclude<TeamRole, "Owner">,
  ) => void | Promise<void>;
  className?: string;
}) {
  const [query, setQuery] = useState("");
  const [roleStates, setRoleStates] = useState(
    new Map<string, "saving" | "failed">(),
  );
  const inFlight = useRef(new Set<string>());
  const focusAfterSave = useRef<{
    id: string;
    control: HTMLSelectElement;
    anchor: HTMLElement;
  } | null>(null);
  const search = useRef<HTMLInputElement>(null);
  const id = useId();
  useEffect(() => {
    const target = focusAfterSave.current;
    if (!target || roleStates.get(target.id) === "saving") return;
    if (
      target.control.isConnected &&
      document.activeElement === target.anchor
    ) {
      target.control.focus({ preventScroll: true });
    }
    focusAfterSave.current = null;
  }, [roleStates]);
  const normalizedQuery = query.trim().toLowerCase();
  const visible = members.filter((member) =>
    `${member.name} ${member.email}`.toLowerCase().includes(normalizedQuery),
  );
  async function changeRole(
    member: AccessMember,
    role: Exclude<TeamRole, "Owner">,
    control: HTMLSelectElement,
  ) {
    if (
      !onRoleChange ||
      role === member.role ||
      inFlight.current.has(member.id)
    )
      return;
    inFlight.current.add(member.id);
    // Keep the keyboard's place while the native select is disabled. Restore
    // it only if the user has not moved on to another control.
    if (document.activeElement === control && control.parentElement) {
      const anchor = control.parentElement;
      focusAfterSave.current = { id: member.id, control, anchor };
      anchor.focus({ preventScroll: true });
    }
    setRoleStates((current) => new Map(current).set(member.id, "saving"));
    let failed = false;
    try {
      await onRoleChange(member.id, role);
    } catch {
      failed = true;
    } finally {
      inFlight.current.delete(member.id);
      setRoleStates((current) => {
        const next = new Map(current);
        if (failed) next.set(member.id, "failed");
        else next.delete(member.id);
        return next;
      });
    }
  }
  return (
    <SectionCard
      title={
        <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <span>Team access</span>
          <span className="text-xs font-normal tabular-nums text-muted-foreground">
            {members.length} {members.length === 1 ? "person" : "people"}
          </span>
        </span>
      }
      description="The people who can access this workspace."
      className={cn("shadow-none", className)}
      contentClassName="p-0"
    >
      <div className="m-5">
        <SearchField
          ref={search}
          label="Search team members"
          placeholder="Search by name or email…"
          value={query}
          onValueChange={setQuery}
        />
      </div>
      <ul
        aria-label="Workspace members"
        className="m-0 list-none divide-y divide-border p-0"
      >
        {visible.map((member, index) => {
          const roleState = roleStates.get(member.id);
          return (
            <li
              key={member.id}
              className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 px-5 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto]"
            >
              <AvatarStack members={[member]} />
              <div className="min-w-0">
                <p className="m-0 text-sm font-medium [overflow-wrap:anywhere]">
                  {member.name}
                </p>
                <p className="m-0 mt-0.5 text-xs text-muted-foreground [overflow-wrap:anywhere]">
                  {member.email}
                </p>
              </div>
              {member.role === "Owner" || !onRoleChange ? (
                <span className="col-start-2 flex h-8 items-center text-xs text-muted-foreground sm:col-start-3 sm:row-start-1 sm:px-3">
                  {member.role}
                </span>
              ) : (
                <div
                  tabIndex={-1}
                  role="group"
                  aria-label={`Access for ${member.name}`}
                  className="relative col-start-2 w-fit rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:col-start-3 sm:row-start-1"
                >
                  <select
                    aria-label={`Role for ${member.name}`}
                    aria-busy={roleState === "saving"}
                    data-error={roleState === "failed" || undefined}
                    aria-describedby={
                      roleState === "failed"
                        ? `${id}-error-${index}`
                        : undefined
                    }
                    disabled={roleState === "saving"}
                    value={member.role}
                    onChange={(event) => {
                      const role = event.target.value;
                      if (role === "Admin" || role === "Member")
                        void changeRole(member, role, event.currentTarget);
                    }}
                    className="h-8 appearance-none rounded-md border border-input bg-card ps-3 pe-8 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-wait disabled:opacity-60 data-[error]:border-destructive"
                  >
                    <option>Admin</option>
                    <option>Member</option>
                  </select>
                  {roleState === "saving" ? (
                    <IconLoader2
                      aria-hidden="true"
                      className="pointer-events-none absolute end-2.5 top-1/2 size-3 -translate-y-1/2 animate-spin text-muted-foreground motion-reduce:animate-none"
                    />
                  ) : (
                    <IconChevronDown
                      aria-hidden="true"
                      className="pointer-events-none absolute end-2.5 top-1/2 size-3 -translate-y-1/2 text-muted-foreground"
                    />
                  )}
                </div>
              )}
              {onRoleChange && roleState === "failed" && (
                <p
                  id={`${id}-error-${index}`}
                  role="alert"
                  className="col-start-2 m-0 text-xs leading-5 text-destructive sm:col-span-2"
                >
                  Could not update this role. Please try again.
                </p>
              )}
              {roleState === "saving" && (
                <span role="status" className="sr-only">
                  Updating role for {member.name}.
                </span>
              )}
            </li>
          );
        })}
      </ul>
      {!visible.length && (
        <div role="status" className="px-5 pb-6 pt-2 text-center">
          <p className="m-0 text-sm font-medium">
            {members.length
              ? "No members match your search."
              : "No members yet."}
          </p>
          <p className="m-0 mt-1 text-xs leading-5 text-muted-foreground">
            {members.length
              ? "Try a different name or email address."
              : "Workspace members will appear here when they join."}
          </p>
          {query && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4 shadow-none"
              onClick={() => {
                setQuery("");
                search.current?.focus();
              }}
            >
              Clear search
            </Button>
          )}
        </div>
      )}
      <p className="m-0 border-t border-border px-5 py-3 text-xs leading-5 text-muted-foreground">
        Owners manage billing and workspace access. Admins manage projects and
        members.
      </p>
    </SectionCard>
  );
}
