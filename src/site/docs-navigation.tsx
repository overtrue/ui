import { useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import { catalogPath, catalog } from "./catalog";
import { Link, NavLink, useLocation } from "react-router-dom";
import { IconArrowUpRight } from "@tabler/icons-react";
import { guides } from "./pages";

const sections = [
  ["introduction", "Introduction"],
  ["installation", "Installation"],
  ["namespace", "Namespace"],
  ["theming", "Theming"],
  ["workspace", "Workspace examples"],
  ["credits", "Credits & license"],
] as const;

function DocsNavigation() {
  const { pathname, hash } = useLocation();
  return (
    <nav className="docs-navigation" aria-label="Documentation">
      <p>Getting started</p>
      <div className="guide-links">
        {sections.map(([id, label]) => {
          const active =
            pathname === "/docs" && (hash || "#introduction") === `#${id}`;
          return (
            <Link
              key={id}
              to={`/docs#${id}`}
              className={active ? "active" : undefined}
              aria-current={active ? "location" : undefined}
            >
              {label}
            </Link>
          );
        })}
      </div>
      <p>Handbook</p>
      <div className="guide-links">
        {guides.map((guide) => (
          <NavLink key={guide.slug} to={`/docs/${guide.slug}`}>
            {guide.title}
          </NavLink>
        ))}
        <Link to="/components">
          Browse components <IconArrowUpRight size={12} aria-hidden="true" />
        </Link>
      </div>
    </nav>
  );
}

export function DocsSidebar() {
  return (
    <aside className="docs-sidebar">
      <DocsNavigation />
    </aside>
  );
}

export function DocsMobileNavigation() {
  const { pathname, hash } = useLocation();
  return (
    <details key={`${pathname}${hash}`} className="docs-mobile-contents">
      <summary>Documentation</summary>
      <DocsNavigation />
    </details>
  );
}

export function ComponentSidebar({
  items,
  collection,
  collectionPath,
}: {
  items: (typeof catalog)[number][];
  collection: string;
  collectionPath: string;
}) {
  const [query, setQuery] = useState("");
  const filtered = items.filter((item) =>
    `${item.title} ${item.name} ${item.category}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  const groups = [...new Set(filtered.map((item) => item.category))];
  return (
    <aside className="docs-sidebar component-sidebar">
      <Link className="back-link" to={collectionPath}>
        ← All {collection.toLowerCase()}
      </Link>
      <label className="sidebar-search">
        <IconSearch size={14} aria-hidden="true" />
        <input
          type="search"
          aria-label={`Find in ${collection.toLowerCase()}`}
          placeholder={`Find ${collection.toLowerCase()}…`}
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      <nav
        className="component-sidebar-links"
        aria-label={`${collection} directory`}
      >
        {groups.map((group) => (
          <div key={group}>
            <h2>{group}</h2>
            {filtered
              .filter((item) => item.category === group)
              .map((item) => (
                <NavLink key={item.name} to={catalogPath(item)}>
                  {item.title}
                </NavLink>
              ))}
          </div>
        ))}
        {!filtered.length && (
          <div className="sidebar-empty">
            <p role="status">No matches.</p>
            <button type="button" onClick={() => setQuery("")}>
              Clear search
            </button>
          </div>
        )}
      </nav>
    </aside>
  );
}
