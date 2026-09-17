import React from 'react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CivicMapProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CivicMap({ className, children, ...props }: CivicMapProps) {
  return (
    <div className={cn("rounded-xl border border-civic-surface-secondary bg-civic-surface p-1", className)} {...props}>
      <div className="w-full h-[300px] bg-civic-elevated rounded-lg flex items-center justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMGQwZjEwIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMTMxNjE3IiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')]">
         <span className="text-civic-grey text-sm bg-civic-surface/80 px-4 py-2 rounded-md backdrop-blur-sm">{children || "Geospatial Map Placeholder"}</span>
      </div>
    </div>
  );
}
