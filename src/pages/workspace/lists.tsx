import { team, documents } from "@/data/workspace/studio";
import {
  Scene,
  SceneCard,
  Person,
  Feed,
  Go,
  Pill,
} from "@/components/overtrue/scenes/shared";
export default function Page() {
  return (
    <Scene
      id="lists"
      title="The small details, in order"
      description="People, updates, and useful reading — different lists for different jobs."
    >
      <div className="scene-grid-two">
        <SceneCard title="Your project team">
          {team.slice(0, 5).map((p) => (
            <div className="scene-list-row" key={p.id}>
              <Person name={p.name} subtitle={p.discipline} />
              <Pill>{p.role}</Pill>
            </div>
          ))}
        </SceneCard>
        <SceneCard title="Recent updates">
          <Feed limit={4} />
        </SceneCard>
      </div>
      <SceneCard title="From the handbook">
        {documents.map((d) => (
          <div className="scene-list-row" key={d.title}>
            <div>
              <h3>{d.title}</h3>
              <p>{d.summary}</p>
              <small>
                {d.category} · {d.read}
              </small>
            </div>
            <Go to="/prose">Read guide</Go>
          </div>
        ))}
      </SceneCard>
    </Scene>
  );
}
