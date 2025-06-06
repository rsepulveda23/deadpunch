
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-deadpunch-red text-white shadow-md hover:bg-deadpunch-red-hover hover:translate-y-[-2px] hover:scale-105 hover:shadow-lg hover:ring-2 hover:ring-deadpunch-red/30 active:translate-y-0",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 hover:translate-y-[-2px] hover:scale-105 hover:shadow-lg hover:ring-2 hover:ring-white/30 active:translate-y-0",
        outline:
          "border-2 border-gray-800 bg-gray-900 text-white shadow-sm hover:bg-gray-800 hover:text-deadpunch-red hover:translate-y-[-2px] hover:scale-105 hover:shadow-md hover:border-deadpunch-red active:translate-y-0",
        secondary:
          "bg-deadpunch-gray text-white shadow-md hover:bg-deadpunch-gray/80 hover:translate-y-[-2px] hover:scale-105 hover:shadow-lg hover:ring-2 hover:ring-deadpunch-red/20 active:translate-y-0",
        ghost: "text-white hover:bg-gray-900 hover:text-deadpunch-red hover:translate-y-[-1px] hover:scale-105 hover:ring-1 hover:ring-deadpunch-red/20 active:translate-y-0",
        link: "text-deadpunch-red underline-offset-4 hover:underline hover:translate-y-[-1px] hover:text-deadpunch-red-hover active:translate-y-0",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-full px-4",
        lg: "h-11 rounded-full px-10",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
