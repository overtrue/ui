import { useEffect, useState } from "react";
import { documents } from "@/data/workspace/studio";
import { Scene, SceneCard, SearchField, Go, Pill } from "./shared";
const questions = [
  [
    "How should we organize a new project?",
    "Start with a short brief, one owner, and the next milestone. Add deliverables and supporting files as the work becomes clearer. A useful project is one the whole team can understand.",
  ],
  [
    "Who can see a client project?",
    "Only workspace members with access to that project. Invite a client as a guest when they need to review work, and keep internal discussions in the team space.",
  ],
  [
    "Where should final files live?",
    "Keep the approved files in the project’s handover folder. Include a short readme with file formats, usage guidance, and a contact for follow-up questions.",
  ],
  [
    "Can we change the delivery date?",
    "Yes. Update the milestone, explain the reason in the project activity, and confirm the new date with the client. Everyone should see the same expectation.",
  ],
  [
    "How do we make a useful review request?",
    "Share enough context to understand the work, ask one specific question, and say when you need an answer. The best feedback starts with a clear invitation.",
  ],
  [
    "What happens when a project is complete?",
    "Publish the handover, record the decisions, and archive the project. The team can still search it later when a similar question comes up.",
  ],
];
export function Knowledge({ id = "search-results" }: { id?: string }) {
  const [query, setQuery] = useState(
    () => new URLSearchParams(location.hash.split("?")[1]).get("query") ?? "",
  );
  const matchingQuestions = questions.filter((q) =>
    q.join(" ").toLowerCase().includes(query.trim().toLowerCase()),
  );
  const matchingDocuments = documents.filter((d) =>
    (d.title + d.summary).toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <Scene
      id={id}
      title={id === "faq" ? "A few useful answers" : "The studio handbook"}
      description="Practical guidance for the way we work together."
    >
      <div className="scene-knowledge-hero">
        <img
          src="/assets/overtrue/illustration-search.svg"
          alt="Finding a useful answer"
        />
        <div>
          <h2>Less searching. More understanding.</h2>
          <p>
            Project guidance, workspace basics, and the small habits that make a
            difference.
          </p>
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="What would you like to know?"
          />
        </div>
      </div>
      <p className="scene-toolbar">
        {id === "faq" ? matchingQuestions.length : matchingDocuments.length}{" "}
        {id === "faq" ? "answers" : "guides"} available
      </p>
      {!(id === "faq"
        ? matchingQuestions.length
        : matchingDocuments.length) && (
        <div className="scene-empty-search">
          <h3>No results for “{query}”</h3>
          <p>Try a shorter phrase, such as “project” or “files”.</p>
          <button className="scene-button" onClick={() => setQuery("")}>
            Clear search
          </button>
        </div>
      )}
      {id === "faq" ? (
        <div className="scene-faq">
          {matchingQuestions.map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      ) : (
        <div className="scene-grid-two">
          {matchingDocuments.map((d) => (
            <SceneCard key={d.title}>
              <Pill>{d.category}</Pill>
              <h2>{d.title}</h2>
              <p>{d.summary}</p>
              <div className="scene-toolbar">
                <small>{d.read}</small>
                <Go to="/prose">Read the guide</Go>
              </div>
            </SceneCard>
          ))}
        </div>
      )}
    </Scene>
  );
}
export function Article({ id = "prose" }: { id?: string }) {
  const [active, setActive] = useState("context");
  useEffect(() => {
    const update = () => {
      const sections = ["context", "files", "decisions", "next"]
        .map((id) => document.getElementById(id))
        .filter((node): node is HTMLElement => Boolean(node));
      const current = sections
        .filter((node) => node.getBoundingClientRect().top <= 180)
        .at(-1);
      setActive(current?.id ?? "context");
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [id]);
  return (
    <Scene
      id={id}
      title={
        id === "typography"
          ? "A clear hierarchy. A useful read."
          : "A useful handover is a generous act."
      }
      description="Studio practice · 6 min read · Updated September 2026"
    >
      <div className="scene-article-layout">
        <article className="scene-article">
          <img
            src="/assets/overtrue/material-study.png"
            alt="Carefully arranged studio materials"
          />
          <p className="scene-lead">
            The work isn’t finished when the files are exported. It’s finished
            when the next person can use them with confidence.
          </p>
          <h2 id="context">Start with the context</h2>
          <p>
            A good handover explains what changed, why it changed, and what
            matters next. It connects the final deliverables to the decisions
            that shaped them. Someone who wasn’t in the room should still be
            able to understand the result.
          </p>
          <p>
            Keep the introduction short. Name the intended audience, the agreed
            outcome, and the constraints that are still relevant. Link to the
            brief for anyone who needs the longer story.
          </p>
          <blockquote>
            Leave the work in a state that makes the next step obvious.
          </blockquote>
          <h2 id="files">Make the files easy to use</h2>
          <p>
            Separate source files from ready-to-use exports. Use names that
            describe what a file contains, not how many times it has been
            revised. Include the formats people will actually need.
          </p>
          <ul>
            <li>A short readme with the purpose of each folder.</li>
            <li>Approved assets with clear, descriptive file names.</li>
            <li>
              Any licenses or usage restrictions that travel with the work.
            </li>
            <li>A named contact for questions and future changes.</li>
          </ul>
          <h2 id="decisions">Keep the decisions close</h2>
          <p>
            Record the choices that are expensive to rediscover: why a direction
            was selected, what was deliberately left out, and which assumptions
            still need testing. This is more useful than a transcript of every
            meeting.
          </p>
          <h2 id="next">Agree on what happens next</h2>
          <p>
            Walk through the handover with the people who will use it. Ask them
            to find a file, explain a decision, and describe the next step. Any
            hesitation is a chance to make the handover clearer.
          </p>
          <h3>A simple handover checklist</h3>
          <p>
            Small details make the next person's work easier. Use{" "}
            <strong>clear labels</strong>, a little <em>emphasis</em>, and{" "}
            <mark>one agreed version</mark> of the truth.
          </p>
          <div className="scene-table-wrap">
            <table className="scene-table">
              <thead>
                <tr>
                  <th>Deliverable</th>
                  <th>Format</th>
                  <th>Owner</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Identity assets</td>
                  <td>SVG, PDF</td>
                  <td>June Park</td>
                  <td>Approved</td>
                </tr>
                <tr>
                  <td>Usage guidelines</td>
                  <td>PDF</td>
                  <td>Nora Jensen</td>
                  <td>Approved</td>
                </tr>
                <tr>
                  <td>Source files</td>
                  <td>Design archive</td>
                  <td>Maya Okafor</td>
                  <td>Ready</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3>Make the structure predictable</h3>
          <p>
            A directory should explain itself before anyone opens a file. Keep
            the same pattern across projects:
          </p>
          <pre className="showcase-code">
            <code>
              {
                "handover/\n  README.md\n  source/\n  exports/\n    print/\n    digital/\n  guidelines/"
              }
            </code>
          </pre>
          <p>
            <small>
              <sup>1</sup> All files, people, and project details in this
              article are sample content.
            </small>
          </p>
          <hr />
          <p>
            Written by Nora Jensen, Content strategy at Acme Studio. This guide
            is original sample content for overtrue/ui.
          </p>
        </article>
        <aside>
          <SceneCard title="In this guide">
            <nav className="scene-article-nav">
              <a
                href="#context"
                aria-current={active === "context" ? "location" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("context")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Start with the context
              </a>
              <a
                href="#files"
                aria-current={active === "files" ? "location" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("files")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Make files easy to use
              </a>
              <a
                href="#decisions"
                aria-current={active === "decisions" ? "location" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("decisions")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Keep decisions close
              </a>
              <a
                href="#next"
                aria-current={active === "next" ? "location" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("next")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Agree on the next step
              </a>
            </nav>
          </SceneCard>
          <SceneCard title="A shared way of working">
            <p>
              Small, repeatable practices help a growing studio keep its
              standards.
            </p>
            <Go to="/faq">Browse the handbook</Go>
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}
export function Legal({ id = "license" }: { id?: string }) {
  return (
    <Scene
      id={id}
      title={id === "license" ? "Built to be yours" : "About this demo"}
      description="Clear ownership, open components, and a little context."
    >
      <SceneCard
        title={
          id === "license" ? "Open source, with care" : "Sample workspace terms"
        }
      >
        <div className="scene-article">
          <p>
            overtrue/ui is a collection of interfaces for admin tools, dashboards,
            and team workspaces. The component source is available under the MIT
            license.
          </p>
          <h2>Your code, your application</h2>
          <p>
            You can use, modify, and distribute the components under the terms
            of their licenses. Keep required copyright and license notices with
            redistributed source.
          </p>
          <h2>Third-party software</h2>
          <p>
            The project includes third-party libraries, icon assets, and adapted
            styles. Their authors retain their respective rights. The complete
            notices are provided with the distribution.
          </p>
          <p>
            <a href="/LICENSE.txt">overtrue/ui license</a> ·{" "}
            <a href="/THIRD_PARTY_NOTICES.txt">Third-party notices</a>
          </p>
          <h2>Fictional content</h2>
          <p>
            Acme Studio, its people, clients, projects, financial figures, and
            contact details are fictional examples. Forms demonstrate interface
            behavior; they do not create real accounts, send messages, or
            process payments.
          </p>
        </div>
      </SceneCard>
    </Scene>
  );
}
