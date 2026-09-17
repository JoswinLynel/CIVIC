import React from 'react';
import { Sparkles } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CivicAIResponseProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CivicAIResponse({ className, children, ...props }: CivicAIResponseProps) {
  return (
    <div className={cn("relative rounded-xl border border-civic-gold/20 bg-gradient-to-b from-civic-surface to-civic-bg p-6", className)} {...props}>
      <div className="absolute top-0 right-0 -mt-3 -mr-3 rounded-full bg-civic-gold/10 p-2 border border-civic-gold/20">
         <Sparkles className="h-4 w-4 text-civic-gold" />
      </div>
      <div className="text-civic-ivory text-sm leading-relaxed prose prose-invert max-w-none prose-a:text-civic-gold">
        {children}
      </div>
    </div>
  );
}
