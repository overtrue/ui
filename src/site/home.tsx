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
import { usePointerGlow } from "./pointer-glow";
import { useStudio } from "./theme-studio";
import { ACCENT_PRESETS, exportCss } from "./theme-tokens";

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
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <div className="home-hero-copy">
        <h1 id="home-title" className="display">
          <span className="hero-line">Interfaces for the work</span>{" "}
          <span className="hero-line">behind the screen.</span>
        </h1>
        <div className="home-hero-aside">
          <p className="lede">
            {componentCount} dashboard and console components for shadcn/ui.
            Install one with the CLI, then read and change the source like any
            other file in your project.
          </p>
          <div className="home-hero-actions">
            <Link className="site-button primary" to="/components">
              Browse components
            </Link>
            <Link className="site-button" to="/docs">
              Installation
            </Link>
          </div>
        </div>
      </div>
      <div className="hero-console-wrap">
        <div className="hero-glow" aria-hidden="true" />
        <HeroConsole />
      </div>
    </section>
  );
}

const featured: { name: ItemName; span: string; width: number }[] = [
  { name: "geo-map", span: "wide", width: 760 },
  { name: "insight-card", span: "", width: 520 },
  { name: "deploy-pipeline", span: "", width: 640 },
  { name: "trace-waterfall", span: "wide", width: 760 },
];
const categoryOrder = [...componentCategories, "Blocks"] as const;

function LibraryIndex() {
  const bento = useRef<HTMLDivElement>(null);
  usePointerGlow(bento, ".feature-cell");
  const groups = categoryOrder.map((category) => ({
    category,
    items: catalog.filter((item) => item.category === category),
  }));
  return (
    <section className="home-band" aria-labelledby="index-title">
      <div className="home-heading">
        <h2 id="index-title" className="headline">
          The whole library, on one page.
        </h2>
        <p className="lede">
          {componentCount} components and {blockCount} blocks. Each has a live
          preview, its full source, and a one-line install.
        </p>
      </div>
      <div className="feature-bento" ref={bento}>
        {featured.map(({ name, span, width }) => {
          const item = catalog.find((entry) => entry.name === name);
          if (!item) return null;
          return (
            <article className={`feature-cell ${span}`} key={name}>
              <div className="feature-stage" inert aria-hidden="true">
                <FitPreview width={width} height={320}>
                  <SpecimenBoundary>
                    <Example name={name} />
                  </SpecimenBoundary>
                </FitPreview>
              </div>
              <Link className="feature-caption" to={catalogPath(item)}>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.description}</small>
                </span>
                <IconArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </article>
          );
        })}
      </div>
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
          Your tokens, not ours.
        </h2>
        <p className="lede">
          Components read shadcn’s semantic variables, so they take on your
          accent, radius, and type without edits. Pick one here and the whole
          site follows.
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
                    style={{ background: item.value }}
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
            <span>Theme CSS</span>
            <CopyButton text={exportCss(theme)} label="Copy theme CSS" />
          </div>
          <p className="lab-note">
            Want more control?{" "}
            <Link to="/docs#theming">Open the theme studio</Link> for custom
            colors, neutrals, and chart palettes.
          </p>
        </div>
        <div className="lab-canvas">
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
  const total = useRunningTotal();
  return (
    <section className="home-band install-band" aria-labelledby="install-title">
      <div className="home-heading">
        <h2 id="install-title" className="headline">
          One command. Then it’s your code.
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
        <figure className="install-editor">
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
            {workspacePages.length} pages of a working studio app.
          </h2>
          <div>
            <p className="lede">
              Projects, clients, billing, inbox, and settings. The Acme Studio
              workspace shows the components in real flows with sample data.
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
        <h2 id="closing-title" className="display">
          Start with one component.
        </h2>
        <div className="closing-actions">
          <Link className="site-button primary" to="/components">
            Browse components <IconArrowRight size={16} aria-hidden="true" />
          </Link>
          <a
            className="site-button"
            href="https://github.com/overtrue/ui"
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub
          </a>
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
