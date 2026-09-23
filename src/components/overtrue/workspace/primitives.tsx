import * as React from "react"
import "driver.js/dist/driver.css"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input, Textarea } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useThemeState } from "@/components/overtrue/theme-customizer"

export { WorkspaceChart } from "./chart"
export { WorkspaceMap, WorkspaceTileMap } from "./map"

type Props = React.HTMLAttributes<HTMLElement> & {
  [key: string]: unknown
  children?: React.ReactNode
  className?: string
  id?: string
  href?: string
}
type State = {
  open: string | null
  collapsed: Record<string, boolean>
  tabs: Record<string, string>
}
const SurfaceContext = React.createContext<{
  state: State
  setState: React.Dispatch<React.SetStateAction<State>>
}>({ state: { open: null, collapsed: {}, tabs: {} }, setState: () => {} })
const DismissContext = React.createContext<(() => void) | null>(null)

/** State belongs to the mounted page and resets when navigating between examples. */
export function WorkspaceSurface({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<State>({
    open: null,
    collapsed: {},
    tabs: {},
  })
  return (
    <SurfaceContext.Provider value={{ state, setState }}>
      {children}
    </SurfaceContext.Provider>
  )
}

export function WorkspaceButton({ href, children, ...props }: Props) {
  const [passwordVisible, setPasswordVisible] = React.useState(false)
  if (typeof props["data-password-toggle"] === "string") {
    const target = props["data-password-toggle"]
    return (
      <Button
        variant="workspace"
        type="button"
        {...(props as React.ComponentProps<typeof Button>)}
        aria-label={passwordVisible ? "Hide password" : "Show password"}
        title={passwordVisible ? "Hide password" : "Show password"}
        aria-pressed={passwordVisible}
        onClick={() => {
          const input = document.getElementById(target)
          if (input instanceof HTMLInputElement) {
            input.type = passwordVisible ? "password" : "text"
            setPasswordVisible(!passwordVisible)
          }
        }}
      >
        {children}
      </Button>
    )
  }
  if (props.id === "start-tour")
    return (
      <Button
        variant="workspace"
        type="button"
        {...(props as React.ComponentProps<typeof Button>)}
        onClick={async () => {
          const { driver } = await import("driver.js")
          driver({
            showProgress: true,
            steps: [
              {
                element: "#start-tour",
                popover: {
                  title: "Welcome to the Tour!",
                  description:
                    "This button starts the interactive tour. Click it to begin exploring the page.",
                },
              },
              ...[
                "Welcome Section",
                "Features Section",
                "Data Table",
                "Settings Card",
                "Users Card",
                "Analytics Card",
              ].map((title, index) => ({
                element: `#tour-card-${index + 1}`,
                popover: {
                  title,
                  description:
                    index === 5
                      ? "The final step of the tour. This card shows analytics features."
                      : "Explore this section of the page before continuing.",
                },
              })),
            ],
          }).drive()
        }}
      >
        {children}
      </Button>
    )
  if (href)
    return (
      <Button variant="workspace" asChild>
        <WorkspaceLink href={href} {...props}>
          {children}
        </WorkspaceLink>
      </Button>
    )
  return (
    <Button
      variant="workspace"
      type="button"
      {...(props as React.ComponentProps<typeof Button>)}
    >
      {children}
    </Button>
  )
}
export function WorkspaceLink({ href = "#", onClick, ...props }: Props) {
  const { setTheme } = useThemeState()
  return (
    <a
      href={href.startsWith("/#/") ? `/workspace${href}` : href}
      {...props}
      onClick={(event) => {
        if (/^\?theme=(light|dark)$/.test(href)) {
          event.preventDefault()
          setTheme((theme) => ({
            ...theme,
            scheme: href.endsWith("dark") ? "dark" : "light",
            navbarTheme: "default",
          }))
        } else if (href === "#") event.preventDefault()
        // HashRouter owns navigation; in-page anchor links scroll without replacing the route.
        else if (href.startsWith("#")) {
          event.preventDefault()
          document
            .getElementById(href.slice(1))
            ?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        onClick?.(event)
      }}
    />
  )
}
export function WorkspaceInput(props: React.ComponentProps<typeof Input>) {
  return <Input appearance="workspace" {...props} />
}
export function WorkspaceTextarea(props: React.ComponentProps<typeof Textarea>) {
  return <Textarea appearance="workspace" {...props} />
}
export function WorkspaceSelect(props: React.ComponentProps<"select">) {
  return (
    <select
      {...props}
      defaultValue={
        props.multiple &&
        props.defaultValue !== undefined &&
        !Array.isArray(props.defaultValue)
          ? [String(props.defaultValue)]
          : props.defaultValue
      }
    />
  )
}
export function WorkspaceBadge(props: Props) {
  return <Badge variant="workspace" {...props} />
}
export function WorkspaceForm({ children, ...props }: Props) {
  const [submitted, setSubmitted] = React.useState(false)
  return (
    <form
      {...props}
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(true)
      }}
    >
      {children}
      {submitted && (
        <div role="status" className="pn-alert pn-alert-success pn-mt-3">
          Your changes have been saved for this demo.
        </div>
      )}
    </form>
  )
}

export function WorkspaceAccordion({ defaultValue, mode, ...props }: Props) {
  if (mode === "single")
    return (
      <AccordionPrimitive.Root
        type="single"
        collapsible
        defaultValue={(defaultValue as string[])?.[0]}
        {...props}
        dir={props.dir === "rtl" ? "rtl" : "ltr"}
      />
    )
  return (
    <AccordionPrimitive.Root
      type="multiple"
      defaultValue={defaultValue as string[]}
      {...props}
      dir={props.dir === "rtl" ? "rtl" : "ltr"}
    />
  )
}
export function WorkspaceAccordionItem({ value, ...props }: Props) {
  return <AccordionPrimitive.Item value={value as string} {...props} />
}
export function WorkspaceAccordionTrigger(props: Props) {
  return <AccordionPrimitive.Trigger {...props} />
}
export function WorkspaceAccordionContent({ className, ...props }: Props) {
  return (
    <AccordionPrimitive.Content
      {...props}
      className={cn(
        className?.replace(/pn-collapse\b|pn-show\b/g, ""),
        "workspace-accordion-content",
      )}
    />
  )
}

export function WorkspaceAction({
  action,
  target,
  children,
  ...props
}: Props & { action: string; target?: string }) {
  const { setState } = React.useContext(SurfaceContext)
  const dismiss = React.useContext(DismissContext)
  return (
    <Button
      variant="workspace"
      type="button"
      {...(props as React.ComponentProps<typeof Button>)}
      data-workspace-target={target?.replace(/^#/, "")}
      onClick={() => {
        const id = target?.replace(/^#/, "") ?? ""
        if (action === "open") setState((s) => ({ ...s, open: id }))
        if (action === "collapse")
          setState((s) => ({
            ...s,
            collapsed: { ...s.collapsed, [id]: !s.collapsed[id] },
          }))
        if (action === "dismiss") {
          dismiss?.()
          setState((s) => ({ ...s, open: null }))
        }
      }}
    >
      {children}
    </Button>
  )
}
export function WorkspaceCollapse({ id = "", className, ...props }: Props) {
  const { state } = React.useContext(SurfaceContext)
  const open = state.collapsed[id] ?? className?.includes("pn-show")
  return (
    <div
      id={id}
      {...props}
      className={cn(className?.replace(/pn-show\b/g, ""), open && "pn-show")}
    />
  )
}
export function WorkspaceTab({
  target,
  group = "default",
  className,
  children,
  ...props
}: Props & { target: string; group?: string }) {
  const { state, setState } = React.useContext(SurfaceContext)
  const active = state.tabs[group]
    ? state.tabs[group] === target
    : className?.includes("pn-active")
  return (
    <button
      {...props}
      type="button"
      role="tab"
      aria-selected={Boolean(active)}
      aria-controls={target.slice(1)}
      className={cn(
        className?.replace(/pn-active\b/g, ""),
        active && "pn-active",
      )}
      onClick={() =>
        setState((s) => ({ ...s, tabs: { ...s.tabs, [group]: target } }))
      }
      onKeyDown={(event) => {
        if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key))
          return
        const list = event.currentTarget.closest(
          '[role="tablist"], .pn-nav, .pn-list-group',
        )
        const tabs = Array.from(
          list?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [],
        )
        const current = tabs.indexOf(event.currentTarget)
        const next =
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? tabs.length - 1
              : (current +
                  (event.key === "ArrowRight" ? 1 : -1) +
                  tabs.length) %
                tabs.length
        event.preventDefault()
        tabs[next]?.focus()
        tabs[next]?.click()
      }}
    >
      {children}
    </button>
  )
}
export function WorkspaceTabPanel({
  id = "",
  group = "default",
  className,
  ...props
}: Props & { group?: string }) {
  const { state } = React.useContext(SurfaceContext)
  const active = state.tabs[group]
    ? state.tabs[group] === `#${id}`
    : className?.includes("pn-active")
  return (
    <div
      {...props}
      id={id}
      role="tabpanel"
      tabIndex={0}
      hidden={!active}
      className={cn(
        className?.replace(/pn-active\b|pn-show\b/g, ""),
        active && "pn-active pn-show",
      )}
    />
  )
}

export function WorkspaceModal({ id = "", title, className, children }: Props) {
  const { state, setState } = React.useContext(SurfaceContext)
  const returnFocus = React.useRef<HTMLElement | null>(null)
  return (
    <DialogPrimitive.Root
      open={state.open === id}
      onOpenChange={(open) =>
        setState((s) => ({ ...s, open: open ? id : null }))
      }
    >
      <DialogPrimitive.Portal>
        <div className="overtrue-workspace workspace-portal">
          <DialogPrimitive.Overlay className="workspace-dialog-overlay" />
          <DialogPrimitive.Content
            aria-describedby={undefined}
            className={cn(className, "pn-show workspace-modal")}
            id={id}
            onOpenAutoFocus={() => {
              returnFocus.current = document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null
            }}
            onPointerDown={(event) => {
              if (event.target === event.currentTarget)
                setState((s) => ({ ...s, open: null }))
            }}
            onCloseAutoFocus={(event) => {
              event.preventDefault()
              if (returnFocus.current?.isConnected)
                returnFocus.current.focus({ preventScroll: true })
            }}
          >
            <DialogPrimitive.Title className="sr-only">
              {title || `${id.replace(/^modal-/, "").replaceAll("-", " ")} dialog`}
            </DialogPrimitive.Title>
            {children}
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
export function WorkspaceOffcanvas({
  id = "",
  title,
  className,
  children,
  ...props
}: Props) {
  const { state, setState } = React.useContext(SurfaceContext)
  const returnFocus = React.useRef<HTMLElement | null>(null)
  const [initiallyOpen, setInitiallyOpen] = React.useState(
    Boolean(className?.split(" ").includes("pn-show")),
  )
  const close = () => {
    setInitiallyOpen(false)
    setState((s) => ({ ...s, open: null }))
  }
  return (
    <DialogPrimitive.Root
      open={state.open === id || initiallyOpen}
      onOpenChange={(open) => {
        if (!open) close()
        else setState((s) => ({ ...s, open: id }))
      }}
    >
      <DialogPrimitive.Portal>
        <div className="overtrue-workspace workspace-portal">
          <DialogPrimitive.Overlay className="workspace-dialog-overlay" />
          <DialogPrimitive.Content
            {...props}
            aria-describedby={undefined}
            id={id}
            className={cn(className, "pn-show workspace-offcanvas")}
            onOpenAutoFocus={() => {
              returnFocus.current = document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null
            }}
            onCloseAutoFocus={(event) => {
              event.preventDefault()
              if (returnFocus.current?.isConnected)
                returnFocus.current.focus({ preventScroll: true })
            }}
          >
            <DialogPrimitive.Title className="sr-only">
              {title || "Panel"}
            </DialogPrimitive.Title>
            <DismissContext.Provider value={close}>
              {children}
            </DismissContext.Provider>
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
export function WorkspaceAlert({ children, ...props }: Props) {
  const [visible, setVisible] = React.useState(true)
  return visible ? (
    <DismissContext.Provider value={() => setVisible(false)}>
      <div {...props} role="alert">
        {children}
      </div>
    </DismissContext.Provider>
  ) : null
}
export function WorkspaceToast({ className, ...props }: Props) {
  return <WorkspaceAlert {...props} className={cn(className, "pn-show")} />
}
const DropdownContext = React.createContext(false)
export function WorkspaceDropdown({ children, ...props }: Props) {
  return (
    <DropdownContext.Provider value={true}>
      <DropdownPrimitive.Root>
        <div {...props}>{children}</div>
      </DropdownPrimitive.Root>
    </DropdownContext.Provider>
  )
}
export function WorkspaceDropdownTrigger({
  className,
  children,
  ...props
}: Props) {
  const inside = React.useContext(DropdownContext)
  if (!inside)
    return (
      <WorkspaceButton className={className} {...props}>
        {children}
      </WorkspaceButton>
    )
  return (
    <DropdownPrimitive.Trigger asChild>
      <Button
        variant="workspace"
        {...(props as React.ComponentProps<typeof Button>)}
        className={className}
      >
        {children}
      </Button>
    </DropdownPrimitive.Trigger>
  )
}
export function WorkspaceDropdownContent({
  className,
  children,
  ...props
}: Props) {
  const inside = React.useContext(DropdownContext)
  if (!inside)
    return (
      <div className={className} {...props}>
        {children}
      </div>
    )
  return (
    <DropdownPrimitive.Portal>
      <div className="overtrue-workspace workspace-portal">
        <DropdownPrimitive.Content
          {...props}
          sideOffset={4}
          align={className?.includes("pn-dropdown-menu-end") ? "end" : "start"}
          className={cn(className, "pn-show workspace-dropdown-content")}
        >
          {children}
        </DropdownPrimitive.Content>
      </div>
    </DropdownPrimitive.Portal>
  )
}
export function WorkspaceDropdownItem({
  href,
  className,
  children,
  ...props
}: Props) {
  const inside = React.useContext(DropdownContext)
  if (!inside)
    return (
      <WorkspaceLink href={href} className={className} {...props}>
        {children}
      </WorkspaceLink>
    )
  return (
    <DropdownPrimitive.Item className={className} asChild>
      {href ? (
        <WorkspaceLink href={href} {...props}>
          {children}
        </WorkspaceLink>
      ) : (
        <button type="button" {...props}>
          {children}
        </button>
      )}
    </DropdownPrimitive.Item>
  )
}
export function WorkspaceCarousel({ children, ...props }: Props) {
  const [current, setCurrent] = React.useState(0)
  const slides: React.ReactElement<Props>[] = []
  function collect(nodes: React.ReactNode) {
    React.Children.forEach(nodes, (child) => {
      if (!React.isValidElement<Props>(child)) return
      if (child.props.className?.split(" ").includes("pn-carousel-item"))
        slides.push(child)
      else collect(child.props.children)
    })
  }
  collect(children)
  return (
    <div {...props} aria-roledescription="carousel">
      <div className="pn-carousel-inner">
        {slides.map((slide, i) =>
          React.cloneElement(slide, {
            key: i,
            className: cn(
              slide.props.className?.replace(/pn-active\b/, ""),
              current === i && "pn-active",
            ),
          }),
        )}
      </div>
      <button
        type="button"
        className="pn-carousel-control-prev"
        aria-label="Previous slide"
        onClick={() =>
          setCurrent((current - 1 + slides.length) % slides.length)
        }
      >
        <span className="pn-carousel-control-prev-icon" />
      </button>
      <button
        type="button"
        className="pn-carousel-control-next"
        aria-label="Next slide"
        onClick={() => setCurrent((current + 1) % slides.length)}
      >
        <span className="pn-carousel-control-next-icon" />
      </button>
      <div className="pn-carousel-indicators">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Slide ${i + 1}`}
            aria-current={i === current}
            className={i === current ? "pn-active" : ""}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  )
}
export function WorkspaceEmbed({ title, src, ...props }: Props) {
  return (
    <iframe
      {...props}
      title={typeof title === "string" ? title : "Embedded media"}
      src={typeof src === "string" ? src : undefined}
      loading="lazy"
    />
  )
}
