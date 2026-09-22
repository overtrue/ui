/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { DeltaBadge } from "@/registry/overtrue/delta-badge";

export default function DeltaBadgeDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <DeltaBadge delta={0.124} />
        <DeltaBadge delta={-0.032} />
        <DeltaBadge delta={0} />
        <DeltaBadge delta={0.08} invert />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <DeltaBadge delta={0.124} variant="soft" />
        <DeltaBadge delta={-0.032} variant="soft" />
        <DeltaBadge delta={0} variant="soft" />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <DeltaBadge delta={0.124} variant="text" />
        <DeltaBadge delta={-0.032} variant="text" showIcon={false} />
      </div>
    </div>
  );
}
