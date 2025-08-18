import { 
  FieldValues, 
  Path, 
  UseFormRegister, 
  UseFormWatch 
} from "react-hook-form";
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

export interface BaseInputFieldProps<T extends FieldValues> {
  name: Path<T>;
  watch: UseFormWatch<T>;
  register: UseFormRegister<T>;
}

export interface TextInputProps<T extends FieldValues> extends BaseInputFieldProps<T> {
  variant: "text";
}

export interface NumericInputProps<T extends FieldValues> extends BaseInputFieldProps<T> {
  variant: "numeric";
}

export interface SelectInputProps<T extends FieldValues> extends BaseInputFieldProps<T> {
  variant: "select";
  value: string;
  options: {
    key: string;
    label: string;
    onSelect: (value: string) => void;
  }[];
  onClear: () => void;
}

export type InputProviderProps<T extends FieldValues> =
  | TextInputProps<T>
  | NumericInputProps<T>
  | SelectInputProps<T>;