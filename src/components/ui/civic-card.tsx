import * as React from "react"
import { cn } from "@/lib/utils"

const CivicCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-md border border-civic-elevated bg-civic-surface text-civic-ivory shadow-sm transition-all",
      className
    )}
    {...props}
  />
))
CivicCard.displayName = "CivicCard"

const CivicCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6 border-b border-civic-elevated/50", className)} {...props} />
))
CivicCardHeader.displayName = "CivicCardHeader"

const CivicCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight text-civic-ivory", className)} {...props} />
))
CivicCardTitle.displayName = "CivicCardTitle"

const CivicCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6", className)} {...props} />
))
CivicCardContent.displayName = "CivicCardContent"

export { CivicCard, CivicCardHeader, CivicCardTitle, CivicCardContent }
