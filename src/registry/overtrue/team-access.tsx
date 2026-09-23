"use client";
import { useState } from "react";
import { IconChevronDown, IconSearch } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { SectionCard } from "./section-card";
import { AvatarStack, type TeamMember } from "./avatar-stack";
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
  onRoleChange?: (id: string, role: Exclude<TeamRole, "Owner">) => void;
  className?: string;
}) {
  const [query, setQuery] = useState("");
  const visible = members.filter((member) =>
    `${member.name} ${member.email}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  return (
    <SectionCard
      title="Team access"
      description="The people who can access this workspace."
      className={cn("shadow-none", className)}
      contentClassName="p-0"
      actions={
        <span className="rounded-md bg-muted px-2 py-1 text-xs tabular-nums text-muted-foreground">
          {members.length} {members.length === 1 ? "person" : "people"}
        </span>
      }
    >
      <div className="relative m-5">
        <IconSearch
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          aria-label="Search team members"
          placeholder="Search by name or email…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="pl-9"
        />
      </div>
      <ul
        aria-label="Workspace members"
        className="m-0 list-none divide-y divide-border p-0"
      >
        {visible.map((member) => (
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
              <div className="relative col-start-2 w-fit sm:col-start-3 sm:row-start-1">
                <select
                  aria-label={`Role for ${member.name}`}
                  value={member.role}
                  onChange={(event) => {
                    const role = event.target.value;
                    if (role === "Admin" || role === "Member")
                      onRoleChange(member.id, role);
                  }}
                  className="h-8 appearance-none rounded-md border border-input bg-card pl-3 pr-8 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <option>Admin</option>
                  <option>Member</option>
                </select>
                <IconChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-muted-foreground"
                />
              </div>
            )}
          </li>
        ))}
      </ul>
      {!visible.length && (
        <p
          role="status"
          className="m-0 px-5 pb-6 text-center text-sm text-muted-foreground"
        >
          {members.length ? "No members match your search." : "No members yet."}
        </p>
      )}
      <p className="m-0 border-t border-border px-5 py-3 text-xs leading-5 text-muted-foreground">
        Owners manage billing and workspace access. Admins manage projects and
        members.
      </p>
    </SectionCard>
  );
}
