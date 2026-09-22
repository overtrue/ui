// Keep page composition editable; interaction belongs in the shared components.
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import {
  WorkspaceForm,
  WorkspaceLink,
  WorkspaceSelect,
} from "@/components/overtrue/workspace/primitives"
export default function Page() {
  return (
    <div data-workspace-page="colors" className="pn-page-wrapper">
      {" "}
      <div className={"pn-page-header pn-d-print-none"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-g-2 pn-align-items-center"}>
            {" "}
            <div className={"pn-col"}>
              {" "}
              <h1 className={"pn-page-title"}>{"Colors"}</h1>{" "}
              <div className={"pn-text-secondary pn-mt-1"}>
                {
                  "The full color palette, with hex values, and a gradient builder."
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
            <div className={"pn-col-6 pn-col-lg-3"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Colors"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"The extended color palette, with hex values."}
                  </CardDescription>{" "}
                  <div className={"pn-row pn-g-3"}>
                    {" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-blue pn-text-blue-fg pn-avatar-square"
                            }
                          >
                            {"bl"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Blue "}
                          <br /> <code>{"#066fd1"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-azure pn-text-azure-fg pn-avatar-square"
                            }
                          >
                            {"az"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Azure "}
                          <br /> <code>{"#4299e1"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-indigo pn-text-indigo-fg pn-avatar-square"
                            }
                          >
                            {"id"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Indigo "}
                          <br /> <code>{"#4263eb"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-purple pn-text-purple-fg pn-avatar-square"
                            }
                          >
                            {"pu"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Purple "}
                          <br /> <code>{"#ae3ec9"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-pink pn-text-pink-fg pn-avatar-square"
                            }
                          >
                            {"pk"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Pink "}
                          <br /> <code>{"#d6336c"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-red pn-text-red-fg pn-avatar-square"
                            }
                          >
                            {"rd"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Red "}
                          <br /> <code>{"#d63939"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-orange pn-text-orange-fg pn-avatar-square"
                            }
                          >
                            {"or"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Orange "}
                          <br /> <code>{"#f76707"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-yellow pn-text-yellow-fg pn-avatar-square"
                            }
                          >
                            {"yl"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Yellow "}
                          <br /> <code>{"#f59f00"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-lime pn-text-lime-fg pn-avatar-square"
                            }
                          >
                            {"lm"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Lime "}
                          <br /> <code>{"#74b816"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-green pn-text-green-fg pn-avatar-square"
                            }
                          >
                            {"gn"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Green "}
                          <br /> <code>{"#2fb344"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-teal pn-text-teal-fg pn-avatar-square"
                            }
                          >
                            {"tl"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Teal "}
                          <br /> <code>{"#0ca678"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-cyan pn-text-cyan-fg pn-avatar-square"
                            }
                          >
                            {"cy"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Cyan "}
                          <br /> <code>{"#17a2b8"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-6 pn-col-lg-3"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Light colors"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"A tinted, low-contrast version of each color."}
                  </CardDescription>{" "}
                  <div className={"pn-row pn-g-3"}>
                    {" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-avatar pn-bg-blue-lt pn-avatar-square"}
                          >
                            {"bl"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Blue Light "}
                          <br /> <code>{"#066fd1"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-avatar pn-bg-azure-lt pn-avatar-square"}
                          >
                            {"az"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Azure Light "}
                          <br /> <code>{"#4299e1"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-indigo-lt pn-avatar-square"
                            }
                          >
                            {"id"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Indigo Light "}
                          <br /> <code>{"#4263eb"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-purple-lt pn-avatar-square"
                            }
                          >
                            {"pu"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Purple Light "}
                          <br /> <code>{"#ae3ec9"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-avatar pn-bg-pink-lt pn-avatar-square"}
                          >
                            {"pk"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Pink Light "}
                          <br /> <code>{"#d6336c"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-avatar pn-bg-red-lt pn-avatar-square"}
                          >
                            {"rd"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Red Light "}
                          <br /> <code>{"#d63939"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-orange-lt pn-avatar-square"
                            }
                          >
                            {"or"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Orange Light "}
                          <br /> <code>{"#f76707"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-yellow-lt pn-avatar-square"
                            }
                          >
                            {"yl"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Yellow Light "}
                          <br /> <code>{"#f59f00"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-avatar pn-bg-lime-lt pn-avatar-square"}
                          >
                            {"lm"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Lime Light "}
                          <br /> <code>{"#74b816"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-avatar pn-bg-green-lt pn-avatar-square"}
                          >
                            {"gn"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Green Light "}
                          <br /> <code>{"#2fb344"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-avatar pn-bg-teal-lt pn-avatar-square"}
                          >
                            {"tl"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Teal Light "}
                          <br /> <code>{"#0ca678"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-avatar pn-bg-cyan-lt pn-avatar-square"}
                          >
                            {"cy"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Cyan Light "}
                          <br /> <code>{"#17a2b8"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-6 pn-col-lg-3"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Gray colors"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {
                      "The neutral gray scale used for text, borders, and backgrounds."
                    }
                  </CardDescription>{" "}
                  <div className={"pn-row pn-g-3"}>
                    {" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-gray-50 pn-text-gray-50-fg pn-avatar-square"
                            }
                          >
                            {"50"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Gray 50 "}
                          <br /> <code>{"var(--pn-gray-50)"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-gray-100 pn-text-gray-100-fg pn-avatar-square"
                            }
                          >
                            {"100"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Gray 100 "}
                          <br /> <code>{"var(--pn-gray-100)"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-gray-200 pn-text-gray-200-fg pn-avatar-square"
                            }
                          >
                            {"200"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Gray 200 "}
                          <br /> <code>{"var(--pn-gray-200)"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-gray-300 pn-text-gray-300-fg pn-avatar-square"
                            }
                          >
                            {"300"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Gray 300 "}
                          <br /> <code>{"var(--pn-gray-300)"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-gray-400 pn-text-gray-400-fg pn-avatar-square"
                            }
                          >
                            {"400"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Gray 400 "}
                          <br /> <code>{"var(--pn-gray-400)"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-gray-500 pn-text-gray-500-fg pn-avatar-square"
                            }
                          >
                            {"500"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Gray 500 "}
                          <br /> <code>{"var(--pn-gray-500)"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-gray-600 pn-text-gray-600-fg pn-avatar-square"
                            }
                          >
                            {"600"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Gray 600 "}
                          <br /> <code>{"var(--pn-gray-600)"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-gray-700 pn-text-gray-700-fg pn-avatar-square"
                            }
                          >
                            {"700"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Gray 700 "}
                          <br /> <code>{"var(--pn-gray-700)"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-gray-800 pn-text-gray-800-fg pn-avatar-square"
                            }
                          >
                            {"800"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Gray 800 "}
                          <br /> <code>{"var(--pn-gray-800)"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-gray-900 pn-text-gray-900-fg pn-avatar-square"
                            }
                          >
                            {"900"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Gray 900 "}
                          <br /> <code>{"var(--pn-gray-900)"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-gray-950 pn-text-gray-950-fg pn-avatar-square"
                            }
                          >
                            {"950"}
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Gray 950 "}
                          <br /> <code>{"var(--pn-gray-950)"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-6 pn-col-lg-3"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Social colors"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Brand colors for social networks."}
                  </CardDescription>{" "}
                  <div className={"pn-row pn-g-3"}>
                    {" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-facebook pn-text-facebook-fg pn-avatar-square"
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
                              ></path>
                            </svg>
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Facebook "}
                          <br /> <code>{"var(--pn-facebook)"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-twitter pn-text-twitter-fg pn-avatar-square"
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
                                  "M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c0 -.249 1.51 -2.772 1.818 -4.013l0 .001"
                                }
                              ></path>
                            </svg>
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Twitter "}
                          <br /> <code>{"var(--pn-twitter)"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-x pn-text-x-fg pn-avatar-square"
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
                                d={"M4 4l11.733 16h4.267l-11.733 -16l-4.267 0"}
                              ></path>{" "}
                              <path
                                d={"M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"}
                              ></path>
                            </svg>
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" X "}
                          <br /> <code>{"var(--pn-x)"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-linkedin pn-text-linkedin-fg pn-avatar-square"
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
                              <path d={"M8 11v5"}></path>{" "}
                              <path d={"M8 8v.01"}></path>{" "}
                              <path d={"M12 16v-5"}></path>{" "}
                              <path d={"M16 16v-3a2 2 0 1 0 -4 0"}></path>{" "}
                              <path
                                d={
                                  "M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10"
                                }
                              ></path>
                            </svg>
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Linkedin "}
                          <br /> <code>{"var(--pn-linkedin)"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-google pn-text-google-fg pn-avatar-square"
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
                                  "M20.945 11a9 9 0 1 1 -3.284 -5.997l-2.655 2.392a5.5 5.5 0 1 0 2.119 6.605h-4.125v-3h7.945"
                                }
                              ></path>
                            </svg>
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Google "}
                          <br /> <code>{"var(--pn-google)"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-youtube pn-text-youtube-fg pn-avatar-square"
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
                                  "M2 8a4 4 0 0 1 4 -4h12a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4v-8"
                                }
                              ></path>{" "}
                              <path d={"M10 9l5 3l-5 3l0 -6"}></path>
                            </svg>
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Youtube "}
                          <br /> <code>{"var(--pn-youtube)"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-vimeo pn-text-vimeo-fg pn-avatar-square"
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
                                  "M3 8.5l1 1s1.5 -1.102 2 -.5c.509 .609 1.863 7.65 2.5 9c.556 1.184 1.978 2.89 4 1.5c2 -1.5 7.5 -5.5 8.5 -11.5c.444 -2.661 -1 -4 -2.5 -4c-2 0 -4.047 1.202 -4.5 4c2.05 -1.254 2.551 1 1.5 3c-1.052 2 -2 3 -2.5 3c-.49 0 -.924 -1.165 -1.5 -3.5c-.59 -2.42 -.5 -6.5 -3 -6.5s-5.5 4.5 -5.5 4.5"
                                }
                              ></path>
                            </svg>
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Vimeo "}
                          <br /> <code>{"var(--pn-vimeo)"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-dribbble pn-text-dribbble-fg pn-avatar-square"
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
                                d={"M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"}
                              ></path>{" "}
                              <path d={"M9 3.6c5 6 7 10.5 7.5 16.2"}></path>{" "}
                              <path
                                d={"M6.4 19c3.5 -3.5 6 -6.5 14.5 -6.4"}
                              ></path>{" "}
                              <path
                                d={"M3.1 10.75c5 0 9.814 -.38 15.314 -5"}
                              ></path>
                            </svg>
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Dribbble "}
                          <br /> <code>{"var(--pn-dribbble)"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-github pn-text-github-fg pn-avatar-square"
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
                                  "M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"
                                }
                              ></path>
                            </svg>
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Github "}
                          <br /> <code>{"var(--pn-github)"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-instagram pn-text-instagram-fg pn-avatar-square"
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
                                  "M4 8a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4l0 -8"
                                }
                              ></path>{" "}
                              <path
                                d={"M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"}
                              ></path>{" "}
                              <path d={"M16.5 7.5v.01"}></path>
                            </svg>
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Instagram "}
                          <br /> <code>{"var(--pn-instagram)"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-pinterest pn-text-pinterest-fg pn-avatar-square"
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
                              <path d={"M8 20l4 -9"}></path>{" "}
                              <path
                                d={
                                  "M10.7 14c.437 1.263 1.43 2 2.55 2c2.071 0 3.75 -1.554 3.75 -4a5 5 0 1 0 -9.7 1.7"
                                }
                              ></path>{" "}
                              <path
                                d={"M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"}
                              ></path>
                            </svg>
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Pinterest "}
                          <br /> <code>{"var(--pn-pinterest)"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-vk pn-text-vk-fg pn-avatar-square"
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
                                  "M14 19h-4a8 8 0 0 1 -8 -8v-5h4v5a4 4 0 0 0 4 4v-9h4v4.5l.03 0a4.531 4.531 0 0 0 3.97 -4.496h4l-.342 1.711a6.858 6.858 0 0 1 -3.658 4.789a5.34 5.34 0 0 1 3.566 4.111l.434 2.389h-4a4.531 4.531 0 0 0 -3.97 -4.496v4.5l-.03 -.008"
                                }
                              ></path>
                            </svg>
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" VK "}
                          <br /> <code>{"var(--pn-vk)"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-rss pn-text-rss-fg pn-avatar-square"
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
                                d={"M4 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"}
                              ></path>{" "}
                              <path d={"M4 4a16 16 0 0 1 16 16"}></path>{" "}
                              <path d={"M4 11a9 9 0 0 1 9 9"}></path>
                            </svg>
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" RSS "}
                          <br /> <code>{"var(--pn-rss)"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-flickr pn-text-flickr-fg pn-avatar-square"
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
                                d={"M4 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"}
                              ></path>{" "}
                              <path
                                d={"M14 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"}
                              ></path>
                            </svg>
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Flickr "}
                          <br /> <code>{"var(--pn-flickr)"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-bitbucket pn-text-bitbucket-fg pn-avatar-square"
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
                                  "M3.648 4a.64 .64 0 0 0 -.64 .744l3.14 14.528c.07 .417 .43 .724 .852 .728h10a.644 .644 0 0 0 .642 -.539l3.35 -14.71a.641 .641 0 0 0 -.64 -.744l-16.704 -.007"
                                }
                              ></path>{" "}
                              <path d={"M14 15h-4l-1 -6h6l-1 6"}></path>
                            </svg>
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" Bitbucket "}
                          <br /> <code>{"var(--pn-bitbucket)"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col-12"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-avatar pn-bg-overtrue pn-text-overtrue-fg pn-avatar-square"
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
                              <path d={"M8 9l3 3l-3 3"}></path>{" "}
                              <path d={"M13 15h3"}></path>{" "}
                              <path
                                d={
                                  "M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10"
                                }
                              ></path>
                            </svg>
                          </span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" overtrue/ui "}
                          <br /> <code>{"var(--pn-overtrue)"}</code>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-12"}>
              {" "}
              <div className={"pn-row"}>
                {" "}
                <div className={"pn-col-12 pn-col-lg-6"}>
                  {" "}
                  <Card className={"pn-card"}>
                    {" "}
                    <CardContent className={"pn-card-body"}>
                      {" "}
                      <CardTitle className={"pn-card-title"}>
                        {"Gradient"}
                      </CardTitle>{" "}
                      <CardDescription className={"pn-card-subtitle"}>
                        {
                          "Build a gradient from any two colors and preview it live."
                        }
                      </CardDescription>{" "}
                      <WorkspaceForm>
                        {" "}
                        <div className={"pn-row pn-g-4"}>
                          {" "}
                          <div className={"pn-col"}>
                            {" "}
                            <div>
                              {" "}
                              <label
                                className={"pn-form-label"}
                                htmlFor={"colors-gradient-from"}
                              >
                                {" From "}
                              </label>{" "}
                              <WorkspaceSelect
                                className={"pn-form-select"}
                                name={"color-from"}
                                id={"colors-gradient-from"}
                              >
                                <option value={"blue"}>{"blue"}</option>
                                <option value={"azure"}>{"azure"}</option>
                                <option value={"indigo"}>{"indigo"}</option>
                                <option value={"purple"}>{"purple"}</option>
                                <option value={"pink"}>{"pink"}</option>
                                <option value={"red"}>{"red"}</option>
                                <option value={"orange"}>{"orange"}</option>
                                <option value={"yellow"}>{"yellow"}</option>
                                <option value={"lime"}>{"lime"}</option>
                                <option value={"green"}>{"green"}</option>
                                <option value={"teal"}>{"teal"}</option>
                                <option value={"cyan"}>{"cyan"}</option>
                                <option value={"inverted"}>{"inverted"}</option>
                                <option value={"white"}>{"white"}</option>
                                <option value={"transparent"}>
                                  {"transparent"}
                                </option>
                              </WorkspaceSelect>{" "}
                            </div>{" "}
                            <div className={"pn-mt-3"}>
                              {" "}
                              <label
                                className={"pn-form-label"}
                                htmlFor={"colors-gradient-to"}
                              >
                                {" To "}
                              </label>{" "}
                              <WorkspaceSelect
                                className={"pn-form-select"}
                                name={"color-to"}
                                id={"colors-gradient-to"}
                                defaultValue={"transparent"}
                              >
                                <option value={"blue"}>{"blue"}</option>
                                <option value={"azure"}>{"azure"}</option>
                                <option value={"indigo"}>{"indigo"}</option>
                                <option value={"purple"}>{"purple"}</option>
                                <option value={"pink"}>{"pink"}</option>
                                <option value={"red"}>{"red"}</option>
                                <option value={"orange"}>{"orange"}</option>
                                <option value={"yellow"}>{"yellow"}</option>
                                <option value={"lime"}>{"lime"}</option>
                                <option value={"green"}>{"green"}</option>
                                <option value={"teal"}>{"teal"}</option>
                                <option value={"cyan"}>{"cyan"}</option>
                                <option value={"inverted"}>{"inverted"}</option>
                                <option value={"white"}>{"white"}</option>
                                <option value={"transparent"}>
                                  {"transparent"}
                                </option>
                              </WorkspaceSelect>{" "}
                            </div>{" "}
                          </div>{" "}
                          <div className={"pn-col"}>
                            {" "}
                            <div>
                              {" "}
                              <label
                                className={"pn-form-label"}
                                htmlFor={"colors-gradient-via"}
                              >
                                {" Via "}
                              </label>{" "}
                              <WorkspaceSelect
                                className={"pn-form-select"}
                                name={"color-via"}
                                id={"colors-gradient-via"}
                              >
                                <option></option>
                                <option value={"blue"}>{"blue"}</option>
                                <option value={"azure"}>{"azure"}</option>
                                <option value={"indigo"}>{"indigo"}</option>
                                <option value={"purple"}>{"purple"}</option>
                                <option value={"pink"}>{"pink"}</option>
                                <option value={"red"}>{"red"}</option>
                                <option value={"orange"}>{"orange"}</option>
                                <option value={"yellow"}>{"yellow"}</option>
                                <option value={"lime"}>{"lime"}</option>
                                <option value={"green"}>{"green"}</option>
                                <option value={"teal"}>{"teal"}</option>
                                <option value={"cyan"}>{"cyan"}</option>
                                <option value={"inverted"}>{"inverted"}</option>
                                <option value={"white"}>{"white"}</option>
                                <option value={"transparent"}>
                                  {"transparent"}
                                </option>
                              </WorkspaceSelect>{" "}
                            </div>{" "}
                            <div className={"pn-mt-3"}>
                              {" "}
                              <label
                                className={"pn-form-label"}
                                htmlFor={"colors-gradient-direction"}
                              >
                                {" Direction "}
                              </label>{" "}
                              <WorkspaceSelect
                                className={"pn-form-select"}
                                name={"color-direction"}
                                id={"colors-gradient-direction"}
                                defaultValue={"to-r"}
                              >
                                <option value={"to-t"}>{"to top"}</option>
                                <option value={"to-te"}>
                                  {"to top right"}
                                </option>
                                <option value={"to-r"}>{"to right"}</option>
                                <option value={"to-be"}>
                                  {"to bottom right"}
                                </option>
                                <option value={"to-b"}>{"to bottom"}</option>
                                <option value={"to-bs"}>
                                  {"to bottom left"}
                                </option>
                                <option value={"to-s"}>{"to left"}</option>
                                <option value={"to-ts"}>{"to top left"}</option>
                              </WorkspaceSelect>{" "}
                            </div>{" "}
                          </div>{" "}
                          <div className={"pn-col-12"}>
                            {" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-pattern-transparent pn-overflow-hidden"
                              }
                            >
                              {" "}
                              <div
                                id={"gradient-preview"}
                                className={
                                  "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-from-primary pn-bg-gradient-to-transparent"
                                }
                              >
                                {" "}
                                <div className={"pn-px-4 pn-py-5"}></div>{" "}
                              </div>{" "}
                            </div>{" "}
                          </div>{" "}
                        </div>{" "}
                      </WorkspaceForm>{" "}
                    </CardContent>{" "}
                  </Card>{" "}
                </div>{" "}
                <div className={"pn-col-12 pn-col-lg-6"}>
                  {" "}
                  <Card className={"pn-card"}>
                    {" "}
                    <CardContent className={"pn-card-body"}>
                      {" "}
                      <CardTitle className={"pn-card-title"}>
                        {"Gradient colors"}
                      </CardTitle>{" "}
                      <CardDescription className={"pn-card-subtitle"}>
                        {
                          "Every color faded to transparent, fading in from the left or the right."
                        }
                      </CardDescription>{" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col"}>
                          {" "}
                          <div className={"pn-space-y"}>
                            {" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-from-blue pn-bg-gradient-to-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-from-azure pn-bg-gradient-to-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-from-indigo pn-bg-gradient-to-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-from-purple pn-bg-gradient-to-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-from-pink pn-bg-gradient-to-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-from-red pn-bg-gradient-to-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-from-orange pn-bg-gradient-to-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-from-yellow pn-bg-gradient-to-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-from-lime pn-bg-gradient-to-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-from-green pn-bg-gradient-to-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-from-teal pn-bg-gradient-to-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-from-cyan pn-bg-gradient-to-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-from-inverted pn-bg-gradient-to-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-from-white pn-bg-gradient-to-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-from-transparent pn-bg-gradient-to-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                          </div>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <div className={"pn-space-y"}>
                            {" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-to-blue pn-bg-gradient-from-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-to-azure pn-bg-gradient-from-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-to-indigo pn-bg-gradient-from-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-to-purple pn-bg-gradient-from-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-to-pink pn-bg-gradient-from-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-to-red pn-bg-gradient-from-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-to-orange pn-bg-gradient-from-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-to-yellow pn-bg-gradient-from-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-to-lime pn-bg-gradient-from-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-to-green pn-bg-gradient-from-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-to-teal pn-bg-gradient-from-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-to-cyan pn-bg-gradient-from-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-to-inverted pn-bg-gradient-from-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-to-white pn-bg-gradient-from-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                            <div
                              className={
                                "pn-border pn-rounded pn-bg-gradient pn-bg-gradient-to-transparent pn-bg-gradient-from-transparent pn-px-4 pn-py-2"
                              }
                            ></div>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </CardContent>{" "}
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
