import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { load } from "cheerio";
const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((item) =>
      item.isDirectory()
        ? walk(path.join(dir, item.name))
        : [path.join(dir, item.name)],
    );
const entries = [
  ...fs.readdirSync(".").filter((file) => file.endsWith(".html")),
  ...walk("workspace").filter((file) => file.endsWith(".html")),
];
const files = [
  "README.md",
  "CONTRIBUTING.md",
  "DESIGN.md",
  ...entries,
  ...walk("src"),
  ...walk("docs"),
  ...walk("scripts"),
].filter(
  (file) =>
    /\.(md|tsx?|css|json|mjs|py|html)$/.test(file) &&
    file !== import.meta.filename.replace(process.cwd() + "/", ""),
);
let assets = 0;
for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  const content = source
    .replaceAll("@tabler/icons-react", "")
    .replaceAll("Tabler Icons", "")
    .replaceAll("https://tabler.io/icons", "");
  assert.ok(
    !/\btabler\b|tblr|northline|panelo|lorem ipsum|paweł kuna|preview\.overtrue/i.test(
      content,
    ),
    `${file}: old branding or placeholder copy`,
  );
  assert.ok(
    !/tabler|tblr|clone/i.test(path.basename(file)),
    `${file}: old filename`,
  );
  for (const match of source.matchAll(
    /["'`](\/assets\/[^"'`\s<>${}]+\.(?:svg|png|jpg|webp|jpeg))/g,
  )) {
    assert.ok(
      fs.existsSync("public" + match[1]),
      `${file}: missing ${match[1]}`,
    );
    assets++;
  }
}
// Check the initial document, before React can replace a stale browser title.
for (const file of entries) {
  const $ = load(fs.readFileSync(file, "utf8"));
  assert.ok(
    $("title").text().includes("overtrue/ui"),
    `${file}: initial title`,
  );
  assert.equal(
    $("link[rel='icon']").attr("href"),
    "/overtrue.svg",
    `${file}: favicon`,
  );
}
assert.equal(
  fs.readFileSync("favicon.svg", "utf8").trim(),
  fs.readFileSync("public/overtrue.svg", "utf8").trim(),
  "Legacy favicon URL must use the current brand mark",
);
const pages = JSON.parse(
  fs.readFileSync("src/data/workspace/pages.json", "utf8"),
);
assert.equal(pages.length, 119);
assert.equal(new Set(pages.map((p) => p.path)).size, pages.length);
for (const page of pages)
  assert.ok(
    fs.existsSync("src/pages/workspace/" + page.file.replace(".html", ".tsx")),
    page.file,
  );
const navigation = JSON.parse(
  fs.readFileSync("src/data/workspace/navigation.json", "utf8"),
);
const links = [];
function collect(items) {
  for (const item of items) {
    if (item.href?.endsWith(".html")) links.push(item.href.replace("./", ""));
    if (item.children) collect(item.children);
  }
}
collect(navigation);
for (const page of pages)
  assert.ok(
    links.includes(page.file),
    `${page.file}: missing navigation entry`,
  );
assert.ok(
  fs.readFileSync("licenses/third-party.txt", "utf8").includes("Tabler"),
);
assert.equal(
  fs.readFileSync("licenses/third-party.txt", "utf8"),
  fs.readFileSync("public/THIRD_PARTY_NOTICES.txt", "utf8"),
);
console.log(
  `Verified ${files.length} source/documentation files, ${entries.length} HTML entries, ${assets} local asset references, ${pages.length} routes and their navigation, and preserved third-party notices.`,
);
