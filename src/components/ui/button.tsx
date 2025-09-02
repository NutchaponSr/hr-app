import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary dark:bg-white text-white dark:text-black shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-primary border-[1.25px] border-border bg-background hover:bg-accent dark:bg-input/30 dark:border-input dark:hover:bg-input/50 hover:shadow-xs",
        secondary: "bg-black/4 hover:bg-black/8 text-primary",
        ghost: "text-primary hover:bg-accent dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        outlineWarnning: "border-[1.25px] border-white hover:bg-primary/6",
        primary: "bg-marine text-white hover:bg-marine/90"
      },
      size: {
        default: "h-8 px-4 py-2 has-[>svg]:px-3",
        sm: "h-7 rounded gap-1.5 px-3 has-[>svg]:px-2.5",
        xs: "h-6 rounded gap-1 px-2 has-[>svg]:px-1.5 font-normal",
        lg: "h-10 rounded px-6 has-[>svg]:px-4 text-base",
        iconSm: "size-7 text-muted",
        iconXs: "size-6 text-muted",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
