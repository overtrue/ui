/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { IconCircleCheck } from "@tabler/icons-react";

import { CornerFrame } from "@/registry/overtrue/corner-frame";

export default function CornerFrameDemo() {
  return (
    <div className="@container w-full">
      <div className="grid gap-6 p-2 @xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <CornerFrame className="bg-card p-6" cornerColor="var(--color-chart-1)">
          <p className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-(--color-chart-1)"
            />
            Studio brief
          </p>
          <p className="mt-3 font-semibold tracking-tight">
            A place for the brief
          </p>
          <p className="mt-1 text-[13px] leading-5 text-muted-foreground">
            Keep the next review, its owner, and the decision in view.
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-dashed border-border pt-4 text-xs">
            <div>
              <dt className="text-muted-foreground">Owner</dt>
              <dd className="mt-1 font-medium">Maya Okafor</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Next review</dt>
              <dd className="mt-1 font-mono">Thu 10:00</dd>
            </div>
          </dl>
        </CornerFrame>
        <CornerFrame
          className="flex flex-col bg-muted/30 p-6"
          marks="bracket"
          cornerSize={14}
          cornerColor="var(--color-chart-3)"
        >
          <p className="font-semibold tracking-tight">Ready for handoff</p>
          <p className="mt-1 text-[13px] leading-5 text-muted-foreground">
            The brief is approved. Bring the final assets together.
          </p>
          <p className="mt-auto flex items-center gap-1.5 pt-5 text-xs font-medium">
            <IconCircleCheck
              aria-hidden="true"
              className="size-4 text-emerald-700 dark:text-emerald-400"
            />
            3 of 3 approvals
          </p>
        </CornerFrame>
      </div>
    </div>
  );
}
