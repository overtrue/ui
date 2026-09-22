import assert from "node:assert/strict";
import path from "node:path";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { catalog, catalogPath } from "../../src/site/catalog.ts";
import { sitePages } from "../../src/site/pages.ts";
import { usageSource } from "../../src/site/usage.ts";

const root = process.cwd();
const config = ts.readConfigFile("tsconfig.app.json", ts.sys.readFile);
const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
const examples = new Map(
  catalog.map((item) => [
    path.join(root, "src", "__usage__", `${item.name}.tsx`),
    usageSource(item).replaceAll(
      "@/components/overtrue/",
      "@/registry/overtrue/",
    ),
  ]),
);
const host = ts.createCompilerHost(options);
const originalGetSourceFile = host.getSourceFile.bind(host);
host.getSourceFile = (
  fileName,
  languageVersion,
  onError,
  shouldCreateNewSourceFile,
) =>
  examples.has(fileName)
    ? ts.createSourceFile(
        fileName,
        examples.get(fileName),
        languageVersion,
        true,
        ts.ScriptKind.TSX,
      )
    : originalGetSourceFile(
        fileName,
        languageVersion,
        onError,
        shouldCreateNewSourceFile,
      );
const program = ts.createProgram([...examples.keys()], options, host);
const diagnostics = ts.getPreEmitDiagnostics(program);
if (diagnostics.length) {
  console.error(
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCurrentDirectory: () => root,
      getCanonicalFileName: (name) => name,
      getNewLine: () => "\n",
    }),
  );
  process.exitCode = 1;
} else {
  const { redirects } = JSON.parse(readFileSync("vercel.json", "utf8"));
  for (const item of catalog) {
    const canonical = catalogPath(item);
    assert.ok(
      sitePages.some((page) => page.path === canonical),
      `${item.name}: missing canonical route`,
    );
    if (item.category === "Blocks") {
      assert.ok(
        !sitePages.some((page) => page.path === `/components/${item.name}`),
        `${item.name}: listed as a component`,
      );
      assert.ok(
        redirects.some(
          (redirect) =>
            redirect.source === `/components/${item.name}` &&
            redirect.destination === canonical,
        ),
        `${item.name}: missing legacy redirect`,
      );
    }
  }
  assert.equal(
    new Set(sitePages.map((page) => page.path)).size,
    sitePages.length,
    "duplicate catalog/card routes",
  );
  console.log(
    `Verified ${catalog.length} complete Usage examples against their real exports and canonical catalog routes.`,
  );
}
