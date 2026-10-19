import { useState } from "react";
import { IconHash } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { MultiSelect, type MultiSelectOption } from "@/registry/overtrue/multi-select";

const tags: [string, number][] = [
  ["accessibility", 184],
  ["dashboards", 312],
  ["data-visualization", 207],
  ["design-systems", 248],
  ["engineering", 431],
  ["motion", 66],
  ["performance", 159],
  ["product", 377],
  ["research", 92],
  ["typography", 58],
];

const count = new Intl.NumberFormat("en-US");

const initialOptions: MultiSelectOption[] = tags.map(([tag, posts]) => ({
  value: tag,
  label: tag,
  description: `${count.format(posts)} articles`,
  icon: <IconHash />,
}));

/** "Data Viz!" becomes "data-viz". */
const slug = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

export default function Demo() {
  const [options, setOptions] = useState(initialOptions);
  const [value, setValue] = useState(["dashboards", "design-systems", "accessibility"]);

  return (
    <div className="mx-auto w-full max-w-lg rounded-2xl border border-border/70 bg-card text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]">
      <header className="px-5 pt-5">
        <h3 className="text-sm font-semibold tracking-tight">Publish article</h3>
        <p className="text-[13px] leading-5 text-muted-foreground">
          Tags decide where the article appears in the journal.
        </p>
      </header>
      <div className="space-y-4 p-5">
        <div>
          <label htmlFor="article-title" className="mb-1.5 block text-xs font-medium">
            Title
          </label>
          <Input id="article-title" defaultValue="Designing calm dashboards" className="h-9" />
        </div>
        <div>
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <label htmlFor="article-tags" className="text-xs font-medium">
              Tags
            </label>
            <span className="text-xs text-muted-foreground tabular-nums">
              {value.length} of 5
            </span>
          </div>
          <MultiSelect
            id="article-tags"
            aria-describedby="article-tags-hint"
            options={options}
            value={value}
            onValueChange={setValue}
            maxSelected={5}
            collapse={false}
            creatable
            onCreate={(query) => {
              const tag = slug(query);
              if (!tag) return;
              const option = { value: tag, label: tag, description: "New tag", icon: <IconHash /> };
              setOptions((list) => (list.some((item) => item.value === tag) ? list : [...list, option]));
              return option;
            }}
            placeholder="Add tags…"
            labels={{
              create: (query) => `Create tag “${slug(query) || query}”`,
              listbox: "Tags",
            }}
          />
          <p id="article-tags-hint" className="mt-1.5 text-xs text-muted-foreground">
            Type to search, or press Enter to create a new tag.
          </p>
        </div>
      </div>
    </div>
  );
}
