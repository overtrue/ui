import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import {
  IconBrush,
  IconMoon,
  IconSun,
  IconBell,
  IconBook,
  IconChevronRight,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  ThemeCustomizer,
  useThemeState,
} from "@/components/overtrue/theme-customizer";
import { Logo, MenuItems, Navigation, WorkspaceSidebar } from "./navigation";
import { WorkspaceSearch } from "./page-search";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import pages from "@/data/workspace/pages.json";
import { cn } from "@/lib/utils";

function HeaderActions() {
  const { resolvedScheme, setTheme } = useThemeState();
  return (
    <div className="workspace-header-actions">
      <a
        className="pn-btn workspace-docs"
        href="/docs"
        target="_blank"
        rel="noreferrer"
      >
        <IconBook
          size={20}
          stroke={1.5}
          style={{ color: "var(--pn-secondary)" }}
        />{" "}
        Documentation
      </a>
      <Button
        variant="workspace"
        className="workspace-icon-button"
        aria-label={
          resolvedScheme === "dark" ? "Use light theme" : "Use dark theme"
        }
        onClick={() =>
          setTheme((t) => ({
            ...t,
            scheme: resolvedScheme === "dark" ? "light" : "dark",
            navbarTheme: "default",
          }))
        }
      >
        {resolvedScheme === "dark" ? (
          <IconSun size={20} stroke={1.5} />
        ) : (
          <IconMoon size={20} stroke={1.5} />
        )}
      </Button>
      <Dropdown.Root>
        <Dropdown.Trigger asChild>
          <Button
            variant="workspace"
            className="workspace-icon-button workspace-notifications"
            aria-label="Notifications"
          >
            <IconBell size={20} stroke={1.5} />
            <span />
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Portal>
          <div className="overtrue-workspace workspace-portal">
            <Dropdown.Content
              className="pn-dropdown-menu pn-show workspace-dropdown-content workspace-notification-menu"
              align="end"
              sideOffset={8}
            >
              <h3 className="pn-dropdown-header">Notifications</h3>
              {[
                "Visitor concepts are ready for your review.",
                "The Member portal staging environment is ready.",
                "June shared the final identity package.",
                "October planning is open for comments.",
              ].map((text, i) => (
                <Dropdown.Item key={text} className="pn-dropdown-item" asChild>
                  <Link to="/activity">
                    <div>
                      <strong>
                        {
                          [
                            "Project review",
                            "Build complete",
                            "New delivery",
                            "Team planning",
                          ][i]
                        }
                      </strong>
                      <p>{text}</p>
                    </div>
                  </Link>
                </Dropdown.Item>
              ))}
            </Dropdown.Content>
          </div>
        </Dropdown.Portal>
      </Dropdown.Root>
      <WorkspaceSearch />
      <Dropdown.Root>
        <Dropdown.Trigger asChild>
          <Button
            variant="workspace"
            className="workspace-user"
            aria-label="Account menu for Chris An"
          >
            <img
              src="/assets/overtrue/people/overtrue.png"
              width="32"
              height="32"
              alt="Chris An"
            />
            <span>
              <span>Chris An</span>
              <small>@overtrue</small>
            </span>
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Portal>
          <div className="overtrue-workspace workspace-portal">
            <Dropdown.Content
              className="pn-dropdown-menu pn-show workspace-dropdown-content"
              align="end"
              sideOffset={8}
            >
              <MenuItems
                items={[
                  { title: "Profile", href: "./profile.html" },
                  { title: "Analytics", href: "./index.html" },
                  { title: "Settings & Privacy", href: "./settings.html" },
                  { title: "Help", href: "./faq.html" },
                  { title: "Sign out", href: "./sign-in.html" },
                ]}
              />
            </Dropdown.Content>
          </div>
        </Dropdown.Portal>
      </Dropdown.Root>
    </div>
  );
}
export function WorkspaceShell({
  bare,
  layout = "default",
  children,
}: {
  bare?: boolean;
  layout?: string;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const mobileToggle = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (!mobileOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented) {
        setMobileOpen(false);
        mobileToggle.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [mobileOpen]);
  const [customizerOpen, setCustomizerOpen] = React.useState(false);
  const [sidebarHovered, setSidebarHovered] = React.useState(false);
  const { pathname } = useLocation();
  React.useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);
  const { theme, setTheme, resolvedScheme } = useThemeState();
  // Layout examples seed the same settings that the customizer edits.
  React.useLayoutEffect(() => {
    if (bare) return;
    setTheme((current) => {
      if (current.layoutPreset === layout) return current;
      if (layout === "default") return { ...current, layoutPreset: layout };
      return {
        ...current,
        layoutPreset: layout,
        nav: /vertical|folded/.test(layout) ? "sidebar" : "horizontal",
        sidebar: layout.includes("folded") ? "folded" : "expanded",
        container: layout.includes("fluid")
          ? "fluid"
          : layout === "boxed"
            ? "boxed"
            : "default",
        navbar: layout === "navbar-sticky" ? "sticky" : "default",
        navbarTheme: layout === "navbar-dark" ? "dark" : "default",
      };
    });
  }, [bare, layout, setTheme]);
  const resolvedLayout = bare
    ? "default"
    : theme.nav === "sidebar"
      ? theme.sidebar === "folded"
        ? layout === "folded-hover"
          ? "folded-hover"
          : "folded"
        : ["vertical-right", "vertical-transparent"].includes(layout)
          ? layout
          : "vertical"
      : ["condensed", "navbar-overlap", "rtl"].includes(layout)
        ? layout
        : "default";
  const vertical = /vertical|folded/.test(resolvedLayout);
  const condensed = ["condensed", "navbar-overlap"].includes(resolvedLayout);
  const content = (
    <>
      {!bare && (
        <>
          <header className="workspace-header">
            <div className="pn-container-xl workspace-header-inner">
              {vertical ? (
                <SidebarTrigger aria-label="Toggle sidebar" />
              ) : (
                <Button
                  variant="workspace"
                  className="workspace-mobile-toggle"
                  ref={mobileToggle}
                  aria-label="Toggle navigation"
                  aria-controls="workspace-navigation"
                  aria-expanded={mobileOpen}
                  onClick={() => setMobileOpen((v) => !v)}
                >
                  {mobileOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
                </Button>
              )}
              {vertical ? (
                <div className="workspace-sidebar-breadcrumb">
                  <span>Workspace</span>
                  <IconChevronRight size={14} />
                  <span>
                    {pages.find((page) => page.path === pathname)?.title ??
                      "Overview"}
                  </span>
                </div>
              ) : (
                <Logo />
              )}
              {condensed && (
                <Navigation onCustomize={() => setCustomizerOpen(true)} />
              )}
              <HeaderActions />
            </div>
          </header>
          {!vertical && !condensed && (
            <div
              id="workspace-navigation"
              className={cn("workspace-navbar", mobileOpen && "is-open")}
            >
              <div className="pn-container-xl">
                <Navigation onCustomize={() => setCustomizerOpen(true)} />
              </div>
            </div>
          )}
          {condensed && mobileOpen && (
            <div
              id="workspace-navigation"
              className="workspace-mobile-navigation"
            >
              <Navigation
                vertical
                onCustomize={() => setCustomizerOpen(true)}
              />
            </div>
          )}
        </>
      )}
      <div id="workspace-content">{children}</div>
      {!bare && (
        <footer className="workspace-footer">
          <div className="pn-container-xl workspace-footer-inner">
            <div>
              Copyright © 2026 <Link to="/">overtrue/ui</Link>. All rights
              reserved. <span className="workspace-footer-dot">•</span>{" "}
              <a href="/workspace/" target="_blank" rel="noreferrer">
                Workspace demo
              </a>
            </div>
            <div className="workspace-footer-links">
              <a href="/docs" target="_blank" rel="noreferrer">
                Documentation
              </a>
              <Link to="/license">License</Link>
              <a
                href="https://github.com/overtrue/ui"
                target="_blank"
                rel="noreferrer"
              >
                Source code
              </a>
              <a href="/components" target="_blank" rel="noreferrer">
                <IconBook size={16} /> Components
              </a>
              <Link to="/high-order">Compositions</Link>
            </div>
          </div>
        </footer>
      )}
    </>
  );
  return (
    <div
      className={cn(
        "overtrue-workspace",
        `workspace-layout-${resolvedLayout}`,
        vertical && "workspace-sidebar-shell",
        bare && "workspace-bare",
      )}
      data-bs-theme={resolvedScheme}
      dir={layout === "rtl" ? "rtl" : undefined}
    >
      <a href="#workspace-content" className="workspace-skip-link">
        Skip to content
      </a>
      {vertical ? (
        <SidebarProvider
          open={
            theme.sidebar === "expanded" ||
            (resolvedLayout === "folded-hover" && sidebarHovered)
          }
          onOpenChange={(open) =>
            setTheme((current) => ({
              ...current,
              sidebar: open ? "expanded" : "folded",
            }))
          }
          className={cn(
            "workspace-sidebar-provider",
            resolvedLayout === "vertical-right" && "flex-row-reverse",
          )}
          style={
            {
              "--sidebar-width": "16rem",
              "--sidebar-width-icon": "4rem",
            } as React.CSSProperties
          }
        >
          <WorkspaceSidebar
            onCustomize={() => setCustomizerOpen(true)}
            side={resolvedLayout === "vertical-right" ? "right" : "left"}
            transparent={resolvedLayout === "vertical-transparent"}
            onHoverChange={
              resolvedLayout === "folded-hover" ? setSidebarHovered : undefined
            }
          />
          <SidebarInset className="workspace-sidebar-inset">
            {content}
          </SidebarInset>
        </SidebarProvider>
      ) : (
        <main className="workspace-main">{content}</main>
      )}
      <Button
        variant="workspace"
        className="pn-btn pn-btn-primary pn-btn-icon workspace-floating-customize"
        aria-label="Customize theme"
        onClick={() => setCustomizerOpen(true)}
      >
        <IconBrush size={20} stroke={1.5} />
      </Button>
      <ThemeCustomizer open={customizerOpen} onOpenChange={setCustomizerOpen} />
    </div>
  );
}
