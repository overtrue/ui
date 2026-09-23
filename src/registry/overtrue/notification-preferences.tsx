"use client";
import { useId, useState } from "react";
import { IconBell, IconMail, IconReportAnalytics } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SectionCard } from "./section-card";
import { cn } from "@/lib/utils";

export interface NotificationSettings {
  mentions: boolean;
  projectUpdates: boolean;
  weeklyDigest: boolean;
}
const channels = [
  {
    key: "mentions",
    title: "Mentions and replies",
    description: "When someone needs your attention in a conversation.",
    icon: IconBell,
  },
  {
    key: "projectUpdates",
    title: "Project updates",
    description: "Milestones, status changes, and work assigned to you.",
    icon: IconMail,
  },
  {
    key: "weeklyDigest",
    title: "Weekly digest",
    description: "A Monday summary of progress across your projects.",
    icon: IconReportAnalytics,
  },
] as const;
const defaults: NotificationSettings = {
  mentions: true,
  projectUpdates: true,
  weeklyDigest: false,
};

export function NotificationPreferences({
  initialValues = defaults,
  onSave,
  className,
}: {
  initialValues?: NotificationSettings;
  onSave?: (values: NotificationSettings) => void | Promise<void>;
  className?: string;
}) {
  const id = useId();
  const [values, setValues] = useState(initialValues);
  const [saved, setSaved] = useState(initialValues);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [failed, setFailed] = useState(false);
  const dirty = channels.some(({ key }) => values[key] !== saved[key]);
  return (
    <SectionCard
      title="Notifications"
      description="Choose what reaches your inbox."
      className={cn("shadow-none", className)}
      contentClassName="p-0"
    >
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (saving || !dirty) return;
          setSaving(true);
          setStatus("");
          setFailed(false);
          try {
            await onSave?.(values);
            setSaved(values);
            setStatus(
              onSave ? "Preferences saved." : "Preferences saved in this demo.",
            );
          } catch {
            setFailed(true);
            setStatus("Could not save preferences. Please try again.");
          } finally {
            setSaving(false);
          }
        }}
      >
        <div className="divide-y divide-border px-5">
          {channels.map(({ key, title, description, icon: Icon }) => (
            <div key={key} className="flex items-center gap-4 py-5">
              <span className="hidden size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground sm:flex">
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <label htmlFor={`${id}-${key}`} className="text-sm font-medium">
                  {title}
                </label>
                <p
                  id={`${id}-${key}-description`}
                  className="m-0 mt-1 text-xs leading-5 text-muted-foreground"
                >
                  {description}
                </p>
              </div>
              <Switch
                id={`${id}-${key}`}
                aria-describedby={`${id}-${key}-description`}
                className="[&>span]:shadow-none"
                checked={values[key]}
                disabled={saving}
                onCheckedChange={(checked) => {
                  setValues((current) => ({ ...current, [key]: checked }));
                  setStatus("");
                  setFailed(false);
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4">
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
            size="sm"
            className="ml-auto shrink-0 bg-primary text-primary-foreground shadow-none hover:bg-primary/90"
            disabled={saving || !dirty}
          >
            {saving ? "Saving…" : "Save preferences"}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}
