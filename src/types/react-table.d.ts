import "@tanstack/react-table";
import { InputVariants } from "./inputs";

declare module "@tanstack/react-table" {
  interface ColumnMeta {
    width?: string;
    sticky?: boolean;
    variant: InputVariants;
  }
}