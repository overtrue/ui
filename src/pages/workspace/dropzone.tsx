import { WorkspaceDropzone } from "@/components/overtrue/workspace/plugins"
// Keep page composition editable; interaction belongs in the shared components.
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { WorkspaceLink } from "@/components/overtrue/workspace/primitives"
export default function Page() {
  return (
    <div data-workspace-page="dropzone" className="pn-page-wrapper">
      {" "}
      <div className={"pn-page-header pn-d-print-none"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-g-2 pn-align-items-center"}>
            {" "}
            <div className={"pn-col"}>
              {" "}
              <h1 className={"pn-page-title"}>{"Dropzone"}</h1>{" "}
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
            <div className={"pn-col-md-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Basic Usage"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {
                      "Bring project files into one shared place."
                    }
                  </CardDescription>{" "}
                  <WorkspaceDropzone
                    className={"pn-dropzone"}
                    id={"dropzone-default"}
                    tabIndex={0}
                    role={"button"}
                    aria-label={"Click or drag files to upload"}
                  >
                    {" "}
                  </WorkspaceDropzone>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Multiple File Upload"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {
                      "Accept and preview several files at once from the same drop target."
                    }
                  </CardDescription>{" "}
                  <WorkspaceDropzone
                    className={"pn-dropzone"}
                    id={"dropzone-multiple"}
                    tabIndex={0}
                    role={"button"}
                    aria-label={"Click or drag files to upload"}
                  >
                    {" "}
                  </WorkspaceDropzone>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Custom Dropzone"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {
                      "Swap in your own label and helper text for the drop target."
                    }
                  </CardDescription>{" "}
                  <WorkspaceDropzone
                    className={"pn-dropzone"}
                    id={"dropzone-custom"}
                    tabIndex={0}
                    role={"button"}
                    aria-label={"Click or drag files to upload"}
                  >
                    {" "}
                    <div className={"pn-dz-message"}>
                      {" "}
                      <h3 className={"pn-dropzone-msg-title"}>
                        {"Your text here"}
                      </h3>{" "}
                      <span className={"pn-dropzone-msg-desc"}>
                        {"Your custom description here"}
                      </span>{" "}
                    </div>{" "}
                  </WorkspaceDropzone>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  )
}
