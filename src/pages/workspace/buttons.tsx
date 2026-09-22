// Keep page composition editable; interaction belongs in the shared components.
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import {
  WorkspaceButton,
  WorkspaceLink,
} from "@/components/overtrue/workspace/primitives"
export default function Page() {
  return (
    <div data-workspace-page="buttons" className="pn-page-wrapper">
      {" "}
      <div className={"pn-page-header pn-d-print-none"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-g-2 pn-align-items-center"}>
            {" "}
            <div className={"pn-col"}>
              {" "}
              <h1 className={"pn-page-title"}>{"Buttons"}</h1>{" "}
              <div className={"pn-text-secondary pn-mt-1"}>
                {"Actions for creating, reviewing, and sharing work."}
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
                    {"Basic"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {
                      "Add an icon to the left, the right, or drop the label for an icon-only button."
                    }
                  </CardDescription>{" "}
                  <div className={"pn-btn-list"}>
                    {" "}
                    <WorkspaceButton type={"button"} className={"pn-btn"}>
                      {"Button"}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton type={"button"} className={"pn-btn"}>
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
                            "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"
                          }
                        ></path>
                      </svg>
                      {"With icon "}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton type={"button"} className={"pn-btn"}>
                      {" Icon at end"}{" "}
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
                        className={"pn-icon pn-icon-end"}
                      >
                        {" "}
                        <path
                          d={
                            "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"
                          }
                        ></path>{" "}
                      </svg>{" "}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton
                      type={"button"}
                      aria-label={"Icon only"}
                      className={"pn-btn pn-btn-icon"}
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
                            "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"
                          }
                        ></path>{" "}
                      </svg>{" "}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton type={"button"} disabled className={"pn-btn"}>
                      {"Disabled"}
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
                    {"Shapes"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Round the corners with "}
                    <code>{".btn-pill"}</code>
                    {", or square them off with "}
                    <code>{".btn-square"}</code>
                    {"."}
                  </CardDescription>{" "}
                  <div className={"pn-btn-list"}>
                    {" "}
                    <WorkspaceButton className={"pn-btn"}>
                      {"Default"}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton className={"pn-btn pn-btn-pill"}>
                      {"Pill"}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton className={"pn-btn pn-btn-square"}>
                      {"Square"}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton className={"pn-btn pn-btn-icon"} aria-label="Favorite">
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
                            "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"
                          }
                        ></path>{" "}
                      </svg>{" "}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton className={"pn-btn pn-btn-pill pn-btn-icon"} aria-label="Favorite">
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
                            "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"
                          }
                        ></path>{" "}
                      </svg>{" "}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton className={"pn-btn pn-btn-square pn-btn-icon"} aria-label="Favorite">
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
                            "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"
                          }
                        ></path>{" "}
                      </svg>{" "}
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
                    {"Action buttons"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {
                      "Compact, icon-only buttons for card headers and toolbars."
                    }
                  </CardDescription>{" "}
                  <div className={"pn-btn-actions"}>
                    {" "}
                    <WorkspaceButton
                      href={"#"}
                      className={"pn-btn pn-btn-action"}
                      aria-label={"Edit"}
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
                            "M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"
                          }
                        ></path>{" "}
                        <path
                          d={
                            "M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415"
                          }
                        ></path>{" "}
                        <path d={"M16 5l3 3"}></path>{" "}
                      </svg>{" "}
                    </WorkspaceButton>
                    <WorkspaceButton
                      href={"#"}
                      className={"pn-btn pn-btn-action"}
                      aria-label={"Copy"}
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
                            "M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666"
                          }
                        ></path>{" "}
                        <path
                          d={
                            "M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"
                          }
                        ></path>{" "}
                      </svg>{" "}
                    </WorkspaceButton>
                    <WorkspaceButton
                      href={"#"}
                      className={"pn-btn pn-btn-action"}
                      aria-label={"Settings"}
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
                    </WorkspaceButton>
                    <WorkspaceButton
                      href={"#"}
                      className={"pn-btn pn-btn-action"}
                      aria-label={"Clipboard"}
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
                            "M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"
                          }
                        ></path>{" "}
                        <path
                          d={
                            "M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2"
                          }
                        ></path>{" "}
                      </svg>{" "}
                    </WorkspaceButton>
                    <WorkspaceButton
                      href={"#"}
                      className={"pn-btn pn-btn-action"}
                      aria-label={"X"}
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
                        <path d={"M18 6l-12 12"}></path>{" "}
                        <path d={"M6 6l12 12"}></path>{" "}
                      </svg>{" "}
                    </WorkspaceButton>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-12 pn-col-lg-8"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Sizes"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Scale a button from "}
                    <code>{"btn-sm"}</code>
                    {" to "}
                    <code>{"btn-xl"}</code>
                    {" without changing its icon layout."}
                  </CardDescription>{" "}
                  <div className={"pn-space-y"}>
                    {" "}
                    <div className={"pn-btn-list"}>
                      {" "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn pn-btn-sm"}
                      >
                        {"Button"}
                      </WorkspaceButton>{" "}
                      <WorkspaceButton
                        type={"button"}
                        aria-label={"Icon only"}
                        className={"pn-btn pn-btn-sm pn-btn-icon"}
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
                              "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"
                            }
                          ></path>{" "}
                        </svg>{" "}
                      </WorkspaceButton>{" "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn pn-btn-sm"}
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
                              "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"
                            }
                          ></path>
                        </svg>
                        {"Button "}
                      </WorkspaceButton>{" "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn pn-btn-sm"}
                      >
                        {" Button"}{" "}
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
                          className={"pn-icon pn-icon-end"}
                        >
                          {" "}
                          <path
                            d={
                              "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"
                            }
                          ></path>{" "}
                        </svg>{" "}
                      </WorkspaceButton>{" "}
                    </div>{" "}
                    <div className={"pn-btn-list"}>
                      {" "}
                      <WorkspaceButton type={"button"} className={"pn-btn"}>
                        {"Button"}
                      </WorkspaceButton>{" "}
                      <WorkspaceButton
                        type={"button"}
                        aria-label={"Icon only"}
                        className={"pn-btn pn-btn-icon"}
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
                              "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"
                            }
                          ></path>{" "}
                        </svg>{" "}
                      </WorkspaceButton>{" "}
                      <WorkspaceButton type={"button"} className={"pn-btn"}>
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
                              "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"
                            }
                          ></path>
                        </svg>
                        {"Button "}
                      </WorkspaceButton>{" "}
                      <WorkspaceButton type={"button"} className={"pn-btn"}>
                        {" Button"}{" "}
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
                          className={"pn-icon pn-icon-end"}
                        >
                          {" "}
                          <path
                            d={
                              "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"
                            }
                          ></path>{" "}
                        </svg>{" "}
                      </WorkspaceButton>{" "}
                    </div>{" "}
                    <div className={"pn-btn-list"}>
                      {" "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn pn-btn-lg"}
                      >
                        {"Button"}
                      </WorkspaceButton>{" "}
                      <WorkspaceButton
                        type={"button"}
                        aria-label={"Icon only"}
                        className={"pn-btn pn-btn-lg pn-btn-icon"}
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
                              "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"
                            }
                          ></path>{" "}
                        </svg>{" "}
                      </WorkspaceButton>{" "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn pn-btn-lg"}
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
                              "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"
                            }
                          ></path>
                        </svg>
                        {"Button "}
                      </WorkspaceButton>{" "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn pn-btn-lg"}
                      >
                        {" Button"}{" "}
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
                          className={"pn-icon pn-icon-end"}
                        >
                          {" "}
                          <path
                            d={
                              "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"
                            }
                          ></path>{" "}
                        </svg>{" "}
                      </WorkspaceButton>{" "}
                    </div>{" "}
                    <div className={"pn-btn-list"}>
                      {" "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn pn-btn-xl"}
                      >
                        {"Button"}
                      </WorkspaceButton>{" "}
                      <WorkspaceButton
                        type={"button"}
                        aria-label={"Icon only"}
                        className={"pn-btn pn-btn-xl pn-btn-icon"}
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
                              "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"
                            }
                          ></path>{" "}
                        </svg>{" "}
                      </WorkspaceButton>{" "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn pn-btn-xl"}
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
                              "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"
                            }
                          ></path>
                        </svg>
                        {"Button "}
                      </WorkspaceButton>{" "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn pn-btn-xl"}
                      >
                        {" Button"}{" "}
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
                          className={"pn-icon pn-icon-end"}
                        >
                          {" "}
                          <path
                            d={
                              "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"
                            }
                          ></path>{" "}
                        </svg>{" "}
                      </WorkspaceButton>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-12 pn-col-lg-4"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Animated icon"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Small hover animations draw attention to the icon."}
                  </CardDescription>{" "}
                  <div className={"pn-btn-list"}>
                    {" "}
                    <WorkspaceButton className={"pn-btn pn-btn-animate-icon"}>
                      {" Save "}{" "}
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
                        className={"pn-icon pn-icon-end"}
                      >
                        {" "}
                        <path d={"M5 12l14 0"}></path>{" "}
                        <path d={"M13 18l6 -6"}></path>{" "}
                        <path d={"M13 6l6 6"}></path>{" "}
                      </svg>{" "}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton
                      className={
                        "pn-btn pn-btn-animate-icon pn-btn-animate-icon-rotate"
                      }
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
                      </svg>
                      {" Add "}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton
                      className={
                        "pn-btn pn-btn-animate-icon pn-btn-animate-icon-shake"
                      }
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
                      </svg>
                      {" Notifications "}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton
                      className={
                        "pn-btn pn-btn-animate-icon pn-btn-animate-icon-rotate"
                      }
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
                      </svg>
                      {" Settings "}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton
                      className={
                        "pn-btn pn-btn-animate-icon pn-btn-animate-icon-pulse"
                      }
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
                            "M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"
                          }
                        ></path>{" "}
                      </svg>
                      {" Love "}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton
                      className={
                        "pn-btn pn-btn-animate-icon pn-btn-animate-icon-rotate"
                      }
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
                        <path d={"M18 6l-12 12"}></path>{" "}
                        <path d={"M6 6l12 12"}></path>{" "}
                      </svg>
                      {" Close "}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton
                      className={
                        "pn-btn pn-btn-animate-icon pn-btn-animate-icon-tada"
                      }
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
                        <path d={"M5 12l5 5l10 -10"}></path>
                      </svg>
                      {" Confirm "}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton className={"pn-btn pn-btn-animate-icon"}>
                      {" Next "}{" "}
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
                        className={"pn-icon pn-icon-end"}
                      >
                        <path d={"M9 6l6 6l-6 6"}></path>
                      </svg>{" "}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton
                      className={
                        "pn-btn pn-btn-animate-icon pn-btn-animate-icon-move-start"
                      }
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
                        <path d={"M15 6l-6 6l6 6"}></path>
                      </svg>
                      {" Previous "}
                    </WorkspaceButton>{" "}
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
                    {"Standard"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Fill a button with a theme color to mark its purpose."}
                  </CardDescription>{" "}
                  <div className={"pn-btn-list"}>
                    {" "}
                    <WorkspaceButton className={"pn-btn pn-btn-primary"}>
                      {" Primary "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-secondary"}>
                      {" Secondary "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-success"}>
                      {" Success "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-warning"}>
                      {" Warning "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-danger"}>
                      {" Danger "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-info"}>
                      {" Info "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-dark"}>
                      {" Dark "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-light"}>
                      {" Light "}
                    </WorkspaceButton>{" "}
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
                    {
                      "Keep the border colored and the background transparent for a subtler action."
                    }
                  </CardDescription>{" "}
                  <div className={"pn-btn-list"}>
                    {" "}
                    <WorkspaceButton
                      className={"pn-btn pn-btn-outline pn-btn-primary"}
                    >
                      {" Primary "}
                    </WorkspaceButton>
                    <WorkspaceButton
                      className={"pn-btn pn-btn-outline pn-btn-secondary"}
                    >
                      {" Secondary "}
                    </WorkspaceButton>
                    <WorkspaceButton
                      className={"pn-btn pn-btn-outline pn-btn-success"}
                    >
                      {" Success "}
                    </WorkspaceButton>
                    <WorkspaceButton
                      className={"pn-btn pn-btn-outline pn-btn-warning"}
                    >
                      {" Warning "}
                    </WorkspaceButton>
                    <WorkspaceButton
                      className={"pn-btn pn-btn-outline pn-btn-danger"}
                    >
                      {" Danger "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-outline pn-btn-info"}>
                      {" Info "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-outline pn-btn-dark"}>
                      {" Dark "}
                    </WorkspaceButton>
                    <WorkspaceButton
                      className={"pn-btn pn-btn-outline pn-btn-light"}
                    >
                      {" Light "}
                    </WorkspaceButton>{" "}
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
                    {"Ghost"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Drop the border too — color appears only on hover."}
                  </CardDescription>{" "}
                  <div className={"pn-btn-list"}>
                    {" "}
                    <WorkspaceButton
                      className={"pn-btn pn-btn-ghost pn-btn-primary"}
                    >
                      {" Primary "}
                    </WorkspaceButton>
                    <WorkspaceButton
                      className={"pn-btn pn-btn-ghost pn-btn-secondary"}
                    >
                      {" Secondary "}
                    </WorkspaceButton>
                    <WorkspaceButton
                      className={"pn-btn pn-btn-ghost pn-btn-success"}
                    >
                      {" Success "}
                    </WorkspaceButton>
                    <WorkspaceButton
                      className={"pn-btn pn-btn-ghost pn-btn-warning"}
                    >
                      {" Warning "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-ghost pn-btn-danger"}>
                      {" Danger "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-ghost pn-btn-info"}>
                      {" Info "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-ghost pn-btn-dark"}>
                      {" Dark "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-ghost pn-btn-light"}>
                      {" Light "}
                    </WorkspaceButton>{" "}
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
                    {"Pill"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Combine "}
                    <code>{".btn-pill"}</code>
                    {" with a theme color."}
                  </CardDescription>{" "}
                  <div className={"pn-btn-list"}>
                    {" "}
                    <WorkspaceButton className={"pn-btn pn-btn-pill pn-btn-primary"}>
                      {" Primary "}
                    </WorkspaceButton>
                    <WorkspaceButton
                      className={"pn-btn pn-btn-pill pn-btn-secondary"}
                    >
                      {" Secondary "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-pill pn-btn-success"}>
                      {" Success "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-pill pn-btn-warning"}>
                      {" Warning "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-pill pn-btn-danger"}>
                      {" Danger "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-pill pn-btn-info"}>
                      {" Info "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-pill pn-btn-dark"}>
                      {" Dark "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-pill pn-btn-light"}>
                      {" Light "}
                    </WorkspaceButton>{" "}
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
                    {"Square"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Combine "}
                    <code>{".btn-square"}</code>
                    {" with a theme color."}
                  </CardDescription>{" "}
                  <div className={"pn-btn-list"}>
                    {" "}
                    <WorkspaceButton
                      className={"pn-btn pn-btn-square pn-btn-primary"}
                    >
                      {" Primary "}
                    </WorkspaceButton>
                    <WorkspaceButton
                      className={"pn-btn pn-btn-square pn-btn-secondary"}
                    >
                      {" Secondary "}
                    </WorkspaceButton>
                    <WorkspaceButton
                      className={"pn-btn pn-btn-square pn-btn-success"}
                    >
                      {" Success "}
                    </WorkspaceButton>
                    <WorkspaceButton
                      className={"pn-btn pn-btn-square pn-btn-warning"}
                    >
                      {" Warning "}
                    </WorkspaceButton>
                    <WorkspaceButton
                      className={"pn-btn pn-btn-square pn-btn-danger"}
                    >
                      {" Danger "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-square pn-btn-info"}>
                      {" Info "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-square pn-btn-dark"}>
                      {" Dark "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-square pn-btn-light"}>
                      {" Light "}
                    </WorkspaceButton>{" "}
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
                    {"Extra colors"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Supporting colors for status, charts, and project labels."}
                  </CardDescription>{" "}
                  <div className={"pn-btn-list"}>
                    {" "}
                    <WorkspaceButton className={"pn-btn pn-btn-blue"}>
                      {" Blue "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-azure"}>
                      {" Azure "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-indigo"}>
                      {" Indigo "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-purple"}>
                      {" Purple "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-pink"}>
                      {" Pink "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-red"}>
                      {" Red "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-orange"}>
                      {" Orange "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-yellow"}>
                      {" Yellow "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-lime"}>
                      {" Lime "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-green"}>
                      {" Green "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-teal"}>
                      {" Teal "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-cyan"}>
                      {" Cyan "}
                    </WorkspaceButton>{" "}
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
                    {"Social colors"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Brand colors for linking out to social networks."}
                  </CardDescription>{" "}
                  <div className={"pn-btn-list"}>
                    {" "}
                    <WorkspaceButton className={"pn-btn pn-btn-facebook"}>
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
                            "M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"
                          }
                        ></path>{" "}
                      </svg>
                      {" Facebook "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-twitter"}>
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
                            "M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c0 -.249 1.51 -2.772 1.818 -4.013l0 .001"
                          }
                        ></path>{" "}
                      </svg>
                      {" Twitter "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-x"}>
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
                          d={"M4 4l11.733 16h4.267l-11.733 -16l-4.267 0"}
                        ></path>{" "}
                        <path
                          d={"M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"}
                        ></path>{" "}
                      </svg>
                      {" X "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-linkedin"}>
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
                        <path d={"M8 11v5"}></path> <path d={"M8 8v.01"}></path>{" "}
                        <path d={"M12 16v-5"}></path>{" "}
                        <path d={"M16 16v-3a2 2 0 1 0 -4 0"}></path>{" "}
                        <path
                          d={
                            "M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10"
                          }
                        ></path>{" "}
                      </svg>
                      {" Linkedin "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-google"}>
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
                            "M20.945 11a9 9 0 1 1 -3.284 -5.997l-2.655 2.392a5.5 5.5 0 1 0 2.119 6.605h-4.125v-3h7.945"
                          }
                        ></path>{" "}
                      </svg>
                      {" Google "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-youtube"}>
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
                            "M2 8a4 4 0 0 1 4 -4h12a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4v-8"
                          }
                        ></path>{" "}
                        <path d={"M10 9l5 3l-5 3l0 -6"}></path>{" "}
                      </svg>
                      {" Youtube "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-vimeo"}>
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
                            "M3 8.5l1 1s1.5 -1.102 2 -.5c.509 .609 1.863 7.65 2.5 9c.556 1.184 1.978 2.89 4 1.5c2 -1.5 7.5 -5.5 8.5 -11.5c.444 -2.661 -1 -4 -2.5 -4c-2 0 -4.047 1.202 -4.5 4c2.05 -1.254 2.551 1 1.5 3c-1.052 2 -2 3 -2.5 3c-.49 0 -.924 -1.165 -1.5 -3.5c-.59 -2.42 -.5 -6.5 -3 -6.5s-5.5 4.5 -5.5 4.5"
                          }
                        ></path>{" "}
                      </svg>
                      {" Vimeo "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-dribbble"}>
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
                        <path d={"M9 3.6c5 6 7 10.5 7.5 16.2"}></path>{" "}
                        <path d={"M6.4 19c3.5 -3.5 6 -6.5 14.5 -6.4"}></path>{" "}
                        <path
                          d={"M3.1 10.75c5 0 9.814 -.38 15.314 -5"}
                        ></path>{" "}
                      </svg>
                      {" Dribbble "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-github"}>
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
                            "M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"
                          }
                        ></path>{" "}
                      </svg>
                      {" Github "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-instagram"}>
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
                            "M4 8a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4l0 -8"
                          }
                        ></path>{" "}
                        <path d={"M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"}></path>{" "}
                        <path d={"M16.5 7.5v.01"}></path>{" "}
                      </svg>
                      {" Instagram "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-pinterest"}>
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
                        <path d={"M8 20l4 -9"}></path>{" "}
                        <path
                          d={
                            "M10.7 14c.437 1.263 1.43 2 2.55 2c2.071 0 3.75 -1.554 3.75 -4a5 5 0 1 0 -9.7 1.7"
                          }
                        ></path>{" "}
                        <path
                          d={"M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"}
                        ></path>{" "}
                      </svg>
                      {" Pinterest "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-vk"}>
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
                            "M14 19h-4a8 8 0 0 1 -8 -8v-5h4v5a4 4 0 0 0 4 4v-9h4v4.5l.03 0a4.531 4.531 0 0 0 3.97 -4.496h4l-.342 1.711a6.858 6.858 0 0 1 -3.658 4.789a5.34 5.34 0 0 1 3.566 4.111l.434 2.389h-4a4.531 4.531 0 0 0 -3.97 -4.496v4.5l-.03 -.008"
                          }
                        ></path>{" "}
                      </svg>
                      {" VK "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-rss"}>
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
                          d={"M4 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"}
                        ></path>{" "}
                        <path d={"M4 4a16 16 0 0 1 16 16"}></path>{" "}
                        <path d={"M4 11a9 9 0 0 1 9 9"}></path>{" "}
                      </svg>
                      {" RSS "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-flickr"}>
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
                          d={"M4 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"}
                        ></path>{" "}
                        <path
                          d={"M14 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"}
                        ></path>{" "}
                      </svg>
                      {" Flickr "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-bitbucket"}>
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
                            "M3.648 4a.64 .64 0 0 0 -.64 .744l3.14 14.528c.07 .417 .43 .724 .852 .728h10a.644 .644 0 0 0 .642 -.539l3.35 -14.71a.641 .641 0 0 0 -.64 -.744l-16.704 -.007"
                          }
                        ></path>{" "}
                        <path d={"M14 15h-4l-1 -6h6l-1 6"}></path>{" "}
                      </svg>
                      {" Bitbucket "}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-overtrue"}>
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
                        <path d={"M8 9l3 3l-3 3"}></path>{" "}
                        <path d={"M13 15h3"}></path>{" "}
                        <path
                          d={
                            "M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10"
                          }
                        ></path>{" "}
                      </svg>
                      {" overtrue/ui "}
                    </WorkspaceButton>{" "}
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
                    {"Icon buttons"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {
                      "Social brand colors without a label, for compact toolbars."
                    }
                  </CardDescription>{" "}
                  <div className={"pn-btn-list"}>
                    {" "}
                    <WorkspaceButton
                      className={"pn-btn pn-btn-icon pn-btn-facebook"}
                     aria-label="Facebook">
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
                            "M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"
                          }
                        ></path>
                      </svg>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-icon pn-btn-twitter"} aria-label="Twitter">
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
                            "M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c0 -.249 1.51 -2.772 1.818 -4.013l0 .001"
                          }
                        ></path>
                      </svg>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-icon pn-btn-x"} aria-label="X">
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
                          d={"M4 4l11.733 16h4.267l-11.733 -16l-4.267 0"}
                        ></path>{" "}
                        <path
                          d={"M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"}
                        ></path>
                      </svg>
                    </WorkspaceButton>
                    <WorkspaceButton
                      className={"pn-btn pn-btn-icon pn-btn-linkedin"}
                     aria-label="Linkedin">
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
                        <path d={"M8 11v5"}></path> <path d={"M8 8v.01"}></path>{" "}
                        <path d={"M12 16v-5"}></path>{" "}
                        <path d={"M16 16v-3a2 2 0 1 0 -4 0"}></path>{" "}
                        <path
                          d={
                            "M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10"
                          }
                        ></path>
                      </svg>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-icon pn-btn-google"} aria-label="Google">
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
                            "M20.945 11a9 9 0 1 1 -3.284 -5.997l-2.655 2.392a5.5 5.5 0 1 0 2.119 6.605h-4.125v-3h7.945"
                          }
                        ></path>
                      </svg>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-icon pn-btn-youtube"} aria-label="Youtube">
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
                            "M2 8a4 4 0 0 1 4 -4h12a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4v-8"
                          }
                        ></path>{" "}
                        <path d={"M10 9l5 3l-5 3l0 -6"}></path>
                      </svg>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-icon pn-btn-vimeo"} aria-label="Vimeo">
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
                            "M3 8.5l1 1s1.5 -1.102 2 -.5c.509 .609 1.863 7.65 2.5 9c.556 1.184 1.978 2.89 4 1.5c2 -1.5 7.5 -5.5 8.5 -11.5c.444 -2.661 -1 -4 -2.5 -4c-2 0 -4.047 1.202 -4.5 4c2.05 -1.254 2.551 1 1.5 3c-1.052 2 -2 3 -2.5 3c-.49 0 -.924 -1.165 -1.5 -3.5c-.59 -2.42 -.5 -6.5 -3 -6.5s-5.5 4.5 -5.5 4.5"
                          }
                        ></path>
                      </svg>
                    </WorkspaceButton>
                    <WorkspaceButton
                      className={"pn-btn pn-btn-icon pn-btn-dribbble"}
                     aria-label="Dribbble">
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
                        <path d={"M9 3.6c5 6 7 10.5 7.5 16.2"}></path>{" "}
                        <path d={"M6.4 19c3.5 -3.5 6 -6.5 14.5 -6.4"}></path>{" "}
                        <path d={"M3.1 10.75c5 0 9.814 -.38 15.314 -5"}></path>
                      </svg>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-icon pn-btn-github"} aria-label="Github">
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
                            "M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"
                          }
                        ></path>
                      </svg>
                    </WorkspaceButton>
                    <WorkspaceButton
                      className={"pn-btn pn-btn-icon pn-btn-instagram"}
                     aria-label="Instagram">
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
                            "M4 8a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4l0 -8"
                          }
                        ></path>{" "}
                        <path d={"M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"}></path>{" "}
                        <path d={"M16.5 7.5v.01"}></path>
                      </svg>
                    </WorkspaceButton>
                    <WorkspaceButton
                      className={"pn-btn pn-btn-icon pn-btn-pinterest"}
                     aria-label="Pinterest">
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
                        <path d={"M8 20l4 -9"}></path>{" "}
                        <path
                          d={
                            "M10.7 14c.437 1.263 1.43 2 2.55 2c2.071 0 3.75 -1.554 3.75 -4a5 5 0 1 0 -9.7 1.7"
                          }
                        ></path>{" "}
                        <path d={"M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"}></path>
                      </svg>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-icon pn-btn-vk"} aria-label="VK">
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
                            "M14 19h-4a8 8 0 0 1 -8 -8v-5h4v5a4 4 0 0 0 4 4v-9h4v4.5l.03 0a4.531 4.531 0 0 0 3.97 -4.496h4l-.342 1.711a6.858 6.858 0 0 1 -3.658 4.789a5.34 5.34 0 0 1 3.566 4.111l.434 2.389h-4a4.531 4.531 0 0 0 -3.97 -4.496v4.5l-.03 -.008"
                          }
                        ></path>
                      </svg>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-icon pn-btn-rss"} aria-label="RSS">
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
                          d={"M4 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"}
                        ></path>{" "}
                        <path d={"M4 4a16 16 0 0 1 16 16"}></path>{" "}
                        <path d={"M4 11a9 9 0 0 1 9 9"}></path>
                      </svg>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-icon pn-btn-flickr"} aria-label="Flickr">
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
                          d={"M4 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"}
                        ></path>{" "}
                        <path d={"M14 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"}></path>
                      </svg>
                    </WorkspaceButton>
                    <WorkspaceButton
                      className={"pn-btn pn-btn-icon pn-btn-bitbucket"}
                     aria-label="Bitbucket">
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
                            "M3.648 4a.64 .64 0 0 0 -.64 .744l3.14 14.528c.07 .417 .43 .724 .852 .728h10a.644 .644 0 0 0 .642 -.539l3.35 -14.71a.641 .641 0 0 0 -.64 -.744l-16.704 -.007"
                          }
                        ></path>{" "}
                        <path d={"M14 15h-4l-1 -6h6l-1 6"}></path>
                      </svg>
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn pn-btn-icon pn-btn-overtrue"} aria-label="overtrue/ui">
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
                        <path d={"M8 9l3 3l-3 3"}></path>{" "}
                        <path d={"M13 15h3"}></path>{" "}
                        <path
                          d={
                            "M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10"
                          }
                        ></path>
                      </svg>
                    </WorkspaceButton>{" "}
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
