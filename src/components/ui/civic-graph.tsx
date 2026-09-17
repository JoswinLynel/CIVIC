import React from 'react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CivicGraphProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CivicGraph({ className, children, ...props }: CivicGraphProps) {
  return (
    <div className={cn("rounded-xl border border-civic-surface-secondary bg-civic-surface p-1", className)} {...props}>
      <div className="w-full h-[300px] bg-civic-elevated rounded-lg flex items-center justify-center relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-civic-gold via-civic-surface to-civic-bg" />
         <span className="text-civic-grey text-sm z-10">{children || "Entity Graph Visualization Placeholder"}</span>
      </div>
    </div>
  );
}
