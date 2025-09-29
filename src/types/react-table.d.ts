import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta {
    width?: string;
    sticky?: boolean;
  }

  interface TableMeta<TData extends RowData> {
    rowHeights?: Record<string, { input: number; output: number }>;
  }

  interface ColumnSort {
    desc: boolean;
    id: string;
    icon?: LucideIcon;
  }
}