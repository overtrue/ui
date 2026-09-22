import * as React from "react";
import "plyr/dist/plyr.css";
import "@melloware/coloris/dist/coloris.css";
import colorpickerConfigs from "@/data/workspace/colorpickers.json";
import { useThemeState } from "@/components/overtrue/theme-customizer";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  IconStar,
  IconHeart,
  IconGhost,
  IconCircle,
  IconUpload,
  IconX,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PluginProps = React.HTMLAttributes<HTMLDivElement>;
const events = [
  ["Studio planning", 2, 10],
  ["Identity handover", 8, 14],
  ["Research synthesis", 11, 11],
  ["Member portal review", 16, 15],
  ["Visitor concept review", 23, 10],
  ["Focus afternoon", 25, 13],
  ["October capacity planning", 28, 10],
] as const;
export function WorkspaceCalendar(props: PluginProps) {
  const [data, setData] = React.useState<
    { id: string; title: string; start: Date; end: Date }[]
  >(() =>
    events.map(([title, day, hour], i) => ({
      id: String(i),
      title,
      start: new Date(2026, 8, day, hour),
      end: new Date(2026, 8, day, hour + 1),
    })),
  );
  const [draft, setDraft] = React.useState<{
    id?: string;
    title: string;
    date: string;
  } | null>(null);
  const [notice, setNotice] = React.useState("");
  const [visibleRange, setVisibleRange] = React.useState({
    start: new Date(2026, 8, 1),
    end: new Date(2026, 9, 1),
  });
  const editEvent = (item: { id: string; title: string; start: Date }) =>
    setDraft({ id: item.id, title: item.title, date: `${item.start.getFullYear()}-${String(item.start.getMonth() + 1).padStart(2, "0")}-${String(item.start.getDate()).padStart(2, "0")}` });
  return (
    <div {...props}>
      {draft && (
        <form
          className="workspace-calendar-form"
          onSubmit={(event) => {
            event.preventDefault();
            const start = new Date(draft.date + "T10:00:00"),
              end = new Date(draft.date + "T11:00:00");
            if (draft.id)
              setData(
                data.map((item) =>
                  item.id === draft.id
                    ? { ...item, title: draft.title, start, end }
                    : item,
                ),
              );
            else
              setData([
                ...data,
                { id: "event-" + Date.now(), title: draft.title, start, end },
              ]);
            setDraft(null);
            setNotice("Calendar updated in this demo session.");
          }}
        >
          <label>
            Event title
            <input
              autoFocus
              required
              value={draft.title}
              onChange={(event) =>
                setDraft({ ...draft, title: event.target.value })
              }
            />
          </label>
          <label>
            Date
            <input
              type="date"
              required
              value={draft.date}
              onChange={(event) =>
                setDraft({ ...draft, date: event.target.value })
              }
            />
          </label>
          <button type="submit" className="pn-btn pn-btn-primary">
            Save event
          </button>
          <button
            type="button"
            className="pn-btn"
            onClick={() => setDraft(null)}
          >
            Cancel
          </button>
        </form>
      )}
      {notice && <p role="status">{notice}</p>}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialDate="2026-09-21"
        initialView="dayGridMonth"
        eventDisplay="block"
        datesSet={(info) => setVisibleRange({ start: info.view.currentStart, end: info.view.currentEnd })}
        eventDidMount={(info) => {
          info.el.title = info.event.title;
          info.el.setAttribute("aria-label", info.event.title);
        }}
        events={data}
        editable
        selectable
        height="auto"
        dateClick={(info) => setDraft({ title: "", date: info.dateStr })}
        select={(info) =>
          setDraft({ title: "", date: info.startStr.slice(0, 10) })
        }
        eventClick={(info) =>
          setDraft({
            id: info.event.id,
            title: info.event.title,
            date: info.event.startStr.slice(0, 10),
          })
        }
        eventDrop={(info) =>
          setData(
            data.map((item) =>
              item.id === info.event.id
                ? {
                    ...item,
                    start: info.event.start!,
                    end:
                      info.event.end ??
                      new Date(info.event.start!.getTime() + 3600000),
                  }
                : item,
            ),
          )
        }
      />
      <section className="workspace-calendar-agenda" aria-label="Events this month">
        <h3>Events this month</h3>
        {data.filter(item => item.start >= visibleRange.start && item.start < visibleRange.end)
          .sort((a, b) => a.start.getTime() - b.start.getTime())
          .map(item => <button key={item.id} type="button" onClick={() => editEvent(item)}>
            <time dateTime={item.start.toISOString()}>{item.start.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</time>
            <span>{item.title}</span>
          </button>)}
        {!data.some(item => item.start >= visibleRange.start && item.start < visibleRange.end) && <p>No events planned this month.</p>}
      </section>
    </div>
  );
}
export function WorkspaceDatepicker(props: PluginProps) {
  const [month, setMonth] = React.useState(new Date(2026, 8, 1));
  const [selected, setSelected] = React.useState(20);
  const offset =
    (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  return (
    <div {...props} className={cn(props.className, "workspace-datepicker")}>
      <div className="workspace-datepicker-heading">
        <Button
          variant="workspace"
          aria-label="Previous month"
          onClick={() =>
            setMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
          }
        >
          <IconChevronLeft size={16} />
        </Button>
        <strong>
          {month.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </strong>
        <Button
          variant="workspace"
          aria-label="Next month"
          onClick={() =>
            setMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
          }
        >
          <IconChevronRight size={16} />
        </Button>
      </div>
      <div className="workspace-datepicker-grid">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
          <span key={day}>{day}</span>
        ))}
        {Array.from({ length: offset }, (_, i) => (
          <span key={`empty-${i}`} />
        ))}
        {Array.from({ length: days }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-pressed={selected === i + 1}
            className={selected === i + 1 ? "is-selected" : ""}
            onClick={() => setSelected(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
export function WorkspaceRange({ id, className }: PluginProps) {
  const [value, setValue] = React.useState(40);
  return (
    <input
      id={id}
      aria-label="Range value"
      className={className}
      type="range"
      min={0}
      max={100}
      value={value}
      onChange={(event) => setValue(Number(event.target.value))}
      style={{
        accentColor:
          id === "range-color" ? "var(--pn-success)" : "var(--pn-primary)",
      }}
    />
  );
}
export function WorkspaceRating({
  id = "",
  defaultValue,
}: {
  id?: string;
  defaultValue?: string;
  children?: React.ReactNode;
}) {
  const [rating, setRating] = React.useState(Number(defaultValue) || 0);
  const [hover, setHover] = React.useState(0);
  const Icon = id.includes("heart")
    ? IconHeart
    : id.includes("ghost")
      ? IconGhost
      : id.includes("circle")
        ? IconCircle
        : IconStar;
  const color = id.includes("color-primary")
    ? "primary"
    : id.includes("color-red")
      ? "red"
      : id.includes("color-lime")
        ? "lime"
        : "yellow";
  const size = id.includes("size-sm") ? 16 : id.includes("size-lg") ? 32 : 24;
  return (
    <div
      id={id}
      className="workspace-rating"
      role="radiogroup"
      aria-label="Rating"
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((value) => (
        <Button
          key={value}
          variant="workspace"
          role="radio"
          aria-label={`${value} stars`}
          aria-checked={rating === value}
          onClick={() => setRating(value)}
          onMouseEnter={() => setHover(value)}
          style={{
            color:
              value <= (hover || rating)
                ? `var(--pn-${color})`
                : "var(--pn-border-color)",
          }}
        >
          <Icon size={size} stroke={1.5} fill="currentColor" />
        </Button>
      ))}
    </div>
  );
}
let colorisInitialized = false;
export function WorkspaceColorpicker({
  defaultValue,
  id,
  ...props
}: React.ComponentProps<typeof Input>) {
  const host = React.useRef<HTMLDivElement>(null);
  const { resolvedScheme } = useThemeState();
  React.useEffect(() => {
    let disposed = false;
    let remove: (() => void) | undefined;
    import("@melloware/coloris").then(({ default: Coloris }) => {
      if (disposed || !host.current || !id) return;
      if (!colorisInitialized) {
        Coloris.init();
        colorisInitialized = true;
      }
      const selector = `#${CSS.escape(id)}`;
      const style = getComputedStyle(
        host.current.closest(".overtrue-workspace") ?? host.current,
      );
      const config =
        (
          colorpickerConfigs as Record<
            string,
            { alpha?: boolean; format?: string }
          >
        )[id] ?? {};
      Coloris({ el: ".workspace-color-field input" });
      Coloris.setInstance(selector, {
        selectInput: false,
        alpha: config.alpha ?? true,
        format: (config.format || "hex") as "hex",
        themeMode: document.documentElement.classList.contains("dark") ? "dark" : "light",
        swatches: [
          "blue",
          "azure",
          "indigo",
          "purple",
          "pink",
          "red",
          "orange",
          "yellow",
          "lime",
          "green",
          "teal",
          "cyan",
        ].map((color) => style.getPropertyValue(`--pn-${color}`).trim()),
      });
      remove = () => Coloris.removeInstance(selector);
    });
    return () => {
      disposed = true;
      remove?.();
    };
  }, [id, resolvedScheme]);
  return (
    <div ref={host} className="workspace-color-field">
      <Input
        appearance="workspace"
        {...props}
        id={id}
        type="text"
        defaultValue={defaultValue}
      />
    </div>
  );
}
export function WorkspaceDropzone({ id, className, children }: PluginProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const input = React.useRef<HTMLInputElement>(null);
  const multiple = id?.includes("multiple");
  const add = (incoming: FileList | null) => {
    if (incoming) setFiles(multiple ? [...files, ...incoming] : [incoming[0]]);
  };
  return (
    <div
      className={cn(className, "workspace-dropzone")}
      id={id}
      role="button"
      tabIndex={0}
      aria-label="Click or drag files to upload"
      onClick={() => input.current?.click()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          input.current?.click();
        }
      }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        add(event.dataTransfer.files);
      }}
    >
      <input
        ref={input}
        type="file"
        hidden
        multiple={multiple}
        onClick={(event) => event.stopPropagation()}
        onChange={(event) => add(event.target.files)}
      />
      {files.length ? (
        <div className="workspace-dropzone-files">
          {files.map((file, i) => (
            <div key={`${file.name}-${i}`}>
              <IconUpload size={28} />
              <strong>{file.name}</strong>
              <small>{Math.round(file.size / 1024)} KB</small>
              <Button
                variant="workspace"
                aria-label={`Remove ${file.name}`}
                onClick={(event) => {
                  event.stopPropagation();
                  setFiles(files.filter((_, j) => i !== j));
                }}
              >
                <IconX size={16} />
              </Button>
            </div>
          ))}
        </div>
      ) : id?.includes("custom") ? (
        children
      ) : (
        <div className="pn-dz-message">Drop files here to upload</div>
      )}
    </div>
  );
}
export function WorkspaceEditor({
  id,
  defaultValue = "Hello, <b>overtrue/ui</b>!",
}: {
  id?: string;
  defaultValue?: string;
}) {
  const input = React.useRef<HTMLTextAreaElement>(null);
  const content = React.useRef(defaultValue);
  const { theme, resolvedScheme } = useThemeState();
  React.useEffect(() => {
    let disposed = false;
    let editor: import("hugerte").Editor | undefined;
    import("hugerte").then(async ({ default: hugeRTE }) => {
      if (disposed || !input.current) return;
      const dark = document.documentElement.classList.contains("dark");
      const fontFamily = getComputedStyle(input.current).fontFamily;
      const instances = await hugeRTE.init({
        target: input.current,
        base_url: import.meta.env.DEV
          ? "/node_modules/hugerte"
          : "/vendor/hugerte",
        suffix: ".min",
        height: 300,
        menubar: false,
        statusbar: false,
        plugins:
          "advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount",
        toolbar:
          "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat",
        skin: dark ? "oxide-dark" : "oxide",
        content_css: dark ? "dark" : "default",
        content_style:
          `body { font-family: ${fontFamily}; font-size: 14px; -webkit-font-smoothing: antialiased; }`,
        setup: (instance) => {
          editor = instance;
          instance.on("init", () => instance.setContent(content.current));
        },
      });
      if (disposed) instances.forEach((instance) => instance.remove());
    });
    return () => {
      disposed = true;
      if (editor) {
        if (editor.initialized) content.current = editor.getContent();
        editor.remove();
      }
    };
  }, [resolvedScheme, theme.font]);
  return (
    <textarea
      ref={input}
      id={id}
      defaultValue={defaultValue}
      aria-label="Description"
    />
  );
}
export function WorkspaceVideo({
  provider,
  videoId,
  ...props
}: PluginProps & { provider: string; videoId: string }) {
  const host = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    let disposed = false;
    let player: import("plyr") | undefined;
    import("plyr").then(({ default: Plyr }) => {
      if (disposed || !host.current) return;
      const element = document.createElement("div");
      element.setAttribute("data-plyr-provider", provider);
      element.setAttribute("data-plyr-embed-id", videoId);
      host.current.replaceChildren(element);
      player = new Plyr(element, { youtube: { noCookie: true } });
    });
    return () => {
      disposed = true;
      player?.destroy();
    };
  }, [provider, videoId]);
  return (
    <div
      {...props}
      ref={host}
      className={cn(props.className, "workspace-video")}
    />
  );
}
export function WorkspaceSortable({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}) {
  const [items, setItems] = React.useState(() =>
    React.Children.toArray(children).filter(React.isValidElement),
  );
  const [dragging, setDragging] = React.useState<number | null>(null);
  return (
    <ul className={className}>
      {items.map((child, index) =>
        React.cloneElement(
          child as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
          {
            key: child.key ?? index,
            draggable: true,
            tabIndex: 0,
            "aria-label": `Sortable item ${index + 1}. Use Alt and arrow keys to reorder.`,
            onDragStart: () => setDragging(index),
            onDragOver: (event) => event.preventDefault(),
            onDrop: (event) => {
              event.preventDefault();
              if (dragging === null) return;
              const next = [...items];
              const [moved] = next.splice(dragging, 1);
              next.splice(index, 0, moved);
              setItems(next);
              setDragging(null);
            },
            onKeyDown: (event) => {
              if (
                !event.altKey ||
                !["ArrowUp", "ArrowDown"].includes(event.key)
              )
                return;
              event.preventDefault();
              const nextIndex = index + (event.key === "ArrowUp" ? -1 : 1);
              if (nextIndex < 0 || nextIndex >= items.length) return;
              const next = [...items];
              [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
              setItems(next);
            },
          },
        ),
      )}
    </ul>
  );
}

/** Same shortest-column placement as the reference, with React-owned positioning. */
export function WorkspaceMasonry({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}) {
  const root = React.useRef<HTMLDivElement>(null);
  const items = React.Children.toArray(children).filter(React.isValidElement);
  const [layout, setLayout] = React.useState<{
    height: number;
    positions: { x: number; y: number; width: number }[];
  }>({ height: 0, positions: [] });
  React.useLayoutEffect(() => {
    const container = root.current;
    if (!container) return;
    const place = () => {
      const columns =
        window.innerWidth >= 992 ? 3 : window.innerWidth >= 576 ? 2 : 1;
      const width = container.clientWidth / columns;
      const heights = Array(columns).fill(0) as number[];
      const positions = Array.from(container.children).map((child) => {
        const column = heights.indexOf(Math.min(...heights));
        const result = { x: column * width, y: heights[column], width };
        heights[column] += child.getBoundingClientRect().height + 16;
        return result;
      });
      const next = { height: Math.max(...heights), positions };
      setLayout((previous) =>
        JSON.stringify(previous) === JSON.stringify(next) ? previous : next,
      );
    };
    const observer = new ResizeObserver(place);
    observer.observe(container);
    Array.from(container.children).forEach((child) => observer.observe(child));
    place();
    return () => observer.disconnect();
  }, [items.length]);
  return (
    <div
      ref={root}
      className={className}
      style={{
        position: "relative",
        display: "block",
        height: layout.height || undefined,
      }}
    >
      {items.map((item, index) =>
        React.cloneElement(
          item as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
          {
            key: item.key ?? index,
            style: layout.positions[index]
              ? {
                  position: "absolute",
                  width: layout.positions[index].width,
                  left: layout.positions[index].x,
                  top: layout.positions[index].y,
                  marginTop: 0,
                }
              : undefined,
          },
        ),
      )}
    </div>
  );
}
