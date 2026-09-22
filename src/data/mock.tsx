import { team, updates, invoices as studioInvoices, tasks as studioTasks } from "./workspace/studio"
import type { NotificationItem } from "@/components/overtrue/notification-menu"
import type { AppBrand } from "@/components/overtrue/apps-menu"
import type { ActivityItemData } from "@/components/overtrue/activity-feed"
import type { InvoiceRow } from "@/components/overtrue/invoice-table"
import type { SparklinePoint } from "@/components/overtrue/sparkline-card"

export const notifications: NotificationItem[] = updates.map((item, i) => ({ id: item.id, title: item.title, meta: item.time, unread: i < 2 }))

export const apps: AppBrand[] = [
  { id: "amazon", href: "https://aws.amazon.com/", name: "Amazon", color: "#ff9900" },
  { id: "github", href: "https://github.com/", name: "Github", color: "#181717" },
  { id: "google", href: "https://workspace.google.com/", name: "Google", color: "#dc4e41" },
  { id: "slack", href: "https://slack.com/", name: "Slack", color: "#4a154b" },
  { id: "spotify", href: "https://open.spotify.com/", name: "Spotify", color: "#1db954" },
  { id: "youtube", href: "https://www.youtube.com/", name: "Youtube", color: "#ff0000" },
  { id: "twitter", href: "https://x.com/", name: "Twitter", color: "#1da1f2" },
  { id: "linkedin", href: "https://www.linkedin.com/", name: "LinkedIn", color: "#0a66c2" },
]

export const activityItems: ActivityItemData[] = updates.map(item => ({ id: item.id, initials: item.person.initials, text: <><strong>{item.person.name}</strong> {item.title.toLowerCase()}</>, time: item.time }))

export const invoices: InvoiceRow[] = studioInvoices.map((item, i) => ({ no: item.id, subject: item.description, client: item.client, vat: `DEMO-${100+i}`, created: item.issued, status: item.status === "Paid" ? "paid" : "pending", statusLabel: item.status, price: `$${item.amount.toLocaleString()}` }))

export const salesSeries: SparklinePoint[] = [
  { label: "Mon", value: 42 },
  { label: "Tue", value: 58 },
  { label: "Wed", value: 51 },
  { label: "Thu", value: 73 },
  { label: "Fri", value: 66 },
  { label: "Sat", value: 88 },
  { label: "Sun", value: 75 },
]

export const revenueSeries: SparklinePoint[] = [
  { label: "Mon", value: 30 },
  { label: "Tue", value: 45 },
  { label: "Wed", value: 40 },
  { label: "Thu", value: 62 },
  { label: "Fri", value: 55 },
  { label: "Sat", value: 70 },
  { label: "Sun", value: 64 },
]

export const tasks = studioTasks.map((item, i) => ({ title: item.title, due: item.due + ", 2026", progressText: `${i+1}/8`, comments: i+2 }))

export const storageSegments = [
  { label: "Regular", value: 3520, color: "hsl(var(--primary))" },
  { label: "System", value: 1520, color: "hsl(var(--info))" },
  { label: "Shared", value: 720, color: "hsl(var(--warning))" },
  { label: "Free", value: 2240, color: "hsl(var(--muted))" },
]

export const trafficPages = [
  { page: "/", visitors: 4896, unique: 3654, bounce: "82.54%" },
  { page: "/form-elements.html", visitors: 3652, unique: 3215, bounce: "76.29%" },
  { page: "/index.html", visitors: 3256, unique: 2865, bounce: "72.65%" },
  { page: "/icons.html", visitors: 986, unique: 865, bounce: "44.89%" },
  { page: "/docs/", visitors: 912, unique: 822, bounce: "41.12%" },
  { page: "/accordion.html", visitors: 855, unique: 798, bounce: "32.65%" },
]

export const socialTraffic = [
  { network: "Instagram", visitors: 3550 },
  { network: "Twitter", visitors: 1798 },
  { network: "Facebook", visitors: 1245 },
  { network: "TikTok", visitors: 986 },
  { network: "Pinterest", visitors: 854 },
  { network: "VK", visitors: 650 },
  { network: "LinkedIn", visitors: 420 },
]

export const commits = updates.map(item => ({ user: item.person.id, message: item.title, date: "21 Sep 2026" }))

export const users = team.map(person => ({ name: person.name, email: person.email, role: person.role, status: "active" as const }))
