import { StrictMode, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  IconArrowUpRight as ArrowUpRight,
  IconArrowRight as ArrowRight,
  IconMenu2 as Menu,
  IconX as X,
  IconMoon as Moon,
  IconSun as Sun,
  IconSearch as Search,
  IconTerminal2 as Terminal,
  IconStack2 as Layers,
  IconCode as Code2,
  IconBox as Box,
  IconChevronRight as ChevronRight,
} from "@tabler/icons-react";
import { Dashboard } from "@/registry/overtrue/dashboard";
import {
  catalog,
  componentCount,
  blockCount,
  cardCount,
  type ItemName,
} from "./catalog";
import { Example } from "./examples";
import { dashboardCatalog } from "./dashboard-catalog";
import { FitPreview } from "./fit-preview";
import workspacePages from "@/data/workspace/pages.json";
import { Command, CopyButton } from "./code";
import { GuidePage, GuideLinks } from "./guides";
import { sitePages } from "./pages";
import { HomeDetails } from "./home-details";
import { CardCollection, CardBlockPage } from "./blocks";
import "./site.css";

const sources = import.meta.glob("../registry/overtrue/*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;
const origin = window.location.origin;
const command = (name: string) =>
  `npx shadcn@latest add ${origin}/r/${name}.json`;
const symbolName = (name: string) =>
  name
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join("");

function Logo() {
  return (
    <span className="wordmark">
      <svg
        viewBox="0 0 28 28"
        width="25"
        height="25"
        fill="none"
        aria-hidden="true"
      >
        <rect width="28" height="28" rx="7" fill="currentColor" />
        <rect
          x="6"
          y="6"
          width="5"
          height="16"
          rx="1.5"
          className="logo-cutout"
        />
        <rect
          x="14"
          y="6"
          width="8"
          height="7"
          rx="1.5"
          className="logo-cutout"
        />
        <rect
          x="14"
          y="16"
          width="8"
          height="6"
          rx="1.5"
          className="logo-cutout"
        />
      </svg>
      <span>
        overtrue<span className="wordmark-slash">/</span>ui
      </span>
    </span>
  );
}
function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    try {
      const stored = localStorage.getItem("overtrue-site-theme");
      return stored
        ? stored === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("overtrue-site-theme", dark ? "dark" : "light");
    } catch {
      /* Storage is optional. */
    }
  }, [dark]);
  return (
    <button
      type="button"
      className="icon-button"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setDark(!dark)}
    >
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
    const pathname = location.pathname.replace(/\/+$/, "") || "/";
    const page = sitePages.find((page) => page.path === pathname);
    const title = page
      ? `${page.title} — overtrue/ui`
      : "Page not found — overtrue/ui";
    const description =
      page?.description ??
      "This page could not be found. Explore overtrue/ui components and documentation.";
    document.title = title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", description);
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute("content", `https://ui.overtrue.xyz${pathname}`);
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", `https://ui.overtrue.xyz${pathname}`);
    document
      .querySelector('meta[name="robots"]')
      ?.setAttribute("content", page ? "index,follow" : "noindex,follow");
  }, [location.pathname]);
  useEffect(() => {
    if (!location.hash) return;
    let id: string;
    try {
      id = decodeURIComponent(location.hash.slice(1));
    } catch {
      return;
    }
    const frame = requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView(),
    );
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" aria-label="overtrue/ui home">
          <Logo />
        </Link>
        <nav
          className={open ? "main-nav open" : "main-nav"}
          id="site-navigation"
          aria-label="Main navigation"
        >
          <NavLink to="/components">Components</NavLink>
          <NavLink to="/blocks">Blocks</NavLink>
          <NavLink to="/docs">Documentation</NavLink>
          <NavLink to="/examples">
            Examples <span className="nav-count">{workspacePages.length}</span>
          </NavLink>
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <a className="header-preview" href="/workspace/">
            Live preview
            <ArrowUpRight size={14} />
          </a>
          <button
            ref={toggleRef}
            className="icon-button mobile-toggle"
            aria-controls="site-navigation"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Link to="/">
          <Logo />
        </Link>
        <p>A good starting point for the work ahead.</p>
      </div>
      <nav className="footer-links" aria-label="Footer navigation">
        <div>
          <span>Explore</span>
          <Link to="/components">Components</Link>
          <Link to="/blocks">Blocks</Link>
          <Link to="/examples">Workspace examples</Link>
        </div>
        <div>
          <span>Build</span>
          <Link to="/docs">Getting started</Link>
          <Link to="/docs/design">Design principles</Link>
          <Link to="/docs/troubleshooting">Troubleshooting</Link>
        </div>
        <div>
          <span>Resources</span>
          <a href="/r/registry.json">Registry JSON</a>
          <a href="/llms.txt">For agents</a>
          <a href="/LICENSE.txt">MIT license</a>
        </div>
      </nav>
      <div className="footer-note">
        <span>
          An independent project by{" "}
          <a
            href="https://github.com/overtrue"
            target="_blank"
            rel="noreferrer"
          >
            overtrue <ArrowUpRight size={11} />
          </a>
          .
        </span>
        <span>React · Tailwind CSS · shadcn/ui · Tabler Icons</span>
      </div>
    </footer>
  );
}
function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <Link className="eyebrow-link" to="/docs">
            <span className="live-dot" />
            The admin collection for shadcn/ui
            <ArrowRight size={13} />
          </Link>
          <h1>
            Your next dashboard.
            <br />
            <span>Already taking shape.</span>
          </h1>
          <p>
            Components and complete blocks for dashboards, admin panels, and
            consoles.
          </p>
          <div className="hero-actions">
            <Link className="site-button primary" to="/components">
              Explore components
              <ArrowRight size={16} />
            </Link>
            <Link className="site-button" to="/docs">
              Get started
              <Code2 size={16} />
            </Link>
          </div>
          <div className="hero-install">
            <Terminal size={14} />
            <code>{command("stat-card")}</code>
            <CopyButton text={command("stat-card")} />
          </div>
          <div className="hero-meta">
            <span>{componentCount} components</span>
            <i />
            <span>{blockCount} complete blocks</span>
            <span>{cardCount} card patterns</span>
            <i />
            <span>Free & MIT licensed</span>
          </div>
        </div>
        <div className="hero-product">
          <div className="product-label">
            <span>
              <span className="live-dot" />
              Live component preview · Sample data
            </span>
            <Link to="/components/dashboard">
              Explore the block
              <ArrowUpRight size={13} />
            </Link>
          </div>
          <Dashboard compact />
          <div className="product-caption">
            <span>01 / A workspace that feels like yours.</span>
            <span>React · TypeScript · Tailwind CSS</span>
          </div>
        </div>
      </section>
      <section className="foundation strip">
        <span>A familiar foundation.</span>
        <div>
          <Code2 />
          React
        </div>
        <div>
          <span className="tailwind-symbol">≈</span>Tailwind CSS
        </div>
        <div>
          <span className="shadcn-symbol">//</span>shadcn/ui
        </div>
        <div>
          <Layers />
          Made for real work
        </div>
      </section>
      <section className="section collection-section">
        <div className="section-heading">
          <div>
            <p className="overline">SMALL PIECES. REAL POSSIBILITIES.</p>
            <h2>The everyday, already considered.</h2>
            <p>The components you reach for in every admin interface.</p>
          </div>
          <Link className="text-link" to="/components">
            All {componentCount} components
            <ArrowRight size={16} />
          </Link>
        </div>
        <div
          className="home-component-grid"
          role="region"
          aria-label="Component previews"
          tabIndex={0}
        >
          {(
            [
              "stat-card",
              "activity-feed",
              "storage-meter",
              "status-badge",
              "avatar-stack",
              "steps",
            ] as ItemName[]
          ).map((name) => (
            <ComponentTile key={name} name={name} />
          ))}
        </div>
        <p className="gallery-hint">
          Scroll to explore <ArrowRight size={13} />
        </p>
      </section>
      <section className="ownership section">
        <div>
          <p className="overline">YOUR CODE. YOUR CALL.</p>
          <h2>
            A starting point.
            <br />
            Never a black box.
          </h2>
          <p>
            Add a component straight to your project. Read it, change it, make
            it fit. No runtime package to work around.
          </p>
          <Link to="/docs" className="text-link">
            How it works
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="ownership-code">
          <div className="code-label">
            <span>
              <Box size={14} />
              components/overtrue/stat-card.tsx
            </span>
            <span>Yours to edit</span>
          </div>
          <pre>
            <code>
              <span className="syntax-purple">import</span> {"{ StatCard }"}{" "}
              <span className="syntax-purple">from</span>
              {"\n"}
              <span className="syntax-green">
                {" "}
                "@/components/overtrue/stat-card"
              </span>
              {"\n\n"}
              <span className="syntax-purple">
                export default function
              </span>{" "}
              Overview() {"{"}
              {"\n"} <span className="syntax-purple">return</span> ({"\n"}{" "}
              <span className="syntax-blue">&lt;StatCard</span>
              {"\n"} title=<span className="syntax-green">"Total revenue"</span>
              {"\n"} value=<span className="syntax-green">"$36,800"</span>
              {"\n"} change=<span className="syntax-green">"12.8%"</span>
              {"\n"} trend=<span className="syntax-green">"up"</span>
              {"\n"} <span className="syntax-blue">/&gt;</span>
              {"\n"} ){"\n"}
              {"}"}
            </code>
          </pre>
        </div>
      </section>
      <HomeDetails />
      <section className="closing section">
        <div>
          <p className="overline">FROM A COMPONENT TO A CONSOLE</p>
          <h2>Build something worth opening.</h2>
          <p>
            Start small. Or explore {workspacePages.length} pages of
            possibilities.
          </p>
        </div>
        <div className="hero-actions">
          <Link className="site-button primary" to="/docs">
            Start building
            <ArrowRight size={16} />
          </Link>
          <Link className="site-button" to="/examples">
            Explore examples
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
function ComponentTile({ name }: { name: ItemName }) {
  const item = catalog.find((item) => item.name === name)!;
  return (
    <article className={`component-tile tile-${name}`}>
      <div className="tile-preview">
        <FitPreview
          // Keep the metric group's four-column overview at its detail-view width.
          width={
            "previewWidth" in item
              ? item.previewWidth
              : item.category === "Blocks"
                ? 1024
                : name === "metric-group"
                  ? 840
                  : 400
          }
          height={item.category === "Blocks" ? 480 : 280}
        >
          <Example name={name} />
        </FitPreview>
      </div>
      <Link className="tile-caption" to={`/components/${name}`}>
        <span>
          {item.title}
          <small>{item.category}</small>
        </span>
        <ArrowUpRight size={16} />
      </Link>
    </article>
  );
}
function Catalog({ blocks = false }: { blocks?: boolean }) {
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("All");
  const categories = [
    "All",
    "Data display",
    "Layout",
    "Feedback",
    "Navigation",
    "Forms",
  ];
  const items = catalog.filter(
    (item) =>
      (blocks ? item.category === "Blocks" : item.category !== "Blocks") &&
      (category === "All" || item.category === category) &&
      `${item.title} ${item.description}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <main className="section catalog-page">
      <div className="page-intro">
        <p className="overline">THE OVERTRUE/UI COLLECTION</p>
        <h1>
          {blocks
            ? "A head start, assembled."
            : "Small components. Big head start."}
        </h1>
        <p>
          {blocks
            ? "Complete interfaces and individual cards from the workspace examples. Every piece is yours to change."
            : "Practical, composable pieces for your next admin interface. Preview it. Install it. Make it yours."}
        </p>
      </div>
      {!blocks && (
        <div className="catalog-toolbar">
          <div className="filter-tabs" aria-label="Filter components">
            {categories.map((value) => (
              <button
                key={value}
                aria-pressed={value === category}
                onClick={() => setCategory(value)}
              >
                {value}
              </button>
            ))}
          </div>
          <label className="search-box">
            <Search size={16} />
            <input
              aria-label="Search components"
              placeholder="Search components…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
      )}
      {blocks && <CardCollection />}
      {blocks && (
        <div className="complete-block-heading">
          <h2>Complete interfaces</h2>
          <p>Start with a full view, then make every part your own.</p>
        </div>
      )}
      <div className={blocks ? "block-grid" : "component-grid"}>
        {items.map((item) => (
          <ComponentTile key={item.name} name={item.name} />
        ))}
      </div>
      {!items.length && (
        <div className="search-empty">
          <Search size={24} />
          <h2>No components found.</h2>
          <p>Try a different term or category.</p>
          <button
            className="site-button"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </main>
  );
}
function ComponentPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const item = catalog.find((item) => item.name === name);
  const [tab, setTab] = useState("Preview");
  const [sourceFile, setSourceFile] = useState(name);
  useEffect(() => {
    setTab("Preview");
    setSourceFile(name);
  }, [name]);
  if (!item) return <NotFound />;
  const files: string[] = [];
  function addSource(name: string) {
    if (files.includes(name)) return;
    files.push(name);
    const content = sources[`../registry/overtrue/${name}.tsx`] ?? "";
    for (const match of content.matchAll(/from\s+["']\.\/([^"']+)["']/g))
      addSource(match[1]);
  }
  addSource(item.name);
  const source = sources[`../registry/overtrue/${sourceFile}.tsx`] ?? "";
  const usage = `import { ${"imports" in item ? item.imports : symbolName(item.name)} } from "@/components/overtrue/${item.name}"\n${"exampleImports" in item ? item.exampleImports + "\n" : ""}\n${item.usage}`;
  return (
    <main className="docs-layout section">
      <aside className="docs-sidebar">
        <Link className="back-link" to="/components">
          ← All components
        </Link>
        <p>Components</p>
        {catalog.map((entry) => (
          <NavLink key={entry.name} to={`/components/${entry.name}`}>
            {entry.title}
            {entry.category === "Blocks" && <small>Block</small>}
          </NavLink>
        ))}
      </aside>
      <article className="docs-content">
        <label className="component-picker">
          Browse components
          <select
            aria-label="Browse components"
            value={item.name}
            onChange={(event) => navigate(`/components/${event.target.value}`)}
          >
            {catalog.map((entry) => (
              <option key={entry.name} value={entry.name}>
                {entry.title}
              </option>
            ))}
          </select>
        </label>
        <div className="breadcrumbs">
          <Link to="/components">Components</Link>
          <ChevronRight size={12} />
          {item.title}
        </div>
        <div className="page-intro">
          <h1>{item.title}</h1>
          {dashboardCatalog.some((entry) => entry.name === item.name) && (
            <p className="component-credit" data-component-credit>
              This component is adapted from{" "}
              <a
                href="https://dashboardcn.com/docs"
                target="_blank"
                rel="noreferrer"
              >
                dashboardcn
              </a>
              , with styling and examples tailored for overtrue/ui.
            </p>
          )}
          <p>{item.description}</p>
        </div>
        <div className="workspace-toolbar">
          <div className="filter-tabs" aria-label="Component view">
            {["Preview", "Code"].map((value) => (
              <button
                key={value}
                aria-pressed={tab === value}
                onClick={() => setTab(value)}
              >
                {value === "Code" && <Code2 size={13} />}
                {value}
              </button>
            ))}
          </div>
          <a className="text-link" href={`/r/${item.name}.json`}>
            Registry JSON
            <ArrowUpRight size={13} />
          </a>
        </div>
        {tab === "Preview" ? (
          <div className={`detail-preview detail-${item.name}`}>
            <Example name={item.name} expanded />
          </div>
        ) : (
          <div className="source-view">
            <div className="code-label">
              <label className="sr-only" htmlFor="source-file">
                Source file
              </label>
              <select
                id="source-file"
                value={sourceFile}
                onChange={(event) => setSourceFile(event.target.value)}
              >
                {files.map((file) => (
                  <option key={file} value={file}>
                    {file}.tsx
                  </option>
                ))}
              </select>
              <CopyButton text={source} label="Copy source" />
            </div>
            <pre>
              <code>{source}</code>
            </pre>
          </div>
        )}
        <h2>Installation</h2>
        <p>
          Requires an initialized shadcn/ui project with React and Tailwind CSS
          v4.
        </p>
        <Command text={command(item.name)} />
        <p className="note">
          The CLI adds the source to <code>components/overtrue/</code> and
          installs its dependencies.{" "}
          <Link to="/docs">New to overtrue/ui? Start here.</Link>
        </p>
        <h2>Usage</h2>
        <Command text={usage} label="React" />
        {"api" in item && (
          <>
            <h2>Props</h2>
            <div className="api-table-scroll">
              <table className="api-table">
                <thead>
                  <tr>
                    <th>Prop</th>
                    <th>Type</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {item.api.map(([prop, type, details]) => (
                    <tr key={prop}>
                      <td>
                        <code>{prop}</code>
                      </td>
                      <td>
                        <code>{type}</code>
                      </td>
                      <td>{details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        <h2>Make it yours</h2>
        <p>
          {"notes" in item
            ? item.notes
            : item.name === "analytics-overview"
              ? "Pass AnalyticsReport[] through reports to replace the sample periods. The selector changes every panel together; CSV export uses the selected report. Traffic totals, source totals, and the first funnel stage should agree. Pass reports={[]} for the empty state. All included data is fictional."
              : item.name === "stat-card"
                ? 'Use positiveTrend="down" for metrics where a decrease is good. Direction and meaning are separate: the arrow shows the movement, while color and accessible text describe its impact. Add sparkline data or an icon when they help explain the metric.'
                : item.name === "metric-chart"
                  ? "Add previous to data points for a dashed comparison series. Set seriesLabel, comparisonLabel, valueFormatter, and axisFormatter for your units. Missing previous values remain gaps. An empty array renders an explicit no-data state."
                  : item.name === "sparkline"
                    ? "Provide a descriptive label for the text alternative. Use filled={false} for a line-only trend, and className to inherit a semantic color. Empty, single-point, and constant series are supported. Use MetricChart when people need to inspect individual values."
                    : item.name === "ranked-list"
                      ? "Rows are sorted by value without changing your input. Bar widths compare against the largest value; percentages use the sum of all rows. Optional icon and href fields add context or drill-down navigation. Negative and non-finite values are treated as zero."
                      : item.name === "conversion-funnel"
                        ? "Supply stages in journey order with stable IDs. Each stage shows its share of the first stage and its conversion from the previous stage. Missing denominators display an unavailable state, never an invented rate. Negative and non-finite counts are treated as zero."
                        : item.name === "settings-panel"
                          ? "Pass an async onSave callback to connect your API. Without it, the form is a local demo. Errors keep the current values so the user can retry."
                          : item.name === "data-table"
                            ? "Supply stable row IDs with getRowId. Columns define a searchable and sortable value; use render for custom cells. Filtering and pagination run on the client."
                            : item.name === "dashboard"
                              ? "All metrics and members are example data. Navigation, filtering, report export, and local settings work in the demo. Connect your API and authentication before using it as a real console."
                              : "Edit the installed TypeScript source to fit your product. Components inherit your semantic color tokens and support the .dark theme convention."}
        </p>
        <p className="note">
          {item.dependencies.length
            ? `shadcn/ui dependencies: ${item.dependencies.join(", ")}.`
            : "No additional shadcn/ui primitives required."}{" "}
          {(item.name === "metric-chart" ||
            item.name === "dashboard" ||
            item.name === "analytics-overview") &&
            "Charts use Recharts 2.x."}
        </p>
        <nav className="guide-pagination" aria-label="Component guides">
          <Link to="/docs/composition">
            <span>
              <small>Put it to work</small>Building a page
            </span>
            <ArrowRight size={16} />
          </Link>
          <Link to="/docs/troubleshooting">
            <span>
              <small>Need a hand?</small>Troubleshooting
            </span>
            <ArrowRight size={16} />
          </Link>
        </nav>
      </article>
    </main>
  );
}
function Docs() {
  const namespace = JSON.stringify(
    { registries: { "@overtrue": `${origin}/r/{name}.json` } },
    null,
    2,
  );
  return (
    <main className="docs-layout section">
      <aside className="docs-sidebar">
        <p>Getting started</p>
        <a href="#introduction">Introduction</a>
        <a href="#installation">Installation</a>
        <a href="#namespace">Namespace</a>
        <a href="#theming">Theming</a>
        <a href="#workspace">Workspace examples</a>
        <a href="#credits">Credits & license</a>
        <p>Handbook</p>
        <GuideLinks />
        <Link to="/components">
          Browse components
          <ArrowUpRight size={12} />
        </Link>
      </aside>
      <article className="docs-content prose-docs">
        <details className="docs-mobile-contents">
          <summary>On this page</summary>
          <nav aria-label="Documentation sections">
            <a href="#introduction">Introduction</a>
            <a href="#installation">Installation</a>
            <a href="#namespace">Namespace</a>
            <a href="#theming">Theming</a>
            <a href="#workspace">Workspace examples</a>
            <a href="#credits">Credits & license</a>
          </nav>
        </details>
        <p className="overline">DOCUMENTATION</p>
        <h1 id="introduction">Meet your new starting point.</h1>
        <p className="lead">
          overtrue/ui is a collection of editable components for admin panels,
          dashboards, and consoles. Familiar shadcn/ui foundations, with the
          compact layouts and considered details.
        </p>
        <div className="docs-callout">
          <Layers size={20} />
          <p>
            Install just what you need. The source lives in your project, so you
            can change every detail without waiting on a library release.
          </p>
        </div>
        <h2 id="installation">Start with one component</h2>
        <p>
          Use a React project with TypeScript, Tailwind CSS v4, and an{" "}
          <code>@/</code> import alias. Initialize shadcn/ui if you haven’t
          already:
        </p>
        <Command text="npx shadcn@latest init" />
        <p>
          Then add your first overtrue/ui component. The CLI resolves the
          required shadcn/ui primitives and npm dependencies.
        </p>
        <Command text={command("stat-card")} />
        <Command
          label="React"
          text={
            'import { StatCard } from "@/components/overtrue/stat-card"\n\nexport default function Overview() {\n  return <StatCard title="Total revenue" value="$36,800" change="12.8%" trend="up" />\n}'
          }
        />
        <h2 id="namespace">Give the registry a name</h2>
        <p>
          Merge this entry into your project’s <code>components.json</code>.
          Keep your existing configuration and other registries.
        </p>
        <Command label="components.json · merge this entry" text={namespace} />
        <p>Now you can install components with a short command:</p>
        <Command text="npx shadcn@latest add @overtrue/dashboard" />
        <p className="note">
          The namespace is configured in your own project. overtrue/ui has not
          been submitted to the official shadcn Directory.
        </p>
        <h2 id="theming">A familiar theme system</h2>
        <p>
          Components inherit your shadcn semantic tokens: background,
          foreground, card, primary, border, and muted. Keep your existing
          theme, or install the optional overtrue/ui theme for our blue accent
          and compact radii.
        </p>
        <Command text={command("overtrue-theme")} />
        <p className="note">
          The theme updates CSS variables in your global stylesheet. Review the
          changes if you already have a custom theme. Dark mode uses the{" "}
          <code>.dark</code> class.
        </p>
        <div className="token-grid">
          {[
            ["Primary", "#066fd1"],
            ["Background", "#f9fafb"],
            ["Foreground", "#1f2937"],
            ["Border", "#e5e7eb"],
          ].map(([label, color]) => (
            <div key={label}>
              <span style={{ background: color }} />
              <strong>{label}</strong>
              <code>{color}</code>
            </div>
          ))}
        </div>
        <h2 id="workspace">{workspacePages.length} pages to explore</h2>
        <p>
          The <Link to="/examples">workspace gallery</Link> brings together
          studio operations, project delivery, client relationships, and the
          interface patterns behind them. These pages are complete examples. The
          registry currently distributes {componentCount} standalone components,
          {blockCount} blocks, and one optional theme.
        </p>
        <p>
          Registry components use ordinary Tailwind classes and shadcn/ui
          primitives. They do not require the workspace gallery’s stylesheet or
          static assets.
        </p>
        <h2>Keep building</h2>
        <div className="guide-index">
          <GuideLinks />
        </div>
        <h2 id="credits">Built on good foundations</h2>
        <p>
          overtrue/ui’s source is available under the{" "}
          <a href="/LICENSE.txt">MIT license</a>. Components are built on{" "}
          <a href="https://ui.shadcn.com/">shadcn/ui</a>, React, Tailwind CSS,
          and Tabler Icons. Required third-party attribution is preserved in the{" "}
          <a href="/THIRD_PARTY_NOTICES.txt">license notices</a>.
        </p>
        <p>
          Our registry follows the{" "}
          <a href="https://ui.shadcn.com/docs/registry">
            shadcn Registry specification
          </a>
          . The component browsing and installation experience takes cues from{" "}
          <a href="https://www.kibo-ui.com/">Kibo UI</a> and{" "}
          <a href="https://basecn.dev/">Basecn</a>.
        </p>
        <div className="docs-next">
          <Link to="/components">
            Find your first component
            <ArrowRight size={18} />
          </Link>
        </div>
      </article>
    </main>
  );
}
function Examples() {
  const [query, setQuery] = useState("");
  const pages = workspacePages.filter((page) =>
    `${page.title} ${page.path}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <main className="section examples-page">
      <div className="page-intro">
        <p className="overline">WORKSPACE EXAMPLES</p>
        <h1>{workspacePages.length} pages. Plenty of possibilities.</h1>
        <p>
          Explore project boards, client records, billing, and the everyday
          details that make a workspace useful.
        </p>
      </div>
      <div className="example-feature">
        <div>
          <Layers size={28} />
          <h2>The complete demo</h2>
          <p>
            One place to explore dashboards, forms, charts, layouts, and the
            details in between.
          </p>
          <a className="site-button primary" href="/workspace/">
            Open live preview
            <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="example-feature-links">
          {[
            { name: "Dashboard", path: "/" },
            { name: "Forms", path: "/form-elements" },
            { name: "Charts", path: "/charts" },
            { name: "Settings", path: "/settings" },
          ].map((link) => (
            <a key={link.name} href={`/workspace/#${link.path}`}>
              {link.name}
              <ArrowUpRight size={16} />
            </a>
          ))}
        </div>
      </div>
      <div className="catalog-toolbar">
        <p className="text-sm text-muted-foreground">
          {pages.length} workspace examples
        </p>
        <label className="search-box">
          <Search size={16} />
          <input
            aria-label="Search pages"
            placeholder="Find a page…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>
      <div className="example-list">
        {pages.map((page) => (
          <a key={page.path} href={`/workspace/#${page.path}`}>
            <span>
              {page.title}
              <small>
                {page.path === "/" ? "Dashboard" : page.path.slice(1)}
              </small>
            </span>
            <ArrowUpRight size={14} />
          </a>
        ))}
      </div>
      {!pages.length && (
        <p className="search-empty">No matching pages. Try another search.</p>
      )}
    </main>
  );
}
function NotFound() {
  return (
    <main className="not-found section">
      <p className="overline">404 / NOT FOUND</p>
      <h1>This page got away.</h1>
      <p>Let’s get you back to something useful.</p>
      <Link className="site-button primary" to="/components">
        Browse components
        <ArrowRight size={16} />
      </Link>
    </main>
  );
}
function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <div id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/components" element={<Catalog />} />
          <Route path="/components/:name" element={<ComponentPage />} />
          <Route path="/blocks" element={<Catalog blocks />} />
          <Route path="/blocks/:id" element={<CardBlockPage />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/docs/:slug" element={<GuidePage />} />
          <Route path="/examples" element={<Examples />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
