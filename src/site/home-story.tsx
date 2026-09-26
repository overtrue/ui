import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import {
  IconArrowRight,
  IconArrowUpRight,
  IconBrandGithub,
  IconCheck,
  IconCode,
  IconCommand,
  IconSparkles,
  IconTerminal2,
} from "@tabler/icons-react";
import { Dashboard } from "@/registry/overtrue/dashboard";
import { StatCard } from "@/registry/overtrue/stat-card";
import { TaskList } from "@/registry/overtrue/task-list";
import { ResourceProgress } from "@/registry/overtrue/resource-progress";
import { SectionCard } from "@/registry/overtrue/section-card";
import { AvatarStack } from "@/registry/overtrue/avatar-stack";
import { StatusBadge } from "@/registry/overtrue/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandMark } from "@/components/brand-mark";
import { componentCount, blockCount, cardCount } from "./catalog";
import { siteOwner, portfolioProjects } from "./demo-data";
import { CopyButton, HighlightedCode } from "./code";
import { HomeDetails } from "./home-details";

const accents = [
  { name: "Cobalt", color: "#2563eb" },
  { name: "Iris", color: "#7c3aed" },
  { name: "Jade", color: "#0f766e" },
];
const initialTasks = [
  {
    id: "research",
    title: "Find your direction",
    due: "A good place to start",
    done: true,
  },
  {
    id: "design",
    title: "Make the details yours",
    due: "Your next move",
    done: false,
  },
  {
    id: "launch",
    title: "Put it out into the world",
    due: "Ready when you are",
    done: false,
  },
];
const exampleCode = `import { StatCard } from "@/components/overtrue/stat-card"

export function Overview() {
  return (
    <StatCard
      title="Monthly revenue"
      value="$36,800"
      change="12.8%"
      trend="up"
    />
  )
}`;

function ComponentStudio() {
  const [accent, setAccent] = useState(accents[0]);
  const [tasks, setTasks] = useState(initialTasks);
  const [name, setName] = useState("Orbit studio");
  const [workspace, setWorkspace] = useState("Orbit studio");
  const [saved, setSaved] = useState(false);
  const completed = tasks.filter((task) => task.done).length;
  return (
    <section
      className="story-section studio-section story-reveal"
      aria-labelledby="studio-title"
    >
      <div className="story-heading">
        <div>
          <p className="story-kicker">
            <span>01 /</span> THE DETAIL STUDIO
          </p>
          <h2 className="story-title" id="studio-title">
            Make it feel
            <br />
            <em>like yours.</em>
          </h2>
        </div>
        <div className="story-heading-aside">
          <p>
            Start with a considered foundation.
            <br />
            Then give it your own point of view.
          </p>
          <Link className="text-link" to="/docs/design">
            Explore the design system <IconArrowUpRight size={16} />
          </Link>
        </div>
      </div>
      <div
        className="studio-workbench"
        style={
          {
            "--studio-accent": accent.color,
            "--primary": accent.color,
            "--primary-foreground": "#fff",
            "--ring": accent.color,
          } as CSSProperties
        }
      >
        <div className="studio-controls">
          <span>
            <IconSparkles size={16} aria-hidden="true" /> A small change. A
            whole new feeling.
          </span>
          <div
            className="studio-swatches"
            role="group"
            aria-label="Preview accent"
          >
            {accents.map((item) => (
              <button
                key={item.name}
                type="button"
                aria-label={`${item.name} accent`}
                aria-pressed={accent.name === item.name}
                onClick={() => setAccent(item)}
              >
                <span style={{ background: item.color }}>
                  {accent.name === item.name && (
                    <IconCheck size={12} aria-hidden="true" />
                  )}
                </span>
                {item.name}
              </button>
            ))}
          </div>
        </div>
        <div className="studio-canvas">
          <div className="studio-floating-label" aria-hidden="true">
            <span /> MADE TO BE REMIXED
          </div>
          <div className="studio-app">
            <div className="studio-app-heading">
              <div className="studio-app-brand">
                <span>
                  <BrandMark />
                </span>
                <div>
                  <strong>{workspace}</strong>
                  <small>Your daily perspective</small>
                </div>
              </div>
              <AvatarStack members={[siteOwner, portfolioProjects[2].owner]} />
            </div>
            <div className="studio-metrics">
              <StatCard
                title="Monthly revenue"
                value="$36,800"
                change="12.8%"
                trend="up"
                sparkline={[8, 12, 10, 17, 15, 23, 20, 28, 26, 36]}
              />
              <SectionCard
                title="Good things in progress"
                description="One thoughtful detail at a time."
              >
                <ResourceProgress
                  label="Ready for launch"
                  value={completed}
                  max={tasks.length}
                  valueLabel={`${completed} of ${tasks.length} complete`}
                />
                <div className="studio-progress-note">
                  <StatusBadge
                    variant={completed === tasks.length ? "success" : "info"}
                  >
                    {completed === tasks.length
                      ? "Ready to go"
                      : "Taking shape"}
                  </StatusBadge>
                  <span>Keep going. It’s looking good.</span>
                </div>
              </SectionCard>
            </div>
            <div className="studio-bottom">
              <TaskList
                title="The next small steps"
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
                title="A name of your own"
                description="Try it. This preview is yours to play with."
              >
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    setWorkspace(name.trim());
                    setSaved(true);
                  }}
                  className="studio-form"
                >
                  <label htmlFor="studio-workspace-name">Workspace name</label>
                  <Input
                    id="studio-workspace-name"
                    name="workspace-name"
                    value={name}
                    maxLength={32}
                    required
                    onChange={(event) => {
                      setName(event.target.value);
                      setSaved(false);
                    }}
                  />
                  <Button type="submit" disabled={!name.trim()}>
                    Update preview <IconArrowRight size={15} />
                  </Button>
                  <p role="status">
                    {saved
                      ? "Preview updated. Looking like you."
                      : "Change the name. Check a task. Try an accent."}
                  </p>
                </form>
              </SectionCard>
            </div>
          </div>
          <span className="studio-coordinate" aria-hidden="true">
            FIG. 01 — YOUR NEXT INTERFACE
          </span>
        </div>
      </div>
      <div className="studio-footnote">
        <span>Real components. Real interactions.</span>
        <span>
          React <i /> Tailwind CSS <i /> shadcn/ui
        </span>
      </div>
    </section>
  );
}

export function HomeStory({ children }: { children: ReactNode }) {
  const story = useRef<HTMLDivElement>(null);
  const installCommand = `npx shadcn@latest add ${window.location.origin}/r/stat-card.json`;
  useEffect(() => {
    const root = story.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -32px 0px", threshold: 0.05 },
    );
    root
      .querySelectorAll(".story-reveal")
      .forEach((element) => observer.observe(element));
    root.dataset.revealReady = "true";
    return () => observer.disconnect();
  }, []);
  return (
    <div className="home-story" ref={story}>
      <div className="story-intro story-reveal">
        <p>A toolkit with a point of view.</p>
        <div>
          <span>
            <strong>{componentCount}</strong> components
          </span>
          <span>
            <strong>{blockCount}</strong> complete blocks
          </span>
          <span>
            <strong>{cardCount}</strong> card patterns
          </span>
          <Link to="/docs">
            One familiar stack <IconArrowUpRight size={15} />
          </Link>
        </div>
      </div>
      <ComponentStudio />
      <section
        className="workspace-showcase story-stage"
        id="workspace-preview"
        aria-labelledby="workspace-stage-title"
      >
        <div className="story-section story-reveal">
          <div className="stage-heading">
            <p className="story-kicker">
              <span>02 /</span> THE BIGGER PICTURE
            </p>
            <h2 className="story-title" id="workspace-stage-title">
              All the pieces.
              <br />
              <span>One beautiful whole.</span>
            </h2>
            <p>
              A workspace you can actually use.
              <br />
              Explore the navigation, change the data, make yourself at home.
            </p>
          </div>
          <div className="hero-product">
            <div className="product-label">
              <span>
                <span className="live-dot" /> Interactive workspace · Sample
                data
              </span>
              <Link to="/blocks/dashboard">
                Explore the block <IconArrowUpRight size={14} />
              </Link>
            </div>
            <div className="stage-window-bar" aria-hidden="true">
              <span />
              <span />
              <span />
              <p>workspace / overview</p>
              <IconCommand size={13} />
            </div>
            <Dashboard compact workspaceName="overtrue" user={siteOwner} />
            <div className="product-caption">
              <span>Designed as a system. Ready for your story.</span>
              <a href="/workspace/">
                Open the full workspace <IconArrowUpRight size={14} />
              </a>
            </div>
          </div>
          <div className="stage-facts">
            <div>
              <strong>01</strong>
              <span>Pick your pieces</span>
              <p>Start with the part you need.</p>
            </div>
            <div>
              <strong>02</strong>
              <span>Connect the details</span>
              <p>Patterns that belong together.</p>
            </div>
            <div>
              <strong>03</strong>
              <span>Make your next move</span>
              <p>Your data. Your product. Your call.</p>
            </div>
          </div>
        </div>
      </section>
      <section
        className="story-section collection-section story-reveal"
        aria-labelledby="collection-title"
      >
        <div className="story-heading">
          <div>
            <p className="story-kicker">
              <span>03 /</span> THE EVERYDAY ESSENTIALS
            </p>
            <h2 className="story-title" id="collection-title">
              Small things.
              <br />
              <em>Big difference.</em>
            </h2>
          </div>
          <div className="story-heading-aside">
            <p>
              The charts, controls, and quiet little details
              <br />
              that make an interface feel finished.
            </p>
            <Link className="text-link" to="/components">
              All {componentCount} components <IconArrowRight size={16} />
            </Link>
          </div>
        </div>
        {children}
        <p className="gallery-hint">
          Scroll to explore <IconArrowRight size={13} />
        </p>
      </section>
      <section
        className="story-section story-install story-reveal"
        aria-labelledby="install-title"
      >
        <div className="install-copy">
          <p className="story-kicker">
            <span>04 /</span> FROM HERE TO YOUR EDITOR
          </p>
          <h2 className="story-title" id="install-title">
            A few seconds.
            <br />
            <em>Then it’s yours.</em>
          </h2>
          <p>
            One command puts the source in your project. Read it, reshape it,
            take it somewhere new.
          </p>
          <Link className="text-link" to="/docs">
            Start building <IconArrowUpRight size={16} />
          </Link>
          <div className="install-principles">
            <span>
              <IconCheck size={15} /> Editable source
            </span>
            <span>
              <IconCheck size={15} /> MIT licensed
            </span>
            <span>
              <IconCheck size={15} /> Your existing stack
            </span>
          </div>
        </div>
        <div className="install-editor">
          <div className="install-editor-bar">
            <span>
              <IconCode size={15} /> overview.tsx
            </span>
            <span>YOUR PROJECT</span>
          </div>
          <HighlightedCode text={exampleCode} language="tsx" />
          <div className="install-command">
            <div>
              <IconTerminal2 size={16} />
              <span>Make your first move</span>
              <CopyButton
                text={installCommand}
                label="Copy installation command"
              />
            </div>
            <code>{installCommand}</code>
          </div>
          <div className="install-editor-footer">
            <span className="live-dot" />
            <span>Good foundations. Room to make it your own.</span>
            <IconArrowUpRight size={15} />
          </div>
        </div>
      </section>
      <HomeDetails />
      <section className="story-finale" aria-labelledby="finale-title">
        <div className="story-section story-reveal">
          <div className="finale-top">
            <span>YOUR NEXT CHAPTER</span>
            <span>OPEN SOURCE. OPEN POSSIBILITIES.</span>
          </div>
          <h2 className="story-title" id="finale-title">
            Make something
            <br />
            <em>worth opening.</em>
          </h2>
          <div className="finale-bottom">
            <p>
              The pieces are here.
              <br />
              We can’t wait to see what you make.
            </p>
            <div>
              <Link className="finale-cta" to="/components">
                Find your first component <IconArrowUpRight size={24} />
              </Link>
              <a
                className="finale-source"
                href="https://github.com/overtrue/ui"
                target="_blank"
                rel="noreferrer"
              >
                <IconBrandGithub size={17} /> Get the source
              </a>
            </div>
          </div>
          <div className="finale-watermark" aria-hidden="true">
            overtrue/ui
          </div>
        </div>
      </section>
    </div>
  );
}
