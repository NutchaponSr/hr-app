import "@tanstack/react-table";

import { InputVariants } from "@/types/inputs";
import { CalculationType } from "./caluculation";

declare module "@tanstack/react-table" {
  interface ColumnMeta {
    width?: string;
    sticky?: boolean;
    variant: InputVariants;
    calculateType?: CalculationType;
  }
}