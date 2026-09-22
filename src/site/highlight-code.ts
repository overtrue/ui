import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import tsx from "shiki/langs/tsx.mjs";
import json from "shiki/langs/json.mjs";
import bash from "shiki/langs/bash.mjs";
import light from "shiki/themes/github-light.mjs";
import dark from "shiki/themes/github-dark.mjs";

export type CodeLanguage = "tsx" | "json" | "bash";

const highlighter = createHighlighterCore({
  langs: [tsx, json, bash],
  themes: [light, dark],
  engine: createJavaScriptRegexEngine(),
});

export async function highlightCode(text: string, language: CodeLanguage) {
  return (await highlighter).codeToTokens(text, {
    lang: language,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  }).tokens;
}
