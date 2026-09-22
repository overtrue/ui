import { ResourceProgress } from "@/registry/overtrue/resource-progress";
import { MetricGroup } from "@/registry/overtrue/metric-group";
import { useState } from "react";
import { invoices } from "@/data/workspace/studio";
import {
  Scene,
  SceneCard,
  Metric,
  Pill,
  Action,
  Go,
  FilterTabs,
  DownloadButton,
} from "./shared";
export function Billing({ id = "pay" }: { id?: string }) {
  const [filter, setFilter] = useState("All invoices");
  const shown = invoices.filter(
    (i) => filter === "All invoices" || i.status === filter,
  );
  return (
    <Scene
      id={id}
      title="Billing & payments"
      description="Keep project income, invoices, and payment dates in view."
      actions={
        <DownloadButton
          name="workspace-invoices"
          rows={[
            ["Invoice", "Client", "Amount", "Status"],
            ...invoices.map((i) => [
              i.id,
              i.client,
              String(i.amount),
              i.status,
            ]),
          ]}
        />
      }
    >
      <MetricGroup className="mb-6">
        <Metric label="Collected this month" value="$11,550" change="+14.2%" />
        <Metric
          label="Awaiting payment"
          value="$4,410"
          note="1 invoice due in October"
        />
        <Metric label="Overdue" value="$3,395" note="Supply company · 3 days" />
        <Metric
          label="Draft invoices"
          value="1"
          note="$5,355 ready to review"
        />
      </MetricGroup>
      <SceneCard
        title="Invoices"
        action={<Go to="/invoice">View sample invoice</Go>}
      >
        <FilterTabs
          items={["All invoices", "Paid", "Pending", "Overdue", "Draft"]}
          value={filter}
          onChange={setFilter}
        />
        <div className="scene-table-wrap">
          <table className="scene-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Client</th>
                <th>Issued</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((i) => (
                <tr key={i.id}>
                  <td>
                    <Go to={"/invoice?invoice=" + i.id}>{i.id}</Go>
                  </td>
                  <td>
                    <strong>{i.client}</strong>
                    <small>{i.description}</small>
                  </td>
                  <td>{i.issued}</td>
                  <td>${i.amount.toLocaleString()}</td>
                  <td>
                    <Pill>{i.status}</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SceneCard>
    </Scene>
  );
}
export function Invoice() {
  const selected = new URLSearchParams(location.hash.split("?")[1]).get(
    "invoice",
  );
  const inv = invoices.find((i) => i.id === selected) ?? invoices[0];
  return (
    <Scene
      id="invoice"
      title={inv.id}
      description={`${inv.client} · Project deposit`}
      actions={<Action onClick={() => window.print()}>Print invoice</Action>}
    >
      <div className="scene-invoice">
        <header>
          <div className="scene-wordmark">
            overtrue/ui<span>Acme Studio</span>
          </div>
          <div>
            <h2>Invoice</h2>
            <Pill>{inv.status}</Pill>
          </div>
        </header>
        <div className="scene-invoice-addresses">
          <div>
            <small>FROM</small>
            <strong>Acme Studio</strong>
            <p>
              24 Workshop Lane
              <br />
              London, UK
              <br />
              billing@acme.example
            </p>
          </div>
          <div>
            <small>BILL TO</small>
            <strong>{inv.client}</strong>
            <p>
              Client project office
              <br />
              accounts@client.example
            </p>
          </div>
          <dl>
            <dt>Invoice number</dt>
            <dd>{inv.id}</dd>
            <dt>Issued</dt>
            <dd>{inv.issued}</dd>
            <dt>Payment due</dt>
            <dd>{inv.due}</dd>
          </dl>
        </div>
        <table className="scene-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>{inv.description}</strong>
                <small>
                  Discovery & initial direction · 35% project deposit
                </small>
              </td>
              <td>1</td>
              <td>${inv.amount.toLocaleString()}.00</td>
            </tr>
          </tbody>
        </table>
        <div className="scene-invoice-total">
          <p>
            <span>Subtotal</span>
            <b>${inv.amount.toLocaleString()}.00</b>
          </p>
          <p>
            <span>Tax (0%)</span>
            <b>$0.00</b>
          </p>
          <p>
            <span>Total due</span>
            <strong>${inv.amount.toLocaleString()}.00 USD</strong>
          </p>
        </div>
        <footer>
          <strong>Thank you for building with us.</strong>
          <p>
            Please include the invoice number with your payment. This is sample
            data; no payment is requested.
          </p>
        </footer>
      </div>
    </Scene>
  );
}
export function Plans({ id = "pricing" }: { id?: string }) {
  const [period, setPeriod] = useState("Monthly"),
    [chosen, setChosen] = useState("Studio");
  return (
    <Scene
      id={id}
      title="A little structure. More room to grow."
      description="Choose the space your team needs. Every plan includes the essentials."
      actions={
        <FilterTabs
          items={["Monthly", "Yearly"]}
          value={period}
          onChange={setPeriod}
        />
      }
    >
      <div className="scene-plan-grid">
        {[
          {
            name: "Independent",
            price: 12,
            for: "A focused home for solo work.",
            features: [
              "3 active projects",
              "10 GB asset storage",
              "Unlimited client review links",
              "Email support",
            ],
          },
          {
            name: "Studio",
            price: 29,
            for: "For small teams doing ambitious work.",
            features: [
              "Unlimited projects",
              "100 GB asset storage",
              "Team permissions & approvals",
              "Priority support",
            ],
          },
          {
            name: "Collective",
            price: 59,
            for: "Shared standards across growing teams.",
            features: [
              "Multiple workspaces",
              "500 GB asset storage",
              "Audit logs & advanced controls",
              "Dedicated onboarding",
            ],
          },
        ].map((plan) => (
          <SceneCard
            className={plan.name === "Studio" ? "scene-featured-plan" : ""}
            key={plan.name}
          >
            <div className="scene-toolbar">
              <h2>{plan.name}</h2>
              {plan.name === "Studio" && <Pill>Popular</Pill>}
            </div>
            <p>{plan.for}</p>
            <div className="scene-price">
              ${Math.round(plan.price * (period === "Yearly" ? 0.8 : 1))}
              <span>/ seat / month</span>
            </div>
            <small>
              {period === "Yearly"
                ? "Billed yearly · save 20%"
                : "Billed monthly"}
            </small>
            <ul className="scene-plan-features">
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <Action
              primary={plan.name === "Studio"}
              onClick={() => setChosen(plan.name)}
            >
              {chosen === plan.name ? "Selected plan" : "Choose " + plan.name}
            </Action>
          </SceneCard>
        ))}
      </div>
      <p role="status" className="scene-empty">
        {chosen} selected · {period.toLowerCase()} billing. Demo only; no
        subscription changes are made.
      </p>
      <div className="scene-grid-two">
        <SceneCard title="Can we change plans later?">
          <p>
            Yes. Teams can move between plans as their work changes. Your files
            and project history stay with the workspace.
          </p>
        </SceneCard>
        <SceneCard title="What counts as a seat?">
          <p>
            A seat is a workspace member who creates or edits work. Guest
            reviewers can read shared projects and leave feedback.
          </p>
        </SceneCard>
      </div>
    </Scene>
  );
}

export function PlanComparison() {
  const [yearly, setYearly] = useState(false);
  const [selected, setSelected] = useState("Studio");
  const features = [
    ["Active projects", "3", "Unlimited", "Unlimited"],
    ["Asset storage", "10 GB", "100 GB", "500 GB"],
    ["Client review links", "Included", "Included", "Included"],
    ["Team permissions", "Basic", "Advanced", "Advanced"],
    ["Audit history", "7 days", "90 days", "1 year"],
    ["Support", "Email", "Priority", "Dedicated"],
  ];
  return (
    <Scene
      id="pricing-table"
      title="Find the right amount of room"
      description="Compare the details before choosing a home for your team."
      actions={
        <FilterTabs
          items={["Monthly", "Yearly"]}
          value={yearly ? "Yearly" : "Monthly"}
          onChange={(value) => setYearly(value === "Yearly")}
        />
      }
    >
      <SceneCard
        title="Every plan starts with the essentials"
        description="Prices per seat, per month. Annual billing saves 20%."
      >
        <div className="scene-table-wrap">
          <table className="scene-table scene-comparison">
            <thead>
              <tr>
                <th>Included in your workspace</th>
                {["Independent", "Studio", "Collective"].map((name, i) => (
                  <th key={name}>
                    <strong>{name}</strong>
                    <span>
                      ${Math.round([12, 29, 59][i] * (yearly ? 0.8 : 1))}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((row) => (
                <tr key={row[0]}>
                  <th>{row[0]}</th>
                  {row.slice(1).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
              <tr>
                <td>Choose your plan</td>
                {["Independent", "Studio", "Collective"].map((name) => (
                  <td key={name}>
                    <Action
                      primary={name === "Studio"}
                      onClick={() => setSelected(name)}
                    >
                      {selected === name ? "Selected" : `Choose ${name}`}
                    </Action>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </SceneCard>
      <p className="scene-empty" role="status">
        {selected} selected for {yearly ? "yearly" : "monthly"} billing. No
        subscription changes are made.
      </p>
    </Scene>
  );
}

export function PlanSettings() {
  const [email, setEmail] = useState("billing@acme.example");
  const [saved, setSaved] = useState(false);
  return (
    <Scene
      id="settings-plan"
      title="Your plan & usage"
      description="A clear picture of what your workspace includes, and how you’re using it."
      actions={<Go to="/pricing-table">Compare plans</Go>}
    >
      <div className="scene-grid-main">
        <div>
          <SceneCard title="Studio plan" action={<Pill>Active</Pill>}>
            <div className="scene-plan-current">
              <div>
                <strong>
                  $232<span>/ month</span>
                </strong>
                <p>8 seats × $29 · Monthly billing</p>
              </div>
              <div>
                <small>NEXT BILLING DATE</small>
                <h3>October 01, 2026</h3>
                <p>No changes scheduled</p>
              </div>
            </div>
            <div className="scene-toolbar">
              <span>Unlimited projects · Priority support</span>
              <Go to="/pricing">Explore other plans</Go>
            </div>
          </SceneCard>
          <SceneCard title="Billing contact">
            <form
              className="scene-form"
              onSubmit={(event) => {
                event.preventDefault();
                setSaved(true);
              }}
            >
              <label>
                Invoice email
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setSaved(false);
                  }}
                />
              </label>
              <div className="scene-form-footer">
                <Action type="submit" primary>
                  Save billing contact
                </Action>
                {saved && (
                  <span role="status">
                    Billing contact saved for this session.
                  </span>
                )}
              </div>
            </form>
          </SceneCard>
        </div>
        <aside>
          <SceneCard title="Workspace usage">
            <ResourceProgress
              className="mb-6"
              label="Member seats"
              value={8}
              max={12}
              valueLabel="8 / 12"
            />
            <ResourceProgress
              className="mb-6"
              label="Asset storage"
              value={42.8}
              max={100}
              valueLabel="42.8 / 100 GB"
            />
            <div className="scene-resource">
              <span>
                Active projects<b>5 · Unlimited</b>
              </span>
            </div>
            <Go to="/pay">View invoices</Go>
          </SceneCard>
          <div className="scene-note">
            <h3>Room for the next chapter.</h3>
            <p>
              Your current plan has capacity for four more people and the next
              round of project files.
            </p>
          </div>
        </aside>
      </div>
    </Scene>
  );
}
