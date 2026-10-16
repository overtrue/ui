import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  IconArrowsMaximize,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconDeviceTablet,
  IconExternalLink,
  IconMoon,
  IconSun,
  IconX,
} from "@tabler/icons-react";
import { Example } from "./examples";
import { catalogPath, type CatalogItem, type ItemName } from "./catalog";

const sizes = [
  { id: "phone", label: "Phone", width: 390, Icon: IconDeviceMobile },
  { id: "tablet", label: "Tablet", width: 834, Icon: IconDeviceTablet },
  { id: "desktop", label: "Desktop", width: 0, Icon: IconDeviceDesktop },
] as const;
type Size = (typeof sizes)[number]["id"];

/** Query flag that renders a catalog page as a bare preview, for the stage iframe. */
export const STAGE_PARAM = "stage";

/**
 * Full-screen preview. The example runs in an iframe of its own page, so
 * viewport breakpoints and container queries respond to the chosen width.
 */
export function PreviewStage({ item }: { item: CatalogItem }) {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<Size>(() =>
    item.category === "Blocks" ? "desktop" : "tablet",
  );
  const [dark, setDark] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const src = `${catalogPath(item)}?${STAGE_PARAM}=1`;
  const width = sizes.find((entry) => entry.id === size)?.width ?? 0;

  useEffect(() => {
    if (open) setDark(document.documentElement.classList.contains("dark"));
  }, [open]);
  // Same origin: switch the preview's theme without touching the site's.
  const applyTheme = () => {
    frame.current?.contentDocument?.documentElement.classList.toggle(
      "dark",
      dark,
    );
  };
  useEffect(applyTheme, [dark]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="text-link stage-trigger">
        <IconArrowsMaximize size={13} aria-hidden="true" />
        Full screen
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="stage-overlay" />
        <Dialog.Content className="stage" aria-describedby={undefined}>
          <header className="stage-bar">
            <Dialog.Title className="stage-title">{item.title}</Dialog.Title>
            <div
              className="stage-sizes"
              role="radiogroup"
              aria-label="Preview width"
            >
              {sizes.map(({ id, label, width, Icon }) => (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={size === id}
                  title={width ? `${label}, ${width}px` : label}
                  onClick={() => setSize(id)}
                >
                  <Icon size={15} aria-hidden="true" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
            <div className="stage-actions">
              <button
                type="button"
                className="icon-button"
                aria-label={
                  dark ? "Preview in light theme" : "Preview in dark theme"
                }
                onClick={() => setDark((value) => !value)}
              >
                {dark ? <IconSun size={17} /> : <IconMoon size={17} />}
              </button>
              <a
                className="icon-button"
                href={src}
                target="_blank"
                rel="noreferrer"
                aria-label="Open preview in a new tab"
              >
                <IconExternalLink size={17} />
              </a>
              <Dialog.Close
                className="icon-button"
                aria-label="Close full screen preview"
              >
                <IconX size={18} />
              </Dialog.Close>
            </div>
          </header>
          <div className="stage-canvas" data-size={size}>
            <iframe
              ref={frame}
              title={`${item.title} preview`}
              src={src}
              onLoad={applyTheme}
              className="stage-frame"
              style={width ? { width } : undefined}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** The bare preview rendered inside the stage iframe. */
export function StageFrame({ name }: { name: ItemName }) {
  useEffect(() => {
    document.documentElement.dataset.stage = "";
    return () => {
      delete document.documentElement.dataset.stage;
    };
  }, []);
  return (
    <main className="stage-page">
      <Example name={name} />
    </main>
  );
}
