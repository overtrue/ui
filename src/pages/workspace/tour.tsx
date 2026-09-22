// Keep page composition editable; interaction belongs in the shared components.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  WorkspaceBadge,
  WorkspaceButton,
  WorkspaceInput,
} from "@/components/overtrue/workspace/primitives"
export default function Page() {
  return (
    <div data-workspace-page="tour" className="pn-page-wrapper">
      {" "}
      <div className={"pn-page-header pn-d-print-none"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-g-2 pn-align-items-center"}>
            {" "}
            <div className={"pn-col"}>
              {" "}
              <h1 className={"pn-page-title"}>{"Driver Tour"}</h1>{" "}
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
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Product Tour Example"}
                  </CardTitle>{" "}
                  <div className={"pn-card-actions"}>
                    {" "}
                    <WorkspaceButton
                      type={"button"}
                      id={"start-tour"}
                      className={"pn-btn pn-btn-primary"}
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
                        <path d={"M7 4v16l13 -8l-13 -8"}></path>
                      </svg>
                      {"Start Tour "}
                    </WorkspaceButton>{" "}
                  </div>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <p>
                    {
                      'Click the "Start Tour" button to begin an interactive tour of this page. The tour will guide you through different elements and features.'
                    }
                  </p>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-6"}>
              {" "}
              <Card id={"tour-card-1"} className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Welcome Section"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <p>
                    {
                      "This is the first card in our tour. It demonstrates how Driver.js highlights elements on the page."
                    }
                  </p>{" "}
                  <div className={"pn-btn-list"}>
                    {" "}
                    <WorkspaceButton
                      type={"button"}
                      className={"pn-btn pn-btn-primary"}
                    >
                      {"Action Button"}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton type={"button"} className={"pn-btn"}>
                      {"Secondary"}
                    </WorkspaceButton>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-6"}>
              {" "}
              <Card id={"tour-card-2"} className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Features Section"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <p>
                    {
                      "This card shows additional features and demonstrates the tour's ability to navigate between different elements."
                    }
                  </p>{" "}
                  <div className={"pn-form-selectgroup"}>
                    {" "}
                    <label className={"pn-form-selectgroup-item"}>
                      {" "}
                      <WorkspaceInput
                        type={"radio"}
                        name={"options"}
                        defaultValue={"1"}
                        className={"pn-form-selectgroup-input"}
                        defaultChecked
                      />{" "}
                      <span className={"pn-form-selectgroup-label"}>
                        {"Option 1"}
                      </span>{" "}
                    </label>{" "}
                    <label className={"pn-form-selectgroup-item"}>
                      {" "}
                      <WorkspaceInput
                        type={"radio"}
                        name={"options"}
                        defaultValue={"2"}
                        className={"pn-form-selectgroup-input"}
                      />{" "}
                      <span className={"pn-form-selectgroup-label"}>
                        {"Option 2"}
                      </span>{" "}
                    </label>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-12"}>
              {" "}
              <Card id={"tour-card-3"} className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Navigation Example"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <p>
                    {
                      "This is a full-width card that demonstrates how the tour works with larger elements."
                    }
                  </p>{" "}
                  <div className={"pn-table-responsive"}>
                    {" "}
                    <table className={"pn-table pn-table-vcenter"}>
                      <thead>
                        <tr>
                          <th>{"Name"}</th>
                          <th>{"Status"}</th>
                          <th>{"Role"}</th>
                          <th className={"pn-w-1"}></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{"John Doe"}</td>
                          <td>
                            <WorkspaceBadge
                              className={
                                "pn-badge pn-bg-success pn-text-success-fg"
                              }
                            >
                              {"Active"}
                            </WorkspaceBadge>
                          </td>
                          <td>{"Developer"}</td>
                          <td>
                            {" "}
                            <WorkspaceButton
                              href={"#"}
                              className={"pn-btn pn-btn-sm"}
                            >
                              {"Edit"}
                            </WorkspaceButton>{" "}
                          </td>
                        </tr>
                        <tr>
                          <td>{"Jane Smith"}</td>
                          <td>
                            <WorkspaceBadge
                              className={
                                "pn-badge pn-bg-warning pn-text-warning-fg"
                              }
                            >
                              {"Pending"}
                            </WorkspaceBadge>
                          </td>
                          <td>{"Designer"}</td>
                          <td>
                            {" "}
                            <WorkspaceButton
                              href={"#"}
                              className={"pn-btn pn-btn-sm"}
                            >
                              {"Edit"}
                            </WorkspaceButton>{" "}
                          </td>
                        </tr>
                      </tbody>
                    </table>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-4"}>
              {" "}
              <Card id={"tour-card-4"} className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body pn-text-center"}>
                  {" "}
                  <div className={"pn-mb-3"}>
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
                      className={"pn-icon pn-icon-lg"}
                    >
                      {" "}
                      <path
                        d={
                          "M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065"
                        }
                      ></path>{" "}
                      <path
                        d={"M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"}
                      ></path>{" "}
                    </svg>{" "}
                  </div>{" "}
                  <CardTitle className={"pn-card-title"}>{"Settings"}</CardTitle>{" "}
                  <p className={"pn-text-secondary"}>
                    {"Configure your application settings here."}
                  </p>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-4"}>
              {" "}
              <Card id={"tour-card-5"} className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body pn-text-center"}>
                  {" "}
                  <div className={"pn-mb-3"}>
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
                      className={"pn-icon pn-icon-lg"}
                    >
                      {" "}
                      <path d={"M5 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"}></path>{" "}
                      <path
                        d={"M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                      ></path>{" "}
                      <path d={"M16 3.13a4 4 0 0 1 0 7.75"}></path>{" "}
                      <path d={"M21 21v-2a4 4 0 0 0 -3 -3.85"}></path>{" "}
                    </svg>{" "}
                  </div>{" "}
                  <CardTitle className={"pn-card-title"}>{"Users"}</CardTitle>{" "}
                  <p className={"pn-text-secondary"}>
                    {"Manage your team members and permissions."}
                  </p>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-4"}>
              {" "}
              <Card id={"tour-card-6"} className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body pn-text-center"}>
                  {" "}
                  <div className={"pn-mb-3"}>
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
                      className={"pn-icon pn-icon-lg"}
                    >
                      {" "}
                      <path
                        d={
                          "M3 13a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -6"
                        }
                      ></path>{" "}
                      <path
                        d={
                          "M15 9a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -10"
                        }
                      ></path>{" "}
                      <path
                        d={
                          "M9 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -14"
                        }
                      ></path>{" "}
                      <path d={"M4 20h14"}></path>{" "}
                    </svg>{" "}
                  </div>{" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Analytics"}
                  </CardTitle>{" "}
                  <p className={"pn-text-secondary"}>
                    {"View your application statistics and reports."}
                  </p>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  )
}
