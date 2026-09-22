import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowUpRight,
  IconSearch,
  IconDeviceDesktop,
  IconDeviceMobile,
} from "@tabler/icons-react";
import cards from "../blocks/catalog.json";
import { Command, CopyButton } from "./code";
import { FitPreview } from "./fit-preview";

const sources = import.meta.glob("../blocks/registry/*.tsx", {
  query: "?raw",
  import: "default",
});
const categories = [
  "All cards",
  ...new Set(cards.map((card) => card.category)),
];
const pageSize = 12;
function CardPreview({
  id,
  title,
  expanded = false,
  mobile = false,
  previewWidth = 640,
}: {
  id: string;
  title: string;
  expanded?: boolean;
  mobile?: boolean;
  previewWidth?: number;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [theme, setTheme] = useState(
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );
  const [height, setHeight] = useState(420);
  useEffect(() => {
    const observer = new MutationObserver(() =>
      setTheme(
        document.documentElement.classList.contains("dark") ? "dark" : "light",
      ),
    );
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    const resize = (event: MessageEvent) => {
      if (
        event.origin === location.origin &&
        event.source === frame.current?.contentWindow &&
        event.data?.type === "overtrue-card-size" &&
        event.data.id === id &&
        Number.isFinite(event.data.height)
      )
        setHeight(Math.max(100, event.data.height));
    };
    window.addEventListener("message", resize);
    return () => {
      observer.disconnect();
      window.removeEventListener("message", resize);
    };
  }, [id]);
  const preview = (
    <iframe
      key={`${id}:${theme}`}
      ref={frame}
      src={`/card-preview.html?id=${encodeURIComponent(id)}&theme=${theme}`}
      title={`${title} preview`}
      loading="lazy"
      style={{ height }}
    />
  );
  return (
    <div
      className={`card-live-preview ${expanded ? "is-expanded" : ""} ${mobile ? "is-mobile" : ""}`}
    >
      {expanded ? (
        preview
      ) : (
        <FitPreview width={previewWidth} height={320}>
          {preview}
        </FitPreview>
      )}
    </div>
  );
}
export function CardCollection() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "",
    category = params.get("category") ?? "All cards";
  const matches = cards.filter(
    (card) =>
      (category === "All cards" || category === card.category) &&
      `${card.title} ${card.category} ${card.pages.map((p) => p.title).join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(matches.length / pageSize));
  const current = Math.max(
    1,
    Math.min(totalPages, Math.trunc(Number(params.get("page"))) || 1),
  );
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setParams(next, { replace: true });
    if (key === "page")
      document
        .getElementById("card-collection-title")
        ?.scrollIntoView({ block: "start" });
  };
  return (
    <section
      className="card-collection"
      aria-labelledby="card-collection-title"
    >
      <div className="section-heading">
        <div>
          <p className="overline">FROM THE WORKSPACE</p>
          <h2 id="card-collection-title">Every card, ready to use.</h2>
          <p>
            {cards.length} card patterns from the examples. Browse, try, and
            take the source with you.
          </p>
        </div>
      </div>
      <div className="card-filters">
        <label className="search-box">
          <IconSearch size={16} />
          <input
            aria-label="Search card blocks"
            placeholder="Search cards, charts, forms…"
            value={query}
            onChange={(e) => update("q", e.target.value)}
          />
        </label>
        <label className="card-category">
          Category
          <select
            aria-label="Card category"
            value={category}
            onChange={(e) => update("category", e.target.value)}
          >
            {categories.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <span className="card-result-count" role="status">
          {matches.length} cards
        </span>
      </div>
      <div className="card-library-grid">
        {matches
          .slice((current - 1) * pageSize, current * pageSize)
          .map((card) => (
            <article className="card-library-tile" key={card.id}>
              <CardPreview
                id={card.id}
                title={card.title}
                previewWidth={card.previewWidth}
              />
              <Link className="tile-caption" to={`/blocks/${card.id}`}>
                <span>
                  {card.title}
                  <small>
                    {card.category}
                    {card.collection ? " · Collection" : ""}
                  </small>
                </span>
                <IconArrowUpRight size={16} />
              </Link>
            </article>
          ))}
      </div>
      {!matches.length && (
        <div className="search-empty">
          <h3>No matching cards.</h3>
          <p>Try another term or category.</p>
          <button className="site-button" onClick={() => setParams({})}>
            Clear filters
          </button>
        </div>
      )}
      {totalPages > 1 && (
        <nav className="card-pagination" aria-label="Card pagination">
          <button
            className="site-button"
            disabled={current === 1}
            onClick={() => update("page", String(current - 1))}
          >
            <IconArrowLeft size={15} />
            Previous
          </button>
          <span>
            Page {current} of {totalPages}
          </span>
          <button
            className="site-button"
            disabled={current === totalPages}
            onClick={() => update("page", String(current + 1))}
          >
            Next
            <IconArrowRight size={15} />
          </button>
        </nav>
      )}
    </section>
  );
}
export function CardBlockPage() {
  const { id } = useParams();
  const card = cards.find((card) => card.id === id);
  const [view, setView] = useState("Preview"),
    [mobile, setMobile] = useState(false),
    [source, setSource] = useState("");
  useEffect(() => {
    let active = true;
    setSource("");
    setView("Preview");
    const load = sources[`../blocks/registry/${id}.tsx`];
    if (load)
      load().then((value) => {
        if (active) setSource(value as string);
      });
    return () => {
      active = false;
    };
  }, [id]);
  if (!card)
    return (
      <main className="section not-found">
        <h1>Card not found.</h1>
        <Link to="/blocks">Browse blocks</Link>
      </main>
    );
  return (
    <main className="section card-block-page">
      <Link className="back-link" to="/blocks">
        <IconArrowLeft size={15} />
        All blocks
      </Link>
      <div className="page-intro">
        <p className="overline">{card.category}</p>
        <h1>{card.title}</h1>
        <p>
          An editable card from the workspace examples, with its original layout
          and interactions.
        </p>
      </div>
      <div className="workspace-toolbar">
        <div className="filter-tabs" aria-label="Block view">
          {["Preview", "Code"].map((value) => (
            <button
              key={value}
              aria-pressed={view === value}
              onClick={() => setView(value)}
            >
              {value}
            </button>
          ))}
        </div>
        {view === "Preview" ? (
          <div className="filter-tabs" aria-label="Preview width">
            <button
              aria-label="Desktop preview"
              aria-pressed={!mobile}
              onClick={() => setMobile(false)}
            >
              <IconDeviceDesktop size={17} />
            </button>
            <button
              aria-label="Mobile preview"
              aria-pressed={mobile}
              onClick={() => setMobile(true)}
            >
              <IconDeviceMobile size={17} />
            </button>
          </div>
        ) : (
          <CopyButton text={source} label="Copy block source" />
        )}
      </div>
      {view === "Preview" ? (
        <CardPreview id={card.id} title={card.title} expanded mobile={mobile} />
      ) : (
        <div className="source-view">
          <pre>
            <code>{source || "Loading source…"}</code>
          </pre>
        </div>
      )}
      <div className="card-install-grid">
        <section>
          <h2>Make it yours.</h2>
          <p>
            Install the card and its shared styling and interaction primitives.
          </p>
          <Command
            text={`npx shadcn@latest add ${location.origin}/r/card-${card.id}.json`}
          />
          <p className="card-install-note">
            Includes scoped workspace styles. Demo imagery is hosted on
            ui.overtrue.xyz; replace it and the sample links with your own
            content.
          </p>
          <pre className="card-usage">
            <code>{`import Block from "@/components/overtrue/blocks/${card.id}"\n\nexport default function Page() {\n  return <Block />\n}`}</code>
          </pre>
        </section>
        <aside>
          <h2>From the examples</h2>
          {card.pages.map((page) => (
            <a
              className="card-source-link"
              key={page.path}
              href={`/workspace/#${page.path}`}
            >
              {page.title}
              <IconArrowUpRight size={15} />
            </a>
          ))}
          <a className="card-source-link" href={`/r/card-${card.id}.json`}>
            Registry JSON
            <IconArrowUpRight size={15} />
          </a>
          <Link className="card-source-link" to="/docs">
            Installation guide
            <IconArrowRight size={15} />
          </Link>
        </aside>
      </div>
    </main>
  );
}
