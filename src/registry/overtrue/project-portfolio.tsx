"use client";
import { useState, type ComponentProps, type ReactNode } from "react";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { SearchField } from "./search-field";
import { CardTitle, CardDescription } from "@/components/ui/card";
import {
  MediaCard,
  MediaCardImage,
  MediaCardBody,
  MediaCardContent,
  MediaCardFooter,
} from "./media-card";
import { ResourceProgress } from "./resource-progress";
import { AvatarStack, type TeamMember } from "./avatar-stack";
import { StatusBadge } from "./status-badge";
import { EmptyState } from "./empty-state";
import { cn } from "@/lib/utils";

export interface PortfolioProject {
  id: string;
  name: string;
  client: string;
  category: string;
  image: { src: string; alt: string };
  status: {
    label: string;
    variant: ComponentProps<typeof StatusBadge>["variant"];
  };
  progress: number;
  owner: TeamMember;
  href: string;
}
/** Owns only local search. Data, destinations and additional actions belong to the caller. */
export function ProjectPortfolio({
  projects,
  description,
  actions,
  className,
}: {
  projects: readonly PortfolioProject[];
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  const [query, setQuery] = useState("");
  const shown = projects.filter((project) =>
    `${project.name} ${project.client}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  return (
    <div data-slot="project-portfolio" className={cn("@container/portfolio space-y-5", className)}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-muted-foreground">
          {description ??
            `${projects.length} ${projects.length === 1 ? "project" : "projects"}`}
        </div>
        <div className="flex w-full flex-wrap items-center gap-3 @xl/portfolio:w-auto">
          <SearchField
            label="Find a project…"
            value={query}
            onValueChange={setQuery}
            placeholder="Find a project…"
            containerClassName="w-full @xl/portfolio:w-64"
          />
          {actions}
        </div>
      </div>
      <div role="status" className="sr-only">
        {shown.length} {shown.length === 1 ? "project" : "projects"} found
      </div>
      {shown.length ? (
        <div
          data-slot="portfolio-grid"
          className="grid gap-6 @3xl/portfolio:grid-cols-2 @6xl/portfolio:grid-cols-3"
        >
          {shown.map((project) => (
            <MediaCard key={project.id}>
              <MediaCardImage
                src={project.image.src}
                alt={project.image.alt}
                className="h-[185px]"
              />
              <MediaCardBody>
                <MediaCardContent>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">
                      {project.category}
                    </span>
                    <StatusBadge variant={project.status.variant}>
                      {project.status.label}
                    </StatusBadge>
                  </div>
                  <CardTitle className="m-0 text-base font-semibold leading-snug">
                    {project.name}
                  </CardTitle>
                  <CardDescription className="m-0 text-xs text-muted-foreground">
                    {project.client} · {project.id}
                  </CardDescription>
                  <ResourceProgress
                    label="Project progress"
                    value={project.progress}
                    className="mt-2"
                  />
                </MediaCardContent>
                <MediaCardFooter>
                  <div className="flex min-w-0 items-center gap-2">
                    <AvatarStack members={[project.owner]} />
                    <span className="text-xs font-medium">
                      {project.owner.name}
                    </span>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-border bg-card text-foreground hover:bg-muted"
                  >
                    <a href={project.href}>
                      View work <IconArrowUpRight aria-hidden="true" />
                    </a>
                  </Button>
                </MediaCardFooter>
              </MediaCardBody>
            </MediaCard>
          ))}
        </div>
      ) : (
        <EmptyState
          title={
            projects.length
              ? "No projects match this search."
              : "No projects yet"
          }
          description={
            projects.length
              ? "Try a different project or client name."
              : "Your projects will appear here once they are added."
          }
        />
      )}
    </div>
  );
}
