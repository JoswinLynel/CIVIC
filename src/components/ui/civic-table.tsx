import React from 'react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CivicTableProps extends React.HTMLAttributes<HTMLTableElement> {}

export function CivicTable({ className, ...props }: CivicTableProps) {
  return (
    <div className="w-full overflow-auto rounded-lg border border-civic-surface-secondary bg-civic-surface">
      <table className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  );
}

export function CivicTableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("[&_tr]:border-b border-civic-surface-secondary bg-civic-surface-secondary/50", className)} {...props} />;
}

export function CivicTableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function CivicTableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("border-b border-civic-surface-secondary transition-colors hover:bg-civic-surface-secondary/50 data-[state=selected]:bg-civic-surface-secondary", className)} {...props} />;
}

export function CivicTableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn("h-10 px-4 text-left align-middle font-medium text-civic-grey [&:has([role=checkbox])]:pr-0", className)} {...props} />;
}

export function CivicTableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0 text-civic-ivory", className)} {...props} />;
}
