import { MemberCard } from "@/registry/overtrue/member-card";
import {
  FeatureCard,
  FeatureCardBackground,
  FeatureCardContent,
} from "@/registry/overtrue/feature-card";
import {
  MediaCard,
  MediaCardImage,
  MediaCardBody,
  MediaCardContent,
} from "@/registry/overtrue/media-card";

import { useState } from "react";
import { team, projects } from "@/data/workspace/studio";
import {
  Scene,
  SceneCard,
  Avatar,
  Invite,
  SearchField,
  Pill,
  Go,
  Feed,
  Progress,
  Action,
} from "./shared";
export function People() {
  const [query, setQuery] = useState("");
  return (
    <Scene
      id="users"
      title="People at Acme Studio"
      description="Eight people, eight perspectives. One shared place for the work."
      actions={<Invite />}
    >
      <div className="scene-toolbar">
        <span>8 members · Working across Europe & Asia</span>
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search people or disciplines…"
        />
      </div>
      {!team.some((person) =>
        (person.name + person.discipline + person.location)
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
      ) && (
        <div className="scene-empty-search">
          <h3>No members found</h3>
          <p>Try a name, discipline, or city.</p>
          <Action onClick={() => setQuery("")}>Clear search</Action>
        </div>
      )}
      <div className="scene-people-grid">
        {team
          .filter((p) =>
            (p.name + p.discipline + p.location)
              .toLowerCase()
              .includes(query.trim().toLowerCase()),
          )
          .map((p) => (
            <MemberCard
              key={p.id}
              member={{
                id: p.id,
                name: p.name,
                image: `/assets/overtrue/people/${p.id}.svg`,
              }}
              description={p.discipline}
              badge={<Pill>{p.role}</Pill>}
              details={[
                { id: "location", label: "Location", value: p.location },
                { id: "contact", label: "Contact", value: p.email },
              ]}
              action={<Go to={"/profile?member=" + p.id}>View profile</Go>}
            />
          ))}
      </div>
    </Scene>
  );
}
export function Profile() {
  const id = new URLSearchParams(location.hash.split("?")[1]).get("member");
  const person = team.find((p) => p.id === id) ?? team[0];
  const [following, setFollowing] = useState(false);
  return (
    <Scene
      id="profile"
      title="Member profile"
      actions={
        <Action onClick={() => setFollowing(!following)}>
          {following ? "Following updates" : "Follow updates"}
        </Action>
      }
    >
      <FeatureCard className="mb-6 min-h-[245px] justify-end text-white">
        <FeatureCardBackground
          src="/assets/overtrue/studio-space.png"
          className="object-[center_40%]"
        />
        <FeatureCardContent className="flex-row items-center gap-5">
          <Avatar name={person.name} size={76} />
          <div>
            <h2 className="m-0 text-2xl font-semibold text-inherit">
              {person.name}
            </h2>
            <p className="mb-0 mt-2 text-xs text-white/85">
              {person.discipline} · {person.location}
            </p>
          </div>
        </FeatureCardContent>
      </FeatureCard>
      <div className="scene-grid-main">
        <div>
          <SceneCard title="About">
            <p>
              I help our team turn complicated questions into clear, useful
              experiences. Currently exploring how physical spaces and digital
              services can work better together.
            </p>
            <div className="scene-profile-facts">
              <span>
                <b>4 years</b>at Acme Studio
              </span>
              <span>
                <b>18 projects</b>delivered together
              </span>
              <span>
                <b>09:00–17:00</b>working hours
              </span>
            </div>
          </SceneCard>
          <SceneCard title="Current work">
            {!projects.some((project) => project.owner === person.name) && (
              <p>
                {person.name.split(" ")[0]} supports the studio across projects.
                No directly owned milestones are due this week.
              </p>
            )}
            {projects
              .filter((p) => p.owner === person.name)
              .map((p) => (
                <div className="scene-resource" key={p.id}>
                  <span>
                    <strong>{p.name}</strong>
                    <Pill>{p.status}</Pill>
                  </span>
                  <Progress value={p.progress} />
                </div>
              ))}
          </SceneCard>
        </div>
        <SceneCard title="Recent contributions">
          <Feed limit={3} />
        </SceneCard>
      </div>
    </Scene>
  );
}
export function Activity() {
  return (
    <Scene
      id="activity"
      title="What’s happening"
      description="Decisions, deliveries, and small steps forward across the studio."
    >
      <div className="scene-grid-main">
        <SceneCard title="Today, September 21">
          <Feed />
        </SceneCard>
        <aside>
          <SceneCard title="This week in numbers">
            <div className="scene-big-number">
              24<span>updates</span>
            </div>
            <p>
              6 deliverables shared, 12 tasks completed, and 2 new client
              conversations.
            </p>
            <Go to="/tasks-list">See completed work</Go>
          </SceneCard>
          <SceneCard title="Keep your focus">
            <p>
              Choose which project updates reach your inbox. Everything else
              stays here for when you need it.
            </p>
            <Go to="/settings">Notification settings</Go>
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}
export function Roles() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <Scene
      id="open-positions"
      title="Make good work with us"
      description="We’re a small independent studio looking for thoughtful people."
      actions={<Go to="/users">Meet the team</Go>}
    >
      <MediaCard layout="split" className="mb-7">
        <MediaCardImage
          src="/assets/overtrue/studio-space.png"
          alt="A sunlit creative studio"
          className="h-full min-h-56"
        />
        <MediaCardBody>
          <MediaCardContent className="justify-center p-8">
            <span className="scene-eyebrow">Life at Acme Studio</span>
            <h2 className="text-2xl font-semibold">
              Room to do your best work.
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              Small teams. Clear ownership. Space to think. We work across
              cities and come together around useful ideas.
            </p>
          </MediaCardContent>
        </MediaCardBody>
      </MediaCard>
      <SceneCard title="Open positions">
        {[
          "Senior product designer",
          "Creative developer",
          "Client partner",
        ].map((role, i) => (
          <article className="scene-role" key={role}>
            <div>
              <h3>{role}</h3>
              <p>
                {["Design", "Engineering", "Client services"][i]} · Remote,
                Europe · Full time
              </p>
            </div>
            <Action
              onClick={() => setSelected(selected === role ? null : role)}
            >
              {selected === role ? "Close details" : "View role"}
            </Action>
            {selected === role && (
              <div className="scene-role-details">
                <p>
                  Own meaningful parts of client projects, share your thinking
                  early, and help improve how we work. We value clear
                  communication, practical judgment, and care for the details.
                </p>
                <p>
                  This is a fictional job listing for the overtrue/ui demo. No
                  applications are collected.
                </p>
              </div>
            )}
          </article>
        ))}
      </SceneCard>
    </Scene>
  );
}
