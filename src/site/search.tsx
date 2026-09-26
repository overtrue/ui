import { useLocation, useNavigate } from "react-router-dom";
import { PageSearch, type SearchPage } from "@/components/page-search";
import { sitePages } from "./pages";
import workspacePages from "@/data/workspace/pages.json";

const pages: SearchPage[] = [
  ...sitePages.map((page) => ({
    href: page.path,
    title: page.title,
    description: page.description,
    section: page.path.startsWith("/components/")
      ? "Component"
      : page.path.startsWith("/blocks/")
        ? "Block"
        : page.path.startsWith("/docs")
          ? "Documentation"
          : "Collection",
  })),
  ...workspacePages.map((page) => ({
    href: `/workspace/#${page.path}`,
    title: page.title,
    description: `Interactive workspace example · ${page.path === "/" ? "Overview" : page.path.slice(1).replaceAll("-", " ")}`,
    section: "Workspace",
  })),
];

export function SiteSearch() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <PageSearch
      pages={pages}
      label="Search site"
      className="site-search-trigger"
      shortcutEnabled={pathname !== "/components/command-palette"}
      onNavigate={(href) =>
        href.startsWith("/workspace/")
          ? window.location.assign(href)
          : navigate(href)
      }
    />
  );
}
