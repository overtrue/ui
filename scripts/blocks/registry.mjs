import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";
import ts from "typescript";

export function prepareCardRegistry(origin) {
  const catalog = JSON.parse(
    fs.readFileSync("src/blocks/catalog.json", "utf8"),
  );
  const directory = "src/blocks/registry";
  const runtime = directory + "/runtime";
  fs.mkdirSync(runtime, { recursive: true });
  const dependencies = new Set(),
    copied = new Map();
  const packages = JSON.parse(
    fs.readFileSync("package.json", "utf8"),
  ).dependencies;
  const resolve = (specifier, from) => {
    const base = specifier.startsWith("@/")
      ? "src/" + specifier.slice(2)
      : path.posix.join(path.posix.dirname(from), specifier);
    return [
      base,
      base + ".tsx",
      base + ".ts",
      base + ".json",
      base + ".css",
    ].find((f) => fs.existsSync(f) && fs.statSync(f).isFile());
  };
  const destination = (file) => runtime + "/" + file.replace(/^src\//, "");
  const relative = (from, to) => {
    const result = path.posix
      .relative(path.posix.dirname(from), to)
      .replace(/\.(tsx?|jsx?)$/, "");
    return result.startsWith(".") ? result : "./" + result;
  };
  function rewrite(source, file, target) {
    const sf = ts.createSourceFile(file, source, 99, true, 4),
      edits = [];
    function visit(n) {
      if (
        ts.isStringLiteral(n) &&
        (((ts.isImportDeclaration(n.parent) ||
          ts.isExportDeclaration(n.parent)) &&
          n.parent.moduleSpecifier === n) ||
          (ts.isCallExpression(n.parent) &&
            n.parent.expression.kind === ts.SyntaxKind.ImportKeyword) ||
          (ts.isLiteralTypeNode(n.parent) &&
            ts.isImportTypeNode(n.parent.parent)))
      ) {
        const spec = n.text;
        if (spec.startsWith("@/") || spec.startsWith(".")) {
          const dep = resolve(spec, file);
          if (!dep) throw new Error(`Unresolved ${spec} in ${file}`);
          copy(dep);
          edits.push({
            start: n.getStart(),
            end: n.end,
            text: JSON.stringify(relative(target, destination(dep))),
          });
        } else {
          const pkg = spec.startsWith("@")
            ? spec.split("/").slice(0, 2).join("/")
            : spec.split("/")[0];
          if (!["react", "react-dom"].includes(pkg)) dependencies.add(pkg);
        }
      }
      ts.forEachChild(n, visit);
    }
    visit(sf);
    for (const edit of edits.sort((a, b) => b.start - a.start))
      source = source.slice(0, edit.start) + edit.text + source.slice(edit.end);
    // Example imagery remains hosted; consumers can replace it with their own data.
    source = source
      .replace(
        /\/assets\/examples\/[a-zA-Z0-9_./-]+\.(?:svg|png|webp|jpe?g)/g,
        (url) => {
          const file = "public" + url;
          if (!fs.existsSync(file))
            throw new Error("Missing block asset " + url);
          const mime = url.endsWith(".svg")
            ? "image/svg+xml"
            : url.endsWith(".png")
              ? "image/png"
              : url.endsWith(".webp")
                ? "image/webp"
                : "image/jpeg";
          return (
            "data:" +
            mime +
            ";base64," +
            fs.readFileSync(file).toString("base64")
          );
        },
      )
      .replaceAll("/assets/", origin + "/assets/")
      .replaceAll(
        "overtrue-workspace workspace-portal",
        "overtrue-workspace overtrue-block workspace-portal",
      );
    if (file.endsWith("/map.tsx"))
      source = source.replace(
        /import mapWorkerUrl from [^;]+;/,
        `const mapWorkerUrl = "https://cdn.jsdelivr.net/npm/maplibre-gl@6.10.0/dist/maplibre-gl-csp-worker.js";`,
      );
    if (file.endsWith("/plugins.tsx"))
      source = source.replace(
        /import\.meta\.env\.DEV\s*\?[^:]+:\s*"\/vendor\/hugerte"/,
        '"https://cdn.jsdelivr.net/npm/hugerte@1.0.14"',
      );
    return source;
  }
  function copy(file) {
    if (copied.has(file)) return;
    const target = destination(file);
    copied.set(file, target);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    const content = fs.readFileSync(file, "utf8");
    fs.writeFileSync(
      target,
      /\.tsx?$/.test(file) ? rewrite(content, file, target) : content,
    );
  }
  copy("src/blocks/frame.tsx");
  const items = [];
  for (const card of catalog) {
    const file = "src/blocks/generated/" + card.id + ".tsx",
      target = directory + "/" + card.id + ".tsx";
    let content = rewrite(fs.readFileSync(file, "utf8"), file, target).replace(
      "export default function Block(",
      "function CardExample(",
    );
    content =
      '"use client";\nimport { BlockFrame } from "./runtime/blocks/frame";\nimport "./runtime/cards.css";\n' +
      content.replace(/^"use client";\s*/, "") +
      "\nexport default function Block() { return <BlockFrame><CardExample /></BlockFrame>; }\n";
    fs.writeFileSync(target, content);
    items.push({
      name: "card-" + card.id,
      type: "registry:block",
      title: card.title,
      description: `${card.category} card from the overtrue/ui workspace examples. Editable source, scoped styles, and demo interactions.`,
      categories: [
        "cards",
        card.category.toLowerCase().replaceAll(/[^a-z]+/g, "-"),
      ],
      registryDependencies: [origin + "/r/overtrue-card-foundation.json"],
      files: [
        {
          path: target,
          type: "registry:component",
          target: "components/overtrue/blocks/" + card.id + ".tsx",
        },
      ],
      docs: `Documentation: ${origin}/blocks/${card.id}. Includes the shared card foundation and hosted demo imagery. Replace sample data and navigation with your application data.`,
    });
  }
  const cssFiles = [
    "src/index.css",
    "src/styles/workspace-base.css",
    "src/styles/workspace-theme.css",
    "src/styles/scenes.css",
    "src/styles/showcase.css",
  ];
  const styles = cssFiles
    .map((file) => {
      const css = postcss.parse(fs.readFileSync(file, "utf8"));
      css.walkAtRules((rule) => {
        if (["import", "theme", "custom-variant", "source"].includes(rule.name))
          rule.remove();
      });
      css.walkRules((rule) => {
        if (
          rule.parent.type === "atrule" &&
          /keyframes$/.test(rule.parent.name)
        )
          return;
        rule.selectors = rule.selectors.map((selector) => {
          if (selector === ":root") return ".overtrue-block";
          if (selector === ".dark") return ".dark .overtrue-block";
          // BlockFrame itself is a scene; descendant-only scoping misses it.
          if (/^(?:\.overtrue-workspace\s+)?\.scene(?=[\s.:#\[]|$)/.test(selector))
            return selector.replace(
              /^(?:\.overtrue-workspace\s+)?\.scene/,
              selector.startsWith(".overtrue-workspace")
                ? ":is(.overtrue-block.scene, .overtrue-block .scene)"
                : ":is(:where(.overtrue-block).scene, :where(.overtrue-block) .scene)",
            );
          if (selector.includes(".overtrue-workspace"))
            return selector.replaceAll(
              ".overtrue-workspace",
              ".overtrue-block",
            );
          if (selector.startsWith(".dark "))
            return ".dark .overtrue-block " + selector.slice(6);
          // Scope document selectors without corrupting classes like .card-body.
          if (/^(html|body)(?=[\s[.:#]|$)/.test(selector))
            return selector.replace(/^(html|body)\b/, ".overtrue-block");
          return ".overtrue-block " + selector.trim();
        });
      });
      css.walkDecls((d) => {
        d.value = d.value.replace(
          /url\(["']?(\/assets\/[^"')]+)["']?\)/g,
          (_, url) => {
            const file = "public" + url;
            if (!fs.existsSync(file))
              throw new Error("Missing card style asset " + url);
            const mime = url.endsWith(".svg")
              ? "image/svg+xml"
              : url.endsWith(".png")
                ? "image/png"
                : "image/jpeg";
            return (
              'url("data:' +
              mime +
              ";base64," +
              fs.readFileSync(file).toString("base64") +
              '")'
            );
          },
        );
        d.value = d.value.replace(/hsl\(var\((--[^)]+)\)\)/g, "var($1)");
        if (
          d.prop.startsWith("--") &&
          /^\d+(\.\d+)?\s+[\d.]+%\s+[\d.]+%$/.test(d.value)
        )
          d.value = "hsl(" + d.value + ")";
      });
      return css.toString();
    })
    .join("\n");
  fs.writeFileSync(
    runtime + "/cards.css",
    styles +
      '\n.overtrue-block.overtrue-workspace { min-height: 0; display: block; background: transparent; padding: 0; }\n.overtrue-block > .scene-card { margin-bottom: 0; }\n.overtrue-block { --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }\n.overtrue-block .pn-table-responsive { max-width: 100%; overflow-x: auto; }\n',
  );
  copy("src/types/jsvectormap.d.ts");
  fs.copyFileSync("licenses/third-party.txt", runtime + "/third-party.txt");
  if (dependencies.has("@fullcalendar/react"))
    dependencies.add("@fullcalendar/core");
  const foundation = {
    name: "overtrue-card-foundation",
    type: "registry:component",
    title: "Workspace card foundation",
    description:
      "Shared scoped styling and interaction primitives for the example card blocks.",
    dependencies: [...dependencies]
      .sort()
      .map((pkg) => pkg + "@" + (packages[pkg] ?? "latest")),
    files: [
      ...copied.values(),
      runtime + "/cards.css",
      runtime + "/third-party.txt",
    ].map((file) => ({
      path: file,
      type: "registry:file",
      target:
        "components/overtrue/blocks/runtime/" + file.slice(runtime.length + 1),
    })),
  };
  return [foundation, ...items];
}
