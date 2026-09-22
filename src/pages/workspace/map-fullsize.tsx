// Keep page composition editable; interaction belongs in the shared components.
import { WorkspaceTileMap } from "@/components/overtrue/workspace/primitives"
export default function Page() {
  return (
    <div data-workspace-page="map-fullsize" className="pn-page-wrapper">
      {" "}
      <div id={"content"} className={"pn-page-body"}>
        {" "}
        <h1 className={"pn-visually-hidden"}>{"Full Size Map"}</h1>{" "}
        <WorkspaceTileMap
          className={"pn-map pn-flex-fill"}
          id={"map-google"}
        />{" "}
      </div>{" "}
    </div>
  )
}
