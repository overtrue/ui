import { readFileSync, writeFileSync } from "node:fs";

// Pages reads public/_redirects and public/_headers. vercel.json stays the
// route list so the existing checks and Vercel config cannot drift apart.
const config = JSON.parse(readFileSync("vercel.json", "utf8"));

function pagesPath(source) {
  return source.replaceAll(":path*", "*");
}

export function cloudflareConfig() {
  const redirects = [
    ...config.redirects.map(
      (rule) =>
        `${rule.source} ${rule.destination} ${rule.permanent ? "301" : "302"}`,
    ),
    ...config.rewrites.map((rule) => `${rule.source} ${rule.destination} 200`),
  ].join("\n");
  const headers = config.headers
    .map((group) =>
      [
        pagesPath(group.source),
        ...group.headers.map((header) => `  ${header.key}: ${header.value}`),
      ].join("\n"),
    )
    .join("\n\n");
  return {
    "_redirects": `${redirects}\n`,
    "_headers": `${headers}\n`,
  };
}

const files = cloudflareConfig();
const check = process.argv.includes("--check");
let drift = false;
for (const [name, content] of Object.entries(files)) {
  const path = `public/${name}`;
  if (check) {
    const current = readFileSync(path, "utf8");
    if (current !== content) {
      console.error(`${path} does not match vercel.json. Run node scripts/site/cloudflare-config.mjs`);
      drift = true;
    }
  } else {
    writeFileSync(path, content);
  }
}
if (drift) process.exit(1);
if (check) console.log("Cloudflare redirects and headers match vercel.json.");
