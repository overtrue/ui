// Keep page composition editable; interaction belongs in the shared components.
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import {
  WorkspaceAccordion,
  WorkspaceAccordionContent,
  WorkspaceAccordionItem,
  WorkspaceAccordionTrigger,
  WorkspaceLink,
} from "@/components/overtrue/workspace/primitives"
export default function Page() {
  return (
    <div data-workspace-page="accordion" className="pn-page-wrapper">
      {" "}
      <div className={"pn-page-header pn-d-print-none"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-g-2 pn-align-items-center"}>
            {" "}
            <div className={"pn-col"}>
              {" "}
              <h1 className={"pn-page-title"}>{"Accordion"}</h1>{" "}
              <div className={"pn-text-secondary pn-mt-1"}>
                {
                  "Project questions, answered in context."
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
                    {"Default"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"The base accordion — one panel open at a time."}
                  </CardDescription>{" "}
                  <WorkspaceAccordion
                    className={"pn-accordion"}
                    id={"accordion-default"}
                    mode="single"
                    defaultValue={["collapse-1-default"]}
                  >
                    {" "}
                    <WorkspaceAccordionItem
                      className={"pn-accordion-item"}
                      value={"collapse-1-default"}
                    >
                      {" "}
                      <h2 className={"pn-accordion-header"}>
                        {" "}
                        <WorkspaceAccordionTrigger
                          id={"accordion-button-1-default"}
                          className={"pn-accordion-button"}
                          type={"button"}
                        >
                          {
                            " How do we start a new client project? "
                          }
                          <div className={"pn-accordion-button-toggle"}>
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
                              <path d={"M6 9l6 6l6 -6"}></path>
                            </svg>{" "}
                          </div>{" "}
                        </WorkspaceAccordionTrigger>{" "}
                      </h2>{" "}
                      <WorkspaceAccordionContent
                        id={"collapse-1-default"}
                        className={"pn-accordion-collapse pn-collapse pn-show"}
                      >
                        {" "}
                        <div className={"pn-accordion-body"}>
                          {
                            "Write a short brief, choose a project owner, and agree on the first milestone. Invite the people who need to contribute before adding detailed tasks."
                          }
                        </div>{" "}
                      </WorkspaceAccordionContent>{" "}
                    </WorkspaceAccordionItem>{" "}
                    <WorkspaceAccordionItem
                      className={"pn-accordion-item"}
                      value={"collapse-2-default"}
                    >
                      {" "}
                      <h2 className={"pn-accordion-header"}>
                        {" "}
                        <WorkspaceAccordionTrigger
                          id={"accordion-button-2-default"}
                          className={"pn-accordion-button pn-collapsed"}
                          type={"button"}
                        >
                          {
                            " Who should join the first project review? "
                          }
                          <div className={"pn-accordion-button-toggle"}>
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
                              <path d={"M6 9l6 6l6 -6"}></path>
                            </svg>{" "}
                          </div>{" "}
                        </WorkspaceAccordionTrigger>{" "}
                      </h2>{" "}
                      <WorkspaceAccordionContent
                        id={"collapse-2-default"}
                        className={"pn-accordion-collapse pn-collapse"}
                      >
                        {" "}
                        <div className={"pn-accordion-body"}>
                          {
                            "Include the project owner, the people doing the work, and one client decision-maker. A small group makes it easier to ask clear questions and agree on the next step."
                          }
                        </div>{" "}
                      </WorkspaceAccordionContent>{" "}
                    </WorkspaceAccordionItem>{" "}
                    <WorkspaceAccordionItem
                      className={"pn-accordion-item"}
                      value={"collapse-3-default"}
                    >
                      {" "}
                      <h2 className={"pn-accordion-header"}>
                        {" "}
                        <WorkspaceAccordionTrigger
                          id={"accordion-button-3-default"}
                          className={"pn-accordion-button pn-collapsed"}
                          type={"button"}
                        >
                          {
                            " Where can I find the approved deliverables? "
                          }
                          <div className={"pn-accordion-button-toggle"}>
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
                              <path d={"M6 9l6 6l6 -6"}></path>
                            </svg>{" "}
                          </div>{" "}
                        </WorkspaceAccordionTrigger>{" "}
                      </h2>{" "}
                      <WorkspaceAccordionContent
                        id={"collapse-3-default"}
                        className={"pn-accordion-collapse pn-collapse"}
                      >
                        {" "}
                        <div className={"pn-accordion-body"}>
                          {
                            "Approved files live in the project handover folder. Each delivery includes the source files, ready-to-use exports, and a short guide to the decisions behind them."
                          }
                        </div>{" "}
                      </WorkspaceAccordionContent>{" "}
                    </WorkspaceAccordionItem>{" "}
                    <WorkspaceAccordionItem
                      className={"pn-accordion-item"}
                      value={"collapse-4-default"}
                    >
                      {" "}
                      <h2 className={"pn-accordion-header"}>
                        {" "}
                        <WorkspaceAccordionTrigger
                          id={"accordion-button-4-default"}
                          className={"pn-accordion-button pn-collapsed"}
                          type={"button"}
                        >
                          {" How accessible are overtrue/ui components? "}
                          <div className={"pn-accordion-button-toggle"}>
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
                              <path d={"M6 9l6 6l6 -6"}></path>
                            </svg>{" "}
                          </div>{" "}
                        </WorkspaceAccordionTrigger>{" "}
                      </h2>{" "}
                      <WorkspaceAccordionContent
                        id={"collapse-4-default"}
                        className={"pn-accordion-collapse pn-collapse"}
                      >
                        {" "}
                        <div className={"pn-accordion-body"}>
                          {
                            "Add a short decision note to the project activity. Include the choice, the reason, and the person responsible for the next step."
                          }
                        </div>{" "}
                      </WorkspaceAccordionContent>{" "}
                    </WorkspaceAccordionItem>{" "}
                  </WorkspaceAccordion>{" "}
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
                    {"Flush"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Add "}
                    <code>{"accordion-flush"}</code>
                    {" to remove the card border and rounded corners."}
                  </CardDescription>{" "}
                </CardContent>{" "}
                <WorkspaceAccordion
                  className={"pn-accordion pn-accordion-flush"}
                  id={"accordion-flush"}
                  mode="single"
                  defaultValue={["collapse-1-flush"]}
                >
                  {" "}
                  <WorkspaceAccordionItem
                    className={"pn-accordion-item"}
                    value={"collapse-1-flush"}
                  >
                    {" "}
                    <h2 className={"pn-accordion-header"}>
                      {" "}
                      <WorkspaceAccordionTrigger
                        id={"accordion-button-1-flush"}
                        className={"pn-accordion-button"}
                        type={"button"}
                      >
                        {
                          " How do we start a new client project? "
                        }
                        <div className={"pn-accordion-button-toggle"}>
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
                            <path d={"M6 9l6 6l6 -6"}></path>
                          </svg>{" "}
                        </div>{" "}
                      </WorkspaceAccordionTrigger>{" "}
                    </h2>{" "}
                    <WorkspaceAccordionContent
                      id={"collapse-1-flush"}
                      className={"pn-accordion-collapse pn-collapse pn-show"}
                    >
                      {" "}
                      <div className={"pn-accordion-body"}>
                        {
                          "Write a short brief, choose a project owner, and agree on the first milestone. Invite the people who need to contribute before adding detailed tasks."
                        }
                      </div>{" "}
                    </WorkspaceAccordionContent>{" "}
                  </WorkspaceAccordionItem>{" "}
                  <WorkspaceAccordionItem
                    className={"pn-accordion-item"}
                    value={"collapse-2-flush"}
                  >
                    {" "}
                    <h2 className={"pn-accordion-header"}>
                      {" "}
                      <WorkspaceAccordionTrigger
                        id={"accordion-button-2-flush"}
                        className={"pn-accordion-button pn-collapsed"}
                        type={"button"}
                      >
                        {
                          " Who should join the first project review? "
                        }
                        <div className={"pn-accordion-button-toggle"}>
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
                            <path d={"M6 9l6 6l6 -6"}></path>
                          </svg>{" "}
                        </div>{" "}
                      </WorkspaceAccordionTrigger>{" "}
                    </h2>{" "}
                    <WorkspaceAccordionContent
                      id={"collapse-2-flush"}
                      className={"pn-accordion-collapse pn-collapse"}
                    >
                      {" "}
                      <div className={"pn-accordion-body"}>
                        {
                          "Include the project owner, the people doing the work, and one client decision-maker. A small group makes it easier to ask clear questions and agree on the next step."
                        }
                      </div>{" "}
                    </WorkspaceAccordionContent>{" "}
                  </WorkspaceAccordionItem>{" "}
                  <WorkspaceAccordionItem
                    className={"pn-accordion-item"}
                    value={"collapse-3-flush"}
                  >
                    {" "}
                    <h2 className={"pn-accordion-header"}>
                      {" "}
                      <WorkspaceAccordionTrigger
                        id={"accordion-button-3-flush"}
                        className={"pn-accordion-button pn-collapsed"}
                        type={"button"}
                      >
                        {
                          " Where can I find the approved deliverables? "
                        }
                        <div className={"pn-accordion-button-toggle"}>
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
                            <path d={"M6 9l6 6l6 -6"}></path>
                          </svg>{" "}
                        </div>{" "}
                      </WorkspaceAccordionTrigger>{" "}
                    </h2>{" "}
                    <WorkspaceAccordionContent
                      id={"collapse-3-flush"}
                      className={"pn-accordion-collapse pn-collapse"}
                    >
                      {" "}
                      <div className={"pn-accordion-body"}>
                        {
                          "Approved files live in the project handover folder. Each delivery includes the source files, ready-to-use exports, and a short guide to the decisions behind them."
                        }
                      </div>{" "}
                    </WorkspaceAccordionContent>{" "}
                  </WorkspaceAccordionItem>{" "}
                  <WorkspaceAccordionItem
                    className={"pn-accordion-item"}
                    value={"collapse-4-flush"}
                  >
                    {" "}
                    <h2 className={"pn-accordion-header"}>
                      {" "}
                      <WorkspaceAccordionTrigger
                        id={"accordion-button-4-flush"}
                        className={"pn-accordion-button pn-collapsed"}
                        type={"button"}
                      >
                        {" How accessible are overtrue/ui components? "}
                        <div className={"pn-accordion-button-toggle"}>
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
                            <path d={"M6 9l6 6l6 -6"}></path>
                          </svg>{" "}
                        </div>{" "}
                      </WorkspaceAccordionTrigger>{" "}
                    </h2>{" "}
                    <WorkspaceAccordionContent
                      id={"collapse-4-flush"}
                      className={"pn-accordion-collapse pn-collapse"}
                    >
                      {" "}
                      <div className={"pn-accordion-body"}>
                        {
                          "Add a short decision note to the project activity. Include the choice, the reason, and the person responsible for the next step."
                        }
                      </div>{" "}
                    </WorkspaceAccordionContent>{" "}
                  </WorkspaceAccordionItem>{" "}
                </WorkspaceAccordion>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Tabs"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Add "}
                    <code>{"accordion-tabs"}</code>
                    {" for a tab-like header instead of the default style."}
                  </CardDescription>{" "}
                  <WorkspaceAccordion
                    className={"pn-accordion pn-accordion-tabs"}
                    id={"accordion-tabs"}
                    mode="single"
                    defaultValue={["collapse-1-tabs"]}
                  >
                    {" "}
                    <WorkspaceAccordionItem
                      className={"pn-accordion-item"}
                      value={"collapse-1-tabs"}
                    >
                      {" "}
                      <h2 className={"pn-accordion-header"}>
                        {" "}
                        <WorkspaceAccordionTrigger
                          id={"accordion-button-1-tabs"}
                          className={"pn-accordion-button"}
                          type={"button"}
                        >
                          {
                            " How do we start a new client project? "
                          }
                          <div className={"pn-accordion-button-toggle"}>
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
                              <path d={"M6 9l6 6l6 -6"}></path>
                            </svg>{" "}
                          </div>{" "}
                        </WorkspaceAccordionTrigger>{" "}
                      </h2>{" "}
                      <WorkspaceAccordionContent
                        id={"collapse-1-tabs"}
                        className={"pn-accordion-collapse pn-collapse pn-show"}
                      >
                        {" "}
                        <div className={"pn-accordion-body"}>
                          {
                            "Write a short brief, choose a project owner, and agree on the first milestone. Invite the people who need to contribute before adding detailed tasks."
                          }
                        </div>{" "}
                      </WorkspaceAccordionContent>{" "}
                    </WorkspaceAccordionItem>{" "}
                    <WorkspaceAccordionItem
                      className={"pn-accordion-item"}
                      value={"collapse-2-tabs"}
                    >
                      {" "}
                      <h2 className={"pn-accordion-header"}>
                        {" "}
                        <WorkspaceAccordionTrigger
                          id={"accordion-button-2-tabs"}
                          className={"pn-accordion-button pn-collapsed"}
                          type={"button"}
                        >
                          {
                            " Who should join the first project review? "
                          }
                          <div className={"pn-accordion-button-toggle"}>
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
                              <path d={"M6 9l6 6l6 -6"}></path>
                            </svg>{" "}
                          </div>{" "}
                        </WorkspaceAccordionTrigger>{" "}
                      </h2>{" "}
                      <WorkspaceAccordionContent
                        id={"collapse-2-tabs"}
                        className={"pn-accordion-collapse pn-collapse"}
                      >
                        {" "}
                        <div className={"pn-accordion-body"}>
                          {
                            "Include the project owner, the people doing the work, and one client decision-maker. A small group makes it easier to ask clear questions and agree on the next step."
                          }
                        </div>{" "}
                      </WorkspaceAccordionContent>{" "}
                    </WorkspaceAccordionItem>{" "}
                    <WorkspaceAccordionItem
                      className={"pn-accordion-item"}
                      value={"collapse-3-tabs"}
                    >
                      {" "}
                      <h2 className={"pn-accordion-header"}>
                        {" "}
                        <WorkspaceAccordionTrigger
                          id={"accordion-button-3-tabs"}
                          className={"pn-accordion-button pn-collapsed"}
                          type={"button"}
                        >
                          {
                            " Where can I find the approved deliverables? "
                          }
                          <div className={"pn-accordion-button-toggle"}>
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
                              <path d={"M6 9l6 6l6 -6"}></path>
                            </svg>{" "}
                          </div>{" "}
                        </WorkspaceAccordionTrigger>{" "}
                      </h2>{" "}
                      <WorkspaceAccordionContent
                        id={"collapse-3-tabs"}
                        className={"pn-accordion-collapse pn-collapse"}
                      >
                        {" "}
                        <div className={"pn-accordion-body"}>
                          {
                            "Approved files live in the project handover folder. Each delivery includes the source files, ready-to-use exports, and a short guide to the decisions behind them."
                          }
                        </div>{" "}
                      </WorkspaceAccordionContent>{" "}
                    </WorkspaceAccordionItem>{" "}
                    <WorkspaceAccordionItem
                      className={"pn-accordion-item"}
                      value={"collapse-4-tabs"}
                    >
                      {" "}
                      <h2 className={"pn-accordion-header"}>
                        {" "}
                        <WorkspaceAccordionTrigger
                          id={"accordion-button-4-tabs"}
                          className={"pn-accordion-button pn-collapsed"}
                          type={"button"}
                        >
                          {" How accessible are overtrue/ui components? "}
                          <div className={"pn-accordion-button-toggle"}>
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
                              <path d={"M6 9l6 6l6 -6"}></path>
                            </svg>{" "}
                          </div>{" "}
                        </WorkspaceAccordionTrigger>{" "}
                      </h2>{" "}
                      <WorkspaceAccordionContent
                        id={"collapse-4-tabs"}
                        className={"pn-accordion-collapse pn-collapse"}
                      >
                        {" "}
                        <div className={"pn-accordion-body"}>
                          {
                            "Add a short decision note to the project activity. Include the choice, the reason, and the person responsible for the next step."
                          }
                        </div>{" "}
                      </WorkspaceAccordionContent>{" "}
                    </WorkspaceAccordionItem>{" "}
                  </WorkspaceAccordion>{" "}
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
                    {"Inverted"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Add "}
                    <code>{"accordion-inverted"}</code>
                    {" to flip the toggle icon to the start of the header."}
                  </CardDescription>{" "}
                  <WorkspaceAccordion
                    className={"pn-accordion pn-accordion-inverted"}
                    id={"accordion-inverted"}
                    mode="single"
                    defaultValue={["collapse-1-inverted"]}
                  >
                    {" "}
                    <WorkspaceAccordionItem
                      className={"pn-accordion-item"}
                      value={"collapse-1-inverted"}
                    >
                      {" "}
                      <h2 className={"pn-accordion-header"}>
                        {" "}
                        <WorkspaceAccordionTrigger
                          id={"accordion-button-1-inverted"}
                          className={"pn-accordion-button"}
                          type={"button"}
                        >
                          {
                            " How do we start a new client project? "
                          }
                          <div className={"pn-accordion-button-toggle"}>
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
                              <path d={"M6 9l6 6l6 -6"}></path>
                            </svg>{" "}
                          </div>{" "}
                        </WorkspaceAccordionTrigger>{" "}
                      </h2>{" "}
                      <WorkspaceAccordionContent
                        id={"collapse-1-inverted"}
                        className={"pn-accordion-collapse pn-collapse pn-show"}
                      >
                        {" "}
                        <div className={"pn-accordion-body"}>
                          {
                            "Write a short brief, choose a project owner, and agree on the first milestone. Invite the people who need to contribute before adding detailed tasks."
                          }
                        </div>{" "}
                      </WorkspaceAccordionContent>{" "}
                    </WorkspaceAccordionItem>{" "}
                    <WorkspaceAccordionItem
                      className={"pn-accordion-item"}
                      value={"collapse-2-inverted"}
                    >
                      {" "}
                      <h2 className={"pn-accordion-header"}>
                        {" "}
                        <WorkspaceAccordionTrigger
                          id={"accordion-button-2-inverted"}
                          className={"pn-accordion-button pn-collapsed"}
                          type={"button"}
                        >
                          {
                            " Who should join the first project review? "
                          }
                          <div className={"pn-accordion-button-toggle"}>
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
                              <path d={"M6 9l6 6l6 -6"}></path>
                            </svg>{" "}
                          </div>{" "}
                        </WorkspaceAccordionTrigger>{" "}
                      </h2>{" "}
                      <WorkspaceAccordionContent
                        id={"collapse-2-inverted"}
                        className={"pn-accordion-collapse pn-collapse"}
                      >
                        {" "}
                        <div className={"pn-accordion-body"}>
                          {
                            "Include the project owner, the people doing the work, and one client decision-maker. A small group makes it easier to ask clear questions and agree on the next step."
                          }
                        </div>{" "}
                      </WorkspaceAccordionContent>{" "}
                    </WorkspaceAccordionItem>{" "}
                    <WorkspaceAccordionItem
                      className={"pn-accordion-item"}
                      value={"collapse-3-inverted"}
                    >
                      {" "}
                      <h2 className={"pn-accordion-header"}>
                        {" "}
                        <WorkspaceAccordionTrigger
                          id={"accordion-button-3-inverted"}
                          className={"pn-accordion-button pn-collapsed"}
                          type={"button"}
                        >
                          {
                            " Where can I find the approved deliverables? "
                          }
                          <div className={"pn-accordion-button-toggle"}>
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
                              <path d={"M6 9l6 6l6 -6"}></path>
                            </svg>{" "}
                          </div>{" "}
                        </WorkspaceAccordionTrigger>{" "}
                      </h2>{" "}
                      <WorkspaceAccordionContent
                        id={"collapse-3-inverted"}
                        className={"pn-accordion-collapse pn-collapse"}
                      >
                        {" "}
                        <div className={"pn-accordion-body"}>
                          {
                            "Approved files live in the project handover folder. Each delivery includes the source files, ready-to-use exports, and a short guide to the decisions behind them."
                          }
                        </div>{" "}
                      </WorkspaceAccordionContent>{" "}
                    </WorkspaceAccordionItem>{" "}
                    <WorkspaceAccordionItem
                      className={"pn-accordion-item"}
                      value={"collapse-4-inverted"}
                    >
                      {" "}
                      <h2 className={"pn-accordion-header"}>
                        {" "}
                        <WorkspaceAccordionTrigger
                          id={"accordion-button-4-inverted"}
                          className={"pn-accordion-button pn-collapsed"}
                          type={"button"}
                        >
                          {" How accessible are overtrue/ui components? "}
                          <div className={"pn-accordion-button-toggle"}>
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
                              <path d={"M6 9l6 6l6 -6"}></path>
                            </svg>{" "}
                          </div>{" "}
                        </WorkspaceAccordionTrigger>{" "}
                      </h2>{" "}
                      <WorkspaceAccordionContent
                        id={"collapse-4-inverted"}
                        className={"pn-accordion-collapse pn-collapse"}
                      >
                        {" "}
                        <div className={"pn-accordion-body"}>
                          {
                            "Add a short decision note to the project activity. Include the choice, the reason, and the person responsible for the next step."
                          }
                        </div>{" "}
                      </WorkspaceAccordionContent>{" "}
                    </WorkspaceAccordionItem>{" "}
                  </WorkspaceAccordion>{" "}
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
                    {"Inverted with plus icon"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Combine "}
                    <code>{"accordion-inverted"}</code>
                    {" with "}
                    <code>{"accordion-button-toggle-plus"}</code>
                    {" and a custom icon in the toggle."}
                  </CardDescription>{" "}
                  <WorkspaceAccordion
                    className={"pn-accordion pn-accordion-inverted"}
                    id={"accordion-inverted-plus"}
                    mode="single"
                    defaultValue={["collapse-1-inverted-plus"]}
                  >
                    {" "}
                    <WorkspaceAccordionItem
                      className={"pn-accordion-item"}
                      value={"collapse-1-inverted-plus"}
                    >
                      {" "}
                      <h2 className={"pn-accordion-header"}>
                        {" "}
                        <WorkspaceAccordionTrigger
                          id={"accordion-button-1-inverted-plus"}
                          className={"pn-accordion-button"}
                          type={"button"}
                        >
                          {
                            " How do we start a new client project? "
                          }
                          <div
                            className={
                              "pn-accordion-button-toggle pn-accordion-button-toggle-plus"
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
                            </svg>{" "}
                          </div>{" "}
                        </WorkspaceAccordionTrigger>{" "}
                      </h2>{" "}
                      <WorkspaceAccordionContent
                        id={"collapse-1-inverted-plus"}
                        className={"pn-accordion-collapse pn-collapse pn-show"}
                      >
                        {" "}
                        <div className={"pn-accordion-body"}>
                          {
                            "Write a short brief, choose a project owner, and agree on the first milestone. Invite the people who need to contribute before adding detailed tasks."
                          }
                        </div>{" "}
                      </WorkspaceAccordionContent>{" "}
                    </WorkspaceAccordionItem>{" "}
                    <WorkspaceAccordionItem
                      className={"pn-accordion-item"}
                      value={"collapse-2-inverted-plus"}
                    >
                      {" "}
                      <h2 className={"pn-accordion-header"}>
                        {" "}
                        <WorkspaceAccordionTrigger
                          id={"accordion-button-2-inverted-plus"}
                          className={"pn-accordion-button pn-collapsed"}
                          type={"button"}
                        >
                          {
                            " Who should join the first project review? "
                          }
                          <div
                            className={
                              "pn-accordion-button-toggle pn-accordion-button-toggle-plus"
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
                            </svg>{" "}
                          </div>{" "}
                        </WorkspaceAccordionTrigger>{" "}
                      </h2>{" "}
                      <WorkspaceAccordionContent
                        id={"collapse-2-inverted-plus"}
                        className={"pn-accordion-collapse pn-collapse"}
                      >
                        {" "}
                        <div className={"pn-accordion-body"}>
                          {
                            "Include the project owner, the people doing the work, and one client decision-maker. A small group makes it easier to ask clear questions and agree on the next step."
                          }
                        </div>{" "}
                      </WorkspaceAccordionContent>{" "}
                    </WorkspaceAccordionItem>{" "}
                    <WorkspaceAccordionItem
                      className={"pn-accordion-item"}
                      value={"collapse-3-inverted-plus"}
                    >
                      {" "}
                      <h2 className={"pn-accordion-header"}>
                        {" "}
                        <WorkspaceAccordionTrigger
                          id={"accordion-button-3-inverted-plus"}
                          className={"pn-accordion-button pn-collapsed"}
                          type={"button"}
                        >
                          {
                            " Where can I find the approved deliverables? "
                          }
                          <div
                            className={
                              "pn-accordion-button-toggle pn-accordion-button-toggle-plus"
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
                            </svg>{" "}
                          </div>{" "}
                        </WorkspaceAccordionTrigger>{" "}
                      </h2>{" "}
                      <WorkspaceAccordionContent
                        id={"collapse-3-inverted-plus"}
                        className={"pn-accordion-collapse pn-collapse"}
                      >
                        {" "}
                        <div className={"pn-accordion-body"}>
                          {
                            "Approved files live in the project handover folder. Each delivery includes the source files, ready-to-use exports, and a short guide to the decisions behind them."
                          }
                        </div>{" "}
                      </WorkspaceAccordionContent>{" "}
                    </WorkspaceAccordionItem>{" "}
                    <WorkspaceAccordionItem
                      className={"pn-accordion-item"}
                      value={"collapse-4-inverted-plus"}
                    >
                      {" "}
                      <h2 className={"pn-accordion-header"}>
                        {" "}
                        <WorkspaceAccordionTrigger
                          id={"accordion-button-4-inverted-plus"}
                          className={"pn-accordion-button pn-collapsed"}
                          type={"button"}
                        >
                          {" How accessible are overtrue/ui components? "}
                          <div
                            className={
                              "pn-accordion-button-toggle pn-accordion-button-toggle-plus"
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
                            </svg>{" "}
                          </div>{" "}
                        </WorkspaceAccordionTrigger>{" "}
                      </h2>{" "}
                      <WorkspaceAccordionContent
                        id={"collapse-4-inverted-plus"}
                        className={"pn-accordion-collapse pn-collapse"}
                      >
                        {" "}
                        <div className={"pn-accordion-body"}>
                          {
                            "Add a short decision note to the project activity. Include the choice, the reason, and the person responsible for the next step."
                          }
                        </div>{" "}
                      </WorkspaceAccordionContent>{" "}
                    </WorkspaceAccordionItem>{" "}
                  </WorkspaceAccordion>{" "}
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
                    {"Add an "}
                    <code>{"accordion-button-icon"}</code>
                    {" next to each panel's title."}
                  </CardDescription>{" "}
                  <WorkspaceAccordion
                    className={"pn-accordion"}
                    id={"accordion-icons"}
                    mode="single"
                    defaultValue={["collapse-1-icons"]}
                  >
                    {" "}
                    <WorkspaceAccordionItem
                      className={"pn-accordion-item"}
                      value={"collapse-1-icons"}
                    >
                      {" "}
                      <h2 className={"pn-accordion-header"}>
                        {" "}
                        <WorkspaceAccordionTrigger
                          id={"accordion-button-1-icons"}
                          className={"pn-accordion-button"}
                          type={"button"}
                        >
                          {" "}
                          <div className={"pn-accordion-button-icon"}>
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
                              <path d={"M9 15l6 -6"}></path>{" "}
                              <path
                                d={
                                  "M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464"
                                }
                              ></path>{" "}
                              <path
                                d={
                                  "M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"
                                }
                              ></path>{" "}
                            </svg>{" "}
                          </div>
                          {
                            " How do we start a new client project? "
                          }
                          <div className={"pn-accordion-button-toggle"}>
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
                              <path d={"M6 9l6 6l6 -6"}></path>
                            </svg>{" "}
                          </div>{" "}
                        </WorkspaceAccordionTrigger>{" "}
                      </h2>{" "}
                      <WorkspaceAccordionContent
                        id={"collapse-1-icons"}
                        className={"pn-accordion-collapse pn-collapse pn-show"}
                      >
                        {" "}
                        <div className={"pn-accordion-body"}>
                          {
                            "Write a short brief, choose a project owner, and agree on the first milestone. Invite the people who need to contribute before adding detailed tasks."
                          }
                        </div>{" "}
                      </WorkspaceAccordionContent>{" "}
                    </WorkspaceAccordionItem>{" "}
                    <WorkspaceAccordionItem
                      className={"pn-accordion-item"}
                      value={"collapse-2-icons"}
                    >
                      {" "}
                      <h2 className={"pn-accordion-header"}>
                        {" "}
                        <WorkspaceAccordionTrigger
                          id={"accordion-button-2-icons"}
                          className={"pn-accordion-button pn-collapsed"}
                          type={"button"}
                        >
                          {" "}
                          <div className={"pn-accordion-button-icon"}>
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
                              <path d={"M9 15l6 -6"}></path>{" "}
                              <path
                                d={
                                  "M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464"
                                }
                              ></path>{" "}
                              <path
                                d={
                                  "M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"
                                }
                              ></path>{" "}
                            </svg>{" "}
                          </div>
                          {
                            " Who should join the first project review? "
                          }
                          <div className={"pn-accordion-button-toggle"}>
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
                              <path d={"M6 9l6 6l6 -6"}></path>
                            </svg>{" "}
                          </div>{" "}
                        </WorkspaceAccordionTrigger>{" "}
                      </h2>{" "}
                      <WorkspaceAccordionContent
                        id={"collapse-2-icons"}
                        className={"pn-accordion-collapse pn-collapse"}
                      >
                        {" "}
                        <div className={"pn-accordion-body"}>
                          {
                            "Include the project owner, the people doing the work, and one client decision-maker. A small group makes it easier to ask clear questions and agree on the next step."
                          }
                        </div>{" "}
                      </WorkspaceAccordionContent>{" "}
                    </WorkspaceAccordionItem>{" "}
                    <WorkspaceAccordionItem
                      className={"pn-accordion-item"}
                      value={"collapse-3-icons"}
                    >
                      {" "}
                      <h2 className={"pn-accordion-header"}>
                        {" "}
                        <WorkspaceAccordionTrigger
                          id={"accordion-button-3-icons"}
                          className={"pn-accordion-button pn-collapsed"}
                          type={"button"}
                        >
                          {" "}
                          <div className={"pn-accordion-button-icon"}>
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
                              <path d={"M9 15l6 -6"}></path>{" "}
                              <path
                                d={
                                  "M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464"
                                }
                              ></path>{" "}
                              <path
                                d={
                                  "M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"
                                }
                              ></path>{" "}
                            </svg>{" "}
                          </div>
                          {
                            " Where can I find the approved deliverables? "
                          }
                          <div className={"pn-accordion-button-toggle"}>
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
                              <path d={"M6 9l6 6l6 -6"}></path>
                            </svg>{" "}
                          </div>{" "}
                        </WorkspaceAccordionTrigger>{" "}
                      </h2>{" "}
                      <WorkspaceAccordionContent
                        id={"collapse-3-icons"}
                        className={"pn-accordion-collapse pn-collapse"}
                      >
                        {" "}
                        <div className={"pn-accordion-body"}>
                          {
                            "Approved files live in the project handover folder. Each delivery includes the source files, ready-to-use exports, and a short guide to the decisions behind them."
                          }
                        </div>{" "}
                      </WorkspaceAccordionContent>{" "}
                    </WorkspaceAccordionItem>{" "}
                    <WorkspaceAccordionItem
                      className={"pn-accordion-item"}
                      value={"collapse-4-icons"}
                    >
                      {" "}
                      <h2 className={"pn-accordion-header"}>
                        {" "}
                        <WorkspaceAccordionTrigger
                          id={"accordion-button-4-icons"}
                          className={"pn-accordion-button pn-collapsed"}
                          type={"button"}
                        >
                          {" "}
                          <div className={"pn-accordion-button-icon"}>
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
                              <path d={"M9 15l6 -6"}></path>{" "}
                              <path
                                d={
                                  "M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464"
                                }
                              ></path>{" "}
                              <path
                                d={
                                  "M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"
                                }
                              ></path>{" "}
                            </svg>{" "}
                          </div>
                          {" How accessible are overtrue/ui components? "}
                          <div className={"pn-accordion-button-toggle"}>
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
                              <path d={"M6 9l6 6l6 -6"}></path>
                            </svg>{" "}
                          </div>{" "}
                        </WorkspaceAccordionTrigger>{" "}
                      </h2>{" "}
                      <WorkspaceAccordionContent
                        id={"collapse-4-icons"}
                        className={"pn-accordion-collapse pn-collapse"}
                      >
                        {" "}
                        <div className={"pn-accordion-body"}>
                          {
                            "Add a short decision note to the project activity. Include the choice, the reason, and the person responsible for the next step."
                          }
                        </div>{" "}
                      </WorkspaceAccordionContent>{" "}
                    </WorkspaceAccordionItem>{" "}
                  </WorkspaceAccordion>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  )
}
