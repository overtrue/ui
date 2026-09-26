import { useNavigate } from "react-router-dom";
import { PageSearch, type SearchPage } from "@/components/page-search";
import pages from "@/data/workspace/pages.json";

const favorites = [
  "/",
  "/cards",
  "/tasks-list",
  "/users",
  "/settings",
  "/fullcalendar",
  "/form-elements",
  "/charts",
];
const ordered = [
  ...favorites.flatMap((path) => pages.filter((page) => page.path === path)),
  ...pages.filter((page) => !favorites.includes(page.path)),
];
const entries: SearchPage[] = ordered.map((page) => ({
  href: page.path,
  title: page.title,
  description:
    page.path === "/"
      ? "Your workspace at a glance"
      : page.path.slice(1).replaceAll("-", " "),
  section: page.bare ? "Account & system" : "Workspace",
}));

export function WorkspaceSearch() {
  const navigate = useNavigate();
  return (
    <PageSearch
      pages={entries}
      label="Search workspace"
      className="workspace-icon-button workspace-search-trigger"
      onNavigate={navigate}
    />
  );
}
