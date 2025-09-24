import { IconType } from "react-icons";
import { GoHash } from "react-icons/go";
import { FiLoader } from "react-icons/fi";
import { BsTextLeft } from "react-icons/bs";

export const inputVariants = ["string", "numeric", "text", "select", "dropdown"] as const;

export type InputVariants = typeof inputVariants[number];

export const inputIcons: Record<InputVariants, IconType> = {
  string: BsTextLeft,
  numeric: GoHash,
  text: BsTextLeft,
  select: FiLoader,
  dropdown: FiLoader,
}

export type SelectInput = {
  options: Array<{ 
    key: string; 
    label: string; 
  }>;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}