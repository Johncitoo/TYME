// src/components/ui/table.tsx
import React from 'react';

export function Table(props: React.HTMLAttributes<HTMLTableElement>) {
  return <table {...props} />;
}
export function TableHeader(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...props} />;
}
export function TableBody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />;
}
export function TableRow(props: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr {...props} />;
}
export function TableCell(props: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td {...props} />;
}
export function TableHeadCell(props: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th {...props} />;
}
