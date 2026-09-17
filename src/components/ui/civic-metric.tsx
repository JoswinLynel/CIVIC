import * as React from "react"
import { cn } from "@/lib/utils"

interface CivicMetricProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  trend?: "up" | "down" | "neutral"
  trendValue?: string
}

export function CivicMetric({ label, value, trend, trendValue, className, ...props }: CivicMetricProps) {
  return (
    <div className={cn("flex flex-col space-y-1", className)} {...props}>
      <span className="text-xs font-medium text-civic-grey uppercase tracking-wider">{label}</span>
      <div className="flex items-baseline space-x-2">
        <span className="text-2xl font-semibold text-civic-ivory">{value}</span>
        {trend && trendValue && (
          <span
            className={cn(
              "text-xs font-medium",
              trend === "up" && "text-civic-green-bright",
              trend === "down" && "text-civic-red-alert",
              trend === "neutral" && "text-civic-grey"
            )}
          >
            {trend === "up" && "↑"}
            {trend === "down" && "↓"}
            {trend === "neutral" && "–"}
            {trendValue}
          </span>
        )}
      </div>
    </div>
  )
}
