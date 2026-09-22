import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Scene } from "@/components/overtrue/scenes/shared";
import { PageHeader } from "@/components/overtrue/page-header";
import { SectionCard } from "@/components/overtrue/section-card";
import { StatCard } from "@/components/overtrue/stat-card";
import { SparklineCard } from "@/components/overtrue/sparkline-card";
import { StatusBadge } from "@/components/overtrue/status-badge";
import { StatusEdgeCard } from "@/components/overtrue/status-edge-card";
import { RibbonCard } from "@/components/overtrue/ribbon-card";
import { AvatarStack } from "@/components/overtrue/avatar-stack";
import { EmptyState } from "@/components/overtrue/empty-state";
import { SocialButton } from "@/components/overtrue/social-button";
import { StorageMeter } from "@/components/overtrue/storage-meter";
import { ActivityFeed, ActivityItem } from "@/components/overtrue/activity-feed";
import { TaskList, TaskCard } from "@/components/overtrue/task-card";
import { InvoiceTable } from "@/components/overtrue/invoice-table";
import {
  ChartCard,
  SimpleBarChart,
  SimpleLineChart,
  SimplePieChart,
  ChartLegend,
} from "@/components/overtrue/chart";
import { AreaTrendChart, BarMetricChart } from "@/components/overtrue/charts";
import { LogsList, LogsTable } from "@/components/overtrue/logs";
import { WelcomeBanner } from "@/components/overtrue/page-header";
import { Timeline, TimelineItem } from "@/components/overtrue/timeline";
import { PricingCard } from "@/components/overtrue/pricing-card";
import { AuthLayout } from "@/components/overtrue/auth-layout";
import { NotificationMenu } from "@/components/overtrue/notification-menu";
import { AppsMenu } from "@/components/overtrue/apps-menu";
import { UserMenu } from "@/components/overtrue/user-menu";
import { ThemeCustomizer } from "@/components/overtrue/theme-customizer";
import { TopNavbar } from "@/components/overtrue/top-navbar";
import { SidebarNav } from "@/components/overtrue/sidebar-nav";
import { Footer } from "@/components/overtrue/footer";
import { AppShell } from "@/components/overtrue/app-shell";
import { SearchToolbar } from "@/components/overtrue/search-results";
import { navSections } from "@/data/nav";
import { Tag } from "@/components/overtrue/tag";
import { StarsRating } from "@/components/overtrue/stars-rating";
import { Steps } from "@/components/overtrue/steps";
import { SegmentedControl } from "@/components/overtrue/segmented-control";
import { Breadcrumb } from "@/components/overtrue/breadcrumb";
import { DataTable } from "@/components/overtrue/data-table";
import { CookieBanner } from "@/components/overtrue/cookie-banner";
import { Offcanvas } from "@/components/overtrue/offcanvas";
import { Prose, ProseP } from "@/components/overtrue/prose";
import { BlankState } from "@/components/overtrue/blank-state";
import { PricingTable } from "@/components/overtrue/pricing-table";
import { Button } from "@/components/ui/button";
import { SearchResultList } from "@/components/overtrue/search-results";
import { ImageCheck } from "@/components/overtrue/image-check";
import {
  activityItems,
  apps,
  invoices,
  notifications,
  salesSeries,
  storageSegments,
  tasks,
  users,
} from "@/data/mock";

const HO_COMPONENTS = [
  "AppShell",
  "TopNavbar",
  "SidebarNav",
  "Footer",
  "PageHeader",
  "WelcomeBanner",
  "ThemeCustomizer",
  "StatCard",
  "SparklineCard",
  "ActivityFeed",
  "ActivityItem",
  "TaskCard",
  "TaskList",
  "InvoiceTable",
  "NotificationMenu",
  "AppsMenu",
  "UserMenu",
  "ImageCheck",
  "StatusBadge",
  "RibbonCard",
  "StatusEdgeCard",
  "AvatarStack",
  "EmptyState",
  "SocialButton",
  "StorageMeter",
  "SectionCard",
  "ChartCard",
  "SimpleBarChart",
  "SimpleLineChart",
  "SimplePieChart",
  "ChartLegend",
  "AreaTrendChart",
  "BarMetricChart",
  "Timeline",
  "TimelineItem",
  "PricingCard",
  "PricingTable",
  "AuthLayout",
  "Tag",
  "StarsRating",
  "Steps",
  "SegmentedControl",
  "Breadcrumb",
  "DataTable",
  "CookieBanner",
  "Offcanvas",
  "Prose",
  "BlankState",
  "LogsList",
  "LogsTable",
  "SearchResultList",
  "SearchToolbar",
];

const barData = salesSeries.map((s) => ({ name: s.label, value: s.value }));
const pieData = [
  { name: "Regular", value: 3520 },
  { name: "System", value: 1520 },
  { name: "Shared", value: 720 },
  { name: "Free", value: 2240 },
];

export default function HighOrderPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("");
  const [imageChecked, setImageChecked] = useState(true);
  const [greenChecked, setGreenChecked] = useState(false);
  const [orangeChecked, setOrangeChecked] = useState(false);
  const [rating, setRating] = useState(4);
  const [segment, setSegment] = useState("week");
  const [tagSelected, setTagSelected] = useState(true);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [offcanvasOpen, setOffcanvasOpen] = useState(false);
  const [cookieVisible, setCookieVisible] = useState(false);
  const [searchDemo, setSearchDemo] = useState("");

  return (
    <Scene
      id="high-order"
      title="High-order components"
      description="Reusable patterns for dashboards, project work, and workspace settings."
      actions={
        <span className="text-sm text-muted-foreground">
          {HO_COMPONENTS.length} exports
        </span>
      }
    >
      <SectionCard
        title="Shell chrome"
        description="Navigation and layout primitives, contained within independent previews."
      >
        <div className="mb-4 rounded-md border border-border">
          <div className="metric-label border-b border-border px-3 py-1.5">
            TopNavbar (isolated)
          </div>
          <div
            className="overflow-x-auto"
            tabIndex={0}
            role="region"
            aria-label="Navigation preview"
            data-demo="navigation"
          >
            <TopNavbar
              className="min-w-[960px]"
              sticky={false}
              onOpenCustomizer={() => setCustomizerOpen(true)}
              notifications={notifications}
              apps={apps}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div className="overflow-hidden rounded-md border border-border">
            <div className="metric-label border-b border-border px-3 py-1.5">
              SidebarNav (isolated)
            </div>
            <div className="relative h-64">
              <SidebarNav
                sections={navSections.slice(0, 2)}
                open
                className="static h-full"
              />
            </div>
          </div>
          <div className="overflow-hidden rounded-md border border-border">
            <div className="metric-label border-b border-border px-3 py-1.5">
              Footer (isolated)
            </div>
            <Footer />
          </div>
        </div>
        <div className="mt-3 rounded-md border border-border bg-muted">
          <div className="metric-label border-b border-border px-3 py-1.5">
            AppShell (bare mode — auth-style)
          </div>
          <div className="p-2 [&>div]:min-h-0" data-demo="bare-shell">
            <AppShell bare>
              <div className="rounded-md border border-border bg-card p-3 text-sm text-muted-foreground">
                AppShell bare mode renders children only; non-bare mode adds
                TopNavbar + SidebarNav + Footer.
              </div>
            </AppShell>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Component inventory"
        description="Browse the component exports, then explore their individual examples below."
      >
        <details>
          <summary className="cursor-pointer text-sm font-medium">
            Browse {HO_COMPONENTS.length} component exports
          </summary>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {HO_COMPONENTS.map((name) => (
              <li
                key={name}
                className="rounded-md border border-border px-3 py-2 text-sm"
              >
                <code className="font-medium text-foreground">{name}</code>
                <div className="text-xs text-muted-foreground">
                  components/overtrue/*
                </div>
              </li>
            ))}
          </ul>
        </details>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="metric-label">Menus</span>
          <NotificationMenu items={notifications} />
          <AppsMenu apps={apps} />
          <UserMenu name="Maya Okafor" role="UI Designer" />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setCustomizerOpen(true)}>
            ThemeCustomizer
          </Button>
          <Button variant="outline" onClick={() => setOffcanvasOpen(true)}>
            Offcanvas
          </Button>
          <Button variant="outline" onClick={() => setCookieVisible(true)}>
            CookieBanner
          </Button>
        </div>
        <ThemeCustomizer
          open={customizerOpen}
          onOpenChange={setCustomizerOpen}
        />
        <Offcanvas
          open={offcanvasOpen}
          onOpenChange={setOffcanvasOpen}
          title="Offcanvas demo"
        >
          <ProseP>Offcanvas content composed from theme tokens.</ProseP>
        </Offcanvas>
        {cookieVisible ? (
          <CookieBanner
            message="Choose your privacy preferences for this sample workspace."
            onAccept={() => setCookieVisible(false)}
            onDecline={() => setCookieVisible(false)}
          />
        ) : null}
      </SectionCard>

      <SectionCard title="PageHeader / WelcomeBanner / Breadcrumb">
        <PageHeader title="Project workspace" pretitle="Overview" />
        <Breadcrumb
          items={[
            { title: "Custom", href: "/high-order" },
            { title: "High-order" },
          ]}
          className="mb-3"
        />
        <WelcomeBanner
          title="Welcome back, Maya"
          subtitle="Shell pieces used on Dashboard Default."
          metrics={[
            {
              label: "Today's Sales",
              value: "6,782",
              trend: "7%",
              direction: "up",
              progress: 75,
            },
            {
              label: "Growth Rate",
              value: "78,4%",
              trend: "-1%",
              direction: "down",
              progress: 78,
            },
          ]}
        />
      </SectionCard>

      <SectionCard title="StatCard">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <StatCard
            title="Today's Sales"
            value="6,782"
            trend="Increased by 7%"
            trendDirection="up"
            progress={75}
            progressLabel="75% Complete"
          />
          <StatCard
            title="Growth Rate"
            value="78,4%"
            trend="Decreased by -1%"
            trendDirection="down"
            progress={78}
            progressLabel="78% Complete"
          />
          <StatCard
            title="Total Users"
            value="75,782"
            trend="Increased by 2%"
            trendDirection="up"
            progress={24}
            progressLabel="24,635 users increased"
          />
        </div>
      </SectionCard>

      <SectionCard title="SparklineCard">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <SparklineCard
            title="Sales"
            value="6,782"
            trend="Increased by 7%"
            series={salesSeries}
          />
          <SparklineCard
            title="Revenue"
            value="$4,300"
            trend="Increased by 8%"
            series={salesSeries}
          />
        </div>
      </SectionCard>

      <SectionCard title="ImageCheck">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ImageCheck
            checked={imageChecked}
            onCheckedChange={setImageChecked}
            title="Blue pattern"
            description="Toggle live"
            color="#066fd1"
          />
          <ImageCheck
            title="Green pattern"
            description="Success accent"
            color="#16a34a"
            checked={greenChecked}
            onCheckedChange={setGreenChecked}
          />
          <ImageCheck
            title="Orange pattern"
            description="Warning accent"
            color="#f76707"
            checked={orangeChecked}
            onCheckedChange={setOrangeChecked}
          />
          <ImageCheck
            disabled
            title="Disabled"
            description="Unavailable"
            color="#4299e1"
            onCheckedChange={() => {}}
          />
        </div>
      </SectionCard>

      {/* StatusBadge: optional shape; default is overtrue/ui dot + label */}
      <SectionCard title="StatusBadge / StatusEdge / Ribbon / Tag">
        <div className="flex flex-wrap items-center gap-4">
          <StatusBadge status="paid" label="Paid" />
          <StatusBadge status="pending" label="Pending" />
          <StatusBadge status="due" label="Due" />
          <StatusBadge status="overdue" label="Overdue" />
          <StatusBadge status="success" label="Success" shape="pill" />
          <StatusBadge status="danger" label="Danger" shape="pill" />
          <Tag variant="soft">Tag</Tag>
          <Tag variant="success">Success</Tag>
          <Tag
            variant="outline"
            selected={tagSelected}
            onSelectedChange={setTagSelected}
          >
            Selectable
          </Tag>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <StatusEdgeCard edge="top" tone="success" title="Top status">
            Payment received for invoice #001401.
          </StatusEdgeCard>
          <StatusEdgeCard edge="bottom" tone="primary" title="Bottom status">
            New CRM opportunity assigned to your team.
          </StatusEdgeCard>
          <RibbonCard ribbon="NEW" title="Ribbon">
            Card with top ribbon content and supporting text below.
          </RibbonCard>
        </div>
      </SectionCard>

      <SectionCard title="AvatarStack / EmptyState / SocialButton / StorageMeter / Stars / Segmented / Steps">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className="metric-label mb-2">AvatarStack</div>
            <AvatarStack users={users.map((u) => ({ name: u.name }))} />
          </div>
          <div className="flex flex-wrap items-start gap-2">
            <SocialButton brand="facebook" asChild><a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">Facebook</a></SocialButton>
            <SocialButton brand="github" asChild><a href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub</a></SocialButton>
            <SocialButton brand="twitter" asChild><a href="https://x.com/" target="_blank" rel="noopener noreferrer">Twitter</a></SocialButton>
            <SocialButton brand="overtrue" asChild><a href="/">overtrue/ui</a></SocialButton>
          </div>
          <EmptyState
            title="No Team Members"
            description="Invite your team to collaborate on this project."
            action={{ label: "Invite Members", onClick: () => navigate("/users") }}
          />
          <StorageMeter
            usedLabel="5760 MB"
            totalLabel="8 GB"
            segments={storageSegments}
          />
          <div className="space-y-2">
            <div className="metric-label">StarsRating</div>
            <StarsRating value={rating} onChange={setRating} size="lg" />
          </div>
          <div className="space-y-2">
            <div className="metric-label">SegmentedControl</div>
            <SegmentedControl
              value={segment}
              onValueChange={setSegment}
              options={[
                { value: "week", label: "Week" },
                { value: "month", label: "Month" },
                { value: "year", label: "Year" },
              ]}
            />
          </div>
        </div>
        <div className="mt-4">
          <div className="metric-label mb-2">Steps</div>
          <Steps
            current={1}
            steps={[
              { id: "1", title: "Create project" },
              { id: "2", title: "Invite team" },
              { id: "3", title: "Launch" },
            ]}
          />
        </div>
      </SectionCard>

      {/* TaskList includes its own Card wrapper; TaskCard is the row primitive */}
      <SectionCard title="ActivityFeed / ActivityItem / TaskList / TaskCard / Timeline">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <ActivityFeed items={activityItems} />
          <div className="space-y-3">
            <TaskList tasks={tasks.slice(0, 3)} />
            <div className="card">
              <div className="card-body pt-0">
                <ul>
                  <TaskCard
                    title="Standalone TaskCard"
                    due="Tomorrow"
                    progressText="1/3"
                    comments={2}
                  />
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-md border border-border p-4">
          <div className="metric-label mb-2">Timeline + TimelineItem</div>
          <Timeline
            items={[
              {
                title: "Project kickoff",
                time: "2 days ago",
                description: "Aligned on overtrue/ui + shadcn scope.",
              },
              {
                title: "Theme tokens mapped",
                time: "Yesterday",
                description: "CSS variables match overtrue/ui palette.",
              },
              { title: "Gallery page live", time: "now" },
            ]}
          />
          <TimelineItem
            title="Extra timeline item"
            time="1h ago"
            description="Live demo of TimelineItem export."
          />
        </div>
        <div className="mt-4">
          <div className="metric-label mb-2">ActivityItem standalone</div>
          <ul className="rounded-md border border-border">
            <ActivityItem item={activityItems[0]} className="px-4" />
          </ul>
        </div>
        <div className="mt-4">
          <InvoiceTable rows={invoices.slice(0, 4)} />
        </div>
      </SectionCard>

      <SectionCard title="Charts — ChartCard / Bar / Line / Pie / Area / ChartLegend">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <ChartCard title="Bar">
            <SimpleBarChart
              data={barData}
              xKey="name"
              yKey="value"
              height={200}
            />
          </ChartCard>
          <ChartCard title="Line">
            <SimpleLineChart
              data={barData}
              xKey="name"
              yKey="value"
              height={200}
            />
          </ChartCard>
          <ChartCard title="Pie + ChartLegend" height={280}>
            <SimplePieChart data={pieData} height={160} />
            <ChartLegend
              className="mt-2"
              items={pieData.map((d, i) => ({
                label: d.name,
                value: String(d.value),
                color: ["#066fd1", "#4299e1", "#f76707", "#6b7280"][i],
              }))}
            />
          </ChartCard>
          <AreaTrendChart title="AreaTrendChart" data={barData} height={200} />
        </div>
        <div className="mt-3">
          <BarMetricChart title="BarMetricChart" data={barData} height={200} />
        </div>
      </SectionCard>

      <SectionCard title="DataTable / LogsList / LogsTable / SearchResultList / Prose / BlankState">
        <DataTable
          className="mb-3"
          columns={[
            { key: "name", header: "User" },
            { key: "email", header: "Email" },
            { key: "role", header: "Role" },
            {
              key: "status",
              header: "Status",
              render: (row) => (
                <StatusBadge
                  status={row.status === "active" ? "active" : "inactive"}
                  label={row.status === "active" ? "Active" : "Inactive"}
                />
              ),
            },
          ]}
          rows={users as unknown as Record<string, unknown>[]}
        />
        <LogsList
          className="mb-3"
          entries={[
            {
              id: "1",
              time: "12:04:01",
              level: "info",
              message: "Maya signed in",
              source: "auth",
            },
            {
              id: "2",
              time: "12:04:18",
              level: "success",
              message: "Invoice marked paid",
              source: "billing",
            },
            {
              id: "3",
              time: "12:05:02",
              level: "warning",
              message: "API latency high",
              source: "gateway",
            },
          ]}
        />
        <LogsTable
          className="mb-3"
          entries={[
            {
              id: "4",
              time: "12:06:00",
              level: "error",
              message: "Mail queue failure",
              source: "mailer",
            },
          ]}
        />
        <SearchResultList
          className="mb-3"
          items={[
            {
              id: "1",
              title: "Dashboard widgets",
              excerpt: "StatCard + ActivityFeed composition",
              type: "Page",
              date: "now",
              initials: "PK",
            },
          ]}
        />
        <div className="mb-3 space-y-2">
          <div className="metric-label">SearchToolbar</div>
          <SearchToolbar
            query={searchDemo}
            onQueryChange={setSearchDemo}
            placeholder="Search high-order demos…"
          />
          {searchDemo ? (
            <div className="text-xs text-muted-foreground">
              Query: {searchDemo}
            </div>
          ) : null}
        </div>
        <div className="mb-3 rounded-md border border-border p-3">
          <Prose>
            <ProseP>
              Prose high-order text primitives for long-form demos.
            </ProseP>
          </Prose>
        </div>
        <BlankState
          title="BlankState"
          description="Empty/blank page composition."
        />
      </SectionCard>

      <SectionCard title="PricingCard / PricingTable / AuthLayout">
        {selectedPlan && <p role="status" className="mb-4 rounded-md bg-primary/10 p-3 text-sm text-primary">{selectedPlan} plan selected for this preview. No billing changes were made.</p>}
        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <PricingCard
            name="Free"
            onChoose={() => setSelectedPlan("Free")}
            price="$0"
            cta="Choose plan"
            features={["3 Users", "Sharing Tools", "Design Tools"]}
          />
          <PricingCard
            name="Premium"
            onChoose={() => setSelectedPlan("Premium")}
            price="$49"
            highlighted
            cta="Choose plan"
            features={[
              "10 Users",
              "Sharing Tools",
              "Design Tools",
              "Private Messages",
            ]}
          />
          <PricingCard
            name="Enterprise"
            onChoose={() => setSelectedPlan("Enterprise")}
            price="$99"
            cta="Choose plan"
            features={[
              "100 Users",
              "Sharing Tools",
              "Design Tools",
              "Twitter API",
            ]}
          />
        </div>
        <PricingTable
          className="mb-4"
          featureLabels={["Projects", "Support", "Theme customizer"]}
          tiers={[
            { name: "Free", price: "$0", features: ["1", "Community", false], onChoose: () => setSelectedPlan("Free") },
            {
              name: "Pro",
              onChoose: () => setSelectedPlan("Pro"),
              price: "$29",
              highlighted: true,
              features: ["Unlimited", "Priority", true],
            },
          ]}
        />
        <div className="rounded-md border border-border bg-muted p-6">
          <div className="mx-auto max-w-sm">
            <AuthLayout embedded title="Login to your account">
              <div className="text-sm text-muted-foreground">
                Children slot — auth pages pass form fields here (no AppShell
                sidebar).
              </div>
            </AuthLayout>
          </div>
        </div>
      </SectionCard>
    </Scene>
  );
}
