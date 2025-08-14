import { ColumnDef, getCoreRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";

interface Props<T> {
  data: T[];
  columns: ColumnDef<T>[];
  initialColumnOrder?: string[];
  initialSorting?: SortingState;
  initialColumnVisibility?: VisibilityState;
  enableGrouping?: boolean;
  enableExpanding?: boolean;
}

export const useTable = <T,>({
  data,
  columns,
  initialColumnOrder = columns.map((col) => col.id!),
  initialColumnVisibility = {},
  initialSorting = [],
}: Props<T>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return { table };
}