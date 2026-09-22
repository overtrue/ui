import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/workspace/studio";
import {
  Scene,
  SceneCard,
  SearchField,
  FilterTabs,
  Action,
  Pill,
} from "./shared";
const assets = [
  ...projects.map((p, i) => ({
    title: p.client,
    category: i % 2 ? "Identity" : "Photography",
    image: p.image,
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    title: [
      "Studio stationery",
      "Seasonal publication",
      "Visitor guide",
      "Member toolkit",
      "Launch directions",
      "Research notes",
    ][i],
    category: "Design",
    image: `/assets/overtrue/project-${String(i + 7).padStart(2, "0")}.svg`,
  })),
];
export function Library({
  id = "gallery",
  title = "The asset library",
  masonry = false,
}: {
  id?: string;
  title?: string;
  masonry?: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState(""),
    [filter, setFilter] = useState("All assets"),
    [selected, setSelected] = useState<(typeof assets)[number] | null>(null);
  useEffect(() => {
    if (selected) dialogRef.current?.showModal();
  }, [selected]);
  const shown = assets.filter(
    (a) =>
      (filter === "All assets" || a.category === filter) &&
      a.title.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const movePreview = (direction: number) => {
    if (!selected || !shown.length) return;
    const index = shown.indexOf(selected);
    setSelected(shown[(index + direction + shown.length) % shown.length]);
  };
  return (
    <Scene
      id={id}
      title={title}
      description="A shared collection of images, identities, and useful starting points."
    >
      <div className="scene-toolbar">
        <FilterTabs
          items={["All assets", "Photography", "Identity", "Design"]}
          value={filter}
          onChange={setFilter}
        />
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search the library…"
        />
      </div>
      <p className="scene-toolbar">
        {shown.length} assets ·{" "}
        {id === "lightbox"
          ? "Open an image, then use the arrow keys to browse"
          : "Original project files and visual directions"}
      </p>
      {!shown.length && (
        <div className="scene-empty-search">
          <h3>No assets found</h3>
          <p>Try another search or browse all categories.</p>
          <Action
            onClick={() => {
              setQuery("");
              setFilter("All assets");
            }}
          >
            Clear filters
          </Action>
        </div>
      )}
      <div
        className={
          id === "photogrid"
            ? "scene-library is-photo-grid"
            : masonry
              ? "scene-library is-masonry"
              : "scene-library"
        }
      >
        {shown.map((a) => (
          <button key={a.title} onClick={() => setSelected(a)}>
            <img src={a.image} alt={a.title} />
            <span>
              <strong>{a.title}</strong>
              <small>{a.category} · Acme Studio</small>
              {id === "cards-masonry" && (
                <p>
                  {a.category === "Photography"
                    ? "A study of spaces, surfaces, and the details that make a place feel welcoming."
                    : "A considered visual direction, from the first idea to a useful set of working assets."}
                </p>
              )}
            </span>
          </button>
        ))}
      </div>
      {selected && (
        <dialog
          ref={dialogRef}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              movePreview(event.key === "ArrowRight" ? 1 : -1);
            }
          }}
          onCancel={() => setSelected(null)}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
          aria-label={selected.title}
          className="scene-asset-dialog"
        >
          <header>
            <div>
              <h2>{selected.title}</h2>
              <Pill>{selected.category}</Pill>
            </div>
            <Action onClick={() => setSelected(null)}>Close preview</Action>
          </header>
          <img src={selected.image} alt={selected.title} />
          <footer>
            <div className="scene-asset-controls">
              <Action onClick={() => movePreview(-1)}>Previous asset</Action>
              <span>
                {shown.indexOf(selected) + 1} / {shown.length}
              </span>
              <Action onClick={() => movePreview(1)}>Next asset</Action>
            </div>
            <a className="scene-button" href={selected.image} download>
              Download asset
            </a>
          </footer>
        </dialog>
      )}
    </Scene>
  );
}
export function Carousel() {
  const [index, setIndex] = useState(0);
  const project = projects[index];
  return (
    <Scene
      id="carousel"
      title="Selected work"
      description="A closer look at the projects shaping our studio."
    >
      <div className="scene-case-study">
        <img src={project.image} alt={project.client} />
        <div>
          <span className="scene-eyebrow">{project.category} / 2026</span>
          <h2>{project.name}</h2>
          <p>
            Building a thoughtful, useful experience for {project.client}. From
            the first conversation to the final handover, every detail has a
            purpose.
          </p>
          <Pill>{project.status}</Pill>
          <div className="scene-toolbar">
            <Action
              onClick={() =>
                setIndex((index + projects.length - 1) % projects.length)
              }
            >
              Previous project
            </Action>
            <span>
              {index + 1} / {projects.length}
            </span>
            <Action onClick={() => setIndex((index + 1) % projects.length)}>
              Next project
            </Action>
          </div>
        </div>
      </div>
    </Scene>
  );
}
export function Illustrations() {
  return (
    <Scene
      id="illustrations"
      title="Small stories, clearly told"
      description="A family of original line illustrations for everyday workspace moments."
    >
      <div className="scene-grid-three">
        {["start", "search", "team", "files", "secure", "connected"].map(
          (name, i) => (
            <SceneCard
              title={
                [
                  "A fresh start",
                  "Find your focus",
                  "Better together",
                  "Everything in place",
                  "Made for trust",
                  "Stay connected",
                ][i]
              }
              key={name}
            >
              <img
                className="scene-illustration"
                src={`/assets/overtrue/illustration-${name}.svg`}
                alt={`${name} workspace illustration`}
              />
              <p>
                {
                  [
                    "Welcome a new project with a clear brief.",
                    "Give people a useful path to what they need.",
                    "Make everyone’s contribution visible.",
                    "Keep decisions close to the work.",
                    "Put access in the right hands.",
                    "Show when everything is working.",
                  ][i]
                }
              </p>
            </SceneCard>
          ),
        )}
      </div>
    </Scene>
  );
}
export function Media({ id = "creative-review" }: { id?: string }) {
  const [selected, setSelected] = useState(0),
    [drafts, setDrafts] = useState<Record<number, string>>({}),
    [notes, setNotes] = useState<Record<number, string[]>>({});
  const note = drafts[selected] ?? "";
  const setNote = (value: string) =>
    setDrafts((current) => ({ ...current, [selected]: value }));
  return (
    <Scene
      id={id}
      title={id === "artwork-review" ? "Artwork proofing" : "Creative review"}
      description="A focused space to review campaign artwork and leave useful feedback."
    >
      <div className="scene-grid-main">
        <SceneCard title={projects[selected].name}>
          <img
            className="scene-review-image"
            src={projects[selected].image}
            alt={projects[selected].name}
          />
          <div className="scene-toolbar">
            <Pill>Version 03</Pill>
            <span>Uploaded by {projects[selected].owner}</span>
          </div>
          <div className="scene-review-meta">
            <strong>
              {id === "artwork-review"
                ? "Print proof · CMYK · 300 dpi"
                : "Campaign direction · Digital preview"}
            </strong>
            <p>
              {id === "artwork-review"
                ? "Check margins, small type, and color consistency before approving the production files."
                : "Review the hierarchy, tone, and first impression. Keep each note focused on one decision."}
            </p>
          </div>
          <form
            className="scene-compose"
            onSubmit={(e) => {
              e.preventDefault();
              if (!note.trim()) return;
              setNotes((current) => ({
                ...current,
                [selected]: [...(current[selected] ?? []), note.trim()],
              }));
              setNote("");
            }}
          >
            <label>
              Review note
              <input
                required
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What would make this clearer?"
              />
            </label>
            <Action type="submit">Add note</Action>
          </form>
          <div className="scene-saved-note">
            <Pill>Review brief</Pill>
            <p>
              {id === "artwork-review"
                ? "Please verify the safe area around the wordmark and the legibility of the smallest caption."
                : "Does this direction clearly communicate the idea before someone reads the supporting copy?"}
            </p>
            <small>Ines Duarte · Today, 09:40</small>
          </div>
          {(notes[selected] ?? []).map((n, i) => (
            <p className="scene-note" key={i}>
              {n}
            </p>
          ))}
        </SceneCard>
        <SceneCard title="Review queue">
          {projects.slice(0, 4).map((p, i) => (
            <button
              className="scene-media-row"
              aria-pressed={selected === i}
              key={p.id}
              onClick={() => {
                setSelected(i);
              }}
            >
              <img src={p.image} alt="" />
              <span>
                <strong>{p.client}</strong>
                <small>{p.category}</small>
              </span>
            </button>
          ))}
        </SceneCard>
      </div>
    </Scene>
  );
}
