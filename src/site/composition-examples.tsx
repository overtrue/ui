import { useState } from "react";
import { IconGhost, IconArrowUpRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription } from "@/components/ui/card";
import {
  FeatureCard,
  FeatureCardBackground,
  FeatureCardDecoration,
  FeatureCardContent,
} from "@/registry/overtrue/feature-card";
import {
  MediaCard,
  MediaCardImage,
  MediaCardBody,
  MediaCardContent,
  MediaCardFooter,
} from "@/registry/overtrue/media-card";
import { DetailList } from "@/registry/overtrue/detail-list";
import { StatusBadge } from "@/registry/overtrue/status-badge";
import { ResourceProgress } from "@/registry/overtrue/resource-progress";
import {
  UptimeHistory,
  type UptimeSample,
} from "@/registry/overtrue/uptime-history";
import { MetricGroup, MetricGroupItem } from "@/registry/overtrue/metric-group";
import { ProjectPortfolio } from "@/registry/overtrue/project-portfolio";
import { ServiceStatus } from "@/registry/overtrue/service-status";
import { portfolioProjects } from "./demo-data";
import type { ItemName } from "./catalog";

const history = (length: number): UptimeSample[] =>
  Array.from({ length }, (_, i) => ({
    id: String(i),
    label: `${length - i} days ago`,
    status: i === 3 ? "degraded" : "operational",
  }));
export function CompositionExample({ name }: { name: ItemName }) {
  const [period, setPeriod] = useState(30);
  switch (name) {
    case "feature-card":
      return (
        <div className="grid gap-5">
          <FeatureCard>
            <FeatureCardDecoration>
              <IconGhost stroke={1.5} />
            </FeatureCardDecoration>
            <FeatureCardContent>
              <CardTitle className="m-0 text-2xl leading-8 font-semibold tracking-[-0.025em] text-balance">
                A little room for your next idea.
              </CardTitle>
              <CardDescription className="m-0 max-w-lg text-sm leading-6 text-pretty text-muted-foreground">
                Bring the brief, the references, and the people together. Start
                with a clear next step.
              </CardDescription>
              <Button asChild>
                <a href="/workspace/#/wizard">
                  Start a project <IconArrowUpRight />
                </a>
              </Button>
            </FeatureCardContent>
          </FeatureCard>
          <FeatureCard className="min-h-64 justify-end text-white">
            <FeatureCardBackground src="/assets/overtrue/studio-space.png" />
            <FeatureCardContent>
              <h3 className="m-0 text-2xl leading-8 font-semibold tracking-[-0.025em] text-balance">
                Space for focused work.
              </h3>
              <p className="m-0 max-w-lg text-sm leading-6 text-pretty text-white/80">
                An image background uses the same content slot, with a contrast
                overlay and room for actions.
              </p>
              <Button asChild variant="secondary">
                <a href="/workspace/#/open-positions">
                  Meet the studio <IconArrowUpRight />
                </a>
              </Button>
            </FeatureCardContent>
          </FeatureCard>
        </div>
      );
    case "media-card":
      return (
        <div className="grid gap-5">
          <MediaCard>
            <MediaCardImage
              src="/assets/overtrue/project-01.webp"
              alt="Sculptural wayfinding in a contemporary cultural center"
              className="max-h-52"
            />
            <MediaCardBody>
              <MediaCardContent>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">
                    Culture venue · PRJ-241
                  </span>
                  <StatusBadge variant="info" live>
                    In progress
                  </StatusBadge>
                </div>
                <div>
                  <CardTitle className="m-0 text-base leading-6 font-semibold tracking-tight">
                    Visitor experience
                  </CardTitle>
                  <CardDescription className="m-0 mt-0.5 text-[13px] leading-5 text-muted-foreground">
                    An inviting first impression, from street to screen.
                  </CardDescription>
                </div>
              </MediaCardContent>
              <MediaCardFooter>
                <span className="text-xs text-muted-foreground">
                  Experience design
                </span>
                <Button asChild variant="outline" size="sm">
                  <a href="/workspace/#/datagrid">
                    View brief <IconArrowUpRight />
                  </a>
                </Button>
              </MediaCardFooter>
            </MediaCardBody>
          </MediaCard>
          <MediaCard layout="split">
            <MediaCardImage
              src="/assets/overtrue/material-study.png"
              alt="Paper and material samples"
              className="h-full min-h-52"
            />
            <MediaCardBody>
              <MediaCardContent className="justify-center">
                <CardTitle className="m-0 text-lg leading-7 font-semibold tracking-[-0.02em]">
                  Made with care.
                </CardTitle>
                <CardDescription className="m-0 text-sm leading-6 text-pretty text-muted-foreground">
                  Use the split composition for editorial stories, onboarding,
                  and featured projects.
                </CardDescription>
              </MediaCardContent>
            </MediaCardBody>
          </MediaCard>
        </div>
      );
    case "detail-list":
      return (
        <div className="mx-auto w-full max-w-md rounded-2xl border border-border/70 bg-card p-5 text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]">
          <DetailList
            divided
            items={[
              { id: "owner", label: "Owner", value: "Maya Okafor" },
              { id: "client", label: "Client", value: "Culture venue" },
              {
                id: "status",
                label: "Status",
                value: (
                  <StatusBadge variant="info" live>
                    In progress
                  </StatusBadge>
                ),
              },
              {
                id: "email",
                label: "Contact",
                value: (
                  <a
                    className="text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
                    href="mailto:team@acme.example"
                  >
                    team@acme.example
                  </a>
                ),
              },
              { id: "due", label: "Delivery", value: "October 12, 2026" },
            ]}
          />
        </div>
      );
    case "resource-progress":
      return (
        <div className="space-y-6">
          <ResourceProgress
            label="Asset storage"
            value={42.8}
            max={100}
            valueLabel="42.8 of 100 GB"
          />
          <ResourceProgress
            label="Member seats"
            value={8}
            max={12}
            valueLabel="8 of 12 seats"
          />
          <ResourceProgress label="Project delivery" value={72} />
        </div>
      );
    case "uptime-history":
      return (
        <UptimeHistory
          label="Workspace API availability"
          samples={history(30)}
          startLabel="30 days ago"
          endLabel="Today · 99.98%"
        />
      );
    case "metric-group":
      return (
        <MetricGroup>
          <MetricGroupItem
            label="Revenue"
            value="$36,800"
            context="Up 12.8% this month"
          />
          <MetricGroupItem
            label="Active projects"
            value="24"
            context="Across six clients"
          />
          <MetricGroupItem
            label="Open invoices"
            value="8"
            context="$12,400 outstanding"
          />
          <MetricGroupItem
            label="Team members"
            value="12"
            context="Four seats available"
          />
        </MetricGroup>
      );
    case "project-portfolio":
      return (
        <ProjectPortfolio
          description="Acme Studio · Current projects"
          projects={portfolioProjects}
        />
      );
    case "service-status":
      return (
        <ServiceStatus
          description={`Observed over the last ${period} days`}
          actions={
            <div className="flex gap-2" aria-label="History period">
              {[7, 30, 90].map((days) => (
                <Button
                  key={days}
                  size="sm"
                  variant={days === period ? "default" : "outline"}
                  className={
                    days === period
                      ? undefined
                      : "border-border bg-card text-foreground hover:bg-muted"
                  }
                  aria-pressed={days === period}
                  onClick={() => setPeriod(days)}
                >
                  {days} days
                </Button>
              ))}
            </div>
          }
          services={["Workspace API", "Asset delivery", "Preview builds"].map(
            (service) => ({
              id: service,
              name: service,
              status: "operational",
              samples: history(period),
              startLabel: `${period} days ago`,
              endLabel: "Today",
            }),
          )}
        >
          <p className="m-0 border-t pt-4 text-xs text-muted-foreground">
            Sample service records. Connect your own monitoring data.
          </p>
        </ServiceStatus>
      );
    default:
      return null;
  }
}
