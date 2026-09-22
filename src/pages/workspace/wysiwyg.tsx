import { WorkspaceEditor } from "@/components/overtrue/workspace/plugins"
// Keep page composition editable; interaction belongs in the shared components.
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import {
  WorkspaceForm,
  WorkspaceInput,
  WorkspaceLink,
} from "@/components/overtrue/workspace/primitives"
export default function Page() {
  return (
    <div data-workspace-page="wysiwyg" className="pn-page-wrapper">
      {" "}
      <div className={"pn-page-header pn-d-print-none"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-g-2 pn-align-items-center"}>
            {" "}
            <div className={"pn-col"}>
              {" "}
              <h1 className={"pn-page-title"}>{"HugeRTE"}</h1>{" "}
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
          <Card className={"pn-card"}>
            {" "}
            <CardContent className={"pn-card-body"}>
              {" "}
              <CardTitle className={"pn-card-title"}>
                {"Rich text editor"}
              </CardTitle>{" "}
              <CardDescription className={"pn-card-subtitle"}>
                {
                  "Write a clear brief, review note, or project update."
                }
              </CardDescription>{" "}
              <div className={"pn-mb-3"}>
                {" "}
                <label className={"pn-form-label"} htmlFor={"wysiwyg-name"}>
                  {" Your name "}
                </label>{" "}
                <WorkspaceInput
                  type={"text"}
                  className={"pn-form-control"}
                  id={"wysiwyg-name"}
                  placeholder={"Name"}
                />{" "}
              </div>{" "}
              <div className={"pn-mb-3"}>
                {" "}
                <label
                  className={"pn-form-label"}
                  htmlFor={"hugerte-description"}
                >
                  {" Description "}
                </label>{" "}
                <WorkspaceForm>
                  {" "}
                  <WorkspaceEditor id={"hugerte-description"} />{" "}
                </WorkspaceForm>{" "}
              </div>{" "}
            </CardContent>{" "}
          </Card>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  )
}
