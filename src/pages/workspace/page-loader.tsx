import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconCheck } from "@tabler/icons-react";
export default function Page() {
  const [ready, setReady] = useState(false),
    [attempt, setAttempt] = useState(0);
  useEffect(() => {
    setReady(false);
    const timer = setTimeout(() => setReady(true), 2400);
    return () => clearTimeout(timer);
  }, [attempt]);
  return (
    <main data-workspace-page="page-loader" className="pn-page pn-page-center">
      <div className="showcase-loader">
        <a href="/" className="scene-wordmark">
          overtrue/ui
        </a>
        <div className="showcase-loader-status" role="status">
          {ready ? (
            <IconCheck size={32} />
          ) : (
            <span className="pn-spinner-border" aria-hidden="true" />
          )}
          <h1>
            {ready ? "Your workspace is ready" : "Preparing your workspace"}
          </h1>
          <p>
            {ready
              ? "Everything is in place. Pick up where you left off."
              : "Gathering your projects, people, and the latest updates."}
          </p>
        </div>
        <div
          className="pn-progress pn-progress-sm"
          aria-label="Workspace loading"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={ready ? 100 : undefined}
        >
          <div
            className={`pn-progress-bar ${ready ? "" : "pn-progress-bar-indeterminate"}`}
            style={ready ? { width: "100%" } : undefined}
          />
        </div>
        <div className="showcase-loader-actions">
          <button
            className="scene-button"
            onClick={() => {
              setReady(false);
              setAttempt((value) => value + 1);
            }}
            disabled={!ready}
          >
            Replay loading
          </button>
          <Link className="scene-button is-primary" to="/">
            Open workspace
          </Link>
        </div>
        <small>Loading state example · No remote data is fetched</small>
      </div>
    </main>
  );
}
