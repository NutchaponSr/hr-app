import { IconType } from "react-icons";
import { GoHash } from "react-icons/go";
import { FiLoader } from "react-icons/fi";
import { BsCheckSquareFill, BsLockFill, BsTextLeft } from "react-icons/bs";

export const inputVariants = ["action", "main", "numeric", "text", "select"] as const;

export type InputVariants = typeof inputVariants[number];

export const inputIcons: Record<InputVariants, IconType> = {
  action: BsCheckSquareFill,
  main: BsLockFill,
  numeric: GoHash,
  text: BsTextLeft,
  select: FiLoader,
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