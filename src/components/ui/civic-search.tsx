import React from 'react';
import { Search } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CivicSearchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function CivicSearch({ className, ...props }: CivicSearchProps) {
  return (
    <div className="relative flex items-center w-full">
      <Search className="absolute left-3 h-4 w-4 text-civic-grey" />
      <input
        className={cn(
          "flex h-10 w-full rounded-md border border-civic-surface-secondary bg-civic-surface px-3 py-2 text-sm pl-10",
          "placeholder:text-civic-grey text-civic-ivory",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-civic-gold focus-visible:border-civic-gold disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        placeholder="Search entities, articles, data..."
        {...props}
      />
    </div>
  );
}
