import { ResourceProgress } from "@/registry/overtrue/resource-progress";
import { MetricGroup } from "@/registry/overtrue/metric-group";
import { useState } from "react";
import { Link } from "react-router-dom";
import { DetailList } from "@/registry/overtrue/detail-list";
import { AuditTrail } from "@/registry/overtrue/audit-trail";
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
    (invoice) => filter === "All invoices" || invoice.status === filter,
  );
  const total = (status: string) =>
    invoices
      .filter((invoice) => invoice.status === status)
      .reduce((sum, invoice) => sum + invoice.amount, 0);
  return (
    <Scene
      id={id}
      title="Billing & payments"
      description="Track project income, follow up on invoices, and keep payment dates in view."
      actions={
        <DownloadButton
          name="workspace-invoices"
          rows={[
            ["Invoice", "Client", "Amount", "Status", "Due"],
            ...shown.map((invoice) => [
              invoice.id,
              invoice.client,
              String(invoice.amount),
              invoice.status,
              invoice.due,
            ]),
          ]}
        />
      }
    >
      <div className="scene-page-tabs">
        <span aria-current="page">Invoices</span>
        <Link to="/revenue">Revenue</Link>
        <Link to="/settings-plan">Plan & usage</Link>
        <Link to="/payment-providers">Payment methods</Link>
        <span className="scene-tabs-context">September 2026 · USD</span>
      </div>
      <MetricGroup className="mb-6">
        <Metric
          label="Collected"
          value={`$${total("Paid").toLocaleString("en-US")}`}
          note={`${invoices.filter((invoice) => invoice.status === "Paid").length} paid invoices`}
        />
        <Metric
          label="Awaiting payment"
          value={`$${total("Pending").toLocaleString("en-US")}`}
          note="Issued invoices, not yet due"
        />
        <Metric
          label="Overdue"
          value={`$${total("Overdue").toLocaleString("en-US")}`}
          note="Follow up with the client"
        />
        <Metric
          label="In draft"
          value={`$${total("Draft").toLocaleString("en-US")}`}
          note="Ready for internal review"
        />
      </MetricGroup>
      <div className="scene-toolbar">
        <FilterTabs
          items={["All invoices", "Paid", "Pending", "Overdue", "Draft"]}
          value={filter}
          onChange={setFilter}
        />
        <span>{shown.length} invoices</span>
      </div>
      <SceneCard className="scene-table-card">
        <div
          className="scene-table-wrap"
          tabIndex={0}
          role="region"
          aria-label="Invoices, scroll to see all columns"
        >
          <table className="scene-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Client</th>
                <th>Issued</th>
                <th>Due date</th>
                <th className="scene-number">Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((invoice) => (
                <tr key={invoice.id}>
                  <td>
                    <Link to={`/invoice?invoice=${invoice.id}`}>
                      <strong>{invoice.id}</strong>
                    </Link>
                  </td>
                  <td>
                    <strong>{invoice.client}</strong>
                    <small>{invoice.description}</small>
                  </td>
                  <td>{invoice.issued}</td>
                  <td>{invoice.due}</td>
                  <td className="scene-number">
                    ${invoice.amount.toLocaleString("en-US")}
                  </td>
                  <td>
                    <Pill>{invoice.status}</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="scene-table-summary" role="status">
          <span>
            {shown.length} of {invoices.length} invoices
          </span>
          <span>
            View total{" "}
            <strong>
              $
              {shown
                .reduce((sum, invoice) => sum + invoice.amount, 0)
                .toLocaleString("en-US")}
            </strong>
          </span>
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
      <div className="scene-page-tabs pn-d-print-none">
        <Link to="/pay">All invoices</Link>
        <span aria-current="page">{inv.id}</span>
        <span className="scene-tabs-context">
          <Pill>{inv.status}</Pill>
        </span>
      </div>
      <div className="scene-product-grid scene-billing-detail">
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
                <th className="scene-number">Qty</th>
                <th className="scene-number">Amount</th>
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
                <td className="scene-number">1</td>
                <td className="scene-number">
                  ${inv.amount.toLocaleString()}.00
                </td>
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
              <span>
                {inv.status === "Paid"
                  ? "Total paid"
                  : inv.status === "Draft"
                    ? "Estimated total"
                    : "Total due"}
              </span>
              <strong>${inv.amount.toLocaleString()}.00 USD</strong>
            </p>
          </div>
          <footer>
            <strong>Thank you for building with us.</strong>
            <p>
              Please include the invoice number with your payment. This is
              sample data; no payment is requested.
            </p>
          </footer>
        </div>
        <aside className="scene-product-aside pn-d-print-none">
          <SceneCard title="Invoice summary">
            <DetailList
              items={[
                {
                  id: "status",
                  label: "Status",
                  value: <Pill>{inv.status}</Pill>,
                },
                {
                  id: "amount",
                  label: "Amount",
                  value: `$${inv.amount.toLocaleString("en-US")}.00`,
                },
                { id: "due", label: "Due", value: inv.due },
                { id: "currency", label: "Currency", value: "USD" },
              ]}
            />
          </SceneCard>
          <SceneCard title="History">
            <AuditTrail
              events={[
                {
                  id: "created",
                  actor: "Alina Petrova",
                  action: "created this invoice",
                  time: inv.issued,
                },
                ...(inv.status !== "Draft"
                  ? [
                      {
                        id: "issued",
                        actor: "Alina Petrova",
                        action: "issued the project deposit invoice",
                        time: inv.issued,
                      },
                    ]
                  : []),
              ]}
            />
          </SceneCard>
          <Go to="/pay">Back to invoices</Go>
        </aside>
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
      title="Choose a plan"
      description="Compare limits and features for your team’s next stage."
      actions={
        <FilterTabs
          items={["Monthly", "Yearly"]}
          value={period}
          onChange={setPeriod}
        />
      }
    >
      <div className="scene-page-tabs">
        <span aria-current="page">Plans</span>
        <Link to="/pricing-table">Feature comparison</Link>
        <Link to="/settings-plan">Current subscription</Link>
      </div>
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
      title="Compare plans"
      description="Features, limits, and pricing side by side."
      actions={
        <FilterTabs
          items={["Monthly", "Yearly"]}
          value={yearly ? "Yearly" : "Monthly"}
          onChange={(value) => setYearly(value === "Yearly")}
        />
      }
    >
      <div className="scene-page-tabs">
        <Link to="/pricing">Plans</Link>
        <span aria-current="page">Feature comparison</span>
        <Link to="/settings-plan">Current subscription</Link>
      </div>
      <SceneCard
        title="Included in each plan"
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
      title="Plan & usage"
      description="A clear picture of what your workspace includes, and how you’re using it."
      actions={<Go to="/pricing-table">Compare plans</Go>}
    >
      <div className="scene-page-tabs">
        <Link to="/settings">Workspace settings</Link>
        <span aria-current="page">Plan & usage</span>
        <Link to="/pay">Invoices</Link>
      </div>
      <div className="scene-product-grid">
        <div className="scene-product-primary">
          <SceneCard title="Studio plan" action={<Pill>Active</Pill>}>
            <div className="scene-plan-current">
              <div>
                <strong>
                  $232<span>/ month</span>
                </strong>
                <p>8 seats × $29 · Monthly billing</p>
              </div>
              <div>
                <small>Next billing date</small>
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
        <aside className="scene-product-aside">
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
