import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/lib/utils";

/** overtrue/ui .btn — primary #066fd1, padding 9px 16px, radius 6px, weight 500, height 40px */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        workspace: "",
        default:
          "border border-transparent bg-[#066fd1] text-[#f9fafb] hover:bg-[#0560b5]",
        destructive:
          "border border-transparent bg-[#dc2626] text-white hover:bg-[#b91c1c]",
        outline: "border border-input bg-card text-foreground hover:bg-muted",
        secondary:
          "border border-transparent bg-[#6b7280] text-white hover:bg-[#4b5563]",
        ghost:
          "border border-transparent bg-transparent text-foreground hover:bg-muted",
        link: "border-transparent text-[#066fd1] underline-offset-4 hover:underline",
        success:
          "border border-transparent bg-[#16a34a] text-white hover:bg-[#15803d]",
        warning:
          "border border-transparent bg-[#f76707] text-white hover:bg-[#ea580c]",
        info: "border border-transparent bg-[#4299e1] text-white hover:bg-[#3380c9]",
        dark: "border border-transparent bg-[#111827] text-white hover:bg-[#1f2937]",
        light: "border border-input bg-card text-foreground hover:bg-muted",
      },
      size: {
        /* overtrue/ui measured: 40px height, 9px 16px padding */
        default: "h-10 px-4 py-[9px] text-sm",
        sm: "h-8 rounded-md px-3 py-[5px] text-xs",
        lg: "h-11 px-5 py-[11px]",
        xl: "h-12 px-6 py-[13px] text-base",
        icon: "h-9 w-9 p-0",
        "icon-sm": "h-8 w-8 p-0",
      },
      shape: {
        default: "rounded-md",
        pill: "rounded-full",
        square: "rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, shape, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        data-slot="button"
        className={
          variant === "workspace"
            ? className
            : cn(buttonVariants({ variant, size, shape, className }))
        }
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
