import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SplitView } from "@/registry/overtrue/split-view";
import { IconArchive, IconHash, IconMail, IconSend } from "@tabler/icons-react";
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
  const searchRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [folder, setFolder] = useState("Inbox");
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [savedReplies, setSavedReplies] = useState<Record<number, boolean>>({});
  const [archived, setArchived] = useState<number[]>([]);
  const [read, setRead] = useState<number[]>([]);
  const visible = threads
    .map((thread, index) => ({ ...thread, index }))
    .filter(
      (t) =>
        (folder === "Archived"
          ? archived.includes(t.index)
          : !archived.includes(t.index)) &&
        (folder !== "Unread" || (t.unread && !read.includes(t.index))) &&
        (t.subject + t.person.name)
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    );
  const active =
    selected !== null && visible.some((t) => t.index === selected)
      ? selected
      : visible[0]?.index;
  const thread = active === undefined ? undefined : threads[active];
  return (
    <Scene
      id="email-inbox"
      title="Inbox"
      description="Client feedback, project updates, and decisions in one place."
    >
      <div className="scene-page-tabs">
        <span aria-current="page">Email</span>
        <Link to="/chat">Team chat</Link>
        <Link to="/emails">Templates</Link>
        <Link to="/signatures">Signature</Link>
        <span className="scene-tabs-context">hello@acme.example</span>
      </div>
      <SplitView
        className="scene-correspondence"
        listLabel="Conversations"
        detailLabel="Selected conversation"
        selected={selected !== null && !!thread}
        onBack={() => setSelected(null)}
        list={
          <>
            <div className="scene-collection-tools">
              <SearchField
                ref={searchRef}
                value={query}
                onChange={(value) => {
                  setQuery(value);
                  setSelected(null);
                }}
                placeholder="Search messages…"
              />
              <FilterTabs
                items={["Inbox", "Unread", "Archived"]}
                value={folder}
                onChange={(value) => {
                  setFolder(value);
                  setSelected(null);
                }}
              />
            </div>
            <div className="scene-thread-list">
              {visible.map((t) => (
                <button
                  key={t.index}
                  aria-pressed={active === t.index}
                  onClick={() => {
                    setSelected(t.index);
                    if (folder !== "Unread")
                      setRead((current) => [...new Set([...current, t.index])]);
                  }}
                >
                  <div className="scene-thread-person">
                    <Avatar name={t.person.name} />
                    <strong>{t.person.name}</strong>
                    <time>{t.time}</time>
                  </div>
                  <h3>{t.subject}</h3>
                  <p>{t.body}</p>
                  <div className="scene-thread-meta">
                    <span>
                      {t.unread && !read.includes(t.index)
                        ? "● Unread"
                        : "Project update"}
                    </span>
                    {drafts[t.index] && <span>Draft</span>}
                  </div>
                </button>
              ))}
              {!visible.length && (
                <div className="scene-empty-search">
                  <IconMail size={28} />
                  <h3>No conversations</h3>
                  <p>
                    {query
                      ? "Try another name or subject."
                      : "You're all caught up in this view."}
                  </p>
                  {query && (
                    <Action
                      onClick={() => {
                        setQuery("");
                        searchRef.current?.focus();
                      }}
                    >
                      Clear search
                    </Action>
                  )}
                </div>
              )}
            </div>
          </>
        }
      >
        {thread && active !== undefined ? (
          <div className="scene-conversation-detail">
            <header className="scene-conversation-toolbar">
              <Person
                name={thread.person.name}
                subtitle={thread.person.email}
              />
              <Action
                onClick={() => {
                  setArchived((current) =>
                    folder === "Archived"
                      ? current.filter((index) => index !== active)
                      : [...current, active],
                  );
                  setSelected(null);
                }}
              >
                <IconArchive size={16} />
                {folder === "Archived" ? "Restore" : "Archive"}
              </Action>
            </header>
            <article className="scene-message">
              <div className="scene-message-context">
                <Pill>Project conversation</Pill>
                <time>{thread.time}</time>
              </div>
              <h2>{thread.subject}</h2>
              <p>Hi Maya,</p>
              <p>{thread.body}</p>
              <p>
                Thanks,
                <br />
                {thread.person.name.split(" ")[0]}
              </p>
            </article>
            <form
              className="scene-reply scene-form"
              onSubmit={(event) => {
                event.preventDefault();
                if (drafts[active]?.trim())
                  setSavedReplies((current) => ({
                    ...current,
                    [active]: true,
                  }));
              }}
            >
              <label htmlFor="inbox-reply">Reply to {thread.person.name}</label>
              <textarea
                id="inbox-reply"
                required
                placeholder="Write a reply…"
                value={drafts[active] ?? ""}
                onChange={(event) => {
                  setDrafts((current) => ({
                    ...current,
                    [active]: event.target.value,
                  }));
                  setSavedReplies((current) => ({
                    ...current,
                    [active]: false,
                  }));
                }}
              />
              <div className="scene-toolbar">
                <Action primary type="submit">
                  Save reply draft
                </Action>
                <small>Drafts are kept while this page is open</small>
              </div>
              {savedReplies[active] && (
                <p role="status">
                  Reply saved in this demo session. No email was sent.
                </p>
              )}
            </form>
          </div>
        ) : (
          <div className="scene-detail-empty">
            <IconMail size={32} stroke={1.3} />
            <h2>No conversation selected</h2>
            <p>Choose a conversation to read and reply.</p>
          </div>
        )}
      </SplitView>
    </Scene>
  );
}
const channels = [
  "Studio general",
  "Culture venue",
  "Member collective",
  "Ceramics studio",
];
export function Chat() {
  const [selected, setSelected] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [messages, setMessages] = useState<Record<number, string[]>>({});
  const active = selected ?? 0;
  const draft = drafts[active] ?? "";
  return (
    <Scene
      id="chat"
      title="Team conversations"
      description="Keep project discussions close to the work."
    >
      <div className="scene-page-tabs">
        <Link to="/email-inbox">Email</Link>
        <span aria-current="page">Team chat</span>
        <Link to="/emails">Templates</Link>
        <span className="scene-tabs-context">8 members · 4 online</span>
      </div>
      <SplitView
        className="scene-correspondence scene-channel-view"
        listLabel="Channels"
        detailLabel="Channel messages"
        selected={selected !== null}
        onBack={() => setSelected(null)}
        list={
          <div className="scene-channel-list">
            <div className="scene-collection-heading">
              Project channels <span>4</span>
            </div>
            {channels.map((name, index) => (
              <button
                key={name}
                aria-pressed={active === index}
                onClick={() => setSelected(index)}
              >
                <IconHash size={18} />
                <span>
                  <strong>{name}</strong>
                  <small>
                    {index === 0
                      ? "Announcements & everyday work"
                      : "Project discussion"}
                  </small>
                </span>
                {drafts[index] && (
                  <span className="scene-draft-dot" aria-label="Has draft" />
                )}
              </button>
            ))}
            <div className="scene-channel-members">
              <h3>Team members</h3>
              {team.slice(0, 4).map((person) => (
                <Person
                  key={person.id}
                  name={person.name}
                  subtitle={person.discipline}
                />
              ))}
            </div>
          </div>
        }
      >
        <section className="scene-conversation-detail">
          <header className="scene-conversation-toolbar">
            <div>
              <h2>{channels[active]}</h2>
              <small>
                {active === 0
                  ? "A shared space for the whole studio"
                  : "Decisions, progress, and quick questions"}
              </small>
            </div>
            <Pill>4 online</Pill>
          </header>
          <div
            className="scene-chat-messages"
            aria-label={`${channels[active]} messages`}
          >
            <div className="scene-chat-date">Monday, September 21</div>
            {updates.slice(active % 2, (active % 2) + 3).map((update) => (
              <article key={update.id}>
                <Avatar name={update.person.name} />
                <div>
                  <strong>{update.person.name}</strong>
                  <small>{update.time}</small>
                  <p>{update.detail}</p>
                </div>
              </article>
            ))}
            {(messages[active] ?? []).map((message, index) => (
              <article key={index}>
                <Avatar name={team[0].name} />
                <div>
                  <strong>{team[0].name}</strong>
                  <small>Just now</small>
                  <p>{message}</p>
                </div>
              </article>
            ))}
          </div>
          <form
            className="scene-message-composer scene-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (!draft.trim()) return;
              setMessages((current) => ({
                ...current,
                [active]: [...(current[active] ?? []), draft.trim()],
              }));
              setDrafts((current) => ({ ...current, [active]: "" }));
            }}
          >
            <label htmlFor="chat-message">
              Message #{channels[active].toLowerCase().replaceAll(" ", "-")}
            </label>
            <textarea
              id="chat-message"
              required
              rows={3}
              value={draft}
              onChange={(event) =>
                setDrafts((current) => ({
                  ...current,
                  [active]: event.target.value,
                }))
              }
              placeholder="Add to the conversation…"
            />
            <div className="scene-toolbar">
              <small>Visible in this demo session</small>
              <Action type="submit" primary>
                <IconSend size={16} />
                Send
              </Action>
            </div>
          </form>
        </section>
      </SplitView>
    </Scene>
  );
}
export function Emails() {
  const templates = [
    {
      id: "review",
      name: "Review request",
      subject: "Visitor concepts are ready for review",
      body: "The latest concepts are ready. Please review the visual direction and leave feedback before September 25.",
    },
    {
      id: "invite",
      name: "Project invitation",
      subject: "You’ve been invited to Visitor experience",
      body: "Maya invited you to join the project. Open the workspace to see the brief, meet the team, and review the next deliverables.",
    },
    {
      id: "digest",
      name: "Weekly digest",
      subject: "This week at Acme Studio",
      body: "Two deliverables are ready for review. The Visitor concepts are awaiting feedback, and the identity handover is prepared for approval.",
    },
  ];
  const [selected, setSelected] = useState("review");
  const [drafts, setDrafts] = useState<
    Record<string, { subject: string; body: string }>
  >({});
  const [recipient, setRecipient] = useState("alex@client.example");
  const template = templates.find((item) => item.id === selected)!;
  const draft = drafts[selected] ?? template;
  const setDraft = (patch: Partial<{ subject: string; body: string }>) =>
    setDrafts((items) => ({
      ...items,
      [selected]: { subject: draft.subject, body: draft.body, ...patch },
    }));
  return (
    <Scene
      id="emails"
      title="Email templates"
      description="Prepare consistent project messages and preview them before handover."
    >
      <nav className="scene-page-tabs">
        <a href="#/emails" aria-current="page">
          Templates
        </a>
        <a href="#/signatures">Team signature</a>
      </nav>
      <div className="scene-email-editor-grid">
        <SceneCard title="Template settings">
          <form className="scene-form" onSubmit={(e) => e.preventDefault()}>
            <label>
              Template
              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                {templates.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Preview recipient
              <input
                type="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </label>
            <label>
              Subject
              <input
                value={draft.subject}
                onChange={(e) => setDraft({ subject: e.target.value })}
              />
            </label>
            <label>
              Message
              <textarea
                rows={6}
                value={draft.body}
                onChange={(e) => setDraft({ body: e.target.value })}
              />
            </label>
            <a
              className="scene-button"
              href={`data:text/plain;charset=utf-8,${encodeURIComponent(`Subject: ${draft.subject}\nTo: ${recipient}\n\n${draft.body}\n\nAcme Studio`)}`}
              download={`${selected}-template.txt`}
            >
              Download template
            </a>
            <small>This preview does not send email.</small>
          </form>
        </SceneCard>
        <SceneCard
          title="Email preview"
          description={`To: ${recipient || "Preview recipient"}`}
        >
          <div className="scene-email-document">
            <span className="scene-wordmark">Acme Studio</span>
            <h2>{draft.subject}</h2>
            <p>{draft.body}</p>
            <div className="scene-email-project">
              <strong>Visitor experience</strong>
              <p>Culture venue · Project workspace</p>
              <a href="#/datagrid" className="scene-button is-primary">
                Open project
              </a>
            </div>
            <footer>
              You’re receiving this sample as a project collaborator.
              <br />
              Acme Studio · Workspace preview
            </footer>
          </div>
        </SceneCard>
      </div>
    </Scene>
  );
}
export function Signatures() {
  const [name, setName] = useState("Maya Okafor"),
    [role, setRole] = useState("Design director"),
    [email, setEmail] = useState("hello@acme.example"),
    [copied, setCopied] = useState(false),
    [copyError, setCopyError] = useState(false);
  return (
    <Scene
      id="signatures"
      title="Team email signature"
      description="Keep contact details consistent across client conversations."
    >
      <nav className="scene-page-tabs">
        <a href="#/emails">Templates</a>
        <a href="#/signatures" aria-current="page">
          Team signature
        </a>
      </nav>
      <div className="scene-email-editor-grid">
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
            <label>
              Email address
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <Action
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(
                    `${name}\n${role} · Acme Studio\n${email}`,
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
                  value={`${name}\n${role} · Acme Studio\n${email}`}
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
                {email}
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
