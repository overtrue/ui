// Keep page composition editable; interaction belongs in the shared components.
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import {
  WorkspaceInput,
  WorkspaceLink,
  WorkspaceTab,
} from "@/components/overtrue/workspace/primitives"
export default function Page() {
  return (
    <div data-workspace-page="segmented-control" className="pn-page-wrapper">
      {" "}
      <div className={"pn-page-header pn-d-print-none"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-g-2 pn-align-items-center"}>
            {" "}
            <div className={"pn-col"}>
              {" "}
              <h1 className={"pn-page-title"}>{"Segmented control"}</h1>{" "}
              <div className={"pn-text-secondary pn-mt-1"}>
                {
                  "Switch between useful views with a single choice."
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
            <div className={"pn-col-md-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Basic"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"A "}
                    <code>{"nav-segmented"}</code>
                    {" with text "}
                    <code>{"nav-link"}</code>
                    {" items is enough for a plain control."}
                  </CardDescription>{" "}
                  <nav className={"pn-nav pn-nav-segmented"} role={"tablist"}>
                    {" "}
                    <WorkspaceTab
                      className={"pn-nav-link pn-active"}
                      data-workspace-group={"tab-group-1"}
                      target={"#"}
                      group={"tab-group-1"}
                    >
                      {"1"}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-1"}
                      target={"#"}
                      group={"tab-group-1"}
                    >
                      {"2"}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-1"}
                      target={"#"}
                      group={"tab-group-1"}
                    >
                      {"3"}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-1"}
                      target={"#"}
                      group={"tab-group-1"}
                    >
                      {"4"}
                    </WorkspaceTab>{" "}
                  </nav>{" "}
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
                    {"Any content"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Items can be any short text, including emoji."}
                  </CardDescription>{" "}
                  <nav className={"pn-nav pn-nav-segmented"} role={"tablist"}>
                    {" "}
                    <WorkspaceTab
                      className={"pn-nav-link pn-active"}
                      data-workspace-group={"tab-group-2"}
                      target={"#"}
                      group={"tab-group-2"}
                    >
                      {"👦"}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-2"}
                      target={"#"}
                      group={"tab-group-2"}
                    >
                      {"👦🏿"}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-2"}
                      target={"#"}
                      group={"tab-group-2"}
                    >
                      {"👦🏾"}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-2"}
                      target={"#"}
                      group={"tab-group-2"}
                    >
                      {"👦🏽"}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-2"}
                      target={"#"}
                      group={"tab-group-2"}
                    >
                      {"👦🏼"}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-2"}
                      target={"#"}
                      group={"tab-group-2"}
                    >
                      {"👦🏻"}
                    </WorkspaceTab>{" "}
                  </nav>{" "}
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
                    {"Icons only"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Put only an icon in each "}
                    <code>{"nav-link"}</code>
                    {" for an icon-only control."}
                  </CardDescription>{" "}
                  <nav className={"pn-nav pn-nav-segmented"} role={"tablist"}>
                    {" "}
                    <WorkspaceTab
                      aria-label={"Home"}
                      className={"pn-nav-link pn-active"}
                      data-workspace-group={"tab-group-3"}
                      target={"#"}
                      group={"tab-group-3"}
                    >
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
                        className={"pn-icon pn-nav-link-icon"}
                      >
                        {" "}
                        <path d={"M5 12l-2 0l9 -9l9 9l-2 0"}></path>{" "}
                        <path
                          d={"M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"}
                        ></path>{" "}
                        <path
                          d={"M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"}
                        ></path>{" "}
                      </svg>{" "}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      aria-label={"Star"}
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-3"}
                      target={"#"}
                      group={"tab-group-3"}
                    >
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
                        className={"pn-icon pn-nav-link-icon"}
                      >
                        {" "}
                        <path
                          d={
                            "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"
                          }
                        ></path>{" "}
                      </svg>{" "}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      aria-label={"Clock"}
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-3"}
                      target={"#"}
                      group={"tab-group-3"}
                    >
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
                        className={"pn-icon pn-nav-link-icon"}
                      >
                        {" "}
                        <path
                          d={"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"}
                        ></path>{" "}
                        <path d={"M12 7v5l3 3"}></path>{" "}
                      </svg>{" "}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      aria-label={"Ghost"}
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-3"}
                      target={"#"}
                      group={"tab-group-3"}
                    >
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
                        className={"pn-icon pn-nav-link-icon"}
                      >
                        {" "}
                        <path
                          d={
                            "M5 11a7 7 0 0 1 14 0v7a1.78 1.78 0 0 1 -3.1 1.4a1.65 1.65 0 0 0 -2.6 0a1.65 1.65 0 0 1 -2.6 0a1.65 1.65 0 0 0 -2.6 0a1.78 1.78 0 0 1 -3.1 -1.4v-7"
                          }
                        ></path>{" "}
                        <path d={"M10 10l.01 0"}></path>{" "}
                        <path d={"M14 10l.01 0"}></path>{" "}
                        <path d={"M10 14a3.5 3.5 0 0 0 4 0"}></path>{" "}
                      </svg>{" "}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      aria-label={"Bold"}
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-3"}
                      target={"#"}
                      group={"tab-group-3"}
                    >
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
                        className={"pn-icon pn-nav-link-icon"}
                      >
                        {" "}
                        <path
                          d={"M7 5h6a3.5 3.5 0 0 1 0 7h-6l0 -7"}
                        ></path>{" "}
                        <path
                          d={"M13 12h1a3.5 3.5 0 0 1 0 7h-7v-7"}
                        ></path>{" "}
                      </svg>{" "}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      aria-label={"Italic"}
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-3"}
                      target={"#"}
                      group={"tab-group-3"}
                    >
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
                        className={"pn-icon pn-nav-link-icon"}
                      >
                        {" "}
                        <path d={"M11 5l6 0"}></path>{" "}
                        <path d={"M7 19l6 0"}></path>{" "}
                        <path d={"M14 5l-4 14"}></path>{" "}
                      </svg>{" "}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      aria-label={"Underline"}
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-3"}
                      target={"#"}
                      group={"tab-group-3"}
                    >
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
                        className={"pn-icon pn-nav-link-icon"}
                      >
                        {" "}
                        <path d={"M7 5v5a5 5 0 0 0 10 0v-5"}></path>{" "}
                        <path d={"M5 19h14"}></path>{" "}
                      </svg>{" "}
                    </WorkspaceTab>{" "}
                  </nav>{" "}
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
                    {"With icons"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Combine an icon and text in each "}
                    <code>{"nav-link"}</code>
                    {" to label each option."}
                  </CardDescription>{" "}
                  <nav className={"pn-nav pn-nav-segmented"} role={"tablist"}>
                    {" "}
                    <WorkspaceTab
                      className={"pn-nav-link pn-active"}
                      data-workspace-group={"tab-group-4"}
                      target={"#"}
                      group={"tab-group-4"}
                    >
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
                        className={"pn-icon pn-nav-link-icon"}
                      >
                        {" "}
                        <path d={"M9 6l11 0"}></path>{" "}
                        <path d={"M9 12l11 0"}></path>{" "}
                        <path d={"M9 18l11 0"}></path>{" "}
                        <path d={"M5 6l0 .01"}></path>{" "}
                        <path d={"M5 12l0 .01"}></path>{" "}
                        <path d={"M5 18l0 .01"}></path>
                      </svg>
                      {"List "}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-4"}
                      target={"#"}
                      group={"tab-group-4"}
                    >
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
                        className={"pn-icon pn-nav-link-icon"}
                      >
                        {" "}
                        <path
                          d={
                            "M4 6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -1"
                          }
                        ></path>{" "}
                        <path
                          d={
                            "M4 15a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -3"
                          }
                        ></path>{" "}
                        <path
                          d={
                            "M14 6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -12"
                          }
                        ></path>
                      </svg>
                      {"Kanban "}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-4"}
                      target={"#"}
                      group={"tab-group-4"}
                    >
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
                        className={"pn-icon pn-nav-link-icon"}
                      >
                        {" "}
                        <path
                          d={
                            "M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12"
                          }
                        ></path>{" "}
                        <path d={"M16 3v4"}></path> <path d={"M8 3v4"}></path>{" "}
                        <path d={"M4 11h16"}></path>{" "}
                        <path d={"M11 15h1"}></path>{" "}
                        <path d={"M12 15v3"}></path>
                      </svg>
                      {"Calendar "}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-4"}
                      target={"#"}
                      group={"tab-group-4"}
                    >
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
                        className={"pn-icon pn-nav-link-icon"}
                      >
                        {" "}
                        <path d={"M15 3v4a1 1 0 0 0 1 1h4"}></path>{" "}
                        <path
                          d={
                            "M18 17h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h4l5 5v7a2 2 0 0 1 -2 2"
                          }
                        ></path>{" "}
                        <path
                          d={
                            "M16 17v2a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2"
                          }
                        ></path>
                      </svg>
                      {"Files "}
                    </WorkspaceTab>{" "}
                  </nav>{" "}
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
                    {"Vertical"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Add "}
                    <code>{"nav-segmented-vertical"}</code>
                    {" to stack the options in a column."}
                  </CardDescription>{" "}
                  <nav
                    className={"pn-nav pn-nav-segmented pn-nav-segmented-vertical"}
                    role={"tablist"}
                    aria-orientation={"vertical"}
                  >
                    {" "}
                    <WorkspaceTab
                      className={"pn-nav-link pn-active"}
                      data-workspace-group={"tab-group-5"}
                      target={"#"}
                      group={"tab-group-5"}
                    >
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
                        className={"pn-icon pn-nav-link-icon"}
                      >
                        {" "}
                        <path d={"M9 6l11 0"}></path>{" "}
                        <path d={"M9 12l11 0"}></path>{" "}
                        <path d={"M9 18l11 0"}></path>{" "}
                        <path d={"M5 6l0 .01"}></path>{" "}
                        <path d={"M5 12l0 .01"}></path>{" "}
                        <path d={"M5 18l0 .01"}></path>
                      </svg>
                      {"List "}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-5"}
                      target={"#"}
                      group={"tab-group-5"}
                    >
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
                        className={"pn-icon pn-nav-link-icon"}
                      >
                        {" "}
                        <path
                          d={
                            "M4 6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -1"
                          }
                        ></path>{" "}
                        <path
                          d={
                            "M4 15a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -3"
                          }
                        ></path>{" "}
                        <path
                          d={
                            "M14 6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -12"
                          }
                        ></path>
                      </svg>
                      {"Kanban "}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-5"}
                      target={"#"}
                      group={"tab-group-5"}
                    >
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
                        className={"pn-icon pn-nav-link-icon"}
                      >
                        {" "}
                        <path
                          d={
                            "M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12"
                          }
                        ></path>{" "}
                        <path d={"M16 3v4"}></path> <path d={"M8 3v4"}></path>{" "}
                        <path d={"M4 11h16"}></path>{" "}
                        <path d={"M11 15h1"}></path>{" "}
                        <path d={"M12 15v3"}></path>
                      </svg>
                      {"Calendar "}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-5"}
                      target={"#"}
                      group={"tab-group-5"}
                    >
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
                        className={"pn-icon pn-nav-link-icon"}
                      >
                        {" "}
                        <path d={"M15 3v4a1 1 0 0 0 1 1h4"}></path>{" "}
                        <path
                          d={
                            "M18 17h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h4l5 5v7a2 2 0 0 1 -2 2"
                          }
                        ></path>{" "}
                        <path
                          d={
                            "M16 17v2a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2"
                          }
                        ></path>
                      </svg>
                      {"Files "}
                    </WorkspaceTab>{" "}
                  </nav>{" "}
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
                    {"Vertical with disabled items"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Add "}
                    <code>{"disabled"}</code>
                    {" to a "}
                    <code>{"nav-link"}</code>
                    {" to make that option unselectable."}
                  </CardDescription>{" "}
                  <nav
                    className={"pn-nav pn-nav-segmented pn-nav-segmented-vertical"}
                    role={"tablist"}
                    aria-orientation={"vertical"}
                  >
                    {" "}
                    <WorkspaceTab
                      aria-label={"Home"}
                      className={"pn-nav-link pn-active"}
                      data-workspace-group={"tab-group-6"}
                      target={"#"}
                      group={"tab-group-6"}
                    >
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
                        className={"pn-icon pn-nav-link-icon"}
                      >
                        {" "}
                        <path d={"M5 12l-2 0l9 -9l9 9l-2 0"}></path>{" "}
                        <path
                          d={"M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"}
                        ></path>{" "}
                        <path
                          d={"M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"}
                        ></path>{" "}
                      </svg>{" "}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      aria-label={"Star"}
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-6"}
                      target={"#"}
                      group={"tab-group-6"}
                    >
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
                        className={"pn-icon pn-nav-link-icon"}
                      >
                        {" "}
                        <path
                          d={
                            "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"
                          }
                        ></path>{" "}
                      </svg>{" "}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      aria-disabled={"true"}
                      aria-label={"Clock"}
                      className={"pn-nav-link pn-disabled"}
                      data-workspace-group={"tab-group-6"}
                      target={"#"}
                      group={"tab-group-6"}
                    >
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
                        className={"pn-icon pn-nav-link-icon"}
                      >
                        {" "}
                        <path
                          d={"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"}
                        ></path>{" "}
                        <path d={"M12 7v5l3 3"}></path>{" "}
                      </svg>{" "}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      aria-label={"Ghost"}
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-6"}
                      target={"#"}
                      group={"tab-group-6"}
                    >
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
                        className={"pn-icon pn-nav-link-icon"}
                      >
                        {" "}
                        <path
                          d={
                            "M5 11a7 7 0 0 1 14 0v7a1.78 1.78 0 0 1 -3.1 1.4a1.65 1.65 0 0 0 -2.6 0a1.65 1.65 0 0 1 -2.6 0a1.65 1.65 0 0 0 -2.6 0a1.78 1.78 0 0 1 -3.1 -1.4v-7"
                          }
                        ></path>{" "}
                        <path d={"M10 10l.01 0"}></path>{" "}
                        <path d={"M14 10l.01 0"}></path>{" "}
                        <path d={"M10 14a3.5 3.5 0 0 0 4 0"}></path>{" "}
                      </svg>{" "}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      aria-label={"Bold"}
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-6"}
                      target={"#"}
                      group={"tab-group-6"}
                    >
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
                        className={"pn-icon pn-nav-link-icon"}
                      >
                        {" "}
                        <path
                          d={"M7 5h6a3.5 3.5 0 0 1 0 7h-6l0 -7"}
                        ></path>{" "}
                        <path
                          d={"M13 12h1a3.5 3.5 0 0 1 0 7h-7v-7"}
                        ></path>{" "}
                      </svg>{" "}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      aria-label={"Italic"}
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-6"}
                      target={"#"}
                      group={"tab-group-6"}
                    >
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
                        className={"pn-icon pn-nav-link-icon"}
                      >
                        {" "}
                        <path d={"M11 5l6 0"}></path>{" "}
                        <path d={"M7 19l6 0"}></path>{" "}
                        <path d={"M14 5l-4 14"}></path>{" "}
                      </svg>{" "}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      aria-label={"Underline"}
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-6"}
                      target={"#"}
                      group={"tab-group-6"}
                    >
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
                        className={"pn-icon pn-nav-link-icon"}
                      >
                        {" "}
                        <path d={"M7 5v5a5 5 0 0 0 10 0v-5"}></path>{" "}
                        <path d={"M5 19h14"}></path>{" "}
                      </svg>{" "}
                    </WorkspaceTab>{" "}
                  </nav>{" "}
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
                    {"Disabled items"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Disabled options stay visible but can't be selected."}
                  </CardDescription>{" "}
                  <nav className={"pn-nav pn-nav-segmented"} role={"tablist"}>
                    {" "}
                    <WorkspaceTab
                      className={"pn-nav-link pn-active"}
                      data-workspace-group={"tab-group-7"}
                      target={"#"}
                      group={"tab-group-7"}
                    >
                      {"Daily"}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-7"}
                      target={"#"}
                      group={"tab-group-7"}
                    >
                      {"Weekly"}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-7"}
                      target={"#"}
                      group={"tab-group-7"}
                    >
                      {"Monthly"}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      aria-disabled={"true"}
                      className={"pn-nav-link pn-disabled"}
                      data-workspace-group={"tab-group-7"}
                      target={"#"}
                      group={"tab-group-7"}
                    >
                      {"Quarterly"}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      aria-disabled={"true"}
                      className={"pn-nav-link pn-disabled"}
                      data-workspace-group={"tab-group-7"}
                      target={"#"}
                      group={"tab-group-7"}
                    >
                      {"Yearly"}
                    </WorkspaceTab>{" "}
                  </nav>{" "}
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
                    {"Vertical, no icons"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"A vertical control also works with text-only items."}
                  </CardDescription>{" "}
                  <nav
                    className={"pn-nav pn-nav-segmented pn-nav-segmented-vertical"}
                    role={"tablist"}
                    aria-orientation={"vertical"}
                  >
                    {" "}
                    <WorkspaceTab
                      className={"pn-nav-link pn-active"}
                      data-workspace-group={"tab-group-8"}
                      target={"#"}
                      group={"tab-group-8"}
                    >
                      {"Daily"}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-8"}
                      target={"#"}
                      group={"tab-group-8"}
                    >
                      {"Weekly"}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-8"}
                      target={"#"}
                      group={"tab-group-8"}
                    >
                      {"Monthly"}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-8"}
                      target={"#"}
                      group={"tab-group-8"}
                    >
                      {"Quarterly"}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-8"}
                      target={"#"}
                      group={"tab-group-8"}
                    >
                      {"Yearly"}
                    </WorkspaceTab>{" "}
                  </nav>{" "}
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
                    {"Independent group"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Use radio inputs with a unique "}
                    <code>{"name"}</code>
                    {
                      " so this control doesn't share selection state with others using the same items."
                    }
                  </CardDescription>{" "}
                  <nav className={"pn-nav pn-nav-segmented"}>
                    {" "}
                    <WorkspaceInput
                      type={"radio"}
                      className={"pn-nav-link-input"}
                      name={"checkbox"}
                      id={"segmented-checkbox-1"}
                      defaultChecked
                    />
                    <label
                      htmlFor={"segmented-checkbox-1"}
                      className={"pn-nav-link"}
                    >
                      {"Daily"}
                    </label>{" "}
                    <WorkspaceInput
                      type={"radio"}
                      className={"pn-nav-link-input"}
                      name={"checkbox"}
                      id={"segmented-checkbox-2"}
                    />
                    <label
                      htmlFor={"segmented-checkbox-2"}
                      className={"pn-nav-link"}
                    >
                      {"Weekly"}
                    </label>{" "}
                    <WorkspaceInput
                      type={"radio"}
                      className={"pn-nav-link-input"}
                      name={"checkbox"}
                      id={"segmented-checkbox-3"}
                    />
                    <label
                      htmlFor={"segmented-checkbox-3"}
                      className={"pn-nav-link"}
                    >
                      {"Monthly"}
                    </label>{" "}
                    <WorkspaceInput
                      type={"radio"}
                      className={"pn-nav-link-input"}
                      name={"checkbox"}
                      id={"segmented-checkbox-4"}
                    />
                    <label
                      htmlFor={"segmented-checkbox-4"}
                      className={"pn-nav-link"}
                    >
                      {"Quarterly"}
                    </label>{" "}
                    <WorkspaceInput
                      type={"radio"}
                      className={"pn-nav-link-input"}
                      name={"checkbox"}
                      id={"segmented-checkbox-5"}
                    />
                    <label
                      htmlFor={"segmented-checkbox-5"}
                      className={"pn-nav-link"}
                    >
                      {"Yearly"}
                    </label>{" "}
                  </nav>{" "}
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
                    {"Full width"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Add "}
                    <code>{"w-100"}</code>
                    {" to stretch the control across its container."}
                  </CardDescription>{" "}
                  <nav
                    className={"pn-nav pn-nav-segmented pn-w-100"}
                    role={"tablist"}
                  >
                    {" "}
                    <WorkspaceTab
                      className={"pn-nav-link pn-active"}
                      data-workspace-group={"tab-group-10"}
                      target={"#"}
                      group={"tab-group-10"}
                    >
                      {"Daily"}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-10"}
                      target={"#"}
                      group={"tab-group-10"}
                    >
                      {"Weekly"}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-10"}
                      target={"#"}
                      group={"tab-group-10"}
                    >
                      {"Monthly"}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-10"}
                      target={"#"}
                      group={"tab-group-10"}
                    >
                      {"Quarterly"}
                    </WorkspaceTab>{" "}
                    <WorkspaceTab
                      className={"pn-nav-link"}
                      data-workspace-group={"tab-group-10"}
                      target={"#"}
                      group={"tab-group-10"}
                    >
                      {"Yearly"}
                    </WorkspaceTab>{" "}
                  </nav>{" "}
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
                    {"Full width, stacked"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Multiple full-width controls, one above the other."}
                  </CardDescription>{" "}
                  <div className={"pn-space-y"}>
                    {" "}
                    <div>
                      {" "}
                      <nav
                        className={"pn-nav pn-nav-segmented pn-w-100"}
                        role={"tablist"}
                      >
                        {" "}
                        <WorkspaceTab
                          className={"pn-nav-link pn-active"}
                          data-workspace-group={"tab-group-11"}
                          target={"#"}
                          group={"tab-group-11"}
                        >
                          {"Overview"}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          className={"pn-nav-link"}
                          data-workspace-group={"tab-group-11"}
                          target={"#"}
                          group={"tab-group-11"}
                        >
                          {"Analytics"}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          className={"pn-nav-link"}
                          data-workspace-group={"tab-group-11"}
                          target={"#"}
                          group={"tab-group-11"}
                        >
                          {"Reports"}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          className={"pn-nav-link"}
                          data-workspace-group={"tab-group-11"}
                          target={"#"}
                          group={"tab-group-11"}
                        >
                          {"Notifications"}
                        </WorkspaceTab>{" "}
                      </nav>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <nav
                        className={"pn-nav pn-nav-segmented pn-w-100"}
                        role={"tablist"}
                      >
                        {" "}
                        <WorkspaceTab
                          className={"pn-nav-link pn-active"}
                          data-workspace-group={"tab-group-12"}
                          target={"#"}
                          group={"tab-group-12"}
                        >
                          {"Account"}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          className={"pn-nav-link"}
                          data-workspace-group={"tab-group-12"}
                          target={"#"}
                          group={"tab-group-12"}
                        >
                          {"Password"}
                        </WorkspaceTab>{" "}
                      </nav>{" "}
                    </div>{" "}
                  </div>{" "}
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
                    {"Sizes"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Add "}
                    <code>{"nav-sm"}</code>
                    {" or "}
                    <code>{"nav-lg"}</code>
                    {" to change the size — with text, icons, or both."}
                  </CardDescription>{" "}
                  <div className={"pn-space-y"}>
                    {" "}
                    <div>
                      {" "}
                      <nav
                        className={"pn-nav pn-nav-segmented pn-nav-sm"}
                        role={"tablist"}
                      >
                        {" "}
                        <WorkspaceTab
                          className={"pn-nav-link pn-active"}
                          data-workspace-group={"tab-group-13"}
                          target={"#"}
                          group={"tab-group-13"}
                        >
                          {"List"}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          className={"pn-nav-link"}
                          data-workspace-group={"tab-group-13"}
                          target={"#"}
                          group={"tab-group-13"}
                        >
                          {"Kanban"}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          aria-disabled={"true"}
                          className={"pn-nav-link pn-disabled"}
                          data-workspace-group={"tab-group-13"}
                          target={"#"}
                          group={"tab-group-13"}
                        >
                          {"Calendar"}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          className={"pn-nav-link"}
                          data-workspace-group={"tab-group-13"}
                          target={"#"}
                          group={"tab-group-13"}
                        >
                          {"Files"}
                        </WorkspaceTab>{" "}
                      </nav>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <nav className={"pn-nav pn-nav-segmented"} role={"tablist"}>
                        {" "}
                        <WorkspaceTab
                          className={"pn-nav-link pn-active"}
                          data-workspace-group={"tab-group-14"}
                          target={"#"}
                          group={"tab-group-14"}
                        >
                          {"List"}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          className={"pn-nav-link"}
                          data-workspace-group={"tab-group-14"}
                          target={"#"}
                          group={"tab-group-14"}
                        >
                          {"Kanban"}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          aria-disabled={"true"}
                          className={"pn-nav-link pn-disabled"}
                          data-workspace-group={"tab-group-14"}
                          target={"#"}
                          group={"tab-group-14"}
                        >
                          {"Calendar"}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          className={"pn-nav-link"}
                          data-workspace-group={"tab-group-14"}
                          target={"#"}
                          group={"tab-group-14"}
                        >
                          {"Files"}
                        </WorkspaceTab>{" "}
                      </nav>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <nav
                        className={"pn-nav pn-nav-segmented pn-nav-lg"}
                        role={"tablist"}
                      >
                        {" "}
                        <WorkspaceTab
                          className={"pn-nav-link pn-active"}
                          data-workspace-group={"tab-group-15"}
                          target={"#"}
                          group={"tab-group-15"}
                        >
                          {"List"}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          className={"pn-nav-link"}
                          data-workspace-group={"tab-group-15"}
                          target={"#"}
                          group={"tab-group-15"}
                        >
                          {"Kanban"}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          aria-disabled={"true"}
                          className={"pn-nav-link pn-disabled"}
                          data-workspace-group={"tab-group-15"}
                          target={"#"}
                          group={"tab-group-15"}
                        >
                          {"Calendar"}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          className={"pn-nav-link"}
                          data-workspace-group={"tab-group-15"}
                          target={"#"}
                          group={"tab-group-15"}
                        >
                          {"Files"}
                        </WorkspaceTab>{" "}
                      </nav>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <nav
                        className={"pn-nav pn-nav-segmented pn-nav-sm"}
                        role={"tablist"}
                      >
                        {" "}
                        <WorkspaceTab
                          className={"pn-nav-link pn-active"}
                          data-workspace-group={"tab-group-16"}
                          target={"#"}
                          group={"tab-group-16"}
                        >
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
                            className={"pn-icon pn-nav-link-icon"}
                          >
                            {" "}
                            <path d={"M9 6l11 0"}></path>{" "}
                            <path d={"M9 12l11 0"}></path>{" "}
                            <path d={"M9 18l11 0"}></path>{" "}
                            <path d={"M5 6l0 .01"}></path>{" "}
                            <path d={"M5 12l0 .01"}></path>{" "}
                            <path d={"M5 18l0 .01"}></path>
                          </svg>
                          {"List "}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          className={"pn-nav-link"}
                          data-workspace-group={"tab-group-16"}
                          target={"#"}
                          group={"tab-group-16"}
                        >
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
                            className={"pn-icon pn-nav-link-icon"}
                          >
                            {" "}
                            <path
                              d={
                                "M4 6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -1"
                              }
                            ></path>{" "}
                            <path
                              d={
                                "M4 15a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -3"
                              }
                            ></path>{" "}
                            <path
                              d={
                                "M14 6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -12"
                              }
                            ></path>
                          </svg>
                          {"Kanban "}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          aria-disabled={"true"}
                          className={"pn-nav-link pn-disabled"}
                          data-workspace-group={"tab-group-16"}
                          target={"#"}
                          group={"tab-group-16"}
                        >
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
                            className={"pn-icon pn-nav-link-icon"}
                          >
                            {" "}
                            <path
                              d={
                                "M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12"
                              }
                            ></path>{" "}
                            <path d={"M16 3v4"}></path>{" "}
                            <path d={"M8 3v4"}></path>{" "}
                            <path d={"M4 11h16"}></path>{" "}
                            <path d={"M11 15h1"}></path>{" "}
                            <path d={"M12 15v3"}></path>
                          </svg>
                          {"Calendar "}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          className={"pn-nav-link"}
                          data-workspace-group={"tab-group-16"}
                          target={"#"}
                          group={"tab-group-16"}
                        >
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
                            className={"pn-icon pn-nav-link-icon"}
                          >
                            {" "}
                            <path d={"M15 3v4a1 1 0 0 0 1 1h4"}></path>{" "}
                            <path
                              d={
                                "M18 17h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h4l5 5v7a2 2 0 0 1 -2 2"
                              }
                            ></path>{" "}
                            <path
                              d={
                                "M16 17v2a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2"
                              }
                            ></path>
                          </svg>
                          {"Files "}
                        </WorkspaceTab>{" "}
                      </nav>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <nav className={"pn-nav pn-nav-segmented"} role={"tablist"}>
                        {" "}
                        <WorkspaceTab
                          className={"pn-nav-link pn-active"}
                          data-workspace-group={"tab-group-17"}
                          target={"#"}
                          group={"tab-group-17"}
                        >
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
                            className={"pn-icon pn-nav-link-icon"}
                          >
                            {" "}
                            <path d={"M9 6l11 0"}></path>{" "}
                            <path d={"M9 12l11 0"}></path>{" "}
                            <path d={"M9 18l11 0"}></path>{" "}
                            <path d={"M5 6l0 .01"}></path>{" "}
                            <path d={"M5 12l0 .01"}></path>{" "}
                            <path d={"M5 18l0 .01"}></path>
                          </svg>
                          {"List "}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          className={"pn-nav-link"}
                          data-workspace-group={"tab-group-17"}
                          target={"#"}
                          group={"tab-group-17"}
                        >
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
                            className={"pn-icon pn-nav-link-icon"}
                          >
                            {" "}
                            <path
                              d={
                                "M4 6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -1"
                              }
                            ></path>{" "}
                            <path
                              d={
                                "M4 15a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -3"
                              }
                            ></path>{" "}
                            <path
                              d={
                                "M14 6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -12"
                              }
                            ></path>
                          </svg>
                          {"Kanban "}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          aria-disabled={"true"}
                          className={"pn-nav-link pn-disabled"}
                          data-workspace-group={"tab-group-17"}
                          target={"#"}
                          group={"tab-group-17"}
                        >
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
                            className={"pn-icon pn-nav-link-icon"}
                          >
                            {" "}
                            <path
                              d={
                                "M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12"
                              }
                            ></path>{" "}
                            <path d={"M16 3v4"}></path>{" "}
                            <path d={"M8 3v4"}></path>{" "}
                            <path d={"M4 11h16"}></path>{" "}
                            <path d={"M11 15h1"}></path>{" "}
                            <path d={"M12 15v3"}></path>
                          </svg>
                          {"Calendar "}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          className={"pn-nav-link"}
                          data-workspace-group={"tab-group-17"}
                          target={"#"}
                          group={"tab-group-17"}
                        >
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
                            className={"pn-icon pn-nav-link-icon"}
                          >
                            {" "}
                            <path d={"M15 3v4a1 1 0 0 0 1 1h4"}></path>{" "}
                            <path
                              d={
                                "M18 17h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h4l5 5v7a2 2 0 0 1 -2 2"
                              }
                            ></path>{" "}
                            <path
                              d={
                                "M16 17v2a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2"
                              }
                            ></path>
                          </svg>
                          {"Files "}
                        </WorkspaceTab>{" "}
                      </nav>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <nav
                        className={"pn-nav pn-nav-segmented pn-nav-lg"}
                        role={"tablist"}
                      >
                        {" "}
                        <WorkspaceTab
                          className={"pn-nav-link pn-active"}
                          data-workspace-group={"tab-group-18"}
                          target={"#"}
                          group={"tab-group-18"}
                        >
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
                            className={"pn-icon pn-nav-link-icon"}
                          >
                            {" "}
                            <path d={"M9 6l11 0"}></path>{" "}
                            <path d={"M9 12l11 0"}></path>{" "}
                            <path d={"M9 18l11 0"}></path>{" "}
                            <path d={"M5 6l0 .01"}></path>{" "}
                            <path d={"M5 12l0 .01"}></path>{" "}
                            <path d={"M5 18l0 .01"}></path>
                          </svg>
                          {"List "}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          className={"pn-nav-link"}
                          data-workspace-group={"tab-group-18"}
                          target={"#"}
                          group={"tab-group-18"}
                        >
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
                            className={"pn-icon pn-nav-link-icon"}
                          >
                            {" "}
                            <path
                              d={
                                "M4 6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -1"
                              }
                            ></path>{" "}
                            <path
                              d={
                                "M4 15a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -3"
                              }
                            ></path>{" "}
                            <path
                              d={
                                "M14 6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -12"
                              }
                            ></path>
                          </svg>
                          {"Kanban "}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          aria-disabled={"true"}
                          className={"pn-nav-link pn-disabled"}
                          data-workspace-group={"tab-group-18"}
                          target={"#"}
                          group={"tab-group-18"}
                        >
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
                            className={"pn-icon pn-nav-link-icon"}
                          >
                            {" "}
                            <path
                              d={
                                "M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12"
                              }
                            ></path>{" "}
                            <path d={"M16 3v4"}></path>{" "}
                            <path d={"M8 3v4"}></path>{" "}
                            <path d={"M4 11h16"}></path>{" "}
                            <path d={"M11 15h1"}></path>{" "}
                            <path d={"M12 15v3"}></path>
                          </svg>
                          {"Calendar "}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          className={"pn-nav-link"}
                          data-workspace-group={"tab-group-18"}
                          target={"#"}
                          group={"tab-group-18"}
                        >
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
                            className={"pn-icon pn-nav-link-icon"}
                          >
                            {" "}
                            <path d={"M15 3v4a1 1 0 0 0 1 1h4"}></path>{" "}
                            <path
                              d={
                                "M18 17h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h4l5 5v7a2 2 0 0 1 -2 2"
                              }
                            ></path>{" "}
                            <path
                              d={
                                "M16 17v2a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2"
                              }
                            ></path>
                          </svg>
                          {"Files "}
                        </WorkspaceTab>{" "}
                      </nav>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <nav
                        className={"pn-nav pn-nav-segmented pn-nav-sm"}
                        role={"tablist"}
                      >
                        {" "}
                        <WorkspaceTab
                          aria-label={"List"}
                          className={"pn-nav-link pn-active"}
                          data-workspace-group={"tab-group-19"}
                          target={"#"}
                          group={"tab-group-19"}
                        >
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
                            className={"pn-icon pn-nav-link-icon"}
                          >
                            {" "}
                            <path d={"M9 6l11 0"}></path>{" "}
                            <path d={"M9 12l11 0"}></path>{" "}
                            <path d={"M9 18l11 0"}></path>{" "}
                            <path d={"M5 6l0 .01"}></path>{" "}
                            <path d={"M5 12l0 .01"}></path>{" "}
                            <path d={"M5 18l0 .01"}></path>{" "}
                          </svg>{" "}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          aria-label={"Layout"}
                          className={"pn-nav-link"}
                          data-workspace-group={"tab-group-19"}
                          target={"#"}
                          group={"tab-group-19"}
                        >
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
                            className={"pn-icon pn-nav-link-icon"}
                          >
                            {" "}
                            <path
                              d={
                                "M4 6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -1"
                              }
                            ></path>{" "}
                            <path
                              d={
                                "M4 15a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -3"
                              }
                            ></path>{" "}
                            <path
                              d={
                                "M14 6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -12"
                              }
                            ></path>{" "}
                          </svg>{" "}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          aria-disabled={"true"}
                          aria-label={"Calendar"}
                          className={"pn-nav-link pn-disabled"}
                          data-workspace-group={"tab-group-19"}
                          target={"#"}
                          group={"tab-group-19"}
                        >
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
                            className={"pn-icon pn-nav-link-icon"}
                          >
                            {" "}
                            <path
                              d={
                                "M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12"
                              }
                            ></path>{" "}
                            <path d={"M16 3v4"}></path>{" "}
                            <path d={"M8 3v4"}></path>{" "}
                            <path d={"M4 11h16"}></path>{" "}
                            <path d={"M11 15h1"}></path>{" "}
                            <path d={"M12 15v3"}></path>{" "}
                          </svg>{" "}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          aria-label={"Files"}
                          className={"pn-nav-link"}
                          data-workspace-group={"tab-group-19"}
                          target={"#"}
                          group={"tab-group-19"}
                        >
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
                            className={"pn-icon pn-nav-link-icon"}
                          >
                            {" "}
                            <path d={"M15 3v4a1 1 0 0 0 1 1h4"}></path>{" "}
                            <path
                              d={
                                "M18 17h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h4l5 5v7a2 2 0 0 1 -2 2"
                              }
                            ></path>{" "}
                            <path
                              d={
                                "M16 17v2a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2"
                              }
                            ></path>{" "}
                          </svg>{" "}
                        </WorkspaceTab>{" "}
                      </nav>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <nav className={"pn-nav pn-nav-segmented"} role={"tablist"}>
                        {" "}
                        <WorkspaceTab
                          aria-label={"List"}
                          className={"pn-nav-link pn-active"}
                          data-workspace-group={"tab-group-20"}
                          target={"#"}
                          group={"tab-group-20"}
                        >
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
                            className={"pn-icon pn-nav-link-icon"}
                          >
                            {" "}
                            <path d={"M9 6l11 0"}></path>{" "}
                            <path d={"M9 12l11 0"}></path>{" "}
                            <path d={"M9 18l11 0"}></path>{" "}
                            <path d={"M5 6l0 .01"}></path>{" "}
                            <path d={"M5 12l0 .01"}></path>{" "}
                            <path d={"M5 18l0 .01"}></path>{" "}
                          </svg>{" "}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          aria-label={"Layout"}
                          className={"pn-nav-link"}
                          data-workspace-group={"tab-group-20"}
                          target={"#"}
                          group={"tab-group-20"}
                        >
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
                            className={"pn-icon pn-nav-link-icon"}
                          >
                            {" "}
                            <path
                              d={
                                "M4 6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -1"
                              }
                            ></path>{" "}
                            <path
                              d={
                                "M4 15a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -3"
                              }
                            ></path>{" "}
                            <path
                              d={
                                "M14 6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -12"
                              }
                            ></path>{" "}
                          </svg>{" "}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          aria-disabled={"true"}
                          aria-label={"Calendar"}
                          className={"pn-nav-link pn-disabled"}
                          data-workspace-group={"tab-group-20"}
                          target={"#"}
                          group={"tab-group-20"}
                        >
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
                            className={"pn-icon pn-nav-link-icon"}
                          >
                            {" "}
                            <path
                              d={
                                "M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12"
                              }
                            ></path>{" "}
                            <path d={"M16 3v4"}></path>{" "}
                            <path d={"M8 3v4"}></path>{" "}
                            <path d={"M4 11h16"}></path>{" "}
                            <path d={"M11 15h1"}></path>{" "}
                            <path d={"M12 15v3"}></path>{" "}
                          </svg>{" "}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          aria-label={"Files"}
                          className={"pn-nav-link"}
                          data-workspace-group={"tab-group-20"}
                          target={"#"}
                          group={"tab-group-20"}
                        >
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
                            className={"pn-icon pn-nav-link-icon"}
                          >
                            {" "}
                            <path d={"M15 3v4a1 1 0 0 0 1 1h4"}></path>{" "}
                            <path
                              d={
                                "M18 17h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h4l5 5v7a2 2 0 0 1 -2 2"
                              }
                            ></path>{" "}
                            <path
                              d={
                                "M16 17v2a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2"
                              }
                            ></path>{" "}
                          </svg>{" "}
                        </WorkspaceTab>{" "}
                      </nav>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <nav
                        className={"pn-nav pn-nav-segmented pn-nav-lg"}
                        role={"tablist"}
                      >
                        {" "}
                        <WorkspaceTab
                          aria-label={"List"}
                          className={"pn-nav-link pn-active"}
                          data-workspace-group={"tab-group-21"}
                          target={"#"}
                          group={"tab-group-21"}
                        >
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
                            className={"pn-icon pn-nav-link-icon"}
                          >
                            {" "}
                            <path d={"M9 6l11 0"}></path>{" "}
                            <path d={"M9 12l11 0"}></path>{" "}
                            <path d={"M9 18l11 0"}></path>{" "}
                            <path d={"M5 6l0 .01"}></path>{" "}
                            <path d={"M5 12l0 .01"}></path>{" "}
                            <path d={"M5 18l0 .01"}></path>{" "}
                          </svg>{" "}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          aria-label={"Layout"}
                          className={"pn-nav-link"}
                          data-workspace-group={"tab-group-21"}
                          target={"#"}
                          group={"tab-group-21"}
                        >
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
                            className={"pn-icon pn-nav-link-icon"}
                          >
                            {" "}
                            <path
                              d={
                                "M4 6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -1"
                              }
                            ></path>{" "}
                            <path
                              d={
                                "M4 15a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -3"
                              }
                            ></path>{" "}
                            <path
                              d={
                                "M14 6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -12"
                              }
                            ></path>{" "}
                          </svg>{" "}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          aria-disabled={"true"}
                          aria-label={"Calendar"}
                          className={"pn-nav-link pn-disabled"}
                          data-workspace-group={"tab-group-21"}
                          target={"#"}
                          group={"tab-group-21"}
                        >
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
                            className={"pn-icon pn-nav-link-icon"}
                          >
                            {" "}
                            <path
                              d={
                                "M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12"
                              }
                            ></path>{" "}
                            <path d={"M16 3v4"}></path>{" "}
                            <path d={"M8 3v4"}></path>{" "}
                            <path d={"M4 11h16"}></path>{" "}
                            <path d={"M11 15h1"}></path>{" "}
                            <path d={"M12 15v3"}></path>{" "}
                          </svg>{" "}
                        </WorkspaceTab>{" "}
                        <WorkspaceTab
                          aria-label={"Files"}
                          className={"pn-nav-link"}
                          data-workspace-group={"tab-group-21"}
                          target={"#"}
                          group={"tab-group-21"}
                        >
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
                            className={"pn-icon pn-nav-link-icon"}
                          >
                            {" "}
                            <path d={"M15 3v4a1 1 0 0 0 1 1h4"}></path>{" "}
                            <path
                              d={
                                "M18 17h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h4l5 5v7a2 2 0 0 1 -2 2"
                              }
                            ></path>{" "}
                            <path
                              d={
                                "M16 17v2a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2"
                              }
                            ></path>{" "}
                          </svg>{" "}
                        </WorkspaceTab>{" "}
                      </nav>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  )
}
