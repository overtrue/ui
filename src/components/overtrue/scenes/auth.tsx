import { useState } from "react";
import { Link } from "react-router-dom";
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
    ? "A shared home for your best work."
    : reset
      ? "Let’s get you back in."
      : verify
        ? "One more step to your workspace."
        : lock
          ? "Welcome back, Maya."
          : link
            ? "Your next step is in your inbox."
            : "Good to see you again.";
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
          <span className="scene-eyebrow">
            A LITTLE STRUCTURE. A LOT OF POSSIBILITY.
          </span>
          <h2>
            Make room
            <br />
            for good work.
          </h2>
          <p>
            Projects, people, and the details in between.
            <br />A calmer place to bring it all together.
          </p>
        </div>
        {id.includes("cover") ? (
          <img
            className="scene-auth-photo"
            src="/assets/overtrue/studio-space.png"
            alt="the demo team’s creative workspace"
          />
        ) : (
          <img
            src="/assets/overtrue/illustration-team.svg"
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
            {signup ? "YOUR NEXT CHAPTER" : "ACME STUDIO"}
          </span>
          {lock && (
            <div className="scene-lock-avatar">
              <Avatar name="Maya Okafor" size={64} />
            </div>
          )}
          <h1>{setup ? "Protect your workspace." : title}</h1>
          <p>
            {reset
              ? "Enter your email and we’ll prepare a reset link."
              : verify
                ? setup
                  ? "Add a phone number to receive a verification code."
                  : codeRequested
                    ? "Enter the six-digit code to finish this demo."
                    : "Use the six-digit code from your authenticator app."
                : "Pick up where you left off. Your team is here."}
          </p>
          {done ? (
            <div role="status" className="scene-auth-result">
              <img
                src="/assets/overtrue/illustration-connected.svg"
                alt="Ready to continue"
              />
              <h2>
                {reset || link ? "Request prepared" : "You’re ready to explore"}
              </h2>
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
            {signup ? "Already have a workspace?" : "New to overtrue/ui?"}{" "}
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
  const missing = id === "error-404",
    failed = id === "error-500",
    maintenance = id === "error-maintenance",
    trial = id === "trial-ended";
  const title = missing
    ? "This page took a different path."
    : failed
      ? "Something interrupted the connection."
      : maintenance
        ? "A little care behind the scenes."
        : trial
          ? "Keep your good work going."
          : id === "blank"
            ? "A clean page. A clear starting point."
            : "Your next project starts here.";
  return (
    <main data-workspace-page={id} className="scene-empty-page">
      <a href="/" className="scene-wordmark">
        overtrue/ui
      </a>
      <img
        src={`/assets/overtrue/illustration-${missing ? "search" : failed ? "connected" : maintenance ? "secure" : "start"}.svg`}
        alt="Workspace illustration"
      />
      <span className="scene-eyebrow">
        {id.startsWith("error")
          ? id.replace("error-", "").toUpperCase()
          : "A LITTLE ROOM TO GROW"}
      </span>
      <h1>{title}</h1>
      <p>
        {missing
          ? "The link may have moved. Your workspace is still right where you left it."
          : failed
            ? "Please try again in a moment. Your work is safe."
            : maintenance
              ? "We’re making the workspace a little better. Please check back shortly."
              : trial
                ? "Your sample trial has ended. Explore the available plans to find the right fit."
                : "Give an idea a name, invite your team, and take the first small step together."}
      </p>
      <Link
        className="scene-button is-primary"
        to={trial ? "/pricing" : id.startsWith("error") ? "/" : "/wizard"}
      >
        {trial
          ? "Explore plans"
          : id.startsWith("error")
            ? "Back to workspace"
            : "Create a project"}
      </Link>
    </main>
  );
}
