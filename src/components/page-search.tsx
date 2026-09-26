import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IconArrowUpRight, IconSearch } from "@tabler/icons-react";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import "@/styles/page-search.css";

export type SearchPage = {
  href: string;
  title: string;
  description: string;
  section: string;
};

const normalize = (text: string) => text.toLowerCase().replace(/[-_/]/g, " ");

export function PageSearch({
  pages,
  label,
  className,
  onNavigate,
  shortcutEnabled = true,
}: {
  pages: SearchPage[];
  label: string;
  className?: string;
  onNavigate: (href: string) => void;
  shortcutEnabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [modifier, setModifier] = useState("Ctrl");
  useEffect(() => {
    setModifier(/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl");
  }, []);
  useEffect(() => {
    if (!shortcutEnabled) return;
    const handleKey = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        !(event.metaKey || event.ctrlKey) ||
        event.key.toLowerCase() !== "k"
      )
        return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.closest('input, textarea, select, [role="dialog"]'))
      )
        return;
      event.preventDefault();
      setQuery("");
      setOpen(true);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [shortcutEnabled]);
  const term = normalize(query.trim());
  const words = term.split(/\s+/);
  const matches = term
    ? pages
        .filter((page) =>
          words.every((word) =>
            normalize(
              `${page.title} ${page.description} ${page.section} ${page.href}`,
            ).includes(word),
          ),
        )
        .sort((a, b) => {
          const rank = (page: SearchPage) => {
            const title = normalize(page.title);
            return title === term
              ? 0
              : title.startsWith(term)
                ? 1
                : title.includes(term)
                  ? 2
                  : 3;
          };
          return rank(a) - rank(b);
        })
    : pages.slice(0, 8);
  const results = matches.slice(0, 24);
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) setQuery("");
      }}
    >
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={className}
          aria-label={label}
          aria-keyshortcuts={shortcutEnabled ? "Meta+K Control+K" : undefined}
          title={shortcutEnabled ? `${label} (${modifier}+K)` : label}
        >
          <IconSearch size={18} aria-hidden="true" />
          <span className="page-search-trigger-text">Search</span>
          {shortcutEnabled && (
            <kbd className="page-search-trigger-key">{modifier} K</kbd>
          )}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="page-search-overlay" />
        <Dialog.Content
          className="page-search-dialog"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            inputRef.current?.focus();
          }}
        >
          <div className="page-search-heading">
            <Dialog.Title>{label}</Dialog.Title>
            <Dialog.Close
              className="page-search-close"
              aria-label="Close search"
            >
              Esc
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            Find a page by name or topic. Use the arrow keys to choose a result
            and Enter to open it.
          </Dialog.Description>
          <Command shouldFilter={false} className="page-search-command">
            <CommandInput
              ref={inputRef}
              value={query}
              onValueChange={setQuery}
              placeholder="Where would you like to go?"
              aria-label="Search by name or topic"
              autoComplete="off"
              spellCheck={false}
            />
            <CommandList aria-label="Search results">
              {results.length ? (
                results.map((page) => (
                  <CommandItem
                    key={page.href}
                    value={page.href}
                    onSelect={() => {
                      setOpen(false);
                      setQuery("");
                      onNavigate(page.href);
                    }}
                  >
                    <span className="page-search-result">
                      <span>
                        <strong>{page.title}</strong>
                        <small>{page.section}</small>
                      </span>
                      <span>{page.description}</span>
                    </span>
                    <IconArrowUpRight size={16} aria-hidden="true" />
                  </CommandItem>
                ))
              ) : (
                <div className="page-search-empty">
                  <IconSearch size={24} aria-hidden="true" />
                  <strong>No matching pages</strong>
                  <p>Try a component, page name, or topic such as “forms”.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      inputRef.current?.focus();
                    }}
                  >
                    Clear search
                  </button>
                </div>
              )}
            </CommandList>
          </Command>
          <div className="page-search-footer">
            <span role="status">
              {term
                ? `${matches.length} result${matches.length === 1 ? "" : "s"}${matches.length > 24 ? " · Showing the first 24" : ""}`
                : "A few places to start"}
            </span>
            <span aria-hidden="true">
              <kbd>↑</kbd>
              <kbd>↓</kbd> Navigate <kbd>↵</kbd> Open
            </span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
