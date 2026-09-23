import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { catalog, catalogPath } from "../../src/site/catalog.ts";
const index = JSON.parse(readFileSync("public/r/registry.json", "utf8"));
const cards = JSON.parse(readFileSync("src/blocks/catalog.json", "utf8"));
const cardTitles = JSON.parse(
  readFileSync("scripts/blocks/titles.json", "utf8"),
);
for (const [id, title] of Object.entries(cardTitles)) {
  const card = cards.find((card) => card.id === id);
  assert.equal(card?.title, title, `${id}: stale display title`);
  assert.ok(card.keywords.length, `${id}: keep the original name searchable`);
  const item = JSON.parse(readFileSync(`public/r/card-${id}.json`, "utf8"));
  assert.equal(
    item.title,
    title,
    `${id}: registry title differs from the catalog`,
  );
}
assert.equal(index.items.length, catalog.length + cards.length + 2);
const foundation = JSON.parse(
  readFileSync("public/r/overtrue-card-foundation.json", "utf8"),
);
for (const entry of index.items) {
  const item = JSON.parse(readFileSync(`public/r/${entry.name}.json`, "utf8"));
  assert.equal(item.name, entry.name);
  const catalogItem = catalog.find(candidate => candidate.name === item.name);
  if (catalogItem) {
    assert.equal(item.type, catalogItem.category === "Blocks" ? "registry:block" : "registry:component");
    assert.ok(item.docs.includes(catalogPath(catalogItem)), `${item.name}: incorrect documentation URL`);
  }
  assert.ok(item.description);
  const ownTargets = new Set((item.files ?? []).map((file) => file.target));
  assert.equal(
    ownTargets.size,
    (item.files ?? []).length,
    `${item.name}: duplicate targets`,
  );
  const isCard = item.name.startsWith("card-");
  if (isCard)
    assert.ok(
      item.registryDependencies.some((dep) =>
        dep.endsWith("/r/overtrue-card-foundation.json"),
      ),
    );
  const targets = new Set([
    ...ownTargets,
    ...(isCard ? foundation.files.map((file) => file.target) : []),
  ]);
  const dependencies = [
    ...(item.dependencies ?? []),
    ...(isCard ? foundation.dependencies : []),
  ];
  for (const file of item.files ?? []) {
    assert.equal(
      file.content,
      readFileSync(file.path, "utf8"),
      `${file.path}: stale generated source`,
    );
    assert.ok(file.target.startsWith("components/overtrue/"));
    assert.ok(
      !file.content.includes("lucide-react"),
      `${item.name}: use Tabler Icons`,
    );
    assert.ok(
      !file.content.includes("assets/examples"),
      `${item.name}: must be standalone`,
    );
    for (const match of file.content.matchAll(/from\s+["'](\.[^"']+)["']/g)) {
      const target = path.posix.normalize(
        path.posix.join(path.posix.dirname(file.target), match[1]),
      );
      assert.ok(
        ["", ".tsx", ".ts", ".json", ".css"].some((extension) =>
          targets.has(target + extension),
        ),
        `${item.name}: missing dependency ${target}`,
      );
    }
    for (const match of file.content.matchAll(
      /from\s+["']@\/components\/ui\/([^"']+)["']/g,
    )) {
      assert.ok(
        item.registryDependencies.includes(match[1]),
        `${item.name}: missing shadcn dependency ${match[1]}`,
      );
    }
    if (file.content.includes("@tabler/icons-react"))
      assert.ok(
        dependencies.some(
          (dependency) =>
            dependency === "@tabler/icons-react" ||
            dependency.startsWith("@tabler/icons-react@"),
        ),
      );
    if (file.content.includes('from "recharts"'))
      assert.ok(
        dependencies.some((dependency) => dependency.startsWith("recharts@")),
      );
    if (file.content.includes('from "recharts-analytics"'))
      assert.ok(dependencies.includes("recharts-analytics@npm:recharts@3.10.1"), `${item.name}: missing analytics chart runtime`);
    if (file.content.includes('from "@tanstack/react-table"'))
      assert.ok(dependencies.includes("@tanstack/react-table@9.2.4"), `${item.name}: missing table runtime`);
  }
}
console.log(
  `Verified ${index.items.length} registry items: current sources, complete local and external dependencies, unique installation targets, Tabler Icons.`,
);
