import { useEffect, useState } from "react";
import {
  IconCheck as Check,
  IconCopy as Copy,
  IconTerminal2 as Terminal,
} from "@tabler/icons-react";

export function CopyButton({
  text,
  label = "Copy",
}: {
  text: string;
  label?: string;
}) {
  const [status, setStatus] = useState("");
  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => setStatus(""), 2500);
    return () => clearTimeout(timer);
  }, [status]);
  return (
    <button
      className="copy-button"
      type="button"
      aria-label={status || label}
      title={status || label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setStatus("Copied");
        } catch {
          setStatus("Select the command to copy");
        }
      }}
    >
      {status === "Copied" ? <Check size={15} /> : <Copy size={15} />}
      <span className="sr-only" role="status">
        {status}
      </span>
    </button>
  );
}
export function Command({
  text,
  label = "Terminal",
}: {
  text: string;
  label?: string;
}) {
  return (
    <div className="code-box">
      <div className="code-label">
        <span>
          <Terminal size={14} />
          {label}
        </span>
        <CopyButton text={text} />
      </div>
      <pre>
        <code>{text}</code>
      </pre>
    </div>
  );
}
