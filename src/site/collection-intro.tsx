import { Link } from "react-router-dom";
import { IconArrowUpRight } from "@tabler/icons-react";
import { componentCount, blockCount, cardCount } from "./catalog";

export function CollectionIntro({ blocks = false }: { blocks?: boolean }) {
  return (
    <header className="collection-intro">
      <h1>{blocks ? "Blocks" : "Components"}</h1>
      <div className="collection-intro-aside">
        <p>
          {blocks
            ? `${blockCount} composed interfaces and ${cardCount} cards from the workspace examples. Install one, then adapt the layout, fields, and actions to your product.`
            : `${componentCount} charts, metrics, tables, and layout pieces for admin interfaces. Each has a live preview, its full source, and a one-line install.`}
        </p>
        <Link className="text-link" to="/docs">
          Installation guide{" "}
          <IconArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}
