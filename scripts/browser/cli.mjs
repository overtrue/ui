import { execFile } from "node:child_process";
import { appendFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { promisify } from "node:util";

const exec = promisify(execFile);
const require = createRequire(import.meta.url);
const executable = path.join(
  path.dirname(require.resolve("@playwright/cli/package.json")),
  "playwright-cli.js",
);

// Use the lockfile's browser tooling instead of downloading a moving CLI version.
export function browserCli(session) {
  const output = "output/playwright/cli";
  const invoke = (...args) =>
    exec(process.execPath, [executable, "--session", session, ...args], {
      maxBuffer: 16 * 1024 * 1024,
      timeout: 20 * 60 * 1000,
    });
  return async (...args) => {
    await mkdir(output, { recursive: true });
    try {
      const result = await invoke(...args);
      await appendFile(
        `${output}/${session}.log`,
        result.stdout + result.stderr,
      );
      // The CLI can report a browser failure in stdout while exiting with zero.
      if (result.stdout.includes("### Error")) throw new Error(result.stdout);
      return result;
    } catch (error) {
      await appendFile(
        `${output}/${session}.log`,
        String(error) + "\n" + (error.stdout ?? "") + (error.stderr ?? ""),
      );
      if (args[0] === "run-code") {
        await invoke(
          "run-code",
          `async page => { await page.screenshot({ path: ${JSON.stringify(`${output}/${session}-failure.png`)}, fullPage: true }); }`,
        ).catch(() => {});
      }
      throw error;
    }
  };
}
