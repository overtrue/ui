// Keep page composition editable; interaction belongs in the shared components.
import type { CSSProperties } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import {
  WorkspaceBadge,
  WorkspaceButton,
  WorkspaceInput,
  WorkspaceLink,
} from "@/components/overtrue/workspace/primitives"
export default function Page() {
  return (
    <div data-workspace-page="tags" className="pn-page-wrapper">
      {" "}
      <div className={"pn-page-header pn-d-print-none"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-g-2 pn-align-items-center"}>
            {" "}
            <div className={"pn-col"}>
              {" "}
              <h1 className={"pn-page-title"}>{"Tags"}</h1>{" "}
              <div className={"pn-text-secondary pn-mt-1"}>
                {
                  "Flexible labels for projects, disciplines, and priorities."
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
          <div
            className={
              "pn-row pn-row-cards pn-row-cols-1 pn-row-cols-md-2 pn-row-cols-lg-3"
            }
          >
            {" "}
            <div className={"pn-col"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Default tags"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"The base tag, for a plain label."}
                  </CardDescription>{" "}
                  <div className={"pn-tag-list"}>
                    {" "}
                    <span className={"pn-tag"}>
                      {" Label 1 "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label 1"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" Label 2 "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label 2"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" Label 3 "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label 3"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" Label 4 "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label 4"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" Label 5 "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label 5"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" Label 6 "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label 6"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" Label 7 "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label 7"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" Label 8 "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label 8"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" Label 9 "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label 9"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" Label 10 "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label 10"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" Label 11 "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label 11"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" Label 12 "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label 12"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" Label 13 "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label 13"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" Label 14 "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label 14"}
                      ></WorkspaceButton>{" "}
                    </span>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Tags with flag"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Pair a tag with a country flag."}
                  </CardDescription>{" "}
                  <div className={"pn-tag-list"}>
                    {" "}
                    <span className={"pn-tag"}>
                      {" "}
                      <span
                        className={
                          "pn-flag pn-flag-xxs pn-flag-country-ad pn-tag-flag"
                        }
                      ></span>
                      {" Andorra "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Andorra"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <span
                        className={
                          "pn-flag pn-flag-xxs pn-flag-country-ae pn-tag-flag"
                        }
                      ></span>
                      {" United Arab Emirates "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove United Arab Emirates"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <span
                        className={
                          "pn-flag pn-flag-xxs pn-flag-country-af pn-tag-flag"
                        }
                      ></span>
                      {" Afghanistan "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Afghanistan"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <span
                        className={
                          "pn-flag pn-flag-xxs pn-flag-country-ag pn-tag-flag"
                        }
                      ></span>
                      {" Antigua "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Antigua"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <span
                        className={
                          "pn-flag pn-flag-xxs pn-flag-country-ai pn-tag-flag"
                        }
                      ></span>
                      {" Anguilla "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Anguilla"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <span
                        className={
                          "pn-flag pn-flag-xxs pn-flag-country-am pn-tag-flag"
                        }
                      ></span>
                      {" Armenia "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Armenia"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <span
                        className={
                          "pn-flag pn-flag-xxs pn-flag-country-ao pn-tag-flag"
                        }
                      ></span>
                      {" Angolan "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Angolan"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <span
                        className={
                          "pn-flag pn-flag-xxs pn-flag-country-aq pn-tag-flag"
                        }
                      ></span>
                      {" Antarctica "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Antarctica"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <span
                        className={
                          "pn-flag pn-flag-xxs pn-flag-country-ar pn-tag-flag"
                        }
                      ></span>
                      {" Argentina "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Argentina"}
                      ></WorkspaceButton>{" "}
                    </span>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Tags with icon"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Add an icon before the label."}
                  </CardDescription>{" "}
                  <div className={"pn-tag-list"}>
                    {" "}
                    <span className={"pn-tag"}>
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
                        className={"pn-icon pn-tag-icon pn-icon-sm"}
                      >
                        {" "}
                        <path
                          d={"M7 5h6a3.5 3.5 0 0 1 0 7h-6l0 -7"}
                        ></path>{" "}
                        <path
                          d={"M13 12h1a3.5 3.5 0 0 1 0 7h-7v-7"}
                        ></path>{" "}
                      </svg>
                      {" bold "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove bold"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
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
                        className={"pn-icon pn-tag-icon pn-icon-sm"}
                      >
                        {" "}
                        <path d={"M11 5l6 0"}></path>{" "}
                        <path d={"M7 19l6 0"}></path>{" "}
                        <path d={"M14 5l-4 14"}></path>{" "}
                      </svg>
                      {" italic "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove italic"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
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
                        className={"pn-icon pn-tag-icon pn-icon-sm"}
                      >
                        {" "}
                        <path d={"M7 5v5a5 5 0 0 0 10 0v-5"}></path>{" "}
                        <path d={"M5 19h14"}></path>{" "}
                      </svg>
                      {" underline "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove underline"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
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
                        className={"pn-icon pn-tag-icon pn-icon-sm"}
                      >
                        {" "}
                        <path
                          d={
                            "M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666"
                          }
                        ></path>{" "}
                        <path
                          d={
                            "M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"
                          }
                        ></path>{" "}
                      </svg>
                      {" copy "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove copy"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
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
                        className={"pn-icon pn-tag-icon pn-icon-sm"}
                      >
                        {" "}
                        <path
                          d={"M3 7a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"}
                        ></path>{" "}
                        <path d={"M3 17a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"}></path>{" "}
                        <path d={"M8.6 8.6l10.4 10.4"}></path>{" "}
                        <path d={"M8.6 15.4l10.4 -10.4"}></path>{" "}
                      </svg>
                      {" scissors "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove scissors"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
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
                        className={"pn-icon pn-tag-icon pn-icon-sm"}
                      >
                        {" "}
                        <path d={"M14 3v4a1 1 0 0 0 1 1h4"}></path>{" "}
                        <path
                          d={
                            "M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"
                          }
                        ></path>{" "}
                        <path d={"M12 11l0 6"}></path>{" "}
                        <path d={"M9 14l6 0"}></path>{" "}
                      </svg>
                      {" file-plus "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove file-plus"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
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
                        className={"pn-icon pn-tag-icon pn-icon-sm"}
                      >
                        {" "}
                        <path d={"M14 3v4a1 1 0 0 0 1 1h4"}></path>{" "}
                        <path
                          d={
                            "M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"
                          }
                        ></path>{" "}
                        <path d={"M9 14l6 0"}></path>{" "}
                      </svg>
                      {" file-minus "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove file-minus"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
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
                        className={"pn-icon pn-tag-icon pn-icon-sm"}
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
                      </svg>
                      {" ghost "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove ghost"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
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
                        className={"pn-icon pn-tag-icon pn-icon-sm"}
                      >
                        {" "}
                        <path
                          d={
                            "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"
                          }
                        ></path>{" "}
                      </svg>
                      {" star "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove star"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
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
                        className={"pn-icon pn-tag-icon pn-icon-sm"}
                      >
                        {" "}
                        <path
                          d={
                            "M17 20h-11a3 3 0 0 1 0 -6h11a3 3 0 0 0 0 6h1a3 3 0 0 0 3 -3v-11a2 2 0 0 0 -2 -2h-10a2 2 0 0 0 -2 2v8"
                          }
                        ></path>{" "}
                      </svg>
                      {" script "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove script"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
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
                        className={"pn-icon pn-tag-icon pn-icon-sm"}
                      >
                        {" "}
                        <path d={"M15 8h.01"}></path>{" "}
                        <path
                          d={
                            "M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12"
                          }
                        ></path>{" "}
                        <path
                          d={"M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5"}
                        ></path>{" "}
                        <path
                          d={"M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3"}
                        ></path>{" "}
                      </svg>
                      {" photo "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove photo"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
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
                        className={"pn-icon pn-tag-icon pn-icon-sm"}
                      >
                        {" "}
                        <path d={"M11 5h2"}></path>{" "}
                        <path
                          d={
                            "M19 12c-.667 5.333 -2.333 8 -5 8h-4c-2.667 0 -4.333 -2.667 -5 -8"
                          }
                        ></path>{" "}
                        <path
                          d={"M11 16c0 .667 .333 1 1 1s1 -.333 1 -1h-2"}
                        ></path>{" "}
                        <path d={"M12 18v2"}></path>{" "}
                        <path d={"M10 11v.01"}></path>{" "}
                        <path d={"M14 11v.01"}></path>{" "}
                        <path
                          d={
                            "M5 4l6 .97l-6.238 6.688a1.021 1.021 0 0 1 -1.41 .111a.953 .953 0 0 1 -.327 -.954l1.975 -6.815"
                          }
                        ></path>{" "}
                        <path
                          d={
                            "M19 4l-6 .97l6.238 6.688c.358 .408 .989 .458 1.41 .111a.953 .953 0 0 0 .327 -.954l-1.975 -6.815"
                          }
                        ></path>{" "}
                      </svg>
                      {" dog "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove dog"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
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
                        className={"pn-icon pn-tag-icon pn-icon-sm"}
                      >
                        {" "}
                        <path
                          d={
                            "M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10"
                          }
                        ></path>{" "}
                        <path d={"M9 19v-6"}></path>{" "}
                        <path d={"M8 5v8h2v-8"}></path>{" "}
                        <path d={"M15 19v-6"}></path>{" "}
                        <path d={"M14 5v8h2v-8"}></path>{" "}
                      </svg>
                      {" piano "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove piano"}
                      ></WorkspaceButton>{" "}
                    </span>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Tags with avatar"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Add a person's avatar before the label."}
                  </CardDescription>{" "}
                  <div className={"pn-tag-list"}>
                    {" "}
                    <span className={"pn-tag"}>
                      {" "}
                      <span
                        style={
                          {
                            backgroundImage:
                              "url(/assets/overtrue/people/leo.svg)",
                          } as CSSProperties
                        }
                        className={"pn-avatar pn-avatar-xxs pn-tag-avatar"}
                      ></span>
                      {" Maya Okafor "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Maya Okafor"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <span
                        style={
                          {
                            backgroundImage:
                              "url(/assets/overtrue/people/maya.svg)",
                          } as CSSProperties
                        }
                        className={"pn-avatar pn-avatar-xxs pn-tag-avatar"}
                      ></span>
                      {" Samir Haddad "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Samir Haddad"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <span
                        style={
                          {
                            backgroundImage:
                              "url(/assets/overtrue/people/june.svg)",
                          } as CSSProperties
                        }
                        className={"pn-avatar pn-avatar-xxs pn-tag-avatar"}
                      ></span>
                      {" Ines Duarte "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Ines Duarte"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <span
                        style={
                          {
                            backgroundImage:
                              "url(/assets/overtrue/people/tomas.svg)",
                          } as CSSProperties
                        }
                        className={"pn-avatar pn-avatar-xxs pn-tag-avatar"}
                      ></span>
                      {" Alina Petrova "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Alina Petrova"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <span
                        style={
                          {
                            backgroundImage:
                              "url(/assets/overtrue/people/maya.svg)",
                          } as CSSProperties
                        }
                        className={"pn-avatar pn-avatar-xxs pn-tag-avatar"}
                      ></span>
                      {" Nora Jensen "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Nora Jensen"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <span
                        style={
                          {
                            backgroundImage:
                              "url(/assets/overtrue/people/ines.svg)",
                          } as CSSProperties
                        }
                        className={"pn-avatar pn-avatar-xxs pn-tag-avatar"}
                      ></span>
                      {" June Park "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove June Park"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <span
                        style={
                          {
                            backgroundImage:
                              "url(/assets/overtrue/people/guest.svg)",
                          } as CSSProperties
                        }
                        className={"pn-avatar pn-avatar-xxs pn-tag-avatar"}
                      ></span>
                      {" Tomas Silva "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Tomas Silva"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <span
                        style={
                          {
                            backgroundImage:
                              "url(/assets/overtrue/people/samir.svg)",
                          } as CSSProperties
                        }
                        className={"pn-avatar pn-avatar-xxs pn-tag-avatar"}
                      ></span>
                      {" Alina Petrova "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Alina Petrova"}
                      ></WorkspaceButton>{" "}
                    </span>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Tags with status"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Add a small status dot in any theme or extended color."}
                  </CardDescription>{" "}
                  <div className={"pn-tag-list"}>
                    {" "}
                    <span className={"pn-tag"}>
                      {" "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-blue pn-text-blue-fg pn-badge-dot"
                        }
                      ></WorkspaceBadge>
                      {" Blue "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Blue"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-azure pn-text-azure-fg pn-badge-dot"
                        }
                      ></WorkspaceBadge>
                      {" Azure "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Azure"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-indigo pn-text-indigo-fg pn-badge-dot"
                        }
                      ></WorkspaceBadge>
                      {" Indigo "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Indigo"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-purple pn-text-purple-fg pn-badge-dot"
                        }
                      ></WorkspaceBadge>
                      {" Purple "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Purple"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-pink pn-text-pink-fg pn-badge-dot"
                        }
                      ></WorkspaceBadge>
                      {" Pink "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Pink"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <WorkspaceBadge
                        className={"pn-badge pn-bg-red pn-text-red-fg pn-badge-dot"}
                      ></WorkspaceBadge>
                      {" Red "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Red"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-orange pn-text-orange-fg pn-badge-dot"
                        }
                      ></WorkspaceBadge>
                      {" Orange "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Orange"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-yellow pn-text-yellow-fg pn-badge-dot"
                        }
                      ></WorkspaceBadge>
                      {" Yellow "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Yellow"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-lime pn-text-lime-fg pn-badge-dot"
                        }
                      ></WorkspaceBadge>
                      {" Lime "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Lime"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-green pn-text-green-fg pn-badge-dot"
                        }
                      ></WorkspaceBadge>
                      {" Green "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Green"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-teal pn-text-teal-fg pn-badge-dot"
                        }
                      ></WorkspaceBadge>
                      {" Teal "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Teal"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-cyan pn-text-cyan-fg pn-badge-dot"
                        }
                      ></WorkspaceBadge>
                      {" Cyan "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Cyan"}
                      ></WorkspaceButton>{" "}
                    </span>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Tags with legend"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Add a colored legend square instead of a dot."}
                  </CardDescription>{" "}
                  <div className={"pn-tag-list"}>
                    {" "}
                    <span className={"pn-tag"}>
                      {" "}
                      <span className={"pn-legend pn-bg-blue"}></span>
                      {" Blue "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Blue"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <span className={"pn-legend pn-bg-azure"}></span>
                      {" Azure "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Azure"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <span className={"pn-legend pn-bg-indigo"}></span>
                      {" Indigo "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Indigo"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <span className={"pn-legend pn-bg-purple"}></span>
                      {" Purple "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Purple"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <span className={"pn-legend pn-bg-pink"}></span>
                      {" Pink "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Pink"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <span className={"pn-legend pn-bg-red"}></span>
                      {" Red "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Red"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <span className={"pn-legend pn-bg-orange"}></span>
                      {" Orange "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Orange"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <span className={"pn-legend pn-bg-yellow"}></span>
                      {" Yellow "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Yellow"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <span className={"pn-legend pn-bg-lime"}></span>
                      {" Lime "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Lime"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <span className={"pn-legend pn-bg-green"}></span>
                      {" Green "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Green"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <span className={"pn-legend pn-bg-teal"}></span>
                      {" Teal "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Teal"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <span className={"pn-legend pn-bg-cyan"}></span>
                      {" Cyan "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Cyan"}
                      ></WorkspaceButton>{" "}
                    </span>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Selectable tags"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Add a "}
                    <code>{"tag-check"}</code>
                    {" checkbox to let users toggle a tag on and off."}
                  </CardDescription>{" "}
                  <div className={"pn-tag-list"}>
                    {" "}
                    <span className={"pn-tag"}>
                      {" "}
                      <WorkspaceInput
                        type={"checkbox"}
                        className={"pn-form-check-input pn-tag-check"}
                      />
                      {" Label 1 "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label 1"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <WorkspaceInput
                        type={"checkbox"}
                        className={"pn-form-check-input pn-tag-check"}
                      />
                      {" Label 2 "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label 2"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <WorkspaceInput
                        type={"checkbox"}
                        className={"pn-form-check-input pn-tag-check"}
                      />
                      {" Label 3 "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label 3"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <WorkspaceInput
                        type={"checkbox"}
                        className={"pn-form-check-input pn-tag-check"}
                      />
                      {" Label 4 "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label 4"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <WorkspaceInput
                        type={"checkbox"}
                        className={"pn-form-check-input pn-tag-check"}
                      />
                      {" Label 5 "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label 5"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <WorkspaceInput
                        type={"checkbox"}
                        className={"pn-form-check-input pn-tag-check"}
                      />
                      {" Label 6 "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label 6"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <WorkspaceInput
                        type={"checkbox"}
                        className={"pn-form-check-input pn-tag-check"}
                        defaultChecked
                      />
                      {" Label 7 "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label 7"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <WorkspaceInput
                        type={"checkbox"}
                        className={"pn-form-check-input pn-tag-check"}
                        defaultChecked
                      />
                      {" Label 8 "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label 8"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <WorkspaceInput
                        type={"checkbox"}
                        className={"pn-form-check-input pn-tag-check"}
                        defaultChecked
                      />
                      {" Label 9 "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label 9"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <WorkspaceInput
                        type={"checkbox"}
                        className={"pn-form-check-input pn-tag-check"}
                        defaultChecked
                      />
                      {" Label 10 "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label 10"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <WorkspaceInput
                        type={"checkbox"}
                        className={"pn-form-check-input pn-tag-check"}
                        defaultChecked
                      />
                      {" Label 11 "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label 11"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" "}
                      <WorkspaceInput
                        type={"checkbox"}
                        className={"pn-form-check-input pn-tag-check"}
                        defaultChecked
                      />
                      {" Label 12 "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label 12"}
                      ></WorkspaceButton>{" "}
                    </span>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Tags with badge"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Add a "}
                    <code>{"tag-badge"}</code>
                    {" count to the end of the tag."}
                  </CardDescription>{" "}
                  <div className={"pn-tag-list"}>
                    {" "}
                    <span className={"pn-tag"}>
                      {" Label "}
                      <WorkspaceBadge className={"pn-badge pn-tag-badge"}>
                        {"1"}
                      </WorkspaceBadge>{" "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" Label "}
                      <WorkspaceBadge className={"pn-badge pn-tag-badge"}>
                        {"2"}
                      </WorkspaceBadge>{" "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" Label "}
                      <WorkspaceBadge className={"pn-badge pn-tag-badge"}>
                        {"3"}
                      </WorkspaceBadge>{" "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" Label "}
                      <WorkspaceBadge className={"pn-badge pn-tag-badge"}>
                        {"4"}
                      </WorkspaceBadge>{" "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" Label "}
                      <WorkspaceBadge className={"pn-badge pn-tag-badge"}>
                        {"5"}
                      </WorkspaceBadge>{" "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" Label "}
                      <WorkspaceBadge className={"pn-badge pn-tag-badge"}>
                        {"6"}
                      </WorkspaceBadge>{" "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" Label "}
                      <WorkspaceBadge className={"pn-badge pn-tag-badge"}>
                        {"7"}
                      </WorkspaceBadge>{" "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" Label "}
                      <WorkspaceBadge className={"pn-badge pn-tag-badge"}>
                        {"8"}
                      </WorkspaceBadge>{" "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" Label "}
                      <WorkspaceBadge className={"pn-badge pn-tag-badge"}>
                        {"9"}
                      </WorkspaceBadge>{" "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" Label "}
                      <WorkspaceBadge className={"pn-badge pn-tag-badge"}>
                        {"10"}
                      </WorkspaceBadge>{" "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" Label "}
                      <WorkspaceBadge className={"pn-badge pn-tag-badge"}>
                        {"11"}
                      </WorkspaceBadge>{" "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label"}
                      ></WorkspaceButton>{" "}
                    </span>
                    <span className={"pn-tag"}>
                      {" Label "}
                      <WorkspaceBadge className={"pn-badge pn-tag-badge"}>
                        {"12"}
                      </WorkspaceBadge>{" "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Label"}
                      ></WorkspaceButton>{" "}
                    </span>{" "}
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
