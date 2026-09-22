// Keep page composition editable; interaction belongs in the shared components.
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import {
  WorkspaceLink,
  WorkspaceTileMap,
} from "@/components/overtrue/workspace/primitives"
export default function Page() {
  return (
    <div data-workspace-page="maps" className="pn-page-wrapper">
      {" "}
      <div className={"pn-page-header pn-d-print-none"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-g-2 pn-align-items-center"}>
            {" "}
            <div className={"pn-col"}>
              {" "}
              <h1 className={"pn-page-title"}>{"Maps"}</h1>{" "}
              <div className={"pn-text-secondary pn-mt-1"}>
                {
                  "Explore the places where our distributed team works. Compare map styles and location markers."
                }
              </div>{" "}
            </div>{" "}
            <div className={"pn-col-auto pn-ms-auto pn-d-print-none"}>
              {" "}
              <WorkspaceLink
                href={"/docs"}
                target={"_blank"}
                rel={"noopener"}
                className={"pn-link-secondary"}
              >
                {" Docs "}{" "}
                <svg
                  xmlns={"http://www.w3.org/2000/svg"}
                  width={"24"}
                  height={"24"}
                  viewBox={"0 0 24 24"}
                  fill={"none"}
                  stroke={"currentColor"}
                  strokeWidth={"2"}
                  strokeLinecap={"round"}
                  strokeLinejoin={"round"}
                  aria-hidden={"true"}
                  focusable={"false"}
                  className={"pn-icon pn-icon-sm"}
                >
                  {" "}
                  <path
                    d={
                      "M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"
                    }
                  ></path>{" "}
                  <path d={"M11 13l9 -9"}></path>{" "}
                  <path d={"M15 4h5v5"}></path>{" "}
                </svg>{" "}
              </WorkspaceLink>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <div id={"content"} className={"pn-page-body"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-row-cards"}>
            {" "}
            <div className={"pn-col-lg-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Simple map"}
                  </CardTitle>{" "}
                  <div className={"pn-ratio pn-ratio-16x9"}>
                    {" "}
                    <div>
                      {" "}
                      <WorkspaceTileMap
                        id={"map-simple"}
                        className={"pn-w-100 pn-h-100"}
                        role={"img"}
                        aria-label={"Simple map"}
                      />{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Light map style"}
                  </CardTitle>{" "}
                  <div className={"pn-ratio pn-ratio-16x9"}>
                    {" "}
                    <div>
                      {" "}
                      <WorkspaceTileMap
                        id={"map-light"}
                        className={"pn-w-100 pn-h-100"}
                        role={"img"}
                        aria-label={"Light map style"}
                      />{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-12"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <div className={"pn-ratio pn-ratio-21x9"}>
                  {" "}
                  <div>
                    {" "}
                    <WorkspaceTileMap
                      id={"map-markers"}
                      className={"pn-w-100 pn-h-100 pn-rounded"}
                      role={"img"}
                      aria-label={"Light map style"}
                    />{" "}
                  </div>{" "}
                </div>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-lg-12"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <div className={"pn-ratio pn-ratio-21x9"}>
                  {" "}
                  <div>
                    {" "}
                    <WorkspaceTileMap
                      id={"map-card"}
                      className={"pn-w-100 pn-h-100 pn-rounded"}
                      role={"img"}
                      aria-label={"Full-card map"}
                    />{" "}
                  </div>{" "}
                </div>{" "}
              </Card>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  )
}
