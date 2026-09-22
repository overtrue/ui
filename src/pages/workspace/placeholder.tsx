// Keep page composition editable; interaction belongs in the shared components.
import { Card, CardContent } from "@/components/ui/card"
import {
  WorkspaceButton,
  WorkspaceLink,
} from "@/components/overtrue/workspace/primitives"
export default function Page() {
  return (
    <div data-workspace-page="placeholder" className="pn-page-wrapper">
      {" "}
      <div className={"pn-page-header pn-d-print-none"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-g-2 pn-align-items-center"}>
            {" "}
            <div className={"pn-col"}>
              {" "}
              <h1 className={"pn-page-title"}>{"Placeholder"}</h1>{" "}
              <div className={"pn-text-secondary pn-mt-1"}>
                {
                  "Keep the shape of the page while its content arrives."
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
            <div className={"pn-col-6 pn-col-md-3"}>
              {" "}
              <Card className={"pn-card pn-placeholder-glow"}>
                {" "}
                <div
                  className={
                    "pn-ratio pn-ratio-21x9 pn-card-img-top pn-placeholder"
                  }
                ></div>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-placeholder pn-col-9 pn-mb-3"}></div>{" "}
                  <div
                    className={"pn-placeholder pn-placeholder-xs pn-col-10"}
                  ></div>{" "}
                  <div
                    className={"pn-placeholder pn-placeholder-xs pn-col-11"}
                  ></div>{" "}
                  <div className={"pn-mt-3"}>
                    {" "}
                    <WorkspaceButton
                      href={"#"}
                      tabIndex={-1}
                      className={
                        "pn-btn pn-btn-primary pn-disabled pn-placeholder pn-col-4"
                      }
                      aria-hidden={"true"}
                    ></WorkspaceButton>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-6 pn-col-md-3"}>
              {" "}
              <Card className={"pn-card pn-placeholder-glow"}>
                {" "}
                <div
                  className={
                    "pn-ratio pn-ratio-21x9 pn-card-img-top pn-placeholder"
                  }
                ></div>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-placeholder pn-col-9 pn-mb-3"}></div>{" "}
                  <div
                    className={"pn-placeholder pn-placeholder-xs pn-col-10"}
                  ></div>{" "}
                  <div
                    className={"pn-placeholder pn-placeholder-xs pn-col-11"}
                  ></div>{" "}
                  <div className={"pn-mt-3"}>
                    {" "}
                    <WorkspaceButton
                      href={"#"}
                      tabIndex={-1}
                      className={
                        "pn-btn pn-btn-primary pn-disabled pn-placeholder pn-col-4"
                      }
                      aria-hidden={"true"}
                    ></WorkspaceButton>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-6 pn-col-md-3"}>
              {" "}
              <Card className={"pn-card pn-placeholder-glow"}>
                {" "}
                <div
                  className={
                    "pn-ratio pn-ratio-21x9 pn-card-img-top pn-placeholder"
                  }
                ></div>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-placeholder pn-col-9 pn-mb-3"}></div>{" "}
                  <div
                    className={"pn-placeholder pn-placeholder-xs pn-col-10"}
                  ></div>{" "}
                  <div
                    className={"pn-placeholder pn-placeholder-xs pn-col-11"}
                  ></div>{" "}
                  <div className={"pn-mt-3"}>
                    {" "}
                    <WorkspaceButton
                      href={"#"}
                      tabIndex={-1}
                      className={
                        "pn-btn pn-btn-primary pn-disabled pn-placeholder pn-col-4"
                      }
                      aria-hidden={"true"}
                    ></WorkspaceButton>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-6 pn-col-md-3"}>
              {" "}
              <Card className={"pn-card pn-placeholder-glow"}>
                {" "}
                <div
                  className={
                    "pn-ratio pn-ratio-21x9 pn-card-img-top pn-placeholder"
                  }
                ></div>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-placeholder pn-col-9 pn-mb-3"}></div>{" "}
                  <div
                    className={"pn-placeholder pn-placeholder-xs pn-col-10"}
                  ></div>{" "}
                  <div
                    className={"pn-placeholder pn-placeholder-xs pn-col-11"}
                  ></div>{" "}
                  <div className={"pn-mt-3"}>
                    {" "}
                    <WorkspaceButton
                      href={"#"}
                      tabIndex={-1}
                      className={
                        "pn-btn pn-btn-primary pn-disabled pn-placeholder pn-col-4"
                      }
                      aria-hidden={"true"}
                    ></WorkspaceButton>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-12 pn-col-md-4"}>
              {" "}
              <div className={"pn-row pn-row-cards"}>
                {" "}
                <div className={"pn-col-12"}>
                  {" "}
                  <Card className={"pn-card"}>
                    {" "}
                    <CardContent className={"pn-card-body"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <div
                            className={
                              "pn-avatar pn-avatar-rounded pn-placeholder"
                            }
                          ></div>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <div
                            className={"pn-placeholder pn-placeholder-xs pn-col-9"}
                          ></div>{" "}
                          <div
                            className={"pn-placeholder pn-placeholder-xs pn-col-7"}
                          ></div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </CardContent>{" "}
                  </Card>{" "}
                </div>{" "}
                <div className={"pn-col-12"}>
                  {" "}
                  <Card className={"pn-card"}>
                    {" "}
                    <CardContent className={"pn-card-body pn-py-5 pn-text-center"}>
                      {" "}
                      <div>
                        {" "}
                        <div
                          className={
                            "pn-avatar pn-avatar-rounded pn-avatar-lg pn-placeholder pn-mb-3"
                          }
                        ></div>{" "}
                      </div>{" "}
                      <div className={"pn-w-75 pn-mx-auto"}>
                        {" "}
                        <div
                          className={"pn-placeholder pn-col-9 pn-mb-3"}
                        ></div>{" "}
                        <div
                          className={"pn-placeholder pn-placeholder-xs pn-col-10"}
                        ></div>{" "}
                      </div>{" "}
                    </CardContent>{" "}
                  </Card>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className={"pn-col-12 pn-col-md-4"}>
              {" "}
              <div className={"pn-row pn-row-cards"}>
                {" "}
                <div className={"pn-col-12"}>
                  {" "}
                  <Card className={"pn-card pn-placeholder-glow"}>
                    {" "}
                    <div
                      className={
                        "pn-ratio pn-ratio-21x9 pn-card-img-top pn-placeholder"
                      }
                    ></div>{" "}
                    <CardContent className={"pn-card-body"}>
                      {" "}
                      <div
                        className={"pn-placeholder pn-col-9 pn-mb-3"}
                      ></div>{" "}
                      <div
                        className={"pn-placeholder pn-placeholder-xs pn-col-10"}
                      ></div>{" "}
                      <div
                        className={"pn-placeholder pn-placeholder-xs pn-col-11"}
                      ></div>{" "}
                      <div className={"pn-mt-3"}>
                        {" "}
                        <WorkspaceButton
                          href={"#"}
                          tabIndex={-1}
                          className={
                            "pn-btn pn-btn-primary pn-disabled pn-placeholder pn-col-4"
                          }
                          aria-hidden={"true"}
                        ></WorkspaceButton>{" "}
                      </div>{" "}
                    </CardContent>{" "}
                  </Card>{" "}
                </div>{" "}
                <div className={"pn-col-12"}>
                  {" "}
                  <Card className={"pn-card"}>
                    {" "}
                    <div
                      className={
                        "pn-row pn-g-0 pn-align-items-center pn-placeholder-glow"
                      }
                    >
                      {" "}
                      <div className={"pn-col-3"}>
                        {" "}
                        <div
                          className={
                            "pn-ratio pn-ratio-1x1 pn-card-img-start pn-placeholder"
                          }
                        ></div>{" "}
                      </div>{" "}
                      <div className={"pn-col"}>
                        {" "}
                        <CardContent className={"pn-card-body"}>
                          {" "}
                          <div
                            className={"pn-placeholder pn-col-9 pn-mb-3"}
                          ></div>{" "}
                          <div
                            className={
                              "pn-placeholder pn-placeholder-xs pn-col-10"
                            }
                          ></div>{" "}
                          <div
                            className={
                              "pn-placeholder pn-placeholder-xs pn-col-11"
                            }
                          ></div>{" "}
                        </CardContent>{" "}
                      </div>{" "}
                    </div>{" "}
                  </Card>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className={"pn-col-12 pn-col-md-4"}>
              {" "}
              <div className={"pn-row pn-row-cards"}>
                {" "}
                <div className={"pn-col-12"}>
                  {" "}
                  <Card className={"pn-card"}>
                    {" "}
                    <CardContent
                      className={"pn-card-body pn-text-end pn-placeholder-glow"}
                    >
                      {" "}
                      <div
                        className={"pn-placeholder pn-col-9 pn-mb-3"}
                      ></div>{" "}
                      <div
                        className={"pn-placeholder pn-placeholder-xs pn-col-10"}
                      ></div>{" "}
                      <div
                        className={"pn-placeholder pn-placeholder-xs pn-col-12"}
                      ></div>{" "}
                      <div
                        className={"pn-placeholder pn-placeholder-xs pn-col-11"}
                      ></div>{" "}
                      <div
                        className={"pn-placeholder pn-placeholder-xs pn-col-8"}
                      ></div>{" "}
                      <div
                        className={"pn-placeholder pn-placeholder-xs pn-col-10"}
                      ></div>{" "}
                    </CardContent>{" "}
                  </Card>{" "}
                </div>{" "}
                <div className={"pn-col-12"}>
                  {" "}
                  <Card className={"pn-card"}>
                    {" "}
                    <ul
                      className={
                        "pn-list-group pn-list-group-flush pn-placeholder-glow"
                      }
                    >
                      {" "}
                      <li className={"pn-list-group-item"}>
                        {" "}
                        <div className={"pn-row pn-align-items-center"}>
                          {" "}
                          <div className={"pn-col-auto"}>
                            {" "}
                            <div
                              className={
                                "pn-avatar pn-avatar-rounded pn-placeholder"
                              }
                            ></div>{" "}
                          </div>{" "}
                          <div className={"pn-col-7"}>
                            {" "}
                            <div
                              className={
                                "pn-placeholder pn-placeholder-xs pn-col-9"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-placeholder pn-placeholder-xs pn-col-7"
                              }
                            ></div>{" "}
                          </div>{" "}
                          <div className={"pn-col-2 pn-ms-auto pn-text-end"}>
                            {" "}
                            <div
                              className={
                                "pn-placeholder pn-placeholder-xs pn-col-8"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-placeholder pn-placeholder-xs pn-col-10"
                              }
                            ></div>{" "}
                          </div>{" "}
                        </div>{" "}
                      </li>{" "}
                      <li className={"pn-list-group-item"}>
                        {" "}
                        <div className={"pn-row pn-align-items-center"}>
                          {" "}
                          <div className={"pn-col-auto"}>
                            {" "}
                            <div
                              className={
                                "pn-avatar pn-avatar-rounded pn-placeholder"
                              }
                            ></div>{" "}
                          </div>{" "}
                          <div className={"pn-col-7"}>
                            {" "}
                            <div
                              className={
                                "pn-placeholder pn-placeholder-xs pn-col-9"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-placeholder pn-placeholder-xs pn-col-7"
                              }
                            ></div>{" "}
                          </div>{" "}
                          <div className={"pn-col-2 pn-ms-auto pn-text-end"}>
                            {" "}
                            <div
                              className={
                                "pn-placeholder pn-placeholder-xs pn-col-8"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-placeholder pn-placeholder-xs pn-col-10"
                              }
                            ></div>{" "}
                          </div>{" "}
                        </div>{" "}
                      </li>{" "}
                      <li className={"pn-list-group-item"}>
                        {" "}
                        <div className={"pn-row pn-align-items-center"}>
                          {" "}
                          <div className={"pn-col-auto"}>
                            {" "}
                            <div
                              className={
                                "pn-avatar pn-avatar-rounded pn-placeholder"
                              }
                            ></div>{" "}
                          </div>{" "}
                          <div className={"pn-col-7"}>
                            {" "}
                            <div
                              className={
                                "pn-placeholder pn-placeholder-xs pn-col-9"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-placeholder pn-placeholder-xs pn-col-7"
                              }
                            ></div>{" "}
                          </div>{" "}
                          <div className={"pn-col-2 pn-ms-auto pn-text-end"}>
                            {" "}
                            <div
                              className={
                                "pn-placeholder pn-placeholder-xs pn-col-8"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-placeholder pn-placeholder-xs pn-col-10"
                              }
                            ></div>{" "}
                          </div>{" "}
                        </div>{" "}
                      </li>{" "}
                      <li className={"pn-list-group-item"}>
                        {" "}
                        <div className={"pn-row pn-align-items-center"}>
                          {" "}
                          <div className={"pn-col-auto"}>
                            {" "}
                            <div
                              className={
                                "pn-avatar pn-avatar-rounded pn-placeholder"
                              }
                            ></div>{" "}
                          </div>{" "}
                          <div className={"pn-col-7"}>
                            {" "}
                            <div
                              className={
                                "pn-placeholder pn-placeholder-xs pn-col-9"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-placeholder pn-placeholder-xs pn-col-7"
                              }
                            ></div>{" "}
                          </div>{" "}
                          <div className={"pn-col-2 pn-ms-auto pn-text-end"}>
                            {" "}
                            <div
                              className={
                                "pn-placeholder pn-placeholder-xs pn-col-8"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-placeholder pn-placeholder-xs pn-col-10"
                              }
                            ></div>{" "}
                          </div>{" "}
                        </div>{" "}
                      </li>{" "}
                    </ul>{" "}
                  </Card>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  )
}
