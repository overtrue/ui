import type { CatalogItem } from "./catalog.ts";

// Display and verify the same complete example, including imports and hook scope.
export function usageSource(item: CatalogItem) {
  const symbol = item.name
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join("");
  const imports = `import { ${"imports" in item ? item.imports : symbol} } from "@/components/overtrue/${item.name}"`;
  const exampleImports =
    "exampleImports" in item ? `\n${item.exampleImports}` : "";
  const body = item.usage.startsWith("function ")
    ? `export default ${item.usage}`
    : `export default function Example() {\n  return (\n    <>\n${item.usage
        .split("\n")
        .map((line) => `      ${line}`)
        .join("\n")}\n    </>\n  )\n}`;
  return `"use client"\n\n${imports}${exampleImports}\n\n${body}`;
}
