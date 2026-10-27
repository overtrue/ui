import { NavLink } from "react-router-dom";
import {
  RevenueOverview,
  sampleRevenue,
} from "@/registry/overtrue/revenue-overview";
import { ModelUsage, sampleModelUsage } from "@/registry/overtrue/model-usage";
import { AnalyticsOverview } from "@/registry/overtrue/analytics-overview";
import { CohortGrid } from "@/registry/overtrue/cohort-grid";
import { ResourceProgress } from "@/registry/overtrue/resource-progress";
import { DetailList } from "@/registry/overtrue/detail-list";
import { useState } from "react";
import {
  Go,
  Scene,
  SceneCard,
  Action,
  FilterTabs,
  DownloadButton,
} from "./shared";

function ReportNavigation() {
  return (
    <nav className="scene-page-tabs" aria-label="Reports">
      <NavLink end to="/charts">
        Acquisition
      </NavLink>
      <NavLink end to="/charts-advanced">
        Retention
      </NavLink>
      <NavLink end to="/revenue">
        Revenue
      </NavLink>
      <NavLink end to="/ai-usage">
        AI usage
      </NavLink>
    </nav>
  );
}

export function Acquisition() {
  return (
    <Scene
      id="charts"
      title="Website performance"
      description="From first visit to subscription · Client portal analytics"
    >
      <ReportNavigation />
      <AnalyticsOverview className="scene-embed" />
      <div className="scene-report-footnote">
        <span>Reporting source · Demo portal events</span>
        <Go to="/charts-advanced">Explore retention</Go>
      </div>
    </Scene>
  );
}

export function Retention() {
  const [mode, setMode] = useState("Retention %");
  const [selected, setSelected] = useState(
    "Select a cohort cell to inspect its retained subscribers.",
  );
  const cohorts = sampleRevenue.retention.cohorts;
  return (
    <Scene
      id="charts-advanced"
      title="Subscriber retention"
      description="Understand how long subscribers stay after their first month."
      actions={
        <DownloadButton
          name="subscriber-cohorts"
          rows={[
            ["Cohort", "Subscribers", "Retention by month"],
            ...cohorts.map((c) => [
              c.label,
              String(c.size),
              c.values
                .map((v) =>
                  v === null ? "Pending" : `${Math.round(v * 100)}%`,
                )
                .join(" / "),
            ]),
          ]}
        />
      }
    >
      <ReportNavigation />
      <CohortGrid
        title="Monthly signup cohorts"
        description="Each row follows the subscribers who joined in that month."
        cohorts={cohorts}
        periods={sampleRevenue.retention.periods}
        mode={mode === "Retention %" ? "percent" : "count"}
        unit="subscribers"
        actions={
          <FilterTabs
            items={["Retention %", "Subscriber count"]}
            value={mode}
            onChange={setMode}
          />
        }
        onCellSelect={(cell) =>
          setSelected(
            `${cell.label} · ${cell.period}: ${cell.retained?.toLocaleString() ?? "No"} retained subscribers of ${cell.base.toLocaleString()}.`,
          )
        }
      />
      <div className="scene-grid-two scene-report-context">
        <SceneCard title="Cohort detail">
          <p role="status">{selected}</p>
          <DetailList
            items={[
              {
                id: "definition",
                label: "Active subscriber",
                value: "Paid subscription in the month",
              },
              {
                id: "cohort",
                label: "Cohort start",
                value: "First paid subscription",
              },
              {
                id: "pending",
                label: "Blank cells",
                value: "Period not reached yet",
              },
            ]}
          />
        </SceneCard>
        <SceneCard title="Read the pattern">
          <p>
            Compare the same month across rows to see whether new subscribers
            are retaining better. Later months will have fewer completed
            cohorts.
          </p>
          <Go to="/revenue">View revenue movement</Go>
        </SceneCard>
      </div>
    </Scene>
  );
}

export function Revenue() {
  return (
    <Scene
      id="revenue"
      title="Revenue report"
      description="Monthly subscription performance · September 2026"
      actions={
        <DownloadButton
          name="revenue-summary"
          rows={[
            ["Metric", "Value"],
            ...sampleRevenue.metrics.map((metric) => [
              metric.label,
              String(metric.value),
            ]),
          ]}
        />
      }
    >
      <ReportNavigation />
      <RevenueOverview
        className="scene-embed"
        data={{ ...sampleRevenue, title: "Subscriptions" }}
      />
      <div className="scene-report-footnote">
        <span>USD · Sample subscription ledger · September close</span>
        <Go to="/pay">Review invoices</Go>
      </div>
    </Scene>
  );
}

export function AiUsage() {
  const [tab, setTab] = useState("Usage");
  const [budget, setBudget] = useState("500");
  const [savedBudget, setSavedBudget] = useState(500);
  const [notice, setNotice] = useState("");
  const spend = sampleModelUsage.models.reduce(
    (sum, model) => sum + model.cost,
    0,
  );
  return (
    <Scene
      id="ai-usage"
      title="AI usage & cost"
      description="Studio assistant · Requests, token usage, and monthly spend"
      actions={
        <DownloadButton
          name="model-usage"
          rows={[
            ["Model", "Requests", "Input tokens", "Output tokens", "Cost"],
            ...sampleModelUsage.models.map((model) => [
              model.label,
              String(model.requests),
              String(model.inputTokens),
              String(model.outputTokens),
              String(model.cost),
            ]),
          ]}
        />
      }
    >
      <ReportNavigation />
      <div className="scene-toolbar">
        <FilterTabs
          items={["Usage", "Budget controls"]}
          value={tab}
          onChange={setTab}
        />
        <span className="scene-subtle">
          Monthly budget · ${savedBudget.toLocaleString()}
        </span>
      </div>
      {tab === "Usage" ? (
        <ModelUsage className="scene-embed" data={sampleModelUsage} />
      ) : (
        <div className="scene-product-grid">
          <SceneCard
            title="Monthly spend limit"
            description="Set the warning threshold for the studio assistant."
          >
            <form
              className="scene-form"
              onSubmit={(e) => {
                e.preventDefault();
                setSavedBudget(Number(budget));
                setNotice("Budget warning threshold saved in this preview.");
              }}
            >
              <label>
                Budget in USD
                <input
                  type="number"
                  required
                  min={1}
                  step={1}
                  value={budget}
                  onChange={(e) => {
                    setBudget(e.target.value);
                    setNotice("");
                  }}
                />
              </label>
              <ResourceProgress
                label="Spend this month"
                value={spend}
                max={savedBudget}
                valueLabel={`$${spend.toFixed(2)} of $${savedBudget.toLocaleString()}`}
              />
              <Action type="submit" primary>
                Save budget
              </Action>
              <p role="status">{notice}</p>
            </form>
          </SceneCard>
          <SceneCard title="How the warning works">
            <p>
              The warning appears when reported spend reaches this threshold.
              This preview does not restrict live API traffic.
            </p>
            <DetailList
              items={[
                {
                  id: "period",
                  label: "Reset period",
                  value: "Calendar month",
                },
                {
                  id: "owner",
                  label: "Budget owner",
                  value: "Workspace admins",
                },
                { id: "currency", label: "Billing currency", value: "USD" },
              ]}
            />
          </SceneCard>
        </div>
      )}
    </Scene>
  );
}
