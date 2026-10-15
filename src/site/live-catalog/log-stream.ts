export default {
  name: "log-stream",
  title: "Log stream",
  category: "Operations",
  description:
    "Follow a live event stream with level filters, search, and a tail that pauses when someone scrolls up to read.",
  dependencies: [],
  imports: "LogStream, type LogEntry",
  usage:
    'function Example() {\n  const entries: LogEntry[] = [\n    { id: "1", time: Date.now() - 2400, level: "info", source: "build", message: "Installing dependencies" },\n    { id: "2", time: Date.now() - 1200, level: "warn", source: "build", message: "Chunk exceeds 500 kB" },\n    { id: "3", time: Date.now(), level: "error", source: "health", message: "GET /healthz 503 · retrying" },\n  ]\n  return <LogStream title="Deploy · web" entries={entries} height={240} />\n}',
  notes:
    "Append entries to the end of entries; the stream follows the tail until someone scrolls up, then freezes what is on screen and offers a jump back with a count of new lines. Reaching the bottom again resumes following. Keep the array bounded in your own state (a few hundred lines) and use maxEntries to cap what renders. Press / to focus the filter. Without onClear, the clear action hides the current lines locally.",
  previewWidth: 640,
  previewHeight: 400,
  examples: [
    {
      name: "log-stream-demo",
      title: "Production deploy",
      description:
        "Build, tests, migrations, rollout, and a health check that fails once and recovers on retry. Scroll up to pause the tail.",
    },
    {
      name: "log-stream-compact-demo",
      title: "Filtered incident history",
      description:
        "A finished window of worker logs with debug lines hidden and a search for one invoice range.",
    },
  ],
  api: [
    ["entries", "LogEntry[]", "Events oldest first: { id, time, level, source?, message }. time accepts a Date, epoch milliseconds, or an ISO string."],
    ["title?", "React.ReactNode", 'Heading for the stream. Defaults to "Events".'],
    ["description?", "React.ReactNode", "Supporting text under the title."],
    ["height?", "number", "Height of the scrolling log in pixels. Defaults to 320."],
    ["maxEntries?", "number", "Render at most this many of the newest matching rows. Defaults to 500."],
    ["follow?", "boolean", "Control whether the view follows the tail. Pair with onFollowChange."],
    ["defaultFollow?", "boolean", "Initial follow state when uncontrolled. Defaults to true."],
    ["onFollowChange?", "(follow: boolean) => void", "Called when scrolling, Pause, Resume, or Jump to latest changes following."],
    ["onClear?", "() => void", "Called by the clear action. Without it, clearing hides current lines locally."],
    ["live?", "boolean", "Live sources show a Live or Paused badge, the follow control, and a cursor. Set false for archived logs. Defaults to true."],
    ["defaultLevels?", "LogLevel[]", '"debug" | "info" | "warn" | "error" levels shown initially. Defaults to all.'],
    ["defaultQuery?", "string", "Initial text filter, matched against messages and sources."],
    ["defaultWrap?", "boolean", "Wrap long messages instead of truncating them. Rows also expand on click."],
    ["timeZone?", '"local" | "utc"', "Timestamp time zone. Defaults to local."],
  ],
} as const;
