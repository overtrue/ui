import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Quiet surfaces and a single primary action, driven by the active theme. */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        workspace: "",
        default:
          "border border-primary bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "border border-destructive bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
        outline:
          "border border-input bg-card text-foreground shadow-xs hover:bg-muted",
        secondary:
          "border border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "border border-transparent bg-transparent text-foreground hover:bg-muted",
        link: "border-transparent text-primary underline-offset-4 hover:underline",
        success:
          "border border-transparent bg-[#16a34a] text-white hover:bg-[#15803d]",
        warning:
          "border border-transparent bg-[#f76707] text-white hover:bg-[#ea580c]",
        info: "border border-transparent bg-[#4299e1] text-white hover:bg-[#3380c9]",
        dark: "border border-transparent bg-[#111827] text-white hover:bg-[#1f2937]",
        light:
          "border border-input bg-card text-foreground shadow-xs hover:bg-muted",
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
