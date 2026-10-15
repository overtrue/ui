import { lazy, Suspense, type ComponentType } from "react";
import { liveCatalog } from "./live-catalog";

const modules = import.meta.glob<{ default: ComponentType }>(
  "./live-examples/*.tsx",
);
const cache = new Map<string, ComponentType>();
function demo(name: string) {
  if (!cache.has(name)) {
    const load = modules[`./live-examples/${name}.tsx`];
    cache.set(name, load ? lazy(load) : () => null);
  }
  return cache.get(name)!;
}

export function LiveExample({
  name,
  expanded = false,
}: {
  name: string;
  expanded?: boolean;
}) {
  const item = liveCatalog.find((item) => item.name === name);
  if (!item) return null;
  const examples = expanded ? item.examples : item.examples.slice(0, 1);
  return (
    <div
      className="live-examples mx-auto flex w-full min-w-0 flex-col gap-10"
      style={expanded ? { maxWidth: item.previewWidth } : undefined}
    >
      {examples.map((example) => {
        const Demo = demo(example.name);
        return (
          <section
            key={example.name}
            data-live-example={example.name}
            className="min-w-0"
          >
            {expanded && (
              <>
                <h3 className="mb-3 text-base font-semibold">
                  {example.title}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {example.description}
                </p>
              </>
            )}
            <Suspense
              fallback={
                <p role="status" className="text-sm text-muted-foreground">
                  Loading example…
                </p>
              }
            >
              <Demo />
            </Suspense>
          </section>
        );
      })}
    </div>
  );
}
