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
    "The overtrue/ui blue and gray palette, compact radii, and dark mode. Optional: updates your global CSS variables.",
  cssVars: {
    light: {
      radius: "0.5rem",
      background: "#f9fafb",
      foreground: "#111827",
      card: "#ffffff",
      "card-foreground": "#111827",
      popover: "#ffffff",
      "popover-foreground": "#111827",
      primary: "#2563eb",
      "primary-foreground": "#ffffff",
      secondary: "#f3f4f6",
      "secondary-foreground": "#111827",
      muted: "#f3f4f6",
      "muted-foreground": "#6b7280",
      accent: "#eff6ff",
      "accent-foreground": "#2563eb",
      destructive: "#dc2626",
      "destructive-foreground": "#ffffff",
      border: "#e5e7eb",
      input: "#d1d5db",
      ring: "#2563eb",
    },
    dark: {
      background: "#030712",
      foreground: "#f9fafb",
      card: "#111827",
      "card-foreground": "#f9fafb",
      popover: "#111827",
      "popover-foreground": "#f9fafb",
      primary: "#60a5fa",
      "primary-foreground": "#030712",
      secondary: "#1f2937",
      "secondary-foreground": "#f9fafb",
      muted: "#1f2937",
      "muted-foreground": "#9ca3af",
      accent: "#172554",
      "accent-foreground": "#93c5fd",
      destructive: "#f87171",
      "destructive-foreground": "#030712",
      border: "#1f2937",
      input: "#374151",
      ring: "#60a5fa",
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
  `# overtrue/ui\n\nEditable admin components for React, TypeScript, Tailwind CSS v4, and shadcn/ui.\n\n- Documentation: ${origin}/docs\n- Design principles: ${origin}/docs/design\n- Building a page: ${origin}/docs/composition\n- Accessibility: ${origin}/docs/accessibility\n- Troubleshooting: ${origin}/docs/troubleshooting\n- Registry index: ${origin}/r/registry.json\n- Components: ${origin}/components\n- Workspace examples: ${origin}/examples\n\nInstall by URL: npx shadcn@latest add ${origin}/r/stat-card.json\n\nFor the @overtrue namespace, configure components.json registries with "@overtrue": "${origin}/r/{name}.json". The namespace is not in the official public directory.\n\n${items.map((item) => `- ${item.name}: ${origin}/r/${item.name}.json — ${item.description}`).join("\n")}\n`,
);
console.log(`Prepared ${items.length} registry items for ${origin}`);
