import { useState } from "react";
import { Link } from "react-router-dom";
import { IconArrowRight, IconArrowUpRight } from "@tabler/icons-react";
import { catalog, componentCount, blockCount, type ItemName } from "./catalog";
import { Example } from "./examples";

const featured = [
  "project-portfolio",
  "analytics-overview",
  "service-status",
] as const;

export function HomeDetails() {
  const [selected, setSelected] = useState<ItemName>(featured[0]);
  const item = catalog.find((item) => item.name === selected)!;
  return (
    <>
      <section
        className="section assembled-section"
        aria-labelledby="assembled-title"
      >
        <div className="section-heading">
          <div>
            <p className="overline">THE PIECES, PUT TOGETHER</p>
            <h2 id="assembled-title">A useful whole.</h2>
            <p>Start with a complete view. Make every part your own.</p>
          </div>
          <Link className="text-link" to="/blocks">
            Browse all blocks <IconArrowRight size={16} />
          </Link>
        </div>
        <div
          className="showcase-switcher"
          role="group"
          aria-label="Featured blocks"
        >
          {featured.map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={selected === name}
              onClick={() => setSelected(name)}
            >
              {catalog.find((item) => item.name === name)!.title}
            </button>
          ))}
        </div>
        <div className="assembled-preview" key={selected}>
          <Example name={selected} expanded />
        </div>
        <div className="assembled-caption">
          <p>{item.description}</p>
          <Link className="text-link" to={`/components/${selected}`}>
            Source & installation <IconArrowUpRight size={15} />
          </Link>
        </div>
      </section>
      <section
        className="section questions-section"
        aria-labelledby="questions-title"
      >
        <div>
          <p className="overline">A FEW THINGS TO KNOW</p>
          <h2 id="questions-title">Before you start.</h2>
          <p>The practical details, in one place.</p>
          <Link className="text-link" to="/docs">
            Read the documentation <IconArrowRight size={16} />
          </Link>
        </div>
        <dl className="questions-list">
          <div>
            <dt>What is included?</dt>
            <dd>
              {componentCount} components, {blockCount} complete blocks, and an
              optional theme. The workspace gallery adds 119 pages to explore;
              those example pages are separate from the installable registry.
            </dd>
          </div>
          <div>
            <dt>Can I use it in a commercial project?</dt>
            <dd>
              Yes. The code is available under the{" "}
              <a href="/LICENSE.txt">MIT license</a>. Keep the required
              copyright and license notices when redistributing it.
            </dd>
          </div>
          <div>
            <dt>Does it work with my existing shadcn project?</dt>
            <dd>
              The registry targets React, TypeScript, and Tailwind CSS v4.
              Components inherit your semantic tokens. You can keep your
              existing theme and add one component at a time.
            </dd>
          </div>
          <div>
            <dt>Is there a package to keep up to date?</dt>
            <dd>
              The CLI copies editable source into your project and installs its
              dependencies. Your changes stay yours. Compare new versions before
              replacing a file you have customized.
            </dd>
          </div>
          <div>
            <dt>Does it include a backend?</dt>
            <dd>
              No. Previews use sample data and local interactions. Bring your
              own API, authentication, and persistence. The{" "}
              <Link to="/docs/composition">composition guide</Link> explains
              where to connect them.
            </dd>
          </div>
        </dl>
      </section>
    </>
  );
}
