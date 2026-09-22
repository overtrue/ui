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
    <div data-workspace-page="pagination" className="pn-page-wrapper">
      {" "}
      <div className={"pn-page-header pn-d-print-none"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-g-2 pn-align-items-center"}>
            {" "}
            <div className={"pn-col"}>
              {" "}
              <h1 className={"pn-page-title"}>{"Pagination"}</h1>{" "}
              <div className={"pn-text-secondary pn-mt-1"}>
                {
                  "Move through a long collection without losing context."
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
            <div className={"pn-col-12"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Numbered"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Page numbers, with or without Prev/Next text labels ("}
                    <code>{"page-text"}</code>
                    {")."}
                  </CardDescription>{" "}
                  <nav aria-label={"Pagination"}>
                    {" "}
                    <ul className={"pn-pagination"}>
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
                          className={"pn-page-link pn-page-text"}
                          href={"#"}
                        >
                          {" Next "}
                        </WorkspaceLink>{" "}
                      </li>{" "}
                    </ul>{" "}
                  </nav>{" "}
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
                    {"With descriptions"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Name the adjacent page with "}
                    <code>{"page-item-subtitle"}</code>
                    {" for the direction and "}
                    <code>{"page-item-title"}</code>
                    {" for the page name."}
                  </CardDescription>{" "}
                  <nav aria-label={"Pagination"}>
                    {" "}
                    <ul className={"pn-pagination"}>
                      {" "}
                      <li className={"pn-page-item pn-page-prev pn-disabled"}>
                        {" "}
                        <WorkspaceLink
                          className={"pn-page-link"}
                          href={"#"}
                          tabIndex={-1}
                          aria-disabled={"true"}
                        >
                          {" "}
                          <div className={"pn-page-item-subtitle"}>
                            {"previous"}
                          </div>{" "}
                          <div className={"pn-page-item-title"}>
                            {"Getting started"}
                          </div>{" "}
                        </WorkspaceLink>{" "}
                      </li>{" "}
                      <li className={"pn-page-item pn-page-next"}>
                        {" "}
                        <WorkspaceLink className={"pn-page-link"} href={"#"}>
                          {" "}
                          <div className={"pn-page-item-subtitle"}>
                            {"next"}
                          </div>{" "}
                          <div className={"pn-page-item-title"}>
                            {"Breadcrumbs"}
                          </div>{" "}
                        </WorkspaceLink>{" "}
                      </li>{" "}
                    </ul>{" "}
                  </nav>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  )
}
