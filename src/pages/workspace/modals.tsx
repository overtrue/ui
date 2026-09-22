// Keep page composition editable; interaction belongs in the shared components.
import type { CSSProperties } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import {
  WorkspaceAction,
  WorkspaceButton,
  WorkspaceForm,
  WorkspaceInput,
  WorkspaceLink,
  WorkspaceSelect,
  WorkspaceTextarea,
} from "@/components/overtrue/workspace/primitives"
export default function Page() {
  return (
    <div data-workspace-page="modals" className="pn-page-wrapper">
      {" "}
      <div className={"pn-page-header pn-d-print-none"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-g-2 pn-align-items-center"}>
            {" "}
            <div className={"pn-col"}>
              {" "}
              <h1 className={"pn-page-title"}>{"Modals"}</h1>{" "}
              <div className={"pn-text-secondary pn-mt-1"}>
                {
                  "Focused moments for decisions that need attention."
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
          <Card className={"pn-card"}>
            {" "}
            <CardContent className={"pn-card-body"}>
              {" "}
              <div className={"pn-row pn-g-5"}>
                {" "}
                <div className={"pn-d-none pn-d-md-block pn-col-3"}>
                  {" "}
                  <div className={"pn-nav pn-nav-vertical pn-sticky-top pn-pt-4"}>
                    {" "}
                    <WorkspaceLink
                      href={"#modal-simple"}
                      className={"pn-nav-link"}
                    >
                      {"Simple modal"}
                    </WorkspaceLink>{" "}
                    <WorkspaceLink href={"#modal-large"} className={"pn-nav-link"}>
                      {"Large modal"}
                    </WorkspaceLink>{" "}
                    <WorkspaceLink href={"#modal-small"} className={"pn-nav-link"}>
                      {"Small modal"}
                    </WorkspaceLink>{" "}
                    <WorkspaceLink
                      href={"#modal-full-width"}
                      className={"pn-nav-link"}
                    >
                      {"Full width modal"}
                    </WorkspaceLink>{" "}
                    <WorkspaceLink
                      href={"#modal-scrollable"}
                      className={"pn-nav-link"}
                    >
                      {"Scrollable modal"}
                    </WorkspaceLink>{" "}
                    <WorkspaceLink
                      href={"#modal-report"}
                      className={"pn-nav-link"}
                    >
                      {"Modal with form"}
                    </WorkspaceLink>{" "}
                    <WorkspaceLink
                      href={"#modal-success"}
                      className={"pn-nav-link"}
                    >
                      {"Success modal"}
                    </WorkspaceLink>{" "}
                    <WorkspaceLink
                      href={"#modal-danger"}
                      className={"pn-nav-link"}
                    >
                      {"Danger modal"}
                    </WorkspaceLink>{" "}
                    <WorkspaceLink href={"#modal-team"} className={"pn-nav-link"}>
                      {"Modal with simple form"}
                    </WorkspaceLink>{" "}
                    <WorkspaceLink
                      href={"#modal-signature"}
                      className={"pn-nav-link"}
                    >
                      {"Modal with signature form"}
                    </WorkspaceLink>{" "}
                    <WorkspaceLink
                      href={"#modal-new-email"}
                      className={"pn-nav-link"}
                    >
                      {"New email modal"}
                    </WorkspaceLink>{" "}
                    <WorkspaceLink
                      href={"#modal-new-event"}
                      className={"pn-nav-link"}
                    >
                      {"New event modal"}
                    </WorkspaceLink>{" "}
                    <WorkspaceLink
                      href={"#modal-new-task"}
                      className={"pn-nav-link"}
                    >
                      {"New task modal"}
                    </WorkspaceLink>{" "}
                    <WorkspaceLink
                      href={"#modal-edit-profile"}
                      className={"pn-nav-link"}
                    >
                      {"Edit profile modal"}
                    </WorkspaceLink>{" "}
                    <WorkspaceLink
                      href={"#modal-confirm-delete"}
                      className={"pn-nav-link"}
                    >
                      {"Confirm delete modal"}
                    </WorkspaceLink>{" "}
                    <WorkspaceLink
                      href={"#modal-change-password"}
                      className={"pn-nav-link"}
                    >
                      {"Change password modal"}
                    </WorkspaceLink>{" "}
                    <WorkspaceLink
                      href={"#modal-add-task"}
                      className={"pn-nav-link"}
                    >
                      {"Add task modal"}
                    </WorkspaceLink>{" "}
                  </div>{" "}
                </div>{" "}
                <div className={"pn-col"}>
                  {" "}
                  <div className={"pn-space-y-6"}>
                    {" "}
                    <div>
                      {" "}
                      <h3>{"Simple modal"}</h3>{" "}
                      <div
                        className={
                          "pn-modal pn-modal-blur pn-fade pn-position-relative pn-rounded pn-d-block pn-bg-surface-backdrop pn-py-6 pn-w-auto pn-h-auto pn-z-0 pn-show"
                        }
                        id={"modal-simple"}
                        tabIndex={-1}
                        role={"dialog"}
                        aria-modal={"true"}
                        aria-labelledby={"modal-simple-title"}
                      >
                        {" "}
                        <div
                          className={"pn-modal-dialog pn-modal-dialog-centered"}
                        >
                          {" "}
                          <div className={"pn-modal-content"}>
                            {" "}
                            <div className={"pn-modal-header"}>
                              {" "}
                              <h5
                                className={"pn-modal-title"}
                                id={"modal-simple-title"}
                              >
                                {"Modal title"}
                              </h5>{" "}
                              <WorkspaceAction
                                type={"button"}
                                className={"pn-btn-close"}
                                aria-label={"Close"}
                                action={"dismiss"}
                              ></WorkspaceAction>{" "}
                            </div>{" "}
                            <div className={"pn-modal-body"}>
                              {
                                "Review the project details before sharing them. The client will see the brief, approved files, and the next milestone. Internal notes stay with your team."
                              }
                            </div>{" "}
                            <div className={"pn-modal-footer"}>
                              {" "}
                              <WorkspaceAction
                                type={"button"}
                                className={"pn-btn pn-me-auto"}
                                action={"dismiss"}
                              >
                                {"Close"}
                              </WorkspaceAction>{" "}
                              <WorkspaceAction
                                type={"button"}
                                className={"pn-btn pn-btn-primary"}
                                action={"dismiss"}
                              >
                                {"Save changes"}
                              </WorkspaceAction>{" "}
                            </div>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h3>{"Large modal"}</h3>{" "}
                      <div
                        className={
                          "pn-modal pn-modal-blur pn-fade pn-position-relative pn-rounded pn-d-block pn-bg-surface-backdrop pn-py-6 pn-w-auto pn-h-auto pn-z-0 pn-show"
                        }
                        id={"modal-large"}
                        tabIndex={-1}
                        role={"dialog"}
                        aria-modal={"true"}
                        aria-labelledby={"modal-large-title"}
                      >
                        {" "}
                        <div
                          className={
                            "pn-modal-dialog pn-modal-lg pn-modal-dialog-centered"
                          }
                        >
                          {" "}
                          <div className={"pn-modal-content"}>
                            {" "}
                            <div className={"pn-modal-header"}>
                              {" "}
                              <h5
                                className={"pn-modal-title"}
                                id={"modal-large-title"}
                              >
                                {"Large modal"}
                              </h5>{" "}
                              <WorkspaceAction
                                type={"button"}
                                className={"pn-btn-close"}
                                aria-label={"Close"}
                                action={"dismiss"}
                              ></WorkspaceAction>{" "}
                            </div>{" "}
                            <div className={"pn-modal-body"}>
                              {
                                "A useful review request includes enough context to understand the work, one clear question, and a date for the response."
                              }
                            </div>{" "}
                            <div className={"pn-modal-footer"}>
                              {" "}
                              <WorkspaceAction
                                type={"button"}
                                className={"pn-btn pn-me-auto"}
                                action={"dismiss"}
                              >
                                {"Close"}
                              </WorkspaceAction>{" "}
                              <WorkspaceAction
                                type={"button"}
                                className={"pn-btn pn-btn-primary"}
                                action={"dismiss"}
                              >
                                {"Save changes"}
                              </WorkspaceAction>{" "}
                            </div>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h3>{"Small modal"}</h3>{" "}
                      <div
                        className={
                          "pn-modal pn-modal-blur pn-fade pn-position-relative pn-rounded pn-d-block pn-bg-surface-backdrop pn-py-6 pn-w-auto pn-h-auto pn-z-0 pn-show"
                        }
                        id={"modal-small"}
                        tabIndex={-1}
                        role={"dialog"}
                        aria-modal={"true"}
                        aria-labelledby={"modal-small-title"}
                      >
                        {" "}
                        <div
                          className={
                            "pn-modal-dialog pn-modal-sm pn-modal-dialog-centered"
                          }
                        >
                          {" "}
                          <div className={"pn-modal-content"}>
                            {" "}
                            <div className={"pn-modal-body"}>
                              {" "}
                              <div
                                className={"pn-modal-title"}
                                id={"modal-small-title"}
                              >
                                {"Are you sure?"}
                              </div>{" "}
                              <div>
                                {
                                  "This action moves the project out of the active workspace. You can restore it later."
                                }
                              </div>{" "}
                            </div>{" "}
                            <div className={"pn-modal-footer"}>
                              {" "}
                              <WorkspaceAction
                                type={"button"}
                                className={
                                  "pn-btn pn-btn-link pn-link-secondary pn-me-auto"
                                }
                                action={"dismiss"}
                              >
                                {"Cancel"}
                              </WorkspaceAction>{" "}
                              <WorkspaceAction
                                type={"button"}
                                className={"pn-btn pn-btn-danger"}
                                action={"dismiss"}
                              >
                                {"Yes, delete all my data"}
                              </WorkspaceAction>{" "}
                            </div>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h3>{"Full width modal"}</h3>{" "}
                      <div
                        className={
                          "pn-modal pn-modal-blur pn-fade pn-position-relative pn-rounded pn-d-block pn-bg-surface-backdrop pn-py-6 pn-w-auto pn-h-auto pn-z-0 pn-show"
                        }
                        id={"modal-full-width"}
                        tabIndex={-1}
                        role={"dialog"}
                        aria-modal={"true"}
                        aria-labelledby={"modal-full-width-title"}
                      >
                        {" "}
                        <div
                          className={
                            "pn-modal-dialog pn-modal-full-width pn-modal-dialog-centered"
                          }
                        >
                          {" "}
                          <div className={"pn-modal-content"}>
                            {" "}
                            <div className={"pn-modal-header"}>
                              {" "}
                              <h5
                                className={"pn-modal-title"}
                                id={"modal-full-width-title"}
                              >
                                {"Full width modal"}
                              </h5>{" "}
                              <WorkspaceAction
                                type={"button"}
                                className={"pn-btn-close"}
                                aria-label={"Close"}
                                action={"dismiss"}
                              ></WorkspaceAction>{" "}
                            </div>{" "}
                            <div className={"pn-modal-body"}>
                              {
                                "The project owner will be notified when feedback is ready. You can return to the project activity to follow the conversation."
                              }
                            </div>{" "}
                            <div className={"pn-modal-footer"}>
                              {" "}
                              <WorkspaceAction
                                type={"button"}
                                className={"pn-btn pn-me-auto"}
                                action={"dismiss"}
                              >
                                {"Close"}
                              </WorkspaceAction>{" "}
                              <WorkspaceAction
                                type={"button"}
                                className={"pn-btn pn-btn-primary"}
                                action={"dismiss"}
                              >
                                {"Save changes"}
                              </WorkspaceAction>{" "}
                            </div>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h3>{"Scrollable modal"}</h3>{" "}
                      <div
                        className={
                          "pn-modal pn-modal-blur pn-fade pn-position-relative pn-rounded pn-d-block pn-bg-surface-backdrop pn-py-6 pn-w-auto pn-h-auto pn-z-0 pn-show"
                        }
                        style={{ maxHeight: "30rem" } as CSSProperties}
                        id={"modal-scrollable"}
                        tabIndex={-1}
                        role={"dialog"}
                        aria-modal={"true"}
                        aria-labelledby={"modal-scrollable-title"}
                      >
                        {" "}
                        <div
                          className={
                            "pn-modal-dialog pn-modal-dialog-centered pn-modal-dialog-scrollable"
                          }
                        >
                          {" "}
                          <div className={"pn-modal-content"}>
                            {" "}
                            <div className={"pn-modal-header"}>
                              {" "}
                              <h5
                                className={"pn-modal-title"}
                                id={"modal-scrollable-title"}
                              >
                                {"Scrollable modal"}
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
                                  "Review the project details before sharing them. The client will see the brief, approved files, and the next milestone. Internal notes stay with your team."
                                }
                              </p>{" "}
                              <p>
                                {
                                  "A useful review request includes enough context to understand the work, one clear question, and a date for the response."
                                }
                              </p>{" "}
                              <p>
                                {
                                  "The project owner will be notified when feedback is ready. You can return to the project activity to follow the conversation."
                                }
                              </p>{" "}
                              <p>
                                {
                                  "Review the project details before sharing them. The client will see the brief, approved files, and the next milestone. Internal notes stay with your team."
                                }
                              </p>{" "}
                              <p>
                                {
                                  "A useful review request includes enough context to understand the work, one clear question, and a date for the response."
                                }
                              </p>{" "}
                              <p>
                                {
                                  "The project owner will be notified when feedback is ready. You can return to the project activity to follow the conversation."
                                }
                              </p>{" "}
                              <p>
                                {
                                  "Review the project details before sharing them. The client will see the brief, approved files, and the next milestone. Internal notes stay with your team."
                                }
                              </p>{" "}
                              <p>
                                {
                                  "A useful review request includes enough context to understand the work, one clear question, and a date for the response."
                                }
                              </p>{" "}
                              <p>
                                {
                                  "The project owner will be notified when feedback is ready. You can return to the project activity to follow the conversation."
                                }
                              </p>{" "}
                              <p>
                                {
                                  "Review the project details before sharing them. The client will see the brief, approved files, and the next milestone. Internal notes stay with your team."
                                }
                              </p>{" "}
                              <p>
                                {
                                  "A useful review request includes enough context to understand the work, one clear question, and a date for the response."
                                }
                              </p>{" "}
                              <p>
                                {
                                  "The project owner will be notified when feedback is ready. You can return to the project activity to follow the conversation."
                                }
                              </p>{" "}
                              <p>
                                {
                                  "Review the project details before sharing them. The client will see the brief, approved files, and the next milestone. Internal notes stay with your team."
                                }
                              </p>{" "}
                              <p>
                                {
                                  "A useful review request includes enough context to understand the work, one clear question, and a date for the response."
                                }
                              </p>{" "}
                              <p>
                                {
                                  "The project owner will be notified when feedback is ready. You can return to the project activity to follow the conversation."
                                }
                              </p>{" "}
                              <p>
                                {
                                  "Review the project details before sharing them. The client will see the brief, approved files, and the next milestone. Internal notes stay with your team."
                                }
                              </p>{" "}
                              <p>
                                {
                                  "A useful review request includes enough context to understand the work, one clear question, and a date for the response."
                                }
                              </p>{" "}
                              <p>
                                {
                                  "The project owner will be notified when feedback is ready. You can return to the project activity to follow the conversation."
                                }
                              </p>{" "}
                            </div>{" "}
                            <div className={"pn-modal-footer"}>
                              {" "}
                              <WorkspaceAction
                                type={"button"}
                                className={"pn-btn pn-me-auto"}
                                action={"dismiss"}
                              >
                                {"Close"}
                              </WorkspaceAction>{" "}
                              <WorkspaceAction
                                type={"button"}
                                className={"pn-btn pn-btn-primary"}
                                action={"dismiss"}
                              >
                                {"Save changes"}
                              </WorkspaceAction>{" "}
                            </div>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h3>{"Modal with form"}</h3>{" "}
                      <div
                        className={
                          "pn-modal pn-modal-blur pn-fade pn-position-relative pn-rounded pn-d-block pn-bg-surface-backdrop pn-py-6 pn-w-auto pn-h-auto pn-z-0 pn-show"
                        }
                        id={"modal-report"}
                        tabIndex={-1}
                        role={"dialog"}
                        aria-modal={"true"}
                        aria-labelledby={"modal-report-title"}
                      >
                        {" "}
                        <div
                          className={
                            "pn-modal-dialog pn-modal-lg pn-modal-dialog-centered"
                          }
                        >
                          {" "}
                          <div className={"pn-modal-content"}>
                            {" "}
                            <div className={"pn-modal-header"}>
                              {" "}
                              <h5
                                className={"pn-modal-title"}
                                id={"modal-report-title"}
                              >
                                {"New report"}
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
                              <div className={"pn-mb-3"}>
                                {" "}
                                <label
                                  className={"pn-form-label"}
                                  htmlFor={"report-name"}
                                >
                                  {" Name "}
                                </label>{" "}
                                <WorkspaceInput
                                  type={"text"}
                                  id={"report-name"}
                                  className={"pn-form-control"}
                                  name={"example-text-input"}
                                  placeholder={"Your report name"}
                                />{" "}
                              </div>{" "}
                              <fieldset className={"pn-border-0 pn-p-0 pn-mb-3"}>
                                {" "}
                                <legend
                                  className={"pn-form-label pn-float-none pn-mb-0"}
                                  style={
                                    { fontSize: "inherit" } as CSSProperties
                                  }
                                >
                                  {"Report type"}
                                </legend>{" "}
                                <div
                                  className={"pn-form-selectgroup-boxes pn-row"}
                                >
                                  {" "}
                                  <div className={"pn-col-lg-6"}>
                                    {" "}
                                    <label
                                      className={"pn-form-selectgroup-item"}
                                    >
                                      {" "}
                                      <WorkspaceInput
                                        type={"radio"}
                                        name={"report-type"}
                                        defaultValue={"1"}
                                        className={"pn-form-selectgroup-input"}
                                        defaultChecked
                                      />{" "}
                                      <span
                                        className={
                                          "pn-form-selectgroup-label pn-d-flex pn-align-items-center pn-p-3"
                                        }
                                      >
                                        {" "}
                                        <span className={"pn-me-3"}>
                                          {" "}
                                          <span
                                            className={
                                              "pn-form-selectgroup-check"
                                            }
                                          ></span>{" "}
                                        </span>{" "}
                                        <span
                                          className={
                                            "pn-form-selectgroup-label-content"
                                          }
                                        >
                                          {" "}
                                          <span
                                            className={
                                              "pn-form-selectgroup-title pn-strong pn-mb-1"
                                            }
                                          >
                                            {"Simple"}
                                          </span>{" "}
                                          <span
                                            className={
                                              "pn-d-block pn-text-secondary"
                                            }
                                          >
                                            {
                                              "Provide only basic data needed for the report"
                                            }
                                          </span>{" "}
                                        </span>{" "}
                                      </span>{" "}
                                    </label>{" "}
                                  </div>{" "}
                                  <div className={"pn-col-lg-6"}>
                                    {" "}
                                    <label
                                      className={"pn-form-selectgroup-item"}
                                    >
                                      {" "}
                                      <WorkspaceInput
                                        type={"radio"}
                                        name={"report-type"}
                                        defaultValue={"2"}
                                        className={"pn-form-selectgroup-input"}
                                      />{" "}
                                      <span
                                        className={
                                          "pn-form-selectgroup-label pn-d-flex pn-align-items-center pn-p-3"
                                        }
                                      >
                                        {" "}
                                        <span className={"pn-me-3"}>
                                          {" "}
                                          <span
                                            className={
                                              "pn-form-selectgroup-check"
                                            }
                                          ></span>{" "}
                                        </span>{" "}
                                        <span
                                          className={
                                            "pn-form-selectgroup-label-content"
                                          }
                                        >
                                          {" "}
                                          <span
                                            className={
                                              "pn-form-selectgroup-title pn-strong pn-mb-1"
                                            }
                                          >
                                            {"Advanced"}
                                          </span>{" "}
                                          <span
                                            className={
                                              "pn-d-block pn-text-secondary"
                                            }
                                          >
                                            {
                                              "Insert charts and additional advanced analyses to be inserted in the report"
                                            }
                                          </span>{" "}
                                        </span>{" "}
                                      </span>{" "}
                                    </label>{" "}
                                  </div>{" "}
                                </div>{" "}
                              </fieldset>{" "}
                              <div className={"pn-row"}>
                                {" "}
                                <div className={"pn-col-lg-8"}>
                                  {" "}
                                  <div className={"pn-mb-3"}>
                                    {" "}
                                    <label
                                      className={"pn-form-label"}
                                      htmlFor={"report-url"}
                                    >
                                      {" Report url "}
                                    </label>{" "}
                                    <div
                                      className={
                                        "pn-input-group pn-input-group-flat"
                                      }
                                    >
                                      {" "}
                                      <span className={"pn-input-group-text"}>
                                        {"/docs"}
                                      </span>{" "}
                                      <WorkspaceInput
                                        type={"text"}
                                        className={"pn-form-control pn-ps-0"}
                                        defaultValue={"report-01"}
                                        id={"report-url"}
                                      />{" "}
                                    </div>{" "}
                                  </div>{" "}
                                </div>{" "}
                                <div className={"pn-col-lg-4"}>
                                  {" "}
                                  <div className={"pn-mb-3"}>
                                    {" "}
                                    <label
                                      className={"pn-form-label"}
                                      htmlFor={"report-visibility"}
                                    >
                                      {" Visibility "}
                                    </label>{" "}
                                    <WorkspaceSelect
                                      id={"report-visibility"}
                                      className={"pn-form-select"}
                                      defaultValue={"1"}
                                    >
                                      <option value={"1"}>{"Private"}</option>
                                      <option value={"2"}>{"Public"}</option>
                                      <option value={"3"}>{"Hidden"}</option>
                                    </WorkspaceSelect>{" "}
                                  </div>{" "}
                                </div>{" "}
                              </div>{" "}
                            </div>{" "}
                            <div className={"pn-modal-body"}>
                              {" "}
                              <div className={"pn-row"}>
                                {" "}
                                <div className={"pn-col-lg-6"}>
                                  {" "}
                                  <div className={"pn-mb-3"}>
                                    {" "}
                                    <label
                                      className={"pn-form-label"}
                                      htmlFor={"report-client-name"}
                                    >
                                      {" Client name "}
                                    </label>{" "}
                                    <WorkspaceInput
                                      type={"text"}
                                      id={"report-client-name"}
                                      className={"pn-form-control"}
                                    />{" "}
                                  </div>{" "}
                                </div>{" "}
                                <div className={"pn-col-lg-6"}>
                                  {" "}
                                  <div className={"pn-mb-3"}>
                                    {" "}
                                    <label
                                      className={"pn-form-label"}
                                      htmlFor={"report-reporting-period"}
                                    >
                                      {" Reporting period "}
                                    </label>{" "}
                                    <WorkspaceInput
                                      type={"date"}
                                      id={"report-reporting-period"}
                                      className={"pn-form-control"}
                                    />{" "}
                                  </div>{" "}
                                </div>{" "}
                                <div className={"pn-col-lg-12"}>
                                  {" "}
                                  <div>
                                    {" "}
                                    <label
                                      className={"pn-form-label"}
                                      htmlFor={"report-additional-info"}
                                    >
                                      {" Additional information "}
                                    </label>{" "}
                                    <WorkspaceTextarea
                                      id={"report-additional-info"}
                                      className={"pn-form-control"}
                                      rows={3}
                                      defaultValue={""}
                                    />{" "}
                                  </div>{" "}
                                </div>{" "}
                              </div>{" "}
                            </div>{" "}
                            <div className={"pn-modal-footer"}>
                              {" "}
                              <WorkspaceAction
                                type={"button"}
                                className={"pn-btn pn-btn-link pn-link-secondary"}
                                action={"dismiss"}
                              >
                                {"Cancel"}
                              </WorkspaceAction>{" "}
                              <WorkspaceAction
                                type={"button"}
                                className={"pn-btn pn-btn-primary pn-ms-auto"}
                                action={"dismiss"}
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
                                {"Create new report "}
                              </WorkspaceAction>{" "}
                            </div>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h3>{"Success modal"}</h3>{" "}
                      <div
                        className={
                          "pn-modal pn-modal-blur pn-fade pn-position-relative pn-rounded pn-d-block pn-bg-surface-backdrop pn-py-6 pn-w-auto pn-h-auto pn-z-0 pn-show"
                        }
                        id={"modal-success"}
                        tabIndex={-1}
                        role={"dialog"}
                        aria-modal={"true"}
                        aria-labelledby={"modal-success-title"}
                      >
                        {" "}
                        <div
                          className={
                            "pn-modal-dialog pn-modal-sm pn-modal-dialog-centered"
                          }
                        >
                          {" "}
                          <div className={"pn-modal-content"}>
                            {" "}
                            <WorkspaceAction
                              type={"button"}
                              className={"pn-btn-close"}
                              aria-label={"Close"}
                              action={"dismiss"}
                            ></WorkspaceAction>{" "}
                            <div
                              className={"pn-modal-status pn-bg-success"}
                            ></div>{" "}
                            <div
                              className={"pn-modal-body pn-text-center pn-py-4"}
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
                                className={
                                  "pn-icon pn-mb-2 pn-text-green pn-icon-lg"
                                }
                              >
                                {" "}
                                <path
                                  d={"M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"}
                                ></path>{" "}
                                <path d={"M9 12l2 2l4 -4"}></path>{" "}
                              </svg>{" "}
                              <h3 id={"modal-success-title"}>
                                {"Payment succedeed"}
                              </h3>{" "}
                              <div className={"pn-text-secondary"}>
                                {
                                  "The sample invoice has been marked as paid. The billing contact is "
                                }
                                <WorkspaceLink
                                  href={"/cdn-cgi/l/email-protection"}
                                  className={"pn-__cf_email__"}
                                  data-cfemail={
                                    "087b7d7878677a7c487c696a646d7a266167"
                                  }
                                >
                                  {"[email protected]"}
                                </WorkspaceLink>
                                {"."}
                              </div>{" "}
                            </div>{" "}
                            <div className={"pn-modal-footer"}>
                              {" "}
                              <div className={"pn-w-100"}>
                                {" "}
                                <div className={"pn-row"}>
                                  {" "}
                                  <div className={"pn-col"}>
                                    <WorkspaceAction
                                      type={"button"}
                                      className={"pn-btn pn-w-100"}
                                      action={"dismiss"}
                                    >
                                      {"Go to dashboard"}
                                    </WorkspaceAction>
                                  </div>{" "}
                                  <div className={"pn-col"}>
                                    <WorkspaceAction
                                      type={"button"}
                                      className={"pn-btn pn-btn-success pn-w-100"}
                                      action={"dismiss"}
                                    >
                                      {"View invoice"}
                                    </WorkspaceAction>
                                  </div>{" "}
                                </div>{" "}
                              </div>{" "}
                            </div>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h3>{"Danger modal"}</h3>{" "}
                      <div
                        className={
                          "pn-modal pn-modal-blur pn-fade pn-position-relative pn-rounded pn-d-block pn-bg-surface-backdrop pn-py-6 pn-w-auto pn-h-auto pn-z-0 pn-show"
                        }
                        id={"modal-danger"}
                        tabIndex={-1}
                        role={"dialog"}
                        aria-modal={"true"}
                        aria-labelledby={"modal-danger-title"}
                      >
                        {" "}
                        <div
                          className={
                            "pn-modal-dialog pn-modal-sm pn-modal-dialog-centered"
                          }
                        >
                          {" "}
                          <div className={"pn-modal-content"}>
                            {" "}
                            <WorkspaceAction
                              type={"button"}
                              className={"pn-btn-close"}
                              aria-label={"Close"}
                              action={"dismiss"}
                            ></WorkspaceAction>{" "}
                            <div className={"pn-modal-status pn-bg-danger"}></div>{" "}
                            <div
                              className={"pn-modal-body pn-text-center pn-py-4"}
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
                                className={
                                  "pn-icon pn-mb-2 pn-text-danger pn-icon-lg"
                                }
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
                              <h3 id={"modal-danger-title"}>
                                {"Are you sure?"}
                              </h3>{" "}
                              <div className={"pn-text-secondary"}>
                                {
                                  "Archive this project? Its files and activity will remain available in the archive."
                                }
                              </div>{" "}
                            </div>{" "}
                            <div className={"pn-modal-footer"}>
                              {" "}
                              <div className={"pn-w-100"}>
                                {" "}
                                <div className={"pn-row"}>
                                  {" "}
                                  <div className={"pn-col"}>
                                    <WorkspaceAction
                                      type={"button"}
                                      className={"pn-btn pn-w-100"}
                                      action={"dismiss"}
                                    >
                                      {"Cancel"}
                                    </WorkspaceAction>
                                  </div>{" "}
                                  <div className={"pn-col"}>
                                    <WorkspaceAction
                                      type={"button"}
                                      className={"pn-btn pn-btn-danger pn-w-100"}
                                      action={"dismiss"}
                                    >
                                      {"Delete 84 items"}
                                    </WorkspaceAction>
                                  </div>{" "}
                                </div>{" "}
                              </div>{" "}
                            </div>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h3>{"Modal with simple form"}</h3>{" "}
                      <div
                        className={
                          "pn-modal pn-modal-blur pn-fade pn-position-relative pn-rounded pn-d-block pn-bg-surface-backdrop pn-py-6 pn-w-auto pn-h-auto pn-z-0 pn-show"
                        }
                        id={"modal-team"}
                        tabIndex={-1}
                        role={"dialog"}
                        aria-modal={"true"}
                        aria-labelledby={"modal-team-title"}
                      >
                        {" "}
                        <div
                          className={"pn-modal-dialog pn-modal-dialog-centered"}
                        >
                          {" "}
                          <div className={"pn-modal-content"}>
                            {" "}
                            <div className={"pn-modal-header"}>
                              {" "}
                              <h5
                                className={"pn-modal-title"}
                                id={"modal-team-title"}
                              >
                                {"Add a new team"}
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
                              <div className={"pn-row pn-mb-3 pn-align-items-end"}>
                                {" "}
                                <div className={"pn-col-auto"}>
                                  {" "}
                                  <WorkspaceLink
                                    href={"#"}
                                    className={
                                      "pn-avatar pn-avatar-upload pn-rounded pn-avatar-xl"
                                    }
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
                                </div>{" "}
                                <div className={"pn-col"}>
                                  {" "}
                                  <label className={"pn-form-label"}>
                                    {"Name"}
                                  </label>{" "}
                                  <WorkspaceInput
                                    type={"text"}
                                    className={"pn-form-control"}
                                  />{" "}
                                </div>{" "}
                              </div>{" "}
                              <div className={"pn-mb-3"}>
                                {" "}
                                <div className={"pn-form-label"}>
                                  {"Pick your team color"}
                                </div>{" "}
                                <fieldset>
                                  {" "}
                                  <legend className={"pn-visually-hidden"}>
                                    {"Pick your team color"}
                                  </legend>{" "}
                                  <div className={"pn-row pn-g-2"}>
                                    {" "}
                                    <div className={"pn-col-auto"}>
                                      {" "}
                                      <label className={"pn-form-colorinput"}>
                                        {" "}
                                        <WorkspaceInput
                                          name={"color"}
                                          type={"radio"}
                                          defaultValue={"dark"}
                                          className={"pn-form-colorinput-input"}
                                          aria-label={"dark"}
                                        />{" "}
                                        <span
                                          className={
                                            "pn-form-colorinput-color pn-bg-dark"
                                          }
                                        ></span>{" "}
                                      </label>{" "}
                                    </div>{" "}
                                    <div className={"pn-col-auto"}>
                                      {" "}
                                      <label
                                        className={
                                          "pn-form-colorinput pn-form-colorinput-light"
                                        }
                                      >
                                        {" "}
                                        <WorkspaceInput
                                          name={"color"}
                                          type={"radio"}
                                          defaultValue={"white"}
                                          className={"pn-form-colorinput-input"}
                                          defaultChecked
                                          aria-label={"white"}
                                        />{" "}
                                        <span
                                          className={
                                            "pn-form-colorinput-color pn-bg-white"
                                          }
                                        ></span>{" "}
                                      </label>{" "}
                                    </div>{" "}
                                    <div className={"pn-col-auto"}>
                                      {" "}
                                      <label className={"pn-form-colorinput"}>
                                        {" "}
                                        <WorkspaceInput
                                          name={"color"}
                                          type={"radio"}
                                          defaultValue={"blue"}
                                          className={"pn-form-colorinput-input"}
                                          aria-label={"blue"}
                                        />{" "}
                                        <span
                                          className={
                                            "pn-form-colorinput-color pn-bg-blue"
                                          }
                                        ></span>{" "}
                                      </label>{" "}
                                    </div>{" "}
                                    <div className={"pn-col-auto"}>
                                      {" "}
                                      <label className={"pn-form-colorinput"}>
                                        {" "}
                                        <WorkspaceInput
                                          name={"color"}
                                          type={"radio"}
                                          defaultValue={"azure"}
                                          className={"pn-form-colorinput-input"}
                                          aria-label={"azure"}
                                        />{" "}
                                        <span
                                          className={
                                            "pn-form-colorinput-color pn-bg-azure"
                                          }
                                        ></span>{" "}
                                      </label>{" "}
                                    </div>{" "}
                                    <div className={"pn-col-auto"}>
                                      {" "}
                                      <label className={"pn-form-colorinput"}>
                                        {" "}
                                        <WorkspaceInput
                                          name={"color"}
                                          type={"radio"}
                                          defaultValue={"indigo"}
                                          className={"pn-form-colorinput-input"}
                                          aria-label={"indigo"}
                                        />{" "}
                                        <span
                                          className={
                                            "pn-form-colorinput-color pn-bg-indigo"
                                          }
                                        ></span>{" "}
                                      </label>{" "}
                                    </div>{" "}
                                    <div className={"pn-col-auto"}>
                                      {" "}
                                      <label className={"pn-form-colorinput"}>
                                        {" "}
                                        <WorkspaceInput
                                          name={"color"}
                                          type={"radio"}
                                          defaultValue={"purple"}
                                          className={"pn-form-colorinput-input"}
                                          aria-label={"purple"}
                                        />{" "}
                                        <span
                                          className={
                                            "pn-form-colorinput-color pn-bg-purple"
                                          }
                                        ></span>{" "}
                                      </label>{" "}
                                    </div>{" "}
                                    <div className={"pn-col-auto"}>
                                      {" "}
                                      <label className={"pn-form-colorinput"}>
                                        {" "}
                                        <WorkspaceInput
                                          name={"color"}
                                          type={"radio"}
                                          defaultValue={"pink"}
                                          className={"pn-form-colorinput-input"}
                                          aria-label={"pink"}
                                        />{" "}
                                        <span
                                          className={
                                            "pn-form-colorinput-color pn-bg-pink"
                                          }
                                        ></span>{" "}
                                      </label>{" "}
                                    </div>{" "}
                                    <div className={"pn-col-auto"}>
                                      {" "}
                                      <label className={"pn-form-colorinput"}>
                                        {" "}
                                        <WorkspaceInput
                                          name={"color"}
                                          type={"radio"}
                                          defaultValue={"red"}
                                          className={"pn-form-colorinput-input"}
                                          aria-label={"red"}
                                        />{" "}
                                        <span
                                          className={
                                            "pn-form-colorinput-color pn-bg-red"
                                          }
                                        ></span>{" "}
                                      </label>{" "}
                                    </div>{" "}
                                    <div className={"pn-col-auto"}>
                                      {" "}
                                      <label className={"pn-form-colorinput"}>
                                        {" "}
                                        <WorkspaceInput
                                          name={"color"}
                                          type={"radio"}
                                          defaultValue={"orange"}
                                          className={"pn-form-colorinput-input"}
                                          aria-label={"orange"}
                                        />{" "}
                                        <span
                                          className={
                                            "pn-form-colorinput-color pn-bg-orange"
                                          }
                                        ></span>{" "}
                                      </label>{" "}
                                    </div>{" "}
                                    <div className={"pn-col-auto"}>
                                      {" "}
                                      <label className={"pn-form-colorinput"}>
                                        {" "}
                                        <WorkspaceInput
                                          name={"color"}
                                          type={"radio"}
                                          defaultValue={"yellow"}
                                          className={"pn-form-colorinput-input"}
                                          aria-label={"yellow"}
                                        />{" "}
                                        <span
                                          className={
                                            "pn-form-colorinput-color pn-bg-yellow"
                                          }
                                        ></span>{" "}
                                      </label>{" "}
                                    </div>{" "}
                                    <div className={"pn-col-auto"}>
                                      {" "}
                                      <label className={"pn-form-colorinput"}>
                                        {" "}
                                        <WorkspaceInput
                                          name={"color"}
                                          type={"radio"}
                                          defaultValue={"lime"}
                                          className={"pn-form-colorinput-input"}
                                          aria-label={"lime"}
                                        />{" "}
                                        <span
                                          className={
                                            "pn-form-colorinput-color pn-bg-lime"
                                          }
                                        ></span>{" "}
                                      </label>{" "}
                                    </div>{" "}
                                    <div className={"pn-col-auto"}>
                                      {" "}
                                      <label className={"pn-form-colorinput"}>
                                        {" "}
                                        <WorkspaceInput
                                          name={"color"}
                                          type={"radio"}
                                          defaultValue={"green"}
                                          className={"pn-form-colorinput-input"}
                                          aria-label={"green"}
                                        />{" "}
                                        <span
                                          className={
                                            "pn-form-colorinput-color pn-bg-green"
                                          }
                                        ></span>{" "}
                                      </label>{" "}
                                    </div>{" "}
                                  </div>{" "}
                                </fieldset>{" "}
                              </div>{" "}
                              <div>
                                {" "}
                                <label
                                  className={"pn-form-label"}
                                  htmlFor={"team-additional-info"}
                                >
                                  {" Additional info "}
                                </label>{" "}
                                <WorkspaceTextarea
                                  id={"team-additional-info"}
                                  className={"pn-form-control"}
                                  defaultValue={""}
                                />{" "}
                              </div>{" "}
                            </div>{" "}
                            <div className={"pn-modal-footer"}>
                              {" "}
                              <WorkspaceAction
                                type={"button"}
                                className={"pn-btn pn-me-auto"}
                                action={"dismiss"}
                              >
                                {"Close"}
                              </WorkspaceAction>{" "}
                              <WorkspaceAction
                                type={"button"}
                                className={"pn-btn pn-btn-primary"}
                                action={"dismiss"}
                              >
                                {"Add Team"}
                              </WorkspaceAction>{" "}
                            </div>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h3>{"Modal with signature form"}</h3>{" "}
                      <div
                        className={
                          "pn-modal pn-modal-blur pn-fade pn-position-relative pn-rounded pn-d-block pn-bg-surface-backdrop pn-py-6 pn-w-auto pn-h-auto pn-z-0 pn-show"
                        }
                        id={"modal-signature"}
                        tabIndex={-1}
                        role={"dialog"}
                        aria-modal={"true"}
                        aria-labelledby={"modal-signature-title"}
                      >
                        {" "}
                        <div
                          className={"pn-modal-dialog pn-modal-dialog-centered"}
                        >
                          {" "}
                          <div className={"pn-modal-content"}>
                            {" "}
                            <WorkspaceAction
                              type={"button"}
                              className={"pn-btn-close"}
                              aria-label={"Close"}
                              action={"dismiss"}
                            ></WorkspaceAction>{" "}
                            <div className={"pn-modal-body"}>
                              {" "}
                              <CardTitle
                                id={"modal-signature-title"}
                                className={"pn-card-title"}
                              >
                                {"Confirm transfer"}
                              </CardTitle>{" "}
                              <CardDescription className={"pn-card-subtitle"}>
                                {
                                  "Add your initials to acknowledge the sample project brief."
                                }
                              </CardDescription>{" "}
                              <WorkspaceForm>
                                {" "}
                                <div className={"pn-mb-3"}>
                                  {" "}
                                  <div className={"pn-form-label pn-required"}>
                                    {"Signature"}
                                  </div>{" "}
                                  <div
                                    className={
                                      "pn-position-relative pn-user-select-none"
                                    }
                                  >
                                    {" "}
                                    <div
                                      className={
                                        "pn-signature pn-position-relative"
                                      }
                                    >
                                      {" "}
                                      <div
                                        className={
                                          "pn-position-absolute pn-top-0 pn-end-0 pn-p-2"
                                        }
                                      >
                                        {" "}
                                        <WorkspaceButton
                                          type={"button"}
                                          className={"pn-btn pn-btn-icon"}
                                          id={"signature-default-clear"}
                                          title={"Clear signature"}
                                          aria-label={"Clear signature"}
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
                                            <path d={"M4 7l16 0"}></path>{" "}
                                            <path d={"M10 11l0 6"}></path>{" "}
                                            <path d={"M14 11l0 6"}></path>{" "}
                                            <path
                                              d={
                                                "M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"
                                              }
                                            ></path>{" "}
                                            <path
                                              d={
                                                "M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"
                                              }
                                            ></path>{" "}
                                          </svg>{" "}
                                        </WorkspaceButton>{" "}
                                      </div>{" "}
                                      <canvas
                                        id={"signature-default"}
                                        width={"684"}
                                        height={"400"}
                                        className={"pn-signature-canvas"}
                                      ></canvas>{" "}
                                    </div>{" "}
                                  </div>{" "}
                                </div>{" "}
                              </WorkspaceForm>{" "}
                              <div className={"pn-text-secondary pn-fs-5"}>
                                {
                                  " This signature field is an interface example. It does not create a contract or authorize a payment. "
                                }
                              </div>{" "}
                            </div>{" "}
                            <div className={"pn-modal-footer"}>
                              {" "}
                              <WorkspaceButton
                                type={"button"}
                                className={"pn-btn"}
                              >
                                {"Cancel"}
                              </WorkspaceButton>{" "}
                              <WorkspaceButton
                                type={"button"}
                                className={"pn-btn pn-btn-primary pn-ms-auto"}
                              >
                                {"Confirm transfer"}
                              </WorkspaceButton>{" "}
                            </div>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h3>{"New email modal"}</h3>{" "}
                      <div
                        className={
                          "pn-modal pn-modal-blur pn-fade pn-position-relative pn-rounded pn-d-block pn-bg-surface-backdrop pn-py-6 pn-w-auto pn-h-auto pn-z-0 pn-show"
                        }
                        id={"modal-new-email"}
                        tabIndex={-1}
                        role={"dialog"}
                        aria-modal={"true"}
                        aria-labelledby={"modal-new-email-title"}
                      >
                        {" "}
                        <div
                          className={"pn-modal-dialog pn-modal-dialog-centered"}
                        >
                          {" "}
                          <div className={"pn-modal-content"}>
                            {" "}
                            <div className={"pn-modal-header"}>
                              {" "}
                              <h4
                                className={"pn-modal-title"}
                                id={"modal-new-email-title"}
                              >
                                {"New Message"}
                              </h4>{" "}
                              <WorkspaceAction
                                type={"button"}
                                className={"pn-btn-close"}
                                aria-label={"Close"}
                                action={"dismiss"}
                              ></WorkspaceAction>{" "}
                            </div>{" "}
                            <div className={"pn-modal-body"}>
                              {" "}
                              <WorkspaceForm>
                                {" "}
                                <div className={"pn-mb-3"}>
                                  {" "}
                                  <label
                                    className={"pn-form-label"}
                                    htmlFor={"new-email-to"}
                                  >
                                    {" To "}
                                  </label>{" "}
                                  <WorkspaceInput
                                    type={"text"}
                                    id={"new-email-to"}
                                    className={"pn-form-control"}
                                    placeholder={"Example@email.com"}
                                  />{" "}
                                </div>{" "}
                                <div className={"pn-mb-3"}>
                                  {" "}
                                  <label
                                    className={"pn-form-label"}
                                    htmlFor={"new-email-subject"}
                                  >
                                    {" Subject "}
                                  </label>{" "}
                                  <WorkspaceInput
                                    type={"text"}
                                    id={"new-email-subject"}
                                    className={"pn-form-control"}
                                    placeholder={"Your subject"}
                                  />{" "}
                                </div>{" "}
                                <div>
                                  {" "}
                                  <label
                                    className={"pn-form-label"}
                                    htmlFor={"hugerte-email-message"}
                                  >
                                    {" Message "}
                                  </label>{" "}
                                  <WorkspaceTextarea
                                    id={"hugerte-email-message"}
                                    defaultValue={"Hello, <b>overtrue/ui</b>!"}
                                  />{" "}
                                </div>
                              </WorkspaceForm>{" "}
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
                              <WorkspaceAction
                                type={"button"}
                                className={"pn-btn pn-btn-primary pn-ms-auto"}
                                action={"dismiss"}
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
                                  <path d={"M10 14l11 -11"}></path>{" "}
                                  <path
                                    d={
                                      "M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"
                                    }
                                  ></path>{" "}
                                </svg>
                                {" Send Message "}
                              </WorkspaceAction>{" "}
                            </div>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h3>{"New event modal"}</h3>{" "}
                      <div
                        className={
                          "pn-modal pn-modal-blur pn-fade pn-position-relative pn-rounded pn-d-block pn-bg-surface-backdrop pn-py-6 pn-w-auto pn-h-auto pn-z-0 pn-show"
                        }
                        id={"modal-new-event"}
                        tabIndex={-1}
                        role={"dialog"}
                        aria-modal={"true"}
                        aria-labelledby={"modal-new-event-title"}
                      >
                        {" "}
                        <div
                          className={"pn-modal-dialog pn-modal-dialog-centered"}
                        >
                          {" "}
                          <div className={"pn-modal-content"}>
                            {" "}
                            <div className={"pn-modal-header"}>
                              {" "}
                              <h4
                                className={"pn-modal-title"}
                                id={"modal-new-event-title"}
                              >
                                {"New event"}
                              </h4>{" "}
                              <WorkspaceAction
                                type={"button"}
                                className={"pn-btn-close"}
                                aria-label={"Close"}
                                action={"dismiss"}
                              ></WorkspaceAction>{" "}
                            </div>{" "}
                            <div className={"pn-modal-body"}>
                              {" "}
                              <WorkspaceForm>
                                {" "}
                                <div className={"pn-mb-4"}>
                                  {" "}
                                  <label
                                    className={"pn-form-label"}
                                    htmlFor={"event-title"}
                                  >
                                    {" Title "}
                                  </label>{" "}
                                  <WorkspaceInput
                                    className={"pn-form-control"}
                                    id={"event-title"}
                                    type={"text"}
                                    placeholder={"Event title"}
                                  />{" "}
                                </div>{" "}
                                <div className={"pn-mb-4"}>
                                  {" "}
                                  <label
                                    className={"pn-form-label"}
                                    htmlFor={"event-description"}
                                  >
                                    {" Description "}
                                  </label>{" "}
                                  <WorkspaceTextarea
                                    className={"pn-form-control"}
                                    id={"event-description"}
                                    rows={3}
                                    placeholder={"Event description"}
                                    defaultValue={""}
                                  />{" "}
                                </div>{" "}
                                <div className={"pn-row"}>
                                  {" "}
                                  <div className={"pn-col"}>
                                    {" "}
                                    <div className={"pn-mb-4"}>
                                      {" "}
                                      <label
                                        className={"pn-form-label"}
                                        htmlFor={"datepicker-event-start"}
                                      >
                                        {" Start "}
                                      </label>{" "}
                                      <div className={"pn-input-icon"}>
                                        {" "}
                                        <WorkspaceInput
                                          className={"pn-form-control"}
                                          placeholder={"Select a date"}
                                          id={"datepicker-event-start"}
                                          defaultValue={"2020-06-20"}
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
                                              d={
                                                "M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12"
                                              }
                                            ></path>{" "}
                                            <path d={"M16 3v4"}></path>{" "}
                                            <path d={"M8 3v4"}></path>{" "}
                                            <path d={"M4 11h16"}></path>{" "}
                                            <path d={"M11 15h1"}></path>{" "}
                                            <path d={"M12 15v3"}></path>
                                          </svg>
                                        </span>{" "}
                                      </div>{" "}
                                    </div>{" "}
                                  </div>{" "}
                                  <div className={"pn-col"}>
                                    {" "}
                                    <div className={"pn-mb-4"}>
                                      {" "}
                                      <label
                                        className={"pn-form-label"}
                                        htmlFor={"datepicker-event-end"}
                                      >
                                        {" End "}
                                      </label>{" "}
                                      <div className={"pn-input-icon"}>
                                        {" "}
                                        <WorkspaceInput
                                          className={"pn-form-control"}
                                          placeholder={"Select a date"}
                                          id={"datepicker-event-end"}
                                          defaultValue={"2020-06-20"}
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
                                              d={
                                                "M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12"
                                              }
                                            ></path>{" "}
                                            <path d={"M16 3v4"}></path>{" "}
                                            <path d={"M8 3v4"}></path>{" "}
                                            <path d={"M4 11h16"}></path>{" "}
                                            <path d={"M11 15h1"}></path>{" "}
                                            <path d={"M12 15v3"}></path>
                                          </svg>
                                        </span>{" "}
                                      </div>{" "}
                                    </div>{" "}
                                  </div>{" "}
                                </div>{" "}
                                <WorkspaceButton
                                  type={"submit"}
                                  className={
                                    "pn-btn pn-btn-primary pn-mt-4 pn-w-100"
                                  }
                                >
                                  {"Create event"}
                                </WorkspaceButton>{" "}
                              </WorkspaceForm>{" "}
                            </div>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h3>{"New task modal"}</h3>{" "}
                      <div
                        className={
                          "pn-modal pn-modal-blur pn-fade pn-position-relative pn-rounded pn-d-block pn-bg-surface-backdrop pn-py-6 pn-w-auto pn-h-auto pn-z-0 pn-show"
                        }
                        id={"modal-new-task"}
                        tabIndex={-1}
                        role={"dialog"}
                        aria-modal={"true"}
                        aria-labelledby={"modal-new-task-title"}
                      >
                        {" "}
                        <div
                          className={"pn-modal-dialog pn-modal-dialog-centered"}
                        >
                          {" "}
                          <div className={"pn-modal-content"}>
                            {" "}
                            <div className={"pn-modal-header"}>
                              {" "}
                              <h4
                                className={"pn-modal-title"}
                                id={"modal-new-task-title"}
                              >
                                {"New task"}
                              </h4>{" "}
                              <WorkspaceAction
                                type={"button"}
                                className={"pn-btn-close"}
                                aria-label={"Close"}
                                action={"dismiss"}
                              ></WorkspaceAction>{" "}
                            </div>{" "}
                            <div className={"pn-modal-body"}>
                              {" "}
                              <WorkspaceForm>
                                {" "}
                                <div className={"pn-mb-4"}>
                                  {" "}
                                  <label
                                    className={"pn-form-label"}
                                    htmlFor={"task-name"}
                                  >
                                    {" Task name "}
                                  </label>{" "}
                                  <WorkspaceInput
                                    className={"pn-form-control"}
                                    id={"task-name"}
                                    type={"text"}
                                    placeholder={"Enter task name"}
                                  />{" "}
                                </div>{" "}
                                <div className={"pn-mb-4"}>
                                  {" "}
                                  <label
                                    className={"pn-form-label"}
                                    htmlFor={"task-description"}
                                  >
                                    {" Description "}
                                  </label>{" "}
                                  <WorkspaceTextarea
                                    className={"pn-form-control"}
                                    id={"task-description"}
                                    rows={3}
                                    placeholder={"Enter task description"}
                                    defaultValue={""}
                                  />{" "}
                                </div>{" "}
                                <div className={"pn-row"}>
                                  {" "}
                                  <div className={"pn-col-md-6"}>
                                    {" "}
                                    <div className={"pn-mb-4"}>
                                      {" "}
                                      <label
                                        className={"pn-form-label"}
                                        htmlFor={"select-task-assigned"}
                                      >
                                        {" Assigned to "}
                                      </label>{" "}
                                      <WorkspaceSelect
                                        className={"pn-form-select"}
                                        id={"select-task-assigned"}
                                        defaultValue={"4"}
                                      >
                                        <option
                                          value={"1"}
                                          data-custom-properties={
                                            '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/000m.jpg)"></span>'
                                          }
                                        >
                                          {"Maya Okafor"}
                                        </option>
                                        <option
                                          value={"2"}
                                          data-custom-properties={
                                            '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/052f.jpg)"></span>'
                                          }
                                        >
                                          {"Samir Haddad"}
                                        </option>
                                        <option
                                          value={"3"}
                                          data-custom-properties={
                                            '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/002m.jpg)"></span>'
                                          }
                                        >
                                          {"Ines Duarte"}
                                        </option>
                                        <option
                                          value={"4"}
                                          data-custom-properties={
                                            '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/003m.jpg)"></span>'
                                          }
                                        >
                                          {"Alina Petrova"}
                                        </option>
                                        <option
                                          value={"5"}
                                          data-custom-properties={
                                            '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/000f.jpg)"></span>'
                                          }
                                        >
                                          {"Nora Jensen"}
                                        </option>
                                        <option
                                          value={"6"}
                                          data-custom-properties={
                                            '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/001f.jpg)"></span>'
                                          }
                                        >
                                          {"June Park"}
                                        </option>
                                        <option
                                          value={"7"}
                                          data-custom-properties={
                                            '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/004m.jpg)"></span>'
                                          }
                                        >
                                          {"Tomas Silva"}
                                        </option>
                                        <option
                                          value={"8"}
                                          data-custom-properties={
                                            '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/002f.jpg)"></span>'
                                          }
                                        >
                                          {"Alina Petrova"}
                                        </option>
                                        <option
                                          value={"9"}
                                          data-custom-properties={
                                            '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/003f.jpg)"></span>'
                                          }
                                        >
                                          {"Tomas Silva"}
                                        </option>
                                        <option
                                          value={"10"}
                                          data-custom-properties={
                                            '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/063m.jpg)"></span>'
                                          }
                                        >
                                          {"Nora Jensen"}
                                        </option>
                                        <option
                                          value={"11"}
                                          data-custom-properties={
                                            '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/006m.jpg)"></span>'
                                          }
                                        >
                                          {"Lorry Mion"}
                                        </option>
                                        <option
                                          value={"12"}
                                          data-custom-properties={
                                            '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/004f.jpg)"></span>'
                                          }
                                        >
                                          {"Maya Okafor"}
                                        </option>
                                        <option
                                          value={"13"}
                                          data-custom-properties={
                                            '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/007m.jpg)"></span>'
                                          }
                                        >
                                          {"Leo Nakamura"}
                                        </option>
                                        <option
                                          value={"14"}
                                          data-custom-properties={
                                            '<span class="avatar avatar-xs">SA</span>'
                                          }
                                        >
                                          {"Ines Duarte"}
                                        </option>
                                        <option
                                          value={"15"}
                                          data-custom-properties={
                                            '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/009m.jpg)"></span>'
                                          }
                                        >
                                          {"Samir Haddad"}
                                        </option>
                                        <option
                                          value={"16"}
                                          data-custom-properties={
                                            '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/010m.jpg)"></span>'
                                          }
                                        >
                                          {"June Park"}
                                        </option>
                                        <option
                                          value={"17"}
                                          data-custom-properties={
                                            '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/005f.jpg)"></span>'
                                          }
                                        >
                                          {"Alina Petrova"}
                                        </option>
                                        <option
                                          value={"18"}
                                          data-custom-properties={
                                            '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/006f.jpg)"></span>'
                                          }
                                        >
                                          {"Tomas Silva"}
                                        </option>
                                        <option
                                          value={"19"}
                                          data-custom-properties={
                                            '<span class="avatar avatar-xs">AA</span>'
                                          }
                                        >
                                          {"Nora Jensen"}
                                        </option>
                                        <option
                                          value={"20"}
                                          data-custom-properties={
                                            '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/008f.jpg)"></span>'
                                          }
                                        >
                                          {"Maya Okafor"}
                                        </option>
                                      </WorkspaceSelect>{" "}
                                    </div>{" "}
                                  </div>{" "}
                                  <div className={"pn-col-md-6"}>
                                    {" "}
                                    <div className={"pn-mb-4"}>
                                      {" "}
                                      <label
                                        className={"pn-form-label"}
                                        htmlFor={"task-priority"}
                                      >
                                        {" Priority "}
                                      </label>{" "}
                                      <WorkspaceSelect
                                        className={"pn-form-select"}
                                        id={"task-priority"}
                                        defaultValue={"medium"}
                                      >
                                        <option value={"low"}>{"Low"}</option>
                                        <option value={"medium"}>
                                          {"Medium"}
                                        </option>
                                        <option value={"high"}>{"High"}</option>
                                      </WorkspaceSelect>{" "}
                                    </div>{" "}
                                  </div>{" "}
                                </div>{" "}
                                <div className={"pn-row"}>
                                  {" "}
                                  <div className={"pn-col-md-6"}>
                                    {" "}
                                    <div className={"pn-mb-4"}>
                                      {" "}
                                      <label
                                        className={"pn-form-label"}
                                        htmlFor={"datepicker-task-due-date"}
                                      >
                                        {" Due date "}
                                      </label>{" "}
                                      <div className={"pn-input-icon"}>
                                        {" "}
                                        <WorkspaceInput
                                          className={"pn-form-control"}
                                          placeholder={"Select a date"}
                                          id={"datepicker-task-due-date"}
                                          defaultValue={"2020-06-20"}
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
                                              d={
                                                "M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12"
                                              }
                                            ></path>{" "}
                                            <path d={"M16 3v4"}></path>{" "}
                                            <path d={"M8 3v4"}></path>{" "}
                                            <path d={"M4 11h16"}></path>{" "}
                                            <path d={"M11 15h1"}></path>{" "}
                                            <path d={"M12 15v3"}></path>
                                          </svg>
                                        </span>{" "}
                                      </div>{" "}
                                    </div>{" "}
                                  </div>{" "}
                                  <div className={"pn-col-md-6"}>
                                    {" "}
                                    <div className={"pn-mb-4"}>
                                      {" "}
                                      <label
                                        className={"pn-form-label"}
                                        htmlFor={"select-task-category"}
                                      >
                                        {" Category / Tags "}
                                      </label>{" "}
                                      <WorkspaceSelect
                                        className={"pn-form-select"}
                                        id={"select-task-category"}
                                        multiple
                                        defaultValue={"HTML"}
                                      >
                                        <option value={"HTML"}>{"HTML"}</option>
                                        <option value={"JavaScript"}>
                                          {"JavaScript"}
                                        </option>
                                        <option value={"CSS"}>{"CSS"}</option>
                                        <option value={"jQuery"}>
                                          {"jQuery"}
                                        </option>
                                        <option value={"TypeScript"}>
                                          {"TypeScript"}
                                        </option>
                                        <option value={"Ruby"}>{"Ruby"}</option>
                                        <option value={"Python"}>
                                          {"Python"}
                                        </option>
                                      </WorkspaceSelect>{" "}
                                    </div>{" "}
                                  </div>{" "}
                                </div>{" "}
                                <WorkspaceButton
                                  type={"submit"}
                                  className={
                                    "pn-btn pn-btn-primary pn-mt-4 pn-w-100"
                                  }
                                >
                                  {"Create task"}
                                </WorkspaceButton>{" "}
                              </WorkspaceForm>{" "}
                            </div>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h3>{"Edit profile modal"}</h3>{" "}
                      <div
                        className={
                          "pn-modal pn-modal-blur pn-fade pn-position-relative pn-rounded pn-d-block pn-bg-surface-backdrop pn-py-6 pn-w-auto pn-h-auto pn-z-0 pn-show"
                        }
                        id={"modal-edit-profile"}
                        tabIndex={-1}
                        role={"dialog"}
                        aria-modal={"true"}
                        aria-labelledby={"modal-edit-profile-title"}
                      >
                        {" "}
                        <div
                          className={
                            "pn-modal-dialog pn-modal-lg pn-modal-dialog-centered"
                          }
                        >
                          {" "}
                          <div className={"pn-modal-content"}>
                            {" "}
                            <div className={"pn-modal-header"}>
                              {" "}
                              <h4
                                className={"pn-modal-title"}
                                id={"modal-edit-profile-title"}
                              >
                                {"Edit profile"}
                              </h4>{" "}
                              <WorkspaceAction
                                type={"button"}
                                className={"pn-btn-close"}
                                aria-label={"Close"}
                                action={"dismiss"}
                              ></WorkspaceAction>{" "}
                            </div>{" "}
                            <div className={"pn-modal-body"}>
                              {" "}
                              <WorkspaceForm>
                                {" "}
                                <div className={"pn-mb-4"}>
                                  {" "}
                                  <div className={"pn-row pn-align-items-end"}>
                                    {" "}
                                    <div className={"pn-col-auto"}>
                                      {" "}
                                      <WorkspaceLink
                                        href={"#"}
                                        className={
                                          "pn-avatar pn-avatar-upload pn-rounded pn-avatar-lg"
                                        }
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
                                    </div>{" "}
                                    <div className={"pn-col"}>
                                      {" "}
                                      <label className={"pn-form-label"}>
                                        {"Avatar"}
                                      </label>{" "}
                                      <div className={"pn-text-secondary"}>
                                        {"Click to upload a new avatar"}
                                      </div>{" "}
                                    </div>{" "}
                                  </div>{" "}
                                </div>{" "}
                                <div className={"pn-row"}>
                                  {" "}
                                  <div className={"pn-col-md-6"}>
                                    {" "}
                                    <div className={"pn-mb-4"}>
                                      {" "}
                                      <label
                                        className={"pn-form-label"}
                                        htmlFor={"profile-first-name"}
                                      >
                                        {" First name "}
                                      </label>{" "}
                                      <WorkspaceInput
                                        className={"pn-form-control"}
                                        id={"profile-first-name"}
                                        type={"text"}
                                        placeholder={"John"}
                                      />{" "}
                                    </div>{" "}
                                  </div>{" "}
                                  <div className={"pn-col-md-6"}>
                                    {" "}
                                    <div className={"pn-mb-4"}>
                                      {" "}
                                      <label
                                        className={"pn-form-label"}
                                        htmlFor={"profile-last-name"}
                                      >
                                        {" Last name "}
                                      </label>{" "}
                                      <WorkspaceInput
                                        className={"pn-form-control"}
                                        id={"profile-last-name"}
                                        type={"text"}
                                        placeholder={"Doe"}
                                      />{" "}
                                    </div>{" "}
                                  </div>{" "}
                                </div>{" "}
                                <div className={"pn-mb-4"}>
                                  {" "}
                                  <label
                                    className={"pn-form-label"}
                                    htmlFor={"profile-email"}
                                  >
                                    {" Email "}
                                  </label>{" "}
                                  <WorkspaceInput
                                    className={"pn-form-control"}
                                    id={"profile-email"}
                                    type={"email"}
                                    placeholder={"john.doe@example.com"}
                                  />{" "}
                                </div>{" "}
                                <div className={"pn-mb-4"}>
                                  {" "}
                                  <label
                                    className={"pn-form-label"}
                                    htmlFor={"profile-phone"}
                                  >
                                    {" Phone "}
                                  </label>{" "}
                                  <WorkspaceInput
                                    className={"pn-form-control"}
                                    id={"profile-phone"}
                                    type={"tel"}
                                    placeholder={"+1 (555) 123-4567"}
                                  />{" "}
                                </div>{" "}
                                <div className={"pn-mb-4"}>
                                  {" "}
                                  <label
                                    className={"pn-form-label"}
                                    htmlFor={"profile-bio"}
                                  >
                                    {" Bio "}
                                  </label>{" "}
                                  <WorkspaceTextarea
                                    className={"pn-form-control"}
                                    id={"profile-bio"}
                                    rows={4}
                                    placeholder={"Tell us about yourself..."}
                                    defaultValue={""}
                                  />{" "}
                                </div>{" "}
                                <div className={"pn-row"}>
                                  {" "}
                                  <div className={"pn-col-md-6"}>
                                    {" "}
                                    <div className={"pn-mb-4"}>
                                      {" "}
                                      <label
                                        className={"pn-form-label"}
                                        htmlFor={"profile-location"}
                                      >
                                        {" Location "}
                                      </label>{" "}
                                      <WorkspaceInput
                                        className={"pn-form-control"}
                                        id={"profile-location"}
                                        type={"text"}
                                        placeholder={"City, Country"}
                                      />{" "}
                                    </div>{" "}
                                  </div>{" "}
                                  <div className={"pn-col-md-6"}>
                                    {" "}
                                    <div className={"pn-mb-4"}>
                                      {" "}
                                      <label
                                        className={"pn-form-label"}
                                        htmlFor={"datepicker-profile-birthdate"}
                                      >
                                        {" Date of birth "}
                                      </label>{" "}
                                      <div className={"pn-input-icon"}>
                                        {" "}
                                        <WorkspaceInput
                                          className={"pn-form-control"}
                                          placeholder={"Select a date"}
                                          id={"datepicker-profile-birthdate"}
                                          defaultValue={"2020-06-20"}
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
                                              d={
                                                "M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12"
                                              }
                                            ></path>{" "}
                                            <path d={"M16 3v4"}></path>{" "}
                                            <path d={"M8 3v4"}></path>{" "}
                                            <path d={"M4 11h16"}></path>{" "}
                                            <path d={"M11 15h1"}></path>{" "}
                                            <path d={"M12 15v3"}></path>
                                          </svg>
                                        </span>{" "}
                                      </div>{" "}
                                    </div>{" "}
                                  </div>{" "}
                                </div>{" "}
                                <div className={"pn-mb-4"}>
                                  {" "}
                                  <div className={"pn-form-label"}>
                                    {"Social links"}
                                  </div>{" "}
                                  <div className={"pn-row pn-g-2"}>
                                    {" "}
                                    <div className={"pn-col-12"}>
                                      {" "}
                                      <div className={"pn-input-group"}>
                                        {" "}
                                        <span className={"pn-input-group-text"}>
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
                                        </span>{" "}
                                        <WorkspaceInput
                                          type={"text"}
                                          className={"pn-form-control"}
                                          placeholder={"twitter.com/username"}
                                        />{" "}
                                      </div>{" "}
                                    </div>{" "}
                                    <div className={"pn-col-12"}>
                                      {" "}
                                      <div className={"pn-input-group"}>
                                        {" "}
                                        <span className={"pn-input-group-text"}>
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
                                        </span>{" "}
                                        <WorkspaceInput
                                          type={"text"}
                                          className={"pn-form-control"}
                                          placeholder={"github.com/username"}
                                        />{" "}
                                      </div>{" "}
                                    </div>{" "}
                                    <div className={"pn-col-12"}>
                                      {" "}
                                      <div className={"pn-input-group"}>
                                        {" "}
                                        <span className={"pn-input-group-text"}>
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
                                            <path d={"M8 11v5"}></path>{" "}
                                            <path d={"M8 8v.01"}></path>{" "}
                                            <path d={"M12 16v-5"}></path>{" "}
                                            <path
                                              d={"M16 16v-3a2 2 0 1 0 -4 0"}
                                            ></path>{" "}
                                            <path
                                              d={
                                                "M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10"
                                              }
                                            ></path>
                                          </svg>
                                        </span>{" "}
                                        <WorkspaceInput
                                          type={"text"}
                                          className={"pn-form-control"}
                                          placeholder={
                                            "linkedin.com/in/username"
                                          }
                                        />{" "}
                                      </div>{" "}
                                    </div>{" "}
                                  </div>{" "}
                                </div>{" "}
                                <WorkspaceButton
                                  type={"submit"}
                                  className={
                                    "pn-btn pn-btn-primary pn-mt-4 pn-w-100"
                                  }
                                >
                                  {"Save changes"}
                                </WorkspaceButton>{" "}
                              </WorkspaceForm>{" "}
                            </div>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h3>{"Confirm delete modal"}</h3>{" "}
                      <div
                        className={
                          "pn-modal pn-modal-blur pn-fade pn-position-relative pn-rounded pn-d-block pn-bg-surface-backdrop pn-py-6 pn-w-auto pn-h-auto pn-z-0 pn-show"
                        }
                        id={"modal-confirm-delete"}
                        tabIndex={-1}
                        role={"dialog"}
                        aria-modal={"true"}
                        aria-labelledby={"modal-confirm-delete-title"}
                      >
                        {" "}
                        <div
                          className={
                            "pn-modal-dialog pn-modal-sm pn-modal-dialog-centered"
                          }
                        >
                          {" "}
                          <div className={"pn-modal-content"}>
                            {" "}
                            <WorkspaceAction
                              type={"button"}
                              className={"pn-btn-close"}
                              aria-label={"Close"}
                              action={"dismiss"}
                            ></WorkspaceAction>{" "}
                            <div className={"pn-modal-status pn-bg-danger"}></div>{" "}
                            <div
                              className={"pn-modal-body pn-text-center pn-py-4"}
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
                                className={
                                  "pn-icon pn-mb-2 pn-text-danger pn-icon-lg"
                                }
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
                              <h3 id={"modal-confirm-delete-title"}>
                                {"Are you sure?"}
                              </h3>{" "}
                              <div className={"pn-text-secondary pn-mb-4"}>
                                {" "}
                                <p id={"confirm-delete-message"}>
                                  {
                                    "Do you really want to delete this item? This action cannot be undone."
                                  }
                                </p>{" "}
                                <div
                                  id={"confirm-delete-items"}
                                  className={"pn-text-start pn-d-none"}
                                >
                                  {" "}
                                  <Card className={"pn-card pn-card-sm pn-mt-3"}>
                                    {" "}
                                    <CardContent className={"pn-card-body"}>
                                      {" "}
                                      <div className={"pn-fw-bold pn-mb-2"}>
                                        {"Items to be deleted:"}
                                      </div>{" "}
                                      <ul
                                        className={"pn-list-unstyled pn-mb-0"}
                                        id={"confirm-delete-list"}
                                      >
                                        {" "}
                                        <li>{"• Item 1"}</li>{" "}
                                        <li>{"• Item 2"}</li>{" "}
                                        <li>{"• Item 3"}</li>{" "}
                                      </ul>{" "}
                                    </CardContent>{" "}
                                  </Card>{" "}
                                </div>{" "}
                              </div>{" "}
                              <label className={"pn-form-check pn-text-start"}>
                                {" "}
                                <WorkspaceInput
                                  className={"pn-form-check-input"}
                                  type={"checkbox"}
                                  id={"confirm-delete-checkbox"}
                                />{" "}
                                <span className={"pn-form-check-label"}>
                                  {"I understand this action cannot be undone"}
                                </span>{" "}
                              </label>{" "}
                            </div>{" "}
                            <div className={"pn-modal-footer"}>
                              {" "}
                              <div className={"pn-w-100"}>
                                {" "}
                                <div className={"pn-row"}>
                                  {" "}
                                  <div className={"pn-col"}>
                                    <WorkspaceAction
                                      type={"button"}
                                      className={"pn-btn pn-w-100"}
                                      action={"dismiss"}
                                    >
                                      {"Cancel"}
                                    </WorkspaceAction>
                                  </div>{" "}
                                  <div className={"pn-col"}>
                                    {" "}
                                    <WorkspaceAction
                                      type={"button"}
                                      className={"pn-btn pn-btn-danger pn-w-100"}
                                      id={"confirm-delete-button"}
                                      disabled
                                      action={"dismiss"}
                                    >
                                      {"Delete"}
                                    </WorkspaceAction>{" "}
                                  </div>{" "}
                                </div>{" "}
                              </div>{" "}
                            </div>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h3>{"Change password modal"}</h3>{" "}
                      <div
                        className={
                          "pn-modal pn-modal-blur pn-fade pn-position-relative pn-rounded pn-d-block pn-bg-surface-backdrop pn-py-6 pn-w-auto pn-h-auto pn-z-0 pn-show"
                        }
                        id={"modal-change-password"}
                        tabIndex={-1}
                        role={"dialog"}
                        aria-modal={"true"}
                        aria-labelledby={"modal-change-password-title"}
                      >
                        {" "}
                        <div
                          className={"pn-modal-dialog pn-modal-dialog-centered"}
                        >
                          {" "}
                          <div className={"pn-modal-content"}>
                            {" "}
                            <div className={"pn-modal-header"}>
                              {" "}
                              <h4
                                className={"pn-modal-title"}
                                id={"modal-change-password-title"}
                              >
                                {"Change password"}
                              </h4>{" "}
                              <WorkspaceAction
                                type={"button"}
                                className={"pn-btn-close"}
                                aria-label={"Close"}
                                action={"dismiss"}
                              ></WorkspaceAction>{" "}
                            </div>{" "}
                            <div className={"pn-modal-body"}>
                              {" "}
                              <WorkspaceForm>
                                {" "}
                                <div className={"pn-mb-4"}>
                                  {" "}
                                  <label
                                    className={"pn-form-label"}
                                    htmlFor={"password-current"}
                                  >
                                    {" Current password "}
                                  </label>{" "}
                                  <div
                                    className={
                                      "pn-input-group pn-input-group-flat"
                                    }
                                  >
                                    {" "}
                                    <WorkspaceInput
                                      type={"password"}
                                      className={"pn-form-control"}
                                      placeholder={
                                        "Enter your current password"
                                      }
                                      autoComplete={"current-password"}
                                      id={"password-current"}
                                    />{" "}
                                    <span className={"pn-input-group-text"}>
                                      {" "}
                                      <WorkspaceButton
                                        type={"button"}
                                        className={
                                          "pn-link-secondary pn-input-group-link pn-border-0 pn-bg-transparent pn-p-0"
                                        }
                                        title={"Show password"}
                                        aria-label={"Show password"}
                                        aria-pressed={"false"}
                                        data-password-toggle={
                                          "password-current"
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
                                          className={
                                            "pn-icon pn-icon-toggle-show"
                                          }
                                        >
                                          {" "}
                                          <path
                                            d={
                                              "M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"
                                            }
                                          ></path>{" "}
                                          <path
                                            d={
                                              "M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"
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
                                          className={
                                            "pn-icon pn-icon-toggle-hide pn-d-none"
                                          }
                                        >
                                          {" "}
                                          <path
                                            d={
                                              "M10.585 10.587a2 2 0 0 0 2.829 2.828"
                                            }
                                          ></path>{" "}
                                          <path
                                            d={
                                              "M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87"
                                            }
                                          ></path>{" "}
                                          <path d={"M3 3l18 18"}></path>{" "}
                                        </svg>{" "}
                                      </WorkspaceButton>{" "}
                                    </span>{" "}
                                  </div>{" "}
                                </div>{" "}
                                <div className={"pn-mb-4"}>
                                  {" "}
                                  <label
                                    className={"pn-form-label"}
                                    htmlFor={"password-new"}
                                  >
                                    {" New password "}
                                  </label>{" "}
                                  <div
                                    className={
                                      "pn-input-group pn-input-group-flat"
                                    }
                                  >
                                    {" "}
                                    <WorkspaceInput
                                      type={"password"}
                                      className={"pn-form-control"}
                                      placeholder={"Enter new password"}
                                      autoComplete={"new-password"}
                                      id={"password-new"}
                                    />{" "}
                                    <span className={"pn-input-group-text"}>
                                      {" "}
                                      <WorkspaceButton
                                        type={"button"}
                                        className={
                                          "pn-link-secondary pn-input-group-link pn-border-0 pn-bg-transparent pn-p-0"
                                        }
                                        title={"Show password"}
                                        aria-label={"Show password"}
                                        aria-pressed={"false"}
                                        data-password-toggle={"password-new"}
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
                                          className={
                                            "pn-icon pn-icon-toggle-show"
                                          }
                                        >
                                          {" "}
                                          <path
                                            d={
                                              "M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"
                                            }
                                          ></path>{" "}
                                          <path
                                            d={
                                              "M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"
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
                                          className={
                                            "pn-icon pn-icon-toggle-hide pn-d-none"
                                          }
                                        >
                                          {" "}
                                          <path
                                            d={
                                              "M10.585 10.587a2 2 0 0 0 2.829 2.828"
                                            }
                                          ></path>{" "}
                                          <path
                                            d={
                                              "M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87"
                                            }
                                          ></path>{" "}
                                          <path d={"M3 3l18 18"}></path>{" "}
                                        </svg>{" "}
                                      </WorkspaceButton>{" "}
                                    </span>{" "}
                                  </div>{" "}
                                  <small className={"pn-form-hint"}>
                                    {
                                      " Use at least eight characters. This demo does not store passwords. "
                                    }
                                  </small>{" "}
                                  <div className={"pn-mt-2"}>
                                    {" "}
                                    <div
                                      className={"pn-progress"}
                                      style={{ height: "4px" } as CSSProperties}
                                    >
                                      {" "}
                                      <div
                                        className={"pn-progress-bar"}
                                        id={"password-strength"}
                                        role={"progressbar"}
                                        style={{ width: "0%" } as CSSProperties}
                                        aria-label={"Password strength"}
                                        aria-valuemin={0}
                                        aria-valuemax={5}
                                        aria-valuenow={0}
                                      ></div>{" "}
                                    </div>{" "}
                                    <div
                                      className={
                                        "pn-text-secondary pn-small pn-mt-1"
                                      }
                                      id={"password-strength-text"}
                                      aria-live={"polite"}
                                    ></div>{" "}
                                  </div>{" "}
                                </div>{" "}
                                <div className={"pn-mb-4"}>
                                  {" "}
                                  <label
                                    className={"pn-form-label"}
                                    htmlFor={"password-confirm"}
                                  >
                                    {" Confirm new password "}
                                  </label>{" "}
                                  <div
                                    className={
                                      "pn-input-group pn-input-group-flat"
                                    }
                                  >
                                    {" "}
                                    <WorkspaceInput
                                      type={"password"}
                                      className={"pn-form-control"}
                                      placeholder={"Confirm your new password"}
                                      autoComplete={"new-password"}
                                      id={"password-confirm"}
                                    />{" "}
                                    <span className={"pn-input-group-text"}>
                                      {" "}
                                      <WorkspaceButton
                                        type={"button"}
                                        className={
                                          "pn-link-secondary pn-input-group-link pn-border-0 pn-bg-transparent pn-p-0"
                                        }
                                        title={"Show password"}
                                        aria-label={"Show password"}
                                        aria-pressed={"false"}
                                        data-password-toggle={
                                          "password-confirm"
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
                                          className={
                                            "pn-icon pn-icon-toggle-show"
                                          }
                                        >
                                          {" "}
                                          <path
                                            d={
                                              "M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"
                                            }
                                          ></path>{" "}
                                          <path
                                            d={
                                              "M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"
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
                                          className={
                                            "pn-icon pn-icon-toggle-hide pn-d-none"
                                          }
                                        >
                                          {" "}
                                          <path
                                            d={
                                              "M10.585 10.587a2 2 0 0 0 2.829 2.828"
                                            }
                                          ></path>{" "}
                                          <path
                                            d={
                                              "M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87"
                                            }
                                          ></path>{" "}
                                          <path d={"M3 3l18 18"}></path>{" "}
                                        </svg>{" "}
                                      </WorkspaceButton>{" "}
                                    </span>{" "}
                                  </div>{" "}
                                  <div
                                    className={"pn-invalid-feedback pn-d-none"}
                                    id={"password-match-error"}
                                    role={"alert"}
                                  >
                                    {"Passwords do not match."}
                                  </div>{" "}
                                </div>{" "}
                                <WorkspaceButton
                                  type={"submit"}
                                  className={
                                    "pn-btn pn-btn-primary pn-mt-4 pn-w-100"
                                  }
                                >
                                  {"Update password"}
                                </WorkspaceButton>{" "}
                              </WorkspaceForm>{" "}
                            </div>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h3>{"Add task modal"}</h3>{" "}
                      <div
                        className={
                          "pn-modal pn-modal-blur pn-fade pn-position-relative pn-rounded pn-d-block pn-bg-surface-backdrop pn-py-6 pn-w-auto pn-h-auto pn-z-0 pn-show"
                        }
                        id={"modal-add-task"}
                        tabIndex={-1}
                        role={"dialog"}
                        aria-modal={"true"}
                        aria-labelledby={"modal-add-task-title"}
                      >
                        {" "}
                        <div
                          className={"pn-modal-dialog pn-modal-dialog-centered"}
                        >
                          {" "}
                          <div className={"pn-modal-content"}>
                            {" "}
                            <div className={"pn-modal-header"}>
                              {" "}
                              <h4
                                className={"pn-modal-title"}
                                id={"modal-add-task-title"}
                              >
                                {"Add task"}
                              </h4>{" "}
                              <WorkspaceAction
                                type={"button"}
                                className={"pn-btn-close"}
                                aria-label={"Close"}
                                action={"dismiss"}
                              ></WorkspaceAction>{" "}
                            </div>{" "}
                            <div className={"pn-modal-body"}>
                              {" "}
                              <WorkspaceForm>
                                {" "}
                                <div className={"pn-mb-3"}>
                                  {" "}
                                  <label
                                    className={"pn-form-label"}
                                    htmlFor={"add-task-name"}
                                  >
                                    {" Name "}
                                  </label>{" "}
                                  <WorkspaceInput
                                    type={"text"}
                                    className={"pn-form-control"}
                                    id={"add-task-name"}
                                    placeholder={"Task name"}
                                  />{" "}
                                </div>{" "}
                                <div className={"pn-mb-3"}>
                                  {" "}
                                  <label
                                    className={"pn-form-label"}
                                    htmlFor={"add-task-assigned"}
                                  >
                                    {" Assigned To "}
                                  </label>{" "}
                                  <WorkspaceSelect
                                    className={"pn-form-select"}
                                    id={"add-task-assigned"}
                                  >
                                    <option value={""}>
                                      {"Select person"}
                                    </option>
                                    <option value={"5"}>{"Nora Jensen"}</option>
                                    <option value={"6"}>
                                      {"June Park"}
                                    </option>
                                    <option value={"2"}>
                                      {"Samir Haddad"}
                                    </option>
                                    <option value={"3"}>
                                      {"Ines Duarte"}
                                    </option>
                                  </WorkspaceSelect>{" "}
                                </div>{" "}
                                <div className={"pn-mb-3"}>
                                  {" "}
                                  <label
                                    className={"pn-form-label"}
                                    htmlFor={"add-task-priority"}
                                  >
                                    {" Priority "}
                                  </label>{" "}
                                  <WorkspaceSelect
                                    className={"pn-form-select"}
                                    id={"add-task-priority"}
                                  >
                                    <option value={"Low"}>{"Low"}</option>
                                    <option value={"Medium"}>{"Medium"}</option>
                                    <option value={"High"}>{"High"}</option>
                                  </WorkspaceSelect>{" "}
                                </div>{" "}
                                <div className={"pn-mb-3"}>
                                  {" "}
                                  <label
                                    className={"pn-form-label"}
                                    htmlFor={"add-task-description"}
                                  >
                                    {" Description "}
                                  </label>{" "}
                                  <WorkspaceTextarea
                                    className={"pn-form-control"}
                                    id={"add-task-description"}
                                    rows={3}
                                    placeholder={"Task description"}
                                    defaultValue={""}
                                  />{" "}
                                </div>{" "}
                              </WorkspaceForm>{" "}
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
                              <WorkspaceAction
                                type={"button"}
                                className={"pn-btn pn-btn-primary pn-ms-auto"}
                                action={"dismiss"}
                              >
                                {"Save"}
                              </WorkspaceAction>{" "}
                            </div>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </CardContent>{" "}
          </Card>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  )
}
