"use client";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionCard } from "./section-card";
import { cn } from "@/lib/utils";
export function SettingsPanel({
  initialName = "Acme Studio",
  initialEmail = "team@acme.example",
  onSave,
}: {
  initialName?: string;
  initialEmail?: string;
  onSave?: (values: { name: string; email: string }) => void | Promise<void>;
}) {
  const id = useId();
  const [name, setName] = useState(initialName),
    [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState(""),
    [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState({
    name: initialName,
    email: initialEmail,
  });
  const [failed, setFailed] = useState(false);
  const dirty = name !== saved.name || email !== saved.email;
  return (
    <SectionCard
      title="Workspace settings"
      description="Manage your workspace name and contact details."
      contentClassName="p-0"
    >
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (saving || !dirty) return;
          const values = { name, email };
          setSaving(true);
          setStatus("");
          setFailed(false);
          try {
            await onSave?.(values);
            setSaved(values);
            setStatus(
              onSave ? "Changes saved." : "Demo saved locally in this preview.",
            );
          } catch {
            setFailed(true);
            setStatus("Could not save changes. Please try again.");
          } finally {
            setSaving(false);
          }
        }}
      >
        <fieldset disabled={saving} className="min-w-0 space-y-6 p-6">
          <div className="grid gap-2">
            <label htmlFor={`${id}-name`} className="text-sm font-medium">
              Workspace name
            </label>
            <Input
              id={`${id}-name`}
              className="h-10 rounded-md border-input bg-card dark:bg-card text-base shadow-xs focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 [&:user-invalid]:border-destructive [&:user-invalid]:ring-2 [&:user-invalid]:ring-destructive/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20 disabled:bg-muted dark:disabled:bg-muted sm:text-sm"
              required
              name="workspace-name"
              autoComplete="organization"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setStatus("");
                setFailed(false);
              }}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor={`${id}-email`} className="text-sm font-medium">
              Contact email
            </label>
            <Input
              id={`${id}-email`}
              className="h-10 rounded-md border-input bg-card dark:bg-card text-base shadow-xs focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 [&:user-invalid]:border-destructive [&:user-invalid]:ring-2 [&:user-invalid]:ring-destructive/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20 disabled:bg-muted dark:disabled:bg-muted sm:text-sm"
              required
              type="email"
              name="contact-email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setStatus("");
                setFailed(false);
              }}
            />
          </div>
        </fieldset>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/30 px-6 py-4">
          <p
            role={failed ? "alert" : "status"}
            className={cn(
              "m-0 min-w-0 grow basis-48 text-xs leading-5 text-muted-foreground",
              failed && "text-destructive",
            )}
          >
            {status ||
              (dirty ? "You have unsaved changes." : "You’re all up to date.")}
          </p>
          <Button
            type="submit"
            className="ml-auto h-10 shrink-0 rounded-md border border-primary bg-primary px-4 text-sm text-primary-foreground shadow-xs hover:bg-primary/90"
            disabled={saving || !dirty}
          >
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}
