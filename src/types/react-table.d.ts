import "@tanstack/react-table";

import { InputVariants } from "@/types/inputs";

declare module "@tanstack/react-table" {
  interface ColumnMeta {
    width?: string;
    sticky?: boolean;
    variant: InputVariants;
  }
}