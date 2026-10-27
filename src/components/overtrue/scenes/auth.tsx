import { useState } from "react";
import { Link } from "react-router-dom";
import {
  IconCheck,
  IconFolderPlus,
  IconAlertTriangle,
  IconSearch,
  IconTool,
  IconClock,
} from "@tabler/icons-react";
import { Action, Avatar } from "./shared";
export function Auth({ id = "sign-in" }: { id?: string }) {
  const [done, setDone] = useState(false),
    [passwordVisible, setPasswordVisible] = useState(false),
    [codeRequested, setCodeRequested] = useState(false);
  const signup = id === "sign-up",
    reset = id === "forgot-password",
    link = id === "sign-in-link",
    verify = id.includes("verification"),
    setup = id === "2-step-verification" && !codeRequested,
    lock = id === "auth-lock";
  const title = signup
    ? "Create your workspace"
    : reset
      ? "Reset your password"
      : verify
        ? "Verify your identity"
        : lock
          ? "Unlock your session"
          : link
            ? "Sign in with email"
            : "Sign in to Acme Studio";
  return (
    <main
      data-workspace-page={id}
      className={
        "scene-auth " +
        (id.includes("cover")
          ? "is-cover"
          : id.includes("illustration")
            ? "is-illustration"
            : "is-centered")
      }
    >
      <aside>
        <a href="/" className="scene-wordmark">
          overtrue/ui
        </a>
        <div>
          <span className="scene-eyebrow">ACME STUDIO</span>
          <h2>
            Your team’s work,
            <br />
            all in one place.
          </h2>
          <p>Plan projects, share feedback, and keep delivery moving.</p>
        </div>
        {id.includes("cover") ? (
          <img
            className="scene-auth-photo"
            src="/assets/overtrue/studio-space.png"
            alt="the demo team’s creative workspace"
          />
        ) : (
          <img
            src="/assets/overtrue/illustration-team.webp"
            alt="People and projects connected"
          />
        )}
        <small>Acme Studio · overtrue/ui workspace demo</small>
      </aside>
      <section>
        <div>
          <a href="/" className="scene-auth-mobile-logo">
            overtrue/ui
          </a>
          <span className="scene-eyebrow">
            {signup ? "GET STARTED" : "Acme Studio"}
          </span>
          {lock && (
            <div className="scene-lock-avatar">
              <Avatar name="Maya Okafor" size={64} />
            </div>
          )}
          <h1>{setup ? "Set up two-step verification" : title}</h1>
          <p>
            {reset
              ? "Enter your email and we’ll prepare a reset link."
              : verify
                ? setup
                  ? "Add a phone number to receive a verification code."
                  : codeRequested
                    ? "Enter the six-digit code to finish this demo."
                    : "Use the six-digit code from your authenticator app."
                : "Use your work email to continue."}
          </p>
          {done ? (
            <div role="status" className="scene-auth-result">
              <span className="scene-state-icon">
                <IconCheck size={28} />
              </span>
              <h2>{reset || link ? "Request prepared" : "Demo complete"}</h2>
              <p>
                This is a demo. No account was created, no email was sent, and
                no credentials were stored.
              </p>
              <Link className="scene-button is-primary" to="/">
                Explore the workspace
              </Link>
            </div>
          ) : (
            <form
              className="scene-form"
              onSubmit={(e) => {
                e.preventDefault();
                setup ? setCodeRequested(true) : setDone(true);
              }}
            >
              {signup && (
                <label>
                  Your name
                  <input
                    autoComplete="name"
                    required
                    placeholder="Alex Morgan"
                  />
                </label>
              )}
              {!lock && !verify && (
                <label>
                  Email address
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@company.com"
                  />
                </label>
              )}
              {setup ? (
                <>
                  <label>
                    Country
                    <select
                      className="native-select"
                      defaultValue="United Kingdom (+44)"
                    >
                      <option>United Kingdom (+44)</option>
                      <option>United States (+1)</option>
                      <option>Germany (+49)</option>
                      <option>Japan (+81)</option>
                    </select>
                  </label>
                  <label>
                    Phone number
                    <input
                      type="tel"
                      autoComplete="tel-national"
                      required
                      pattern="[0-9 +]{6,20}"
                      placeholder="7700 900000"
                    />
                  </label>
                  <small>
                    This example prepares a request locally. No text message
                    will be sent.
                  </small>
                </>
              ) : verify ? (
                <label>
                  Verification code
                  <input
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                    placeholder="000000"
                  />
                </label>
              ) : (
                !reset &&
                !link && (
                  <div className="scene-password-group">
                    <label htmlFor="auth-password">Password</label>
                    <span className="scene-password-field">
                      <input
                        id="auth-password"
                        type={passwordVisible ? "text" : "password"}
                        autoComplete={
                          signup ? "new-password" : "current-password"
                        }
                        minLength={8}
                        required
                        placeholder="At least 8 characters"
                      />
                      <button
                        type="button"
                        aria-label={
                          passwordVisible ? "Hide password" : "Show password"
                        }
                        onClick={() => setPasswordVisible(!passwordVisible)}
                      >
                        {passwordVisible ? "Hide" : "Show"}
                      </button>
                    </span>
                  </div>
                )
              )}
              {!reset && !verify && !link && !signup && (
                <div className="scene-toolbar">
                  <label className="scene-checkbox">
                    <input type="checkbox" />
                    Remember this device
                  </label>
                  <Link to="/forgot-password">Forgot password?</Link>
                </div>
              )}
              {signup && (
                <label className="scene-checkbox">
                  <input type="checkbox" required />I agree to the{" "}
                  <Link to="/terms-of-service">workspace terms</Link>
                </label>
              )}
              <Action type="submit" primary>
                {signup
                  ? "Create workspace"
                  : reset
                    ? "Prepare reset link"
                    : link
                      ? "Prepare sign-in link"
                      : verify
                        ? setup
                          ? "Prepare verification code"
                          : "Verify code"
                        : "Continue to workspace"}
              </Action>
              <p className="scene-auth-disclaimer">
                Interactive example. Use fictional details only.
              </p>
            </form>
          )}
          <footer>
            {signup ? "Already have a workspace?" : "Need a workspace?"}{" "}
            <Link to={signup ? "/sign-in" : "/sign-up"}>
              {signup ? "Sign in" : "Create a workspace"}
            </Link>
          </footer>
        </div>
      </section>
    </main>
  );
}
export function Empty({ id = "empty" }: { id?: string }) {
  const [retried, setRetried] = useState(false);
  const states = {
    "error-404": {
      icon: IconSearch,
      label: "404 · Page not found",
      title: "We couldn’t find that page",
      copy: "The link may be outdated, or the page may have moved. Return to your workspace to find the project.",
      action: "Back to workspace",
      to: "/",
    },
    "error-500": {
      icon: IconAlertTriangle,
      label: "500 · Request failed",
      title: "The workspace couldn’t load",
      copy: "Please retry the request. If it keeps failing, check service status for an ongoing incident.",
      action: "View service status",
      to: "/uptime",
    },
    "error-maintenance": {
      icon: IconTool,
      label: "Scheduled maintenance",
      title: "We’ll be back shortly",
      copy: "Workspace access is paused for a scheduled update. Existing project files are unaffected.",
      action: "View service status",
      to: "/uptime",
    },
    "trial-ended": {
      icon: IconClock,
      label: "Acme Studio · Trial ended",
      title: "Choose a plan to continue",
      copy: "Your 14-day trial has ended. Compare plans or review your billing settings before continuing.",
      action: "Compare plans",
      to: "/pricing",
    },
    blank: {
      icon: IconFolderPlus,
      label: "New workspace",
      title: "Set up your first project",
      copy: "Start with a project name and brief, then invite the people who will help deliver it.",
      action: "Create a project",
      to: "/wizard",
    },
    empty: {
      icon: IconFolderPlus,
      label: "Projects",
      title: "No projects yet",
      copy: "Create a project to keep its tasks, files, and reviews together. Your team will see it here.",
      action: "Create a project",
      to: "/wizard",
    },
  };
  const state = states[id as keyof typeof states] ?? states.empty;
  const Icon = state.icon;
  return (
    <main
      data-workspace-page={id}
      className="scene-empty-page scene-state-page"
    >
      <span className="scene-state-icon">
        <Icon size={30} />
      </span>
      <span className="scene-eyebrow">{state.label}</span>
      <h1>{state.title}</h1>
      <p>{state.copy}</p>
      {id === "error-maintenance" && (
        <dl className="scene-state-details">
          <div>
            <dt>Maintenance window</dt>
            <dd>Sep 22 · 02:00–02:30 UTC</dd>
          </div>
          <div>
            <dt>Affected service</dt>
            <dd>Workspace web application</dd>
          </div>
        </dl>
      )}
      <div className="scene-actions">
        {id === "error-500" && (
          <Action primary onClick={() => setRetried(true)}>
            Retry request
          </Action>
        )}
        <Link
          className={"scene-button" + (id !== "error-500" ? " is-primary" : "")}
          to={state.to}
        >
          {state.action}
        </Link>
      </div>
      {retried && (
        <p role="status">
          The example request still fails. Open service status to inspect the
          incident.
        </p>
      )}
      {id === "trial-ended" && (
        <Link className="scene-state-secondary" to="/settings-plan">
          Review billing settings
        </Link>
      )}
      {id === "empty" && (
        <Link className="scene-state-secondary" to="/search-results">
          Read the getting started guide
        </Link>
      )}
    </main>
  );
}
