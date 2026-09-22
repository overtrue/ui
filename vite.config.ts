import path from "node:path";
import fs from "node:fs";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { sitePages } from "./src/site/pages";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "site-preview-routes",
      configurePreviewServer(server) {
        server.middlewares.use((request, _response, next) => {
          const url = new URL(request.url ?? "/", "http://localhost");
          const pathname = url.pathname.replace(/\/+$/, "") || "/";
          if (
            pathname !== "/" &&
            sitePages.some((page) => page.path === pathname)
          ) {
            request.url = `${pathname}/index.html${url.search}`;
          }
          next();
        });
      },
    },
    {
      name: "site-page-metadata",
      apply: "build",
      closeBundle() {
        const output = path.resolve(__dirname, "dist");
        const template = fs.readFileSync(
          path.join(output, "index.html"),
          "utf8",
        );
        const origin = "https://ui.overtrue.xyz";
        const escape = (value: string) =>
          value
            .replaceAll("&", "&amp;")
            .replaceAll('"', "&quot;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;");
        const render = (title: string, description: string, url: string) =>
          template
            .replace(
              /<title>[\s\S]*?<\/title>/,
              () => `<title>${escape(title)} — overtrue/ui</title>`,
            )
            .replace(
              /(<meta\s+(?:name="description"|property="og:description")\s+content=")[^"]*("\s*\/?>)/g,
              (_, start, end) => start + escape(description) + end,
            )
            .replace(
              /(<meta\s+property="og:title"\s+content=")[^"]*("\s*\/?>)/,
              (_, start, end) => start + escape(title + " — overtrue/ui") + end,
            )
            .replace(
              /(<meta\s+property="og:url"\s+content=")[^"]*("\s*\/?>)/,
              (_, start, end) => start + url + end,
            )
            .replace(
              /(<link\s+rel="canonical"\s+href=")[^"]*("\s*\/?>)/,
              (_, start, end) => start + url + end,
            );
        for (const page of sitePages) {
          const directory = path.join(output, page.path.slice(1));
          fs.mkdirSync(directory, { recursive: true });
          fs.writeFileSync(
            path.join(directory, "index.html"),
            render(page.title, page.description, origin + page.path),
          );
        }
        fs.writeFileSync(
          path.join(output, "404.html"),
          render(
            "Page not found",
            "Explore overtrue/ui components and documentation.",
            origin + "/404",
          ).replace('content="index,follow"', 'content="noindex,follow"'),
        );
        fs.writeFileSync(
          path.join(output, "sitemap.xml"),
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitePages.map((page) => `  <url><loc>${origin}${page.path}</loc></url>`).join("\n")}\n</urlset>\n`,
        );
        fs.writeFileSync(
          path.join(output, "robots.txt"),
          `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
        );
      },
    },
    {
      name: "editor-assets",
      apply: "build",
      closeBundle() {
        const root = path.resolve(__dirname, "node_modules/hugerte");
        const destination = path.resolve(__dirname, "dist/vendor/hugerte");
        fs.mkdirSync(destination, { recursive: true });
        for (const directory of [
          "icons",
          "models",
          "themes",
          "skins",
          "plugins",
        ]) {
          fs.cpSync(
            path.join(root, directory),
            path.join(destination, directory),
            { recursive: true },
          );
        }
        fs.copyFileSync(
          path.join(root, "license.txt"),
          path.join(destination, "license.txt"),
        );
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
    open: "/",
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        site: path.resolve(__dirname, "index.html"),
        workspace: path.resolve(__dirname, "workspace/index.html"),
        cards: path.resolve(__dirname, "card-preview.html"),
      },
    },
  },
});
