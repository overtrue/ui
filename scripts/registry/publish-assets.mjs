/** Hosted demo imagery in installable registry bundles. Preview sources stay on /assets/. */
export function publishHostedAssets(content, origin) {
  const base = origin.replace(/\/$/, "");
  return content.replaceAll("/assets/", `${base}/assets/`);
}