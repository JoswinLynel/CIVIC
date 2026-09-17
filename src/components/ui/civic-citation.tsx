import React from 'react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CivicCitationProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    number: number;
}

export function CivicCitation({ className, number, ...props }: CivicCitationProps) {
  return (
    <button className={cn("inline-flex items-center justify-center rounded-sm bg-civic-surface-secondary px-1.5 py-0.5 mx-0.5 text-[10px] font-mono text-civic-grey transition-colors hover:bg-civic-gold hover:text-civic-bg align-super", className)} {...props}>
      [{number}]
    </button>
  );
}
