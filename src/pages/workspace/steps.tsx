// Keep page composition editable; interaction belongs in the shared components.
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { WorkspaceLink } from "@/components/overtrue/workspace/primitives"
export default function Page() {
  return (
    <div data-workspace-page="steps" className="pn-page-wrapper">
      {" "}
      <div className={"pn-page-header pn-d-print-none"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-g-2 pn-align-items-center"}>
            {" "}
            <div className={"pn-col"}>
              {" "}
              <h1 className={"pn-page-title"}>{"Steps"}</h1>{" "}
              <div className={"pn-text-secondary pn-mt-1"}>
                {
                  "A clear sequence from the first brief to the final handover."
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
            <div className={"pn-col-12"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Horizontal"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {
                      "Numbered steps for a linear process, with the current step highlighted."
                    }
                  </CardDescription>{" "}
                  <ul className={"pn-steps pn-steps-green pn-my-4"}>
                    {" "}
                    <li className={"pn-step-item"}>{"1"}</li>{" "}
                    <li className={"pn-step-item pn-active"}>{"2"}</li>{" "}
                    <li className={"pn-step-item"}>{"3"}</li>{" "}
                  </ul>{" "}
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
                    {"Horizontal counter"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"The same steps without numbers, for a more minimal look."}
                  </CardDescription>{" "}
                  <ol
                    className={"pn-steps pn-steps-green pn-steps-counter pn-my-4"}
                    aria-label={"Progress"}
                  >
                    {" "}
                    <li className={"pn-step-item"}>
                      {" "}
                      <WorkspaceLink href={"#"}>
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"Step 1 (completed)"}
                        </span>{" "}
                      </WorkspaceLink>{" "}
                    </li>{" "}
                    <li className={"pn-step-item pn-active"}>
                      {" "}
                      <WorkspaceLink href={"#"} aria-current={"step"}>
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"Step 2 (current)"}
                        </span>{" "}
                      </WorkspaceLink>{" "}
                    </li>{" "}
                    <li className={"pn-step-item"}>
                      {" "}
                      <span>
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"Step 3"}
                        </span>{" "}
                      </span>{" "}
                    </li>{" "}
                  </ol>{" "}
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
                    {"With labels"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Give each step a title instead of a number."}
                  </CardDescription>{" "}
                  <ul
                    className={"pn-steps pn-steps-green pn-steps-counter pn-my-4"}
                  >
                    {" "}
                    <li className={"pn-step-item"}>{"Cart"}</li>{" "}
                    <li className={"pn-step-item pn-active"}>
                      {"Billing Information"}
                    </li>{" "}
                    <li className={"pn-step-item"}>{"Confirmation"}</li>{" "}
                  </ul>{" "}
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
                    {"Breadcrumb arrows"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Chevron-style steps, useful for wizards and checkouts."}
                  </CardDescription>{" "}
                  <ol className={"pn-breadcrumb pn-breadcrumb-arrows"}>
                    {" "}
                    <li className={"pn-breadcrumb-item"}>
                      <WorkspaceLink href={"#"}>{"Step one"}</WorkspaceLink>
                    </li>{" "}
                    <li className={"pn-breadcrumb-item pn-active"}>
                      <WorkspaceLink href={"#"}>{"Step two"}</WorkspaceLink>
                    </li>{" "}
                    <li className={"pn-breadcrumb-item pn-disabled"}>
                      <WorkspaceLink href={"#"}>{"Step three"}</WorkspaceLink>
                    </li>{" "}
                    <li className={"pn-breadcrumb-item pn-disabled"}>
                      <WorkspaceLink href={"#"}>{"Step four"}</WorkspaceLink>
                    </li>{" "}
                  </ol>{" "}
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
                    {"Breadcrumb numbered"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Number each step and mute the ones not yet reached."}
                  </CardDescription>{" "}
                  <ol className={"pn-breadcrumb"}>
                    {" "}
                    <li className={"pn-breadcrumb-item"}>
                      <WorkspaceLink href={"#"}>{"1. Step one"}</WorkspaceLink>
                    </li>{" "}
                    <li className={"pn-breadcrumb-item"}>
                      <WorkspaceLink href={"#"}>{"2. Step two"}</WorkspaceLink>
                    </li>{" "}
                    <li className={"pn-breadcrumb-item pn-active"}>
                      <WorkspaceLink href={"#"}>{"3. Step three"}</WorkspaceLink>
                    </li>{" "}
                    <li className={"pn-breadcrumb-item pn-disabled"}>
                      <WorkspaceLink href={"#"}>{"4. Step four"}</WorkspaceLink>
                    </li>{" "}
                    <li className={"pn-breadcrumb-item pn-disabled"}>
                      <WorkspaceLink href={"#"}>{"5. Step five"}</WorkspaceLink>
                    </li>{" "}
                  </ol>{" "}
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
                    {"Breadcrumb muted"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {
                      "A quieter style for steps that shouldn't compete with the rest of the page."
                    }
                  </CardDescription>{" "}
                  <ol className={"pn-breadcrumb pn-breadcrumb-muted"}>
                    {" "}
                    <li className={"pn-breadcrumb-item"}>
                      <WorkspaceLink href={"#"}>{"1. Step one"}</WorkspaceLink>
                    </li>{" "}
                    <li className={"pn-breadcrumb-item"}>
                      <WorkspaceLink href={"#"}>{"2. Step two"}</WorkspaceLink>
                    </li>{" "}
                    <li className={"pn-breadcrumb-item pn-active"}>
                      <WorkspaceLink href={"#"}>{"3. Step three"}</WorkspaceLink>
                    </li>{" "}
                    <li className={"pn-breadcrumb-item pn-disabled"}>
                      <WorkspaceLink href={"#"}>{"4. Step four"}</WorkspaceLink>
                    </li>{" "}
                    <li className={"pn-breadcrumb-item pn-disabled"}>
                      <WorkspaceLink href={"#"}>{"5. Step five"}</WorkspaceLink>
                    </li>{" "}
                  </ol>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
          </div>{" "}
          <div className={"pn-row pn-row-cards"}>
            {" "}
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
                    {
                      "A title and description per step, for a detailed timeline."
                    }
                  </CardDescription>{" "}
                  <ul className={"pn-steps pn-steps-vertical"}>
                    {" "}
                    <li className={"pn-step-item"}>
                      {" "}
                      <div className={"pn-h4 pn-m-0"}>
                        {"Order received"}
                      </div>{" "}
                      <div className={"pn-text-secondary"}>
                        {
                          "The project brief is agreed and the team has confirmed the first milestone."
                        }
                      </div>{" "}
                    </li>{" "}
                    <li className={"pn-step-item"}>
                      {" "}
                      <div className={"pn-h4 pn-m-0"}>{"Preparing"}</div>{" "}
                      <div className={"pn-text-secondary"}>
                        {"The team is preparing the first set of concepts for review."}
                      </div>{" "}
                    </li>{" "}
                    <li className={"pn-step-item pn-active"}>
                      {" "}
                      <div className={"pn-h4 pn-m-0"}>
                        {"Out for delivery"}
                      </div>{" "}
                      <div className={"pn-text-secondary"}>
                        {"The approved files and handover notes have been shared with the client."}
                      </div>{" "}
                    </li>{" "}
                    <li className={"pn-step-item"}>
                      {" "}
                      <div className={"pn-h4 pn-m-0"}>{"Delivered"}</div>{" "}
                      <div className={"pn-text-secondary"}>
                        {"Signed for at the delivery address."}
                      </div>{" "}
                    </li>{" "}
                  </ul>{" "}
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
                    {"Vertical counter"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Numbered steps in a vertical list, without descriptions."}
                  </CardDescription>{" "}
                  <ul className={"pn-steps pn-steps-counter pn-steps-vertical"}>
                    {" "}
                    <li className={"pn-step-item"}>{"Step one"}</li>{" "}
                    <li className={"pn-step-item"}>{"Step two"}</li>{" "}
                    <li className={"pn-step-item pn-active"}>{"Step three"}</li>{" "}
                    <li className={"pn-step-item"}>{"Step four"}</li>{" "}
                    <li className={"pn-step-item"}>{"Step five"}</li>{" "}
                  </ul>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  )
}
