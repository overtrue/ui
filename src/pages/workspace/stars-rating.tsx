import { WorkspaceRating } from "@/components/overtrue/workspace/plugins"
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
    <div data-workspace-page="stars-rating" className="pn-page-wrapper">
      {" "}
      <div className={"pn-page-header pn-d-print-none"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-g-2 pn-align-items-center"}>
            {" "}
            <div className={"pn-col"}>
              {" "}
              <h1 className={"pn-page-title"}>{"Star Ratings"}</h1>{" "}
              <div className={"pn-text-secondary pn-mt-1"}>
                {
                  "Collect a quick rating after a project review. Each control keeps its own selection and supports keyboard input."
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
                    {"Basic"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Click a star to set the value."}
                  </CardDescription>{" "}
                  <WorkspaceRating id={"rating-basic"} defaultValue={"4"}>
                    <option value={""}>{"Select a rating"}</option>
                    <option value={"5"}>{"Excellent"}</option>
                    <option value={"4"}>{"Very Good"}</option>
                    <option value={"3"}>{"Average"}</option>
                    <option value={"2"}>{"Poor"}</option>
                    <option value={"1"}>{"Terrible"}</option>
                  </WorkspaceRating>{" "}
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
                    {"Icons"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {
                      "Swap the star for any icon by passing a different SVG to the "
                    }
                    <code>{"stars"}</code>
                    {" option."}
                  </CardDescription>{" "}
                  <div className={"pn-space-y"}>
                    {" "}
                    <WorkspaceRating id={"rating-icon-star"} defaultValue={"4"}>
                      <option value={""}>{"Select a rating"}</option>
                      <option value={"5"}>{"Excellent"}</option>
                      <option value={"4"}>{"Very Good"}</option>
                      <option value={"3"}>{"Average"}</option>
                      <option value={"2"}>{"Poor"}</option>
                      <option value={"1"}>{"Terrible"}</option>
                    </WorkspaceRating>{" "}
                    <WorkspaceRating id={"rating-icon-heart"} defaultValue={"4"}>
                      <option value={""}>{"Select a rating"}</option>
                      <option value={"5"}>{"Excellent"}</option>
                      <option value={"4"}>{"Very Good"}</option>
                      <option value={"3"}>{"Average"}</option>
                      <option value={"2"}>{"Poor"}</option>
                      <option value={"1"}>{"Terrible"}</option>
                    </WorkspaceRating>{" "}
                    <WorkspaceRating id={"rating-icon-ghost"} defaultValue={"4"}>
                      <option value={""}>{"Select a rating"}</option>
                      <option value={"5"}>{"Excellent"}</option>
                      <option value={"4"}>{"Very Good"}</option>
                      <option value={"3"}>{"Average"}</option>
                      <option value={"2"}>{"Poor"}</option>
                      <option value={"1"}>{"Terrible"}</option>
                    </WorkspaceRating>{" "}
                    <WorkspaceRating id={"rating-icon-circle"} defaultValue={"4"}>
                      <option value={""}>{"Select a rating"}</option>
                      <option value={"5"}>{"Excellent"}</option>
                      <option value={"4"}>{"Very Good"}</option>
                      <option value={"3"}>{"Average"}</option>
                      <option value={"2"}>{"Poor"}</option>
                      <option value={"1"}>{"Terrible"}</option>
                    </WorkspaceRating>{" "}
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
                    {"Sizes"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Match the rating to surrounding text with an "}
                    <code>{"icon-sm"}</code>
                    {" or "}
                    <code>{"icon-lg"}</code>
                    {" class on the star."}
                  </CardDescription>{" "}
                  <div className={"pn-space-y"}>
                    {" "}
                    <WorkspaceRating id={"rating-size-sm"} defaultValue={"3"}>
                      <option value={""}>{"Select a rating"}</option>
                      <option value={"5"}>{"Excellent"}</option>
                      <option value={"4"}>{"Very Good"}</option>
                      <option value={"3"}>{"Average"}</option>
                      <option value={"2"}>{"Poor"}</option>
                      <option value={"1"}>{"Terrible"}</option>
                    </WorkspaceRating>{" "}
                    <WorkspaceRating id={"rating-size-md"} defaultValue={"3"}>
                      <option value={""}>{"Select a rating"}</option>
                      <option value={"5"}>{"Excellent"}</option>
                      <option value={"4"}>{"Very Good"}</option>
                      <option value={"3"}>{"Average"}</option>
                      <option value={"2"}>{"Poor"}</option>
                      <option value={"1"}>{"Terrible"}</option>
                    </WorkspaceRating>{" "}
                    <WorkspaceRating id={"rating-size-lg"} defaultValue={"3"}>
                      <option value={""}>{"Select a rating"}</option>
                      <option value={"5"}>{"Excellent"}</option>
                      <option value={"4"}>{"Very Good"}</option>
                      <option value={"3"}>{"Average"}</option>
                      <option value={"2"}>{"Poor"}</option>
                      <option value={"1"}>{"Terrible"}</option>
                    </WorkspaceRating>{" "}
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
                    {"Colors"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Color the star with a "}
                    <code>{"text-*"}</code>
                    {
                      " class, any theme or extended color, to match the rest of the page."
                    }
                  </CardDescription>{" "}
                  <div className={"pn-space-y"}>
                    {" "}
                    <WorkspaceRating
                      id={"rating-color-default"}
                      defaultValue={"3"}
                    >
                      <option value={""}>{"Select a rating"}</option>
                      <option value={"5"}>{"Excellent"}</option>
                      <option value={"4"}>{"Very Good"}</option>
                      <option value={"3"}>{"Average"}</option>
                      <option value={"2"}>{"Poor"}</option>
                      <option value={"1"}>{"Terrible"}</option>
                    </WorkspaceRating>{" "}
                    <WorkspaceRating
                      id={"rating-color-primary"}
                      defaultValue={"3"}
                    >
                      <option value={""}>{"Select a rating"}</option>
                      <option value={"5"}>{"Excellent"}</option>
                      <option value={"4"}>{"Very Good"}</option>
                      <option value={"3"}>{"Average"}</option>
                      <option value={"2"}>{"Poor"}</option>
                      <option value={"1"}>{"Terrible"}</option>
                    </WorkspaceRating>{" "}
                    <WorkspaceRating id={"rating-color-red"} defaultValue={"3"}>
                      <option value={""}>{"Select a rating"}</option>
                      <option value={"5"}>{"Excellent"}</option>
                      <option value={"4"}>{"Very Good"}</option>
                      <option value={"3"}>{"Average"}</option>
                      <option value={"2"}>{"Poor"}</option>
                      <option value={"1"}>{"Terrible"}</option>
                    </WorkspaceRating>{" "}
                    <WorkspaceRating id={"rating-color-lime"} defaultValue={"3"}>
                      <option value={""}>{"Select a rating"}</option>
                      <option value={"5"}>{"Excellent"}</option>
                      <option value={"4"}>{"Very Good"}</option>
                      <option value={"3"}>{"Average"}</option>
                      <option value={"2"}>{"Poor"}</option>
                      <option value={"1"}>{"Terrible"}</option>
                    </WorkspaceRating>{" "}
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
