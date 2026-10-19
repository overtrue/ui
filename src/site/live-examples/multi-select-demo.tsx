import { useState } from "react";
import { MultiSelect, type MultiSelectOption } from "@/registry/overtrue/multi-select";

/** Initials on a soft gradient, standing in for profile photos. */
function avatar(name: string, from: string, to: string) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("");
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="32" height="32" fill="url(#g)"/><text x="16" y="16.5" dominant-baseline="middle" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="12" font-weight="600" fill="#fff">${initials}</text></svg>`,
  )}`;
}

const people: [string, string, string, string, string][] = [
  ["Mia Chen", "Design", "Design systems lead", "#f472b6", "#8b5cf6"],
  ["Ava Singh", "Design", "Product designer, billing", "#fb923c", "#e11d48"],
  ["Theo Laurent", "Design", "Brand and marketing site", "#facc15", "#f97316"],
  ["Noah Kim", "Platform", "Staff engineer, payments API", "#38bdf8", "#4f46e5"],
  ["Priya Nair", "Platform", "Security and compliance", "#34d399", "#0d9488"],
  ["Leo Park", "Platform", "Out of office until Monday", "#a78bfa", "#2563eb"],
  ["Sam Rivera", "Platform", "Data platform", "#2dd4bf", "#0284c7"],
  ["Omar Haddad", "Growth", "Analytics and experiments", "#fbbf24", "#d97706"],
  ["Lena Fischer", "Growth", "Product manager, onboarding", "#f9a8d4", "#db2777"],
  ["Zoe Adams", "Growth", "Lifecycle marketing", "#86efac", "#16a34a"],
];

const options: MultiSelectOption[] = people.map(([name, group, role, from, to]) => ({
  value: name.toLowerCase().replace(/\s+/g, "-"),
  label: name,
  description: role,
  group,
  avatar: avatar(name, from, to),
  // Leo is away, so he cannot be requested.
  disabled: name === "Leo Park",
  keywords: [role],
}));

const settings = [
  ["Required approvals", "2 of 5"],
  ["Code owners", "@acme/payments"],
  ["Checks", "14 of 14 passed"],
  ["Base branch", "main"],
  ["Due", "Friday, 5:00 PM"],
  ["Labels", "billing, migration"],
];

export default function Demo() {
  const [reviewers, setReviewers] = useState([
    "mia-chen",
    "noah-kim",
    "priya-nair",
    "omar-haddad",
    "theo-laurent",
  ]);
  const [open, setOpen] = useState(true);

  return (
    <section
      aria-labelledby="reviewers-title"
      // Tall enough to hold the open list, which floats over the settings below.
      className="min-h-[28.5rem] rounded-2xl border border-border/70 bg-card p-5 text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]"
    >
      <header className="flex items-baseline justify-between gap-3">
        <h3 id="reviewers-title" className="text-sm font-semibold tracking-tight">
          Reviewers
        </h3>
        <p className="min-w-0 truncate text-xs text-muted-foreground">
          <span className="font-mono">#1284</span> Move billing webhooks to the event bus
        </p>
      </header>

      <MultiSelect
        aria-labelledby="reviewers-title"
        inline
        open={open}
        onOpenChange={setOpen}
        options={options}
        value={reviewers}
        onValueChange={setReviewers}
        maxSelected={6}
        placeholder="Add reviewers…"
        labels={{ listbox: "People" }}
        className="mt-3"
      />

      <dl className="mt-4 divide-y divide-border/60 rounded-xl bg-muted/40 text-[13px] ring-1 ring-border/60 ring-inset">
        {settings.map(([term, detail]) => (
          <div key={term} className="flex items-center justify-between gap-3 px-3 py-2.5">
            <dt className="text-muted-foreground">{term}</dt>
            <dd className="truncate font-medium tabular-nums">{detail}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
