import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { catalog, catalogPath } from "../../src/site/catalog.ts";
import { prepareCardRegistry } from "../blocks/registry.mjs";

const origin = (
  process.env.REGISTRY_ORIGIN ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:5173")
).replace(/\/$/, "");
// Follow local imports so every install contains its complete composition.
function sourceFiles(name, found = new Set()) {
  if (found.has(name)) return found;
  found.add(name);
  const source = readFileSync(`src/registry/overtrue/${name}.tsx`, "utf8");
  for (const match of source.matchAll(/from\s+["']\.\/([^"']+)["']/g)) {
    sourceFiles(match[1], found);
  }
  return found;
}
const items = catalog.map((item) => {
  const names = [...sourceFiles(item.name)];
  const content = names
    .map((name) => readFileSync(`src/registry/overtrue/${name}.tsx`, "utf8"))
    .join("\n");
  return {
    name: item.name,
    type: item.category === "Blocks" ? "registry:block" : "registry:component",
    title: item.title,
    description: item.description,
    categories: [item.category.toLowerCase().replaceAll(" ", "-")],
    dependencies: [
      ...(content.includes("@tabler/icons-react")
        ? ["@tabler/icons-react"]
        : []),
      ...(content.includes('from "recharts"') ? ["recharts@^2.15.1"] : []),
      ...(content.includes('from "recharts-analytics"') ? ["recharts-analytics@npm:recharts@3.10.1"] : []),
      ...(content.includes("@tanstack/react-table") ? ["@tanstack/react-table@9.2.4"] : []),
      ...(content.includes("@radix-ui/react-tabs") ? ["@radix-ui/react-tabs"] : []),
    ],
    registryDependencies: [
      ...new Set([
        ...item.dependencies,
        ...Array.from(
          content.matchAll(/from\s+["']@\/components\/ui\/([^"']+)["']/g),
          (match) => match[1],
        ),
      ]),
    ],
    files: names.map((name) => ({
      path: `src/registry/overtrue/${name}.tsx`,
      type: "registry:component",
      target: `components/overtrue/${name}.tsx`,
    })),
    docs: `Documentation: ${origin}${catalogPath(item)}. Requires an initialized shadcn/ui project with Tailwind CSS v4.`,
  };
});
items.push(...prepareCardRegistry(origin));
items.push({
  name: "overtrue-theme",
  type: "registry:theme",
  title: "overtrue/ui theme",
  description:
    "The overtrue/ui Ultramarine accent, Ink neutrals, a matched chart palette, and dark mode. Optional: updates your global CSS variables.",
  cssVars: {
    light: {
      radius: "0.5rem",
      background: "#f7f8fa",
      foreground: "#0d1424",
      card: "#ffffff",
      "card-foreground": "#0d1424",
      popover: "#ffffff",
      "popover-foreground": "#0d1424",
      primary: "#2a5bff",
      "primary-foreground": "#ffffff",
      secondary: "#eef0f4",
      "secondary-foreground": "#0d1424",
      muted: "#eef0f4",
      "muted-foreground": "#5d6678",
      accent: "#edf1ff",
      "accent-foreground": "#1f47d6",
      destructive: "#dc2626",
      "destructive-foreground": "#ffffff",
      border: "#e4e7ec",
      input: "#d5dae2",
      ring: "#2a5bff",
      "chart-1": "#2a5bff",
      "chart-2": "#0f9f6e",
      "chart-3": "#e19a0b",
      "chart-4": "#8b5cf6",
      "chart-5": "#e5487d",
    },
    dark: {
      background: "#07090f",
      foreground: "#eef1f7",
      card: "#0f131c",
      "card-foreground": "#eef1f7",
      popover: "#121723",
      "popover-foreground": "#eef1f7",
      primary: "#7b93ff",
      "primary-foreground": "#050814",
      secondary: "#171c28",
      "secondary-foreground": "#eef1f7",
      muted: "#171c28",
      "muted-foreground": "#8b93a5",
      accent: "#141c3a",
      "accent-foreground": "#a9b8ff",
      destructive: "#f87171",
      "destructive-foreground": "#030712",
      border: "#1d2330",
      input: "#2a3242",
      ring: "#7b93ff",
      "chart-1": "#7b93ff",
      "chart-2": "#34d399",
      "chart-3": "#fbbf24",
      "chart-4": "#a78bfa",
      "chart-5": "#f472b6",
    },
  },
});
writeFileSync(
  "registry.json",
  JSON.stringify(
    {
      $schema: "https://ui.shadcn.com/schema/registry.json",
      name: "overtrue",
      homepage: origin,
      items,
    },
    null,
    2,
  ) + "\n",
);
mkdirSync("public", { recursive: true });
writeFileSync(
  "public/llms.txt",
  `# overtrue/ui\n\nEditable admin components for React, TypeScript, Tailwind CSS v4, and shadcn/ui.\n\n- Documentation: ${origin}/docs\n- Design principles: ${origin}/docs/design\n- Building a page: ${origin}/docs/composition\n- Extending components: ${origin}/docs/extending\n- Accessibility: ${origin}/docs/accessibility\n- Troubleshooting: ${origin}/docs/troubleshooting\n- Registry index: ${origin}/r/registry.json\n- Components: ${origin}/components\n- Workspace examples: ${origin}/examples\n\nInstall by URL: npx shadcn@latest add ${origin}/r/stat-card.json\n\nFor the @overtrue namespace, configure components.json registries with "@overtrue": "${origin}/r/{name}.json". The namespace is not in the official public directory.\n\n${items.map((item) => `- ${item.name}: ${origin}/r/${item.name}.json — ${item.description}`).join("\n")}\n`,
);
console.log(`Prepared ${items.length} registry items for ${origin}`);
