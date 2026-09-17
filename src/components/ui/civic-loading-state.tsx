import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CivicLoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
    message?: string;
}

export function CivicLoadingState({ className, message = "Processing data...", ...props }: CivicLoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)} {...props}>
      <Loader2 className="h-8 w-8 animate-spin text-civic-gold mb-4" />
      <p className="text-sm font-medium text-civic-grey animate-pulse">
        {message}
      </p>
    </div>
  );
}
