import { useState } from "react";
import { team, updates } from "@/data/workspace/studio";
import {
  Scene,
  SceneCard,
  Person,
  Avatar,
  SearchField,
  Action,
  Pill,
  FilterTabs,
} from "./shared";
const threads = [
  {
    person: team[2],
    subject: "Visitor experience review: the arrival experience",
    body: "The interview notes point to one clear opportunity: make the first five minutes feel effortless. I have added the arrival journey and three wayfinding directions to the project. Can you review the proposed sequence before Wednesday?",
    time: "10:42",
    unread: true,
  },
  {
    person: team[1],
    subject: "Member portal staging is ready",
    body: "The permissions update is now available in staging. Editors can manage their own collections, and reviewers have a focused read-only view. I have included a short walkthrough in the handover notes.",
    time: "09:18",
    unread: true,
  },
  {
    person: team[4],
    subject: "Identity files for Ceramics studio",
    body: "The final exports are ready. The package includes print artwork, digital assets, and a one-page guide to the new identity. Please check the project folder before we share it with the client.",
    time: "Yesterday",
    unread: false,
  },
  {
    person: team[5],
    subject: "Our October planning session",
    body: "Let’s use the first half hour to look at capacity, then agree on the two studio improvements we want to make next. Add any decisions you need help with to the agenda.",
    time: "Yesterday",
    unread: false,
  },
];
export function Inbox() {
  const [selected, setSelected] = useState(0),
    [query, setQuery] = useState(""),
    [drafts, setDrafts] = useState<Record<number, string>>({}),
    [savedReplies, setSavedReplies] = useState<Record<number, boolean>>({}),
    [archived, setArchived] = useState<number[]>([]);
  const visible = threads
    .map((thread, index) => ({ ...thread, index }))
    .filter(
      (t) =>
        !archived.includes(t.index) &&
        (t.subject + t.person.name)
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    );
  const active = visible.some((t) => t.index === selected)
    ? selected
    : (visible[0]?.index ?? -1);
  const thread = threads[active];
  const reply = drafts[active] ?? "";
  const sent = savedReplies[active] ?? false;
  const setReply = (value: string) =>
    setDrafts((current) => ({ ...current, [active]: value }));
  const setSent = (value: boolean) =>
    setSavedReplies((current) => ({ ...current, [active]: value }));
  return (
    <Scene
      id="email-inbox"
      title="Studio inbox"
      description="Conversations that keep the work moving."
    >
      <div className="scene-inbox">
        <aside>
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search messages…"
          />
          <div className="scene-toolbar">
            <strong>Inbox</strong>
            <small>{visible.length} conversations</small>
          </div>
          {visible.map((t) => {
            const i = t.index;
            return (
              <button
                className={active === i ? "is-selected" : ""}
                key={t.subject}
                onClick={() => {
                  setSelected(i);
                }}
              >
                <div>
                  <strong>{t.person.name}</strong>
                  <small>{t.time}</small>
                </div>
                <h3>{t.subject}</h3>
                <p>{t.body.slice(0, 90)}…</p>
                {t.unread && <span className="scene-unread" />}
              </button>
            );
          })}
          {!visible.length && query && (
            <p className="scene-empty">No conversations match your search.</p>
          )}
          {archived.length === threads.length && (
            <p className="scene-empty">All caught up.</p>
          )}
        </aside>
        <section>
          {thread ? (
            <>
              <header>
                <Person
                  name={thread.person.name}
                  subtitle={thread.person.email}
                />
                <Action
                  onClick={() => {
                    const next = [...archived, active];
                    setArchived(next);
                    const nextIndex = threads.findIndex(
                      (_, i) => !next.includes(i),
                    );
                    if (nextIndex >= 0) setSelected(nextIndex);
                  }}
                  disabled={archived.includes(active)}
                >
                  Archive
                </Action>
              </header>
              <div className="scene-message">
                <Pill>Project conversation</Pill>
                <h2>{thread.subject}</h2>
                <p>Hi Maya,</p>
                <p>{thread.body}</p>
                <p>
                  Thanks,
                  <br />
                  {thread.person.name.split(" ")[0]}
                </p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="scene-reply"
              >
                <label htmlFor="inbox-reply">
                  Reply to {thread.person.name}
                </label>
                <textarea
                  id="inbox-reply"
                  required
                  placeholder="Write a thoughtful reply…"
                  value={reply}
                  onChange={(e) => {
                    setReply(e.target.value);
                    setSent(false);
                  }}
                />
                <Action primary type="submit">
                  Save reply draft
                </Action>
                {sent && (
                  <p role="status">
                    Reply saved in this demo session. No email was sent.
                  </p>
                )}
              </form>
            </>
          ) : (
            <div className="scene-empty">
              <img src="/assets/overtrue/illustration-files.svg" alt="" />
              <h2>{query ? "No matching conversation" : "All caught up"}</h2>
              <p>
                {query
                  ? "Try a different name or subject."
                  : "Your archived conversations are still available in this demo session."}
              </p>
              <Action
                onClick={() => {
                  setQuery("");
                  setArchived([]);
                  setSelected(0);
                }}
              >
                {query ? "Clear search" : "Restore conversations"}
              </Action>
            </div>
          )}
        </section>
      </div>
    </Scene>
  );
}
export function Chat() {
  const [active, setActive] = useState(0),
    [drafts, setDrafts] = useState<Record<number, string>>({}),
    [messages, setMessages] = useState<Record<number, string[]>>({});
  const draft = drafts[active] ?? "";
  const setDraft = (value: string) =>
    setDrafts((current) => ({ ...current, [active]: value }));
  return (
    <Scene
      id="chat"
      title="Team conversations"
      description="Small questions, quick decisions, and the occasional good idea."
    >
      <div className="scene-chat">
        <aside>
          <span className="scene-eyebrow">PROJECT CHANNELS</span>
          {[
            "Studio general",
            "Culture venue",
            "Member collective",
            "Ceramics studio",
          ].map((name, i) => (
            <button
              key={name}
              className={active === i ? "is-selected" : ""}
              onClick={() => setActive(i)}
            >
              # {name}
              <small>{i === 0 ? "8 members" : "Project team"}</small>
            </button>
          ))}
        </aside>
        <section>
          <header>
            <h2>
              {
                [
                  "Studio general",
                  "Culture venue",
                  "Member collective",
                  "Ceramics studio",
                ][active]
              }
            </h2>
            <Pill>4 online</Pill>
          </header>
          <div className="scene-chat-messages">
            <div className="scene-chat-date">Today · September 21</div>
            {updates.slice(active % 2, (active % 2) + 3).map((u) => (
              <article key={u.id}>
                <Avatar name={u.person.name} />
                <div>
                  <strong>{u.person.name}</strong>
                  <small>{u.time}</small>
                  <p>{u.detail}</p>
                </div>
              </article>
            ))}
            {(messages[active] ?? []).map((m, i) => (
              <article key={i}>
                <Avatar name={team[0].name} />
                <div>
                  <strong>{team[0].name}</strong>
                  <small>Just now</small>
                  <p>{m}</p>
                </div>
              </article>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!draft.trim()) return;
              setMessages({
                ...messages,
                [active]: [...(messages[active] ?? []), draft.trim()],
              });
              setDraft("");
            }}
          >
            <label className="pn-visually-hidden" htmlFor="chat-message">
              Message
            </label>
            <input
              id="chat-message"
              required
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add to the conversation…"
            />
            <Action type="submit" primary>
              Send
            </Action>
          </form>
        </section>
      </div>
    </Scene>
  );
}
export function Emails() {
  const [tab, setTab] = useState("Weekly digest");
  return (
    <Scene
      id="emails"
      title="Emails worth opening"
      description="Useful updates with clear context and one next step."
    >
      <FilterTabs
        items={["Weekly digest", "Project invitation", "Review request"]}
        value={tab}
        onChange={setTab}
      />
      <div className="scene-email-preview">
        <small>ACME STUDIO / {tab.toUpperCase()}</small>
        <h2>
          {tab === "Weekly digest"
            ? "A good week of moving forward."
            : tab === "Project invitation"
              ? "You’re invited to the project."
              : "A fresh perspective would help."}
        </h2>
        <p>
          {tab === "Weekly digest"
            ? "Here’s what your team shared this week, and what needs a little attention next."
            : tab === "Project invitation"
              ? "Maya invited you to collaborate on the Visitor experience."
              : "The latest Visitor concepts are ready for a closer look. Your feedback will help us choose a direction."}
        </p>
        <img
          src="/assets/overtrue/coastal-center.png"
          alt="Visitor center project architecture"
        />
        <h3>Visitor experience</h3>
        <p>
          Three concepts. One welcoming first impression. The team is ready to
          share the thinking behind the work.
        </p>
        <a href="#/tasks" className="scene-button is-primary">
          Open the project
        </a>
        <hr />
        <small>
          You’re receiving this sample because you’re part of Acme Studio.
          <br />
          overtrue/ui email template · Preview only
        </small>
      </div>
    </Scene>
  );
}
export function Signatures() {
  const [name, setName] = useState("Maya Okafor"),
    [role, setRole] = useState("Design director"),
    [copied, setCopied] = useState(false),
    [copyError, setCopyError] = useState(false);
  return (
    <Scene
      id="signatures"
      title="A considered sign-off"
      description="Create a clear, consistent email signature for your team."
    >
      <div className="scene-grid-two">
        <SceneCard title="Signature details">
          <form
            className="scene-form"
            onSubmit={(e) => e.preventDefault()}
            onChange={() => {
              setCopied(false);
              setCopyError(false);
            }}
          >
            <label>
              Full name
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
              Role
              <input value={role} onChange={(e) => setRole(e.target.value)} />
            </label>
            <Action
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(
                    `${name}\n${role} · Acme Studio\nhello@acme.example`,
                  );
                  setCopied(true);
                  setCopyError(false);
                } catch {
                  setCopied(false);
                  setCopyError(true);
                }
              }}
            >
              Copy signature
            </Action>
            {copied && <p role="status">Signature copied.</p>}
            {copyError && (
              <label>
                Copy manually
                <textarea
                  readOnly
                  value={`${name}\n${role} · Acme Studio\nhello@acme.example`}
                  onFocus={(e) => e.target.select()}
                />
                <small role="status">
                  Clipboard access is unavailable. Select and copy the signature
                  above.
                </small>
              </label>
            )}
          </form>
        </SceneCard>
        <SceneCard title="Live preview">
          <div className="scene-signature">
            <Avatar name="Maya Okafor" size={64} />
            <div>
              <h2>{name}</h2>
              <p>{role} · Acme Studio</p>
              <small>
                hello@acme.example
                <br />
                Independent thinking. Useful work.
              </small>
            </div>
          </div>
        </SceneCard>
      </div>
    </Scene>
  );
}
