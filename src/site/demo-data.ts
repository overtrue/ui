import { projects, team } from "@/data/workspace/studio";
import type { PortfolioProject } from "@/registry/overtrue/project-portfolio";

export const siteOwner = {
  id: "overtrue",
  name: "Chris An",
  image: "/assets/overtrue/people/overtrue.png",
};

export const portfolioProjects: PortfolioProject[] = projects
  .slice(0, 3)
  .map((project) => ({
    ...project,
    image: { src: project.image, alt: `${project.client} project moodboard` },
    status: {
      label: project.status,
      variant: project.status === "Complete" ? "success" : "info",
    },
    owner: {
      id: project.owner,
      name: project.owner,
      image: `/assets/overtrue/people/${team.find((person) => person.name === project.owner)?.id ?? "guest"}.svg`,
    },
    href: "/workspace/#/tasks-list",
  }));
