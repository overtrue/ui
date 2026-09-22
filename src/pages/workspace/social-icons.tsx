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
    <div data-workspace-page="social-icons" className="pn-page-wrapper">
      {" "}
      <div className={"pn-page-header pn-d-print-none"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-g-2 pn-align-items-center"}>
            {" "}
            <div className={"pn-col"}>
              {" "}
              <h1 className={"pn-page-title"}>{"Social icons"}</h1>{" "}
              <div className={"pn-text-secondary pn-mt-1"}>
                {
                  "Branded icons and helpers for linking out to, or signing in with, social networks."
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
              <div className={"pn-row pn-g-3"}>
                {" "}
                <div className={"pn-col-12 pn-col-sm-6 pn-col-md-4 pn-col-lg-3"}>
                  {" "}
                  <Card className={"pn-card"}>
                    {" "}
                    <CardContent className={"pn-card-body"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-social pn-social-md pn-social-app-dribbble"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <div>{"328 likes"}</div>{" "}
                          <div className={"pn-text-secondary"}>
                            {"45 today"}
                          </div>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-text-green pn-d-inline-flex pn-align-items-center pn-lh-1"
                            }
                          >
                            {" "}
                            <span className={"pn-visually-hidden"}>
                              {"Increased by "}
                            </span>
                            {"8% "}{" "}
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
                              className={"pn-icon pn-ms-0 pn-icon-sm"}
                            >
                              {" "}
                              <path d={"M12 5l0 14"}></path>{" "}
                              <path d={"M18 11l-6 -6"}></path>{" "}
                              <path d={"M6 11l6 -6"}></path>{" "}
                            </svg>{" "}
                          </span>{" "}
                        </div>{" "}
                      </div>{" "}
                    </CardContent>{" "}
                  </Card>{" "}
                </div>{" "}
                <div className={"pn-col-12 pn-col-sm-6 pn-col-md-4 pn-col-lg-3"}>
                  {" "}
                  <Card className={"pn-card"}>
                    {" "}
                    <CardContent className={"pn-card-body"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-social pn-social-md pn-social-app-facebook"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <div>{"542 shares"}</div>{" "}
                          <div className={"pn-text-secondary"}>
                            {"67 today"}
                          </div>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-text-muted pn-d-inline-flex pn-align-items-center pn-lh-1"
                            }
                          >
                            {" "}
                            <span className={"pn-visually-hidden"}>
                              {"No change, "}
                            </span>
                            {"0% "}{" "}
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
                              className={"pn-icon pn-ms-0 pn-icon-sm"}
                            >
                              <path d={"M5 12l14 0"}></path>
                            </svg>{" "}
                          </span>{" "}
                        </div>{" "}
                      </div>{" "}
                    </CardContent>{" "}
                  </Card>{" "}
                </div>{" "}
                <div className={"pn-col-12 pn-col-sm-6 pn-col-md-4 pn-col-lg-3"}>
                  {" "}
                  <Card className={"pn-card"}>
                    {" "}
                    <CardContent className={"pn-card-body"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-social pn-social-md pn-social-app-instagram"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <div>{"894 followers"}</div>{" "}
                          <div className={"pn-text-secondary"}>
                            {"120 today"}
                          </div>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-text-green pn-d-inline-flex pn-align-items-center pn-lh-1"
                            }
                          >
                            {" "}
                            <span className={"pn-visually-hidden"}>
                              {"Increased by "}
                            </span>
                            {"10% "}{" "}
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
                              className={"pn-icon pn-ms-0 pn-icon-sm"}
                            >
                              {" "}
                              <path d={"M12 5l0 14"}></path>{" "}
                              <path d={"M18 11l-6 -6"}></path>{" "}
                              <path d={"M6 11l6 -6"}></path>{" "}
                            </svg>{" "}
                          </span>{" "}
                        </div>{" "}
                      </div>{" "}
                    </CardContent>{" "}
                  </Card>{" "}
                </div>{" "}
                <div className={"pn-col-12 pn-col-sm-6 pn-col-md-4 pn-col-lg-3"}>
                  {" "}
                  <Card className={"pn-card"}>
                    {" "}
                    <CardContent className={"pn-card-body"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-social pn-social-md pn-social-app-x"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <div>{"221 retweets"}</div>{" "}
                          <div className={"pn-text-secondary"}>
                            {"34 today"}
                          </div>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-text-red pn-d-inline-flex pn-align-items-center pn-lh-1"
                            }
                          >
                            {" "}
                            <span className={"pn-visually-hidden"}>
                              {"Decreased by "}
                            </span>
                            {"-2% "}{" "}
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
                              className={"pn-icon pn-ms-0 pn-icon-sm"}
                            >
                              {" "}
                              <path d={"M12 5l0 14"}></path>{" "}
                              <path d={"M18 13l-6 6"}></path>{" "}
                              <path d={"M6 13l6 6"}></path>{" "}
                            </svg>{" "}
                          </span>{" "}
                        </div>{" "}
                      </div>{" "}
                    </CardContent>{" "}
                  </Card>{" "}
                </div>{" "}
                <div className={"pn-col-12 pn-col-sm-6 pn-col-md-4 pn-col-lg-3"}>
                  {" "}
                  <Card className={"pn-card"}>
                    {" "}
                    <CardContent className={"pn-card-body"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-social pn-social-md pn-social-app-youtube"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <div>{"765 views"}</div>{" "}
                          <div className={"pn-text-secondary"}>
                            {"98 today"}
                          </div>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-text-muted pn-d-inline-flex pn-align-items-center pn-lh-1"
                            }
                          >
                            {" "}
                            <span className={"pn-visually-hidden"}>
                              {"No change, "}
                            </span>
                            {"0% "}{" "}
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
                              className={"pn-icon pn-ms-0 pn-icon-sm"}
                            >
                              <path d={"M5 12l14 0"}></path>
                            </svg>{" "}
                          </span>{" "}
                        </div>{" "}
                      </div>{" "}
                    </CardContent>{" "}
                  </Card>{" "}
                </div>{" "}
                <div className={"pn-col-12 pn-col-sm-6 pn-col-md-4 pn-col-lg-3"}>
                  {" "}
                  <Card className={"pn-card"}>
                    {" "}
                    <CardContent className={"pn-card-body"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-social pn-social-md pn-social-app-pinterest"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <div>{"432 pins"}</div>{" "}
                          <div className={"pn-text-secondary"}>
                            {"53 today"}
                          </div>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-text-red pn-d-inline-flex pn-align-items-center pn-lh-1"
                            }
                          >
                            {" "}
                            <span className={"pn-visually-hidden"}>
                              {"Decreased by "}
                            </span>
                            {"-4% "}{" "}
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
                              className={"pn-icon pn-ms-0 pn-icon-sm"}
                            >
                              {" "}
                              <path d={"M12 5l0 14"}></path>{" "}
                              <path d={"M18 13l-6 6"}></path>{" "}
                              <path d={"M6 13l6 6"}></path>{" "}
                            </svg>{" "}
                          </span>{" "}
                        </div>{" "}
                      </div>{" "}
                    </CardContent>{" "}
                  </Card>{" "}
                </div>{" "}
                <div className={"pn-col-12 pn-col-sm-6 pn-col-md-4 pn-col-lg-3"}>
                  {" "}
                  <Card className={"pn-card"}>
                    {" "}
                    <CardContent className={"pn-card-body"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-social pn-social-md pn-social-app-tiktok"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <div>{"612 likes"}</div>{" "}
                          <div className={"pn-text-secondary"}>
                            {"76 today"}
                          </div>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-text-green pn-d-inline-flex pn-align-items-center pn-lh-1"
                            }
                          >
                            {" "}
                            <span className={"pn-visually-hidden"}>
                              {"Increased by "}
                            </span>
                            {"9% "}{" "}
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
                              className={"pn-icon pn-ms-0 pn-icon-sm"}
                            >
                              {" "}
                              <path d={"M12 5l0 14"}></path>{" "}
                              <path d={"M18 11l-6 -6"}></path>{" "}
                              <path d={"M6 11l6 -6"}></path>{" "}
                            </svg>{" "}
                          </span>{" "}
                        </div>{" "}
                      </div>{" "}
                    </CardContent>{" "}
                  </Card>{" "}
                </div>{" "}
                <div className={"pn-col-12 pn-col-sm-6 pn-col-md-4 pn-col-lg-3"}>
                  {" "}
                  <Card className={"pn-card"}>
                    {" "}
                    <CardContent className={"pn-card-body"}>
                      {" "}
                      <div className={"pn-row pn-align-items-center"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-social pn-social-md pn-social-app-linkedin"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <div>{"305 connections"}</div>{" "}
                          <div className={"pn-text-secondary"}>
                            {"29 today"}
                          </div>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-text-red pn-d-inline-flex pn-align-items-center pn-lh-1"
                            }
                          >
                            {" "}
                            <span className={"pn-visually-hidden"}>
                              {"Decreased by "}
                            </span>
                            {"-1% "}{" "}
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
                              className={"pn-icon pn-ms-0 pn-icon-sm"}
                            >
                              {" "}
                              <path d={"M12 5l0 14"}></path>{" "}
                              <path d={"M18 13l-6 6"}></path>{" "}
                              <path d={"M6 13l6 6"}></path>{" "}
                            </svg>{" "}
                          </span>{" "}
                        </div>{" "}
                      </div>{" "}
                    </CardContent>{" "}
                  </Card>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className={"pn-col-12"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Sign in with social media"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"A button per provider, for a social sign-in screen."}
                  </CardDescription>{" "}
                  <div className={"pn-btn-list"}>
                    {" "}
                    <WorkspaceButton className={"pn-btn"}>
                      {" "}
                      <span
                        className={"pn-icon pn-social pn-social-app-apple"}
                      ></span>
                      {" Sign in with Apple"}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {" "}
                      <span
                        className={"pn-icon pn-social pn-social-app-discord"}
                      ></span>
                      {" Sign in with Discord"}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {" "}
                      <span
                        className={"pn-icon pn-social pn-social-app-dribbble"}
                      ></span>
                      {" Sign in with Dribbble"}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {" "}
                      <span
                        className={"pn-icon pn-social pn-social-app-facebook"}
                      ></span>
                      {" Sign in with Facebook"}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {" "}
                      <span
                        className={"pn-icon pn-social pn-social-app-figma"}
                      ></span>
                      {" Sign in with Figma"}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {" "}
                      <span
                        className={"pn-icon pn-social pn-social-app-github"}
                      ></span>
                      {" Sign in with GitHub"}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {" "}
                      <span
                        className={"pn-icon pn-social pn-social-app-google"}
                      ></span>
                      {" Sign in with Google"}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {" "}
                      <span
                        className={"pn-icon pn-social pn-social-app-instagram"}
                      ></span>
                      {" Sign in with Instagram"}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {" "}
                      <span
                        className={"pn-icon pn-social pn-social-app-linkedin"}
                      ></span>
                      {" Sign in with LinkedIn"}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {" "}
                      <span
                        className={"pn-icon pn-social pn-social-app-medium"}
                      ></span>
                      {" Sign in with Medium"}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {" "}
                      <span
                        className={"pn-icon pn-social pn-social-app-meta"}
                      ></span>
                      {" Sign in with Meta"}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {" "}
                      <span
                        className={"pn-icon pn-social pn-social-app-metamask"}
                      ></span>
                      {" Sign in with MetaMask"}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {" "}
                      <span
                        className={"pn-icon pn-social pn-social-app-pinterest"}
                      ></span>
                      {" Sign in with Pinterest"}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {" "}
                      <span
                        className={"pn-icon pn-social pn-social-app-reddit"}
                      ></span>
                      {" Sign in with Reddit"}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {" "}
                      <span
                        className={"pn-icon pn-social pn-social-app-signal"}
                      ></span>
                      {" Sign in with Signal"}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {" "}
                      <span
                        className={"pn-icon pn-social pn-social-app-skype"}
                      ></span>
                      {" Sign in with Skype"}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {" "}
                      <span
                        className={"pn-icon pn-social pn-social-app-snapchat"}
                      ></span>
                      {" Sign in with Snapchat"}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {" "}
                      <span
                        className={"pn-icon pn-social pn-social-app-spotify"}
                      ></span>
                      {" Sign in with Spotify"}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {" "}
                      <span
                        className={"pn-icon pn-social pn-social-app-telegram"}
                      ></span>
                      {" Sign in with Telegram"}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {" "}
                      <span
                        className={"pn-icon pn-social pn-social-app-tiktok"}
                      ></span>
                      {" Sign in with TikTok"}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {" "}
                      <span
                        className={"pn-icon pn-social pn-social-app-tumblr"}
                      ></span>
                      {" Sign in with Tumblr"}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {" "}
                      <span
                        className={"pn-icon pn-social pn-social-app-twitch"}
                      ></span>
                      {" Sign in with Twitch"}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {" "}
                      <span
                        className={"pn-icon pn-social pn-social-app-vk"}
                      ></span>
                      {" Sign in with VK"}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {" "}
                      <span className={"pn-icon pn-social pn-social-app-x"}></span>
                      {" Sign in with X (Twitter)"}
                    </WorkspaceButton>
                    <WorkspaceButton className={"pn-btn"}>
                      {" "}
                      <span
                        className={"pn-icon pn-social pn-social-app-youtube"}
                      ></span>
                      {" Sign in with YouTube "}
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
                    {"List of all social media icons"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Every brand icon shipped with the social icons plugin."}
                  </CardDescription>{" "}
                </CardContent>{" "}
                <CardContent className={"pn-card-body pn-p-0"}>
                  {" "}
                  <div className={"pn-demo-icons-list-wrap"}>
                    {" "}
                    <div className={"pn-demo-icons-list"}>
                      {" "}
                      <span
                        className={"pn-demo-icons-list-item"}
                        title={"Apple"}
                      >
                        {" "}
                        <span
                          className={"pn-social pn-social-app-apple"}
                        ></span>{" "}
                      </span>
                      <span
                        className={"pn-demo-icons-list-item"}
                        title={"Discord"}
                      >
                        {" "}
                        <span
                          className={"pn-social pn-social-app-discord"}
                        ></span>{" "}
                      </span>
                      <span
                        className={"pn-demo-icons-list-item"}
                        title={"Dribbble"}
                      >
                        {" "}
                        <span
                          className={"pn-social pn-social-app-dribbble"}
                        ></span>{" "}
                      </span>
                      <span
                        className={"pn-demo-icons-list-item"}
                        title={"Facebook"}
                      >
                        {" "}
                        <span
                          className={"pn-social pn-social-app-facebook"}
                        ></span>{" "}
                      </span>
                      <span
                        className={"pn-demo-icons-list-item"}
                        title={"Figma"}
                      >
                        {" "}
                        <span
                          className={"pn-social pn-social-app-figma"}
                        ></span>{" "}
                      </span>
                      <span
                        className={"pn-demo-icons-list-item"}
                        title={"GitHub"}
                      >
                        {" "}
                        <span
                          className={"pn-social pn-social-app-github"}
                        ></span>{" "}
                      </span>
                      <span
                        className={"pn-demo-icons-list-item"}
                        title={"Google"}
                      >
                        {" "}
                        <span
                          className={"pn-social pn-social-app-google"}
                        ></span>{" "}
                      </span>
                      <span
                        className={"pn-demo-icons-list-item"}
                        title={"Instagram"}
                      >
                        {" "}
                        <span
                          className={"pn-social pn-social-app-instagram"}
                        ></span>{" "}
                      </span>
                      <span
                        className={"pn-demo-icons-list-item"}
                        title={"LinkedIn"}
                      >
                        {" "}
                        <span
                          className={"pn-social pn-social-app-linkedin"}
                        ></span>{" "}
                      </span>
                      <span
                        className={"pn-demo-icons-list-item"}
                        title={"Medium"}
                      >
                        {" "}
                        <span
                          className={"pn-social pn-social-app-medium"}
                        ></span>{" "}
                      </span>
                      <span className={"pn-demo-icons-list-item"} title={"Meta"}>
                        {" "}
                        <span
                          className={"pn-social pn-social-app-meta"}
                        ></span>{" "}
                      </span>
                      <span
                        className={"pn-demo-icons-list-item"}
                        title={"MetaMask"}
                      >
                        {" "}
                        <span
                          className={"pn-social pn-social-app-metamask"}
                        ></span>{" "}
                      </span>
                      <span
                        className={"pn-demo-icons-list-item"}
                        title={"Pinterest"}
                      >
                        {" "}
                        <span
                          className={"pn-social pn-social-app-pinterest"}
                        ></span>{" "}
                      </span>
                      <span
                        className={"pn-demo-icons-list-item"}
                        title={"Reddit"}
                      >
                        {" "}
                        <span
                          className={"pn-social pn-social-app-reddit"}
                        ></span>{" "}
                      </span>
                      <span
                        className={"pn-demo-icons-list-item"}
                        title={"Signal"}
                      >
                        {" "}
                        <span
                          className={"pn-social pn-social-app-signal"}
                        ></span>{" "}
                      </span>
                      <span
                        className={"pn-demo-icons-list-item"}
                        title={"Skype"}
                      >
                        {" "}
                        <span
                          className={"pn-social pn-social-app-skype"}
                        ></span>{" "}
                      </span>
                      <span
                        className={"pn-demo-icons-list-item"}
                        title={"Snapchat"}
                      >
                        {" "}
                        <span
                          className={"pn-social pn-social-app-snapchat"}
                        ></span>{" "}
                      </span>
                      <span
                        className={"pn-demo-icons-list-item"}
                        title={"Spotify"}
                      >
                        {" "}
                        <span
                          className={"pn-social pn-social-app-spotify"}
                        ></span>{" "}
                      </span>
                      <span
                        className={"pn-demo-icons-list-item"}
                        title={"Telegram"}
                      >
                        {" "}
                        <span
                          className={"pn-social pn-social-app-telegram"}
                        ></span>{" "}
                      </span>
                      <span
                        className={"pn-demo-icons-list-item"}
                        title={"TikTok"}
                      >
                        {" "}
                        <span
                          className={"pn-social pn-social-app-tiktok"}
                        ></span>{" "}
                      </span>
                      <span
                        className={"pn-demo-icons-list-item"}
                        title={"Tumblr"}
                      >
                        {" "}
                        <span
                          className={"pn-social pn-social-app-tumblr"}
                        ></span>{" "}
                      </span>
                      <span
                        className={"pn-demo-icons-list-item"}
                        title={"Twitch"}
                      >
                        {" "}
                        <span
                          className={"pn-social pn-social-app-twitch"}
                        ></span>{" "}
                      </span>
                      <span className={"pn-demo-icons-list-item"} title={"VK"}>
                        {" "}
                        <span
                          className={"pn-social pn-social-app-vk"}
                        ></span>{" "}
                      </span>
                      <span
                        className={"pn-demo-icons-list-item"}
                        title={"X (Twitter)"}
                      >
                        {" "}
                        <span className={"pn-social pn-social-app-x"}></span>{" "}
                      </span>
                      <span
                        className={"pn-demo-icons-list-item"}
                        title={"YouTube"}
                      >
                        {" "}
                        <span
                          className={"pn-social pn-social-app-youtube"}
                        ></span>{" "}
                      </span>{" "}
                      <div></div> <div></div> <div></div> <div></div>{" "}
                      <div></div> <div></div> <div></div> <div></div>{" "}
                      <div></div> <div></div> <div></div> <div></div>{" "}
                      <div></div> <div></div> <div></div> <div></div>{" "}
                      <div></div> <div></div> <div></div> <div></div>{" "}
                      <div></div>{" "}
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
