# Reusable admin components

The Components catalogue contains 31 portable components. The ten additions below are extracted from existing workspace and block patterns. Each has a preview, installation command, editable source, usage example, and props table at `/components/<name>`.

| Component | Existing adoption | Main API |
| --- | --- | --- |
| `section-card` | High-order examples; task, member, ribbon, and status cards | `title`, `description`, `actions`, `children`, `contentClassName` |
| `ribbon-card` | High-order card examples | `ribbon`, `ribbonPosition`, SectionCard props |
| `status-edge-card` | High-order status examples | `edge`, `tone`, SectionCard props |
| `search-field` | DataTable, ProjectPortfolio, workspace scene searches | Required `label`, controlled `value` and `onValueChange` |
| `filter-tabs` | Project board, asset library, tracking, and other scene filters | Required `label`, `items`, controlled `value` and `onValueChange` |
| `chart-legend` | MetricChart, StorageMeter, high-order charts | `items`, `layout`, `label` |
| `timeline` | High-order activity examples | `items`, `label`, `emptyMessage` |
| `task-list` | High-order task examples | Stable task IDs, `onTaskChange(id, done)`; also exports TaskCard |
| `file-list` | Workspace typography attachment example | Stable file IDs, `href`, caller-owned `actions` |
| `member-card` | Workspace people collection | `member`, `description`, `badge`, `details`, `action` |

All ten install without workspace styles or routing. They use standard Tailwind v4 tokens and shadcn primitives; registry generation includes their local component dependencies. Icons use Tabler Icons. Status edges can use optional `--color-success`, `--color-warning`, and `--color-info` tokens, falling back to primary when those tokens are absent.

Search, filter selection, and task completion are controlled by the consumer. FileList displays links and action slots; it does not upload files or persist changes. FilterTabs uses pressed buttons for filtering a shared result set; use shadcn Tabs for separate tab panels. Timeline supports machine-readable timestamps, empty states, and image fallbacks.

The old workspace import paths are adapters or re-exports. Change the implementations in `src/registry/overtrue/`, then run `npm run build` to refresh the card blocks and registry payloads. Do not edit generated block files.
