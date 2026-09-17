import React from 'react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CivicBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'alert' | 'success' | 'outline' | 'neutral';
}

export function CivicBadge({ className, variant = 'default', ...props }: CivicBadgeProps) {
  const variants = {
    default: "bg-civic-surface-secondary text-civic-ivory border-transparent",
    alert: "bg-civic-red-alert/20 text-civic-red-alert border-civic-red-alert/30",
    success: "bg-civic-green-emerald/20 text-civic-green-bright border-civic-green-emerald/30",
    outline: "bg-transparent text-civic-grey border-civic-surface-secondary",
    neutral: "bg-civic-elevated text-civic-grey border-transparent",
  };

  return (
    <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", variants[variant], className)} {...props} />
  );
}
