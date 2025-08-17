import { FieldValues } from "react-hook-form";

import { InputVariants } from "@/types/inputs";

import { SelectionBadge } from "@/components/selection-badge";

interface Props {
  value: string;
  variant: InputVariants;
} 

export const InputDisplay = ({
  value,
  variant,
}: Props) => {
  switch (variant) {
    case "numeric":
      return value 
      ? `${Number(value).toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      })} %` : "Empty";
    case "text":
      return value ? value : "Empty";
    case "select":
      return value ? <SelectionBadge label={value} />: "Empty";
  }
}