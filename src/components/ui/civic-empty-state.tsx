import React from 'react';
import { Database } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CivicEmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    description: string;
    icon?: React.ReactNode;
}

export function CivicEmptyState({ className, title, description, icon, children, ...props }: CivicEmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-civic-surface-secondary bg-civic-surface/50", className)} {...props}>
      <div className="mb-4 rounded-full bg-civic-elevated p-4 border border-civic-surface-secondary text-civic-grey">
        {icon || <Database className="h-6 w-6" />}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-civic-ivory">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-civic-grey leading-relaxed">
        {description}
      </p>
      {children}
    </div>
  );
}
