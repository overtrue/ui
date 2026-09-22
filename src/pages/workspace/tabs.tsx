// Keep page composition editable; interaction belongs in the shared components.
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  WorkspaceDropdown,
  WorkspaceDropdownContent,
  WorkspaceDropdownItem,
  WorkspaceDropdownTrigger,
  WorkspaceLink,
  WorkspaceTab,
  WorkspaceTabPanel,
} from "@/components/overtrue/workspace/primitives"
export default function Page() {
  return (
    <div data-workspace-page="tabs" className="pn-page-wrapper">
      {" "}
      <div className={"pn-page-header pn-d-print-none"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-g-2 pn-align-items-center"}>
            {" "}
            <div className={"pn-col"}>
              {" "}
              <h1 className={"pn-page-title"}>{"Tabs"}</h1>{" "}
              <div className={"pn-text-secondary pn-mt-1"}>
                {"Related project information, one focused view at a time."}
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
            <div className={"pn-col-md-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <ul
                    className={"pn-nav pn-nav-tabs pn-card-header-tabs"}
                    role={"tablist"}
                  >
                    {" "}
                    <li className={"pn-nav-item"} role={"presentation"}>
                      {" "}
                      <WorkspaceTab
                        id={"tabs-home-1-tab"}
                        className={"pn-nav-link pn-active"}
                        data-workspace-group={"tab-group-1"}
                        target={"#tabs-home-1"}
                        group={"tab-group-1"}
                      >
                        {"Home"}
                      </WorkspaceTab>{" "}
                    </li>{" "}
                    <li className={"pn-nav-item"} role={"presentation"}>
                      {" "}
                      <WorkspaceTab
                        id={"tabs-profile-1-tab"}
                        className={"pn-nav-link"}
                        data-workspace-group={"tab-group-1"}
                        target={"#tabs-profile-1"}
                        group={"tab-group-1"}
                      >
                        {"Profile"}
                      </WorkspaceTab>{" "}
                    </li>{" "}
                    <li
                      className={"pn-nav-item pn-ms-auto"}
                      role={"presentation"}
                    >
                      {" "}
                      <WorkspaceTab
                        id={"tabs-settings-1-tab"}
                        className={"pn-nav-link"}
                        title={"Settings"}
                        data-workspace-group={"tab-group-1"}
                        target={"#tabs-settings-1"}
                        group={"tab-group-1"}
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
                              "M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065"
                            }
                          ></path>{" "}
                          <path
                            d={"M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"}
                          ></path>{" "}
                        </svg>{" "}
                      </WorkspaceTab>{" "}
                    </li>{" "}
                  </ul>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-tab-content"}>
                    {" "}
                    <WorkspaceTabPanel
                      className={"pn-tab-pane pn-active pn-show"}
                      id={"tabs-home-1"}
                      data-workspace-group={"tab-group-1"}
                      group={"tab-group-1"}
                    >
                      {" "}
                      <h4>{"Home tab"}</h4>{" "}
                      <div>
                        {
                          "The project brief is our shared starting point. It captures the audience, the intended outcome, and the constraints that shape the work."
                        }
                      </div>{" "}
                    </WorkspaceTabPanel>{" "}
                    <WorkspaceTabPanel
                      className={"pn-tab-pane"}
                      id={"tabs-profile-1"}
                      data-workspace-group={"tab-group-1"}
                      group={"tab-group-1"}
                    >
                      {" "}
                      <h4>{"Profile tab"}</h4>{" "}
                      <div>
                        {
                          "The delivery plan turns the brief into a sequence of useful milestones. Each milestone has one owner and a clear definition of done."
                        }
                      </div>{" "}
                    </WorkspaceTabPanel>{" "}
                    <WorkspaceTabPanel
                      className={"pn-tab-pane"}
                      id={"tabs-settings-1"}
                      data-workspace-group={"tab-group-1"}
                      group={"tab-group-1"}
                    >
                      {" "}
                      <h4>{"Settings tab"}</h4>{" "}
                      <div>
                        {
                          "Keep the conversation close to the work. Record decisions as they happen so the next person can understand how we got here."
                        }
                      </div>{" "}
                    </WorkspaceTabPanel>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <ul
                    className={
                      "pn-nav pn-nav-tabs pn-card-header-tabs pn-flex-row-reverse"
                    }
                    role={"tablist"}
                  >
                    {" "}
                    <li className={"pn-nav-item"} role={"presentation"}>
                      {" "}
                      <WorkspaceTab
                        id={"tabs-home-2-tab"}
                        className={"pn-nav-link pn-active"}
                        data-workspace-group={"tab-group-2"}
                        target={"#tabs-home-2"}
                        group={"tab-group-2"}
                      >
                        {"Home"}
                      </WorkspaceTab>{" "}
                    </li>{" "}
                    <li className={"pn-nav-item"} role={"presentation"}>
                      {" "}
                      <WorkspaceTab
                        id={"tabs-profile-2-tab"}
                        className={"pn-nav-link"}
                        data-workspace-group={"tab-group-2"}
                        target={"#tabs-profile-2"}
                        group={"tab-group-2"}
                      >
                        {"Profile"}
                      </WorkspaceTab>{" "}
                    </li>{" "}
                    <li
                      className={"pn-nav-item pn-me-auto"}
                      role={"presentation"}
                    >
                      {" "}
                      <WorkspaceTab
                        id={"tabs-settings-2-tab"}
                        className={"pn-nav-link"}
                        title={"Settings"}
                        data-workspace-group={"tab-group-2"}
                        target={"#tabs-settings-2"}
                        group={"tab-group-2"}
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
                              "M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065"
                            }
                          ></path>{" "}
                          <path
                            d={"M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"}
                          ></path>{" "}
                        </svg>{" "}
                      </WorkspaceTab>{" "}
                    </li>{" "}
                  </ul>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-tab-content"}>
                    {" "}
                    <WorkspaceTabPanel
                      className={"pn-tab-pane pn-active pn-show"}
                      id={"tabs-home-2"}
                      data-workspace-group={"tab-group-2"}
                      group={"tab-group-2"}
                    >
                      {" "}
                      <h4>{"Home tab"}</h4>{" "}
                      <div>
                        {
                          "The project brief is our shared starting point. It captures the audience, the intended outcome, and the constraints that shape the work."
                        }
                      </div>{" "}
                    </WorkspaceTabPanel>{" "}
                    <WorkspaceTabPanel
                      className={"pn-tab-pane"}
                      id={"tabs-profile-2"}
                      data-workspace-group={"tab-group-2"}
                      group={"tab-group-2"}
                    >
                      {" "}
                      <h4>{"Profile tab"}</h4>{" "}
                      <div>
                        {
                          "The delivery plan turns the brief into a sequence of useful milestones. Each milestone has one owner and a clear definition of done."
                        }
                      </div>{" "}
                    </WorkspaceTabPanel>{" "}
                    <WorkspaceTabPanel
                      className={"pn-tab-pane"}
                      id={"tabs-settings-2"}
                      data-workspace-group={"tab-group-2"}
                      group={"tab-group-2"}
                    >
                      {" "}
                      <h4>{"Settings tab"}</h4>{" "}
                      <div>
                        {
                          "Keep the conversation close to the work. Record decisions as they happen so the next person can understand how we got here."
                        }
                      </div>{" "}
                    </WorkspaceTabPanel>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <ul
                    className={"pn-nav pn-nav-tabs pn-card-header-tabs"}
                    role={"tablist"}
                  >
                    {" "}
                    <li className={"pn-nav-item"} role={"presentation"}>
                      {" "}
                      <WorkspaceTab
                        id={"tabs-home-3-tab"}
                        className={"pn-nav-link pn-active"}
                        data-workspace-group={"tab-group-3"}
                        target={"#tabs-home-3"}
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
                          className={"pn-icon pn-me-2"}
                        >
                          {" "}
                          <path d={"M5 12l-2 0l9 -9l9 9l-2 0"}></path>{" "}
                          <path
                            d={"M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"}
                          ></path>{" "}
                          <path
                            d={"M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"}
                          ></path>
                        </svg>
                        {"Home"}
                      </WorkspaceTab>{" "}
                    </li>{" "}
                    <li className={"pn-nav-item"} role={"presentation"}>
                      {" "}
                      <WorkspaceTab
                        id={"tabs-profile-3-tab"}
                        className={"pn-nav-link"}
                        data-workspace-group={"tab-group-3"}
                        target={"#tabs-profile-3"}
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
                          className={"pn-icon pn-me-2"}
                        >
                          {" "}
                          <path
                            d={"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"}
                          ></path>{" "}
                          <path
                            d={"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                          ></path>
                        </svg>
                        {"Profile"}
                      </WorkspaceTab>{" "}
                    </li>{" "}
                  </ul>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-tab-content"}>
                    {" "}
                    <WorkspaceTabPanel
                      className={"pn-tab-pane pn-active pn-show"}
                      id={"tabs-home-3"}
                      data-workspace-group={"tab-group-3"}
                      group={"tab-group-3"}
                    >
                      {" "}
                      <h4>{"Home tab"}</h4>{" "}
                      <div>
                        {
                          "The project brief is our shared starting point. It captures the audience, the intended outcome, and the constraints that shape the work."
                        }
                      </div>{" "}
                    </WorkspaceTabPanel>{" "}
                    <WorkspaceTabPanel
                      className={"pn-tab-pane"}
                      id={"tabs-profile-3"}
                      data-workspace-group={"tab-group-3"}
                      group={"tab-group-3"}
                    >
                      {" "}
                      <h4>{"Profile tab"}</h4>{" "}
                      <div>
                        {
                          "The delivery plan turns the brief into a sequence of useful milestones. Each milestone has one owner and a clear definition of done."
                        }
                      </div>{" "}
                    </WorkspaceTabPanel>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <ul
                    className={"pn-nav pn-nav-tabs pn-card-header-tabs"}
                    role={"tablist"}
                  >
                    {" "}
                    <li className={"pn-nav-item"} role={"presentation"}>
                      {" "}
                      <WorkspaceTab
                        id={"tabs-home-4-tab"}
                        className={"pn-nav-link pn-active"}
                        data-workspace-group={"tab-group-4"}
                        target={"#tabs-home-4"}
                        group={"tab-group-4"}
                      >
                        {"Home"}
                      </WorkspaceTab>{" "}
                    </li>{" "}
                    <li className={"pn-nav-item"} role={"presentation"}>
                      {" "}
                      <WorkspaceTab
                        id={"tabs-profile-4-tab"}
                        className={"pn-nav-link"}
                        data-workspace-group={"tab-group-4"}
                        target={"#tabs-profile-4"}
                        group={"tab-group-4"}
                      >
                        {"Profile"}
                      </WorkspaceTab>{" "}
                    </li>{" "}
                    <WorkspaceDropdown className={"pn-nav-item pn-dropdown"}>
                      {" "}
                      <WorkspaceDropdownTrigger
                        className={"pn-nav-link pn-dropdown-toggle"}
                        aria-haspopup={"true"}
                      >
                        {" Dropdown "}
                      </WorkspaceDropdownTrigger>{" "}
                      <WorkspaceDropdownContent className={"pn-dropdown-menu"}>
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
                    </WorkspaceDropdown>{" "}
                  </ul>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-tab-content"}>
                    {" "}
                    <WorkspaceTabPanel
                      className={"pn-tab-pane pn-active pn-show"}
                      id={"tabs-home-4"}
                      data-workspace-group={"tab-group-4"}
                      group={"tab-group-4"}
                    >
                      {" "}
                      <h4>{"Home tab"}</h4>{" "}
                      <div>
                        {
                          "Keep the conversation close to the work. Record decisions as they happen so the next person can understand how we got here."
                        }
                      </div>{" "}
                    </WorkspaceTabPanel>{" "}
                    <WorkspaceTabPanel
                      className={"pn-tab-pane"}
                      id={"tabs-profile-4"}
                      data-workspace-group={"tab-group-4"}
                      group={"tab-group-4"}
                    >
                      {" "}
                      <h4>{"Profile tab"}</h4>{" "}
                      <div>
                        {
                          "The project brief is our shared starting point. It captures the audience, the intended outcome, and the constraints that shape the work."
                        }
                      </div>{" "}
                    </WorkspaceTabPanel>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <ul
                    className={"pn-nav pn-nav-tabs pn-card-header-tabs pn-nav-fill"}
                    role={"tablist"}
                  >
                    {" "}
                    <li className={"pn-nav-item"} role={"presentation"}>
                      {" "}
                      <WorkspaceTab
                        id={"tabs-home-5-tab"}
                        className={"pn-nav-link pn-active"}
                        data-workspace-group={"tab-group-5"}
                        target={"#tabs-home-5"}
                        group={"tab-group-5"}
                      >
                        {"Home"}
                      </WorkspaceTab>{" "}
                    </li>{" "}
                    <li className={"pn-nav-item"} role={"presentation"}>
                      {" "}
                      <WorkspaceTab
                        id={"tabs-profile-5-tab"}
                        className={"pn-nav-link"}
                        data-workspace-group={"tab-group-5"}
                        target={"#tabs-profile-5"}
                        group={"tab-group-5"}
                      >
                        {"Profile"}
                      </WorkspaceTab>{" "}
                    </li>{" "}
                    <li className={"pn-nav-item"} role={"presentation"}>
                      {" "}
                      <WorkspaceTab
                        id={"tabs-activity-5-tab"}
                        className={"pn-nav-link"}
                        data-workspace-group={"tab-group-5"}
                        target={"#tabs-activity-5"}
                        group={"tab-group-5"}
                      >
                        {" Activity "}
                      </WorkspaceTab>{" "}
                    </li>{" "}
                  </ul>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-tab-content"}>
                    {" "}
                    <WorkspaceTabPanel
                      className={"pn-tab-pane pn-active pn-show"}
                      id={"tabs-home-5"}
                      data-workspace-group={"tab-group-5"}
                      group={"tab-group-5"}
                    >
                      {" "}
                      <h4>{"Home tab"}</h4>{" "}
                      <div>
                        {
                          "The delivery plan turns the brief into a sequence of useful milestones. Each milestone has one owner and a clear definition of done."
                        }
                      </div>{" "}
                    </WorkspaceTabPanel>{" "}
                    <WorkspaceTabPanel
                      className={"pn-tab-pane"}
                      id={"tabs-profile-5"}
                      data-workspace-group={"tab-group-5"}
                      group={"tab-group-5"}
                    >
                      {" "}
                      <h4>{"Profile tab"}</h4>{" "}
                      <div>
                        {
                          "Keep the conversation close to the work. Record decisions as they happen so the next person can understand how we got here."
                        }
                      </div>{" "}
                    </WorkspaceTabPanel>{" "}
                    <WorkspaceTabPanel
                      className={"pn-tab-pane"}
                      id={"tabs-activity-5"}
                      data-workspace-group={"tab-group-5"}
                      group={"tab-group-5"}
                    >
                      {" "}
                      <h4>{"Activity tab"}</h4>{" "}
                      <div>
                        {
                          "The project brief is our shared starting point. It captures the audience, the intended outcome, and the constraints that shape the work."
                        }
                      </div>{" "}
                    </WorkspaceTabPanel>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <ul
                    className={"pn-nav pn-nav-tabs pn-card-header-tabs pn-nav-fill"}
                    role={"tablist"}
                  >
                    {" "}
                    <li className={"pn-nav-item"} role={"presentation"}>
                      {" "}
                      <WorkspaceTab
                        id={"tabs-home-6-tab"}
                        className={"pn-nav-link pn-active"}
                        data-workspace-group={"tab-group-6"}
                        target={"#tabs-home-6"}
                        group={"tab-group-6"}
                      >
                        {"Home"}
                      </WorkspaceTab>{" "}
                    </li>{" "}
                    <li className={"pn-nav-item"} role={"presentation"}>
                      {" "}
                      <WorkspaceTab
                        id={"tabs-profile-6-tab"}
                        className={"pn-nav-link"}
                        data-workspace-group={"tab-group-6"}
                        target={"#tabs-profile-6"}
                        group={"tab-group-6"}
                      >
                        {"Profile"}
                      </WorkspaceTab>{" "}
                    </li>{" "}
                    <li className={"pn-nav-item"} role={"presentation"}>
                      {" "}
                      <WorkspaceTab
                        className={"pn-nav-link pn-disabled"}
                        aria-disabled={"true"}
                        tabIndex={-1}
                        data-workspace-group={"tab-group-6"}
                        target={"#"}
                        group={"tab-group-6"}
                      >
                        {" Disabled "}
                      </WorkspaceTab>{" "}
                    </li>{" "}
                  </ul>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-tab-content"}>
                    {" "}
                    <WorkspaceTabPanel
                      className={"pn-tab-pane pn-active pn-show"}
                      id={"tabs-home-6"}
                      data-workspace-group={"tab-group-6"}
                      group={"tab-group-6"}
                    >
                      {" "}
                      <h4>{"Home tab"}</h4>{" "}
                      <div>
                        {
                          "The delivery plan turns the brief into a sequence of useful milestones. Each milestone has one owner and a clear definition of done."
                        }
                      </div>{" "}
                    </WorkspaceTabPanel>{" "}
                    <WorkspaceTabPanel
                      className={"pn-tab-pane"}
                      id={"tabs-profile-6"}
                      data-workspace-group={"tab-group-6"}
                      group={"tab-group-6"}
                    >
                      {" "}
                      <h4>{"Profile tab"}</h4>{" "}
                      <div>
                        {
                          "Keep the conversation close to the work. Record decisions as they happen so the next person can understand how we got here."
                        }
                      </div>{" "}
                    </WorkspaceTabPanel>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <ul
                    className={"pn-nav pn-nav-tabs pn-card-header-tabs pn-nav-fill"}
                    role={"tablist"}
                  >
                    {" "}
                    <li className={"pn-nav-item"} role={"presentation"}>
                      {" "}
                      <WorkspaceTab
                        id={"tabs-home-7-tab"}
                        className={"pn-nav-link pn-active"}
                        data-workspace-group={"tab-group-7"}
                        target={"#tabs-home-7"}
                        group={"tab-group-7"}
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
                          className={"pn-icon pn-me-2"}
                        >
                          {" "}
                          <path d={"M5 12l-2 0l9 -9l9 9l-2 0"}></path>{" "}
                          <path
                            d={"M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"}
                          ></path>{" "}
                          <path
                            d={"M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"}
                          ></path>
                        </svg>
                        {"Home"}
                      </WorkspaceTab>{" "}
                    </li>{" "}
                    <li className={"pn-nav-item"} role={"presentation"}>
                      {" "}
                      <WorkspaceTab
                        id={"tabs-profile-7-tab"}
                        className={"pn-nav-link"}
                        data-workspace-group={"tab-group-7"}
                        target={"#tabs-profile-7"}
                        group={"tab-group-7"}
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
                          className={"pn-icon pn-me-2"}
                        >
                          {" "}
                          <path
                            d={"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"}
                          ></path>{" "}
                          <path
                            d={"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                          ></path>
                        </svg>
                        {"Profile"}
                      </WorkspaceTab>{" "}
                    </li>{" "}
                    <li className={"pn-nav-item"} role={"presentation"}>
                      {" "}
                      <WorkspaceTab
                        id={"tabs-activity-7-tab"}
                        className={"pn-nav-link"}
                        data-workspace-group={"tab-group-7"}
                        target={"#tabs-activity-7"}
                        group={"tab-group-7"}
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
                          className={"pn-icon pn-me-2"}
                        >
                          <path d={"M3 12h4l3 8l4 -16l3 8h4"}></path>
                        </svg>
                        {" Activity "}
                      </WorkspaceTab>{" "}
                    </li>{" "}
                  </ul>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-tab-content"}>
                    {" "}
                    <WorkspaceTabPanel
                      className={"pn-tab-pane pn-active pn-show"}
                      id={"tabs-home-7"}
                      data-workspace-group={"tab-group-7"}
                      group={"tab-group-7"}
                    >
                      {" "}
                      <h4>{"Home tab"}</h4>{" "}
                      <div>
                        {
                          "The project brief is our shared starting point. It captures the audience, the intended outcome, and the constraints that shape the work."
                        }
                      </div>{" "}
                    </WorkspaceTabPanel>{" "}
                    <WorkspaceTabPanel
                      className={"pn-tab-pane"}
                      id={"tabs-profile-7"}
                      data-workspace-group={"tab-group-7"}
                      group={"tab-group-7"}
                    >
                      {" "}
                      <h4>{"Profile tab"}</h4>{" "}
                      <div>
                        {
                          "The delivery plan turns the brief into a sequence of useful milestones. Each milestone has one owner and a clear definition of done."
                        }
                      </div>{" "}
                    </WorkspaceTabPanel>{" "}
                    <WorkspaceTabPanel
                      className={"pn-tab-pane"}
                      id={"tabs-activity-7"}
                      data-workspace-group={"tab-group-7"}
                      group={"tab-group-7"}
                    >
                      {" "}
                      <h4>{"Activity tab"}</h4>{" "}
                      <div>
                        {
                          "Keep the conversation close to the work. Record decisions as they happen so the next person can understand how we got here."
                        }
                      </div>{" "}
                    </WorkspaceTabPanel>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <ul
                    className={"pn-nav pn-nav-tabs pn-card-header-tabs"}
                    role={"tablist"}
                  >
                    {" "}
                    <li className={"pn-nav-item"} role={"presentation"}>
                      {" "}
                      <WorkspaceTab
                        id={"tabs-home-8-tab"}
                        className={"pn-nav-link pn-active"}
                        data-workspace-group={"tab-group-8"}
                        target={"#tabs-home-8"}
                        group={"tab-group-8"}
                      >
                        {"Home"}
                      </WorkspaceTab>{" "}
                    </li>{" "}
                    <li className={"pn-nav-item"} role={"presentation"}>
                      {" "}
                      <WorkspaceTab
                        id={"tabs-profile-8-tab"}
                        className={"pn-nav-link"}
                        data-workspace-group={"tab-group-8"}
                        target={"#tabs-profile-8"}
                        group={"tab-group-8"}
                      >
                        {"Profile"}
                      </WorkspaceTab>{" "}
                    </li>{" "}
                    <li className={"pn-nav-item"} role={"presentation"}>
                      {" "}
                      <WorkspaceTab
                        id={"tabs-activity-8-tab"}
                        className={"pn-nav-link"}
                        data-workspace-group={"tab-group-8"}
                        target={"#tabs-activity-8"}
                        group={"tab-group-8"}
                      >
                        {" Activity "}
                      </WorkspaceTab>{" "}
                    </li>{" "}
                  </ul>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-tab-content"}>
                    {" "}
                    <WorkspaceTabPanel
                      className={"pn-tab-pane pn-fade pn-active pn-show"}
                      id={"tabs-home-8"}
                      data-workspace-group={"tab-group-8"}
                      group={"tab-group-8"}
                    >
                      {" "}
                      <h4>{"Home tab"}</h4>{" "}
                      <div>
                        {
                          "The project brief is our shared starting point. It captures the audience, the intended outcome, and the constraints that shape the work."
                        }
                      </div>{" "}
                    </WorkspaceTabPanel>{" "}
                    <WorkspaceTabPanel
                      className={"pn-tab-pane pn-fade"}
                      id={"tabs-profile-8"}
                      data-workspace-group={"tab-group-8"}
                      group={"tab-group-8"}
                    >
                      {" "}
                      <h4>{"Profile tab"}</h4>{" "}
                      <div>
                        {
                          "The delivery plan turns the brief into a sequence of useful milestones. Each milestone has one owner and a clear definition of done."
                        }
                      </div>{" "}
                    </WorkspaceTabPanel>{" "}
                    <WorkspaceTabPanel
                      className={"pn-tab-pane pn-fade"}
                      id={"tabs-activity-8"}
                      data-workspace-group={"tab-group-8"}
                      group={"tab-group-8"}
                    >
                      {" "}
                      <h4>{"Activity tab"}</h4>{" "}
                      <div>
                        {
                          "Keep the conversation close to the work. Record decisions as they happen so the next person can understand how we got here."
                        }
                      </div>{" "}
                    </WorkspaceTabPanel>{" "}
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
