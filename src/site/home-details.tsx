import { useState } from "react";
import { Link } from "react-router-dom";
import {
  IconArrowRight,
  IconArrowUpRight,
  IconLayoutGrid,
  IconChartLine,
  IconActivity,
  IconSparkles,
  IconReceipt2,
  IconTopologyStar3,
} from "@tabler/icons-react";
import { catalogPath, catalog, componentCount, blockCount } from "./catalog";
import { Example } from "./examples";
import workspacePages from "@/data/workspace/pages.json";
import { ProjectPortfolio } from "@/registry/overtrue/project-portfolio";
import { portfolioProjects, siteOwner } from "./demo-data";

const featured = [
  {
    name: "project-portfolio",
    title: "Project portfolio",
    label: "Projects",
    icon: IconLayoutGrid,
    description: "Give every project a clear next step.",
    detail:
      "Cover images, owners, progress, and search. A working collection, ready for your own projects.",
  },
  {
    name: "model-usage",
    title: "AI gateway",
    label: "AI usage",
    icon: IconSparkles,
    description: "Know what every model costs you.",
    detail:
      "Requests, tokens, and spend by model, gateway latency, and a written summary. Select a model to isolate it.",
  },
  {
    name: "service-explorer",
    title: "Service explorer",
    label: "Services",
    icon: IconTopologyStar3,
    description: "Follow a slow request to its cause.",
    detail:
      "A live service map drives the page: pick a service to see its latency, its slowest request, and a CPU profile.",
  },
  {
    name: "revenue-overview",
    title: "Revenue",
    label: "Revenue",
    icon: IconReceipt2,
    description: "Read the month in one screen.",
    detail:
      "Recurring revenue, the MRR bridge, plan mix, cohort retention, and targets, all reconciled.",
  },
  {
    name: "analytics-overview",
    title: "Analytics overview",
    label: "Analytics",
    icon: IconChartLine,
    description: "See the story behind the numbers.",
    detail:
      "Compare periods, follow conversions, and export a report. Every panel stays in sync.",
  },
  {
    name: "service-status",
    title: "Service status",
    label: "Service health",
    icon: IconActivity,
    description: "Keep service health easy to read.",
    detail:
      "Current status and availability history together. Switch the period to see the bigger picture.",
  },
] as const;
const homeProjects = [
  { ...portfolioProjects[0], owner: siteOwner },
  portfolioProjects[2],
];

export function FeaturedBlocks() {
  const [selected, setSelected] = useState<(typeof featured)[number]["name"]>(
    featured[0].name,
  );
  const item = catalog.find((item) => item.name === selected)!;
  const active = featured.find((entry) => entry.name === selected)!;
  const PreviewIcon = active.icon;
  return (
      <section
        className="home-band assembled-section"
        aria-labelledby="assembled-title"
      >
        <div className="home-heading">
          <h2 className="headline" id="assembled-title">
            From components<br />to the complete picture.
          </h2>
          <div>
            <p className="lede">
              Blocks combine components into complete interfaces you can
              install and adapt: an AI gateway, a revenue report, a project
              portfolio, a status page.
            </p>
            <Link className="text-link" to="/blocks">
              Browse all blocks <IconArrowRight size={16} />
            </Link>
          </div>
        </div>
        <div className="assembled-shell">
          <div className="showcase-rail">
            <div
              className="showcase-switcher"
              role="group"
              aria-label="Featured blocks"
            >
              {featured.map(
                ({ name, title, icon: Icon, description }) => (
                  <button
                    key={name}
                    type="button"
                    aria-label={title}
                    title={description}
                    aria-controls="assembled-preview"
                    aria-pressed={selected === name}
                    onClick={() => setSelected(name)}
                  >
                    <span className="showcase-option-heading">
                      <Icon size={17} stroke={1.6} />
                      <strong>{title}</strong>
                    </span>
                  </button>
                ),
              )}
            </div>
          </div>
          <div className="showcase-canvas">
            <div className="showcase-toolbar">
              <span>
                <PreviewIcon size={15} stroke={1.6} />
                Workspace<span className="showcase-slash">/</span>
                <strong>{active.label}</strong>
              </span>
              <span className="showcase-preview-label">
                <span className="live-dot" />
                Live preview
              </span>
            </div>
            <div
              id="assembled-preview"
              className="assembled-preview"
              key={selected}
              role="region"
              aria-label={`${active.title} preview`}
            >
              {selected === "project-portfolio" ? (
                <ProjectPortfolio
                  projects={homeProjects}
                  description="Selected projects · overtrue"
                />
              ) : (
                <Example name={selected} />
              )}
            </div>
          </div>
          <div className="showcase-detail">
            <p>{active.detail}</p>
            <Link className="text-link" to={catalogPath(item)}>
              Source & installation <IconArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>
  );
}

export function Questions() {
  return (
      <section
        className="home-band questions-section"
        aria-labelledby="questions-title"
      >
        <div>
          <h2 className="headline" id="questions-title">
            Questions
          </h2>
          <p className="lede">Licensing, compatibility, and what isn’t included.</p>
          <Link className="text-link" to="/docs">
            Read the documentation <IconArrowRight size={16} />
          </Link>
        </div>
        <div className="questions-list">
          <details>
            <summary>What is included?</summary>
            <div className="question-answer">
              {componentCount} components, {blockCount} complete blocks, and an
              optional theme. The workspace gallery adds {workspacePages.length} pages to explore;
              those example pages are separate from the installable registry.
            </div>
          </details>
          <details>
            <summary>Can I use it in a commercial project?</summary>
            <div className="question-answer">
              Yes. The code is available under the{" "}
              <a href="/LICENSE.txt">MIT license</a>. Keep the required
              copyright and license notices when redistributing it.
            </div>
          </details>
          <details>
            <summary>Does it work with my existing shadcn project?</summary>
            <div className="question-answer">
              The registry targets React, TypeScript, and Tailwind CSS v4.
              Components inherit your semantic tokens. You can keep your
              existing theme and add one component at a time.
            </div>
          </details>
          <details>
            <summary>Is there a package to keep up to date?</summary>
            <div className="question-answer">
              The CLI copies editable source into your project and installs its
              dependencies. Your changes stay yours. Compare new versions before
              replacing a file you have customized.
            </div>
          </details>
          <details>
            <summary>Does it include a backend?</summary>
            <div className="question-answer">
              No. Previews use sample data and local interactions. Bring your
              own API, authentication, and persistence. The{" "}
              <Link to="/docs/composition">composition guide</Link> explains
              where to connect them.
            </div>
          </details>
        </div>
      </section>
  );
}
