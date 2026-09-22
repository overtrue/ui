import { SearchField as RegistrySearchField } from "@/registry/overtrue/search-field";
import { FilterTabs as RegistryFilterTabs } from "@/registry/overtrue/filter-tabs";
import { MetricGroupItem } from "@/registry/overtrue/metric-group";
import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  IconArrowUpRight,
  IconPlus,
  IconCheck,
  IconDownload,
} from "@tabler/icons-react";
import { team, updates } from "@/data/workspace/studio";
import { cn } from "@/lib/utils";
export function Scene({
  id,
  title,
  description,
  eyebrow = "Acme Studio",
  actions,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div data-workspace-page={id} className="pn-page-wrapper scene">
      <div className="pn-container-xl">
        <header className="scene-heading">
          <div>
            <p className="scene-eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            {description && <p>{description}</p>}
          </div>
          {actions && <div className="scene-actions">{actions}</div>}
        </header>
        {children}
        <p className="scene-demo-note">
          Acme Studio · Sample people, clients, and records. Interactions use
          local demo data.
        </p>
      </div>
    </div>
  );
}
export function SceneCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("scene-card", className)}>
      {title && (
        <header>
          <div>
            <h2>{title}</h2>
            {description && <p>{description}</p>}
          </div>
          {action}
        </header>
      )}
      <div className="scene-card-content">{children}</div>
    </section>
  );
}
export function Action({
  children,
  onClick,
  primary = false,
  disabled = false,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  primary?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      className={cn("scene-button", primary && "is-primary")}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
export function Go({
  to,
  children,
  primary = false,
}: {
  to: string;
  children: ReactNode;
  primary?: boolean;
}) {
  return (
    <Link to={to} className={cn("scene-button", primary && "is-primary")}>
      {children}
      <IconArrowUpRight size={15} />
    </Link>
  );
}
export function Pill({ children }: { children: ReactNode }) {
  const text = String(children);
  return (
    <span
      className={cn(
        "scene-pill",
        /Complete|Paid|Active|Partner|Healthy|Resolved|Delivered|Published|Operational/i.test(
          text,
        )
          ? "is-success"
          : /Overdue|High|Failed|Error|Outage/i.test(text)
            ? "is-danger"
            : /review|Pending|Planned|Prospect|Warn|Degraded/i.test(text)
              ? "is-warning"
              : "is-info",
      )}
    >
      <i />
      {children}
    </span>
  );
}
export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const person = team.find((p) => p.name === name);
  return (
    <img
      className="scene-avatar"
      src={`/assets/overtrue/people/${person?.id ?? "guest"}.svg`}
      alt={name}
      width={size}
      height={size}
      style={{ width: size, height: size, alignSelf: "flex-start" }}
    />
  );
}
export function Person({
  name,
  subtitle,
}: {
  name: string;
  subtitle?: string;
}) {
  return (
    <span className="scene-person">
      <Avatar name={name} />
      <span>
        <strong>{name}</strong>
        {subtitle && <small>{subtitle}</small>}
      </span>
    </span>
  );
}
export function Metric({
  label,
  value,
  change,
  note,
}: {
  label: string;
  value: string;
  change?: string;
  note?: string;
}) {
  return (
    <MetricGroupItem
      label={label}
      value={value}
      context={
        <>
          {change && (
            <b className="font-medium text-emerald-700 dark:text-emerald-400">
              {change}
            </b>
          )}{" "}
          {note ?? "compared with last month"}
        </>
      }
    />
  );
}
export function Progress({ value }: { value: number }) {
  return (
    <div
      className="scene-progress"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Project progress"
    >
      <span style={{ width: `${value}%` }} />
    </div>
  );
}
export function Feed({ limit = 5 }: { limit?: number }) {
  return (
    <ol className="scene-feed">
      {updates.slice(0, limit).map((item) => (
        <li key={item.id}>
          <Avatar name={item.person.name} />
          <div>
            <strong>{item.title}</strong>
            <p>{item.detail}</p>
            <small>
              {item.person.name} · {item.time}
            </small>
          </div>
        </li>
      ))}
    </ol>
  );
}
export function SearchField({
  value,
  onChange,
  placeholder = "Search records…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <RegistrySearchField
      label={placeholder}
      value={value}
      onValueChange={onChange}
      placeholder={placeholder}
      containerClassName="w-full sm:w-64"
    />
  );
}
export function FilterTabs({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <RegistryFilterTabs
      label="Filter results"
      items={items.map((item) => ({ value: item, label: item }))}
      value={value}
      onValueChange={onChange}
      className="scene-tabs"
    />
  );
}

export function DownloadButton({
  name = "workspace-report",
  rows,
}: {
  name?: string;
  rows: string[][];
}) {
  return (
    <Action
      onClick={() => {
        const csv = rows
          .map((row) =>
            row.map((cell) => '"' + cell.replaceAll('"', '""') + '"').join(","),
          )
          .join("\n");
        const link = document.createElement("a"),
          url = URL.createObjectURL(
            new Blob([csv], { type: "text/csv;charset=utf-8" }),
          );
        link.href = url;
        link.download = name + ".csv";
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }}
    >
      <IconDownload size={16} />
      Export
    </Action>
  );
}
export function Invite() {
  const [open, setOpen] = useState(false),
    [email, setEmail] = useState(""),
    [sent, setSent] = useState(false);
  return (
    <div className="scene-invite">
      <Action
        primary
        onClick={() => {
          setOpen(!open);
          setSent(false);
        }}
      >
        <IconPlus size={16} />
        Invite member
      </Action>
      {open && (
        <form
          className="scene-inline-form"
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
          }}
        >
          <label>
            Email address
            <input
              type="email"
              required
              placeholder="teammate@example.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setSent(false);
              }}
            />
          </label>
          <Action type="submit">Prepare invitation</Action>
          {sent && (
            <p role="status">
              <IconCheck size={14} />
              Invitation ready for {email}. Demo only; no email was sent.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
