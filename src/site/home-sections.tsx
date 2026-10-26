import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  IconArrowRight,
  IconArrowUpRight,
  IconCheck,
  IconPlus,
} from "@tabler/icons-react";
import { Dashboard, dashboardRevenue } from "@/registry/overtrue/dashboard";
import { MetricChart } from "@/registry/overtrue/metric-chart";
import { StatCard } from "@/registry/overtrue/stat-card";
import { TaskList } from "@/registry/overtrue/task-list";
import { ResourceProgress } from "@/registry/overtrue/resource-progress";
import { AvatarStack } from "@/registry/overtrue/avatar-stack";
import { StatusBadge } from "@/registry/overtrue/status-badge";
import { NumberTicker } from "@/registry/overtrue/number-ticker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandMark } from "@/components/brand-mark";
import workspacePages from "@/data/workspace/pages.json";
import {
  catalog,
  catalogPath,
  componentCount,
  blockCount,
  cardCount,
} from "./catalog";
import { siteOwner, portfolioProjects } from "./demo-data";
import { CopyButton, HighlightedCode } from "./code";
import { FeaturedBlocks, Questions } from "./home-details";
import { HeroConsole } from "./hero-console";
import { ContrastControl, useStudio } from "./theme-studio";
import {
  ACCENT_PRESETS,
  exportCss,
  onColor,
  themeVariables,
  type StudioTheme,
} from "./theme-tokens";
import "./home-sections.css";

const installCommand = (name: string) =>
  `npx shadcn@latest add ${window.location.origin}/r/${name}.json`;

const categoryOrder = [...new Set(catalog.map((item) => item.category))];

function LibraryIndex() {
  const groups = categoryOrder.map((category) => ({
    category,
    items: catalog.filter((item) => item.category === category),
  }));
  return (
    <section
      className="home-band"
      id="advanced-components"
      aria-labelledby="index-title"
    >
      <div className="home-heading">
        <h2 id="index-title" className="headline">
          Small parts.
          <br />
          Big possibilities.
        </h2>
        <p className="lede">
          {componentCount} components and {blockCount} blocks. Each has a live
          preview, its full source, and a one-line install.
        </p>
      </div>
      <details className="library-directory">
        <summary>
          <span>
            Explore the full collection
            <small>{componentCount + blockCount} components &amp; blocks</small>
          </span>
          <IconPlus size={20} aria-hidden="true" />
        </summary>
        <nav className="library-index" aria-label="All components and blocks">
          {groups.map(({ category, items }) => (
            <div key={category} className="index-group">
              <h3>
                {category === "Blocks" ? "Blocks" : category}
                <span>{items.length}</span>
              </h3>
              <ul>
                {items.map((item) => (
                  <li key={item.name}>
                    <Link to={catalogPath(item)}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </details>
    </section>
  );
}

const radii = [
  { name: "Sharp", value: 2 },
  { name: "Default", value: 8 },
  { name: "Round", value: 20 },
];
const initialTasks = [
  { id: "research", title: "Pick an accent", due: "Done", done: true },
  { id: "design", title: "Choose a corner radius", due: "Next", done: false },
  { id: "launch", title: "Name the workspace", due: "Then ship", done: false },
];

function ThemeLab() {
  const { theme, setTheme } = useStudio();
  const [tasks, setTasks] = useState(initialTasks);
  const [name, setName] = useState("Orbit studio");
  const [workspace, setWorkspace] = useState("Orbit studio");
  const completed = tasks.filter((task) => task.done).length;
  const accentName =
    ACCENT_PRESETS.find((preset) => preset.value === theme.accent.toLowerCase())
      ?.name ?? "Custom";
  return (
    <section className="home-band theme-lab" aria-labelledby="theme-title">
      <div className="home-heading">
        <h2 id="theme-title" className="headline">
          Your palette.
          <br />
          <span className="home-accent">Your signature.</span>
        </h2>
        <p className="lede">
          Make it feel like you. Choose an accent and a corner radius. The
          preview, and the components above, follow your lead.
        </p>
      </div>
      <div className="theme-shell">
        <div className="theme-controls">
          <fieldset>
            <legend>
              Accent <output>{accentName}</output>
            </legend>
            <div className="theme-swatch-grid">
              {ACCENT_PRESETS.map((item) => {
                const active = item.value === theme.accent.toLowerCase();
                return (
                  <button
                    key={item.name}
                    type="button"
                    aria-pressed={active}
                    aria-label={item.name}
                    title={item.name}
                    className="theme-swatch"
                    style={{
                      background: item.value,
                      color: onColor(item.value),
                    }}
                    onClick={() =>
                      setTheme((current) => ({
                        ...current,
                        accent: item.value,
                      }))
                    }
                  >
                    {active && (
                      <IconCheck size={13} stroke={3} aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <fieldset>
            <legend>Radius</legend>
            <div className="theme-options">
              {radii.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  aria-pressed={theme.radius === item.value}
                  onClick={() =>
                    setTheme((current) => ({ ...current, radius: item.value }))
                  }
                >
                  <span
                    className="theme-corner"
                    style={{ borderTopLeftRadius: item.value }}
                    aria-hidden="true"
                  />
                  {item.name}
                </button>
              ))}
            </div>
          </fieldset>
          <ContrastControl />
          <div className="theme-export">
            <span>
              Export theme<small>Ready for your project</small>
            </span>
            <CopyButton text={exportCss(theme)} label="Copy theme CSS" />
          </div>
          <p className="theme-note">
            Want more control?{" "}
            <Link to="/docs#theming">Read the theming guide</Link> to use these
            tokens in your own project.
          </p>
        </div>
        <div className="theme-canvas">
          <div className="theme-canvas-bar">
            <span>
              <span className="live-dot" aria-hidden="true" /> Live preview
            </span>
            <span>{theme.radius}px corners</span>
          </div>
          <div className="theme-app">
            <div className="theme-app-heading">
              <div className="theme-app-brand">
                <span>
                  <BrandMark />
                </span>
                <div>
                  <strong>{workspace}</strong>
                  <small>Weekly overview</small>
                </div>
              </div>
              <AvatarStack members={[siteOwner, portfolioProjects[2].owner]} />
            </div>
            <div className="theme-overview-heading">
              <div>
                <h3>Overview</h3>
                <p>A little perspective on the week.</p>
              </div>
              <StatusBadge variant="success">All systems go</StatusBadge>
            </div>
            <div className="theme-metrics">
              <StatCard
                title="Revenue"
                value="$36,800"
                change="12.8%"
                trend="up"
              />
              <StatCard
                title="Active projects"
                value="12"
                change="3 this month"
                trend="up"
              />
              <StatCard
                title="On-time delivery"
                value="96.8%"
                change="2.4%"
                trend="up"
              />
            </div>
            <div className="theme-grid">
              <div className="theme-revenue">
                <MetricChart
                  title="Revenue over time"
                  description="This year · USD"
                  data={dashboardRevenue}
                  height={200}
                  valueFormatter={(value) =>
                    `$${value.toLocaleString("en-US")}`
                  }
                  axisFormatter={(value) => `$${value / 1000}k`}
                />
              </div>
              <div className="theme-checklist">
                <TaskList
                  title="Make it yours"
                  tasks={tasks}
                  onTaskChange={(id, done) =>
                    setTasks((current) =>
                      current.map((task) =>
                        task.id === id ? { ...task, done } : task,
                      ),
                    )
                  }
                />
                <div className="theme-setup-progress">
                  <ResourceProgress
                    label="Setup progress"
                    value={completed}
                    max={tasks.length}
                    valueLabel={`${completed} of ${tasks.length} done`}
                  />
                  <span>
                    {completed === tasks.length
                      ? "Ready to go."
                      : "A few small details. A workspace of your own."}
                  </span>
                </div>
              </div>
            </div>
            <div className="theme-settings-row">
              <div>
                <strong>Workspace name</strong>
                <span>A small change. Your own identity.</span>
              </div>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setWorkspace(name.trim());
                }}
                className="theme-form"
              >
                <label className="sr-only" htmlFor="theme-workspace-name">
                  Workspace name
                </label>
                <Input
                  id="theme-workspace-name"
                  name="workspace-name"
                  value={name}
                  maxLength={32}
                  required
                  onChange={(event) => setName(event.target.value)}
                />
                <Button type="submit" disabled={!name.trim()}>
                  Rename
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const exampleCode = `import { NumberTicker } from "@/components/overtrue/number-ticker"

export function Revenue({ total }: { total: number }) {
  return (
    <NumberTicker
      value={total}
      format="currency"
      highlightChanges
    />
  )
}`;

function useRunningTotal() {
  const [total, setTotal] = useState(48213.07);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (!document.hidden)
        setTotal((value) => +(value + 40 + Math.random() * 260).toFixed(2));
    }, 2400);
    return () => window.clearInterval(timer);
  }, []);
  return total;
}

function Install({ theme }: { theme: StudioTheme }) {
  const total = useRunningTotal();
  return (
    <section className="home-band install-band" aria-labelledby="install-title">
      <div className="home-heading">
        <h2 id="install-title" className="headline">
          One command.
          <br />
          All yours.
        </h2>
        <p className="lede">
          The shadcn CLI copies the source into your project and installs what
          it needs. There is no package to upgrade and nothing to fork.
        </p>
      </div>
      <div className="install-layout">
        <ol className="install-steps">
          <li>
            <h3>Set up shadcn/ui</h3>
            <p>
              React, TypeScript, and Tailwind CSS v4. Skip this if you have it.
            </p>
            <div className="install-command">
              <code>npx shadcn@latest init</code>
              <CopyButton
                text="npx shadcn@latest init"
                label="Copy init command"
              />
            </div>
          </li>
          <li>
            <h3>Add a component</h3>
            <p>Dependencies and shadcn primitives come along automatically.</p>
            <div className="install-command">
              <code>{installCommand("number-ticker")}</code>
              <CopyButton
                text={installCommand("number-ticker")}
                label="Copy install command"
              />
            </div>
          </li>
          <li>
            <h3>Import and edit</h3>
            <p>
              The file lives in <code>components/overtrue/</code>. Change the
              markup, the styles, or the behavior.
            </p>
          </li>
        </ol>
        <figure
          className="install-editor home-inverse dark"
          style={themeVariables(theme, "dark")}
        >
          <div className="install-editor-bar">
            <span>revenue.tsx</span>
          </div>
          <HighlightedCode text={exampleCode} language="tsx" />
          <figcaption className="install-output">
            <span className="install-output-label">Rendered</span>
            <NumberTicker
              value={total}
              format="currency"
              highlightChanges
              className="install-ticker"
            />
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function Workspace() {
  return (
    <section
      className="workspace-band"
      id="workspace-preview"
      aria-labelledby="workspace-title"
    >
      <div className="workspace-inner">
        <div className="home-heading">
          <h2 id="workspace-title" className="headline">
            Every part.
            <br />
            Working together.
          </h2>
          <div>
            <p className="lede">
              Explore {workspacePages.length} pages of Acme Studio. Projects,
              clients, billing, and settings, connected in real flows with
              sample data.
            </p>
            <a className="text-link" href="/workspace/">
              Open the workspace <IconArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <div className="workspace-window">
          <div className="workspace-window-bar" aria-hidden="true">
            <span />
            <span />
            <span />
            <p>acme.studio/overview</p>
          </div>
          <div className="hero-product">
            <Dashboard compact workspaceName="Acme Studio" user={siteOwner} />
          </div>
        </div>
      </div>
    </section>
  );
}

function useSeen<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setSeen(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return [ref, seen] as const;
}

function Closing() {
  const [ledger, seen] = useSeen<HTMLDListElement>();
  const inventory = [
    { label: "Components", value: componentCount, to: "/components" },
    { label: "Blocks", value: blockCount, to: "/blocks" },
    { label: "Cards", value: cardCount, to: "/blocks#card-collection-title" },
    { label: "Workspace pages", value: workspacePages.length, to: "/examples" },
  ];
  return (
    <section className="closing-band" aria-labelledby="closing-title">
      <div className="closing-copy">
        <div>
          <p className="closing-eyebrow">Open source. Yours to shape.</p>
          <h2 id="closing-title" className="display">
            Start with one.
            <br />
            <span className="home-accent">Make it yours.</span>
          </h2>
        </div>
        <div className="closing-aside">
          <p className="lede">
            A better starting point for your next interface. Pick a component,
            take the source, and make something good.
          </p>
          <div className="closing-actions">
            <Link className="site-button primary" to="/components">
              Browse components <IconArrowRight size={16} aria-hidden="true" />
            </Link>
            <a
              className="hero-docs-link"
              href="https://github.com/overtrue/ui"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <IconArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
      <dl className="closing-ledger" ref={ledger}>
        {inventory.map((entry) => (
          <div key={entry.label}>
            <dt>
              <Link to={entry.to}>{entry.label}</Link>
            </dt>
            <dd>
              <NumberTicker value={seen ? entry.value : 0} duration={1100} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function HomeSections() {
  const { theme } = useStudio();
  return (
    <div className="home-extension">
      <LibraryIndex />
      <section
        className="home-band live-console-section"
        aria-labelledby="live-title"
      >
        <div className="home-heading">
          <h2 id="live-title" className="headline">
            Real components.
            <br />
            <span className="home-accent">A working canvas.</span>
          </h2>
          <p className="lede">
            Throughput, fleet health, logs, and objectives in one live console.
            Pause the sample feed, inspect a host, or reveal the components
            behind it.
          </p>
        </div>
        <div
          className="home-inverse dark"
          style={themeVariables(theme, "dark")}
        >
          <HeroConsole />
        </div>
        <div className="hero-console-caption">
          <p>
            <span className="live-dot" /> Simulated telemetry. Real
            interactions.
          </p>
          <Link to="/blocks/realtime-monitor">
            Explore the monitor <IconArrowUpRight size={14} />
          </Link>
        </div>
      </section>
      <ThemeLab />
      <FeaturedBlocks />
      <Install theme={theme} />
      <Workspace />
      <Questions />
      <Closing />
    </div>
  );
}
