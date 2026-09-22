import { catalog, catalogPath } from "./catalog.ts";
import cards from "../blocks/catalog.json" with { type: "json" };

export const guides = [
  {
    slug: "design",
    title: "Design principles",
    description:
      "Typography, spacing, color, and density for interfaces people use every day.",
  },
  {
    slug: "composition",
    title: "Building a page",
    description:
      "Combine small components into a useful dashboard, then connect your own data.",
  },
  {
    slug: "accessibility",
    title: "Accessible interfaces",
    description:
      "Practical guidance for keyboard access, readable data, and responsive layouts.",
  },
  {
    slug: "troubleshooting",
    title: "Troubleshooting",
    description:
      "Resolve installation, styling, chart, and theme issues in your project.",
  },
] as const;

export const sitePages = [
  {
    path: "/",
    title: "The admin UI toolkit for shadcn/ui",
    description:
      "Editable components and complete blocks for admin panels, dashboards, and consoles. Built with React, Tailwind CSS, shadcn/ui, and Tabler Icons.",
  },
  {
    path: "/components",
    title: "Components",
    description:
      "Browse editable UI components for metrics, tables, navigation, forms, and feedback. Preview the source and install only what you need.",
  },
  {
    path: "/blocks",
    title: "Blocks",
    description:
      "Explore complete interfaces and editable cards from the workspace examples. Preview, copy, and install only what you need.",
  },
  {
    path: "/docs",
    title: "Getting started",
    description:
      "Install overtrue/ui, configure your shadcn registry, and adapt the components to your own theme.",
  },
  {
    path: "/examples",
    title: "Workspace examples",
    description:
      "Explore 119 admin pages covering projects, people, billing, settings, forms, charts, and navigation.",
  },
  ...guides.map((guide) => ({
    path: `/docs/${guide.slug}`,
    title: guide.title,
    description: guide.description,
  })),
  ...catalog.map((item) => ({
    path: catalogPath(item),
    title: item.title,
    description: item.description,
  })),
  ...cards.map((card) => ({
    path: `/blocks/${card.id}`,
    title: card.title,
    description: `${card.category} card from the overtrue/ui workspace examples. Preview, copy, and install the editable source.`,
  })),
];
