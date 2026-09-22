import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import {
  IconHome,
  IconFolder,
  IconUsers,
  IconCreditCard,
  IconFiles,
  IconPuzzle,
  IconLayoutSidebar,
  IconBrush,
  IconChevronDown,
  IconChevronRight,
  IconX,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import navigation from "@/data/workspace/navigation.json";
import { cn } from "@/lib/utils";

type Menu = { title: string; href?: string; children?: Menu[] };
const icons = [
  IconHome,
  IconFolder,
  IconUsers,
  IconCreditCard,
  IconFiles,
  IconPuzzle,
  IconLayoutSidebar,
];
export function workspaceHref(href = "#") {
  return href.endsWith(".html")
    ? href.replace(/^\.\//, "").replace(/\.html$/, "") === "index"
      ? "/"
      : "/" + href.replace(/^\.\//, "").replace(/\.html$/, "")
    : href;
}
const containsPath = (menu: Menu, pathname: string): boolean =>
  workspaceHref(menu.href) === pathname ||
  Boolean(menu.children?.some((child) => containsPath(child, pathname)));
function Label({ title }: { title: string }) {
  const isNew = title.endsWith(" New");
  return (
    <>
      {isNew ? title.slice(0, -4) : title}
      {isNew && (
        <span
          className="pn-badge pn-badge-sm pn-bg-green-lt"
          style={{ marginLeft: 8 }}
        >
          New
        </span>
      )}
    </>
  );
}
export function MenuItems({ items }: { items: Menu[] }) {
  return (
    <>
      {items.map((item) =>
        item.children?.length ? (
          <Dropdown.Sub key={item.title}>
            <Dropdown.SubTrigger className="pn-dropdown-item workspace-sub-trigger">
              <Label title={item.title} />
              <IconChevronRight size={14} />
            </Dropdown.SubTrigger>
            <Dropdown.Portal>
              <div className="overtrue-workspace workspace-portal">
                <Dropdown.SubContent
                  className="pn-dropdown-menu pn-show workspace-dropdown-content"
                  sideOffset={2}
                >
                  <MenuItems items={item.children} />
                </Dropdown.SubContent>
              </div>
            </Dropdown.Portal>
          </Dropdown.Sub>
        ) : (
          <Dropdown.Item key={item.title} className="pn-dropdown-item" asChild>
            {item.href?.startsWith("http") ? (
              <a href={item.href} target="_blank" rel="noreferrer">
                <Label title={item.title} />
              </a>
            ) : (
              <Link to={workspaceHref(item.href)}>
                <Label title={item.title} />
              </Link>
            )}
          </Dropdown.Item>
        ),
      )}
    </>
  );
}
export function Logo({ className = "workspace-logo" }: { className?: string }) {
  return (
    <Link to="/" className={className} aria-label="overtrue/ui home">
      <svg width="24" height="24" viewBox="0 0 28 28" aria-hidden="true">
        <rect width="28" height="28" rx="7" fill="#066fd1" />
        <g fill="white">
          <rect x="6" y="6" width="5" height="16" rx="1.5" />
          <rect x="14" y="6" width="8" height="7" rx="1.5" />
          <rect x="14" y="16" width="8" height="6" rx="1.5" />
        </g>
      </svg>
      <span>overtrue/ui</span>
    </Link>
  );
}
export function Navigation({
  vertical = false,
  onCustomize,
}: {
  vertical?: boolean;
  onCustomize: () => void;
}) {
  const { pathname } = useLocation();
  return (
    <nav
      aria-label="Main navigation"
      className={cn(
        "workspace-navigation",
        vertical && "workspace-navigation-vertical",
      )}
    >
      {navigation.map((menu, index) => {
        const Icon = icons[index] ?? IconFolder;
        return (
          <Dropdown.Root key={menu.title}>
            <Dropdown.Trigger asChild>
              <Button
                variant="workspace"
                aria-label={menu.title}
                className={cn(
                  "workspace-nav-link",
                  containsPath(menu, pathname) && "is-current",
                )}
              >
                <Icon size={20} stroke={1.5} />
                <span>{menu.title}</span>
                <IconChevronDown size={12} />
              </Button>
            </Dropdown.Trigger>
            <Dropdown.Portal>
              <div className="overtrue-workspace workspace-portal">
                <Dropdown.Content
                  className="pn-dropdown-menu pn-show workspace-dropdown-content workspace-nav-menu"
                  sideOffset={0}
                  align="start"
                >
                  <MenuItems items={menu.children} />
                </Dropdown.Content>
              </div>
            </Dropdown.Portal>
          </Dropdown.Root>
        );
      })}
      <Button
        variant="workspace"
        className="workspace-nav-link workspace-customize"
        aria-label="Customize"
        onClick={onCustomize}
      >
        <IconBrush size={20} stroke={1.5} />
        <span>Customize</span>
      </Button>
    </nav>
  );
}

function SidebarChildren({ items }: { items: Menu[] }) {
  const { pathname } = useLocation();
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarMenuSub>
      {items.map((item) => (
        <SidebarMenuSubItem key={item.title}>
          {item.children?.length ? (
            <Collapsible
              key={`${item.title}:${pathname}`}
              defaultOpen={containsPath(item, pathname)}
            >
              <CollapsibleTrigger asChild>
                <SidebarMenuSubButton
                  asChild
                  className="workspace-sidebar-branch"
                >
                  <button type="button">
                    <span>{item.title}</span>
                    <IconChevronRight />
                  </button>
                </SidebarMenuSubButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarChildren items={item.children} />
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <SidebarMenuSubButton
              asChild
              isActive={workspaceHref(item.href) === pathname}
            >
              <Link
                to={workspaceHref(item.href)}
                aria-current={
                  workspaceHref(item.href) === pathname ? "page" : undefined
                }
                onClick={() => setOpenMobile(false)}
              >
                <span>
                  <Label title={item.title} />
                </span>
              </Link>
            </SidebarMenuSubButton>
          )}
        </SidebarMenuSubItem>
      ))}
    </SidebarMenuSub>
  );
}

export function WorkspaceSidebar({
  onCustomize,
  side = "left",
  transparent = false,
  onHoverChange,
}: {
  onCustomize: () => void;
  side?: "left" | "right";
  transparent?: boolean;
  onHoverChange?: (hovered: boolean) => void;
}) {
  const { pathname } = useLocation();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const activeGroup = navigation.find((menu) =>
    containsPath(menu, pathname),
  )?.title;
  const [expanded, setExpanded] = React.useState<string | undefined>(
    activeGroup,
  );
  React.useEffect(() => {
    setExpanded(activeGroup);
    setOpenMobile(false);
  }, [pathname, activeGroup, setOpenMobile]);
  const collapsed = state === "collapsed" && !isMobile;
  return (
    <Sidebar
      side={side}
      collapsible="icon"
      className={cn("workspace-app-sidebar", transparent && "is-transparent")}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      onFocusCapture={() => onHoverChange?.(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          onHoverChange?.(false);
      }}
    >
      <SidebarHeader className="workspace-sidebar-heading">
        <Logo className="workspace-sidebar-brand" />
        {isMobile && (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Close navigation"
            onClick={() => setOpenMobile(false)}
          >
            <IconX />
          </Button>
        )}
      </SidebarHeader>
      <SidebarContent>
        <nav aria-label="Main navigation">
          {[
            { label: "Workspace", menus: navigation.slice(0, 5), offset: 0 },
            { label: "Explore", menus: navigation.slice(5), offset: 5 },
          ].map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarMenu>
                {group.menus.map((menu, index) => {
                  const Icon = icons[index + group.offset];
                  const active = containsPath(menu, pathname);
                  return (
                    <SidebarMenuItem key={menu.title}>
                      {collapsed ? (
                        <Dropdown.Root>
                          <Dropdown.Trigger asChild>
                            <SidebarMenuButton
                              aria-label={menu.title}
                              tooltip={menu.title}
                              isActive={active}
                            >
                              <Icon stroke={1.5} />
                              <span>{menu.title}</span>
                            </SidebarMenuButton>
                          </Dropdown.Trigger>
                          <Dropdown.Portal>
                            <div className="overtrue-workspace workspace-portal">
                              <Dropdown.Content
                                className="pn-dropdown-menu pn-show workspace-dropdown-content workspace-nav-menu"
                                side={side === "left" ? "right" : "left"}
                                align="start"
                                sideOffset={8}
                              >
                                <Dropdown.Label className="workspace-sidebar-menu-label">
                                  {menu.title}
                                </Dropdown.Label>
                                <MenuItems items={menu.children} />
                              </Dropdown.Content>
                            </div>
                          </Dropdown.Portal>
                        </Dropdown.Root>
                      ) : (
                        <Collapsible
                          open={expanded === menu.title}
                          onOpenChange={(open) =>
                            setExpanded(open ? menu.title : undefined)
                          }
                        >
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              aria-label={menu.title}
                              className="workspace-sidebar-section"
                              data-current-group={active}
                            >
                              <Icon stroke={1.5} />
                              <span>{menu.title}</span>
                              <IconChevronRight className="workspace-sidebar-chevron" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarChildren items={menu.children} />
                          </CollapsibleContent>
                        </Collapsible>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </nav>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Customize"
              aria-label="Customize"
              onClick={() => {
                setOpenMobile(false);
                onCustomize();
              }}
            >
              <IconBrush stroke={1.5} />
              <span>Customize</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip="Member profile"
              className="workspace-sidebar-account"
            >
              <Link to="/profile" onClick={() => setOpenMobile(false)}>
                <img
                  src="/assets/overtrue/people/maya.svg"
                  alt=""
                  width="28"
                  height="28"
                />
                <span>
                  <strong>Acme Studio</strong>
                  <small>Sample workspace</small>
                </span>
                <IconChevronRight className="workspace-sidebar-chevron" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
