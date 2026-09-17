import React from 'react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CivicTimelineProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CivicTimeline({ className, children, ...props }: CivicTimelineProps) {
  return (
    <div className={cn("relative border-l border-civic-surface-secondary ml-3 space-y-8 py-2", className)} {...props}>
      {children}
    </div>
  );
}

export function CivicTimelineItem({ className, date, title, children, ...props }: { date: string, title: string } & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("relative pl-6", className)} {...props}>
            <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-civic-surface-secondary ring-4 ring-civic-surface" />
            <div className="flex flex-col space-y-1">
                <span className="text-xs font-medium text-civic-gold">{date}</span>
                <h4 className="text-sm font-semibold text-civic-ivory">{title}</h4>
                <div className="text-sm text-civic-grey">
                    {children}
                </div>
            </div>
        </div>
    );
}
