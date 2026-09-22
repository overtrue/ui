import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"

const socialVariants = cva("", {
  variants: {
    brand: {
      facebook: "bg-[#1877f2] text-white hover:bg-[#1877f2]/90 border-transparent",
      twitter: "bg-[#1da1f2] text-white hover:bg-[#1da1f2]/90 border-transparent",
      x: "bg-[#000] text-white hover:bg-black/90 border-transparent",
      linkedin: "bg-[#0a66c2] text-white hover:bg-[#0a66c2]/90 border-transparent",
      google: "bg-[#dc4e41] text-white hover:bg-[#dc4e41]/90 border-transparent",
      youtube: "bg-[#ff0000] text-white hover:bg-[#ff0000]/90 border-transparent",
      github: "bg-[#181717] text-white hover:bg-[#181717]/90 border-transparent",
      instagram: "bg-[#e4405f] text-white hover:bg-[#e4405f]/90 border-transparent",
      dribbble: "bg-[#ea4c89] text-white hover:bg-[#ea4c89]/90 border-transparent",
      overtrue: "bg-primary text-primary-foreground hover:bg-primary/90 border-transparent",
    },
  },
  defaultVariants: { brand: "overtrue" },
})

// Brand hex lives only in this social-brand map (exception documented in spec:
// social brand colors are not overtrue/ui theme tokens). Layout still uses shadcn Button.

export interface SocialButtonProps
  extends Omit<ButtonProps, "variant">,
    VariantProps<typeof socialVariants> {}

export function SocialButton({ brand = "overtrue", className, children, ...props }: SocialButtonProps) {
  return (
    <Button
      variant="default"
      className={cn(socialVariants({ brand }), className)}
      {...props}
    >
      {children}
    </Button>
  )
}
