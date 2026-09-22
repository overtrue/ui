// Keep page composition editable; interaction belongs in the shared components.
import {
  WorkspaceAction,
  WorkspaceLink,
  WorkspaceOffcanvas,
} from "@/components/overtrue/workspace/primitives";
export default function Page() {
  return (
    <div data-workspace-page="cookie-banner" className="pn-page-wrapper">
      {" "}
      <div className={"pn-page-header pn-d-print-none"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-g-2 pn-align-items-center"}>
            {" "}
            <div className={"pn-col"}>
              {" "}
              <h1 className={"pn-page-title"}>{"Cookie banner"}</h1>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <div id={"content"} className={"pn-page-body"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className="pn-card">
            <div className="pn-card-body">
              <h2 className="pn-card-title">Privacy preferences</h2>
              <p className="pn-text-secondary">
                Choose which cookies this demo may use. You can reopen the panel
                to review the available options.
              </p>
              <WorkspaceAction
                className="pn-btn"
                action="open"
                target="#offcanvasBottom"
              >
                Review preferences
              </WorkspaceAction>
            </div>
          </div>
          <WorkspaceOffcanvas
            className={
              "pn-offcanvas pn-offcanvas-bottom pn-show pn-h-auto workspace-cookie-banner"
            }
            role={"dialog"}
            id={"offcanvasBottom"}
            aria-modal={"true"}
          >
            {" "}
            <div className={"pn-offcanvas-body"}>
              {" "}
              <div className={"pn-container"}>
                {" "}
                <div className={"pn-row pn-align-items-center"}>
                  {" "}
                  <div className={"pn-col"}>
                    {" "}
                    <strong>{"Your privacy preferences"}</strong>
                    {
                      " Essential cookies keep the workspace running. Optional cookies help us understand how it is used. "
                    }
                    <WorkspaceLink
                      href={"/#/terms-of-service"}
                      target={"_blank"}
                    >
                      {"Learn more"}
                    </WorkspaceLink>{" "}
                  </div>{" "}
                  <div className={"pn-col-auto"}>
                    {" "}
                    <WorkspaceAction
                      type={"button"}
                      className={"pn-btn"}
                      action={"dismiss"}
                    >
                      {"Essential Cookies Only"}
                    </WorkspaceAction>{" "}
                  </div>{" "}
                  <div className={"pn-col-auto"}>
                    {" "}
                    <WorkspaceAction
                      type={"button"}
                      className={"pn-btn pn-btn-primary"}
                      action={"dismiss"}
                    >
                      {"Allow All Cookies"}
                    </WorkspaceAction>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </WorkspaceOffcanvas>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
