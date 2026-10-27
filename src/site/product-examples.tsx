import { useState } from "react";
import {
  TaskChecklist,
  type ChecklistItem,
} from "@/registry/overtrue/task-checklist";
import {
  ApprovalQueue,
  type ApprovalRequest,
} from "@/registry/overtrue/approval-queue";
import { AuditTrail } from "@/registry/overtrue/audit-trail";
import { TeamWorkload } from "@/registry/overtrue/team-workload";
import { FileBrowser } from "@/registry/overtrue/file-browser";
import { SettingsSection } from "@/registry/overtrue/settings-section";
import { SplitView } from "@/registry/overtrue/split-view";

export function ProductExample({ name }: { name: string }) {
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: "brief",
      title: "Confirm the project brief",
      description: "Scope and success criteria agreed with the client.",
      checked: true,
      meta: "Maya",
    },
    {
      id: "team",
      title: "Invite the delivery team",
      description: "Assign an owner to each workstream.",
      checked: true,
      meta: "Leo",
    },
    {
      id: "assets",
      title: "Collect the brand assets",
      description: "Logos, type licenses and photography.",
      checked: false,
      meta: "June",
    },
    {
      id: "review",
      title: "Schedule the first review",
      checked: false,
      meta: "Sep 25",
    },
  ]);
  const [requests, setRequests] = useState<ApprovalRequest[]>([
    {
      id: "REQ-104",
      title: "Identity system · final handover",
      description: "Print-ready artwork and the updated brand guide.",
      requestedBy: "June Park",
      date: "34 minutes ago",
      category: "Deliverable",
      status: "pending",
    },
    {
      id: "REQ-103",
      title: "Research sprint · additional scope",
      description: "Six interviews across the member and guest journeys.",
      requestedBy: "Ines Duarte",
      date: "2 hours ago",
      category: "Change request",
      status: "pending",
      detail: "+12 hours · Within the approved budget",
    },
  ]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  if (name === "task-checklist")
    return (
      <TaskChecklist
        title="Ready for kickoff"
        description="Visitor experience · 4 preparation tasks"
        items={items}
        onCheckedChange={(id, checked) =>
          setItems((current) =>
            current.map((item) =>
              item.id === id ? { ...item, checked } : item,
            ),
          )
        }
      />
    );
  if (name === "approval-queue")
    return (
      <ApprovalQueue
        requests={requests}
        onDecision={(id, status) =>
          setRequests((current) =>
            current.map((request) =>
              request.id === id ? { ...request, status } : request,
            ),
          )
        }
      />
    );
  if (name === "file-browser")
    return (
      <FileBrowser
        files={[
          {
            id: "folder",
            name: "Brand guidelines",
            kind: "folder",
            owner: "June Park",
            updated: "Today, 10:42",
            size: "8 files",
          },
          {
            id: "studio",
            name: "studio-space.png",
            kind: "image",
            owner: "Maya Okafor",
            updated: "Yesterday",
            size: "PNG",
            preview: "/assets/overtrue/studio-space.png",
            downloadUrl: "/assets/overtrue/studio-space.png",
          },
          {
            id: "cover",
            name: "project-07.webp",
            kind: "image",
            owner: "Ines Duarte",
            updated: "Sep 20",
            size: "WebP",
            preview: "/assets/overtrue/project-07.webp",
            downloadUrl: "/assets/overtrue/project-07.webp",
          },
        ]}
        selectedIds={selectedFiles}
        onSelectionChange={setSelectedFiles}
      />
    );
  if (name === "team-workload")
    return (
      <TeamWorkload
        period="Sep 21–25"
        members={[
          {
            id: "maya",
            name: "Maya Okafor",
            role: "Product design",
            image: "/assets/overtrue/people/maya.svg",
            allocated: 32,
            capacity: 40,
          },
          {
            id: "leo",
            name: "Leo Nakamura",
            role: "Engineering",
            image: "/assets/overtrue/people/leo.svg",
            allocated: 44,
            capacity: 40,
          },
          {
            id: "june",
            name: "June Park",
            role: "Brand design",
            image: "/assets/overtrue/people/june.svg",
            allocated: 18,
            capacity: 32,
          },
        ]}
      />
    );
  if (name === "audit-trail")
    return (
      <AuditTrail
        events={[
          {
            id: "evt-1",
            actor: "Maya Okafor",
            action: "updated",
            target: "Member portal",
            time: "12 minutes ago",
            image: "/assets/overtrue/people/maya.svg",
            changes: [
              { field: "Status", before: "Planned", after: "In progress" },
              { field: "Owner", before: "Unassigned", after: "Leo Nakamura" },
            ],
          },
          {
            id: "evt-2",
            actor: "June Park",
            action: "uploaded",
            target: "Brand guidelines v3",
            time: "48 minutes ago",
            image: "/assets/overtrue/people/june.svg",
            context: "8 assets added to the project handover.",
            outcome: "success",
          },
          {
            id: "evt-3",
            actor: "Ines Duarte",
            action: "requested a review",
            time: "2 hours ago",
            image: "/assets/overtrue/people/ines.svg",
            context: "Visitor experience · Discovery notes",
          },
        ]}
      />
    );
  if (name === "settings-section")
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(true);
        }}
        onChange={() => setSaved(false)}
        className="rounded-xl border border-border bg-card p-6"
      >
        <SettingsSection
          title="Workspace identity"
          description="Your team sees these details in shared projects and invitations."
          footer={
            <>
              <span role="status">{saved ? "Saved in this preview" : ""}</span>
              <button
                className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
                type="submit"
              >
                Save changes
              </button>
            </>
          }
        >
          <label className="grid gap-2 text-xs font-medium">
            Workspace name
            <input
              required
              defaultValue="Acme Studio"
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            />
          </label>
          <label className="grid gap-2 text-xs font-medium">
            Contact email
            <input
              required
              type="email"
              defaultValue="hello@acme.example"
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            />
          </label>
        </SettingsSection>
      </form>
    );
  return (
    <SplitView
      selected={selected !== null}
      onBack={() => setSelected(null)}
      listLabel="Conversations"
      list={
        <div>
          {[
            "Identity system review",
            "Member portal handover",
            "October planning",
          ].map((title, index) => (
            <button
              key={title}
              className="block w-full border-b border-border p-4 text-left hover:bg-muted"
              onClick={() => setSelected(index)}
            >
              <span className="block text-sm font-medium">{title}</span>
              <span className="mt-1 block text-xs text-muted-foreground">
                Project updates · {index + 1}h ago
              </span>
            </button>
          ))}
        </div>
      }
    >
      <div className="min-h-64 p-6">
        <h3 className="text-base font-semibold">
          {selected === null
            ? "Select a conversation"
            : [
                "Identity system review",
                "Member portal handover",
                "October planning",
              ][selected]}
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {selected === null
            ? "Keep the details close while you work through the queue."
            : "The latest files and review notes are ready. Let’s agree on the next step before the client handover."}
        </p>
      </div>
    </SplitView>
  );
}
