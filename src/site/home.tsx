import { useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import {
  IconArrowRight,
  IconArrowUpRight,
  IconCheck,
  IconCode,
  IconLayoutGrid,
  IconSparkles,
} from "@tabler/icons-react";
import { catalog, catalogPath, componentCount, type ItemName } from "./catalog";
import { Example } from "./examples";
import { HomeSections } from "./home-sections";
import { useStudio } from "./theme-studio";
import { ACCENT_PRESETS, onColor } from "./theme-tokens";

const specimens: { name: ItemName; detail: string }[][] = [
  [
    {
      name: "geo-map",
      detail:
        "Select a region. Follow the routes. Keyboard navigation works, too.",
    },
    {
      name: "deploy-pipeline",
      detail:
        "Live stages, parallel jobs, failure details, and retries. Open any job.",
    },
    {
      name: "cohort-grid",
      detail:
        "Real cohort sizes, incomplete periods, and weighted retention averages.",
    },
    {
      name: "experiment-result",
      detail:
        "Compare the effect, confidence interval, and sample size together.",
    },
  ],
  [
    {
      name: "trace-waterfall",
      detail:
        "Expand spans, isolate services, resize columns, and inspect the slow path.",
    },
    {
      name: "flame-graph",
      detail:
        "Search functions and zoom into a frame. Every width represents real time.",
    },
    {
      name: "gantt-chart",
      detail:
        "Dependencies, milestones, progress, and an adjustable timeline in one view.",
    },
    {
      name: "bullet-chart",
      detail:
        "Actuals, targets, and performance ranges. Including metrics where lower is better.",
    },
  ],
  [
    {
      name: "insight-card",
      detail:
        "A streamed summary with sources you can inspect and a draft you can regenerate.",
    },
    {
      name: "latency-histogram",
      detail:
        "Compare distributions, inspect percentiles, and see the long tail.",
    },
    {
      name: "service-map",
      detail:
        "Follow live traffic between services and inspect each node's health.",
    },
    {
      name: "treemap",
      detail:
        "Explore the hierarchy. Area, color, and drill-down reveal different dimensions.",
    },
    {
      name: "log-stream",
      detail:
        "Follow a live feed, filter levels, search messages, and pause to inspect.",
    },
    {
      name: "host-map",
      detail:
        "A fleet at a glance. Select a host to inspect its health and resource use.",
    },
  ],
];

function Specimen({
  name,
  detail,
  showDetails,
}: {
  name: ItemName;
  detail: string;
  showDetails: boolean;
}) {
  const item = catalog.find((entry) => entry.name === name)!;
  return (
    <article className={`lab-panel lab-${name}`} aria-label={item.title}>
      <Link
        className="lab-source"
        to={catalogPath(item)}
        aria-label={`View ${item.title} source`}
        title={`${item.title} · Source & installation`}
      >
        <IconCode size={15} aria-hidden="true" />
      </Link>
      <div
        className="lab-panel-body"
        role="region"
        aria-label={`${item.title} interactive preview`}
      >
        <Example name={name} />
      </div>
      {showDetails && (
        <p className="lab-note">
          <strong>{item.title}</strong>
          {detail}
        </p>
      )}
    </article>
  );
}

export function Home() {
  const { theme, setTheme } = useStudio();
  const [showDetails, setShowDetails] = useState(false);
  return (
    <main className="home-lab">
      <section className="lab-intro" aria-labelledby="home-title">
        <Link className="lab-announcement" to="/components">
          <span />
          Open source. Ready to make your own.
          <IconArrowUpRight size={12} />
        </Link>
        <h1 id="home-title">
          Your next interface.
          <br />
          <span>Already looking good.</span>
        </h1>
        <p>
          {componentCount} thoughtfully built components for ambitious
          interfaces.
          <br />
          Take the source. Make it yours. Mind the details.
        </p>
        <div className="lab-intro-actions">
          <Link className="lab-primary-button" to="/components">
            Explore components <IconArrowRight size={16} />
          </Link>
          <Link className="lab-secondary-button" to="/docs">
            Get started <IconArrowUpRight size={15} />
          </Link>
        </div>
        <div className="lab-foundation">
          <span>React</span>
          <i />
          <span>Tailwind CSS</span>
          <i />
          <span>shadcn/ui</span>
        </div>
      </section>
      <section className="lab-playground" aria-label="Component playground">
        <div className="lab-toolbar">
          <div className="lab-views">
            <span>
              <IconLayoutGrid size={15} />
              Playground
            </span>
            <a href="#workspace-preview">
              Full workspace <IconArrowUpRight size={14} />
            </a>
          </div>
          <div className="lab-controls">
            <div
              className="lab-accents"
              role="group"
              aria-label="Playground accent"
            >
              {ACCENT_PRESETS.map((item) => (
                <button
                  type="button"
                  key={item.name}
                  title={item.name}
                  aria-label={`${item.name} accent`}
                  aria-pressed={theme.accent === item.value}
                  style={
                    {
                      "--swatch": item.value,
                      color: onColor(item.value),
                    } as CSSProperties
                  }
                  onClick={() =>
                    setTheme((current) => ({ ...current, accent: item.value }))
                  }
                >
                  {theme.accent === item.value && (
                    <IconCheck size={12} stroke={3} />
                  )}
                </button>
              ))}
            </div>
            <button
              className="lab-detail-toggle"
              type="button"
              aria-pressed={showDetails}
              aria-label="Show component details"
              onClick={() => setShowDetails((value) => !value)}
            >
              <IconSparkles size={15} />
              Details
            </button>
          </div>
        </div>
        <div className="lab-grid">
          {specimens.map((column, index) => (
            <div className="lab-column" key={index}>
              {column.map((item) => (
                <Specimen key={item.name} {...item} showDetails={showDetails} />
              ))}
            </div>
          ))}
        </div>
        <div className="lab-playground-caption">
          <span>
            <span className="live-dot" />
            Real components. Sample data. Try every detail.
          </span>
          <Link to="/components">
            Explore all {componentCount} <IconArrowUpRight size={14} />
          </Link>
        </div>
      </section>
      <HomeSections />
    </main>
  );
}
