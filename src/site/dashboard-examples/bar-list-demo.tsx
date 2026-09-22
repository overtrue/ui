/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { BarList } from "@/registry/overtrue/bar-list";

const pages = [
  { name: "/", value: 48_210, href: "#" },
  { name: "/projects", value: 21_480, href: "#" },
  { name: "/resources", value: 18_930, href: "#" },
  { name: "/projects/visitor-experience", value: 9_120, href: "#" },
  { name: "/activity", value: 4_305, href: "#" },
  { name: "/people", value: 1_870, href: "#" },
];

export default function BarListDemo() {
  return (
    <div className="w-full max-w-lg">
      <div className="text-muted-foreground mb-2 flex justify-between text-xs">
        <span>Page</span>
        <span>Visitors</span>
      </div>
      <BarList data={pages} showPercentage />
    </div>
  );
}
