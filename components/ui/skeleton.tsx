import * as React from "react"
import { cn } from "@/lib/utils"


export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-orange-100 via-red-100 to-green-100",
        className
      )}
      {...props}
    />
  )
}
