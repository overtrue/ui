import { useState } from "react";
import {
  IconArrowUpRight,
  IconDownload,
  IconTrash,
  IconCheck,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/registry/overtrue/section-card";
import { RibbonCard } from "@/registry/overtrue/ribbon-card";
import { StatusEdgeCard } from "@/registry/overtrue/status-edge-card";
import { SearchField } from "@/registry/overtrue/search-field";
import { FilterTabs } from "@/registry/overtrue/filter-tabs";
import { ChartLegend } from "@/registry/overtrue/chart-legend";
import { Timeline } from "@/registry/overtrue/timeline";
import { TaskList, type TaskItem } from "@/registry/overtrue/task-list";
import { FileList } from "@/registry/overtrue/file-list";
import { MemberCard } from "@/registry/overtrue/member-card";
import { StatusBadge } from "@/registry/overtrue/status-badge";
import { ResourceProgress } from "@/registry/overtrue/resource-progress";
import type { ItemName } from "./catalog";

const initialTasks: TaskItem[] = [
  {
    id: "brief",
    title: "Review the project brief",
    due: "Today · Maya",
    progressText: "2/3",
    comments: 4,
    done: false,
  },
  {
    id: "assets",
    title: "Prepare the handover assets",
    due: "Tomorrow · Leo",
    progressText: "4/4",
    comments: 2,
    done: true,
  },
  {
    id: "review",
    title: "Share the final review",
    due: "Friday · Amara",
    progressText: "0/2",
    done: false,
  },
];
const files = [
  {
    id: "brief",
    name: "Project brief.txt",
    description: "Text document · 1 KB",
  },
  {
    id: "notes",
    name: "Research notes.txt",
    description: "Text document · 2 KB",
  },
  {
    id: "handover",
    name: "Final handover checklist.txt",
    description: "Text document · 1 KB",
  },
];

export function ReusableExample({
  name,
  expanded,
}: {
  name: ItemName;
  expanded: boolean;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [tasks, setTasks] = useState(initialTasks);
  const [visibleFiles, setVisibleFiles] = useState(files);
  const [saved, setSaved] = useState(false);
  switch (name) {
    case "section-card":
      return (
        <SectionCard
          title="Project handover"
          description="A shared view of the next milestone."
          actions={
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSaved(!saved)}
            >
              {saved ? (
                <>
                  <IconCheck data-icon="inline-start" /> Saved
                </>
              ) : (
                "Save view"
              )}
            </Button>
          }
        >
          <div className="flex flex-col gap-4">
            <p className="m-0 text-sm leading-6 text-muted-foreground">
              The final review is ready. Keep the project brief, assets, and
              delivery notes together.
            </p>
            <ResourceProgress
              label="Handover checklist"
              value={75}
              valueLabel="6 of 8 complete"
            />
            <p role="status" className="m-0 text-xs text-muted-foreground">
              {saved
                ? "View saved for this demo."
                : "Updated today by Maya Okafor"}
            </p>
          </div>
        </SectionCard>
      );
    case "ribbon-card":
      return (
        <div className="grid gap-5">
          <RibbonCard title="Studio plan" ribbon="Popular">
            <p className="m-0 text-sm leading-6 text-muted-foreground">
              Room for every project, and everyone working on it.
            </p>
            <p className="mb-0 mt-4 text-2xl font-semibold">
              $29{" "}
              <span className="text-xs font-normal text-muted-foreground">
                per member / month
              </span>
            </p>
          </RibbonCard>
          {expanded && (
            <RibbonCard
              title="Product update"
              ribbon="New release"
              ribbonPosition="text"
            >
              <p className="m-0 text-sm text-muted-foreground">
                A clearer view of your daily work.
              </p>
            </RibbonCard>
          )}
        </div>
      );
    case "status-edge-card":
      return (
        <div className="grid gap-5">
          <StatusEdgeCard
            title="All systems operational"
            tone="success"
            description="Last checked just now"
          >
            <p className="m-0 text-sm text-muted-foreground">
              Your workspace services are running normally.
            </p>
          </StatusEdgeCard>
          {expanded && (
            <>
              <StatusEdgeCard
                title="Payment needs attention"
                tone="danger"
                edge="start"
              >
                <p className="m-0 text-sm text-muted-foreground">
                  Update your payment method before the next billing cycle.
                </p>
              </StatusEdgeCard>
              <StatusEdgeCard
                title="Review scheduled"
                tone="info"
                edge="bottom"
              >
                <p className="m-0 text-sm text-muted-foreground">
                  The team review starts tomorrow at 10:00.
                </p>
              </StatusEdgeCard>
            </>
          )}
        </div>
      );
    case "search-field": {
      const names = ["Visitor experience", "Studio identity", "Member portal"];
      const shown = names.filter((value) =>
        value.toLowerCase().includes(query.trim().toLowerCase()),
      );
      return (
        <div className="flex flex-col gap-4">
          <SearchField
            label="Search projects"
            value={query}
            onValueChange={setQuery}
            placeholder="Find a project…"
          />
          <ul className="m-0 grid list-none gap-3 p-0 text-sm">
            {shown.map((value) => (
              <li
                key={value}
                className="rounded-md border border-border px-4 py-3"
              >
                {value}
              </li>
            ))}
          </ul>
          <p role="status" className="m-0 text-xs text-muted-foreground">
            {shown.length
              ? `${shown.length} ${shown.length === 1 ? "project" : "projects"} found`
              : "No projects match your search."}
          </p>
          {expanded && (
            <SearchField
              label="Archived projects"
              value=""
              onValueChange={() => {}}
              placeholder="Archived search unavailable"
              disabled
            />
          )}
        </div>
      );
    }
    case "filter-tabs": {
      const shown = initialTasks.filter(
        (task) =>
          filter === "all" || (filter === "complete" ? task.done : !task.done),
      );
      return (
        <div className="flex flex-col gap-4">
          <FilterTabs
            label="Task status"
            value={filter}
            onValueChange={setFilter}
            items={[
              { value: "all", label: "All tasks", count: 3 },
              { value: "active", label: "Active", count: 2 },
              { value: "complete", label: "Complete", count: 1 },
              { value: "archived", label: "Archived", disabled: true },
            ]}
          />
          <ul className="m-0 grid list-none gap-3 p-0 text-sm">
            {shown.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between gap-3 rounded-md border border-border px-4 py-3"
              >
                <span>{task.title}</span>
                <StatusBadge variant={task.done ? "success" : "info"}>
                  {task.done ? "Complete" : "Active"}
                </StatusBadge>
              </li>
            ))}
          </ul>
          <p className="m-0 text-xs text-muted-foreground" role="status">
            {shown.length} {shown.length === 1 ? "task" : "tasks"} shown
          </p>
        </div>
      );
    }
    case "chart-legend":
      return (
        <div className="flex flex-col gap-7">
          <ChartLegend
            label="Revenue comparison"
            layout="horizontal"
            items={[
              { label: "This month", color: "var(--color-primary)" },
              {
                label: "Last month",
                color: "var(--color-muted-foreground)",
                dashed: true,
              },
            ]}
          />
          <ChartLegend
            label="Storage breakdown"
            items={[
              {
                label: "Project files",
                color: "var(--color-primary)",
                value: "24.8 GB",
              },
              {
                label: "Shared documents",
                color: "var(--color-muted-foreground)",
                value: "12.4 GB",
              },
              {
                label: "Available",
                color: "var(--color-border)",
                value: "62.8 GB",
              },
            ]}
          />
        </div>
      );
    case "timeline":
      return (
        <Timeline
          items={[
            {
              id: "approved",
              title: "Final review approved",
              time: "10:24",
              dateTime: "2026-09-21T10:24:00Z",
              description: "Maya signed off on the visitor experience.",
              initials: "MO",
            },
            {
              id: "assets",
              title: "Assets uploaded",
              time: "09:48",
              description: "12 production files are ready for handover.",
            },
            {
              id: "started",
              title: "Project started",
              time: "Yesterday",
              description:
                "The brief and milestones were shared with the team.",
            },
          ]}
        />
      );
    case "task-list":
      return (
        <div className="flex flex-col gap-3">
          <TaskList
            title="Handover checklist"
            tasks={tasks}
            onTaskChange={(id, done) =>
              setTasks((current) =>
                current.map((task) =>
                  task.id === id ? { ...task, done } : task,
                ),
              )
            }
          />
          <p role="status" className="m-0 text-xs text-muted-foreground">
            {tasks.filter((task) => task.done).length} of {tasks.length} tasks
            complete
          </p>
        </div>
      );
    case "file-list":
      return (
        <div className="flex flex-col gap-5">
          <FileList
            items={visibleFiles.map((file) => ({
              ...file,
              actions: (
                <>
                  <Button asChild size="icon" variant="ghost">
                    <a
                      aria-label={`Download ${file.name}`}
                      download={file.name}
                      href={`data:text/plain;charset=utf-8,${encodeURIComponent(`${file.name}\n\nExample file from overtrue/ui.`)}`}
                    >
                      <IconDownload />
                    </a>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Remove ${file.name}`}
                    onClick={() =>
                      setVisibleFiles((current) =>
                        current.filter((item) => item.id !== file.id),
                      )
                    }
                  >
                    <IconTrash />
                  </Button>
                </>
              ),
            }))}
          />
          <div className="flex items-center justify-between gap-3">
            <p role="status" className="m-0 text-xs text-muted-foreground">
              {visibleFiles.length}{" "}
              {visibleFiles.length === 1 ? "file" : "files"} attached
            </p>
            {visibleFiles.length !== files.length && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setVisibleFiles(files)}
              >
                Reset files
              </Button>
            )}
          </div>
        </div>
      );
    case "member-card":
      return (
        <div className={expanded ? "grid gap-5 sm:grid-cols-2" : ""}>
          <MemberCard
            member={{
              id: "maya",
              name: "Maya Okafor",
              image: "/assets/overtrue/people/maya.svg",
            }}
            description="Design director"
            badge={<StatusBadge variant="success">Available</StatusBadge>}
            details={[
              { id: "city", label: "Location", value: "Lisbon, Portugal" },
              { id: "email", label: "Contact", value: "maya@acme.example" },
            ]}
            action={
              <Button asChild variant="outline" size="sm">
                <a href="/workspace/#/profile">
                  View profile
                  <IconArrowUpRight data-icon="inline-end" />
                </a>
              </Button>
            }
          />
          {expanded && (
            <MemberCard
              member={{ id: "leo", name: "Leo Nakamura" }}
              description="Product designer"
              badge={<StatusBadge variant="info">Focused</StatusBadge>}
              details={[
                { id: "city", label: "Location", value: "Kyoto, Japan" },
              ]}
              action={
                <Button asChild variant="outline" size="sm">
                  <a href="/workspace/#/users">
                    View team
                    <IconArrowUpRight data-icon="inline-end" />
                  </a>
                </Button>
              }
            />
          )}
        </div>
      );
    default:
      return null;
  }
}
