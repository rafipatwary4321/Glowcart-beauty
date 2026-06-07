"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type AdminTableColumn<T> = {
  key: string;
  header: string;
  className?: string;
  cell: (row: T) => React.ReactNode;
};

type AdminDataTableProps<T> = {
  columns: AdminTableColumn<T>[];
  data: T[];
  emptyMessage?: string;
  className?: string;
};

export function AdminDataTable<T extends { id: string }>({
  columns,
  data,
  emptyMessage = "No records found.",
  className,
}: AdminDataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 bg-card px-6 py-12 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border/60 bg-card", className)}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              {columns.map((column) => (
                <TableCell key={column.key} className={column.className}>
                  {column.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function AdminStatusBadge({
  label,
  variant = "outline",
}: {
  label: string;
  variant?: "default" | "outline" | "destructive";
}) {
  return (
    <Badge variant={variant} className="capitalize">
      {label}
    </Badge>
  );
}

export function AdminTableActions({
  onEdit,
  onDelete,
  editHref,
}: {
  onEdit?: () => void;
  onDelete?: () => void;
  editHref?: string;
}) {
  return (
    <div className="flex items-center gap-1">
      {editHref ? (
        <Button asChild variant="ghost" size="sm" className="h-8 rounded-full px-3">
          <Link href={editHref}>Edit</Link>
        </Button>
      ) : onEdit ? (
        <Button variant="ghost" size="sm" className="h-8 rounded-full px-3" onClick={onEdit}>
          Edit
        </Button>
      ) : null}
      {onDelete ? (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 rounded-full px-3 text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          Delete
        </Button>
      ) : null}
    </div>
  );
}

export function adminFormatCurrency(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}
