import { InputVariants } from "@/types/inputs";

import { SelectionBadge } from "@/components/selection-badge";

interface Props {
  value: string;
  variant: InputVariants;
  options?: Array<{ key: string; label: string; }>;
} 

export const InputDisplay = ({
  value,
  variant,
  options,
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
      if (!value) return "Empty";
      const selectedOption = options?.find(opt => opt.key === value);
      return <SelectionBadge label={selectedOption?.label || value} />;
  }
}