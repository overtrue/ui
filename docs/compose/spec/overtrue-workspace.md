# overtrue/ui workspace

overtrue/ui provides editable admin, dashboard, and console interfaces built with React, TypeScript, Tailwind CSS, shadcn/ui, and Tabler Icons.

The website and installable registry live separately from the complete workspace examples. The workspace uses Acme Studio as its sample organization, with clearly marked sample people, client records, projects, and financial figures. Contact addresses use reserved `.example` domains.

- Page inventory: `src/data/workspace/pages.json`.
- Route modules: `src/pages/workspace/`.
- Business compositions: `src/components/overtrue/scenes/`.
- Shared example data: `src/data/workspace/studio.ts` and `src/data/workspace/operations.ts`.
- Session state for projects, tasks, clients, and approvals: `src/components/overtrue/workspace/work-data.tsx`.
- New illustrations, project covers, and generated photographs: `public/assets/overtrue/`.
- Required third-party attribution: `licenses/third-party.txt`.

Keep common controls reusable. Give business pages a clear purpose, useful records, and working local interactions. A successful build is necessary but does not replace desktop and mobile browser review.

## Page composition

Use the primary column for the current task and the narrower column for its owner, context, or next step. Tables scroll within their own region. Settings use adjacent explanations and fields without nested cards. On phones, inboxes and conversations show one pane at a time and restore list focus on return; calendars start in agenda view.

The 121 route entries keep their public URLs. Component-oriented routes now demonstrate a complete task: purchase requests, project sharing, approval queues, file intake, delivery checklists, regional preferences, or report analysis. Authentication and error pages remain focused on one decision.

TaskChecklist, ApprovalQueue, AuditTrail, TeamWorkload, FileBrowser, SettingsSection, and SplitView are independent registry components. Checklist and approval mutations support pending and rejected promises; applications own the confirmed records. File selections and split-view navigation are controlled by their callers. They do not import workspace data or styles.

Project creation and client intake add records to the shared session. Task status remains consistent between board and list. Forms validate before mutation; downloads contain the displayed records; conversation drafts are isolated by thread. Example settings, approvals, invoices, messages, and uploaded files remain local to the preview. Refreshing starts a new session, except explicitly saved appearance and privacy choices.

Extracted cards must include the dialogs controlled by their actions. Verify those interactions in the card preview and in a separate initialized shadcn project after registry generation.
