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
