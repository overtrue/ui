import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconAdjustments,
  IconFileText,
  IconSearch,
  IconUsers,
} from "@tabler/icons-react";
import {
  Scene,
  SceneCard,
  Person,
  Pill,
} from "@/components/overtrue/scenes/shared";
import { DetailList } from "@/registry/overtrue/detail-list";
import {
  WorkspaceAction,
  WorkspaceOffcanvas,
} from "@/components/overtrue/workspace/primitives";
const panels = [
  {
    side: "start",
    title: "Project navigation",
    description: "Move between projects without leaving the current view.",
    icon: IconUsers,
  },
  {
    side: "end",
    title: "Project details",
    description: "Inspect the brief, owner, and milestone alongside your work.",
    icon: IconFileText,
  },
  {
    side: "top",
    title: "Quick search",
    description: "Find a project or jump to a useful workspace page.",
    icon: IconSearch,
  },
  {
    side: "bottom",
    title: "View preferences",
    description: "Adjust a compact set of options in a bottom sheet.",
    icon: IconAdjustments,
  },
] as const;
export default function Page() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  return (
    <Scene
      id="offcanvas"
      title="Keep the context close"
      description="Four ways to reveal useful detail while keeping your place in the workspace."
    >
      <div className="scene-grid-two showcase-grid">
        {panels.map(({ side, title, description, icon: Icon }) => (
          <SceneCard key={side} title={title} description={description}>
            <div
              className={`showcase-panel-preview is-${side}`}
              aria-hidden="true"
            >
              <div>
                <Icon size={22} />
                <i />
                <i />
                <i />
              </div>
              <span />
              <span />
              <span />
            </div>
            <WorkspaceAction
              className="scene-button"
              target={`#panel-${side}`}
              action="open"
            >
              Open {side} panel
            </WorkspaceAction>
            <WorkspaceOffcanvas
              className={`pn-offcanvas pn-offcanvas-${side}`}
              id={`panel-${side}`}
            >
              <div className="pn-offcanvas-header">
                <h2 className="pn-offcanvas-title">{title}</h2>
                <WorkspaceAction
                  className="pn-btn-close"
                  aria-label="Close panel"
                  action="dismiss"
                />
              </div>
              <div className="pn-offcanvas-body">
                {side === "start" ? (
                  <nav className="showcase-panel-links">
                    <a href="#/cards">
                      All projects <span>6</span>
                    </a>
                    <a href="#/tasks">
                      Project board <span>6</span>
                    </a>
                    <a href="#/gallery">
                      Asset library <span>12</span>
                    </a>
                    <a href="#/fullcalendar">Studio calendar</a>
                  </nav>
                ) : side === "end" ? (
                  <>
                    <Pill>In progress</Pill>
                    <h3 className="pn-mt-3">Visitor experience</h3>
                    <p>
                      A welcoming arrival journey, from the entrance to the
                      first exhibition.
                    </p>
                    <Person name="Maya Okafor" subtitle="Project owner" />
                    <DetailList
                      className="mt-6"
                      items={[
                        {
                          id: "client",
                          label: "Client",
                          value: "Culture venue",
                        },
                        {
                          id: "due",
                          label: "Next milestone",
                          value: "October 09",
                        },
                        { id: "progress", label: "Progress", value: "72%" },
                      ]}
                    />
                  </>
                ) : side === "top" ? (
                  <form
                    className="scene-form"
                    onSubmit={(event) => {
                      event.preventDefault();
                      navigate(
                        `/search-results?query=${encodeURIComponent(query)}`,
                      );
                    }}
                  >
                    <label>
                      Search the handbook
                      <input
                        name="q"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Project handover, files, reviews…"
                      />
                    </label>
                    <button type="submit" className="scene-button">
                      Search handbook
                    </button>
                  </form>
                ) : (
                  <div className="scene-form">
                    {[
                      "Show completed projects",
                      "Include archived files",
                      "Group results by owner",
                    ].map((label, i) => (
                      <label className="scene-toggle-row" key={label}>
                        <span>{label}</span>
                        <input type="checkbox" defaultChecked={i === 2} />
                      </label>
                    ))}
                  </div>
                )}
                <div className="pn-mt-4">
                  <WorkspaceAction
                    className="scene-button is-primary"
                    action="dismiss"
                  >
                    Done
                  </WorkspaceAction>
                </div>
              </div>
            </WorkspaceOffcanvas>
          </SceneCard>
        ))}
      </div>
    </Scene>
  );
}
