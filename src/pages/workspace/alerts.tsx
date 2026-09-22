// Keep page composition editable; interaction belongs in the shared components.
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import {
  WorkspaceAction,
  WorkspaceAlert,
  WorkspaceLink,
} from "@/components/overtrue/workspace/primitives"
export default function Page() {
  return (
    <div data-workspace-page="alerts" className="pn-page-wrapper">
      {" "}
      <div className={"pn-page-header pn-d-print-none"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-g-2 pn-align-items-center"}>
            {" "}
            <div className={"pn-col"}>
              {" "}
              <h1 className={"pn-page-title"}>{"Alerts"}</h1>{" "}
              <div className={"pn-text-secondary pn-mt-1"}>
                {
                  "Clear feedback for everyday workspace actions."
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
            <div className={"pn-col-12"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Basic"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {
                      "A title and a color are enough to show the status of an action."
                    }
                  </CardDescription>{" "}
                  <WorkspaceAlert
                    className={"pn-alert pn-alert-danger"}
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
                      {" "}
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        {" "}
                        <path
                          d={"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"}
                        ></path>{" "}
                        <path d={"M12 8v4"}></path>{" "}
                        <path d={"M12 16h.01"}></path>{" "}
                      </svg>{" "}
                    </div>
                    {" An error occurred! "}
                  </WorkspaceAlert>{" "}
                  <WorkspaceAlert
                    className={"pn-alert pn-alert-warning"}
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
                      {" "}
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        {" "}
                        <path d={"M12 9v4"}></path>{" "}
                        <path
                          d={
                            "M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0"
                          }
                        ></path>{" "}
                        <path d={"M12 16h.01"}></path>{" "}
                      </svg>{" "}
                    </div>
                    {" Some information is missing! "}
                  </WorkspaceAlert>{" "}
                  <WorkspaceAlert
                    className={"pn-alert pn-alert-success"}
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
                      {" "}
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        <path d={"M5 12l5 5l10 -10"}></path>
                      </svg>{" "}
                    </div>
                    {" Completed successfully! "}
                  </WorkspaceAlert>{" "}
                  <WorkspaceAlert
                    className={"pn-alert pn-alert-info"}
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
                      {" "}
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        {" "}
                        <path
                          d={"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"}
                        ></path>{" "}
                        <path d={"M12 9h.01"}></path>{" "}
                        <path d={"M11 12h1v4h1"}></path>{" "}
                      </svg>{" "}
                    </div>
                    {" Just a quick note! "}
                  </WorkspaceAlert>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-12"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"With action"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Add an "}
                    <code>{"alert-action"}</code>
                    {" link to give users something to do next."}
                  </CardDescription>{" "}
                  <WorkspaceAlert
                    className={"pn-alert pn-alert-danger pn-alert-dismissible"}
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
                      {" "}
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        {" "}
                        <path
                          d={"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"}
                        ></path>{" "}
                        <path d={"M12 8v4"}></path>{" "}
                        <path d={"M12 16h.01"}></path>{" "}
                      </svg>{" "}
                    </div>
                    {" An error occurred! "}
                    <WorkspaceLink href={"#"} className={"pn-alert-action"}>
                      {" Link "}
                    </WorkspaceLink>{" "}
                    <WorkspaceAction
                      className={"pn-btn-close"}
                      aria-label={"close"}
                      action={"dismiss"}
                    ></WorkspaceAction>{" "}
                  </WorkspaceAlert>{" "}
                  <WorkspaceAlert
                    className={"pn-alert pn-alert-warning pn-alert-dismissible"}
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
                      {" "}
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        {" "}
                        <path d={"M12 9v4"}></path>{" "}
                        <path
                          d={
                            "M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0"
                          }
                        ></path>{" "}
                        <path d={"M12 16h.01"}></path>{" "}
                      </svg>{" "}
                    </div>
                    {" Some information is missing! "}
                    <WorkspaceLink href={"#"} className={"pn-alert-action"}>
                      {" Link "}
                    </WorkspaceLink>{" "}
                    <WorkspaceAction
                      className={"pn-btn-close"}
                      aria-label={"close"}
                      action={"dismiss"}
                    ></WorkspaceAction>{" "}
                  </WorkspaceAlert>{" "}
                  <WorkspaceAlert
                    className={"pn-alert pn-alert-success pn-alert-dismissible"}
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
                      {" "}
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        <path d={"M5 12l5 5l10 -10"}></path>
                      </svg>{" "}
                    </div>
                    {" Completed successfully! "}
                    <WorkspaceLink href={"#"} className={"pn-alert-action"}>
                      {" Link "}
                    </WorkspaceLink>{" "}
                    <WorkspaceAction
                      className={"pn-btn-close"}
                      aria-label={"close"}
                      action={"dismiss"}
                    ></WorkspaceAction>{" "}
                  </WorkspaceAlert>{" "}
                  <WorkspaceAlert
                    className={"pn-alert pn-alert-info pn-alert-dismissible"}
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
                      {" "}
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        {" "}
                        <path
                          d={"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"}
                        ></path>{" "}
                        <path d={"M12 9h.01"}></path>{" "}
                        <path d={"M11 12h1v4h1"}></path>{" "}
                      </svg>{" "}
                    </div>
                    {" Just a quick note! "}
                    <WorkspaceLink href={"#"} className={"pn-alert-action"}>
                      {" Link "}
                    </WorkspaceLink>{" "}
                    <WorkspaceAction
                      className={"pn-btn-close"}
                      aria-label={"close"}
                      action={"dismiss"}
                    ></WorkspaceAction>{" "}
                  </WorkspaceAlert>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-12"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Dismissible"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Add "}
                    <code>{"alert-dismissible"}</code>
                    {" and a "}
                    <code>{"btn-close"}</code>
                    {" button to let users close the alert."}
                  </CardDescription>{" "}
                  <WorkspaceAlert
                    className={"pn-alert pn-alert-danger pn-alert-dismissible"}
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
                      {" "}
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        {" "}
                        <path
                          d={"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"}
                        ></path>{" "}
                        <path d={"M12 8v4"}></path>{" "}
                        <path d={"M12 16h.01"}></path>{" "}
                      </svg>{" "}
                    </div>
                    {" An error occurred! "}
                    <WorkspaceAction
                      className={"pn-btn-close"}
                      aria-label={"close"}
                      action={"dismiss"}
                    ></WorkspaceAction>{" "}
                  </WorkspaceAlert>{" "}
                  <WorkspaceAlert
                    className={"pn-alert pn-alert-warning pn-alert-dismissible"}
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
                      {" "}
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        {" "}
                        <path d={"M12 9v4"}></path>{" "}
                        <path
                          d={
                            "M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0"
                          }
                        ></path>{" "}
                        <path d={"M12 16h.01"}></path>{" "}
                      </svg>{" "}
                    </div>
                    {" Some information is missing! "}
                    <WorkspaceAction
                      className={"pn-btn-close"}
                      aria-label={"close"}
                      action={"dismiss"}
                    ></WorkspaceAction>{" "}
                  </WorkspaceAlert>{" "}
                  <WorkspaceAlert
                    className={"pn-alert pn-alert-success pn-alert-dismissible"}
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
                      {" "}
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        <path d={"M5 12l5 5l10 -10"}></path>
                      </svg>{" "}
                    </div>
                    {" Completed successfully! "}
                    <WorkspaceAction
                      className={"pn-btn-close"}
                      aria-label={"close"}
                      action={"dismiss"}
                    ></WorkspaceAction>{" "}
                  </WorkspaceAlert>{" "}
                  <WorkspaceAlert
                    className={"pn-alert pn-alert-info pn-alert-dismissible"}
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
                      {" "}
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        {" "}
                        <path
                          d={"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"}
                        ></path>{" "}
                        <path d={"M12 9h.01"}></path>{" "}
                        <path d={"M11 12h1v4h1"}></path>{" "}
                      </svg>{" "}
                    </div>
                    {" Just a quick note! "}
                    <WorkspaceAction
                      className={"pn-btn-close"}
                      aria-label={"close"}
                      action={"dismiss"}
                    ></WorkspaceAction>{" "}
                  </WorkspaceAlert>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-12"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"With a description"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Add an "}
                    <code>{"alert-description"}</code>
                    {" or an "}
                    <code>{"alert-list"}</code>
                    {" when the title alone isn't enough context."}
                  </CardDescription>{" "}
                  <WorkspaceAlert
                    className={"pn-alert pn-alert-danger pn-alert-dismissible"}
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
                      {" "}
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        {" "}
                        <path
                          d={"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"}
                        ></path>{" "}
                        <path d={"M12 8v4"}></path>{" "}
                        <path d={"M12 16h.01"}></path>{" "}
                      </svg>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h4 className={"pn-alert-heading"}>
                        {"Password does not meet requirements:"}
                      </h4>{" "}
                      <div className={"pn-alert-description"}>
                        {" "}
                        <ul className={"pn-alert-list"}>
                          {" "}
                          <li>{"Minimum 8 characters"}</li>{" "}
                          <li>{"Include a special character"}</li>{" "}
                        </ul>{" "}
                      </div>{" "}
                    </div>{" "}
                    <WorkspaceAction
                      className={"pn-btn-close"}
                      aria-label={"close"}
                      action={"dismiss"}
                    ></WorkspaceAction>{" "}
                  </WorkspaceAlert>{" "}
                  <WorkspaceAlert
                    className={"pn-alert pn-alert-warning pn-alert-dismissible"}
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
                      {" "}
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        {" "}
                        <path d={"M12 9v4"}></path>{" "}
                        <path
                          d={
                            "M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0"
                          }
                        ></path>{" "}
                        <path d={"M12 16h.01"}></path>{" "}
                      </svg>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h4 className={"pn-alert-heading"}>
                        {"Some information is missing!"}
                      </h4>{" "}
                      <div className={"pn-alert-description"}>
                        {"The client review is scheduled. Add your notes before Wednesday at 10:30."}
                      </div>{" "}
                    </div>{" "}
                    <WorkspaceAction
                      className={"pn-btn-close"}
                      aria-label={"close"}
                      action={"dismiss"}
                    ></WorkspaceAction>{" "}
                  </WorkspaceAlert>{" "}
                  <WorkspaceAlert
                    className={"pn-alert pn-alert-success pn-alert-dismissible"}
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
                      {" "}
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        <path d={"M5 12l5 5l10 -10"}></path>
                      </svg>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h4 className={"pn-alert-heading"}>
                        {"Completed successfully!"}
                      </h4>{" "}
                      <div className={"pn-alert-description"}>
                        {"The client review is scheduled. Add your notes before Wednesday at 10:30."}
                      </div>{" "}
                    </div>{" "}
                    <WorkspaceAction
                      className={"pn-btn-close"}
                      aria-label={"close"}
                      action={"dismiss"}
                    ></WorkspaceAction>{" "}
                  </WorkspaceAlert>{" "}
                  <WorkspaceAlert
                    className={"pn-alert pn-alert-info pn-alert-dismissible"}
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
                      {" "}
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        {" "}
                        <path
                          d={"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"}
                        ></path>{" "}
                        <path d={"M12 9h.01"}></path>{" "}
                        <path d={"M11 12h1v4h1"}></path>{" "}
                      </svg>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h4 className={"pn-alert-heading"}>
                        {"Just a quick note!"}
                      </h4>{" "}
                      <div className={"pn-alert-description"}>
                        {"The client review is scheduled. Add your notes before Wednesday at 10:30."}
                      </div>{" "}
                    </div>{" "}
                    <WorkspaceAction
                      className={"pn-btn-close"}
                      aria-label={"close"}
                      action={"dismiss"}
                    ></WorkspaceAction>{" "}
                  </WorkspaceAlert>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-12"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Important"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Add "}
                    <code>{"alert-important"}</code>
                    {
                      " for a bolder style that stands out from the rest of the page."
                    }
                  </CardDescription>{" "}
                  <WorkspaceAlert
                    className={
                      "pn-alert pn-alert-important pn-alert-danger pn-alert-dismissible"
                    }
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
                      {" "}
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        {" "}
                        <path
                          d={"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"}
                        ></path>{" "}
                        <path d={"M12 8v4"}></path>{" "}
                        <path d={"M12 16h.01"}></path>{" "}
                      </svg>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h4 className={"pn-alert-heading"}>
                        {"Password does not meet requirements:"}
                      </h4>{" "}
                      <div className={"pn-alert-description"}>
                        {" "}
                        <ul className={"pn-alert-list"}>
                          {" "}
                          <li>{"Minimum 8 characters"}</li>{" "}
                          <li>{"Include a special character"}</li>{" "}
                        </ul>{" "}
                      </div>{" "}
                    </div>{" "}
                    <WorkspaceAction
                      className={"pn-btn-close"}
                      aria-label={"close"}
                      action={"dismiss"}
                    ></WorkspaceAction>{" "}
                  </WorkspaceAlert>{" "}
                  <WorkspaceAlert
                    className={
                      "pn-alert pn-alert-important pn-alert-success pn-alert-dismissible"
                    }
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
                      {" "}
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        <path d={"M5 12l5 5l10 -10"}></path>
                      </svg>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h4 className={"pn-alert-heading"}>
                        {"This is a custom alert box!"}
                      </h4>{" "}
                      <div className={"pn-alert-description"}>
                        {"The client review is scheduled. Add your notes before Wednesday at 10:30."}
                      </div>{" "}
                    </div>{" "}
                    <WorkspaceAction
                      className={"pn-btn-close"}
                      aria-label={"close"}
                      action={"dismiss"}
                    ></WorkspaceAction>{" "}
                  </WorkspaceAlert>{" "}
                  <WorkspaceAlert
                    className={
                      "pn-alert pn-alert-important pn-alert-warning pn-alert-dismissible"
                    }
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
                      {" "}
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        {" "}
                        <path d={"M12 9v4"}></path>{" "}
                        <path
                          d={
                            "M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0"
                          }
                        ></path>{" "}
                        <path d={"M12 16h.01"}></path>{" "}
                      </svg>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h4 className={"pn-alert-heading"}>
                        {"This is a custom alert box!"}
                      </h4>{" "}
                      <div className={"pn-alert-description"}>
                        {"The client review is scheduled. Add your notes before Wednesday at 10:30."}
                      </div>{" "}
                    </div>{" "}
                    <WorkspaceAction
                      className={"pn-btn-close"}
                      aria-label={"close"}
                      action={"dismiss"}
                    ></WorkspaceAction>{" "}
                  </WorkspaceAlert>{" "}
                  <WorkspaceAlert
                    className={
                      "pn-alert pn-alert-important pn-alert-info pn-alert-dismissible"
                    }
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
                      {" "}
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        {" "}
                        <path
                          d={"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"}
                        ></path>{" "}
                        <path d={"M12 9h.01"}></path>{" "}
                        <path d={"M11 12h1v4h1"}></path>{" "}
                      </svg>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h4 className={"pn-alert-heading"}>
                        {"This is a custom alert box!"}
                      </h4>{" "}
                      <div className={"pn-alert-description"}>
                        {"The client review is scheduled. Add your notes before Wednesday at 10:30."}
                      </div>{" "}
                    </div>{" "}
                    <WorkspaceAction
                      className={"pn-btn-close"}
                      aria-label={"close"}
                      action={"dismiss"}
                    ></WorkspaceAction>{" "}
                  </WorkspaceAlert>{" "}
                  <WorkspaceAlert
                    className={
                      "pn-alert pn-alert-important pn-alert-danger pn-alert-dismissible"
                    }
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
                      {" "}
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        {" "}
                        <path
                          d={"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"}
                        ></path>{" "}
                        <path d={"M12 8v4"}></path>{" "}
                        <path d={"M12 16h.01"}></path>{" "}
                      </svg>{" "}
                    </div>
                    {" An error occurred! "}
                    <WorkspaceLink href={"#"} className={"pn-alert-action"}>
                      {" Link "}
                    </WorkspaceLink>{" "}
                    <WorkspaceAction
                      className={"pn-btn-close"}
                      aria-label={"close"}
                      action={"dismiss"}
                    ></WorkspaceAction>{" "}
                  </WorkspaceAlert>{" "}
                  <WorkspaceAlert
                    className={
                      "pn-alert pn-alert-important pn-alert-info pn-alert-dismissible"
                    }
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
                      {" "}
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        {" "}
                        <path
                          d={"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"}
                        ></path>{" "}
                        <path d={"M12 9h.01"}></path>{" "}
                        <path d={"M11 12h1v4h1"}></path>{" "}
                      </svg>{" "}
                    </div>
                    {" Just a quick note! "}
                    <WorkspaceLink href={"#"} className={"pn-alert-link"}>
                      {" Link "}
                    </WorkspaceLink>{" "}
                    <WorkspaceAction
                      className={"pn-btn-close"}
                      aria-label={"close"}
                      action={"dismiss"}
                    ></WorkspaceAction>{" "}
                  </WorkspaceAlert>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-12"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Minor"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Add "}
                    <code>{"alert-minor"}</code>
                    {
                      " for a quieter style that fits inline with other content."
                    }
                  </CardDescription>{" "}
                  <WorkspaceAlert
                    className={
                      "pn-alert pn-alert-minor pn-alert-danger pn-alert-dismissible"
                    }
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
                      {" "}
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        {" "}
                        <path
                          d={"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"}
                        ></path>{" "}
                        <path d={"M12 8v4"}></path>{" "}
                        <path d={"M12 16h.01"}></path>{" "}
                      </svg>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h4 className={"pn-alert-heading"}>
                        {"Password does not meet requirements:"}
                      </h4>{" "}
                      <div className={"pn-alert-description"}>
                        {" "}
                        <ul className={"pn-alert-list"}>
                          {" "}
                          <li>{"Minimum 8 characters"}</li>{" "}
                          <li>{"Include a special character"}</li>{" "}
                        </ul>{" "}
                      </div>{" "}
                    </div>{" "}
                    <WorkspaceAction
                      className={"pn-btn-close"}
                      aria-label={"close"}
                      action={"dismiss"}
                    ></WorkspaceAction>{" "}
                  </WorkspaceAlert>{" "}
                  <WorkspaceAlert
                    className={
                      "pn-alert pn-alert-minor pn-alert-success pn-alert-dismissible"
                    }
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
                      {" "}
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        <path d={"M5 12l5 5l10 -10"}></path>
                      </svg>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h4 className={"pn-alert-heading"}>
                        {"This is a custom alert box!"}
                      </h4>{" "}
                      <div className={"pn-alert-description"}>
                        {"The client review is scheduled. Add your notes before Wednesday at 10:30."}
                      </div>{" "}
                    </div>{" "}
                    <WorkspaceAction
                      className={"pn-btn-close"}
                      aria-label={"close"}
                      action={"dismiss"}
                    ></WorkspaceAction>{" "}
                  </WorkspaceAlert>{" "}
                  <WorkspaceAlert
                    className={
                      "pn-alert pn-alert-minor pn-alert-warning pn-alert-dismissible"
                    }
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
                      {" "}
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        {" "}
                        <path d={"M12 9v4"}></path>{" "}
                        <path
                          d={
                            "M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0"
                          }
                        ></path>{" "}
                        <path d={"M12 16h.01"}></path>{" "}
                      </svg>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h4 className={"pn-alert-heading"}>
                        {"This is a custom alert box!"}
                      </h4>{" "}
                      <div className={"pn-alert-description"}>
                        {"The client review is scheduled. Add your notes before Wednesday at 10:30."}
                      </div>{" "}
                    </div>{" "}
                    <WorkspaceAction
                      className={"pn-btn-close"}
                      aria-label={"close"}
                      action={"dismiss"}
                    ></WorkspaceAction>{" "}
                  </WorkspaceAlert>{" "}
                  <WorkspaceAlert
                    className={
                      "pn-alert pn-alert-minor pn-alert-info pn-alert-dismissible"
                    }
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
                      {" "}
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        {" "}
                        <path
                          d={"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"}
                        ></path>{" "}
                        <path d={"M12 9h.01"}></path>{" "}
                        <path d={"M11 12h1v4h1"}></path>{" "}
                      </svg>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h4 className={"pn-alert-heading"}>
                        {"This is a custom alert box!"}
                      </h4>{" "}
                      <div className={"pn-alert-description"}>
                        {"The client review is scheduled. Add your notes before Wednesday at 10:30."}
                      </div>{" "}
                    </div>{" "}
                    <WorkspaceAction
                      className={"pn-btn-close"}
                      aria-label={"close"}
                      action={"dismiss"}
                    ></WorkspaceAction>{" "}
                  </WorkspaceAlert>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  )
}
