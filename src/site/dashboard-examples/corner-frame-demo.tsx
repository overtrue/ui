/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { CornerFrame } from "@/registry/overtrue/corner-frame";

export default function CornerFrameDemo() {
  return (
    <div className="grid w-full gap-5 p-2 sm:grid-cols-2">
      <CornerFrame className="bg-card p-8" cornerColor="var(--color-chart-1)">
        <p className="font-medium"> A place for the brief </p>
        <p className="text-muted-foreground mt-1 text-sm">
          Keep the next review, its owner, and the decision in view.{" "}
        </p>
      </CornerFrame>
      <CornerFrame
        className="bg-muted/30 p-8"
        cornerSize={16}
        cornerColor="var(--color-chart-3)"
      >
        <p className="font-medium"> Ready for handoff </p>
        <p className="text-muted-foreground mt-1 text-sm">
          The brief is approved. Bring the final assets together.{" "}
        </p>
      </CornerFrame>
    </div>
  );
}
