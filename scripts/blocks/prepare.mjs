import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

// Extract the actual JSX and its lexical dependencies, never a screenshot or a
// hidden full-page render. A repeated collection is one editable block pattern.
const root = process.cwd();
const output = "src/blocks/generated";
fs.mkdirSync(output, { recursive: true });
const pages = JSON.parse(
  fs.readFileSync("src/data/workspace/pages.json", "utf8"),
);
const files = [
  "src/pages/HighOrderPage.tsx",
  ...fs
    .readdirSync("src/pages/workspace")
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => "src/pages/workspace/" + f),
  ...fs
    .readdirSync("src/components/overtrue/scenes")
    .filter((f) => f.endsWith(".tsx") && f !== "shared.tsx")
    .map((f) => "src/components/overtrue/scenes/" + f),
];
const parse = (file, text) =>
  ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
const identifiers = (node) => {
  const names = new Set();
  const visit = (n) => {
    if (ts.isIdentifier(n)) names.add(n.text);
    ts.forEachChild(n, visit);
  };
  visit(node);
  return names;
};
function bindings(node) {
  if (ts.isIdentifier(node)) return [node.text];
  return node.elements.flatMap((e) =>
    ts.isOmittedExpression(e) ? [] : bindings(e.name),
  );
}
function declarations(statements) {
  return statements.flatMap((s) =>
    ts.isVariableStatement(s)
      ? s.declarationList.declarations.map((d) => ({
          node: d,
          names: bindings(d.name),
          text: "const " + d.getText() + ";",
        }))
      : (ts.isFunctionDeclaration(s) ||
            ts.isTypeAliasDeclaration(s) ||
            ts.isInterfaceDeclaration(s)) &&
          s.name
        ? [
            {
              node: s,
              names: [s.name.text],
              text: s.getText().replace(/^export\s+(default\s+)?/, ""),
            },
          ]
        : [],
  );
}
function closure(seed, available) {
  const needed = identifiers(parse("seed.tsx", seed)),
    selected = new Set();
  let changed = true;
  while (changed) {
    changed = false;
    for (const d of available)
      if (!selected.has(d) && d.names.some((n) => needed.has(n))) {
        selected.add(d);
        identifiers(d.node).forEach((n) => needed.add(n));
        changed = true;
      }
  }
  return available
    .filter((d) => selected.has(d))
    .map((d) => d.text)
    .join("\n");
}
const slug = (text) =>
  text
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const label = (text) =>
  text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
function staticText(node) {
  if (!node) return "";
  if (ts.isStringLiteral(node) || ts.isJsxText(node)) return node.text.trim();
  if (ts.isJsxExpression(node)) return staticText(node.expression);
  if (ts.isJsxElement(node))
    return node.children.map(staticText).filter(Boolean).join(" ");
  return "";
}
function attr(node, name) {
  const opening = ts.isJsxElement(node) ? node.openingElement : node;
  return opening.attributes.properties.find(
    (a) => ts.isJsxAttribute(a) && a.name.text === name,
  )?.initializer;
}
function isCard(n) {
  if (!ts.isJsxElement(n) && !ts.isJsxSelfClosingElement(n)) return false;
  const tag = (ts.isJsxElement(n) ? n.openingElement : n).tagName.getText();
  const classes = staticText(attr(n, "className"));
  return (
    /^(Card|SceneCard|MemberCard|FeatureCard|MediaCard|MetricGroup|MetricChart|ServiceStatus|ProjectPortfolio|ActionCard|SectionCard|StatCard|SparklineCard|ChartCard|RibbonCard|StatusEdgeCard|TaskCard|PricingCard)$/.test(
      tag,
    ) ||
    /(^|\s)(pn-card|scene-note|scene-task|scene-role|scene-invoice|scene-article|scene-case-study|scene-inbox|scene-chat)(\s|$)/.test(
      classes,
    ) ||
    !!attr(n, "className")?.getText().includes('"scene-library"')
  );
}
function titleOf(node) {
  const title =
    staticText(attr(node, "title")) || staticText(attr(node, "label"));
  if (title) return title;
  let found = "";
  const visit = (n) => {
    if (found) return;
    if (
      ts.isJsxElement(n) &&
      /^(CardTitle|h[1-4])$/.test(n.openingElement.tagName.getText())
    )
      found = staticText(n);
    ts.forEachChild(n, visit);
  };
  visit(node);
  return found;
}
function importsFor(sf, body) {
  const used = identifiers(parse("block.tsx", body));
  const result = [];
  for (const item of sf.statements.filter(ts.isImportDeclaration)) {
    const clause = item.importClause;
    if (!clause) continue;
    const parts = [];
    if (clause.name && used.has(clause.name.text)) parts.push(clause.name.text);
    const named = clause.namedBindings;
    if (named && ts.isNamespaceImport(named) && used.has(named.name.text))
      parts.push("* as " + named.name.text);
    if (named && ts.isNamedImports(named)) {
      const elements = named.elements.filter((e) => used.has(e.name.text));
      if (elements.length)
        parts.push("{ " + elements.map((e) => e.getText()).join(", ") + " }");
    }
    if (!parts.length) continue;
    let spec = item.moduleSpecifier.text;
    if (spec.startsWith("."))
      spec =
        "@/" +
        path.posix
          .normalize(path.posix.join(path.posix.dirname(sf.fileName), spec))
          .replace(/^src\//, "");
    result.push(
      `import ${clause.isTypeOnly ? "type " : ""}${parts.join(", ")} from ${JSON.stringify(spec)};`,
    );
  }
  return result.join("\n");
}
const catalog = [];
for (const file of files) {
  const sf = parse(file, fs.readFileSync(file, "utf8"));
  const top = declarations(sf.statements);
  for (const owner of sf.statements.filter(ts.isFunctionDeclaration)) {
    if (
      !owner.body ||
      !owner.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    )
      continue;
    const ownerName = owner.name?.text ?? "Page";
    const targets = [];
    const visit = (node) => {
      if (isCard(node)) {
        targets.push(node);
        return;
      }
      ts.forEachChild(node, visit);
    };
    visit(owner.body);
    for (const [index, node] of targets.entries()) {
      let expression = node;
      // Preserve map callback bindings, including nested collections.
      for (
        let ancestor = node.parent;
        ancestor && ancestor !== owner;
        ancestor = ancestor.parent
      ) {
        if (ts.isArrowFunction(ancestor) || ts.isFunctionExpression(ancestor)) {
          const call = ancestor.parent;
          if (ts.isCallExpression(call)) expression = call;
        }
      }
      const prefix = file.includes("/scenes/")
        ? slug(ownerName)
        : path.basename(file, ".tsx");
      const title = titleOf(node) || label(prefix) + " " + (index + 1);
      const id = `${prefix}-${slug(title.replaceAll("Tabler Icons", "Icon library")).slice(0, 65) || "card"}-${index + 1}`;
      let rendered =
        ts.isJsxElement(expression) || ts.isJsxSelfClosingElement(expression)
          ? expression.getText()
          : "{" + expression.getText() + "}";
      // A mapped collection needs its grid, not just the callback's cards.
      if (expression !== node) {
        let container = expression.parent;
        while (container && !ts.isJsxElement(container))
          container = container.parent;
        if (container?.openingElement.tagName.getText() === "div")
          rendered = container.openingElement.getText() + rendered + "</div>";
      }
      for (
        let ancestor = expression.parent;
        ancestor && ancestor !== owner;
        ancestor = ancestor.parent
      ) {
        if (
          ts.isJsxElement(ancestor) &&
          ancestor.openingElement.tagName.getText() === "form"
        ) {
          const attrs = ancestor.openingElement.attributes.properties
            .filter((a) => !ts.isJsxAttribute(a) || a.name.text !== "className")
            .map((a) => a.getText())
            .join(" ");
          rendered =
            '<form className="scene-form" ' +
            attrs +
            ">" +
            rendered +
            "</form>";
          break;
        }
      }
      // The gallery's lightbox and filters belong to its card collection.
      // Keep those siblings and the effect that opens its native dialog.
      const effects =
        ownerName === "Library"
          ? owner.body.statements
              .filter(ts.isExpressionStatement)
              .map((s) => s.getText())
              .join("\n")
          : "";
      if (ownerName === "Library") {
        let scene = node.parent;
        while (
          scene &&
          !(
            ts.isJsxElement(scene) &&
            scene.openingElement.tagName.getText() === "Scene"
          )
        )
          scene = scene.parent;
        if (!scene)
          throw new Error("Gallery collection must have a Scene parent");
        rendered = scene.children.map((child) => child.getFullText()).join("");
      }
      // Keep page-scoped chart variables and typography in installed blocks too,
      // without copying the page shell, heading, or unrelated siblings.
      for (
        let ancestor = node.parent;
        ancestor && ancestor !== owner;
        ancestor = ancestor.parent
      ) {
        if (!ts.isJsxElement(ancestor)) continue;
        const scope =
          attr(ancestor, "data-workspace-page") ??
          (ancestor.openingElement.tagName.getText() === "Scene"
            ? attr(ancestor, "id")
            : undefined);
        if (scope) {
          rendered = `<div className="overtrue-block-content" data-workspace-page=${scope.getText()}>${rendered}</div>`;
          break;
        }
      }
      // Compose desktop layouts before fitting the thumbnail into its tile.
      const previewWidth =
        expression !== node ||
        ownerName === "Library" ||
        /scene-(?:grid|client-list)|(?:sm|md|lg|xl):grid-cols-|pn-(?:row-cols-|col-(?:sm|md|lg|xl)-)|<(?:table|ProjectPortfolio)\b/.test(
          rendered,
        )
          ? 1280
          : /<MetricGroup\b/.test(rendered)
            ? 840
            : 640;
      const seed = rendered + "\n" + effects;
      const used = identifiers(
        parse(
          "body.tsx",
          seed + "\n" + closure(seed, declarations(owner.body.statements)),
        ),
      );
      const params = owner.parameters
        .map((p) => {
          if (ts.isObjectBindingPattern(p.name)) {
            const kept = p.name.elements.filter((e) =>
              bindings(e.name).some((n) => used.has(n)),
            );
            if (!kept.length) return "";
            return (
              "{ " +
              kept.map((e) => e.getText()).join(", ") +
              " }" +
              (p.type ? ": " + p.type.getText() : "") +
              (p.initializer ? " = " + p.initializer.getText() : " = {}")
            );
          }
          return used.has(p.name.getText()) ? p.getText() : "";
        })
        .filter(Boolean)
        .join(", ");
      const locals = declarations(owner.body.statements);
      const selectedLocals = closure(seed, locals);
      const functionBody = `export default function Block(${params}) {\n${selectedLocals}\n${effects}\nreturn (<>${rendered}</>);\n}`;
      const globals = closure(
        functionBody,
        top.filter((d) => d.node !== owner),
      );
      const body = globals + "\n" + functionBody;
      const code = `"use client";\n// Extracted from ${file}:${sf.getLineAndCharacterOfPosition(node.getStart()).line + 1}.\n${importsFor(sf, body)}\n${body}\n`;
      fs.writeFileSync(`${output}/${id}.tsx`, code);
      const direct = file.endsWith("/HighOrderPage.tsx")
        ? pages.find((p) => p.path === "/high-order")
        : pages.find(
            (p) => p.file === path.basename(file).replace(".tsx", ".html"),
          );
      const sourcePages = direct
        ? [direct]
        : pages.filter((p) => {
            const page = fs.readFileSync(
              "src/pages/workspace/" + p.file.replace(".html", ".tsx"),
              "utf8",
            );
            const importedName = owner.modifiers.some(
              (m) => m.kind === ts.SyntaxKind.DefaultKeyword,
            )
              ? "default"
              : ownerName;
            return parse(p.file, page).statements.some((statement) => {
              if (
                !(
                  ts.isImportDeclaration(statement) ||
                  ts.isExportDeclaration(statement)
                ) ||
                !statement.moduleSpecifier?.text.endsWith(
                  "/scenes/" + path.basename(file, ".tsx"),
                )
              )
                return false;
              if (ts.isImportDeclaration(statement)) {
                if (importedName === "default")
                  return !!statement.importClause?.name;
                const named = statement.importClause?.namedBindings;
                return (
                  named &&
                  ts.isNamedImports(named) &&
                  named.elements.some(
                    (element) =>
                      (element.propertyName ?? element.name).text ===
                      importedName,
                  )
                );
              }
              const named = statement.exportClause;
              return (
                named &&
                ts.isNamedExports(named) &&
                named.elements.some(
                  (element) =>
                    (element.propertyName ?? element.name).text ===
                    importedName,
                )
              );
            });
          });
      const category = /chart|metric|overview|uptime/.test(prefix)
        ? "Charts & metrics"
        : /form|settings|colorpicker|dropzone|wysiwyg/.test(prefix)
          ? "Forms & settings"
          : /people|profile|user|team|role/.test(prefix)
            ? "People"
            : /project|task|portfolio/.test(prefix)
              ? "Projects"
              : /billing|invoice|plan|pricing|payment/.test(prefix)
                ? "Billing"
                : file.includes("/scenes/")
                  ? "Workspace"
                  : "UI patterns";
      catalog.push({
        id,
        title,
        category,
        source: file,
        line: sf.getLineAndCharacterOfPosition(node.getStart()).line + 1,
        pages: sourcePages.map((p) => ({ title: p.title, path: p.path })),
        collection: expression !== node,
        previewWidth,
      });
      if (ownerName === "Library") {
        catalog.at(-1).title = "Asset gallery";
        catalog.at(-1).collection = true;
        for (const [variant, title, masonry] of [
          ["cards-masonry", "Masonry cards", true],
          ["photogrid", "Photo grid", false],
        ]) {
          const variantId = "library-" + variant;
          fs.writeFileSync(
            `${output}/${variantId}.tsx`,
            code
              .replace('id = "gallery"', `id = "${variant}"`)
              .replace("masonry = false", `masonry = ${masonry}`),
          );
          catalog.push({
            ...catalog.at(-1),
            id: variantId,
            title,
            pages: sourcePages
              .filter((p) => p.path === "/" + variant)
              .map((p) => ({ title: p.title, path: p.path })),
          });
        }
      }
    }
  }
}
const names = {
  overview: "Studio metrics",
  customers: "Client metrics",
  operations: "Operations metrics",
  billing: "Billing summary",
  plans: "Pricing plans",
  people: "Team directory",
  profile: "Profile cover",
  "project-cards": "Project portfolio",
  "task-board": "Task board",
  settings: "Workspace settings",
  wizard: "Project setup",
  widgets: "Studio metrics",
  tracking: "Service history",
  knowledge: "Knowledge topics",
  carousel: "Project showcase",
  illustrations: "Illustration cards",
  media: "Media library",
  "card-actions": "Card actions",
  toasts: "Toast notifications",
  uptime: "Service availability",
};
// Display copy is independent of IDs so existing registry installs keep working.
const titles = JSON.parse(
  fs.readFileSync("scripts/blocks/titles.json", "utf8"),
);
for (const id of Object.keys(titles)) {
  if (!catalog.some((card) => card.id === id))
    throw new Error(`Unknown card in titles.json: ${id}`);
}
for (const card of catalog) {
  card.keywords = titles[card.id] ? [card.title] : [];
  if (titles[card.id]) {
    card.title = titles[card.id];
    if (card.id.startsWith("social-icons-social-icons-"))
      card.category = "Charts & metrics";
    continue;
  }
  if (/ \d+$/.test(card.title)) {
    const prefix = card.id.slice(0, card.id.indexOf("-" + slug(card.title)));
    if (names[prefix]) card.title = names[prefix];
    else if (prefix === "placeholder")
      card.title = "Loading skeleton · " + card.title.match(/\d+$/)[0];
    else if (prefix === "social-icons")
      card.title = "Social buttons · " + card.title.match(/\d+$/)[0];
  }
}
const priority = [
  "overview",
  "widgets",
  "customers",
  "operations",
  "people",
  "profile",
  "project-cards",
];
const rank = (card) => {
  const i = priority.findIndex((prefix) => card.id.startsWith(prefix + "-"));
  return i < 0 ? 100 : i;
};
catalog.sort((a, b) => rank(a) - rank(b));
fs.writeFileSync(
  "src/blocks/catalog.json",
  JSON.stringify(catalog, null, 2) + "\n",
);
console.log(
  `Extracted ${catalog.length} card patterns from ${new Set(catalog.map((c) => c.source)).size} source modules.`,
);
// Use TypeScript's own unused-declaration fixes after slicing. This keeps hook
// calls while removing unused tuple bindings, parameters, and unrelated locals.
const config = ts.readConfigFile("tsconfig.app.json", ts.sys.readFile).config;
const parsed = ts.parseJsonConfigFileContent(config, ts.sys, root);
const versions = new Map();
const host = {
  ...ts.sys,
  useCaseSensitiveFileNames: () => ts.sys.useCaseSensitiveFileNames,
  getScriptFileNames: () => parsed.fileNames,
  getScriptVersion: (f) => String(versions.get(f) ?? 0),
  getScriptSnapshot: (f) =>
    fs.existsSync(f)
      ? ts.ScriptSnapshot.fromString(fs.readFileSync(f, "utf8"))
      : undefined,
  getCurrentDirectory: () => root,
  getCompilationSettings: () => parsed.options,
  getDefaultLibFileName: (opts) => ts.getDefaultLibFilePath(opts),
};
const service = ts.createLanguageService(host);
for (let pass = 0; pass < 3; pass++) {
  let count = 0;
  const changedFiles = [];
  for (const item of catalog) {
    const file = path.resolve(output, item.id + ".tsx");
    const diagnostics = service
      .getSemanticDiagnostics(file)
      .filter((d) => [6133, 6192, 6198, 6199].includes(d.code));
    const edits = [];
    for (const d of diagnostics) {
      const fix = service
        .getCodeFixesAtPosition(
          file,
          d.start,
          d.start + d.length,
          [d.code],
          {},
          {},
        )
        .find((f) => f.fixName === "unusedIdentifier");
      for (const change of fix?.changes ?? [])
        if (change.fileName === file) edits.push(...change.textChanges);
    }
    let text = fs.readFileSync(file, "utf8"),
      boundary = text.length + 1;
    for (const edit of edits.sort((a, b) => b.span.start - a.span.start)) {
      if (edit.span.start + edit.span.length > boundary) continue;
      text =
        text.slice(0, edit.span.start) +
        edit.newText +
        text.slice(edit.span.start + edit.span.length);
      boundary = edit.span.start;
      count++;
    }
    if (edits.length) {
      fs.writeFileSync(file, text);
      changedFiles.push(file);
    }
  }
  for (const file of changedFiles)
    versions.set(file, (versions.get(file) ?? 0) + 1);
  if (!count) break;
}
service.dispose();
const { format } = await import("prettier");
for (const card of catalog) {
  const file = `${output}/${card.id}.tsx`;
  let source = fs.readFileSync(file, "utf8");
  const sf = parse(file, source);
  const block = sf.statements.find(
    (n) => ts.isFunctionDeclaration(n) && n.name?.text === "Block",
  );
  const param = block?.parameters[0];
  if (
    block?.parameters.length === 1 &&
    ts.isObjectBindingPattern(param.name) &&
    !param.name.elements.length
  )
    source = source.slice(0, param.getFullStart()) + source.slice(param.end);
  fs.writeFileSync(file, await format(source, { parser: "typescript" }));
}
