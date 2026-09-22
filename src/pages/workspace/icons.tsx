import { IconGhost, IconDownload } from "@tabler/icons-react";
import {
  FeatureCard,
  FeatureCardDecoration,
  FeatureCardContent,
} from "@/registry/overtrue/feature-card";
// Keep page composition editable; interaction belongs in the shared components.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  WorkspaceButton,
  WorkspaceLink,
} from "@/components/overtrue/workspace/primitives";
export default function Page() {
  return (
    <div data-workspace-page="icons" className="pn-page-wrapper">
      {" "}
      <div className={"pn-page-header pn-d-print-none"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-g-2 pn-align-items-center"}>
            {" "}
            <div className={"pn-col"}>
              {" "}
              <h1 className={"pn-page-title"}>{"Icons"}</h1>{" "}
            </div>{" "}
            <div className={"pn-col-auto pn-ms-auto pn-d-print-none"}>
              {" "}
              <WorkspaceLink
                href={"https://tabler.io/icons"}
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
            <div className={"pn-col-lg-4"}>
              {" "}
              <FeatureCard>
                <FeatureCardDecoration>
                  <IconGhost stroke={1.5} />
                </FeatureCardDecoration>
                <FeatureCardContent>
                  <CardTitle className="text-2xl font-semibold">
                    Tabler Icons
                  </CardTitle>
                  <p className="m-0 text-sm leading-7 text-muted-foreground">
                    We use the MIT-licensed Tabler Icons collection throughout
                    overtrue/ui. Browse{" "}
                    <WorkspaceLink
                      href="https://tabler.io/icons"
                      target="_blank"
                      rel="noopener"
                    >
                      Tabler Icons Website
                    </WorkspaceLink>{" "}
                    for the complete set of SVG and React icons.
                  </p>
                  <WorkspaceButton
                    href="https://tabler.io/icons"
                    className="pn-btn pn-btn-primary"
                    target="_blank"
                    rel="noopener"
                  >
                    <IconDownload size={18} /> Download icons
                  </WorkspaceButton>
                </FeatureCardContent>
              </FeatureCard>{" "}
            </div>{" "}
            <div className={"pn-col"}>
              {" "}
              <div className={"pn-row pn-row-cards"}>
                {" "}
                <div className={"pn-col-12"}>
                  {" "}
                  <Card className={"pn-card"}>
                    {" "}
                    <CardHeader className={"pn-card-header"}>
                      {" "}
                      <CardTitle className={"pn-card-title"}>
                        {"Interface icons"}
                      </CardTitle>{" "}
                    </CardHeader>{" "}
                    <CardContent className={"pn-card-body pn-p-0"}>
                      {" "}
                      <div className={"pn-demo-icons-list-wrap"}>
                        {" "}
                        <div className={"pn-demo-icons-list"}>
                          {" "}
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"a-b-2"}
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
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M16 21h3c.81 0 1.48 -.67 1.48 -1.48l.02 -.02c0 -.82 -.69 -1.5 -1.5 -1.5h-3v3"
                                }
                              ></path>{" "}
                              <path
                                d={
                                  "M16 15h2.5c.84 -.01 1.5 .66 1.5 1.5s-.66 1.5 -1.5 1.5h-2.5v-3"
                                }
                              ></path>{" "}
                              <path
                                d={"M4 9v-4c0 -1.036 .895 -2 2 -2s2 .964 2 2v4"}
                              ></path>{" "}
                              <path
                                d={
                                  "M2.99 11.98a9 9 0 0 0 9 9m9 -9a9 9 0 0 0 -9 -9"
                                }
                              ></path>{" "}
                              <path d={"M8 7h-4"}></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"a-b-off"}
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
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={"M3 16v-5.5a2.5 2.5 0 0 1 5 0v5.5m0 -4h-5"}
                              ></path>{" "}
                              <path d={"M12 12v6"}></path>{" "}
                              <path d={"M12 6v2"}></path>{" "}
                              <path
                                d={
                                  "M16 8h3a2 2 0 1 1 0 4h-3m3 0a2 2 0 0 1 .83 3.82m-3.83 -3.82v-4"
                                }
                              ></path>{" "}
                              <path d={"M3 3l18 18"}></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"a-b"}
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
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={"M3 16v-5.5a2.5 2.5 0 0 1 5 0v5.5m0 -4h-5"}
                              ></path>{" "}
                              <path d={"M12 6l0 12"}></path>{" "}
                              <path
                                d={
                                  "M16 16v-8h3a2 2 0 0 1 0 4h-3m3 0a2 2 0 0 1 0 4h-3"
                                }
                              ></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"abacus-off"}
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
                              className={"pn-icon"}
                            >
                              {" "}
                              <path d={"M5 5v16"}></path>{" "}
                              <path d={"M19 21v-2m0 -4v-12"}></path>{" "}
                              <path d={"M5 7h2m4 0h8"}></path>{" "}
                              <path d={"M5 15h10"}></path>{" "}
                              <path d={"M8 13v4"}></path>{" "}
                              <path d={"M11 13v4"}></path>{" "}
                              <path d={"M16 16v1"}></path>{" "}
                              <path d={"M14 5v4"}></path>{" "}
                              <path d={"M11 5v2"}></path>{" "}
                              <path d={"M8 8v1"}></path>{" "}
                              <path d={"M3 21h18"}></path>{" "}
                              <path d={"M3 3l18 18"}></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"abacus"}
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
                              className={"pn-icon"}
                            >
                              {" "}
                              <path d={"M5 3v18"}></path>{" "}
                              <path d={"M19 21v-18"}></path>{" "}
                              <path d={"M5 7h14"}></path>{" "}
                              <path d={"M5 15h14"}></path>{" "}
                              <path d={"M8 13v4"}></path>{" "}
                              <path d={"M11 13v4"}></path>{" "}
                              <path d={"M16 13v4"}></path>{" "}
                              <path d={"M14 5v4"}></path>{" "}
                              <path d={"M11 5v4"}></path>{" "}
                              <path d={"M8 5v4"}></path>{" "}
                              <path d={"M3 21h18"}></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"abc"}
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
                              className={"pn-icon"}
                            >
                              {" "}
                              <path d={"M3 16v-6a2 2 0 1 1 4 0v6"}></path>{" "}
                              <path d={"M3 13h4"}></path>{" "}
                              <path
                                d={"M10 8v6a2 2 0 1 0 4 0v-1a2 2 0 1 0 -4 0v1"}
                              ></path>{" "}
                              <path
                                d={
                                  "M20.732 12a2 2 0 0 0 -3.732 1v1a2 2 0 0 0 3.726 1.01"
                                }
                              ></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"/docs"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"access-point-off"}
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
                              className={"pn-icon"}
                            >
                              {" "}
                              <path d={"M3 3l18 18"}></path>{" "}
                              <path
                                d={"M14.828 9.172a4 4 0 0 1 1.172 2.828"}
                              ></path>{" "}
                              <path
                                d={"M17.657 6.343a8 8 0 0 1 1.635 8.952"}
                              ></path>{" "}
                              <path
                                d={"M9.168 14.828a4 4 0 0 1 0 -5.656"}
                              ></path>{" "}
                              <path
                                d={"M6.337 17.657a8 8 0 0 1 0 -11.314"}
                              ></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"access-point"}
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
                              className={"pn-icon"}
                            >
                              {" "}
                              <path d={"M12 12l0 .01"}></path>{" "}
                              <path
                                d={"M14.828 9.172a4 4 0 0 1 0 5.656"}
                              ></path>{" "}
                              <path
                                d={"M17.657 6.343a8 8 0 0 1 0 11.314"}
                              ></path>{" "}
                              <path
                                d={"M9.168 14.828a4 4 0 0 1 0 -5.656"}
                              ></path>{" "}
                              <path
                                d={"M6.337 17.657a8 8 0 0 1 0 -11.314"}
                              ></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"accessible-off"}
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
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M10 16.5l2 -3l2 3m-2 -3v-1.5m2.627 -1.376l.373 -.124m-6 0l2.231 .744"
                                }
                              ></path>{" "}
                              <path
                                d={
                                  "M20.042 16.045a9 9 0 0 0 -12.087 -12.087m-2.318 1.677a9 9 0 1 0 12.725 12.73"
                                }
                              ></path>{" "}
                              <path d={"M12 8a.5 .5 0 1 0 -.5 -.5"}></path>{" "}
                              <path d={"M3 3l18 18"}></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"accessible"}
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
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={"M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"}
                              ></path>{" "}
                              <path
                                d={"M10 16.5l2 -3l2 3m-2 -3v-2l3 -1m-6 0l3 1"}
                              ></path>{" "}
                              <path
                                d={"M11.5 7.5a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0"}
                                fill={"currentColor"}
                              ></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"acorn"}
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
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M18 10l-.45 4.1a8.36 8.36 0 0 1 -5.18 6.83a1 1 0 0 1 -.74 0a8.36 8.36 0 0 1 -5.18 -6.83l-.45 -4.1"
                                }
                              ></path>{" "}
                              <path d={"M13 3a4.9 4.9 0 0 0 -1 3"}></path>{" "}
                              <path
                                d={
                                  "M8 6h8a3 3 0 0 1 3 3a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1a3 3 0 0 1 3 -3"
                                }
                              ></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"acrobatic"}
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
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M13.207 3l-6.735 2.462a1 1 0 0 0 -.364 1.646l1.892 1.892"
                                }
                              ></path>{" "}
                              <path
                                d={
                                  "M10.5 8.25l1.5 -.25h3.174a2 2 0 0 1 1.411 .583l1.422 1.417"
                                }
                              ></path>{" "}
                              <path d={"M8 9c0 4.5 1.781 5.14 3 5.5"}></path>{" "}
                              <path
                                d={"M13.007 21h-1a1 1 0 0 1 -1 -1l-.007 -5.5"}
                              ></path>{" "}
                              <path
                                d={"M12.007 14a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"}
                              ></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"/docs"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"activity-heartbeat"}
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
                              className={"pn-icon"}
                            >
                              <path
                                d={"M3 12h4.5l1.5 -6l4 12l2 -9l1.5 3h4.5"}
                              ></path>
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"activity"}
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
                              className={"pn-icon"}
                            >
                              <path d={"M3 12h4l3 8l4 -16l3 8h4"}></path>
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"ad-2"}
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
                              className={"pn-icon"}
                            >
                              {" "}
                              <path d={"M11.933 5h-6.933v16h13v-8"}></path>{" "}
                              <path d={"M14 17h-5"}></path>{" "}
                              <path d={"M9 13h5v-4h-5v4"}></path>{" "}
                              <path d={"M15 5v-2"}></path>{" "}
                              <path d={"M18 6l2 -2"}></path>{" "}
                              <path d={"M19 9h2"}></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"ad-circle-off"}
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
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M4.91 4.949a9.968 9.968 0 0 0 -2.91 7.051c0 5.523 4.477 10 10 10a9.968 9.968 0 0 0 7.05 -2.909"
                                }
                              ></path>{" "}
                              <path
                                d={
                                  "M20.778 16.793a9.955 9.955 0 0 0 1.222 -4.793c0 -5.523 -4.477 -10 -10 -10c-1.74 0 -3.376 .444 -4.8 1.225"
                                }
                              ></path>{" "}
                              <path
                                d={"M7 15v-4.5a1.5 1.5 0 0 1 2.138 -1.358"}
                              ></path>{" "}
                              <path
                                d={
                                  "M9.854 9.853c.094 .196 .146 .415 .146 .647v4.5"
                                }
                              ></path>{" "}
                              <path d={"M7 13h3"}></path>{" "}
                              <path d={"M14 14v1h1"}></path>{" "}
                              <path d={"M17 13v-2a2 2 0 0 0 -2 -2h-1v1"}></path>{" "}
                              <path d={"M3 3l18 18"}></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"ad-circle"}
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
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={"M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0"}
                              ></path>{" "}
                              <path
                                d={"M7 15v-4.5a1.5 1.5 0 0 1 3 0v4.5"}
                              ></path>{" "}
                              <path d={"M7 13h3"}></path>{" "}
                              <path
                                d={
                                  "M14 9v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1"
                                }
                              ></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"ad-off"}
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
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M9 5h10a2 2 0 0 1 2 2v10m-2 2h-14a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2"
                                }
                              ></path>{" "}
                              <path d={"M7 15v-4a2 2 0 0 1 2 -2m2 2v4"}></path>{" "}
                              <path d={"M7 13h4"}></path>{" "}
                              <path d={"M17 9v4"}></path>{" "}
                              <path
                                d={"M16.115 12.131c.33 .149 .595 .412 .747 .74"}
                              ></path>{" "}
                              <path d={"M3 3l18 18"}></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"ad"}
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
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10"
                                }
                              ></path>{" "}
                              <path d={"M7 15v-4a2 2 0 0 1 4 0v4"}></path>{" "}
                              <path d={"M7 13l4 0"}></path>{" "}
                              <path
                                d={"M17 9v6h-1.5a1.5 1.5 0 1 1 1.5 -1.5"}
                              ></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"/docs"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"address-book-off"}
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
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M8 4h10a2 2 0 0 1 2 2v10m-.57 3.399c-.363 .37 -.87 .601 -1.43 .601h-10a2 2 0 0 1 -2 -2v-12"
                                }
                              ></path>{" "}
                              <path d={"M10 16h6"}></path>{" "}
                              <path
                                d={"M11 11a2 2 0 0 0 2 2m2 -2a2 2 0 0 0 -2 -2"}
                              ></path>{" "}
                              <path d={"M4 8h3"}></path>{" "}
                              <path d={"M4 12h3"}></path>{" "}
                              <path d={"M4 16h3"}></path>{" "}
                              <path d={"M3 3l18 18"}></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>{" "}
                          <div></div> <div></div> <div></div> <div></div>{" "}
                          <div></div> <div></div> <div></div> <div></div>{" "}
                          <div></div> <div></div> <div></div> <div></div>{" "}
                          <div></div> <div></div> <div></div> <div></div>{" "}
                          <div></div> <div></div> <div></div> <div></div>{" "}
                          <div></div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </CardContent>{" "}
                  </Card>{" "}
                </div>{" "}
                <div className={"pn-col-12"}>
                  {" "}
                  <Card className={"pn-card"}>
                    {" "}
                    <CardHeader className={"pn-card-header"}>
                      {" "}
                      <CardTitle className={"pn-card-title"}>
                        {"Filled icons"}
                      </CardTitle>{" "}
                    </CardHeader>{" "}
                    <CardContent className={"pn-card-body pn-p-0"}>
                      {" "}
                      <div className={"pn-demo-icons-list-wrap"}>
                        {" "}
                        <div className={"pn-demo-icons-list"}>
                          {" "}
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"accessible"}
                          >
                            {" "}
                            <svg
                              xmlns={"http://www.w3.org/2000/svg"}
                              width={"24"}
                              height={"24"}
                              viewBox={"0 0 24 24"}
                              fill={"currentColor"}
                              aria-hidden={"true"}
                              focusable={"false"}
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.051 6.844a1 1 0 0 0 -1.152 -.663l-.113 .03l-2.684 .895l-2.684 -.895l-.113 -.03a1 1 0 0 0 -.628 1.884l.109 .044l2.316 .771v.976l-1.832 2.75l-.06 .1a1 1 0 0 0 .237 1.21l.1 .076l.101 .06a1 1 0 0 0 1.21 -.237l.076 -.1l1.168 -1.752l1.168 1.752l.07 .093a1 1 0 0 0 1.653 -1.102l-.059 -.1l-1.832 -2.75v-.977l2.316 -.771l.109 -.044a1 1 0 0 0 .524 -1.221zm-3.949 -4.184a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0 -3"
                                }
                              ></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"ad-circle"}
                          >
                            {" "}
                            <svg
                              xmlns={"http://www.w3.org/2000/svg"}
                              width={"24"}
                              height={"24"}
                              viewBox={"0 0 24 24"}
                              fill={"currentColor"}
                              aria-hidden={"true"}
                              focusable={"false"}
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M12 2c5.523 0 10 4.477 10 10s-4.477 10 -10 10c-5.43 0 -9.848 -4.327 -9.996 -9.72l-.004 -.28l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm-3.5 6a2.5 2.5 0 0 0 -2.495 2.336l-.005 .164v4.5l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-1h1v1l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4.5l-.005 -.164a2.5 2.5 0 0 0 -2.495 -2.336zm6.5 0h-1a1 1 0 0 0 -1 1v6a1 1 0 0 0 1 1h1a3 3 0 0 0 3 -3v-2a3 3 0 0 0 -3 -3zm0 2a1 1 0 0 1 1 1v2a1 1 0 0 1 -.883 .993l-.117 .007v-4zm-6.5 0a.5 .5 0 0 1 .492 .41l.008 .09v1.5h-1v-1.5l.008 -.09a.5 .5 0 0 1 .492 -.41z"
                                }
                              ></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"ad"}
                          >
                            {" "}
                            <svg
                              xmlns={"http://www.w3.org/2000/svg"}
                              width={"24"}
                              height={"24"}
                              viewBox={"0 0 24 24"}
                              fill={"currentColor"}
                              aria-hidden={"true"}
                              focusable={"false"}
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M19 4h-14a3 3 0 0 0 -3 3v10a3 3 0 0 0 3 3h14a3 3 0 0 0 3 -3v-10a3 3 0 0 0 -3 -3zm-10 4a3 3 0 0 1 2.995 2.824l.005 .176v4a1 1 0 0 1 -1.993 .117l-.007 -.117v-1h-2v1a1 1 0 0 1 -1.993 .117l-.007 -.117v-4a3 3 0 0 1 3 -3zm0 2a1 1 0 0 0 -.993 .883l-.007 .117v1h2v-1a1 1 0 0 0 -1 -1zm8 -2a1 1 0 0 1 .993 .883l.007 .117v6a1 1 0 0 1 -.883 .993l-.117 .007h-1.5a2.5 2.5 0 1 1 .326 -4.979l.174 .029v-2.05a1 1 0 0 1 .883 -.993l.117 -.007zm-1.41 5.008l-.09 -.008a.5 .5 0 0 0 -.09 .992l.09 .008h.5v-.5l-.008 -.09a.5 .5 0 0 0 -.318 -.379l-.084 -.023z"
                                }
                              ></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"/docs"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"adjustments-horizontal"}
                          >
                            {" "}
                            <svg
                              xmlns={"http://www.w3.org/2000/svg"}
                              width={"24"}
                              height={"24"}
                              viewBox={"0 0 24 24"}
                              fill={"currentColor"}
                              aria-hidden={"true"}
                              focusable={"false"}
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M17 15c1.306 0 2.418 .835 2.83 2h.17a1 1 0 0 1 0 2h-.171a3.001 3.001 0 0 1 -5.658 0h-10.171a1 1 0 0 1 0 -2h10.173c.41 -1.165 1.52 -2 2.827 -2m-9 -6c1.306 0 2.418 .835 2.83 2h9.17a1 1 0 0 1 0 2h-9.171a3.001 3.001 0 0 1 -5.658 0h-1.171a1 1 0 0 1 0 -2h1.173c.41 -1.165 1.52 -2 2.827 -2m6 -6c1.306 0 2.418 .835 2.83 2h3.17a1 1 0 0 1 0 2h-3.171a3.001 3.001 0 0 1 -5.658 0h-7.171a1 1 0 1 1 0 -2h7.173c.41 -1.165 1.52 -2 2.827 -2"
                                }
                              ></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"adjustments"}
                          >
                            {" "}
                            <svg
                              xmlns={"http://www.w3.org/2000/svg"}
                              width={"24"}
                              height={"24"}
                              viewBox={"0 0 24 24"}
                              fill={"currentColor"}
                              aria-hidden={"true"}
                              focusable={"false"}
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M6 3a1 1 0 0 1 .993 .883l.007 .117v3.171a3.001 3.001 0 0 1 0 5.658v7.171a1 1 0 0 1 -1.993 .117l-.007 -.117v-7.17a3.002 3.002 0 0 1 -1.995 -2.654l-.005 -.176l.005 -.176a3.002 3.002 0 0 1 1.995 -2.654v-3.17a1 1 0 0 1 1 -1z"
                                }
                              ></path>{" "}
                              <path
                                d={
                                  "M12 3a1 1 0 0 1 .993 .883l.007 .117v9.171a3.001 3.001 0 0 1 0 5.658v1.171a1 1 0 0 1 -1.993 .117l-.007 -.117v-1.17a3.002 3.002 0 0 1 -1.995 -2.654l-.005 -.176l.005 -.176a3.002 3.002 0 0 1 1.995 -2.654v-9.17a1 1 0 0 1 1 -1z"
                                }
                              ></path>{" "}
                              <path
                                d={
                                  "M18 3a1 1 0 0 1 .993 .883l.007 .117v.171a3.001 3.001 0 0 1 0 5.658v10.171a1 1 0 0 1 -1.993 .117l-.007 -.117v-10.17a3.002 3.002 0 0 1 -1.995 -2.654l-.005 -.176l.005 -.176a3.002 3.002 0 0 1 1.995 -2.654v-.17a1 1 0 0 1 1 -1z"
                                }
                              ></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"aerial-lift"}
                          >
                            {" "}
                            <svg
                              xmlns={"http://www.w3.org/2000/svg"}
                              width={"24"}
                              height={"24"}
                              viewBox={"0 0 24 24"}
                              fill={"currentColor"}
                              aria-hidden={"true"}
                              focusable={"false"}
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M19.876 2.008a1 1 0 1 1 .248 1.984l-7.124 .891v2.117h4.2a1 1 0 0 1 .688 .274l.087 .093c2.79 3.417 2.717 9.963 -.226 13.295a1 1 0 0 1 -.749 .338h-10.106a1 1 0 0 1 -.763 -.353c-2.86 -3.373 -2.86 -9.92 0 -13.294a1 1 0 0 1 .763 -.353h4.106v-1.867l-6.876 .86a1 1 0 0 1 -1.095 -.754l-.021 -.115a1 1 0 0 1 .868 -1.116l7.996 -1l.011 -.001l.008 -.001zm-8.876 6.992h-3.617l-.051 .072c-.718 1.042 -1.149 2.41 -1.292 3.844l-.008 .084h4.968zm5.698 0h-3.698v4h4.979l-.005 -.072c-.123 -1.436 -.533 -2.811 -1.232 -3.864z"
                                }
                              ></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"affiliate"}
                          >
                            {" "}
                            <svg
                              xmlns={"http://www.w3.org/2000/svg"}
                              width={"24"}
                              height={"24"}
                              viewBox={"0 0 24 24"}
                              fill={"currentColor"}
                              aria-hidden={"true"}
                              focusable={"false"}
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M18.5 3a2.5 2.5 0 1 1 -.912 4.828l-4.556 4.555a5.475 5.475 0 0 1 .936 3.714l2.624 .787a2.5 2.5 0 1 1 -.575 1.916l-2.623 -.788a5.5 5.5 0 0 1 -10.39 -2.29l-.004 -.222l.004 -.221a5.5 5.5 0 0 1 2.984 -4.673l-.788 -2.624a2.498 2.498 0 0 1 -2.194 -2.304l-.006 -.178l.005 -.164a2.5 2.5 0 1 1 4.111 2.071l.787 2.625a5.475 5.475 0 0 1 3.714 .936l4.555 -4.556a2.487 2.487 0 0 1 -.167 -.748l-.005 -.164l.005 -.164a2.5 2.5 0 0 1 2.495 -2.336z"
                                }
                              ></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"air-balloon"}
                          >
                            {" "}
                            <svg
                              xmlns={"http://www.w3.org/2000/svg"}
                              width={"24"}
                              height={"24"}
                              viewBox={"0 0 24 24"}
                              fill={"currentColor"}
                              aria-hidden={"true"}
                              focusable={"false"}
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M13 18a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2v-1a2 2 0 0 1 2 -2z"
                                }
                              ></path>{" "}
                              <path
                                d={
                                  "M12 1a7 7 0 0 1 7 7c0 4.185 -3.297 9 -7 9s-7 -4.815 -7 -9a7 7 0 0 1 7 -7"
                                }
                              ></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"alarm-minus"}
                          >
                            {" "}
                            <svg
                              xmlns={"http://www.w3.org/2000/svg"}
                              width={"24"}
                              height={"24"}
                              viewBox={"0 0 24 24"}
                              fill={"currentColor"}
                              aria-hidden={"true"}
                              focusable={"false"}
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M16 6.072a8 8 0 1 1 -11.995 7.213l-.005 -.285l.005 -.285a8 8 0 0 1 11.995 -6.643zm-2 5.928h-4l-.117 .007a1 1 0 0 0 .117 1.993h4l.117 -.007a1 1 0 0 0 -.117 -1.993z"
                                }
                              ></path>{" "}
                              <path
                                d={
                                  "M6.412 3.191a1 1 0 0 1 1.273 1.539l-.097 .08l-2.75 2a1 1 0 0 1 -1.273 -1.54l.097 -.08l2.75 -2z"
                                }
                              ></path>{" "}
                              <path
                                d={
                                  "M16.191 3.412a1 1 0 0 1 1.291 -.288l.106 .067l2.75 2a1 1 0 0 1 -1.07 1.685l-.106 -.067l-2.75 -2a1 1 0 0 1 -.22 -1.397z"
                                }
                              ></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"alarm-plus"}
                          >
                            {" "}
                            <svg
                              xmlns={"http://www.w3.org/2000/svg"}
                              width={"24"}
                              height={"24"}
                              viewBox={"0 0 24 24"}
                              fill={"currentColor"}
                              aria-hidden={"true"}
                              focusable={"false"}
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M16 6.072a8 8 0 1 1 -11.995 7.213l-.005 -.285l.005 -.285a8 8 0 0 1 11.995 -6.643zm-4 3.928a1 1 0 0 0 -1 1v1h-1l-.117 .007a1 1 0 0 0 .117 1.993h1v1l.007 .117a1 1 0 0 0 1.993 -.117v-1h1l.117 -.007a1 1 0 0 0 -.117 -1.993h-1v-1l-.007 -.117a1 1 0 0 0 -.993 -.883z"
                                }
                              ></path>{" "}
                              <path
                                d={
                                  "M6.412 3.191a1 1 0 0 1 1.273 1.539l-.097 .08l-2.75 2a1 1 0 0 1 -1.273 -1.54l.097 -.08l2.75 -2z"
                                }
                              ></path>{" "}
                              <path
                                d={
                                  "M16.191 3.412a1 1 0 0 1 1.291 -.288l.106 .067l2.75 2a1 1 0 0 1 -1.07 1.685l-.106 -.067l-2.75 -2a1 1 0 0 1 -.22 -1.397z"
                                }
                              ></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"alarm-snooze"}
                          >
                            {" "}
                            <svg
                              xmlns={"http://www.w3.org/2000/svg"}
                              width={"24"}
                              height={"24"}
                              viewBox={"0 0 24 24"}
                              fill={"currentColor"}
                              aria-hidden={"true"}
                              focusable={"false"}
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M16 6.072a8 8 0 1 1 -11.995 7.213l-.005 -.285l.005 -.285a8 8 0 0 1 11.995 -6.643zm-2 3.928h-4l-.117 .007a1 1 0 0 0 -.883 .993l.007 .117a1 1 0 0 0 .993 .883h1.584l-2.291 2.293l-.076 .084c-.514 .637 -.07 1.623 .783 1.623h4l.117 -.007a1 1 0 0 0 .883 -.993l-.007 -.117a1 1 0 0 0 -.993 -.883h-1.586l2.293 -2.293l.076 -.084c.514 -.637 .07 -1.623 -.783 -1.623z"
                                }
                              ></path>{" "}
                              <path
                                d={
                                  "M6.412 3.191a1 1 0 0 1 1.273 1.539l-.097 .08l-2.75 2a1 1 0 0 1 -1.273 -1.54l.097 -.08l2.75 -2z"
                                }
                              ></path>{" "}
                              <path
                                d={
                                  "M16.191 3.412a1 1 0 0 1 1.291 -.288l.106 .067l2.75 2a1 1 0 0 1 -1.07 1.685l-.106 -.067l-2.75 -2a1 1 0 0 1 -.22 -1.397z"
                                }
                              ></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"alarm"}
                          >
                            {" "}
                            <svg
                              xmlns={"http://www.w3.org/2000/svg"}
                              width={"24"}
                              height={"24"}
                              viewBox={"0 0 24 24"}
                              fill={"currentColor"}
                              aria-hidden={"true"}
                              focusable={"false"}
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M16 6.072a8 8 0 1 1 -11.995 7.213l-.005 -.285l.005 -.285a8 8 0 0 1 11.995 -6.643zm-4 2.928a1 1 0 0 0 -1 1v3l.007 .117a1 1 0 0 0 .993 .883h2l.117 -.007a1 1 0 0 0 .883 -.993l-.007 -.117a1 1 0 0 0 -.993 -.883h-1v-2l-.007 -.117a1 1 0 0 0 -.993 -.883z"
                                }
                              ></path>{" "}
                              <path
                                d={
                                  "M6.412 3.191a1 1 0 0 1 1.273 1.539l-.097 .08l-2.75 2a1 1 0 0 1 -1.273 -1.54l.097 -.08l2.75 -2z"
                                }
                              ></path>{" "}
                              <path
                                d={
                                  "M16.191 3.412a1 1 0 0 1 1.291 -.288l.106 .067l2.75 2a1 1 0 0 1 -1.07 1.685l-.106 -.067l-2.75 -2a1 1 0 0 1 -.22 -1.397z"
                                }
                              ></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"alert-circle"}
                          >
                            {" "}
                            <svg
                              xmlns={"http://www.w3.org/2000/svg"}
                              width={"24"}
                              height={"24"}
                              viewBox={"0 0 24 24"}
                              fill={"currentColor"}
                              aria-hidden={"true"}
                              focusable={"false"}
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm.01 13l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -8a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z"
                                }
                              ></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"alert-hexagon"}
                          >
                            {" "}
                            <svg
                              xmlns={"http://www.w3.org/2000/svg"}
                              width={"24"}
                              height={"24"}
                              viewBox={"0 0 24 24"}
                              fill={"currentColor"}
                              aria-hidden={"true"}
                              focusable={"false"}
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M10.425 1.414a3.33 3.33 0 0 1 3.026 -.097l.19 .097l6.775 3.995l.096 .063l.092 .077l.107 .075a3.224 3.224 0 0 1 1.266 2.188l.018 .202l.005 .204v7.284c0 1.106 -.57 2.129 -1.454 2.693l-.17 .1l-6.803 4.302c-.918 .504 -2.019 .535 -3.004 .068l-.196 -.1l-6.695 -4.237a3.225 3.225 0 0 1 -1.671 -2.619l-.007 -.207v-7.285c0 -1.106 .57 -2.128 1.476 -2.705l6.95 -4.098zm1.585 13.586l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -8a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z"
                                }
                              ></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"alert-octagon"}
                          >
                            {" "}
                            <svg
                              xmlns={"http://www.w3.org/2000/svg"}
                              width={"24"}
                              height={"24"}
                              viewBox={"0 0 24 24"}
                              fill={"currentColor"}
                              aria-hidden={"true"}
                              focusable={"false"}
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M14.897 1a4 4 0 0 1 2.664 1.016l.165 .156l4.1 4.1a4 4 0 0 1 1.168 2.605l.006 .227v5.794a4 4 0 0 1 -1.016 2.664l-.156 .165l-4.1 4.1a4 4 0 0 1 -2.603 1.168l-.227 .006h-5.795a3.999 3.999 0 0 1 -2.664 -1.017l-.165 -.156l-4.1 -4.1a4 4 0 0 1 -1.168 -2.604l-.006 -.227v-5.794a4 4 0 0 1 1.016 -2.664l.156 -.165l4.1 -4.1a4 4 0 0 1 2.605 -1.168l.227 -.006h5.793zm-2.887 14l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -8a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z"
                                }
                              ></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"/docs"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"alert-square-rounded"}
                          >
                            {" "}
                            <svg
                              xmlns={"http://www.w3.org/2000/svg"}
                              width={"24"}
                              height={"24"}
                              viewBox={"0 0 24 24"}
                              fill={"currentColor"}
                              aria-hidden={"true"}
                              focusable={"false"}
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M12 2l.642 .005l.616 .017l.299 .013l.579 .034l.553 .046c4.687 .455 6.65 2.333 7.166 6.906l.03 .29l.046 .553l.041 .727l.006 .15l.017 .617l.005 .642l-.005 .642l-.017 .616l-.013 .299l-.034 .579l-.046 .553c-.455 4.687 -2.333 6.65 -6.906 7.166l-.29 .03l-.553 .046l-.727 .041l-.15 .006l-.617 .017l-.642 .005l-.642 -.005l-.616 -.017l-.299 -.013l-.579 -.034l-.553 -.046c-4.687 -.455 -6.65 -2.333 -7.166 -6.906l-.03 -.29l-.046 -.553l-.041 -.727l-.006 -.15l-.017 -.617l-.004 -.318v-.648l.004 -.318l.017 -.616l.013 -.299l.034 -.579l.046 -.553c.455 -4.687 2.333 -6.65 6.906 -7.166l.29 -.03l.553 -.046l.727 -.041l.15 -.006l.617 -.017c.21 -.003 .424 -.005 .642 -.005zm.01 13l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -8a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z"
                                }
                              ></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"alert-square"}
                          >
                            {" "}
                            <svg
                              xmlns={"http://www.w3.org/2000/svg"}
                              width={"24"}
                              height={"24"}
                              viewBox={"0 0 24 24"}
                              fill={"currentColor"}
                              aria-hidden={"true"}
                              focusable={"false"}
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M19 2a3 3 0 0 1 2.995 2.824l.005 .176v14a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-14a3 3 0 0 1 2.824 -2.995l.176 -.005h14zm-6.99 13l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -8a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z"
                                }
                              ></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"alert-triangle"}
                          >
                            {" "}
                            <svg
                              xmlns={"http://www.w3.org/2000/svg"}
                              width={"24"}
                              height={"24"}
                              viewBox={"0 0 24 24"}
                              fill={"currentColor"}
                              aria-hidden={"true"}
                              focusable={"false"}
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M12 1.67c.955 0 1.845 .467 2.39 1.247l.105 .16l8.114 13.548a2.914 2.914 0 0 1 -2.307 4.363l-.195 .008h-16.225a2.914 2.914 0 0 1 -2.582 -4.2l.099 -.185l8.11 -13.538a2.914 2.914 0 0 1 2.491 -1.403zm.01 13.33l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -7a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z"
                                }
                              ></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"https://tabler.io/icons"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"alien"}
                          >
                            {" "}
                            <svg
                              xmlns={"http://www.w3.org/2000/svg"}
                              width={"24"}
                              height={"24"}
                              viewBox={"0 0 24 24"}
                              fill={"currentColor"}
                              aria-hidden={"true"}
                              focusable={"false"}
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M12.004 2c4.942 0 8.288 2.503 8.85 6.444a12.884 12.884 0 0 1 -2.163 9.308a11.794 11.794 0 0 1 -3.51 3.356c-1.982 1.19 -4.376 1.19 -6.373 -.008a11.763 11.763 0 0 1 -3.489 -3.34a12.808 12.808 0 0 1 -2.171 -9.306c.564 -3.95 3.91 -6.454 8.856 -6.454zm1.913 14.6a1 1 0 0 0 -1.317 -.517l-.146 .055a1.5 1.5 0 0 1 -1.054 -.055l-.11 -.04a1 1 0 0 0 -.69 1.874a3.5 3.5 0 0 0 2.8 0a1 1 0 0 0 .517 -1.317zm-5.304 -6.39a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -1.497l-2 -2zm8.094 .083a1 1 0 0 0 -1.414 0l-2 2l-.083 .094a1 1 0 0 0 1.497 1.32l2 -2l.083 -.094a1 1 0 0 0 -.083 -1.32z"
                                }
                              ></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>
                          <WorkspaceLink
                            href={"/docs"}
                            target={"_blank"}
                            rel={"noopener"}
                            className={"pn-demo-icons-list-item"}
                            title={"align-box-bottom-center"}
                          >
                            {" "}
                            <svg
                              xmlns={"http://www.w3.org/2000/svg"}
                              width={"24"}
                              height={"24"}
                              viewBox={"0 0 24 24"}
                              fill={"currentColor"}
                              aria-hidden={"true"}
                              focusable={"false"}
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M18.333 2c1.96 0 3.56 1.537 3.662 3.472l.005 .195v12.666c0 1.96 -1.537 3.56 -3.472 3.662l-.195 .005h-12.666a3.667 3.667 0 0 1 -3.662 -3.472l-.005 -.195v-12.666c0 -1.96 1.537 -3.56 3.472 -3.662l.195 -.005h12.666zm-9.333 13a1 1 0 0 0 -1 1v2l.007 .117a1 1 0 0 0 1.993 -.117v-2l-.007 -.117a1 1 0 0 0 -.993 -.883zm3 -4a1 1 0 0 0 -1 1v6l.007 .117a1 1 0 0 0 1.993 -.117v-6l-.007 -.117a1 1 0 0 0 -.993 -.883zm3 2a1 1 0 0 0 -1 1v4l.007 .117a1 1 0 0 0 1.993 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z"
                                }
                              ></path>{" "}
                            </svg>{" "}
                          </WorkspaceLink>{" "}
                          <div></div> <div></div> <div></div> <div></div>{" "}
                          <div></div> <div></div> <div></div> <div></div>{" "}
                          <div></div> <div></div> <div></div> <div></div>{" "}
                          <div></div> <div></div> <div></div> <div></div>{" "}
                          <div></div> <div></div> <div></div> <div></div>{" "}
                          <div></div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </CardContent>{" "}
                  </Card>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
