import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-[background-color,box-shadow,color] duration-200 outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_2px_8px_-2px_oklch(0.74_0.19_48/40%)] hover:bg-primary/92 hover:shadow-[0_0_0_1px_oklch(1_0_0/0.22),0_4px_12px_-2px_oklch(0.74_0.19_48/50%)] active:bg-primary/85",
        outline:
          "border-border/80 bg-surface shadow-[0_2px_8px_-4px_oklch(0_0_0/30%)] hover:bg-surface-elevated hover:text-foreground hover:shadow-[0_0_0_1px_oklch(0.74_0.19_48/0.4),0_2px_8px_-4px_oklch(0_0_0/35%)] aria-expanded:bg-surface-elevated aria-expanded:text-foreground dark:bg-surface/60 dark:hover:bg-surface-elevated",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[0_2px_8px_-4px_oklch(0_0_0/25%)] hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_6%)] hover:shadow-[0_0_0_1px_oklch(1_0_0/0.1),0_2px_8px_-4px_oklch(0_0_0/30%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted/80 hover:text-foreground aria-expanded:bg-muted/80 aria-expanded:text-foreground",
        destructive:
          "bg-destructive/12 text-destructive hover:bg-destructive/20 hover:shadow-[0_0_0_1px_oklch(0.62_0.22_25/0.35)] focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "min-h-11 h-11 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 gap-1 rounded-lg px-2.5 text-xs in-data-[slot=button-group]:rounded-xl has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "min-h-9 h-9 gap-1.5 rounded-xl px-3 text-[0.8125rem] in-data-[slot=button-group]:rounded-xl has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "min-h-12 h-12 gap-2 px-5 text-base has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-11 rounded-xl",
        "icon-xs":
          "size-7 rounded-lg in-data-[slot=button-group]:rounded-xl [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-9 rounded-xl in-data-[slot=button-group]:rounded-xl",
        "icon-lg": "size-12 rounded-xl",
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
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
