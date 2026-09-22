import { Link } from "react-router-dom";
import { useState } from "react";
import {
  IconLayoutDashboard,
  IconFolder,
  IconUsers,
  IconSettings,
  IconChevronRight,
  IconSearch,
} from "@tabler/icons-react";
import {
  Scene,
  SceneCard,
  Pill,
  FilterTabs,
  Avatar,
} from "@/components/overtrue/scenes/shared";
const links = [
  ["Overview", "/", IconLayoutDashboard],
  ["Projects", "/tasks", IconFolder],
  ["People", "/users", IconUsers],
  ["Settings", "/settings", IconSettings],
] as const;
export default function Page() {
  const [tab, setTab] = useState("Overview");
  return (
    <Scene
      id="navigation"
      title="Finding your way"
      description="Navigation patterns that give every workspace a clear sense of place."
    >
      <SceneCard
        title="Workspace bar"
        description="The essentials stay close; project details have room to breathe."
      >
        <div className="scene-nav-demo">
          <Link to="/" className="scene-wordmark">
            overtrue/ui
          </Link>
          <nav>
            {links.map(([name, to]) => (
              <Link to={to} key={name}>
                {name}
              </Link>
            ))}
          </nav>
          <Avatar name="Maya Okafor" />
        </div>
      </SceneCard>
      <div className="scene-grid-two">
        <SceneCard title="A focused project sidebar">
          <div className="scene-nav-sidebar">
            <div>
              <span className="scene-eyebrow">ACME STUDIO</span>
              <strong>Visitor experience</strong>
              <Pill>In progress</Pill>
              {links.map(([name, to, Icon]) => (
                <Link to={to} key={name}>
                  <Icon size={17} />
                  {name}
                </Link>
              ))}
            </div>
            <section>
              <span className="scene-eyebrow">PROJECT WORKSPACE</span>
              <h2>Everything in its place.</h2>
              <p>
                Keep the brief, the work, and the people connected. Use the
                sidebar when a project has several related views.
              </p>
            </section>
          </div>
        </SceneCard>
        <SceneCard title="Context without clutter">
          <nav className="scene-breadcrumb" aria-label="Example breadcrumb">
            <Link to="/">Workspace</Link>
            <IconChevronRight size={14} />
            <Link to="/cards">Projects</Link>
            <IconChevronRight size={14} />
            <span>Visitor experience</span>
          </nav>
          <hr />
          <FilterTabs
            items={["Overview", "Files", "Decisions"]}
            value={tab}
            onChange={setTab}
          />
          <div className="scene-note">
            <h3>
              {tab === "Overview"
                ? "One shared brief"
                : tab === "Files"
                  ? "Ready-to-use deliverables"
                  : "The thinking behind the work"}
            </h3>
            <p>
              {tab === "Overview"
                ? "See the project outcome, owner, and next milestone at a glance."
                : tab === "Files"
                  ? "Approved source files and exports stay together in the handover folder."
                  : "Keep the reasons for important choices close to the project."}
            </p>
          </div>
        </SceneCard>
      </div>
      <SceneCard title="Search-led navigation">
        <div className="scene-nav-demo">
          <strong>Acme Studio</strong>
          <Link to="/search-results" className="scene-search">
            <IconSearch size={16} />
            Search the handbook…
          </Link>
          <Link to="/faq">Help & guidance</Link>
        </div>
      </SceneCard>
    </Scene>
  );
}
