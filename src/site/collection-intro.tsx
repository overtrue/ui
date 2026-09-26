import { Link } from "react-router-dom";
import {
  IconArrowUpRight,
  IconBox,
  IconLayersIntersect,
} from "@tabler/icons-react";
import { StatCard } from "@/registry/overtrue/stat-card";
import { ResourceProgress } from "@/registry/overtrue/resource-progress";
import { componentCount, blockCount, cardCount } from "./catalog";

export function CollectionIntro({ blocks = false }: { blocks?: boolean }) {
  return (
    <header className="collection-intro">
      <div className="page-intro">
        <p className="overline collection-eyebrow">
          {blocks ? (
            <IconLayersIntersect size={16} aria-hidden="true" />
          ) : (
            <IconBox size={16} aria-hidden="true" />
          )}
          THE OVERTRUE/UI COLLECTION <span>/ {blocks ? "02" : "01"}</span>
        </p>
        <h1>
          {blocks ? (
            <>
              A head start, <br />
              <em>assembled.</em>
            </>
          ) : (
            <>
              Small components. <br />
              <em>Big head start.</em>
            </>
          )}
        </h1>
        <p>
          {blocks
            ? "Complete interfaces and individual cards from the workspace examples. Every piece is yours to change."
            : "Practical, composable pieces for your next admin interface. Preview it. Install it. Make it yours."}
        </p>
        <div className="collection-facts">
          <span>
            <strong>{blocks ? blockCount : componentCount}</strong>{" "}
            {blocks ? "composed blocks" : "components"}
          </span>
          <span>
            {blocks ? (
              <>
                <strong>{cardCount}</strong> card patterns
              </>
            ) : (
              "React + Tailwind CSS"
            )}
          </span>
          <Link to="/docs">
            Editable source <IconArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="collection-specimen" aria-hidden="true" inert>
        <div className="specimen-label">
          <span>IN THE COLLECTION</span>
          <span>↗</span>
        </div>
        <StatCard
          title={blocks ? "Monthly recurring revenue" : "Total revenue"}
          value="$36,800"
          change="12.8%"
          trend="up"
          sparkline={[22, 28, 24, 35, 32, 46, 42, 58, 55, 72]}
        />
        <div className="specimen-resource">
          <ResourceProgress
            label="Storage"
            value={72}
            max={100}
            valueLabel="72 / 100 GB"
          />
        </div>
        <div className="specimen-caption">
          <span>Real components. Your canvas.</span>
          <span>TSX</span>
        </div>
      </div>
    </header>
  );
}
