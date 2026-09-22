// Keep page composition editable; interaction belongs in the shared components.
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import {
  WorkspaceBadge,
  WorkspaceButton,
  WorkspaceDropdownContent,
  WorkspaceDropdownItem,
  WorkspaceLink,
} from "@/components/overtrue/workspace/primitives"
export default function Page() {
  return (
    <div data-workspace-page="badges" className="pn-page-wrapper">
      {" "}
      <div className={"pn-page-header pn-d-print-none"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-g-2 pn-align-items-center"}>
            {" "}
            <div className={"pn-col"}>
              {" "}
              <h1 className={"pn-page-title"}>{"Badges"}</h1>{" "}
              <div className={"pn-text-secondary pn-mt-1"}>
                {
                  "Small signals that make a busy workspace easier to scan."
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
          <div className={"pn-row pn-row-cards pn-mb-5"}>
            {" "}
            <div className={"pn-col-md-6 pn-col-lg-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"In headings"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"A badge scales with the heading level it sits next to."}
                  </CardDescription>{" "}
                  <h1>
                    {"Example heading "}
                    <WorkspaceBadge className={"pn-badge"}>{"New"}</WorkspaceBadge>
                  </h1>{" "}
                  <h2>
                    {"Example heading "}
                    <WorkspaceBadge className={"pn-badge"}>{"New"}</WorkspaceBadge>
                  </h2>{" "}
                  <h3>
                    {"Example heading "}
                    <WorkspaceBadge className={"pn-badge"}>{"New"}</WorkspaceBadge>
                  </h3>{" "}
                  <h4>
                    {"Example heading "}
                    <WorkspaceBadge className={"pn-badge"}>{"New"}</WorkspaceBadge>
                  </h4>{" "}
                  <h5>
                    {"Example heading "}
                    <WorkspaceBadge className={"pn-badge"}>{"New"}</WorkspaceBadge>
                  </h5>{" "}
                  <h6>
                    {"Example heading "}
                    <WorkspaceBadge className={"pn-badge"}>{"New"}</WorkspaceBadge>
                  </h6>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-6 pn-col-lg-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Sizes"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {
                      "Three sizes, with an optional icon before or after the label."
                    }
                  </CardDescription>{" "}
                  <div className={"pn-space-y"}>
                    {" "}
                    <div className={"pn-badge-list"}>
                      {" "}
                      <WorkspaceBadge className={"pn-badge pn-badge-sm"}>
                        {"Default"}
                      </WorkspaceBadge>{" "}
                      <WorkspaceBadge className={"pn-badge pn-badge-sm"}>
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
                          <path d={"M5 12l5 5l10 -10"}></path>
                        </svg>
                        {" Left icon "}
                      </WorkspaceBadge>{" "}
                      <WorkspaceBadge className={"pn-badge pn-badge-sm"}>
                        {" Right icon "}{" "}
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
                          <path d={"M5 12l14 0"}></path>{" "}
                          <path d={"M13 18l6 -6"}></path>{" "}
                          <path d={"M13 6l6 6"}></path>{" "}
                        </svg>{" "}
                      </WorkspaceBadge>{" "}
                      <WorkspaceBadge
                        className={"pn-badge pn-badge-icononly pn-badge-sm"}
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
                              "M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
                            }
                          ></path>{" "}
                        </svg>{" "}
                      </WorkspaceBadge>{" "}
                    </div>{" "}
                    <div className={"pn-badge-list"}>
                      {" "}
                      <WorkspaceBadge className={"pn-badge"}>
                        {"Default"}
                      </WorkspaceBadge>{" "}
                      <WorkspaceBadge className={"pn-badge"}>
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
                          <path d={"M5 12l5 5l10 -10"}></path>
                        </svg>
                        {" Left icon "}
                      </WorkspaceBadge>{" "}
                      <WorkspaceBadge className={"pn-badge"}>
                        {" Right icon "}{" "}
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
                          <path d={"M5 12l14 0"}></path>{" "}
                          <path d={"M13 18l6 -6"}></path>{" "}
                          <path d={"M13 6l6 6"}></path>{" "}
                        </svg>{" "}
                      </WorkspaceBadge>{" "}
                      <WorkspaceBadge className={"pn-badge pn-badge-icononly"}>
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
                              "M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
                            }
                          ></path>{" "}
                        </svg>{" "}
                      </WorkspaceBadge>{" "}
                    </div>{" "}
                    <div className={"pn-badge-list"}>
                      {" "}
                      <WorkspaceBadge className={"pn-badge pn-badge-lg"}>
                        {"Default"}
                      </WorkspaceBadge>{" "}
                      <WorkspaceBadge className={"pn-badge pn-badge-lg"}>
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
                          <path d={"M5 12l5 5l10 -10"}></path>
                        </svg>
                        {" Left icon "}
                      </WorkspaceBadge>{" "}
                      <WorkspaceBadge className={"pn-badge pn-badge-lg"}>
                        {" Right icon "}{" "}
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
                          <path d={"M5 12l14 0"}></path>{" "}
                          <path d={"M13 18l6 -6"}></path>{" "}
                          <path d={"M13 6l6 6"}></path>{" "}
                        </svg>{" "}
                      </WorkspaceBadge>{" "}
                      <WorkspaceBadge
                        className={"pn-badge pn-badge-icononly pn-badge-lg"}
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
                              "M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
                            }
                          ></path>{" "}
                        </svg>{" "}
                      </WorkspaceBadge>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-6 pn-col-lg-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Positioned"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Attach a count or a dot to a button with "}
                    <code>{".badge-notification"}</code>
                    {"."}
                  </CardDescription>{" "}
                  <div className={"pn-btn-list"}>
                    {" "}
                    <WorkspaceButton type={"button"} className={"pn-btn"}>
                      {"Notifications "}
                      <WorkspaceBadge
                        className={"pn-badge pn-text-bg-secondary pn-ms-2"}
                      >
                        {"4"}
                      </WorkspaceBadge>
                    </WorkspaceButton>{" "}
                    <WorkspaceButton type={"button"} className={"pn-btn"}>
                      {" Inbox "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-red pn-badge-notification pn-text-red-fg"
                        }
                      >
                        {" 9+ "}
                        <span className={"pn-visually-hidden"}>
                          {"unread messages"}
                        </span>{" "}
                      </WorkspaceBadge>{" "}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton type={"button"} className={"pn-btn"}>
                      {" Profile "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-badge-dot pn-bg-red pn-badge-notification"
                        }
                      ></WorkspaceBadge>{" "}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton type={"button"} className={"pn-btn"}>
                      {" Settings "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-badge-dot pn-bg-red pn-badge-notification pn-badge-blink"
                        }
                      ></WorkspaceBadge>{" "}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton
                      type={"button"}
                      className={"pn-btn pn-btn-icon"} aria-label="Notifications"
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
                            "M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"
                          }
                        ></path>{" "}
                        <path d={"M9 17v1a3 3 0 0 0 6 0v-1"}></path>{" "}
                      </svg>{" "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-badge-dot pn-bg-red pn-badge-notification pn-badge-blink"
                        }
                      ></WorkspaceBadge>{" "}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton
                      type={"button"}
                      className={"pn-btn pn-btn-icon pn-btn-action"}
                      aria-label={"Notifications"}
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
                            "M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"
                          }
                        ></path>{" "}
                        <path d={"M9 17v1a3 3 0 0 0 6 0v-1"}></path>{" "}
                      </svg>{" "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-badge-dot pn-bg-red pn-badge-notification"
                        }
                      ></WorkspaceBadge>{" "}
                    </WorkspaceButton>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-6 pn-col-lg-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"In a dropdown"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"A badge inside a dropdown item."}
                  </CardDescription>{" "}
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
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-6 pn-col-lg-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"On buttons"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Pair any badge color with a button label."}
                  </CardDescription>{" "}
                  <div className={"pn-btn-list"}>
                    {" "}
                    <WorkspaceButton className={"pn-btn"}>
                      {"Blue badge "}
                      <WorkspaceBadge
                        className={"pn-badge pn-bg-blue pn-text-blue-fg pn-ms-2"}
                      >
                        {"1"}
                      </WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {"Azure badge "}
                      <WorkspaceBadge
                        className={"pn-badge pn-bg-azure pn-text-azure-fg pn-ms-2"}
                      >
                        {"2"}
                      </WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {"Indigo badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-indigo pn-text-indigo-fg pn-ms-2"
                        }
                      >
                        {"3"}
                      </WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {"Purple badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-purple pn-text-purple-fg pn-ms-2"
                        }
                      >
                        {"4"}
                      </WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {"Pink badge "}
                      <WorkspaceBadge
                        className={"pn-badge pn-bg-pink pn-text-pink-fg pn-ms-2"}
                      >
                        {"5"}
                      </WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {"Red badge "}
                      <WorkspaceBadge
                        className={"pn-badge pn-bg-red pn-text-red-fg pn-ms-2"}
                      >
                        {"6"}
                      </WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {"Orange badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-orange pn-text-orange-fg pn-ms-2"
                        }
                      >
                        {"7"}
                      </WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {"Yellow badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-yellow pn-text-yellow-fg pn-ms-2"
                        }
                      >
                        {"8"}
                      </WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {"Lime badge "}
                      <WorkspaceBadge
                        className={"pn-badge pn-bg-lime pn-text-lime-fg pn-ms-2"}
                      >
                        {"9"}
                      </WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {"Green badge "}
                      <WorkspaceBadge
                        className={"pn-badge pn-bg-green pn-text-green-fg pn-ms-2"}
                      >
                        {"10"}
                      </WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {"Teal badge "}
                      <WorkspaceBadge
                        className={"pn-badge pn-bg-teal pn-text-teal-fg pn-ms-2"}
                      >
                        {"11"}
                      </WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {"Cyan badge "}
                      <WorkspaceBadge
                        className={"pn-badge pn-bg-cyan pn-text-cyan-fg pn-ms-2"}
                      >
                        {"12"}
                      </WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {"Dark badge "}
                      <WorkspaceBadge
                        className={"pn-badge pn-bg-dark pn-text-dark-fg pn-ms-2"}
                      >
                        {"13"}
                      </WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {"Light badge "}
                      <WorkspaceBadge
                        className={"pn-badge pn-bg-light pn-text-light-fg pn-ms-2"}
                      >
                        {"14"}
                      </WorkspaceBadge>
                    </WorkspaceButton>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-6 pn-col-lg-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Notification dot"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {
                      "A pill-shaped counter positioned on the corner of a button."
                    }
                  </CardDescription>{" "}
                  <div className={"pn-btn-list"}>
                    {" "}
                    <WorkspaceButton className={"pn-btn pn-position-relative"}>
                      {"Blue badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-blue pn-text-blue-fg pn-badge-notification pn-badge-pill"
                        }
                      >
                        {"1"}
                      </WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-position-relative"}>
                      {"Azure badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-azure pn-text-azure-fg pn-badge-notification pn-badge-pill"
                        }
                      >
                        {"2"}
                      </WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-position-relative"}>
                      {"Indigo badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-indigo pn-text-indigo-fg pn-badge-notification pn-badge-pill"
                        }
                      >
                        {"3"}
                      </WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-position-relative"}>
                      {"Purple badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-purple pn-text-purple-fg pn-badge-notification pn-badge-pill"
                        }
                      >
                        {"4"}
                      </WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-position-relative"}>
                      {"Pink badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-pink pn-text-pink-fg pn-badge-notification pn-badge-pill"
                        }
                      >
                        {"5"}
                      </WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-position-relative"}>
                      {"Red badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-red pn-text-red-fg pn-badge-notification pn-badge-pill"
                        }
                      >
                        {"6"}
                      </WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-position-relative"}>
                      {"Orange badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-orange pn-text-orange-fg pn-badge-notification pn-badge-pill"
                        }
                      >
                        {"7"}
                      </WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-position-relative"}>
                      {"Yellow badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-yellow pn-text-yellow-fg pn-badge-notification pn-badge-pill"
                        }
                      >
                        {"8"}
                      </WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-position-relative"}>
                      {"Lime badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-lime pn-text-lime-fg pn-badge-notification pn-badge-pill"
                        }
                      >
                        {"9"}
                      </WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-position-relative"}>
                      {"Green badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-green pn-text-green-fg pn-badge-notification pn-badge-pill"
                        }
                      >
                        {"10"}
                      </WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-position-relative"}>
                      {"Teal badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-teal pn-text-teal-fg pn-badge-notification pn-badge-pill"
                        }
                      >
                        {"11"}
                      </WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-position-relative"}>
                      {"Cyan badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-cyan pn-text-cyan-fg pn-badge-notification pn-badge-pill"
                        }
                      >
                        {"12"}
                      </WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-position-relative"}>
                      {"Dark badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-dark pn-text-dark-fg pn-badge-notification pn-badge-pill"
                        }
                      >
                        {"13"}
                      </WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-position-relative"}>
                      {"Light badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-light pn-text-light-fg pn-badge-notification pn-badge-pill"
                        }
                      >
                        {"14"}
                      </WorkspaceBadge>
                    </WorkspaceButton>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-6 pn-col-lg-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Blinking notification"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Add "}
                    <code>{".badge-blink"}</code>
                    {" to draw attention to unread activity."}
                  </CardDescription>{" "}
                  <div className={"pn-btn-list"}>
                    {" "}
                    <WorkspaceButton className={"pn-btn pn-position-relative"}>
                      {"Blue badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-blue pn-badge-notification pn-badge-blink"
                        }
                      ></WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-position-relative"}>
                      {"Azure badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-azure pn-badge-notification pn-badge-blink"
                        }
                      ></WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-position-relative"}>
                      {"Indigo badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-indigo pn-badge-notification pn-badge-blink"
                        }
                      ></WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-position-relative"}>
                      {"Purple badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-purple pn-badge-notification pn-badge-blink"
                        }
                      ></WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-position-relative"}>
                      {"Pink badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-pink pn-badge-notification pn-badge-blink"
                        }
                      ></WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-position-relative"}>
                      {"Red badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-red pn-badge-notification pn-badge-blink"
                        }
                      ></WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-position-relative"}>
                      {"Orange badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-orange pn-badge-notification pn-badge-blink"
                        }
                      ></WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-position-relative"}>
                      {"Yellow badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-yellow pn-badge-notification pn-badge-blink"
                        }
                      ></WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-position-relative"}>
                      {"Lime badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-lime pn-badge-notification pn-badge-blink"
                        }
                      ></WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-position-relative"}>
                      {"Green badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-green pn-badge-notification pn-badge-blink"
                        }
                      ></WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-position-relative"}>
                      {"Teal badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-teal pn-badge-notification pn-badge-blink"
                        }
                      ></WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-position-relative"}>
                      {"Cyan badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-cyan pn-badge-notification pn-badge-blink"
                        }
                      ></WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-position-relative"}>
                      {"Dark badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-dark pn-badge-notification pn-badge-blink"
                        }
                      ></WorkspaceBadge>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-position-relative"}>
                      {"Light badge "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-light pn-badge-notification pn-badge-blink"
                        }
                      ></WorkspaceBadge>
                    </WorkspaceButton>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
          </div>{" "}
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
                    {"Fill a badge with a theme or extended color."}
                  </CardDescription>{" "}
                  <div className={"pn-badge-list"}>
                    {" "}
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-blue pn-text-blue-fg"}
                    >
                      {"Blue"}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-azure pn-text-azure-fg"}
                    >
                      {"Azure"}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-indigo pn-text-indigo-fg"}
                    >
                      {"Indigo"}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-purple pn-text-purple-fg"}
                    >
                      {"Purple"}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-pink pn-text-pink-fg"}
                    >
                      {"Pink"}
                    </WorkspaceBadge>
                    <WorkspaceBadge className={"pn-badge pn-bg-red pn-text-red-fg"}>
                      {"Red"}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-orange pn-text-orange-fg"}
                    >
                      {"Orange"}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-yellow pn-text-yellow-fg"}
                    >
                      {"Yellow"}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-lime pn-text-lime-fg"}
                    >
                      {"Lime"}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-green pn-text-green-fg"}
                    >
                      {"Green"}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-teal pn-text-teal-fg"}
                    >
                      {"Teal"}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-cyan pn-text-cyan-fg"}
                    >
                      {"Cyan"}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-dark pn-text-dark-fg"}
                    >
                      {"Dark"}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-light pn-text-light-fg"}
                    >
                      {"Light"}
                    </WorkspaceBadge>{" "}
                  </div>{" "}
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
                    {"Light"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"A tinted background for a softer, secondary badge."}
                  </CardDescription>{" "}
                  <div className={"pn-badge-list"}>
                    {" "}
                    <WorkspaceBadge className={"pn-badge pn-bg-blue-lt"}>
                      {"Blue"}
                    </WorkspaceBadge>
                    <WorkspaceBadge className={"pn-badge pn-bg-azure-lt"}>
                      {"Azure"}
                    </WorkspaceBadge>
                    <WorkspaceBadge className={"pn-badge pn-bg-indigo-lt"}>
                      {"Indigo"}
                    </WorkspaceBadge>
                    <WorkspaceBadge className={"pn-badge pn-bg-purple-lt"}>
                      {"Purple"}
                    </WorkspaceBadge>
                    <WorkspaceBadge className={"pn-badge pn-bg-pink-lt"}>
                      {"Pink"}
                    </WorkspaceBadge>
                    <WorkspaceBadge className={"pn-badge pn-bg-red-lt"}>
                      {"Red"}
                    </WorkspaceBadge>
                    <WorkspaceBadge className={"pn-badge pn-bg-orange-lt"}>
                      {"Orange"}
                    </WorkspaceBadge>
                    <WorkspaceBadge className={"pn-badge pn-bg-yellow-lt"}>
                      {"Yellow"}
                    </WorkspaceBadge>
                    <WorkspaceBadge className={"pn-badge pn-bg-lime-lt"}>
                      {"Lime"}
                    </WorkspaceBadge>
                    <WorkspaceBadge className={"pn-badge pn-bg-green-lt"}>
                      {"Green"}
                    </WorkspaceBadge>
                    <WorkspaceBadge className={"pn-badge pn-bg-teal-lt"}>
                      {"Teal"}
                    </WorkspaceBadge>
                    <WorkspaceBadge className={"pn-badge pn-bg-cyan-lt"}>
                      {"Cyan"}
                    </WorkspaceBadge>
                    <WorkspaceBadge className={"pn-badge pn-bg-dark-lt"}>
                      {"Dark"}
                    </WorkspaceBadge>
                    <WorkspaceBadge className={"pn-badge pn-bg-light-lt"}>
                      {"Light"}
                    </WorkspaceBadge>{" "}
                  </div>{" "}
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
                    {"Outline"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"A colored border with a transparent background."}
                  </CardDescription>{" "}
                  <div className={"pn-badge-list"}>
                    {" "}
                    <WorkspaceBadge
                      className={"pn-badge pn-badge-outline pn-text-blue"}
                    >
                      {"Blue"}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-badge-outline pn-text-azure"}
                    >
                      {"Azure"}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-badge-outline pn-text-indigo"}
                    >
                      {"Indigo"}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-badge-outline pn-text-purple"}
                    >
                      {"Purple"}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-badge-outline pn-text-pink"}
                    >
                      {"Pink"}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-badge-outline pn-text-red"}
                    >
                      {"Red"}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-badge-outline pn-text-orange"}
                    >
                      {"Orange"}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-badge-outline pn-text-yellow"}
                    >
                      {"Yellow"}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-badge-outline pn-text-lime"}
                    >
                      {"Lime"}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-badge-outline pn-text-green"}
                    >
                      {"Green"}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-badge-outline pn-text-teal"}
                    >
                      {"Teal"}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-badge-outline pn-text-cyan"}
                    >
                      {"Cyan"}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-badge-outline pn-text-dark"}
                    >
                      {"Dark"}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-badge-outline pn-text-light"}
                    >
                      {"Light"}
                    </WorkspaceBadge>{" "}
                  </div>{" "}
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
                    {"With icons"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Add an icon before the label to reinforce its meaning."}
                  </CardDescription>{" "}
                  <div className={"pn-badge-list"}>
                    {" "}
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-blue pn-text-blue-fg"}
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
                            "M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
                          }
                        ></path>{" "}
                      </svg>
                      {" Blue "}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-azure pn-text-azure-fg"}
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
                            "M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
                          }
                        ></path>{" "}
                      </svg>
                      {" Azure "}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-indigo pn-text-indigo-fg"}
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
                            "M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
                          }
                        ></path>{" "}
                      </svg>
                      {" Indigo "}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-purple pn-text-purple-fg"}
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
                            "M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
                          }
                        ></path>{" "}
                      </svg>
                      {" Purple "}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-pink pn-text-pink-fg"}
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
                            "M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
                          }
                        ></path>{" "}
                      </svg>
                      {" Pink "}
                    </WorkspaceBadge>
                    <WorkspaceBadge className={"pn-badge pn-bg-red pn-text-red-fg"}>
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
                            "M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
                          }
                        ></path>{" "}
                      </svg>
                      {" Red "}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-orange pn-text-orange-fg"}
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
                            "M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
                          }
                        ></path>{" "}
                      </svg>
                      {" Orange "}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-yellow pn-text-yellow-fg"}
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
                            "M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
                          }
                        ></path>{" "}
                      </svg>
                      {" Yellow "}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-lime pn-text-lime-fg"}
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
                            "M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
                          }
                        ></path>{" "}
                      </svg>
                      {" Lime "}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-green pn-text-green-fg"}
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
                            "M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
                          }
                        ></path>{" "}
                      </svg>
                      {" Green "}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-teal pn-text-teal-fg"}
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
                            "M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
                          }
                        ></path>{" "}
                      </svg>
                      {" Teal "}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-cyan pn-text-cyan-fg"}
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
                            "M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
                          }
                        ></path>{" "}
                      </svg>
                      {" Cyan "}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-dark pn-text-dark-fg"}
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
                            "M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
                          }
                        ></path>{" "}
                      </svg>
                      {" Dark "}
                    </WorkspaceBadge>
                    <WorkspaceBadge
                      className={"pn-badge pn-bg-light pn-text-light-fg"}
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
                            "M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
                          }
                        ></path>{" "}
                      </svg>
                      {" Light "}
                    </WorkspaceBadge>{" "}
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
