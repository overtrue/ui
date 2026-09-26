import { Link, NavLink, useParams } from "react-router-dom";
import { IconArrowRight, IconArrowLeft } from "@tabler/icons-react";
import { Command } from "./code";
import { guides } from "./pages";
import { DocsSidebar, DocsMobileNavigation } from "./docs-navigation";

export function GuideLinks() {
  return (
    <nav className="guide-links" aria-label="Guides">
      <NavLink to="/docs" end>
        Getting started
      </NavLink>
      {guides.map((guide) => (
        <NavLink key={guide.slug} to={`/docs/${guide.slug}`}>
          {guide.title}
        </NavLink>
      ))}
    </nav>
  );
}

const content = {
  design: (
    <>
      <h2>Quiet surfaces, clear priorities</h2>
      <p>
        Use the page background to separate sections, a card surface to group
        related information, and a border only where it explains a boundary. Use
        a subtle contact shadow on cards and controls; reserve deeper shadows
        for menus, dialogs, and other surfaces that float above the page.
        Reserve the accent color for the current selection, a primary action, or
        one important data series.
      </p>
      <div className="principle-specimen" aria-label="Example metric hierarchy">
        <span>Monthly recurring revenue</span>
        <strong>
          $36,800<span>.00</span>
        </strong>
        <p>
          <span>↑ 12.8%</span> compared with last month
        </p>
        <small>Updated 4 minutes ago</small>
      </div>
      <h2>One reading order</h2>
      <p>
        A page starts with its title and primary action, followed by the
        summary, the main working area, and supporting context. Keep the most
        important information near the top. Align related labels, values, and
        actions so people can scan without hunting.
      </p>
      <div className="guide-table-wrap">
        <table className="guide-table">
          <caption>A practical type scale</caption>
          <thead>
            <tr>
              <th>Role</th>
              <th>Size</th>
              <th>Use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Page title</td>
              <td>24–34 px</td>
              <td>One clear subject</td>
            </tr>
            <tr>
              <td>Section title</td>
              <td>14–17 px</td>
              <td>A group of related content</td>
            </tr>
            <tr>
              <td>Body and controls</td>
              <td>14 px · 16 px for mobile inputs</td>
              <td>Reading and everyday actions</td>
            </tr>
            <tr>
              <td>Supporting text</td>
              <td>12–13 px</td>
              <td>Dates, units, and context</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h2>Compact, with room to work</h2>
      <p>
        Start with 24 px between sections and 20–24 px inside a card. Use
        smaller gaps for items that belong together. On narrow screens, reduce
        the number of columns before reducing text size. Let wide tables scroll
        inside their own container.
      </p>
      <h2>Meaning before decoration</h2>
      <p>
        Pair status colors with words. Show a metric’s unit, period, and
        comparison. A lower error rate is good; a lower conversion rate is not.
        Set <code>positiveTrend="down"</code> when a decrease is the desired
        outcome.
      </p>
      <p>
        Use Tabler Icons consistently at 16, 20, or 24 px. Keep decorative icons
        out of the accessibility tree, and give icon-only actions a descriptive
        label.
      </p>
      <h2>Adapt the tokens, keep the relationships</h2>
      <p>
        Components inherit your shadcn semantic colors. Change the primary token
        to match your product, then check its text, hover, focus, and dark-mode
        states together. The <Link to="/docs#theming">optional theme</Link> is a
        starting point, not an installation requirement.
      </p>
    </>
  ),
  composition: (
    <>
      <h2>Choose your starting point</h2>
      <p>
        Use a <Link to="/components">component</Link> for a single pattern, or a{" "}
        <Link to="/blocks">block</Link> for a complete working area. Blocks
        include their local component dependencies. You can open the source
        selector on any block’s detail page to inspect every included file.
      </p>
      <h2>Choose between similar components</h2>
      <div className="guide-table-wrap">
        <table className="guide-table">
          <thead>
            <tr>
              <th>Need</th>
              <th>Start with</th>
              <th>Use when you need more</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>A metric</td>
              <td>
                <Link to="/components/stat-card">Stat card</Link> · formatted
                values and explicit direction
              </td>
              <td>
                <Link to="/components/kpi-card">KPI card</Link> · numeric
                formatting and fractional deltas
              </td>
            </tr>
            <tr>
              <td>Related metrics</td>
              <td>
                <Link to="/components/metric-group">Metric group</Link> · a
                shared surface
              </td>
              <td>
                Separate cards when each metric needs its own context or action
              </td>
            </tr>
            <tr>
              <td>A record list</td>
              <td>
                <Link to="/components/data-table">Data table</Link> · search,
                sort, and pagination
              </td>
              <td>
                <Link to="/components/advanced-data-table">
                  Interactive table
                </Link>{" "}
                · selection, column controls, and bulk actions
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <h2>Build a readable summary</h2>
      <p>
        Give the page a title, group related metrics, and put the main task
        underneath. These components accept your data and ordinary React
        content.
      </p>
      <Command
        text={
          "npx shadcn@latest add @overtrue/page-header @overtrue/metric-group"
        }
      />
      <p className="note">
        This command uses the{" "}
        <Link to="/docs#namespace">@overtrue namespace configuration</Link>.
        Individual component pages also provide direct-URL installation
        commands.
      </p>
      <Command
        label="overview.tsx"
        language="tsx"
        text={
          'import { PageHeader } from "@/components/overtrue/page-header"\nimport { MetricGroup, MetricGroupItem } from "@/components/overtrue/metric-group"\n\nexport function Overview() {\n  return (\n    <section className="space-y-6">\n      <PageHeader title="Overview" description="Your workspace this month." />\n      <MetricGroup>\n        <MetricGroupItem label="Active projects" value="24" context="6 due this month" />\n        <MetricGroupItem label="Team members" value="18" context="Across 4 teams" />\n        <MetricGroupItem label="Open reviews" value="7" context="2 need your input" />\n        <MetricGroupItem label="Completed" value="83" context="This month" />\n      </MetricGroup>\n    </section>\n  )\n}'
        }
      />
      <h2>Connect real behavior</h2>
      <p>
        Keep fetching, authentication, and persistence in your application. Pass
        records to the table, reports to analytics, and a save callback to
        settings. Stable IDs preserve row identity when data is filtered or
        sorted.
      </p>
      <Command
        label="Settings with an API"
        language="tsx"
        text={
          '<SettingsPanel\n  initialName={workspace.name}\n  initialEmail={workspace.email}\n  onSave={async (values) => {\n    const response = await fetch("/api/workspace", {\n      method: "PATCH",\n      headers: { "Content-Type": "application/json" },\n      body: JSON.stringify(values),\n    })\n    if (!response.ok) throw new Error("Save failed")\n  }}\n/>'
        }
      />
      <p className="note">
        SettingsPanel is a workspace settings block with fixed fields. Edit its
        source for other forms. Import it from its installed file. The workspace
        object and authenticated API endpoint belong to your application; they
        are not included in the registry.
      </p>
      <h2>Design the other states</h2>
      <p>
        Try no records, long labels, a failed save, a slow response, and a
        narrow container. Preserve the user’s input when a request fails. Use{" "}
        <Link to="/components/empty-state">Empty state</Link> to explain what
        they can do next.
      </p>
      <h2>Understand the two collections</h2>
      <p>
        The registry contains portable components and blocks. The 119-page
        workspace is a separate example application with shared styles and demo
        data. Its pages are references for composition; they are not all
        separately installable registry items.
      </p>
    </>
  ),
  accessibility: (
    <>
      <h2>Start with the keyboard</h2>
      <p>
        Move through the page with Tab and Shift+Tab. Every action needs a
        visible focus indicator, a meaningful name, and a sensible position in
        the reading order. Use native buttons for actions and links for
        navigation.
      </p>
      <ul className="guide-list">
        <li>
          Menus and dialogs should close with Escape and return focus to the
          trigger.
        </li>
        <li>A modal should keep keyboard focus inside while it is open.</li>
        <li>Give icon-only buttons an aria-label that describes the action.</li>
        <li>Keep focus visible when controls sit inside scrolling areas.</li>
      </ul>
      <h2>Make data understandable without color</h2>
      <p>
        Use a status label alongside its color. Add units and comparison periods
        to metrics. A sparkline needs a meaningful text alternative; a detailed
        chart also needs values people can inspect.
      </p>
      <Command
        label="A meaningful trend label"
        language="tsx"
        text={
          '<Sparkline\n  data={[164, 152, 148, 136, 124]}\n  label="Response time fell from 164 ms to 124 ms over five days"\n/>'
        }
      />
      <p className="note">
        Import Sparkline from <code>@/components/overtrue/sparkline</code>. The
        text alternative should describe your actual data.
      </p>
      <h2>Forms should explain themselves</h2>
      <p>
        Keep labels visible instead of using a placeholder as the only label.
        Associate each label with its input. Explain a failed submission beside
        the form, preserve its values, and announce save results with a status
        region.
      </p>
      <h2>Respect the viewport and motion preference</h2>
      <p>
        Check keyboard access, 200% zoom, and a narrow screen. Let text wrap,
        keep touch targets comfortable, and contain wide tables. Honor
        reduced-motion preferences; animation should never be required to
        understand a result.
      </p>
      <h2>Verify the finished application</h2>
      <p>
        The components provide useful foundations, but your data, custom styles,
        and composition affect accessibility. Check contrast in both themes,
        test a screen reader, and review the complete task flow. This guide is
        not a claim of accessibility certification.
      </p>
    </>
  ),
  troubleshooting: (
    <>
      <h2>The CLI cannot find @overtrue</h2>
      <p>
        The namespace is configured in your project’s components.json; it is not
        a built-in public registry name. Follow the{" "}
        <Link to="/docs#namespace">namespace setup</Link>, or use the full JSON
        URL from a component’s installation section.
      </p>
      <h2>The component has no styles</h2>
      <p>
        Confirm your global Tailwind CSS v4 stylesheet is loaded and that the
        installed component directory is included in source detection. Check
        that shadcn semantic tokens such as <code>--card</code>,{" "}
        <code>--foreground</code>, and <code>--border</code> are defined. You do
        not need to copy the workspace stylesheet.
      </p>
      <h2>An import cannot be resolved</h2>
      <p>
        Check your components.json aliases against your TypeScript and bundler
        aliases. Keep the files added by the registry together: blocks import
        their included local components. Reinstall from the registry if only the
        main block file was copied manually.
      </p>
      <h2>A chart is blank or clipped</h2>
      <p>
        Make sure the parent has a usable width and height. In a flex or grid
        layout, add <code>min-w-0</code> to the chart’s containing column. Use
        the registry’s declared Recharts 2.x dependency, and pass numeric values
        rather than formatted strings such as “1,200”.
      </p>
      <h2>Dark mode does not follow the application</h2>
      <p>
        The components use the <code>.dark</code> convention and semantic
        tokens. Check that the class is on an ancestor and that your theme
        defines the dark variables. The website and the workspace demo keep
        separate theme preferences.
      </p>
      <h2>A save disappears after refresh</h2>
      <p>
        Previews use local demo state. Connect SettingsPanel’s onSave callback
        to your application and reload saved values through your data layer.
        Authentication, mail delivery, billing, and persistence are not included
        services.
      </p>
      <h2>Updating would replace local changes</h2>
      <p>
        Installed files belong to your project. Commit or back up your edits,
        inspect the latest source on the component page, and compare before
        accepting an overwrite. You can adopt an individual fix without
        replacing an entire block.
      </p>
    </>
  ),
};

export function GuidePage() {
  const { slug } = useParams();
  const index = guides.findIndex((guide) => guide.slug === slug);
  const guide = guides[index];
  if (!guide)
    return (
      <main className="not-found section">
        <h1>Guide not found</h1>
        <Link className="site-button" to="/docs">
          Back to documentation
        </Link>
      </main>
    );
  const next = guides[index + 1];
  return (
    <main className="docs-layout section">
      <DocsSidebar />
      <article className="docs-content prose-docs">
        <DocsMobileNavigation />
        <div className="breadcrumbs">
          <Link to="/docs">Documentation</Link>
          <span>/</span>
          {guide.title}
        </div>
        <header className="documentation-intro">
          <p className="overline">
            THE OVERTRUE/UI HANDBOOK{" "}
            <span>/ {String(index + 1).padStart(2, "0")}</span>
          </p>
          <h1>{guide.title}</h1>
          <p className="lead">{guide.description}</p>
        </header>
        {content[guide.slug]}
        <nav className="guide-pagination" aria-label="Guide pagination">
          <Link to={index > 0 ? `/docs/${guides[index - 1].slug}` : "/docs"}>
            <IconArrowLeft size={16} />
            <span>
              <small>Previous</small>
              {index > 0 ? guides[index - 1].title : "Getting started"}
            </span>
          </Link>
          <Link to={next ? `/docs/${next.slug}` : "/components"}>
            <span>
              <small>Next</small>
              {next?.title ?? "Explore components"}
            </span>
            <IconArrowRight size={16} />
          </Link>
        </nav>
      </article>
    </main>
  );
}
