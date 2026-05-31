"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
  type RowSelectionState,
  type SortingState,
  type Table as TanstackTable,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";

const INTERACTIVE_SELECTOR =
  "button, input, select, textarea, a, label, [role=menuitem], [role=checkbox], [role=combobox], [data-slot=dropdown-menu-trigger]";

export type DataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  onRowClick?: (row: TData) => void;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (state: RowSelectionState) => void;
  sorting?: SortingState;
  onSortingChange?: (state: SortingState) => void;
  getRowId?: (row: TData, index: number) => string;
  className?: string;
  /** Set to `false` to hide the column-header row entirely. */
  showHeader?: boolean;
};

export function DataTable<TData>({
  data,
  columns,
  isLoading,
  emptyState,
  onRowClick,
  rowSelection,
  onRowSelectionChange,
  sorting,
  onSortingChange,
  getRowId,
  className,
  showHeader = true,
}: DataTableProps<TData>) {
  const [internalSorting, setInternalSorting] = React.useState<SortingState>(
    [],
  );
  const [internalSelection, setInternalSelection] =
    React.useState<RowSelectionState>({});

  const isSelectionControlled = rowSelection !== undefined;
  const isSortingControlled = sorting !== undefined;

  const table: TanstackTable<TData> = useReactTable<TData>({
    data,
    columns,
    state: {
      sorting: isSortingControlled ? sorting : internalSorting,
      rowSelection: isSelectionControlled ? rowSelection : internalSelection,
    },
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater(isSortingControlled ? sorting! : internalSorting)
          : updater;
      if (isSortingControlled) {
        onSortingChange?.(next);
      } else {
        setInternalSorting(next);
      }
    },
    onRowSelectionChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater(isSelectionControlled ? rowSelection! : internalSelection)
          : updater;
      if (isSelectionControlled) {
        onRowSelectionChange?.(next);
      } else {
        setInternalSelection(next);
      }
    },
    getRowId,
  });

  const handleRowClick = React.useCallback(
    (row: Row<TData>) => (event: React.MouseEvent<HTMLTableRowElement>) => {
      if (!onRowClick) return;
      const target = event.target as HTMLElement | null;
      if (target && target.closest(INTERACTIVE_SELECTOR)) return;
      onRowClick(row.original);
    },
    [onRowClick],
  );

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;
  const colCount = columns.length;
  const hasRowClick = typeof onRowClick === "function";

  return (
    <div className={cn("adm-card overflow-hidden", className)}>
      <table className="adm-table">
        {showHeader ? (
          <thead>
            {headerGroups.map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => {
                  const size = header.getSize();
                  const explicitSize = size !== 150 ? size : undefined;
                  return (
                    <th
                      key={header.id}
                      style={
                        explicitSize !== undefined
                          ? { width: explicitSize }
                          : undefined
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
        ) : null}
        <tbody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={`skeleton-${rowIndex}`}>
                {Array.from({ length: Math.max(1, colCount) }).map(
                  (__, cellIndex) => (
                    <td key={`skeleton-${rowIndex}-${cellIndex}`}>
                      <div className="h-3.5 w-full max-w-[160px] animate-pulse rounded bg-paper-2" />
                    </td>
                  ),
                )}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={Math.max(1, colCount)}
                style={{ padding: 0, borderBottom: 0 }}
              >
                {emptyState ?? (
                  <div className="adm-empty">
                    <div className="font-mono text-[12px]">Aucun résultat.</div>
                  </div>
                )}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  row.getIsSelected() ? "is-selected" : undefined,
                  hasRowClick && "cursor-pointer",
                )}
                onClick={hasRowClick ? handleRowClick(row) : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
