import { useEffect, useRef, useState } from "react";
import { documents } from "@/data/workspace/studio";
import { Link, useSearchParams } from "react-router-dom";
import { IconFileText } from "@tabler/icons-react";
import {
  Scene,
  SceneCard,
  SearchField,
  Go,
  Pill,
  FilterTabs,
  Person,
} from "./shared";
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
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(
    () => new URLSearchParams(location.hash.split("?")[1]).get("query") ?? "",
  );
  const [category, setCategory] = useState("All guides");
  const matchingQuestions = questions.filter((question) =>
    question.join(" ").toLowerCase().includes(query.trim().toLowerCase()),
  );
  const matchingDocuments = documents.filter(
    (document) =>
      (category === "All guides" || document.category === category) &&
      `${document.title} ${document.summary}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <Scene
      id={id}
      title={id === "faq" ? "Workspace help" : "Studio handbook"}
      description="Practical guidance, shared standards, and answers from the team."
    >
      <div className="scene-page-tabs">
        <Link
          to="/search-results"
          aria-current={id !== "faq" ? "page" : undefined}
        >
          Handbook
        </Link>
        <Link to="/faq" aria-current={id === "faq" ? "page" : undefined}>
          Questions & answers
        </Link>
        <Link to="/text-features">Working principles</Link>
      </div>
      <div className="scene-product-grid">
        <div className="scene-product-primary">
          <div className="scene-toolbar">
            <span>
              {id === "faq"
                ? matchingQuestions.length + " answers"
                : matchingDocuments.length + " guides"}
            </span>
            <SearchField
              ref={searchRef}
              value={query}
              onChange={setQuery}
              placeholder="Search the handbook…"
            />
          </div>
          {id === "faq" ? (
            <div className="scene-faq">
              {matchingQuestions.map(([question, answer], index) => (
                <details key={question} open={index === 0 || undefined}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          ) : (
            <SceneCard className="scene-table-card">
              <div className="scene-document-list">
                {matchingDocuments.map((document) => (
                  <Link
                    key={document.title}
                    to={`/prose?guide=${documents.indexOf(document)}`}
                  >
                    <span className="scene-document-icon">
                      <IconFileText size={22} stroke={1.4} />
                    </span>
                    <div>
                      <small>{document.category}</small>
                      <h2>{document.title}</h2>
                      <p>{document.summary}</p>
                      <span>{document.read} · Updated Sep 18</span>
                    </div>
                  </Link>
                ))}
              </div>
            </SceneCard>
          )}
          {!(id === "faq"
            ? matchingQuestions.length
            : matchingDocuments.length) && (
            <div className="scene-empty-search">
              <h3>No results for “{query}”</h3>
              <p>Try a shorter phrase or browse all guides.</p>
              <button
                className="scene-button"
                onClick={() => {
                  setQuery("");
                  setCategory("All guides");
                  searchRef.current?.focus();
                }}
              >
                Clear search
              </button>
            </div>
          )}
        </div>
        <aside className="scene-product-aside">
          {id !== "faq" && (
            <SceneCard title="Collections">
              <FilterTabs
                items={[
                  "All guides",
                  ...new Set(documents.map((document) => document.category)),
                ]}
                value={category}
                onChange={setCategory}
              />
            </SceneCard>
          )}
          <SceneCard title="Handbook owner">
            <Person name="Nora Jensen" subtitle="Content strategy" />
            <p>
              Bring questions and suggested updates to the weekly studio review.
            </p>
            <Go to="/chat">Ask the team</Go>
          </SceneCard>
          <SceneCard title="New to the workspace?">
            <p>
              Start with a project brief, one owner, and a clear next milestone.
            </p>
            <Go to="/onboarding">Workspace setup</Go>
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}
const guideSections = [
  [
    [
      "Start with the context",
      "A good handover explains what changed, why it changed, and what matters next. Connect the final deliverables to the decisions that shaped them. Someone who wasn’t in the room should still be able to understand the result.",
      "Name the audience, the agreed outcome, and the constraints that still matter. Link to the original brief for the longer story.",
    ],
    [
      "Make the files easy to use",
      "Separate source files from ready-to-use exports. Use names that describe what a file contains. Include the formats people will actually need.",
      "Add a short readme, approved artwork, usage permissions, and a named contact for questions. Check that links work for the people receiving them.",
    ],
    [
      "Keep decisions close",
      "Record choices that are expensive to rediscover: why a direction was selected, what was left out, and which assumptions still need testing.",
      "A short decision record is more useful than a transcript of every meeting. Include the decision, its owner, and the evidence behind it.",
    ],
    [
      "Agree on the next step",
      "Walk through the handover with the people who will use it. Ask them to find a file, explain a decision, and describe the next step.",
      "Treat any hesitation as a chance to make the handover clearer. Agree who maintains the work after delivery.",
    ],
  ],
  [
    [
      "Bring one question",
      "A useful review starts with a decision. Tell the team what you need help with before showing the work.",
      "Share the material in advance and identify the audience, constraints, and current uncertainty.",
    ],
    [
      "Show the work in context",
      "Walk through the task your audience needs to complete. Show the current design and the alternatives you considered.",
      "Keep the review focused on the agreed question. Put unrelated ideas in a follow-up list.",
    ],
    [
      "Separate observations from suggestions",
      "First describe what you noticed and why it matters. Then discuss possible changes.",
      "Use the project goals to evaluate feedback. A preference is useful context, but it is not automatically a requirement.",
    ],
    [
      "Leave with an owner",
      "Write down the decision, the next action, and who will take it forward.",
      "At the next review, begin with the changes made since the previous conversation.",
    ],
  ],
  [
    [
      "Start with the task",
      "Decide what the client needs to do: read a status update, review a deliverable, or contribute directly to the project.",
      "Give them the smallest view that supports that task without exposing unrelated work.",
    ],
    [
      "Choose an access level",
      "A review link suits a single decision. A project invitation suits ongoing collaboration. Workspace membership is for the internal team.",
      "Check whether the client needs to comment or edit before sending the invitation.",
    ],
    [
      "Check the shared material",
      "Open the project as a reviewer. Confirm that files load and that internal notes stay private.",
      "Keep approved deliverables together and explain which version is ready for feedback.",
    ],
    [
      "Review access after delivery",
      "Confirm who should retain access when the engagement ends. Remove temporary invitations and record the handover contact.",
      "Review permissions again whenever a project owner or client contact changes.",
    ],
  ],
  [
    [
      "Define the outcome",
      "Write down what the client needs to achieve and what is outside the initial scope.",
      "Separate known work from assumptions. A short discovery phase can turn the biggest unknowns into a reliable plan.",
    ],
    [
      "Break the work into deliverables",
      "Estimate concrete outputs such as a tested prototype, a content model, or an approved artwork package.",
      "Include review time, revisions, and handover work alongside production time.",
    ],
    [
      "Make uncertainty visible",
      "Use a range while the scope is still changing. Explain which assumptions would move the estimate.",
      "Check team availability and external dependencies before committing to a delivery date.",
    ],
    [
      "Agree the review point",
      "Confirm the estimate with the client and choose a point to review actual progress.",
      "Record scope changes with their time and budget impact so everyone sees the same expectation.",
    ],
  ],
];
export function Article({ id = "prose" }: { id?: string }) {
  const [params] = useSearchParams();
  const requested = Number(params.get("guide") ?? 0);
  const guide =
    Number.isInteger(requested) &&
    requested >= 0 &&
    requested < documents.length
      ? requested
      : 0;
  const document = documents[guide];
  const sections = guideSections[guide];
  const [active, setActive] = useState("context");
  const ids = ["context", "files", "decisions", "next"];
  useEffect(() => {
    const update = () => {
      const current = ["context", "files", "decisions", "next"]
        .map((id) => window.document.getElementById(id))
        .filter((node): node is HTMLElement => Boolean(node))
        .filter((node) => node.getBoundingClientRect().top <= 180)
        .at(-1);
      setActive(current?.id ?? "context");
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [guide]);
  return (
    <Scene
      id={id}
      title={document.title}
      description={`${document.category} · ${document.read} · Updated September 2026`}
    >
      <div className="scene-page-tabs">
        <Link to="/search-results">Handbook</Link>
        <span aria-current="page">{document.category}</span>
        <span className="scene-tabs-context">Maintained by Nora Jensen</span>
      </div>
      <div className="scene-article-layout">
        <article className="scene-article scene-handbook-article">
          <div className="scene-document-byline">
            <Person name="Nora Jensen" subtitle="Content strategy" />
            <Pill>Published</Pill>
          </div>
          <p className="scene-lead">{document.summary}</p>
          {sections.map(([title, first, second], index) => (
            <section key={title}>
              <h2 id={ids[index]}>{title}</h2>
              <p>{first}</p>
              <p>{second}</p>
            </section>
          ))}
          {guide === 0 && (
            <>
              <blockquote>
                Leave the work in a state that makes the next step obvious.
              </blockquote>
              <h3>A predictable folder structure</h3>
              <pre className="showcase-code">
                <code>
                  {
                    "handover/\n  README.md\n  source/\n  exports/\n    print/\n    digital/\n  guidelines/"
                  }
                </code>
              </pre>
            </>
          )}
          <hr />
          <p className="scene-article-note">
            Original sample content for the Acme Studio workspace.
          </p>
        </article>
        <aside>
          <SceneCard title="In this guide">
            <nav className="scene-article-nav">
              {sections.map(([title], index) => (
                <a
                  key={ids[index]}
                  href={`#${ids[index]}`}
                  aria-current={active === ids[index] ? "location" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    window.document.getElementById(ids[index])?.scrollIntoView({
                      behavior: matchMedia("(prefers-reduced-motion: reduce)")
                        .matches
                        ? "auto"
                        : "smooth",
                    });
                  }}
                >
                  {title}
                </a>
              ))}
            </nav>
          </SceneCard>
          <SceneCard title="Put it into practice">
            <p>
              Use a shared project to keep the brief, files, and next actions
              together.
            </p>
            <Go to="/datagrid">Open a project</Go>
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}
export function Legal({ id = "license" }: { id?: string }) {
  const license = id === "license";
  const sections = license
    ? [
        {
          id: "use",
          title: "Use and redistribution",
          copy: "The overtrue/ui component source is available under the MIT license. You can use, modify, and distribute it under the terms of that license. Keep the required copyright and license notices with redistributed source.",
        },
        {
          id: "third-party",
          title: "Third-party software",
          copy: "The project includes third-party libraries, icon assets, and adapted styles. Their authors retain their respective rights. The distribution includes the applicable notices.",
        },
        {
          id: "examples",
          title: "Example content",
          copy: "Acme Studio, its people, clients, projects, financial figures, and contact details are fictional examples. They are provided to demonstrate component composition and interface behavior.",
        },
      ]
    : [
        {
          id: "use",
          title: "About this workspace",
          copy: "This is an interactive interface preview. You can explore project records, try forms, and change local demonstration data without creating a real organization or account.",
        },
        {
          id: "data",
          title: "Data and actions",
          copy: "Forms demonstrate interface behavior. They do not create accounts, send messages, process payments, or connect external services. Use fictional details when trying them.",
        },
        {
          id: "storage",
          title: "Local preferences",
          copy: "Theme and consent preferences may be saved in browser storage. Other demonstration records generally last for the current page or workspace session.",
        },
        {
          id: "source",
          title: "Source and licenses",
          copy: "The component source and its third-party dependencies remain subject to their respective licenses. Review the license and attribution files before redistributing source.",
        },
      ];
  return (
    <Scene
      id={id}
      title={license ? "License & attribution" : "Workspace terms"}
      description={
        license
          ? "Source usage, redistribution, and third-party notices."
          : "How this demonstration workspace handles data and actions."
      }
    >
      <nav className="scene-page-tabs">
        <Link to="/license" aria-current={license ? "page" : undefined}>
          License
        </Link>
        <Link
          to="/terms-of-service"
          aria-current={!license ? "page" : undefined}
        >
          Workspace terms
        </Link>
      </nav>
      <div className="scene-article-layout">
        <article className="scene-article scene-handbook-article">
          <p className="scene-lead">
            {license
              ? "Editable source for your own application."
              : "A workspace preview with fictional records."}
          </p>
          {sections.map((section) => (
            <section key={section.id}>
              <h2 id={section.id}>{section.title}</h2>
              <p>{section.copy}</p>
            </section>
          ))}
          <div className="scene-actions">
            <a className="scene-button" href="/LICENSE.txt" download>
              Download license
            </a>
            <a
              className="scene-button"
              href="/THIRD_PARTY_NOTICES.txt"
              download
            >
              Third-party notices
            </a>
          </div>
        </article>
        <aside className="scene-article-nav">
          <strong>On this page</strong>
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(event) => {
                event.preventDefault();
                document
                  .getElementById(section.id)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {section.title}
            </a>
          ))}
          <Go to="/cookie-banner">Privacy preferences</Go>
        </aside>
      </div>
    </Scene>
  );
}
