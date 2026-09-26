import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  IconArrowDown,
  IconArrowRight,
  IconPlayerPause,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { KpiCard } from "@/registry/overtrue/kpi-card";
import { BarList } from "@/registry/overtrue/bar-list";
import { SectionCard } from "@/registry/overtrue/section-card";
import { TaskList } from "@/registry/overtrue/task-list";
import { MemberCard } from "@/registry/overtrue/member-card";
import { StorageMeter } from "@/registry/overtrue/storage-meter";
import { FileList } from "@/registry/overtrue/file-list";
import { StatusBadge } from "@/registry/overtrue/status-badge";
import { componentCount, blockCount } from "./catalog";
import { siteOwner } from "./demo-data";

const specimens: Record<string, ReactNode> = {
  revenue: (
    <KpiCard
      label="Monthly revenue"
      value={36800}
      format="currency"
      delta={0.128}
      deltaLabel="vs. previous month"
      sparkline={[18, 22, 19, 27, 24, 30, 28, 35, 32, 37]}
    />
  ),
  subscribers: (
    <KpiCard
      label="Active subscribers"
      value={2420}
      delta={0.082}
      deltaLabel="128 new this month"
      sparkline={[12, 15, 14, 18, 17, 20, 19, 23, 22, 25]}
    />
  ),
  channels: (
    <SectionCard
      title="Top channels"
      description="Where your audience finds you"
    >
      <BarList
        data={[
          { name: "Direct", value: 4821 },
          { name: "Google", value: 3290 },
          { name: "GitHub", value: 2184 },
          { name: "Referrals", value: 1420 },
        ]}
      />
    </SectionCard>
  ),
  tasks: (
    <TaskList
      title="Today’s priorities"
      tasks={[
        {
          id: "review",
          title: "Review the new dashboard",
          due: "Today",
          comments: 4,
        },
        { id: "tokens", title: "Refine the color palette", done: true },
        {
          id: "release",
          title: "Ship something good",
          due: "Tomorrow",
          comments: 2,
        },
      ]}
    />
  ),
  member: (
    <MemberCard
      member={siteOwner}
      description="Building thoughtful things for the web."
      badge={<StatusBadge variant="success">Available</StatusBadge>}
      details={[
        { id: "team", label: "Team", value: "Design engineering" },
        { id: "projects", label: "Projects", value: "12 in progress" },
      ]}
    />
  ),
  storage: (
    <StorageMeter
      capacity={100}
      segments={[
        { label: "Documents", value: 24.5, color: "var(--chart-1)" },
        { label: "Images", value: 18.2, color: "var(--chart-4)" },
        { label: "Other", value: 8.4, color: "var(--chart-2)" },
      ]}
    />
  ),
  files: (
    <SectionCard
      title="Project files"
      actions={<StatusBadge>3 files</StatusBadge>}
    >
      <FileList
        items={[
          {
            id: "brief",
            name: "Project brief.pdf",
            description: "2.4 MB · Just updated",
          },
          {
            id: "system",
            name: "Design system.fig",
            description: "18.6 MB · Shared with the team",
          },
          {
            id: "notes",
            name: "Release notes.md",
            description: "12 KB · Ready for review",
          },
        ]}
      />
    </SectionCard>
  ),
  invite: (
    <SectionCard
      title="A little better, together."
      description="Invite someone to your workspace."
    >
      <div className="space-y-4">
        <label className="grid gap-2 text-sm font-medium">
          Email address
          <Input
            type="email"
            name="demo-email"
            value="maya@example.com"
            readOnly
          />
        </label>
        <Button className="w-full">
          Send invitation <IconArrowRight size={15} />
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Good work starts with a great team.
        </p>
      </div>
    </SectionCard>
  ),
  preferences: (
    <SectionCard
      title="Make it your own"
      description="A few small details. A better workspace."
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm">Email notifications</span>
          <Switch checked aria-label="Email notifications" />
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm">Weekly digest</span>
          <Switch checked={false} aria-label="Weekly digest" />
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm">Product updates</span>
          <Switch checked aria-label="Product updates" />
        </div>
      </div>
    </SectionCard>
  ),
  latency: (
    <KpiCard
      label="Average response time"
      value="124 ms"
      delta={-0.184}
      invertDelta
      deltaLabel="Fast feels a little better."
      sparkline={[35, 32, 34, 27, 29, 24, 26, 19, 21, 16]}
    />
  ),
};
const columns = [
  ["revenue", "invite", "channels", "storage"],
  ["tasks", "subscribers", "preferences", "files"],
  ["storage", "member", "latency", "invite"],
  ["channels", "preferences", "revenue", "tasks"],
  ["member", "files", "subscribers", "latency"],
];

export function HomeHero() {
  const hero = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    preference.addEventListener("change", updatePreference);
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    observer.observe(hero.current!);
    return () => {
      preference.removeEventListener("change", updatePreference);
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={hero}
      className="component-hero"
      aria-labelledby="home-title"
      data-paused={paused || !visible || reducedMotion}
    >
      <div className="component-wall" aria-hidden="true" inert>
        {columns.map((items, index) => (
          <div className="wall-column" key={index}>
            {[0, 1].map((copy) => (
              <div className="wall-group" key={copy}>
                {items.map((name) => (
                  <div className="wall-specimen" key={name}>
                    {specimens[name]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="wall-veil" aria-hidden="true" />
      <div className="wall-copy">
        <Link className="eyebrow-link" to="/docs">
          <span className="live-dot" />
          The admin collection for shadcn/ui
          <IconArrowRight size={13} aria-hidden="true" />
        </Link>
        <h1 id="home-title">
          Small pieces.
          <br />
          <span>Extraordinary together.</span>
        </h1>
        <p>
          Thoughtful components for your next dashboard.
          <br className="wall-copy-break" /> Copy them. Make them yours.
        </p>
        <div className="hero-actions">
          <Link className="site-button primary" to="/components">
            Explore components
            <IconArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link className="site-button" to="/docs">
            Get started
          </Link>
        </div>
        <p className="wall-copy-note">Open source. Yours to build on.</p>
      </div>
      <div className="wall-footer">
        <span className="wall-inventory">
          {componentCount} components <span>·</span> {blockCount} blocks
        </span>
        <a className="wall-discover" href="#workspace-preview">
          See them at work
          <IconArrowDown size={14} aria-hidden="true" />
        </a>
        <button
          type="button"
          className="wall-motion"
          onClick={() => setPaused(!paused)}
          disabled={reducedMotion}
          aria-pressed={paused}
          aria-label={
            reducedMotion
              ? "Animation disabled by system preference"
              : paused
                ? "Resume animation"
                : "Pause animation"
          }
        >
          {paused || reducedMotion ? (
            <IconPlayerPlay size={14} aria-hidden="true" />
          ) : (
            <IconPlayerPause size={14} aria-hidden="true" />
          )}
          {reducedMotion
            ? "Reduced motion"
            : paused
              ? "Resume motion"
              : "Pause motion"}
        </button>
      </div>
    </section>
  );
}
