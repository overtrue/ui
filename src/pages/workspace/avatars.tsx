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
  WorkspaceLink,
} from "@/components/overtrue/workspace/primitives"
export default function Page() {
  return (
    <div data-workspace-page="avatars" className="pn-page-wrapper">
      {" "}
      <div className={"pn-page-header pn-d-print-none"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-g-2 pn-align-items-center"}>
            {" "}
            <div className={"pn-col"}>
              {" "}
              <h1 className={"pn-page-title"}>{"Avatars"}</h1>{" "}
              <div className={"pn-text-secondary pn-mt-1"}>
                {
                  "The people behind the work, at every size."
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
            <div className={"pn-col-sm-6 pn-col-lg-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Default avatar"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"The base "}
                    <code>{".avatar"}</code>
                    {
                      " element — a placeholder box for a photo, icon, or initials."
                    }
                  </CardDescription>{" "}
                  <span className={"pn-avatar"}>
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
                      <path d={"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"}></path>{" "}
                      <path
                        d={"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                      ></path>
                    </svg>
                  </span>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-sm-6 pn-col-lg-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Avatar with icon"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Put an icon inside the "}
                    <code>{"avatar"}</code>
                    {" instead of a photo."}
                  </CardDescription>{" "}
                  <div className={"pn-avatar-list"}>
                    {" "}
                    <span className={"pn-avatar"}>
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
                          d={"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"}
                        ></path>{" "}
                        <path
                          d={"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                        ></path>
                      </svg>
                    </span>
                    <span className={"pn-avatar"}>
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
                            "M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065"
                          }
                        ></path>{" "}
                        <path d={"M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"}></path>
                      </svg>
                    </span>
                    <span className={"pn-avatar"}>
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
                          d={"M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"}
                        ></path>{" "}
                        <path d={"M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"}></path>{" "}
                        <path
                          d={
                            "M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5"
                          }
                        ></path>
                      </svg>
                    </span>
                    <span className={"pn-avatar"}>
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
                        <path d={"M14 8a2 2 0 0 0 -2 -2"}></path>{" "}
                        <path
                          d={
                            "M6 8a6 6 0 1 1 12 0c0 4.97 -2.686 9 -6 9s-6 -4.03 -6 -9"
                          }
                        ></path>{" "}
                        <path
                          d={"M12 17v1a2 2 0 0 1 -2 2h-3a2 2 0 0 0 -2 2"}
                        ></path>
                      </svg>
                    </span>
                    <span className={"pn-avatar"}>
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
                          d={"M5 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"}
                        ></path>{" "}
                        <path
                          d={"M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                        ></path>{" "}
                        <path d={"M16 3.13a4 4 0 0 1 0 7.75"}></path>{" "}
                        <path d={"M21 21v-2a4 4 0 0 0 -3 -3.85"}></path>
                      </svg>
                    </span>
                    <span className={"pn-avatar"}>
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
                          d={"M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"}
                        ></path>{" "}
                        <path
                          d={"M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1"}
                        ></path>{" "}
                        <path d={"M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"}></path>{" "}
                        <path d={"M17 10h2a2 2 0 0 1 2 2v1"}></path>{" "}
                        <path d={"M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"}></path>{" "}
                        <path d={"M3 13v-1a2 2 0 0 1 2 -2h2"}></path>
                      </svg>
                    </span>
                    <span className={"pn-avatar"}>
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
                            "M4 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4"
                          }
                        ></path>{" "}
                        <path
                          d={
                            "M4 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4"
                          }
                        ></path>{" "}
                        <path
                          d={
                            "M14 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4"
                          }
                        ></path>{" "}
                        <path d={"M14 7l6 0"}></path>{" "}
                        <path d={"M17 4l0 6"}></path>
                      </svg>
                    </span>
                    <span className={"pn-avatar"}>
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
                            "M5 11a7 7 0 0 1 14 0v7a1.78 1.78 0 0 1 -3.1 1.4a1.65 1.65 0 0 0 -2.6 0a1.65 1.65 0 0 1 -2.6 0a1.65 1.65 0 0 0 -2.6 0a1.78 1.78 0 0 1 -3.1 -1.4v-7"
                          }
                        ></path>{" "}
                        <path d={"M10 10l.01 0"}></path>{" "}
                        <path d={"M14 10l.01 0"}></path>{" "}
                        <path d={"M10 14a3.5 3.5 0 0 0 4 0"}></path>
                      </svg>
                    </span>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-sm-6 pn-col-lg-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Avatar icon colors"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Combine an icon avatar with any theme color."}
                  </CardDescription>{" "}
                  <div className={"pn-avatar-list"}>
                    {" "}
                    <span className={"pn-avatar pn-bg-blue-lt"}>
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
                          d={"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"}
                        ></path>{" "}
                        <path
                          d={"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                        ></path>
                      </svg>
                    </span>
                    <span className={"pn-avatar pn-bg-azure-lt"}>
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
                          d={"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"}
                        ></path>{" "}
                        <path
                          d={"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                        ></path>
                      </svg>
                    </span>
                    <span className={"pn-avatar pn-bg-indigo-lt"}>
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
                          d={"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"}
                        ></path>{" "}
                        <path
                          d={"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                        ></path>
                      </svg>
                    </span>
                    <span className={"pn-avatar pn-bg-purple-lt"}>
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
                          d={"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"}
                        ></path>{" "}
                        <path
                          d={"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                        ></path>
                      </svg>
                    </span>
                    <span className={"pn-avatar pn-bg-pink-lt"}>
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
                          d={"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"}
                        ></path>{" "}
                        <path
                          d={"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                        ></path>
                      </svg>
                    </span>
                    <span className={"pn-avatar pn-bg-red-lt"}>
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
                          d={"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"}
                        ></path>{" "}
                        <path
                          d={"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                        ></path>
                      </svg>
                    </span>
                    <span className={"pn-avatar pn-bg-orange-lt"}>
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
                          d={"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"}
                        ></path>{" "}
                        <path
                          d={"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                        ></path>
                      </svg>
                    </span>
                    <span className={"pn-avatar pn-bg-yellow-lt"}>
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
                          d={"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"}
                        ></path>{" "}
                        <path
                          d={"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                        ></path>
                      </svg>
                    </span>
                    <span className={"pn-avatar pn-bg-lime-lt"}>
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
                          d={"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"}
                        ></path>{" "}
                        <path
                          d={"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                        ></path>
                      </svg>
                    </span>
                    <span className={"pn-avatar pn-bg-green-lt"}>
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
                          d={"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"}
                        ></path>{" "}
                        <path
                          d={"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                        ></path>
                      </svg>
                    </span>
                    <span className={"pn-avatar pn-bg-teal-lt"}>
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
                          d={"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"}
                        ></path>{" "}
                        <path
                          d={"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                        ></path>
                      </svg>
                    </span>
                    <span className={"pn-avatar pn-bg-cyan-lt"}>
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
                          d={"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"}
                        ></path>{" "}
                        <path
                          d={"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                        ></path>
                      </svg>
                    </span>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-sm-6 pn-col-lg-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Simple avatar"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Show a photo by setting it as the "}
                    <code>{"background-image"}</code>
                    {" of the avatar."}
                  </CardDescription>{" "}
                  <div className={"pn-avatar-list"}>
                    {" "}
                    <span
                      style={
                        {
                          backgroundImage:
                            "url(/assets/overtrue/people/leo.svg)",
                        } as CSSProperties
                      }
                      className={"pn-avatar"}
                    ></span>
                    <span
                      style={
                        {
                          backgroundImage:
                            "url(/assets/overtrue/people/maya.svg)",
                        } as CSSProperties
                      }
                      className={"pn-avatar"}
                    ></span>
                    <span
                      style={
                        {
                          backgroundImage:
                            "url(/assets/overtrue/people/june.svg)",
                        } as CSSProperties
                      }
                      className={"pn-avatar"}
                    ></span>
                    <span
                      style={
                        {
                          backgroundImage:
                            "url(/assets/overtrue/people/tomas.svg)",
                        } as CSSProperties
                      }
                      className={"pn-avatar"}
                    ></span>
                    <span
                      style={
                        {
                          backgroundImage:
                            "url(/assets/overtrue/people/maya.svg)",
                        } as CSSProperties
                      }
                      className={"pn-avatar"}
                    ></span>
                    <span
                      style={
                        {
                          backgroundImage:
                            "url(/assets/overtrue/people/ines.svg)",
                        } as CSSProperties
                      }
                      className={"pn-avatar"}
                    ></span>
                    <span
                      style={
                        {
                          backgroundImage:
                            "url(/assets/overtrue/people/guest.svg)",
                        } as CSSProperties
                      }
                      className={"pn-avatar"}
                    ></span>
                    <span
                      style={
                        {
                          backgroundImage:
                            "url(/assets/overtrue/people/samir.svg)",
                        } as CSSProperties
                      }
                      className={"pn-avatar"}
                    ></span>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-sm-6 pn-col-lg-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Avatar placeholder"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {
                      "Fall back to initials as the avatar text when there's no photo."
                    }
                  </CardDescription>{" "}
                  <div className={"pn-avatar-list"}>
                    <span className={"pn-avatar"}>{"PK"}</span>
                    <span className={"pn-avatar"}>{"JL"}</span>
                    <span className={"pn-avatar"}>{"MH"}</span>
                    <span className={"pn-avatar"}>{"DS"}</span>
                    <span className={"pn-avatar"}>{"EL"}</span>
                    <span className={"pn-avatar"}>{"ML"}</span>
                    <span className={"pn-avatar"}>{"EP"}</span>
                    <span className={"pn-avatar"}>{"KS"}</span>
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-sm-6 pn-col-lg-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Avatar shapes"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Square by default — add "}
                    <code>{".rounded-circle"}</code>
                    {" or "}
                    <code>{".rounded-0"}</code>
                    {" to change the shape."}
                  </CardDescription>{" "}
                  <div className={"pn-avatar-list"}>
                    {" "}
                    <span className={"pn-avatar"}>
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
                          d={"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"}
                        ></path>{" "}
                        <path
                          d={"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                        ></path>
                      </svg>
                    </span>{" "}
                    <span className={"pn-avatar pn-rounded-circle"}>
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
                          d={"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"}
                        ></path>{" "}
                        <path
                          d={"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                        ></path>
                      </svg>
                    </span>{" "}
                    <span className={"pn-avatar pn-rounded-0"}>
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
                          d={"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"}
                        ></path>{" "}
                        <path
                          d={"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                        ></path>
                      </svg>
                    </span>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-12 pn-col-lg-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Avatar sizes"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Six sizes from "}
                    <code>{"avatar-xxs"}</code>
                    {" to "}
                    <code>{"avatar-xl"}</code>
                    {", for both photos and placeholders."}
                  </CardDescription>{" "}
                  <div className={"pn-row"}>
                    {" "}
                    <div className={"pn-col-6"}>
                      {" "}
                      <div className={"pn-avatar-list"}>
                        {" "}
                        <span className={"pn-avatar pn-avatar-xxs"}>
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
                              d={"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"}
                            ></path>{" "}
                            <path
                              d={"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                            ></path>
                          </svg>
                        </span>
                        <span className={"pn-avatar pn-avatar-xs"}>
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
                              d={"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"}
                            ></path>{" "}
                            <path
                              d={"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                            ></path>
                          </svg>
                        </span>
                        <span className={"pn-avatar pn-avatar-sm"}>
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
                              d={"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"}
                            ></path>{" "}
                            <path
                              d={"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                            ></path>
                          </svg>
                        </span>
                        <span className={"pn-avatar pn-avatar-md"}>
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
                              d={"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"}
                            ></path>{" "}
                            <path
                              d={"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                            ></path>
                          </svg>
                        </span>
                        <span className={"pn-avatar pn-avatar-lg"}>
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
                              d={"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"}
                            ></path>{" "}
                            <path
                              d={"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                            ></path>
                          </svg>
                        </span>
                        <span className={"pn-avatar pn-avatar-xl"}>
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
                              d={"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"}
                            ></path>{" "}
                            <path
                              d={"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                            ></path>
                          </svg>
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-6"}>
                      {" "}
                      <div className={"pn-avatar-list"}>
                        <span className={"pn-avatar pn-avatar-xxs"}>{"PK"}</span>
                        <span className={"pn-avatar pn-avatar-xs"}>{"PK"}</span>
                        <span className={"pn-avatar pn-avatar-sm"}>{"PK"}</span>
                        <span className={"pn-avatar pn-avatar-md"}>{"PK"}</span>
                        <span className={"pn-avatar pn-avatar-lg"}>{"PK"}</span>
                        <span className={"pn-avatar pn-avatar-xl"}>{"PK"}</span>
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-12 pn-col-lg-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Avatar lists"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Stack avatars inside an "}
                    <code>{".avatar-list"}</code>
                    {" container to show a group at a glance."}
                  </CardDescription>{" "}
                  <div className={"pn-row pn-g-3"}>
                    {" "}
                    <div className={"pn-col-6"}>
                      {" "}
                      <div
                        className={
                          "pn-avatar-list pn-avatar-list-stacked pn-avatar-list-xxs"
                        }
                      >
                        {" "}
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/leo.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/maya.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/june.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/tomas.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/maya.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar"}
                        ></span>
                        <WorkspaceLink className={"pn-avatar"}>
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
                            <path d={"M12 5l0 14"}></path>{" "}
                            <path d={"M5 12l14 0"}></path>
                          </svg>
                        </WorkspaceLink>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-6"}>
                      {" "}
                      <div
                        className={
                          "pn-avatar-list pn-avatar-list-stacked pn-avatar-list-xxs"
                        }
                      >
                        {" "}
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/leo.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar pn-rounded-circle"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/maya.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar pn-rounded-circle"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/june.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar pn-rounded-circle"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/tomas.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar pn-rounded-circle"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/maya.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar pn-rounded-circle"}
                        ></span>
                        <WorkspaceLink className={"pn-avatar pn-rounded-circle"}>
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
                            <path d={"M12 5l0 14"}></path>{" "}
                            <path d={"M5 12l14 0"}></path>
                          </svg>
                        </WorkspaceLink>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-6"}>
                      {" "}
                      <div
                        className={
                          "pn-avatar-list pn-avatar-list-stacked pn-avatar-list-xs"
                        }
                      >
                        {" "}
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/leo.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/maya.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/june.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/tomas.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/maya.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar"}
                        ></span>
                        <WorkspaceLink className={"pn-avatar"}>
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
                            <path d={"M12 5l0 14"}></path>{" "}
                            <path d={"M5 12l14 0"}></path>
                          </svg>
                        </WorkspaceLink>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-6"}>
                      {" "}
                      <div
                        className={
                          "pn-avatar-list pn-avatar-list-stacked pn-avatar-list-xs"
                        }
                      >
                        {" "}
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/leo.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar pn-rounded-circle"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/maya.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar pn-rounded-circle"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/june.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar pn-rounded-circle"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/tomas.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar pn-rounded-circle"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/maya.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar pn-rounded-circle"}
                        ></span>
                        <WorkspaceLink className={"pn-avatar pn-rounded-circle"}>
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
                            <path d={"M12 5l0 14"}></path>{" "}
                            <path d={"M5 12l14 0"}></path>
                          </svg>
                        </WorkspaceLink>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-6"}>
                      {" "}
                      <div
                        className={
                          "pn-avatar-list pn-avatar-list-stacked pn-avatar-list-sm"
                        }
                      >
                        {" "}
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/leo.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/maya.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/june.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/tomas.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/maya.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar"}
                        ></span>
                        <WorkspaceLink className={"pn-avatar"}>
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
                            <path d={"M12 5l0 14"}></path>{" "}
                            <path d={"M5 12l14 0"}></path>
                          </svg>
                        </WorkspaceLink>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-6"}>
                      {" "}
                      <div
                        className={
                          "pn-avatar-list pn-avatar-list-stacked pn-avatar-list-sm"
                        }
                      >
                        {" "}
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/leo.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar pn-rounded-circle"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/maya.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar pn-rounded-circle"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/june.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar pn-rounded-circle"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/tomas.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar pn-rounded-circle"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/maya.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar pn-rounded-circle"}
                        ></span>
                        <WorkspaceLink className={"pn-avatar pn-rounded-circle"}>
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
                            <path d={"M12 5l0 14"}></path>{" "}
                            <path d={"M5 12l14 0"}></path>
                          </svg>
                        </WorkspaceLink>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-6"}>
                      {" "}
                      <div
                        className={
                          "pn-avatar-list pn-avatar-list-stacked pn-avatar-list-md"
                        }
                      >
                        {" "}
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/leo.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/maya.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/june.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/tomas.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/maya.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar"}
                        ></span>
                        <WorkspaceLink className={"pn-avatar"}>
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
                            <path d={"M12 5l0 14"}></path>{" "}
                            <path d={"M5 12l14 0"}></path>
                          </svg>
                        </WorkspaceLink>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-6"}>
                      {" "}
                      <div
                        className={
                          "pn-avatar-list pn-avatar-list-stacked pn-avatar-list-md"
                        }
                      >
                        {" "}
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/leo.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar pn-rounded-circle"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/maya.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar pn-rounded-circle"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/june.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar pn-rounded-circle"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/tomas.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar pn-rounded-circle"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/maya.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar pn-rounded-circle"}
                        ></span>
                        <WorkspaceLink className={"pn-avatar pn-rounded-circle"}>
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
                            <path d={"M12 5l0 14"}></path>{" "}
                            <path d={"M5 12l14 0"}></path>
                          </svg>
                        </WorkspaceLink>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-6"}>
                      {" "}
                      <div
                        className={
                          "pn-avatar-list pn-avatar-list-stacked pn-avatar-list-lg"
                        }
                      >
                        {" "}
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/leo.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/maya.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/june.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/tomas.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/maya.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar"}
                        ></span>
                        <WorkspaceLink className={"pn-avatar"}>
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
                            <path d={"M12 5l0 14"}></path>{" "}
                            <path d={"M5 12l14 0"}></path>
                          </svg>
                        </WorkspaceLink>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-6"}>
                      {" "}
                      <div
                        className={
                          "pn-avatar-list pn-avatar-list-stacked pn-avatar-list-lg"
                        }
                      >
                        {" "}
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/leo.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar pn-rounded-circle"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/maya.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar pn-rounded-circle"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/june.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar pn-rounded-circle"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/tomas.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar pn-rounded-circle"}
                        ></span>
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/maya.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar pn-rounded-circle"}
                        ></span>
                        <WorkspaceLink className={"pn-avatar pn-rounded-circle"}>
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
                            <path d={"M12 5l0 14"}></path>{" "}
                            <path d={"M5 12l14 0"}></path>
                          </svg>
                        </WorkspaceLink>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-sm-6 pn-col-lg-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Avatar upload"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {
                      "An upload control styled as an avatar, for profile photo pickers."
                    }
                  </CardDescription>{" "}
                  <WorkspaceLink
                    href={"#"}
                    className={"pn-avatar pn-avatar-upload pn-avatar-xxs"}
                    aria-label={"Upload photo"}
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
                      <path d={"M12 5l0 14"}></path>{" "}
                      <path d={"M5 12l14 0"}></path>{" "}
                    </svg>{" "}
                  </WorkspaceLink>
                  <WorkspaceLink
                    href={"#"}
                    className={"pn-avatar pn-avatar-upload pn-avatar-xs"}
                    aria-label={"Upload photo"}
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
                      <path d={"M12 5l0 14"}></path>{" "}
                      <path d={"M5 12l14 0"}></path>{" "}
                    </svg>{" "}
                  </WorkspaceLink>
                  <WorkspaceLink
                    href={"#"}
                    className={"pn-avatar pn-avatar-upload pn-avatar-sm"}
                    aria-label={"Upload photo"}
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
                      <path d={"M12 5l0 14"}></path>{" "}
                      <path d={"M5 12l14 0"}></path>{" "}
                    </svg>{" "}
                  </WorkspaceLink>
                  <WorkspaceLink
                    href={"#"}
                    className={"pn-avatar pn-avatar-upload pn-avatar-md"}
                    aria-label={"Upload photo"}
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
                      <path d={"M12 5l0 14"}></path>{" "}
                      <path d={"M5 12l14 0"}></path>{" "}
                    </svg>{" "}
                  </WorkspaceLink>
                  <WorkspaceLink
                    href={"#"}
                    className={"pn-avatar pn-avatar-upload pn-avatar-lg"}
                    aria-label={"Upload photo"}
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
                      <path d={"M12 5l0 14"}></path>{" "}
                      <path d={"M5 12l14 0"}></path>{" "}
                    </svg>{" "}
                  </WorkspaceLink>
                  <WorkspaceLink
                    href={"#"}
                    className={"pn-avatar pn-avatar-upload pn-avatar-xl"}
                    aria-label={"Upload photo"}
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
                      <path d={"M12 5l0 14"}></path>{" "}
                      <path d={"M5 12l14 0"}></path>{" "}
                    </svg>{" "}
                  </WorkspaceLink>
                  <WorkspaceLink
                    href={"#"}
                    className={"pn-avatar pn-avatar-upload pn-avatar-2xl"}
                    aria-label={"Upload photo"}
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
                      <path d={"M12 5l0 14"}></path>{" "}
                      <path d={"M5 12l14 0"}></path>{" "}
                    </svg>{" "}
                  </WorkspaceLink>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-sm-6 pn-col-lg-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Avatar statuses"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Add a "}
                    <code>{"badge"}</code>
                    {
                      " inside the avatar for an online, away, or busy status dot."
                    }
                  </CardDescription>{" "}
                  <span
                    style={
                      {
                        backgroundImage:
                          "url(/assets/overtrue/people/leo.svg)",
                      } as CSSProperties
                    }
                    className={"pn-avatar pn-rounded-circle"}
                  >
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-red"}
                      aria-label={"red"}
                    ></WorkspaceBadge>
                  </span>
                  <span
                    style={
                      {
                        backgroundImage:
                          "url(/assets/overtrue/people/maya.svg)",
                      } as CSSProperties
                    }
                    className={"pn-avatar pn-rounded-circle"}
                  >
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-green"}
                      aria-label={"green"}
                    ></WorkspaceBadge>
                  </span>
                  <span
                    style={
                      {
                        backgroundImage:
                          "url(/assets/overtrue/people/june.svg)",
                      } as CSSProperties
                    }
                    className={"pn-avatar pn-rounded-circle"}
                  >
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-blue"}
                      aria-label={"blue"}
                    ></WorkspaceBadge>
                  </span>
                  <span
                    style={
                      {
                        backgroundImage:
                          "url(/assets/overtrue/people/tomas.svg)",
                      } as CSSProperties
                    }
                    className={"pn-avatar pn-rounded-circle"}
                  >
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-yellow"}
                      aria-label={"yellow"}
                    ></WorkspaceBadge>
                  </span>
                  <span
                    style={
                      {
                        backgroundImage:
                          "url(/assets/overtrue/people/maya.svg)",
                      } as CSSProperties
                    }
                    className={"pn-avatar pn-rounded-circle"}
                  >
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-secondary"}
                      aria-label={"secondary"}
                    ></WorkspaceBadge>
                  </span>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-sm-6 pn-col-lg-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Avatar brands"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Add a recognizable brand icon on top of an avatar."}
                  </CardDescription>{" "}
                  <span
                    style={
                      {
                        backgroundImage:
                          "url(/assets/overtrue/people/leo.svg)",
                      } as CSSProperties
                    }
                    className={"pn-avatar"}
                  >
                    <span
                      className={"pn-avatar-brand"}
                      style={
                        {
                          backgroundImage:
                            "url(/assets/examples/static/brands/netflix.svg)",
                        } as CSSProperties
                      }
                    ></span>
                  </span>
                  <span
                    style={
                      {
                        backgroundImage:
                          "url(/assets/overtrue/people/maya.svg)",
                      } as CSSProperties
                    }
                    className={"pn-avatar"}
                  >
                    <span
                      className={"pn-avatar-brand"}
                      style={
                        {
                          backgroundImage:
                            "url(/assets/examples/static/brands/amazon.svg)",
                        } as CSSProperties
                      }
                    ></span>
                  </span>
                  <span
                    style={
                      {
                        backgroundImage:
                          "url(/assets/overtrue/people/june.svg)",
                      } as CSSProperties
                    }
                    className={"pn-avatar"}
                  >
                    <span
                      className={"pn-avatar-brand"}
                      style={
                        {
                          backgroundImage:
                            "url(/assets/examples/static/brands/messenger.svg)",
                        } as CSSProperties
                      }
                    ></span>
                  </span>
                  <span
                    style={
                      {
                        backgroundImage:
                          "url(/assets/overtrue/people/tomas.svg)",
                      } as CSSProperties
                    }
                    className={"pn-avatar"}
                  >
                    <span
                      className={"pn-avatar-brand"}
                      style={
                        {
                          backgroundImage:
                            "url(/assets/examples/static/brands/figma.svg)",
                        } as CSSProperties
                      }
                    ></span>
                  </span>
                  <span
                    style={
                      {
                        backgroundImage:
                          "url(/assets/overtrue/people/maya.svg)",
                      } as CSSProperties
                    }
                    className={"pn-avatar"}
                  >
                    <span
                      className={"pn-avatar-brand"}
                      style={
                        {
                          backgroundImage:
                            "url(/assets/examples/static/brands/twitch.svg)",
                        } as CSSProperties
                      }
                    ></span>
                  </span>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  )
}
