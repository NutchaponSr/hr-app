import { 
  ColumnDef, 
  getCoreRowModel,
  getSortedRowModel,
  SortingState, 
  useReactTable, 
  VisibilityState 
} from "@tanstack/react-table";
import { useState } from "react";

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
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialColumnVisibility);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
    },
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
  });

  return { table };
}