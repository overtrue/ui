import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { DetailList } from "@/registry/overtrue/detail-list";
import { FileBrowser } from "@/registry/overtrue/file-browser";
import { IconLayoutGrid, IconList } from "@tabler/icons-react";
import { projects } from "@/data/workspace/studio";
import {
  Scene,
  SceneCard,
  SearchField,
  FilterTabs,
  Action,
  Pill,
  Person,
  Go,
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
    image: `/assets/overtrue/project-${String(i + 7).padStart(2, "0")}.webp`,
  })),
];
export function Library({
  id = "gallery",
  title = "Asset library",
  masonry = false,
}: {
  id?: string;
  title?: string;
  masonry?: boolean;
}) {
  const [view, setView] = useState("Grid");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previewTriggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
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
  const closePreview = () => {
    dialogRef.current?.close();
    setSelected(null);
    previewTriggerRef.current?.focus();
  };
  return (
    <Scene
      id={id}
      title={title}
      description="Find approved artwork, review visual directions, and download source assets."
    >
      <div className="scene-page-tabs">
        <Link
          to="/gallery"
          aria-current={
            id === "gallery" || id === "lightbox" ? "page" : undefined
          }
        >
          All files
        </Link>
        <Link
          to="/photogrid"
          aria-current={id === "photogrid" ? "page" : undefined}
        >
          Photo collection
        </Link>
        <Link
          to="/cards-masonry"
          aria-current={id === "cards-masonry" ? "page" : undefined}
        >
          Moodboards
        </Link>
        <span className="scene-tabs-context">
          {assets.length} shared assets
        </span>
      </div>
      <div className="scene-toolbar">
        <FilterTabs
          items={["All assets", "Photography", "Identity", "Design"]}
          value={filter}
          onChange={setFilter}
        />
        <SearchField
          ref={searchRef}
          value={query}
          onChange={setQuery}
          placeholder="Search the library…"
        />
      </div>
      <div className="scene-toolbar">
        <span>
          {selectedIds.length
            ? `${selectedIds.length} selected`
            : `${shown.length} assets`}{" "}
          · Acme Studio
        </span>
        <div className="scene-view-switch" aria-label="Asset view">
          <button
            aria-pressed={view === "Grid"}
            onClick={() => setView("Grid")}
          >
            <IconLayoutGrid size={16} />
            Grid
          </button>
          <button
            aria-pressed={view === "List"}
            onClick={() => setView("List")}
          >
            <IconList size={16} />
            List
          </button>
        </div>
      </div>
      {selectedIds.length > 0 && (
        <div className="scene-selection-bar">
          <span>{selectedIds.length} files selected</span>
          <Action onClick={() => setSelectedIds([])}>Clear selection</Action>
        </div>
      )}
      {!shown.length && (
        <div className="scene-empty-search">
          <h3>No assets found</h3>
          <p>Try another search or browse all categories.</p>
          <Action
            onClick={() => {
              setQuery("");
              setFilter("All assets");
              searchRef.current?.focus();
            }}
          >
            Clear filters
          </Action>
        </div>
      )}
      {view === "List" ? (
        <FileBrowser
          files={shown.map((asset) => ({
            id: asset.image,
            name: asset.title,
            kind: "image",
            preview: asset.image,
            downloadUrl: asset.image,
            owner: asset.category,
            updated: "Sep 21, 2026",
          }))}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onOpen={(file) => {
            if (document.activeElement instanceof HTMLButtonElement)
              previewTriggerRef.current = document.activeElement;
            setSelected(
              assets.find((asset) => asset.image === file.id) ?? null,
            );
          }}
        />
      ) : (
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
            <button
              key={a.title}
              onClick={(event) => {
                previewTriggerRef.current = event.currentTarget;
                setSelected(a);
              }}
            >
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
      )}
      {selected && (
        <dialog
          ref={dialogRef}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              movePreview(event.key === "ArrowRight" ? 1 : -1);
            }
          }}
          onCancel={(event) => {
            event.preventDefault();
            closePreview();
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closePreview();
          }}
          aria-label={selected.title}
          className="scene-asset-dialog"
        >
          <header>
            <div>
              <h2>{selected.title}</h2>
              <Pill>{selected.category}</Pill>
            </div>
            <Action onClick={closePreview}>Close preview</Action>
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
      title="Portfolio review"
      description="Review project directions and open their delivery details."
      actions={<Go to="/cards">All projects</Go>}
    >
      <div className="scene-product-grid">
        <div className="scene-product-primary">
          <SceneCard title={project.name} description={project.client}>
            <img
              className="scene-portfolio-image"
              src={project.image}
              alt={`${project.name} concept`}
            />
            <div className="scene-toolbar scene-review-pagination">
              <Action
                onClick={() =>
                  setIndex((index + projects.length - 1) % projects.length)
                }
              >
                Previous
              </Action>
              <span aria-live="polite">
                {index + 1} of {projects.length}
              </span>
              <Action onClick={() => setIndex((index + 1) % projects.length)}>
                Next
              </Action>
            </div>
          </SceneCard>
          <div className="scene-thumbnail-strip" aria-label="Choose a project">
            {projects.map((item, i) => (
              <button
                key={item.id}
                aria-label={item.name}
                aria-pressed={i === index}
                onClick={() => setIndex(i)}
              >
                <img src={item.image} alt="" />
              </button>
            ))}
          </div>
        </div>
        <aside className="scene-product-aside">
          <SceneCard title="Project details">
            <Pill>{project.status}</Pill>
            <div className="scene-record-list">
              <div>
                <Person name={project.owner} subtitle="Project owner" />
              </div>
            </div>
            <DetailList
              items={[
                {
                  id: "category",
                  label: "Discipline",
                  value: project.category,
                },
                { id: "client", label: "Client", value: project.client },
                { id: "delivery", label: "Next milestone", value: project.due },
              ]}
            />
            <Go to={`/datagrid?project=${project.id}`}>Open project</Go>
          </SceneCard>
          <SceneCard title="Review context">
            <p>
              Check that the visual direction meets the project brief before
              reviewing individual production assets.
            </p>
            <Go to="/creative-review">Artwork review</Go>
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}

export function Illustrations() {
  const items = [
    {
      id: "start",
      name: "Getting started",
      usage: "New workspace and onboarding",
    },
    { id: "search", name: "Search", usage: "Empty search results" },
    { id: "team", name: "Team", usage: "Invitations and collaboration" },
    { id: "files", name: "Files", usage: "Asset folders and uploads" },
    { id: "secure", name: "Security", usage: "Access and verification" },
    { id: "connected", name: "Connected", usage: "Successful connections" },
  ];
  const [selected, setSelected] = useState(items[0]);
  return (
    <Scene
      id="illustrations"
      title="Illustration library"
      description="Approved artwork for workspace messages and onboarding."
      actions={<Go to="/gallery">All assets</Go>}
    >
      <div className="scene-product-grid">
        <SceneCard
          title="Approved assets"
          description="Select an illustration to inspect and download it."
        >
          <div className="scene-illustration-options">
            {items.map((item) => (
              <button
                key={item.id}
                aria-pressed={selected.id === item.id}
                onClick={() => setSelected(item)}
              >
                <img
                  src={`/assets/overtrue/illustration-${item.id}.webp`}
                  alt=""
                />
                <strong>{item.name}</strong>
              </button>
            ))}
          </div>
        </SceneCard>
        <aside className="scene-product-aside">
          <SceneCard title={selected.name}>
            <img
              className="scene-illustration-preview"
              src={`/assets/overtrue/illustration-${selected.id}.webp`}
              alt={selected.name}
            />
            <DetailList
              items={[
                { id: "use", label: "Usage", value: selected.usage },
                { id: "format", label: "Format", value: "WebP" },
                { id: "status", label: "Approval", value: "Approved" },
              ]}
            />
            <a
              className="scene-button"
              href={`/assets/overtrue/illustration-${selected.id}.webp`}
              download
            >
              Download artwork
            </a>
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}

export function Media({ id = "creative-review" }: { id?: string }) {
  const [selected, setSelected] = useState(0);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [notes, setNotes] = useState<Record<number, string[]>>({});
  const [decisions, setDecisions] = useState<Record<number, string>>({});
  const project = projects[selected];
  const note = drafts[selected] ?? "";
  function addNote() {
    if (!note.trim()) return;
    setNotes((items) => ({
      ...items,
      [selected]: [...(items[selected] ?? []), note.trim()],
    }));
    setDrafts((items) => ({ ...items, [selected]: "" }));
  }
  return (
    <Scene
      id={id}
      title={id === "artwork-review" ? "Print proofing" : "Creative review"}
      description="Review the latest artwork, record feedback, and confirm the next step."
      actions={<Go to="/gallery">Asset library</Go>}
    >
      <div className="scene-review-projects">
        {projects.slice(0, 4).map((item, i) => (
          <button
            key={item.id}
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
          >
            <img src={item.image} alt="" />
            <span>{item.name}</span>
          </button>
        ))}
      </div>
      <div className="scene-product-grid">
        <div className="scene-product-primary">
          <SceneCard
            title={project.name}
            description={`${project.client} · Version 03`}
            action={<Pill>{decisions[selected] ?? "In review"}</Pill>}
          >
            <img
              className="scene-portfolio-image"
              src={project.image}
              alt={`${project.name} artwork for review`}
            />
            <div className="scene-toolbar scene-review-pagination">
              <span className="scene-subtle">Uploaded by {project.owner}</span>
              <a className="scene-button" href={project.image} download>
                Download proof
              </a>
            </div>
          </SceneCard>
          <SceneCard title="Review brief">
            <p>
              {id === "artwork-review"
                ? "Check the safe area around the wordmark, small caption legibility, and color consistency before preparing production files."
                : "Check the visual hierarchy, tone, and first impression against the agreed project scope. Keep each note focused on one decision."}
            </p>
            <DetailList
              items={[
                {
                  id: "format",
                  label: "Preview",
                  value:
                    id === "artwork-review"
                      ? "Print proof · Screen preview"
                      : "Campaign direction",
                },
                { id: "due", label: "Review deadline", value: project.due },
                { id: "version", label: "Version", value: "03 · Current" },
              ]}
            />
          </SceneCard>
        </div>
        <aside className="scene-product-aside">
          <SceneCard title="Review decision">
            <Person name="Maya Okafor" subtitle="Reviewer" />
            <p>Approve this version or record what needs to change.</p>
            <div className="scene-actions">
              <Action
                primary
                onClick={() =>
                  setDecisions((items) => ({
                    ...items,
                    [selected]: "Approved",
                  }))
                }
              >
                Approve
              </Action>
              <Action
                disabled={!note.trim() && !notes[selected]?.length}
                onClick={() => {
                  addNote();
                  setDecisions((items) => ({
                    ...items,
                    [selected]: "Changes requested",
                  }));
                }}
              >
                Request changes
              </Action>
            </div>
            <p role="status" className="scene-subtle">
              {decisions[selected]
                ? `${decisions[selected]} · Saved in this review.`
                : "Add a note before requesting changes."}
            </p>
          </SceneCard>
          <SceneCard title={`Feedback · ${notes[selected]?.length ?? 0}`}>
            <form
              className="scene-form"
              onSubmit={(e) => {
                e.preventDefault();
                addNote();
              }}
            >
              <label>
                Review note
                <textarea
                  required
                  rows={4}
                  value={note}
                  onChange={(e) =>
                    setDrafts((items) => ({
                      ...items,
                      [selected]: e.target.value,
                    }))
                  }
                  placeholder="Describe the change and why it matters."
                />
              </label>
              <Action type="submit">Add note</Action>
            </form>
            <div className="scene-note-list">
              {(notes[selected] ?? []).map((item, i) => (
                <div key={i}>
                  <p>{item}</p>
                  <small className="scene-subtle">Maya Okafor · Just now</small>
                </div>
              ))}
            </div>
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}
