// Keep page composition editable; interaction belongs in the shared components.
import type { CSSProperties } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { WorkspaceLink } from "@/components/overtrue/workspace/primitives"
export default function Page() {
  return (
    <div data-workspace-page="patterns" className="pn-page-wrapper">
      {" "}
      <div className={"pn-page-header pn-d-print-none"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-g-2 pn-align-items-center"}>
            {" "}
            <div className={"pn-col"}>
              {" "}
              <h1 className={"pn-page-title"}>{"Patterns"}</h1>{" "}
              <div className={"pn-text-secondary pn-mt-1"}>
                {
                  "Quiet texture for project covers and supporting surfaces."
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
                    {"Pattern types"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {
                      "Apply a repeating background pattern to any element with a single utility class."
                    }
                  </CardDescription>{" "}
                  <div
                    className={
                      "pn-row pn-row-cols-1 pn-row-cols-sm-2 pn-row-cols-lg-3 pn-row-cols-xl-6 pn-g-3"
                    }
                  >
                    {" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-diagonal pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-diagonal"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-diagonal-2 pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-diagonal-2"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-dots pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-dots"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-rectangles pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-rectangles"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-lines pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-lines"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-lines-vertical pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-lines-vertical"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-grid pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-grid"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-grid-diagonal pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-grid-diagonal"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-blueprint pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-blueprint"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-circles pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-circles"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-diagonal-stripes pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-diagonal-stripes"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-diagonal-stripes-2 pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-diagonal-stripes-2"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-zigzag pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-zigzag"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-vertical-stripes pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-vertical-stripes"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-horizontal-stripes pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-horizontal-stripes"}</code>{" "}
                    </div>{" "}
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
                    {"Pattern colors"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Tint the pattern with any theme color from the palette."}
                  </CardDescription>{" "}
                  <div
                    className={
                      "pn-row pn-row-cols-1 pn-row-cols-sm-2 pn-row-cols-lg-3 pn-row-cols-xl-6 pn-g-3"
                    }
                  >
                    {" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-rectangles pn-bg-pattern-blue pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-blue"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-rectangles pn-bg-pattern-azure pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-azure"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-rectangles pn-bg-pattern-indigo pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-indigo"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-rectangles pn-bg-pattern-purple pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-purple"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-rectangles pn-bg-pattern-pink pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-pink"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-rectangles pn-bg-pattern-red pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-red"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-rectangles pn-bg-pattern-orange pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-orange"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-rectangles pn-bg-pattern-yellow pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-yellow"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-rectangles pn-bg-pattern-lime pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-lime"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-rectangles pn-bg-pattern-green pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-green"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-rectangles pn-bg-pattern-teal pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-teal"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-rectangles pn-bg-pattern-cyan pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-cyan"}</code>{" "}
                    </div>{" "}
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
                    {"Pattern sizes"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Scale the pattern from "}
                    <code>{"bg-pattern-sm"}</code>
                    {" to "}
                    <code>{"bg-pattern-xl"}</code>
                    {"."}
                  </CardDescription>{" "}
                  <div
                    className={
                      "pn-row pn-row-cols-1 pn-row-cols-sm-2 pn-row-cols-lg-3 pn-row-cols-xl-6 pn-g-3"
                    }
                  >
                    {" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-diagonal pn-bg-pattern-sm pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-sm"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-diagonal pn-bg-pattern-md pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-md"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-diagonal pn-bg-pattern-lg pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-lg"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-diagonal pn-bg-pattern-xl pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-xl"}</code>{" "}
                    </div>{" "}
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
                    {"Pattern opacity"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Scale the pattern strength with the "}
                    <code>{"bg-pattern-opacity-*"}</code>
                    {" utilities."}
                  </CardDescription>{" "}
                  <div
                    className={
                      "pn-row pn-row-cols-1 pn-row-cols-sm-2 pn-row-cols-lg-3 pn-row-cols-xl-6 pn-g-3"
                    }
                  >
                    {" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-transparent pn-bg-pattern-primary pn-border pn-rounded pn-mb-3 pn-bg-pattern-opacity-lighter"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-opacity-lighter"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-transparent pn-bg-pattern-primary pn-border pn-rounded pn-mb-3 pn-bg-pattern-opacity-light"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-opacity-light"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-transparent pn-bg-pattern-primary pn-border pn-rounded pn-mb-3 pn-bg-pattern-opacity-dark"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-opacity-dark"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-transparent pn-bg-pattern-primary pn-border pn-rounded pn-mb-3 pn-bg-pattern-opacity-darker"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-opacity-darker"}</code>{" "}
                    </div>{" "}
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
                    {"Usage"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {
                      "Combine pattern type, color, size, and opacity on real layouts."
                    }
                  </CardDescription>{" "}
                  <div className={"pn-row pn-g-3"}>
                    {" "}
                    <div className={"pn-col-12 pn-col-md-6 pn-col-xl-3"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-transparent pn-border pn-rounded pn-mb-3"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>{".bg-pattern-transparent"}</code>{" "}
                    </div>{" "}
                    <div className={"pn-col-12 pn-col-md-6 pn-col-xl-3"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-grid pn-bg-pattern-primary pn-bg-pattern-lg pn-border pn-rounded pn-mb-3 pn-bg-pattern-opacity-light"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>
                        {
                          ".bg-pattern-grid.bg-pattern-primary.bg-pattern-lg.bg-pattern-opacity-light"
                        }
                      </code>{" "}
                    </div>{" "}
                    <div className={"pn-col-12 pn-col-md-6 pn-col-xl-3"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-diagonal-stripes-2 pn-bg-pattern-azure pn-border pn-rounded pn-mb-3 pn-bg-pattern-opacity-dark"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>
                        {
                          ".bg-pattern-diagonal-stripes-2.bg-pattern-azure.bg-pattern-opacity-dark"
                        }
                      </code>{" "}
                    </div>{" "}
                    <div className={"pn-col-12 pn-col-md-6 pn-col-xl-3"}>
                      {" "}
                      <div
                        className={
                          "pn-bg-pattern-dots pn-bg-pattern-red pn-bg-pattern-sm pn-border pn-rounded pn-mb-3 pn-bg-pattern-opacity-darker"
                        }
                        style={{ height: "8rem" } as CSSProperties}
                      ></div>{" "}
                      <code>
                        {
                          ".bg-pattern-dots.bg-pattern-red.bg-pattern-sm.bg-pattern-opacity-darker"
                        }
                      </code>{" "}
                    </div>{" "}
                    <div className={"pn-col-12 pn-col-lg-6"}>
                      {" "}
                      <Card className={"pn-card pn-bg-pattern-diagonal"}>
                        {" "}
                        <CardContent className={"pn-card-body"}>
                          {"Card with "}
                          <code>{".bg-pattern-diagonal"}</code>
                          {"."}
                        </CardContent>{" "}
                      </Card>{" "}
                    </div>{" "}
                    <div className={"pn-col-12 pn-col-lg-6"}>
                      {" "}
                      <Card
                        className={
                          "pn-card pn-bg-pattern-grid pn-bg-pattern-primary pn-bg-pattern-opacity-light"
                        }
                      >
                        {" "}
                        <CardContent className={"pn-card-body"}>
                          {"Card with a primary grid and "}
                          <code>{".bg-pattern-opacity-light"}</code>
                          {"."}
                        </CardContent>{" "}
                      </Card>{" "}
                    </div>{" "}
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
