import React from 'react';
import { AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CivicErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    description: string;
}

export function CivicErrorState({ className, title = "System Error", description, children, ...props }: CivicErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center rounded-xl border border-civic-red-alert/30 bg-civic-red-alert/5", className)} {...props}>
      <div className="mb-4 rounded-full bg-civic-red-alert/10 p-4 border border-civic-red-alert/20 text-civic-red-alert">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-civic-red-alert">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-civic-grey leading-relaxed">
        {description}
      </p>
      {children}
    </div>
  );
}
