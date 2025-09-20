import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta {
    width?: string;
    sticky?: boolean;
  }

  interface ColumnSort {
    desc: boolean;
    id: string;
    icon?: LucideIcon;
  }
}