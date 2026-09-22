import { team, projects, tasks } from "@/data/workspace/studio";
import {
  Scene,
  SceneCard,
  Person,
  Pill,
  Progress,
} from "@/components/overtrue/scenes/shared";
export default function Page() {
  return (
    <Scene
      id="tables"
      title="Records with room to breathe"
      description="Three useful table patterns: a project register, a people directory, and a compact work queue."
    >
      <SceneCard title="Project progress">
        <div className="scene-table-wrap">
          <table className="scene-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Client</th>
                <th>Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.name}</strong>
                    <small>{p.id}</small>
                  </td>
                  <td>{p.client}</td>
                  <td>
                    <div className="scene-progress-cell">
                      <Progress value={p.progress} />
                      <span>{p.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <Pill>{p.status}</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SceneCard>
      <div className="scene-grid-two">
        <SceneCard title="People & permissions">
          <div className="scene-table-wrap">
            <table className="scene-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {team.slice(0, 5).map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Person name={p.name} subtitle={p.discipline} />
                    </td>
                    <td>
                      <Pill>{p.role}</Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SceneCard>
        <SceneCard title="The next few steps">
          <div className="scene-table-wrap">
            <table className="scene-table">
              <thead>
                <tr>
                  <th>Work item</th>
                  <th>Due</th>
                </tr>
              </thead>
              <tbody>
                {tasks.slice(0, 5).map((t) => (
                  <tr key={t.id}>
                    <td>
                      <strong>{t.title}</strong>
                      <small>
                        {t.id} · {t.project}
                      </small>
                    </td>
                    <td>{t.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SceneCard>
      </div>
    </Scene>
  );
}
