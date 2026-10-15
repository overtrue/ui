import { useState } from "react";
import {
  InsightCard,
  type InsightSource,
} from "@/registry/overtrue/insight-card";

const SOURCES: InsightSource[] = [
  { id: "billing", label: "Billing · revenue by plan" },
  { id: "retention", label: "Product analytics · retention" },
  { id: "nps", label: "Support · NPS survey" },
];

// Two phrasings of the same week, so Regenerate visibly writes a new answer.
const HIGHLIGHTS =
  "{{metric:Revenue|+12.8%}} {{metric:Churn|−0.4 pts|positive}} {{metric:NPS|+6}}\n\n";

const DRAFTS = [
  HIGHLIGHTS +
    "A strong week across the board. Growth came from annual upgrades on the Team plan, which added $31.4K in new ARR {{cite:1}}. Churn fell most among accounts younger than 90 days, right after the onboarding checklist shipped {{cite:2}}.\n\n" +
    "Detractors still mention slow CSV exports on large workspaces {{cite:3}}. Fixing that before the October pricing change would protect the NPS gain.",
  HIGHLIGHTS +
    "Revenue, retention and sentiment all moved the right way. Team plan annual upgrades drove most of the $31.4K in new ARR {{cite:1}}, and the onboarding checklist cut early churn for accounts under 90 days {{cite:2}}.\n\n" +
    "Watch exports: slow CSV downloads on large workspaces are the top detractor theme {{cite:3}} and could erode the gain after the pricing change.",
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// A model-like stream: a short think, then a few words at a time with uneven gaps.
async function* generate(draft: string, think: number): AsyncGenerator<string> {
  await wait(think);
  const words = draft.match(/\{\{[^}]*\}\}|\s+|[^\s{]+/g) ?? [];
  for (let index = 0; index < words.length; index += 3) {
    while (document.hidden) await wait(400);
    yield words.slice(index, index + 3).join("");
    await wait(70 + ((index * 37) % 90));
  }
}

export default function Demo() {
  const [run, setRun] = useState(0);
  const [stream, setStream] = useState(() => generate(DRAFTS[0], 350));

  return (
    <InsightCard
      title="Weekly summary"
      source={
        <>
          <span
            className="size-1.5 rounded-full bg-emerald-500"
            aria-hidden="true"
          />
          Oct 6–12 · 3 sources
        </>
      }
      stream={stream}
      sources={SOURCES}
      onRegenerate={() => {
        const next = run + 1;
        setRun(next);
        setStream(generate(DRAFTS[next % DRAFTS.length], 1300));
      }}
    />
  );
}
