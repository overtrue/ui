import { NavLink } from "react-router-dom";
import { useState } from "react";
import { GeoMap, type GeoMapPoint } from "@/registry/overtrue/geo-map";
import { DetailList } from "@/registry/overtrue/detail-list";
import { TeamWorkload } from "@/registry/overtrue/team-workload";
import { WorkspaceTileMap } from "../workspace/map";
import { workload } from "@/data/workspace/operations";
import { Scene, SceneCard, Go, Person, Pill, FilterTabs } from "./shared";

const locations = [
  {
    id: "london",
    label: "London",
    lat: 51.507,
    lng: -0.128,
    value: 3,
    description: "Design & research",
    zone: "Europe/London",
    lead: "Maya Okafor",
  },
  {
    id: "berlin",
    label: "Berlin",
    lat: 52.52,
    lng: 13.405,
    value: 2,
    description: "Client operations",
    zone: "Europe/Berlin",
    lead: "Alina Petrova",
  },
  {
    id: "tokyo",
    label: "Tokyo",
    lat: 35.676,
    lng: 139.65,
    value: 1,
    description: "Engineering",
    zone: "Asia/Tokyo",
    lead: "Leo Nakamura",
  },
  {
    id: "lisbon",
    label: "Lisbon",
    lat: 38.722,
    lng: -9.139,
    value: 2,
    description: "Content & brand",
    zone: "Europe/Lisbon",
    lead: "Nora Jensen",
  },
] satisfies (GeoMapPoint & { zone: string; lead: string })[];

export function Locations({ id = "maps" }: { id?: string }) {
  const [selected, setSelected] = useState<string | null>("london");
  const [view, setView] = useState("Team locations");
  const office = locations.find((location) => location.id === selected);
  const network = id === "maps-vector";
  return (
    <Scene
      id={id}
      title={network ? "Regional coverage" : "Team locations"}
      description={
        network
          ? "Where the studio works with clients and delivers projects."
          : "Find your teammates and the local context for planning a meeting."
      }
      actions={<Go to="/fullcalendar">Plan a meeting</Go>}
    >
      <nav className="scene-page-tabs">
        <NavLink end to="/maps">
          Team map
        </NavLink>
        <NavLink end to="/maps-vector">
          Regional coverage
        </NavLink>
        <NavLink end to="/map-fullsize">
          Berlin studio
        </NavLink>
      </nav>
      <div className="scene-product-grid">
        <div className="scene-product-primary">
          <GeoMap
            title={network ? "Studio network" : "Distributed studio"}
            description={
              network
                ? "Project collaboration between our four working locations."
                : "Select a location to see its local time and team lead."
            }
            points={locations}
            arcs={
              network
                ? locations.slice(1).map((location) => ({
                    id: location.id,
                    from: "london",
                    to: location.id,
                  }))
                : undefined
            }
            selectedId={selected}
            onSelectedChange={setSelected}
            valueLabel="Team members"
            summary="8 teammates across 4 locations"
          />
          <SceneCard
            title={network ? "Delivery coverage" : "Location directory"}
            className="scene-table-card"
          >
            <div
              className="scene-table-wrap"
              tabIndex={0}
              role="region"
              aria-label="Scrollable records"
            >
              <table className="scene-table">
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>Focus</th>
                    <th>Members</th>
                    <th>Time zone</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map((location) => (
                    <tr key={location.id}>
                      <td>
                        <button
                          className="scene-text-button"
                          aria-pressed={selected === location.id}
                          onClick={() => setSelected(location.id)}
                        >
                          {location.label}
                        </button>
                      </td>
                      <td>{location.description}</td>
                      <td>{location.value}</td>
                      <td>{location.zone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SceneCard>
        </div>
        <aside className="scene-product-aside">
          <SceneCard title={office?.label ?? "Select a location"}>
            {office ? (
              <>
                <Person name={office.lead} subtitle="Local contact" />
                <DetailList
                  items={[
                    { id: "zone", label: "Time zone", value: office.zone },
                    {
                      id: "time",
                      label: "Local time",
                      value: new Intl.DateTimeFormat("en-GB", {
                        timeZone: office.zone,
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date("2026-09-21T10:00:00Z")),
                    },
                    {
                      id: "team",
                      label: "Team members",
                      value: String(office.value),
                    },
                  ]}
                />
                <p>Times shown for Monday, September 21 at 10:00 UTC.</p>
                {office.id === "berlin" && (
                  <Go to="/map-fullsize">Studio directions</Go>
                )}
              </>
            ) : (
              <p>
                Choose a marker or directory entry to see the location details.
              </p>
            )}
          </SceneCard>
          <SceneCard title="Planning context">
            <FilterTabs
              items={["Team locations", "Capacity"]}
              value={view}
              onChange={setView}
            />
            {view === "Capacity" ? (
              <TeamWorkload members={workload.slice(0, 3)} />
            ) : (
              <p>
                Keep reviews within each contributor’s working hours. Confirm
                the proposed time with the project team before sending an
                invitation.
              </p>
            )}
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}

export function StudioDirections() {
  const [style, setStyle] = useState("Street");
  return (
    <Scene
      id="map-fullsize"
      title="Berlin studio"
      description="Team operations · Meeting and visitor information"
      actions={<Go to="/maps">All locations</Go>}
    >
      <div className="scene-product-grid">
        <SceneCard
          title="Studio location"
          action={
            <FilterTabs
              items={["Street", "Light"]}
              value={style}
              onChange={setStyle}
            />
          }
        >
          <div className="scene-location-map">
            <WorkspaceTileMap
              id={
                style === "Light" ? "map-light-markers" : "map-street-markers"
              }
            />
          </div>
          <p className="scene-subtle">
            Central Berlin · Illustrative meeting point
          </p>
        </SceneCard>
        <aside className="scene-product-aside">
          <SceneCard title="Visitor information">
            <Pill>By appointment</Pill>
            <div className="scene-record-list">
              <div>
                <Person name="Alina Petrova" subtitle="Studio contact" />
              </div>
            </div>
            <DetailList
              items={[
                {
                  id: "hours",
                  label: "Office hours",
                  value: "09:00–18:00 CET/CEST",
                },
                {
                  id: "meeting",
                  label: "Meeting space",
                  value: "6 seats · Video call setup",
                },
                { id: "transit", label: "Nearest area", value: "Berlin Mitte" },
              ]}
            />
            <Go to="/fullcalendar">Schedule a visit</Go>
          </SceneCard>
          <SceneCard title="Before your visit">
            <p>
              Confirm the meeting time and access instructions with your host.
              This map uses a sample location for the workspace demo.
            </p>
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}
