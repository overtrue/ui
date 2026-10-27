import type { ApprovalRequest } from "@/registry/overtrue/approval-queue";
import type { AuditEvent } from "@/registry/overtrue/audit-trail";
import type { ChecklistItem } from "@/registry/overtrue/task-checklist";
import type { WorkloadMember } from "@/registry/overtrue/team-workload";
import { team, updates } from "./studio";

export const approvalRequests: ApprovalRequest[] = [
  {
    id: "REQ-104",
    title: "Identity system · final handover",
    description: "Ceramics identity · Brand guide and 8 export files",
    requestedBy: "June Park",
    date: "34 min ago",
    category: "Deliverable",
    status: "pending",
    href: "#/creative-review",
  },
  {
    id: "REQ-103",
    title: "Research sprint · scope adjustment",
    description: "Visitor experience · Six additional guest interviews",
    requestedBy: "Ines Duarte",
    date: "2 hours ago",
    category: "Change request",
    status: "pending",
    detail: "+12 hours · Within the project budget",
    href: "#/datagrid",
  },
];
export const kickoffChecklist: ChecklistItem[] = [
  {
    id: "brief",
    title: "Confirm scope and success criteria",
    checked: true,
    meta: "Maya",
  },
  {
    id: "access",
    title: "Give the delivery team access",
    checked: true,
    meta: "Leo",
  },
  {
    id: "assets",
    title: "Collect current brand assets",
    description: "Logos, typography and approved photography.",
    checked: false,
    meta: "June",
  },
  {
    id: "review",
    title: "Schedule the concept review",
    checked: false,
    meta: "Sep 25",
  },
];
export const workload: WorkloadMember[] = team.map((person, index) => ({
  id: person.id,
  name: person.name,
  role: person.discipline,
  image: `/assets/overtrue/people/${person.id}.svg`,
  allocated: [32, 44, 26, 21, 18, 24, 12, 28][index],
  capacity: [40, 40, 32, 32, 32, 40, 24, 32][index],
  href: `#/profile?member=${person.id}`,
}));
export const projectActivity: AuditEvent[] = updates
  .slice(0, 5)
  .map((update, index) => ({
    id: update.id,
    actor: update.person.name,
    action: update.title.replace(/^[A-Z]/, (letter) => letter.toLowerCase()),
    time: update.time,
    context: update.detail,
    image: `/assets/overtrue/people/${update.person.id}.svg`,
    changes:
      index === 1
        ? [{ field: "Environment", before: "Preview", after: "Staging" }]
        : undefined,
  }));
