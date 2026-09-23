import {
  WorkspaceRange,
  WorkspaceRating,
} from "@/components/overtrue/workspace/plugins"
// Keep page composition editable; interaction belongs in the shared components.
import type { CSSProperties } from "react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  WorkspaceAccordion,
  WorkspaceAccordionContent,
  WorkspaceAccordionItem,
  WorkspaceAccordionTrigger,
  WorkspaceAction,
  WorkspaceAlert,
  WorkspaceBadge,
  WorkspaceButton,
  WorkspaceCollapse,
  WorkspaceDropdown,
  WorkspaceDropdownContent,
  WorkspaceDropdownItem,
  WorkspaceDropdownTrigger,
  WorkspaceInput,
  WorkspaceLink,
  WorkspaceModal,
  WorkspaceSelect,
  WorkspaceTab,
  WorkspaceTextarea,
  WorkspaceToast,
} from "@/components/overtrue/workspace/primitives"
export default function Page() {
  return (
    <div data-workspace-page="all-elements" className="pn-page-wrapper">
      {" "}
      <div className={"pn-page-header pn-d-print-none"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-g-2 pn-align-items-center"}>
            {" "}
            <div className={"pn-col"}>
              {" "}
              <h1 className={"pn-page-title"}>{"All Elements"}</h1>{" "}
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
                    {"Typography"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-row"}>
                    {" "}
                    <div className={"pn-col-md-6"}>
                      {" "}
                      <h1>{"Heading 1"}</h1> <h2>{"Heading 2"}</h2>{" "}
                      <h3>{"Heading 3"}</h3> <h4>{"Heading 4"}</h4>{" "}
                      <h5>{"Heading 5"}</h5> <h6>{"Heading 6"}</h6>{" "}
                    </div>{" "}
                    <div className={"pn-col-md-6"}>
                      {" "}
                      <p className={"pn-lead"}>
                        {"Good work starts with a shared understanding."}
                      </p>{" "}
                      <p>
                        {"This is a regular paragraph with "}
                        <strong>{"bold text"}</strong>
                        {", "}
                        <em>{"italic text"}</em>
                        {", and "}
                        <u>{"underlined text"}</u>
                        {"."}
                      </p>{" "}
                      <p>
                        <small className={"pn-text-muted"}>
                          {"This is small muted text."}
                        </small>
                      </p>{" "}
                      <p className={"pn-text-primary"}>{"Primary text color"}</p>{" "}
                      <p className={"pn-text-success"}>{"Success text color"}</p>{" "}
                      <p className={"pn-text-danger"}>
                        {"Danger text color"}
                      </p>{" "}
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
                    {"Buttons"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-row"}>
                    {" "}
                    <div className={"pn-col-md-6"}>
                      {" "}
                      <h4>{"Standard Buttons"}</h4>{" "}
                      <div className={"pn-btn-list pn-mb-3"}>
                        {" "}
                        <WorkspaceButton type={"button"} className={"pn-btn"}>
                          {"Default"}
                        </WorkspaceButton>{" "}
                        <WorkspaceButton
                          type={"button"}
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
                            {" "}
                            <path
                              d={
                                "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"
                              }
                            ></path>
                          </svg>
                          {"Primary "}
                        </WorkspaceButton>{" "}
                        <WorkspaceButton
                          type={"button"}
                          className={"pn-btn pn-btn-secondary"}
                        >
                          {"Secondary"}
                        </WorkspaceButton>{" "}
                        <WorkspaceButton
                          type={"button"}
                          className={"pn-btn pn-btn-success"}
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
                          {"Success "}
                        </WorkspaceButton>{" "}
                        <WorkspaceButton
                          type={"button"}
                          className={"pn-btn pn-btn-warning"}
                        >
                          {"Warning"}
                        </WorkspaceButton>{" "}
                        <WorkspaceButton
                          type={"button"}
                          className={"pn-btn pn-btn-danger"}
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
                            <path d={"M6 6l12 12"}></path>
                          </svg>
                          {"Danger "}
                        </WorkspaceButton>{" "}
                        <WorkspaceButton
                          type={"button"}
                          className={"pn-btn pn-btn-info"}
                        >
                          {"Info"}
                        </WorkspaceButton>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-md-6"}>
                      {" "}
                      <h4>{"Button Sizes"}</h4>{" "}
                      <div className={"pn-btn-list pn-mb-3 pn-align-items-start"}>
                        {" "}
                        <WorkspaceButton
                          type={"button"}
                          className={"pn-btn pn-btn-sm"}
                        >
                          {"Small"}
                        </WorkspaceButton>{" "}
                        <WorkspaceButton type={"button"} className={"pn-btn"}>
                          {"Default"}
                        </WorkspaceButton>{" "}
                        <WorkspaceButton
                          type={"button"}
                          className={"pn-btn pn-btn-lg"}
                        >
                          {"Large"}
                        </WorkspaceButton>{" "}
                      </div>{" "}
                      <h4>{"Icon Buttons"}</h4>{" "}
                      <div className={"pn-btn-list pn-mb-3 pn-align-items-start"}>
                        {" "}
                        <WorkspaceButton
                          type={"button"}
                          aria-label={"Heart"}
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
                                "M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"
                              }
                            ></path>{" "}
                          </svg>{" "}
                        </WorkspaceButton>{" "}
                        <WorkspaceButton
                          type={"button"}
                          aria-label={"Star"}
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
                        <WorkspaceButton
                          type={"button"}
                          aria-label={"Check"}
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
                            <path d={"M5 12l5 5l10 -10"}></path>
                          </svg>{" "}
                        </WorkspaceButton>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Simple Card"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <p>
                    {"Keep the project brief close to its milestones, files, and decisions."}
                  </p>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Card with Footer"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <p>{"This card includes a footer section."}</p>{" "}
                </CardContent>{" "}
                <CardFooter className={"pn-card-footer"}>
                  {" "}
                  <div className={"pn-d-flex"}>
                    {" "}
                    <WorkspaceButton className={"pn-btn pn-btn-link"}>
                      {"Cancel"}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton className={"pn-btn pn-btn-primary pn-ms-auto"}>
                      {"Save"}
                    </WorkspaceButton>{" "}
                  </div>{" "}
                </CardFooter>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-12"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Alerts"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <WorkspaceAlert
                    className={"pn-alert pn-alert-info"}
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        {" "}
                        <path
                          d={"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"}
                        ></path>{" "}
                        <path d={"M12 9h.01"}></path>{" "}
                        <path d={"M11 12h1v4h1"}></path>{" "}
                      </svg>{" "}
                    </div>
                    {" This is a primary alert with an icon. "}
                  </WorkspaceAlert>{" "}
                  <WorkspaceAlert
                    className={"pn-alert pn-alert-success"}
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        <path d={"M5 12l5 5l10 -10"}></path>
                      </svg>{" "}
                    </div>
                    {" This is a success alert message. "}
                  </WorkspaceAlert>{" "}
                  <WorkspaceAlert
                    className={"pn-alert pn-alert-warning"}
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        {" "}
                        <path d={"M12 9v4"}></path>{" "}
                        <path
                          d={
                            "M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0"
                          }
                        ></path>{" "}
                        <path d={"M12 16h.01"}></path>{" "}
                      </svg>{" "}
                    </div>
                    {" This is a warning alert message. "}
                  </WorkspaceAlert>{" "}
                  <WorkspaceAlert
                    className={"pn-alert pn-alert-danger"}
                    role={"alert"}
                  >
                    {" "}
                    <div className={"pn-alert-icon"}>
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
                        className={"pn-icon pn-alert-icon"}
                      >
                        {" "}
                        <path
                          d={"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"}
                        ></path>{" "}
                        <path d={"M12 8v4"}></path>{" "}
                        <path d={"M12 16h.01"}></path>{" "}
                      </svg>{" "}
                    </div>
                    {" This is a danger alert message. "}
                  </WorkspaceAlert>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Badges"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-space-y"}>
                    {" "}
                    <div className={"pn-badge-list"}>
                      {" "}
                      <WorkspaceBadge className={"pn-badge"}>
                        {"Default"}
                      </WorkspaceBadge>{" "}
                      <WorkspaceBadge
                        className={"pn-badge pn-bg-primary pn-text-primary-fg"}
                      >
                        {"Primary"}
                      </WorkspaceBadge>{" "}
                      <WorkspaceBadge
                        className={"pn-badge pn-bg-secondary pn-text-secondary-fg"}
                      >
                        {"Secondary"}
                      </WorkspaceBadge>{" "}
                      <WorkspaceBadge
                        className={"pn-badge pn-bg-success pn-text-success-fg"}
                      >
                        {"Success"}
                      </WorkspaceBadge>{" "}
                      <WorkspaceBadge
                        className={"pn-badge pn-bg-warning pn-text-warning-fg"}
                      >
                        {"Warning"}
                      </WorkspaceBadge>{" "}
                      <WorkspaceBadge
                        className={"pn-badge pn-bg-danger pn-text-danger-fg"}
                      >
                        {"Danger"}
                      </WorkspaceBadge>{" "}
                    </div>{" "}
                    <div className={"pn-badge-list"}>
                      {" "}
                      <WorkspaceBadge
                        className={"pn-badge pn-bg-primary pn-text-primary-fg"}
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
                        {"With Icon"}
                      </WorkspaceBadge>{" "}
                      <WorkspaceBadge className={"pn-badge pn-bg-primary-lt"}>
                        {"Light Badge"}
                      </WorkspaceBadge>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Progress Bars"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-space-y"}>
                    {" "}
                    <div>
                      {" "}
                      <div className={"pn-progress"}>
                        {" "}
                        <div
                          className={"pn-progress-bar"}
                          style={{ width: "25%" } as CSSProperties}
                          role={"progressbar"}
                          aria-valuenow={25}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={"25% Complete"}
                        >
                          {" "}
                          <span className={"pn-visually-hidden"}>
                            {"25% Complete"}
                          </span>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <div className={"pn-progress"}>
                        {" "}
                        <div
                          className={"pn-progress-bar pn-bg-success"}
                          style={{ width: "50%" } as CSSProperties}
                          role={"progressbar"}
                          aria-valuenow={50}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={"50% Complete"}
                        >
                          {" "}
                          <span className={"pn-visually-hidden"}>
                            {"50% Complete"}
                          </span>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <div className={"pn-progress"}>
                        {" "}
                        <div
                          className={"pn-progress-bar pn-bg-warning"}
                          style={{ width: "75%" } as CSSProperties}
                          role={"progressbar"}
                          aria-valuenow={75}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={"75% Complete"}
                        >
                          {" "}
                          <span className={"pn-visually-hidden"}>
                            {"75% Complete"}
                          </span>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <div className={"pn-progress"}>
                        {" "}
                        <div
                          className={"pn-progress-bar pn-bg-danger"}
                          style={{ width: "90%" } as CSSProperties}
                          role={"progressbar"}
                          aria-valuenow={90}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={"90% Complete"}
                        >
                          {"90%"}
                        </div>{" "}
                      </div>{" "}
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
                    {"Form Elements"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-row"}>
                    {" "}
                    <div className={"pn-col-md-6"}>
                      {" "}
                      <div className={"pn-mb-3"}>
                        {" "}
                        <label
                          className={"pn-form-label"}
                          htmlFor={"all-elements-text-input"}
                        >
                          {" Text Input "}
                        </label>{" "}
                        <WorkspaceInput
                          type={"text"}
                          className={"pn-form-control"}
                          id={"all-elements-text-input"}
                          placeholder={"Enter text"}
                        />{" "}
                      </div>{" "}
                      <div className={"pn-mb-3"}>
                        {" "}
                        <label
                          className={"pn-form-label"}
                          htmlFor={"all-elements-email-input"}
                        >
                          {" Email Input "}
                        </label>{" "}
                        <WorkspaceInput
                          type={"email"}
                          className={"pn-form-control"}
                          id={"all-elements-email-input"}
                          placeholder={"Enter email"}
                        />{" "}
                      </div>{" "}
                      <div className={"pn-mb-3"}>
                        {" "}
                        <label
                          className={"pn-form-label"}
                          htmlFor={"all-elements-password-input"}
                        >
                          {" Password Input "}
                        </label>{" "}
                        <WorkspaceInput
                          type={"password"}
                          className={"pn-form-control"}
                          id={"all-elements-password-input"}
                          placeholder={"Enter password"}
                        />{" "}
                      </div>{" "}
                      <div className={"pn-mb-3"}>
                        {" "}
                        <label
                          className={"pn-form-label"}
                          htmlFor={"select-demo-select"}
                        >
                          {" Select Dropdown "}
                        </label>{" "}
                        <WorkspaceSelect
                          className={"pn-form-select"}
                          id={"select-demo-select"}
                        >
                          <option value={"Option 1"}>{"Option 1"}</option>
                          <option value={"Option 2"}>{"Option 2"}</option>
                          <option value={"Option 3"}>{"Option 3"}</option>
                        </WorkspaceSelect>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-md-6"}>
                      {" "}
                      <div className={"pn-mb-3"}>
                        {" "}
                        <label
                          className={"pn-form-label"}
                          htmlFor={"all-elements-textarea"}
                        >
                          {" Textarea "}
                        </label>{" "}
                        <WorkspaceTextarea
                          className={"pn-form-control"}
                          id={"all-elements-textarea"}
                          rows={3}
                          placeholder={"Enter message"}
                          defaultValue={""}
                        />{" "}
                      </div>{" "}
                      <div className={"pn-mb-3"}>
                        {" "}
                        <div className={"pn-form-label"}>
                          {"Checkboxes"}
                        </div>{" "}
                        <label className={"pn-form-check"}>
                          {" "}
                          <WorkspaceInput
                            className={"pn-form-check-input"}
                            type={"checkbox"}
                          />{" "}
                          <span className={"pn-form-check-label"}>
                            {"Option 1"}
                          </span>{" "}
                        </label>{" "}
                        <label className={"pn-form-check"}>
                          {" "}
                          <WorkspaceInput
                            className={"pn-form-check-input"}
                            type={"checkbox"}
                            defaultChecked
                          />{" "}
                          <span className={"pn-form-check-label"}>
                            {"Option 2"}
                          </span>{" "}
                        </label>{" "}
                      </div>{" "}
                      <div className={"pn-mb-3"}>
                        {" "}
                        <div className={"pn-form-label"}>
                          {"Radio Buttons"}
                        </div>{" "}
                        <label className={"pn-form-check"}>
                          {" "}
                          <WorkspaceInput
                            className={"pn-form-check-input"}
                            type={"radio"}
                            name={"radio-demo"}
                          />{" "}
                          <span className={"pn-form-check-label"}>
                            {"Option 1"}
                          </span>{" "}
                        </label>{" "}
                        <label className={"pn-form-check"}>
                          {" "}
                          <WorkspaceInput
                            className={"pn-form-check-input"}
                            type={"radio"}
                            name={"radio-demo"}
                            defaultChecked
                          />{" "}
                          <span className={"pn-form-check-label"}>
                            {"Option 2"}
                          </span>{" "}
                        </label>{" "}
                      </div>{" "}
                      <div className={"pn-mb-3"}>
                        {" "}
                        <div className={"pn-form-label"}>{"Switch"}</div>{" "}
                        <label className={"pn-form-check pn-form-switch"}>
                          {" "}
                          <WorkspaceInput
                            className={"pn-form-check-input"}
                            type={"checkbox"}
                          />{" "}
                          <span className={"pn-form-check-label"}>
                            {"Enable notifications"}
                          </span>{" "}
                        </label>{" "}
                      </div>{" "}
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
                    {"Navigation Elements"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-row"}>
                    {" "}
                    <div className={"pn-col-md-6"}>
                      {" "}
                      <h4>{"Tabs"}</h4>{" "}
                      <div className={"pn-mb-3"}>
                        {" "}
                        <ul className={"pn-nav pn-nav-tabs pn-mb-4"}>
                          {" "}
                          <li className={"pn-nav-item"}>
                            {" "}
                            <WorkspaceLink
                              className={"pn-nav-link pn-active"}
                              href={"#"}
                            >
                              {" Active "}
                            </WorkspaceLink>{" "}
                          </li>{" "}
                          <li className={"pn-nav-item"}>
                            {" "}
                            <WorkspaceLink className={"pn-nav-link"} href={"#"}>
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
                                className={"pn-icon pn-nav-link-icon"}
                              >
                                {" "}
                                <path
                                  d={
                                    "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"
                                  }
                                ></path>{" "}
                              </svg>
                              {" Link "}
                            </WorkspaceLink>{" "}
                          </li>{" "}
                          <li className={"pn-nav-item"}>
                            {" "}
                            <WorkspaceLink
                              className={"pn-nav-link pn-disabled"}
                              href={"#"}
                              tabIndex={-1}
                              aria-disabled={"true"}
                            >
                              {" Disabled "}
                            </WorkspaceLink>{" "}
                          </li>{" "}
                          <li className={"pn-nav-item pn-ms-auto"}>
                            {" "}
                            <WorkspaceLink className={"pn-nav-link"} href={"#"}>
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
                            </WorkspaceLink>{" "}
                          </li>{" "}
                        </ul>{" "}
                      </div>{" "}
                      <h4>{"Pills Navigation"}</h4>{" "}
                      <div className={"pn-mb-3"}>
                        {" "}
                        <ul className={"pn-nav pn-nav-pills pn-mb-4"}>
                          {" "}
                          <li className={"pn-nav-item"}>
                            {" "}
                            <WorkspaceLink
                              className={"pn-nav-link pn-active"}
                              href={"#"}
                            >
                              {" Active "}
                            </WorkspaceLink>{" "}
                          </li>{" "}
                          <li className={"pn-nav-item"}>
                            {" "}
                            <WorkspaceLink className={"pn-nav-link"} href={"#"}>
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
                                className={"pn-icon pn-nav-link-icon"}
                              >
                                {" "}
                                <path
                                  d={
                                    "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"
                                  }
                                ></path>{" "}
                              </svg>
                              {" Link "}
                            </WorkspaceLink>{" "}
                          </li>{" "}
                          <li className={"pn-nav-item"}>
                            {" "}
                            <WorkspaceLink
                              className={"pn-nav-link pn-disabled"}
                              href={"#"}
                              tabIndex={-1}
                              aria-disabled={"true"}
                            >
                              {" Disabled "}
                            </WorkspaceLink>{" "}
                          </li>{" "}
                          <li className={"pn-nav-item pn-ms-auto"}>
                            {" "}
                            <WorkspaceLink className={"pn-nav-link"} href={"#"}>
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
                            </WorkspaceLink>{" "}
                          </li>{" "}
                        </ul>{" "}
                      </div>{" "}
                      <h4>{"Breadcrumb"}</h4>{" "}
                      <nav aria-label={"Breadcrumb"}>
                        {" "}
                        <ol className={"pn-breadcrumb"}>
                          {" "}
                          <li className={"pn-breadcrumb-item"}>
                            {" "}
                            <WorkspaceLink href={"/"}>
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
                                  d={"M5 12l-2 0l9 -9l9 9l-2 0"}
                                ></path>{" "}
                                <path
                                  d={
                                    "M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"
                                  }
                                ></path>{" "}
                                <path
                                  d={
                                    "M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"
                                  }
                                ></path>{" "}
                              </svg>{" "}
                            </WorkspaceLink>{" "}
                          </li>{" "}
                          <li className={"pn-breadcrumb-item"}>
                            {" "}
                            <WorkspaceLink href={"#"}>
                              {"Library"}
                            </WorkspaceLink>{" "}
                          </li>{" "}
                          <li
                            className={"pn-breadcrumb-item pn-active"}
                            aria-current={"page"}
                          >
                            {"Data"}
                          </li>{" "}
                        </ol>{" "}
                      </nav>{" "}
                    </div>{" "}
                    <div className={"pn-col-md-6"}>
                      {" "}
                      <h4>{"Pagination"}</h4>{" "}
                      <nav aria-label={"Pagination"}>
                        {" "}
                        <ul className={"pn-pagination pn-mb-4"}>
                          {" "}
                          <li className={"pn-page-item pn-disabled"}>
                            {" "}
                            <WorkspaceLink
                              className={"pn-page-link"}
                              href={"#"}
                              tabIndex={-1}
                              aria-disabled={"true"}
                              aria-label={"Previous page"}
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
                              </svg>{" "}
                            </WorkspaceLink>{" "}
                          </li>{" "}
                          <li className={"pn-page-item"}>
                            {" "}
                            <WorkspaceLink
                              className={"pn-page-link"}
                              href={"#"}
                              aria-label={"Page 1"}
                            >
                              {" 1 "}
                            </WorkspaceLink>{" "}
                          </li>{" "}
                          <li className={"pn-page-item pn-active"}>
                            {" "}
                            <WorkspaceLink
                              className={"pn-page-link"}
                              href={"#"}
                              aria-label={"Page 2"}
                              aria-current={"page"}
                            >
                              {" 2 "}
                            </WorkspaceLink>{" "}
                          </li>{" "}
                          <li className={"pn-page-item"}>
                            {" "}
                            <WorkspaceLink
                              className={"pn-page-link"}
                              href={"#"}
                              aria-label={"Page 3"}
                            >
                              {" 3 "}
                            </WorkspaceLink>{" "}
                          </li>{" "}
                          <li className={"pn-page-item"}>
                            {" "}
                            <WorkspaceLink
                              className={"pn-page-link"}
                              href={"#"}
                              aria-label={"Page 4"}
                            >
                              {" 4 "}
                            </WorkspaceLink>{" "}
                          </li>{" "}
                          <li className={"pn-page-item"}>
                            {" "}
                            <WorkspaceLink
                              className={"pn-page-link"}
                              href={"#"}
                              aria-label={"Page 5"}
                            >
                              {" 5 "}
                            </WorkspaceLink>{" "}
                          </li>{" "}
                          <li className={"pn-page-item"}>
                            {" "}
                            <WorkspaceLink
                              className={"pn-page-link"}
                              href={"#"}
                              aria-label={"Next page"}
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
                                <path d={"M9 6l6 6l-6 6"}></path>
                              </svg>{" "}
                            </WorkspaceLink>{" "}
                          </li>{" "}
                        </ul>{" "}
                      </nav>{" "}
                      <h4>{"Pagination with Text"}</h4>{" "}
                      <nav aria-label={"Pagination"}>
                        {" "}
                        <ul className={"pn-pagination"}>
                          {" "}
                          <li className={"pn-page-item pn-disabled"}>
                            {" "}
                            <WorkspaceLink
                              className={"pn-page-link pn-page-text"}
                              href={"#"}
                              tabIndex={-1}
                              aria-disabled={"true"}
                            >
                              {" Previous "}
                            </WorkspaceLink>{" "}
                          </li>{" "}
                          <li className={"pn-page-item"}>
                            {" "}
                            <WorkspaceLink
                              className={"pn-page-link"}
                              href={"#"}
                              aria-label={"Page 1"}
                            >
                              {" 1 "}
                            </WorkspaceLink>{" "}
                          </li>{" "}
                          <li className={"pn-page-item"}>
                            {" "}
                            <WorkspaceLink
                              className={"pn-page-link"}
                              href={"#"}
                              aria-label={"Page 2"}
                            >
                              {" 2 "}
                            </WorkspaceLink>{" "}
                          </li>{" "}
                          <li className={"pn-page-item pn-active"}>
                            {" "}
                            <WorkspaceLink
                              className={"pn-page-link"}
                              href={"#"}
                              aria-label={"Page 3"}
                              aria-current={"page"}
                            >
                              {" 3 "}
                            </WorkspaceLink>{" "}
                          </li>{" "}
                          <li className={"pn-page-item"}>
                            {" "}
                            <WorkspaceLink
                              className={"pn-page-link pn-page-text"}
                              href={"#"}
                            >
                              {" Next "}
                            </WorkspaceLink>{" "}
                          </li>{" "}
                        </ul>{" "}
                      </nav>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Lists"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <h4>{"Unordered List"}</h4>{" "}
                  <ul>
                    {" "}
                    <li>{"First item"}</li> <li>{"Second item"}</li>{" "}
                    <li>{"Third item"}</li>{" "}
                  </ul>{" "}
                  <h4>{"Ordered List"}</h4>{" "}
                  <ol>
                    {" "}
                    <li>{"First item"}</li> <li>{"Second item"}</li>{" "}
                    <li>{"Third item"}</li>{" "}
                  </ol>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Table"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-table-responsive"}>
                    {" "}
                    <table className={"pn-table pn-table-vcenter"}>
                      <thead>
                        <tr>
                          <th>{"Name"}</th>
                          <th>{"Email"}</th>
                          <th>{"Status"}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{"John Doe"}</td>
                          <td>
                            <WorkspaceLink
                              href={"/cdn-cgi/l/email-protection"}
                              className={"pn-__cf_email__"}
                              data-cfemail={
                                "0d676265634d68756c607d6168236e6260"
                              }
                            >
                              {"[email protected]"}
                            </WorkspaceLink>
                          </td>
                          <td>
                            <WorkspaceBadge
                              className={
                                "pn-badge pn-bg-success pn-text-success-fg"
                              }
                            >
                              {"Active"}
                            </WorkspaceBadge>
                          </td>
                        </tr>
                        <tr>
                          <td>{"Jane Smith"}</td>
                          <td>
                            <WorkspaceLink
                              href={"/cdn-cgi/l/email-protection"}
                              className={"pn-__cf_email__"}
                              data-cfemail={
                                "4b212a252e0b2e332a263b272e65282426"
                              }
                            >
                              {"[email protected]"}
                            </WorkspaceLink>
                          </td>
                          <td>
                            <WorkspaceBadge
                              className={
                                "pn-badge pn-bg-warning pn-text-warning-fg"
                              }
                            >
                              {"Pending"}
                            </WorkspaceBadge>
                          </td>
                        </tr>
                        <tr>
                          <td>{"Bob Johnson"}</td>
                          <td>
                            <WorkspaceLink
                              href={"/cdn-cgi/l/email-protection"}
                              className={"pn-__cf_email__"}
                              data-cfemail={"65070a0725001d04081509004b060a08"}
                            >
                              {"[email protected]"}
                            </WorkspaceLink>
                          </td>
                          <td>
                            <WorkspaceBadge
                              className={"pn-badge pn-bg-danger pn-text-danger-fg"}
                            >
                              {"Inactive"}
                            </WorkspaceBadge>
                          </td>
                        </tr>
                      </tbody>
                    </table>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Avatars"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-space-y"}>
                    {" "}
                    <div className={"pn-avatar-list"}>
                      {" "}
                      <span className={"pn-avatar pn-avatar-sm"}>
                        {"JD"}
                      </span>{" "}
                      <span className={"pn-avatar"}>{"JS"}</span>{" "}
                      <span className={"pn-avatar pn-avatar-lg"}>{"BJ"}</span>{" "}
                      <span className={"pn-avatar pn-avatar-xl"}>
                        {"AB"}
                      </span>{" "}
                    </div>{" "}
                    <div className={"pn-avatar-list"}>
                      {" "}
                      <span className={"pn-avatar pn-avatar-rounded"}>
                        {"RD"}
                      </span>{" "}
                      <span
                        className={"pn-avatar pn-avatar-rounded pn-bg-primary-lt"}
                      >
                        {"PR"}
                      </span>{" "}
                      <span
                        className={"pn-avatar pn-avatar-rounded pn-bg-success-lt"}
                      >
                        {"SC"}
                      </span>{" "}
                    </div>{" "}
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
                      <span className={"pn-avatar pn-bg-warning-lt"}>
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
                      </span>{" "}
                      <span className={"pn-avatar"}>
                        <WorkspaceBadge
                          className={"pn-badge pn-bg-success"}
                          aria-label={"success"}
                        ></WorkspaceBadge>
                        {"ST"}
                      </span>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Icons"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-space-y"}>
                    {" "}
                    <div>
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
                        <path d={"M5 12l-2 0l9 -9l9 9l-2 0"}></path>{" "}
                        <path
                          d={"M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"}
                        ></path>{" "}
                        <path
                          d={"M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"}
                        ></path>{" "}
                      </svg>{" "}
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
                        ></path>{" "}
                      </svg>{" "}
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
                      </svg>{" "}
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
                        <path d={"M3 7l9 6l9 -6"}></path>{" "}
                      </svg>{" "}
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
                            "M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"
                          }
                        ></path>{" "}
                      </svg>{" "}
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
                            "M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12"
                          }
                        ></path>{" "}
                        <path d={"M16 3v4"}></path> <path d={"M8 3v4"}></path>{" "}
                        <path d={"M4 11h16"}></path>{" "}
                        <path d={"M11 15h1"}></path>{" "}
                        <path d={"M12 15v3"}></path>{" "}
                      </svg>{" "}
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
                          d={"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"}
                        ></path>{" "}
                        <path d={"M12 7v5l3 3"}></path>{" "}
                      </svg>{" "}
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
                          d={"M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"}
                        ></path>{" "}
                        <path
                          d={
                            "M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0"
                          }
                        ></path>{" "}
                      </svg>{" "}
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
                            "M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2"
                          }
                        ></path>{" "}
                        <path
                          d={"M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"}
                        ></path>{" "}
                      </svg>{" "}
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
                        <path d={"M5 12l14 0"}></path>
                      </svg>{" "}
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
                        <path d={"M4 7l16 0"}></path>{" "}
                        <path d={"M10 11l0 6"}></path>{" "}
                        <path d={"M14 11l0 6"}></path>{" "}
                        <path
                          d={"M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"}
                        ></path>{" "}
                        <path
                          d={"M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"}
                        ></path>{" "}
                      </svg>{" "}
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
                          d={"M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"}
                        ></path>{" "}
                        <path d={"M7 11l5 5l5 -5"}></path>{" "}
                        <path d={"M12 4l0 12"}></path>{" "}
                      </svg>{" "}
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
                          d={"M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"}
                        ></path>{" "}
                        <path d={"M7 9l5 -5l5 5"}></path>{" "}
                        <path d={"M12 4l0 12"}></path>{" "}
                      </svg>{" "}
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
                          d={"M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"}
                        ></path>{" "}
                        <path d={"M21 21l-6 -6"}></path>{" "}
                      </svg>{" "}
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
                            "M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227"
                          }
                        ></path>{" "}
                      </svg>{" "}
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
                          d={"M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"}
                        ></path>{" "}
                        <path
                          d={"M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"}
                        ></path>{" "}
                      </svg>{" "}
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
                          d={"M3 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"}
                        ></path>{" "}
                        <path d={"M15 6a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"}></path>{" "}
                        <path d={"M15 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"}></path>{" "}
                        <path d={"M8.7 10.7l6.6 -3.4"}></path>{" "}
                        <path d={"M8.7 13.3l6.6 3.4"}></path>{" "}
                      </svg>{" "}
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
                            "M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"
                          }
                        ></path>{" "}
                        <path d={"M11 13l9 -9"}></path>{" "}
                        <path d={"M15 4h5v5"}></path>{" "}
                      </svg>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <span className={"pn-text-primary"}>
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
                      </span>{" "}
                      <span className={"pn-text-success"}>
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
                          <path d={"M9 12l2 2l4 -4"}></path>
                        </svg>
                      </span>{" "}
                      <span className={"pn-text-warning"}>
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
                          <path d={"M12 9v4"}></path>{" "}
                          <path
                            d={
                              "M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0"
                            }
                          ></path>{" "}
                          <path d={"M12 16h.01"}></path>
                        </svg>
                      </span>{" "}
                      <span className={"pn-text-danger"}>
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
                            d={"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"}
                          ></path>{" "}
                          <path d={"M12 8v4"}></path>{" "}
                          <path d={"M12 16h.01"}></path>
                        </svg>
                      </span>{" "}
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
                    {"Dropdowns"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-btn-list"}>
                    {" "}
                    <WorkspaceDropdown className={"pn-dropdown"}>
                      {" "}
                      <WorkspaceDropdownTrigger
                        type={"button"}
                        className={"pn-btn pn-dropdown-toggle"}
                      >
                        {"Primary Dropdown"}
                      </WorkspaceDropdownTrigger>{" "}
                      <WorkspaceDropdownContent className={"pn-dropdown-menu"}>
                        <WorkspaceDropdownItem
                          type={"button"}
                          className={"pn-dropdown-item"}
                        >
                          {"Action"}
                        </WorkspaceDropdownItem>
                        <WorkspaceDropdownItem
                          type={"button"}
                          className={"pn-dropdown-item"}
                        >
                          {"Another action"}
                        </WorkspaceDropdownItem>
                        <WorkspaceDropdownItem
                          type={"button"}
                          className={"pn-dropdown-item"}
                        >
                          {"Something else here"}
                        </WorkspaceDropdownItem>
                      </WorkspaceDropdownContent>{" "}
                    </WorkspaceDropdown>{" "}
                    <WorkspaceDropdown className={"pn-dropdown"}>
                      {" "}
                      <WorkspaceDropdownTrigger
                        type={"button"}
                        className={"pn-btn pn-dropdown-toggle"}
                      >
                        {"Secondary Dropdown"}
                      </WorkspaceDropdownTrigger>{" "}
                      <WorkspaceDropdownContent className={"pn-dropdown-menu"}>
                        <WorkspaceDropdownItem
                          type={"button"}
                          className={"pn-dropdown-item"}
                        >
                          {"Edit"}
                        </WorkspaceDropdownItem>
                        <WorkspaceDropdownItem
                          type={"button"}
                          className={"pn-dropdown-item"}
                        >
                          {"Copy"}
                        </WorkspaceDropdownItem>
                        <WorkspaceDropdownItem
                          type={"button"}
                          className={"pn-dropdown-item"}
                        >
                          {"Delete"}
                        </WorkspaceDropdownItem>
                      </WorkspaceDropdownContent>{" "}
                    </WorkspaceDropdown>{" "}
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
                    {"Interactive Elements"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-row"}>
                    {" "}
                    <div className={"pn-col-md-6"}>
                      {" "}
                      <h4>{"Accordion"}</h4>{" "}
                      <div className={"pn-mb-4"}>
                        {" "}
                        <WorkspaceAccordion
                          className={"pn-accordion"}
                          id={"accordion-demo-accordion"}
                          mode="single"
                          defaultValue={["collapse-1-demo-accordion"]}
                        >
                          {" "}
                          <WorkspaceAccordionItem
                            className={"pn-accordion-item"}
                            value={"collapse-1-demo-accordion"}
                          >
                            {" "}
                            <h2 className={"pn-accordion-header"}>
                              {" "}
                              <WorkspaceAccordionTrigger
                                id={"accordion-button-1-demo-accordion"}
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
                              id={"collapse-1-demo-accordion"}
                              className={
                                "pn-accordion-collapse pn-collapse pn-show"
                              }
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
                            value={"collapse-2-demo-accordion"}
                          >
                            {" "}
                            <h2 className={"pn-accordion-header"}>
                              {" "}
                              <WorkspaceAccordionTrigger
                                id={"accordion-button-2-demo-accordion"}
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
                              id={"collapse-2-demo-accordion"}
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
                            value={"collapse-3-demo-accordion"}
                          >
                            {" "}
                            <h2 className={"pn-accordion-header"}>
                              {" "}
                              <WorkspaceAccordionTrigger
                                id={"accordion-button-3-demo-accordion"}
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
                              id={"collapse-3-demo-accordion"}
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
                        </WorkspaceAccordion>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-md-6"}>
                      {" "}
                      <h4>{"Spinners"}</h4>{" "}
                      <div className={"pn-mb-3"}>
                        {" "}
                        <div className={"pn-d-flex pn-flex-wrap pn-gap-2"}>
                          {" "}
                          <div
                            className={"pn-spinner-border pn-text-primary"}
                            role={"status"}
                          ></div>{" "}
                          <div
                            className={
                              "pn-spinner-border pn-text-success pn-spinner-border-sm"
                            }
                            role={"status"}
                          ></div>{" "}
                          <div
                            className={"pn-spinner-grow pn-text-warning"}
                            role={"status"}
                          ></div>{" "}
                          <div
                            className={
                              "pn-spinner-grow pn-text-danger pn-spinner-grow-sm"
                            }
                            role={"status"}
                          ></div>{" "}
                        </div>{" "}
                      </div>{" "}
                      <h4>{"Rating"}</h4>{" "}
                      <div className={"pn-mb-3"}>
                        {" "}
                        <WorkspaceRating
                          id={"rating-demo-rating"}
                          defaultValue={"4"}
                        >
                          <option value={""}>{"Select a rating"}</option>
                          <option value={"5"}>{"Excellent"}</option>
                          <option value={"4"}>{"Very Good"}</option>
                          <option value={"3"}>{"Average"}</option>
                          <option value={"2"}>{"Poor"}</option>
                          <option value={"1"}>{"Terrible"}</option>
                        </WorkspaceRating>{" "}
                      </div>{" "}
                      <h4>{"Steps"}</h4>{" "}
                      <div className={"pn-mb-3"}>
                        {" "}
                        <ol className={"pn-steps"} aria-label={"Progress"}>
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
                          <li className={"pn-step-item"}>
                            {" "}
                            <span>
                              {" "}
                              <span className={"pn-visually-hidden"}>
                                {"Step 4"}
                              </span>{" "}
                            </span>{" "}
                          </li>{" "}
                        </ol>{" "}
                      </div>{" "}
                      <div className={"pn-mb-3"}>
                        {" "}
                        <ol
                          className={"pn-steps pn-steps-counter"}
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
                          <li className={"pn-step-item"}>
                            {" "}
                            <WorkspaceLink href={"#"}>
                              {" "}
                              <span className={"pn-visually-hidden"}>
                                {"Step 2 (completed)"}
                              </span>{" "}
                            </WorkspaceLink>{" "}
                          </li>{" "}
                          <li className={"pn-step-item pn-active"}>
                            {" "}
                            <WorkspaceLink href={"#"} aria-current={"step"}>
                              {" "}
                              <span className={"pn-visually-hidden"}>
                                {"Step 3 (current)"}
                              </span>{" "}
                            </WorkspaceLink>{" "}
                          </li>{" "}
                          <li className={"pn-step-item"}>
                            {" "}
                            <span>
                              {" "}
                              <span className={"pn-visually-hidden"}>
                                {"Step 4"}
                              </span>{" "}
                            </span>{" "}
                          </li>{" "}
                        </ol>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Status Elements"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <h4>{"Status Dots"}</h4>{" "}
                  <div className={"pn-mb-3"}>
                    {" "}
                    <span className={"pn-status-dot pn-status-success"}>
                      <span className={"pn-visually-hidden"}>{"Success"}</span>
                    </span>{" "}
                    <span className={"pn-status-dot pn-status-warning"}>
                      <span className={"pn-visually-hidden"}>{"Warning"}</span>
                    </span>{" "}
                    <span className={"pn-status-dot pn-status-danger"}>
                      <span className={"pn-visually-hidden"}>{"Danger"}</span>
                    </span>{" "}
                    <span
                      className={
                        "pn-status-dot pn-status-info pn-status-dot-animated"
                      }
                    >
                      <span className={"pn-visually-hidden"}>{"Info"}</span>
                    </span>{" "}
                  </div>{" "}
                  <h4>{"Toast Notifications"}</h4>{" "}
                  <div className={"pn-mb-3"}>
                    {" "}
                    <WorkspaceToast
                      className={"pn-toast pn-show"}
                      id={"toast-demo-toast"}
                      role={"alert"}
                      aria-live={"assertive"}
                      aria-atomic={"true"}
                    >
                      {" "}
                      <div className={"pn-toast-header"}>
                        {" "}
                        <span
                          style={
                            {
                              backgroundImage:
                                "url(/assets/overtrue/people/june.svg)",
                            } as CSSProperties
                          }
                          className={"pn-avatar pn-avatar-xs pn-me-2"}
                        ></span>{" "}
                        <strong className={"pn-me-auto"}>
                          {"Ines Duarte"}
                        </strong>{" "}
                        <small>{"11 mins ago"}</small>{" "}
                        <WorkspaceAction
                          type={"button"}
                          className={"pn-ms-2 pn-btn-close"}
                          aria-label={"Close"}
                          action={"dismiss"}
                        ></WorkspaceAction>{" "}
                      </div>{" "}
                      <div className={"pn-toast-body"}>
                        {"This is a sample toast message!"}
                      </div>{" "}
                    </WorkspaceToast>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Enhanced Forms"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <h4>{"Input with Icons"}</h4>{" "}
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-input-icon"}>
                      {" "}
                      <WorkspaceInput
                        type={"text"}
                        defaultValue={""}
                        className={"pn-form-control"}
                        placeholder={"Search..."}
                      />{" "}
                      <span className={"pn-input-icon-addon"}>
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
                            d={"M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"}
                          ></path>{" "}
                          <path d={"M21 21l-6 -6"}></path>
                        </svg>
                      </span>{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-input-icon"}>
                      {" "}
                      <WorkspaceInput
                        type={"text"}
                        defaultValue={""}
                        className={"pn-form-control"}
                        placeholder={"Loading..."}
                      />{" "}
                      <span className={"pn-input-icon-addon"}>
                        <div
                          className={
                            "pn-spinner-border pn-spinner-border-sm pn-text-secondary"
                          }
                          role={"status"}
                        ></div>
                      </span>{" "}
                    </div>{" "}
                  </div>{" "}
                  <h4>{"Input Groups"}</h4>{" "}
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-input-group"}>
                      {" "}
                      <span className={"pn-input-group-text"}>{"@"}</span>{" "}
                      <WorkspaceInput
                        type={"text"}
                        className={"pn-form-control"}
                        placeholder={"Username"}
                      />{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-input-group"}>
                      {" "}
                      <span className={"pn-input-group-text"}>{"$"}</span>{" "}
                      <WorkspaceInput
                        type={"text"}
                        className={"pn-form-control"}
                        placeholder={"Price"}
                      />{" "}
                      <span className={"pn-input-group-text"}>{".00"}</span>{" "}
                    </div>{" "}
                  </div>{" "}
                  <h4>{"Range Slider"}</h4>{" "}
                  <div className={"pn-mb-3"}>
                    {" "}
                    <WorkspaceRange
                      className={"pn-form-range pn-mb-2"}
                      id={"range-demo-range"}
                    />{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Tags & Labels"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <h4>{"Tags"}</h4>{" "}
                  <div className={"pn-tag-list pn-mb-3"}>
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
                          d={
                            "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"
                          }
                        ></path>{" "}
                      </svg>
                      {" Primary Tag "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Primary Tag"}
                      ></WorkspaceButton>{" "}
                    </span>{" "}
                    <span className={"pn-tag"}>
                      {" "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-success pn-text-success-fg pn-badge-dot"
                        }
                      ></WorkspaceBadge>
                      {" Success Tag "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Success Tag"}
                      ></WorkspaceButton>{" "}
                    </span>{" "}
                    <span className={"pn-tag"}>
                      {" "}
                      <WorkspaceBadge
                        className={
                          "pn-badge pn-bg-warning pn-text-warning-fg pn-badge-dot"
                        }
                      ></WorkspaceBadge>
                      {" Warning Tag "}
                      <WorkspaceButton
                        type={"button"}
                        className={"pn-btn-close"}
                        aria-label={"Remove Warning Tag"}
                      ></WorkspaceButton>{" "}
                    </span>{" "}
                  </div>{" "}
                  <h4>{"Ribbons"}</h4>{" "}
                  <div
                    className={"pn-position-relative pn-mb-4"}
                    style={
                      {
                        height: "100px",
                        backgroundColor: "var(--pn-bg-surface-secondary)",
                        borderRadius: "8px",
                      } as CSSProperties
                    }
                  >
                    {" "}
                    <div className={"pn-ribbon pn-bg-success"}>{"New"}</div>{" "}
                  </div>{" "}
                  <div
                    className={"pn-position-relative pn-mb-3"}
                    style={
                      {
                        height: "100px",
                        background: "var(--pn-bg-surface-secondary)",
                        borderRadius: "8px",
                      } as CSSProperties
                    }
                  >
                    {" "}
                    <div className={"pn-ribbon pn-ribbon-top pn-bg-danger"}>
                      {"Sale"}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Media Elements"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <h4>{"Flags"}</h4>{" "}
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-d-flex pn-flex-wrap pn-gap-2"}>
                      {" "}
                      <span
                        className={"pn-flag pn-flag-country-us"}
                        role={"img"}
                        aria-label={"United States"}
                      ></span>{" "}
                      <span
                        className={"pn-flag pn-flag-country-gb"}
                        role={"img"}
                        aria-label={"United Kingdom"}
                      ></span>{" "}
                      <span
                        className={"pn-flag pn-flag-country-de"}
                        role={"img"}
                        aria-label={"Germany"}
                      ></span>{" "}
                      <span
                        className={"pn-flag pn-flag-country-fr"}
                        role={"img"}
                        aria-label={"France"}
                      ></span>{" "}
                      <span
                        className={"pn-flag pn-flag-country-pl"}
                        role={"img"}
                        aria-label={"Poland"}
                      ></span>{" "}
                      <span
                        className={"pn-flag pn-flag-country-es"}
                        role={"img"}
                        aria-label={"Spain"}
                      ></span>{" "}
                      <span
                        className={"pn-flag pn-flag-country-it"}
                        role={"img"}
                        aria-label={"Italy"}
                      ></span>{" "}
                      <span
                        className={"pn-flag pn-flag-country-nl"}
                        role={"img"}
                        aria-label={"Netherlands"}
                      ></span>{" "}
                      <span
                        className={"pn-flag pn-flag-country-ca"}
                        role={"img"}
                        aria-label={"Canada"}
                      ></span>{" "}
                      <span
                        className={"pn-flag pn-flag-country-au"}
                        role={"img"}
                        aria-label={"Australia"}
                      ></span>{" "}
                    </div>{" "}
                  </div>{" "}
                  <h4>{"Payment Icons"}</h4>{" "}
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-d-flex pn-flex-wrap pn-gap-2"}>
                      {" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-visa pn-hide-theme-dark"
                        }
                        role={"img"}
                        aria-label={"Visa"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-visa-dark pn-hide-theme-light"
                        }
                        role={"img"}
                        aria-label={"Visa"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-mastercard pn-hide-theme-dark"
                        }
                        role={"img"}
                        aria-label={"Mastercard"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-mastercard-dark pn-hide-theme-light"
                        }
                        role={"img"}
                        aria-label={"Mastercard"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-paypal pn-hide-theme-dark"
                        }
                        role={"img"}
                        aria-label={"PayPal"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-paypal-dark pn-hide-theme-light"
                        }
                        role={"img"}
                        aria-label={"PayPal"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-americanexpress pn-hide-theme-dark"
                        }
                        role={"img"}
                        aria-label={"American Express"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-americanexpress-dark pn-hide-theme-light"
                        }
                        role={"img"}
                        aria-label={"American Express"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-applepay pn-hide-theme-dark"
                        }
                        role={"img"}
                        aria-label={"Apple Pay"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-applepay-dark pn-hide-theme-light"
                        }
                        role={"img"}
                        aria-label={"Apple Pay"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-google-pay pn-hide-theme-dark"
                        }
                        role={"img"}
                        aria-label={"Google Pay"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-google-pay-dark pn-hide-theme-light"
                        }
                        role={"img"}
                        aria-label={"Google Pay"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-stripe pn-hide-theme-dark"
                        }
                        role={"img"}
                        aria-label={"Stripe"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-stripe-dark pn-hide-theme-light"
                        }
                        role={"img"}
                        aria-label={"Stripe"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-discover pn-hide-theme-dark"
                        }
                        role={"img"}
                        aria-label={"Discover"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-discover-dark pn-hide-theme-light"
                        }
                        role={"img"}
                        aria-label={"Discover"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-jcb pn-hide-theme-dark"
                        }
                        role={"img"}
                        aria-label={"JCB"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-jcb-dark pn-hide-theme-light"
                        }
                        role={"img"}
                        aria-label={"JCB"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-maestro pn-hide-theme-dark"
                        }
                        role={"img"}
                        aria-label={"Maestro"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-maestro-dark pn-hide-theme-light"
                        }
                        role={"img"}
                        aria-label={"Maestro"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-dinersclub pn-hide-theme-dark"
                        }
                        role={"img"}
                        aria-label={"Diners Club"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-dinersclub-dark pn-hide-theme-light"
                        }
                        role={"img"}
                        aria-label={"Diners Club"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-bitcoin pn-hide-theme-dark"
                        }
                        role={"img"}
                        aria-label={"Bitcoin"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-bitcoin-dark pn-hide-theme-light"
                        }
                        role={"img"}
                        aria-label={"Bitcoin"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-ethereum pn-hide-theme-dark"
                        }
                        role={"img"}
                        aria-label={"Ethereum"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-ethereum-dark pn-hide-theme-light"
                        }
                        role={"img"}
                        aria-label={"Ethereum"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-klarna pn-hide-theme-dark"
                        }
                        role={"img"}
                        aria-label={"Klarna"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-klarna-dark pn-hide-theme-light"
                        }
                        role={"img"}
                        aria-label={"Klarna"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-venmo pn-hide-theme-dark"
                        }
                        role={"img"}
                        aria-label={"Venmo"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-venmo-dark pn-hide-theme-light"
                        }
                        role={"img"}
                        aria-label={"Venmo"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-square pn-hide-theme-dark"
                        }
                        role={"img"}
                        aria-label={"Square"}
                      ></span>{" "}
                      <span
                        className={
                          "pn-payment pn-payment-provider-square-dark pn-hide-theme-light"
                        }
                        role={"img"}
                        aria-label={"Square"}
                      ></span>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Timeline"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <ul className={"pn-timeline"}>
                    {" "}
                    <li className={"pn-timeline-event"}>
                      {" "}
                      <div
                        className={"pn-timeline-event-icon pn-bg-x pn-text-x-fg"}
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
                            d={"M4 4l11.733 16h4.267l-11.733 -16l-4.267 0"}
                          ></path>{" "}
                          <path
                            d={"M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"}
                          ></path>{" "}
                        </svg>{" "}
                      </div>{" "}
                      <Card className={"pn-card pn-timeline-event-card"}>
                        {" "}
                        <CardContent className={"pn-card-body"}>
                          {" "}
                          <div className={"pn-text-secondary pn-float-end"}>
                            {"10 hrs ago"}
                          </div>{" "}
                          <h4>{"+1150 Followers"}</h4>{" "}
                          <p className={"pn-text-secondary"}>
                            {
                              "Your team completed six milestones this week."
                            }
                          </p>{" "}
                        </CardContent>{" "}
                      </Card>{" "}
                    </li>{" "}
                    <li className={"pn-timeline-event"}>
                      {" "}
                      <div className={"pn-timeline-event-icon"}>
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
                              "M3 9a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -9"
                            }
                          ></path>{" "}
                          <path
                            d={"M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2"}
                          ></path>{" "}
                          <path d={"M12 12l0 .01"}></path>{" "}
                          <path d={"M3 13a20 20 0 0 0 18 0"}></path>{" "}
                        </svg>{" "}
                      </div>{" "}
                      <Card className={"pn-card pn-timeline-event-card"}>
                        {" "}
                        <CardContent className={"pn-card-body"}>
                          {" "}
                          <div className={"pn-text-secondary pn-float-end"}>
                            {"2 hrs ago"}
                          </div>{" "}
                          <h4>{"+3 New Products were added!"}</h4>{" "}
                          <p className={"pn-text-secondary"}>
                            {"Congratulations!"}
                          </p>{" "}
                        </CardContent>{" "}
                      </Card>{" "}
                    </li>{" "}
                    <li className={"pn-timeline-event"}>
                      {" "}
                      <div className={"pn-timeline-event-icon"}>
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
                        </svg>{" "}
                      </div>{" "}
                      <Card className={"pn-card pn-timeline-event-card"}>
                        {" "}
                        <CardContent className={"pn-card-body"}>
                          {" "}
                          <div className={"pn-text-secondary pn-float-end"}>
                            {"1 day ago"}
                          </div>{" "}
                          <h4>{"Database backup completed!"}</h4>{" "}
                          <p className={"pn-text-secondary"}>
                            {"Download the "}
                            <WorkspaceLink href={"#"}>
                              {"latest backup"}
                            </WorkspaceLink>
                            {"."}
                          </p>{" "}
                        </CardContent>{" "}
                      </Card>{" "}
                    </li>{" "}
                    <li className={"pn-timeline-event"}>
                      {" "}
                      <div
                        className={
                          "pn-timeline-event-icon pn-bg-facebook pn-text-facebook-fg"
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
                              "M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"
                            }
                          ></path>{" "}
                        </svg>{" "}
                      </div>{" "}
                      <Card className={"pn-card pn-timeline-event-card"}>
                        {" "}
                        <CardContent className={"pn-card-body"}>
                          {" "}
                          <div className={"pn-text-secondary pn-float-end"}>
                            {"1 day ago"}
                          </div>{" "}
                          <h4>{"+290 Page Likes"}</h4>{" "}
                          <p className={"pn-text-secondary"}>
                            {"This is great, keep it up!"}
                          </p>{" "}
                        </CardContent>{" "}
                      </Card>{" "}
                    </li>{" "}
                    <li className={"pn-timeline-event"}>
                      {" "}
                      <div className={"pn-timeline-event-icon"}>
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
                          <path d={"M16 19h6"}></path>{" "}
                          <path d={"M19 16v6"}></path>{" "}
                          <path d={"M6 21v-2a4 4 0 0 1 4 -4h4"}></path>{" "}
                        </svg>{" "}
                      </div>{" "}
                      <Card className={"pn-card pn-timeline-event-card"}>
                        {" "}
                        <CardContent className={"pn-card-body"}>
                          {" "}
                          <div className={"pn-text-secondary pn-float-end"}>
                            {"2 days ago"}
                          </div>{" "}
                          <h4>{"+3 Friend Requests"}</h4>{" "}
                          <div className={"pn-avatar-list pn-mt-3"}>
                            {" "}
                            <span
                              style={
                                {
                                  backgroundImage:
                                    "url(/assets/overtrue/people/leo.svg)",
                                } as CSSProperties
                              }
                              className={"pn-avatar"}
                            >
                              <WorkspaceBadge
                                className={"pn-badge pn-bg-success"}
                                aria-label={"Online"}
                              ></WorkspaceBadge>
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
                              <WorkspaceBadge
                                className={"pn-badge pn-bg-success"}
                                aria-label={"Online"}
                              ></WorkspaceBadge>
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
                              <WorkspaceBadge
                                className={"pn-badge pn-bg-success"}
                                aria-label={"Online"}
                              ></WorkspaceBadge>
                            </span>{" "}
                          </div>{" "}
                        </CardContent>{" "}
                      </Card>{" "}
                    </li>{" "}
                    <li className={"pn-timeline-event"}>
                      {" "}
                      <div className={"pn-timeline-event-icon"}>
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
                        </svg>{" "}
                      </div>{" "}
                      <Card className={"pn-card pn-timeline-event-card"}>
                        {" "}
                        <CardContent className={"pn-card-body"}>
                          {" "}
                          <div className={"pn-text-secondary pn-float-end"}>
                            {"3 days ago"}
                          </div>{" "}
                          <h4>{"+3 New photos"}</h4>{" "}
                          <div className={"pn-mt-3"}>
                            {" "}
                            <div className={"pn-row pn-g-2"}>
                              {" "}
                              <div className={"pn-col-4"}>
                                {" "}
                                <img
                                  src={
                                    "/assets/overtrue/project-08.svg"
                                  }
                                  className={"pn-rounded"}
                                  alt={
                                    "Blue sofa with pillows in a designer living room interior"
                                  }
                                />{" "}
                              </div>{" "}
                              <div className={"pn-col-4"}>
                                {" "}
                                <img
                                  src={
                                    "/assets/overtrue/project-12.svg"
                                  }
                                  className={"pn-rounded"}
                                  alt={
                                    "Home office desk with Macbook, iPhone, calendar, watch & organizer"
                                  }
                                />{" "}
                              </div>{" "}
                              <div className={"pn-col-4"}>
                                {" "}
                                <img
                                  src={
                                    "/assets/overtrue/coastal-center.png"
                                  }
                                  className={"pn-rounded"}
                                  alt={"Young woman working in a cafe"}
                                />{" "}
                              </div>{" "}
                            </div>{" "}
                          </div>{" "}
                        </CardContent>{" "}
                      </Card>{" "}
                    </li>{" "}
                    <li className={"pn-timeline-event"}>
                      {" "}
                      <div className={"pn-timeline-event-icon"}>
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
                      </div>{" "}
                      <Card className={"pn-card pn-timeline-event-card"}>
                        {" "}
                        <CardContent className={"pn-card-body"}>
                          {" "}
                          <div className={"pn-text-secondary pn-float-end"}>
                            {"2 weeks ago"}
                          </div>{" "}
                          <h4>{"System updated to v2.02"}</h4>{" "}
                          <p className={"pn-text-secondary"}>
                            {"Check the complete changelog at the "}
                            <WorkspaceLink href={"#"}>
                              {"activity page"}
                            </WorkspaceLink>
                            {"."}
                          </p>{" "}
                        </CardContent>{" "}
                      </Card>{" "}
                    </li>{" "}
                  </ul>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Empty State"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-empty"}>
                    {" "}
                    <div className={"pn-empty-img"}>
                      {" "}
                      <svg
                        xmlns={"http://www.w3.org/2000/svg"}
                        height={"256"}
                        fill={"none"}
                        viewBox={"0 0 800 600"}
                      >
                        {" "}
                        <path
                          d={
                            "M658.744 282.266C658.744 325.973 612.535 357.656 592.114 392.937C571.053 429.346 565.991 484.976 529.581 506.037C494.299 526.458 444.065 503.618 400.367 503.618C356.669 503.618 306.435 526.458 271.153 506.037C234.753 484.976 229.681 429.346 208.62 392.937C188.209 357.656 142 325.953 142 282.266C142 238.579 188.209 206.865 208.62 171.584C229.681 135.185 234.753 79.5143 271.153 58.4839C306.435 38.0736 356.669 60.9031 400.367 60.9031C444.065 60.9031 494.299 38.0736 529.581 58.4839C565.991 79.5448 571.053 135.185 592.114 171.584C612.535 206.865 658.744 238.568 658.744 282.266Z"
                          }
                          fill={"#F7F8FC"}
                          className={"pn-pn-illustrations-boy-girl-a"}
                        ></path>{" "}
                        <path
                          d={
                            "M397.248 550C534.459 550 645.689 545.836 645.689 540.7C645.689 535.564 534.459 531.401 397.248 531.401C260.038 531.401 148.808 535.564 148.808 540.7C148.808 545.836 260.038 550 397.248 550Z"
                          }
                          fill={"#A6A9B3"}
                          className={"pn-pn-illustrations-boy-girl-b"}
                        ></path>{" "}
                        <path
                          d={
                            "M479.179 238.829C475.497 244.691 456.146 274.402 421.211 280.161C408.559 282.198 395.593 280.84 383.637 276.225C376.963 273.704 370.647 270.322 364.85 266.164L373.304 245.592C374.244 246.41 375.7 247.659 377.607 249.049C384.182 253.84 395.868 260.321 407.863 256.273C414.608 254.009 419.323 249.697 428.36 240.849C436.25 233.084 443.39 224.592 449.683 215.486C455.319 205.153 466.977 202.626 474.943 209.512C482.598 215.974 484.609 229.097 479.179 238.829Z"
                          }
                          fill={"#FFCB9D"}
                          style={
                            {
                              fill: "var(--pn-illustrations-skin, #ffcb9d)",
                            } as CSSProperties
                          }
                        ></path>{" "}
                        <path
                          d={
                            "M383.666 276.159C376.992 273.638 370.676 270.256 364.879 266.098L373.333 245.526C374.272 246.344 375.728 247.593 377.635 248.983C377.119 253.445 376.818 260.697 379.035 266.568C380.328 269.88 381.876 273.087 383.666 276.159Z"
                          }
                          fill={"black"}
                          opacity={"0.15"}
                        ></path>{" "}
                        <path
                          d={
                            "M324.054 160.289C332.183 175.733 345.737 187.624 362.107 193.674L307.502 198.718C313.026 185.906 318.543 173.096 324.054 160.289Z"
                          }
                          fill={"#232B41"}
                          className={"pn-pn-illustrations-boy-girl-c"}
                        ></path>{" "}
                        <path
                          d={
                            "M302.083 425.902L299.434 457.398L295.601 503.211H291.872L282.206 455.679L278.073 435.333L302.083 425.902ZM355.701 425.902L353.221 455.548L349.229 503.211H345.5L336.153 457.314L331.682 435.333L355.701 425.902Z"
                          }
                          fill={"#DADBE0"}
                        ></path>{" "}
                        <path
                          d={
                            "M278.063 435.333L302.083 425.939L299.434 457.436C293.46 457.051 287.692 456.496 282.206 455.717L278.063 435.333ZM355.701 425.902L353.212 455.548C347.782 456.318 342.071 456.91 336.153 457.314L331.682 435.333L355.701 425.902Z"
                          }
                          fill={"black"}
                          opacity={"0.15"}
                        ></path>{" "}
                        <path
                          d={
                            "M318.108 202.692C302.571 204.392 285.231 199.874 278.063 195.017C276.833 194.294 275.8 193.278 275.057 192.058C274.278 190.508 273.592 188.902 272.916 187.202C271.976 184.872 271.169 182.449 270.445 180.025C268.518 173.72 267.17 167.252 266.415 160.703C266.415 160.167 266.218 158.57 266.021 156.72C265.345 148.425 265.006 141.69 264.809 137.069C265.204 137.745 267.139 140.901 268.886 140.61C270.765 140.225 272.333 136.092 271.901 130.174H307.136L321.847 142.893C321.847 142.893 322.279 144.931 323.199 148.031C324.69 153.477 326.558 158.813 328.789 164C330.667 168.321 332.912 172.304 335.364 174.727C343.49 182.468 336.745 200.747 318.108 202.692Z"
                          }
                          fill={"#FFCB9D"}
                          style={
                            {
                              fill: "var(--pn-illustrations-skin, #ffcb9d)",
                            } as CSSProperties
                          }
                        ></path>{" "}
                        <path
                          d={
                            "M328.788 164C315.373 168.775 300.746 168.931 287.231 164.441C283.781 164.927 280.531 166.354 277.838 168.565C273.855 171.919 273.958 175.018 270.755 179.584L270.464 180.025C268.537 173.72 267.188 167.252 266.434 160.703C266.434 160.167 266.237 158.57 266.039 156.72C265.363 148.425 265.025 141.69 264.828 137.069C265.222 137.745 267.157 140.901 268.904 140.61C270.783 140.225 272.352 136.092 271.92 130.174H307.155L321.865 142.893C321.865 142.893 322.297 144.931 323.218 148.031C324.703 153.476 326.564 158.812 328.788 164Z"
                          }
                          fill={"black"}
                          opacity={"0.1"}
                        ></path>{" "}
                        <path
                          d={
                            "M353.502 268.466C356.893 286.755 359.298 300.197 360.951 309.666C361.045 310.192 361.13 310.718 361.224 311.244C363.196 322.244 365.225 333.253 367.198 344.272C330.2 344.935 293.193 345.649 256.176 346.413C256.232 343.868 256.27 341.238 256.335 338.673V338.542C255.228 310.418 255.658 282.255 257.622 254.178C257.763 252.102 257.913 250.045 258.083 247.978L252.54 260.923L230.334 247.772C231.132 244.258 233.922 233.681 242.132 226.448C242.132 226.448 249.581 219.967 257.895 218.792C258.667 218.721 259.432 218.596 260.187 218.417C260.319 218.382 260.454 218.357 260.591 218.342C265.334 217.665 269.928 217.055 274.249 216.726C284.754 215.813 295.312 215.656 305.839 216.256C315.93 216.869 325.952 218.314 335.805 220.577C338.285 221.169 340.868 221.845 343.32 222.653L345.405 223.358C345.668 223.442 345.922 223.517 346.166 223.611L347.537 224.109C349.097 224.71 364.606 229.229 368.006 230.271C371.821 231.512 375.321 233.566 378.264 236.293L364.089 275.464L353.502 268.466Z"
                          }
                          fill={"#0455A4"}
                          style={
                            {
                              fill: "var(--pn-illustrations-primary, var(--pn-primary, #0455a4))",
                            } as CSSProperties
                          }
                        ></path>{" "}
                        <path
                          d={
                            "M271.554 222.127C271.554 233.832 285.644 243.3 303.069 243.3C320.494 243.3 334.519 233.832 334.519 222.127C334.52 221.496 334.457 220.867 334.331 220.249C324.476 217.949 314.441 216.504 304.337 215.927C293.815 215.329 283.263 215.495 272.765 216.425C271.953 218.216 271.539 220.161 271.554 222.127Z"
                          }
                          fill={"#FFCB9D"}
                          style={
                            {
                              fill: "var(--pn-illustrations-skin, #ffcb9d)",
                            } as CSSProperties
                          }
                        ></path>{" "}
                        <path
                          d={
                            "M337.524 142.451C335.044 147.89 329.361 151.845 328.591 152.361C312.133 163.511 287.334 150.849 280.684 147.063C279.03 151.572 274.756 154.973 274.221 157.744C274.08 158.57 273.939 159.397 273.836 160.167C273.671 161.504 273.593 162.85 273.601 164.197C273.65 166.483 273.908 168.759 274.371 170.998C275.188 174.887 278.664 185.22 284.347 198.681C276.388 199.207 268.422 199.742 260.45 200.287L241.108 201.583C238.404 192.37 237.788 182.669 239.305 173.187C239.446 172.341 239.671 171.101 240.009 169.551C240.72 166.396 241.662 163.297 242.827 160.28C243.034 159.754 243.26 159.209 243.485 158.664C245.146 154.767 247.194 151.047 249.6 147.561C255.842 138.551 264.069 131.095 273.648 125.768C276.945 124.04 298.071 113.19 319.563 120.808C324.908 122.687 337.618 127.262 338.689 136.148C338.907 138.317 338.503 140.503 337.524 142.451ZM291.204 514.539C285.803 516.324 285.718 525.182 285.718 525.182L284.253 534.219L294.68 536.68L297.658 529.578L316.905 536.68C312.885 527.38 296.615 512.764 291.204 514.539ZM368.72 536.68C364.69 527.38 348.42 512.764 343.019 514.539C337.618 516.315 337.524 525.182 337.524 525.182L336.068 534.219L346.476 536.68L349.454 529.578L368.72 536.68Z"
                          }
                          fill={"#232B41"}
                          className={"pn-pn-illustrations-boy-girl-c"}
                        ></path>{" "}
                        <path
                          d={
                            "M337.524 142.451C335.044 147.89 329.371 151.845 328.591 152.352C312.133 163.521 287.335 150.849 280.684 147.063C278.366 144.912 276.281 142.523 274.465 139.934C283.982 145.468 294.71 148.587 305.711 149.018C316.712 149.448 327.651 147.178 337.571 142.404L337.524 142.451Z"
                          }
                          fill={"black"}
                          opacity={"0.3"}
                        ></path>{" "}
                        <path
                          d={
                            "M373.051 435.333H258.947L256.956 371.738L256.176 346.423L367.199 344.262L371.942 418.002L373.051 435.333Z"
                          }
                          fill={"#A6A9B3"}
                        ></path>{" "}
                        <path
                          d={
                            "M373.05 435.333H258.947L257.632 345.615L313.392 345.249C292.67 386.214 286.602 401.469 288.274 402.85C290.566 404.729 306.121 379.122 314.003 383.527C316.868 385.134 317.168 389.849 317.985 393.005C320.531 402.756 332.226 413.455 371.942 418.002L373.05 435.333Z"
                          }
                          fill={"black"}
                          opacity={"0.1"}
                        ></path>{" "}
                        <path
                          d={
                            "M346.241 223.63H346.194L345.433 223.386C342.371 236.997 324.552 247.48 303.087 247.48C279.425 247.48 260.177 234.799 260.177 219.225V218.436C259.454 218.548 258.693 218.67 257.904 218.821C257.895 218.955 257.895 219.09 257.904 219.225C257.904 236.283 278.166 250.223 303.087 250.223C325.51 250.223 344.156 238.951 347.603 224.194L346.241 223.63Z"
                          }
                          fill={"#E1E1E1"}
                        ></path>{" "}
                        <path
                          d={
                            "M307.502 263.853C309.411 263.853 310.959 262.011 310.959 259.739C310.959 257.467 309.411 255.625 307.502 255.625C305.593 255.625 304.045 257.467 304.045 259.739C304.045 262.011 305.593 263.853 307.502 263.853Z"
                          }
                          fill={"#E1E1E1"}
                        ></path>{" "}
                        <path
                          d={
                            "M260.404 200.315L241.063 201.612C238.358 192.398 237.742 182.697 239.259 173.215C239.4 172.37 239.625 171.13 239.964 169.58L242.782 160.308C242.988 159.782 243.214 159.237 243.439 158.693C245.1 154.796 247.148 151.076 249.554 147.589C248.615 159.989 248.474 177.273 253.744 188.263C255.706 192.418 257.931 196.443 260.404 200.315Z"
                          }
                          fill={"black"}
                          opacity={"0.3"}
                        ></path>{" "}
                        <path
                          d={
                            "M367.199 344.272C330.201 344.935 293.193 345.649 256.176 346.413C256.233 343.868 256.27 341.238 256.336 338.673V338.542C315.929 341.501 350.957 319.557 361.224 311.244C363.197 322.244 365.264 333.253 367.199 344.272Z"
                          }
                          fill={"black"}
                          opacity={"0.1"}
                        ></path>{" "}
                        <path
                          d={
                            "M280.017 380.052C274.531 389.041 263.503 391.437 255.35 384.965C250.399 380.597 225.45 357.564 220.594 316.006C218.13 294.148 221.708 272.032 230.936 252.064C231.509 250.843 232.007 249.829 232.429 249.002L249.723 259.119C249.103 260.124 248.173 261.674 247.13 263.637C243.063 271.34 237.267 285.609 240.743 300.272C242.621 308.276 246.266 313.912 253.706 324.695C259.993 333.807 267.133 342.299 275.029 350.058C283.671 356.662 285.804 370.564 280.017 380.052Z"
                          }
                          fill={"#FFCB9D"}
                          style={
                            {
                              fill: "var(--pn-illustrations-skin, #ffcb9d)",
                            } as CSSProperties
                          }
                        ></path>{" "}
                        <path
                          d={
                            "M249.723 259.119C249.103 260.124 248.173 261.674 247.13 263.637C242.33 260.274 234.862 255.005 230.926 252.064C231.499 250.843 231.997 249.829 232.42 249.002L249.723 259.119Z"
                          }
                          fill={"black"}
                          opacity={"0.15"}
                        ></path>{" "}
                        <path
                          d={
                            "M304.337 215.899C293.815 215.301 283.264 215.467 272.766 216.397C271.949 218.196 271.536 220.152 271.554 222.127C271.554 233.832 285.644 243.3 303.069 243.3C320.494 243.3 334.519 233.832 334.519 222.127C334.52 221.496 334.457 220.867 334.331 220.248C324.477 217.94 314.442 216.485 304.337 215.899Z"
                          }
                          fill={"black"}
                          opacity={"0.07"}
                        ></path>{" "}
                        <path
                          d={
                            "M445.325 188.01C446.283 199.188 447.25 210.351 448.227 221.498L453.863 286.182C455.329 302.909 456.785 319.645 458.231 336.39H543.713C545.372 319.639 547.038 302.902 548.71 286.182C549.668 276.701 550.608 267.223 551.528 257.748C553.852 234.489 556.162 211.243 558.461 188.01H445.325Z"
                          }
                          fill={"#DADBE0"}
                        ></path>{" "}
                        <path
                          d={
                            "M555.464 217.844C547.072 224.328 539.267 231.538 532.14 239.393C515.429 257.766 513.109 267.62 505.171 271.03C495.956 274.994 479.809 269.997 449.542 228.045L453.995 288.474H454.042C455.445 304.443 456.835 320.412 458.213 336.381H543.694C545.354 319.642 547.019 302.909 548.692 286.182H549.058L555.464 217.844Z"
                          }
                          fill={"black"}
                          opacity={"0.1"}
                        ></path>{" "}
                        <path
                          d={
                            "M420.385 276.76C422.47 282.504 425.273 287.961 428.727 293.002C429.744 294.46 430.829 295.871 431.977 297.229C436.998 303.248 443.375 307.99 450.585 311.065C454.275 312.632 458.128 313.779 462.074 314.485C467.561 315.468 473.147 315.784 478.71 315.424C479.17 315.424 479.649 315.377 480.072 315.34C480.247 315.35 480.423 315.35 480.598 315.34L481.631 315.255L482.12 315.208H482.458C486.709 314.762 490.926 314.037 495.083 313.038H495.148C498.827 312.155 502.453 311.064 506.007 309.769C507.604 309.215 509.145 308.604 510.62 307.956C512.674 307.067 514.615 306.128 516.444 305.138C519.749 303.381 522.934 301.407 525.978 299.23C527.35 298.243 528.608 297.294 529.736 296.411C522.502 293.161 515.26 289.892 508.018 286.661C503.784 284.782 499.557 282.882 495.336 280.959C493.604 282.328 491.712 283.479 489.7 284.388C488.168 285.069 486.55 285.537 484.891 285.778C483.818 285.965 482.727 286.028 481.64 285.966C478.4 285.778 475.347 284.181 472.51 281.617C472.363 281.502 472.225 281.376 472.097 281.241C470.798 280.007 469.592 278.679 468.489 277.267C456.841 262.407 449.702 233.681 449.702 233.681C452.924 222.879 453.119 211.399 450.266 200.494C449.097 196.178 447.436 192.011 445.316 188.076C440.947 188.898 436.792 190.601 433.104 193.082C431.175 194.4 429.398 195.928 427.806 197.638C412.607 213.861 410.268 249.528 420.385 276.76Z"
                          }
                          fill={"#DADBE0"}
                        ></path>{" "}
                        <path
                          d={
                            "M445.325 188.01C438.625 189.246 432.498 192.598 427.844 197.572C412.607 213.861 410.268 249.528 420.385 276.76C422.47 282.504 425.273 287.961 428.727 293.002C429.744 294.46 430.828 295.871 431.977 297.229C436.998 303.248 443.375 307.99 450.585 311.065C452.425 311.844 454.306 312.518 456.221 313.085L458.26 336.39H543.741C545.401 319.639 547.067 302.902 548.739 286.182C549.697 276.694 550.636 267.216 551.557 257.748C553.861 234.489 556.163 211.243 558.461 188.01H445.325Z"
                          }
                          fill={"black"}
                          opacity={"0.05"}
                        ></path>{" "}
                        <path
                          d={
                            "M540.181 104.661C540.002 109.282 539.636 116.055 538.95 124.387C538.762 126.266 538.621 127.816 538.584 128.37C537.518 137.473 535.309 146.404 532.008 154.954C531.322 156.654 530.637 158.251 529.857 159.81C526.973 165.578 505.434 172.529 486.703 170.472C467.972 168.415 461.256 150.201 469.353 142.413C471.824 139.99 474.116 136.007 475.994 131.667C478.228 126.463 480.092 121.108 481.574 115.642C482.513 112.533 482.946 110.475 482.946 110.475L497.712 97.7471H533.041C532.628 103.703 534.187 107.817 536.057 108.183C537.926 108.55 539.767 105.346 540.181 104.661Z"
                          }
                          fill={"#FFCB9D"}
                          style={
                            {
                              fill: "var(--pn-illustrations-skin, #ffcb9d)",
                            } as CSSProperties
                          }
                        ></path>{" "}
                        <path
                          d={
                            "M540.181 104.661C540.002 109.282 539.636 116.055 538.95 124.387C538.762 126.266 538.621 127.816 538.584 128.37C537.519 137.473 535.309 146.404 532.008 154.954C529.719 154.235 527.589 153.083 525.734 151.563C523.719 149.859 522.057 147.779 520.839 145.438C519.612 142.93 518.785 140.246 518.388 137.482C518.04 135.703 517.795 133.906 517.655 132.099C504.109 136.607 489.444 136.455 475.995 131.667C478.228 126.463 480.092 121.108 481.574 115.642C482.514 112.533 482.946 110.475 482.946 110.475L497.713 97.7471H533.042C532.628 103.703 534.188 107.817 536.057 108.183C537.926 108.55 539.768 105.346 540.181 104.661Z"
                          }
                          fill={"black"}
                          opacity={"0.1"}
                        ></path>{" "}
                        <path
                          d={
                            "M544.53 112.213C544.324 119.897 540.998 127.365 536.32 131.846C535.242 132.734 534.228 133.698 533.286 134.73C530.89 137.732 529.277 141.283 528.589 145.062C526.945 143.089 525.93 140.668 525.677 138.111C525.433 134.213 527.105 127.027 527.19 126.022C527.19 126.022 527.19 125.749 527.274 125.43C527.274 124.876 527.359 124.65 527.434 123.786C527.564 121.91 527.564 120.026 527.434 118.15C527.455 118.06 527.455 117.967 527.434 117.877C518.491 123.326 493.007 136.599 475.854 123.514C473.188 121.482 470.828 119.078 468.846 116.375C468.641 116.159 468.473 115.912 468.349 115.642C467.865 114.969 467.426 114.267 467.033 113.538C466.996 113.476 466.955 113.416 466.911 113.359V113.312C465.865 111.449 465.141 109.423 464.77 107.319L464.638 106.492C464.561 105.555 464.561 104.612 464.638 103.674C465.122 100.035 466.851 96.6762 469.532 94.1681C474.501 89.2271 481.838 86.2963 485.698 84.7746C500.728 78.7345 523.489 77.2597 536.424 90.8616C539.662 94.4155 542.023 98.678 543.319 103.308C544.136 106.205 544.544 109.203 544.53 112.213Z"
                          }
                          fill={"#232B41"}
                          className={"pn-pn-illustrations-boy-girl-c"}
                        ></path>{" "}
                        <path
                          d={
                            "M527.378 117.887C518.435 123.335 492.95 136.608 475.798 123.523C473.131 121.492 470.771 119.087 468.79 116.384C468.585 116.169 468.417 115.921 468.292 115.651C467.809 114.979 467.37 114.276 466.977 113.547C466.94 113.485 466.899 113.426 466.855 113.369V113.322C465.828 111.452 465.123 109.423 464.77 107.319C468.771 111.224 473.388 114.442 478.437 116.844C503.452 128.586 529.679 113.951 533.859 111.621L534.179 111.433C532.074 113.75 529.801 115.907 527.378 117.887Z"
                          }
                          fill={"black"}
                          opacity={"0.3"}
                        ></path>{" "}
                        <path
                          d={
                            "M543.657 336.39L536.311 514.22H521.873L501.893 376.83L488.178 514.22H477.479L458.213 336.39H543.657Z"
                          }
                          fill={"#0455A4"}
                          style={
                            {
                              fill: "var(--pn-illustrations-primary, var(--pn-primary, #0455a4))",
                            } as CSSProperties
                          }
                        ></path>{" "}
                        <path
                          d={
                            "M505.697 538.906L537.926 535.318C537.926 535.318 539.091 526.967 534.037 524.046C528.984 521.124 510.967 531.081 505.697 538.906ZM458.26 538.906L490.479 535.318C490.479 535.318 491.644 526.967 486.6 524.046C481.556 521.124 463.473 531.081 458.26 538.906ZM420.385 276.76C422.47 282.504 425.272 287.961 428.726 293.002C434.133 300.991 441.72 307.26 450.585 311.065C451.487 303.348 449.862 295.547 445.954 288.831C439.472 277.634 428.754 272.852 420.385 276.76Z"
                          }
                          fill={"#232B41"}
                          className={"pn-pn-illustrations-boy-girl-c"}
                        ></path>{" "}
                        <path
                          d={
                            "M513.447 185.699C505.434 193.674 497.788 196.624 491.964 197.694L491.024 197.864L478.165 187.756L513.447 185.699Z"
                          }
                          fill={"#E1E1E1"}
                        ></path>{" "}
                        <path
                          d={
                            "M450.867 241.44C454.744 254.128 458.629 266.812 462.525 279.494C469.157 287.839 476.911 295.226 485.567 301.446C499.357 311.235 521.995 322.187 542.238 321.474C552.74 321.126 562.594 317.632 570.231 309.262C576.534 302.32 579.559 294.054 582.555 282.518C583.298 279.653 584.049 276.6 584.838 273.303C586.999 264.379 593.424 236.546 584.575 211.588C581.353 202.523 577.69 198.211 575.651 196.154C573.275 193.74 570.476 191.782 567.394 190.377C564.57 189.104 561.548 188.323 558.461 188.066C558.301 188.93 558.085 190.18 557.841 191.683C557.08 196.379 556.592 200.362 556.282 203.105C556.188 203.979 556.037 205.35 555.887 207.013C555.53 210.77 555.27 214.393 555.107 217.881C555.029 225.279 553.997 232.635 552.036 239.768C550.243 246.356 547.577 252.675 544.108 258.555C535.992 262.148 527.347 264.4 518.51 265.225C486.168 268.165 461.285 250.148 450.867 241.44Z"
                          }
                          fill={"#DADBE0"}
                        ></path>{" "}
                        <path
                          d={
                            "M542.238 321.492C552.74 321.145 562.594 317.65 570.231 309.281C576.534 302.339 579.558 294.073 582.555 282.537C575.547 283.683 567.469 287.741 559.898 294.458C550.861 302.433 544.586 312.475 542.238 321.492Z"
                          }
                          fill={"#232B41"}
                          className={"pn-pn-illustrations-boy-girl-c"}
                        ></path>{" "}
                        <path
                          d={
                            "M488.178 514.22L501.893 376.83L495.778 336.39H458.213L477.479 514.22H488.178Z"
                          }
                          fill={"black"}
                          opacity={"0.22"}
                        ></path>{" "}
                        <path
                          d={
                            "M494.801 195.468L473.956 180.495L469.194 185.539L483.359 206.694L494.801 195.468ZM495.778 195.318L527.368 175.629L534.582 182.261L513.118 210.075L495.778 195.318Z"
                          }
                          fill={"#0455A4"}
                          style={
                            {
                              fill: "var(--pn-illustrations-primary, var(--pn-primary, #0455a4))",
                            } as CSSProperties
                          }
                        ></path>{" "}
                        <path
                          d={
                            "M494.801 195.468L473.956 180.495L469.194 185.539L483.359 206.694L494.801 195.468Z"
                          }
                          fill={"black"}
                          opacity={"0.22"}
                        ></path>{" "}
                      </svg>{" "}
                    </div>{" "}
                    <p className={"pn-empty-title"}>{"No data found"}</p>{" "}
                    <p className={"pn-empty-subtitle pn-text-secondary"}>
                      {
                        "Try adjusting your search or filter to find what you're looking for."
                      }
                    </p>{" "}
                    <div className={"pn-empty-action"}>
                      {" "}
                      <WorkspaceButton
                        href={"/#/"}
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
                          {" "}
                          <path d={"M12 5l0 14"}></path>{" "}
                          <path d={"M5 12l14 0"}></path>
                        </svg>
                        {"Add new item"}
                      </WorkspaceButton>{" "}
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
                    {"Modals"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-btn-list"}>
                    {" "}
                    <WorkspaceAction
                      className={"pn-btn"}
                      target={"#modal-demo"}
                      action={"open"}
                    >
                      {"Open Modal"}
                    </WorkspaceAction>{" "}
                    <WorkspaceAction
                      className={"pn-btn"}
                      target={"#modal-success"}
                      action={"open"}
                    >
                      {"Success Modal"}
                    </WorkspaceAction>{" "}
                  </div>{" "}
                  <WorkspaceModal
                    title="Project access"
                    className={"pn-modal pn-modal-blur pn-fade"}
                    id={"modal-demo"}
                    tabIndex={-1}
                    role={"dialog"}
                    aria-hidden={"true"}
                  >
                    {" "}
                    <div
                      className={"pn-modal-dialog pn-modal-dialog-centered"}
                      role={"document"}
                    >
                      {" "}
                      <div className={"pn-modal-content"}>
                        {" "}
                        <div className={"pn-modal-header"}>
                          {" "}
                          <h5 className={"pn-modal-title"}>
                            {"Project access"}
                          </h5>{" "}
                          <WorkspaceAction
                            type={"button"}
                            className={"pn-btn-close"}
                            aria-label={"Close"}
                            action={"dismiss"}
                          ></WorkspaceAction>{" "}
                        </div>{" "}
                        <div className={"pn-modal-body"}>
                          {" "}
                          <p>
                            {
                              "Manage collaborators and access levels from your workspace settings."
                            }
                          </p>{" "}
                        </div>{" "}
                        <div className={"pn-modal-footer"}>
                          {" "}
                          <WorkspaceAction
                            type={"button"}
                            className={"pn-btn"}
                            action={"dismiss"}
                          >
                            {"Cancel"}
                          </WorkspaceAction>{" "}
                          <WorkspaceButton
                            className={"pn-btn pn-btn-primary"}
                            href="/#/settings"
                          >
                            {"Open settings"}
                          </WorkspaceButton>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                  </WorkspaceModal>{" "}
                  <WorkspaceModal
                    title="Changes saved"
                    className={"pn-modal pn-modal-blur pn-fade"}
                    id={"modal-success"}
                    tabIndex={-1}
                    role={"dialog"}
                    aria-hidden={"true"}
                  >
                    {" "}
                    <div
                      className={
                        "pn-modal-dialog pn-modal-sm pn-modal-dialog-centered"
                      }
                      role={"document"}
                    >
                      {" "}
                      <div className={"pn-modal-content"}>
                        {" "}
                        <div className={"pn-modal-body pn-text-center pn-py-4"}>
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
                            className={
                              "pn-icon pn-mb-2 pn-text-success pn-icon-lg"
                            }
                          >
                            {" "}
                            <path
                              d={"M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"}
                            ></path>{" "}
                            <path d={"M9 12l2 2l4 -4"}></path>{" "}
                          </svg>{" "}
                          <h3>{"Changes saved"}</h3>{" "}
                          <div className={"pn-text-secondary"}>
                            {"Your workspace preferences are up to date."}
                          </div>{" "}
                        </div>{" "}
                        <div className={"pn-modal-footer"}>
                          {" "}
                          <div className={"pn-w-100"}>
                            {" "}
                            <div className={"pn-row"}>
                              {" "}
                              <div className={"pn-col"}>
                                {" "}
                                <WorkspaceAction
                                  className={"pn-btn pn-w-100"}
                                  action={"dismiss"}
                                >
                                  {"Cancel"}
                                </WorkspaceAction>{" "}
                              </div>{" "}
                              <div className={"pn-col"}>
                                {" "}
                                <WorkspaceAction
                                  className={"pn-btn pn-btn-success pn-w-100"}
                                  action={"dismiss"}
                                >
                                  {"OK"}
                                </WorkspaceAction>{" "}
                              </div>{" "}
                            </div>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                  </WorkspaceModal>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Button Groups"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <h4>{"Basic Button Group"}</h4>{" "}
                  <div className={"pn-btn-group pn-mb-3"} role={"group"}>
                    {" "}
                    <WorkspaceButton type={"button"} className={"pn-btn"}>
                      {"Left"}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton type={"button"} className={"pn-btn"}>
                      {"Middle"}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton type={"button"} className={"pn-btn"}>
                      {"Right"}
                    </WorkspaceButton>{" "}
                  </div>{" "}
                  <h4>{"Button Toolbar"}</h4>{" "}
                  <div className={"pn-btn-toolbar pn-mb-3"} role={"toolbar"}>
                    {" "}
                    <div className={"pn-btn-group pn-me-2"} role={"group"}>
                      {" "}
                      <WorkspaceButton type={"button"} className={"pn-btn"}>
                        {"1"}
                      </WorkspaceButton>{" "}
                      <WorkspaceButton type={"button"} className={"pn-btn"}>
                        {"2"}
                      </WorkspaceButton>{" "}
                      <WorkspaceButton type={"button"} className={"pn-btn"}>
                        {"3"}
                      </WorkspaceButton>{" "}
                    </div>{" "}
                    <div className={"pn-btn-group"} role={"group"}>
                      {" "}
                      <WorkspaceButton type={"button"} className={"pn-btn"}>
                        {"4"}
                      </WorkspaceButton>{" "}
                      <WorkspaceButton type={"button"} className={"pn-btn"}>
                        {"5"}
                      </WorkspaceButton>{" "}
                    </div>{" "}
                  </div>{" "}
                  <h4>{"Vertical Button Group"}</h4>{" "}
                  <div className={"pn-btn-group-vertical"} role={"group"}>
                    {" "}
                    <WorkspaceButton type={"button"} className={"pn-btn"}>
                      {"Top"}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton type={"button"} className={"pn-btn"}>
                      {"Middle"}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton type={"button"} className={"pn-btn"}>
                      {"Bottom"}
                    </WorkspaceButton>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Segmented Navigation"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <h4>{"Basic Segmented"}</h4>{" "}
                  <div className={"pn-mb-3"}>
                    {" "}
                    <nav className={"pn-nav pn-nav-segmented"} role={"tablist"}>
                      {" "}
                      <WorkspaceTab
                        className={"pn-nav-link pn-active"}
                        data-workspace-group={"tab-group-3"}
                        target={"#"}
                        group={"tab-group-3"}
                      >
                        {"Home"}
                      </WorkspaceTab>{" "}
                      <WorkspaceTab
                        className={"pn-nav-link"}
                        data-workspace-group={"tab-group-3"}
                        target={"#"}
                        group={"tab-group-3"}
                      >
                        {"Profile"}
                      </WorkspaceTab>{" "}
                      <WorkspaceTab
                        className={"pn-nav-link"}
                        data-workspace-group={"tab-group-3"}
                        target={"#"}
                        group={"tab-group-3"}
                      >
                        {"Settings"}
                      </WorkspaceTab>{" "}
                    </nav>{" "}
                  </div>{" "}
                  <h4>{"With Icons"}</h4>{" "}
                  <div className={"pn-mb-3"}>
                    {" "}
                    <nav className={"pn-nav pn-nav-segmented"} role={"tablist"}>
                      {" "}
                      <WorkspaceTab
                        aria-label={"Home"}
                        className={"pn-nav-link pn-active"}
                        data-workspace-group={"tab-group-4"}
                        target={"#"}
                        group={"tab-group-4"}
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
                          className={"pn-icon pn-nav-link-icon"}
                        >
                          {" "}
                          <path d={"M5 12l-2 0l9 -9l9 9l-2 0"}></path>{" "}
                          <path
                            d={"M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"}
                          ></path>{" "}
                          <path
                            d={"M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"}
                          ></path>{" "}
                        </svg>{" "}
                      </WorkspaceTab>{" "}
                      <WorkspaceTab
                        aria-label={"User"}
                        className={"pn-nav-link"}
                        data-workspace-group={"tab-group-4"}
                        target={"#"}
                        group={"tab-group-4"}
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
                          className={"pn-icon pn-nav-link-icon"}
                        >
                          {" "}
                          <path
                            d={"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"}
                          ></path>{" "}
                          <path
                            d={"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                          ></path>{" "}
                        </svg>{" "}
                      </WorkspaceTab>{" "}
                      <WorkspaceTab
                        aria-label={"Settings"}
                        className={"pn-nav-link"}
                        data-workspace-group={"tab-group-4"}
                        target={"#"}
                        group={"tab-group-4"}
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
                          className={"pn-icon pn-nav-link-icon"}
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
                    </nav>{" "}
                  </div>{" "}
                  <h4>{"With Emojis"}</h4>{" "}
                  <div className={"pn-mb-3"}>
                    {" "}
                    <nav className={"pn-nav pn-nav-segmented"} role={"tablist"}>
                      {" "}
                      <WorkspaceTab
                        className={"pn-nav-link pn-active"}
                        data-workspace-group={"tab-group-5"}
                        target={"#"}
                        group={"tab-group-5"}
                      >
                        {"👦"}
                      </WorkspaceTab>{" "}
                      <WorkspaceTab
                        className={"pn-nav-link"}
                        data-workspace-group={"tab-group-5"}
                        target={"#"}
                        group={"tab-group-5"}
                      >
                        {"👦🏿"}
                      </WorkspaceTab>{" "}
                      <WorkspaceTab
                        className={"pn-nav-link"}
                        data-workspace-group={"tab-group-5"}
                        target={"#"}
                        group={"tab-group-5"}
                      >
                        {"👦🏾"}
                      </WorkspaceTab>{" "}
                      <WorkspaceTab
                        className={"pn-nav-link"}
                        data-workspace-group={"tab-group-5"}
                        target={"#"}
                        group={"tab-group-5"}
                      >
                        {"👦🏽"}
                      </WorkspaceTab>{" "}
                      <WorkspaceTab
                        className={"pn-nav-link"}
                        data-workspace-group={"tab-group-5"}
                        target={"#"}
                        group={"tab-group-5"}
                      >
                        {"👦🏼"}
                      </WorkspaceTab>{" "}
                      <WorkspaceTab
                        className={"pn-nav-link"}
                        data-workspace-group={"tab-group-5"}
                        target={"#"}
                        group={"tab-group-5"}
                      >
                        {"👦🏻"}
                      </WorkspaceTab>{" "}
                    </nav>{" "}
                  </div>{" "}
                  <h4>{"With Icons and Text"}</h4>{" "}
                  <div className={"pn-mb-3"}>
                    {" "}
                    <nav className={"pn-nav pn-nav-segmented"} role={"tablist"}>
                      {" "}
                      <WorkspaceTab
                        className={"pn-nav-link pn-active"}
                        data-workspace-group={"tab-group-6"}
                        target={"#"}
                        group={"tab-group-6"}
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
                          className={"pn-icon pn-nav-link-icon"}
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
                        {"Home "}
                      </WorkspaceTab>{" "}
                      <WorkspaceTab
                        className={"pn-nav-link"}
                        data-workspace-group={"tab-group-6"}
                        target={"#"}
                        group={"tab-group-6"}
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
                          className={"pn-icon pn-nav-link-icon"}
                        >
                          {" "}
                          <path
                            d={"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"}
                          ></path>{" "}
                          <path
                            d={"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                          ></path>
                        </svg>
                        {"Profile "}
                      </WorkspaceTab>{" "}
                      <WorkspaceTab
                        className={"pn-nav-link"}
                        data-workspace-group={"tab-group-6"}
                        target={"#"}
                        group={"tab-group-6"}
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
                          className={"pn-icon pn-nav-link-icon"}
                        >
                          {" "}
                          <path
                            d={
                              "M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065"
                            }
                          ></path>{" "}
                          <path d={"M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"}></path>
                        </svg>
                        {"Settings "}
                      </WorkspaceTab>{" "}
                    </nav>{" "}
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
                    {"Collapse"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-row"}>
                    {" "}
                    <div className={"pn-col-md-6"}>
                      {" "}
                      <h4>{"Basic Collapse"}</h4>{" "}
                      <WorkspaceAction
                        className={"pn-btn"}
                        type={"button"}
                        target={"#collapseExample"}
                        action={"collapse"}
                      >
                        {"Toggle Collapse"}
                      </WorkspaceAction>{" "}
                      <WorkspaceCollapse
                        className={"pn-collapse"}
                        id={"collapseExample"}
                      >
                        {" "}
                        <Card className={"pn-card pn-card-body"}>
                          {
                            "The project includes discovery, concept development, and a final handover. Open each stage to review the agreed deliverables."
                          }
                        </Card>{" "}
                      </WorkspaceCollapse>{" "}
                    </div>{" "}
                    <div className={"pn-col-md-6"}>
                      {" "}
                      <h4>{"Multiple Targets"}</h4>{" "}
                      <div className={"pn-btn-list"}>
                        {" "}
                        <WorkspaceAction
                          className={"pn-btn"}
                          type={"button"}
                          target={"#multiCollapseExample1"}
                          action={"collapse"}
                        >
                          {"Toggle First"}
                        </WorkspaceAction>{" "}
                        <WorkspaceAction
                          className={"pn-btn"}
                          type={"button"}
                          target={"#multiCollapseExample2"}
                          action={"collapse"}
                        >
                          {"Toggle Second"}
                        </WorkspaceAction>{" "}
                      </div>{" "}
                      <WorkspaceCollapse
                        className={"pn-collapse"}
                        id={"multiCollapseExample1"}
                      >
                        {" "}
                        <Card className={"pn-card pn-card-body pn-mb-2"}>
                          {"First collapsible content."}
                        </Card>{" "}
                      </WorkspaceCollapse>{" "}
                      <WorkspaceCollapse
                        className={"pn-collapse"}
                        id={"multiCollapseExample2"}
                      >
                        {" "}
                        <Card className={"pn-card pn-card-body"}>
                          {"Second collapsible content."}
                        </Card>{" "}
                      </WorkspaceCollapse>{" "}
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
                    {"Tooltips & Popovers"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-row"}>
                    {" "}
                    <div className={"pn-col-md-6"}>
                      {" "}
                      <h4>{"Tooltips"}</h4>{" "}
                      <div className={"pn-btn-list"}>
                        {" "}
                        <WorkspaceButton
                          className={"pn-btn"}
                          title={"Tooltip on top"}
                        >
                          {"Top"}
                        </WorkspaceButton>{" "}
                        <WorkspaceButton
                          className={"pn-btn"}
                          title={"Tooltip on right"}
                        >
                          {"Right"}
                        </WorkspaceButton>{" "}
                        <WorkspaceButton
                          className={"pn-btn"}
                          title={"Tooltip on bottom"}
                        >
                          {"Bottom"}
                        </WorkspaceButton>{" "}
                        <WorkspaceButton
                          className={"pn-btn"}
                          title={"Tooltip on left"}
                        >
                          {"Left"}
                        </WorkspaceButton>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-md-6"}>
                      {" "}
                      <h4>{"Popovers"}</h4>{" "}
                      <div className={"pn-btn-list"}>
                        {" "}
                        <WorkspaceButton
                          className={"pn-btn"}
                          title={"Popover Title"}
                        >
                          {"Top Popover"}
                        </WorkspaceButton>{" "}
                        <WorkspaceButton
                          className={"pn-btn"}
                          title={"Popover Title"}
                        >
                          {"Right Popover"}
                        </WorkspaceButton>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"List Groups"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body pn-p-0"}>
                  {" "}
                  <div className={"pn-list-group pn-list-group-flush"}>
                    {" "}
                    <div className={"pn-list-group-item"}>
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
                        ></path>{" "}
                      </svg>
                      {" Home "}
                    </div>{" "}
                    <div className={"pn-list-group-item pn-active"}>
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
                          d={
                            "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245"
                          }
                        ></path>{" "}
                      </svg>
                      {" Active item "}
                    </div>{" "}
                    <div className={"pn-list-group-item"}>
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
                          d={
                            "M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065"
                          }
                        ></path>{" "}
                        <path
                          d={"M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"}
                        ></path>{" "}
                      </svg>
                      {" Settings "}
                    </div>{" "}
                    <div className={"pn-list-group-item"}>
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
                        ></path>{" "}
                      </svg>
                      {" Profile "}
                    </div>{" "}
                    <div className={"pn-list-group-item pn-disabled"}>
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
                          d={
                            "M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6"
                          }
                        ></path>{" "}
                        <path d={"M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"}></path>{" "}
                        <path d={"M8 11v-4a4 4 0 1 1 8 0v4"}></path>{" "}
                      </svg>
                      {" Disabled item "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-md-6"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Content Elements"}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <h4>{"Blockquote"}</h4>{" "}
                  <blockquote className={"pn-blockquote pn-mb-4"}>
                    {" "}
                    <p>
                      {
                        "This is a blockquote example with some sample text to demonstrate the styling."
                      }
                    </p>{" "}
                    <footer className={"pn-blockquote-footer"}>
                      {"Someone famous in "}
                      <cite title={"Source Title"}>{"Source Title"}</cite>
                    </footer>{" "}
                  </blockquote>{" "}
                  <h4>{"Code Block"}</h4>{" "}
                  <pre className={"pn-mb-3"}>
                    <code>
                      {
                        "// JavaScript example function greetUser(name) { console.log(`Hello, ${name}!`); return true; }"
                      }
                    </code>
                  </pre>{" "}
                  <h4>{"Inline Elements"}</h4>{" "}
                  <p>
                    {"This paragraph contains "}
                    <code>{"inline code"}</code>
                    {", "}
                    <kbd>{"Ctrl + S"}</kbd>
                    {" keyboard shortcut, and "}
                    <mark>{"highlighted text"}</mark>
                    {"."}
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
