import {
  Component,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import {
  IconArrowRight,
  IconArrowUpRight,
  IconCheck,
  IconPlus,
} from "@tabler/icons-react";
import { Dashboard } from "@/registry/overtrue/dashboard";
import { StatCard } from "@/registry/overtrue/stat-card";
import { TaskList } from "@/registry/overtrue/task-list";
import { ResourceProgress } from "@/registry/overtrue/resource-progress";
import { SectionCard } from "@/registry/overtrue/section-card";
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
  componentCategories,
  type ItemName,
} from "./catalog";
import { siteOwner, portfolioProjects } from "./demo-data";
import { CopyButton, HighlightedCode } from "./code";
import { Example } from "./examples";
import { FitPreview } from "./fit-preview";
import { FeaturedBlocks, Questions } from "./home-details";
import { HeroConsole } from "./hero-console";
import { useStudio } from "./theme-studio";
import {
  ACCENT_PRESETS,
  exportCss,
  isDefaultStudio,
  onColor,
  themeVariables,
} from "./theme-tokens";

const origin = window.location.origin;
const installCommand = (name: string) =>
  `npx shadcn@latest add ${origin}/r/${name}.json`;

/** Keep one failing specimen from taking the whole page down. */
class SpecimenBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function Hero() {
  const { theme } = useStudio();
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <div className="hero-intro">
        <p>Interfaces for the work behind the screen.</p>
        <a href="https://github.com/overtrue/ui" target="_blank" rel="noreferrer">
          Open source, by design <IconArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
      <div className="home-hero-copy">
        <h1 id="home-title" className="display">
          <span className="hero-line">Serious tools.</span>{" "}
          <span className="hero-line hero-line-accent">Beautifully built.</span>
        </h1>
        <div className="home-hero-aside">
          <p className="lede">
            Bring a little craft to everyday work. {componentCount} components
            for dashboards and consoles, built on shadcn/ui. Every detail is
            yours to shape.
          </p>
          <div className="home-hero-actions">
            <Link className="site-button primary" to="/components">
              Explore components <IconArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link className="hero-docs-link" to="/docs">
              Get started <IconArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
      <div className="hero-console-wrap">
        <div
          className="hero-console-theme dark"
          style={isDefaultStudio(theme) ? undefined : themeVariables(theme, "dark")}
        >
          <HeroConsole />
        </div>
        <div className="hero-console-caption">
          <p>
            <span className="live-dot" aria-hidden="true" />
            Real components. A working canvas.
          </p>
          <span>Pause the feed. Inspect the details.</span>
        </div>
      </div>
    </section>
  );
}

const featured: { name: ItemName; span: string; width: number; description: string }[] = [
  { name: "geo-map", span: "wide", width: 760, description: "A world of activity, in a single view." },
  { name: "insight-card", span: "", width: 520, description: "Turn live data into a useful summary." },
  { name: "deploy-pipeline", span: "", width: 440, description: "Every stage. Every step. In sync." },
  { name: "trace-waterfall", span: "wide", width: 760, description: "Find the detail behind every millisecond." },
];
const categoryOrder = [...componentCategories, "Blocks"] as const;

function LibraryIndex() {
  const { theme } = useStudio();
  const groups = categoryOrder.map((category) => ({
    category,
    items: catalog.filter((item) => item.category === category),
  }));
  return (
    <section className="home-band" aria-labelledby="index-title">
      <div className="home-heading">
        <h2 id="index-title" className="headline">
          Small parts.<br />Big possibilities.
        </h2>
        <p className="lede">
          {componentCount} components and {blockCount} blocks. Each has a live
          preview, its full source, and a one-line install.
        </p>
      </div>
      <div className="feature-bento">
        {featured.map(({ name, span, width, description }) => {
          const item = catalog.find((entry) => entry.name === name);
          if (!item) return null;
          return (
            <article className={`feature-cell ${span}`} key={name}>
              <div
                className={`feature-stage${name === "trace-waterfall" ? " home-inverse dark" : ""}`}
                style={name === "trace-waterfall" && !isDefaultStudio(theme) ? themeVariables(theme, "dark") : undefined}
                inert
                aria-hidden="true"
              >
                <FitPreview
                  fit={name === "geo-map" ? "contain" : "width"}
                  width={width}
                  height={380}
                  maxAspect={0.72}
                >
                  <SpecimenBoundary>
                    <Example name={name} />
                  </SpecimenBoundary>
                </FitPreview>
              </div>
              <Link className="feature-caption" to={catalogPath(item)}>
                <span>
                  <strong>{item.title}</strong>
                  <small>{description}</small>
                </span>
                <IconArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </article>
          );
        })}
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
  { name: "Round", value: 14 },
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
          Your palette.<br />
          <span className="home-accent">Your signature.</span>
        </h2>
        <p className="lede">
          Make it feel like you. Choose an accent and a corner radius.
          The preview, and the rest of the site, follow your lead.
        </p>
      </div>
      <div className="lab-shell">
        <div className="lab-controls">
          <fieldset>
            <legend>
              Accent <output>{accentName}</output>
            </legend>
            <div className="lab-swatch-grid">
              {ACCENT_PRESETS.map((item) => {
                const active = item.value === theme.accent.toLowerCase();
                return (
                  <button
                    key={item.name}
                    type="button"
                    aria-pressed={active}
                    aria-label={item.name}
                    title={item.name}
                    className="lab-swatch"
                    style={{ background: item.value, color: onColor(item.value) }}
                    onClick={() =>
                      setTheme((current) => ({ ...current, accent: item.value }))
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
            <div className="lab-options">
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
                    className="lab-corner"
                    style={{ borderTopLeftRadius: item.value }}
                    aria-hidden="true"
                  />
                  {item.name}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="lab-export">
            <span>Export theme<small>Ready for your project</small></span>
            <CopyButton text={exportCss(theme)} label="Copy theme CSS" />
          </div>
          <p className="lab-note">
            Want more control?{" "}
            <Link to="/docs#theming">Open the theme studio</Link> for custom
            colors, neutrals, and chart palettes.
          </p>
        </div>
        <div className="lab-canvas">
          <div className="lab-canvas-bar">
            <span><span className="live-dot" aria-hidden="true" /> Live preview</span>
            <span>{theme.radius}px corners</span>
          </div>
          <div className="lab-app">
            <div className="lab-app-heading">
              <div className="lab-app-brand">
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
            <div className="lab-grid">
              <StatCard
                title="Monthly revenue"
                value="$36,800"
                change="12.8%"
                trend="up"
                sparkline={[8, 12, 10, 17, 15, 23, 20, 28, 26, 36]}
              />
              <SectionCard
                title="Setup progress"
                description="Three steps to a theme of your own."
              >
                <ResourceProgress
                  label="Theme"
                  value={completed}
                  max={tasks.length}
                  valueLabel={`${completed} of ${tasks.length} done`}
                />
                <div className="lab-progress-note">
                  <StatusBadge
                    variant={completed === tasks.length ? "success" : "info"}
                  >
                    {completed === tasks.length ? "Ready" : "In progress"}
                  </StatusBadge>
                </div>
              </SectionCard>
              <TaskList
                title="Checklist"
                tasks={tasks}
                onTaskChange={(id, done) =>
                  setTasks((current) =>
                    current.map((task) =>
                      task.id === id ? { ...task, done } : task,
                    ),
                  )
                }
              />
              <SectionCard
                title="Workspace name"
                description="Shown in the header of this preview."
              >
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    setWorkspace(name.trim());
                  }}
                  className="lab-form"
                >
                  <label className="sr-only" htmlFor="lab-workspace-name">
                    Workspace name
                  </label>
                  <Input
                    id="lab-workspace-name"
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
              </SectionCard>
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

function Install() {
  const { theme } = useStudio();
  const total = useRunningTotal();
  return (
    <section className="home-band install-band" aria-labelledby="install-title">
      <div className="home-heading">
        <h2 id="install-title" className="headline">
          One command.<br />All yours.
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
            <p>React, TypeScript, and Tailwind CSS v4. Skip this if you have it.</p>
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
          style={isDefaultStudio(theme) ? undefined : themeVariables(theme, "dark")}
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
            Every part.<br />Working together.
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
            Start with one.<br />
            <span className="home-accent">Make it yours.</span>
          </h2>
        </div>
        <div className="closing-aside">
          <p className="lede">
            A better starting point for your next interface.
            Pick a component, take the source, and make something good.
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

export function Home() {
  return (
    <main className="home">
      <Hero />
      <LibraryIndex />
      <ThemeLab />
      <FeaturedBlocks />
      <Install />
      <Workspace />
      <Questions />
      <Closing />
    </main>
  );
}
