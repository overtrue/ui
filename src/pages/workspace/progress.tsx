// Keep page composition editable; interaction belongs in the shared components.
import type { CSSProperties } from "react"
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
    <div data-workspace-page="progress" className="pn-page-wrapper">
      {" "}
      <div className={"pn-page-header pn-d-print-none"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-g-2 pn-align-items-center"}>
            {" "}
            <div className={"pn-col"}>
              {" "}
              <h1 className={"pn-page-title"}>{"Progress"}</h1>{" "}
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
          <div
            className={
              "pn-row pn-row-cols-1 pn-row-cols-md-2 pn-row-cols-lg-3 pn-g-3"
            }
          >
            {" "}
            <div className={"pn-col"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Default"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Show what is done, what is moving, and what comes next."}
                  </CardDescription>{" "}
                  <div className={"pn-space-y"}>
                    {" "}
                    <div className={"pn-progress"}>
                      {" "}
                      <div
                        className={"pn-progress-bar"}
                        style={{ width: "0%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={0}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={"0% Complete"}
                      >
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"0% Complete"}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-progress"}>
                      {" "}
                      <div
                        className={"pn-progress-bar"}
                        style={{ width: "20%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={20}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={"20% Complete"}
                      >
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"20% Complete"}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-progress"}>
                      {" "}
                      <div
                        className={"pn-progress-bar"}
                        style={{ width: "40%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={40}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={"40% Complete"}
                      >
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"40% Complete"}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-progress"}>
                      {" "}
                      <div
                        className={"pn-progress-bar"}
                        style={{ width: "100%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={100}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={"100% Complete"}
                      >
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"100% Complete"}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"With value"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Show the exact percentage as the "}
                    <code>{"progress-bar"}</code>
                    {" text inside a larger bar."}
                  </CardDescription>{" "}
                  <div className={"pn-space-y"}>
                    {" "}
                    <div className={"pn-progress pn-progress-lg"}>
                      {" "}
                      <div
                        className={"pn-progress-bar"}
                        style={{ width: "10%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={10}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={"10% Complete"}
                      >
                        {"10%"}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-progress pn-progress-lg"}>
                      {" "}
                      <div
                        className={"pn-progress-bar"}
                        style={{ width: "20%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={20}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={"20% Complete"}
                      >
                        {"20%"}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-progress pn-progress-lg"}>
                      {" "}
                      <div
                        className={"pn-progress-bar"}
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
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Colors"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Match the bar color to the context with any theme color."}
                  </CardDescription>{" "}
                  <div className={"pn-space-y"}>
                    {" "}
                    <div className={"pn-progress"}>
                      {" "}
                      <div
                        className={"pn-progress-bar pn-bg-blue"}
                        style={{ width: "20%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={20}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={"20% Complete"}
                      >
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"20% Complete"}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-progress"}>
                      {" "}
                      <div
                        className={"pn-progress-bar pn-bg-green"}
                        style={{ width: "40%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={40}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={"40% Complete"}
                      >
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"40% Complete"}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-progress"}>
                      {" "}
                      <div
                        className={"pn-progress-bar pn-bg-yellow"}
                        style={{ width: "60%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={60}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={"60% Complete"}
                      >
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"60% Complete"}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-progress"}>
                      {" "}
                      <div
                        className={"pn-progress-bar pn-bg-red"}
                        style={{ width: "80%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={80}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={"80% Complete"}
                      >
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"80% Complete"}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Sizes"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Scale a bar from "}
                    <code>{"progress-sm"}</code>
                    {" to "}
                    <code>{"progress-xl"}</code>
                    {"."}
                  </CardDescription>{" "}
                  <div className={"pn-space-y"}>
                    {" "}
                    <div className={"pn-progress pn-progress-sm"}>
                      {" "}
                      <div
                        className={"pn-progress-bar"}
                        style={{ width: "20%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={20}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={"20% Complete"}
                      >
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"20% Complete"}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-progress"}>
                      {" "}
                      <div
                        className={"pn-progress-bar"}
                        style={{ width: "40%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={40}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={"40% Complete"}
                      >
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"40% Complete"}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-progress pn-progress-lg"}>
                      {" "}
                      <div
                        className={"pn-progress-bar"}
                        style={{ width: "60%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={60}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={"60% Complete"}
                      >
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"60% Complete"}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-progress pn-progress-xl"}>
                      {" "}
                      <div
                        className={"pn-progress-bar"}
                        style={{ width: "80%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={80}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={"80% Complete"}
                      >
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"80% Complete"}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Indeterminate"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Animate a bar with no known end point with "}
                    <code>{"progress-bar-indeterminate"}</code>
                    {"."}
                  </CardDescription>{" "}
                  <div className={"pn-space-y"}>
                    {" "}
                    <div className={"pn-progress"}>
                      {" "}
                      <div
                        className={
                          "pn-progress-bar pn-progress-bar-indeterminate"
                        }
                      ></div>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Multiple values"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {
                      "Stack several segments in one bar to compare parts of a whole."
                    }
                  </CardDescription>{" "}
                  <div className={"pn-space-y"}>
                    {" "}
                    <div className={"pn-progress"}>
                      {" "}
                      <div
                        className={"pn-progress-bar pn-bg-blue"}
                        style={{ width: "20%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={20}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>{" "}
                      <div
                        className={"pn-progress-bar pn-bg-red"}
                        style={{ width: "30%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={30}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>{" "}
                      <div
                        className={"pn-progress-bar pn-bg-green"}
                        style={{ width: "10%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={10}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>{" "}
                    </div>{" "}
                    <div className={"pn-progress pn-progress-separated"}>
                      {" "}
                      <div
                        className={"pn-progress-bar pn-bg-blue"}
                        style={{ width: "10%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={10}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>{" "}
                      <div
                        className={"pn-progress-bar pn-bg-red"}
                        style={{ width: "20%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={20}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>{" "}
                      <div
                        className={"pn-progress-bar pn-bg-green"}
                        style={{ width: "30%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={30}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>{" "}
                      <div
                        className={"pn-progress-bar pn-bg-yellow"}
                        style={{ width: "40%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={40}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Striped"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Add diagonal stripes with "}
                    <code>{"progress-bar-striped"}</code>
                    {" for a textured look."}
                  </CardDescription>{" "}
                  <div className={"pn-space-y"}>
                    {" "}
                    <div className={"pn-progress"}>
                      {" "}
                      <div
                        className={
                          "pn-progress-bar pn-bg-blue pn-progress-bar-striped"
                        }
                        style={{ width: "20%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={20}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={"20% Complete"}
                      >
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"20% Complete"}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-progress"}>
                      {" "}
                      <div
                        className={
                          "pn-progress-bar pn-bg-green pn-progress-bar-striped"
                        }
                        style={{ width: "40%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={40}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={"40% Complete"}
                      >
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"40% Complete"}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-progress"}>
                      {" "}
                      <div
                        className={
                          "pn-progress-bar pn-bg-yellow pn-progress-bar-striped"
                        }
                        style={{ width: "60%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={60}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={"60% Complete"}
                      >
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"60% Complete"}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-progress"}>
                      {" "}
                      <div
                        className={
                          "pn-progress-bar pn-bg-red pn-progress-bar-striped"
                        }
                        style={{ width: "80%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={80}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={"80% Complete"}
                      >
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"80% Complete"}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Animated"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Combine "}
                    <code>{"progress-bar-striped"}</code>
                    {" with "}
                    <code>{"progress-bar-animated"}</code>
                    {" to keep the stripes moving."}
                  </CardDescription>{" "}
                  <div className={"pn-space-y"}>
                    {" "}
                    <div className={"pn-progress"}>
                      {" "}
                      <div
                        className={
                          "pn-progress-bar pn-progress-bar-striped pn-progress-bar-animated"
                        }
                        style={{ width: "20%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={20}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={"20% Complete"}
                      >
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"20% Complete"}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-progress"}>
                      {" "}
                      <div
                        className={
                          "pn-progress-bar pn-bg-green pn-progress-bar-striped pn-progress-bar-animated"
                        }
                        style={{ width: "40%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={40}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={"40% Complete"}
                      >
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"40% Complete"}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-progress"}>
                      {" "}
                      <div
                        className={
                          "pn-progress-bar pn-bg-yellow pn-progress-bar-striped pn-progress-bar-animated"
                        }
                        style={{ width: "60%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={60}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={"60% Complete"}
                      >
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"60% Complete"}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-progress"}>
                      {" "}
                      <div
                        className={
                          "pn-progress-bar pn-bg-red pn-progress-bar-striped pn-progress-bar-animated"
                        }
                        style={{ width: "80%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={80}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={"80% Complete"}
                      >
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"80% Complete"}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Animated with JavaScript"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Update the bar's width at runtime and watch it react."}
                  </CardDescription>{" "}
                  <div className={"pn-row pn-align-items-center pn-g-0"}>
                    {" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-progress"} id={"progress-animated"}>
                        {" "}
                        <div
                          className={"pn-progress-bar"}
                          style={{ width: "0%" } as CSSProperties}
                          role={"progressbar"}
                          aria-valuenow={0}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={"0% Complete"}
                        >
                          {" "}
                          <span className={"pn-visually-hidden"}>
                            {"0% Complete"}
                          </span>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div
                      className={"pn-col-2 pn-text-end"}
                      id={"progress-animated-value"}
                    >
                      {"0%"}
                    </div>{" "}
                  </div>{" "}
                  <div className={"pn-btn-list pn-mt-3"}>
                    {" "}
                    <WorkspaceButton
                      className={"pn-btn pn-btn-sm"}
                      id={"progress-animated-0"}
                    >
                      {"0%"}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton
                      className={"pn-btn pn-btn-sm"}
                      id={"progress-animated-10"}
                    >
                      {"10%"}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton
                      className={"pn-btn pn-btn-sm"}
                      id={"progress-animated-50"}
                    >
                      {"50%"}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton
                      className={"pn-btn pn-btn-sm"}
                      id={"progress-animated-100"}
                    >
                      {"100%"}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton
                      className={"pn-btn pn-btn-sm pn-ms-3"}
                      id={"progress-animated-minus-10"}
                    >
                      {"-10%"}
                    </WorkspaceButton>{" "}
                    <WorkspaceButton
                      className={"pn-btn pn-btn-sm"}
                      id={"progress-animated-add-10"}
                    >
                      {"+10%"}
                    </WorkspaceButton>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Steps Progress"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Mark discrete steps instead of a continuous percentage."}
                  </CardDescription>{" "}
                  <div className={"pn-space-y"}>
                    {" "}
                    <ol className={"pn-progress-steps"}>
                      {" "}
                      <li
                        className={"pn-progress-steps-item pn-bg-primary"}
                        aria-current={"step"}
                      >
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"Step 1"}
                        </span>{" "}
                      </li>{" "}
                      <li className={"pn-progress-steps-item"}>
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"Step 2"}
                        </span>{" "}
                      </li>{" "}
                      <li className={"pn-progress-steps-item"}>
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"Step 3"}
                        </span>{" "}
                      </li>{" "}
                    </ol>{" "}
                    <ol className={"pn-progress-steps"}>
                      {" "}
                      <li className={"pn-progress-steps-item pn-bg-primary"}>
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"Step 1"}
                        </span>{" "}
                      </li>{" "}
                      <li className={"pn-progress-steps-item pn-bg-primary"}>
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"Step 2"}
                        </span>{" "}
                      </li>{" "}
                      <li className={"pn-progress-steps-item pn-bg-primary"}>
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"Step 3"}
                        </span>{" "}
                      </li>{" "}
                      <li
                        className={"pn-progress-steps-item pn-bg-primary"}
                        aria-current={"step"}
                      >
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"Step 4"}
                        </span>{" "}
                      </li>{" "}
                      <li className={"pn-progress-steps-item"}>
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"Step 5"}
                        </span>{" "}
                      </li>{" "}
                    </ol>{" "}
                    <ol className={"pn-progress-steps"}>
                      {" "}
                      <li
                        className={"pn-progress-steps-item pn-bg-red"}
                        aria-current={"step"}
                      >
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"Step 1"}
                        </span>{" "}
                      </li>{" "}
                      <li className={"pn-progress-steps-item"}>
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"Step 2"}
                        </span>{" "}
                      </li>{" "}
                      <li className={"pn-progress-steps-item"}>
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"Step 3"}
                        </span>{" "}
                      </li>{" "}
                      <li className={"pn-progress-steps-item"}>
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"Step 4"}
                        </span>{" "}
                      </li>{" "}
                      <li className={"pn-progress-steps-item"}>
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"Step 5"}
                        </span>{" "}
                      </li>{" "}
                      <li className={"pn-progress-steps-item"}>
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"Step 6"}
                        </span>{" "}
                      </li>{" "}
                      <li className={"pn-progress-steps-item"}>
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"Step 7"}
                        </span>{" "}
                      </li>{" "}
                      <li className={"pn-progress-steps-item"}>
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"Step 8"}
                        </span>{" "}
                      </li>{" "}
                      <li className={"pn-progress-steps-item"}>
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"Step 9"}
                        </span>{" "}
                      </li>{" "}
                      <li className={"pn-progress-steps-item"}>
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"Step 10"}
                        </span>{" "}
                      </li>{" "}
                    </ol>{" "}
                    <ol className={"pn-progress-steps"}>
                      {" "}
                      <li className={"pn-progress-steps-item pn-bg-green"}>
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"Step 1"}
                        </span>{" "}
                      </li>{" "}
                      <li className={"pn-progress-steps-item pn-bg-green"}>
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"Step 2"}
                        </span>{" "}
                      </li>{" "}
                      <li className={"pn-progress-steps-item pn-bg-green"}>
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"Step 3"}
                        </span>{" "}
                      </li>{" "}
                      <li className={"pn-progress-steps-item pn-bg-green"}>
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"Step 4"}
                        </span>{" "}
                      </li>{" "}
                      <li className={"pn-progress-steps-item pn-bg-green"}>
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"Step 5"}
                        </span>{" "}
                      </li>{" "}
                      <li className={"pn-progress-steps-item pn-bg-green"}>
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"Step 6"}
                        </span>{" "}
                      </li>{" "}
                      <li className={"pn-progress-steps-item pn-bg-green"}>
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"Step 7"}
                        </span>{" "}
                      </li>{" "}
                      <li
                        className={"pn-progress-steps-item pn-bg-green"}
                        aria-current={"step"}
                      >
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"Step 8"}
                        </span>{" "}
                      </li>{" "}
                    </ol>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Progress Background"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {
                      "Fill a row's background as the progress indicator itself."
                    }
                  </CardDescription>{" "}
                  <div className={"pn-space-y"}>
                    {" "}
                    <div className={"pn-progressbg"}>
                      {" "}
                      <div className={"pn-progress pn-progressbg-progress"}>
                        {" "}
                        <div
                          className={"pn-progress-bar pn-bg-primary-lt"}
                          style={{ width: "85%" } as CSSProperties}
                          role={"progressbar"}
                          aria-valuenow={85}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={"85% Complete"}
                        >
                          {" "}
                          <span className={"pn-visually-hidden"}>
                            {"85% Complete"}
                          </span>{" "}
                        </div>{" "}
                      </div>{" "}
                      <div className={"pn-progressbg-text"}>{"Poland"}</div>{" "}
                      <div className={"pn-progressbg-value"}>{"85%"}</div>{" "}
                    </div>{" "}
                    <div className={"pn-progressbg"}>
                      {" "}
                      <div className={"pn-progress pn-progressbg-progress"}>
                        {" "}
                        <div
                          className={"pn-progress-bar pn-bg-primary-lt"}
                          style={{ width: "65%" } as CSSProperties}
                          role={"progressbar"}
                          aria-valuenow={65}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={"65% Complete"}
                        >
                          {" "}
                          <span className={"pn-visually-hidden"}>
                            {"65% Complete"}
                          </span>{" "}
                        </div>{" "}
                      </div>{" "}
                      <div className={"pn-progressbg-text"}>{"Germany"}</div>{" "}
                      <div className={"pn-progressbg-value"}>{"65%"}</div>{" "}
                    </div>{" "}
                    <div className={"pn-progressbg"}>
                      {" "}
                      <div className={"pn-progress pn-progressbg-progress"}>
                        {" "}
                        <div
                          className={"pn-progress-bar pn-bg-primary-lt"}
                          style={{ width: "45%" } as CSSProperties}
                          role={"progressbar"}
                          aria-valuenow={45}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={"45% Complete"}
                        >
                          {" "}
                          <span className={"pn-visually-hidden"}>
                            {"45% Complete"}
                          </span>{" "}
                        </div>{" "}
                      </div>{" "}
                      <div className={"pn-progressbg-text"}>
                        {"United States"}
                      </div>{" "}
                      <div className={"pn-progressbg-value"}>{"45%"}</div>{" "}
                    </div>{" "}
                    <div className={"pn-progressbg"}>
                      {" "}
                      <div className={"pn-progress pn-progressbg-progress"}>
                        {" "}
                        <div
                          className={"pn-progress-bar pn-bg-primary-lt"}
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
                      <div className={"pn-progressbg-text"}>{"France"}</div>{" "}
                      <div className={"pn-progressbg-value"}>{"25%"}</div>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Progress Background Colors"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {
                      "Pair a light background fill with a matching accent color."
                    }
                  </CardDescription>{" "}
                  <div className={"pn-space-y"}>
                    {" "}
                    <div className={"pn-progressbg"}>
                      {" "}
                      <div className={"pn-progress pn-progressbg-progress"}>
                        {" "}
                        <div
                          className={"pn-progress-bar pn-bg-success-lt"}
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
                      <div className={"pn-progressbg-text"}>{"Success"}</div>{" "}
                      <div className={"pn-progressbg-value"}>{"75%"}</div>{" "}
                    </div>{" "}
                    <div className={"pn-progressbg"}>
                      {" "}
                      <div className={"pn-progress pn-progressbg-progress"}>
                        {" "}
                        <div
                          className={"pn-progress-bar pn-bg-warning-lt"}
                          style={{ width: "60%" } as CSSProperties}
                          role={"progressbar"}
                          aria-valuenow={60}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={"60% Complete"}
                        >
                          {" "}
                          <span className={"pn-visually-hidden"}>
                            {"60% Complete"}
                          </span>{" "}
                        </div>{" "}
                      </div>{" "}
                      <div className={"pn-progressbg-text"}>{"Warning"}</div>{" "}
                      <div className={"pn-progressbg-value"}>{"60%"}</div>{" "}
                    </div>{" "}
                    <div className={"pn-progressbg"}>
                      {" "}
                      <div className={"pn-progress pn-progressbg-progress"}>
                        {" "}
                        <div
                          className={"pn-progress-bar pn-bg-danger-lt"}
                          style={{ width: "40%" } as CSSProperties}
                          role={"progressbar"}
                          aria-valuenow={40}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={"40% Complete"}
                        >
                          {" "}
                          <span className={"pn-visually-hidden"}>
                            {"40% Complete"}
                          </span>{" "}
                        </div>{" "}
                      </div>{" "}
                      <div className={"pn-progressbg-text"}>{"Danger"}</div>{" "}
                      <div className={"pn-progressbg-value"}>{"40%"}</div>{" "}
                    </div>{" "}
                    <div className={"pn-progressbg"}>
                      {" "}
                      <div className={"pn-progress pn-progressbg-progress"}>
                        {" "}
                        <div
                          className={"pn-progress-bar pn-bg-info-lt"}
                          style={{ width: "90%" } as CSSProperties}
                          role={"progressbar"}
                          aria-valuenow={90}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={"90% Complete"}
                        >
                          {" "}
                          <span className={"pn-visually-hidden"}>
                            {"90% Complete"}
                          </span>{" "}
                        </div>{" "}
                      </div>{" "}
                      <div className={"pn-progressbg-text"}>{"Info"}</div>{" "}
                      <div className={"pn-progressbg-value"}>{"90%"}</div>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Progress Description"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {
                      "Pair a label and percentage with the bar for more context."
                    }
                  </CardDescription>{" "}
                  <div className={"pn-space-y"}>
                    {" "}
                    <div>
                      {" "}
                      <div
                        className={
                          "pn-d-flex pn-mb-1 pn-align-items-center pn-lh-1"
                        }
                      >
                        {" "}
                        <div className={"pn-fs-5 pn-fw-semibold pn-m-0"}>
                          {"Project completion"}
                        </div>{" "}
                        <span className={"pn-ms-auto pn-fs-6 pn-strong"}>
                          {"85%"}
                        </span>{" "}
                      </div>{" "}
                      <div className={"pn-progress"}>
                        {" "}
                        <div
                          className={"pn-progress-bar pn-bg-green"}
                          style={{ width: "85%" } as CSSProperties}
                          role={"progressbar"}
                          aria-valuenow={85}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={"85% Complete"}
                        >
                          {" "}
                          <span className={"pn-visually-hidden"}>
                            {"85% Complete"}
                          </span>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <div
                        className={
                          "pn-d-flex pn-mb-1 pn-align-items-center pn-lh-1"
                        }
                      >
                        {" "}
                        <div className={"pn-fs-5 pn-fw-semibold pn-m-0"}>
                          {"Storage usage"}
                        </div>{" "}
                        <div className={"pn-fs-6 pn-text-secondary pn-ms-2"}>
                          {"2.4GB of 5GB"}
                        </div>{" "}
                        <span className={"pn-ms-auto pn-fs-6 pn-strong"}>
                          {"48%"}
                        </span>{" "}
                      </div>{" "}
                      <div className={"pn-progress"}>
                        {" "}
                        <div
                          className={"pn-progress-bar pn-bg-blue"}
                          style={{ width: "48%" } as CSSProperties}
                          role={"progressbar"}
                          aria-valuenow={48}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={"48% Complete"}
                        >
                          {" "}
                          <span className={"pn-visually-hidden"}>
                            {"48% Complete"}
                          </span>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <div
                        className={
                          "pn-d-flex pn-mb-1 pn-align-items-center pn-lh-1"
                        }
                      >
                        {" "}
                        <div className={"pn-fs-5 pn-fw-semibold pn-m-0"}>
                          {"Download progress"}
                        </div>{" "}
                        <span className={"pn-ms-auto pn-fs-6 pn-strong"}>
                          {"75%"}
                        </span>{" "}
                      </div>{" "}
                      <div className={"pn-progress"}>
                        {" "}
                        <div
                          className={"pn-progress-bar pn-bg-yellow"}
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
                      <div
                        className={
                          "pn-d-flex pn-mb-1 pn-align-items-center pn-lh-1"
                        }
                      >
                        {" "}
                        <div className={"pn-fs-5 pn-fw-semibold pn-m-0"}>
                          {"Skills assessment"}
                        </div>{" "}
                        <div className={"pn-fs-6 pn-text-secondary pn-ms-2"}>
                          {"HTML/CSS"}
                        </div>{" "}
                        <span className={"pn-ms-auto pn-fs-6 pn-strong"}>
                          {"92%"}
                        </span>{" "}
                      </div>{" "}
                      <div className={"pn-progress"}>
                        {" "}
                        <div
                          className={"pn-progress-bar pn-bg-red"}
                          style={{ width: "92%" } as CSSProperties}
                          role={"progressbar"}
                          aria-valuenow={92}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={"92% Complete"}
                        >
                          {" "}
                          <span className={"pn-visually-hidden"}>
                            {"92% Complete"}
                          </span>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <CardTitle className={"pn-card-title"}>
                    {"Progress Description Sizes"}
                  </CardTitle>{" "}
                  <CardDescription className={"pn-card-subtitle"}>
                    {"Scale the labeled progress bar from "}
                    <code>{"progress-sm"}</code>
                    {" to "}
                    <code>{"progress-xl"}</code>
                    {"."}
                  </CardDescription>{" "}
                  <div className={"pn-space-y"}>
                    {" "}
                    <div>
                      {" "}
                      <div
                        className={
                          "pn-d-flex pn-mb-1 pn-align-items-center pn-lh-1"
                        }
                      >
                        {" "}
                        <div className={"pn-fs-5 pn-fw-semibold pn-m-0"}>
                          {"Small progress"}
                        </div>{" "}
                        <span className={"pn-ms-auto pn-fs-6 pn-strong"}>
                          {"60%"}
                        </span>{" "}
                      </div>{" "}
                      <div className={"pn-progress pn-progress-sm"}>
                        {" "}
                        <div
                          className={"pn-progress-bar pn-bg-blue"}
                          style={{ width: "60%" } as CSSProperties}
                          role={"progressbar"}
                          aria-valuenow={60}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={"60% Complete"}
                        >
                          {" "}
                          <span className={"pn-visually-hidden"}>
                            {"60% Complete"}
                          </span>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <div
                        className={
                          "pn-d-flex pn-mb-1 pn-align-items-center pn-lh-1"
                        }
                      >
                        {" "}
                        <div className={"pn-fs-5 pn-fw-semibold pn-m-0"}>
                          {"Default progress"}
                        </div>{" "}
                        <span className={"pn-ms-auto pn-fs-6 pn-strong"}>
                          {"70%"}
                        </span>{" "}
                      </div>{" "}
                      <div className={"pn-progress"}>
                        {" "}
                        <div
                          className={"pn-progress-bar pn-bg-green"}
                          style={{ width: "70%" } as CSSProperties}
                          role={"progressbar"}
                          aria-valuenow={70}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={"70% Complete"}
                        >
                          {" "}
                          <span className={"pn-visually-hidden"}>
                            {"70% Complete"}
                          </span>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <div
                        className={
                          "pn-d-flex pn-mb-1 pn-align-items-center pn-lh-1"
                        }
                      >
                        {" "}
                        <div className={"pn-fs-5 pn-fw-semibold pn-m-0"}>
                          {"Large progress"}
                        </div>{" "}
                        <span className={"pn-ms-auto pn-fs-6 pn-strong"}>
                          {"80%"}
                        </span>{" "}
                      </div>{" "}
                      <div className={"pn-progress pn-progress-lg"}>
                        {" "}
                        <div
                          className={"pn-progress-bar pn-bg-orange"}
                          style={{ width: "80%" } as CSSProperties}
                          role={"progressbar"}
                          aria-valuenow={80}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={"80% Complete"}
                        >
                          {" "}
                          <span className={"pn-visually-hidden"}>
                            {"80% Complete"}
                          </span>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <div
                        className={
                          "pn-d-flex pn-mb-1 pn-align-items-center pn-lh-1"
                        }
                      >
                        {" "}
                        <div className={"pn-fs-5 pn-fw-semibold pn-m-0"}>
                          {"Extra large"}
                        </div>{" "}
                        <span className={"pn-ms-auto pn-fs-6 pn-strong"}>
                          {"90%"}
                        </span>{" "}
                      </div>{" "}
                      <div className={"pn-progress pn-progress-xl"}>
                        {" "}
                        <div
                          className={"pn-progress-bar pn-bg-purple"}
                          style={{ width: "90%" } as CSSProperties}
                          role={"progressbar"}
                          aria-valuenow={90}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={"90% Complete"}
                        >
                          {" "}
                          <span className={"pn-visually-hidden"}>
                            {"90% Complete"}
                          </span>{" "}
                        </div>{" "}
                      </div>{" "}
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
