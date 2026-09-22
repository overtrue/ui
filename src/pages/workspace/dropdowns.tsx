// Keep page composition editable; interaction belongs in the shared components.
import type { CSSProperties } from "react"
import {
  WorkspaceBadge,
  WorkspaceButton,
  WorkspaceDropdownContent,
  WorkspaceDropdownItem,
  WorkspaceInput,
  WorkspaceLink,
} from "@/components/overtrue/workspace/primitives"
export default function Page() {
  return (
    <div data-workspace-page="dropdowns" className="pn-page-wrapper">
      {" "}
      <div className={"pn-page-header pn-d-print-none"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-g-2 pn-align-items-center"}>
            {" "}
            <div className={"pn-col"}>
              {" "}
              <h1 className={"pn-page-title"}>{"Dropdowns"}</h1>{" "}
              <div className={"pn-text-secondary pn-mt-1"}>
                {
                  "Keep secondary actions close to the work."
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
          <div className={"pn-row"}>
            {" "}
            <div className={"pn-col-sm-6 pn-col-lg-3"}>
              {" "}
              <WorkspaceDropdownContent
                className={"pn-dropdown-menu pn-dropdown-menu-demo"}
              >
                {" "}
                <h6 className={"pn-dropdown-header"}>
                  {"Dropdown header"}
                </h6>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
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
                    className={"pn-icon pn-dropdown-item-icon"}
                  >
                    <path d={"M3 12h4l3 8l4 -16l3 8h4"}></path>
                  </svg>
                  {" Item 1 "}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
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
                    className={"pn-icon pn-dropdown-item-icon"}
                  >
                    {" "}
                    <path
                      d={
                        "M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"
                      }
                    ></path>{" "}
                    <path
                      d={
                        "M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415"
                      }
                    ></path>{" "}
                    <path d={"M16 5l3 3"}></path>{" "}
                  </svg>
                  {" Item 2 "}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem className={"pn-dropdown-item"}>
                  {" "}
                  <WorkspaceButton
                    type={"button"}
                    className={"pn-text-reset pn-border-0 pn-bg-transparent pn-p-0"}
                  >
                    {"My profile"}
                  </WorkspaceButton>{" "}
                  <label className={"pn-form-check pn-m-0 pn-ms-auto"}>
                    {" "}
                    <WorkspaceInput
                      type={"checkbox"}
                      className={"pn-form-check-input"}
                    />
                    {" Public "}
                  </label>{" "}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem className={"pn-dropdown-item"}>
                  <WorkspaceInput
                    className={"pn-form-check-input pn-m-0 pn-me-2"}
                    type={"radio"}
                    name={"dropdown-menu-all-radio"}
                  />
                  {" Radio input"}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem className={"pn-dropdown-item"}>
                  <WorkspaceInput
                    className={"pn-form-check-input pn-m-0 pn-me-2"}
                    type={"checkbox"}
                  />
                  {" Checkbox input"}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem
                  className={"pn-dropdown-item pn-form-switch"}
                >
                  <WorkspaceInput
                    className={"pn-form-check-input pn-m-0 pn-me-2"}
                    type={"checkbox"}
                  />
                  {" Checkbox input"}
                </WorkspaceDropdownItem>{" "}
                <div className={"pn-dropdown-divider"}></div>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Dropdown item 1"}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Dropdown item 2"}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item pn-disabled"}
                  disabled
                >
                  {"Dropdown disabled"}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item pn-active"}
                >
                  {"Dropdown active"}
                </WorkspaceDropdownItem>{" "}
                <div className={"pn-dropdown-divider"}></div>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  <span
                    style={
                      {
                        backgroundImage:
                          "url(/assets/overtrue/people/leo.svg)",
                      } as CSSProperties
                    }
                    className={"pn-avatar pn-avatar-xs pn-rounded pn-me-2"}
                  ></span>
                  {" Maya Okafor"}
                </WorkspaceDropdownItem>
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  <span
                    style={
                      {
                        backgroundImage:
                          "url(/assets/overtrue/people/maya.svg)",
                      } as CSSProperties
                    }
                    className={"pn-avatar pn-avatar-xs pn-rounded pn-me-2"}
                  ></span>
                  {" Samir Haddad"}
                </WorkspaceDropdownItem>
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  <span
                    style={
                      {
                        backgroundImage:
                          "url(/assets/overtrue/people/june.svg)",
                      } as CSSProperties
                    }
                    className={"pn-avatar pn-avatar-xs pn-rounded pn-me-2"}
                  ></span>
                  {" Ines Duarte"}
                </WorkspaceDropdownItem>{" "}
                <div className={"pn-dropdown-divider"}></div>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
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
                    className={"pn-icon pn-dropdown-item-icon"}
                  >
                    {" "}
                    <path
                      d={
                        "M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"
                      }
                    ></path>{" "}
                    <path d={"M9 12h12l-3 -3"}></path>{" "}
                    <path d={"M18 15l3 -3"}></path>{" "}
                  </svg>
                  {" Logout "}
                </WorkspaceDropdownItem>{" "}
              </WorkspaceDropdownContent>{" "}
            </div>{" "}
            <div className={"pn-col-sm-6 pn-col-lg-3"}>
              {" "}
              <WorkspaceDropdownContent
                className={"pn-dropdown-menu pn-dropdown-menu-demo"}
              >
                {" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Action"}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Another action"}
                </WorkspaceDropdownItem>{" "}
              </WorkspaceDropdownContent>{" "}
              <WorkspaceDropdownContent
                className={"pn-dropdown-menu pn-dropdown-menu-demo"}
              >
                {" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Action"}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Another action"}
                </WorkspaceDropdownItem>{" "}
                <div className={"pn-dropdown-divider"}></div>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Separated link"}
                </WorkspaceDropdownItem>{" "}
              </WorkspaceDropdownContent>{" "}
              <WorkspaceDropdownContent
                className={"pn-dropdown-menu pn-dropdown-menu-demo"}
              >
                {" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Action"}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Another action"}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item pn-active"}
                >
                  {"Active action"}
                </WorkspaceDropdownItem>{" "}
              </WorkspaceDropdownContent>{" "}
              <WorkspaceDropdownContent
                className={"pn-dropdown-menu pn-dropdown-menu-demo"}
              >
                {" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Action"}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Another action"}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item pn-disabled"}
                  disabled
                >
                  {"Disabled action"}
                </WorkspaceDropdownItem>{" "}
              </WorkspaceDropdownContent>{" "}
              <WorkspaceDropdownContent
                className={"pn-dropdown-menu pn-dropdown-menu-demo"}
              >
                {" "}
                <span className={"pn-dropdown-header"}>
                  {"Dropdown header"}
                </span>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Action"}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Another action"}
                </WorkspaceDropdownItem>{" "}
              </WorkspaceDropdownContent>{" "}
              <WorkspaceDropdownContent
                className={"pn-dropdown-menu pn-dropdown-menu-demo"}
              >
                {" "}
                <span className={"pn-dropdown-header"}>
                  {"Dropdown header"}
                </span>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
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
                    className={"pn-icon pn-dropdown-item-icon"}
                  >
                    {" "}
                    <path
                      d={
                        "M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065"
                      }
                    ></path>{" "}
                    <path d={"M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"}></path>{" "}
                  </svg>
                  {" Action "}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
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
                    className={"pn-icon pn-dropdown-item-icon"}
                  >
                    {" "}
                    <path
                      d={
                        "M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"
                      }
                    ></path>{" "}
                    <path
                      d={
                        "M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415"
                      }
                    ></path>{" "}
                    <path d={"M16 5l3 3"}></path>{" "}
                  </svg>
                  {" Another action "}
                </WorkspaceDropdownItem>{" "}
              </WorkspaceDropdownContent>{" "}
              <WorkspaceDropdownContent
                className={
                  "pn-dropdown-menu pn-dropdown-menu-demo pn-dropdown-menu-arrow"
                }
              >
                {" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Action"}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Another action"}
                </WorkspaceDropdownItem>{" "}
              </WorkspaceDropdownContent>{" "}
            </div>{" "}
            <div className={"pn-col-sm-6 pn-col-lg-3"}>
              {" "}
              <WorkspaceDropdownContent
                className={"pn-dropdown-menu pn-dropdown-menu-demo"}
              >
                {" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Action"}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Another action"}
                </WorkspaceDropdownItem>{" "}
              </WorkspaceDropdownContent>{" "}
              <WorkspaceDropdownContent
                className={"pn-dropdown-menu pn-dropdown-menu-demo"}
              >
                {" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Action"}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Another action"}
                </WorkspaceDropdownItem>{" "}
                <div className={"pn-dropdown-divider"}></div>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Separated link"}
                </WorkspaceDropdownItem>{" "}
              </WorkspaceDropdownContent>{" "}
              <WorkspaceDropdownContent
                className={"pn-dropdown-menu pn-dropdown-menu-demo"}
              >
                {" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Action"}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Another action"}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item pn-active"}
                >
                  {"Active action"}
                </WorkspaceDropdownItem>{" "}
              </WorkspaceDropdownContent>{" "}
              <WorkspaceDropdownContent
                className={"pn-dropdown-menu pn-dropdown-menu-demo"}
              >
                {" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Action"}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Another action"}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item pn-disabled"}
                  disabled
                >
                  {"Disabled action"}
                </WorkspaceDropdownItem>{" "}
              </WorkspaceDropdownContent>{" "}
              <WorkspaceDropdownContent
                className={"pn-dropdown-menu pn-dropdown-menu-demo"}
              >
                {" "}
                <span className={"pn-dropdown-header"}>
                  {"Dropdown header"}
                </span>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Action"}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Another action"}
                </WorkspaceDropdownItem>{" "}
              </WorkspaceDropdownContent>{" "}
              <WorkspaceDropdownContent
                className={"pn-dropdown-menu pn-dropdown-menu-demo"}
              >
                {" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
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
                    className={"pn-icon pn-dropdown-item-icon"}
                  >
                    {" "}
                    <path
                      d={
                        "M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065"
                      }
                    ></path>{" "}
                    <path d={"M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"}></path>{" "}
                  </svg>
                  {" Action "}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
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
                    className={"pn-icon pn-dropdown-item-icon"}
                  >
                    {" "}
                    <path
                      d={
                        "M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"
                      }
                    ></path>{" "}
                    <path
                      d={
                        "M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415"
                      }
                    ></path>{" "}
                    <path d={"M16 5l3 3"}></path>{" "}
                  </svg>
                  {" Another action "}
                </WorkspaceDropdownItem>{" "}
              </WorkspaceDropdownContent>{" "}
              <WorkspaceDropdownContent
                className={"pn-dropdown-menu pn-dropdown-menu-demo"}
              >
                {" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {" Action "}
                  <WorkspaceBadge
                    className={
                      "pn-badge pn-bg-primary pn-text-primary-fg pn-ms-auto"
                    }
                  >
                    {"12"}
                  </WorkspaceBadge>{" "}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {" Another action "}
                  <WorkspaceBadge
                    className={"pn-badge pn-bg-green pn-ms-auto"}
                  ></WorkspaceBadge>{" "}
                </WorkspaceDropdownItem>{" "}
              </WorkspaceDropdownContent>{" "}
            </div>{" "}
            <div className={"pn-col-sm-6 pn-col-lg-3"}>
              {" "}
              <WorkspaceDropdownContent
                className={"pn-dropdown-menu pn-dropdown-menu-demo"}
                data-bs-theme={"dark"}
              >
                {" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Action"}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Another action"}
                </WorkspaceDropdownItem>{" "}
              </WorkspaceDropdownContent>{" "}
              <WorkspaceDropdownContent
                className={"pn-dropdown-menu pn-dropdown-menu-demo"}
                data-bs-theme={"dark"}
              >
                {" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Action"}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Another action"}
                </WorkspaceDropdownItem>{" "}
                <div className={"pn-dropdown-divider"}></div>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Separated link"}
                </WorkspaceDropdownItem>{" "}
              </WorkspaceDropdownContent>{" "}
              <WorkspaceDropdownContent
                className={
                  "pn-dropdown-menu pn-dropdown-menu-end pn-dropdown-menu-demo pn-dropdown-menu-arrow"
                }
                data-bs-theme={"dark"}
              >
                {" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Action"}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  {"Another action"}
                </WorkspaceDropdownItem>{" "}
              </WorkspaceDropdownContent>{" "}
              <WorkspaceDropdownContent
                className={
                  "pn-dropdown-menu pn-dropdown-menu-end pn-dropdown-menu-demo pn-dropdown-menu-arrow"
                }
                data-bs-theme={"dark"}
              >
                {" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
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
                    className={"pn-icon pn-dropdown-item-icon"}
                  >
                    {" "}
                    <path
                      d={
                        "M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065"
                      }
                    ></path>{" "}
                    <path d={"M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"}></path>{" "}
                  </svg>
                  {" Action "}
                </WorkspaceDropdownItem>{" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
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
                    className={"pn-icon pn-dropdown-item-icon"}
                  >
                    {" "}
                    <path
                      d={
                        "M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"
                      }
                    ></path>{" "}
                    <path
                      d={
                        "M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415"
                      }
                    ></path>{" "}
                    <path d={"M16 5l3 3"}></path>{" "}
                  </svg>
                  {" Another action "}
                </WorkspaceDropdownItem>{" "}
              </WorkspaceDropdownContent>{" "}
              <WorkspaceDropdownContent
                className={"pn-dropdown-menu pn-dropdown-menu-demo"}
              >
                {" "}
                <WorkspaceDropdownItem className={"pn-dropdown-item"}>
                  {" "}
                  <WorkspaceInput
                    className={"pn-form-check-input pn-m-0 pn-me-2"}
                    type={"checkbox"}
                  />
                  {" Option 1 "}
                </WorkspaceDropdownItem>
                <WorkspaceDropdownItem className={"pn-dropdown-item"}>
                  {" "}
                  <WorkspaceInput
                    className={"pn-form-check-input pn-m-0 pn-me-2"}
                    type={"checkbox"}
                  />
                  {" Option 2 "}
                </WorkspaceDropdownItem>
                <WorkspaceDropdownItem className={"pn-dropdown-item"}>
                  {" "}
                  <WorkspaceInput
                    className={"pn-form-check-input pn-m-0 pn-me-2"}
                    type={"checkbox"}
                  />
                  {" Option 3 "}
                </WorkspaceDropdownItem>{" "}
              </WorkspaceDropdownContent>{" "}
              <WorkspaceDropdownContent
                className={"pn-dropdown-menu pn-dropdown-menu-demo"}
              >
                {" "}
                <WorkspaceDropdownItem className={"pn-dropdown-item"}>
                  {" "}
                  <WorkspaceInput
                    className={"pn-form-check-input pn-m-0 pn-me-2"}
                    type={"radio"}
                    name={"dropdown-menu-radio"}
                  />
                  {" Option 1 "}
                </WorkspaceDropdownItem>
                <WorkspaceDropdownItem className={"pn-dropdown-item"}>
                  {" "}
                  <WorkspaceInput
                    className={"pn-form-check-input pn-m-0 pn-me-2"}
                    type={"radio"}
                    name={"dropdown-menu-radio"}
                  />
                  {" Option 2 "}
                </WorkspaceDropdownItem>
                <WorkspaceDropdownItem className={"pn-dropdown-item"}>
                  {" "}
                  <WorkspaceInput
                    className={"pn-form-check-input pn-m-0 pn-me-2"}
                    type={"radio"}
                    name={"dropdown-menu-radio"}
                  />
                  {" Option 3 "}
                </WorkspaceDropdownItem>{" "}
              </WorkspaceDropdownContent>{" "}
              <WorkspaceDropdownContent
                className={"pn-dropdown-menu pn-dropdown-menu-demo"}
              >
                {" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  <span
                    style={
                      {
                        backgroundImage:
                          "url(/assets/overtrue/people/leo.svg)",
                      } as CSSProperties
                    }
                    className={"pn-avatar pn-avatar-xs"}
                  ></span>
                  {" Maya Okafor"}
                </WorkspaceDropdownItem>
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  <span
                    style={
                      {
                        backgroundImage:
                          "url(/assets/overtrue/people/maya.svg)",
                      } as CSSProperties
                    }
                    className={"pn-avatar pn-avatar-xs"}
                  ></span>
                  {" Samir Haddad"}
                </WorkspaceDropdownItem>
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  <span
                    style={
                      {
                        backgroundImage:
                          "url(/assets/overtrue/people/june.svg)",
                      } as CSSProperties
                    }
                    className={"pn-avatar pn-avatar-xs"}
                  ></span>
                  {" Ines Duarte"}
                </WorkspaceDropdownItem>
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  <span
                    style={
                      {
                        backgroundImage:
                          "url(/assets/overtrue/people/tomas.svg)",
                      } as CSSProperties
                    }
                    className={"pn-avatar pn-avatar-xs"}
                  ></span>
                  {" Alina Petrova"}
                </WorkspaceDropdownItem>
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  <span
                    style={
                      {
                        backgroundImage:
                          "url(/assets/overtrue/people/maya.svg)",
                      } as CSSProperties
                    }
                    className={"pn-avatar pn-avatar-xs"}
                  ></span>
                  {" Nora Jensen"}
                </WorkspaceDropdownItem>{" "}
              </WorkspaceDropdownContent>{" "}
              <WorkspaceDropdownContent
                className={"pn-dropdown-menu pn-dropdown-menu-demo"}
              >
                {" "}
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  <span className={"pn-flag pn-flag-xs pn-flag-country-us"}></span>
                  {" United States"}
                </WorkspaceDropdownItem>
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  <span className={"pn-flag pn-flag-xs pn-flag-country-gb"}></span>
                  {" United Kingdom"}
                </WorkspaceDropdownItem>
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  <span className={"pn-flag pn-flag-xs pn-flag-country-de"}></span>
                  {" Germany"}
                </WorkspaceDropdownItem>
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  <span className={"pn-flag pn-flag-xs pn-flag-country-fr"}></span>
                  {" France"}
                </WorkspaceDropdownItem>
                <WorkspaceDropdownItem
                  type={"button"}
                  className={"pn-dropdown-item"}
                >
                  <span className={"pn-flag pn-flag-xs pn-flag-country-pl"}></span>
                  {" Poland"}
                </WorkspaceDropdownItem>{" "}
              </WorkspaceDropdownContent>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  )
}
