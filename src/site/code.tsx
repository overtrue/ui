import { Fragment, useEffect, useState, type CSSProperties } from "react";
import type { ThemedToken } from "shiki/types";
import type { CodeLanguage } from "./highlight-code";
import {
  IconCheck as Check,
  IconCopy as Copy,
  IconTerminal2 as Terminal,
  IconCode as Code,
  IconBraces as Braces,
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
export function HighlightedCode({
  text,
  language,
}: {
  text: string;
  language: CodeLanguage;
}) {
  const [highlighted, setHighlighted] = useState<{
    text: string;
    language: CodeLanguage;
    tokens: ThemedToken[][];
  }>();
  useEffect(() => {
    let active = true;
    import("./highlight-code")
      .then(({ highlightCode }) => highlightCode(text, language))
      .then((tokens) => {
        if (active) setHighlighted({ text, language, tokens });
      })
      .catch(() => {
        /* Keep the readable, copyable plain-text fallback. */
      });
    return () => {
      active = false;
    };
  }, [text, language]);
  const tokens =
    highlighted?.text === text && highlighted.language === language
      ? highlighted.tokens
      : undefined;
  const lines = tokens ?? text.split("\n").map((content) => [{ content }]);
  const numbered = language !== "bash" && lines.length > 1;
  return (
    <pre
      className="highlighted-code"
      tabIndex={0}
      aria-label={`${language === "tsx" ? "React" : language === "json" ? "JSON" : "Terminal"} code`}
      data-highlighted={Boolean(tokens)}
    >
      <code data-language={language}>
        {lines.map((line, index) => (
          <Fragment key={index}>
            {index > 0 && "\n"}
            <span className="code-line">
              {numbered && (
                <span
                  className="code-line-number"
                  aria-hidden="true"
                  data-line-number={index + 1}
                />
              )}
              {line.map((token, tokenIndex) => (
                <span
                  key={tokenIndex}
                  className="code-token"
                  style={
                    ("htmlStyle" in token ? token.htmlStyle : undefined) as
                      CSSProperties | undefined
                  }
                >
                  {token.content}
                </span>
              ))}
            </span>
          </Fragment>
        ))}
      </code>
    </pre>
  );
}

export function Command({
  text,
  label = "Terminal",
  language = "bash",
}: {
  text: string;
  label?: string;
  language?: CodeLanguage;
}) {
  const Icon =
    language === "tsx" ? Code : language === "json" ? Braces : Terminal;
  return (
    <div className="code-box">
      <div className="code-label">
        <span>
          <Icon size={14} />
          {label}
        </span>
        <CopyButton text={text} />
      </div>
      <HighlightedCode text={text} language={language} />
    </div>
  );
}
