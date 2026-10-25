import type { ComponentProps } from "react";

/** The shared overtrue open-ring mark. */
export function BrandMark(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 64 64"
      width="28"
      height="28"
      fill="none"
      color="#244cff"
      data-brand-mark=""
      aria-hidden="true"
      {...props}
    >
      <path
        d="M44 26a15 15 0 1 1-7-8"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <circle cx="47" cy="16" r="5" fill="var(--brand-dot, #8da5ff)" />
    </svg>
  );
}
