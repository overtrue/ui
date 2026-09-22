"use client";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  return (
    <Card className="gap-0 rounded-lg border bg-card py-0 shadow-sm">
      <CardHeader className="border-b px-5 py-4 [.border-b]:pb-4">
        <CardTitle className="text-sm font-semibold">
          Workspace settings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setSaving(true);
            setStatus("");
            try {
              await onSave?.({ name, email });
              setStatus(
                onSave
                  ? "Changes saved."
                  : "Demo saved locally in this preview.",
              );
            } catch {
              setStatus("Could not save changes. Please try again.");
            } finally {
              setSaving(false);
            }
          }}
        >
          <div className="grid gap-2">
            <label htmlFor={`${id}-name`} className="text-sm font-medium">
              Workspace name
            </label>
            <Input
              id={`${id}-name`}
              required
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setStatus("");
              }}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor={`${id}-email`} className="text-sm font-medium">
              Contact email
            </label>
            <Input
              id={`${id}-email`}
              required
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setStatus("");
              }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save changes"}
            </Button>
            <span role="status" className="text-xs text-muted-foreground">
              {status}
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
