
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-deadpunch-gray-dark bg-deadpunch-dark px-3 py-2 text-base text-white ring-offset-deadpunch-dark file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white placeholder:text-deadpunch-gray-light/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deadpunch-red focus-visible:ring-offset-2 focus-visible:border-deadpunch-red disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
