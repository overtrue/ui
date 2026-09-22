import type { ComponentProps } from "react";

/** An open u with the detached dot of an i. */
export function BrandMark(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 32 32"
      width="28"
      height="28"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M5 5h5v14a6 6 0 0 0 12 0v-6h5v6a11 11 0 0 1-22 0V5Z"
        fill="currentColor"
      />
      <rect
        x="22"
        y="4"
        width="5"
        height="5"
        rx="1"
        fill="var(--color-primary, #066fd1)"
      />
    </svg>
  );
}
